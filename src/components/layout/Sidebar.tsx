import React, { useState } from 'react';
import hiroLogo from '../../assets/hiro-axis-logo.png';
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
      
      {/* 1. Hiro Axis Brand Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-[#1e2025]/60">
        <div className="flex items-center gap-3 min-w-0">
          {/* Hiro Axis logo container with blue cyan glow border */}
          <div className="w-10 h-10 rounded-2xl bg-[#0b101b] border border-sky-500/50 flex items-center justify-center p-1.5 shadow-[0_0_18px_rgba(14,165,233,0.35)] shrink-0 overflow-hidden">
            <img 
              src={hiroLogo} 
              alt="Hiro Axis" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <span className="text-white font-extrabold text-[17px] leading-tight tracking-tight font-sans">
              Hiro Axis
            </span>
            <span className="text-[8.5px] font-mono font-medium text-[#7d8799] tracking-[0.24em] uppercase mt-0.5">
              TECHNOLOGIES
            </span>
          </div>
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          type="button"
          className="p-1.5 rounded-lg border border-[#2a2f3b] text-[#858fa1] hover:text-white hover:bg-[#1c202a] transition-colors shrink-0"
          title="Toggle Sidebar Layout"
        >
          <PanelLeftClose className="w-4 h-4 stroke-[1.8]" />
        </button>
      </div>

      {/* 2. Global Search with ⌘ K */}
      <div className="px-4 pt-3.5 pb-2">
        <div className="relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#13151b] border border-[#242732] text-xs text-slate-400 group focus-within:border-sky-500/40 focus-within:bg-[#161922] transition-all">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#757f92] group-focus-within:text-white transition-colors shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search navigation..."
              className="w-full bg-transparent text-white placeholder-[#687284] text-xs md:text-[13px] font-medium focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-[#8e98aa] px-2 py-0.5 rounded-lg bg-[#1a1d25] border border-[#2b313d] shrink-0 select-none">
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
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
