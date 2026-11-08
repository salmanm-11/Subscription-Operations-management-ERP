import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Users,
  UserCheck,
  AlertTriangle,
  Utensils,
  ArrowRight,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { Customer, Invoice, Payment } from '../../types';
import { formatAED } from '../../utils/currency';
import loginBg from '../../assets/login-bg.jpg';

interface MobileDashboardViewProps {
  customers: Customer[];
  invoices: Invoice[];
  payments: Payment[];
  userName?: string;
  onOpenMenu: () => void;
  onOpenAlerts: () => void;
  onMarkAttendance: () => void;
  onViewCustomerList: () => void;
  onViewOverdueList: () => void;
  pendingAlertsCount?: number;
}

export const MobileDashboardView: React.FC<MobileDashboardViewProps> = ({
  customers,
  invoices,
  payments,
  userName = 'Admin',
  onOpenMenu,
  onOpenAlerts,
  onMarkAttendance,
  onViewCustomerList,
  onViewOverdueList,
  pendingAlertsCount = 0,
}) => {
  const [chartPeriod, setChartPeriod] = useState<'3months' | '6months'>('3months');

  // Compute live metrics directly from real customer database
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(
    (c) => c.status === 'active' || !c.status || c.status === 'trial'
  ).length;

  const totalOverdue = customers.reduce(
    (sum, c) => sum + (c.total_overdue || 0),
    0
  );

  // Total meals delivered today
  const mealsToday = customers.reduce((sum, c) => {
    let count = 0;
    if (c.has_breakfast) count++;
    if (c.has_lunch) count++;
    if (c.has_dinner) count++;
    return sum + (count || 3);
  }, 0);

  return (
    <div className="min-h-screen bg-[#FBF8F5] pb-24 text-stone-800 max-w-md mx-auto select-none">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#FBF8F5]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#EFE8DE]/80">
        <button
          onClick={onOpenMenu}
          className="p-2 rounded-xl text-stone-700 hover:bg-stone-200/50 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#7E1522] flex items-center justify-center text-white shadow-sm">
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C8.69 2 6 4.69 6 8C4.34 8 3 9.34 3 11C3 12.39 3.95 13.56 5.25 13.89C5.09 14.24 5 14.61 5 15C5 17.21 6.79 19 9 19H15C17.21 19 19 17.21 19 15C19 14.61 18.91 14.24 18.75 13.89C20.05 13.56 21 12.39 21 11C21 9.34 19.66 8 18 8C18 4.69 15.31 2 12 2ZM6 20H18V22H6V20Z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="font-black text-sm text-[#7E1522] tracking-tight leading-tight">
              Karama Mess
            </div>
            <div className="text-[10px] text-stone-500 font-semibold leading-none">
              Good Food. Happier People.
            </div>
          </div>
        </div>

        <button
          onClick={onOpenAlerts}
          className="p-2 rounded-xl text-stone-700 hover:bg-stone-200/50 relative transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {pendingAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#7E1522] text-white text-[9px] font-black flex items-center justify-center shadow-sm animate-pulse">
              {pendingAlertsCount}
            </span>
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-4 space-y-4">
        {/* Welcome Greeting Banner */}
        <div className="bg-gradient-to-r from-white via-white to-amber-50/40 rounded-2xl p-4 border border-[#EFE8DE] shadow-sm flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-black text-stone-900 tracking-tight flex items-center gap-1.5">
              <span>Good morning,</span>
              <span className="text-[#7E1522] capitalize">{userName}</span>
              <span>👋</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 font-medium">
              Here's what's happening at Karama Mess today.
            </p>
          </div>

          <div className="w-16 h-16 rounded-full overflow-hidden shadow-md border-2 border-white shrink-0 relative">
            <img src={loginBg} alt="Food" className="w-full h-full object-cover scale-125" />
          </div>
        </div>

        {/* 2x2 Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* 1. Total Customers */}
          <button
            onClick={onViewCustomerList}
            className="bg-white rounded-2xl p-3.5 border border-[#EFE8DE] shadow-sm hover:shadow-md transition-all text-left flex items-start gap-3 active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#7E1522] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-stone-500 block truncate">
                Total Customers
              </span>
              <span className="text-2xl font-black text-stone-900 font-mono tracking-tight leading-none mt-1 block">
                {totalCustomers}
              </span>
            </div>
          </button>

          {/* 2. Active Accounts */}
          <button
            onClick={onViewCustomerList}
            className="bg-white rounded-2xl p-3.5 border border-[#EFE8DE] shadow-sm hover:shadow-md transition-all text-left flex items-start gap-3 active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-stone-500 block truncate">
                Active Accounts
              </span>
              <span className="text-2xl font-black text-stone-900 font-mono tracking-tight leading-none mt-1 block">
                {activeCustomers}
              </span>
            </div>
          </button>

          {/* 3. Total Overdue */}
          <button
            onClick={onViewOverdueList}
            className="bg-white rounded-2xl p-3.5 border border-[#EFE8DE] shadow-sm hover:shadow-md transition-all text-left flex items-start gap-3 active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-stone-500 block truncate">
                Total Overdue
              </span>
              <span className="text-base font-black text-[#7E1522] font-mono tracking-tight leading-tight mt-1 block truncate">
                {formatAED(totalOverdue)}
              </span>
            </div>
          </button>

          {/* 4. Meals Today */}
          <button
            onClick={onMarkAttendance}
            className="bg-white rounded-2xl p-3.5 border border-[#EFE8DE] shadow-sm hover:shadow-md transition-all text-left flex items-start gap-3 active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-stone-500 block truncate">
                Meals Today
              </span>
              <span className="text-2xl font-black text-stone-900 font-mono tracking-tight leading-none mt-1 block">
                {mealsToday}
              </span>
            </div>
          </button>
        </div>

        {/* Today's Meals Banner Card */}
        <div className="rounded-2xl bg-gradient-to-r from-[#690F1C] via-[#7E1522] to-[#8C1B2A] text-white p-4 shadow-xl shadow-[#7E1522]/20 relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="space-y-1">
              <h3 className="text-lg font-black tracking-tight">Today's Meals</h3>
              <p className="text-xs text-rose-100/90 font-medium">
                Breakfast + Lunch + Dinner
              </p>

              <div className="pt-2">
                <button
                  onClick={onMarkAttendance}
                  className="px-4 py-2 rounded-full bg-white hover:bg-stone-100 text-[#7E1522] font-black text-xs shadow-md transition-all active:scale-[0.97] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Mark Attendance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 shrink-0 rotate-3">
              <img src={loginBg} alt="Today's Meal" className="w-full h-full object-cover scale-125" />
            </div>
          </div>
        </div>

        {/* Customer Overview Bar Chart Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#EFE8DE] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-stone-900">Customer Overview</h3>
            <button
              onClick={() => setChartPeriod(chartPeriod === '3months' ? '6months' : '3months')}
              className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:text-stone-800"
            >
              <span>{chartPeriod === '3months' ? 'Last 3 Months' : 'Last 6 Months'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-2">
            <div className="h-40 flex items-end justify-around gap-4 border-b border-stone-200 pb-2 px-2">
              {/* Aug 2026 */}
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-full flex items-end justify-center gap-1.5 h-32">
                  <div
                    className="w-3 rounded-t-md bg-[#7E1522] transition-all"
                    style={{ height: '75%' }}
                    title="Total Customers: 95"
                  />
                  <div
                    className="w-3 rounded-t-md bg-rose-300 transition-all"
                    style={{ height: '70%' }}
                    title="Running Accounts: 90"
                  />
                  <div
                    className="w-3 rounded-t-md bg-amber-400 transition-all"
                    style={{ height: '15%' }}
                    title="Overdue Accounts: 12"
                  />
                </div>
                <span className="text-[10px] font-bold text-stone-500">Aug 2026</span>
              </div>

              {/* Sep 2026 */}
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-full flex items-end justify-center gap-1.5 h-32">
                  <div
                    className="w-3 rounded-t-md bg-[#7E1522] transition-all"
                    style={{ height: '85%' }}
                    title="Total Customers: 108"
                  />
                  <div
                    className="w-3 rounded-t-md bg-rose-300 transition-all"
                    style={{ height: '80%' }}
                    title="Running Accounts: 104"
                  />
                  <div
                    className="w-3 rounded-t-md bg-amber-400 transition-all"
                    style={{ height: '20%' }}
                    title="Overdue Accounts: 18"
                  />
                </div>
                <span className="text-[10px] font-bold text-stone-500">Sep 2026</span>
              </div>

              {/* Oct / Current */}
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-full flex items-end justify-center gap-1.5 h-32">
                  <div
                    className="w-3 rounded-t-md bg-[#7E1522] transition-all"
                    style={{ height: '95%' }}
                    title={`Total Customers: ${totalCustomers}`}
                  />
                  <div
                    className="w-3 rounded-t-md bg-rose-300 transition-all"
                    style={{ height: '90%' }}
                    title={`Running Accounts: ${activeCustomers}`}
                  />
                  <div
                    className="w-3 rounded-t-md bg-amber-400 transition-all"
                    style={{ height: '25%' }}
                    title={`Overdue: ${totalOverdue > 0 ? 'Active' : 'Zero'}`}
                  />
                </div>
                <span className="text-[10px] font-bold text-stone-900 font-bold">Nov 2026</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-3 pt-3 text-[10px] text-stone-600 font-medium">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#7E1522]" />
                <span>Total Customers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-300" />
                <span>Running Accounts</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                <span>Overdue</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
