import { useState } from 'react'

import colorBars from './assets/colorBars.png'
import winVideo from './assets/sports.mp4'

import levelData from './LevelData.json'

import './RightPanel.css'

function RightPanel({ appState, setAppState }) {

    // #### SOURCE ####
    return (
        <div className="right-panel">
            <StreamFeed appState={appState} setAppState={setAppState} />
            <div className="text-container" style={{ whiteSpace: "pre-line" }}>
                <h1 className="instruction-text">{levelData.levels[appState.levelNum].instructions}</h1>
            </div>
        </div>
    )
}

function StreamFeed({ appState, setAppState }) {

    const getInnerStreamContent = () => {
        if (appState.playingWinVideo) {
            return <video src={winVideo} autoPlay onEnded={() => setAppState(prev => ({ ...prev, playingWinVideo: false}))} style={{width: "100%", height: "100%"}}></video>;
        } 
        return <img src={colorBars} style={{width: "100%", height: "100%"}}></img>
    }
    
    // #### SOURCE ####
    return (
        <>
            <div className="stream-feed">
                <div className="inner-stream-feed">
                    {getInnerStreamContent()}
                </div>
            </div>
        </>
    )
}

export default RightPanel;