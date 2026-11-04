import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  RefreshCw, 
  User, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  Layers, 
  Tag, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Building,
  CreditCard,
  Utensils,
  Settings,
  LogIn,
  FileSpreadsheet
} from 'lucide-react';
import { SystemActivityLog, LogModuleType, LogActionType } from '../../types';
import { ActivityLogService } from '../../api/activityLogService';

interface ActivityLogViewProps {
  currentUsername?: string;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ currentUsername = 'admin' }) => {
  const [logs, setLogs] = useState<SystemActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadLogs = () => {
    const list = ActivityLogService.getLogs();
    setLogs(list);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleConfirmDeleteAll = () => {
    const count = logs.length;
    ActivityLogService.deleteAllLogs();
    loadLogs();
    setIsDeleteModalOpen(false);
    setSuccessMessage(`All ${count} system activity log records have been permanently deleted.`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  const handleDeleteSingle = (id: string, title: string) => {
    if (confirm(`Delete this activity log entry: "${title}"?`)) {
      ActivityLogService.deleteLog(id);
      loadLogs();
    }
  };

  const handleExport = (format: 'xlsx' | 'csv') => {
    ActivityLogService.exportLogsToExcel(filteredLogs, format);
  };

  // Date filtering logic
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const yesterday = new Date(now.getTime() - 86400000);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];
  const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const filteredLogs = logs.filter((log) => {
    // Search match
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      log.userName.toLowerCase().includes(term) ||
      (log.userRole && log.userRole.toLowerCase().includes(term)) ||
      log.module.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      log.title.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term);

    // User filter
    const matchesUser = userFilter === 'all' || log.userName.toLowerCase() === userFilter.toLowerCase();

    // Module filter
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;

    // Action filter
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;

    // Date filter
    let matchesDate = true;
    const logDate = log.timestamp.split('T')[0];
    if (dateFilter === 'today') {
      matchesDate = logDate === todayStr;
    } else if (dateFilter === 'yesterday') {
      matchesDate = logDate === yesterdayStr;
    } else if (dateFilter === 'week') {
      matchesDate = logDate >= sevenDaysAgo;
    } else if (dateFilter === 'month') {
      matchesDate = logDate.startsWith(thisMonthStr);
    }

    return matchesSearch && matchesUser && matchesModule && matchesAction && matchesDate;
  });

  // Calculate top statistics
  const totalEvents = logs.length;
  const uniqueUsers = Array.from(new Set(logs.map(l => l.userName)));
  const todayEvents = logs.filter(l => l.timestamp.startsWith(todayStr)).length;
  
  // Count by user
  const adminCount = logs.filter(l => l.userName === 'admin').length;
  const managerCount = logs.filter(l => l.userName === 'manager').length;
  const topOperator = adminCount >= managerCount ? 'admin' : 'manager';

  const getModuleIcon = (mod: LogModuleType) => {
    switch (mod) {
      case 'Customers':
        return <User className="w-3.5 h-3.5 text-amber-400" />;
      case 'Billing':
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case 'Payments':
        return <CreditCard className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Vendors':
        return <Building className="w-3.5 h-3.5 text-purple-400" />;
      case 'Attendance':
        return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      case 'Authentication':
        return <LogIn className="w-3.5 h-3.5 text-sky-400" />;
      case 'Settings':
        return <Settings className="w-3.5 h-3.5 text-slate-400" />;
      default:
        return <Tag className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getActionBadge = (action: LogActionType) => {
    switch (action) {
      case 'ADD':
        return (
          <span className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
            + ADDED
          </span>
        );
      case 'UPDATE':
        return (
          <span className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 whitespace-nowrap">
            ✎ UPDATED
          </span>
        );
      case 'DELETE':
        return (
          <span className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 whitespace-nowrap">
            🗑 DELETED
          </span>
        );
      case 'PAYMENT':
        return (
          <span className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 whitespace-nowrap">
            💵 PAYMENT
          </span>
        );
      case 'INVOICE':
        return (
          <span className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 whitespace-nowrap">
            🧾 INVOICE
          </span>
        );
      case 'LOGIN':
        return (
          <span className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 whitespace-nowrap">
            🔑 LOGIN
          </span>
        );
      case 'LOGOUT':
        return (
          <span className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 whitespace-nowrap">
            🚪 LOGOUT
          </span>
        );
      case 'IMPORT':
        return (
          <span className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
            📥 IMPORT
          </span>
        );
      default:
        return (
          <span className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
            {action}
          </span>
        );
    }
  };

  const formatLogTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-AE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg shadow-emerald-500/5 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400 hover:text-white p-1 transition-colors text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1: Total Events */}
        <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Activity Events</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{totalEvents}</span>
            <span className="text-xs text-slate-400">Logged</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Full audit trail stored locally</p>
        </div>

        {/* Card 2: Active Operators */}
        <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Operators</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-400 font-mono">{uniqueUsers.length}</span>
            <span className="text-xs text-slate-400">Users ({uniqueUsers.join(', ')})</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">admin &amp; manager accounts</p>
        </div>

        {/* Card 3: Today's Actions */}
        <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today's Operations</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">{todayEvents}</span>
            <span className="text-xs text-slate-400">Actions Today</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Real-time action timestamps</p>
        </div>

        {/* Card 4: Most Active User */}
        <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Operator</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-purple-300 font-mono">
              {topOperator === 'admin' ? '👑 admin' : '💼 manager'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            admin: {adminCount} | manager: {managerCount}
          </p>
        </div>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="bg-[#151c2c] border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto flex-1">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-60 min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search details, person, customer..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* User Filter */}
          <div>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Persons</option>
              <option value="admin">👑 admin (Administrator)</option>
              <option value="manager">💼 manager (Operations)</option>
            </select>
          </div>

          {/* Module Filter */}
          <div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Modules</option>
              <option value="Customers">Customers</option>
              <option value="Billing">Billing &amp; Invoices</option>
              <option value="Payments">Payments</option>
              <option value="Vendors">Vendors</option>
              <option value="Attendance">Attendance</option>
              <option value="Buildings">Buildings &amp; Rooms</option>
              <option value="Meal Plans">Meal Plans</option>
              <option value="Settings">Settings &amp; Config</option>
              <option value="Authentication">User Login / Sessions</option>
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Actions</option>
              <option value="ADD">+ ADD / CREATE</option>
              <option value="UPDATE">✎ UPDATE / EDIT</option>
              <option value="DELETE">🗑 DELETE / REMOVE</option>
              <option value="PAYMENT">💵 PAYMENT</option>
              <option value="INVOICE">🧾 INVOICE</option>
              <option value="LOGIN">🔑 LOGIN / SESSION</option>
              <option value="IMPORT">📥 IMPORT</option>
            </select>
          </div>

          {/* Date Range Preset */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Right: Export & Clear Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => handleExport('xlsx')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            title="Download Excel log spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={loadLogs}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Refresh Log Feed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 text-xs font-bold border border-rose-500/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            title="Delete all activity log entries with confirmation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* Main Activity Log Table */}
      <div className="bg-[#151c2c] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0f1422] text-slate-400 border-b border-slate-800 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 min-w-[155px]">Date &amp; Time</th>
                <th className="py-3 px-3 min-w-[130px]">Person Operating</th>
                <th className="py-3 px-2 text-center">Action</th>
                <th className="py-3 px-3">Module</th>
                <th className="py-3 px-4 min-w-[320px]">Activity Description &amp; Added Details</th>
                <th className="py-3 px-3 text-center w-14">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                    {logs.length === 0 ? (
                      <div className="space-y-1.5">
                        <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="font-semibold text-slate-300">Activity Log is Empty</p>
                        <p className="text-[11px] text-slate-500">All activity records have been deleted. New user operations will be recorded here automatically.</p>
                      </div>
                    ) : (
                      'No activity logs match the selected filter criteria.'
                    )}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{formatLogTimestamp(log.timestamp)}</span>
                      </div>
                    </td>

                    {/* Person / User */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {log.userName === 'admin' ? (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <span>👑</span>
                            <span>admin</span>
                          </span>
                        ) : log.userName === 'manager' ? (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                            <span>💼</span>
                            <span>manager</span>
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{log.userName}</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                          ({log.userRole || 'User'})
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>

                    {/* Module */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-semibold">
                        {getModuleIcon(log.module)}
                        <span>{log.module}</span>
                      </span>
                    </td>

                    {/* Details / Added Item */}
                    <td className="py-3 px-4 text-slate-200">
                      <div className="font-bold text-white text-xs sm:text-[13px]">{log.title}</div>
                      <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed break-words font-sans">
                        {log.details}
                      </div>
                    </td>

                    {/* Delete single log action */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteSingle(log.id, log.title)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete this single log entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info strip */}
        <div className="p-3 bg-[#0f1422] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredLogs.length}</strong> of <strong className="text-white">{logs.length}</strong> system activity records
          </span>
          <span className="font-mono text-[10px] text-amber-400/90 font-bold">
            Audited &amp; Localized for Karama Mess Management
          </span>
        </div>
      </div>

      {/* Confirmation Modal: Delete All Activity Logs */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-rose-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete All Activity Logs?</h3>
                <p className="text-xs text-rose-400 font-semibold mt-0.5">Confirmation Required</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>
                Are you sure you want to permanently delete all <strong className="text-white font-mono text-sm">{logs.length}</strong> activity log records?
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                This action will completely purge the entire audit history from the system. Once deleted, this log data cannot be recovered.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAll}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete All Logs</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
