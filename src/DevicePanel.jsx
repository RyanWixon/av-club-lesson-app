import laptop from './assets/laptop.png'
import captureCard from './assets/captureCard.png'
import videoCamera from './assets/videoCamera.png'
import headset from './assets/headset.png'
import audioMixer from './assets/audioMixer.png'

import './DevicePanel.css'

function DevicePanel({ appState, addDevice, ghostDeviceState, setGhostDeviceState }) {
    
    // #### SOURCE ####
    return (
        <div className='device-panel'>
            <div className='device-panel-devices'>
                <DeviceButton image={videoCamera} width={100} height={80} 
                              ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>
                <DeviceButton image={captureCard} width={100} height={60}
                              ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>
                <DeviceButton image={laptop} width={100} height={90}
                              ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>
                <DeviceButton image={headset} width={100} height={85}
                              ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>
                <DeviceButton image={audioMixer} width={100} height={90}
                              ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>
            </div>
        </div>
    )
}

function DeviceButton({ image, width, height, ghostDeviceState, setGhostDeviceState }) {
    
    // #### SOURCE ####
    return (
        <button 
            className={!ghostDeviceState.visible ? 'device-button' : 'device-button-ghost-held'} 
            onMouseDown={(e) => setGhostDeviceState({
                image: {src: image, width: width, height: height},
                position: {x: e.clientX - width / 2, y: e.clientY - height / 2},
                visible: true
            })}
        >
            <img className='device-button-icon' src={image} draggable='false'></img>
        </button>
    )
}

export default DevicePanel;