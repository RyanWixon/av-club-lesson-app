import laptop from './assets/laptop.png'
import captureCard from './assets/captureCard.png'
import videoCamera from './assets/videoCamera.png'
import headset from './assets/headset.png'
import audioMixer from './assets/audioMixer.png'

import './DevicePanel.css'

function DevicePanel({ appState, addDevice }) {
    
    // #### SOURCE ####
    return (
        <div className='device-panel'>
            <div className='device-panel-devices'>
                <DeviceButton image={videoCamera} addDevice={addDevice} />
                <DeviceButton image={captureCard} addDevice={addDevice} />
                <DeviceButton image={laptop} addDevice={addDevice} />
                <DeviceButton image={headset} addDevice={addDevice} />
                <DeviceButton image={audioMixer} addDevice={addDevice} />
            </div>
        </div>
    )
}

function DeviceButton({ image, addDevice }) {
    
    // #### SOURCE ####
    return (
        <button 
            className='device-button' 
            onClick={() => {addDevice(image, 100, 100)}}
        >
            <img src={image} className='device-button-icon'></img>
        </button>
    )
}

export default DevicePanel