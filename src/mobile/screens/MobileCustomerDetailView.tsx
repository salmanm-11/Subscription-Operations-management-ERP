import React, { useState } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  MessageSquare,
  Edit,
  MoreHorizontal,
  Calendar,
  CalendarDays,
  Utensils,
  CreditCard,
  Activity,
  CheckCircle2,
  AlertCircle,
  Building2,
  Trash2,
  Receipt
} from 'lucide-react';
import { Customer, Payment, Invoice, MealPlan } from '../../types';
import { formatAED } from '../../utils/currency';

interface MobileCustomerDetailViewProps {
  customer: Customer;
  invoices?: Invoice[];
  payments?: Payment[];
  mealPlans?: MealPlan[];
  onBack: () => void;
  onRecordPayment: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
}

export const MobileCustomerDetailView: React.FC<MobileCustomerDetailViewProps> = ({
  customer,
  invoices = [],
  payments = [],
  mealPlans = [],
  onBack,
  onRecordPayment,
  onEditCustomer,
  onDeleteCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'meals' | 'payments'>('account');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Phone and WhatsApp handlers
  const handleCall = () => {
    if (!customer.phone) return alert('No phone number provided for this customer.');
    window.open(`tel:${customer.phone.replace(/[^0-9+]/g, '')}`, '_system');
  };

  const handleWhatsApp = () => {
    if (!customer.phone) return alert('No phone number provided for this customer.');
    let digits = customer.phone.replace(/[^0-9]/g, '');
    if (digits.startsWith('05')) digits = '971' + digits.slice(1);
    else if (!digits.startsWith('971') && digits.length === 9) digits = '971' + digits;
    window.open(`https://wa.me/${digits}`, '_blank');
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    if (!onDeleteCustomer) return;
    if (window.confirm(`Are you sure you want to delete "${customer.full_name}"? This action cannot be undone.`)) {
      onDeleteCustomer(customer.id);
      onBack();
    }
  };

  // Payments for this customer
  const customerPayments = payments.filter(
    (p) => p.customer_id === customer.id || p.customer_id === customer.customer_code
  );

  // Meal Plan resolution
  const resolvedPlan =
    mealPlans.find((m) => m.id === customer.meal_plan_id) || customer.meal_plan;

  const mealSummary = [
    customer.has_breakfast ? 'Breakfast' : null,
    customer.has_lunch ? 'Lunch' : null,
    customer.has_dinner ? 'Dinner' : null,
  ]
    .filter(Boolean)
    .join(' + ') || resolvedPlan?.name || 'Breakfast + Lunch + Dinner';

  const buildingName =
    customer.building?.name || customer.building_name_cache || 'Building A';
  const roomNumber =
    customer.room?.room_number || customer.apartment_cache || '101';

  const overdue = customer.total_overdue || 0;
  const isOverdue = overdue > 0;

  return (
    <div className="min-h-screen bg-[#FBF8F5] pb-28 text-stone-800 max-w-md mx-auto select-none relative">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#FBF8F5]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#EFE8DE]/80">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-stone-700 hover:bg-stone-200/50 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-5 h-5 text-stone-800" />
          <span className="font-black text-base text-stone-900 tracking-tight">Customer Details</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 -mr-2 rounded-xl text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-2xl bg-white border border-[#EFE8DE] shadow-xl py-1.5 z-50 animate-fadeIn text-xs font-bold text-stone-700">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onEditCustomer(customer);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-stone-50 flex items-center gap-2"
              >
                <Edit className="w-4 h-4 text-stone-500" />
                <span>Edit Profile</span>
              </button>
              {onDeleteCustomer && (
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>Delete Customer</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-4 space-y-4">
        {/* Customer Profile Header Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#EFE8DE] shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          {/* Avatar with Initials or Photo */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7E1522] to-[#B32438] text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-[#7E1522]/20 border-4 border-white mb-2">
            {customer.full_name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>

          <h2 className="text-xl font-black text-stone-900 tracking-tight leading-tight">
            {customer.full_name}
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-stone-400" />
              <span>{buildingName} - {roomNumber}</span>
            </span>

            <span className="w-1 h-1 rounded-full bg-stone-300" />

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                customer.status === 'paused'
                  ? 'bg-amber-100 text-amber-800'
                  : customer.status === 'left' || customer.status === 'cancelled'
                  ? 'bg-stone-200 text-stone-700'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span className="capitalize">{customer.status || 'Active'}</span>
            </span>
          </div>

          {/* 4 Action Buttons Row */}
          <div className="grid grid-cols-4 gap-2.5 w-full mt-4 pt-4 border-t border-stone-100">
            <button
              onClick={handleCall}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-[11px] transition-all active:scale-95"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-1">
                <Phone className="w-4 h-4" />
              </div>
              <span>Call</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-[11px] transition-all active:scale-95"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => onEditCustomer(customer)}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-[11px] transition-all active:scale-95"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#7E1522] flex items-center justify-center mb-1">
                <Edit className="w-4 h-4" />
              </div>
              <span>Edit</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-[11px] transition-all active:scale-95"
            >
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center mb-1">
                <MoreHorizontal className="w-4 h-4" />
              </div>
              <span>More</span>
            </button>
          </div>
        </div>

        {/* Segmented Tabs (Account | Meals | Payments) */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'account'
                ? 'bg-[#7E1522] text-white shadow-md font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'meals'
                ? 'bg-[#7E1522] text-white shadow-md font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Meals
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'payments'
                ? 'bg-[#7E1522] text-white shadow-md font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Payments
          </button>
        </div>

        {/* Tab 1: Account Info Rows */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-3xl p-5 border border-[#EFE8DE] shadow-sm divide-y divide-stone-100 text-xs">
            {/* Start Date */}
            <div className="py-3 flex items-center justify-between first:pt-0">
              <div className="flex items-center gap-2.5 text-stone-600 font-semibold">
                <Calendar className="w-4 h-4 text-stone-400" />
                <span>Start Date</span>
              </div>
              <span className="font-bold text-stone-900 font-mono">
                {customer.joining_date || customer.billing_start_date || '01 Aug 2026'}
              </span>
            </div>

            {/* Next Due Date */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-stone-600 font-semibold">
                <CalendarDays className="w-4 h-4 text-amber-600" />
                <span>Next Due Date</span>
              </div>
              <span className="font-bold text-amber-700 font-mono">
                {customer.billed_up_to_date || customer.billing_end_date || '01 Nov 2026'}
              </span>
            </div>

            {/* Meal Plan */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-stone-600 font-semibold">
                <Utensils className="w-4 h-4 text-[#7E1522]" />
                <span>Meal Plan</span>
              </div>
              <span className="font-bold text-stone-900 truncate max-w-[180px]">
                {mealSummary}
              </span>
            </div>

            {/* Amount */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-stone-600 font-semibold">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Monthly Rate</span>
              </div>
              <span className="font-black text-stone-900 font-mono text-sm">
                {formatAED(customer.monthly_rate || 580)}
              </span>
            </div>

            {/* Status & Overdue */}
            <div className="py-3 flex items-center justify-between last:pb-0">
              <div className="flex items-center gap-2.5 text-stone-600 font-semibold">
                <Activity className="w-4 h-4 text-stone-400" />
                <span>Account Status</span>
              </div>
              <div className="flex items-center gap-2">
                {isOverdue && (
                  <span className="text-[11px] font-black text-rose-600 font-mono">
                    Due: {formatAED(overdue)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  ● Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Meals Logistics */}
        {activeTab === 'meals' && (
          <div className="bg-white rounded-3xl p-5 border border-[#EFE8DE] shadow-sm space-y-4 text-xs">
            <h4 className="font-black text-stone-900">Daily Delivery Schedule</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className={`p-3 rounded-2xl border text-center ${customer.has_breakfast ? 'bg-rose-50 border-rose-200 text-[#7E1522] font-black' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                <span className="block text-[11px]">Breakfast</span>
                <span className="text-xs">{customer.has_breakfast ? '✓ Included' : 'Excluded'}</span>
              </div>

              <div className={`p-3 rounded-2xl border text-center ${customer.has_lunch ? 'bg-rose-50 border-rose-200 text-[#7E1522] font-black' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                <span className="block text-[11px]">Lunch</span>
                <span className="text-xs">{customer.has_lunch ? '✓ Included' : 'Excluded'}</span>
              </div>

              <div className={`p-3 rounded-2xl border text-center ${customer.has_dinner ? 'bg-rose-50 border-rose-200 text-[#7E1522] font-black' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                <span className="block text-[11px]">Dinner</span>
                <span className="text-xs">{customer.has_dinner ? '✓ Included' : 'Excluded'}</span>
              </div>
            </div>

            {customer.dietary_preferences && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
                <span className="font-bold block text-[11px]">Special Dietary Notes:</span>
                <p className="mt-0.5">{customer.dietary_preferences}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Past Payments */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl p-5 border border-[#EFE8DE] shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-stone-900">Payment History</h4>
              <span className="font-mono text-stone-500">{customerPayments.length} receipts</span>
            </div>

            {customerPayments.length === 0 ? (
              <div className="py-6 text-center text-stone-400">
                <Receipt className="w-8 h-8 mx-auto text-stone-300 mb-1" />
                <p>No payment receipts recorded yet</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {customerPayments.map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[11px] text-stone-400 block">
                        {p.payment_number || 'Receipt'}
                      </span>
                      <span className="font-bold text-stone-800">{p.payment_date}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-[#7E1522] font-mono text-sm block">
                        {formatAED(p.amount)}
                      </span>
                      <span className="text-[10px] text-stone-500 uppercase">
                        {p.payment_method || 'Cash'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Sticky Bottom Button: Record Payment */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-[#FBF8F5] via-[#FBF8F5] to-transparent max-w-md mx-auto">
        <button
          onClick={() => onRecordPayment(customer)}
          className="w-full py-4 px-6 rounded-2xl bg-[#7E1522] hover:bg-[#68111B] active:scale-[0.98] text-white font-bold text-sm shadow-xl shadow-[#7E1522]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>Record Payment</span>
          <span className="ml-1">➔</span>
        </button>
      </div>
    </div>
  );
};
