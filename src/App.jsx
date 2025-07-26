import { useState } from 'react'
import { Modes, Edges } from './enums'
import './App.css'

import webcam from './assets/webcam.png'
import laptop from './assets/laptop.png'
import videoCamera from './assets/videoCamera.png'
import captureCard from './assets/captureCard.png'
import headset from './assets/headset.png'
import audioMixer from './assets/audioMixer.png'

import Workspace from './Workspace'
import DevicePanel from './DevicePanel'
import ControlPanel from './ControlPanel'
import RightPanel from './RightPanel'

import levelData from './LevelData.json'

// top level component for the app
function App() {

  // #### STATES ####
  const [appState, setAppState] = useState({
    mode: Modes.Dragging,
    edge: Edges.HDMI,
    levelNum: 0,
    levelSolution: levelData.levels[0].solution,
    levelSolved: false,
    playingWinVideo: false
  });
  const [workspaceState, setWorkspaceState] = useState({
    devices: [],
    deviceCounts: {
      [webcam]: 0,
      [laptop]: 0,
      [videoCamera]: 0,
      [captureCard]: 0,
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
      {appState.playingWinVideo && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0)', // or 0.0 if fully transparent
            zIndex: 9999
          }}
        />
      )}
      <Workspace
        appState={appState}
        setAppState={setAppState}
        workspaceState={workspaceState} 
        setWorkspaceState={setWorkspaceState}
        ghostDeviceState={ghostDeviceState}
      />
      <DevicePanel 
        workspaceState={workspaceState} 
        ghostDeviceState={ghostDeviceState} 
        setGhostDeviceState={setGhostDeviceState} 
      />
      <ControlPanel appState={appState} setAppState={setAppState} />
      <GhostDevice ghostDeviceState={ghostDeviceState} />
      <RightPanel appState={appState} setAppState={setAppState} />
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
