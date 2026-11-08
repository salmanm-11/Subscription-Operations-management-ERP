import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, MessageSquare } from 'lucide-react';
import { Customer, Payment, PaymentMethod } from '../../types';
import { formatAED } from '../../utils/currency';

interface MobileRecordPaymentModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (payment: Partial<Payment>) => Promise<void>;
}

export const MobileRecordPaymentModal: React.FC<MobileRecordPaymentModalProps> = ({
  customer,
  isOpen,
  onClose,
  onConfirmPayment,
}) => {
  const overdue = customer.total_overdue || 0;
  const defaultAmount = overdue > 0 ? overdue : customer.monthly_rate || 380;

  const [amount, setAmount] = useState<number>(defaultAmount);
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return alert('Please enter a valid amount greater than 0.');

    try {
      setIsSubmitting(true);
      await onConfirmPayment({
        customer_id: customer.id,
        amount: Number(amount),
        payment_date: date,
        payment_method: method,
        reference_number: reference,
        notes: notes || `Settlement for ${customer.full_name}`,
      });

      setSuccessMsg(`✓ Successfully recorded payment of ${formatAED(amount)}!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      alert('Failed to record payment: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl p-5 border border-[#EFE8DE] space-y-4 animate-slideUp">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#7E1522] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-stone-900">Record Payment</h3>
              <p className="text-[11px] text-stone-500">{customer.full_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Amount */}
            <div>
              <label className="block text-stone-600 font-bold mb-1">
                Payment Amount (AED) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 font-mono text-lg font-black focus:outline-none focus:border-[#7E1522]"
                required
              />
              {overdue > 0 && (
                <div className="text-[11px] text-rose-600 font-semibold mt-1">
                  Current Overdue Balance: {formatAED(overdue)}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-stone-600 font-bold mb-1">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {(['cash', 'bank_transfer', 'card'] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`py-2 px-2 rounded-xl text-center font-bold text-xs capitalize border transition-all ${
                      method === m
                        ? 'bg-[#7E1522] text-white border-[#7E1522] shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {m.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-stone-600 font-bold mb-1">Payment Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 font-semibold focus:outline-none focus:border-[#7E1522]"
              />
            </div>

            {/* Reference Number */}
            <div>
              <label className="block text-stone-600 font-bold mb-1">Reference / Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Receipt #104 or Cash settlement"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 focus:outline-none focus:border-[#7E1522]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#7E1522] hover:bg-[#68111B] text-white font-bold text-sm shadow-lg shadow-[#7E1522]/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Recording Payment...' : `Confirm & Save ${formatAED(amount)}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
