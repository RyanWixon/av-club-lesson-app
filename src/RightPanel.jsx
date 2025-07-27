import colorBars from './assets/colorBars.png'
import winVideo from './assets/sports.mp4'

import levelData from './LevelData.json'

import './RightPanel.css'

// represents the content which appears on the right hand side of the image - currently the stream feed and instruction text
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

// represents the "video" that plays when a level is completed correctly as well as associated containers
function StreamFeed({ appState, setAppState }) {

    // #### HELPER FUNCTIONS ####
    const getInnerStreamContent = () => {

        // return the colored bars image if we're not currently trying to play the video; if we are, 
        // return that instead with a lambda which allows it to turn itself off and update state accordingly
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