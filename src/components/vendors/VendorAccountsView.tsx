import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  CreditCard, 
  FileText, 
  FileSpreadsheet, 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  Vendor, 
  VendorTransaction, 
  VendorPayment, 
  VendorDashboardMetrics, 
  VendorStatement, 
  VendorAuditLog 
} from '../../types';
import { 
  fetchVendors, 
  saveVendor, 
  deleteVendor, 
  fetchVendorTransactions, 
  saveVendorTransaction, 
  deleteVendorTransaction, 
  fetchVendorPayments, 
  recordVendorPayment, 
  deleteVendorPayment, 
  fetchVendorStatement, 
  fetchVendorDashboardMetrics, 
  fetchVendorAuditLogs,
  subscribeToRealtimeChanges
} from '../../api/supabase';
import { formatVendorAED } from '../../utils/currency';
import { exportVendorsListToExcel, ParsedMomsAccountResult } from '../../utils/excelService';

import { VendorDashboard } from './VendorDashboard';
import { VendorModal } from './VendorModal';
import { DailyAccountEntryModal } from './DailyAccountEntryModal';
import { VendorPaymentModal } from './VendorPaymentModal';
import { VendorStatementView } from './VendorStatementView';
import { MomsExcelImportModal } from './MomsExcelImportModal';
import { VendorAuditTrail } from './VendorAuditTrail';

interface VendorAccountsViewProps {
  currentUser?: { username: string; role: string; roleTitle?: string } | null;
}

