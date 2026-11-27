import React, { useState, useEffect } from 'react';
import { X, Calendar, Utensils, DollarSign, Calculator, Percent, Truck, Check, AlertCircle, ShoppingCart } from 'lucide-react';
import { Vendor, VendorTransaction, VendorTransactionType } from '../../types';
import { roundVendorCurrency, formatVendorAED } from '../../utils/currency';

interface DailyAccountEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Partial<VendorTransaction>) => void;
  vendors: Vendor[];
  initialTransaction?: VendorTransaction | null;
  selectedVendorId?: string;
}

export const DailyAccountEntryModal: React.FC<DailyAccountEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vendors,
  initialTransaction,
  selectedVendorId,
}) => {
  const [vendorId, setVendorId] = useState<string>('');
  const [transactionType, setTransactionType] = useState<VendorTransactionType>('daily_meal_entry');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Quantities
  const [breakfastQty, setBreakfastQty] = useState<number>(0);
  const [lunchQty, setLunchQty] = useState<number>(0);
  const [dinnerQty, setDinnerQty] = useState<number>(0);

  // Rates
  const [breakfastRate, setBreakfastRate] = useState<number>(0);
  const [lunchRate, setLunchRate] = useState<number>(0);
  const [dinnerRate, setDinnerRate] = useState<number>(0);

  // Additional Charges
  const [serviceCharge, setServiceCharge] = useState<number>(0);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [packingCharge, setPackingCharge] = useState<number>(0);
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  // Supplier purchase specific
  const [purchaseAmount, setPurchaseAmount] = useState<number>(0);

  // Payments & Remarks
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('bank_transfer');
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  // Selected vendor object
  const selectedVendor = vendors.find(v => v.id === vendorId);

  useEffect(() => {
    if (initialTransaction) {
      setVendorId(initialTransaction.vendor_id);
      setTransactionType(initialTransaction.transaction_type);
      setDate(initialTransaction.date);
      setDescription(initialTransaction.description || '');

      setBreakfastQty(initialTransaction.breakfast_qty || 0);
      setLunchQty(initialTransaction.lunch_qty || 0);
      setDinnerQty(initialTransaction.dinner_qty || 0);

      setBreakfastRate(initialTransaction.breakfast_rate || 0);
      setLunchRate(initialTransaction.lunch_rate || 0);
      setDinnerRate(initialTransaction.dinner_rate || 0);

      setServiceCharge(initialTransaction.service_charge || 0);
      setDeliveryCharge(initialTransaction.delivery_charge || 0);
      setPackingCharge(initialTransaction.packing_charge || 0);
      setOtherCharges(initialTransaction.other_charges || 0);
      setDiscount(initialTransaction.discount || 0);

      setAmountPaid(initialTransaction.amount_paid || 0);
      setPaymentMethod(initialTransaction.payment_method || 'bank_transfer');
      setReferenceNo(initialTransaction.reference_no || '');
      setRemarks(initialTransaction.remarks || '');
    } else {
      const defaultVendorId = selectedVendorId || (vendors.length > 0 ? vendors[0].id : '');
      setVendorId(defaultVendorId);
      setDate(new Date().toISOString().split('T')[0]);
      setTransactionType('daily_meal_entry');
      setDescription('');

      setBreakfastQty(0);
      setLunchQty(0);
      setDinnerQty(0);

      const v = vendors.find(item => item.id === defaultVendorId);
      if (v) {
        populateVendorRatesAndCharges(v);
      }

      setDiscount(0);
      setAmountPaid(0);
      setPaymentMethod('bank_transfer');
      setReferenceNo('');
      setRemarks('');
    }
  }, [initialTransaction, selectedVendorId, isOpen, vendors]);

  const populateVendorRatesAndCharges = (v: Vendor) => {
    setBreakfastRate(v.breakfast_rate || 0);
    setLunchRate(v.lunch_rate || 0);
    setDinnerRate(v.dinner_rate || 0);

    // Populate charges only if enabled for that vendor
    setServiceCharge(v.service_charge_config?.is_enabled && v.service_charge_config.type === 'fixed' ? v.service_charge_config.value : 0);
    setDeliveryCharge(v.delivery_charge_config?.is_enabled && v.delivery_charge_config.type === 'fixed' ? v.delivery_charge_config.value : 0);
    setPackingCharge(v.packing_charge_config?.is_enabled && v.packing_charge_config.type === 'fixed' ? v.packing_charge_config.value : 0);
    setOtherCharges(v.other_charges_config?.is_enabled && v.other_charges_config.type === 'fixed' ? v.other_charges_config.value : 0);
  };

  const handleVendorChange = (id: string) => {
    setVendorId(id);
    const v = vendors.find(item => item.id === id);
    if (v) {
      populateVendorRatesAndCharges(v);
    }
  };

  if (!isOpen) return null;

  // Meal Charges Calculation
  const mealCharges = transactionType === 'daily_meal_entry'
    ? roundVendorCurrency((breakfastQty * breakfastRate) + (lunchQty * lunchRate) + (dinnerQty * dinnerRate))
    : purchaseAmount;

  // If percentage-based charges are configured for the vendor, compute them dynamically from meal charges
  const effectiveServiceCharge = selectedVendor?.service_charge_config?.is_enabled && selectedVendor.service_charge_config.type === 'percentage'
    ? roundVendorCurrency(mealCharges * (selectedVendor.service_charge_config.value / 100))
    : serviceCharge;

  const totalCharges = roundVendorCurrency(
    mealCharges + effectiveServiceCharge + deliveryCharge + packingCharge + otherCharges - discount
  );

  const netClosingChange = roundVendorCurrency(totalCharges - amountPaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) {
      alert('Please select a vendor.');
      return;
    }

    onSave({
      id: initialTransaction?.id,
      vendor_id: vendorId,
      vendor_name_cache: selectedVendor?.name,
      transaction_type: transactionType,
      date,
      description: description.trim() || (transactionType === 'daily_meal_entry' ? `Daily Catering (${breakfastQty + lunchQty + dinnerQty} Meals)` : 'Supplier Purchase'),
      breakfast_qty: transactionType === 'daily_meal_entry' ? breakfastQty : 0,
      lunch_qty: transactionType === 'daily_meal_entry' ? lunchQty : 0,
      dinner_qty: transactionType === 'daily_meal_entry' ? dinnerQty : 0,
      breakfast_rate: breakfastRate,
      lunch_rate: lunchRate,
      dinner_rate: dinnerRate,
      meal_charges: mealCharges,
      service_charge: effectiveServiceCharge,
      delivery_charge: deliveryCharge,
      packing_charge: packingCharge,
      other_charges: otherCharges,
      discount: discount,
      total_charges: totalCharges,
      amount_paid: amountPaid,
      payment_method: paymentMethod,
      reference_no: referenceNo.trim() || undefined,
      remarks: remarks.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#16181d] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl shadow-black/90 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {initialTransaction ? 'Edit Daily Account Entry' : 'Daily Vendor Account Entry'}
              </h3>
              <p className="text-xs text-slate-400">
                Automated meal calculation, additional charges &amp; payment reconciliation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Type Selector: Meal Service vs Ordinary Supplier Purchase */}
        <div className="px-6 pt-4 pb-1 bg-[#121419] border-b border-slate-800 flex gap-2">
          <button
            type="button"
            onClick={() => setTransactionType('daily_meal_entry')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              transactionType === 'daily_meal_entry'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Meal Catering Supply (BF / LN / DN)</span>
          </button>

          <button
            type="button"
            onClick={() => setTransactionType('supplier_purchase')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              transactionType === 'supplier_purchase'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Ordinary Supplier Purchase / Grocery</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs custom-scrollbar">
          {/* Vendor & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Select Vendor *</label>
              <select
                value={vendorId}
                onChange={(e) => handleVendorChange(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-[#ff8d24]"
              >
                <option value="">Select Vendor...</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.vendor_code}) - {v.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Transaction Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#ff8d24]"
              />
            </div>
          </div>

          {/* Meal Service Quantities & Contract Rates */}
          {transactionType === 'daily_meal_entry' ? (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  <span>Daily Meal Quantities &amp; Rates (AED)</span>
                </span>
                <span className="text-[10px] text-slate-400">Automated calculation</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Breakfast */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <label className="block text-amber-300 font-bold mb-1">Breakfast (BF)</label>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[10px] text-slate-400">Qty:</span>
                      <input
                        type="number"
                        min="0"
                        value={breakfastQty}
                        onChange={(e) => setBreakfastQty(parseInt(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Rate (AED):</span>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        value={breakfastRate}
                        onChange={(e) => setBreakfastRate(parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-amber-300 font-mono text-xs"
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 text-right font-mono font-semibold pt-1 border-t border-slate-800">
                      = {formatVendorAED(roundVendorCurrency(breakfastQty * breakfastRate))}
                    </div>
                  </div>
                </div>

                {/* Lunch */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <label className="block text-emerald-300 font-bold mb-1">Lunch (LN)</label>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[10px] text-slate-400">Qty:</span>
                      <input
                        type="number"
                        min="0"
                        value={lunchQty}
                        onChange={(e) => setLunchQty(parseInt(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Rate (AED):</span>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        value={lunchRate}
                        onChange={(e) => setLunchRate(parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-emerald-300 font-mono text-xs"
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 text-right font-mono font-semibold pt-1 border-t border-slate-800">
                      = {formatVendorAED(roundVendorCurrency(lunchQty * lunchRate))}
                    </div>
                  </div>
                </div>

                {/* Dinner */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <label className="block text-sky-300 font-bold mb-1">Dinner (DN)</label>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[10px] text-slate-400">Qty:</span>
                      <input
                        type="number"
                        min="0"
                        value={dinnerQty}
                        onChange={(e) => setDinnerQty(parseInt(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Rate (AED):</span>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        value={dinnerRate}
                        onChange={(e) => setDinnerRate(parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sky-300 font-mono text-xs"
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 text-right font-mono font-semibold pt-1 border-t border-slate-800">
                      = {formatVendorAED(roundVendorCurrency(dinnerQty * dinnerRate))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400 text-[11px]">
                  Total Meal Count: <strong className="text-white">{breakfastQty + lunchQty + dinnerQty} Meals</strong>
                </span>
                <span className="text-sm font-black text-amber-400 font-mono">
                  Subtotal: {formatVendorAED(mealCharges)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <label className="block text-slate-300 font-bold mb-1">Purchase Invoice Subtotal (AED) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-base font-bold"
              />
            </div>
          )}

          {/* Description & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Description / Menu Label</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Regular Tiffin + Biryani special"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Invoice / Delivery Ref</label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="e.g. DN-2026-1049"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          {/* Additional Charges & Discounts */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <span className="font-bold text-white text-xs block">Additional Charges &amp; Deductions (AED)</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Service Charge</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={effectiveServiceCharge}
                  onChange={(e) => setServiceCharge(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Delivery Charge</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Packing Charge</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={packingCharge}
                  onChange={(e) => setPackingCharge(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Other Charges</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={otherCharges}
                  onChange={(e) => setOtherCharges(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-emerald-400 text-[10px] mb-1">Discount (-)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-emerald-300 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Payment Made on this Date */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Payment Made Today (Optional)</span>
              </span>
              <span className="text-[10px] text-slate-400">Updates ledger payment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Amount Paid (AED)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  <option value="bank_transfer">Bank Transfer (WPS / Neobank)</option>
                  <option value="cash">Cash in Hand</option>
                  <option value="cheque">Cheque</option>
                  <option value="card">Card / POS</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Remarks / Note</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Paid in full via bank transfer"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Accounting Reconciliation Summary Bar */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Total Transaction Charges
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                {formatVendorAED(totalCharges)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Meal ({formatVendorAED(mealCharges)}) + Charges ({formatVendorAED(effectiveServiceCharge + deliveryCharge + packingCharge + otherCharges)}) - Disc ({formatVendorAED(discount)})
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Net Balance Impact Today
              </span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className={`text-lg font-black font-mono ${netClosingChange > 0 ? 'text-rose-400' : netClosingChange < 0 ? 'text-sky-400' : 'text-emerald-400'}`}>
                  {netClosingChange >= 0 ? `+${formatVendorAED(netClosingChange)}` : formatVendorAED(netClosingChange)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                {amountPaid > 0 ? `Charges - Paid (${formatVendorAED(amountPaid)})` : 'Added to outstanding balance'}
              </span>
            </div>
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
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition-colors"
            >
              {initialTransaction ? 'Update Daily Entry' : 'Save Daily Account Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
