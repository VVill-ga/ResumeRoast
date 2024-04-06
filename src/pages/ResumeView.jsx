import React from "react";
import { useState, useEffect } from "react";
import { DiscussionEmbed } from "disqus-react";
import { useLocation, useParams } from "react-router-dom";
import { css } from "@emotion/react";
import { useCookies } from "react-cookie";


export default function ResumeView(){
    const location = useLocation();
    const [cookies] = useCookies(["id"]);
    const {id} = location.pathname == '/me'? cookies : useParams();
    console.log(location.pathname, id, cookies.id);
    const [pdfLink, setPdfLink] = useState("");
    const style = css`

    `
    // Get PDF link
    const fetchData = async () => {
        try {
            const response = await fetch("/api/pdf?id=" + id);
            const data = await response.json();
            const pdfLink  = data.link;
            setPdfLink(pdfLink);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };
    fetchData();

    // Add dropbox viewer
    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://www.dropbox.com/static/api/2/dropins.js";
        script.async = true;
        script.id = "dropboxjs";
        script.setAttribute("data-app-key", import.meta.env.VITE_DROPBOX_CLIENT_ID);
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return(
        <main css={style}>
            <a href={pdfLink} class="dropbox-embed"></a>
            <DiscussionEmbed
                shortname={import.meta.env.VITE_DISQUS_SHORTNAME}
                config={
                    {
                        url: import.meta.env.VITE_BASE_URL+"r/"+id,
                        identifier: id,
                        title: "Resume Comments",
                        language: 'en_US'
                    }
                }
            />
        </main>
    )
}