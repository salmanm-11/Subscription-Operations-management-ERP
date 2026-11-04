import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, Calendar, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Vendor, VendorPayment } from '../../types';
import { formatVendorAED, roundVendorCurrency } from '../../utils/currency';

interface VendorPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (payment: Partial<VendorPayment>) => void;
  vendors: Vendor[];
  selectedVendorId?: string;
  vendorBalances?: Record<string, number>;
}

export const VendorPaymentModal: React.FC<VendorPaymentModalProps> = ({
  isOpen,
  onClose,
  onSavePayment,
  vendors,
  selectedVendorId,
  vendorBalances = {},
}) => {
  const [vendorId, setVendorId] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer' | 'card' | 'cheque' | 'online' | 'other'>('bank_transfer');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setVendorId(selectedVendorId || (vendors.length > 0 ? vendors[0].id : ''));
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setAmount('');
      setPaymentMethod('bank_transfer');
      setReferenceNumber('');
      setRemarks('');
    }
  }, [isOpen, selectedVendorId, vendors]);

  if (!isOpen) return null;

  const selectedVendor = vendors.find(v => v.id === vendorId);
  const currentBalance = vendorBalances[vendorId] !== undefined ? vendorBalances[vendorId] : (selectedVendor?.opening_balance || 0);
  const numAmount = parseFloat(amount) || 0;
  const projectedBalance = roundVendorCurrency(currentBalance - numAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) {
      alert('Please select a vendor.');
      return;
    }
    if (numAmount <= 0) {
      alert('Please enter a valid payment amount greater than 0.');
      return;
    }

    onSavePayment({
      vendor_id: vendorId,
      vendor_name_cache: selectedVendor?.name,
      payment_date: paymentDate,
      amount: numAmount,
      payment_method: paymentMethod,
      reference_number: referenceNumber.trim() || undefined,
      remarks: remarks.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151c2c] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/90 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Record Vendor Payment</h3>
              <p className="text-xs text-slate-400">Direct settlement or partial disbursement (AED)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Vendor Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Vendor *</label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-500"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.vendor_code})
                </option>
              ))}
            </select>
          </div>

          {/* Balance Preview Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Current Outstanding</span>
              <span className={`text-base font-black font-mono ${
                currentBalance > 0 ? 'text-rose-400' : currentBalance < 0 ? 'text-sky-400' : 'text-emerald-400'
              }`}>
                {formatVendorAED(currentBalance)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Balance After Payment</span>
              <span className={`text-base font-black font-mono ${
                projectedBalance > 0 ? 'text-rose-400' : projectedBalance < 0 ? 'text-sky-400' : 'text-emerald-400'
              }`}>
                {formatVendorAED(projectedBalance)}
              </span>
            </div>
          </div>

          {/* Payment Date & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Payment Date *</label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Payment Amount (AED) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-mono text-base font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method & Reference Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="bank_transfer">Bank Transfer (WPS / Neobank)</option>
                <option value="cash">Cash in Hand</option>
                <option value="cheque">Cheque</option>
                <option value="card">Card / POS Machine</option>
                <option value="online">Online / Payment Link</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Transaction Reference</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. TRF-2026-9042 / Cheque #8819"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Remarks / Payment Notes</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Weekly catering settlement for Mom's Food"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record &amp; Update Ledger</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
