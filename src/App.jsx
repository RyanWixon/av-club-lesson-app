import { useState, useEffect, useRef } from 'react'
import redSquare from './assets/redSquare.png'
import greenRectangle from './assets/greenRectangle.png'
import './App.css'

const Modes = {
  Dragging: 'dragging',
  Connecting: 'connecting'
}

function App() {

  // #### STATES ####
  const [devices, setDevices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mode, setMode] = useState(Modes.Dragging);

  // #### HELPER FUNCTIONS ####
  const addDevice = (path, sourceWidth, sourceHeight) => {
    setDevices(prev => {
      const nextId = prev.length;
      return [...prev, {
        id: nextId,
        image: { src: path, width: sourceWidth, height: sourceHeight},
        position: { x: 50, y: 50 },
        offset: { x: 0, y: 0 },
        dragging: false
      }];
    });
  };

  const addEdge = () =>  {
    setEdges(prev => {
      return [...prev, {

      }];
    })
  }

  // #### SOURCE ####
  return (
    <>
      <Workspace devices={devices} setDevices={setDevices} edges={edges} setEdges={setEdges} mode={mode} />
      <button onClick={() => addDevice(redSquare, 100, 100)}>Add a new red device</button>
      <button onClick={() => addDevice(greenRectangle, 75, 25)}>Add a new green device</button>
      <select onChange={(e) => setMode(e.target.value)}>
        <option value={Modes.Dragging}>Move Devices</option>
        <option value={Modes.Connecting}>Create Connections</option>
      </select>
    </>
  )
}

