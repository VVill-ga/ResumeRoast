import React from "react";
import { useState } from "react";
import TopBar from "./TopBar";
import { DiscussionEmbed } from "disqus-react";
import { useParams } from "react-router-dom";

import "./ResumeView.css"
import './displayPDF.css'

export default function ResumeView(){
    const {id} = useParams()
    const [pdfLink, setPdfLink] = useState("")
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
                    <div>
                        <a 
                            href={pdfLink} 
                            class="dropbox-embed"
                        ></a>
                    </div>
                </div>
                <div className="column">
                    <DiscussionEmbed
                        shortname={import.meta.env.VITE_DISQUS_SHORTNAME}
                        config={
                            {
                                url: window.location.host + window.location.pathname,
                                identifier: id,
                                title: "Resume Comments",
                                language: 'en_US'
                            }
                        }
                    />
                </div>
            </div>
            <script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="0hl4iasbytbli9s"></script>
        </>
    )
}
