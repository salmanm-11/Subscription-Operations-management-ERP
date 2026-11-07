import React, { useEffect, useState } from 'react';
import { Customer } from '../../types';
import {
  UserCheck,
  Building2,
  Utensils,
  Phone,
  Eye,
  X,
  Sparkles,
  Volume2
} from 'lucide-react';
import { playNotificationChime } from '../../utils/notificationAudio';

interface NewRegistrationToastProps {
  customer: Customer | null;
  onViewCustomer: (customer: Customer) => void;
  onDismiss: () => void;
}

export const NewRegistrationToast: React.FC<NewRegistrationToastProps> = ({
  customer,
  onViewCustomer,
  onDismiss,
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!customer) return;
    setProgress(100);

    const durationMs = 20000; // 20 seconds
    const intervalMs = 100;
    const step = (intervalMs / durationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (isPaused) return prev;
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return Math.max(0, prev - step);
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [customer, isPaused, onDismiss]);

  if (!customer) return null;

  return (
    <div
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed top-16 right-4 sm:right-6 z-50 w-[92vw] max-w-md bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 rounded-2xl shadow-2xl shadow-emerald-950/60 overflow-hidden transition-all transform animate-in slide-in-from-top-4 duration-300"
    >
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 px-4 py-2 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200"></span>
          </span>
          <span className="text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            New Online Registration
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => playNotificationChime(0.08)}
            title="Replay notification sound"
            className="p-1 rounded-lg hover:bg-white/20 text-emerald-100 hover:text-white transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDismiss}
            title="Dismiss notification"
            className="p-1 rounded-lg hover:bg-white/20 text-emerald-100 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-3">
        {/* Name and Customer Code */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-black text-white text-base tracking-tight truncate">
                {customer.full_name}
              </h4>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {customer.customer_code}
              </span>
            </div>
            {customer.phone && (
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5 font-medium">
                <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{customer.phone}</span>
                {customer.emergency_contact && (
                  <span className="text-[10px] text-rose-300 font-semibold ml-2">
                    (SOS: {customer.emergency_contact})
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-1.5 min-w-0">
            <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Location</p>
              <p className="font-bold text-slate-200 truncate" title={`${customer.building_name_cache || customer.building?.name || 'Standard Area'} - Apt ${customer.apartment_cache || 'N/A'}`}>
                {customer.building_name_cache || customer.building?.name || 'Area'} (Apt {customer.apartment_cache || 'N/A'})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Utensils className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Meals</p>
              <p className="font-bold text-slate-200 truncate">
                {[
                  customer.has_breakfast ? 'Breakfast' : null,
                  customer.has_lunch ? 'Lunch' : null,
                  customer.has_dinner ? 'Dinner' : null,
                ]
                  .filter(Boolean)
                  .join(' + ') || 'Standard Plan'}
              </p>
            </div>
          </div>
        </div>

        {/* Dietary / Allergy Note if present */}
        {customer.dietary_preferences && (
          <div className="text-[11px] bg-amber-500/10 border border-amber-500/30 text-amber-200 p-2 rounded-lg line-clamp-2">
            <span className="font-bold text-amber-300">Preferences: </span>
            {customer.dietary_preferences}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              onViewCustomer(customer);
              onDismiss();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Open Profile Details</span>
          </button>
          <button
            onClick={onDismiss}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white font-bold text-xs transition-all border border-slate-700 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Auto-Dismiss Countdown Progress Bar */}
      <div className="w-full bg-slate-800 h-1 overflow-hidden">
        <div
          className="bg-emerald-400 h-full transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
