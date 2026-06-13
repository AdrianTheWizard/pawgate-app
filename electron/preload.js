const { contextBridge, ipcRenderer } = require('electron');

// Force full-screen desktop mode and show sidebar directly via inline style
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('electron-app', 'native-app');
  document.body.style.flexDirection = 'row';
  document.body.style.alignItems = 'stretch';
  document.body.style.padding = '0';
  document.body.style.gap = '0';
  const sb = document.getElementById('desktop-sidebar');
  if (sb) sb.style.display = 'flex';
  const phone = document.getElementById('phone');
  if (phone) { phone.style.flex = '1'; phone.style.width = 'auto'; phone.style.maxWidth = 'none'; phone.style.height = '100dvh'; phone.style.borderRadius = '0'; phone.style.border = 'none'; }
});

contextBridge.exposeInMainWorld('pawgateUpdater', {
  onUpdateAvailable:  (cb) => ipcRenderer.on('update-available',  (_, info) => cb(info)),
  onDownloadProgress: (cb) => ipcRenderer.on('download-progress', (_, prog) => cb(prog)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', (_, info) => cb(info)),
  installNow: () => ipcRenderer.send('install-update'),
  getVersion: () => ipcRenderer.sendSync('get-app-version'),
});
