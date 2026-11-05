import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Edit,
  Phone,
  PhoneCall,
  Mail,
  Building2,
  MapPin,
  Key,
  Clock,
  Utensils,
  CreditCard,
  Receipt,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  DollarSign,
  Printer,
  Share2,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  FileText,
  BadgeAlert,
  Edit3,
  CalendarX,
  UserMinus,
  RotateCcw
} from 'lucide-react';
import { Customer, Building, MealPlan, Invoice, Payment, PaymentMethod } from '../../types';
import { formatAED } from '../../utils/currency';
import { getCustomerDueDateInfo, sendWhatsAppReminder } from '../../utils/reminderService';
import { getMonthlySubscriptionRate } from '../../utils/billingCycleService';
import { getCustomerCancellationNotice, sendCancellationWhatsApp, ApproachingCancellation } from '../../utils/cancellationService';
import { saveCustomer } from '../../api/supabase';
import { ActivityLogService } from '../../api/activityLogService';
import { PrintableInvoice } from '../billing/PrintableInvoice';
import { OfflineStorage } from '../../api/offlineStorage';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  customers?: Customer[];
  buildings?: Building[];
  mealPlans?: MealPlan[];
  invoices?: Invoice[];
  payments?: Payment[];
  isReadOnly?: boolean;
  onEdit: (customer: Customer) => void;
  onRecordPayment?: (payment: Partial<Payment>) => Promise<void> | void;
  onSaveCustomer?: (customer: Partial<Customer>) => Promise<void> | void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  onClose,
  customer,
  customers = [],
  buildings = [],
  mealPlans = [],
  invoices = [],
  payments = [],
  isReadOnly = false,
  onEdit,
  onRecordPayment,
  onSaveCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments'>('overview');
  const [copied, setCopied] = useState(false);

  // In-modal Due Add / Edit State
  const [isDueModalOpen, setIsDueModalOpen] = useState(false);
  const [dueAmountInput, setDueAmountInput] = useState<number>(0);
  const [dueRatingInput, setDueRatingInput] = useState<'Good' | 'Late payer' | 'Bad'>('Good');
  const [billedUpToInput, setBilledUpToInput] = useState<string>('');
  const [paymentMadeUpToInput, setPaymentMadeUpToInput] = useState<string>('');
  const [dueReasonInput, setDueReasonInput] = useState<string>('');
  const [isSavingDue, setIsSavingDue] = useState(false);

  // In-modal Payment Form State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payInvoiceId, setPayInvoiceId] = useState<string>('');
  const [payDate, setPayDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('cash');
  const [payReference, setPayReference] = useState<string>('');
  const [payNotes, setPayNotes] = useState<string>('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);
  const [paySuccessMsg, setPaySuccessMsg] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Instantaneous optimistic customer update state
  const [optimisticCustomer, setOptimisticCustomer] = useState<Partial<Customer> | null>(null);

  useEffect(() => {
    setOptimisticCustomer(null);
  }, [customer?.id, customer?.total_overdue, customer?.payment_rating]);

  // Keep customer data synchronized in real-time if live customers array updates
  const activeCustomer = useMemo(() => {
    if (!customer) return null;
    let base = customer;
    if (customers && customers.length > 0) {
      const live = customers.find(
        (c) => c.id === customer.id || c.customer_code === customer.customer_code
      );
      if (live) base = live;
    }
    if (optimisticCustomer) {
      return { ...base, ...optimisticCustomer };
    }
    return base;
  }, [customer, customers, optimisticCustomer]);

  // Resolve building & meal plan
  const building = useMemo(() => {
    if (!activeCustomer) return undefined;
    return buildings.find((b) => b.id === activeCustomer.building_id) || activeCustomer.building;
  }, [activeCustomer, buildings]);

  const mealPlan = useMemo(() => {
    if (!activeCustomer) return undefined;
    return mealPlans.find((m) => m.id === activeCustomer.meal_plan_id) || activeCustomer.meal_plan;
  }, [activeCustomer, mealPlans]);

  // Resolve customer-specific invoices
  const customerInvoices = useMemo(() => {
    if (!activeCustomer || !invoices) return [];
    return invoices.filter(
      (inv) =>
        inv.customer_id === activeCustomer.id ||
        (inv.customer_name_cache &&
          inv.customer_name_cache.toLowerCase() === activeCustomer.full_name.toLowerCase())
    );
  }, [activeCustomer, invoices]);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleViewBill = (targetInv?: Invoice) => {
    if (targetInv) {
      setSelectedInvoice(targetInv);
      return;
    }
    if (customerInvoices && customerInvoices.length > 0) {
      setSelectedInvoice(customerInvoices[0]);
      return;
    }
    if (activeCustomer) {
      const today = new Date().toISOString().split('T')[0];
      const pStart = activeCustomer.billing_start_date || '2026-11-01';
      const pEnd = activeCustomer.billing_end_date || '2026-11-30';
      const cycleRate = getMonthlySubscriptionRate(activeCustomer, pStart, pEnd);
      const total = (activeCustomer.total_overdue && activeCustomer.total_overdue > 0)
        ? activeCustomer.total_overdue
        : cycleRate.effectiveRate;

      const virtualInv: Invoice = {
        id: `stmt-${activeCustomer.id}`,
        business_id: 'default',
        invoice_number: `STMT-${activeCustomer.customer_code || '001'}`,
        customer_id: activeCustomer.id,
        customer: activeCustomer,
        customer_name_cache: activeCustomer.full_name,
        building_cache: activeCustomer.building_name_cache || '',
        issue_date: today,
        due_date: today,
        period_start: pStart,
        period_end: pEnd,
        subtotal: cycleRate.effectiveRate,
        discount_amount: 0,
        tax_amount: 0,
        total_amount: total,
        paid_amount: 0,
        balance_amount: total,
        status: total > 0 ? 'issued' : 'paid',
        notes: `Customer Statement & Billing Breakdown for ${activeCustomer.full_name}`,
        created_at: new Date().toISOString(),
      };
      setSelectedInvoice(virtualInv);
    }
  };

  // Resolve customer-specific payments
  const customerPayments = useMemo(() => {
    if (!activeCustomer || !payments) return [];
    return payments.filter(
      (p) =>
        p.customer_id === activeCustomer.id ||
        p.customer_id === activeCustomer.customer_code ||
        (p.customer && (p.customer.id === activeCustomer.id || p.customer.customer_code === activeCustomer.customer_code))
    );
  }, [activeCustomer, payments]);

  // Due date approaching reminder info
  const dueDateInfo = useMemo(() => {
    if (!activeCustomer) return null;
    return getCustomerDueDateInfo(activeCustomer, invoices);
  }, [activeCustomer, invoices]);

  // Scheduled cancellation notice and pro-rata settlement
  const cancellationNotice = useMemo(() => {
    if (!activeCustomer) return null;
    return getCustomerCancellationNotice(activeCustomer);
  }, [activeCustomer]);

  if (!isOpen || !activeCustomer) return null;

  const overdue = activeCustomer.total_overdue || 0;
  const isOverdue = overdue > 0;

  // Open the built-in Pay Bill dialog right on this profile page
  const handleOpenPayModal = (suggestedAmount?: number, invoiceId?: string) => {
    const cycleRate = getMonthlySubscriptionRate(activeCustomer);
    const defaultAmount =
      suggestedAmount !== undefined && suggestedAmount > 0
        ? suggestedAmount
        : overdue > 0
        ? overdue
        : cycleRate.effectiveRate;

    setPayAmount(defaultAmount);
    setPayInvoiceId(
      invoiceId ||
        customerInvoices.find((i) => i.balance_amount !== undefined && i.balance_amount > 0)?.id ||
        ''
    );
    setPayDate(new Date().toISOString().split('T')[0]);
    setPayMethod('cash');
    setPayReference(`REC-${activeCustomer.customer_code}-${Date.now().toString().slice(-4)}`);
    setPayNotes(
      invoiceId
        ? `Payment settlement for Invoice #${
            customerInvoices.find((i) => i.id === invoiceId)?.invoice_number || ''
          }`
        : overdue > 0
        ? `Settled overdue mess charges of AED ${overdue}`
        : `Monthly subscription fee settlement for ${activeCustomer.full_name}`
    );
    setPaySuccessMsg(null);
    setIsPayModalOpen(true);
  };

  // Submit payment from within the profile page
  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer || payAmount <= 0) {
      alert('Please enter a valid payment amount greater than 0.');
      return;
    }

    const paidAmt = Number(payAmount);
    const currentDue = activeCustomer.total_overdue || 0;
    const newDue = Math.max(0, currentDue - paidAmt);

    // Instant optimistic update on profile card
    setOptimisticCustomer({
      total_overdue: newDue,
      payment_rating: newDue === 0 ? 'Good' : 'Late payer',
      payment_made_up_to_date: payDate,
    });

    try {
      setIsSubmittingPay(true);
      const paymentPayload: Partial<Payment> = {
        customer_id: activeCustomer.id,
        invoice_id: payInvoiceId || undefined,
        amount: paidAmt,
        payment_date: payDate,
        payment_method: payMethod,
        reference_number: payReference,
        notes: payNotes,
      };

      if (onRecordPayment) {
        await onRecordPayment(paymentPayload);
      }

      setIsPayModalOpen(false);
      setPaySuccessMsg(
        `✓ Payment of ${formatAED(paidAmt)} recorded successfully! Overdue balance settled.`
      );
      setTimeout(() => setPaySuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Error recording payment on profile:', err);
      setOptimisticCustomer(null);
      alert('Failed to record payment: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmittingPay(false);
    }
  };

  // Open the Add / Edit Due dialog
  const handleOpenDueModal = (initialField?: 'due' | 'billed' | 'paid') => {
    if (!activeCustomer) return;
    setDueAmountInput(activeCustomer.total_overdue || 0);
    setDueRatingInput(
      activeCustomer.payment_rating ||
        (activeCustomer.total_overdue && activeCustomer.total_overdue > 0 ? 'Late payer' : 'Good')
    );
    setBilledUpToInput(
      activeCustomer.billed_up_to_date || activeCustomer.billing_end_date || ''
    );
    setPaymentMadeUpToInput(
      activeCustomer.payment_made_up_to_date || activeCustomer.billing_start_date || ''
    );
    setDueReasonInput('');
    setIsDueModalOpen(true);
  };

  // Save changes to customer due balance, dates, and rating
  const handleSaveDue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer) return;

    const newDue = Math.max(0, Number(dueAmountInput) || 0);

    // Instant optimistic update on profile card
    setOptimisticCustomer({
      total_overdue: newDue,
      payment_rating: dueRatingInput,
      billed_up_to_date: billedUpToInput || activeCustomer.billed_up_to_date,
      payment_made_up_to_date: paymentMadeUpToInput || activeCustomer.payment_made_up_to_date,
    });

    try {
      setIsSavingDue(true);
      const updatedCust: Partial<Customer> = {
        ...activeCustomer,
        total_overdue: newDue,
        payment_rating: dueRatingInput,
        billed_up_to_date: billedUpToInput || activeCustomer.billed_up_to_date,
        billing_end_date: billedUpToInput || activeCustomer.billing_end_date,
        payment_made_up_to_date: paymentMadeUpToInput || activeCustomer.payment_made_up_to_date,
        billing_start_date: paymentMadeUpToInput || activeCustomer.billing_start_date,
        notes: dueReasonInput.trim()
          ? activeCustomer.notes
            ? `${activeCustomer.notes}\n[${new Date().toISOString().split('T')[0]}] Due adjusted to AED ${newDue}: ${dueReasonInput.trim()}`
            : `Due adjusted to AED ${newDue}: ${dueReasonInput.trim()}`
          : activeCustomer.notes,
        updated_at: new Date().toISOString(),
      };

      if (onSaveCustomer) {
        await onSaveCustomer(updatedCust);
      } else {
        await saveCustomer(updatedCust);
      }

      ActivityLogService.logAction(
        'Customers',
        'UPDATE',
        'Customer Due Balance Updated',
        `Adjusted due balance for "${activeCustomer.full_name}" (${activeCustomer.customer_code}) to AED ${newDue}${dueReasonInput.trim() ? ` - Reason: ${dueReasonInput.trim()}` : ''}`,
        { entityId: activeCustomer.id }
      );

      setIsDueModalOpen(false);
      setPaySuccessMsg(
        `✓ Outstanding due balance updated to ${formatAED(newDue)} successfully!`
      );
      setTimeout(() => setPaySuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Error saving due balance:', err);
      alert('Failed to save due: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSavingDue(false);
    }
  };

  // WhatsApp launcher
  const handleWhatsApp = (phoneStr?: string) => {
    if (!phoneStr) return;
    const digits = phoneStr.replace(/[^0-9]/g, '');
    if (!digits) return;
    let formatted = digits;
    if (formatted.startsWith('05')) {
      formatted = '971' + formatted.slice(1);
    } else if (!formatted.startsWith('971') && formatted.length === 9) {
      formatted = '971' + formatted;
    }
    window.open(`https://wa.me/${formatted}`, '_blank');
  };

  // WhatsApp Payment Receipt Confirmation
  const handleSendWhatsAppPaymentReceipt = (p: Payment) => {
    if (!activeCustomer) return;
    const name = activeCustomer.full_name;
    const amountStr = formatAED(p.amount);
    const recNo = p.payment_number || 'N/A';
    const dateStr = p.payment_date;
    const isZeroDue = (activeCustomer.total_overdue || 0) === 0;
    const dueStatus = isZeroDue
      ? 'All mess dues cleared in full (AED 0.00)'
      : `Remaining Due Balance: ${formatAED(activeCustomer.total_overdue)}`;

    const text =
      `*Karama Mess & Catering - Payment Receipt*\n\n` +
      `Dear *${name}*,\n` +
      `We have received your payment with thanks!\n\n` +
      `• *Receipt No:* ${recNo}\n` +
      `• *Amount Paid:* ${amountStr}\n` +
      `• *Payment Date:* ${dateStr}\n` +
      `• *Method:* ${(p.payment_method || 'Cash').toUpperCase().replace('_', ' ')}\n` +
      `• *Status:* ${dueStatus}\n\n` +
      `Thank you for dining with Karama Mess!\n*Karama Mess & Catering, Dubai*`;

    let phone = (activeCustomer.phone || '').replace(/[^0-9]/g, '');
    if (phone.startsWith('05')) phone = '971' + phone.substring(1);
    else if (phone.length === 9) phone = '971' + phone;

    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Copy full customer profile
  const handleCopySummary = async () => {
    const lines = [
      `*KARAMA MESS - CUSTOMER PROFILE*`,
      `Customer Code: ${activeCustomer.customer_code}`,
      `Full Name: ${activeCustomer.full_name}`,
      `Status: ${activeCustomer.status.toUpperCase()}`,
      `Managed By: ${activeCustomer.managed_by || 'admin'}`,
      `Primary Phone: ${activeCustomer.phone || 'N/A'}`,
      activeCustomer.emergency_contact
        ? `Emergency SOS Contact: ${activeCustomer.emergency_contact}`
        : '',
      activeCustomer.email ? `Email: ${activeCustomer.email}` : '',
      `Building: ${building?.name || activeCustomer.building_name_cache || 'Unassigned'}`,
      `Apartment / Room: ${activeCustomer.apartment_cache || 'N/A'}`,
      activeCustomer.door_passcode
        ? `Door Passcode: 🔑 ${activeCustomer.door_passcode}`
        : '',
      activeCustomer.delivery_time
        ? `Delivery Time Window: ⏰ ${activeCustomer.delivery_time}`
        : '',
      `Meal Subscription: ${mealPlan?.name || 'Standard Plan'}`,
      `Included Meals: ${[
        activeCustomer.has_breakfast ? 'Breakfast' : '',
        activeCustomer.has_lunch ? 'Lunch' : '',
        activeCustomer.has_dinner ? 'Dinner' : '',
      ]
        .filter(Boolean)
        .join(', ') || 'None'}`,
      activeCustomer.dietary_preferences
        ? `Dietary Preferences: ${activeCustomer.dietary_preferences}`
        : '',
      activeCustomer.notes ? `Delivery / Account Notes: ${activeCustomer.notes}` : '',
      `Monthly Subscription Rate: AED ${activeCustomer.monthly_rate}`,
      `Payment Made Up To: ${
        activeCustomer.payment_made_up_to_date ||
        activeCustomer.billing_start_date ||
        'N/A'
      }`,
      `Billed Up To: ${
        activeCustomer.billed_up_to_date ||
        activeCustomer.billing_end_date ||
        'N/A'
      }`,
      `Outstanding Balance / Overdue: AED ${overdue}`,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Finalize cancellation immediately
  const handleFinalizeCancellation = async () => {
    if (!activeCustomer) return;
    const confirmMsg = `Finalize cancellation for "${activeCustomer.full_name}"?\n\nThis will immediately change their status to Cancelled and stop future meal scheduling. Historical billing and payment records will be preserved.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const exitDate = cancellationNotice?.cancellationDate || new Date().toISOString().split('T')[0];
      const updated: Partial<Customer> = {
        id: activeCustomer.id,
        status: 'cancelled',
        billing_end_date: exitDate,
      };

      setOptimisticCustomer({
        status: 'cancelled',
        billing_end_date: exitDate,
      });

      if (onSaveCustomer) {
        await onSaveCustomer(updated);
      } else {
        await saveCustomer(updated);
      }

      ActivityLogService.logAction(
        'Customers',
        'UPDATE',
        'Customer Subscription Cancelled',
        `Finalized cancellation for ${activeCustomer.full_name} (#${activeCustomer.customer_code}). Status set to Cancelled.`
      );

      setPaySuccessMsg(`✓ Subscription for ${activeCustomer.full_name} has been marked as Cancelled.`);
      setTimeout(() => setPaySuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Failed to finalize cancellation:', err);
      alert('Failed to finalize cancellation: ' + (err.message || 'Unknown error'));
    }
  };

  // Revoke notice and keep customer active
  const handleRevokeNotice = async () => {
    if (!activeCustomer) return;
    if (!window.confirm(`Revoke cancellation notice for "${activeCustomer.full_name}" and keep their subscription active?`)) return;

    try {
      const cleanedNotes = (activeCustomer.notes || '')
        .replace(/\[NOTICE:[^\]]+\]/g, '')
        .trim();

      const updated: Partial<Customer> = {
        id: activeCustomer.id,
        cancellation_date: undefined,
        cancellation_reason: undefined,
        cancellation_notice_date: undefined,
        notes: cleanedNotes,
      };

      setOptimisticCustomer({
        cancellation_date: undefined,
        cancellation_reason: undefined,
        cancellation_notice_date: undefined,
        notes: cleanedNotes,
      });

      if (onSaveCustomer) {
        await onSaveCustomer(updated);
      } else {
        await saveCustomer(updated);
      }

      ActivityLogService.logAction(
        'Customers',
        'UPDATE',
        'Cancellation Notice Revoked',
        `Cancellation notice revoked for ${activeCustomer.full_name} (#${activeCustomer.customer_code}). Customer remains active.`
      );

      setPaySuccessMsg(`✓ Cancellation notice revoked. ${activeCustomer.full_name} remains an active customer.`);
      setTimeout(() => setPaySuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Failed to revoke cancellation notice:', err);
      alert('Failed to revoke notice: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-[#0f172a] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#151c2c] via-[#1a233a] to-[#151c2c] border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Avatar Badge with Customer Code (Auto-sizing cleanly on single line) */}
            <div className="min-w-[64px] px-2.5 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-sm tracking-tight shadow-lg shrink-0 whitespace-nowrap">
              {activeCustomer.customer_code}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                  {activeCustomer.full_name}
                </h2>

                {/* Status Badge */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                    activeCustomer.status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : activeCustomer.status === 'trial'
                      ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                      : activeCustomer.status === 'paused'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : (activeCustomer.status === 'left' || activeCustomer.status === 'cancelled')
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {(activeCustomer.status === 'left' || activeCustomer.status === 'cancelled') ? 'cancelled' : activeCustomer.status}
                </span>

                {/* Payment Rating */}
                {activeCustomer.payment_rating && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      activeCustomer.payment_rating === 'Good'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        : activeCustomer.payment_rating === 'Late payer'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                    }`}
                  >
                    ⭐ {activeCustomer.payment_rating}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                <span className="font-mono text-amber-400 font-semibold">
                  ID: #{activeCustomer.customer_code}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>
                    {building?.name || activeCustomer.building_name_cache || 'Belrasheed Building'}
                    {activeCustomer.apartment_cache ? ` (Apt ${activeCustomer.apartment_cache})` : ''}
                  </span>
                </span>
                <span>•</span>
                <span className="text-slate-400">
                  Joined: {activeCustomer.joining_date || activeCustomer.billing_start_date || 'Oct 2026'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {!isReadOnly && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(activeCustomer);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-colors shadow-sm"
                title="Edit Profile"
              >
                <Edit className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Payment Success Notification Banner */}
        {paySuccessMsg && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between gap-2 animate-fadeIn shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{paySuccessMsg}</span>
            </div>
            <button
              onClick={() => setPaySuccessMsg(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scheduled Cancellation / Advance Notice Alert Banner */}
        {cancellationNotice && (
          <div className="mx-4 mt-3 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/30 border border-amber-500/40 shadow-xl relative overflow-hidden animate-fadeIn">
            {/* Top row: Alert title & countdown badge */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  <CalendarX className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-white tracking-tight">
                      Scheduled Cancellation in Progress
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-black tracking-wide border ${cancellationNotice.badge.bg} ${cancellationNotice.badge.textColor} ${cancellationNotice.badge.border} animate-pulse`}
                    >
                      {cancellationNotice.badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Customer requested to stop mess service on{' '}
                    <b className="text-amber-300 font-mono">{cancellationNotice.targetDateDisplay}</b>
                    {cancellationNotice.reason ? ` • Note: "${cancellationNotice.reason}"` : ''}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => sendCancellationWhatsApp(cancellationNotice)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/35 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  title="Send WhatsApp confirmation of exit date and settlement details"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Summary</span>
                </button>

                {!isReadOnly && (
                  <>
                    <button
                      type="button"
                      onClick={handleRevokeNotice}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                      title="Revoke cancellation notice and continue active service"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Revoke Notice</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFinalizeCancellation}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-900/30 transition-all cursor-pointer active:scale-95"
                      title="Immediately change status to Cancelled"
                    >
                      <UserMinus className="w-3.5 h-3.5 text-white" />
                      <span>Finalize Cancellation</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mid-Month Pro-Rata Settlement Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Notice Exit Date</div>
                <div className="text-xs font-mono font-black text-amber-300 mt-0.5">
                  {cancellationNotice.targetDateDisplay}
                </div>
                <div className="text-[10px] text-slate-500">
                  {cancellationNotice.daysRemaining >= 0
                    ? `${cancellationNotice.daysRemaining} days remaining`
                    : `${Math.abs(cancellationNotice.daysRemaining)} days overdue`}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Daily Meal Rate</div>
                <div className="text-xs font-mono font-black text-white mt-0.5">
                  {formatAED(cancellationNotice.proRata.dailyRate)} / day
                </div>
                <div className="text-[10px] text-slate-500">
                  Based on {formatAED(cancellationNotice.proRata.monthlyRate)} ÷ 30 days
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Active Days in Cycle</div>
                <div className="text-xs font-mono font-black text-sky-300 mt-0.5">
                  {cancellationNotice.proRata.activeDays} Days
                </div>
                <div className="text-[10px] text-slate-500">Served before exit</div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="text-[10px] uppercase font-black text-amber-400">Mid-Month Pro-Rata Due</div>
                <div className="text-sm font-mono font-black text-amber-300 mt-0.5">
                  {formatAED(cancellationNotice.proRata.proRataAmount)}
                </div>
                <div className="text-[10px] text-amber-400/80 font-medium">Partial cycle settlement</div>
              </div>
            </div>
          </div>
        )}

        {/* 4 Financial Highlight KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#0a0f1d] border-b border-slate-800/80">
          {/* Monthly Plan */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Monthly Plan</span>
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-base sm:text-lg font-black font-mono text-white mt-1">
                {formatAED(activeCustomer.monthly_rate)}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 truncate">
              {mealPlan?.name || 'Standard 3-Meal Subscription'}
            </div>
          </div>

          {/* Outstanding Balance & In-Place Add/Edit Due Button */}
          <div
            className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
              isOverdue
                ? 'bg-rose-500/10 border-rose-500/30'
                : 'bg-emerald-500/10 border-emerald-500/30'
            }`}
          >
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between">
                <span className={isOverdue ? 'text-rose-300' : 'text-emerald-300'}>
                  Outstanding Dues
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenDueModal('due')}
                    className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-amber-400 transition-colors"
                    title="Add or Edit Due Balance"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <AlertCircle
                    className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-400' : 'text-emerald-400'}`}
                  />
                </div>
              </div>
              <div
                className={`text-base sm:text-lg font-black font-mono mt-1 ${
                  isOverdue ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {formatAED(overdue)}
              </div>
              <div className="text-[10px] mt-0.5 text-slate-400">
                {isOverdue ? 'Payment overdue' : 'Account in good standing'}
              </div>
            </div>

            {/* Quick Actions: Add Due / Edit Due + View Bill + Pay Overdue */}
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => handleOpenDueModal('due')}
                  className="flex-1 min-w-[65px] flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                  title="Add or Edit Outstanding Due Balance"
                >
                  <Edit3 className="w-3 h-3 text-amber-400" />
                  <span>{overdue > 0 ? 'Edit Due' : 'Add Due'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleViewBill()}
                className="flex-1 min-w-[70px] flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                title="View itemized bill & monthly period breakdown"
              >
                <FileText className="w-3 h-3 text-amber-400" />
                <span>View Bill</span>
              </button>

              {!isReadOnly && isOverdue && (
                <button
                  type="button"
                  onClick={() => handleOpenPayModal(overdue)}
                  className="flex-1 min-w-[60px] flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  title="Pay overdue amount right here"
                >
                  <CreditCard className="w-3 h-3" />
                  <span>Pay</span>
                </button>
              )}
            </div>
          </div>

          {/* Payment Made Up To Date */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Paid Up To</span>
                <div className="flex items-center gap-1">
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleOpenDueModal('paid')}
                      className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-amber-400 transition-colors"
                      title="Edit Paid Date"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
              <div className="text-sm sm:text-base font-bold font-mono text-emerald-300 mt-1">
                {activeCustomer.payment_made_up_to_date || activeCustomer.billing_start_date || '31 Oct 2026'}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
              <span>Last verified settlement</span>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => handleOpenDueModal('paid')}
                  className="text-[10px] text-amber-400/80 hover:text-amber-300 hover:underline font-semibold cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Billed Up To Date */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Billed Up To</span>
                <div className="flex items-center gap-1">
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleOpenDueModal('billed')}
                      className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-amber-400 transition-colors"
                      title="Edit Due / Billed Date"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                </div>
              </div>
              <div className="text-sm sm:text-base font-bold font-mono text-slate-200 mt-1">
                {activeCustomer.billed_up_to_date || activeCustomer.billing_end_date || '31 Oct 2026'}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
              <span>Current billing cycle</span>
              <button
                type="button"
                onClick={() => handleOpenDueModal('billed')}
                className="text-[10px] text-amber-400/80 hover:text-amber-300 hover:underline font-semibold cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Approaching Due Date Reminder Banner */}
        {dueDateInfo && dueDateInfo.isApproaching && (
          <div className="mx-4 my-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                  <span>Payment Due Date Approaching</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40">
                    {dueDateInfo.statusLabel}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  The person is due on <b className="text-amber-300">{dueDateInfo.targetDueDateDisplay}</b> • Amount:{' '}
                  <b className="text-white font-mono">{formatAED(dueDateInfo.amountDue)}</b>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() =>
                  sendWhatsAppReminder(
                    activeCustomer,
                    dueDateInfo.targetDueDateDisplay,
                    dueDateInfo.daysRemaining,
                    dueDateInfo.amountDue
                  )
                }
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-colors shadow-sm"
                title="Send friendly due reminder on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Reminder</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenPayModal(dueDateInfo.amountDue)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Settle Now</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center px-4 bg-[#111827] border-b border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Profile & Logistics</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'invoices'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invoices</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300">
              {customerInvoices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'payments'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Payment Receipts</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300">
              {customerPayments.length}
            </span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: OVERVIEW & LOGISTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Personal & Contact Information Card */}
                <div className="bg-[#151c2c]/80 border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      Contact & Identification
                    </span>
                    <span className="font-mono text-xs text-amber-400 font-bold">
                      #{activeCustomer.customer_code}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Primary Phone */}
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                      <div>
                        <div className="text-[11px] text-slate-400">Primary Phone Number</div>
                        <div className="text-sm font-bold text-white font-mono mt-0.5">
                          {activeCustomer.phone || 'No phone recorded'}
                        </div>
                      </div>
                      {activeCustomer.phone && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleWhatsApp(activeCustomer.phone)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-semibold border border-emerald-500/30 transition-colors shadow-sm"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-400" />
                            <span>WhatsApp</span>
                          </button>
                          <a
                            href={`tel:${activeCustomer.phone}`}
                            className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-750 text-slate-200 transition-colors"
                            title="Call Phone"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Emergency Contact (SOS) */}
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25">
                      <div>
                        <div className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                          <span>🚨 Emergency Contact (SOS)</span>
                        </div>
                        <div className="text-sm font-black text-rose-200 font-mono mt-0.5">
                          {activeCustomer.emergency_contact || 'None registered'}
                        </div>
                      </div>
                      {activeCustomer.emergency_contact && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleWhatsApp(activeCustomer.emergency_contact)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors"
                            title="WhatsApp Emergency Contact"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`tel:${activeCustomer.emergency_contact}`}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/40 text-rose-200 font-bold border border-rose-500/50 transition-colors"
                            title="Call Emergency SOS"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call SOS</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        Email Address
                      </span>
                      <span className="text-slate-200 font-medium font-mono">
                        {activeCustomer.email || 'Not provided'}
                      </span>
                    </div>

                    {/* Account Type */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                        Account Type
                      </span>
                      <span className="text-slate-200 text-xs font-semibold">
                        {activeCustomer.managed_by === 'manager'
                          ? 'Manager'
                          : 'Admin'}
                      </span>
                    </div>

                    {/* Joining Date */}
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Customer Since / Joined
                      </span>
                      <span className="text-slate-200 font-mono font-medium">
                        {activeCustomer.joining_date || activeCustomer.billing_start_date || 'Oct 2026'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Accommodation & Delivery Logistics Card */}
                <div className="bg-[#151c2c]/80 border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-sky-400" />
                      Accommodation & Delivery Logistics
                    </span>
                    <span className="font-mono text-xs text-sky-400 font-bold">
                      Apt {activeCustomer.apartment_cache || 'N/A'}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Building Name */}
                    <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                      <div className="text-[11px] text-slate-400">Assigned Building & Area</div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                        <span>
                          {building?.name || activeCustomer.building_name_cache || 'Belrasheed Building'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{building?.area || building?.address || 'Karama, Dubai, UAE'}</span>
                      </div>
                    </div>

                    {/* Door Passcode & Delivery Time */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                        <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1">
                          <Key className="w-3 h-3 text-sky-400" />
                          <span>Door Passcode</span>
                        </div>
                        <div className="text-sm font-mono font-black text-sky-200 mt-1">
                          {activeCustomer.door_passcode ? `🔑 ${activeCustomer.door_passcode}` : 'No Passcode'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Delivery Window</span>
                        </div>
                        <div className="text-sm font-bold text-amber-200 mt-1 truncate">
                          {activeCustomer.delivery_time || 'Regular Schedule'}
                        </div>
                      </div>
                    </div>

                    {/* Apartment Number */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Room / Flat Number</span>
                      <span className="font-mono font-bold text-white">
                        {activeCustomer.apartment_cache || 'Not Specified'}
                      </span>
                    </div>

                    {/* Delivery Notes */}
                    {activeCustomer.notes && (
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px]">
                        <span className="text-slate-400 font-semibold">Delivery Instructions: </span>
                        <span className="text-slate-200 italic">{activeCustomer.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Meal Subscription & Dietary Preferences */}
              <div className="bg-[#151c2c]/80 border border-slate-800 rounded-xl p-4 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-400" />
                    Meal Subscription & Food Preferences
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {formatAED(activeCustomer.monthly_rate)} / month
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Breakfast */}
                  <div
                    className={`p-3 rounded-xl border text-center transition-all ${
                      activeCustomer.has_breakfast
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="text-xl">☀️</div>
                    <div className="text-xs font-black uppercase tracking-wider mt-1">Breakfast</div>
                    <div className="text-[11px] font-semibold mt-0.5">
                      {activeCustomer.has_breakfast ? '✓ INCLUDED' : '✕ Not included'}
                    </div>
                  </div>

                  {/* Lunch */}
                  <div
                    className={`p-3 rounded-xl border text-center transition-all ${
                      activeCustomer.has_lunch
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="text-xl">🍱</div>
                    <div className="text-xs font-black uppercase tracking-wider mt-1">Lunch</div>
                    <div className="text-[11px] font-semibold mt-0.5">
                      {activeCustomer.has_lunch ? '✓ INCLUDED' : '✕ Not included'}
                    </div>
                  </div>

                  {/* Dinner */}
                  <div
                    className={`p-3 rounded-xl border text-center transition-all ${
                      activeCustomer.has_dinner
                        ? 'bg-blue-500/15 border-blue-500/40 text-blue-200'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="text-xl">🍲</div>
                    <div className="text-xs font-black uppercase tracking-wider mt-1">Dinner</div>
                    <div className="text-[11px] font-semibold mt-0.5">
                      {activeCustomer.has_dinner ? '✓ INCLUDED' : '✕ Not included'}
                    </div>
                  </div>
                </div>

                {/* Dietary Preferences Card */}
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                    <span>🥗 Dietary Preferences & Special Cooking Notes</span>
                  </div>
                  <div className="text-xs text-slate-200 font-medium leading-relaxed whitespace-pre-line">
                    {activeCustomer.dietary_preferences || (
                      <span className="text-slate-500 italic">
                        Standard Karama Mess daily menu (No special dietary restrictions specified)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVOICES & BILLING HISTORY */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Billing & Invoices</h3>
                  <p className="text-xs text-slate-400">
                    Historical billing records and invoices generated for {activeCustomer.full_name}
                  </p>
                </div>
                <div className="font-mono text-xs text-amber-400 font-bold">
                  {customerInvoices.length} Invoices Found
                </div>
              </div>

              {customerInvoices.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-800/30 border border-slate-800 text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                  <div className="text-xs font-semibold">No invoices generated yet for this customer.</div>
                  <p className="text-[11px] text-slate-500">
                    Monthly invoices can be created from the Billing section.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#151c2c]/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#111827] text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Invoice #</th>
                        <th className="py-2.5 px-3 font-semibold">Issue Date</th>
                        <th className="py-2.5 px-3 font-semibold">Billing Period</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Total (AED)</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Paid (AED)</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Balance</th>
                        <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {customerInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-400">
                            {inv.invoice_number}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">
                            {inv.issue_date}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                            {inv.period_start} to {inv.period_end}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-white text-right">
                            {formatAED(inv.total_amount)}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400 text-right">
                            {formatAED(inv.paid_amount)}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-black text-right">
                            <span
                              className={
                                inv.balance_amount > 0 ? 'text-rose-400' : 'text-emerald-400'
                              }
                            >
                              {formatAED(inv.balance_amount)}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                inv.status === 'paid'
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : inv.status === 'partially_paid'
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {inv.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedInvoice(inv)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-[10px] shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                                title="View detailed tax invoice & multi-period breakdown"
                              >
                                <FileText className="w-3 h-3 text-amber-400" />
                                <span>View Bill</span>
                              </button>
                              {!isReadOnly && inv.balance_amount > 0 ? (
                                <button
                                  onClick={() => handleOpenPayModal(inv.balance_amount, inv.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow-sm transition-all active:scale-[0.98]"
                                  title="Pay this invoice now on profile"
                                >
                                  <CreditCard className="w-3 h-3" />
                                  <span>Pay {formatAED(inv.balance_amount)}</span>
                                </button>
                              ) : inv.balance_amount <= 0 ? (
                                <span className="text-[10px] text-emerald-400 font-semibold px-1">✓ Settled</span>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAYMENT RECEIPTS HISTORY */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Payment Receipts</h3>
                  <p className="text-xs text-slate-400">
                    All payment records and collections for {activeCustomer.full_name}
                  </p>
                </div>
                <div className="font-mono text-xs text-emerald-400 font-bold">
                  {customerPayments.length} Payments Found
                </div>
              </div>

              {customerPayments.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-800/30 border border-slate-800 text-slate-400 space-y-2">
                  <Receipt className="w-8 h-8 text-slate-500 mx-auto" />
                  <div className="text-xs font-semibold">No payment receipts recorded yet for this customer.</div>
                  <p className="text-[11px] text-slate-500">
                    Use the "Record Payment" button to log cash or transfer collections.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#151c2c]/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#111827] text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Receipt #</th>
                        <th className="py-2.5 px-3 font-semibold">Payment Date</th>
                        <th className="py-2.5 px-3 font-semibold">Method</th>
                        <th className="py-2.5 px-3 font-semibold">Reference</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Amount (AED)</th>
                        <th className="py-2.5 px-3 font-semibold">Remarks / Notes</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {customerPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                            {p.payment_number}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">
                            {p.payment_date}
                          </td>
                          <td className="py-2.5 px-3 uppercase font-semibold text-slate-300 text-[11px]">
                            {p.payment_method.replace('_', ' ')}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                            {p.reference_number || '-'}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-black text-emerald-300 text-right">
                            {formatAED(p.amount)}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 text-[11px] italic">
                            {p.notes || '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedReceipt(p)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer"
                                title="Print Official Receipt"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Receipt</span>
                              </button>
                              {activeCustomer.phone && (
                                <button
                                  type="button"
                                  onClick={() => handleSendWhatsAppPaymentReceipt(p)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                                  title="Send Receipt on WhatsApp"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="px-5 py-3.5 bg-[#111827] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quick Copy & External actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/70 transition-colors shadow-sm"
              title="Copy Profile Summary for WhatsApp/Driver"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy Profile Summary</span>
                </>
              )}
            </button>

            {activeCustomer.phone && (
              <button
                onClick={() => handleWhatsApp(activeCustomer.phone)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Record Payment Button (Opens In-Place Pay Modal on Profile) */}
            {!isReadOnly && (
              <>
                <button
                  onClick={() => handleOpenPayModal(overdue > 0 ? overdue : activeCustomer.monthly_rate)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
                  title="Pay Bill / Record Payment directly here"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Record Payment</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onEdit(activeCustomer);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Customer</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* IN-PLACE RECORD PAYMENT & SETTLE BILL DIALOG MODAL   */}
        {/* ---------------------------------------------------- */}
        {isPayModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div
              className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Record Payment & Settle Bill</h3>
                    <p className="text-xs text-slate-400">
                      Customer: <span className="text-white font-bold">{activeCustomer.full_name}</span> (#{activeCustomer.customer_code})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleConfirmPayment} className="p-5 space-y-4">
                {/* Dues Alert Banner */}
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    overdue > 0
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  <div className="text-xs">
                    <span className="font-bold">Current Outstanding Balance:</span>{' '}
                    <span className="font-mono text-sm font-black ml-1">
                      {formatAED(overdue)}
                    </span>
                  </div>
                  {overdue > 0 && (
                    <button
                      type="button"
                      onClick={() => setPayAmount(overdue)}
                      className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow-sm transition-all"
                    >
                      Fill Overdue ({formatAED(overdue)})
                    </button>
                  )}
                </div>

                {/* Amount and Quick Presets */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Payment Amount (AED) <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      {overdue > 0 && (
                        <button
                          type="button"
                          onClick={() => setPayAmount(overdue)}
                          className="text-[10px] text-rose-300 hover:text-rose-200 underline font-semibold"
                        >
                          Overdue ({formatAED(overdue)})
                        </button>
                      )}
                      <span className="text-slate-600">•</span>
                      <button
                        type="button"
                        onClick={() => setPayAmount(getMonthlySubscriptionRate(activeCustomer).effectiveRate)}
                        className="text-[10px] text-amber-400 hover:text-amber-300 underline font-semibold"
                      >
                        Plan ({formatAED(getMonthlySubscriptionRate(activeCustomer).effectiveRate)})
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-mono font-bold text-slate-400">
                      AED
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={payAmount || ''}
                      onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                      required
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Payment Date & Method Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Payment Date <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={payDate}
                      onChange={(e) => setPayDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Payment Method <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="cash">💵 Cash (Mess Counter / Handover)</option>
                      <option value="bank_transfer">🏦 Bank Transfer</option>
                      <option value="card">💳 Card / POS</option>
                      <option value="cheque">📝 Cheque</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Invoice Allocation */}
                {customerInvoices.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Settle Specific Invoice
                    </label>
                    <select
                      value={payInvoiceId}
                      onChange={(e) => setPayInvoiceId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                    >
                      <option value="">Auto-Apply to Open / Overdue Invoices</option>
                      {customerInvoices.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.invoice_number} — Due: {formatAED(inv.balance_amount)} ({inv.status.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Transaction Reference & Remarks */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Receipt / Reference Number
                  </label>
                  <input
                    type="text"
                    value={payReference}
                    onChange={(e) => setPayReference(e.target.value)}
                    placeholder="e.g. REC-101-CASH"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Remarks / Notes</label>
                  <input
                    type="text"
                    value={payNotes}
                    onChange={(e) => setPayNotes(e.target.value)}
                    placeholder="e.g. Settled October overdue bill in cash"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Dialog Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPayModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPay}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmittingPay ? 'Recording...' : `Confirm & Settle ${formatAED(payAmount)}`}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* In-Modal Add / Edit Due Balance Dialog */}
        {isDueModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#151c2c] border border-amber-500/40 rounded-2xl w-full max-w-lg p-5 shadow-2xl shadow-black/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Add / Edit Outstanding Due</h3>
                    <p className="text-[11px] text-slate-400">
                      {activeCustomer.full_name} <span className="font-mono text-amber-400 font-bold">({activeCustomer.customer_code})</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDueModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveDue} className="space-y-3.5">
                {/* Due Amount Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>Outstanding Due Amount (AED) *</span>
                    <span className="text-[10px] text-slate-400">Current: {formatAED(activeCustomer.total_overdue || 0)}</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-mono">
                      AED
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={dueAmountInput}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setDueAmountInput(val);
                        const standardMonthRate = getMonthlySubscriptionRate(activeCustomer).effectiveRate;
                        if (val === 0) {
                          setDueRatingInput('Good');
                        } else if (val > standardMonthRate) {
                          setDueRatingInput('Bad');
                        } else {
                          setDueRatingInput('Late payer');
                        }
                      }}
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDueAmountInput(0);
                        setDueRatingInput('Good');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      Clear Due (AED 0)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDueAmountInput(100);
                        setDueRatingInput('Late payer');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono font-semibold transition-colors cursor-pointer"
                    >
                      +AED 100
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const standardMonthRate = getMonthlySubscriptionRate(activeCustomer).effectiveRate;
                        setDueAmountInput(standardMonthRate);
                        setDueRatingInput('Late payer');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono font-semibold transition-colors cursor-pointer"
                    >
                      Full Month ({formatAED(getMonthlySubscriptionRate(activeCustomer).effectiveRate)})
                    </button>
                  </div>
                </div>

                {/* Due Date & Paid Up To Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Billed Up To Date (Due Target)</label>
                    <input
                      type="date"
                      value={billedUpToInput}
                      onChange={(e) => setBilledUpToInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Paid Up To Date</label>
                    <input
                      type="date"
                      value={paymentMadeUpToInput}
                      onChange={(e) => setPaymentMadeUpToInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Payment Rating */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Payment Standing Rating</label>
                  <select
                    value={dueRatingInput}
                    onChange={(e) => setDueRatingInput(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-medium"
                  >
                    <option value="Good">⭐ Good (Account in good standing)</option>
                    <option value="Late payer">⚠️ Late payer (Pending / delayed settlement)</option>
                    <option value="Bad">⛔ Bad (Critical overdue / default)</option>
                  </select>
                </div>

                {/* Reason / Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Adjustment Note / Reason</label>
                  <input
                    type="text"
                    value={dueReasonInput}
                    onChange={(e) => setDueReasonInput(e.target.value)}
                    placeholder="e.g. Opening balance brought forward, previous month unpaid meals"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDueModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingDue}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>{isSavingDue ? 'Saving...' : `Save Due (${formatAED(dueAmountInput)})`}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Official Printable Receipt Preview Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl text-white space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-xl font-black text-white">Official Payment Receipt</h3>
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                    Karama Mess &amp; Catering - Dubai, UAE
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                  <span className="text-xs text-slate-400 font-bold uppercase">Receipt Number</span>
                  <span className="font-mono text-base font-black text-amber-400">
                    {selectedReceipt.payment_number || 'REC-SETTLED'}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                  <span className="text-xs text-slate-400 font-bold uppercase">Payment Date</span>
                  <span className="text-sm font-bold font-mono text-slate-200">
                    {selectedReceipt.payment_date}
                  </span>
                </div>

                <div className="pb-2.5 border-b border-slate-800">
                  <span className="text-xs text-slate-400 font-bold uppercase block mb-1">
                    Received From
                  </span>
                  <div className="text-base font-black text-white">{activeCustomer.full_name}</div>
                  <div className="text-xs text-slate-300 font-semibold mt-0.5">
                    #{activeCustomer.customer_code} • {building?.name || activeCustomer.building_name_cache || 'Karama Central'}
                    {activeCustomer.apartment_cache ? `, Apt ${activeCustomer.apartment_cache}` : ''}
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                  <span className="text-xs text-slate-400 font-bold uppercase">Payment Method</span>
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {selectedReceipt.payment_method.replace('_', ' ')}
                  </span>
                </div>

                {selectedReceipt.reference_number && (
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-bold uppercase">Reference / Cheque</span>
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {selectedReceipt.reference_number}
                    </span>
                  </div>
                )}

                {selectedReceipt.notes && (
                  <div className="pb-2.5 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Remarks</span>
                    <div className="text-xs text-slate-300 font-medium">{selectedReceipt.notes}</div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-slate-300 font-black uppercase">Amount Cleared</span>
                  <span className="font-mono text-2xl font-black text-emerald-400">
                    {formatAED(selectedReceipt.amount)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer"
                >
                  Close
                </button>
                <div className="flex gap-2">
                  {activeCustomer.phone && (
                    <button
                      type="button"
                      onClick={() => handleSendWhatsAppPaymentReceipt(selectedReceipt)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Printable Multi-Period Tax Invoice / Statement Modal */}
        {selectedInvoice && (
          <PrintableInvoice
            invoice={selectedInvoice}
            customer={activeCustomer}
            allCustomerInvoices={customerInvoices}
            settings={OfflineStorage.getSettings()}
            onClose={() => setSelectedInvoice(null)}
          />
        )}
      </div>
    </div>
  );
};
