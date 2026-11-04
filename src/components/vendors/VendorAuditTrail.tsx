import React, { useState } from 'react';
import { ShieldCheck, History, Search, Filter, Clock, User, ArrowRight } from 'lucide-react';
import { VendorAuditLog } from '../../types';

interface VendorAuditTrailProps {
  logs: VendorAuditLog[];
}

export const VendorAuditTrail: React.FC<VendorAuditTrailProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      (log.vendor_name && log.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performed_by.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create_vendor':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">CREATE VENDOR</span>;
      case 'update_vendor':
      case 'charges_update':
        return <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 text-[10px] font-bold">RATES &amp; CONFIG</span>;
      case 'daily_entry':
        return <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold">DAILY ENTRY</span>;
      case 'payment_record':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">PAYMENT</span>;
      case 'excel_import':
        return <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-bold">EXCEL SYNC</span>;
      case 'correction':
      case 'delete_transaction':
        return <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold">CORRECTION</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">{action.toUpperCase()}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#151c2c] border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Financial Audit Trail &amp; History</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable log of vendor registrations, daily adjustments, payments &amp; rate modifications
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Actions</option>
            <option value="create_vendor">Vendor Created</option>
            <option value="update_vendor">Vendor Updated</option>
            <option value="daily_entry">Daily Entry</option>
            <option value="payment_record">Payment Recorded</option>
            <option value="excel_import">Excel Import</option>
            <option value="correction">Financial Correction</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0f1422] text-slate-400 border-b border-slate-800 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-3">Vendor</th>
                <th className="py-3 px-4">Audit Details / Financial Impact</th>
                <th className="py-3 px-3 text-right">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No audit records match the current search filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{log.timestamp.slice(0, 19).replace('T', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-bold text-white">
                      {log.vendor_name || 'General Vendor'}
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-xs">
                      {log.details}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        <User className="w-3 h-3 text-amber-400" />
                        <span>{log.performed_by}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