export const VendorAccountsView: React.FC<VendorAccountsViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vendors' | 'daily' | 'payments' | 'statement' | 'import' | 'audit'>('dashboard');
  
  // Data states
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [transactions, setTransactions] = useState<VendorTransaction[]>([]);
  const [payments, setPayments] = useState<VendorPayment[]>([]);
  const [statement, setStatement] = useState<VendorStatement | null>(null);
  const [metrics, setMetrics] = useState<VendorDashboardMetrics>({
    totalVendors: 0,
    activeVendors: 0,
    totalChargesThisMonth: 0,
    totalOutstandingPayables: 0,
    recentTransactions: [],
    upcomingPayments: [],
    vendorsWithBalances: [],
    monthlyExpenses: []
  });
  const [auditLogs, setAuditLogs] = useState<VendorAuditLog[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('vend-moms-food');

  // Modals
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const [isDailyEntryModalOpen, setIsDailyEntryModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<VendorTransaction | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentVendorId, setPaymentVendorId] = useState<string | undefined>(undefined);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filters
  const [vendorSearch, setVendorSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dailyVendorFilter, setDailyVendorFilter] = useState('all');
  const [dailyDateSearch, setDailyDateSearch] = useState('');

  const loadAllVendorData = async () => {
    try {
      const [vList, txList, pList, met, logs] = await Promise.all([
        fetchVendors(),
        fetchVendorTransactions(),
        fetchVendorPayments(),
        fetchVendorDashboardMetrics(),
        fetchVendorAuditLogs()
      ]);

      setVendors(vList);
      setTransactions(txList);
      setPayments(pList);
      setMetrics(met);
      setAuditLogs(logs);

      // Refresh statement for currently selected vendor
      const targetId = selectedVendorId || (vList.length > 0 ? vList[0].id : '');
      if (targetId) {
        setSelectedVendorId(targetId);
        const stmt = await fetchVendorStatement(targetId);
        setStatement(stmt);
      }
    } catch (err) {
      console.error('Error loading vendor data:', err);
    }
  };

  useEffect(() => {
    loadAllVendorData();

    // Multi-device real-time sync for vendors across all PCs
    const unsubscribe = subscribeToRealtimeChanges({
      onVendorChange: () => loadAllVendorData(),
      onVendorTransactionChange: () => loadAllVendorData(),
      onVendorPaymentChange: () => loadAllVendorData(),
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSelectVendorForStatement = async (vendorId: string) => {
    setSelectedVendorId(vendorId);
    const stmt = await fetchVendorStatement(vendorId);
    setStatement(stmt);
    setActiveTab('statement');
  };

  const handleSaveVendor = async (data: Partial<Vendor>) => {
    await saveVendor(data, currentUser?.username || 'admin');
    await loadAllVendorData();
    setIsVendorModalOpen(false);
    setEditingVendor(null);
  };

  const handleDeleteVendor = async (id: string) => {
    if (confirm('Are you sure you want to deactivate / remove this vendor?')) {
      await deleteVendor(id, currentUser?.username || 'admin');
      await loadAllVendorData();
    }
  };

  const handleSaveDailyTransaction = async (data: Partial<VendorTransaction>) => {
    await saveVendorTransaction(data, currentUser?.username || 'admin');
    await loadAllVendorData();
    setIsDailyEntryModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Are you sure you want to delete this daily account transaction?')) {
      await deleteVendorTransaction(id, currentUser?.username || 'admin');
      await loadAllVendorData();
    }
  };

  const handleSavePayment = async (data: Partial<VendorPayment>) => {
    await recordVendorPayment(data, currentUser?.username || 'admin');
    await loadAllVendorData();
    setIsPaymentModalOpen(false);
  };

  const handleDeletePayment = async (id: string) => {
    if (confirm('Are you sure you want to reverse / delete this vendor payment?')) {
      await deleteVendorPayment(id, currentUser?.username || 'admin');
      await loadAllVendorData();
    }
  };

  const handleImportMomsComplete = async (parsed: ParsedMomsAccountResult, mode: 'merge' | 'replace') => {
    const targetVendor = vendors.find(v => v.id === 'vend-moms-food') || vendors[0];
    if (!targetVendor) return;

    // Update vendor opening balance
    await saveVendor({
      id: targetVendor.id,
      opening_balance: parsed.openingBalance
    }, currentUser?.username || 'admin');

    // Save transactions
    for (const r of parsed.validRows) {
      await saveVendorTransaction({
        vendor_id: targetVendor.id,
        vendor_name_cache: targetVendor.name,
        transaction_type: 'daily_meal_entry',
        date: r.date,
        day_name: r.day_name,
        breakfast_qty: r.breakfast_qty,
        lunch_qty: r.lunch_qty,
        dinner_qty: r.dinner_qty,
        breakfast_rate: targetVendor.breakfast_rate || 3.27,
        lunch_rate: targetVendor.lunch_rate || 4.385,
        dinner_rate: targetVendor.dinner_rate || 4.27,
        meal_charges: r.daily_total_charges,
        service_charge: 0,
        delivery_charge: 0,
        packing_charge: 0,
        other_charges: 0,
        discount: 0,
        total_charges: r.daily_total_charges,
        amount_paid: r.amount_paid,
        remarks: r.remarks || undefined
      }, currentUser?.username || 'admin');
    }

    await loadAllVendorData();
    alert(`Successfully synced ${parsed.validRows.length} daily records into ${targetVendor.name}! Opening balance preserved: ${parsed.openingBalance} AED.`);
    handleSelectVendorForStatement(targetVendor.id);
  };

  // Vendor Directory filtering
  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.vendor_code.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      (v.contact_person && v.contact_person.toLowerCase().includes(vendorSearch.toLowerCase())) ||
      (v.phone && v.phone.includes(vendorSearch));
    const matchesCat = categoryFilter === 'all' || v.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Daily Accounts filtering
  const filteredTransactions = transactions.filter(t => {
    const matchesVendor = dailyVendorFilter === 'all' || t.vendor_id === dailyVendorFilter;
    const matchesDate = !dailyDateSearch || t.date.includes(dailyDateSearch) || (t.remarks && t.remarks.toLowerCase().includes(dailyDateSearch.toLowerCase()));
    return matchesVendor && matchesDate;
  }).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 bg-[#111827] px-4 rounded-2xl gap-2 overflow-x-auto custom-scrollbar shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'border-amber-500 text-amber-400 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'vendors'
              ? 'border-amber-500 text-amber-400 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Vendors Directory ({vendors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'daily'
              ? 'border-amber-500 text-amber-400 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Daily Accounts ({transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'payments'
              ? 'border-amber-500 text-amber-400 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Vendor Payments ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('statement')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'statement'
              ? 'border-amber-500 text-amber-400 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Account Statement</span>
        </button>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="py-3.5 px-4 text-xs font-bold border-b-2 border-transparent text-emerald-400 hover:text-emerald-300 flex items-center gap-2 whitespace-nowrap ml-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Import Moms_Account.xlsx</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-amber-500 text-amber-400 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Trail</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <VendorDashboard
          metrics={metrics}
          onOpenNewDailyEntry={() => {
            setEditingTransaction(null);
            setIsDailyEntryModalOpen(true);
          }}
          onOpenRecordPayment={(vendorId) => {
            setPaymentVendorId(vendorId);
            setIsPaymentModalOpen(true);
          }}
          onOpenAddVendor={() => {
            setEditingVendor(null);
            setIsVendorModalOpen(true);
          }}
          onOpenImport={() => setIsImportModalOpen(true)}
          onSelectVendorStatement={handleSelectVendorForStatement}
          onViewAllTransactions={() => setActiveTab('daily')}
        />
      )}

      {/* TAB 2: VENDORS DIRECTORY */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#151c2c] border border-slate-800 p-4 rounded-2xl shadow-xl">
            <div>
              <h3 className="text-lg font-black text-white">Registered Vendors &amp; Kitchen Partners</h3>
              <p className="text-xs text-slate-400 mt-0.5">Supplier rates, charge configurations &amp; contact profiles</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  placeholder="Search vendor name, code..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={() => exportVendorsListToExcel(vendors, 'xlsx')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export</span>
              </button>

              <button
                onClick={() => {
                  setEditingVendor(null);
                  setIsVendorModalOpen(true);
                }}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vendor</span>
              </button>
            </div>
          </div>

          <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0f1422] text-slate-300 border-b border-slate-800 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Code</th>
                    <th className="py-3 px-3">Vendor Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Contract Rates (AED)</th>
                    <th className="py-3 px-3">Payment Terms</th>
                    <th className="py-3 px-3 text-right">Opening Balance</th>
                    <th className="py-3 px-2 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 font-medium">
                  {filteredVendors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                        {v.vendor_code}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-white text-sm">{v.name}</div>
                        {v.contact_person && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{v.contact_person} {v.phone && `• ${v.phone}`}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                          {v.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                        {v.category === 'Meal Catering / Kitchen' || v.breakfast_rate > 0 || v.lunch_rate > 0 ? (
                          <span className="text-slate-200">
                            BF: <strong className="text-amber-300">{v.breakfast_rate}</strong> | LN: <strong className="text-emerald-300">{v.lunch_rate}</strong> | DN: <strong className="text-sky-300">{v.dinner_rate}</strong>
                          </span>
                        ) : (
                          <span className="text-slate-500">General Supplier</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {v.payment_terms || 'Weekly'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span className={v.opening_balance > 0 ? 'text-rose-400' : v.opening_balance < 0 ? 'text-sky-400' : 'text-slate-400'}>
                          {formatVendorAED(v.opening_balance)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          v.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSelectVendorForStatement(v.id)}
                            className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                            title="View Statement"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingVendor(v);
                              setIsVendorModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                            title="Edit Vendor & Charges"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVendor(v.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            title="Remove / Deactivate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DAILY ACCOUNTS LIST */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#151c2c] border border-slate-800 p-4 rounded-2xl shadow-xl">
            <div>
              <h3 className="text-lg font-black text-white">Daily Vendor Accounts &amp; Ledger</h3>
              <p className="text-xs text-slate-400 mt-0.5">Daily meal supply quantities, contract charges &amp; closing balances</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={dailyVendorFilter}
                onChange={(e) => setDailyVendorFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
              >
                <option value="all">All Vendors</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>

              <input
                type="text"
                value={dailyDateSearch}
                onChange={(e) => setDailyDateSearch(e.target.value)}
                placeholder="Search date YYYY-MM..."
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs w-36"
              />

              <button
                onClick={() => {
                  setEditingTransaction(null);
                  setIsDailyEntryModalOpen(true);
                }}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Daily Entry</span>
              </button>
            </div>
          </div>

          <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0f1422] text-slate-300 border-b border-slate-800 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-2">Day</th>
                    <th className="py-3 px-3">Vendor</th>
                    <th className="py-3 px-2 text-center">Meals (BF/LN/DN)</th>
                    <th className="py-3 px-3 text-right">Total Charges</th>
                    <th className="py-3 px-3 text-right">Amount Paid</th>
                    <th className="py-3 px-3 text-right">Closing Balance</th>
                    <th className="py-3 px-3">Remarks</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 font-medium">
                  {filteredTransactions.slice(0, 50).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-200 whitespace-nowrap">
                        {t.date}
                      </td>
                      <td className="py-2.5 px-2 text-slate-400 whitespace-nowrap">
                        {t.day_name || '-'}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-white">
                        {t.vendor_name_cache || 'Vendor'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-[11px] whitespace-nowrap text-slate-300">
                        {t.transaction_type === 'daily_meal_entry' ? `${t.breakfast_qty}/${t.lunch_qty}/${t.dinner_qty}` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                        {formatVendorAED(t.total_charges)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                        {t.amount_paid > 0 ? formatVendorAED(t.amount_paid) : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        <span className={t.running_balance > 0 ? 'text-rose-400' : t.running_balance < 0 ? 'text-sky-400' : 'text-slate-300'}>
                          {formatVendorAED(t.running_balance)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 truncate max-w-[150px]">
                        {t.remarks || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingTransaction(t);
                              setIsDailyEntryModalOpen(true);
                            }}
                            className="p-1 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                            title="Edit Entry"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(t.id)}
                            className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredTransactions.length > 50 && (
              <div className="p-3 text-center text-xs text-slate-500 bg-[#0f1422] border-t border-slate-800">
                Showing top 50 of {filteredTransactions.length} daily entries. Use date filter to view specific period or Account Statement for full printable ledger.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: VENDOR PAYMENTS LIST */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#151c2c] border border-slate-800 p-4 rounded-2xl shadow-xl">
            <div>
              <h3 className="text-lg font-black text-white">Vendor Payment Records</h3>
              <p className="text-xs text-slate-400 mt-0.5">Disbursements, bank transfers &amp; partial settlement history</p>
            </div>

            <button
              onClick={() => {
                setPaymentVendorId(undefined);
                setIsPaymentModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>Record Vendor Payment</span>
            </button>
          </div>

          <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0f1422] text-slate-300 border-b border-slate-800 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Receipt / Ref</th>
                    <th className="py-3 px-3">Payment Date</th>
                    <th className="py-3 px-3">Vendor</th>
                    <th className="py-3 px-3">Payment Method</th>
                    <th className="py-3 px-3 text-right">Amount (AED)</th>
                    <th className="py-3 px-3">Remarks</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 font-medium">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No vendor payments recorded yet.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-amber-400">
                          {p.payment_number}
                          {p.reference_number && <span className="block text-[10px] text-slate-500">{p.reference_number}</span>}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-200">
                          {p.payment_date}
                        </td>
                        <td className="py-3 px-3 font-bold text-white">
                          {p.vendor_name_cache || 'Vendor'}
                        </td>
                        <td className="py-3 px-3 text-slate-300 uppercase text-[10px] font-bold">
                          {p.payment_method.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-emerald-400 text-sm">
                          {formatVendorAED(p.amount)}
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          {p.remarks || '-'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeletePayment(p.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            title="Reverse / Delete Payment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: VENDOR STATEMENT VIEW */}
      {activeTab === 'statement' && (
        <VendorStatementView
          vendors={vendors}
          selectedVendorId={selectedVendorId}
          onSelectVendor={async (id) => {
            setSelectedVendorId(id);
            const stmt = await fetchVendorStatement(id);
            setStatement(stmt);
          }}
          statement={statement}
          onOpenRecordPayment={(vendorId) => {
            setPaymentVendorId(vendorId);
            setIsPaymentModalOpen(true);
          }}
        />
      )}

      {/* TAB 6: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <VendorAuditTrail logs={auditLogs} />
      )}

      {/* MODAL 1: Vendor Registration / Edit Modal */}
      {isVendorModalOpen && (
        <VendorModal
          isOpen={isVendorModalOpen}
          onClose={() => {
            setIsVendorModalOpen(false);
            setEditingVendor(null);
          }}
          onSave={handleSaveVendor}
          vendor={editingVendor}
        />
      )}

      {/* MODAL 2: Daily Account Entry Modal */}
      {isDailyEntryModalOpen && (
        <DailyAccountEntryModal
          isOpen={isDailyEntryModalOpen}
          onClose={() => {
            setIsDailyEntryModalOpen(false);
            setEditingTransaction(null);
          }}
          onSave={handleSaveDailyTransaction}
          vendors={vendors}
          initialTransaction={editingTransaction}
          selectedVendorId={selectedVendorId}
        />
      )}

      {/* MODAL 3: Vendor Payment Modal */}
      {isPaymentModalOpen && (
        <VendorPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSavePayment={handleSavePayment}
          vendors={vendors}
          selectedVendorId={paymentVendorId}
          vendorBalances={metrics.vendorsWithBalances.reduce((acc, curr) => {
            acc[curr.vendor.id] = curr.balance;
            return acc;
          }, {} as Record<string, number>)}
        />
      )}

      {/* MODAL 4: Mom's Account Excel Import Modal */}
      {isImportModalOpen && (
        <MomsExcelImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImportComplete={handleImportMomsComplete}
        />
      )}
    </div>
  );
};
