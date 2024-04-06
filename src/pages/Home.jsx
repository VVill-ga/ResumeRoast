import {NavLink} from 'react-router-dom'

import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import { css } from '@emotion/react';

export default function Home() {
    const [pdfs, setPdfs] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState('');

    const cardCSS = css`
    
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
        <main className = "layout">
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