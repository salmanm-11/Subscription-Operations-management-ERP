import { Customer, Invoice } from '../types';
import { formatAED } from './currency';

export const DEFAULT_REMINDER_DAYS = 5;
const STORAGE_KEY_REMINDER_DAYS = 'karama_due_reminder_days';

/**
 * Gets the current reminder threshold days from localStorage (defaults to 5)
 */
export function getReminderDaysSetting(): number {
  if (typeof localStorage === 'undefined') return DEFAULT_REMINDER_DAYS;
  const saved = localStorage.getItem(STORAGE_KEY_REMINDER_DAYS);
  if (!saved) return DEFAULT_REMINDER_DAYS;
  const parsed = parseInt(saved, 10);
  return isNaN(parsed) || parsed < 1 ? DEFAULT_REMINDER_DAYS : parsed;
}

/**
 * Saves a new reminder threshold (e.g. 3, 5, 7, 10 days)
 */
export function setReminderDaysSetting(days: number): void {
  if (typeof localStorage === 'undefined') return;
  const valid = Math.max(1, Math.min(60, days));
  localStorage.setItem(STORAGE_KEY_REMINDER_DAYS, valid.toString());
}

/**
 * Parses flexible date string (YYYY-MM-DD, DD/MM/YYYY, or English date text) into a Date at midnight
 */
export function parseFlexibleDate(str?: string): Date | null {
  if (!str) return null;
  const trimmed = str.trim();
  if (!trimmed) return null;

  // 1. Try ISO: YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const d = new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10));
    if (!isNaN(d.getTime())) return d;
  }

  // 2. Try DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const d = new Date(parseInt(dmyMatch[3], 10), parseInt(dmyMatch[2], 10) - 1, parseInt(dmyMatch[1], 10));
    if (!isNaN(d.getTime())) return d;
  }

  // 3. Fallback standard Date parse (e.g. "31 Oct 2026")
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  return null;
}

/**
 * Calculates day difference between target date and base date (normalized to midnight)
 */
