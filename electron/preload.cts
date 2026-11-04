import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to the React renderer via contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app:version'),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  platform: process.platform,
});
