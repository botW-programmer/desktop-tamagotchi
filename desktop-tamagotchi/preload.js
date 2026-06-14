const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tamagotchiAPI', {
    onStatsUpdate: (callback) => ipcRenderer.on('system-stats', (_event, data) => callback(data))
});