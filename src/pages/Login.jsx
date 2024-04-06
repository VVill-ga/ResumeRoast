import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import Loading from '../components/Loading'

export default function Login() {
    const [ error, setError ] = useState("")
    const [ loading, setLoading ] = useState(true)
    const [ searchParams, setSearchParams ] = useSearchParams()
    const [ cookies, setCookie ] = useCookies(["authCode", "id"])
    const authCode = searchParams.get("code")
    
    useEffect(() => {
        async function exchangeForAccessToken(code) {
            const res = await fetch("/api/tokenExchange", {
                method: "POST",
                body: JSON.stringify({ code }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (res.status !== 200) {
                setError("Error exchanging code for token");
            } else {
                let expires = new Date();
                expires.setTime(expires.getTime() + (14400000)); // Token lasts 4 hours
                let resBody = await res.json();
                setCookie('authCode', authCode, {path: '/', expires});
                setCookie('id', resBody.id, {path: '/', expires});
            }
            setLoading(false);
        }
        if (authCode) {
            exchangeForAccessToken(authCode)
        }
    }, [authCode, setCookie])

    if(loading)
        return <Loading/>
    else if(error)
        return <p>Error: {error}. Try pushing the login button again.</p>
    else
        return <Navigate to="/"/>
}