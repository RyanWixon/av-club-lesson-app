import { act, useState } from 'react'

import colorBars from './assets/colorBars.png'
import placeholder from './assets/sports.gif'

import './RightPanel.css'

function RightPanel() {

    // #### SOURCE ####
    return (
        <div className="right-panel">
            <StreamFeed />
        </div>
    )
}

function StreamFeed() {

    const [active, setActive] = useState(false);
    
    // #### SOURCE ####
    return (
        <>
            <div className="stream-feed">
                <div className="inner-stream-feed">
                    <img src={active ? placeholder : colorBars} style={{width: "100%", height: "100%"}}></img>
                </div>
            </div>
            <button onClick={() => {setActive(!active)}}>Test the stream</button>
        </>


    )
}

export default RightPanel;