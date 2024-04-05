# Resume Roast

A React.js powered Webapp using the [Dropbox OAuth API](https://www.dropbox.com/developers)
and [Disqus](https://disqus.com) for getting feedback on your resume. Upload
your resume to Dropbox using the app, then leave feedback on other users'
resumes using the Disqus thread linked to each document.

## Configuration and Hosting

:octocat: **> git clone**

:package: **> npm i**

:page_facing_up: **Create .env.local**
```toml
DROPBOX_CLIENT_SECRET="{Get this from Dropbox}"
VITE_DROPBOX_CLIENT_ID="{This is also from Dropbox}"
VITE_OAUTH_REDIRECT_URL="{Your absolute path to /login (Like http://localhost:5173/login)}"
VITE_DISQUS_SHORTNAME="{Get this from Disqus}"
```
:runner: **Run this command!**
```bash
npm run build && npm run host # Builds and runs the server on port 5173
```
## Routes

<details>
<summary> Website Routes </summary>

**:house: /**

**:key: /login**

**:orange_book: /r/**

**:smiley: /me**

**:scroll: /about**

</details>

---

<details>
<summary> API Routes </summary>

**:coin: /api/tokenExchange**

```json
"method": "POST",
"body": {
    "code": "{Authentication Code granted by Dropbox}"
}
```
<center><p align="center">:arrow_down:</p></center>

```json
"status": 200,
```

**:arrow_up: /api/upload**

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
"content-type": "application/json",
"body": {
    "link": "{Dropbox link to pdf file}",
    "version": "{Number of pdfs associated with this user}"
}
```

**:books: /api/allpdfs**

```json
"method": "GET",
```
<center><p align="center">:arrow_down:</p></center>

```json
"status": 200,
"content-type": "application/json",
"body": [
    {
        "id": "{Dropbox User ID}", 
        "link": "{Link to this user's latest resume}"
    }
]
```

**:green_book: /api/pdf**

```json
"method": "GET",
"queryParameters": {
    "id": "{Dropbox User ID}",
    "version": "[OPTIONAL] {Number used to identify older resume version}"
}
```
<center><p align="center">:arrow_down:</p></center>

```json
"status": 200,
"content-type": "application/json",
"body": {
    "link": "{Link to pdf file}",
}
```

**:camera: /api/thumbnail**

```json
"method": "GET",
"queryParameters": {
    "id": "{Dropbox User ID for pdf owner (used for caching)}"
}
```

<center><p align="center">:arrow_down:</p></center>

```json
"status": 200,
"content-type": "image/png",
"body": "{Thumbnail Image Data}"
```
</details>

## Data Storage

**:old_key: Dropbox Access Tokens**

Dropbox Access Tokens are only kept in runtime storage on the server.
They are kept in a variable `tokens` in `server.js`, and each one is
deleted every 4 hours as it expires according to Dropbox. Each access
token is paired with the authentication code used to generate it, so that
the server can identify each client. The structure of `tokens` is as so:
```json
{
    "{Dropbox Authentication Code}": {
        "token": "{Latest Dropbox Access Token for that User}",
        "id": "{Dropbox User ID}"
    }
}
```

**:chains: Public PDF Links**

An SQLite Database (`data.db`)is maintained to track pdf links for all users.
This database contains a single table called `data`, and each row contains a
Dropbox User ID which acts as the primary key `id`, the name associated with 
the Dropbox account, and a string of comma deliminated pdf links `links`, 
which is ordered such that the latest resume is in the front. 
```json
{
    "id": "{Dropbox User ID}",
    "name": "{Dropbox Username}",
    "links": "{pdfLink1,pdfLink2,pdfLink3...}"
}
```

**:framed_picture: PDF Thumbnail Images**

Upon each new resume upload, a thumbnail for the pdf is generated and stored
in `/thumbnails`. A thumbnail is only kept for the latest pdf generated for
each user. The thumbnail is named using the Dropbox User ID for the account,
minus the `dbid:` at the start, and in the `.png` format. The API route
`/api/thumbnail` handles removing the `dbid:` from the Dropbox User ID.
