const { app, BrowserWindow, shell, nativeTheme, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

nativeTheme.themeSource = 'dark';

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

let mainWin = null;

function createWindow() {
  mainWin = new BrowserWindow({
    width: 1100,
    height: 820,
    minWidth: 820,
    minHeight: 640,
    title: 'PawGate',
    backgroundColor: '#1e1c18',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  });

  mainWin.once('ready-to-show', () => mainWin.show());

  mainWin.loadFile(path.join(__dirname, '..', 'pawgate', 'public', 'index.html'));

  mainWin.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWin.setMenuBarVisibility(false);
}

// ── Auto-updater events → renderer ──

autoUpdater.on('update-available', (info) => {
  if (!mainWin) return;
  // Normalise release notes to plain text
  let notes = '';
  if (Array.isArray(info.releaseNotes)) {
    notes = info.releaseNotes.map(n => n.note || n).join('\n');
  } else if (typeof info.releaseNotes === 'string') {
    notes = info.releaseNotes;
  }
  mainWin.webContents.send('update-available', {
    version: info.version,
    notes,
  });
});

autoUpdater.on('download-progress', (prog) => {
  if (mainWin) mainWin.webContents.send('download-progress', {
    percent: Math.round(prog.percent),
    transferred: prog.transferred,
    total: prog.total,
  });
});

autoUpdater.on('update-downloaded', (info) => {
  if (mainWin) mainWin.webContents.send('update-downloaded', { version: info.version });
});

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall();
});

// ── App lifecycle ──

app.whenReady().then(() => {
  createWindow();
  setTimeout(() => autoUpdater.checkForUpdates().catch(() => {}), 5000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
