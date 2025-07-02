import { useState } from 'react'
import { Modes, Edges } from './enums'
import './App.css'

import videoCamera from './assets/videoCamera.png'
import captureCard from './assets/captureCard.png'
import laptop from './assets/laptop.png'
import headset from './assets/headset.png'
import audioMixer from './assets/audioMixer.png'

import Workspace from './Workspace'
import DevicePanel from './DevicePanel'
import ControlPanel from './ControlPanel'

// top level component for the app
function App() {

  // #### STATES ####
  const [appState, setAppState] = useState({
    mode: Modes.Dragging,
    edge: Edges.HDMI
  });
  const [workspaceState, setWorkspaceState] = useState({
    devices: [],
    deviceCounts: {
      [videoCamera]: 0,
      [captureCard]: 0,
      [laptop]: 0,
      [headset]: 0,
      [audioMixer]: 0
    },
    edges: [],
    size: { width: 0, height: 0 },
    ghostEdge: { position: { x1: 0, x2: 0, y1: 0, y2: 0 }, visible: false },
    edgeStartID: -1
  });
  const [ghostDeviceState, setGhostDeviceState] = useState({
    image: {src: undefined, width: 0, height: 0},
    position: {x: 0, y: 0},
    visible: false
  })

  // #### HELPER FUNCTIONS ####
  const addDevice = (path, width, height, x, y) => {
    setWorkspaceState(prev => {
      let nextID = 0;
      const existingIDs = new Set(prev.devices.map(device => device.id));
      while (existingIDs.has(nextID)) nextID++;
      return {
        ...prev,
        devices: [ ...prev.devices, {
          id: nextID,
          image: { src: path, width: width, height: height },
          position: { x: x, y: y },
          offset: { x: 0, y: 0 },
          dragging: false
        }],
        deviceCounts: { ...prev.deviceCounts, [path]: prev.deviceCounts[path] + 1 || 0}
      };
    });
  };

  // #### SOURCE ####
  return (
    <div className='app-container'
      onMouseMove={(e) => {
        if (ghostDeviceState.visible) {
          setGhostDeviceState(prev => ({ ...prev, position: {x: e.clientX - prev.image.width / 2, y: e.clientY - prev.image.height / 2}}))
        }
      }}
      onMouseUp={() => {
        setGhostDeviceState(prev => ({ ...prev, visible: false }))
      }}
    >
      <Workspace
        appState={appState}
        setAppState={setAppState} 
        workspaceState={workspaceState} 
        setWorkspaceState={setWorkspaceState}
        ghostDeviceState={ghostDeviceState}
        addDevice={addDevice}
      />
      <DevicePanel workspaceState={workspaceState} ghostDeviceState={ghostDeviceState} setGhostDeviceState={setGhostDeviceState} />
      <ControlPanel appState={appState} setAppState={setAppState} />
      <GhostDevice ghostDeviceState={ghostDeviceState} />
    </div>
  )
}

function GhostDevice({ ghostDeviceState }) {

  // #### SOURCE ####
  return ghostDeviceState.visible ? (
    <img
      className='ghost-device'
      src={ghostDeviceState.image.src}
      draggable={false}
      style={{
        width: ghostDeviceState.image.width,
        height: ghostDeviceState.image.height,
        left: ghostDeviceState.position.x,
        top: ghostDeviceState.position.y,
        position: 'absolute',
        cursor: 'grab',
        opacity: 0.33
      }}
    />
  ) : null;
}

export default App;
