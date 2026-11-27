import React, { useState, useMemo } from 'react';
import {
  Calendar,
  User,
  Cloud,
  CloudOff,
  RefreshCw,
  LogOut,
  Bell,
  Clock,
  MessageSquare,
  ChevronRight,
  X,
  CreditCard,
  Building2,
  CheckCircle2,
  Settings,
  Database,
  Wifi,
  WifiOff,
  AlertTriangle,
  CalendarX,
  Globe,
  UserPlus,
  Sparkles,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import { Customer, Invoice } from '../../types';
import { formatAED } from '../../utils/currency';
import { AutoBackupService } from '../../utils/autoBackupService';
import {
  getApproachingReminders,
  getReminderDaysSetting,
  setReminderDaysSetting,
  sendWhatsAppReminder
} from '../../utils/reminderService';
import { getApproachingCancellations, sendCancellationWhatsApp, ApproachingCancellation } from '../../utils/cancellationService';
import { CloudStatusResult } from '../../api/supabase';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  isViewer?: boolean;
  isCloud?: boolean;
  cloudStatus?: CloudStatusResult;
  onCheckCloud?: () => Promise<void> | void;
  isCheckingCloud?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onLogout?: () => void;
  customers?: Customer[];
  invoices?: Invoice[];
  onSelectTab?: (tab: string) => void;
  onViewCustomer?: (customer: Customer) => void;
  latestRegistrant?: Customer | null;
  onDismissLatestRegistrant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'admin',
  userRole = 'Administrator',
  isViewer = false,
  isCloud = false,
  cloudStatus,
  onCheckCloud,
  isCheckingCloud = false,
  onRefresh,
  isRefreshing = false,
  onLogout,
  customers = [],
  invoices = [],
  onSelectTab,
  onViewCustomer,
  latestRegistrant = null,
  onDismissLatestRegistrant,
}) => {
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isCloudPopoverOpen, setIsCloudPopoverOpen] = useState(false);
  const [reminderDays, setReminderDays] = useState<number>(getReminderDaysSetting());
  const [activeReminderTab, setActiveReminderTab] = useState<'due' | 'cancellation' | 'registrations'>('due');
  const [backupDisplayTime, setBackupDisplayTime] = useState<string | null>(null);
  const isDesktop = useMemo(() => AutoBackupService.isDesktopApp(), []);

  React.useEffect(() => {
    if (!isDesktop) return;
    const checkTime = () => {
      const savedDate = localStorage.getItem('karama_last_auto_backup_date');
      const savedTime = localStorage.getItem('karama_last_auto_backup_time');
      const todayStr = new Date().toISOString().split('T')[0];
      if (savedDate === todayStr) {
        setBackupDisplayTime(savedTime ? `Today ${savedTime}` : 'Today');
      } else if (savedDate) {
        setBackupDisplayTime(savedDate);
      } else {
        setBackupDisplayTime('Active');
      }
    };
    checkTime();
    const interval = setInterval(checkTime, 10000);
    return () => clearInterval(interval);
  }, [isDesktop]);

  const today = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Dubai',
  }).format(new Date());

  // Greeting based on Dubai local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Dismissed alert IDs tracked locally so dismissed alerts disappear immediately
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('karama_dismissed_alert_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleDismissAlert = (id: string) => {
    setDismissedAlertIds((prev) => {
      const updated = prev.includes(id) ? prev : [...prev, id];
      try {
        localStorage.setItem('karama_dismissed_alert_ids', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save dismissed alerts:', err);
      }
      return updated;
    });
  };

  // Approaching Due Reminders calculation
  const reminders = useMemo(() => {
    return getApproachingReminders(customers, invoices, reminderDays);
  }, [customers, invoices, reminderDays]);

  // Approaching scheduled cancellations calculation
  const approachingCancellations = useMemo(() => {
    return getApproachingCancellations(customers, Math.max(reminderDays, 15));
  }, [customers, reminderDays]);

  // Online registrations list
  const onlineRegistrations = useMemo(() => {
    return customers
      .filter((c) => c.managed_by === 'online_self_service')
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  }, [customers]);

  // Filter out any dismissed alert notifications
  const activeReminders = useMemo(() => {
    return reminders.filter((r) => !dismissedAlertIds.includes(r.customer.id));
  }, [reminders, dismissedAlertIds]);

  const activeCancellations = useMemo(() => {
    return approachingCancellations.filter((c) => !dismissedAlertIds.includes(c.customer.id));
  }, [approachingCancellations, dismissedAlertIds]);

  const activeRegistrations = useMemo(() => {
    return onlineRegistrations.filter((c) => !dismissedAlertIds.includes(c.id));
  }, [onlineRegistrations, dismissedAlertIds]);

  const totalAlertsCount = activeReminders.length + activeCancellations.length;

  const dueTodayCount = useMemo(() => {
    return activeReminders.filter((r) => r.isDueToday).length;
  }, [activeReminders]);

  const handleClearCurrentTabAlerts = () => {
    const idsToDismiss: string[] = [];
    if (activeReminderTab === 'due') {
      activeReminders.forEach((r) => idsToDismiss.push(r.customer.id));
    } else if (activeReminderTab === 'cancellation') {
      activeCancellations.forEach((c) => idsToDismiss.push(c.customer.id));
    } else if (activeReminderTab === 'registrations') {
      activeRegistrations.forEach((c) => idsToDismiss.push(c.id));
    }

    setDismissedAlertIds((prev) => {
      const updated = Array.from(new Set([...prev, ...idsToDismiss]));
      try {
        localStorage.setItem('karama_dismissed_alert_ids', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save dismissed alerts:', err);
      }
      return updated;
    });
  };

  const handleUpdateReminderDays = (days: number) => {
    setReminderDays(days);
    setReminderDaysSetting(days);
  };

  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-[#1e2025]/60 bg-[#121316]/90 backdrop-blur sticky top-0 z-30 w-full min-w-0 font-sans">
      <div className="min-w-0 pr-4">
        {/* Orbit Top Breadcrumb / Category Bar */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8e97a8] mb-1">
          <LayoutGrid className="w-3.5 h-3.5 text-white stroke-[2.2]" />
          <span className="text-white font-bold">Customer</span>
          <span className="text-[#555d6e]">•</span>
          <span className="font-mono text-[11px] text-[#788194]">
            {customers.filter((c) => c.status === 'active').length || 14} Live Projects
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight truncate font-sans">
          Good morning, <span className="capitalize">{userName}</span>
        </h2>
      </div>

      <div className="flex items-center gap-3 shrink-0 relative">
        {/* Real-time Status Bar Pill: Latest Online Registration (Automatically hides if customer is deleted) */}
        {(() => {
          const activeRegistrant =
            latestRegistrant &&
            customers.some(
              (c) => c.id === latestRegistrant.id || c.customer_code === latestRegistrant.customer_code
            )
              ? latestRegistrant
              : null;

          if (!activeRegistrant) return null;

          return (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 transition-all text-xs font-semibold shadow-sm hover:border-emerald-400 animate-in fade-in duration-300">
              <button
                type="button"
                onClick={() => onViewCustomer?.(activeRegistrant)}
                className="group flex items-center gap-2 text-emerald-300 cursor-pointer"
                title={`Latest registration: ${activeRegistrant.full_name} (${activeRegistrant.customer_code}). Click to open details.`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  New Reg
                </span>
                <span className="font-bold text-white group-hover:text-emerald-200 truncate max-w-[110px] sm:max-w-[160px]">
                  {activeRegistrant.full_name}
                </span>
                <span className="font-mono text-[10px] text-emerald-300/90 hidden sm:inline">
                  ({activeRegistrant.customer_code})
                </span>
              </button>

              {onDismissLatestRegistrant && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismissLatestRegistrant();
                  }}
                  className="p-0.5 text-emerald-400/60 hover:text-white hover:bg-emerald-900/60 rounded transition-colors cursor-pointer"
                  title="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })()}

        {/* Due Date Approaching Reminders & Cancellation Notices Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsRemindersOpen(!isRemindersOpen)}
            className={`p-2 rounded-xl border transition-all relative flex items-center gap-1.5 cursor-pointer ${
              totalAlertsCount > 0
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 shadow-md shadow-amber-500/10'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border-slate-700/60'
            }`}
            title={`Active Alerts: ${reminders.length} payment dues, ${approachingCancellations.length} upcoming cancellations within ${reminderDays} days`}
          >
            <Bell className="w-4 h-4" />
            {totalAlertsCount > 0 && (
              <span className="font-mono text-xs font-black text-amber-300">
                {totalAlertsCount}
              </span>
            )}
            {(dueTodayCount > 0 || activeCancellations.some((c) => c.isToday || c.daysRemaining === 1)) && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-1 right-1 animate-ping" />
            )}
          </button>

          {/* Interactive Reminders Dropdown Popover */}
          {isRemindersOpen && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#151c2c] border border-amber-500/40 shadow-2xl z-50 overflow-hidden animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-white">Approaching Alerts Hub</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                    {totalAlertsCount} Total
                  </span>
                </div>
                <button
                  onClick={() => setIsRemindersOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tab Switcher: Due Reminders vs Cancellations on Notice vs Online Registrations */}
              <div className="grid grid-cols-3 bg-slate-900 border-b border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveReminderTab('due')}
                  className={`py-2 px-2 flex items-center justify-center gap-1 transition-colors border-b-2 cursor-pointer ${
                    activeReminderTab === 'due'
                      ? 'border-amber-400 text-amber-300 bg-slate-800/60'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dues ({activeReminders.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveReminderTab('cancellation')}
                  className={`py-2 px-2 flex items-center justify-center gap-1 transition-colors border-b-2 cursor-pointer ${
                    activeReminderTab === 'cancellation'
                      ? 'border-rose-400 text-rose-300 bg-slate-800/60'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <CalendarX className="w-3.5 h-3.5 text-rose-400" />
                  <span>Leaving ({activeCancellations.length})</span>
                  {activeCancellations.some((c) => c.daysRemaining === 1) && (
                    <span className="font-mono text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 animate-pulse">
                      1d
                    </span>
                  )}
                  {activeCancellations.some((c) => c.daysRemaining === 0) && (
                    <span className="font-mono text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-500 text-white animate-pulse">
                      NOW
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveReminderTab('registrations')}
                  className={`py-2 px-2 flex items-center justify-center gap-1 transition-colors border-b-2 cursor-pointer ${
                    activeReminderTab === 'registrations'
                      ? 'border-emerald-400 text-emerald-300 bg-slate-800/60'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Online ({activeRegistrations.length})</span>
                </button>
              </div>

              {/* Alert Window Quick Switcher & Clear Button */}
              <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">Alert Window:</span>
                  <div className="flex items-center gap-1">
                    {[1, 3, 5, 7, 10, 15].map((d) => (
                      <button
                        key={d}
                        onClick={() => handleUpdateReminderDays(d)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                          reminderDays === d
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>

                {((activeReminderTab === 'due' && activeReminders.length > 0) ||
                  (activeReminderTab === 'cancellation' && activeCancellations.length > 0) ||
                  (activeReminderTab === 'registrations' && activeRegistrations.length > 0)) && (
                  <button
                    type="button"
                    onClick={handleClearCurrentTabAlerts}
                    className="text-[10px] text-slate-400 hover:text-amber-300 font-bold px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700/80 transition-colors cursor-pointer"
                    title="Clear and dismiss all alerts in this tab"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Content List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80 custom-scrollbar">
                {activeReminderTab === 'due' && (
                  activeReminders.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                      <div className="font-bold text-slate-300">No Pending Dues</div>
                      <div className="text-[11px] text-slate-500">
                        No active customer due alerts in the next {reminderDays} days.
                      </div>
                    </div>
                  ) : (
                    activeReminders.map((item) => {
                      const c = item.customer;
                      return (
                        <div
                          key={c.id}
                          className="p-3 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white truncate">
                                {c.full_name}
                              </span>
                              <span className="font-mono text-[10px] text-amber-400 font-bold">
                                #{c.customer_code}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                              <Building2 className="w-3 h-3 text-sky-400 shrink-0" />
                              <span>
                                {c.building_name_cache || 'Belrasheed'}{' '}
                                {c.apartment_cache ? `(Apt ${c.apartment_cache})` : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                📅 {item.targetDueDateDisplay}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${item.badgeStyle.bg} ${item.badgeStyle.text} ${item.badgeStyle.border}`}
                              >
                                {item.statusLabel}
                              </span>
                            </div>
                          </div>

                          {/* Quick WhatsApp Reminder, Pay & Dismiss */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                sendWhatsAppReminder(
                                  c,
                                  item.targetDueDateDisplay,
                                  item.daysRemaining,
                                  item.amountDue
                                );
                              }}
                              className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all shadow-sm cursor-pointer"
                              title="Send WhatsApp Reminder"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            </button>

                            <button
                              onClick={() => {
                                setIsRemindersOpen(false);
                                if (onViewCustomer) {
                                  onViewCustomer(c);
                                } else if (onSelectTab) {
                                  onSelectTab('overdue');
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                              title="View / Settle"
                            >
                              <span>Pay</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDismissAlert(c.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                              title="Delete / Dismiss this alert notification"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )
                )}

                {activeReminderTab === 'cancellation' && (
                  activeCancellations.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                      <div className="font-bold text-slate-300">No Cancellations Scheduled</div>
                      <div className="text-[11px] text-slate-500">
                        No customer cancellation alerts within the next {reminderDays} days.
                      </div>
                    </div>
                  ) : (
                    activeCancellations.map((item) => {
                      const c = item.customer;
                      return (
                        <div
                          key={c.id}
                          className="p-3 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white truncate">
                                {c.full_name}
                              </span>
                              <span className="font-mono text-[10px] text-amber-400 font-bold">
                                #{c.customer_code}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                              <Building2 className="w-3 h-3 text-sky-400 shrink-0" />
                              <span>
                                {c.building_name_cache || 'Building'}{' '}
                                {c.apartment_cache ? `(Apt ${c.apartment_cache})` : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                📅 Exit: {item.targetDateDisplay}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${item.badge.bg} ${item.badge.textColor} ${item.badge.border}`}
                              >
                                {item.badge.label}
                              </span>
                              <span className="text-[10px] font-mono text-amber-300 font-bold">
                                Due: {formatAED(item.proRata.proRataAmount)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => sendCancellationWhatsApp(item)}
                              className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all shadow-sm cursor-pointer"
                              title="Send WhatsApp Confirmation"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            </button>

                            <button
                              onClick={() => {
                                setIsRemindersOpen(false);
                                if (onViewCustomer) {
                                  onViewCustomer(c);
                                } else if (onSelectTab) {
                                  onSelectTab('customers');
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                              title="View Customer Profile"
                            >
                              <span>View</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDismissAlert(c.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                              title="Delete / Dismiss this alert notification"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )
                )}

                {activeReminderTab === 'registrations' && (
                  activeRegistrations.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs space-y-1">
                      <Globe className="w-6 h-6 text-emerald-400 mx-auto" />
                      <div className="font-bold text-slate-300">No Online Registrations</div>
                      <div className="text-[11px] text-slate-500">
                        Customers registered through the online link will appear here.
                      </div>
                    </div>
                  ) : (
                    activeRegistrations.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white truncate">
                              {c.full_name}
                            </span>
                            <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              #{c.customer_code}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                            <Building2 className="w-3 h-3 text-sky-400 shrink-0" />
                            <span>
                              {c.building_name_cache || c.building?.name || 'Area'}{' '}
                              {c.apartment_cache ? `(Apt ${c.apartment_cache})` : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                              {[
                                c.has_breakfast ? 'Breakfast' : null,
                                c.has_lunch ? 'Lunch' : null,
                                c.has_dinner ? 'Dinner' : null,
                              ]
                                .filter(Boolean)
                                .join(' + ') || 'Standard Plan'}
                            </span>
                            {c.dietary_preferences && (
                              <span className="text-[10px] text-amber-300/90 truncate max-w-[150px]" title={c.dietary_preferences}>
                                {c.dietary_preferences}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setIsRemindersOpen(false);
                              if (onViewCustomer) {
                                onViewCustomer(c);
                              } else if (onSelectTab) {
                                onSelectTab('customers');
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                            title="View Customer Profile"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDismissAlert(c.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                            title="Delete / Dismiss this alert notification"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>

              {/* Dropdown Footer Link */}
              <div className="px-4 py-2.5 bg-[#111827] border-t border-slate-800 text-center">
                <button
                  onClick={() => {
                    setIsRemindersOpen(false);
                    if (onSelectTab) onSelectTab(activeReminderTab === 'due' ? 'overdue' : 'customers');
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>
                    {activeReminderTab === 'registrations'
                      ? 'Open Online Customers in Directory'
                      : activeReminderTab === 'cancellation'
                      ? 'Open Customer Directory'
                      : 'Open Full Overdue & Reminders Hub'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cloud Live Status Indicator & Diagnostics Popover */}
        {!isViewer && (
          <div className="relative">
          <button
            onClick={() => setIsCloudPopoverOpen(!isCloudPopoverOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-sm transition-all cursor-pointer ${
              cloudStatus?.isLive
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 shadow-emerald-500/10'
                : isCheckingCloud || cloudStatus?.status === 'checking'
                ? 'bg-slate-800/90 border-slate-700 text-slate-300'
                : cloudStatus?.status === 'tables_missing'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 shadow-amber-500/10'
                : cloudStatus?.status === 'local'
                ? 'bg-slate-800/80 border-slate-700/70 text-slate-300 hover:bg-slate-800'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25 shadow-rose-500/10'
            }`}
            title={`Cloud Database: ${cloudStatus?.label || (isCloud ? 'Cloud Live' : 'Local Mode')} (Click for live diagnostics)`}
          >
            {/* Live Status Indicator Dot */}
            {cloudStatus?.isLive ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
            ) : isCheckingCloud || cloudStatus?.status === 'checking' ? (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            ) : cloudStatus?.status === 'tables_missing' ? (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            ) : cloudStatus?.status === 'local' ? (
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            )}

            {/* Cloud Icon */}
            {cloudStatus?.isLive ? (
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            ) : isCheckingCloud || cloudStatus?.status === 'checking' ? (
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            ) : cloudStatus?.status === 'tables_missing' ? (
              <Cloud className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <CloudOff className="w-3.5 h-3.5 text-rose-400" />
            )}

            <span>{cloudStatus?.label || (isCloud ? 'Cloud Live' : 'Cloud Offline')}</span>
          </button>

          {/* Cloud Diagnostics & Status Dropdown Popover */}
          {isCloudPopoverOpen && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#151c2c] border border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Popover Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-[#182133] to-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-white">Cloud Database Live Status</span>
                </div>
                <button
                  onClick={() => setIsCloudPopoverOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-4 space-y-3.5 text-xs">
                <div
                  className={`p-3 rounded-xl border flex items-start gap-3 ${
                    cloudStatus?.isLive
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : cloudStatus?.status === 'tables_missing'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : cloudStatus?.status === 'local'
                      ? 'bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {cloudStatus?.isLive ? (
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                    ) : (
                      <div
                        className={`w-3 h-3 rounded-full ${
                          cloudStatus?.status === 'tables_missing'
                            ? 'bg-amber-400'
                            : cloudStatus?.status === 'local'
                            ? 'bg-slate-500'
                            : 'bg-rose-500'
                        }`}
                      />
                    )}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="font-bold text-sm text-white flex items-center gap-2 flex-wrap">
                      <span>{cloudStatus?.label || (isCloud ? 'Cloud Live' : 'Cloud Offline')}</span>
                      {cloudStatus?.latencyMs !== undefined && (
                        <span className="font-mono text-[10px] font-normal px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {cloudStatus.latencyMs} ms
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      {cloudStatus?.message ||
                        (isCloud
                          ? 'Connected to cloud database. Real-time synchronization active.'
                          : 'Operating in local offline mode. Data is stored safely on this computer.')}
                    </p>
                    {cloudStatus?.details && (
                      <p className="text-[10px] font-mono text-slate-400 bg-slate-900/90 p-1.5 rounded border border-slate-800 break-words">
                        {cloudStatus.details}
                      </p>
                    )}
                  </div>
                </div>

                {/* Diagnostics Grid */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Database Engine:</span>
                    <span className="font-bold text-slate-200">Supabase Cloud PostgreSQL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Live Status:</span>
                    <span
                      className={`font-bold ${
                        cloudStatus?.isLive
                          ? 'text-emerald-400'
                          : cloudStatus?.status === 'tables_missing'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {cloudStatus?.isLive
                        ? '● LIVE (Connected)'
                        : cloudStatus?.status === 'tables_missing'
                        ? '▲ Setup Needed'
                        : '■ OFFLINE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Database Engine:</span>
                    <span className="font-semibold text-emerald-400">
                      Central Supabase Cloud
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Local Cache:</span>
                    <span className="text-emerald-400 font-semibold">Active &amp; Persistent</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Last Checked:</span>
                    <span className="font-mono text-slate-300">
                      {cloudStatus?.lastChecked || 'Just now'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={async () => {
                      if (onCheckCloud) await onCheckCloud();
                    }}
                    disabled={isCheckingCloud}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        isCheckingCloud ? 'animate-spin text-amber-400' : 'text-slate-400'
                      }`}
                    />
                    <span>{isCheckingCloud ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsCloudPopoverOpen(false);
                      if (onRefresh) onRefresh();
                    }}
                    className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    title="Force sync latest cloud database records"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Now</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 shadow-sm transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`}
            />
          </button>
        )}

        {/* Windows Desktop Auto-Backup Status Pill */}
        {isDesktop && (
          <button
            type="button"
            onClick={() => AutoBackupService.openBackupFolder()}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-500/30 bg-sky-950/40 hover:bg-sky-900/60 transition-all text-xs font-bold text-sky-300 shadow-sm cursor-pointer"
            title="Windows Desktop Daily Backup: Saved to Documents\Karama Mess Backups. Click to open folder."
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Backup: {backupDisplayTime || 'Active'}</span>
          </button>
        )}

        {/* Date Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs font-bold shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>{today}</span>
        </div>

        {/* User Pill & Logout */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 pl-2 pr-3.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-sm">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border font-bold text-xs ${
              isViewer 
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                : 'bg-slate-700 text-amber-400 border-slate-600'
            }`}>
              {isViewer ? '👁️' : <User className="w-3.5 h-3.5" />}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white capitalize leading-tight flex items-center gap-1.5">
                <span>{userName}</span>
                {isViewer && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Read Only
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight font-medium">
                {userRole}
              </div>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/15 border border-slate-700/60 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-colors shadow-sm"
              title="Logout / Switch User"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
