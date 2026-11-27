import * as XLSX from 'xlsx';
import { SystemActivityLog, LogModuleType, LogActionType } from '../types';
import { AuthService } from './authService';

const STORAGE_KEY = 'karama_system_activity_logs';

const getInitialLogs = (): SystemActivityLog[] => {
  return [
    {
      id: 'log-init-1',
      timestamp: '2026-10-01T00:00:00.000Z',
      userName: 'admin',
      userRole: 'Administrator',
      module: 'Settings',
      action: 'ADD',
      title: 'Database Initialized (Clean Production Slate)',
      details: 'All demo and sample records cleared. Ready for live mess operations.',
      status: 'success'
    }
  ];
};

export class ActivityLogService {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      if (typeof localStorage === 'undefined') return defaultValue;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('ActivityLog write error:', err);
    }
  }

  static getLogs(): SystemActivityLog[] {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        }
      } catch {}
    }
    return getInitialLogs();
  }

  static logAction(
    module: LogModuleType,
    action: LogActionType,
    title: string,
    details: string,
    options?: {
      userName?: string;
      userRole?: string;
      entityId?: string;
      status?: 'success' | 'warning' | 'info';
    }
  ): SystemActivityLog {
    const currentSession = AuthService.getCurrentSession();
    const userName = options?.userName || currentSession?.username || 'admin';
    const userRole = options?.userRole || currentSession?.roleTitle || (userName === 'admin' ? 'Administrator' : 'Operations Manager');

    const newLog: SystemActivityLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userName,
      userRole,
      module,
      action,
      title,
      details,
      entityId: options?.entityId,
      status: options?.status || 'success'
    };

    const logs = this.getItem<SystemActivityLog[]>(STORAGE_KEY, getInitialLogs());
    logs.unshift(newLog);

    // Keep up to 1,500 entries to prevent memory overflow
    if (logs.length > 1500) {
      logs.length = 1500;
    }

    this.setItem(STORAGE_KEY, logs);
    return newLog;
  }

  static clearLogs(clearedBy = 'admin'): void {
    const resetLog: SystemActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: clearedBy,
      userRole: clearedBy === 'admin' ? 'Administrator' : 'Operations Manager',
      module: 'Settings',
      action: 'DELETE',
      title: 'Activity Logs Reset',
      details: `Activity logs were cleared by user "${clearedBy}".`,
      status: 'warning'
    };
    this.setItem(STORAGE_KEY, [resetLog]);
  }

  /**
   * Permanently deletes all activity logs (0 records remain).
   */
  static deleteAllLogs(): void {
    if (typeof localStorage === 'undefined') return;
    this.setItem(STORAGE_KEY, []);
  }

  /**
   * Deletes a single activity log entry by ID.
   */
  static deleteLog(id: string): boolean {
    const logs = this.getLogs();
    const filtered = logs.filter(l => l.id !== id);
    if (filtered.length !== logs.length) {
      this.setItem(STORAGE_KEY, filtered);
      return true;
    }
    return false;
  }

  static exportLogsToExcel(logs: SystemActivityLog[], format: 'xlsx' | 'csv' = 'xlsx'): void {
    const exportRows = logs.map(l => ({
      'Log ID': l.id,
      'Timestamp (UTC)': l.timestamp.replace('T', ' ').slice(0, 19),
      'User Name': l.userName,
      'User Role': l.userRole || '-',
      'Module': l.module,
      'Action': l.action,
      'Event Title': l.title,
      'Detailed Log Description': l.details,
      'Entity ID': l.entityId || '-',
      'Status': (l.status || 'success').toUpperCase()
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportRows);

    // Auto fit column widths
    const colKeys = Object.keys(exportRows[0] || {});
    ws['!cols'] = colKeys.map(k => ({ wch: Math.max(k.length + 3, 15) }));

    XLSX.utils.book_append_sheet(wb, ws, 'Activity Logs');
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `Orbit_Activity_Logs_${dateStr}`;

    if (format === 'csv') {
      XLSX.writeFile(wb, `${filename}.csv`, { bookType: 'csv' });
    } else {
      XLSX.writeFile(wb, `${filename}.xlsx`, { bookType: 'xlsx' });
    }
  }
}
