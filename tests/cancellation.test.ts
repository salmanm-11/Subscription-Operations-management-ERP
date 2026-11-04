import { describe, it, expect } from 'vitest';
import { Customer } from '../src/types';
import {
  getCustomerCancellationNotice,
  getApproachingCancellations,
  getRelativeDateString,
  getMiddleOfMonthDateString,
  syncCustomerCancellationStatuses,
} from '../src/utils/cancellationService';

describe('Scheduled Cancellation & Mid-Month Exit Tracking', () => {
  const baseCustomer: Customer = {
    id: 'cust-1',
    customer_code: 'CUST-001',
    full_name: 'Rahul Nair',
    phone: '+971501112222',
    status: 'active',
    monthly_rate: 300,
    has_breakfast: true,
    has_lunch: true,
    has_dinner: true,
    billing_start_date: '2026-11-01',
    billing_end_date: '2026-11-30',
    business_id: 'biz-test',
    joining_date: '2026-11-01',
    created_at: '2026-11-01T00:00:00Z',
    updated_at: '2026-11-01T00:00:00Z',
  };

  it('returns null for customers with no scheduled cancellation notice', () => {
    const notice = getCustomerCancellationNotice(baseCustomer);
    expect(notice).toBeNull();
  });

  it('returns null for customers already marked as cancelled', () => {
    const cancelledCust: Customer = {
      ...baseCustomer,
      status: 'cancelled',
      cancellation_date: getRelativeDateString(5),
    };
    const notice = getCustomerCancellationNotice(cancelledCust);
    expect(notice).toBeNull();
  });

  it('correctly calculates 5-day advance notice and mid-month pro-rata math', () => {
    const exitIn5Days = getRelativeDateString(5);
    const cust: Customer = {
      ...baseCustomer,
      monthly_rate: 300, // 300 / 30 = 10 AED/day
      cancellation_date: exitIn5Days,
      cancellation_reason: 'Travelling back to home country',
    };

    const notice = getCustomerCancellationNotice(cust);
    expect(notice).not.toBeNull();
    expect(notice?.daysRemaining).toBe(5);
    expect(notice?.reason).toBe('Travelling back to home country');
    expect(notice?.isToday).toBe(false);
    expect(notice?.isOverdueForCancellation).toBe(false);
    expect(notice?.proRata.monthlyRate).toBe(300);
    expect(notice?.proRata.dailyRate).toBe(10);
    expect(notice?.badge.label).toContain('5 days');
  });

  it('extracts notice from embedded notes tag if cancellation_date is not set as dedicated column', () => {
    const exitDate = getRelativeDateString(3);
    const cust: Customer = {
      ...baseCustomer,
      notes: `Special packaging needed [NOTICE: Cancelling on ${exitDate} | Reason: Relocating to Abu Dhabi]`,
    };

    const notice = getCustomerCancellationNotice(cust);
    expect(notice).not.toBeNull();
    expect(notice?.cancellationDate).toBe(exitDate);
    expect(notice?.daysRemaining).toBe(3);
    expect(notice?.reason).toBe('Relocating to Abu Dhabi');
  });

  it('identifies overdue notices when scheduled exit date is in the past', () => {
    const pastDate = getRelativeDateString(-2);
    const cust: Customer = {
      ...baseCustomer,
      cancellation_date: pastDate,
      cancellation_reason: 'Shifted flat',
    };

    const notice = getCustomerCancellationNotice(cust);
    expect(notice).not.toBeNull();
    expect(notice?.isOverdueForCancellation).toBe(true);
    expect(notice?.daysRemaining).toBe(-2);
    expect(notice?.badge.label).toContain('Notice Due (2d ago)');
  });

  it('filters and sorts approaching cancellations by urgency in getApproachingCancellations', () => {
    const cust1: Customer = {
      ...baseCustomer,
      id: 'cust-1',
      customer_code: 'CUST-001',
      cancellation_date: getRelativeDateString(7),
    };
    const cust2: Customer = {
      ...baseCustomer,
      id: 'cust-2',
      customer_code: 'CUST-002',
      cancellation_date: getRelativeDateString(2),
    };
    const custFarAway: Customer = {
      ...baseCustomer,
      id: 'cust-3',
      customer_code: 'CUST-003',
      cancellation_date: getRelativeDateString(30),
    };
    const custNoNotice: Customer = {
      ...baseCustomer,
      id: 'cust-4',
      customer_code: 'CUST-004',
    };

    const results = getApproachingCancellations([cust1, cust2, custFarAway, custNoNotice], 15);
    expect(results.length).toBe(2);
    // Most urgent first
    expect(results[0].customer.id).toBe('cust-2');
    expect(results[0].daysRemaining).toBe(2);
    expect(results[1].customer.id).toBe('cust-1');
    expect(results[1].daysRemaining).toBe(7);
  });

  it('generates valid mid-of-month and relative date strings', () => {
    const midMonth = getMiddleOfMonthDateString();
    expect(midMonth).toMatch(/^\d{4}-\d{2}-15$/);

    const rel = getRelativeDateString(5);
    expect(rel).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('automatically synchronizes cancellation statuses (transitions to cancelling_soon when on notice, and auto-cancelled when period ends)', () => {
    const custOnNotice: Customer = {
      ...baseCustomer,
      id: 'notice-1',
      status: 'active',
      cancellation_date: getRelativeDateString(3), // 3 days in future
    };

    const custNoticeEnded: Customer = {
      ...baseCustomer,
      id: 'ended-1',
      status: 'active',
      cancellation_date: getRelativeDateString(-1), // Ended yesterday
    };

    const custRegular: Customer = {
      ...baseCustomer,
      id: 'regular-1',
      status: 'active',
    };

    const { updatedCustomers, autoCancelledCount, onNoticeCount, hasChanges } = syncCustomerCancellationStatuses([
      custOnNotice,
      custNoticeEnded,
      custRegular,
    ]);

    expect(hasChanges).toBe(true);
    expect(autoCancelledCount).toBe(1);
    expect(onNoticeCount).toBe(1);

    const updatedEnded = updatedCustomers.find((c) => c.id === 'ended-1');
    expect(updatedEnded?.status).toBe('cancelled');
    expect(updatedEnded?.notes).toContain('Automatically moved to Cancelled status');

    const updatedNotice = updatedCustomers.find((c) => c.id === 'notice-1');
    expect(updatedNotice?.status).toBe('cancelling_soon');

    const updatedRegular = updatedCustomers.find((c) => c.id === 'regular-1');
    expect(updatedRegular?.status).toBe('active');
  });

  it('recovers cancellation date from notes or billing_end_date during synchronization if database column was empty', () => {
    const custWithNotesOnly: Customer = {
      ...baseCustomer,
      id: 'notes-only',
      status: 'active',
      notes: `VIP Customer [NOTICE: Cancelling on ${getRelativeDateString(4)} | Reason: Leaving country]`,
    };

    const custWithStatusOnly: Customer = {
      ...baseCustomer,
      id: 'status-only',
      status: 'cancelling_soon',
      billing_end_date: getRelativeDateString(5),
    };

    const { updatedCustomers, hasChanges } = syncCustomerCancellationStatuses([
      custWithNotesOnly,
      custWithStatusOnly,
    ]);

    expect(hasChanges).toBe(true);

    const updatedNotes = updatedCustomers.find((c) => c.id === 'notes-only');
    expect(updatedNotes?.status).toBe('cancelling_soon');
    expect(updatedNotes?.cancellation_date).toBe(getRelativeDateString(4));
    expect(updatedNotes?.cancellation_reason).toBe('Leaving country');

    const updatedStatus = updatedCustomers.find((c) => c.id === 'status-only');
    expect(updatedStatus?.cancellation_date).toBe(getRelativeDateString(5));
  });
});
