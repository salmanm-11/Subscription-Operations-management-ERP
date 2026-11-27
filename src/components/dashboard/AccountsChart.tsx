import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Calendar, ChevronDown } from 'lucide-react';
import { formatAED } from '../../utils/currency';

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
  // 7-day distribution mimicking Orbit's Revenue Bar Chart
  const [activeDay, setActiveDay] = useState<string>('Thu');

  const days = [
    { label: 'Mon', value: 4200, height: 45 },
    { label: 'Tue', value: 7100, height: 72 },
    { label: 'Wed', value: 5800, height: 58 },
    { label: 'Thu', value: 9340, height: 92, isPeak: true },
    { label: 'Fri', value: 6400, height: 64 },
    { label: 'Sat', value: 4900, height: 48 },
    { label: 'Sun', value: 3600, height: 38 },
  ];

  const currentRevenue = 10985.56;

  return (
    <div className="bg-[#16181d] border border-[#242730] rounded-2xl p-6 shadow-xl shadow-black/40 flex flex-col justify-between h-full font-sans">
      
      {/* Top Header */}
      <div>
        <span className="text-xs font-semibold text-[#8a92a3] tracking-wide uppercase">
          Revenue
        </span>
        <div className="mt-1 flex items-baseline gap-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            ${currentRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#f87171]">
          <span>2.5% ↓</span>
          <span className="text-[#788193] font-normal">vs last week</span>
        </div>
      </div>

      {/* Main Interactive Bar Chart with Orbit Glowing Peak Column */}
      <div className="mt-8 pt-6 relative border-t border-[#20232a]/60">
        
        {/* Horizontal Dashed Guide Line intersecting the peak */}
        <div className="absolute top-11 left-0 right-0 border-b border-dashed border-[#3a3f4e]/40 z-0 pointer-events-none" />

        {/* Floating Tooltip Pill over the active/peak Thu bar */}
        <div className="absolute top-4 left-[53%] -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111317] border border-[#2c303c] text-white text-[11px] font-bold shadow-xl shadow-black/80 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 ring-4 ring-cyan-500/20 shadow-[0_0_8px_#38bdf8]" />
            <span>$9,340</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="h-44 sm:h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 relative z-10">
          {days.map((d) => {
            const isSelected = activeDay === d.label;
            const isPeak = d.isPeak;

            return (
              <div 
                key={d.label}
                onClick={() => setActiveDay(d.label)}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
              >
                {/* Bar */}
                <div 
                  className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 relative ${
                    isPeak
                      ? 'bg-gradient-to-t from-[#f55900] via-[#ff7c15] to-[#ffa44e] shadow-[0_0_28px_rgba(255,120,20,0.5)]'
                      : 'bg-gradient-to-t from-[#1d2026] to-[#2e323b] hover:from-[#242730] hover:to-[#383d47]'
                  }`}
                  style={{ height: `${d.height}%` }}
                />

                {/* Day Label */}
                <span className={`text-xs mt-3 font-semibold transition-colors ${
                  isPeak ? 'text-white font-bold' : 'text-[#707889] group-hover:text-slate-300'
                }`}>
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sub-Widget (Leads by Status / Subscriptions Summary matching screenshot) */}
      <div className="mt-5 pt-3.5 border-t border-[#20232a] flex items-center justify-between text-xs text-[#8c94a5]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Active Pipeline:</span>
          <span className="text-[#22c55e] font-bold">{runningAccounts} Running Accounts</span>
          <span>•</span>
          <span className="text-[#f87171] font-bold">{overdueAccounts} Overdue</span>
        </div>
        <div className="flex items-center gap-1 text-[#6a7282] hover:text-white transition-colors cursor-pointer">
          <span className="text-[11px] font-medium">Weekly View</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
