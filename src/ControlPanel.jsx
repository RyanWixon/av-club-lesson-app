import { useState } from 'react'
import { Modes } from './enums'
import './ControlPanel.css'

import dragIcon from './assets/dragIcon.png'
import connectIcon from './assets/connectIcon.png'

function ControlPanel({ appState, setAppState }) {
    
    // #### SOURCE ####
    return (
        <div className='control-panel'>
            <ModeButton image={dragIcon} setToMode={Modes.Dragging} appState={appState} setAppState={setAppState}/>
            <ModeButton image={connectIcon} setToMode={Modes.Connecting} appState={appState} setAppState={setAppState}/>
        </div>
    )
}

function ModeButton({ image, setToMode, appState, setAppState }) {

    // #### SOURCE ####
    return (
        <button 
            className={`mode-button ${appState.mode === setToMode ? 'active' : ''}`} 
            onClick={() => {
                setAppState(prev => ({ ...prev, mode: setToMode }));
            }}
        >
            <img src={image} className='mode-button-icon'></img>
        </button>
    )
}

export default ControlPanel