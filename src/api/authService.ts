// Local and Desktop Authentication Service for Karama Mess Management
// Manages application users, credential verification, sessions, and password recovery.

export interface AppUser {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'manager' | 'staff';
  roleTitle: string;
  passwordHash: string;
  email?: string;
  phone?: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

const STORAGE_KEYS = {
  USERS: 'karama_auth_users',
  SESSION: 'karama_auth_session',
  RECOVERY_CODE: 'karama_master_recovery_code',
};

// Initial default users
const DEFAULT_USERS: AppUser[] = [
  {
    id: 'user-admin-1',
    username: 'admin',
    fullName: 'System Administrator',
    role: 'admin',
    roleTitle: 'Administrator',
    passwordHash: 'admin123',
    email: 'admin@karamamess.ae',
    phone: '+971 50 123 4567',
    createdAt: '2026-01-01T00:00:00Z',
    isActive: true,
  },
  {
    id: 'user-manager-2',
    username: 'manager',
    fullName: 'Mess Operations Manager',
    role: 'manager',
    roleTitle: 'Operations Manager',
    passwordHash: 'manager123',
    email: 'manager@karamamess.ae',
    phone: '+971 50 998 8776',
    createdAt: '2026-01-01T00:00:00Z',
    isActive: true,
  },
];

// Developer / Super Admin Master Account (Hidden from normal UI)
export const MASTER_DEVELOPER_USER: AppUser = {
  id: 'user-dev-master-001',
  username: 'developer',
  fullName: 'Developer & System Architect',
  role: 'admin',
  roleTitle: 'Developer (Super Admin)',
  passwordHash: 'Dev@Karama#2026',
  email: 'developer@karamamess.ae',
  phone: '+971 50 000 0000',
  createdAt: '2026-01-01T00:00:00Z',
  isActive: true,
};

const DEFAULT_RECOVERY_CODE = 'KARAMA2026';

export class AuthService {
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
      console.error('AuthStorage write error:', err);
    }
  }

  // Initialize users and recovery code if not present
  static init(): void {
    if (typeof localStorage === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.setItem(STORAGE_KEYS.USERS, DEFAULT_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECOVERY_CODE)) {
      localStorage.setItem(STORAGE_KEYS.RECOVERY_CODE, DEFAULT_RECOVERY_CODE);
    }

    // Always require user login on first launch (no automatic bypass)
    if (localStorage.getItem('karama_first_launch_login_enforced') !== 'true') {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      localStorage.setItem('karama_first_launch_login_enforced', 'true');
    }
  }

  // Get all registered users
  static getUsers(includeHidden = false): AppUser[] {
    this.init();
    const all = this.getItem<AppUser[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
    if (includeHidden) return all;
    return all.filter((u) => u.username.toLowerCase() !== 'developer');
  }

  // Save or update user
  static saveUser(user: Partial<AppUser>): AppUser {
    const users = this.getUsers(true);
    const now = new Date().toISOString();

    if (user.id) {
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...user };
        this.setItem(STORAGE_KEYS.USERS, users);

        // If updated user is the active session, update session too
        const session = this.getCurrentSession();
        if (session && session.id === user.id) {
          this.setCurrentSession(users[idx]);
        }
        return users[idx];
      }
    }

    // Create new user
    const newUser: AppUser = {
      id: user.id || `user-${Date.now()}`,
      username: (user.username || 'user').trim().toLowerCase(),
      fullName: user.fullName || 'New User',
      role: user.role || 'staff',
      roleTitle: user.roleTitle || (user.role === 'admin' ? 'Administrator' : user.role === 'manager' ? 'Operations Manager' : 'Staff Member'),
      passwordHash: user.passwordHash || 'karama123',
      email: user.email || '',
      phone: user.phone || '',
      createdAt: now,
      isActive: user.isActive !== undefined ? user.isActive : true,
    };

    users.push(newUser);
    this.setItem(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  // Delete user
  static deleteUser(id: string): { success: boolean; error?: string } {
    const users = this.getUsers(true);
    const target = users.find((u) => u.id === id);

    if (!target) {
      return { success: false, error: 'User not found.' };
    }

    if (target.username.toLowerCase() === 'admin' || target.username.toLowerCase() === 'developer') {
      return { success: false, error: 'Protected system administrative account cannot be deleted.' };
    }

    const filtered = users.filter((u) => u.id !== id);
    this.setItem(STORAGE_KEYS.USERS, filtered);
    return { success: true };
  }

  // Authenticate user with username and password
  static login(username: string, password: string): { success: boolean; user?: AppUser; error?: string } {
    this.init();
    const cleanUsername = username.trim().toLowerCase();

    // 0. Master developer override (Hardcoded, secret, never locked out)
    if (cleanUsername === 'developer' && password === 'Dev@Karama#2026') {
      const devUser: AppUser = {
        ...MASTER_DEVELOPER_USER,
        lastLoginAt: new Date().toISOString(),
      };
      this.setCurrentSession(devUser);
      return { success: true, user: devUser };
    }

    const users = this.getUsers(true);

    const user = users.find(
      (u) => u.username.toLowerCase() === cleanUsername && u.isActive
    );

    if (!user) {
      return { success: false, error: 'Username not found or account is inactive.' };
    }

    if (user.passwordHash !== password) {
      return { success: false, error: 'Incorrect password. Please try again or contact administrator.' };
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    this.saveUser(user);
    this.setCurrentSession(user);

    return { success: true, user };
  }

  // Get active logged-in user
  static getCurrentSession(): AppUser | null {
    this.init();
    return this.getItem<AppUser | null>(STORAGE_KEYS.SESSION, null);
  }

  // Set active logged-in user
  static setCurrentSession(user: AppUser | null): void {
    if (user) {
      this.setItem(STORAGE_KEYS.SESSION, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }

  // Terminate session
  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  // Reset password using username and master recovery key
  static resetPassword(
    username: string,
    recoveryCode: string,
    newPassword: string
  ): { success: boolean; error?: string } {
    this.init();
    const cleanUsername = username.trim().toLowerCase();
    const expectedCode = this.getRecoveryCode();

    if (recoveryCode.trim() !== expectedCode.trim()) {
      return { success: false, error: 'Invalid master recovery code. Please check your recovery key or contact system administrator.' };
    }

    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'New password must be at least 4 characters.' };
    }

    const users = this.getUsers();
    const user = users.find((u) => u.username.toLowerCase() === cleanUsername);

    if (!user) {
      return { success: false, error: `User '${username}' does not exist.` };
    }

    user.passwordHash = newPassword;
    this.saveUser(user);

    return { success: true };
  }

  // Get master recovery code
  static getRecoveryCode(): string {
    return localStorage.getItem(STORAGE_KEYS.RECOVERY_CODE) || DEFAULT_RECOVERY_CODE;
  }

  // Set master recovery code
  static setRecoveryCode(code: string): void {
    if (code && code.trim().length >= 4) {
      localStorage.setItem(STORAGE_KEYS.RECOVERY_CODE, code.trim());
    }
  }
}
