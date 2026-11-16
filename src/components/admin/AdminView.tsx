import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  KeyRound, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Shield, 
  X,
  Eye,
  EyeOff,
  UserCheck,
  Info
} from 'lucide-react';
import { AuthService, AppUser } from '../../api/authService';
import { ActivityLogService } from '../../api/activityLogService';

interface AdminViewProps {
  currentUser: AppUser;
  onUserSessionUpdate?: (user: AppUser) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ currentUser, onUserSessionUpdate }) => {
  const [users, setUsers] = useState<AppUser[]>(AuthService.getUsers());
  const [recoveryCode, setRecoveryCodeState] = useState<string>(AuthService.getRecoveryCode());
  const [isEditingRecovery, setIsEditingRecovery] = useState(false);
  const [newRecoveryCode, setNewRecoveryCode] = useState(recoveryCode);
  const [showRecoveryCode, setShowRecoveryCode] = useState(false);

  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  // Password change form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Add/Edit user form
  const [formUsername, setFormUsername] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'manager' | 'viewer'>('viewer');
  const [formPassword, setFormPassword] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const refreshUsers = () => {
    const updated = AuthService.getUsers();
    setUsers(updated);
  };

  // Open password modal
  const handleOpenPasswordModal = (user: AppUser) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    setPasswordSuccess(null);
    setIsPasswordModalOpen(true);
  };

  // Handle password save
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!selectedUser) return;
    if (newPassword.length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    selectedUser.passwordHash = newPassword;
    AuthService.saveUser(selectedUser);
    ActivityLogService.logAction(
      'Authentication',
      'PASSWORD_CHANGE',
      'User Password Changed',
      `Password for user "${selectedUser.username}" was updated by ${currentUser.username}.`
    );
    refreshUsers();
    setPasswordSuccess(`Password for ${selectedUser.username} updated successfully!`);

    if (currentUser.id === selectedUser.id && onUserSessionUpdate) {
      onUserSessionUpdate(selectedUser);
    }

    setTimeout(() => {
      setIsPasswordModalOpen(false);
    }, 1200);
  };

  // Open edit modal
  const handleOpenEditModal = (user: AppUser) => {
    setSelectedUser(user);
    setFormUsername(user.username);
    setFormFullName(user.fullName);
    setFormRole(user.role === 'admin' ? 'admin' : user.role === 'viewer' ? 'viewer' : 'manager');
    setFormEmail(user.email || '');
    setFormPhone(user.phone || '');
    setFormError(null);
    setIsEditUserModalOpen(true);
  };

  // Save edit user
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedUser) return;

    selectedUser.fullName = formFullName.trim();
    selectedUser.role = formRole;
    selectedUser.roleTitle = formRole === 'admin' ? 'Administrator' : formRole === 'viewer' ? 'Viewer (Read-Only)' : 'Operations Manager';
    selectedUser.email = formEmail.trim();
    selectedUser.phone = formPhone.trim();

    AuthService.saveUser(selectedUser);
    ActivityLogService.logAction(
      'Authentication',
      'UPDATE',
      'User Account Updated',
      `User account "${selectedUser.username}" profile was updated by ${currentUser.username}.`
    );
    refreshUsers();

    if (currentUser.id === selectedUser.id && onUserSessionUpdate) {
      onUserSessionUpdate(selectedUser);
    }

    setIsEditUserModalOpen(false);
  };

  // Open add user modal
  const handleOpenAddUserModal = () => {
    setFormUsername('');
    setFormFullName('');
    setFormRole('viewer');
    setFormPassword('');
    setFormEmail('');
    setFormPhone('');
    setFormError(null);
    setIsAddUserModalOpen(true);
  };

  // Save new user
  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formUsername || !formFullName || !formPassword) {
      setFormError('Please fill out all required fields.');
      return;
    }

    if (users.some((u) => u.username.toLowerCase() === formUsername.trim().toLowerCase())) {
      setFormError(`Username '${formUsername}' already exists. Please choose a different username.`);
      return;
    }

    AuthService.saveUser({
      username: formUsername.trim().toLowerCase(),
      fullName: formFullName.trim(),
      role: formRole,
      roleTitle: formRole === 'admin' ? 'Administrator' : formRole === 'viewer' ? 'Viewer (Read-Only)' : 'Operations Manager',
      passwordHash: formPassword,
      email: formEmail.trim(),
      phone: formPhone.trim(),
    });

    ActivityLogService.logAction(
      'Authentication',
      'ADD',
      'New User Created',
      `Registered user account "${formUsername.trim().toLowerCase()}" (${formRole === 'admin' ? 'Administrator' : formRole === 'viewer' ? 'Viewer (Read-Only)' : 'Operations Manager'}) by ${currentUser.username}.`
    );

    refreshUsers();
    setIsAddUserModalOpen(false);
  };

  // Delete user
  const handleDeleteUser = (user: AppUser) => {
    if (user.username === 'admin') {
      alert('The primary Admin account cannot be deleted.');
      return;
    }

    if (confirm(`Are you sure you want to remove user account '${user.username}' (${user.fullName})?`)) {
      AuthService.deleteUser(user.id);
      refreshUsers();
    }
  };

  // Save master recovery code
  const handleSaveRecoveryCode = () => {
    if (newRecoveryCode.trim().length < 4) {
      alert('Recovery code must be at least 4 characters long.');
      return;
    }
    AuthService.setRecoveryCode(newRecoveryCode.trim());
    setRecoveryCodeState(newRecoveryCode.trim());
    setIsEditingRecovery(false);
    alert('Master recovery code updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Admin &amp; User Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
            Manage system administrators, manager accounts, credentials, and password recovery
          </p>
        </div>

        <button
          onClick={handleOpenAddUserModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Permission & Access Information Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3 shadow-md shadow-black/10">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-300 text-sm">Full System Access Active for Both Accounts</div>
          <p className="leading-relaxed">
            As requested, both the <strong>admin</strong> and <strong>manager</strong> accounts currently have complete, unrestricted access to all modules (Customers, Buildings, Meal Plans, Attendance, Invoices, Receipts, Overdue Accounts, and Reports). You can change or restrict permissions later whenever needed.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-xl p-4 shadow-md shadow-black/20">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Users</div>
          <div className="text-2xl font-black text-white mt-1">{users.length} Accounts</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">Ready for Desktop Access</div>
        </div>

        {/* Primary Admin */}
        <div className="bg-[#151c2c] border border-amber-500/30 rounded-xl p-4 shadow-md shadow-black/20">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Primary Admin</div>
          <div className="text-xl font-black text-white mt-1">👑 admin</div>
          <div className="text-[11px] text-slate-400 mt-1">Full System Authority</div>
        </div>

        {/* Operations Manager */}
        <div className="bg-[#151c2c] border border-sky-500/30 rounded-xl p-4 shadow-md shadow-black/20">
          <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">Operations Manager</div>
          <div className="text-xl font-black text-white mt-1">💼 manager</div>
          <div className="text-[11px] text-slate-400 mt-1">Mess Operations &amp; Billing</div>
        </div>

        {/* Master Recovery Code */}
        <div className="bg-[#151c2c] border border-emerald-500/30 rounded-xl p-4 shadow-md shadow-black/20">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Forgot Password Key</div>
            <button
              type="button"
              onClick={() => setShowRecoveryCode(!showRecoveryCode)}
              className="text-slate-400 hover:text-emerald-400 transition-colors p-1"
              title={showRecoveryCode ? "Hide recovery key" : "Show recovery key"}
            >
              {showRecoveryCode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-lg font-black font-mono text-emerald-300 mt-1 truncate">
            {showRecoveryCode ? recoveryCode : '••••••••••••'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Used for Emergency Reset</div>
        </div>
      </div>

      {/* User Accounts Table */}
      <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Authorized Software Accounts</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click "Change Password" to customize any account's password</span>
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left min-w-[960px]">
            <thead>
              <tr className="bg-[#0f1422] text-slate-300 border-b border-slate-700/80 text-xs uppercase tracking-wider font-bold">
                <th className="py-3 px-4 whitespace-nowrap min-w-[180px]">User</th>
                <th className="py-3 px-4 whitespace-nowrap min-w-[130px]">Assigned Role</th>
                <th className="py-3 px-4 whitespace-nowrap min-w-[130px]">Access Level</th>
                <th className="py-3 px-4 whitespace-nowrap min-w-[130px]">Password</th>
                <th className="py-3 px-4 whitespace-nowrap min-w-[130px]">Contact</th>
                <th className="py-3 px-4 text-center whitespace-nowrap min-w-[100px]">Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap min-w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
              {users.map((u) => {
                const isCurrent = currentUser.username.toLowerCase() === u.username.toLowerCase();
                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors group">
                    {/* User Identity */}
                    <td className="py-3.5 px-4 min-w-[180px]">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${
                          u.role === 'admin'
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                            : u.role === 'viewer'
                            ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                            : 'bg-sky-500/15 border-sky-500/30 text-sky-300'
                        }`}>
                          {u.username === 'admin' ? '👑' : u.role === 'viewer' ? '👁️' : '💼'}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                            <span>{u.fullName}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                You
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-xs text-amber-400 font-semibold mt-0.5">
                            @{u.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Role */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                        u.role === 'admin'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : u.role === 'viewer'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                      }`}>
                        {u.roleTitle}
                      </span>
                    </td>

                    {/* Access Level */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {u.role === 'viewer' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-bold">
                          <span>👁️ View Only (No Edits)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Full Unrestricted Access</span>
                        </span>
                      )}
                    </td>

                    {/* Password Status */}
                    <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">••••••••</span>
                        <button
                          onClick={() => handleOpenPasswordModal(u)}
                          className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
                        >
                          Change
                        </button>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      <div>{u.email || '-'}</div>
                      <div className="text-slate-500">{u.phone || ''}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        Active
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap min-w-[120px]">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700/60 shadow-sm"
                          title="Edit Profile"
                        >
                          <Edit className="w-3.5 h-3.5 text-amber-400" />
                        </button>

                        {u.username !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors border border-rose-500/20 shadow-sm"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Master Recovery Code Settings Card */}
      <div className="bg-[#151c2c] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Forgot Password - Master Recovery Key</h3>
          </div>
          {!isEditingRecovery && (
            <button
              onClick={() => {
                setNewRecoveryCode(recoveryCode);
                setIsEditingRecovery(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
            >
              Change Recovery Key
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The Master Recovery Key is requested on the "Forgot Password" screen if an admin or manager forgets their password. It allows immediate password reset without email or internet access.
        </p>

        {isEditingRecovery ? (
          <div className="flex items-center gap-3 pt-2">
            <input
              type={showRecoveryCode ? "text" : "password"}
              value={newRecoveryCode}
              onChange={(e) => setNewRecoveryCode(e.target.value)}
              placeholder="Enter new master key (min 4 characters)"
              className="px-3.5 py-2 bg-slate-900 border border-amber-500 rounded-xl text-white font-mono text-xs focus:outline-none w-64"
            />
            <button
              type="button"
              onClick={() => setShowRecoveryCode(!showRecoveryCode)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={showRecoveryCode ? "Hide key" : "Show key"}
            >
              {showRecoveryCode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleSaveRecoveryCode}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
            >
              Save Key
            </button>
            <button
              onClick={() => setIsEditingRecovery(false)}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 font-mono text-sm text-emerald-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 w-fit">
            <span>🔑 Current Key:</span>
            <span className="font-bold tracking-widest">{showRecoveryCode ? recoveryCode : '••••••••••••'}</span>
            <button
              type="button"
              onClick={() => setShowRecoveryCode(!showRecoveryCode)}
              className="p-1 text-slate-400 hover:text-emerald-400 transition-colors ml-1"
              title={showRecoveryCode ? "Hide key" : "Show key"}
            >
              {showRecoveryCode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Change Password</h3>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">
                  User: @{selectedUser.username} ({selectedUser.fullName})
                </p>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4 text-xs sm:text-sm">
              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 text-xs uppercase tracking-wider">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 4 chars)"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 text-xs uppercase tracking-wider">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditUserModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Edit User Account</h3>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">@{selectedUser.username}</p>
              </div>
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 text-xs">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 text-xs">Assigned Role</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as 'admin' | 'manager' | 'viewer')}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="viewer">Viewer (Read-Only - No Adding or Editing)</option>
                  <option value="manager">Operations Manager (Full Access)</option>
                  <option value="admin">Administrator (System Owner)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 text-xs">Contact Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="user@karamamess.ae"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 text-xs">Phone Number</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New User Account</h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewUser} className="space-y-4 text-xs sm:text-sm">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 text-xs">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  placeholder="e.g. Anand Kumar"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 text-xs">Username *</label>
                <input
                  type="text"
                  required
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder="e.g. supervisor1"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 text-xs">Role</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as 'admin' | 'manager' | 'viewer')}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="viewer">Viewer (Read-Only - No Adding or Editing)</option>
                  <option value="manager">Operations Manager (Full Access)</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 text-xs">Initial Password *</label>
                <input
                  type="password"
                  required
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Enter initial password"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
