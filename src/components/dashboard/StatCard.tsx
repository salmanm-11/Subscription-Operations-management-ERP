import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  badgeText?: string;
  badgeColor?: 'blue' | 'green' | 'red' | 'yellow';
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  trendText?: string;
  isPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  badgeText,
  badgeColor = 'green',
  icon: Icon,
  trendText,
  isPositive = true,
}) => {
  // Determine trend badge text if not explicitly provided
  const displayTrend = trendText || (badgeColor === 'red' ? 'Requires Attention' : '+5 vs last month');

  return (
    <div className="bg-[#16181d] border border-[#242730] rounded-2xl p-5 relative overflow-hidden shadow-xl shadow-black/40 hover:border-white/20 transition-all group font-sans flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <p className="text-xs font-semibold text-[#8b93a4] tracking-wide">
          {title}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <h3 className="text-3xl font-extrabold text-white tracking-tight font-sans">
            {value}
          </h3>
        </div>
      </div>

      {/* Bottom Trend & Status */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className={badgeColor === 'red' ? 'text-[#f87171]' : 'text-[#22c55e]'}>
            {badgeColor === 'red' ? '●' : '+'} {displayTrend}
          </span>
        </div>

        {badgeText && (
          <span className="font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#1f222a] border border-[#2c303c] text-[#788194]">
            {badgeText}
          </span>
        )}
      </div>

      {/* Decorative 3D Stacked Cards Graphic (Exact replica of Orbit design) */}
      <div className="absolute right-3.5 top-3.5 w-16 h-16 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
        <div className="relative w-full h-full">
          {/* Card layer 1 (bottom) */}
          <div className="absolute right-0 top-0 w-11 h-13 rounded-lg bg-[#20232a] border border-[#2e323d] rotate-12 shadow-md transform -translate-x-1" />
          {/* Card layer 2 (middle) */}
          <div className="absolute right-1 top-1 w-11 h-13 rounded-lg bg-[#242730] border border-[#343946] rotate-6 shadow-md" />
          {/* Card layer 3 (top focused card with stripes) */}
          <div className="absolute right-2 top-2 w-11 h-13 rounded-lg bg-[#282c37] border border-[#3e4453] p-1.5 shadow-lg flex flex-col justify-center gap-1">
            <div className="w-5 h-0.5 bg-white/40 rounded-full" />
            <div className="w-7 h-0.5 bg-white/60 rounded-full" />
            <div className="w-6 h-0.5 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
