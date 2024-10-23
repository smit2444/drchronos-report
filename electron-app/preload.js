const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  sendData: (data) => ipcRenderer.send('send-data', data),
  receiveData: (func) => ipcRenderer.on('data-received', (event, ...args) => func(...args)),
});
