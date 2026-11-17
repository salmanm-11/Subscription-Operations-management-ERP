import React, { useState, useMemo, useEffect } from 'react';
import {
  AlertCircle,
  Phone,
  MessageSquare,
  CreditCard,
  Search,
  X,
  Clock,
  Calendar,
  Bell,
  Eye,
  CheckCircle2,
  Building2,
  Filter,
  Printer,
  FileSpreadsheet,
  Download,
  Receipt,
  Check,
  RotateCcw
} from 'lucide-react';
import { Customer, Building, MealPlan, Invoice, Payment, PaymentMethod } from '../../types';
import { formatAED } from '../../utils/currency';
import { getMonthlySubscriptionRate } from '../../utils/billingCycleService';
import { exportTableToExcel } from '../../utils/excelService';
import {
  getApproachingReminders,
  getCustomerDueDateInfo,
  getReminderDaysSetting,
  setReminderDaysSetting,
  sendWhatsAppReminder,
  CustomerDueDateInfo
} from '../../utils/reminderService';
import { CustomerDetailModal } from '../customers/CustomerDetailModal';

interface OverdueListProps {
  customers: Customer[];
  buildings?: Building[];
  mealPlans?: MealPlan[];
  invoices?: Invoice[];
  payments?: Payment[];
  isReadOnly?: boolean;
  onOpenPayment?: (customer: Customer) => void;
  onRecordPayment?: (payment: Partial<Payment>) => Promise<void> | void;
  onSaveCustomer?: (customer: Partial<Customer>) => Promise<void> | void;
  onDeleteCustomer?: (id: string) => void;
}