// component representing the space in the screen in which devices can be placed, dragged, and otherwise configured
function Workspace({ devices, setDevices, edges, setEdges, mode }) {

  // #### REFS AND STATES ####
  const workspaceRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ghostEdge, setGhostEdge] = useState({position: {x1: 0, x2: 0, y1: 0, y2: 0}, visible: false});

  // #### TOP LEVEL EVENT HANDLERS ####
  const handleMouseMove = (e) => {
    switch (mode) {
      case Modes.Dragging:
        moveDraggingDevices(e);
        break;
      case Modes.Connecting:
        moveGhostEdge(e);
        break;
    }
  }

  const handleMouseUp = () => {
    switch (mode) {
      case Modes.Dragging:
        dropAllDevices();
        break;
      case Modes.Connecting:
        hideGhostEdge();
        break;
    }
  }

  const handleMouseLeave = () => {
    switch (mode) {
      case Modes.Dragging:
        dropAllDevices();
        break;
      case Modes.Connecting:
        hideGhostEdge();
        break;
    }
  }

  // #### HELPER FUNCTIONS ####
  const updateOffset = (id, value) => {
    setDevices(prevDevices => prevDevices.map(device => device.id === id ? { ...device, offset: value } : device));
  };

  const updateDragging = (id, value) => {
    setDevices(prevDevices => prevDevices.map(device => device.id === id ? { ...device, dragging: value } : device));
  };

  const moveDraggingDevices = (e) => {
    const getNewXY = (offset, width, height) => {
      let newX = Math.max(0 + width * 0.1, Math.min(e.clientX - offset.x, size.width - (width * 1.1)));
      let newY = Math.max(0 + height * 0.1, Math.min(e.clientY - offset.y, size.height - (height * 1.1)));
      return { x: newX, y: newY };
    };
    setDevices(prevDevices => prevDevices.map(device => device.dragging ? { ...device, position: getNewXY(device.offset, device.image.width, device.image.height) } : device));
  };

  const dropAllDevices = () => {
    setDevices(prevDevices => prevDevices.map(device => ({ ...device, dragging: false })));
  };

  const moveGhostEdge = (e) => {
    if (ghostEdge.visible) {
      const bounds = workspaceRef.current.getBoundingClientRect();
      setGhostEdge({
        position: {
          x1: ghostEdge.position.x1, 
          x2: e.clientX - bounds.left,
          y1: ghostEdge.position.y1,
          y2: e.clientY - bounds.top
        }, 
        visible: true
      });
    }
  }

  const hideGhostEdge = () => {
    setGhostEdge({ ...ghostEdge, visible: false});
  }

  useEffect(() => {
    const updateSize = () => {
      if (workspaceRef.current) {
        const { offsetWidth, offsetHeight } = workspaceRef.current;
        setSize({ width: offsetWidth, height: offsetHeight });

        // move devices back inside the workspace if they are out of bounds after the size change
        setDevices(prevDevices => prevDevices.map(device => {
          let newX = Math.max(0, Math.min(device.position.x, offsetWidth - device.image.width));
          let newY = Math.max(0, Math.min(device.position.y, offsetHeight - device.image.height));
          return { ...device, position: { x: newX, y: newY } };
        }));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // #### SOURCE ####
  return (
    <div
      className='workspace'
      ref={workspaceRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <svg className='edge-layer'>
        <GhostEdge ghostEdgeState={ghostEdge}/>
        {/* <DeviceEdge 
          device1State={devices[0]}
          device2State={devices[1]}
        /> */}
      </svg>
      {devices.map(device =>
        <Device
          key={device.id}
          deviceState={device}
          workspaceRef={workspaceRef}
          mode={mode}
          setOffset={updateOffset}
          setDragging={updateDragging}
          setGhostEdge={setGhostEdge}
        />
      )}
    </div>
  );
}

// component representing an individual device displayed within the workspace
function Device({ deviceState, workspaceRef, mode, setOffset, setDragging, setGhostEdge }) {
  
  // #### TOP LEVEL EVENT HANDLERS ####
  const handleMouseDown = (e) => {
    switch (mode) {
      case Modes.Dragging:
        grabDevice(e);
        break;
      case Modes.Connecting:
        connectDevice(e);
        break;
    }
  }
  
  // #### HELPER FUNCTIONS ####
  const grabDevice = (e) => {
    setDragging(deviceState.id, true);
    setOffset(deviceState.id, {
      x: e.clientX - deviceState.position.x,
      y: e.clientY - deviceState.position.y
    });
  };

  const connectDevice = (e) => {
    const bounds = workspaceRef.current.getBoundingClientRect();
    setGhostEdge({
      position: {
        x1: deviceState.position.x  + deviceState.image.width / 2, 
        x2: e.clientX - bounds.left,
        y1: deviceState.position.y + deviceState.image.height / 2, 
        y2: e.clientY - bounds.top
      },
      visible: true
    });
  }

  // #### SOURCE ####
  return (
    <img
      className='device-image'
      src={deviceState.image.src}
      draggable={false}
      style={{
        left: deviceState.position.x,
        top: deviceState.position.y,
        position: 'absolute',
        cursor: 'grab'
      }}
      onMouseDown={handleMouseDown}
    />
  );
}

// component representing a connection between 2 individual devices
function DeviceEdge({ device1State, device2State }) {

  // #### SOURCE ####
  return (
    <line
      x1={device1State.position.x + device1State.image.width / 2}
      x2={device2State.position.x + device2State.image.width / 2}
      y1={device1State.position.y + device1State.image.height / 2}
      y2={device2State.position.y + device2State.image.height / 2}
      stroke='black'
      strokeWidth={5}
    />
  );
}

// component representing an edge being drawn from a device which is not yet connected
function GhostEdge({ ghostEdgeState }) {

  // #### SOURCE ####
  if (ghostEdgeState.visible) {
    return (
      <line
        x1={ghostEdgeState.position.x1}
        x2={ghostEdgeState.position.x2}
        y1={ghostEdgeState.position.y1}
        y2={ghostEdgeState.position.y2}
        stroke='black'
        strokeWidth={5}
        opacity={0.33}
      />
    );
  }
  else {
    return (
      <></>
    )
  }
}

export default App;