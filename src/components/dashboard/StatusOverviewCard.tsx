import React, { useMemo } from 'react';
import { UserCheck, Sparkles, PauseCircle, UserX, Utensils, Users, CalendarX } from 'lucide-react';
import { Customer, DashboardMetrics } from '../../types';
import { getApproachingCancellations } from '../../utils/cancellationService';

interface StatusOverviewCardProps {
  metrics: DashboardMetrics;
  customers: Customer[];
  onViewAll?: () => void;
}

export const StatusOverviewCard: React.FC<StatusOverviewCardProps> = ({
  metrics,
  customers,
  onViewAll,
}) => {
  // Compute accurate live counts from customers array
  const total = customers.length || metrics.totalCustomers || 1;
  const activeCount = customers.filter((c) => c.status === 'active').length || metrics.activeCustomers || 0;
  const trialCount = customers.filter((c) => c.status === 'trial').length || metrics.trialCustomers || 0;
  const pausedCount = customers.filter((c) => c.status === 'paused').length || 0;
  const inactiveCount = customers.filter((c) => c.status === 'inactive' || c.status === 'left' || c.status === 'cancelled').length ||
    Math.max(0, total - activeCount - trialCount - pausedCount);

  // Approaching cancellations within 15 days
  const approachingCancellations = useMemo(() => {
    return getApproachingCancellations(customers, 15);
  }, [customers]);

  // Proportions for visual bar
  const activePct = Math.round((activeCount / total) * 100);
  const trialPct = Math.round((trialCount / total) * 100);
  const pausedPct = Math.round((pausedCount / total) * 100);
  const inactivePct = Math.max(0, 100 - activePct - trialPct - pausedPct);

  return (
    <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Account Status Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live distribution across subscription tiers</p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-slate-300">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>{total} Total</span>
          </div>
        </div>

        {/* 4 Status Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {/* Active */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Active</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-white">{activeCount}</div>
            <div className="text-[11px] text-emerald-300/80 font-medium">Running</div>
          </div>

          {/* Trial */}
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 ring-1 ring-sky-500/20 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
                Trial
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-xl font-black text-sky-300">{trialCount}</div>
            <div className="text-[11px] text-sky-400/80 font-medium">Testing</div>
          </div>

          {/* Paused */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Paused</span>
              <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-black text-white">{pausedCount}</div>
            <div className="text-[11px] text-amber-300/80 font-medium">On Hold</div>
          </div>

          {/* Cancelled / Stopped */}
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Cancelled</span>
              <UserX className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-xl font-black text-rose-300">{inactiveCount}</div>
            <div className="text-[11px] text-rose-400/80 font-medium">Cancelled</div>
          </div>
        </div>

        {/* Visual Distribution Ratio Bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium px-0.5">
            <span>Portfolio Ratio</span>
            <span>{activePct}% active • {trialPct}% trial</span>
          </div>
          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
            {activePct > 0 && (
              <div
                style={{ width: `${activePct}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title={`Active: ${activeCount} (${activePct}%)`}
              />
            )}
            {trialPct > 0 && (
              <div
                style={{ width: `${trialPct}%` }}
                className="bg-sky-400 h-full transition-all duration-300"
                title={`Trial: ${trialCount} (${trialPct}%)`}
              />
            )}
            {pausedPct > 0 && (
              <div
                style={{ width: `${pausedPct}%` }}
                className="bg-amber-400 h-full transition-all duration-300"
                title={`Paused: ${pausedCount} (${pausedPct}%)`}
              />
            )}
            {inactivePct > 0 && (
              <div
                style={{ width: `${inactivePct}%` }}
                className="bg-slate-600 h-full transition-all duration-300"
                title={`Inactive: ${inactiveCount} (${inactivePct}%)`}
              />
            )}
          </div>
        </div>

        {/* Cancellation Notice Alert Pill */}
        {approachingCancellations.length > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <CalendarX className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-xs truncate">
                <span className="font-bold text-amber-300">
                  {approachingCancellations.length} Customer{approachingCancellations.length > 1 ? 's' : ''} on Cancellation Notice
                </span>
                <span className="text-[11px] text-slate-400 ml-1.5 hidden sm:inline">
                  (Exit planned soon)
                </span>
              </div>
            </div>
            {onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 shrink-0 transition-colors cursor-pointer"
              >
                Review
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Kitchen & Meal Volume */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span>Today's Meals:</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-semibold text-slate-200">BF: {metrics.todayBreakfast || 0}</span>
            <span>•</span>
            <span className="font-semibold text-slate-200">LN: {metrics.todayLunch || 0}</span>
            <span>•</span>
            <span className="font-semibold text-slate-200">DN: {metrics.todayDinner || 0}</span>
          </div>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold hover:underline transition-colors"
          >
            Manage Accounts &gt;
          </button>
        )}
      </div>
    </div>
  );
};
