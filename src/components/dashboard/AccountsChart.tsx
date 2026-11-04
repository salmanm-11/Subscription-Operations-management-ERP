import React from 'react';
import { Calendar } from 'lucide-react';

interface AccountsChartProps {
  totalCustomers: number;
  runningAccounts: number;
  overdueAccounts: number;
}

export const AccountsChart: React.FC<AccountsChartProps> = ({
  totalCustomers,
  runningAccounts,
  overdueAccounts,
}) => {
  const months = [
    {
      name: 'Aug 2026',
      total: totalCustomers > 0 ? Math.max(1, Math.round(totalCustomers * 0.88)) : 0,
      running: runningAccounts > 0 ? Math.max(1, Math.round(runningAccounts * 0.85)) : 0,
      overdue: Math.max(0, Math.round(overdueAccounts * 0.5)),
    },
    {
      name: 'Sep 2026',
      total: totalCustomers > 0 ? Math.max(1, Math.round(totalCustomers * 0.95)) : 0,
      running: runningAccounts > 0 ? Math.max(1, Math.round(runningAccounts * 0.92)) : 0,
      overdue: Math.max(0, Math.round(overdueAccounts * 0.8)),
    },
    {
      name: 'Oct 2026',
      total: totalCustomers,
      running: runningAccounts,
      overdue: overdueAccounts,
    },
  ];

  const maxVal = Math.max(...months.map((m) => Math.max(m.total, m.running, m.overdue, 1)), 6);
  const step = Math.max(1, Math.ceil(maxVal / 3));
  const ticks = [0, step, step * 2, maxVal];

  return (
    <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Customer Accounts Overview</h3>
          <p className="text-xs text-slate-400 mt-0.5">Account status over the last 3 months</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Aug 2026 - Oct 2026</span>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-48 sm:h-52 w-full flex items-end justify-between px-2 sm:px-5 pt-4 pb-2 border-b border-slate-800 relative">
        {/* Y Axis Grid lines */}
        {ticks.map((tick) => (
          <div
            key={tick}
            className="absolute left-0 right-0 border-b border-slate-800/80 flex items-center"
            style={{ bottom: `${(tick / maxVal) * 85}%` }}
          >
            <span className="text-[10px] text-slate-500 font-mono -translate-y-1/2 -ml-2">{tick}</span>
          </div>
        ))}

        {/* Bars */}
        {months.map((m) => (
          <div key={m.name} className="flex-1 flex flex-col items-center z-10">
            <div className="flex items-end gap-1.5 sm:gap-2.5 h-36 sm:h-40">
              {/* Total Customers bar */}
              <div
                className="w-6 sm:w-7 md:w-8 bg-slate-600/70 rounded-t-md transition-all duration-300 hover:bg-slate-500"
                style={{ height: `${Math.max((m.total / maxVal) * 100, 10)}%` }}
                title={`Total Customers: ${m.total}`}
              />
              {/* Running Accounts bar */}
              <div
                className="w-6 sm:w-7 md:w-8 bg-emerald-500/80 rounded-t-md transition-all duration-300 hover:bg-emerald-400 shadow-sm shadow-emerald-500/20"
                style={{ height: `${Math.max((m.running / maxVal) * 100, 10)}%` }}
                title={`Running Accounts: ${m.running}`}
              />
              {/* Overdue Accounts bar */}
              {m.overdue > 0 && (
                <div
                  className="w-6 sm:w-7 md:w-8 bg-rose-500/80 rounded-t-md transition-all duration-300 hover:bg-rose-400 shadow-sm shadow-rose-500/20"
                  style={{ height: `${Math.max((m.overdue / maxVal) * 100, 10)}%` }}
                  title={`Overdue Accounts: ${m.overdue}`}
                />
              )}
            </div>
            <span className="text-xs font-semibold text-slate-400 mt-2.5">{m.name}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-500" />
          <span className="text-xs text-slate-400 font-medium">Total Customers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-400 font-medium">Running Accounts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-xs text-slate-400 font-medium">Overdue Accounts</span>
        </div>
      </div>
    </div>
  );
};
