import React, { useState, useEffect } from 'react';
import {
  Settings,
  Check,
  RefreshCw,
  FileText,
  ShieldCheck,
  Bell,
  Clock,
  Trash2,
  FolderOpen,
  Download,
  Upload,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BusinessSettings, Customer, Building, MealPlan, Invoice, Payment } from '../../types';
import { ActivityLogView } from './ActivityLogView';
import { getReminderDaysSetting, setReminderDaysSetting } from '../../utils/reminderService';
import { clearAllBusinessData } from '../../api/supabase';
import { AutoBackupService } from '../../utils/autoBackupService';
import * as XLSX from 'xlsx';

interface BusinessSettingsViewProps {
  settings: BusinessSettings;
  onSaveSettings: (settings: Partial<BusinessSettings>) => void;
  currentUsername?: string;
  customers?: Customer[];
  buildings?: Building[];
  mealPlans?: MealPlan[];
  invoices?: Invoice[];
  payments?: Payment[];
  onDataRestored?: () => void;
}

export const BusinessSettingsView: React.FC<BusinessSettingsViewProps> = ({
  settings,
  onSaveSettings,
  currentUsername = 'admin',
  customers = [],
  buildings = [],
  mealPlans = [],
  invoices = [],
  payments = [],
  onDataRestored,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'backups' | 'logs'>('profile');

  // Business profile state
  const [phone, setPhone] = useState(settings.phone || '+971 50 123 4567');
  const [email, setEmail] = useState(settings.email || 'admin@karamamess.ae');
  const [address, setAddress] = useState(settings.address || 'Al Karama, Dubai');
  const [city] = useState('Dubai');
  const [country] = useState('United Arab Emirates');
  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoice_prefix || 'INV-2026-');
  const [notes, setNotes] = useState(settings.business_notes || 'Good Food. Happy People.');
  const [dueReminderDays, setDueReminderDays] = useState<number>(
    settings.due_reminder_days || getReminderDaysSetting()
  );

  // Backup state
  const isDesktop = AutoBackupService.isDesktopApp();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccessMsg, setBackupSuccessMsg] = useState<string | null>(null);
  const [backupErrorMsg, setBackupErrorMsg] = useState<string | null>(null);
  const [backupFiles, setBackupFiles] = useState<{ name: string; size: number; modified: string }[]>([]);
  const [backupDir, setBackupDir] = useState<string>('Documents\\Karama Mess Backups');
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const loadDiskBackups = async () => {
    if (!isDesktop) return;
    try {
      const res = await AutoBackupService.getDiskBackupStatus();
      if (res) {
        if (res.backupDir) setBackupDir(res.backupDir);
        if (res.files) setBackupFiles(res.files);
      }
      const savedDate = localStorage.getItem('karama_last_auto_backup_date');
      const savedTime = localStorage.getItem('karama_last_auto_backup_time');
      const todayStr = new Date().toISOString().split('T')[0];
      if (savedDate === todayStr) {
        setLastBackupTime(savedTime ? `Today at ${savedTime}` : 'Today');
      } else if (savedDate) {
        setLastBackupTime(savedDate);
      }
    } catch (err) {
      console.warn('Failed to load disk backups:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'backups') {
      loadDiskBackups();
    }
  }, [activeTab]);

  const handleManualBackup = async () => {
    try {
      setIsBackingUp(true);
      setBackupSuccessMsg(null);
      setBackupErrorMsg(null);

      const res = await AutoBackupService.executeDailyBackup(
        {
          customers,
          buildings,
          mealPlans,
          invoices,
          payments,
          settings,
        },
        true // force manual backup
      );

      if (res.success) {
        setBackupSuccessMsg(`✓ Backup saved successfully! ${res.savedFiles ? res.savedFiles.join(' and ') : 'Files updated on disk'}.`);
        await loadDiskBackups();
      } else {
        setBackupErrorMsg(res.error || 'Failed to complete backup.');
      }
    } catch (err: any) {
      setBackupErrorMsg(err.message || 'Unknown error during backup.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleOpenFolder = async () => {
    await AutoBackupService.openBackupFolder();
  };

  const handleDownloadWebBackupJson = () => {
    const jsonString = AutoBackupService.generateSystemSnapshotJson({
      customers,
      buildings,
      mealPlans,
      invoices,
      payments,
      settings,
    });
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karama_mess_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadWebBackupExcel = () => {
    const wb = AutoBackupService.generateExcelWorkbook({
      customers,
      buildings,
      mealPlans,
      invoices,
      payments,
      settings,
    });
    XLSX.writeFile(wb, `Karama_Mess_Records_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm(`Are you sure you want to restore data from "${file.name}"? This will update your local and cloud records with this snapshot.`)) {
      e.target.value = '';
      return;
    }

    try {
      setIsRestoring(true);
      const text = await file.text();
      const res = await AutoBackupService.restoreFromJson(text);
      if (res.success) {
        alert(`✓ Successfully restored ${res.count} customer records from backup!`);
        if (onDataRestored) onDataRestored();
        window.location.reload();
      } else {
        alert(`Failed to restore: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Error restoring file: ${err.message}`);
    } finally {
      setIsRestoring(false);
      e.target.value = '';
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setReminderDaysSetting(dueReminderDays);
    onSaveSettings({
      phone,
      email,
      address,
      invoice_prefix: invoicePrefix,
      business_notes: notes,
      due_reminder_days: dueReminderDays,
    });
    alert('Business settings and Due Date reminder window saved successfully!');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Business Configuration</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage business profile, UAE localization, and system activity logs</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Business Profile
          </button>
          <button
            onClick={() => setActiveTab('backups')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'backups' ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local Daily Backups</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'logs' ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Activity Logs</span>
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl p-6 shadow-lg max-w-2xl">
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Currency (Fixed)</label>
                <input
                  type="text"
                  disabled
                  value="AED (United Arab Emirates Dirham)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Timezone (Fixed)</label>
                <input
                  type="text"
                  disabled
                  value="Asia/Dubai"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">City</label>
                <input
                  type="text"
                  disabled
                  value={city}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Country</label>
                <input
                  type="text"
                  disabled
                  value={country}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Invoice Prefix</label>
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Slogan / Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Approaching Due Reminder Settings */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Approaching Due Date Reminders</span>
              </div>
              <p className="text-xs text-slate-300">
                Set how many days in advance the system highlights upcoming monthly renewals in the top-bar notification bell and reports.
              </p>
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  Highlight accounts when due date is within:
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[1, 3, 5, 7, 10, 15].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDueReminderDays(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        dueReminderDays === d
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {d} Day{d > 1 ? 's' : ''} {d === 5 ? '(Default)' : ''}
                    </button>
                  ))}
                  <div className="flex items-center gap-1.5 ml-1">
                    <span className="text-xs text-slate-400">Custom:</span>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={dueReminderDays}
                      onChange={(e) => setDueReminderDays(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs font-bold text-center focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-xs text-slate-400">days</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-colors cursor-pointer"
              >
                Save Business Settings
              </button>
            </div>

            {/* Danger Zone: Clear / Reset All Data */}
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2 mt-6">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-bold text-rose-300">Clean Slate &amp; Reset Data</span>
              </div>
              <p className="text-xs text-slate-300">
                Permanently remove all Customers, Vendors, Invoices, Payments, Daily Accounts, and Buildings to start completely fresh.
              </p>
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to permanently delete ALL Customers, Vendors, Invoices, Payments, and Buildings? This will reset the database to a clean production state.')) {
                    await clearAllBusinessData();
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Clear All Business Data Now
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Local Daily Backups Tab (PC / Desktop Focused) */}
      {activeTab === 'backups' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-[#151c2c] border border-sky-500/30 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isDesktop ? 'Automatic Local Daily Backups' : 'Data Backups & Security'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {isDesktop
                      ? "Your software automatically saves all customer profiles, payment receipts, and invoices directly to your computer's hard drive every day."
                      : "On the website, all records are continuously saved and synchronized in the Cloud Database. Automatic background saving to your PC hard drive is exclusive to the installed Windows Desktop Application (.exe)."}
                  </p>
                </div>
              </div>

              {isDesktop ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Desktop Auto-Sync: Active</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cloud Live Sync: Active</span>
                </div>
              )}
            </div>

            {/* Backup Status Overview Grid */}
            {isDesktop ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-1">
                  <span className="text-slate-400 font-semibold block">Last Daily Backup:</span>
                  <span className="text-amber-400 font-bold font-mono text-sm block">
                    {lastBackupTime || 'Saved on launch today'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Automatically generates Excel (.xlsx) and System Restore (.json)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-1">
                  <span className="text-slate-400 font-semibold block">Backup Folder Location:</span>
                  <span className="text-sky-300 font-bold font-mono text-xs truncate block" title={backupDir}>
                    {backupDir}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Retains a rolling 30-day history on your PC hard drive
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-1">
                  <span className="text-slate-400 font-semibold block">Website Data Protection:</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm block">
                    Live Cloud Sync
                  </span>
                  <span className="text-[11px] text-slate-500">
                    All customers, payments, and invoices are continuously saved to Supabase
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-1">
                  <span className="text-slate-400 font-semibold block">Automatic PC Hard Drive Backups:</span>
                  <span className="text-amber-400 font-bold text-xs block">
                    Available in Windows Desktop (.exe)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Web browsers cannot write directly to local PC folders due to security
                  </span>
                </div>
              </div>
            )}

            {/* Success and Error Alerts */}
            {backupSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{backupSuccessMsg}</span>
              </div>
            )}
            {backupErrorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{backupErrorMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap pt-2">
              {isDesktop ? (
                <>
                  <button
                    type="button"
                    onClick={handleManualBackup}
                    disabled={isBackingUp}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
                    <span>{isBackingUp ? 'Saving Backup...' : 'Backup Now'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenFolder}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span>Open Backups Folder in Windows</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleDownloadWebBackupExcel}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Download Excel Backup (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadWebBackupJson}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Snapshot (.json)</span>
                  </button>
                </>
              )}

              {/* Restore From Backup Input */}
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                <span>{isRestoring ? 'Restoring...' : 'Restore From Backup (.json)'}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreFile}
                  disabled={isRestoring}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Backup Files List on Local Hard Drive */}
          {isDesktop && backupFiles.length > 0 && (
            <div className="bg-[#151c2c] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-amber-400" />
                  <span>Existing Backup Files on This PC ({backupFiles.length} files)</span>
                </h4>
                <button
                  type="button"
                  onClick={loadDiskBackups}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh List</span>
                </button>
              </div>

              <div className="divide-y divide-slate-800/80 max-h-64 overflow-y-auto pr-1">
                {backupFiles.slice(0, 15).map((f) => (
                  <div key={f.name} className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-900/40 px-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {f.name.endsWith('.xlsx') ? (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <FileCode className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span className="font-mono text-slate-200 font-medium truncate" title={f.name}>
                        {f.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-slate-400 font-mono text-[11px]">
                      <span>{formatFileSize(f.size)}</span>
                      <span>{new Date(f.modified).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'logs' && (
        <ActivityLogView currentUsername={currentUsername} />
      )}
    </div>
  );
};
