import React from 'react';
import appIcon from '../../assets/app-icon.png';
import { 
  LayoutDashboard, 
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
  Truck 
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onLogout, userRole }) => {
  const isViewer = userRole === 'viewer';
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
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

  return (
    <aside className="w-56 bg-[#0b0f19] border-r border-[#1e293b] flex flex-col h-screen fixed left-0 top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-4 flex flex-col items-center text-center border-b border-[#1e293b]/60">
        <img 
          src={appIcon} 
          alt="Karama Mess" 
          className="w-12 h-12 rounded-2xl mb-2 shadow-md shadow-emerald-500/10 object-cover border border-emerald-500/20"
        />
        <h1 className="text-white font-black text-lg tracking-wider font-sans">
          KARAMA MESS
        </h1>
        <p className="text-[10px] text-amber-400 font-bold tracking-widest mt-0.5 uppercase">
          Good Food. Happy People.
        </p>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-[#1e293b]/60">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
