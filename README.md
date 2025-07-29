A web app to simulate the configuration of various audio/video equipment.
It is created using React and Vite. You must install the required dependencies for it to work correctly via ```npm install```

You can drag and drop devices from the menu onto the screen, and then create edges between them. Create the correct
configuration between devices and edges to progress through the levels. There can be 3 of each device on the workspace,
and at most 3 edges between 2 devices. Each edge between a device must also be a unique type (dictated by color).

The solutions to levels can be manually changed by editing LevelData.json; the number of levels is also editable.
