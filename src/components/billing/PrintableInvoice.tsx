import React, { useMemo } from 'react';
import { X, Printer, Pencil, Trash2 } from 'lucide-react';
import { Invoice, Customer, BusinessSettings } from '../../types';
import { formatAED } from '../../utils/currency';

interface PrintableInvoiceProps {
  invoice: Invoice;
  customer?: Customer;
  allCustomerInvoices?: Invoice[];
  settings: BusinessSettings;
  onClose: () => void;
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (id: string) => void;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({
  invoice,
  customer,
  allCustomerInvoices = [],
  settings,
  onClose,
  onEdit,
  onDelete,
}) => {
  const activeCustomer = customer || invoice.customer;
  const handlePrint = () => {
    window.print();
  };

  // Compute period-by-period breakdown
  const lineItems = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      subtitle?: string;
      period: string;
      rate: number;
      amount: number;
      isArrears?: boolean;
    }> = [];

    const baseMonthly = activeCustomer?.monthly_rate || 380;

    // Check for embedded arrears in notes: e.g. [ARREARS: AED 50.00 | Period: 2026-10-01 to 2026-10-31]
    let parsedArrearsAmount = 0;
    let parsedArrearsPeriod = '';
    if (invoice.notes && invoice.notes.includes('[ARREARS:')) {
      const match = invoice.notes.match(/\[ARREARS:\s*AED?\s*([\d.]+)(?:\s*\|\s*Period:\s*([^\]]+))?\]/i);
      if (match) {
        parsedArrearsAmount = parseFloat(match[1]) || 0;
        parsedArrearsPeriod = (match[2] || '').trim();
      }
    }

    // Check if other unpaid invoices exist for this customer from prior billing periods
    const priorUnpaid = (allCustomerInvoices || [])
      .filter((i) => i.id !== invoice.id && (i.customer_id === invoice.customer_id || (activeCustomer && i.customer_id === activeCustomer.id)))
      .filter((i) => (i.balance_amount || 0) > 0 && (i.period_start || '') <= (invoice.period_start || ''))
      .sort((a, b) => (a.period_start || '').localeCompare(b.period_start || ''));

    if (priorUnpaid.length > 0) {
      priorUnpaid.forEach((prev) => {
        items.push({
          id: prev.id,
          title: `Previous Unpaid Balance (Bill #${prev.invoice_number})`,
          subtitle: `Unpaid mess charges carried forward from previous cycle`,
          period: `${prev.period_start} to ${prev.period_end}`,
          rate: prev.balance_amount,
          amount: prev.balance_amount,
          isArrears: true,
        });
      });

      items.push({
        id: invoice.id,
        title: 'Monthly Mess Subscription Package',
        subtitle: `Current cycle meal delivery (Karama, Dubai)`,
        period: `${invoice.period_start} to ${invoice.period_end}`,
        rate: invoice.subtotal || invoice.total_amount,
        amount: invoice.subtotal || invoice.total_amount,
        isArrears: false,
      });
    } else if (parsedArrearsAmount > 0) {
      items.push({
        id: 'arrears-note',
        title: 'Previous Balance Carried Forward',
        subtitle: 'Unpaid mess dues from previous billing period',
        period: parsedArrearsPeriod || 'Previous Cycle',
        rate: parsedArrearsAmount,
        amount: parsedArrearsAmount,
        isArrears: true,
      });

      const currentFee = Math.max(0, (invoice.total_amount || 0) - parsedArrearsAmount);
      items.push({
        id: invoice.id,
        title: 'Monthly Mess Subscription Package',
        subtitle: 'Current cycle meal delivery (Karama, Dubai)',
        period: `${invoice.period_start} to ${invoice.period_end}`,
        rate: currentFee || baseMonthly,
        amount: currentFee || baseMonthly,
        isArrears: false,
      });
    } else if (invoice.total_amount > baseMonthly && (invoice.total_amount - baseMonthly) >= 5) {
      const arrearsAmount = invoice.total_amount - baseMonthly;
      items.push({
        id: 'arrears-diff',
        title: 'Previous Balance Carried Forward',
        subtitle: 'Unpaid dues from previous billing period',
        period: 'Previous Cycle',
        rate: arrearsAmount,
        amount: arrearsAmount,
        isArrears: true,
      });

      items.push({
        id: invoice.id,
        title: 'Monthly Mess Subscription Package',
        subtitle: 'Current cycle meal delivery (Karama, Dubai)',
        period: `${invoice.period_start} to ${invoice.period_end}`,
        rate: baseMonthly,
        amount: baseMonthly,
        isArrears: false,
      });
    } else {
      items.push({
        id: invoice.id,
        title: 'Monthly Mess Subscription Package',
        subtitle: 'Daily delivery of prepared tiffin meals (Karama, Dubai)',
        period: `${invoice.period_start} to ${invoice.period_end}`,
        rate: invoice.subtotal || invoice.total_amount,
        amount: invoice.subtotal || invoice.total_amount,
        isArrears: false,
      });
    }

    return items;
  }, [invoice, activeCustomer, allCustomerInvoices]);

  const itemsTotal = useMemo(() => {
    return lineItems.reduce((acc, it) => acc + it.amount, 0);
  }, [lineItems]);

  const grandTotal = Math.max(invoice.total_amount, itemsTotal);
  const grandBalance = Math.max(0, grandTotal - (invoice.paid_amount || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl p-8 relative print:p-0 print:shadow-none print:max-w-none print:w-full print:rounded-none">
        {/* Screen Action Bar */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 print:hidden">
          <div className="text-sm font-bold text-slate-600">Tax Invoice & Mess Bill (AED)</div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(invoice);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs border border-slate-300 transition-colors cursor-pointer"
                title="Edit this invoice"
              >
                <Pencil className="w-3.5 h-3.5 text-amber-600" />
                <span>Edit</span>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete invoice ${invoice.invoice_number}?`)) {
                    onClose();
                    onDelete(invoice.id);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
                title="Delete this invoice"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="space-y-6 text-xs text-slate-800 font-sans">
          {/* Business Header */}
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                KARAMA MESS &amp; CATERING
              </h1>
              <p className="text-xs text-slate-600 font-medium tracking-widest uppercase mt-0.5">
                Good Food. Happy People.
              </p>
              <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
                <p>{settings.address || 'Al Karama, Dubai, United Arab Emirates'}</p>
                <p>Phone: {settings.phone || '+971 50 123 4567'} | Email: {settings.email || 'billing@karamamess.ae'}</p>
                {settings.tax_number && <p className="font-semibold text-slate-700">TRN / Tax ID: {settings.tax_number}</p>}
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block bg-slate-100 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                INVOICE
              </div>
              <div className="text-base font-extrabold text-slate-900 font-mono">
                {invoice.invoice_number}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Date: <b>{invoice.issue_date}</b>
              </div>
              <div className="text-[11px] text-slate-500">
                Due Date: <b>{invoice.due_date}</b>
              </div>
            </div>
          </div>

          {/* Bill To & Billing Period */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                BILL TO CUSTOMER
              </div>
              <div className="text-base font-black text-slate-900">{activeCustomer?.full_name || invoice.customer_name_cache || 'Customer'}</div>
              <div className="text-xs text-slate-600 mt-0.5">
                {activeCustomer?.building_name_cache || invoice.building_cache || 'Building'} - Apt {activeCustomer?.apartment_cache || 'N/A'}
              </div>
              {activeCustomer?.phone && (
                <div className="text-xs text-slate-600 mt-0.5">Tel: {activeCustomer.phone}</div>
              )}
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                SUBSCRIPTION BILLING PERIOD
              </div>
              <div className="text-xs font-semibold text-slate-800">
                {lineItems.length > 1 ? (
                  <span>
                    Multiple Periods ({lineItems[0].period.split(' to ')[0]} to {invoice.period_end})
                  </span>
                ) : (
                  <span>{invoice.period_start} to {invoice.period_end}</span>
                )}
              </div>
              <div className="mt-2 inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border">
                Status: {invoice.status}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">Billing Period</th>
                <th className="py-2.5 px-3 text-right">Rate</th>
                <th className="py-2.5 px-3 text-right">Amount (AED)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lineItems.map((item) => (
                <tr key={item.id} className={item.isArrears ? 'bg-amber-50/60' : ''}>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                      {item.isArrears && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-800 border border-amber-300">
                          Previous Due
                        </span>
                      )}
                      <span>{item.title}</span>
                    </div>
                    {item.subtitle && (
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.subtitle}</div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-700 font-mono text-[11px] whitespace-nowrap">
                    {item.period}
                  </td>
                  <td className="py-3 px-3 text-right font-medium">{formatAED(item.rate)}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">{formatAED(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Totals */}
          <div className="flex justify-end pt-2">
            <div className="w-72 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (All Periods):</span>
                <span className="font-semibold text-slate-900">{formatAED(grandTotal)}</span>
              </div>
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span>- {formatAED(invoice.discount_amount)}</span>
                </div>
              )}
              {invoice.tax_amount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>VAT (5%):</span>
                  <span>{formatAED(invoice.tax_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t">
                <span>Total Amount Payable:</span>
                <span className="text-amber-600 font-mono">{formatAED(grandTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-semibold text-emerald-600 font-mono">{formatAED(invoice.paid_amount)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1.5 border-t">
                <span>Total Balance Due:</span>
                <span className={`font-mono ${grandBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatAED(grandBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Terms & Instructions */}
          <div className="pt-6 border-t text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">Payment Instructions:</p>
            <p>Please pay via Cash or Bank Transfer to our authorized mess coordinator.</p>
            <p>All fees are denominated in United Arab Emirates Dirhams (AED).</p>
          </div>

          {/* Signatures */}
          <div className="pt-10 flex justify-between text-[11px] text-slate-500">
            <div className="border-t border-slate-300 pt-1 w-44 text-center">
              Customer Acknowledgement
            </div>
            <div className="border-t border-slate-300 pt-1 w-44 text-center">
              Authorized Signature &amp; Stamp
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
