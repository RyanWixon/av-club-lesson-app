import { Devices } from './enums'
import { useState, useEffect, useRef } from 'react'

import webcam from './assets/webcam.png'
import laptop from './assets/laptop.png'
import videoCamera from './assets/videoCamera.png'
import captureCard from './assets/captureCard.png'
import headset from './assets/headset.png'
import audioMixer from './assets/audioMixer.png'

import './DevicePanel.css'

// represents the options at the left side of the screen which allow the user to drag and drop different devices into the workspace
function DevicePanel({ workspaceState, ghostDeviceState, setGhostDeviceState }) {

    // #### STATE, REFS AND EFFECTS ####
    const devices = [
        <DeviceButton key={0} deviceType={Devices.WebCamera} image={webcam} width={100} height={105} workspaceState={workspaceState} 
            ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>,
        <DeviceButton key={1} deviceType={Devices.Laptop} image={laptop} width={110} height={90} workspaceState={workspaceState}
            ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>,
        <DeviceButton key={2} deviceType={Devices.VideoCamera} image={videoCamera} width={100} height={80} workspaceState={workspaceState} 
            ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>,
        <DeviceButton key={3} deviceType={Devices.CaptureCard} image={captureCard} width={100} height={60} workspaceState={workspaceState}
            ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>,
        <DeviceButton key={4} deviceType={Devices.USBHeadset} image={headset} width={100} height={85} workspaceState={workspaceState}
            ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>,
        <DeviceButton key={5} deviceType={Devices.AudioMixer} image={audioMixer} width={100} height={90} workspaceState={workspaceState}
            ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>
    ];
    const [devicesBounds, setDevicesBounds] = useState([0, devices.length]);
    const devicePanelRef = useRef(null);
    useEffect(() => {
        const devicePanelElement = devicePanelRef.current;
        const observer = new ResizeObserver(() => {
            updateDeviceBounds(devicePanelElement.clientHeight);
        });

        if (devicePanelElement) observer.observe(devicePanelElement);
        return () => observer.disconnect();
    }, []);

    // called when the user clicks the up button to display more devices
    const moveDevicesUp = () => {
        if (devicesBounds[0] > 0) {
            setDevicesBounds([devicesBounds[0] - 1, devicesBounds[1] - 1]);
        }
    }

    // called when the user clicks the down button to display more devices
    const moveDevicesDown = () => {
        if (devicesBounds[1] < devices.length) {
            setDevicesBounds([devicesBounds[0] + 1, devicesBounds[1] + 1]);
        }
    }

    // called when the workspace size is changed, so that the appropriate number of devices
    // to display at once can be recalculated
    const updateDeviceBounds = (availableHeight) => {
        setDevicesBounds(prev => {
            let devicesAllowed = Math.floor(Math.min((availableHeight - 50) / 75, devices.length));
            let newBounds = [...prev];

            while ((newBounds[1] - newBounds[0]) > devicesAllowed) {
                newBounds[1]--;
            }
            while ((newBounds[1] - newBounds[0]) < devicesAllowed) {
                if (newBounds[1] < devices.length) {
                    newBounds[1]++;
                } else if (newBounds[0] > 0) {
                    newBounds[0]--;
                } else {
                    break;
                }
            }
            
            // only return something new if the number of devices actually needs to change; if we don't,
            // react will get stuck in an infinite loop trying to update things
            if (newBounds[0] !== prev[0] || newBounds[1] !== prev[1]) {
                return newBounds;
            }
            return prev;
        });
    }

    // #### SOURCE ####
    return (
        <div className='device-panel' ref={devicePanelRef}>
            <div className='device-panel-devices'>
                <button className={devicesBounds[0] !== 0 ? 'scroll-button' : 'scroll-button-unusable'} onClick={moveDevicesUp}>↑</button>
                {devices.slice(devicesBounds[0], devicesBounds[1])}
                <button className={devicesBounds[1] !== devices.length ? 'scroll-button' : 'scroll-button-unusable'} onClick={moveDevicesDown}>↓</button>
            </div>
        </div>
    )
}

// represents a single device which may be dragged and dropped into the workspace
function DeviceButton({ deviceType, image, width, height, workspaceState, ghostDeviceState, setGhostDeviceState }) {
    
    // #### SOURCE ####
    if (workspaceState.deviceCounts[image] < 3) {
        
        // there are less than 3 devices of this type on the workspace; this button can be used
        return (
            <button 
                className={!ghostDeviceState.visible ? 'device-button' : 'device-button-ghost-held'} 
                onMouseDown={(e) => setGhostDeviceState({
                    deviceType: deviceType,
                    image: {src: image, width: width, height: height},
                    position: {x: e.clientX - width / 2, y: e.clientY - height / 2},
                    visible: true
                })}
            >
                <img className='device-button-icon' src={image} draggable='false'></img>
            </button>
        ) 
    }

    // there are 3 devices of this type on the workspace; this button may not be used until one of them is removed
    return (
        <button 
            className='device-button-unusable'
        >
            <img className='device-button-icon' src={image} draggable='false'></img>
        </button>
    )
}

export default DevicePanel;