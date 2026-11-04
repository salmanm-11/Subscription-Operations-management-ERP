import { describe, it, expect, beforeEach } from 'vitest';
import { ActivityLogService } from '../src/api/activityLogService';

// Mock localStorage for Vitest Node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('System Activity & User Audit Log Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. should return seeded activity logs on initialization', () => {
    const logs = ActivityLogService.getLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].timestamp).toBeDefined();
    expect(logs[0].userName).toBeDefined();
    expect(logs[0].details).toBeDefined();
  });

  it('2. should log customer addition with exact person operating details', () => {
    const newLog = ActivityLogService.logAction(
      'Customers',
      'ADD',
      'New Customer Added',
      'Added customer "Mohan Lal" in Era Building Apt 304 (Monthly Rate: AED 380.00)',
      { userName: 'manager', userRole: 'Operations Manager' }
    );

    expect(newLog.id).toBeDefined();
    expect(newLog.userName).toBe('manager');
    expect(newLog.userRole).toBe('Operations Manager');
    expect(newLog.module).toBe('Customers');
    expect(newLog.action).toBe('ADD');
    expect(newLog.details).toContain('Mohan Lal');

    const allLogs = ActivityLogService.getLogs();
    expect(allLogs[0].id).toBe(newLog.id);
  });

  it('3. should log customer payment received by admin', () => {
    const paymentLog = ActivityLogService.logAction(
      'Payments',
      'PAYMENT',
      'Customer Payment Received',
      'Recorded payment of AED 310.00 for Salman Mohammed via Bank Transfer (Ref: TRF-901)',
      { userName: 'admin', userRole: 'Administrator' }
    );

    expect(paymentLog.userName).toBe('admin');
    expect(paymentLog.module).toBe('Payments');
    expect(paymentLog.action).toBe('PAYMENT');
    expect(paymentLog.details).toContain('AED 310.00');
  });

  it('4. should log authentication login and logout events', () => {
    const loginLog = ActivityLogService.logAction(
      'Authentication',
      'LOGIN',
      'User Login Session',
      'User "manager" logged into the application.',
      { userName: 'manager', userRole: 'Operations Manager' }
    );

    expect(loginLog.action).toBe('LOGIN');
    expect(loginLog.userName).toBe('manager');

    const logoutLog = ActivityLogService.logAction(
      'Authentication',
      'LOGOUT',
      'User Logged Out',
      'User "manager" logged out of the application.',
      { userName: 'manager', userRole: 'Operations Manager' }
    );

    expect(logoutLog.action).toBe('LOGOUT');
  });

  it('5. should support clearing logs and creating audit marker', () => {
    ActivityLogService.clearLogs('admin');
    const logs = ActivityLogService.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].title).toBe('Activity Logs Reset');
    expect(logs[0].details).toContain('cleared by user "admin"');
  });

  it('6. should support permanently deleting all logs with confirmation', () => {
    ActivityLogService.logAction('Settings', 'DELETE', 'Test Delete', 'Testing deletion');
    expect(ActivityLogService.getLogs().length).toBeGreaterThan(0);
    
    // Action: Delete all logs
    ActivityLogService.deleteAllLogs();
    const logsAfter = ActivityLogService.getLogs();
    expect(logsAfter.length).toBe(0);
  });

  it('7. should support deleting a single log entry by id', () => {
    const log1 = ActivityLogService.logAction('Settings', 'ADD', 'Log 1', 'Test entry 1');
    const log2 = ActivityLogService.logAction('Settings', 'ADD', 'Log 2', 'Test entry 2');
    
    const countBefore = ActivityLogService.getLogs().length;
    const deleted = ActivityLogService.deleteLog(log1.id);
    expect(deleted).toBe(true);
    
    const countAfter = ActivityLogService.getLogs().length;
    expect(countAfter).toBe(countBefore - 1);
    expect(ActivityLogService.getLogs().some(l => l.id === log1.id)).toBe(false);
  });
});