export function getDaysDifference(targetDate: Date, baseDate: Date = new Date()): number {
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const baseMidnight = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const diffMs = targetMidnight.getTime() - baseMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Formats a Date object into human-readable display (e.g. "31 Oct 2026")
 */
export function formatDisplayDate(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getDate().toString().padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export interface CustomerDueDateInfo {
  customer: Customer;
  targetDueDate: Date;
  targetDueDateStr: string;
  targetDueDateDisplay: string;
  daysRemaining: number;
  isOverdue: boolean;
  isDueToday: boolean;
  isDueTomorrow: boolean;
  isApproaching: boolean;
  amountDue: number;
  statusLabel: string;
  badgeStyle: {
    bg: string;
    text: string;
    border: string;
    iconColor: string;
  };
}

/**
 * Determines exact due date, days remaining, and reminder urgency for a customer
 */
export function getCustomerDueDateInfo(
  customer: Customer,
  invoices: Invoice[] = [],
  baseDate: Date = new Date(),
  thresholdDays: number = getReminderDaysSetting()
): CustomerDueDateInfo {
  // 1. Resolve customer's active due date
  // Priority:
  // A. Unpaid open invoice due_date
  // B. Customer billed_up_to_date
  // C. Customer billing_end_date
  // D. Fallback: end of current month
  let rawDueDateStr = '';

  const openInvoice = invoices.find(
    (inv) =>
      (inv.customer_id === customer.id ||
        (inv.customer_name_cache && customer.full_name &&
          inv.customer_name_cache.toLowerCase() === customer.full_name.toLowerCase())) &&
      inv.balance_amount !== undefined &&
      inv.balance_amount > 0
  );

  if (openInvoice && openInvoice.due_date) {
    rawDueDateStr = openInvoice.due_date;
  } else if (customer.billed_up_to_date) {
    rawDueDateStr = customer.billed_up_to_date;
  } else if (customer.billing_end_date) {
    rawDueDateStr = customer.billing_end_date;
  } else {
    // Fallback: Last day of the current month
    const endOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
    rawDueDateStr = `${endOfMonth.getFullYear()}-${(endOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${endOfMonth.getDate()}`;
  }

  const parsedDueDate = parseFlexibleDate(rawDueDateStr) || new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
  const daysRemaining = getDaysDifference(parsedDueDate, baseDate);

  const overdueBalance = customer.total_overdue || 0;
  const isOverdue = overdueBalance > 0 || daysRemaining < 0;
  const isDueToday = daysRemaining === 0;
  const isDueTomorrow = daysRemaining === 1;
  const isApproaching = daysRemaining >= 0 && daysRemaining <= thresholdDays;

  const amountDue = overdueBalance > 0 ? overdueBalance : customer.monthly_rate || 310;

  // Status and styling badge
  let statusLabel = '';
  let badgeStyle = {
    bg: 'bg-slate-800',
    text: 'text-slate-300',
    border: 'border-slate-700',
    iconColor: 'text-slate-400',
  };

  if (daysRemaining < 0) {
    statusLabel = `Overdue by ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) > 1 ? 's' : ''}`;
    badgeStyle = {
      bg: 'bg-rose-500/15',
      text: 'text-rose-300 font-black',
      border: 'border-rose-500/35',
      iconColor: 'text-rose-400',
    };
  } else if (isDueToday) {
    statusLabel = '🚨 Due Today!';
    badgeStyle = {
      bg: 'bg-rose-600/25',
      text: 'text-rose-200 font-black animate-pulse',
      border: 'border-rose-500/50',
      iconColor: 'text-rose-300',
    };
  } else if (isDueTomorrow) {
    statusLabel = '⏰ Due Tomorrow';
    badgeStyle = {
      bg: 'bg-amber-500/20',
      text: 'text-amber-300 font-black',
      border: 'border-amber-500/40',
      iconColor: 'text-amber-400',
    };
  } else if (isApproaching) {
    statusLabel = `Due in ${daysRemaining} days`;
    badgeStyle = {
      bg: 'bg-amber-500/15',
      text: 'text-amber-200 font-bold',
      border: 'border-amber-500/30',
      iconColor: 'text-amber-400',
    };
  } else {
    statusLabel = `Due in ${daysRemaining} days`;
    badgeStyle = {
      bg: 'bg-slate-800/80',
      text: 'text-slate-400',
      border: 'border-slate-700/60',
      iconColor: 'text-slate-500',
    };
  }

  return {
    customer,
    targetDueDate: parsedDueDate,
    targetDueDateStr: rawDueDateStr,
    targetDueDateDisplay: formatDisplayDate(parsedDueDate),
    daysRemaining,
    isOverdue,
    isDueToday,
    isDueTomorrow,
    isApproaching,
    amountDue,
    statusLabel,
    badgeStyle,
  };
}

/**
 * Returns all active customers whose due date is approaching within the given threshold (default 5 days)
 * Sorted by urgency (Due today first, then tomorrow, then 2 days, 3 days, etc.)
 */
export function getApproachingReminders(
  customers: Customer[],
  invoices: Invoice[] = [],
  thresholdDays: number = getReminderDaysSetting(),
  baseDate: Date = new Date()
): CustomerDueDateInfo[] {
  return customers
    .filter((c) => c.status === 'active' || c.status === 'trial')
    .map((c) => getCustomerDueDateInfo(c, invoices, baseDate, thresholdDays))
    .filter((info) => info.isApproaching)
    .sort((a, b) => {
      // Due today & tomorrow first, then ascending days remaining
      return a.daysRemaining - b.daysRemaining;
    });
}

/**
 * Pre-composes a professional WhatsApp reminder message tailored to the customer
 */
export function generateWhatsAppReminderMessage(
  customer: Customer,
  dueDateDisplay: string,
  daysRemaining: number,
  amount: number
): string {
  let timePhrase = '';
  if (daysRemaining === 0) {
    timePhrase = '*TODAY*';
  } else if (daysRemaining === 1) {
    timePhrase = '*TOMORROW*';
  } else if (daysRemaining > 1) {
    timePhrase = `on *${dueDateDisplay}* (in ${daysRemaining} days)`;
  } else {
    timePhrase = `on *${dueDateDisplay}* and is now overdue`;
  }

  return (
    `*KARAMA MESS & CATERING - PAYMENT REMINDER*\n\n` +
    `Dear ${customer.full_name},\n\n` +
    `This is a friendly reminder that your mess subscription payment of *${formatAED(amount)}* is due ${timePhrase}.\n\n` +
    `🏢 *Accommodation:* ${customer.building_name_cache || 'Belrasheed Building'}${customer.apartment_cache ? ` (Apt ${customer.apartment_cache})` : ''}\n` +
    `📋 *Customer ID:* #${customer.customer_code}\n\n` +
    `Kindly arrange settlement at your earliest convenience to maintain uninterrupted daily meal delivery.\n\n` +
    `Thank you,\n*Karama Mess Operations & Accounts*`
  );
}

/**
 * Launches WhatsApp with the reminder message pre-filled
 */
export function sendWhatsAppReminder(
  customer: Customer,
  dueDateDisplay: string,
  daysRemaining: number,
  amount: number
): void {
  const text = generateWhatsAppReminderMessage(customer, dueDateDisplay, daysRemaining, amount);
  let phone = (customer.phone || '').replace(/[^0-9]/g, '');
  if (phone.startsWith('05')) phone = '971' + phone.substring(1);
  else if (phone.length === 9) phone = '971' + phone;

  const url = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
