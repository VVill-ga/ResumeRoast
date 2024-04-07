import {css, keyframes} from '@emotion/react'
import { SlTarget } from "react-icons/sl";

export default function Loading(){
    const rotate = keyframes`
        0% {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    `
    const style = css`
        width: 3em;
        height: 3em;
        color: #888;
        position: absolute;
        left: 50%;
        top: 50%;
        animation: ${rotate} 1s linear infinite;
    `
    return(
        <SlTarget css={style}/>
    )
}