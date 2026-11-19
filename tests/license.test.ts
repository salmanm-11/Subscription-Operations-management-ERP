import { describe, it, expect, beforeEach } from 'vitest';
import { OfflineStorage } from '../src/api/offlineStorage';
import { AuthService } from '../src/api/authService';
import { checkSystemLicense } from '../src/api/supabase';

// Mock localStorage for Vitest environment
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

describe('Remote License Kill Switch & Master Developer Override', () => {
  beforeEach(() => {
    localStorage.clear();
    OfflineStorage.init();
    AuthService.init();
    OfflineStorage.setLicenseStatus('ACTIVE');
  });

  it('reports active system status under normal license conditions', async () => {
    const res = await checkSystemLicense();
    expect(res.isLocked).toBe(false);
    expect(res.status).toBe('ACTIVE');
  }, 15000);

  it('triggers local and remote lockout when license is suspended', async () => {
    OfflineStorage.setLicenseStatus('SUSPENDED: Payment overdue - please contact developer');
    const res = await checkSystemLicense();
    expect(res.isLocked).toBe(true);
    expect(res.status).toBe('SUSPENDED');
    expect(res.reason).toContain('Payment overdue');
    expect(res.contactEmail).toBeDefined();
  }, 15000);

  it('allows master developer credentials to bypass and access system anytime', () => {
    // Developer login must always succeed
    const devLogin = AuthService.login('developer', 'Dev@Karama#2026');
    expect(devLogin.success).toBe(true);
    expect(devLogin.user?.role).toBe('admin');
    expect(devLogin.user?.roleTitle).toBe('Developer (Super Admin)');
  });

  it('restores active status when developer unlocks license', async () => {
    OfflineStorage.setLicenseStatus('SUSPENDED: Payment overdue');
    expect((await checkSystemLicense()).isLocked).toBe(true);

    // Developer restores license
    OfflineStorage.setLicenseStatus('ACTIVE');
    const unlockedRes = await checkSystemLicense();
    expect(unlockedRes.isLocked).toBe(false);
    expect(unlockedRes.status).toBe('ACTIVE');
  }, 15000);
});
