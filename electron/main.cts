import { app, BrowserWindow, shell, ipcMain, nativeImage } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// Set AppUserModelId for Windows Taskbar icon grouping
if (process.platform === 'win32') {
  app.setAppUserModelId('ae.karamamess.management');
}

// Disable hardware acceleration to eliminate Windows GPU cache conflicts and black screens
app.disableHardwareAcceleration();

// Prevent multiple conflicting instances from locking user data and GPU cache
const gotTheLock = app.requestSingleInstanceLock();

let mainWindow: BrowserWindow | null = null;

if (!gotTheLock) {
  // If another instance is already running, quit this instance immediately
  app.quit();
} else {
  app.on('second-instance', () => {
    // When a second instance is launched, focus the existing window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  const icoPath = path.join(app.getAppPath(), 'dist', 'favicon.ico');
  const pngPath = path.join(app.getAppPath(), 'dist', 'app-icon.png');
  const appIcon = process.platform === 'win32' && fs.existsSync(icoPath) ? icoPath : pngPath;

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Karama Mess Management Software',
    backgroundColor: '#0b0f19',
    show: false,
    icon: appIcon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });

  try {
    if (appIcon) {
      mainWindow.setIcon(appIcon);
    }
  } catch (err) {
    console.error('Failed to set window icon:', err);
  }

  // Enable F5 reload and F12 DevTools
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      mainWindow?.webContents.toggleDevTools();
      event.preventDefault();
    }
    if (input.key === 'F5' && input.type === 'keyDown') {
      mainWindow?.reload();
      event.preventDefault();
    }
  });

  // Prevent unauthorized new windows / external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:') || url.startsWith('mailto:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Prevent unexpected navigation
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'http://localhost:5173' && !navigationUrl.startsWith('file://')) {
      event.preventDefault();
    }
  });

  const loadApp = () => {
    if (process.env.VITE_DEV_SERVER_URL) {
      mainWindow?.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      const appPath = app.getAppPath();
      const primaryPath = path.join(appPath, 'dist', 'index.html');
      mainWindow?.loadFile(primaryPath).catch((err) => {
        console.error('Primary loadFile error, trying relative fallback:', err);
        const fallbackPath = path.join(__dirname, '..', '..', 'dist', 'index.html');
        mainWindow?.loadFile(fallbackPath).catch((err2) => {
          console.error('Fallback loadFile error:', err2);
        });
      });
    }
  };

  loadApp();

  // Show window smoothly once ready or on finish load
  let hasShown = false;
  const showSafely = () => {
    if (!hasShown && mainWindow) {
      hasShown = true;
      mainWindow.show();
      mainWindow.focus();
    }
  };

  mainWindow.once('ready-to-show', showSafely);
  mainWindow.webContents.on('did-finish-load', showSafely);

  // Fallback safety timer to ensure window never stays hidden
  setTimeout(showSafely, 1200);

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('Renderer process gone:', details);
    if (details.reason !== 'clean-exit') {
      mainWindow?.reload();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Window Controls
ipcMain.handle('app:version', () => app.getVersion());
ipcMain.handle('window:minimize', () => mainWindow?.minimize());
ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.handle('window:close', () => mainWindow?.close());
