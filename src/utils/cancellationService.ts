import { Customer } from '../types';
import { formatAED } from './currency';

export interface ApproachingCancellation {
  customer: Customer;
  cancellationDate: string; // YYYY-MM-DD
  noticeDate?: string;
  daysRemaining: number;
  reason?: string;
  isOverdueForCancellation: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  targetDateDisplay: string;
  badge: {
    label: string;
    bg: string;
    border: string;
    textColor: string;
  };
  proRata: {
    monthlyRate: number;
    dailyRate: number;
    activeDays: number;
    proRataAmount: number;
  };
}

/**
 * Calculate exact daily meal rate according to pricing rules:
 * - 1 Time (1 meal daily / AED 180 monthly): AED 6.00 / day
 * - 2 Time (2 meals daily / AED 300 monthly): AED 10.00 / day
 * - 3 Time (3 meals daily / AED 380 monthly):
 *     - 31-day month: AED 13.00 / day
 *     - 30-day month: AED 12.67 / day (12.6666...)
 */
export function calculateDailyMealRate(
  monthlyRate: number = 380,
  meals?: { has_breakfast?: boolean; has_lunch?: boolean; has_dinner?: boolean },
  daysInMonth: number = 30
): number {
  const mealCount = meals
    ? (meals.has_breakfast ? 1 : 0) + (meals.has_lunch ? 1 : 0) + (meals.has_dinner ? 1 : 0)
    : 0;

  if (mealCount === 1 || monthlyRate === 180) {
    return 6.00;
  }
  if (mealCount === 2 || monthlyRate === 300) {
    return 10.00;
  }
  if (mealCount === 3 || monthlyRate === 380) {
    return daysInMonth === 31 ? 13.00 : 12.67;
  }

  return Math.round((monthlyRate / (daysInMonth || 30)) * 100) / 100;
}

/**
 * Returns cancellation notice details for a single customer, or null if no notice is active
 */
export function getCustomerCancellationNotice(customer: Customer): ApproachingCancellation | null {
  // Only active, trial, or paused customers can have an active notice
  if (customer.status === 'cancelled' || customer.status === 'left') return null;

  let targetDateStr = customer.cancellation_date;

  // Check notes for embedded notice if cancellation_date not directly set
  if (!targetDateStr && customer.notes && customer.notes.includes('[NOTICE: Cancelling on ')) {
    const match = customer.notes.match(/\[NOTICE: Cancelling on (\d{4}-\d{2}-\d{2})/);
    if (match) targetDateStr = match[1];
  }

  // Fallback to billing_end_date if status is explicitly cancelling_soon
  if (!targetDateStr && customer.status === 'cancelling_soon' && customer.billing_end_date) {
    targetDateStr = customer.billing_end_date;
  }

  if (!targetDateStr) return null;

  const parts = targetDateStr.split('-');
  if (parts.length !== 3) return null;

  const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  if (isNaN(targetDate.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = targetDate.getTime() - today.getTime();
  const daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const isToday = daysRemaining === 0;
  const isTomorrow = daysRemaining === 1;
  const isOverdue = daysRemaining < 0;

  let reason = customer.cancellation_reason || '';
  if (!reason && customer.notes && customer.notes.includes('Reason: ')) {
    const reasonMatch = customer.notes.match(/Reason: ([^\]]+)\]/);
    if (reasonMatch) reason = reasonMatch[1].trim();
  }

  const targetDateDisplay = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(targetDate);

  // Compute mid-month pro-rata settlement based on exact daily pricing
  const monthlyRate = customer.monthly_rate || 380;
  const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
  const dailyRate = calculateDailyMealRate(
    monthlyRate,
    {
      has_breakfast: customer.has_breakfast,
      has_lunch: customer.has_lunch,
      has_dinner: customer.has_dinner,
    },
    daysInMonth
  );

  let activeDays = 15;
  if (customer.billing_start_date) {
    const startParts = customer.billing_start_date.split('-');
    if (startParts.length === 3) {
      const startDate = new Date(parseInt(startParts[0], 10), parseInt(startParts[1], 10) - 1, parseInt(startParts[2], 10));
      const activeDiffMs = targetDate.getTime() - startDate.getTime();
      activeDays = Math.max(1, Math.min(daysInMonth, Math.round(activeDiffMs / (1000 * 60 * 60 * 24)) + 1));
    }
  } else {
    activeDays = Math.max(1, Math.min(daysInMonth, targetDate.getDate()));
  }

  const proRataAmount = Math.round(dailyRate * activeDays * 100) / 100;

  let badge = {
    label: `In ${daysRemaining} days`,
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    textColor: 'text-amber-300 font-bold',
  };

  if (isOverdue) {
    badge = {
      label: `Notice Due (${Math.abs(daysRemaining)}d ago)`,
      bg: 'bg-rose-500/20',
      border: 'border-rose-500/50',
      textColor: 'text-rose-300 font-bold',
    };
  } else if (isToday) {
    badge = {
      label: 'Leaving TODAY (Final Day)',
      bg: 'bg-rose-500/25',
      border: 'border-rose-500/60',
      textColor: 'text-rose-300 font-black',
    };
  } else if (isTomorrow || daysRemaining === 1) {
    badge = {
      label: 'Leaving in 1 day (Tomorrow)',
      bg: 'bg-amber-500/25',
      border: 'border-amber-500/60',
      textColor: 'text-amber-300 font-black',
    };
  } else if (daysRemaining <= 5) {
    badge = {
      label: `Leaving in ${daysRemaining} days (${targetDateDisplay})`,
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/40',
      textColor: 'text-amber-300 font-bold',
    };
  }

  return {
    customer,
    cancellationDate: targetDateStr,
    noticeDate: customer.cancellation_notice_date,
    daysRemaining,
    reason,
    isOverdueForCancellation: isOverdue,
    isToday,
    isTomorrow,
    targetDateDisplay,
    badge,
    proRata: {
      monthlyRate,
      dailyRate,
      activeDays,
      proRataAmount,
    },
  };
}

/**
 * Format local date as YYYY-MM-DD avoiding UTC day-shift issues
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Automatically evaluates and synchronizes customer cancellation statuses:
 * 1. If cancellation_date has ended (cancellation_date < todayStr):
 *    Automatically moves customer to 'cancelled' status.
 * 2. If customer has a scheduled cancellation date (>= todayStr) and is still marked active/trial/paused:
 *    Automatically moves customer to 'cancelling_soon' status.
 */
export function syncCustomerCancellationStatuses(customers: Customer[]): {
  updatedCustomers: Customer[];
  autoCancelledCount: number;
  onNoticeCount: number;
  hasChanges: boolean;
} {
  const todayStr = getLocalDateString();
  let autoCancelledCount = 0;
  let onNoticeCount = 0;
  let hasChanges = false;

  const updatedCustomers = customers.map((c) => {
    // If already cancelled or left, nothing to auto-transition
    if (c.status === 'cancelled' || c.status === 'left') {
      return c;
    }

    let cancelDate = c.cancellation_date;
    let cancelReason = c.cancellation_reason;

    if (!cancelDate && c.notes && c.notes.includes('[NOTICE: Cancelling on ')) {
      const match = c.notes.match(/\[NOTICE: Cancelling on (\d{4}-\d{2}-\d{2})(?: \| Reason: ([^\]]+))?\]/);
      if (match) {
        cancelDate = match[1];
        if (match[2]) cancelReason = match[2];
      }
    }

    if (!cancelDate && c.status === 'cancelling_soon' && c.billing_end_date) {
      cancelDate = c.billing_end_date;
    }

    if (!cancelDate) return c;

    // 1. Final meal date has passed -> automatically mark as cancelled
    if (cancelDate < todayStr) {
      hasChanges = true;
      autoCancelledCount++;
      const noteAppend = `\n[${todayStr}] Notice period ended on ${cancelDate}. Automatically moved to Cancelled status.`;
      return {
        ...c,
        cancellation_date: cancelDate,
        cancellation_reason: cancelReason,
        status: 'cancelled' as Customer['status'],
        notes: c.notes ? `${c.notes}${noteAppend}` : `Notice period ended on ${cancelDate}. Automatically moved to Cancelled status.`,
        updated_at: new Date().toISOString(),
      };
    }

    // 2. Currently on notice (cancellation_date is today or in future)
    if (cancelDate >= todayStr && c.status !== 'cancelling_soon') {
      hasChanges = true;
      onNoticeCount++;
      return {
        ...c,
        cancellation_date: cancelDate,
        cancellation_reason: cancelReason,
        status: 'cancelling_soon' as Customer['status'],
        updated_at: new Date().toISOString(),
      };
    }

    // If cancellation_date was parsed from notes, update c with it
    if (c.cancellation_date !== cancelDate) {
      return {
        ...c,
        cancellation_date: cancelDate,
        cancellation_reason: cancelReason,
      };
    }

    return c;
  });

  return {
    updatedCustomers,
    autoCancelledCount,
    onNoticeCount,
    hasChanges,
  };
}

