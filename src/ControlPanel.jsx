import { Modes, Edges } from './enums'
import dragIcon from './assets/dragIcon.png'
import connectIcon from './assets/connectIcon.png'
import hdmi from './assets/hdmi.png'
import xlr from './assets/xlr.png'
import usb from './assets/usb.png'
import ethernet from './assets/ethernet.png'
import wifi from './assets/wifi.png'

import './ControlPanel.css'

// represents the options at the bottom of the screen which allow the user to manipulate how they interact with the workspace
function ControlPanel({ appState, setAppState }) {
    
    // #### SOURCE ####
    return (
        <div className='control-panel'>
            <div className='control-panel-mode'>
                <ModeButton image={dragIcon} setToMode={Modes.Dragging} appState={appState} setAppState={setAppState}/>
                <ModeButton image={connectIcon} setToMode={Modes.Connecting} appState={appState} setAppState={setAppState}/>
            </div>
            <div className='control-panel-edge'>
                <EdgeButton image={hdmi} setToEdge={Edges.HDMI} appState={appState} setAppState={setAppState}/>
                <EdgeButton image={xlr} setToEdge={Edges.XLR} appState={appState} setAppState={setAppState}/>
                <EdgeButton image={usb} setToEdge={Edges.USB} appState={appState} setAppState={setAppState}/>
                <EdgeButton image={ethernet} setToEdge={Edges.Ethernet} appState={appState} setAppState={setAppState}/>
                <EdgeButton image={wifi} setToEdge={Edges.WiFi} appState={appState} setAppState={setAppState}/>
            </div>
        </div>
    )
}

// represents a button controlling the type of mode the app is in (moving devices or creating edges)
function ModeButton({ image, setToMode, appState, setAppState }) {

    // #### SOURCE ####
    return (
        <button 
            className={`control-button ${appState.mode === setToMode ? 'active' : ''}`} 
            onClick={() => {
                setAppState(prev => ({ ...prev, mode: setToMode }));
            }}
        >
            <img src={image} className='control-button-icon'></img>
        </button>
    )
}

// represents a button controlling the type of edge which will be drawn
function EdgeButton({ image, setToEdge, appState, setAppState }) {

    // #### SOURCE ####
    return (
        <button
            className={`control-button ${appState.edge === setToEdge ? 'active' : ''}`}
            onClick={() => {
                setAppState(prev => ({ ...prev, edge: setToEdge }))
            }}
        >
            <img src={image} className='control-button-icon'></img>
        </button>
    )
}

export default ControlPanel