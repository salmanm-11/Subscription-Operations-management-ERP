import { describe, it, expect } from 'vitest';
import { roundCurrency, addCurrency, subtractCurrency } from '../src/utils/currency';
import { OfflineStorage } from '../src/api/offlineStorage';
import { Customer } from '../src/types';

describe('Customer Billing & Payment Calculations', () => {
  it('correctly calculates invoice totals with discounts and tax', () => {
    const subtotal = 380.00;
    const discount = 30.00;
    const discounted = subtractCurrency(subtotal, discount); // 350.00
    const taxRate = 0.05; // UAE 5% VAT
    const tax = roundCurrency(discounted * taxRate); // 17.50
    const total = addCurrency(discounted, tax); // 367.50

    expect(discounted).toBe(350.00);
    expect(tax).toBe(17.50);
    expect(total).toBe(367.50);
  });

  it('correctly handles partial payment deductions and balance updates', () => {
    const totalDue = 380.00;
    const firstPayment = 150.00;
    const balanceAfterP1 = subtractCurrency(totalDue, firstPayment);
    expect(balanceAfterP1).toBe(230.00);

    const secondPayment = 230.00;
    const finalBalance = subtractCurrency(balanceAfterP1, secondPayment);
    expect(finalBalance).toBe(0.00);
  });

  it('determines invoice status accurately based on balance and payments', () => {
    function computeStatus(total: number, paid: number): string {
      if (paid >= total) return 'paid';
      if (paid > 0) return 'partially_paid';
      return 'issued';
    }

    expect(computeStatus(380, 0)).toBe('issued');
    expect(computeStatus(380, 150)).toBe('partially_paid');
    expect(computeStatus(380, 380)).toBe('paid');
    expect(computeStatus(380, 400)).toBe('paid');
  });

  it('settles customer overdue balance and updates rating upon recording payment', () => {
    if (typeof localStorage === 'undefined') {
      const storage: Record<string, string> = {
        karama_data_version: 'karama_clean_production_v10',
      };
      (globalThis as any).localStorage = {
        getItem: (k: string) => storage[k] || null,
        setItem: (k: string, v: string) => { storage[k] = v; },
        removeItem: (k: string) => { delete storage[k]; },
        clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
      };
    } else {
      localStorage.setItem('karama_data_version', 'karama_clean_production_v10');
    }
    OfflineStorage.init();

    const mockCustomer: Customer = {
      id: 'cust-overdue-1',
      business_id: 'biz-1',
      customer_code: 'CUST-061',
      full_name: 'Ajesh',
      monthly_rate: 380,
      total_overdue: 394,
      payment_rating: 'Bad',
      status: 'active',
      joining_date: '2026-10-01',
      has_breakfast: true,
      has_lunch: true,
      has_dinner: true,
      billing_start_date: '2026-10-01',
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
    };

    OfflineStorage.setCustomers([mockCustomer]);

    // Record payment settling the 394 AED due
    OfflineStorage.recordPayment({
      customer_id: 'cust-overdue-1',
      amount: 394,
      payment_date: '2026-11-01',
      payment_method: 'cash',
    });

    const updated = OfflineStorage.getCustomers().find((c) => c.id === 'cust-overdue-1');
    expect(updated).toBeDefined();
    expect(updated?.total_overdue).toBe(0);
    expect(updated?.payment_rating).toBe('Good');
    expect(updated?.payment_made_up_to_date).toBe('2026-11-01');
  });

  it('can auto-generate, edit, and delete invoices', () => {
    const cust1: Customer = {
      id: 'cust-auto-1',
      business_id: 'biz-1',
      customer_code: 'CUST-080',
      full_name: 'Fayas Kareem',
      monthly_rate: 380,
      has_breakfast: true,
      has_lunch: true,
      has_dinner: true,
      total_overdue: 0,
      status: 'active',
      joining_date: '2026-11-01',
      billing_start_date: '2026-11-01',
      billing_end_date: '2026-11-30',
      created_at: '2026-11-01T00:00:00Z',
      updated_at: '2026-11-01T00:00:00Z',
    };

    OfflineStorage.setCustomers([cust1]);
    OfflineStorage.setInvoices([]);

    // 1. Auto generate missing invoice
    const generated = OfflineStorage.autoGenerateMissingInvoices([cust1]);
    expect(generated.length).toBe(1);
    expect(generated[0].customer_id).toBe('cust-auto-1');
    expect(generated[0].total_amount).toBe(380);

    const storedInvoices = OfflineStorage.getInvoices();
    expect(storedInvoices.some((i) => i.id === generated[0].id)).toBe(true);

    // 2. Edit the invoice
    const edited = OfflineStorage.saveInvoice({
      id: generated[0].id,
      total_amount: 400,
      paid_amount: 100,
      balance_amount: 300,
      status: 'partially_paid',
    });
    expect(edited.total_amount).toBe(400);
    expect(edited.paid_amount).toBe(100);
    expect(edited.balance_amount).toBe(300);
    expect(edited.status).toBe('partially_paid');

    const verifiedEdit = OfflineStorage.getInvoices().find((i) => i.id === generated[0].id);
    expect(verifiedEdit?.total_amount).toBe(400);
    expect(verifiedEdit?.status).toBe('partially_paid');

    // 3. Delete the invoice
    const deleted = OfflineStorage.deleteInvoice(generated[0].id);
    expect(deleted).toBe(true);

    const verifiedDelete = OfflineStorage.getInvoices().find((i) => i.id === generated[0].id);
    expect(verifiedDelete).toBeUndefined();
  });
});
