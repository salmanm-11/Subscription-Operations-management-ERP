import React, { useState } from 'react';
import { Calendar, CheckCircle2, XCircle, MinusCircle, Search, Download, FileSpreadsheet } from 'lucide-react';
import { Customer, AttendanceStatus } from '../../types';
import { exportDeliverySheetToExcel } from '../../utils/excelService';
import { getCustomerCancellationNotice } from '../../utils/cancellationService';
import { formatDateDDMMMYYYY } from '../../utils/dateFormatter';

interface AttendanceSheetProps {
  customers: Customer[];
}

export const AttendanceSheet: React.FC<AttendanceSheetProps> = ({ customers }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  // Filter customers who receive this meal
  const activeCustomers = customers.filter((c) => {
    if (c.status !== 'active' && c.status !== 'trial' && c.status !== 'cancelling_soon') return false;
    // If on notice to leave, do not include if selectedDate is after their scheduled final meal date
    if (c.cancellation_date && c.cancellation_date < selectedDate) return false;
    if (mealType === 'breakfast' && !c.has_breakfast) return false;
    if (mealType === 'lunch' && !c.has_lunch) return false;
    if (mealType === 'dinner' && !c.has_dinner) return false;

    if (searchTerm) {
      const match =
        c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customer_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.building_name_cache && c.building_name_cache.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!match) return false;
    }
    return true;
  });

  const getStatus = (customerId: string): AttendanceStatus => {
    return attendance[`${selectedDate}_${mealType}_${customerId}`] || 'present';
  };

  const setStatus = (customerId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [`${selectedDate}_${mealType}_${customerId}`]: status,
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated = { ...attendance };
    activeCustomers.forEach((c) => {
      updated[`${selectedDate}_${mealType}_${c.id}`] = status;
    });
    setAttendance(updated);
  };

  const presentCount = activeCustomers.filter((c) => getStatus(c.id) === 'present').length;
  const absentCount = activeCustomers.filter((c) => getStatus(c.id) === 'absent').length;

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Daily Meal Attendance</h2>
          <p className="text-xs text-slate-400 mt-0.5">Track daily consumption for accurate meal prep & billing</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportDeliverySheetToExcel(customers, 'xlsx')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Delivery Run Sheet (.xlsx)</span>
          </button>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
            />
            <span className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700/80 text-xs font-mono font-bold text-amber-400">
              {formatDateDDMMMYYYY(selectedDate)}
            </span>
          </div>

          <button
            onClick={() => markAll('present')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
          >
            Mark All Present
          </button>
        </div>
      </div>

      {/* Meal Selection Tabs & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#151c2c] border border-[#222f47]/60 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          {(['breakfast', 'lunch', 'dinner'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMealType(m)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                mealType === m
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-slate-400">
            Total Expected: <b className="text-white">{activeCustomers.length}</b>
          </span>
          <span className="text-emerald-400">
            Present: <b>{presentCount}</b>
          </span>
          <span className="text-rose-400">
            Absent: <b>{absentCount}</b>
          </span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer for quick marking..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0f1422] text-slate-300 border-b border-slate-700/80 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-5">Code</th>
                <th className="py-4 px-5">Customer</th>
                <th className="py-4 px-5">Building &amp; Apt</th>
                <th className="py-4 px-5">Special Food Notes</th>
                <th className="py-4 px-5 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {activeCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-slate-400 text-sm">
                    No active customers scheduled for {mealType} on this date.
                  </td>
                </tr>
              ) : (
                activeCustomers.map((c) => {
                  const currentStatus = getStatus(c.id);
                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5 font-mono font-extrabold text-amber-400 text-sm whitespace-nowrap">{c.customer_code}</td>
                      <td className="py-4 px-5">
                        <div className="font-extrabold text-white text-base tracking-tight flex items-center gap-2 flex-wrap">
                          <span>{c.full_name}</span>
                          {(() => {
                            const notice = getCustomerCancellationNotice(c);
                            if (!notice) return null;
                            return (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${notice.badge.bg} ${notice.badge.textColor} ${notice.badge.border} animate-pulse`}
                                title={`Notice: Cancellation scheduled for ${notice.targetDateDisplay}`}
                              >
                                ⚠️ Leaving {notice.daysRemaining <= 0 ? 'Today' : `in ${notice.daysRemaining}d`}
                              </span>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-200">
                        <div className="font-bold text-sm">{c.building_name_cache || 'Building'}</div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">Apt {c.apartment_cache || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-5 text-amber-200/90 text-xs sm:text-sm font-medium max-w-[240px]">
                        {c.dietary_preferences || '-'}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-750 shadow-inner">
                          <button
                            onClick={() => setStatus(c.id, 'present')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                              currentStatus === 'present'
                                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Present</span>
                          </button>

                          <button
                            onClick={() => setStatus(c.id, 'absent')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                              currentStatus === 'absent'
                                ? 'bg-rose-500 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Absent</span>
                          </button>

                          <button
                            onClick={() => setStatus(c.id, 'cancelled')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                              currentStatus === 'cancelled'
                                ? 'bg-slate-700 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <MinusCircle className="w-4 h-4" />
                            <span>Skip</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
