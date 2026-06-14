const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pawgateUpdater', {
  onUpdateAvailable:    (cb) => ipcRenderer.on('update-available',    (_, info) => cb(info)),
  onUpdateNotAvailable: (cb) => ipcRenderer.on('update-not-available',(_, info) => cb(info)),
  onDownloadProgress:   (cb) => ipcRenderer.on('download-progress',   (_, prog) => cb(prog)),
  onUpdateDownloaded:   (cb) => ipcRenderer.on('update-downloaded',   (_, info) => cb(info)),
  onUpdateError:        (cb) => ipcRenderer.on('update-error',        (_, info) => cb(info)),
  installNow:           () => ipcRenderer.send('install-update'),
  checkForUpdates:      () => ipcRenderer.send('check-for-updates'),
  getVersion:           () => ipcRenderer.sendSync('get-app-version'),
});
