import { describe, it, expect } from 'vitest';
import {
  parseFlexibleDate,
  getDaysDifference,
  getCustomerDueDateInfo,
  getApproachingReminders,
  generateWhatsAppReminderMessage,
  DEFAULT_REMINDER_DAYS
} from '../src/utils/reminderService';
import { Customer, Invoice } from '../src/types';

describe('Payment Due Date Approaching Reminders System', () => {
  const baseDate = new Date(2026, 9, 28); // 28 Oct 2026

  it('correctly parses flexible date formats', () => {
    const isoDate = parseFlexibleDate('2026-10-31');
    expect(isoDate).not.toBeNull();
    expect(isoDate!.getFullYear()).toBe(2026);
    expect(isoDate!.getMonth()).toBe(9); // 0-indexed October
    expect(isoDate!.getDate()).toBe(31);

    const dmyDate = parseFlexibleDate('31-10-2026');
    expect(dmyDate).not.toBeNull();
    expect(dmyDate!.getDate()).toBe(31);

    const textDate = parseFlexibleDate('31 Oct 2026');
    expect(textDate).not.toBeNull();
    expect(textDate!.getDate()).toBe(31);
  });

  it('calculates days difference accurately against base date', () => {
    const dueToday = new Date(2026, 9, 28);
    const dueTomorrow = new Date(2026, 9, 29);
    const dueIn3Days = new Date(2026, 9, 31);
    const overdue2Days = new Date(2026, 9, 26);

    expect(getDaysDifference(dueToday, baseDate)).toBe(0);
    expect(getDaysDifference(dueTomorrow, baseDate)).toBe(1);
    expect(getDaysDifference(dueIn3Days, baseDate)).toBe(3);
    expect(getDaysDifference(overdue2Days, baseDate)).toBe(-2);
  });

  it('detects a customer approaching due date within 5 days', () => {
    const customer: Customer = {
      id: 'cust-saran',
      business_id: 'biz-01',
      customer_code: '101',
      full_name: 'Saran',
      phone: '+971 50 5670387',
      monthly_rate: 310,
      billing_end_date: '2026-10-31',
      billed_up_to_date: '2026-10-31',
      status: 'active',
      has_breakfast: false,
      has_lunch: true,
      has_dinner: true,
      joining_date: '2026-10-06',
      billing_start_date: '2026-10-06',
      total_overdue: 0,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-28T00:00:00Z',
    };

    const info = getCustomerDueDateInfo(customer, [], baseDate, 5);

    expect(info.daysRemaining).toBe(3);
    expect(info.isApproaching).toBe(true);
    expect(info.isDueToday).toBe(false);
    expect(info.statusLabel).toBe('Due in 3 days');
    expect(info.targetDueDateDisplay).toBe('31-Oct-2026');
    expect(info.amountDue).toBe(310);
  });

  it('allows changing the reminder window threshold dynamically', () => {
    const customer: Customer = {
      id: 'cust-4days',
      business_id: 'biz-01',
      customer_code: '102',
      full_name: 'Kumar',
      monthly_rate: 380,
      billing_end_date: '2026-11-01', // 4 days from Oct 28
      status: 'active',
      has_breakfast: true,
      has_lunch: true,
      has_dinner: true,
      joining_date: '2026-10-01',
      billing_start_date: '2026-10-01',
      total_overdue: 0,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-28T00:00:00Z',
    };

    // With 5-day reminder (Default): approaching
    const info5d = getCustomerDueDateInfo(customer, [], baseDate, 5);
    expect(info5d.daysRemaining).toBe(4);
    expect(info5d.isApproaching).toBe(true);

    // With 3-day reminder: NOT approaching yet
    const info3d = getCustomerDueDateInfo(customer, [], baseDate, 3);
    expect(info3d.isApproaching).toBe(false);

    // With 7-day reminder: approaching
    const info7d = getCustomerDueDateInfo(customer, [], baseDate, 7);
    expect(info7d.isApproaching).toBe(true);
  });

  it('prioritizes open invoice due_date over customer default date', () => {
    const customer: Customer = {
      id: 'cust-inv',
      business_id: 'biz-01',
      customer_code: '103',
      full_name: 'Ahmed',
      monthly_rate: 310,
      billing_end_date: '2026-11-15',
      status: 'active',
      has_breakfast: false,
      has_lunch: true,
      has_dinner: true,
      joining_date: '2026-10-01',
      billing_start_date: '2026-10-01',
      total_overdue: 250,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-28T00:00:00Z',
    };

    const invoice: Invoice = {
      id: 'inv-oct',
      business_id: 'biz-01',
      invoice_number: 'INV-2026-1001',
      customer_id: 'cust-inv',
      issue_date: '2026-10-01',
      due_date: '2026-10-30', // 2 days from Oct 28
      period_start: '2026-10-01',
      period_end: '2026-10-31',
      subtotal: 250,
      discount_amount: 0,
      tax_amount: 0,
      total_amount: 250,
      paid_amount: 0,
      balance_amount: 250,
      status: 'issued',
      created_at: '2026-10-01T00:00:00Z',
    };

    const info = getCustomerDueDateInfo(customer, [invoice], baseDate, 5);
    expect(info.daysRemaining).toBe(2);
    expect(info.targetDueDateDisplay).toBe('30-Oct-2026');
    expect(info.amountDue).toBe(250);
    expect(info.isApproaching).toBe(true);
  });

  it('generates polite, professional WhatsApp reminder message', () => {
    const customer: Customer = {
      id: 'cust-101',
      business_id: 'biz-01',
      customer_code: '101',
      full_name: 'Saran',
      phone: '+971 50 5670387',
      building_name_cache: 'Era Building',
      apartment_cache: '110',
      monthly_rate: 310,
      status: 'active',
      has_breakfast: false,
      has_lunch: true,
      has_dinner: true,
      joining_date: '2026-10-01',
      billing_start_date: '2026-10-01',
      total_overdue: 0,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-28T00:00:00Z',
    };

    const message = generateWhatsAppReminderMessage(customer, '31 Oct 2026', 3, 310);
    expect(message).toContain('KARAMA HOMELY MESS - PAYMENT REMINDER');
    expect(message).toContain('Dear Saran');
    expect(message).toContain('310.00');
    expect(message).toContain('31 Oct 2026');
    expect(message).toContain('(in 3 days)');
    expect(message).toContain('Era Building');
    expect(message).toContain('#101');
  });

  it('does NOT flag approaching reminder if customer is already paid up to date and leaving', () => {
    const customer: Customer = {
      id: 'cust-nithin',
      business_id: 'biz-01',
      customer_code: '025',
      full_name: 'Nithin(Loshna)',
      monthly_rate: 180,
      has_breakfast: false,
      has_lunch: true,
      has_dinner: false,
      joining_date: '2026-10-01',
      billing_start_date: '2026-10-01',
      status: 'cancelling_soon',
      cancellation_date: '2026-11-19',
      payment_made_up_to_date: '2026-11-19',
      billed_up_to_date: '2026-11-19',
      billing_end_date: '2026-11-19',
      total_overdue: 0,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-11-19T00:00:00Z',
    };

    const todayDate = new Date(2026, 10, 19); // 19 Nov 2026
    const info = getCustomerDueDateInfo(customer, [], todayDate, 5);

    expect(info.isApproaching).toBe(false);
    expect(info.isDueToday).toBe(false);
    expect(info.isOverdue).toBe(false);
    expect(info.amountDue).toBe(0);
    expect(info.statusLabel).toContain('Settled for Exit');
  });

  it('does NOT flag approaching reminder if active customer is already paid up to date', () => {
    const customer: Customer = {
      id: 'cust-active-paid',
      business_id: 'biz-01',
      customer_code: '026',
      full_name: 'Rahul',
      monthly_rate: 380,
      has_breakfast: true,
      has_lunch: true,
      has_dinner: true,
      joining_date: '2026-10-01',
      billing_start_date: '2026-10-01',
      status: 'active',
      payment_made_up_to_date: '2026-11-19',
      billed_up_to_date: '2026-11-19',
      billing_end_date: '2026-11-19',
      total_overdue: 0,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-11-19T00:00:00Z',
    };

    const todayDate = new Date(2026, 10, 19); // 19 Nov 2026
    const info = getCustomerDueDateInfo(customer, [], todayDate, 5);

    expect(info.isApproaching).toBe(false);
    expect(info.isDueToday).toBe(false);
    expect(info.isOverdue).toBe(false);
    expect(info.daysRemaining).toBe(30);
  });
});
