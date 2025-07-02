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
                <DeviceButton image={videoCamera} addDevice={addDevice} width={100} height={80}/>
                <DeviceButton image={captureCard} addDevice={addDevice} width={100} height={60}/>
                <DeviceButton image={laptop} addDevice={addDevice} width={100} height={90}/>
                <DeviceButton image={headset} addDevice={addDevice} width={100} height={85}/>
                <DeviceButton image={audioMixer} addDevice={addDevice} width={100} height={90}/>
            </div>
        </div>
    )
}

function DeviceButton({ image, addDevice, width, height }) {
    
    // #### SOURCE ####
    return (
        <button 
            className='device-button' 
            onClick={() => {addDevice(image, width, height)}}
        >
            <img src={image} className='device-button-icon'></img>
        </button>
    )
}

export default DevicePanel