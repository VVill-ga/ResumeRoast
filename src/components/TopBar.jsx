import { useCookies } from 'react-cookie'
import {NavLink, useLocation} from 'react-router-dom'
import {css, keyframes} from '@emotion/react'
import { SlHome, SlSocialGithub, SlUser, SlLogin } from "react-icons/sl";

const backgroundPhase = keyframes`
    0% {
        filter: hue-rotate(0deg)
    }
    100% {
        filter: hue-rotate(360deg)
    }
`;
const style = css`
    background: linear-gradient(90deg, hsl(0 30% 70% / 1), hsl(45 30% 70% / 1));
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 0.25em black;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1;
    animation: ${backgroundPhase} 10s linear infinite;

    h1{
        font-size: 2em;
        margin: 0;
    }
    a{
        color: black;
        width: 4.5em;
        height: 4.5em;
    }
    svg{
        width: 2.5em;
        height: 2.5em;
        margin: 1em;
    }
`;

export default function TopBar(){
    const [ cookies, setCookie ] = useCookies(["authCode"]);
    const location = useLocation();

    const dropboxParams = new URLSearchParams({
        client_id: import.meta.env.VITE_DROPBOX_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_BASE_URL+"login",
        response_type: "code"
    });
    const dropboxLoginURL = `https://www.dropbox.com/oauth2/authorize?${dropboxParams.toString()}`;

    return(
        <header id='top' css={style}>
            {location.pathname == "/" ?
                <a href="https://github.com/VVill-ga/resumeroast">
                    <SlSocialGithub/>
                </a>
                :
                <NavLink to="/">
                    <SlHome />
                </NavLink>
            }
            <h1>Resume Roast</h1>
            {cookies.authCode ?
                <NavLink to="/me">
                    <SlUser/>
                </NavLink> 
                : 
                <a href={dropboxLoginURL}>
                    <SlLogin/>
                </a>
            }
        </header>
    );
}