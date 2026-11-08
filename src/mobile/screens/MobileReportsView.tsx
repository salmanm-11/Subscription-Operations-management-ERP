import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Users, Building2, CheckCircle2 } from 'lucide-react';
import { Customer, Payment, Invoice } from '../../types';
import { formatAED } from '../../utils/currency';

interface MobileReportsViewProps {
  customers: Customer[];
  payments: Payment[];
  invoices: Invoice[];
}

export const MobileReportsView: React.FC<MobileReportsViewProps> = ({
  customers,
  payments,
  invoices,
}) => {
  const totalCustomers = customers.length;
  const activeCount = customers.filter(
    (c) => c.status === 'active' || !c.status || c.status === 'trial'
  ).length;

  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalOverdue = customers.reduce((sum, c) => sum + (c.total_overdue || 0), 0);

  // Group by building
  const buildingMap: Record<string, number> = {};
  customers.forEach((c) => {
    const b = c.building?.name || c.building_name_cache || 'General';
    buildingMap[b] = (buildingMap[b] || 0) + 1;
  });

  const sortedBuildings = Object.entries(buildingMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FBF8F5] pb-24 text-stone-800 max-w-md mx-auto select-none">
      <header className="sticky top-0 z-30 bg-[#FBF8F5]/90 backdrop-blur-md px-4 py-3 border-b border-[#EFE8DE]/80">
        <h2 className="text-xl font-black text-stone-900 tracking-tight">Financial Reports</h2>
        <p className="text-xs text-stone-500 font-semibold">Live Performance & Analytics</p>
      </header>

      <main className="p-4 space-y-4">
        {/* Total Collected Card */}
        <div className="bg-gradient-to-br from-[#7E1522] to-[#981E2E] text-white rounded-3xl p-5 shadow-xl shadow-[#7E1522]/20 space-y-2">
          <span className="text-xs text-rose-200 font-bold block uppercase tracking-wider">
            Total Revenue Collected
          </span>
          <span className="text-3xl font-black font-mono tracking-tight block">
            {formatAED(totalCollected)}
          </span>
          <div className="pt-2 flex items-center justify-between text-xs text-rose-100 border-t border-white/20">
            <span>Active Customers: {activeCount}</span>
            <span>Overdue Dues: {formatAED(totalOverdue)}</span>
          </div>
        </div>

        {/* 2 Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-[#EFE8DE] shadow-sm">
            <span className="text-xs text-stone-500 font-bold block">Collection Rate</span>
            <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
              {totalCollected + totalOverdue > 0
                ? `${Math.round((totalCollected / (totalCollected + totalOverdue)) * 100)}%`
                : '100%'}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#EFE8DE] shadow-sm">
            <span className="text-xs text-stone-500 font-bold block">Overdue Accounts</span>
            <span className="text-2xl font-black text-[#7E1522] font-mono mt-1 block">
              {customers.filter((c) => (c.total_overdue || 0) > 0).length}
            </span>
          </div>
        </div>

        {/* Top Delivery Buildings */}
        <div className="bg-white rounded-3xl p-5 border border-[#EFE8DE] shadow-sm space-y-3">
          <h4 className="font-black text-sm text-stone-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#7E1522]" />
            <span>Top Delivery Locations</span>
          </h4>

          <div className="space-y-2 pt-1">
            {sortedBuildings.map(([bName, count]) => {
              const pct = totalCustomers > 0 ? Math.round((count / totalCustomers) * 100) : 0;
              return (
                <div key={bName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-700 truncate max-w-[200px]">{bName}</span>
                    <span className="text-stone-500 font-mono">{count} customers ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-[#7E1522] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
