import React from 'react';
import { Home, Users, CreditCard, BarChart3, MoreHorizontal } from 'lucide-react';

export type MobileTab = 'home' | 'customers' | 'payments' | 'reports' | 'more';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  pendingAlertsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  pendingAlertsCount = 0,
}) => {
  const tabs = [
    { id: 'home' as MobileTab, label: 'Home', icon: Home },
    { id: 'customers' as MobileTab, label: 'Customers', icon: Users },
    { id: 'payments' as MobileTab, label: 'Payments', icon: CreditCard },
    { id: 'reports' as MobileTab, label: 'Reports', icon: BarChart3 },
    { id: 'more' as MobileTab, label: 'More', icon: MoreHorizontal, badge: pendingAlertsCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EFE8DE] px-3 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] max-w-md mx-auto">
      <div className="grid grid-cols-5 gap-1 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-[#7E1522] font-black'
                  : 'text-stone-400 hover:text-stone-600 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-[#7E1522]/10 scale-105' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>

              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-[#7E1522] text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
