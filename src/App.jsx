import { useState } from 'react'
import { Modes } from './enums'
import videoCamera from './assets/videoCamera.png'
import laptop from './assets/laptop.png'
import './App.css'

import Workspace from './Workspace'
import ControlPanel from './ControlPanel'

// top level component for the app
function App() {

  // #### STATES ####
  const [appState, setAppState] = useState({
    mode: Modes.Dragging
  });
  const [workspaceState, setWorkspaceState] = useState({
    devices: [],
    edges: [],
    size: { width: 0, height: 0 },
    ghostEdge: { position: { x1: 0, x2: 0, y1: 0, y2: 0 }, visible: false },
    edgeStartID: -1
  });

  // #### HELPER FUNCTIONS ####
  const addDevice = (path, sourceWidth, sourceHeight) => {
    setWorkspaceState(prev => {
      let nextID = 0;
      const existingIDs = new Set(prev.devices.map(device => device.id));
      while (existingIDs.has(nextID)) {
        nextID++;
      }
      return {
        ...prev,
        devices: [...prev.devices, {
          id: nextID,
          image: { src: path, width: sourceWidth, height: sourceHeight },
          position: { x: 50, y: 50 },
          offset: { x: 0, y: 0 },
          dragging: false
        }]
      };
    });
  };

  // #### SOURCE ####
  return (
    <>
      <Workspace
        appState={appState}
        setAppState={setAppState} 
        workspaceState={workspaceState} 
        setWorkspaceState={setWorkspaceState} 
      />
      <button onClick={() => addDevice(videoCamera, 100, 100)}>Add a new video camera</button>
      <button onClick={() => addDevice(laptop, 100, 100)}>Add a new laptop</button>
      <ControlPanel appState={appState} setAppState={setAppState} />
    </>
  )
}

export default App;
