import React from "react";
import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import { DiscussionEmbed } from "disqus-react";
import { useParams } from "react-router-dom";


export default function ResumeView(){
    // Add dropbox viewer
    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://www.dropbox.com/static/api/2/dropins.js";
        script.async = true;
        script.id = "dropboxjs";
        script.setAttribute("data-app-key", "0hl4iasbytbli9s");
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const {id} = useParams()
    const [pdfLink, setPdfLink] = useState("")

    // Get PDF link
    const fetchData = async () => {
        console.log(useParams())
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

    return(
        <>
            <TopBar />
            <div className="ResumeViewContainer">
                <div className="column">
                    <a href={pdfLink} class="dropbox-embed"></a>
                </div>
                <div className="column">
                    <DiscussionEmbed
                        shortname={import.meta.env.VITE_DISQUS_SHORTNAME}
                        config={
                            {
                                url: window.location.origin + window.location.pathname,
                                identifier: id,
                                title: "Resume Comments",
                                language: 'en_US'
                            }
                        }
                    />
                </div>
            </div>
        </>
    )
}