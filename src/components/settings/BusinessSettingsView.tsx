import React, { useState } from 'react';
import { Settings, Check, RefreshCw, FileText, ShieldCheck, Bell, Clock, Trash2 } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { ActivityLogView } from './ActivityLogView';
import { getReminderDaysSetting, setReminderDaysSetting } from '../../utils/reminderService';
import { clearAllBusinessData } from '../../api/supabase';

interface BusinessSettingsViewProps {
  settings: BusinessSettings;
  onSaveSettings: (settings: Partial<BusinessSettings>) => void;
  currentUsername?: string;
}

export const BusinessSettingsView: React.FC<BusinessSettingsViewProps> = ({
  settings,
  onSaveSettings,
  currentUsername = 'admin',
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'logs'>('profile');

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
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'profile' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Business Profile
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
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
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Business Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">City &amp; Country</label>
                <input
                  type="text"
                  disabled
                  value={`${city}, ${country}`}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Invoice Number Prefix</label>
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tagline / Business Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Payment Due Date Approaching Reminders Configuration */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Payment Due Date Reminders</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {dueReminderDays} Days Active
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Configure how many days in advance you want the application to remind you and flag customers whose subscription due date is approaching.
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Approaching Due Date Alert Window (Days)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 3, 5, 7, 10, 15].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDueReminderDays(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
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
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-colors"
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

      {activeTab === 'logs' && (
        <ActivityLogView currentUsername={currentUsername} />
      )}
    </div>
  );
};
