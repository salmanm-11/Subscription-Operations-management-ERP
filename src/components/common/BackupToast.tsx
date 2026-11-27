import React from 'react';
import { ShieldCheck, FolderOpen, X } from 'lucide-react';
import { AutoBackupService } from '../../utils/autoBackupService';

interface BackupToastProps {
  message: string;
  files?: string[];
  onDismiss: () => void;
}

export const BackupToast: React.FC<BackupToastProps> = ({ message, files, onDismiss }) => {
  const handleOpenFolder = async () => {
    await AutoBackupService.openBackupFolder();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-[#16181d] border border-sky-500/40 rounded-2xl shadow-2xl p-4 animate-slideUp text-xs flex items-start gap-3 backdrop-blur-md">
      <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-xs">Daily Backup Updated</span>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{message}</p>
        {files && files.length > 0 && (
          <div className="mt-1 font-mono text-[10px] text-sky-300/90 truncate">
            {files.join(' • ')}
          </div>
        )}
        <div className="mt-2.5 flex items-center gap-2">
          <button
            onClick={handleOpenFolder}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 font-bold text-[11px] transition-colors cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Open Backups Folder</span>
          </button>
        </div>
      </div>
    </div>
  );
};