/**
 * Returns customers scheduled to cancel/stop mess within the specified window (default 15 days, or already due today/past)
 */
export function getApproachingCancellations(
  customers: Customer[],
  windowDays: number = 15
): ApproachingCancellation[] {
  const results: ApproachingCancellation[] = [];

  customers.forEach((c) => {
    const notice = getCustomerCancellationNotice(c);
    if (!notice) return;
    if (notice.daysRemaining <= windowDays) {
      results.push(notice);
    }
  });

  // Sort: most imminent cancellations first
  return results.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Format date offset by N days as YYYY-MM-DD
 */
export function getRelativeDateString(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format middle of current/next month (15th) as YYYY-MM-DD
 */
export function getMiddleOfMonthDateString(): string {
  const d = new Date();
  if (d.getDate() >= 15) {
    // Return 15th of next month
    d.setMonth(d.getMonth() + 1);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-15`;
}

/**
 * WhatsApp message for scheduled cancellation acknowledgment & final settlement details
 */
export function sendCancellationWhatsApp(item: ApproachingCancellation): void {
  const c = item.customer;
  if (!c.phone) {
    alert(`No phone number registered for customer "${c.full_name}".`);
    return;
  }

  const cleanPhone = c.phone.replace(/[^0-9]/g, '');
  const greetingName = c.full_name || 'Valued Customer';

  const message = `Hello ${greetingName},\n\n` +
    `This is Karama Homely Mess confirming your scheduled cancellation request for *${item.targetDateDisplay}*.\n\n` +
    `📋 *Cancellation Summary:*\n` +
    `• Customer Code: #${c.customer_code}\n` +
    `• Final Delivery Day: ${item.targetDateDisplay}\n` +
    `• Active Days in Cycle: ${item.proRata.activeDays} days\n` +
    `• Mid-Month Settlement Amount: AED ${item.proRata.proRataAmount.toFixed(2)}\n` +
    (item.reason ? `• Notes: ${item.reason}\n` : '') +
    `\nThank you for dining with Karama Homely Mess! If your plans change and you would like to continue your meals, please let us know anytime.\n\n` +
    `Best regards,\nKarama Homely Mess\n📞 +971 50 123 4567`;

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
  window.open(url, '_blank');
}
