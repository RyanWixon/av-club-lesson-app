import { useState, useEffect, useRef } from 'react'

import laptop from './assets/laptop.png'
import captureCard from './assets/captureCard.png'
import videoCamera from './assets/videoCamera.png'
import headset from './assets/headset.png'
import audioMixer from './assets/audioMixer.png'

import './DevicePanel.css'

function DevicePanel({ workspaceState, ghostDeviceState, setGhostDeviceState }) {

    const devices = [
        <DeviceButton key={0} image={videoCamera} width={100} height={80} workspaceState={workspaceState} 
            ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>,
        <DeviceButton key={1} image={captureCard} width={100} height={60} workspaceState={workspaceState}
            ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>,
        <DeviceButton key={2} image={laptop} width={110} height={90} workspaceState={workspaceState}
            ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>,
        <DeviceButton key={3} image={headset} width={100} height={85} workspaceState={workspaceState}
            ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>,
        <DeviceButton key={4} image={audioMixer} width={100} height={90} workspaceState={workspaceState}
            ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState}/>
    ];
    const [devicesBounds, setDevicesBounds] = useState([0, devices.length]);
    const devicePanelRef = useRef(null);

    const moveDevicesUp = () => {
        if (devicesBounds[0] > 0) {
            setDevicesBounds([devicesBounds[0] - 1, devicesBounds[1] - 1]);
        }
    }

    const moveDevicesDown = () => {
        if (devicesBounds[1] < devices.length) {
            setDevicesBounds([devicesBounds[0] + 1, devicesBounds[1] + 1]);
        }
    }

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
            
            if (newBounds[0] !== prev[0] || newBounds[1] !== prev[1]) {
                return newBounds;
            }
            return prev;
        });
    }

    // #### SOURCE ####
    useEffect(() => {
        const devicePanelElement = devicePanelRef.current;
        const observer = new ResizeObserver(() => {
            updateDeviceBounds(devicePanelElement.clientHeight);
        });

        if (devicePanelElement) observer.observe(devicePanelElement);
        return () => observer.disconnect();
    }, []);

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

function DeviceButton({ image, width, height, workspaceState, ghostDeviceState, setGhostDeviceState }) {
    
    // #### SOURCE ####
    if (workspaceState.deviceCounts[image] < 3) {
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
    return (
        <button 
            className='device-button-unusable'
        >
            <img className='device-button-icon' src={image} draggable='false'></img>
        </button>
    )
}

export default DevicePanel;