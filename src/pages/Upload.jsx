import { useState, useCallback } from 'react'
import { useCookies } from 'react-cookie'
import { useDropzone } from 'react-dropzone'
import { NavLink } from 'react-router-dom'
import { css } from '@emotion/react'

import Loading from '../components/Loading'
import ResumeView from './ResumeView'

export default function Upload() {
    const [ error, setError ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const [ success, setSuccess ] = useState(false)
    const [ cookies, setCookie ] = useCookies(["authCode", "id"])

    const style = css`
    `
    
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        const reader = new FileReader();
        reader.onabort = () => console.log("File Reading was aborted")
        reader.onerror = () => console.log("File Reading has failed")
        reader.onload = () => {
            const bytes = new Uint8Array(reader.result)
            async function uploadPDF(bytes) {
                setLoading(true)
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: bytes,
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "Auth-Code": cookies.authCode
                    }
                })
                if (res.status !== 200) {
                    setError("Error uploading PDF to Dropbox")
                } else {
                    console.log("PDF Generated at: " + res.body.link)
                    console.log("Version: " + res.body.version)
                    setSuccess(true)
                }
                setLoading(false)
            }
            if (bytes) {
                uploadPDF(bytes)
            }
        }
        reader.readAsArrayBuffer(file);
    }, [cookies.authCode])

    if(loading)
        return <Loading />

    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        onDrop
    })

    return (
        <main css={style}>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>
                    { success && <NavLink to = "/"> File uploaded! </NavLink>}
                    {!success &&  error && "Error uploading resume, please try again"}
                    {!success && !error && "Drag 'n' drop your resume here, or click to select the file"}
                </p>
            </div>
            {cookies.id && <ResumeView />}
        </main>
    )
}