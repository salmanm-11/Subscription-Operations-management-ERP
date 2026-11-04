import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  Filter, 
  Building, 
  ChevronDown, 
  FileSpreadsheet, 
  Receipt,
  Utensils,
  ArrowUpRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { Vendor, VendorStatement } from '../../types';
import { formatVendorAED } from '../../utils/currency';
import { exportVendorStatementToExcel } from '../../utils/excelService';

interface VendorStatementViewProps {
  vendors: Vendor[];
  selectedVendorId: string;
  onSelectVendor: (id: string) => void;
  statement: VendorStatement | null;
  onOpenRecordPayment: (vendorId: string) => void;
}

export const VendorStatementView: React.FC<VendorStatementViewProps> = ({
  vendors,
  selectedVendorId,
  onSelectVendor,
  statement,
  onOpenRecordPayment,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [monthPreset, setMonthPreset] = useState('all');

  const selectedVendor = vendors.find(v => v.id === selectedVendorId);

  // Quick month filter presets
  const handlePresetChange = (preset: string) => {
    setMonthPreset(preset);
    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
      return;
    }

    const year = 2026;
    const month = parseInt(preset);
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    // Last day of month
    const lastDay = new Date(year, month, 0).getDate();
    const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    setStartDate(start);
    setEndDate(end);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter items in statement by startDate and endDate
  const items = statement?.items.filter(item => {
    if (startDate && item.date < startDate) return false;
    if (endDate && item.date > endDate) return false;
    return true;
  }) || [];

  // Compute filtered summary
  const filteredCharges = items.reduce((acc, i) => acc + (i.total_charges || 0), 0);
  const filteredPayments = items.reduce((acc, i) => acc + (i.payments || 0), 0);
  const closingBalance = (statement?.openingBalance || 0) + filteredCharges - filteredPayments;

  return (
    <div className="space-y-5">
      {/* Top Filter & Action Bar */}
      <div className="bg-[#151c2c] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Vendor Selector */}
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Select Vendor</label>
            <select
              value={selectedVendorId}
              onChange={(e) => onSelectVendor(e.target.value)}
              className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-amber-500"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.vendor_code})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Month Preset */}
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Month Filter</label>
            <select
              value={monthPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Dates (Full Ledger)</option>
              <option value="1">January 2026</option>
              <option value="2">February 2026</option>
              <option value="3">March 2026</option>
              <option value="4">April 2026</option>
              <option value="5">May 2026</option>
              <option value="6">June 2026</option>
              <option value="7">July 2026</option>
              <option value="8">August 2026</option>
              <option value="9">September 2026</option>
              <option value="10">October 2026</option>
              <option value="11">November 2026</option>
              <option value="12">December 2026</option>
            </select>
          </div>

          {/* Custom Date Range */}
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
            />
          </div>
        </div>

        {/* Export & Print Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => statement && exportVendorStatementToExcel(statement, 'xlsx')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => statement && exportVendorStatementToExcel(statement, 'csv')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors shadow-md shadow-amber-500/10"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Statement</span>
          </button>
        </div>
      </div>

      {/* Printable Statement Document Wrapper */}
      <div className="bg-[#151c2c] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 printable-area">
        {/* Statement Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-white">VENDOR ACCOUNT STATEMENT</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                KARAMA MESS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Official supplier ledger &amp; meal transactions record (AED)</p>
            <div className="text-xs text-slate-300 font-mono mt-2">
              Period: <strong className="text-white">{startDate || 'Genesis'}</strong> to <strong className="text-white">{endDate || 'Present'}</strong>
            </div>
          </div>

          <div className="text-left sm:text-right bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="font-bold text-base text-white">{selectedVendor?.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">Code: <span className="font-mono text-amber-400">{selectedVendor?.vendor_code}</span></div>
            <div className="text-xs text-slate-400">Category: {selectedVendor?.category}</div>
            <div className="text-xs text-slate-400">Phone: {selectedVendor?.phone || '-'}</div>
            <div className="text-xs text-slate-400">Payment Terms: <span className="font-semibold text-slate-200">{selectedVendor?.payment_terms || 'Weekly'}</span></div>
          </div>
        </div>

        {/* 4 Financial Accounting Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* 1. Opening Balance */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">1. Opening Balance</span>
            <span className={`text-lg sm:text-xl font-black font-mono mt-1 block ${
              (statement?.openingBalance || 0) > 0 ? 'text-rose-400' : (statement?.openingBalance || 0) < 0 ? 'text-sky-400' : 'text-slate-300'
            }`}>
              {formatVendorAED(statement?.openingBalance || 0)}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {(statement?.openingBalance || 0) < 0 ? 'Advance / Credit' : 'Previous Payable'}
            </span>
          </div>

          {/* 2. Total Charges */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">2. (+) Total Charges</span>
            <span className="text-lg sm:text-xl font-black font-mono text-amber-400 mt-1 block">
              {formatVendorAED(filteredCharges)}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Meals + Additional</span>
          </div>

          {/* 3. Total Payments */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">3. (-) Total Payments</span>
            <span className="text-lg sm:text-xl font-black font-mono text-emerald-400 mt-1 block">
              {formatVendorAED(filteredPayments)}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Settled to vendor</span>
          </div>

          {/* 4. Closing Balance */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">4. (=) Closing Balance</span>
            <span className={`text-lg sm:text-xl font-black font-mono mt-1 block ${
              closingBalance > 0 ? 'text-rose-400' : closingBalance < 0 ? 'text-sky-400' : 'text-emerald-400'
            }`}>
              {formatVendorAED(closingBalance)}
            </span>
            <span className={`text-[10px] font-bold mt-0.5 block ${
              closingBalance > 0 ? 'text-rose-400' : closingBalance < 0 ? 'text-sky-400' : 'text-emerald-400'
            }`}>
              {closingBalance > 0 ? 'OUTSTANDING PAYABLE' : closingBalance < 0 ? 'ADVANCE / CREDIT' : 'SETTLED'}
            </span>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="border border-slate-800 rounded-xl overflow-hidden shadow-inner">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0f1422] text-slate-300 border-b border-slate-800 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-2">Day</th>
                  <th className="py-3 px-3 min-w-[140px]">Description</th>
                  <th className="py-3 px-2 text-center">Meals (BF/LN/DN)</th>
                  <th className="py-3 px-3 text-right">Meal Charges</th>
                  <th className="py-3 px-2.5 text-right">Charges Breakdown</th>
                  <th className="py-3 px-3 text-right font-black">Total Charges</th>
                  <th className="py-3 px-3 text-right">Amount Paid</th>
                  <th className="py-3 px-3 text-right font-black">Running Balance</th>
                  <th className="py-3 px-3 text-left">Remarks / Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {/* Initial Opening Balance Row */}
                <tr className="bg-slate-900/60 font-semibold text-slate-400 italic">
                  <td className="py-2.5 px-3 font-mono text-[11px]">{startDate || 'Genesis'}</td>
                  <td className="py-2.5 px-2">-</td>
                  <td className="py-2.5 px-3">Opening Balance Brought Forward</td>
                  <td className="py-2.5 px-2 text-center">-</td>
                  <td className="py-2.5 px-3 text-right font-mono">-</td>
                  <td className="py-2.5 px-2.5 text-right font-mono text-[10px]">-</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-400">-</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-400">-</td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-amber-300">
                    {formatVendorAED(statement?.openingBalance || 0)}
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-500">Initial balance</td>
                </tr>

                {items.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-10 text-center text-slate-400 text-xs">
                      No transactions recorded in this period.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-200 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-2.5 px-2 text-slate-400 text-[11px] whitespace-nowrap">
                        {item.day_name || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-white">
                        <div className="font-semibold text-xs">{item.description}</div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-[11px] text-slate-300 whitespace-nowrap">
                        {item.breakfast_qty !== undefined && (item.breakfast_qty > 0 || item.lunch_qty! > 0 || item.dinner_qty! > 0) ? (
                          <span>{item.breakfast_qty}/{item.lunch_qty}/{item.dinner_qty}</span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                        {item.meal_charges > 0 ? formatVendorAED(item.meal_charges) : '-'}
                      </td>
                      <td className="py-2.5 px-2.5 text-right font-mono text-[10px] text-slate-400 whitespace-nowrap">
                        {(item.service_charge > 0 || item.delivery_charge > 0 || item.packing_charge > 0 || item.other_charges > 0) ? (
                          <span>
                            {item.service_charge > 0 ? `S:${item.service_charge} ` : ''}
                            {item.delivery_charge > 0 ? `D:${item.delivery_charge} ` : ''}
                            {item.packing_charge > 0 ? `P:${item.packing_charge} ` : ''}
                            {item.other_charges > 0 ? `O:${item.other_charges}` : ''}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400 whitespace-nowrap">
                        {formatVendorAED(item.total_charges)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {item.payments > 0 ? formatVendorAED(item.payments) : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-black whitespace-nowrap">
                        <span className={item.running_balance > 0 ? 'text-rose-400' : item.running_balance < 0 ? 'text-sky-400' : 'text-slate-300'}>
                          {formatVendorAED(item.running_balance)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[150px]">
                        {item.remarks || item.reference_no || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {/* Footer Total Row */}
              <tfoot className="bg-[#0f1422] border-t-2 border-slate-700 font-bold text-xs">
                <tr>
                  <td colSpan={6} className="py-3 px-3 text-right text-slate-300 uppercase tracking-wider">
                    Total Period Activity / Final Closing:
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-amber-400">
                    {formatVendorAED(filteredCharges)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-emerald-400">
                    {formatVendorAED(filteredPayments)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-base">
                    <span className={closingBalance > 0 ? 'text-rose-400' : closingBalance < 0 ? 'text-sky-400' : 'text-emerald-400'}>
                      {formatVendorAED(closingBalance)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => onOpenRecordPayment(selectedVendorId)}
                      className="px-2.5 py-1 rounded bg-emerald-600/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 hover:bg-emerald-600/40"
                    >
                      Pay Due
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer Notes & Signatures */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-400 gap-4">
          <div>
            <div className="font-semibold text-slate-300">Accounting Formula:</div>
            <div>Closing Balance = Opening Balance + Total Charges - Total Payments</div>
            <div className="text-[10px] text-slate-500 mt-1">Generated by Karama Mess Management Software - Dubai, UAE</div>
          </div>

          <div className="flex gap-8 text-center pt-2 sm:pt-0">
            <div className="border-t border-slate-700 pt-1 w-32">
              <span className="text-[10px] text-slate-400">Prepared By</span>
            </div>
            <div className="border-t border-slate-700 pt-1 w-32">
              <span className="text-[10px] text-slate-400">Authorized Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
