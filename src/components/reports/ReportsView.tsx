import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Download, Users, Utensils, Building2, Calendar, Search, FileSpreadsheet } from 'lucide-react';
import { DashboardMetrics } from '../../types';
import { formatAED } from '../../utils/currency';
import { OfflineStorage } from '../../api/offlineStorage';
import { exportLedgerToExcel, exportTableToExcel } from '../../utils/excelService';

interface ReportsViewProps {
  metrics: DashboardMetrics;
  onExportCsv: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ metrics, onExportCsv }) => {
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [ledgerSearch, setLedgerSearch] = useState('');
  const ledgerData = OfflineStorage.getLedger();
  const corporateAccounts = OfflineStorage.getCorporateAccounts();

  const filteredLedger = ledgerData.filter(item => {
    const matchesMonth = selectedMonth === 'ALL' || item.date.startsWith(selectedMonth);
    const matchesSearch = !ledgerSearch || item.date.includes(ledgerSearch) || item.day.toLowerCase().includes(ledgerSearch.toLowerCase()) || (item.remarks && item.remarks.toLowerCase().includes(ledgerSearch.toLowerCase()));
    return matchesMonth && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Business Reports &amp; Financial Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">Authoritative revenue, collection performance, and meal metrics in AED</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportLedgerToExcel(ledgerData, 'xlsx')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-sky-400" />
            <span>Export 365-Day Ledger (.xlsx)</span>
          </button>

          <button
            onClick={onExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Export Financial Report</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#16181d] border border-[#242730] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3 text-amber-400">
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold text-slate-400">CURRENT MONTH</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">Billed Subscription Fees</div>
          <div className="text-2xl font-extrabold text-white mt-1">{formatAED(metrics.billedThisMonth)}</div>
        </div>

        <div className="bg-[#16181d] border border-[#242730] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold text-emerald-400/80">COLLECTED</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">Actual Cash &amp; Bank Collections</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{formatAED(metrics.collectedThisMonth)}</div>
        </div>

        <div className="bg-[#16181d] border border-[#242730] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3 text-rose-400">
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold text-rose-400/80">OUTSTANDING</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">Total Uncollected Overdue</div>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">{formatAED(metrics.totalOutstandingDues)}</div>
        </div>

        <div className="bg-[#16181d] border border-[#242730] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3 text-sky-400">
            <Utensils className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold text-sky-400/80">DAILY VOLUME</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">Daily Prepared Meal Boxes</div>
          <div className="text-2xl font-extrabold text-white mt-1">{metrics.todayTotalMeals} Meals</div>
        </div>
      </div>

      {/* Corporate Accounts Section */}
      <div className="bg-[#16181d] border border-[#242730] rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Thahir Corporate Group Accounts</h3>
              <p className="text-xs text-slate-400">Multi-person corporate billing groups with itemized staff ledgers</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            2 Corporate Accounts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {corporateAccounts.map(corp => (
            <div key={corp.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{corp.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  {corp.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Period: {corp.period}</span>
                <span>{corp.membersCount} Staff Members</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Total Dues</span>
                  <span className="font-bold text-white">{formatAED(corp.totalAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-500 block">Paid</span>
                  <span className="font-bold text-emerald-400">{formatAED(corp.paidAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-rose-500 block">Overdue</span>
                  <span className="font-bold text-rose-400">{formatAED(corp.overdueAmount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 365-Day Daily Ledger Table */}
      <div className="bg-[#16181d] border border-[#242730] rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Daily Ledger &amp; Meal Counts (365 Days)</h3>
              <p className="text-xs text-slate-400">Breakfast, Lunch, Dinner volumes, daily revenue, and collections</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#ff8d24]"
            >
              <option value="ALL">All Months (2026)</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
              <option value="2026-05">May 2026</option>
              <option value="2026-04">April 2026</option>
              <option value="2026-03">March 2026</option>
              <option value="2026-02">February 2026</option>
              <option value="2026-01">January 2026</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={ledgerSearch}
                onChange={e => setLedgerSearch(e.target.value)}
                placeholder="Search date..."
                className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#ff8d24] w-32 sm:w-40"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96 rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 sticky top-0 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Day</th>
                <th className="py-2.5 px-2 text-center text-amber-400">BF</th>
                <th className="py-2.5 px-2 text-center text-emerald-400">LN</th>
                <th className="py-2.5 px-2 text-center text-sky-400">DN</th>
                <th className="py-2.5 px-3 text-right">Daily Charges</th>
                <th className="py-2.5 px-3 text-right text-emerald-400">Collected</th>
                <th className="py-2.5 px-3 text-right">Running Balance</th>
                <th className="py-2.5 px-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No ledger records match the selected month.
                  </td>
                </tr>
              ) : (
                filteredLedger.slice(0, 100).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors font-mono">
                    <td className="py-2 px-3 text-slate-200">{row.date}</td>
                    <td className="py-2 px-3 text-slate-400 font-sans">{row.day}</td>
                    <td className="py-2 px-2 text-center text-amber-300 font-bold">{row.bf_count || '-'}</td>
                    <td className="py-2 px-2 text-center text-emerald-300 font-bold">{row.ln_count || '-'}</td>
                    <td className="py-2 px-2 text-center text-sky-300 font-bold">{row.dn_count || '-'}</td>
                    <td className="py-2 px-3 text-right text-slate-100">{row.charges ? formatAED(row.charges) : '-'}</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-bold">{row.amount_paid ? formatAED(row.amount_paid) : '-'}</td>
                    <td className="py-2 px-3 text-right text-slate-300">{formatAED(row.balance)}</td>
                    <td className="py-2 px-3 text-slate-500 font-sans text-[11px] truncate max-w-xs">{row.remarks || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed breakdown cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#16181d] border border-[#242730] rounded-2xl p-6 shadow-lg">
          <h3 className="text-base font-bold text-white mb-4">Meal Attendance Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">Breakfast (BF)</span>
                <span className="text-amber-400 font-bold">{metrics.todayBreakfast}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(metrics.todayBreakfast / (metrics.todayTotalMeals || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">Lunch (LN)</span>
                <span className="text-emerald-400 font-bold">{metrics.todayLunch}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(metrics.todayLunch / (metrics.todayTotalMeals || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">Dinner (DN)</span>
                <span className="text-sky-400 font-bold">{metrics.todayDinner}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${(metrics.todayDinner / (metrics.todayTotalMeals || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#16181d] border border-[#242730] rounded-2xl p-6 shadow-lg">
          <h3 className="text-base font-bold text-white mb-4">Customer Status Distribution</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 font-medium">Active (Running) Customers</span>
              <span className="text-emerald-400 font-bold text-sm">{metrics.activeCustomers}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 font-medium">Inactive / Paused Accounts</span>
              <span className="text-amber-400 font-bold text-sm">{metrics.inactiveCustomers}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 font-medium">Total Registered Customer Profiles</span>
              <span className="text-sky-400 font-bold text-sm">{metrics.totalCustomers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
