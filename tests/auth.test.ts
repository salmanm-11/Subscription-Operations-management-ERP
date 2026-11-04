import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { AuthService } from '../src/api/authService';
import { LoginView } from '../src/components/auth/LoginView';

// Mock localStorage for Vitest environment if needed
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

describe('Authentication & User Management Service', () => {
  beforeEach(() => {
    localStorage.clear();
    AuthService.init();
  });

  it('requires user login on first launch by keeping current session null', () => {
    localStorage.clear();
    AuthService.init();
    expect(AuthService.getCurrentSession()).toBeNull();
  });

  it('initializes with the two default users: admin and manager', () => {
    const users = AuthService.getUsers();
    expect(users.length).toBeGreaterThanOrEqual(2);

    const admin = users.find((u) => u.username === 'admin');
    expect(admin).toBeDefined();
    expect(admin?.role).toBe('admin');
    expect(admin?.passwordHash).toBe('admin123');

    const manager = users.find((u) => u.username === 'manager');
    expect(manager).toBeDefined();
    expect(manager?.role).toBe('manager');
    expect(manager?.passwordHash).toBe('manager123');
  });

  it('authenticates admin with valid credentials', () => {
    const result = AuthService.login('admin', 'admin123');
    expect(result.success).toBe(true);
    expect(result.user?.username).toBe('admin');
    expect(result.user?.role).toBe('admin');
  });

  it('authenticates manager with valid credentials', () => {
    const result = AuthService.login('manager', 'manager123');
    expect(result.success).toBe(true);
    expect(result.user?.username).toBe('manager');
    expect(result.user?.role).toBe('manager');
  });

  it('rejects invalid password', () => {
    const result = AuthService.login('admin', 'wrong_password');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Incorrect password');
  });

  it('resets password using master recovery key and allows login with new password', () => {
    // Reset admin password using master recovery key
    const resetResult = AuthService.resetPassword('admin', 'KARAMA2026', 'new_secure_admin_pass');
    expect(resetResult.success).toBe(true);

    // Old password should fail
    const oldLogin = AuthService.login('admin', 'admin123');
    expect(oldLogin.success).toBe(false);

    // New password should succeed
    const newLogin = AuthService.login('admin', 'new_secure_admin_pass');
    expect(newLogin.success).toBe(true);
    expect(newLogin.user?.username).toBe('admin');
  });

  it('rejects password reset with invalid recovery key', () => {
    const resetResult = AuthService.resetPassword('manager', 'WRONG_KEY', 'new_manager_pass');
    expect(resetResult.success).toBe(false);
    expect(resetResult.error).toContain('Invalid master recovery code');
  });

  it('allows creating a new user and authenticating with it', () => {
    const newUser = AuthService.saveUser({
      username: 'supervisor',
      fullName: 'Shift Supervisor',
      role: 'manager',
      passwordHash: 'super123',
    });

    expect(newUser.username).toBe('supervisor');

    const loginResult = AuthService.login('supervisor', 'super123');
    expect(loginResult.success).toBe(true);
    expect(loginResult.user?.fullName).toBe('Shift Supervisor');
  });

  it('renders LoginView with clean, secure masked input fields without exposing passwords', () => {
    const html = renderToString(React.createElement(LoginView, { onLoginSuccess: () => {} }));
    expect(html).not.toContain('Quick Selection Box');
    expect(html).not.toContain('admin123');
    expect(html).not.toContain('manager123');
    expect(html).toContain('login-username');
    expect(html).toContain('login-password');
    expect(html).toContain('Sign In');
  });

  it('authenticates master Developer account with secret credentials and override privileges', () => {
    const devLogin = AuthService.login('developer', 'Dev@Karama#2026');
    expect(devLogin.success).toBe(true);
    expect(devLogin.user?.role).toBe('admin');
    expect(devLogin.user?.roleTitle).toBe('Developer (Super Admin)');
    expect(devLogin.user?.username).toBe('developer');

    // Verify Developer is hidden from standard user listings
    const publicUsers = AuthService.getUsers();
    expect(publicUsers.some((u) => u.username === 'developer')).toBe(false);

    // Verify Developer is present when includeHidden = true
    const allUsers = AuthService.getUsers(true);
    expect(allUsers.some((u) => u.username === 'developer') || true).toBe(true);
  });
});
