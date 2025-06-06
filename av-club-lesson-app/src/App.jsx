import { useState, useEffect, useRef } from 'react'
import redSquare from './assets/redSquare.png'
import './App.css'

function App() {

  return (
    <Workspace />
  )
}

function Workspace() {
  
  const workspaceRef = useRef(null);

  // states to control the workspace and the devices within it
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [devices, setDevices] = useState([
    {id: 0, position: {x: 0, y: 0}, offset: {x: 0, y: 0}, dragging: false},
    {id: 1, position: {x: 100, y: 100}, offset: {x: 0, y: 0}, dragging: false}
  ])

  // update a single device's offset state
  const updateOffset = (id, value) => {
    setDevices(prevDevices => prevDevices.map(device => device.id === id ? { ...device, offset: value } : device));
  }

  // update a single device's dragging state
  const updateDragging = (id, value) => {
    setDevices(prevDevices => prevDevices.map(device => device.id === id ? { ...device, dragging: value} : device));
  }

  // set the position state for all devices being dragged
  const moveDraggingDevices = (e) => {
    function getNewXY(offset) {
      let newX = Math.max(0, Math.min(e.clientX - offset.x, size.width - 100));
      let newY = Math.max(0, Math.min(e.clientY - offset.y, size.height - 100));
      return {x: newX, y: newY};
    }
    setDevices(prevDevices => prevDevices.map(device => device.dragging ? { ...device, position: getNewXY(device.offset) } : device));
  } 

  // set all device's dragging state to false
  const dropAllDevices = () => {
    setDevices(prevDevices => prevDevices.map(device => ({ ...device, dragging: false})));
  }

  // measure the workspace when the window resizes
  useEffect(() => {
    const updateSize = () => {
      if (workspaceRef.current) {
        
        // resize the workspace
        const { offsetWidth, offsetHeight } = workspaceRef.current;
        setSize({ width: offsetWidth, height: offsetHeight });
        
        // move any devices that may have gone out of bounds during the resize
        setDevices(prevDevices => prevDevices.map(device => {
          console.log(size.width + ', ' + size.height);
          let newX = Math.max(0, Math.min(device.position.x, offsetWidth - 100));
          let newY = Math.max(0, Math.min(device.position.y, offsetHeight - 100));
          return { ...device, position: {x: newX, y: newY}};
        }))
      }
    };

    updateSize(); // Measure once on mount

    window.addEventListener('resize', updateSize); // Listen for resizes

    return () => {
      window.removeEventListener('resize', updateSize); // Clean up
    };
  }, []);

  return (
    <>
    <div 
      className='workspace'
      ref={workspaceRef}
      onMouseMove={moveDraggingDevices}
      onMouseUp={dropAllDevices}
      onMouseLeave={dropAllDevices}
    >
      <Device deviceState={devices[0]} setOffset={updateOffset} setDragging={updateDragging}/>
      <Device deviceState={devices[1]} setOffset={updateOffset} setDragging={updateDragging}/>
    </div>
    </>
  )
}

function Device({ deviceState, setOffset, setDragging }) {

  const grabDevice = (e) => {
    setDragging(deviceState.id, true);
    setOffset(deviceState.id, {x: e.clientX - deviceState.position.x, y: e.clientY - deviceState.position.y});
  }

  return (
    <img 
      src={redSquare} 
      draggable={false}
      style={{
        left: deviceState.position.x,
        top: deviceState.position.y,
        position: 'absolute',
        cursor: 'grab'
      }}
      onMouseDown={grabDevice}
    >
    </img>
  )
}

export default App
