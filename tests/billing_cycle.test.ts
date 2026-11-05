import { describe, it, expect } from 'vitest';
import { getMonthlySubscriptionRate, getDaysInTargetMonth, is31DayCycle } from '../src/utils/billingCycleService';
import { getCustomerDueDateInfo } from '../src/utils/reminderService';
import { Customer } from '../src/types';

describe('Automatic 30-Day (380 AED) vs 31-Day (390 AED) Billing Cycle Engine', () => {
  const standardCustomer: Customer = {
    id: 'cust-101',
    customer_code: 'KM-101',
    full_name: 'Mohammed Salman',
    phone: '+971500000001',
    status: 'active',
    has_breakfast: true,
    has_lunch: true,
    has_dinner: true,
    monthly_rate: 380,
    total_overdue: 0,
    billing_start_date: '2026-10-01',
    billing_end_date: '2026-10-31',
    business_id: 'default',
    joining_date: '2026-10-01',
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-01T00:00:00Z',
  };

  it('correctly identifies days in months', () => {
    // October has 31 days
    expect(getDaysInTargetMonth('2026-10-15')).toBe(31);
    // November has 30 days
    expect(getDaysInTargetMonth('2026-11-15')).toBe(30);
    // December has 31 days
    expect(getDaysInTargetMonth('2026-12-01')).toBe(31);
    // April has 30 days
    expect(getDaysInTargetMonth('2026-04-10')).toBe(30);
  });

  it('charges exactly 390 AED for 31-day months on monthly subscription customers', () => {
    // October 2026 (31 days)
    const resultOct = getMonthlySubscriptionRate(standardCustomer, '2026-10-01', '2026-10-31');
    expect(resultOct.is31Days).toBe(true);
    expect(resultOct.effectiveRate).toBe(390);
    expect(resultOct.isMonthlySubscriber).toBe(true);

    // December 2026 (31 days)
    const resultDec = getMonthlySubscriptionRate(standardCustomer, '2026-12-01', '2026-12-31');
    expect(resultDec.is31Days).toBe(true);
    expect(resultDec.effectiveRate).toBe(390);
  });

  it('charges exactly 380 AED for 30-day months on monthly subscription customers', () => {
    // November 2026 (30 days)
    const resultNov = getMonthlySubscriptionRate(standardCustomer, '2026-11-01', '2026-11-30');
    expect(resultNov.is31Days).toBe(false);
    expect(resultNov.effectiveRate).toBe(380);
    expect(resultNov.isMonthlySubscriber).toBe(true);

    // September 2026 (30 days)
    const resultSep = getMonthlySubscriptionRate(standardCustomer, '2026-09-01', '2026-09-30');
    expect(resultSep.is31Days).toBe(false);
    expect(resultSep.effectiveRate).toBe(380);
  });

  it('does NOT force-override custom contract / non-monthly pricing', () => {
    const customCustomer: Customer = {
      ...standardCustomer,
      id: 'cust-custom',
      monthly_rate: 250, // Custom negotiated rate
      has_breakfast: false,
      has_lunch: true,
      has_dinner: false,
    };

    // In a 31-day month, custom contract retains 250 AED
    const resultCustomOct = getMonthlySubscriptionRate(customCustomer, '2026-10-01', '2026-10-31');
    expect(resultCustomOct.effectiveRate).toBe(250);
    expect(resultCustomOct.isMonthlySubscriber).toBe(false);
  });

  it('automatically sets upcoming due amount to 390 AED for October in reminder service', () => {
    const octCustomer: Customer = {
      ...standardCustomer,
      billed_up_to_date: '2026-10-31',
      total_overdue: 0,
    };

    const dueInfo = getCustomerDueDateInfo(octCustomer, [], new Date('2026-10-25'));
    expect(dueInfo.amountDue).toBe(390);
  });

  it('automatically sets upcoming due amount to 380 AED for November in reminder service', () => {
    const novCustomer: Customer = {
      ...standardCustomer,
      billed_up_to_date: '2026-11-30',
      total_overdue: 0,
    };

    const dueInfo = getCustomerDueDateInfo(novCustomer, [], new Date('2026-11-20'));
    expect(dueInfo.amountDue).toBe(380);
  });
});
