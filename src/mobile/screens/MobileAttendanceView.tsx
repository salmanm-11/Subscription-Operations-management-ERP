import React, { useState } from 'react';
import { ArrowLeft, Check, CheckCircle2, Utensils, Building2 } from 'lucide-react';
import { Customer, Building } from '../../types';

interface MobileAttendanceViewProps {
  customers: Customer[];
  buildings?: Building[];
  onBack: () => void;
}

export const MobileAttendanceView: React.FC<MobileAttendanceViewProps> = ({
  customers,
  buildings = [],
  onBack,
}) => {
  const [mealTime, setMealTime] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [markedMap, setMarkedMap] = useState<Record<string, boolean>>({});

  const todayStr = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  const activeCustomers = customers.filter((c) => {
    const isAct = c.status === 'active' || !c.status || c.status === 'trial';
    if (!isAct) return false;

    if (mealTime === 'breakfast' && !c.has_breakfast) return false;
    if (mealTime === 'lunch' && !c.has_lunch) return false;
    if (mealTime === 'dinner' && !c.has_dinner) return false;

    if (selectedBuilding !== 'all') {
      const bName = c.building?.name || c.building_name_cache || '';
      return bName === selectedBuilding || c.building_id === selectedBuilding;
    }
    return true;
  });

  const toggleCustomer = (id: string) => {
    setMarkedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const markAll = () => {
    const next: Record<string, boolean> = {};
    activeCustomers.forEach((c) => {
      next[c.id] = true;
    });
    setMarkedMap((prev) => ({ ...prev, ...next }));
  };

  const completedCount = activeCustomers.filter((c) => markedMap[c.id]).length;

  return (
    <div className="min-h-screen bg-[#FBF8F5] pb-24 text-stone-800 max-w-md mx-auto select-none">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FBF8F5]/90 backdrop-blur-md px-4 py-3 border-b border-[#EFE8DE]/80">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl text-stone-700 hover:bg-stone-200/50 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-5 h-5 text-stone-800" />
            <span className="font-black text-base text-stone-900 tracking-tight">Today's Meals</span>
          </button>
          <span className="text-xs font-bold text-stone-500 font-mono bg-white px-2.5 py-1 rounded-full border border-[#EFE8DE]">
            {todayStr}
          </span>
        </div>

        {/* Meal Time Selector Tabs */}
        <div className="flex items-center gap-1.5 mt-3 bg-stone-200/70 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setMealTime('breakfast')}
            className={`flex-1 py-1.5 rounded-xl transition-all capitalize ${
              mealTime === 'breakfast'
                ? 'bg-[#7E1522] text-white shadow-sm font-black'
                : 'text-stone-600'
            }`}
          >
            Breakfast
          </button>
          <button
            onClick={() => setMealTime('lunch')}
            className={`flex-1 py-1.5 rounded-xl transition-all capitalize ${
              mealTime === 'lunch'
                ? 'bg-[#7E1522] text-white shadow-sm font-black'
                : 'text-stone-600'
            }`}
          >
            Lunch
          </button>
          <button
            onClick={() => setMealTime('dinner')}
            className={`flex-1 py-1.5 rounded-xl transition-all capitalize ${
              mealTime === 'dinner'
                ? 'bg-[#7E1522] text-white shadow-sm font-black'
                : 'text-stone-600'
            }`}
          >
            Dinner
          </button>
        </div>

        {/* Progress & Quick Actions */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <span className="font-bold text-stone-600">
            Delivered: <strong className="text-[#7E1522]">{completedCount}</strong> / {activeCustomers.length}
          </span>
          <button
            onClick={markAll}
            className="text-xs font-bold text-[#7E1522] hover:underline"
          >
            Mark All Delivered
          </button>
        </div>
      </header>

      {/* Checklist */}
      <main className="p-4 space-y-2">
        {activeCustomers.length === 0 ? (
          <div className="py-12 text-center text-stone-400 text-xs">
            <Utensils className="w-8 h-8 mx-auto text-stone-300 mb-2" />
            <p>No customers scheduled for this meal time</p>
          </div>
        ) : (
          activeCustomers.map((c) => {
            const isDone = Boolean(markedMap[c.id]);
            return (
              <div
                key={c.id}
                onClick={() => toggleCustomer(c.id)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isDone
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-white border-[#EFE8DE] shadow-sm text-stone-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-stone-300 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>

                  <div className="min-w-0">
                    <span className="font-bold text-xs block truncate">{c.full_name}</span>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>
                        {c.building_name_cache || c.building?.name || 'Area'}{' '}
                        {c.apartment_cache ? `(Apt ${c.apartment_cache})` : ''}
                      </span>
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isDone ? 'bg-emerald-200/80 text-emerald-900' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {isDone ? 'Delivered' : 'Pending'}
                </span>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};
