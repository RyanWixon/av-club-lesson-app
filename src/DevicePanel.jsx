import videoCamera from './assets/videoCamera.png'
import laptop from './assets/laptop.png'

import './DevicePanel.css'

function DevicePanel({ appState, addDevice }) {
    
    // #### SOURCE ####
    return (
        <div className='device-panel'>
            <div>
                <DeviceButton image={videoCamera} addDevice={addDevice} />
                <DeviceButton image={laptop} addDevice={addDevice} />
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