export const OverdueList: React.FC<OverdueListProps> = ({
  customers,
  buildings = [],
  mealPlans = [],
  invoices = [],
  payments = [],
  isReadOnly = false,
  onOpenPayment,
  onRecordPayment,
  onSaveCustomer,
  onDeleteCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<'overdue' | 'reminders' | 'cleared'>('overdue');
  const [searchTerm, setSearchTerm] = useState('');
  const [reminderDays, setReminderDays] = useState<number>(getReminderDaysSetting());
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Cleared Dues History Filters
  const [clearedTimeFilter, setClearedTimeFilter] = useState<'all' | 'month' | 'week' | 'today'>('all');
  const [clearedMethodFilter, setClearedMethodFilter] = useState<string>('all');
  const [clearedStatusFilter, setClearedStatusFilter] = useState<'all' | 'settled' | 'partial'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Quick Settle Due Modal State
  const [settlingCustomer, setSettlingCustomer] = useState<Customer | null>(null);
  const [settleAmount, setSettleAmount] = useState<number>(0);
  const [settleMethod, setSettleMethod] = useState<PaymentMethod>('cash');
  const [settleDate, setSettleDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [settleRef, setSettleRef] = useState<string>('');
  const [settleNotes, setSettleNotes] = useState<string>('');
  const [isSubmittingSettle, setIsSubmittingSettle] = useState(false);
  const [clearedSuccessMessage, setClearedSuccessMessage] = useState<{
    text: string;
    customerName: string;
    amount: number;
    paymentNumber?: string;
  } | null>(null);

  // Map of customers by ID & Code for fast and accurate lookups
  const customerMap = useMemo(() => {
    const map = new Map<string, Customer>();
    customers.forEach((c) => {
      map.set(c.id, c);
      if (c.customer_code) map.set(c.customer_code, c);
    });
    return map;
  }, [customers]);

  // Keep selectedCustomer fresh whenever customers state updates
  useEffect(() => {
    if (selectedCustomer) {
      const fresh = customers.find(
        (c) => c.id === selectedCustomer.id || c.customer_code === selectedCustomer.customer_code
      );
      if (
        fresh &&
        (fresh.total_overdue !== selectedCustomer.total_overdue ||
          fresh.payment_rating !== selectedCustomer.payment_rating ||
          fresh.payment_made_up_to_date !== selectedCustomer.payment_made_up_to_date)
      ) {
        setSelectedCustomer(fresh);
      }
    }
  }, [customers, selectedCustomer]);

  // Sanitize raw concatenated notes
  const sanitizeRemarks = (raw: string | undefined): string => {
    if (!raw) return '-';
    let s = raw.replace(/^(\d+\s*\|\s*)+/g, '');
    const parts = s.split(/\s*\|\s*/);
    const unique: string[] = [];
    for (const p of parts) {
      const trimmed = p.trim();
      if (
        !trimmed ||
        trimmed === '0' ||
        trimmed === '1' ||
        trimmed === '-1' ||
        /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
      )
        continue;
      if (!unique.some((u) => u.toLowerCase() === trimmed.toLowerCase())) {
        unique.push(trimmed);
      }
    }
    return unique.length > 0 ? unique.join(' • ') : raw;
  };

  // 1. Overdue Debtors (Balance > 0)
  const allDebtors = useMemo(() => {
    return customers
      .filter((c) => (c.total_overdue || 0) > 0)
      .sort((a, b) => (b.total_overdue || 0) - (a.total_overdue || 0));
  }, [customers]);

  const filteredDebtors = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return allDebtors;
    return allDebtors.filter((c) => {
      const remarks = sanitizeRemarks(c.notes);
      return (
        c.full_name.toLowerCase().includes(term) ||
        (c.customer_code && c.customer_code.toLowerCase().includes(term)) ||
        (c.building_name_cache && c.building_name_cache.toLowerCase().includes(term)) ||
        (c.apartment_cache && c.apartment_cache.toLowerCase().includes(term)) ||
        (c.phone && c.phone.toLowerCase().includes(term)) ||
        (c.payment_rating && c.payment_rating.toLowerCase().includes(term)) ||
        remarks.toLowerCase().includes(term) ||
        c.total_overdue?.toString().includes(term)
      );
    });
  }, [allDebtors, searchTerm]);

  const totalDues = useMemo(() => {
    return filteredDebtors.reduce((acc, c) => acc + (c.total_overdue || 0), 0);
  }, [filteredDebtors]);

  // 2. Approaching Due Date Reminders (Due within X days)
  const allReminders = useMemo(() => {
    return getApproachingReminders(customers, invoices, reminderDays);
  }, [customers, invoices, reminderDays]);

  const filteredReminders = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return allReminders;
    return allReminders.filter((item) => {
      const c = item.customer;
      return (
        c.full_name.toLowerCase().includes(term) ||
        (c.customer_code && c.customer_code.toLowerCase().includes(term)) ||
        (c.building_name_cache && c.building_name_cache.toLowerCase().includes(term)) ||
        (c.apartment_cache && c.apartment_cache.toLowerCase().includes(term)) ||
        (c.phone && c.phone.toLowerCase().includes(term)) ||
        item.targetDueDateDisplay.toLowerCase().includes(term) ||
        item.statusLabel.toLowerCase().includes(term)
      );
    });
  }, [allReminders, searchTerm]);

  const totalApproachingAmount = useMemo(() => {
    return filteredReminders.reduce((acc, item) => acc + item.amountDue, 0);
  }, [filteredReminders]);

  const dueTodayCount = useMemo(() => {
    return allReminders.filter((r) => r.isDueToday).length;
  }, [allReminders]);

  // 3. Cleared Dues & Settlement History
  const clearedHistory = useMemo(() => {
    return payments
      .filter((p) => !p.is_reversed)
      .map((p) => {
        const cust = p.customer || (p.customer_id ? customerMap.get(p.customer_id) : undefined);
        return {
          ...p,
          resolvedCustomer: cust,
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.payment_date || a.created_at || '').getTime();
        const dateB = new Date(b.payment_date || b.created_at || '').getTime();
        return dateB - dateA;
      });
  }, [payments, customerMap]);

  const totalClearedAmount = useMemo(() => {
    return clearedHistory.reduce((acc, p) => acc + (p.amount || 0), 0);
  }, [clearedHistory]);

  const filteredClearedHistory = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonth = todayStr.substring(0, 7); // YYYY-MM
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return clearedHistory.filter((item) => {
      // 1. Time Filter
      if (clearedTimeFilter === 'today') {
        const itemDate = item.payment_date || item.created_at?.split('T')[0] || '';
        if (itemDate !== todayStr) return false;
      } else if (clearedTimeFilter === 'month') {
        const itemDate = item.payment_date || item.created_at?.split('T')[0] || '';
        if (!itemDate.startsWith(currentMonth)) return false;
      } else if (clearedTimeFilter === 'week') {
        const itemDate = new Date(item.payment_date || item.created_at || '');
        if (isNaN(itemDate.getTime()) || itemDate < oneWeekAgo) return false;
      }

      // 2. Method Filter
      if (clearedMethodFilter !== 'all' && item.payment_method !== clearedMethodFilter) {
        return false;
      }

      // 3. Status Filter
      if (clearedStatusFilter === 'settled') {
        if ((item.resolvedCustomer?.total_overdue || 0) > 0) return false;
      } else if (clearedStatusFilter === 'partial') {
        if ((item.resolvedCustomer?.total_overdue || 0) <= 0) return false;
      }

      // 4. Search Filter
      if (!term) return true;
      const cust = item.resolvedCustomer;
      const notes = item.notes?.toLowerCase() || '';
      const rec = item.payment_number?.toLowerCase() || '';
      const ref = item.reference_number?.toLowerCase() || '';
      return (
        rec.includes(term) ||
        ref.includes(term) ||
        notes.includes(term) ||
        item.amount?.toString().includes(term) ||
        item.payment_method?.toLowerCase().includes(term) ||
        (cust?.full_name && cust.full_name.toLowerCase().includes(term)) ||
        (cust?.customer_code && cust.customer_code.toLowerCase().includes(term)) ||
        (cust?.building_name_cache && cust.building_name_cache.toLowerCase().includes(term)) ||
        (cust?.apartment_cache && cust.apartment_cache.toLowerCase().includes(term)) ||
        (cust?.phone && cust.phone.toLowerCase().includes(term))
      );
    });
  }, [clearedHistory, searchTerm, clearedTimeFilter, clearedMethodFilter, clearedStatusFilter]);

  const filteredClearedTotalAmount = useMemo(() => {
    return filteredClearedHistory.reduce((acc, p) => acc + (p.amount || 0), 0);
  }, [filteredClearedHistory]);

  const handleUpdateReminderDays = (days: number) => {
    setReminderDays(days);
    setReminderDaysSetting(days);
  };

  // Open Quick Settle Modal
  const handleOpenQuickSettle = (c: Customer) => {
    const overdueAmt = c.total_overdue || 0;
    const defaultAmount = overdueAmt > 0 ? overdueAmt : getMonthlySubscriptionRate(c).effectiveRate;
    setSettlingCustomer(c);
    setSettleAmount(defaultAmount);
    setSettleMethod('cash');
    setSettleDate(new Date().toISOString().split('T')[0]);
    setSettleRef('');
    setSettleNotes(`Cleared overdue mess balance for ${c.full_name}`);
  };

  // Confirm Quick Settle Due
  const handleConfirmQuickSettle = async () => {
    if (!settlingCustomer || !onRecordPayment) return;
    try {
      setIsSubmittingSettle(true);
      const paidAmt = Number(settleAmount);
      const payload: Partial<Payment> = {
        customer_id: settlingCustomer.id,
        amount: paidAmt,
        payment_date: settleDate,
        payment_method: settleMethod,
        reference_number: settleRef.trim() || undefined,
        notes: settleNotes.trim() || `Settled overdue mess charges of AED ${paidAmt}`,
      };

      await onRecordPayment(payload);

      setClearedSuccessMessage({
        text: `Due of ${formatAED(paidAmt)} for ${settlingCustomer.full_name} has been cleared successfully!`,
        customerName: settlingCustomer.full_name,
        amount: paidAmt,
      });

      setSettlingCustomer(null);
      setTimeout(() => setClearedSuccessMessage(null), 8000);
    } catch (err: any) {
      console.error('Error settling due:', err);
      alert('Failed to settle due: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmittingSettle(false);
    }
  };

  // WhatsApp Overdue Notice
  const handleSendWhatsAppOverdue = (cust: Customer) => {
    const text =
      `*Karama Homely Mess - Payment Reminder*\n\n` +
      `Dear ${cust.full_name},\n` +
      `Friendly reminder that your mess dues of *${formatAED(cust.total_overdue)}* is pending.\n` +
      `Kindly arrange settlement at your earliest convenience.\n` +
      `Thank you!\n*Karama Homely Mess*`;

    let phone = (cust.phone || '').replace(/[^0-9]/g, '');
    if (phone.startsWith('05')) phone = '971' + phone.substring(1);
    else if (phone.length === 9) phone = '971' + phone;

    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // WhatsApp Confirmation for Cleared Due
  const handleSendWhatsAppCleared = (item: any) => {
    const cust = item.resolvedCustomer;
    const name = cust?.full_name || 'Valued Customer';
    const amountStr = formatAED(item.amount);
    const recNo = item.payment_number || 'N/A';
    const dateStr = item.payment_date || new Date().toISOString().split('T')[0];
    const isZeroDue = (cust?.total_overdue || 0) === 0;
    const dueStatus = isZeroDue
      ? 'All mess dues cleared in full (AED 0.00)'
      : `Remaining Due Balance: ${formatAED(cust?.total_overdue)}`;

    const text =
      `*Karama Homely Mess - Payment Receipt*\n\n` +
      `Dear *${name}*,\n` +
      `Your payment of *${amountStr}* has been received with thanks!\n\n` +
      `• *Receipt No:* ${recNo}\n` +
      `• *Amount Paid:* ${amountStr}\n` +
      `• *Payment Date:* ${dateStr}\n` +
      `• *Method:* ${(item.payment_method || 'Cash').toUpperCase().replace('_', ' ')}\n` +
      `• *Status:* ${dueStatus}\n\n` +
      `Thank you for choosing Karama Homely Mess!\n*Karama Homely Mess, Dubai*`;

    let phone = (cust?.phone || '').replace(/[^0-9]/g, '');
    if (phone.startsWith('05')) phone = '971' + phone.substring(1);
    else if (phone.length === 9) phone = '971' + phone;

    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Export Cleared Dues to Excel
  const handleExportClearedExcel = () => {
    const data = filteredClearedHistory.map((p) => ({
      'Receipt Number': p.payment_number || '-',
      'Payment Date': p.payment_date || '-',
      'Customer Name': p.resolvedCustomer?.full_name || 'Walk-in / Unknown',
      'Customer Code': p.resolvedCustomer?.customer_code || '-',
      'Building': p.resolvedCustomer?.building_name_cache || '-',
      'Apartment': p.resolvedCustomer?.apartment_cache ? `Apt ${p.resolvedCustomer.apartment_cache}` : '-',
      'Phone': p.resolvedCustomer?.phone || '-',
      'Amount Cleared (AED)': p.amount || 0,
      'Payment Method': (p.payment_method || 'cash').replace('_', ' ').toUpperCase(),
      'Reference / Cheque': p.reference_number || '-',
      'Account Status':
        (p.resolvedCustomer?.total_overdue || 0) === 0
          ? 'Fully Settled (0 Dues)'
          : `Partial (AED ${p.resolvedCustomer?.total_overdue} remaining)`,
      'Remarks / Purpose': p.notes || 'Settlement of mess dues',
    }));

    exportTableToExcel(data, `Karama_Cleared_Dues_History_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-4 max-w-full min-w-0">
      {/* Top Header & Metrics Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Overdue Accounts &amp; Due Date Reminders
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
            Track delinquent balances, clear outstanding dues, and view full settlement history
          </p>
        </div>

        {/* Top KPI Cards */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {/* Overdue KPI */}
          <div className="bg-rose-500/15 border border-rose-500/35 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-md shadow-black/20">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-extrabold text-rose-300 tracking-wider">
                Total Overdue
              </div>
              <div className="text-base sm:text-lg font-black text-rose-400 font-mono">
                {formatAED(totalDues)}
              </div>
            </div>
          </div>

          {/* Due Soon KPI */}
          <div className="bg-amber-500/15 border border-amber-500/35 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-md shadow-black/20">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-extrabold text-amber-300 tracking-wider">
                Approaching Due ({reminderDays}d)
              </div>
              <div className="text-base sm:text-lg font-black text-amber-400 font-mono">
                {allReminders.length} <span className="text-xs font-medium text-slate-400">({formatAED(totalApproachingAmount)})</span>
              </div>
            </div>
          </div>

          {/* Cleared Dues KPI */}
          <div className="bg-emerald-500/15 border border-emerald-500/35 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-md shadow-black/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-extrabold text-emerald-300 tracking-wider">
                Total Cleared Dues
              </div>
              <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                {formatAED(totalClearedAmount)} <span className="text-xs font-medium text-slate-400">({clearedHistory.length} Settled)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Banner (Appears right after clearing a due) */}
      {clearedSuccessMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn text-white shadow-xl shadow-emerald-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                <span>{clearedSuccessMessage.text}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 font-bold">
                  Dues Settled
                </span>
              </div>
              <div className="text-[11px] text-emerald-300/80 mt-0.5">
                The customer account has been updated to 0 dues balance and logged to the permanent audit history.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setActiveTab('cleared')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>View in Cleared Dues History</span>
              <span>→</span>
            </button>
            <button
              onClick={() => setClearedSuccessMessage(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('overdue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer ${
            activeTab === 'overdue'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-rose-500/10'
              : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Overdue Balances</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-rose-300 border border-rose-500/30">
            {allDebtors.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer ${
            activeTab === 'reminders'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-amber-500/10'
              : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-amber-400" />
          <span>Approaching Due Reminders</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300 border border-amber-500/30">
            {allReminders.length}
          </span>
          {dueTodayCount > 0 && (
            <span className="font-mono text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-500 text-white animate-pulse">
              {dueTodayCount} TODAY
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('cleared')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer ${
            activeTab === 'cleared'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cleared Dues History</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-emerald-300 border border-emerald-500/30">
            {clearedHistory.length}
          </span>
        </button>
      </div>

      {/* TAB 2 CONTROLS: Reminder Alert Window Chips (When Reminders Tab is selected) */}
      {activeTab === 'reminders' && (
        <div className="bg-[#151c2c] border border-amber-500/30 rounded-xl p-3 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-white">Reminder Alert Window:</span>
            <span className="text-xs text-slate-400">Show customers due within:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[1, 3, 5, 7, 10, 15].map((d) => (
              <button
                key={d}
                onClick={() => handleUpdateReminderDays(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                  reminderDays === d
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                {d} Day{d > 1 ? 's' : ''} {d === 5 ? '★' : ''}
              </button>
            ))}

            <div className="flex items-center gap-1 ml-1 text-xs text-slate-400">
              <span>Custom:</span>
              <input
                type="number"
                min="1"
                max="60"
                value={reminderDays}
                onChange={(e) => handleUpdateReminderDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-white text-xs font-mono font-bold text-center focus:outline-none focus:border-amber-500"
              />
              <span>days</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 CONTROLS: Cleared Dues History Filters Toolbar */}
      {activeTab === 'cleared' && (
        <div className="bg-[#151c2c] border border-emerald-500/30 rounded-xl p-3 shadow-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Time Filter:</span>
            </span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(
                [
                  { id: 'all', label: 'All History' },
                  { id: 'month', label: 'This Month' },
                  { id: 'week', label: 'This Week' },
                  { id: 'today', label: 'Today' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setClearedTimeFilter(f.id)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    clearedTimeFilter === f.id
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Method Filter */}
            <select
              value={clearedMethodFilter}
              onChange={(e) => setClearedMethodFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Methods</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="online">Online / Card</option>
              <option value="cheque">Cheque</option>
            </select>

            {/* Status Filter */}
            <select
              value={clearedStatusFilter}
              onChange={(e) => setClearedStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Accounts</option>
              <option value="settled">Fully Settled (0 Balance)</option>
              <option value="partial">Partial Settlements</option>
            </select>
          </div>

          {/* Export to Excel */}
          <button
            onClick={handleExportClearedExcel}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer"
            title="Download Cleared Dues Audit Report in Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Cleared Dues (.xlsx)</span>
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#151c2c] border border-[#222f47]/60 rounded-xl p-3 shadow-md shadow-black/20">
        <div className="relative flex-1 min-w-[200px] cursor-text">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === 'overdue'
                ? 'Search overdue accounts by name, code, building, room, remarks...'
                : activeTab === 'reminders'
                ? 'Search approaching due customers by name, code, building, due date...'
                : 'Search cleared dues history by customer name, code, receipt #, building, notes...'
            }
            className="w-full pl-10 pr-9 py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-xs font-bold text-slate-300 px-2 shrink-0">
          {activeTab === 'overdue' ? (
            <span>
              Showing <b className="text-rose-400">{filteredDebtors.length}</b> overdue customer accounts
            </span>
          ) : activeTab === 'reminders' ? (
            <span>
              Showing <b className="text-amber-400">{filteredReminders.length}</b> customers due in next{' '}
              <b className="text-white">{reminderDays} days</b>
            </span>
          ) : (
            <span>
              Showing <b className="text-emerald-400">{filteredClearedHistory.length}</b> cleared settlements{' '}
              <span className="text-slate-400">({formatAED(filteredClearedTotalAmount)})</span>
            </span>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: OVERDUE ACCOUNTS TABLE                        */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'overdue' && (
        <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left min-w-[1140px]">
              <thead>
                <tr className="bg-[#0f1422] text-slate-300 border-b border-slate-700/80 text-xs uppercase tracking-wider font-bold">
                  <th className="py-3 px-3.5 whitespace-nowrap min-w-[160px]">Customer</th>
                  <th className="py-3 px-3.5 whitespace-nowrap min-w-[150px]">Building &amp; Apt</th>
                  <th className="py-3 px-3 whitespace-nowrap min-w-[120px]">Contact</th>
                  <th className="py-3 px-3 whitespace-nowrap min-w-[120px]">Billed Up to</th>
                  <th className="py-3 px-2.5 text-center whitespace-nowrap min-w-[90px]">Rating</th>
                  <th className="py-3 px-3.5 min-w-[180px]">Follow-up Remarks</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap min-w-[120px]">Overdue (AED)</th>
                  <th className="py-3 px-3.5 text-right whitespace-nowrap min-w-[140px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                {filteredDebtors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                      {searchTerm
                        ? 'No overdue accounts match your search filter.'
                        : '🎉 Excellent! All customer accounts are fully settled. No overdue balances.'}
                    </td>
                  </tr>
                ) : (
                  filteredDebtors.map((c) => {
                    const remarks = sanitizeRemarks(c.notes);
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCustomer(c)}
                        className="hover:bg-slate-800/50 cursor-pointer transition-colors group select-none"
                        title="Click to view full 360° customer profile & pay bill"
                      >
                        {/* Customer Name & Code */}
                        <td className="py-3.5 px-4 min-w-[180px]">
                          <div className="font-bold text-white text-sm sm:text-base tracking-tight group-hover:text-amber-300 transition-colors">
                            {c.full_name}
                          </div>
                          <span className="inline-block mt-0.5 font-mono text-amber-400 font-bold text-xs">
                            #{c.customer_code}
                          </span>
                        </td>

                        {/* Building & Apt */}
                        <td className="py-3.5 px-4 text-slate-200">
                          <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>{c.building_name_cache || 'Belrasheed Building'}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium mt-0.5 ml-5">
                            Apt {c.apartment_cache || 'N/A'}
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {c.phone ? (
                            <a
                              href={`tel:${c.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-xs text-slate-200 hover:text-amber-400 font-bold"
                            >
                              <Phone className="w-3.5 h-3.5 text-amber-400/90" />
                              <span>{c.phone}</span>
                            </a>
                          ) : (
                            <span className="text-slate-600 text-xs">-</span>
                          )}
                        </td>

                        {/* Billed Up to */}
                        <td className="py-3.5 px-4 text-slate-300 text-xs whitespace-nowrap font-mono">
                          {c.billed_up_to_date || c.billing_end_date || '31 Oct 2026'}
                        </td>

                        {/* Rating Badge */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm whitespace-nowrap ${
                              c.payment_rating === 'Bad'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/35'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/35'
                            }`}
                          >
                            {c.payment_rating || 'Late Payer'}
                          </span>
                        </td>

                        {/* Follow-up Remarks */}
                        <td className="py-3.5 px-4 max-w-[260px]">
                          <div className="text-slate-300 text-xs font-medium leading-relaxed line-clamp-2">
                            {remarks}
                          </div>
                        </td>

                        {/* Total Overdue */}
                        <td className="py-3.5 px-4 text-right font-black whitespace-nowrap text-base font-mono drop-shadow-sm text-rose-400">
                          {formatAED(c.total_overdue)}
                        </td>

                        {/* Action Options */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap min-w-[140px]">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendWhatsAppOverdue(c);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                              title="Send Overdue WhatsApp Reminder"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>

                            {/* 1-Click Clear Due Button */}
                            {!isReadOnly && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenQuickSettle(c);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                                title="Clear Due Balance"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Clear Due</span>
                              </button>
                            )}

                            {/* View 360 Profile */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCustomer(c);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
                              title="View Full Profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: APPROACHING DUE REMINDERS TABLE               */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'reminders' && (
        <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left min-w-[1140px]">
              <thead>
                <tr className="bg-[#0f1422] text-slate-300 border-b border-slate-700/80 text-xs uppercase tracking-wider font-bold">
                  <th className="py-3 px-3.5 whitespace-nowrap min-w-[160px]">Customer</th>
                  <th className="py-3 px-3.5 whitespace-nowrap min-w-[150px]">Building &amp; Apt</th>
                  <th className="py-3 px-3 whitespace-nowrap min-w-[120px]">Phone</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[140px]">Due Date (This Date)</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[140px]">Countdown / Due In</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap min-w-[130px]">Expected Fee (AED)</th>
                  <th className="py-3 px-3.5 text-right whitespace-nowrap min-w-[150px]">
                    Reminder Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                {filteredReminders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                      {searchTerm
                        ? 'No approaching payment reminders match your search filter.'
                        : `No customer accounts due within the next ${reminderDays} days. All subscriptions are clear!`}
                    </td>
                  </tr>
                ) : (
                  filteredReminders.map((item) => {
                    const c = item.customer;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCustomer(c)}
                        className="hover:bg-slate-800/50 cursor-pointer transition-colors group select-none"
                        title="Click to view full 360° customer profile & pay bill"
                      >
                        {/* Customer */}
                        <td className="py-3.5 px-4 min-w-[180px]">
                          <div className="font-bold text-white text-sm sm:text-base tracking-tight group-hover:text-amber-300 transition-colors">
                            {c.full_name}
                          </div>
                          <span className="inline-block mt-0.5 font-mono text-amber-400 font-bold text-xs">
                            #{c.customer_code}
                          </span>
                        </td>

                        {/* Building & Apt */}
                        <td className="py-3.5 px-4 text-slate-200">
                          <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>{c.building_name_cache || 'Belrasheed Building'}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium mt-0.5 ml-5">
                            Apt {c.apartment_cache || 'N/A'}
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {c.phone ? (
                            <a
                              href={`tel:${c.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-xs text-slate-200 hover:text-amber-400 font-bold font-mono"
                            >
                              <Phone className="w-3.5 h-3.5 text-amber-400/90" />
                              <span>{c.phone}</span>
                            </a>
                          ) : (
                            <span className="text-slate-600 text-xs">-</span>
                          )}
                        </td>

                        {/* Due Date: "The person should be due in this date" */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700/80 font-mono text-xs font-bold text-white shadow-sm">
                            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{item.targetDueDateDisplay}</span>
                          </div>
                        </td>

                        {/* Countdown / Due In Badge */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${item.badgeStyle.bg} ${item.badgeStyle.text} ${item.badgeStyle.border}`}
                          >
                            {item.statusLabel}
                          </span>
                        </td>

                        {/* Expected Amount */}
                        <td className="py-3.5 px-4 text-right font-black whitespace-nowrap text-base font-mono text-white">
                          {formatAED(item.amountDue)}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap min-w-[150px]">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Send WhatsApp Reminder */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sendWhatsAppReminder(
                                  c,
                                  item.targetDueDateDisplay,
                                  item.daysRemaining,
                                  item.amountDue
                                );
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                              title={`Send Due Reminder to ${c.full_name} on WhatsApp`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Remind</span>
                            </button>

                            {/* 1-Click Clear / Settle Due */}
                            {!isReadOnly && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenQuickSettle(c);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
                                title="Clear / Settle Due"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Settle</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: CLEARED DUES & SETTLEMENT HISTORY TABLE       */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'cleared' && (
        <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left min-w-[1140px]">
              <thead>
                <tr className="bg-[#0f1422] text-slate-300 border-b border-slate-700/80 text-xs uppercase tracking-wider font-bold">
                  <th className="py-3 px-3.5 whitespace-nowrap min-w-[140px]">Receipt # &amp; Date</th>
                  <th className="py-3 px-3.5 whitespace-nowrap min-w-[150px]">Customer</th>
                  <th className="py-3 px-3.5 whitespace-nowrap min-w-[150px]">Building &amp; Apt</th>
                  <th className="py-3 px-3.5 text-right whitespace-nowrap min-w-[130px]">Cleared Amount (AED)</th>
                  <th className="py-3 px-3 whitespace-nowrap min-w-[110px]">Payment Method</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[130px]">Account Status Now</th>
                  <th className="py-3 px-3.5 min-w-[180px]">Remarks / Purpose</th>
                  <th className="py-3 px-3.5 text-right whitespace-nowrap min-w-[130px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                {filteredClearedHistory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                      {searchTerm
                        ? 'No cleared dues settlements match your search criteria.'
                        : 'No dues have been cleared yet. Once an overdue account is cleared or paid, it will be automatically recorded here in the permanent audit history.'}
                    </td>
                  </tr>
                ) : (
                  filteredClearedHistory.map((item) => {
                    const cust = item.resolvedCustomer;
                    const isFullySettled = (cust?.total_overdue || 0) === 0;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => cust && setSelectedCustomer(cust)}
                        className="hover:bg-slate-800/50 cursor-pointer transition-colors group select-none"
                        title="Click to view customer details & profile"
                      >
                        {/* Receipt # & Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono text-xs font-black text-amber-400">
                            {item.payment_number || 'REC-SETTLED'}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>{item.payment_date || item.created_at?.split('T')[0] || '-'}</span>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4 min-w-[180px]">
                          <div className="font-bold text-white text-sm tracking-tight group-hover:text-emerald-300 transition-colors">
                            {cust?.full_name || 'Walk-in / Cash Settlement'}
                          </div>
                          {cust?.customer_code && (
                            <span className="inline-block mt-0.5 font-mono text-amber-400 font-bold text-xs">
                              #{cust.customer_code}
                            </span>
                          )}
                          {cust?.phone && (
                            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                              {cust.phone}
                            </div>
                          )}
                        </td>

                        {/* Building & Apt */}
                        <td className="py-3.5 px-4 text-slate-200">
                          {cust ? (
                            <>
                              <div className="font-bold text-xs flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                <span>{cust.building_name_cache || 'Belrasheed Building'}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium mt-0.5 ml-5">
                                Apt {cust.apartment_cache || 'N/A'}
                              </div>
                            </>
                          ) : (
                            <span className="text-slate-500 text-xs">Counter / Direct</span>
                          )}
                        </td>

                        {/* Cleared Amount */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="text-base font-black font-mono text-emerald-400">
                            {formatAED(item.amount)}
                          </div>
                          <div className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-wider mt-0.5 flex items-center justify-end gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Cleared</span>
                          </div>
                        </td>

                        {/* Payment Method */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-slate-200 border border-slate-700">
                            {(item.payment_method || 'cash').replace('_', ' ')}
                          </span>
                          {item.reference_number && (
                            <div className="text-[10px] text-slate-400 font-mono mt-1">
                              Ref: {item.reference_number}
                            </div>
                          )}
                        </td>

                        {/* Account Status Now */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {isFullySettled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Fully Settled (0 Dues)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                              <span>Partial (Remaining: {formatAED(cust?.total_overdue)})</span>
                            </span>
                          )}
                        </td>

                        {/* Remarks / Purpose */}
                        <td className="py-3.5 px-4 max-w-[240px]">
                          <div className="text-slate-300 text-xs font-medium leading-relaxed line-clamp-2">
                            {item.notes || 'Settlement of overdue mess charges'}
                          </div>
                        </td>

                        {/* Action Options */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap min-w-[140px]">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Official Receipt Modal View */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReceipt(item);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                              title="View & Print Official Receipt"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>Receipt</span>
                            </button>

                            {/* WhatsApp Confirmation */}
                            {cust?.phone && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendWhatsAppCleared(item);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                                title="Send WhatsApp Receipt Confirmation"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </button>
                            )}

                            {/* 360 Profile */}
                            {cust && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCustomer(cust);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
                                title="View Customer Profile"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 1-CLICK QUICK SETTLE DUE MODAL DIALOG               */}
      {/* ---------------------------------------------------- */}
      {settlingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-emerald-500/40 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">Clear Customer Mess Due</h3>
                  <p className="text-xs text-slate-400">
                    Record payment settlement and clear outstanding balance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettlingCustomer(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Summary Card */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">{settlingCustomer.full_name}</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  #{settlingCustomer.customer_code} • {settlingCustomer.building_name_cache || 'Belrasheed Building'}{' '}
                  {settlingCustomer.apartment_cache ? `(Apt ${settlingCustomer.apartment_cache})` : ''}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-rose-300 block">Current Overdue</span>
                <span className="text-base font-black font-mono text-rose-400">
                  {formatAED(settlingCustomer.total_overdue || 0)}
                </span>
              </div>
            </div>

            {/* Settle Form */}
            <div className="space-y-3.5">
              {/* Amount to Settle */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Settlement Amount (AED) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-slate-400">
                    AED
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={settleAmount}
                    onChange={(e) => setSettleAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-12 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {/* Quick Presets */}
                <div className="flex gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setSettleAmount(settlingCustomer.total_overdue || 0)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[11px] font-bold border border-slate-700 cursor-pointer"
                  >
                    Clear Full Overdue ({formatAED(settlingCustomer.total_overdue || 0)})
                  </button>
                  {settlingCustomer.total_overdue && settlingCustomer.total_overdue > 100 && (
                    <button
                      type="button"
                      onClick={() => setSettleAmount(Math.round((settlingCustomer.total_overdue || 0) / 2))}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px] font-bold border border-slate-700 cursor-pointer"
                    >
                      50% Partial ({formatAED((settlingCustomer.total_overdue || 0) / 2)})
                    </button>
                  )}
                </div>
              </div>

              {/* Settlement Date & Method Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Settlement Date *</label>
                  <input
                    type="date"
                    value={settleDate}
                    onChange={(e) => setSettleDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Payment Method *</label>
                  <select
                    value={settleMethod}
                    onChange={(e) => setSettleMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="online">Online / Card</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>

              {/* Reference / Cheque # */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Reference / Cheque Number <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={settleRef}
                  onChange={(e) => setSettleRef(e.target.value)}
                  placeholder="e.g. TR-994821 or Cheque #10239"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Remarks / Settlement Notes */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Settlement Notes</label>
                <input
                  type="text"
                  value={settleNotes}
                  onChange={(e) => setSettleNotes(e.target.value)}
                  placeholder="e.g. Cleared overdue mess dues for October"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSettlingCustomer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmQuickSettle}
                disabled={isSubmittingSettle || settleAmount <= 0}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmittingSettle ? 'Saving Settlement...' : `Confirm & Clear Due (${formatAED(settleAmount)})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* OFFICIAL PRINTABLE RECEIPT PREVIEW MODAL            */}
      {/* ---------------------------------------------------- */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl text-white space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-black text-white">Official Payment Receipt</h3>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                  Karama Homely Mess - Dubai, UAE
                </p>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const cust = selectedReceipt.resolvedCustomer;
              return (
                <div className="space-y-3.5 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-bold uppercase">Receipt Number</span>
                    <span className="font-mono text-base font-black text-amber-400">
                      {selectedReceipt.payment_number || 'REC-SETTLED'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-bold uppercase">Payment Date</span>
                    <span className="text-sm font-bold font-mono text-slate-200">
                      {selectedReceipt.payment_date || selectedReceipt.created_at?.split('T')[0] || '-'}
                    </span>
                  </div>

                  <div className="pb-2.5 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-bold uppercase block mb-1">
                      Received From
                    </span>
                    <div className="text-base font-black text-white">
                      {cust?.full_name || 'Valued Subscriber'}
                    </div>
                    <div className="text-xs text-slate-300 font-semibold mt-0.5">
                      {cust?.customer_code ? `#${cust.customer_code} • ` : ''}
                      {cust?.building_name_cache || 'Karama Central'}
                      {cust?.apartment_cache ? `, Apt ${cust.apartment_cache}` : ''}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-bold uppercase">Payment Method</span>
                    <span className="text-xs font-black uppercase px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                      {(selectedReceipt.payment_method || 'cash').replace('_', ' ')}
                    </span>
                  </div>

                  {selectedReceipt.reference_number && (
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                      <span className="text-xs text-slate-400 font-bold uppercase">Reference / Cheque</span>
                      <span className="font-mono text-xs font-bold text-slate-200">
                        {selectedReceipt.reference_number}
                      </span>
                    </div>
                  )}

                  {selectedReceipt.notes && (
                    <div className="pb-2.5 border-b border-slate-800">
                      <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Remarks</span>
                      <div className="text-xs text-slate-300 font-medium">{selectedReceipt.notes}</div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-slate-300 font-black uppercase">Amount Cleared</span>
                    <span className="font-mono text-2xl font-black text-emerald-400">
                      {formatAED(selectedReceipt.amount)}
                    </span>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
              <div className="flex gap-2">
                {selectedReceipt.resolvedCustomer?.phone && (
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppCleared(selectedReceipt)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer 360° Profile & In-Place Pay Modal */}
      <CustomerDetailModal
        isOpen={Boolean(selectedCustomer)}
        customer={selectedCustomer}
        customers={customers}
        buildings={buildings}
        mealPlans={mealPlans}
        invoices={invoices}
        payments={payments}
        isReadOnly={isReadOnly}
        onClose={() => setSelectedCustomer(null)}
        onEdit={(cust) => {
          setSelectedCustomer(null);
          if (onOpenPayment) onOpenPayment(cust);
        }}
        onRecordPayment={onRecordPayment}
        onSaveCustomer={onSaveCustomer}
        onDeleteCustomer={onDeleteCustomer}
      />
    </div>
  );
};
