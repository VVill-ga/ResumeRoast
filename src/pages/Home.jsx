import {NavLink} from 'react-router-dom'

import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import { css } from '@emotion/react';

export default function Home() {
    const [pdfs, setPdfs] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState('');

    const style = css`
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
    `
    const cardCSS = css`
        width: 20em;
        display: inline-block;
        margin: 1em;
        transition: 0.35s ease-in-out, transform 0.5s ease-in-out;
        transform-origin: center top;
        transform: scale(1.0);
        ::before {
            content: "";
            display: block;
            position: absolute;
            top: 5%;
            left: 5%;
            width: 90%;
            height: 90%;
            background: rgba(0, 0, 0, 0.9);
            box-shadow: 0 6px 12px 12px rgba(0, 0, 0, 0.7);
            transition: transform 0.35s ease-in-out, opacity 0.5s ease-in-out;
            z-index: -2;
        }
        :hover {
            transform-origin: top center;
            transform: scale(1.03);
            ::before {
                opacity: 0.6;
                transform: rotateX(7deg) translateY(-6px) scale(1.05);
            }
        }
        a{
            display: inline-block;
            width: 100%;
            height: 100%;

            img {
                width: 100%;
                height: 100%;
            }
        }

    `

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/allpdfs');
                if (!response.ok) {
                    throw new Error('Data could not be fetched!');
                }
                const data = await response.json();
                setPdfs(data); 
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []); // The empty array ensures this effect runs only once after initial render

    if (isLoading) 
        return <Loading />;
    if (error) 
        return <p>Error: {error}</p>;
    return (
        <main css={style}>
            {pdfs.map(pdf => (
                <div key = {pdf.id} css = {cardCSS}>
                    {pdfs && 
                        <NavLink to = {"/r/" + pdf.id}>
                            <img src = {"/api/thumbnail/?id=" + pdf.id} alt = "Resume Thumbnail" /> 
                        </NavLink>
                    }
                </div>
            ))}
        </main>
    )
}