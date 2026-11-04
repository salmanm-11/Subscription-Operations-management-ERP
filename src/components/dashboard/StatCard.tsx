import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  badgeText: string;
  badgeColor: 'blue' | 'green' | 'red' | 'yellow';
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  badgeText,
  badgeColor,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  const badgeClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  }[badgeColor];

  return (
    <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl p-5 relative overflow-hidden shadow-lg shadow-black/20 hover:border-slate-600/60 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full border ${badgeClasses}`}>
          {badgeText}
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 tracking-wide">{title}</p>
        <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
};
