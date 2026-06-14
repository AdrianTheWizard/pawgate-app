const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pawgateUpdater', {
  onUpdateAvailable:  (cb) => ipcRenderer.on('update-available',  (_, info) => cb(info)),
  onDownloadProgress: (cb) => ipcRenderer.on('download-progress', (_, prog) => cb(prog)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', (_, info) => cb(info)),
  installNow: () => ipcRenderer.send('install-update'),
  getVersion: () => ipcRenderer.sendSync('get-app-version'),
});
