import { useState, useEffect, useRef } from 'react'
import { Modes, Edges } from './enums'

import deleteIcon from './assets/deleteIcon.png'

import levelData from './LevelData.json'
import checkSolution from './SolutionValidation'

import './Workspace.css'

// component representing and handling the workspace, in which devices can be placed, moved, and connected
function Workspace({ appState, setAppState, workspaceState, setWorkspaceState, ghostDeviceState}) {
  
  // #### STATES, REFS AND EFFECTS ####
  const { mode } = appState;
  const { devices, edges, size, ghostEdge } = workspaceState;
  const workspaceRef = useRef(null);

  // if the current board is the solution, trigger the win video
  useEffect(() => {
    if (checkSolution(workspaceState, appState.levelSolution)) {
        setAppState(prev => ({
          ...prev,
          levelSolved: true,
          playingWinVideo: true
        }));
    }
  }, [devices, edges]);

  // if the win video has finished playing, go to the next level
  useEffect(() => {
    if (appState.levelSolved && !appState.playingWinVideo) {
        setAppState(prev => ({
          ...prev,
          levelNum: prev.levelNum + 1,
          levelSolution: levelData.levels[prev.levelNum + 1].solution,
          levelSolved: false
        }));
    }
  }, [appState.playingWinVideo])

  // #### TOP LEVEL EVENT HANDLERS ####
  const handleMouseMove = (e) => {
    if (mode === Modes.Dragging) moveDraggingDevices(e);
    if (mode === Modes.Connecting) moveGhostEdge(e);
  }

  const handleMouseUp1 = (e) => {
    if (mode === Modes.Dragging) dropAllDevices();
    if (mode === Modes.Connecting) setWorkspaceState(prev => ({ ...prev, ghostEdge: {...prev.ghostEdge, visible: false}, edgeStartID: -1 }));
    
    // add new device if it was being dragged, and update counts
    if (ghostDeviceState.visible) {
      const bounds = workspaceRef.current.getBoundingClientRect();
      let newX = Math.max(0 + ghostDeviceState.image.width * 0.1, 
                 Math.min(bounds.right - bounds.left - ghostDeviceState.image.width * 1.1, e.clientX - bounds.left - ghostDeviceState.image.width / 2));
      let newY = Math.max(0 + ghostDeviceState.image.height * 0.1, 
                 Math.min(bounds.bottom - bounds.top - ghostDeviceState.image.height * 1.1, e.clientY - bounds.top - ghostDeviceState.image.height / 2));
      addDevice(ghostDeviceState.image.src, ghostDeviceState.deviceType, ghostDeviceState.image.width, ghostDeviceState.image.height, newX, newY);
    }
  }

  const handleMouseLeave = () => {
    if (mode === Modes.Dragging) dropAllDevices();
    if (mode === Modes.Connecting) setWorkspaceState(prev => ({ ...prev, ghostEdge: { ...prev.ghostEdge, visible: false } }));
  }

  // #### HELPER FUNCTIONS ####
  const addDevice = (path, deviceType, width, height, x, y) => {
    setWorkspaceState(prev => {
      let nextID = 0;
      const existingIDs = new Set(prev.devices.map(device => device.id));
      while (existingIDs.has(nextID)) nextID++;
      
      const retval = {
        ...prev,
        devices: [ ...prev.devices, {
          deviceType: deviceType, 
          id: nextID,
          image: { src: path, width: width, height: height },
          position: { x: x, y: y },
          offset: { x: 0, y: 0 },
          dragging: false
        }],
        deviceCounts: { ...prev.deviceCounts, [path]: prev.deviceCounts[path] + 1 || 0}
      };

      // if (checkSolution(retval, appState.levelSolution)) {
      //   setAppState(prev => ({ ...appState, levelNum: prev.levelNum + 1, levelSolution: levelData.levels[prev.levelNum + 1].solution}));
      //   console.log('add device iterated level');
      // }
      return retval;
    });
  };

  const removeDevice = (id, image) => {
    setWorkspaceState(prev => {
      const retval = {
        ...prev,
          devices: prev.devices.filter(device => device.id !== id),
          deviceCounts: { ...prev.deviceCounts, [image]: prev.deviceCounts[image] - 1 },
          edges: prev.edges.filter(edge => edge.deviceid1 !== id && edge.deviceid2 !== id)
      }

      // if (checkSolution(retval, appState.levelSolution)) {
      //   setAppState(prev => ({ ...appState, levelNum: prev.levelNum + 1, levelSolution: levelData.levels[prev.levelNum + 1].solution}));
      //   console.log('remove device iterated level');
      // }
      return retval;
    });
  }

  const moveDraggingDevices = (e) => {
    setWorkspaceState(prev => ({
      ...prev,
      devices: prev.devices.map(device => {
        if (!device.dragging) return device;
        let newX = Math.max(0 + device.image.width * 0.1, Math.min(e.clientX - device.offset.x, size.width - (device.image.width * 1.1)));
        let newY = Math.max(0 + device.image.height * 0.1, Math.min(e.clientY - device.offset.y, size.height - (device.image.height * 1.1)));
        return { ...device, position: { x: newX, y: newY } };
      })
    }));
  };

  const dropAllDevices = () => {
    setWorkspaceState(prev => ({
      ...prev,
      devices: prev.devices.map(device => ({ ...device, dragging: false }))
    }));
  };

  const moveGhostEdge = (e) => {
    if (ghostEdge.visible) {
      const bounds = workspaceRef.current.getBoundingClientRect();
      setWorkspaceState(prev => ({
        ...prev,
        ghostEdge: {
          position: {
            x1: ghostEdge.position.x1, 
            x2: e.clientX - bounds.left,
            y1: ghostEdge.position.y1,
            y2: e.clientY - bounds.top
          }, 
          visible: true
        }
      }));
    }
  }

  const getEdgeColorString = (edgeState) => {
    switch (edgeState) {
      case Edges.HDMI: return 'red';
      case Edges.XLR: return 'blue';
      case Edges.USB: return 'black';
      case Edges.Ethernet: return 'green';
      case Edges.WiFi: return 'yellow';
      default: return 'gray';
    }
  } 

  // #### SOURCE ####
  useEffect(() => {
    const updateSize = () => {
      if (workspaceRef.current) {
        const { offsetWidth, offsetHeight } = workspaceRef.current;
        setWorkspaceState(prev => ({
          ...prev,
          size: { width: offsetWidth, height: offsetHeight },
          devices: prev.devices.map(device => {
            let newX = Math.max(0, Math.min(device.position.x, offsetWidth - device.image.width));
            let newY = Math.max(0, Math.min(device.position.y, offsetHeight - device.image.height));
            return { ...device, position: { x: newX, y: newY } };
          })
        }));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div
      className='workspace'
      ref={workspaceRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp1}
      onMouseLeave={handleMouseLeave}
    >
      <svg className='edge-layer'>
        <GhostEdge ghostEdgeState={ghostEdge} color={getEdgeColorString(appState.edge)}/>
        {edges.map(edge => 
          <Edge
            key={`${edge.deviceid1} - ${edge.deviceid2}`}
            device1State={devices.find(device => device.id === edge.deviceid1)}
            device2State={devices.find(device => device.id === edge.deviceid2)}
            color={edge.edgeColor}
          />
        )}
      </svg>
      {devices.map(device =>
        <Device
          key={device.id}
          appState={appState}
          setAppState={setAppState}
          workspaceRef={workspaceRef}
          workspaceState={workspaceState}
          setWorkspaceState={setWorkspaceState}
          deviceState={device}
          removeDevice={removeDevice}
        />
      )}
    </div>
  );
}

// component representing an individual device created inside the workspace
function Device({ appState, setAppState, workspaceRef, workspaceState, setWorkspaceState, deviceState, removeDevice }) {
  
  // #### STATES ####
  const { mode } = appState;
  const { edgeStartID } = workspaceState;
  const [hovering, setHovering] = useState(false);

  // #### TOP LEVEL EVENT HANDLERS ####
  const handleMouseDown = (e) => {
    if (mode === Modes.Dragging) {
      setWorkspaceState(prev => ({
        ...prev,
        devices: prev.devices.map(device => device.id === deviceState.id
          ? {
              ...device,
              dragging: true,
              offset: {
                x: e.clientX - device.position.x,
                y: e.clientY - device.position.y
              }
            }
          : device
        )
      }));
    }
    if (mode === Modes.Connecting) {
      const bounds = workspaceRef.current.getBoundingClientRect();
      setWorkspaceState(prev => ({
        ...prev,
        ghostEdge: {
          position: {
            x1: deviceState.position.x + deviceState.image.width / 2,
            x2: e.clientX - bounds.left,
            y1: deviceState.position.y + deviceState.image.height / 2,
            y2: e.clientY - bounds.top
          },
          visible: true
        },
        edgeStartID: deviceState.id
      }));
    }
  }

  const handleMouseUp = () => {
    if (mode === Modes.Connecting && edgeStartID !== -1 && edgeStartID !== deviceState.id) {
      
      // add a new edge between this device and its origin device if it is valid and does not already exist
      setWorkspaceState(prev => {

        const duplicate = prev.edges.some(edge =>
          (edge.deviceid1 === edgeStartID && edge.deviceid2 === deviceState.id) ||
          (edge.deviceid1 === deviceState.id && edge.deviceid2 === edgeStartID)
        );
        if (duplicate) return prev;
        
        const retval = {
          ...prev,
          edges: [...prev.edges, { 
            deviceid1: edgeStartID, 
            deviceid2: deviceState.id, 
            edgeType: appState.edge, 
            edgeColor: getEdgeColorString(appState.edge) 
          }]
        };

        // if (checkSolution(retval, appState.levelSolution)) {
        //   console.log('add edge iterated level');
        //   setAppState(prev => ({ ...appState, levelNum: prev.levelNum + 1, levelSolution: levelData.levels[prev.levelNum + 1].solution}));
        // }
        return retval;
      });
    }
  }

  // #### HELPER FUNCTIONS ####
  const getEdgeColorString = (edgeState) => {
    switch (edgeState) {
      case Edges.HDMI: return 'red';
      case Edges.XLR: return 'blue';
      case Edges.USB: return 'black';
      case Edges.Ethernet: return 'green';
      case Edges.WiFi: return 'yellow';
      default: return 'gray';
    }
  } 

  // #### SOURCE ####
  return (
    <div
      className='device-container'
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <img
        className='device-image'
        src={deviceState.image.src}
        draggable={false}
        style={{
          width: deviceState.image.width,
          height: deviceState.image.height,
          left: deviceState.position.x,
          top: deviceState.position.y,
          position: 'absolute',
          cursor: 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      <img
        className='delete-button'
        src={deleteIcon}
        draggable={false}
        style={{
          left: deviceState.position.x + deviceState.image.width - 10,
          top: deviceState.position.y - 10,
          position: 'absolute',
          opacity: hovering ? 1 : 0
        }}
        onClick={() => removeDevice(deviceState.id, deviceState.image.src)}
      />
    </div>
  );
}

// component representing a connection between 2 devices created in the workspace
function Edge({ device1State, device2State, color }) {
  
  // #### SOURCE ####
  return (
    <line
      x1={device1State.position.x + device1State.image.width / 2}
      x2={device2State.position.x + device2State.image.width / 2}
      y1={device1State.position.y + device1State.image.height / 2}
      y2={device2State.position.y + device2State.image.height / 2}
      stroke={color}
      strokeWidth={5}
    />
  );
}

// component representing a fake edge which follows the user's mouse as they drag from 1 device to another
function GhostEdge({ ghostEdgeState, color }) {

  // #### SOURCE ####  
  return ghostEdgeState.visible ? (
    <line
      x1={ghostEdgeState.position.x1}
      x2={ghostEdgeState.position.x2}
      y1={ghostEdgeState.position.y1}
      y2={ghostEdgeState.position.y2}
      stroke={color}
      strokeWidth={5}
      opacity={0.33}
    />
  ) : null;
}

export default Workspace;