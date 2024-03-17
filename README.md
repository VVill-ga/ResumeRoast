# Resume Roast

A React.js powered Webapp using the [Dropbox API](https://www.dropbox.com/developers)
and [Disqus](https://disqus.com) for getting feedback on your resume. Upload
your resume to Dropbox using our OAuth API frontend, then leave feedback on
other people's resumes using the Disqus thread linked to each document.

## Configuration and Hosting

:page_facing_up: **.env.local**
```toml
DROPBOX_CLIENT_SECRET="{Get this from Dropbox}" # Or from Will if you are on the team
VITE_DROPBOX_CLIENT_ID="{This is also from Dropbox}" # Or from Will if you are on the team
VITE_OAUTH_REDIRECT_URL="{Your absolute path to /login (Like http://localhost:5173/login)}"
```
:runner: **Run these in parallel!**
```bash
npm run api # Runs the backend server on port 8000
npm run dev # Runs the webserver, and proxies /api to :8000
```
## Routes

<details>
<summary> Website Routes </summary>

#### :house: /

#### :key: /login

#### :orange_book: /r/

#### :smiley: /me

#### :scroll: /about

</details>

---

<details>
<summary> API Routes </summary>

#### :coin: /api/tokenExchange

```json
"method": "POST",
"body": {
    "code": "{Authentication Code granted by Dropbox}"
}
```
<center><p align="center">:arrow_down:</p></center>

```json
"status": 200,
"body": {
    "msg": "OK!"
}
```

#### :arrow_up: /api/upload

```json
"method": "POST",
"body": "{Byte array of PDF file}"
"header": {
    "Auth-Code": "{Authentication Code granted by Dropbox}",
    "Content-Type": "application/octet-stream",
}
```
<center><p align="center">:arrow_down:</p></center>

```json
"status": 200,
"body": {
    "link": "{Dropbox link to pdf file}",
    "version": "{Number of pdfs associated with this user}"
}
```

#### :books: /api/allpdfs

```json
"method": "GET",
"body": {}
```
<center><p align="center">:arrow_down:</p></center>

```json
"status": 200,
"body": [
    {
        "id": "{Dropbox User ID}", 
        "link": "{Link to this user's latest resume}"
    }
]
```

#### :green_book: /api/pdf

```json
"method": "GET",
"body": {},
"queryParameters": {
    "id": "{String used to identify user}",
    "version": "[OPTIONAL] {Number used to identify older resume version}"
}
```
<center><p align="center">:arrow_down:</p></center>

```json
"status": 200,
"body": {
    "link": "{Link to pdf file}",
}
```

</details>