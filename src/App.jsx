import { useState } from 'react'
import { Modes, Edges } from './enums'
import './App.css'

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
      <DevicePanel appState={appState} addDevice={addDevice}/>
      <ControlPanel appState={appState} setAppState={setAppState} />
    </>
  )
}

export default App;
