/**
 * Karama Homely Mess - Unified Date Formatting Utilities
 * Standardized format: dd-mmm-yyyy (e.g. 19-Nov-2026, 31-Oct-2026)
 */

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Formats any date string, ISO timestamp, or Date object into 'dd-mmm-yyyy'
 * Examples:
 *   '2026-11-19'       => '19-Nov-2026'
 *   '2026-10-31'       => '31-Oct-2026'
 *   '31 Oct 2026'      => '31-Oct-2026'
 *   '19-11-2026'       => '19-Nov-2026'
 *   new Date()         => '19-Nov-2026'
 */
export function formatDateDDMMMYYYY(dateInput?: string | Date | null): string {
  if (!dateInput) return '-';

  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    if (!trimmed || trimmed === '-' || trimmed === 'N/A' || trimmed.toLowerCase() === 'undefined') {
      return '-';
    }

    // Already in dd-mmm-yyyy or dd mmm yyyy (e.g. 31-Oct-2026 or 31 Oct 2026)
    const ddmmyyyyMatch = trimmed.match(/^(\d{1,2})[-/ ]([A-Za-z]{3})[-/ ](\d{4})$/);
    if (ddmmyyyyMatch) {
      const day = ddmmyyyyMatch[1].padStart(2, '0');
      const monStr = ddmmyyyyMatch[2];
      const mon = monStr.charAt(0).toUpperCase() + monStr.slice(1).toLowerCase();
      const year = ddmmyyyyMatch[3];
      return `${day}-${mon}-${year}`;
    }

    // ISO format: YYYY-MM-DD
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const year = isoMatch[1];
      const monthIdx = parseInt(isoMatch[2], 10) - 1;
      const day = isoMatch[3].padStart(2, '0');
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${day}-${MONTH_NAMES[monthIdx]}-${year}`;
      }
    }

    // DD-MM-YYYY format: DD-MM-YYYY
    const ddmmyyyyNumMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (ddmmyyyyNumMatch) {
      const day = ddmmyyyyNumMatch[1].padStart(2, '0');
      const monthIdx = parseInt(ddmmyyyyNumMatch[2], 10) - 1;
      const year = ddmmyyyyNumMatch[3];
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${day}-${MONTH_NAMES[monthIdx]}-${year}`;
      }
    }
  }

  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) {
    return typeof dateInput === 'string' ? dateInput : '-';
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export const formatDisplayDate = formatDateDDMMMYYYY;

/**
 * Returns today's date formatted as ISO YYYY-MM-DD
 */
export function getTodayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adds or subtracts days from a Date object or ISO string, returning ISO YYYY-MM-DD
 */
export function addDaysISO(dateInput: string | Date = new Date(), days: number): string {
  let d: Date;
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    const parts = trimmed.split('-');
    if (parts.length === 3) {
      d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      d = new Date(trimmed);
    }
  } else {
    d = new Date(dateInput.getTime());
  }

  if (isNaN(d.getTime())) {
    d = new Date();
  }

  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

