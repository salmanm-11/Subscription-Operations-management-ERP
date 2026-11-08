import React, { useState, useMemo } from 'react';
import { Search, Plus, Phone, MessageSquare, Building2, ChevronRight, Filter } from 'lucide-react';
import { Customer, Building } from '../../types';
import { formatAED } from '../../utils/currency';

interface MobileCustomerListViewProps {
  customers: Customer[];
  buildings?: Building[];
  onSelectCustomer: (customer: Customer) => void;
  onAddCustomer: () => void;
}

export const MobileCustomerListView: React.FC<MobileCustomerListViewProps> = ({
  customers,
  buildings = [],
  onSelectCustomer,
  onAddCustomer,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue'>('all');

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        c.full_name.toLowerCase().includes(q) ||
        (c.customer_code || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q) ||
        (c.apartment_cache || '').toLowerCase().includes(q) ||
        (c.building_name_cache || '').toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filter === 'active') {
        return c.status === 'active' || !c.status || c.status === 'trial';
      }
      if (filter === 'overdue') {
        return (c.total_overdue || 0) > 0;
      }
      return true;
    });
  }, [customers, search, filter]);

  const handleCall = (e: React.MouseEvent, phone?: string) => {
    e.stopPropagation();
    if (!phone) return;
    window.open(`tel:${phone.replace(/[^0-9+]/g, '')}`, '_system');
  };

  const handleWhatsApp = (e: React.MouseEvent, phone?: string) => {
    e.stopPropagation();
    if (!phone) return;
    let digits = phone.replace(/[^0-9]/g, '');
    if (digits.startsWith('05')) digits = '971' + digits.slice(1);
    else if (!digits.startsWith('971') && digits.length === 9) digits = '971' + digits;
    window.open(`https://wa.me/${digits}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FBF8F5] pb-24 text-stone-800 max-w-md mx-auto select-none">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FBF8F5]/90 backdrop-blur-md px-4 py-3 border-b border-[#EFE8DE]/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">Customers</h2>
            <p className="text-xs text-stone-500 font-semibold">{filtered.length} of {customers.length} records</p>
          </div>

          <button
            onClick={onAddCustomer}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#7E1522] hover:bg-[#68111B] text-white text-xs font-bold shadow-md shadow-[#7E1522]/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, room, or building..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EFE8DE] rounded-2xl text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#7E1522] shadow-sm"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#7E1522] text-white shadow-sm'
                : 'bg-white border border-[#EFE8DE] text-stone-600'
            }`}
          >
            All ({customers.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filter === 'active'
                ? 'bg-[#7E1522] text-white shadow-sm'
                : 'bg-white border border-[#EFE8DE] text-stone-600'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filter === 'overdue'
                ? 'bg-[#7E1522] text-white shadow-sm'
                : 'bg-white border border-[#EFE8DE] text-stone-600'
            }`}
          >
            Overdue Dues
          </button>
        </div>
      </header>

      {/* Customer List */}
      <main className="p-4 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-stone-400 text-xs">
            <p>No customers match the filter</p>
          </div>
        ) : (
          filtered.map((c) => {
            const hasOverdue = (c.total_overdue || 0) > 0;
            return (
              <div
                key={c.id}
                onClick={() => onSelectCustomer(c)}
                className="bg-white rounded-2xl p-3.5 border border-[#EFE8DE] shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Initials Avatar */}
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7E1522] to-[#A01B2E] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                    {c.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-stone-900 truncate">
                        {c.full_name}
                      </span>
                      {hasOverdue && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                    </div>

                    <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 truncate">
                      <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>
                        {c.building_name_cache || c.building?.name || 'Building'}{' '}
                        {c.apartment_cache ? `(${c.apartment_cache})` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] font-bold text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded">
                        {formatAED(c.monthly_rate)}/mo
                      </span>
                      {hasOverdue && (
                        <span className="font-mono text-[10px] font-black text-rose-600">
                          Due: {formatAED(c.total_overdue)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {c.phone && (
                    <button
                      onClick={(e) => handleWhatsApp(e, c.phone)}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};
