import { describe, it, expect } from 'vitest';
import { Customer, Building, MealPlan, Invoice, Payment } from '../src/types';

describe('Customer 360 Profile and Details Resolution', () => {
  const sampleCustomer: Customer = {
    id: 'cust-101',
    business_id: 'biz-karama',
    customer_code: '101',
    full_name: 'Saran Kumar',
    phone: '+971 50 123 4567',
    emergency_contact: '+971 55 987 6543',
    email: 'saran@example.com',
    building_id: 'bld-01',
    building_name_cache: 'Belrasheed Building',
    apartment_cache: '101',
    meal_plan_id: 'plan-full',
    has_breakfast: true,
    has_lunch: true,
    has_dinner: true,
    monthly_rate: 310,
    dietary_preferences: 'No beef, less oil, spicy chicken curry',
    delivery_time: '6:30 AM - 7:30 AM',
    door_passcode: '4521',
    joining_date: '2026-10-01',
    billing_start_date: '2026-10-01',
    billing_end_date: '2026-10-31',
    payment_made_up_to_date: '2026-10-31',
    billed_up_to_date: '2026-10-31',
    status: 'active',
    payment_rating: 'Good',
    total_overdue: 0,
    managed_by: 'admin',
    notes: 'Leave delivery bag on the doorknob',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-28T00:00:00Z',
  };

  const sampleBuilding: Building = {
    id: 'bld-01',
    business_id: 'biz-karama',
    name: 'Belrasheed Building',
    area: 'Al Karama',
    address: 'Near Karama Post Office',
    created_at: '2026-10-01T00:00:00Z',
  };

  const sampleInvoices: Invoice[] = [
    {
      id: 'inv-001',
      business_id: 'biz-karama',
      invoice_number: 'INV-2026-101',
      customer_id: 'cust-101',
      issue_date: '2026-10-01',
      due_date: '2026-10-10',
      period_start: '2026-10-01',
      period_end: '2026-10-31',
      subtotal: 310,
      discount_amount: 0,
      tax_amount: 0,
      total_amount: 310,
      paid_amount: 310,
      balance_amount: 0,
      status: 'paid',
      created_at: '2026-10-01T00:00:00Z',
    },
    {
      id: 'inv-002',
      business_id: 'biz-karama',
      invoice_number: 'INV-2026-999',
      customer_id: 'cust-999', // Different customer
      issue_date: '2026-10-01',
      due_date: '2026-10-10',
      period_start: '2026-10-01',
      period_end: '2026-10-31',
      subtotal: 450,
      discount_amount: 0,
      tax_amount: 0,
      total_amount: 450,
      paid_amount: 0,
      balance_amount: 450,
      status: 'issued',
      created_at: '2026-10-01T00:00:00Z',
    },
  ];

  const samplePayments: Payment[] = [
    {
      id: 'pay-001',
      business_id: 'biz-karama',
      payment_number: 'REC-101',
      customer_id: 'cust-101',
      amount: 310,
      payment_date: '2026-10-05',
      payment_method: 'cash',
      reference_number: 'CASH-OCT-101',
      notes: 'October settlement received in full',
      is_reversed: false,
      created_at: '2026-10-05T00:00:00Z',
    },
  ];

  it('correctly associates and isolates invoices for the clicked customer', () => {
    const customerInvoices = sampleInvoices.filter(
      (inv) => inv.customer_id === sampleCustomer.id
    );
    expect(customerInvoices.length).toBe(1);
    expect(customerInvoices[0].invoice_number).toBe('INV-2026-101');
    expect(customerInvoices[0].paid_amount).toBe(310);
    expect(customerInvoices[0].balance_amount).toBe(0);
  });

  it('correctly associates payments for the clicked customer', () => {
    const customerPayments = samplePayments.filter(
      (p) => p.customer_id === sampleCustomer.id
    );
    expect(customerPayments.length).toBe(1);
    expect(customerPayments[0].payment_number).toBe('REC-101');
    expect(customerPayments[0].amount).toBe(310);
  });

  it('contains complete customer profile fields including emergency contact and handler', () => {
    expect(sampleCustomer.customer_code).toBe('101');
    expect(sampleCustomer.emergency_contact).toBe('+971 55 987 6543');
    expect(sampleCustomer.managed_by).toBe('admin');
    expect(sampleCustomer.door_passcode).toBe('4521');
    expect(sampleCustomer.delivery_time).toBe('6:30 AM - 7:30 AM');
    expect(sampleCustomer.dietary_preferences).toContain('No beef');
    expect(sampleCustomer.notes).toBe('Leave delivery bag on the doorknob');
  });

  it('formats clean WhatsApp and phone numbers correctly', () => {
    const phone = sampleCustomer.phone!;
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    expect(cleanDigits).toBe('971501234567');
  });

  it('correctly calculates remaining balance and status when settling an overdue invoice', () => {
    const overdueInvoice: Invoice = {
      id: 'inv-1001',
      business_id: 'biz-karama',
      invoice_number: 'INV-2026-1001',
      customer_id: 'cust-101',
      issue_date: '2026-10-01',
      due_date: '2026-10-10',
      period_start: '2026-10-01',
      period_end: '2026-10-31',
      subtotal: 250,
      discount_amount: 0,
      tax_amount: 0,
      total_amount: 250,
      paid_amount: 0,
      balance_amount: 250,
      status: 'overdue',
      created_at: '2026-10-01T00:00:00Z',
    };

    const paymentAmount = 250;
    const updatedPaid = overdueInvoice.paid_amount + paymentAmount;
    const updatedBalance = Math.max(0, overdueInvoice.total_amount - updatedPaid);
    const updatedStatus = updatedBalance === 0 ? 'paid' : 'partially_paid';

    expect(updatedPaid).toBe(250);
    expect(updatedBalance).toBe(0);
    expect(updatedStatus).toBe('paid');
  });

  it('clears customer overdue dues when payment covers the balance', () => {
    let overdueCustomer = {
      ...sampleCustomer,
      total_overdue: 250,
      payment_rating: 'Late payer' as 'Good' | 'Late payer' | 'Bad',
    };

    const paymentAmount = 250;
    overdueCustomer.total_overdue = Math.max(0, overdueCustomer.total_overdue - paymentAmount);
    if (overdueCustomer.total_overdue === 0) {
      overdueCustomer.payment_rating = 'Good';
      overdueCustomer.payment_made_up_to_date = '2026-10-31';
    }

    expect(overdueCustomer.total_overdue).toBe(0);
    expect(overdueCustomer.payment_rating).toBe('Good');
    expect(overdueCustomer.payment_made_up_to_date).toBe('2026-10-31');
  });

  it('allows adding and editing customer due balance with ratings and notes', () => {
    let customerWithDue = {
      ...sampleCustomer,
      total_overdue: 0,
      payment_rating: 'Good' as 'Good' | 'Late payer' | 'Bad',
    };

    // 1. Add due balance
    const addedDue = 380;
    customerWithDue.total_overdue = addedDue;
    customerWithDue.payment_rating = addedDue > 0 ? 'Late payer' : 'Good';
    customerWithDue.notes = 'Opening balance brought forward: AED 380';
    customerWithDue.billed_up_to_date = '2026-11-30';

    expect(customerWithDue.total_overdue).toBe(380);
    expect(customerWithDue.payment_rating).toBe('Late payer');
    expect(customerWithDue.notes).toContain('AED 380');
    expect(customerWithDue.billed_up_to_date).toBe('2026-11-30');

    // 2. Edit due balance (adjust down or clear)
    customerWithDue.total_overdue = 150;
    expect(customerWithDue.total_overdue).toBe(150);

    customerWithDue.total_overdue = 0;
    customerWithDue.payment_rating = 'Good';
    expect(customerWithDue.total_overdue).toBe(0);
    expect(customerWithDue.payment_rating).toBe('Good');
  });

  it('supports cancelled customer status and backward compatibility with legacy left', () => {
    const cancelledCustomer: Customer = {
      ...sampleCustomer,
      status: 'cancelled',
    };
    const legacyLeftCustomer: Customer = {
      ...sampleCustomer,
      status: 'left',
    };

    const isCancelled = (c: Customer) => c.status === 'cancelled' || c.status === 'left';
    expect(isCancelled(cancelledCustomer)).toBe(true);
    expect(isCancelled(legacyLeftCustomer)).toBe(true);
  });

  it('normalizes area clusters removing emoji prefixes and whitespace', () => {
    const normalizeCluster = (s?: string): string => {
      if (!s) return '';
      return s.replace(/^[\p{Emoji}\p{Symbol}\s\u200B-\u200D\uFE0F]+/u, '').trim();
    };

    expect(normalizeCluster('🟠 Burjman & Mankhool')).toBe('Burjman & Mankhool');
    expect(normalizeCluster('🟡 Park, Pioneer & ADCB')).toBe('Park, Pioneer & ADCB');
    expect(normalizeCluster('🟢 Karama Center - Pyramid')).toBe('Karama Center - Pyramid');
    expect(normalizeCluster('🟣 Hamdan Colony & Post')).toBe('Hamdan Colony & Post');
    expect(normalizeCluster('Karama Central')).toBe('Karama Central');
  });
});
