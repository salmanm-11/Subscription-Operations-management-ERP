import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Users, 
  Building2, 
  CreditCard, 
  CalendarDays, 
  CalendarClock,
  BarChart3, 
  Settings, 
  UtensilsCrossed, 
  FileText, 
  AlertCircle, 
  ShieldCheck, 
  HelpCircle, 
  LogOut,
  Truck,
  Search,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  userRole?: string;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab, 
  onLogout, 
  userRole,
  userName = 'Admin' 
}) => {
  const isViewer = userRole === 'viewer';
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'buildings', label: 'Buildings', icon: Building2 },
    { id: 'attendance', label: 'Meal Attendance', icon: UtensilsCrossed },
    { id: 'meal-plans', label: 'Meal Plans', icon: CalendarDays },
    { id: 'billing', label: 'Billing & Invoices', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'due-dates-leaving', label: 'Due Dates & Leaving', icon: CalendarClock },
    { id: 'vendor-accounts', label: 'Vendor Accounts', icon: Truck },
    { id: 'overdue', label: 'Overdue Accounts', icon: AlertCircle },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    ...(!isViewer ? [
      { id: 'admin', label: 'Admin & Users', icon: ShieldCheck },
      { id: 'settings', label: 'Settings', icon: Settings },
    ] : []),
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const filteredNav = searchQuery.trim()
    ? navItems.filter((i) => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : navItems;

  return (
    <aside className="w-64 bg-[#121316] border-r border-[#1e2025] flex flex-col h-screen fixed left-0 top-0 select-none z-30 font-sans text-slate-300">
      
      {/* 1. Orbit Brand Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#1e2025]/60">
        <div className="flex items-center gap-3">
          {/* Orbit glowing crescent icon */}
          <div className="w-8 h-8 rounded-xl bg-[#1c1e24] border border-[#2a2d36] flex items-center justify-center relative shadow-sm shadow-orange-500/10">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#ff8d24] to-[#f95900] flex items-center justify-center relative overflow-hidden shadow-[0_0_12px_rgba(255,120,20,0.5)]">
              {/* Crescent cutout inside */}
              <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#1c1e24]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#1c1e24] absolute bottom-1 left-1" />
            </div>
          </div>
          <span className="text-white font-extrabold text-lg tracking-tight font-sans">
            Orbit
          </span>
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          type="button"
          className="p-1.5 rounded-lg text-[#7c8494] hover:text-white hover:bg-[#1a1c22] transition-colors"
          title="Toggle Sidebar Layout"
        >
          <PanelLeftClose className="w-4 h-4 stroke-[1.8]" />
        </button>
      </div>

      {/* 2. Global Search with ⌘ K */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#17191e] border border-[#23262e] text-xs text-slate-400 group focus-within:border-white/20 focus-within:bg-[#1b1e25] transition-all">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#737b8b] group-focus-within:text-white transition-colors shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search navigation..."
              className="w-full bg-transparent text-white placeholder-[#636b7a] text-xs md:text-[13px] font-medium focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-[#737b8b] px-1.5 py-0.5 rounded bg-[#1e2128] border border-[#2c303a] shrink-0 select-none">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Body */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4 custom-scrollbar">
        
        {/* Navigation Section */}
        <div>
          <div className="text-[11px] font-bold text-[#626b7d] px-2.5 pb-2 uppercase tracking-wider">
            Navigation
          </div>
          <div className="space-y-1">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ff9500] to-[#f97316] text-slate-950 font-black shadow-md shadow-orange-500/25'
                      : 'text-[#94a0b8] hover:text-white hover:bg-[#191c22]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-[18px] h-[18px] shrink-0 stroke-[2] ${isActive ? 'text-slate-950 stroke-[2.2]' : 'text-[#717b8f]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Orbit User Footer */}
      <div className="p-3.5 border-t border-[#1e2025]/60 bg-[#101114]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border border-white/20 shadow-sm shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate font-sans">
                {userName}
              </div>
              <div className="text-[10px] text-[#6e7789] truncate">
                {userRole || 'Administrator'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg text-[#7c8494] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Log Out of Orbit"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
