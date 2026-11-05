import { Customer } from '../types';

export interface BillingCycleRateResult {
  baseRate: number;
  effectiveRate: number;
  daysInMonth: number;
  is31Days: boolean;
  isMonthlySubscriber: boolean;
  description: string;
}

/**
 * Returns number of days in the calendar month for a given Date or ISO string (YYYY-MM-DD)
 */
export function getDaysInTargetMonth(dateOrString: Date | string = new Date()): number {
  if (typeof dateOrString === 'string') {
    const parts = dateOrString.split('-');
    if (parts.length >= 2) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10); // 1-12
      if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
        return new Date(year, month, 0).getDate();
      }
    }
    const d = new Date(dateOrString);
    if (!isNaN(d.getTime())) {
      return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    }
  } else if (dateOrString instanceof Date && !isNaN(dateOrString.getTime())) {
    return new Date(dateOrString.getFullYear(), dateOrString.getMonth() + 1, 0).getDate();
  }

  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

/**
 * Checks if a given period or date represents a 31-day month/cycle
 */
export function is31DayCycle(targetDateOrStart: Date | string = new Date(), periodEnd?: string): boolean {
  if (periodEnd && typeof targetDateOrStart === 'string') {
    const start = new Date(targetDateOrStart);
    const end = new Date(periodEnd);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays === 31) return true;
      if (diffDays === 30) return false;
    }
  }

  return getDaysInTargetMonth(targetDateOrStart) === 31;
}

/**
 * Computes monthly billing rate for a customer:
 * - 30-day months: AED 380 (standard)
 * - 31-day months: AED 390 (AED 380 + AED 10 for 31st day)
 * - Automation only applies to monthly subscription customers.
 */
export function getMonthlySubscriptionRate(
  customer?: Partial<Customer> | null,
  targetDateOrStart: Date | string = new Date(),
  periodEnd?: string
): BillingCycleRateResult {
  const daysInMonth = getDaysInTargetMonth(targetDateOrStart);
  const is31Days = is31DayCycle(targetDateOrStart, periodEnd);
  const baseRate = customer?.monthly_rate ?? 380;

  // Determine if this customer is a standard monthly subscription customer (3 meals or 380/390 base)
  const is3TimeMeals = customer
    ? (customer.has_breakfast && customer.has_lunch && customer.has_dinner)
    : true;

  const isMonthlySubscriber =
    baseRate === 380 ||
    baseRate === 390 ||
    (is3TimeMeals && (baseRate === 0 || baseRate === 380 || baseRate === 390));

  if (isMonthlySubscriber) {
    if (is31Days) {
      return {
        baseRate: 380,
        effectiveRate: 390,
        daysInMonth: 31,
        is31Days: true,
        isMonthlySubscriber: true,
        description: 'Monthly Mess Subscription (31-day month: AED 390)',
      };
    } else {
      return {
        baseRate: 380,
        effectiveRate: 380,
        daysInMonth,
        is31Days: false,
        isMonthlySubscriber: true,
        description: `Monthly Mess Subscription (${daysInMonth}-day month: AED 380)`,
      };
    }
  }

  // Custom or non-standard contract (preserve their negotiated rate)
  return {
    baseRate,
    effectiveRate: baseRate,
    daysInMonth,
    is31Days,
    isMonthlySubscriber: false,
    description: `Monthly Mess Subscription (${daysInMonth}-day cycle: AED ${baseRate})`,
  };
}
