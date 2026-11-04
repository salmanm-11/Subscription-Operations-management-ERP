import React, { useState, useEffect } from 'react';
import { X, Truck, DollarSign, Settings, Percent, Calendar, ShieldCheck, Info } from 'lucide-react';
import { Vendor, VendorCategory, VendorStatus, VendorChargeConfig } from '../../types';

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendor: Partial<Vendor>) => void;
  vendor?: Vendor | null;
}

export const VendorModal: React.FC<VendorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vendor,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'rates' | 'charges' | 'financial'>('general');

  // General fields
  const [vendorCode, setVendorCode] = useState('');
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<VendorCategory>('Meal Catering / Kitchen');
  const [paymentTerms, setPaymentTerms] = useState('Weekly');
  const [status, setStatus] = useState<VendorStatus>('active');
  const [notes, setNotes] = useState('');

  // Rates
  const [breakfastRate, setBreakfastRate] = useState<string>('0');
  const [lunchRate, setLunchRate] = useState<string>('0');
  const [dinnerRate, setDinnerRate] = useState<string>('0');

  // Configured Charges
  const [serviceCharge, setServiceCharge] = useState<VendorChargeConfig>({
    type: 'fixed',
    value: 0,
    is_enabled: false,
    effective_date: '',
    notes: ''
  });

  const [deliveryCharge, setDeliveryCharge] = useState<VendorChargeConfig>({
    type: 'fixed',
    value: 0,
    is_enabled: false,
    effective_date: '',
    notes: ''
  });

  const [packingCharge, setPackingCharge] = useState<VendorChargeConfig>({
    type: 'fixed',
    value: 0,
    is_enabled: false,
    effective_date: '',
    notes: ''
  });

  const [otherCharges, setOtherCharges] = useState<VendorChargeConfig>({
    type: 'fixed',
    value: 0,
    is_enabled: false,
    effective_date: '',
    notes: ''
  });

  // Financial setup
  const [openingBalance, setOpeningBalance] = useState<string>('0');

  useEffect(() => {
    if (vendor) {
      setVendorCode(vendor.vendor_code || '');
      setName(vendor.name || '');
      setContactPerson(vendor.contact_person || '');
      setPhone(vendor.phone || '');
      setAddress(vendor.address || '');
      setCategory(vendor.category || 'Meal Catering / Kitchen');
      setPaymentTerms(vendor.payment_terms || 'Weekly');
      setStatus(vendor.status || 'active');
      setNotes(vendor.notes || '');

      setBreakfastRate(String(vendor.breakfast_rate || 0));
      setLunchRate(String(vendor.lunch_rate || 0));
      setDinnerRate(String(vendor.dinner_rate || 0));

      setServiceCharge(vendor.service_charge_config || { type: 'fixed', value: 0, is_enabled: false });
      setDeliveryCharge(vendor.delivery_charge_config || { type: 'fixed', value: 0, is_enabled: false });
      setPackingCharge(vendor.packing_charge_config || { type: 'fixed', value: 0, is_enabled: false });
      setOtherCharges(vendor.other_charges_config || { type: 'fixed', value: 0, is_enabled: false });

      setOpeningBalance(String(vendor.opening_balance || 0));
    } else {
      setVendorCode(`VEND-${Date.now().toString().slice(-4)}`);
      setName('');
      setContactPerson('');
      setPhone('');
      setAddress('');
      setCategory('Meal Catering / Kitchen');
      setPaymentTerms('Weekly');
      setStatus('active');
      setNotes('');

      setBreakfastRate('3.27');
      setLunchRate('4.385');
      setDinnerRate('4.27');

      setServiceCharge({ type: 'fixed', value: 0, is_enabled: false, effective_date: new Date().toISOString().split('T')[0] });
      setDeliveryCharge({ type: 'fixed', value: 0, is_enabled: false, effective_date: new Date().toISOString().split('T')[0] });
      setPackingCharge({ type: 'fixed', value: 0, is_enabled: false, effective_date: new Date().toISOString().split('T')[0] });
      setOtherCharges({ type: 'fixed', value: 0, is_enabled: false, effective_date: new Date().toISOString().split('T')[0] });

      setOpeningBalance('0');
    }
    setActiveTab('general');
  }, [vendor, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please provide a Vendor Name.');
      return;
    }

    onSave({
      id: vendor?.id,
      vendor_code: vendorCode.trim() || undefined,
      name: name.trim(),
      contact_person: contactPerson.trim(),
      phone: phone.trim(),
      address: address.trim(),
      category,
      payment_terms: paymentTerms,
      status,
      notes: notes.trim(),
      breakfast_rate: parseFloat(breakfastRate) || 0,
      lunch_rate: parseFloat(lunchRate) || 0,
      dinner_rate: parseFloat(dinnerRate) || 0,
      service_charge_config: serviceCharge,
      delivery_charge_config: deliveryCharge,
      packing_charge_config: packingCharge,
      other_charges_config: otherCharges,
      opening_balance: parseFloat(openingBalance) || 0,
    });

    onClose();
  };

  const categories: VendorCategory[] = [
    'Meal Catering / Kitchen',
    'Groceries & Provisions',
    'Meat & Poultry',
    'Vegetables & Fruits',
    'Packaging Supplies',
    'Gas & Utilities',
    'Maintenance & Services',
    'Other'
  ];

  const termsList = [
    'Daily',
    'Weekly',
    'Bi-Weekly',
    'Net 15',
    'Net 30',
    'Cash on Delivery',
    'Monthly'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151c2c] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl shadow-black/80 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {vendor ? 'Edit Vendor Profile' : 'Register New Vendor'}
              </h3>
              <p className="text-xs text-slate-400">
                Supplier credentials, meal pricing &amp; financial charges (AED)
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-[#0f1422] px-4 gap-2 overflow-x-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. General Info
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rates')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'rates'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Meal Rates
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('charges')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'charges'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Charges &amp; Pricing
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('financial')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'financial'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Financial Setup
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs custom-scrollbar">
          {/* TAB 1: General Info */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Vendor ID</label>
                  <input
                    type="text"
                    value={vendorCode}
                    onChange={(e) => setVendorCode(e.target.value)}
                    placeholder="e.g. VEND-001"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1.5">Vendor / Company Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mom's Food Kitchen"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Chef Fatima / Manager"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +971 50 123 4567"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Vendor Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VendorCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Payment Terms</label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    {termsList.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Address / Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Ras Al Khor Industrial Kitchen 2, Dubai"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Vendor Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as VendorStatus)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="active">Active (Available for daily accounts)</option>
                    <option value="inactive">Inactive / Deactivated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Notes / Contract Details</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Primary catering supplier"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Meal Rates */}
          {activeTab === 'rates' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-200">
                <span className="font-bold text-amber-400 block mb-0.5">Meal Pricing Configuration</span>
                Specify the contract rate per meal box in AED. Mom's Food standard rates are BF: 3.27, LN: 4.385, DN: 4.27.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <label className="block text-slate-300 font-bold mb-2">Breakfast Rate (AED)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={breakfastRate}
                    onChange={(e) => setBreakfastRate(e.target.value)}
                    placeholder="3.27"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-mono text-base font-bold focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5">Per breakfast delivered</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <label className="block text-slate-300 font-bold mb-2">Lunch Rate (AED)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={lunchRate}
                    onChange={(e) => setLunchRate(e.target.value)}
                    placeholder="4.385"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-mono text-base font-bold focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5">Per lunch delivered</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <label className="block text-slate-300 font-bold mb-2">Dinner Rate (AED)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={dinnerRate}
                    onChange={(e) => setDinnerRate(e.target.value)}
                    placeholder="4.27"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-mono text-base font-bold focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5">Per dinner delivered</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-white block mb-1">Historical Immutability Guarantee:</span>
                Updating these rates only applies to future daily entries. Historical records freeze their original applied rate and never alter previous accounting balances.
              </div>
            </div>
          )}

          {/* TAB 3: Charges & Pricing */}
          {activeTab === 'charges' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Additional Vendor Charges</span>
                  <span className="text-[11px] text-slate-400">Configure fixed or percentage charges, effective dates, and toggles.</span>
                </div>
                <Settings className="w-5 h-5 text-amber-400" />
              </div>

              {/* Service Charge */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="svc_enabled"
                      checked={serviceCharge.is_enabled}
                      onChange={(e) => setServiceCharge({ ...serviceCharge, is_enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                    />
                    <label htmlFor="svc_enabled" className="font-bold text-white cursor-pointer">
                      Service Charge
                    </label>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${serviceCharge.is_enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {serviceCharge.is_enabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>

                {serviceCharge.is_enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Type</label>
                      <select
                        value={serviceCharge.type}
                        onChange={(e) => setServiceCharge({ ...serviceCharge, type: e.target.value as any })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      >
                        <option value="fixed">Fixed (AED)</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Value ({serviceCharge.type === 'fixed' ? 'AED' : '%'})</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={serviceCharge.value}
                        onChange={(e) => setServiceCharge({ ...serviceCharge, value: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Effective Date</label>
                      <input
                        type="date"
                        value={serviceCharge.effective_date || ''}
                        onChange={(e) => setServiceCharge({ ...serviceCharge, effective_date: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Charge */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="del_enabled"
                      checked={deliveryCharge.is_enabled}
                      onChange={(e) => setDeliveryCharge({ ...deliveryCharge, is_enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                    />
                    <label htmlFor="del_enabled" className="font-bold text-white cursor-pointer">
                      Delivery Charge
                    </label>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${deliveryCharge.is_enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {deliveryCharge.is_enabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>

                {deliveryCharge.is_enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Type</label>
                      <select
                        value={deliveryCharge.type}
                        onChange={(e) => setDeliveryCharge({ ...deliveryCharge, type: e.target.value as any })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      >
                        <option value="fixed">Fixed (AED)</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Value ({deliveryCharge.type === 'fixed' ? 'AED' : '%'})</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={deliveryCharge.value}
                        onChange={(e) => setDeliveryCharge({ ...deliveryCharge, value: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Effective Date</label>
                      <input
                        type="date"
                        value={deliveryCharge.effective_date || ''}
                        onChange={(e) => setDeliveryCharge({ ...deliveryCharge, effective_date: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Packing Charge */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pack_enabled"
                      checked={packingCharge.is_enabled}
                      onChange={(e) => setPackingCharge({ ...packingCharge, is_enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                    />
                    <label htmlFor="pack_enabled" className="font-bold text-white cursor-pointer">
                      Packing Charge
                    </label>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${packingCharge.is_enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {packingCharge.is_enabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>

                {packingCharge.is_enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Type</label>
                      <select
                        value={packingCharge.type}
                        onChange={(e) => setPackingCharge({ ...packingCharge, type: e.target.value as any })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      >
                        <option value="fixed">Fixed (AED)</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Value ({packingCharge.type === 'fixed' ? 'AED' : '%'})</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={packingCharge.value}
                        onChange={(e) => setPackingCharge({ ...packingCharge, value: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Effective Date</label>
                      <input
                        type="date"
                        value={packingCharge.effective_date || ''}
                        onChange={(e) => setPackingCharge({ ...packingCharge, effective_date: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Other Charges */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="oth_enabled"
                      checked={otherCharges.is_enabled}
                      onChange={(e) => setOtherCharges({ ...otherCharges, is_enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                    />
                    <label htmlFor="oth_enabled" className="font-bold text-white cursor-pointer">
                      Other Charges (Handling / Wastage / Custom)
                    </label>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${otherCharges.is_enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {otherCharges.is_enabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>

                {otherCharges.is_enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Type</label>
                      <select
                        value={otherCharges.type}
                        onChange={(e) => setOtherCharges({ ...otherCharges, type: e.target.value as any })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      >
                        <option value="fixed">Fixed (AED)</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Value ({otherCharges.type === 'fixed' ? 'AED' : '%'})</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={otherCharges.value}
                        onChange={(e) => setOtherCharges({ ...otherCharges, value: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Effective Date</label>
                      <input
                        type="date"
                        value={otherCharges.effective_date || ''}
                        onChange={(e) => setOtherCharges({ ...otherCharges, effective_date: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Financial Setup */}
          {activeTab === 'financial' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <label className="block text-slate-200 font-bold">Opening Balance (AED)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    placeholder="-946.66"
                    className="w-full px-3.5 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Accounting Convention:</span>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-400">
                        <li>
                          <strong className="text-rose-400">Positive Balance (&gt; 0)</strong>: Karama Mess owes the vendor money (Payable liability).
                        </li>
                        <li>
                          <strong className="text-sky-400">Negative Balance (&lt; 0)</strong>: Karama Mess has paid advance or holds credit with the vendor (e.g. <span className="font-mono text-amber-300">-946.66 AED</span> for Mom's Food).
                        </li>
                        <li>
                          <strong className="text-emerald-400">Zero Balance (= 0)</strong>: Fully settled account.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Opening balance is preserved and applied as the initial base for running balance calculations.</span>
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 font-semibold"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== 'financial' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'general') setActiveTab('rates');
                    else if (activeTab === 'rates') setActiveTab('charges');
                    else if (activeTab === 'charges') setActiveTab('financial');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold transition-colors"
                >
                  Next Tab &rarr;
                </button>
              ) : null}

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition-colors"
              >
                {vendor ? 'Save Vendor Changes' : 'Register Vendor'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
