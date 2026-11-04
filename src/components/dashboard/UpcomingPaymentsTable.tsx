import React from 'react';
import { Calendar, Clock, MessageSquare, Building2 } from 'lucide-react';
import { Customer } from '../../types';
import { formatAED } from '../../utils/currency';
import { getCustomerDueDateInfo, sendWhatsAppReminder } from '../../utils/reminderService';

interface UpcomingPaymentsTableProps {
  customers: Customer[];
  onViewAll: () => void;
  onSelectCustomer?: (customer: Customer) => void;
}

export const UpcomingPaymentsTable: React.FC<UpcomingPaymentsTableProps> = ({
  customers,
  onViewAll,
  onSelectCustomer,
}) => {
  return (
    <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Upcoming Payments &amp; Due Dates
          </h3>
        </div>
        <button
          onClick={onViewAll}
          className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-amber-400 hover:text-amber-300 text-xs font-semibold border border-slate-700/60 transition-colors"
        >
          View All &gt;
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="text-slate-300 border-b border-slate-700/80 text-xs uppercase tracking-wider font-bold">
              <th className="py-2.5 px-3">Customer</th>
              <th className="py-2.5 px-3">Due Date (This Date)</th>
              <th className="py-2.5 px-3 text-center">Countdown</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-2 text-right">Reminder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  No upcoming payment due dates found in the active reminder window.
                </td>
              </tr>
            ) : (
              customers.map((c) => {
                const info = getCustomerDueDateInfo(c);
                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCustomer && onSelectCustomer(c)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    title="Click to view details or pay bill"
                  >
                    <td className="py-3 px-3 min-w-[140px]">
                      <div className="font-extrabold text-white text-xs sm:text-sm tracking-tight group-hover:text-amber-300 transition-colors">
                        {c.full_name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-sky-400 shrink-0" />
                        <span className="truncate">{c.building_name_cache || 'Belrasheed'}</span>
                      </div>
                    </td>

                    {/* Exact Due Date */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 font-mono text-xs font-bold text-slate-200 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700">
                        <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{info.targetDueDateDisplay}</span>
                      </div>
                    </td>

                    {/* Countdown / Due In Badge */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${info.badgeStyle.bg} ${info.badgeStyle.text} ${info.badgeStyle.border}`}
                      >
                        {info.statusLabel}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 text-right font-black whitespace-nowrap font-mono text-white text-xs sm:text-sm">
                      {formatAED(info.amountDue)}
                    </td>

                    {/* WhatsApp Action */}
                    <td className="py-3 px-2 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sendWhatsAppReminder(
                            c,
                            info.targetDueDateDisplay,
                            info.daysRemaining,
                            info.amountDue
                          );
                        }}
                        className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all shadow-sm"
                        title="Send WhatsApp Payment Reminder"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
