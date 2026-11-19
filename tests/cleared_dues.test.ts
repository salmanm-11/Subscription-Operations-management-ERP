import { describe, it, expect, beforeEach } from 'vitest';
import { Customer, Payment } from '../src/types';
import { OfflineStorage } from '../src/api/offlineStorage';

describe('Cleared Dues & Settlement History System', () => {
  beforeEach(() => {
    const storage: Record<string, string> = {
      karama_data_version: 'karama_clean_production_v10',
    };
    (globalThis as any).localStorage = {
      getItem: (k: string) => storage[k] || null,
      setItem: (k: string, v: string) => {
        storage[k] = v;
      },
      removeItem: (k: string) => {
        delete storage[k];
      },
      clear: () => {
        Object.keys(storage).forEach((k) => delete storage[k]);
        storage['karama_data_version'] = 'karama_clean_production_v10';
      },
    };
  });

  it('records a due clearance payment and reduces customer overdue to zero', () => {
    OfflineStorage.setCustomers([
      {
        id: 'cust-1',
        customer_code: 'CUST-001',
        full_name: 'Rahul Sharma',
        total_overdue: 380,
        payment_rating: 'Late payer',
        status: 'active',
        business_id: 'biz-1',
        monthly_rate: 380,
      } as Customer,
    ]);

    const payment = OfflineStorage.recordPayment({
      customer_id: 'cust-1',
      amount: 380,
      payment_method: 'cash',
      notes: 'Cleared full October overdue dues',
      payment_date: '2026-11-03',
    });

    expect(payment.amount).toBe(380);
    expect(payment.payment_number).toMatch(/^REC-/);

    const customers = OfflineStorage.getCustomers();
    const updated = customers.find((c) => c.id === 'cust-1');
    expect(updated?.total_overdue).toBe(0);
    expect(updated?.payment_rating).toBe('Good');

    const payments = OfflineStorage.getPayments();
    expect(payments.length).toBeGreaterThan(0);
    expect(payments[0].amount).toBe(380);
    expect(payments[0].customer?.full_name).toBe('Rahul Sharma');
  });

  it('handles partial dues settlement correctly', () => {
    OfflineStorage.setCustomers([
      {
        id: 'cust-2',
        customer_code: 'CUST-002',
        full_name: 'Aarav Patel',
        total_overdue: 500,
        payment_rating: 'Late payer',
        status: 'active',
        business_id: 'biz-1',
        monthly_rate: 380,
      } as Customer,
    ]);

    OfflineStorage.recordPayment({
      customer_id: 'cust-2',
      amount: 200,
      payment_method: 'bank_transfer',
      reference_number: 'TR-12345',
      notes: 'Partial payment of dues',
      payment_date: '2026-11-03',
    });

    const customers = OfflineStorage.getCustomers();
    const updated = customers.find((c) => c.id === 'cust-2');
    expect(updated?.total_overdue).toBe(300);
    // Overdue is still > 0, so payment rating remains late payer
    expect(updated?.total_overdue).toBeGreaterThan(0);
  });

  it('chronologically tracks multiple cleared dues settlements for the audit ledger', () => {
    OfflineStorage.setCustomers([
      {
        id: 'cust-3',
        customer_code: 'CUST-003',
        full_name: 'Faisal Khan',
        total_overdue: 760,
        status: 'active',
        business_id: 'biz-1',
        monthly_rate: 380,
      } as Customer,
    ]);

    // First clearance
    OfflineStorage.recordPayment({
      customer_id: 'cust-3',
      amount: 380,
      payment_date: '2026-11-01',
      notes: 'Cleared Month 1',
    });

    // Second clearance
    OfflineStorage.recordPayment({
      customer_id: 'cust-3',
      amount: 380,
      payment_date: '2026-11-03',
      notes: 'Cleared Month 2 in full',
    });

    const payments = OfflineStorage.getPayments();
    const cust3Payments = payments.filter((p) => p.customer_id === 'cust-3');
    expect(cust3Payments.length).toBe(2);

    const totalPaid = cust3Payments.reduce((acc, p) => acc + p.amount, 0);
    expect(totalPaid).toBe(760);

    const cust = OfflineStorage.getCustomers().find((c) => c.id === 'cust-3');
    expect(cust?.total_overdue).toBe(0);
  });

  it('credits excess advance payment to customer wallet when payment exceeds overdue (e.g. 3000 due, 3030 paid)', () => {
    OfflineStorage.setCustomers([
      {
        id: 'cust-advance',
        customer_code: 'CUST-3030',
        full_name: 'Salman Test',
        total_overdue: 3000,
        advance_balance: 0,
        status: 'active',
        business_id: 'biz-1',
        monthly_rate: 3000,
      } as Customer,
    ]);

    const payment = OfflineStorage.recordPayment({
      customer_id: 'cust-advance',
      amount: 3030,
      payment_method: 'cash',
      payment_date: '2026-11-19',
      notes: 'Paid 3000 due + 30 advance',
    });

    expect(payment.amount).toBe(3030);
    expect(payment.advance_credited).toBe(30);

    const customers = OfflineStorage.getCustomers();
    const cust = customers.find((c) => c.id === 'cust-advance');
    expect(cust?.total_overdue).toBe(0);
    expect(cust?.advance_balance).toBe(30);
  });

  it('automatically debits advance balance on the next billing amount (e.g. 3000 due debits 30 advance, pays 2970)', () => {
    OfflineStorage.setCustomers([
      {
        id: 'cust-advance-debit',
        customer_code: 'CUST-3031',
        full_name: 'Salman Next Month',
        total_overdue: 3000,
        advance_balance: 30,
        status: 'active',
        business_id: 'biz-1',
        monthly_rate: 3000,
      } as Customer,
    ]);

    // Customer pays 2970 and debits 30 advance
    const payment = OfflineStorage.recordPayment({
      customer_id: 'cust-advance-debit',
      amount: 2970,
      advance_applied: 30,
      payment_method: 'cash',
      payment_date: '2026-12-19',
      notes: 'Settled with 30 advance debited',
    });

    expect(payment.amount).toBe(2970);
    expect(payment.advance_applied).toBe(30);

    const customers = OfflineStorage.getCustomers();
    const cust = customers.find((c) => c.id === 'cust-advance-debit');
    expect(cust?.total_overdue).toBe(0);
    expect(cust?.advance_balance).toBe(0);
  });
});
