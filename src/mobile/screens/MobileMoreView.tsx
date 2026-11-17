import React from 'react';
import {
  Cloud,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { CloudStatusResult } from '../../api/supabase';

interface MobileMoreViewProps {
  cloudStatus?: CloudStatusResult;
  onRefreshData?: () => void;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
}

export const MobileMoreView: React.FC<MobileMoreViewProps> = ({
  cloudStatus,
  onRefreshData,
  onLogout,
  userName = 'Admin',
  userRole = 'Administrator',
}) => {
  return (
    <div className="min-h-screen bg-[#FBF8F5] pb-24 text-stone-800 max-w-md mx-auto select-none">
      <header className="sticky top-0 z-30 bg-[#FBF8F5]/90 backdrop-blur-md px-4 py-3 border-b border-[#EFE8DE]/80">
        <h2 className="text-xl font-black text-stone-900 tracking-tight">More & Settings</h2>
        <p className="text-xs text-stone-500 font-semibold">Karama Mess Mobile Management</p>
      </header>

      <main className="p-4 space-y-4">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#EFE8DE] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#7E1522] text-white font-black text-base flex items-center justify-center shadow-md shadow-[#7E1522]/20">
              {userName[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 capitalize">{userName}</h3>
              <p className="text-xs text-stone-500 font-semibold">{userRole}</p>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Cloud Live Status Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#EFE8DE] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900 block">Cloud Database Status</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Central Supabase Connected</span>
                </span>
              </div>
            </div>

            {onRefreshData && (
              <button
                onClick={onRefreshData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed">
            All customer registrations, payments, and delivery records are continuously synced across your phone, PC software, and website.
          </p>
        </div>

        {/* Business Contact & UAE Info */}
        <div className="bg-white rounded-3xl p-4 border border-[#EFE8DE] shadow-sm space-y-3 text-xs">
          <h4 className="font-black text-stone-900">Karama Homely Mess</h4>
          <div className="space-y-2 text-stone-600 font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
              <span>Al Karama, Opposite Karama Center, Dubai - UAE</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-stone-400 shrink-0" />
              <span>+971 50 123 4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-stone-400 shrink-0" />
              <span>admin@karamamess.ae</span>
            </div>
          </div>
        </div>

        {/* Version Banner */}
        <div className="text-center pt-2">
          <span className="text-[11px] font-mono text-stone-400 font-semibold block">
            Karama Mess Android v1.0.4
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            Crafted for Android &bull; Seamless Cloud Sync
          </span>
        </div>
      </main>
    </div>
  );
};
