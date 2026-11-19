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
