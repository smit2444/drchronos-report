// electron-app/main.js
const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');

let backendProcess; // Store the backend process reference
let frontendProcess; // Store the frontend process reference

function startBackend() {
  // Start the backend server without blocking
  backendProcess = exec('cd ./backend && node server.js', (error) => {
    if (error) {
      console.error(`Error starting backend: ${error.message}`);
    }
  });

  // Log output from the backend process
  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });
}

function startFrontend() {
  // Start the frontend server without blocking
  frontendProcess = exec('cd ./frontend && npm start', (error) => {
    if (error) {
      console.error(`Error starting frontend: ${error.message}`);
    }
  });

  // Log output from the frontend process
  frontendProcess.stdout.on('data', (data) => {
    console.log(`Frontend: ${data}`);
  });

  frontendProcess.stderr.on('data', (data) => {
    console.error(`Frontend Error: ${data}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the frontend after a delay
  setTimeout(() => {
    win.loadURL('http://localhost:3000');
  }, 3000); // 3-second delay
}


  // Optionally open the DevTools for debugging
  // win.webContents.openDevTools();

app.whenReady().then(() => {
  startBackend();  // Start the backend immediately
  startFrontend(); // Start the frontend immediately
  createWindow();  // Create the Electron window

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) {
      backendProcess.kill(); // Kill the backend process when app closes
    }
    if (frontendProcess) {
      frontendProcess.kill(); // Kill the frontend process when app closes
    }
    app.quit(); // Quit the app
  }
});
// --------

// const { app, BrowserWindow } = require('electron');
// const { exec } = require('child_process');
// const path = require('path');
// const axios = require('axios');

// let backendProcess;
// let frontendProcess;

// function startBackend() {
//   backendProcess = exec('cd ./backend && node server.js', (error) => {
//     if (error) {
//       console.error(`Error starting backend: ${error.message}`);
//       setTimeout(startBackend, 5000); // Retry after 5 seconds if backend fails to start
//     }
//   });
// }

// function startFrontend() {
//   frontendProcess = exec('cd ./frontend && npm start', (error) => {
//     if (error) {
//       console.error(`Error starting frontend: ${error.message}`);
//       setTimeout(startFrontend, 5000); // Retry after 5 seconds if frontend fails to start
//     }
//   });
// }

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'), // Use a preload script
//       contextIsolation: true,
//       nodeIntegration: false,
//     },
//   });

//   const tryLoad = () => {
//     axios.get('http://localhost:3000')
//       .then(() => win.loadURL('http://localhost:3000'))
//       .catch(() => setTimeout(tryLoad, 1000)); // Retry every second
//   };

//   tryLoad();
// }


// app.whenReady().then(() => {
//   startBackend();
//   startFrontend();
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow();
//     }
//   });
// });

// app.on('window-all-closed', () => {
//   if (backendProcess) backendProcess.kill();
//   if (frontendProcess) frontendProcess.kill();
//   if (process.platform !== 'darwin') app.quit();
// });

// // const { app, shell } = require('electron');
// // const { exec } = require('child_process');

// // let backendProcess;
// // let frontendProcess;

// // function startBackend() {
// //     backendProcess = exec('cd ./backend && node server.js', (error) => {
// //         if (error) {
// //             console.error(`Error starting backend: ${error.message}`);
// //             return;
// //         }
// //         console.log('Backend started successfully');
// //         // Backend is ready, now start the frontend
// //         startFrontend();
// //     });
// // }

// // function startFrontend() {
// //     frontendProcess = exec('cd ./frontend && npm start', (error) => {
// //         if (error) {
// //             console.error(`Error starting frontend: ${error.message}`);
// //             return;
// //         }
// //         console.log('Frontend started successfully');
// //         // Frontend is ready, open the default browser
// //         openBrowser();
// //     });
// // }

// // function openBrowser() {
// //     // Ensure the URL matches where your frontend is hosted
// //     shell.openExternal('http://localhost:3000');
// // }

// // app.whenReady().then(startBackend);

// // app.on('window-all-closed', () => {
// //     // Application will quit when all windows are closed, except on macOS
// //     if (process.platform !== 'darwin') {
// //         app.quit();
// //     }
// // });

// // app.on('quit', () => {
// //     // Kill the backend and frontend processes on quitting the app
// //     if (backendProcess) backendProcess.kill();
// //     if (frontendProcess) frontendProcess.kill();
// // });