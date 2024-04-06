import Will from '../imgs/will.jpg';
import Danny from '../imgs/danny.jpg';
import Michelle from '../imgs/michelle.jpg';
import Kerim from '../imgs/kerim.jpg';

export default function About() {
    return (
        <main>
            <h1>Meet The Resume Roast Team!</h1>
            <div>
                <div>
                    <img src={Will} alt="Picture of Will" />
                    <h2>Will Garrison</h2>
                    <p>Third Year in CS</p>
                    <p>Does not like the Dropbox API</p>
                </div>

                <div>
                    <img src={Danny} alt="Picture of Danny" />
                    <h2>Danny Nguyen</h2>
                    <p>Third Year in CS</p>
                    <p>Loves Tennis</p>
                </div>

                <div>
                    <img src={Michelle} alt="Picture of Michelle" />
                    <h2>Michelle Nguyen</h2>
                    <p>4th year Computer Science major</p>
                    <p>Focus in Web and Mobile Application Development</p>
                </div>

                <div>
                    <img src={Kerim} alt="Picture of Kerim" />
                    <h2>Kerim Semed</h2>
                    <p> Fifth Year in CS </p>
                    <p> Loves getting A's on group projects </p>
                </div>
            </div>
        </main>
    )
}
