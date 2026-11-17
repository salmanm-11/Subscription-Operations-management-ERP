import React, { useState, useMemo } from 'react';
import { CreditCard, Plus, Search, Printer, X, FileSpreadsheet, Building2, Phone, CheckCircle2, RotateCcw, Receipt, Trash2, AlertTriangle, MessageSquare } from 'lucide-react';
import { Payment, Customer, Invoice, PaymentMethod } from '../../types';
import { formatAED } from '../../utils/currency';
import { getMonthlySubscriptionRate } from '../../utils/billingCycleService';

interface PaymentListProps {
  payments: Payment[];
  customers: Customer[];
  invoices: Invoice[];
  isReadOnly?: boolean;
  onRecordPayment: (payment: Partial<Payment>) => void;
  onDeletePayment?: (paymentId: string) => void | Promise<void>;
}

export const PaymentList: React.FC<PaymentListProps> = ({
  payments,
  customers,
  invoices,
  isReadOnly = false,
  onRecordPayment,
  onDeletePayment,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [justRecordedPayment, setJustRecordedPayment] = useState<Payment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Form states
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState(380);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Map of customers by ID for fast and accurate lookups
  const customerMap = useMemo(() => {
    const map = new Map<string, Customer>();
    customers.forEach((c) => {
      map.set(c.id, c);
      if (c.customer_code) map.set(c.customer_code, c);
    });
    return map;
  }, [customers]);

  // Resolver for accurate customer details on every payment
  const getCustomerInfo = (p: Payment) => {
    const isDailyLedger =
      p.reference_number?.startsWith('DAILY-COLLECTION') ||
      p.payment_number?.startsWith('REC-LEDGER');

    if (isDailyLedger) {
      return {
        name: 'Daily Mess Counter Collection',
        sub: 'Walk-in & Daily Collections (Karama Central)',
        badge: 'Counter Cash',
        isLedger: true,
      };
    }

    const cust = p.customer || (p.customer_id ? customerMap.get(p.customer_id) : undefined);
    if (cust) {
      const bld = cust.building_name_cache || (cust.building?.name ? cust.building.name : '');
      const apt = cust.apartment_cache ? `Apt ${cust.apartment_cache}` : '';
      const bldApt = [bld, apt].filter(Boolean).join(' - ');
      return {
        name: cust.full_name,
        sub: bldApt || cust.phone || 'Resident Customer',
        badge: cust.customer_code,
        phone: cust.phone,
        isLedger: false,
      };
    }

    if (p.customer_id === 'c-thahir-corp' || p.notes?.toLowerCase().includes('thahir')) {
      return {
        name: 'Thahir Group Corporate Account',
        sub: 'Star of Karama / Dhe Fish - 11 Staff Accounts',
        badge: 'CORP-THAHIR',
        phone: '+971 50 999 8877',
        isLedger: false,
      };
    }

    return {
      name: 'Karama Mess Customer',
      sub: p.reference_number || 'Cash Collection',
      badge: undefined,
      phone: undefined,
      isLedger: false,
    };
  };

  // Filtered payments by search query and method
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const info = getCustomerInfo(p);
      const term = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !term ||
        p.payment_number.toLowerCase().includes(term) ||
        info.name.toLowerCase().includes(term) ||
        info.sub.toLowerCase().includes(term) ||
        (info.phone && info.phone.toLowerCase().includes(term)) ||
        (p.reference_number && p.reference_number.toLowerCase().includes(term)) ||
        (p.notes && p.notes.toLowerCase().includes(term)) ||
        p.amount.toString().includes(term) ||
        p.payment_date.includes(term);

      const matchesMethod = methodFilter === 'all' || p.payment_method === methodFilter;

      return matchesSearch && matchesMethod;
    });
  }, [payments, searchTerm, methodFilter, customerMap]);

  // Aggregate stats
  const totalCollections = useMemo(() => {
    return filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [filteredPayments]);

  const cashCollections = useMemo(() => {
    return filteredPayments
      .filter((p) => p.payment_method === 'cash')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [filteredPayments]);

  const bankCollections = useMemo(() => {
    return filteredPayments
      .filter((p) => p.payment_method === 'bank_transfer' || p.payment_method === 'card')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [filteredPayments]);

  // WhatsApp Receipt Dispatcher
  const handleSendWhatsAppReceipt = (p: Payment) => {
    const info = getCustomerInfo(p);
    const cust = p.customer || (p.customer_id ? customerMap.get(p.customer_id) : undefined);
    const name = info.name || 'Valued Customer';
    const amountStr = formatAED(p.amount);
    const recNo = p.payment_number || 'N/A';
    const dateStr = p.payment_date || new Date().toISOString().split('T')[0];
    const isZeroDue = cust ? (cust.total_overdue || 0) === 0 : false;
    const dueStatus = cust
      ? isZeroDue
        ? 'All mess dues cleared in full (AED 0.00)'
        : `Remaining Due Balance: ${formatAED(cust.total_overdue)}`
      : 'Payment Received & Recorded';

    const text =
      `*Karama Homely Mess - Payment Receipt*\n\n` +
      `Dear *${name}*,\n` +
      `We have received your payment with thanks!\n\n` +
      `• *Receipt No:* ${recNo}\n` +
      `• *Amount Paid:* ${amountStr}\n` +
      `• *Payment Date:* ${dateStr}\n` +
      `• *Method:* ${(p.payment_method || 'Cash').toUpperCase().replace('_', ' ')}\n` +
      (p.reference_number ? `• *Reference:* ${p.reference_number}\n` : '') +
      `• *Status:* ${dueStatus}\n\n` +
      `Thank you for dining with Karama Homely Mess!\n*Karama Homely Mess, Dubai*`;

    let phone = (cust?.phone || info.phone || '').replace(/[^0-9]/g, '');
    if (phone.startsWith('05')) phone = '971' + phone.substring(1);
    else if (phone.length === 9) phone = '971' + phone;

    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || amount <= 0) return;
    const cust = customers.find((c) => c.id === customerId);

    const paymentPayload: Partial<Payment> = {
      customer_id: customerId,
      customer: cust,
      amount: Number(amount),
      payment_date: paymentDate,
      payment_method: paymentMethod,
      reference_number: referenceNumber.trim(),
      notes: notes.trim(),
    };

    onRecordPayment(paymentPayload);

    // Optimistic payment object for immediate receipt confirmation with WhatsApp option
    const recordedReceiptData: Payment = {
      id: 'pay-' + Date.now(),
      business_id: 'b0000000-0000-0000-0000-000000000001',
      payment_number: 'REC-' + Math.floor(100000 + Math.random() * 900000),
      customer_id: customerId,
      customer: cust,
      amount: Number(amount),
      payment_date: paymentDate,
      payment_method: paymentMethod,
      reference_number: referenceNumber.trim(),
      notes: notes.trim(),
      is_reversed: false,
      created_at: new Date().toISOString(),
    };

    setIsModalOpen(false);
    setReferenceNumber('');
    setNotes('');
    setJustRecordedPayment(recordedReceiptData);
  };

  return (
    <div className="space-y-4 max-w-full min-w-0">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Payment Receipts</h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
            Record, verify, and search all cash, bank transfer, and card collections in AED
          </p>
        </div>

        {!isReadOnly && (
          <button
            onClick={() => {
              if (customers.length > 0) {
                setCustomerId(customers[0].id);
                const defaultAmt = customers[0].total_overdue || getMonthlySubscriptionRate(customers[0]).effectiveRate;
                setAmount(defaultAmt);
              }
              setIsModalOpen(true);
            }}
            className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>Record Payment</span>
          </button>
        )}
      </div>

      {/* Top Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        <div className="bg-[#151c2c] border border-emerald-500/30 rounded-xl p-3.5 shadow-md shadow-black/20 min-w-0">
          <div className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">Total Filtered Collections</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-0.5 truncate">
            {formatAED(totalCollections)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
            {filteredPayments.length} Receipts Logged
          </div>
        </div>

        <div className="bg-[#151c2c] border border-amber-500/30 rounded-xl p-3.5 shadow-md shadow-black/20 min-w-0">
          <div className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider">Cash Collections</div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-0.5 truncate">
            {formatAED(cashCollections)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">Direct Cash &amp; Counter Dues</div>
        </div>

        <div className="bg-[#151c2c] border border-sky-500/30 rounded-xl p-3.5 shadow-md shadow-black/20 min-w-0">
          <div className="text-[10px] uppercase font-extrabold text-sky-400 tracking-wider">Bank &amp; Card Transfers</div>
          <div className="text-xl sm:text-2xl font-black text-sky-400 font-mono mt-0.5 truncate">
            {formatAED(bankCollections)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">Online &amp; Card Settlements</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#151c2c] border border-[#222f47]/60 rounded-xl p-3 shadow-md shadow-black/20">
        <div className="relative flex-1 min-w-[200px] cursor-text">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, receipt #, building, phone, notes, cheque #..."
            className="w-full pl-10 pr-9 py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-slate-900/90 border border-slate-700/70 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Payment Methods</option>
            <option value="cash">Cash Only</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="card">Card Payment</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="bg-[#0f1422] text-slate-300 border-b border-slate-700/80 text-xs uppercase tracking-wider font-bold">
                <th className="py-3 px-3.5 whitespace-nowrap">Receipt #</th>
                <th className="py-3 px-3 whitespace-nowrap">Date</th>
                <th className="py-3 px-3.5 min-w-[220px]">Customer Name &amp; Details</th>
                <th className="py-3 px-2.5 text-center whitespace-nowrap">Method</th>
                <th className="py-3 px-2.5 whitespace-nowrap">Ref / Cheque #</th>
                <th className="py-3 px-3.5 min-w-[220px]">Notes</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Amount (AED)</th>
                <th className="py-3 px-3.5 text-center min-w-[120px] whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap min-w-[190px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                    No payment receipts matched your search or filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const info = getCustomerInfo(p);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Receipt Number */}
                      <td className="py-3 px-3.5 font-mono font-bold text-amber-400 whitespace-nowrap">
                        {p.payment_number}
                      </td>

                      {/* Payment Date */}
                      <td className="py-3 px-3 text-slate-300 font-semibold whitespace-nowrap text-xs">
                        {p.payment_date}
                      </td>

                      {/* Customer Name and Info */}
                      <td className="py-3 px-3.5 min-w-[220px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <div className="font-bold text-white text-sm sm:text-base tracking-tight">
                            {info.name}
                          </div>
                          {info.badge && (
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                              {info.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span>{info.sub}</span>
                          {info.phone && (
                            <span className="text-slate-500 font-normal">({info.phone})</span>
                          )}
                        </div>
                      </td>

                      {/* Method */}
                      <td className="py-3 px-2.5 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 border border-slate-700 text-slate-300 shadow-sm">
                          {p.payment_method.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Ref / Cheque */}
                      <td className="py-3 px-2.5 font-mono text-slate-300 text-xs whitespace-nowrap">
                        {p.reference_number || '-'}
                      </td>

                      {/* Notes (Fully visible, wrapping cleanly without truncation) */}
                      <td className="py-3 px-3.5 text-slate-200 text-xs font-medium leading-relaxed min-w-[220px] max-w-[340px] whitespace-pre-line break-words">
                        {p.notes || '-'}
                      </td>

                      {/* Amount in AED */}
                      <td className="py-3 px-3 text-right font-black text-emerald-400 whitespace-nowrap text-sm sm:text-base font-mono drop-shadow-sm">
                        {formatAED(p.amount)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap min-w-[120px]">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${
                            p.is_reversed
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {p.is_reversed ? 'Reversed' : 'Settled'}
                        </span>
                      </td>

                      {/* Action View / Print & Delete (Clean layout & never clipped or overlapping) */}
                      <td className="py-3 px-4 text-right whitespace-nowrap min-w-[190px]">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSendWhatsAppReceipt(p)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-400 hover:text-emerald-300 rounded-lg font-bold text-xs border border-emerald-500/30 shadow-sm transition-colors cursor-pointer"
                            title="Message Receipt on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </button>
                          <button
                            onClick={() => setSelectedReceipt(p)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-lg font-bold text-xs border border-slate-700 shadow-sm transition-colors cursor-pointer"
                            title="View / Print Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5 text-amber-400" />
                            <span>Receipt</span>
                          </button>
                          {!isReadOnly && onDeletePayment && (
                            <button
                              onClick={() => setPaymentToDelete(p)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 transition-colors shadow-sm cursor-pointer"
                              title="Delete Payment Receipt"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* Official Printable Receipt Preview Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl text-white space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white">Official Payment Receipt</h3>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-0.5">Karama Homely Mess - Dubai, UAE</p>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const info = getCustomerInfo(selectedReceipt);
              return (
                <div className="space-y-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-bold uppercase">Receipt Number</span>
                    <span className="font-mono text-base font-black text-amber-400">{selectedReceipt.payment_number}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-bold uppercase">Payment Date</span>
                    <span className="text-sm font-bold text-slate-200">{selectedReceipt.payment_date}</span>
                  </div>

                  <div className="pb-3 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Received From</span>
                    <div className="text-base font-black text-white">{info.name}</div>
                    <div className="text-xs text-slate-300 font-semibold">{info.sub}</div>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-bold uppercase">Payment Method</span>
                    <span className="text-xs font-black uppercase px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                      {selectedReceipt.payment_method.replace('_', ' ')}
                    </span>
                  </div>

                  {selectedReceipt.reference_number && (
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                      <span className="text-xs text-slate-400 font-bold uppercase">Reference / Cheque</span>
                      <span className="font-mono text-xs font-bold text-slate-200">{selectedReceipt.reference_number}</span>
                    </div>
                  )}

                  {selectedReceipt.notes && (
                    <div className="pb-3 border-b border-slate-800">
                      <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Notes</span>
                      <div className="text-xs text-slate-300 font-medium">{selectedReceipt.notes}</div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-slate-300 font-black uppercase">Amount Received</span>
                    <span className="font-mono text-2xl font-black text-emerald-400">
                      {formatAED(selectedReceipt.amount)}
                    </span>
                  </div>
                </div>
              );
            })()}

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleSendWhatsAppReceipt(selectedReceipt)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                title="Send Receipt to Customer on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Payment Success Modal with Instant WhatsApp Receipt Option */}
      {justRecordedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-emerald-500/50 rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl text-white space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Payment Recorded Successfully!</h3>
                <p className="text-xs text-slate-300">
                  Official receipt created for {getCustomerInfo(justRecordedPayment).name}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Receipt Number:</span>
                <span className="font-mono text-amber-400 font-bold">{justRecordedPayment.payment_number}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Amount Paid:</span>
                <span className="font-mono text-emerald-400 font-black text-base">{formatAED(justRecordedPayment.amount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Payment Method:</span>
                <span className="font-bold text-white uppercase">{justRecordedPayment.payment_method.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  handleSendWhatsAppReceipt(justRecordedPayment);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Message Receipt on WhatsApp</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const pay = justRecordedPayment;
                    setJustRecordedPayment(null);
                    setSelectedReceipt(pay);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-amber-400" />
                  <span>View / Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setJustRecordedPayment(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-lg p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white">Record Customer Payment</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-200 font-bold mb-1.5">Customer Name *</label>
                <select
                  required
                  value={customerId}
                  onChange={(e) => {
                    setCustomerId(e.target.value);
                    const selected = customers.find((c) => c.id === e.target.value);
                    if (selected && selected.total_overdue) {
                      setAmount(selected.total_overdue);
                    } else if (selected) {
                      setAmount(getMonthlySubscriptionRate(selected).effectiveRate);
                    }
                  }}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.building_name_cache || 'Building'} Apt {c.apartment_cache || 'N/A'})
                      {c.total_overdue ? ` - Overdue: ${formatAED(c.total_overdue)}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1.5">Amount Paid (AED) *</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-black text-base focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-200 font-bold mb-1.5">Payment Date</label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1.5">Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 uppercase font-bold"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                    <option value="cheque">Cheque</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1.5">Transaction Ref / Cheque No.</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. TXN-998822 / Cash hand collection"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1.5">Payment Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. October monthly mess dues settled in full"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20"
                >
                  Confirm &amp; Record Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Payment Confirmation Modal */}
      {paymentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-rose-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Payment Receipt?</h3>
                <p className="text-xs text-rose-300/80 font-mono mt-0.5">{paymentToDelete.payment_number}</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-bold text-white">{getCustomerInfo(paymentToDelete).name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-mono font-bold text-emerald-400">{formatAED(paymentToDelete.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="font-mono text-slate-300">{paymentToDelete.payment_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="uppercase font-bold text-slate-300">{paymentToDelete.payment_method.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                Deleting this receipt will remove it permanently and restore <strong>{formatAED(paymentToDelete.amount)}</strong> back to the customer's overdue balance.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPaymentToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (onDeletePayment && paymentToDelete) {
                    await onDeletePayment(paymentToDelete.id);
                  }
                  setPaymentToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
