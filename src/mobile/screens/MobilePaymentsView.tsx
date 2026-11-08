import React, { useState } from 'react';
import { Search, Plus, CreditCard, Receipt, MessageSquare } from 'lucide-react';
import { Payment, Customer } from '../../types';
import { formatAED } from '../../utils/currency';

interface MobilePaymentsViewProps {
  payments: Payment[];
  customers: Customer[];
  onOpenRecordPayment: () => void;
}

export const MobilePaymentsView: React.FC<MobilePaymentsViewProps> = ({
  payments,
  customers,
  onOpenRecordPayment,
}) => {
  const [search, setSearch] = useState('');

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const cust = customers.find(
      (c) => c.id === p.customer_id || c.customer_code === p.customer_id
    );
    const name = cust ? cust.full_name.toLowerCase() : '';
    const code = cust ? cust.customer_code.toLowerCase() : '';
    const num = (p.payment_number || '').toLowerCase();
    return name.includes(q) || code.includes(q) || num.includes(q);
  });

  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#FBF8F5] pb-24 text-stone-800 max-w-md mx-auto select-none">
      <header className="sticky top-0 z-30 bg-[#FBF8F5]/90 backdrop-blur-md px-4 py-3 border-b border-[#EFE8DE]/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">Payments</h2>
            <p className="text-xs text-stone-500 font-semibold">Total: {formatAED(totalCollected)}</p>
          </div>

          <button
            onClick={onOpenRecordPayment}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#7E1522] hover:bg-[#68111B] text-white text-xs font-bold shadow-md shadow-[#7E1522]/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record</span>
          </button>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name or receipt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EFE8DE] rounded-2xl text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#7E1522] shadow-sm"
          />
        </div>
      </header>

      <main className="p-4 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-stone-400 text-xs">
            <Receipt className="w-8 h-8 mx-auto text-stone-300 mb-2" />
            <p>No payment records found</p>
          </div>
        ) : (
          filtered.map((p) => {
            const cust = customers.find(
              (c) => c.id === p.customer_id || c.customer_code === p.customer_id
            );
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-3.5 border border-[#EFE8DE] shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-stone-900 block truncate">
                      {cust ? cust.full_name : 'Customer Payment'}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono block">
                      {p.payment_date} • {p.payment_number || 'Receipt'}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-[#7E1522] font-mono text-sm block">
                    {formatAED(p.amount)}
                  </span>
                  <span className="text-[10px] font-bold text-stone-400 uppercase">
                    {p.payment_method || 'Cash'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};
