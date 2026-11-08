import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to the React renderer via contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app:version'),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  getBackupStatus: () => ipcRenderer.invoke('backup:get-status'),
  saveBackup: (payload: { excelBase64?: string; jsonString?: string; dateStr: string }) =>
    ipcRenderer.invoke('backup:save-now', payload),
  openBackupFolder: () => ipcRenderer.invoke('backup:open-folder'),
  readBackupFile: (fileName: string) => ipcRenderer.invoke('backup:read-file', fileName),
  platform: process.platform,
  isElectron: true,
});
