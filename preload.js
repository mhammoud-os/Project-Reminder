// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getStats: () => ipcRenderer.invoke('get-stats'), // Expose function to fetch stats
});
