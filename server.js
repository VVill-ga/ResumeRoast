import express from 'express'
import path from 'path';
import dotenv from 'dotenv'
import fs from 'fs'
import bodyParser from 'body-parser'
import pdf2img from 'pdf-img-convert'
import sqlite3 from 'sqlite3'

dotenv.config({ path: ".env.local" })

const client_id = process.env.VITE_DROPBOX_CLIENT_ID
const client_secret = process.env.DROPBOX_CLIENT_SECRET
const redirect_uri = process.env.VITE_OAUTH_REDIRECT_URL

const app = express()
const port = 8000
let db = new sqlite3.Database('./links.db', (err) => {if(err)console.log("Error loading database: " + err)});
if(!fs.existsSync("./links.db")){
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS data (id TEXT PRIMARY KEY, name TEXT, links TEXT)")
    })
}
let tokens = {};
if(!fs.existsSync("./thumbnails"))
    fs.mkdirSync("./thumbnails")

app.use(express.json())
app.use(bodyParser.raw({type: 'application/octet-stream', limit: '150mb'}))
app.use(express.static(path.join(process.cwd(), 'dist')));

app.post("/api/tokenExchange", async (req, res) => {
    const { code } = req.body
    if (!code) {
        res.status(400).send({ err: "Must specify auth code" })
    } else {
        const baseUrl = "https://api.dropbox.com/oauth2/token"
        const queryParams= new URLSearchParams({
            code: code,
            grant_type: "authorization_code",
            redirect_uri: redirect_uri,
            client_id: client_id,
            client_secret: client_secret,
        })
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const url = `${baseUrl}?${queryParams.toString()}`
        const dropboxRes = await fetch(url, fetchOptions);

        const dropboxResBody = await dropboxRes.json()

        if (dropboxResBody.access_token) {
            tokens[code] = {}
            tokens[code].token = dropboxResBody.access_token
            tokens[code].id    = dropboxResBody.account_id
            // Delete token association when the token expires
            setTimeout(()=>{delete tokens[code]}, dropboxResBody.expires_in * 1000)
            res.status(200).send({id: dropboxResBody.account_id})
        } else {
            res.status(401).send({
                err: dropboxResBody.error_description
            })
        }
    }
})

app.post("/api/upload", async (req, res) => {
    const code = req.headers['auth-code']
    const pdf = new Uint8Array(req.body)
    if(!code || !tokens[code]){
        return res.status(400).send({err: "Must specify auth code"})
    } else if(!pdf){
        return res.status(400).send({err: "Must include pdf data"})
    } else {
        const url = "https://content.dropboxapi.com/2/files/upload"
        const args = {
            "autorename": true,
            "mode": "add",
            "mute": false,
            "path": "/resume.pdf",
            "strict_conflict": false
        }
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + tokens[code].token,
                'Dropbox-API-Arg': JSON.stringify(args),
                'Content-Type': 'application/octet-stream'
            },
            body: pdf
        }
        const dropboxRes = await fetch(url, fetchOptions);
        const dropboxResBody = await dropboxRes.json()
        console.log(dropboxResBody)
        if(!dropboxResBody){
            return res.status(500).send({err: "Error uploading pdf to Dropbox"})
        }
        
        // Path in dropboxResBody.path_lower... Or dropboxResBody.path_display
        // Get Shareable Link!
        const shareURL = "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings"
        const shareData = {
            "path": dropboxResBody.path_lower,
            "settings": {
                "access": "viewer",
                "allow_download": true,
                "audience": "public",
                "requested_visibility": "public"
            }
        }
        const shareOptions = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + tokens[code].token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shareData)
        }
        const shareRes= await fetch(shareURL, shareOptions);
        const shareResBody = await shareRes.json()
        let version = -1;
        //If the pdf is not changed, the response body won't have a URL
        if(!shareResBody.url)
            return res.status(208).send()
        else{
            //Render a new thumbnail! && Update link database
            console.log("Checking " + "thumbnails/"+tokens[code].id.split(':')[1]+".png")
            if(fs.existsSync("thumbnails/"+tokens[code].id.split(':')[1]+".png"))
                fs.unlinkSync("thumbnails/"+tokens[code].id.split(':')[1]+".png")
            const image = await pdf2img.convert(pdf, {
                width: 850,
                page_numbers: [1]
            })
            fs.writeFile(
                "thumbnails/" + tokens[code].id.split(':')[1] + ".png", 
                image[0], 
                function (error) {
                    if (error)
                        console.error("Error: " + error)
                    else
                        console.log("Successfully wrote new thumbnail image")
                }
            )

            // Update database
            db.serialize(() => {
                db.get("SELECT links FROM data WHERE id=?", [tokens[code].id], (err, entry) => {
                    if(!err){
                        if(!entry || !entry.links)
                            db.run("INSERT INTO data (id, links) VALUES (?, ?)", tokens[code].id, shareResBody.url)
                        else
                            db.run("UPDATE data SET links=? WHERE id=?", [shareResBody.url + entry.links ? ',' + entry.links : "", tokens[code].id]);
                    }
                    else
                        console.log("Error updating links database: " + err);

                    version = (entry && entry.links)? entry.links.split(",").length + 1 : 1;
                    return res.status(200).json({link: shareResBody.url, version: version})
                })
            })
        }
    }
});
app.get("/api/allpdfs", async (req, res) => {
    let links = []
    db.serialize(() => {
        db.get("SELECT * FROM data", (err, rows) => {
            if(rows && rows.links) //Rows is a single pdf
                links.push({id: rows.id, link: rows.links.split(",")[0]});
            else if(rows)
                for(let row of rows)
                    links.push({id: row.id, link: row.links.split(",")[0]});
            res.status(links? 200:204).send(links)
        })
    })
});
app.get("/api/pdf", async (req, res) => {
    const { id, version } = req.query
    let link = "";
    db.serialize(() => {
        db.get("SELECT links FROM data WHERE id = ?", id, (err, pdfs) => {
            if(err || !pdfs || !pdfs.links || !pdfs.links.split(",")[version||0]){
                console.log("Error finding pdf version " + (version||0) + " for user " + id);
                res.status(404).send()
            }
            else
                res.status(200).send({link: pdfs.links.split(",")[version||0]})
        })
    })
});
app.get("/api/thumbnail", async (req, res) => {
    const {id} = req.query
    if(fs.existsSync("thumbnails/"+id.split(':')[1]+".png"))
        res.status(200).contentType("image/png").send(fs.readFileSync("thumbnails/"+id.split(':')[1]+".png"))
    else
        res.status(404).send()
})
app.get("*", async (req, res) => {
    res.sendFile("dist/index.html", { root : process.cwd()});
})

app.listen(port, () => console.log(`API server listening on port ${port}`))
