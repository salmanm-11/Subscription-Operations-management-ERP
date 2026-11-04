import { describe, it, expect, beforeEach } from 'vitest';
import { OfflineStorage } from '../src/api/offlineStorage';
import { Customer, Invoice } from '../src/types';
import { calculateDailyMealRate } from '../src/utils/cancellationService';

// Mock localStorage for Vitest Node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Cumulative Overdue & Multi-Period Invoicing', () => {
  beforeEach(() => {
    localStorage.clear();
    OfflineStorage.init();
  });

  describe('Pricing Rules Verification', () => {
    it('calculates exact daily rate for 1 meal/day as 6.00 AED', () => {
      expect(calculateDailyMealRate(180, { has_breakfast: true, has_lunch: false, has_dinner: false })).toBe(6.00);
      expect(calculateDailyMealRate(180, { has_breakfast: false, has_lunch: true, has_dinner: false })).toBe(6.00);
      expect(calculateDailyMealRate(180, { has_breakfast: false, has_lunch: false, has_dinner: true })).toBe(6.00);
    });

    it('calculates exact daily rate for 2 meals/day as 10.00 AED', () => {
      expect(calculateDailyMealRate(300, { has_breakfast: true, has_lunch: true, has_dinner: false })).toBe(10.00);
      expect(calculateDailyMealRate(300, { has_breakfast: false, has_lunch: true, has_dinner: true })).toBe(10.00);
      expect(calculateDailyMealRate(300, { has_breakfast: true, has_lunch: false, has_dinner: true })).toBe(10.00);
    });

    it('calculates daily rate for 3 meals/day: 12.67 for 30-day month and 13.00 for 31-day month', () => {
      // 30 day month
      expect(calculateDailyMealRate(380, { has_breakfast: true, has_lunch: true, has_dinner: true }, 30)).toBe(12.67);
      // 31 day month
      expect(calculateDailyMealRate(380, { has_breakfast: true, has_lunch: true, has_dinner: true }, 31)).toBe(13.00);
    });
  });

  describe('Cumulative Invoice Generation', () => {
    it('accumulates prior due with new month subscription fee', () => {
      const customer: Customer = {
        id: 'cust-cumul-1',
        business_id: 'default',
        customer_code: 'KM-TEST-01',
        full_name: 'Test Cumulative Customer',
        phone: '0501234567',
        status: 'active',
        monthly_rate: 380,
        total_overdue: 30, // Unpaid 30 AED from prior month
        joining_date: '2026-10-01',
        billing_start_date: '2026-10-01',
        billing_end_date: '2026-10-31',
        billed_up_to_date: '2026-10-31',
        has_breakfast: true,
        has_lunch: true,
        has_dinner: true,
        created_at: '2026-10-01T00:00:00Z',
        updated_at: '2026-10-01T00:00:00Z',
      };

      // Add prior month invoice
      const prevInvoice: Invoice = {
        id: 'inv-prev-1',
        business_id: 'default',
        invoice_number: 'INV-1001',
        customer_id: customer.id,
        customer_name_cache: customer.full_name,
        issue_date: '2026-10-01',
        due_date: '2026-10-10',
        period_start: '2026-10-01',
        period_end: '2026-10-31',
        subtotal: 380,
        discount_amount: 0,
        tax_amount: 0,
        total_amount: 380,
        paid_amount: 350,
        balance_amount: 30, // 30 AED remaining unpaid
        status: 'partially_paid',
        notes: 'October mess subscription',
        created_at: '2026-10-01T00:00:00Z',
      };

      OfflineStorage.saveCustomer(customer);
      OfflineStorage.setInvoices([prevInvoice]);

      // Auto-generate missing invoices for current cycle
      const generated = OfflineStorage.autoGenerateMissingInvoices([customer]);

      expect(generated.length).toBe(1);
      const newInv = generated[0];

      // New invoice must combine the 30 AED overdue + 380 AED current fee = 410 AED
      expect(newInv.subtotal).toBe(380);
      expect(newInv.total_amount).toBe(410);
      expect(newInv.balance_amount).toBe(410);
      expect(newInv.notes).toContain('[ARREARS: AED 30.00');
      expect(newInv.notes).toContain('Period: 2026-10-01 to 2026-10-31');

      // Customer overdue in storage must now also be updated to 410
      const updatedCust = OfflineStorage.getCustomers().find((c) => c.id === customer.id);
      expect(updatedCust).toBeDefined();
      expect(updatedCust?.total_overdue).toBe(410);
    });

    it('handles payment clearing both previous arrears and part of new cycle', () => {
      const customer: Customer = {
        id: 'cust-cumul-2',
        business_id: 'default',
        customer_code: 'KM-TEST-02',
        full_name: 'Test Payment Customer',
        phone: '0507654321',
        status: 'active',
        monthly_rate: 380,
        total_overdue: 410,
        joining_date: '2026-10-01',
        billing_start_date: '2026-10-01',
        has_breakfast: true,
        has_lunch: true,
        has_dinner: true,
        created_at: '2026-10-01T00:00:00Z',
        updated_at: '2026-10-01T00:00:00Z',
      };
      OfflineStorage.saveCustomer(customer);

      // Record a payment of 200 AED
      OfflineStorage.recordPayment({
        customer_id: customer.id,
        amount: 200,
        payment_date: '2026-11-05',
        payment_method: 'cash',
      });

      const updatedCust = OfflineStorage.getCustomers().find((c) => c.id === customer.id);
      // 410 - 200 = 210 AED remaining overdue
      expect(updatedCust?.total_overdue).toBe(210);
    });
  });
});
