import {css} from '@emotion/react'
import { SlTarget } from "react-icons/sl";

export default function Loading(){
    const style = css`
        transform: rotate(${((new Date).getTime()/1000) % 360}deg);
    `
    return(
        <SlTarget css={style}/>
    )
}