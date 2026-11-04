import React from 'react';
import { 
  Truck, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  CreditCard, 
  FileSpreadsheet, 
  ChevronRight,
  Clock,
  Building,
  Receipt
} from 'lucide-react';
import { VendorDashboardMetrics, Vendor, VendorTransaction } from '../../types';
import { formatAED, formatVendorAED } from '../../utils/currency';

interface VendorDashboardProps {
  metrics: VendorDashboardMetrics;
  onOpenNewDailyEntry: () => void;
  onOpenRecordPayment: (vendorId?: string) => void;
  onOpenAddVendor: () => void;
  onOpenImport: () => void;
  onSelectVendorStatement: (vendorId: string) => void;
  onViewAllTransactions: () => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  metrics,
  onOpenNewDailyEntry,
  onOpenRecordPayment,
  onOpenAddVendor,
  onOpenImport,
  onSelectVendorStatement,
  onViewAllTransactions,
}) => {
  const maxExpense = Math.max(...metrics.monthlyExpenses.map(m => Math.max(m.charges, m.payments)), 1000);

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111827] border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-amber-500" />
            <span>Vendor Accounts Dashboard</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Supplier payables, daily kitchen catering accounts &amp; Mom's Food ledger
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenNewDailyEntry}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Daily Account Entry</span>
          </button>

          <button
            onClick={() => onOpenRecordPayment()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-colors"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Record Payment</span>
          </button>

          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            title="Import Mom's Account spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>Import Moms Account</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Vendors */}
        <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Vendors</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{metrics.totalVendors}</span>
            <span className="text-xs font-semibold text-sky-400">{metrics.activeVendors} Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Catering &amp; wholesale suppliers</p>
        </div>

        {/* Card 2: Active Vendors */}
        <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Suppliers</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{metrics.activeVendors}</span>
            <span className="text-xs text-slate-400">/ {metrics.totalVendors} total</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active daily accounts</p>
        </div>

        {/* Card 3: Total Vendor Charges This Month */}
        <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Charges (Month)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-amber-400">
              {formatVendorAED(metrics.totalChargesThisMonth)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Meal supplies &amp; groceries billed</p>
        </div>

        {/* Card 4: Outstanding Payables */}
        <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Outstanding Payables</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-rose-400">
              {formatVendorAED(metrics.totalOutstandingPayables)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Due to vendors (Net closing balances)</p>
        </div>
      </div>

      {/* Grid: Monthly Expense Chart & Vendors With Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Expense Chart */}
        <div className="lg:col-span-2 bg-[#151c2c] border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>Monthly Vendor Expenses &amp; Payments</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Historical breakdown of total charges vs amounts paid (AED)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                <span>Charges</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                <span>Paid</span>
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex items-end gap-2 pt-6 pb-2 border-b border-slate-800">
            {metrics.monthlyExpenses.slice(-10).map((m, idx) => {
              const chargeHeight = Math.min(100, Math.max(6, Math.round((m.charges / maxExpense) * 100)));
              const paidHeight = Math.min(100, Math.max(4, Math.round((m.payments / maxExpense) * 100)));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white text-[10px] rounded-lg px-2.5 py-1 pointer-events-none shadow-xl z-20 whitespace-nowrap">
                    <div className="font-bold text-amber-400">{m.label}</div>
                    <div>Charges: {formatVendorAED(m.charges)}</div>
                    <div>Paid: {formatVendorAED(m.payments)}</div>
                  </div>

                  <div className="w-full flex items-end justify-center gap-1 h-full pb-1">
                    {/* Charges Bar */}
                    <div
                      style={{ height: `${chargeHeight}%` }}
                      className="w-1/2 max-w-[18px] bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-md transition-all group-hover:brightness-110"
                    />
                    {/* Payments Bar */}
                    <div
                      style={{ height: `${paidHeight}%` }}
                      className="w-1/2 max-w-[18px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all group-hover:brightness-110"
                    />
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium mt-1 truncate max-w-full">
                    {m.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
            <span>Formula: Closing Balance = Opening Balance + Total Charges - Total Payments</span>
            <span className="font-mono text-[11px] text-amber-400/90 font-bold">AED Dubai Standard</span>
          </div>
        </div>

        {/* Vendors with Outstanding Balances */}
        <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Vendor Balances</span>
              </h3>
              <span className="text-xs text-slate-400">{metrics.vendorsWithBalances.length} Registered</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Current net payables / advances with suppliers</p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
              {metrics.vendorsWithBalances.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No vendor records found.</div>
              ) : (
                metrics.vendorsWithBalances.map((item) => (
                  <div
                    key={item.vendor.id}
                    onClick={() => onSelectVendorStatement(item.vendor.id)}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1.5">
                        <span>{item.vendor.name}</span>
                        {item.vendor.id === 'vend-moms-food' && (
                          <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            CATERING
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Terms: {item.vendor.payment_terms || 'Weekly'}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`font-mono text-xs sm:text-sm font-bold ${
                        item.balance > 0 ? 'text-rose-400' : item.balance < 0 ? 'text-sky-400' : 'text-emerald-400'
                      }`}>
                        {formatVendorAED(item.balance)}
                      </div>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        item.balance > 0
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          : item.balance < 0
                          ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      }`}>
                        {item.balance > 0 ? 'Payable' : item.balance < 0 ? 'Advance Credit' : 'Settled'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={onOpenAddVendor}
            className="w-full mt-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add New Vendor</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Recent Transactions & Upcoming Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-[#151c2c] border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>Recent Vendor Transactions</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Latest daily accounts and supplier payments</p>
            </div>
            <button
              onClick={onViewAllTransactions}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Vendor / Supply</th>
                  <th className="py-2.5 px-2 text-center">Meals (BF/LN/DN)</th>
                  <th className="py-2.5 px-3 text-right">Charges</th>
                  <th className="py-2.5 px-3 text-right">Paid</th>
                  <th className="py-2.5 px-3 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {metrics.recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No recent transactions found.
                    </td>
                  </tr>
                ) : (
                  metrics.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-300 font-mono text-[11px]">
                        {tx.date}
                        {tx.day_name && <span className="text-[10px] text-slate-500 block">{tx.day_name}</span>}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-white">{tx.vendor_name_cache || 'Vendor'}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{tx.description}</div>
                      </td>
                      <td className="py-2.5 px-2 text-center whitespace-nowrap font-mono text-[11px]">
                        {tx.transaction_type === 'daily_meal_entry' ? (
                          <span className="text-slate-300">
                            {tx.breakfast_qty}/{tx.lunch_qty}/{tx.dinner_qty}
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                        {formatVendorAED(tx.total_charges)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                        {tx.amount_paid > 0 ? formatVendorAED(tx.amount_paid) : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        <span className={tx.running_balance > 0 ? 'text-rose-400' : tx.running_balance < 0 ? 'text-sky-400' : 'text-slate-300'}>
                          {formatVendorAED(tx.running_balance)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Vendor Payments */}
        <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Upcoming Payments</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">{metrics.upcomingPayments.length} Pending</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Obligations based on vendor terms &amp; outstanding balances</p>

            <div className="space-y-3">
              {metrics.upcomingPayments.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No pending vendor payments. All accounts settled or in credit.
                </div>
              ) : (
                metrics.upcomingPayments.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white">{p.vendorName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Terms: {p.paymentTerms}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-xs sm:text-sm text-rose-400">
                        {formatVendorAED(p.balance)}
                      </div>
                      <button
                        onClick={() => onOpenRecordPayment(p.vendorId)}
                        className="mt-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 justify-end ml-auto"
                      >
                        <span>Pay Now</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs">
            <span className="font-bold block mb-0.5">Notice:</span>
            Payments recorded update running balances immediately and preserve the accounting formula without double-counting.
          </div>
        </div>
      </div>
    </div>
  );
};
