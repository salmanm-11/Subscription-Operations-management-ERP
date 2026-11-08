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

// ==========================================
// AUTOMATIC LOCAL BACKUPS & RESTORE (PC ONLY)
// ==========================================
const getBackupDirectory = (): string => {
  const docsDir = app.getPath('documents');
  const backupDir = path.join(docsDir, 'Karama Mess Backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
};

// 1. Get current backup status and list of recent backups
ipcMain.handle('backup:get-status', async () => {
  try {
    const backupDir = getBackupDirectory();
    const fileNames = fs.readdirSync(backupDir);
    const files = fileNames
      .filter((n) => n.endsWith('.xlsx') || n.endsWith('.json'))
      .map((name) => {
        const fullPath = path.join(backupDir, name);
        const stat = fs.statSync(fullPath);
        return {
          name,
          size: stat.size,
          modified: stat.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

    return {
      backupDir,
      files,
      lastBackup: files.length > 0 ? files[0].modified : null,
    };
  } catch (err: any) {
    console.error('Failed to get backup status:', err);
    return { error: err.message, files: [], lastBackup: null };
  }
});

// 2. Save new daily backup (Excel .xlsx and/or JSON System snapshot)
ipcMain.handle('backup:save-now', async (_event, payload: { excelBase64?: string; jsonString?: string; dateStr: string }) => {
  try {
    const backupDir = getBackupDirectory();
    const { excelBase64, jsonString, dateStr } = payload;
    const savedFiles: string[] = [];

    // Save Excel Workbook (.xlsx)
    if (excelBase64) {
      const xlsxName = `Karama_Mess_Backup_${dateStr}.xlsx`;
      const xlsxPath = path.join(backupDir, xlsxName);
      const buffer = Buffer.from(excelBase64, 'base64');
      fs.writeFileSync(xlsxPath, buffer);
      savedFiles.push(xlsxName);
    }

    // Save JSON System Snapshot (.json)
    if (jsonString) {
      const jsonName = `Karama_Mess_System_Restore_${dateStr}.json`;
      const jsonPath = path.join(backupDir, jsonName);
      fs.writeFileSync(jsonPath, jsonString, 'utf-8');
      savedFiles.push(jsonName);
    }

    // Retain rolling 30-day history (clean up older files automatically)
    try {
      const nowMs = Date.now();
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      const allFiles = fs.readdirSync(backupDir);
      for (const f of allFiles) {
        if (!f.startsWith('Karama_Mess_')) continue;
        const fullPath = path.join(backupDir, f);
        const stat = fs.statSync(fullPath);
        if (nowMs - stat.mtimeMs > thirtyDaysMs) {
          fs.unlinkSync(fullPath);
        }
      }
    } catch (cleanErr) {
      console.warn('Backup cleanup error:', cleanErr);
    }

    return {
      success: true,
      backupDir,
      savedFiles,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error('Failed to save backup:', err);
    return { success: false, error: err.message };
  }
});

// 3. Open Backup folder in Windows Explorer
ipcMain.handle('backup:open-folder', async () => {
  try {
    const backupDir = getBackupDirectory();
    await shell.openPath(backupDir);
    return { success: true };
  } catch (err: any) {
    console.error('Failed to open backup folder:', err);
    return { success: false, error: err.message };
  }
});

// 4. Read specific backup file for restoration
ipcMain.handle('backup:read-file', async (_event, fileName: string) => {
  try {
    const backupDir = getBackupDirectory();
    const safeName = path.basename(fileName);
    const fullPath = path.join(backupDir, safeName);
    if (!fs.existsSync(fullPath)) {
      return { success: false, error: 'Backup file not found on disk' };
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    return { success: true, content };
  } catch (err: any) {
    console.error('Failed to read backup file:', err);
    return { success: false, error: err.message };
  }
});
