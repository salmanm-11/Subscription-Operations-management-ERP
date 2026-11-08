/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_DEFAULT_TIMEZONE?: string;
  readonly VITE_DEFAULT_CURRENCY?: string;
  readonly VITE_DEV_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ElectronBackupFile {
  name: string;
  size: number;
  modified: string;
}

interface ElectronBackupStatus {
  backupDir?: string;
  files?: ElectronBackupFile[];
  lastBackup?: string | null;
  error?: string;
}

interface ElectronAPI {
  getVersion: () => Promise<string>;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  getBackupStatus: () => Promise<ElectronBackupStatus>;
  saveBackup: (payload: { excelBase64?: string; jsonString?: string; dateStr: string }) => Promise<{
    success: boolean;
    backupDir?: string;
    savedFiles?: string[];
    timestamp?: string;
    error?: string;
  }>;
  openBackupFolder: () => Promise<{ success: boolean; error?: string }>;
  readBackupFile: (fileName: string) => Promise<{ success: boolean; content?: string; error?: string }>;
  platform: string;
  isElectron: boolean;
}

interface Window {
  electronAPI?: ElectronAPI;
}

