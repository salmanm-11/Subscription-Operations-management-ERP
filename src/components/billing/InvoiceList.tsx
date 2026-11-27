import React, { useState, useMemo } from 'react';
import { FileText, Plus, Printer, Search, X, CheckCircle2, Clock, AlertCircle, FileSpreadsheet, Pencil, Trash2, Zap, AlertTriangle } from 'lucide-react';
import { Invoice, Customer, BusinessSettings, InvoiceStatus } from '../../types';
import { formatAED } from '../../utils/currency';
import { getMonthlySubscriptionRate } from '../../utils/billingCycleService';
import { formatDateDDMMMYYYY } from '../../utils/dateFormatter';
import { PrintableInvoice } from './PrintableInvoice';
import { exportInvoicesToExcel } from '../../utils/excelService';

interface InvoiceListProps {
  invoices: Invoice[];
  customers: Customer[];
  settings: BusinessSettings;
  isReadOnly?: boolean;
  onGenerateInvoice: (invoice: Partial<Invoice>) => Promise<void> | void;
  onEditInvoice?: (invoice: Partial<Invoice>) => Promise<void> | void;
  onDeleteInvoice?: (id: string) => Promise<void> | void;
  onAutoGenerateInvoices?: () => Promise<void> | void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  customers,
  settings,
  isReadOnly = false,
  onGenerateInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onAutoGenerateInvoices,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);

  // Form states
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState(380);
  const [paidAmount, setPaidAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(380);
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>('issued');
  const [periodStart, setPeriodStart] = useState(new Date().toISOString().split('T')[0]);
  const [periodEnd, setPeriodEnd] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [includeArrears, setIncludeArrears] = useState(true);
  const [detectedArrears, setDetectedArrears] = useState<{ amount: number; period?: string } | null>(null);

  // Map of customers by ID and code for fast lookup
  const customerMap = useMemo(() => {
    const map = new Map<string, Customer>();
    customers.forEach((c) => {
      map.set(c.id, c);
      if (c.customer_code) map.set(c.customer_code, c);
    });
    return map;
  }, [customers]);

  // Number of active subscribers currently missing a monthly invoice for the current cycle
  const missingInvoicesCount = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return customers.filter((c) => {
      if (c.status !== 'active' && c.status !== 'trial') return false;
      const custInvs = invoices.filter(
        (i) =>
          i.customer_id === c.id ||
          (c.full_name && i.customer_name_cache?.toLowerCase().trim() === c.full_name.toLowerCase().trim())
      );
      const hasCurrent = custInvs.some(
        (i) => i.period_start?.startsWith(currentMonth) || i.issue_date?.startsWith(currentMonth)
      );
      return !hasCurrent;
    }).length;
  }, [invoices, customers]);

  // Resolver for accurate customer details on every invoice
  const getCustomerInfo = (inv: Invoice) => {
    const cust = inv.customer || (inv.customer_id ? customerMap.get(inv.customer_id) : undefined);
    if (cust) {
      const bld = cust.building_name_cache || (cust.building?.name ? cust.building.name : '');
      const apt = cust.apartment_cache ? `Apt ${cust.apartment_cache}` : '';
      const bldApt = [bld, apt].filter(Boolean).join(' - ');
      return {
        name: cust.full_name,
        sub: bldApt || cust.phone || 'Karama Central',
        phone: cust.phone,
        code: cust.customer_code,
      };
    }

    return {
      name: inv.customer_name_cache || 'Karama Mess Customer',
      sub: inv.building_cache ? `${inv.building_cache} Apt N/A` : 'Karama Central',
      phone: undefined,
      code: undefined,
    };
  };

  // Filtered invoices by search query and status
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const info = getCustomerInfo(inv);
      const term = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !term ||
        inv.invoice_number.toLowerCase().includes(term) ||
        info.name.toLowerCase().includes(term) ||
        info.sub.toLowerCase().includes(term) ||
        (info.phone && info.phone.toLowerCase().includes(term)) ||
        (info.code && info.code.toLowerCase().includes(term)) ||
        (inv.notes && inv.notes.toLowerCase().includes(term)) ||
        (inv.total_amount !== undefined && inv.total_amount.toString().includes(term)) ||
        (inv.balance_amount !== undefined && inv.balance_amount.toString().includes(term)) ||
        (inv.period_start && inv.period_start.includes(term)) ||
        (inv.period_end && inv.period_end.includes(term));

      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter, customerMap]);

  // Financial aggregates
  const totalBilled = useMemo(() => {
    return filteredInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  }, [filteredInvoices]);

  const totalOverdue = useMemo(() => {
    return filteredInvoices.reduce((sum, inv) => sum + (inv.balance_amount || 0), 0);
  }, [filteredInvoices]);

  const totalCollected = useMemo(() => {
    return filteredInvoices.reduce((sum, inv) => sum + (inv.paid_amount || 0), 0);
  }, [filteredInvoices]);

  const checkCustomerArrears = (cid: string) => {
    const selected = customers.find((c) => c.id === cid);
    if (!selected) return null;
    const custInvs = invoices.filter(
      (i) =>
        i.customer_id === cid ||
        (selected.full_name && i.customer_name_cache?.toLowerCase().trim() === selected.full_name.toLowerCase().trim())
    );
    const unpaidSum = custInvs
      .filter((i) => i.status !== 'paid' && (i.balance_amount || 0) > 0)
      .reduce((sum, i) => sum + (i.balance_amount || 0), 0);
    const priorDue = Math.max(selected.total_overdue || 0, unpaidSum);
    const sortedPrior = [...custInvs].sort((a, b) => (b.period_end || '').localeCompare(a.period_end || ''));
    const latestPrior = sortedPrior[0];
    const priorPeriodStr = latestPrior ? `${formatDateDDMMMYYYY(latestPrior.period_start)} to ${formatDateDDMMMYYYY(latestPrior.period_end)}` : undefined;

    if (priorDue > 0) {
      return { amount: priorDue, period: priorPeriodStr };
    }
    return null;
  };

  const handleOpenAdd = () => {
    setEditingInvoice(null);
    let initialCid = '';
    const now = new Date();
    const pStart = now.toISOString().split('T')[0];
    const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const pEnd = new Date(now.getFullYear(), now.getMonth(), daysInCurrentMonth).toISOString().split('T')[0];

    let initialBase = 380;
    if (customers.length > 0) {
      initialCid = customers[0].id;
      const rateInfo = getMonthlySubscriptionRate(customers[0], pStart, pEnd);
      initialBase = rateInfo.effectiveRate;
    }
    setCustomerId(initialCid);

    const arrears = initialCid ? checkCustomerArrears(initialCid) : null;
    setDetectedArrears(arrears);
    setIncludeArrears(Boolean(arrears));

    const finalAmount = arrears ? initialBase + arrears.amount : initialBase;
    setAmount(finalAmount);
    setBalanceAmount(finalAmount);
    setPaidAmount(0);
    setInvoiceStatus('issued');
    setPeriodStart(pStart);
    setPeriodEnd(pEnd);
    setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleCustomerChange = (cid: string) => {
    setCustomerId(cid);
    const selected = customers.find((c) => c.id === cid);
    const rateInfo = getMonthlySubscriptionRate(selected, periodStart, periodEnd);
    const baseRate = rateInfo.effectiveRate;
    const arrears = checkCustomerArrears(cid);
    setDetectedArrears(arrears);
    setIncludeArrears(Boolean(arrears));
    const finalAmount = arrears ? baseRate + arrears.amount : baseRate;
    setAmount(finalAmount);
    setBalanceAmount(finalAmount);
  };

  const handleOpenEdit = (inv: Invoice) => {
    setEditingInvoice(inv);
    setDetectedArrears(null);
    setCustomerId(inv.customer_id || '');
    setAmount(inv.total_amount || 0);
    setPaidAmount(inv.paid_amount || 0);
    setBalanceAmount(inv.balance_amount !== undefined ? inv.balance_amount : (inv.total_amount || 0) - (inv.paid_amount || 0));
    setInvoiceStatus(inv.status || 'issued');
    setPeriodStart(inv.period_start || new Date().toISOString().split('T')[0]);
    setPeriodEnd(inv.period_end || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setDueDate(inv.due_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setNotes(inv.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId && !editingInvoice) return;
    const cust = customers.find((c) => c.id === customerId);

    const calculatedBalance = Math.max(0, Number(amount) - Number(paidAmount));

    if (editingInvoice && onEditInvoice) {
      await onEditInvoice({
        id: editingInvoice.id,
        invoice_number: editingInvoice.invoice_number,
        customer_id: customerId || editingInvoice.customer_id,
        customer_name_cache: cust?.full_name || editingInvoice.customer_name_cache,
        building_cache: cust?.building_name_cache || editingInvoice.building_cache,
        total_amount: Number(amount),
        subtotal: Number(amount),
        paid_amount: Number(paidAmount),
        balance_amount: calculatedBalance,
        status: invoiceStatus,
        period_start: periodStart,
        period_end: periodEnd,
        due_date: dueDate,
        notes,
      });
    } else {
      let finalNotes = notes;
      let subtotalAmount = Number(amount);
      if (includeArrears && detectedArrears && detectedArrears.amount > 0) {
        subtotalAmount = Math.max(0, Number(amount) - detectedArrears.amount);
        if (!finalNotes.includes('[ARREARS:')) {
          const tag = `[ARREARS: AED ${detectedArrears.amount.toFixed(2)}${detectedArrears.period ? ` | Period: ${detectedArrears.period}` : ''}]`;
          finalNotes = finalNotes ? `${finalNotes.trim()} ${tag}` : tag;
        }
      }

      await onGenerateInvoice({
        customer_id: customerId,
        customer: cust,
        customer_name_cache: cust?.full_name,
        building_cache: cust?.building_name_cache,
        total_amount: Number(amount),
        subtotal: subtotalAmount,
        paid_amount: Number(paidAmount),
        balance_amount: calculatedBalance,
        status: invoiceStatus,
        period_start: periodStart,
        period_end: periodEnd,
        due_date: dueDate,
        notes: finalNotes,
      });
    }

    setIsModalOpen(false);
    setEditingInvoice(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingInvoice || !onDeleteInvoice) return;
    await onDeleteInvoice(deletingInvoice.id);
    setDeletingInvoice(null);
  };

  const handleAutoGenerate = async () => {
    if (!onAutoGenerateInvoices) return;
    setIsAutoGenerating(true);
    try {
      await onAutoGenerateInvoices();
    } finally {
      setIsAutoGenerating(false);
    }
  };

  return (
    <div className="space-y-4 max-w-full min-w-0">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Billing &amp; Invoices</h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
            Manage customer invoices, monthly cycles, and AED payment balances
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Auto-Generate Invoices Button */}
          {!isReadOnly && onAutoGenerateInvoices && missingInvoicesCount > 0 && (
            <button
              onClick={handleAutoGenerate}
              disabled={isAutoGenerating}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              title="Automatically generate invoices for all active customers missing an invoice"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {isAutoGenerating
                  ? 'Generating...'
                  : `⚡ Auto-Generate Invoices (${missingInvoicesCount})`}
              </span>
            </button>
          )}

          <button
            onClick={() => exportInvoicesToExcel(filteredInvoices, 'xlsx')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700/60 shadow-sm transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Invoices</span>
          </button>

          {!isReadOnly && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Generate Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Financial Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        <div className="bg-[#16181d] border border-amber-500/30 rounded-xl p-3.5 shadow-md shadow-black/20 min-w-0">
          <div className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider">Total Invoiced (AED)</div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5 truncate">
            {formatAED(totalBilled)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
            {filteredInvoices.length} Invoices Active
          </div>
        </div>

        <div className="bg-[#16181d] border border-rose-500/30 rounded-xl p-3.5 shadow-md shadow-black/20 min-w-0">
          <div className="text-[10px] uppercase font-extrabold text-rose-400 tracking-wider">Outstanding Overdue (AED)</div>
          <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono mt-0.5 truncate">
            {formatAED(totalOverdue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">Unsettled Monthly Mess Dues</div>
        </div>

        <div className="bg-[#16181d] border border-emerald-500/30 rounded-xl p-3.5 shadow-md shadow-black/20 min-w-0">
          <div className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">Collected Amount (AED)</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-0.5 truncate">
            {formatAED(totalCollected)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">Cleared Settlements</div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#16181d] border border-[#242730] rounded-xl p-3 shadow-md shadow-black/20">
        <div className="relative flex-1 min-w-[200px] cursor-text">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, invoice #, building, room, notes, amount..."
            className="w-full pl-10 pr-9 py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#ff8d24] transition-colors"
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

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900/90 border border-slate-700/70 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-[#ff8d24]"
          >
            <option value="all">All Invoice Statuses</option>
            <option value="overdue">Overdue Only</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="paid">Paid &amp; Settled</option>
            <option value="issued">Issued / Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-[#16181d] border border-[#242730] rounded-2xl overflow-hidden shadow-xl shadow-black/30">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left min-w-[1140px]">
            <thead>
              <tr className="bg-[#121419] text-slate-300 border-b border-slate-700/80 text-xs uppercase tracking-wider font-bold">
                <th className="py-3 px-3.5 whitespace-nowrap min-w-[120px]">Invoice #</th>
                <th className="py-3 px-3.5 min-w-[200px]">Customer Name &amp; Details</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[160px]">Billing Period</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[110px]">Due Date</th>
                <th className="py-3 px-3 text-right whitespace-nowrap min-w-[110px]">Total (AED)</th>
                <th className="py-3 px-3 text-right whitespace-nowrap min-w-[110px]">Paid (AED)</th>
                <th className="py-3 px-3 text-right whitespace-nowrap min-w-[110px]">Balance (AED)</th>
                <th className="py-3 px-2.5 text-center whitespace-nowrap min-w-[100px]">Status</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap min-w-[140px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                    <div className="max-w-md mx-auto space-y-3">
                      <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="font-semibold text-white">No invoices matched your query</p>
                      <p className="text-xs text-slate-400">
                        {customers.length > 0 && missingInvoicesCount > 0
                          ? `You have ${missingInvoicesCount} active customers missing invoices. Click below to automatically generate them now.`
                          : 'Click "Generate Invoice" or adjust your search filter.'}
                      </p>
                      {onAutoGenerateInvoices && missingInvoicesCount > 0 && (
                        <button
                          type="button"
                          onClick={handleAutoGenerate}
                          disabled={isAutoGenerating}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer transition-all"
                        >
                          <Zap className="w-4 h-4" />
                          <span>
                            {isAutoGenerating
                              ? 'Generating Invoices...'
                              : `⚡ Auto-Generate Monthly Invoices (${missingInvoicesCount})`}
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const info = getCustomerInfo(inv);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Invoice Number */}
                      <td className="py-3 px-3.5 font-mono font-bold text-amber-400 whitespace-nowrap">
                        {inv.invoice_number}
                      </td>

                      {/* Customer Name & Building */}
                      <td className="py-3 px-3.5 min-w-[180px]">
                        <div className="flex items-center gap-1.5">
                          <div className="font-bold text-white text-sm sm:text-base tracking-tight">
                            {info.name}
                          </div>
                          {info.code && (
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                              {info.code}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                          <span>{info.sub}</span>
                          {info.phone && (
                            <span className="text-slate-500 font-normal">({info.phone})</span>
                          )}
                        </div>
                      </td>

                      {/* Billing Period */}
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap text-xs font-mono">
                        {formatDateDDMMMYYYY(inv.period_start)} to {formatDateDDMMMYYYY(inv.period_end)}
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap text-xs font-mono">
                        {formatDateDDMMMYYYY(inv.due_date)}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3 px-3 text-right font-black text-white font-mono whitespace-nowrap text-xs sm:text-sm">
                        {formatAED(inv.total_amount)}
                      </td>

                      {/* Paid Amount */}
                      <td className="py-3 px-3 text-right font-bold text-emerald-400 font-mono whitespace-nowrap text-xs sm:text-sm">
                        {formatAED(inv.paid_amount)}
                      </td>

                      {/* Balance Amount */}
                      <td className="py-3 px-3 text-right font-black text-rose-400 text-xs sm:text-base font-mono whitespace-nowrap drop-shadow-sm">
                        {formatAED(inv.balance_amount)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-2.5 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                            inv.status === 'paid'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : inv.status === 'partially_paid'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : inv.status === 'cancelled'
                              ? 'bg-slate-800 text-slate-400 border-slate-700'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>

                      {/* Actions: View/Print, Edit, Delete */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap min-w-[140px]">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoice(inv)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg font-bold text-xs border border-slate-700/70 shadow-sm transition-colors cursor-pointer"
                            title="View & Print Official Invoice"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-400" />
                            <span>View / Print</span>
                          </button>

                          {!isReadOnly && onEditInvoice && (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(inv)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                              title="Edit Invoice Details & Balance"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {!isReadOnly && onDeleteInvoice && (
                            <button
                              type="button"
                              onClick={() => setDeletingInvoice(inv)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                              title="Delete Invoice"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal for Invoice Generation & Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#16181d] border border-slate-700 rounded-2xl w-full max-w-lg p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingInvoice ? `Edit Invoice (${editingInvoice.invoice_number})` : 'Generate Monthly Invoice'}
                </h3>
                <p className="text-xs text-slate-400">
                  {editingInvoice ? 'Update billing cycle, rates, and payment balance' : 'Create an official subscription billing invoice'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingInvoice(null);
                }}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-200 font-bold mb-1.5">Customer *</label>
                <select
                  required
                  value={customerId}
                  disabled={Boolean(editingInvoice)}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-[#ff8d24] disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <option value="">Select customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.building_name_cache || 'Building'} Apt {c.apartment_cache || 'N/A'}) - Rate: {formatAED(c.monthly_rate)}{c.total_overdue ? ` [Due: ${formatAED(c.total_overdue)}]` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {detectedArrears && !editingInvoice && (
                <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3 animate-fadeIn">
                  <div>
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Previous Overdue Detected: {formatAED(detectedArrears.amount)}</span>
                    </div>
                    <div className="text-[11px] text-amber-300/80 mt-0.5">
                      {detectedArrears.period ? `Cycle Period: ${detectedArrears.period}` : 'Outstanding dues carried forward from earlier cycle'}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold select-none bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg border border-amber-500/40 transition-colors shrink-0">
                    <input
                      type="checkbox"
                      checked={includeArrears}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIncludeArrears(checked);
                        const sel = customers.find((c) => c.id === customerId);
                        const rateInfo = getMonthlySubscriptionRate(sel, periodStart, periodEnd);
                        const base = rateInfo.effectiveRate;
                        const newTot = checked ? base + detectedArrears.amount : base;
                        setAmount(newTot);
                        setBalanceAmount(newTot);
                      }}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-amber-200 text-xs">Add to Total Bill</span>
                  </label>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-200 font-bold mb-1.5">Monthly Mess Fee (AED) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={amount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setAmount(val);
                      setBalanceAmount(Math.max(0, val - paidAmount));
                    }}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-black text-base focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {editingInvoice ? (
                  <div>
                    <label className="block text-slate-200 font-bold mb-1.5">Amount Paid (AED)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={paidAmount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setPaidAmount(val);
                        setBalanceAmount(Math.max(0, amount - val));
                        if (amount - val <= 0) setInvoiceStatus('paid');
                        else if (val > 0) setInvoiceStatus('partially_paid');
                      }}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-200 font-bold mb-1.5">Balance Due (AED)</label>
                    <div className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-rose-400 font-mono font-black text-base">
                      {formatAED(amount)}
                    </div>
                  </div>
                )}
              </div>

              {editingInvoice && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-200 font-bold mb-1.5">Remaining Balance (AED)</label>
                    <div className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-rose-400 font-mono font-black text-base">
                      {formatAED(balanceAmount)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-200 font-bold mb-1.5">Invoice Status</label>
                    <select
                      value={invoiceStatus}
                      onChange={(e) => setInvoiceStatus(e.target.value as InvoiceStatus)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-[#ff8d24]"
                    >
                      <option value="issued">Issued / Pending</option>
                      <option value="partially_paid">Partially Paid</option>
                      <option value="paid">Paid &amp; Settled</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-200 font-bold mb-1.5">Period Start</label>
                  <input
                    type="date"
                    required
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-[#ff8d24]"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1.5">Period End</label>
                  <input
                    type="date"
                    required
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-[#ff8d24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1.5">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-[#ff8d24]"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1.5">Invoice Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Monthly mess catering subscription charges"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#ff8d24]"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingInvoice(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {editingInvoice ? 'Save Invoice Changes' : 'Create & Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#16181d] border border-rose-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Invoice</h3>
                <p className="text-xs text-slate-400">Permanently delete invoice record</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {deletingInvoice.invoice_number}
                </span>
                <span className="font-mono font-bold text-white">
                  {formatAED(deletingInvoice.total_amount)}
                </span>
              </div>
              <div className="text-slate-300">
                Customer: <span className="font-bold text-white">{getCustomerInfo(deletingInvoice).name}</span>
              </div>
              <div className="text-slate-400 text-[11px] font-mono">
                Period: {formatDateDDMMMYYYY(deletingInvoice.period_start)} to {formatDateDDMMMYYYY(deletingInvoice.period_end)}
              </div>
              <div className="text-slate-400 text-[11px]">
                Balance: <span className="text-rose-400 font-bold">{formatAED(deletingInvoice.balance_amount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingInvoice(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Delete Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <PrintableInvoice
          invoice={selectedInvoice}
          customer={selectedInvoice.customer || (selectedInvoice.customer_id ? customerMap.get(selectedInvoice.customer_id) : undefined)}
          allCustomerInvoices={invoices.filter((i) => i.customer_id === selectedInvoice.customer_id || (selectedInvoice.customer_name_cache && i.customer_name_cache?.toLowerCase() === selectedInvoice.customer_name_cache.toLowerCase()))}
          settings={settings}
          onClose={() => setSelectedInvoice(null)}
          onEdit={(inv) => handleOpenEdit(inv)}
          onDelete={onDeleteInvoice ? (id) => onDeleteInvoice(id) : undefined}
        />
      )}
    </div>
  );
};