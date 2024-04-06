import { useCookies } from 'react-cookie'
import {NavLink, useLocation} from 'react-router-dom'
import {css} from '@emotion/react'
import { SlHome, SlSocialGithub, SlUser, SlLogin } from "react-icons/sl";

export default function TopBar(){
    const [ cookies, setCookie ] = useCookies(["authCode"]);
    const location = useLocation();
    const style = css`
        width: 100%;
        background: hsl(${((new Date).getTime()/10000) % 360}, 30%, 70%);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    `;

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