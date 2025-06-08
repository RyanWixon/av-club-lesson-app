import { useState, useEffect, useRef } from 'react'
import redSquare from './assets/redSquare.png'
import greenRectangle from './assets/greenRectangle.png'
import './App.css'

function App() {

  // states to control aspects of the entire application
  const [devices, setDevices] = useState([]);

  const addDevice = (path, sourceWidth, sourceHeight) => {
    setDevices(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(d => d.id)) + 1 : 0;
      return [...prev, {
        id: nextId,
        image: { src: path, width: sourceWidth, height: sourceHeight},
        position: { x: 50, y: 50 }, // or random location
        offset: { x: 0, y: 0 },
        dragging: false
      }];
    });
  };

  return (
    <>
      <Workspace devices={devices} setDevices={setDevices} />
      <button onClick={() => addDevice(redSquare, 100, 100)}>Add a new red device</button>
      <button onClick={() => addDevice(greenRectangle, 75, 25)}>Add a new green device</button>
    </>
  )
}

function Workspace({ devices, setDevices }) {
  
  const workspaceRef = useRef(null);
  
  // states to control the workspace
  const [size, setSize] = useState({ width: 0, height: 0 });

  // updates the offset state of a single device with a matching id
  const updateOffset = (id, value) => {
    setDevices(prevDevices => prevDevices.map(device => device.id === id ? { ...device, offset: value } : device));
  };

  // updates the dragging state of a single device with a matching id
  const updateDragging = (id, value) => {
    setDevices(prevDevices => prevDevices.map(device => device.id === id ? { ...device, dragging: value } : device));
  };

  // updates the position state of all devices currently being dragged 
  const moveDraggingDevices = (e) => {
    const getNewXY = (offset, width, height) => {
      let newX = Math.max(0 + width * 0.1, Math.min(e.clientX - offset.x, size.width - (width * 1.1)));
      let newY = Math.max(0 + height * 0.1, Math.min(e.clientY - offset.y, size.height - (height * 1.1)));
      return { x: newX, y: newY };
    };
    setDevices(prevDevices => prevDevices.map(device => device.dragging ? { ...device, position: getNewXY(device.offset, device.image.width, device.image.height) } : device));
  };

  // sets the dragging state of all devices to false
  const dropAllDevices = () => {
    setDevices(prevDevices => prevDevices.map(device => ({ ...device, dragging: false })));
  };

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

  return (
    <div
      className='workspace'
      ref={workspaceRef}
      onMouseMove={moveDraggingDevices}
      onMouseUp={dropAllDevices}
      onMouseLeave={dropAllDevices}
    >
      {devices.map(device =>
        <Device
          key={device.id}
          deviceState={device}
          setOffset={updateOffset}
          setDragging={updateDragging}
        />
      )}
    </div>
  );
}

// component representing an individual device displayed within the workspace
function Device({ deviceState, setOffset, setDragging }) {
  
  // calculates necessary offset to make the device appear to follow the mouse and updates state accordingly
  const grabDevice = (e) => {
    setDragging(deviceState.id, true);
    setOffset(deviceState.id, {
      x: e.clientX - deviceState.position.x,
      y: e.clientY - deviceState.position.y
    });
  };

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
      onMouseDown={grabDevice}
    />
  );
}

export default App;
