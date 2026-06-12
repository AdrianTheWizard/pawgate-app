const { app, BrowserWindow, shell, nativeTheme } = require('electron');
const path = require('path');

nativeTheme.themeSource = 'dark';

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 820,
    minWidth: 820,
    minHeight: 640,
    title: 'PawGate',
    backgroundColor: '#1e1c18',
    // icon: path.join(__dirname, 'icon.png'),  // add icon.png/icon.ico/icon.icns here
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Allow loading supabase-js from CDN while the HTML is local
      webSecurity: true,
    },
    show: false, // reveal after ready-to-show for smooth launch
  });

  win.once('ready-to-show', () => win.show());

  // Load the app — rename prototype.html → index.html first
  win.loadFile(path.join(__dirname, '..', 'pawgate', 'public', 'index.html'));

  // Open any <a target="_blank"> links in the system browser, not a new Electron window
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();
  // macOS: re-open window when clicking dock icon with no windows open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit on all windows closed (except macOS — stays in dock until explicitly quit)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
