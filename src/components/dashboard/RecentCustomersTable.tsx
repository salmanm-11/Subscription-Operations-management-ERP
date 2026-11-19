import React, { useState, useMemo } from 'react';
import { Utensils, UserX, UserCheck, Users, UserPlus, Building2, Sparkles } from 'lucide-react';
import { Customer } from '../../types';
import { formatDateDDMMMYYYY } from '../../utils/dateFormatter';

interface RecentCustomersTableProps {
  customers: Customer[];
  allCustomers?: Customer[];
  onViewAll: () => void;
  onSelectCustomer?: (customer: Customer) => void;
}

export const RecentCustomersTable: React.FC<RecentCustomersTableProps> = ({
  customers,
  allCustomers,
  onViewAll,
  onSelectCustomer,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'cancelled'>('all');

  const fullList = allCustomers && allCustomers.length > 0 ? allCustomers : customers;

  // Sort by newest registration / creation / joining date descending
  const sortedNewest = useMemo(() => {
    return [...fullList].sort((a, b) => {
      const dateA = new Date(a.created_at || a.joining_date || a.billing_start_date || 0).getTime();
      const dateB = new Date(b.created_at || b.joining_date || b.billing_start_date || 0).getTime();
      return dateB - dateA;
    });
  }, [fullList]);

  const cancelledCount = useMemo(() => {
    return fullList.filter((c) => c.status === 'left' || c.status === 'cancelled').length;
  }, [fullList]);

  const activeCount = useMemo(() => {
    return fullList.filter((c) => c.status === 'active' || c.status === 'trial').length;
  }, [fullList]);

  const displayedCustomers = useMemo(() => {
    if (filterTab === 'cancelled') {
      return sortedNewest.filter((c) => c.status === 'left' || c.status === 'cancelled').slice(0, 10);
    }
    if (filterTab === 'active') {
      return sortedNewest.filter((c) => c.status === 'active' || c.status === 'trial').slice(0, 8);
    }
    return sortedNewest.slice(0, 8);
  }, [filterTab, sortedNewest]);

  return (
    <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Recent New Customers</h3>
          </div>
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700/60">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Recent
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('active')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'active'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('cancelled')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'cancelled'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cancelled ({cancelledCount})
            </button>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-amber-400 hover:text-amber-300 text-xs font-semibold border border-slate-700/60 transition-colors self-start sm:self-auto cursor-pointer"
        >
          View All &gt;
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-300 border-b border-slate-700/80 text-xs uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Building &amp; Apartment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Meal Preferences</th>
              <th className="py-3 px-4">Start Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-sm">
            {displayedCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  {filterTab === 'cancelled'
                    ? 'No cancelled customers found.'
                    : 'No customers found.'}
                </td>
              </tr>
            ) : (
              displayedCustomers.map((c, idx) => (
                <tr
                  key={c.id}
                  onClick={() => onSelectCustomer && onSelectCustomer(c)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  title="Click to view full customer details"
                >
                  <td className="py-3.5 px-4 font-extrabold text-white text-base tracking-tight group-hover:text-amber-300 transition-colors">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>{c.full_name}</span>
                      {idx < 2 && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black uppercase tracking-wider">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>NEW</span>
                        </span>
                      )}
                    </div>
                    {c.company_name && (
                      <div className="text-[11px] text-sky-300 font-semibold mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-sky-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{c.company_name}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-200">
                    <div className="font-bold text-sm">
                      {c.building_name_cache || c.building?.name || 'Main Building'}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">
                      Apt {c.apartment_cache || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                        c.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : c.status === 'trial'
                          ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                          : c.status === 'paused'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : (c.status === 'left' || c.status === 'cancelled')
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {(c.status === 'left' || c.status === 'cancelled') ? 'cancelled' : c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate max-w-[200px]">
                        {c.dietary_preferences || 'Standard Plan'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 text-xs sm:text-sm font-medium font-mono">
                    {c.joining_date || c.billing_start_date ? formatDateDDMMMYYYY(c.joining_date || c.billing_start_date) : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
