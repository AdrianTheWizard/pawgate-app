const { app, BrowserWindow, shell, nativeTheme, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

nativeTheme.themeSource = 'dark';

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  const win = new BrowserWindow({
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
    },
    show: false,
  });

  win.once('ready-to-show', () => win.show());

  win.loadFile(path.join(__dirname, '..', 'pawgate', 'public', 'index.html'));

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  win.setMenuBarVisibility(false);

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'PawGate-oppdatering klar',
      message: 'Ei ny versjon er lasta ned.\nStart PawGate på nytt for å installere oppdateringa.',
      buttons: ['Start på nytt no', 'Seinare'],
      defaultId: 0,
    }).then(result => {
      if (result.response === 0) autoUpdater.quitAndInstall();
    });
  });

  return win;
}

app.whenReady().then(() => {
  createWindow();
  // Check for updates 5 seconds after launch (give the window time to load)
  setTimeout(() => autoUpdater.checkForUpdates().catch(() => {}), 5000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
