import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StatCard } from './components/dashboard/StatCard';
import { AccountsChart } from './components/dashboard/AccountsChart';
import { StatusOverviewCard } from './components/dashboard/StatusOverviewCard';
import { RecentCustomersTable } from './components/dashboard/RecentCustomersTable';
import { UpcomingPaymentsTable } from './components/dashboard/UpcomingPaymentsTable';
import { CustomerList } from './components/customers/CustomerList';
import { CustomerModal } from './components/customers/CustomerModal';
import { CustomerDetailModal } from './components/customers/CustomerDetailModal';
import { NewRegistrationToast } from './components/common/NewRegistrationToast';
import { playNotificationChime } from './utils/notificationAudio';
import { syncCustomersWithMealPlans, resolveExpectedMonthlyRate } from './utils/mealPlanPricingService';
import { BuildingList } from './components/buildings/BuildingList';
import { MealPlanList } from './components/mealPlans/MealPlanList';
import { AttendanceSheet } from './components/attendance/AttendanceSheet';
import { InvoiceList } from './components/billing/InvoiceList';
import { PaymentList } from './components/payments/PaymentList';
import { OverdueList } from './components/overdue/OverdueList';
import { ReportsView } from './components/reports/ReportsView';
import { StaffList } from './components/staff/StaffList';
import { AdminView } from './components/admin/AdminView';
import { LoginView } from './components/auth/LoginView';
import { CustomerOnboardingView } from './components/public/CustomerOnboardingView';
import { BusinessSettingsView } from './components/settings/BusinessSettingsView';
import { HelpView } from './components/help/HelpView';
import { VendorAccountsView } from './components/vendors/VendorAccountsView';
import { AuthService, AppUser } from './api/authService';
import { ActivityLogService } from './api/activityLogService';
import { OfflineStorage } from './api/offlineStorage';

import { Users, UserCheck, AlertCircle, Clock, LogOut, Lock, RefreshCw, ShieldAlert, CalendarX, ArrowRight, MessageSquare } from 'lucide-react';
import { Customer, Building, MealPlan, Invoice, Payment, BusinessSettings, DashboardMetrics } from './types';
import { formatAED } from './utils/currency';
import { exportCustomersToExcel, exportInvoicesToExcel, exportLedgerToExcel, ParsedImportRow } from './utils/excelService';
import { getApproachingCancellations, sendCancellationWhatsApp, syncCustomerCancellationStatuses } from './utils/cancellationService';
import {
  fetchCustomers,
  saveCustomer,
  deleteCustomer,
  deleteAllCustomers,
  fetchBuildings,
  saveBuilding,
  deleteBuilding,
  pruneEmptyBuildings,
  fetchMealPlans,
  saveMealPlan,
  deleteMealPlan,
  fetchInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  fetchPayments,
  recordPayment,
  deletePayment,
  fetchBusinessSettings,
  updateBusinessSettings,
  fetchDashboardMetrics,
  isCloudConnected,
  checkCloudStatus,
  getCachedCloudStatus,
  CloudStatusResult,
  subscribeToRealtimeChanges,
  checkSystemLicense,
  LicenseCheckResult
} from './api/supabase';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => AuthService.getCurrentSession());
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPublicOnboarding, setIsPublicOnboarding] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const search = (window.location.search || '').toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();
    const pathname = (window.location.pathname || '').toLowerCase();
    return (
      search.includes('join') ||
      search.includes('register') ||
      search.includes('onboard') ||
      hash.includes('register') ||
      hash.includes('join') ||
      pathname === '/join' ||
      pathname === '/register'
    );
  });

  useEffect(() => {
    if (currentUser?.role === 'viewer' && (currentTab === 'admin' || currentTab === 'staff' || currentTab === 'settings')) {
      setCurrentTab('dashboard');
    }
  }, [currentUser, currentTab]);

  // Core business state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>({
    business_id: '',
    currency: 'AED',
    timezone: 'Asia/Dubai',
    invoice_prefix: 'INV-2026-',
    next_invoice_number: 1001,
    default_payment_terms_days: 7,
    tax_enabled: false,
    tax_rate: 5.0,
  });
  // Dynamically compute live metrics directly from current state
  const metrics: DashboardMetrics = useMemo(() => {
    return OfflineStorage.getDashboardMetrics(customers, invoices, payments);
  }, [customers, invoices, payments]);

  // Approaching cancellations within 15-day notice window
  const approachingCancellations = useMemo(() => {
    return getApproachingCancellations(customers, 15);
  }, [customers]);

  // Modal state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingProfileCustomer, setViewingProfileCustomer] = useState<Customer | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [latestRegistrant, setLatestRegistrant] = useState<Customer | null>(null);
  const [newRegistrationAlert, setNewRegistrationAlert] = useState<Customer | null>(null);

  // Synchronize latestRegistrant, newRegistrationAlert and viewingProfileCustomer when customers change or get deleted
  useEffect(() => {
    if (latestRegistrant) {
      const stillExists = customers.some(
        (c) => c.id === latestRegistrant.id || c.customer_code === latestRegistrant.customer_code
      );
      if (!stillExists) {
        // Customer was deleted: remove notification pill and fallback to next online customer or null
        const nextOnline = customers
          .filter((cust) => cust.managed_by === 'online_self_service')
          .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))[0];
        setLatestRegistrant(nextOnline || null);
      }
    }
    if (newRegistrationAlert) {
      const stillExists = customers.some(
        (c) => c.id === newRegistrationAlert.id || c.customer_code === newRegistrationAlert.customer_code
      );
      if (!stillExists) {
        setNewRegistrationAlert(null);
      }
    }
    if (viewingProfileCustomer) {
      const fresh = customers.find(
        (c) => c.id === viewingProfileCustomer.id || c.customer_code === viewingProfileCustomer.customer_code
      );
      if (fresh) {
        if (
          fresh.status !== viewingProfileCustomer.status ||
          fresh.cancellation_date !== viewingProfileCustomer.cancellation_date ||
          fresh.notes !== viewingProfileCustomer.notes ||
          fresh.total_overdue !== viewingProfileCustomer.total_overdue ||
          fresh.payment_rating !== viewingProfileCustomer.payment_rating ||
          fresh.payment_made_up_to_date !== viewingProfileCustomer.payment_made_up_to_date ||
          fresh.billed_up_to_date !== viewingProfileCustomer.billed_up_to_date ||
          fresh.billing_end_date !== viewingProfileCustomer.billing_end_date
        ) {
          setViewingProfileCustomer(fresh);
        }
      } else {
        // Customer was deleted while profile was open: close modal
        setViewingProfileCustomer(null);
      }
    }
  }, [customers, latestRegistrant, newRegistrationAlert, viewingProfileCustomer]);

  // License & remote kill switch status state
  const [licenseState, setLicenseState] = useState<LicenseCheckResult>(() => {
    const local = OfflineStorage.getLicenseStatus();
    const isLocked = local.startsWith('SUSPENDED') || local.startsWith('LOCKED') || local.startsWith('EXPIRED');
    return {
      isLocked,
      status: isLocked ? 'SUSPENDED' : 'ACTIVE',
      reason: local.replace(/^(SUSPENDED|LOCKED|EXPIRED):?\s*/i, ''),
    };
  });
  const [isVerifyingLicense, setIsVerifyingLicense] = useState(false);
  const [isDevBypassModalOpen, setIsDevBypassModalOpen] = useState(false);
  const [devUser, setDevUser] = useState('');
  const [devPass, setDevPass] = useState('');
  const [devBypassError, setDevBypassError] = useState<string | null>(null);

  const verifyLicense = async () => {
    setIsVerifyingLicense(true);
    try {
      const res = await checkSystemLicense();
      setLicenseState(res);
    } catch {
      // Keep existing status
    } finally {
      setIsVerifyingLicense(false);
    }
  };

  const handleDevBypass = (e: React.FormEvent) => {
    e.preventDefault();
    setDevBypassError(null);
    const clean = devUser.trim().toLowerCase();
    if (clean === 'developer' && devPass === 'Dev@Karama#2026') {
      const devRes = AuthService.login('developer', 'Dev@Karama#2026');
      if (devRes.success && devRes.user) {
        setCurrentUser(devRes.user);
        setIsDevBypassModalOpen(false);
        setLicenseState((prev) => ({ ...prev, isLocked: false }));
      }
    } else {
      setDevBypassError('Invalid developer master credentials.');
    }
  };

  // Periodic license check (runs even before login)
  useEffect(() => {
    verifyLicense();
    const interval = setInterval(verifyLicense, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cloud Live Status state
  const [cloudStatus, setCloudStatus] = useState<CloudStatusResult>(() => getCachedCloudStatus());
  const [isCheckingCloud, setIsCheckingCloud] = useState(false);

  const checkConnection = async (isManual = false) => {
    if (isManual) setIsCheckingCloud(true);
    try {
      const res = await checkCloudStatus();
      setCloudStatus(res);
    } catch {
      // keep fallback
    } finally {
      if (isManual) setIsCheckingCloud(false);
    }
  };

  const loadData = async () => {
    setIsRefreshing(true);
    checkConnection();
    try {
      const [c, b, mp, inv, pay, st] = await Promise.all([
        fetchCustomers(),
        fetchBuildings(),
        fetchMealPlans(),
        fetchInvoices(),
        fetchPayments(),
        fetchBusinessSettings(),
      ]);
      // Automatically synchronize cancellation statuses across devices:
      // - Final meal date passed (cancellation_date < today) -> auto-move to 'cancelled'
      // - Scheduled cancellation notice active -> auto-move to 'cancelling_soon'
      const { updatedCustomers, hasChanges } = syncCustomerCancellationStatuses(c);

      // Automatically synchronize customer monthly fees with meal plans (e.g. 1 meal -> 180, 2 meals -> 300)
      const { updatedCustomers: rateSyncedCustomers, changedCount: rateChanges } =
        syncCustomersWithMealPlans(updatedCustomers, mp, false);
      const finalCustomers = rateChanges > 0 ? rateSyncedCustomers : updatedCustomers;

      OfflineStorage.setCustomers(finalCustomers);
      if (hasChanges || rateChanges > 0) {
        finalCustomers.forEach((cust) => {
          const original = c.find((orig) => orig.id === cust.id);
          if (original && (original.status !== cust.status || original.monthly_rate !== cust.monthly_rate || original.meal_plan_id !== cust.meal_plan_id)) {
            saveCustomer(cust).catch(() => {});
            if (original.status !== cust.status && cust.status === 'cancelled') {
              ActivityLogService.logAction(
                'Customers',
                'UPDATE',
                'Customer Auto-Cancelled (Notice Period Ended)',
                `Scheduled final meal date (${cust.cancellation_date}) passed for "${cust.full_name}" (${cust.customer_code}). Automatically transitioned to Cancelled status.`,
                { entityId: cust.id }
              );
            }
          }
        });
        if (rateChanges > 0) {
          ActivityLogService.logAction(
            'Customers',
            'UPDATE',
            'Monthly Fees Auto-Synced with Meal Plans',
            `Corrected monthly fees for ${rateChanges} customers to match their active meal plans (e.g. 1-meal @ 180 AED, 2-meal @ 300 AED).`
          );
        }
      }
      setCustomers(finalCustomers);
      // Track most recent online customer for status bar (automatically cleared if customer was deleted)
      const latestOnline = finalCustomers
        .filter((cust) => cust.managed_by === 'online_self_service')
        .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))[0];
      setLatestRegistrant((prev) => {
        if (prev && finalCustomers.some((c) => c.id === prev.id || c.customer_code === prev.customer_code)) {
          return finalCustomers.find((c) => c.id === prev.id || c.customer_code === prev.customer_code) || prev;
        }
        return latestOnline || null;
      });
      setNewRegistrationAlert((prev) => {
        if (prev && !finalCustomers.some((c) => c.id === prev.id || c.customer_code === prev.customer_code)) {
          return null;
        }
        return prev;
      });
      setBuildings(b);
      setMealPlans(mp);
      setInvoices(inv);
      setPayments(pay);
      setSettings(st);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    loadData();
    checkConnection();

    // 1. Supabase Realtime multi-device subscription (instant live updates across shared computers)
    const unsubscribeRealtime = subscribeToRealtimeChanges({
      onCustomerChange: (event, newRecord, oldId) => {
        if (event === 'INSERT' && newRecord) {
          let cancelDate = newRecord.cancellation_date;
          let cancelReason = newRecord.cancellation_reason;
          if (!cancelDate && newRecord.notes && newRecord.notes.includes('[NOTICE: Cancelling on ')) {
            const m = newRecord.notes.match(/\[NOTICE: Cancelling on (\d{4}-\d{2}-\d{2})(?: \| Reason: ([^\]]+))?\]/);
            if (m) {
              cancelDate = m[1];
              if (m[2]) cancelReason = m[2];
            }
          }
          if (!cancelDate && newRecord.status === 'cancelling_soon' && newRecord.billing_end_date) {
            cancelDate = newRecord.billing_end_date;
          }
          const rec: Customer = {
            ...newRecord,
            cancellation_date: cancelDate,
            cancellation_reason: cancelReason,
          };
          setCustomers((prev) => {
            if (prev.some((c) => c.id === rec.id)) return prev;
            return [rec, ...prev];
          });
          OfflineStorage.saveCustomer(rec);

          // Real-time live status bar update, animated popup alert & subtle chime
          setLatestRegistrant(rec);
          setNewRegistrationAlert(rec);
          playNotificationChime(0.08);
        } else if (event === 'UPDATE' && newRecord) {
          setCustomers((prev) =>
            prev.map((c) => {
              if (c.id !== newRecord.id) return c;
              let cancelDate = newRecord.cancellation_date || c.cancellation_date;
              let cancelReason = newRecord.cancellation_reason || c.cancellation_reason;
              if (!cancelDate && newRecord.notes && newRecord.notes.includes('[NOTICE: Cancelling on ')) {
                const m = newRecord.notes.match(/\[NOTICE: Cancelling on (\d{4}-\d{2}-\d{2})(?: \| Reason: ([^\]]+))?\]/);
                if (m) {
                  cancelDate = m[1];
                  if (m[2]) cancelReason = m[2];
                }
              }
              if (!cancelDate && newRecord.status === 'cancelling_soon' && newRecord.billing_end_date) {
                cancelDate = newRecord.billing_end_date;
              }
              const updatedRec: Customer = {
                ...c,
                ...newRecord,
                cancellation_date: cancelDate,
                cancellation_reason: cancelReason,
              };
              OfflineStorage.saveCustomer(updatedRec);
              return updatedRec;
            })
          );
        } else if (event === 'DELETE' && oldId) {
          setCustomers((prev) => prev.filter((c) => c.id !== oldId));
          setLatestRegistrant((prev) => (prev && (prev.id === oldId || prev.customer_code === oldId) ? null : prev));
          setNewRegistrationAlert((prev) => (prev && (prev.id === oldId || prev.customer_code === oldId) ? null : prev));
          setViewingProfileCustomer((prev) => (prev && (prev.id === oldId || prev.customer_code === oldId) ? null : prev));
          OfflineStorage.deleteCustomer(oldId);
        }
      },
      onPaymentChange: (event, newRecord, oldId) => {
        if (event === 'INSERT' && newRecord) {
          setPayments((prev) => {
            if (prev.some((p) => p.id === newRecord.id)) return prev;
            return [newRecord, ...prev];
          });
          // Also reconcile customer dues
          fetchCustomers().then(setCustomers).catch(() => {});
        } else if (event === 'UPDATE' && newRecord) {
          setPayments((prev) =>
            prev.map((p) => (p.id === newRecord.id ? { ...p, ...newRecord } : p))
          );
        } else if (event === 'DELETE' && oldId) {
          setPayments((prev) => prev.filter((p) => p.id !== oldId));
        }
      },
      onBuildingChange: (event, newRecord, oldId) => {
        if (event === 'INSERT' && newRecord) {
          setBuildings((prev) => {
            if (prev.some((b) => b.id === newRecord.id)) return prev;
            return [...prev, newRecord];
          });
        } else if (event === 'UPDATE' && newRecord) {
          setBuildings((prev) =>
            prev.map((b) => (b.id === newRecord.id ? { ...b, ...newRecord } : b))
          );
        } else if (event === 'DELETE' && oldId) {
          setBuildings((prev) => prev.filter((b) => b.id !== oldId));
        }
      },
      onInvoiceChange: (event, newRecord, oldId) => {
        if (event === 'INSERT' && newRecord) {
          setInvoices((prev) => {
            if (prev.some((inv) => inv.id === newRecord.id)) return prev;
            return [newRecord, ...prev];
          });
        } else if (event === 'UPDATE' && newRecord) {
          setInvoices((prev) =>
            prev.map((inv) => (inv.id === newRecord.id ? { ...inv, ...newRecord } : inv))
          );
        } else if (event === 'DELETE' && oldId) {
          setInvoices((prev) => prev.filter((inv) => inv.id !== oldId));
        }
      },
      onLicenseChange: (isLocked, reason) => {
        setLicenseState({
          isLocked,
          status: isLocked ? 'SUSPENDED' : 'ACTIVE',
          reason: reason || 'Software license has been temporarily suspended.',
        });
      },
    });

    // 2. Silent background poll every 8 seconds as safety net
    const silentPoll = async () => {
      try {
        const fresh = await fetchCustomers();
        const { updatedCustomers, hasChanges } = syncCustomerCancellationStatuses(fresh);
        OfflineStorage.setCustomers(updatedCustomers);
        if (hasChanges) {
          updatedCustomers.forEach((cust) => {
            const original = fresh.find((orig) => orig.id === cust.id);
            if (original && original.status !== cust.status) {
              saveCustomer(cust).catch(() => {});
            }
          });
        }
        setCustomers(updatedCustomers);
      } catch {}
    };

    const pollTimer = setInterval(silentPoll, 8000);

    const handleWindowFocus = () => {
      silentPoll();
      checkConnection();
    };

    const handleOnline = () => {
      checkConnection();
      silentPoll();
    };

    const handleOffline = () => {
      setCloudStatus({
        isLive: false,
        status: 'offline',
        label: 'Cloud Offline',
        message: 'No internet connection detected on this device. Operating in offline mode.',
        lastChecked: new Date().toLocaleTimeString(),
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('focus', handleWindowFocus);
    }

    const interval = setInterval(checkConnection, 45000);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('focus', handleWindowFocus);
      }
      clearInterval(interval);
      clearInterval(pollTimer);
      unsubscribeRealtime();
    };
  }, [currentUser]);

  // Handlers
  const handleSaveCustomer = async (cust: Partial<Customer>) => {
    // 1. Instant optimistic update in memory & local cache (0ms!)
    const localSaved = OfflineStorage.saveCustomer(cust);
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.id === localSaved.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = localSaved;
        return next;
      }
      return [localSaved, ...prev];
    });

    // Instant modal close so user never waits
    setIsCustomerModalOpen(false);
    setEditingCustomer(null);

    // 2. Background cloud synchronization & audit logging
    try {
      const saved = await saveCustomer(localSaved);
      if (saved.customer_code !== localSaved.customer_code) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === saved.id ? { ...c, customer_code: saved.customer_code } : c))
        );
      }
      if (cust.id) {
        ActivityLogService.logAction(
          'Customers',
          'UPDATE',
          'Customer Profile Updated',
          `Updated profile details for customer "${saved.full_name}" (Account Managed By: ${saved.managed_by || 'admin'})`,
          { entityId: saved.id }
        );
      } else {
        ActivityLogService.logAction(
          'Customers',
          'ADD',
          'New Customer Registered',
          `Registered customer "${saved.full_name}" in ${saved.building_name_cache || 'Accommodation'}, Apt: ${saved.apartment_cache || 'N/A'}, Monthly Rate: AED ${saved.monthly_rate || 380}, Account Handler: ${saved.managed_by || 'admin'}${saved.emergency_contact ? ` (Emergency Contact: ${saved.emergency_contact})` : ''}`
        );

        // Fully automate: Auto-generate the customer's monthly subscription invoice immediately upon registration
        try {
          const pStart = saved.billing_start_date || saved.payment_made_up_to_date || new Date().toISOString().split('T')[0];
          const pEnd = saved.billing_end_date || saved.billed_up_to_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
          const rate = saved.monthly_rate || 380;
          const dueBalance = (saved.total_overdue && saved.total_overdue > 0) ? saved.total_overdue : rate;

          const autoInv = await createInvoice({
            customer_id: saved.id,
            customer_name_cache: saved.full_name,
            building_cache: saved.building_name_cache || '',
            total_amount: rate,
            balance_amount: dueBalance,
            paid_amount: 0,
            period_start: pStart,
            period_end: pEnd,
            due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            notes: `Auto-generated monthly subscription for ${saved.full_name}`,
            status: 'issued',
          });

          setInvoices((prev) => [autoInv, ...prev]);
        } catch (invErr) {
          console.error('Failed to auto-generate initial invoice for customer:', invErr);
        }
      }
    } catch (err) {
      console.error('Failed to sync customer to cloud:', err);
    }

    // 3. Surgical state refresh: only update the specific saved customer so the
    //    optimistic cancellation_date / status is never overwritten by a full refetch.
    //    A full fetchCustomers() would lose in-memory fields (e.g. cancellation_date)
    //    that don't exist as a column in Supabase, causing the status badge to reset.
    setCustomers((prev) =>
      prev.map((c) => (c.id === localSaved.id ? { ...localSaved, customer_code: c.customer_code } : c))
    );
  };

  const handleDeleteCustomer = async (id: string) => {
    const cust = customers.find((c) => c.id === id);
    // Instant optimistic deletion from UI (0ms!)
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setLatestRegistrant((prev) => (prev && (prev.id === id || (cust && prev.customer_code === cust.customer_code)) ? null : prev));
    setNewRegistrationAlert((prev) => (prev && (prev.id === id || (cust && prev.customer_code === cust.customer_code)) ? null : prev));
    setViewingProfileCustomer((prev) => (prev && (prev.id === id || (cust && prev.customer_code === cust.customer_code)) ? null : prev));
    OfflineStorage.deleteCustomer(id);

    try {
      await deleteCustomer(id);
      ActivityLogService.logAction(
        'Customers',
        'DELETE',
        'Customer Record Deleted',
        `Deleted customer record "${cust?.full_name || id}" (${cust?.customer_code || ''})`
      );
    } catch (err) {
      console.error('Failed to delete customer from cloud:', err);
    }
  };

  const handleDeleteAllCustomers = async () => {
    await deleteAllCustomers();
    setCustomers([]);
    setLatestRegistrant(null);
    setNewRegistrationAlert(null);
    setViewingProfileCustomer(null);
    ActivityLogService.logAction(
      'Customers',
      'DELETE',
      'All Customer Records Deleted',
      'Permanently removed all customer profiles with user confirmation.'
    );
    await loadData();
  };

  const handleAddBuilding = async (bld: Partial<Building>) => {
    const isUpdate = Boolean(bld.id);
    await saveBuilding(bld);
    ActivityLogService.logAction(
      'Buildings',
      isUpdate ? 'UPDATE' : 'ADD',
      isUpdate ? 'Building Accommodation Updated' : 'Building Accommodation Registered',
      isUpdate
        ? `Updated accommodation building "${bld.name}" in area "${bld.area || 'Karama'}"`
        : `Registered accommodation building "${bld.name}" in area "${bld.area || 'Karama'}"`
    );
    await loadData();
  };

  const handleDeleteBuilding = async (id: string) => {
    const bld = buildings.find(b => b.id === id);
    await deleteBuilding(id);
    ActivityLogService.logAction(
      'Buildings',
      'DELETE',
      'Building Removed',
      `Deleted accommodation building "${bld?.name || id}"`
    );
    await loadData();
  };

  const handleDeleteEmptyBuildings = async () => {
    const removedCount = await pruneEmptyBuildings(customers);
    ActivityLogService.logAction(
      'Buildings',
      'DELETE',
      'Unused Buildings Cleaned',
      `Purged ${removedCount} empty accommodation buildings with 0 residing customers`
    );
    await loadData();
  };

  const handleSaveMealPlan = async (plan: Partial<MealPlan>) => {
    const isEdit = Boolean(plan.id);
    await saveMealPlan(plan);
    const newPrice = Number(plan.monthly_price);

    // AUTOMATIC BULK PROPAGATION:
    // When a meal plan's price is updated, immediately propagate to all matching customers
    if (!isNaN(newPrice) && newPrice > 0) {
      let syncCount = 0;
      setCustomers((prev) =>
        prev.map((c) => {
          const matchesId = Boolean(plan.id && (c.meal_plan_id === plan.id || c.meal_plan?.id === plan.id));
          const matchesMeals =
            plan.includes_breakfast !== undefined &&
            plan.includes_lunch !== undefined &&
            plan.includes_dinner !== undefined &&
            Boolean(c.has_breakfast) === Boolean(plan.includes_breakfast) &&
            Boolean(c.has_lunch) === Boolean(plan.includes_lunch) &&
            Boolean(c.has_dinner) === Boolean(plan.includes_dinner);

          if (matchesId || matchesMeals) {
            syncCount++;
            const updated: Customer = {
              ...c,
              meal_plan_id: plan.id || c.meal_plan_id,
              monthly_rate: newPrice,
              updated_at: new Date().toISOString(),
            };
            OfflineStorage.saveCustomer(updated);
            saveCustomer(updated).catch(() => {});
            return updated;
          }
          return c;
        })
      );

      ActivityLogService.logAction(
        'Meal Plans',
        isEdit ? 'UPDATE' : 'ADD',
        isEdit ? 'Meal Plan Updated' : 'Meal Plan Configured',
        `${isEdit ? 'Updated' : 'Configured'} meal plan "${plan.name}" with rate AED ${plan.monthly_price}. Automatically synchronized ${syncCount} matching customers.`
      );
    } else {
      ActivityLogService.logAction(
        'Meal Plans',
        isEdit ? 'UPDATE' : 'ADD',
        isEdit ? 'Meal Plan Updated' : 'Meal Plan Configured',
        `${isEdit ? 'Updated' : 'Configured'} meal plan "${plan.name}" with rate AED ${plan.monthly_price}`
      );
    }

    await loadData();
  };

  const handleSyncAllCustomerRates = async () => {
    const { updatedCustomers, changedCount } = syncCustomersWithMealPlans(customers, mealPlans, true);
    if (changedCount > 0) {
      setCustomers(updatedCustomers);
      OfflineStorage.setCustomers(updatedCustomers);
      updatedCustomers.forEach((c) => {
        const orig = customers.find((o) => o.id === c.id);
        if (orig && (orig.monthly_rate !== c.monthly_rate || orig.meal_plan_id !== c.meal_plan_id)) {
          saveCustomer(c).catch(() => {});
        }
      });
      ActivityLogService.logAction(
        'Customers',
        'UPDATE',
        'Batch Meal Plan Rates Synced',
        `Successfully synchronized monthly fee structure for ${changedCount} customers based on configured meal plans.`
      );
    }
    await loadData();
    return changedCount;
  };

  const handleDeleteMealPlan = async (id: string) => {
    const plan = mealPlans.find((p) => p.id === id);
    await deleteMealPlan(id);
    ActivityLogService.logAction(
      'Meal Plans',
      'DELETE',
      'Meal Plan Deleted',
      `Deleted meal plan "${plan?.name || id}"`
    );
    await loadData();
  };

  const handleGenerateInvoice = async (inv: Partial<Invoice>) => {
    const created = await createInvoice(inv);
    ActivityLogService.logAction(
      'Billing',
      'INVOICE',
      'Customer Invoice Generated',
      `Generated invoice ${created.invoice_number || ''} for AED ${created.total_amount || 0} (Customer: ${(created as any).customer_name_cache || 'Customer'})`
    );
    await loadData();
  };

  const handleEditInvoice = async (inv: Partial<Invoice>) => {
    const updated = await updateInvoice(inv);
    setInvoices((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    ActivityLogService.logAction(
      'Billing',
      'UPDATE',
      'Invoice Updated',
      `Updated invoice ${updated.invoice_number} for customer ${updated.customer_name_cache || 'Customer'} (Total: AED ${updated.total_amount})`
    );
    await loadData();
  };

  const handleDeleteInvoice = async (id: string) => {
    const target = invoices.find((i) => i.id === id);
    await deleteInvoice(id);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    ActivityLogService.logAction(
      'Billing',
      'DELETE',
      'Invoice Deleted',
      `Deleted invoice ${target?.invoice_number || id} for ${target?.customer_name_cache || 'Customer'}`
    );
    await loadData();
  };

  const handleAutoGenerateInvoices = async () => {
    const generated = OfflineStorage.autoGenerateMissingInvoices(customers);
    if (generated.length > 0) {
      for (const inv of generated) {
        try {
          await createInvoice(inv);
        } catch {}
      }
      ActivityLogService.logAction(
        'Billing',
        'INVOICE',
        'Batch Invoices Auto-Generated',
        `Automatically generated ${generated.length} monthly invoices for active subscribers`
      );
      await loadData();
    }
  };

  const handleRecordPayment = async (pay: Partial<Payment>) => {
    // 1. Instant optimistic update in local state (0ms!)
    const localPay = OfflineStorage.recordPayment(pay);
    setPayments((prev) => [localPay, ...prev]);

    if (pay.customer_id) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === pay.customer_id || c.customer_code === pay.customer_id) {
            const newOverdue = Math.max(0, (c.total_overdue || 0) - (pay.amount || 0));
            return {
              ...c,
              total_overdue: newOverdue,
              payment_rating: newOverdue > 0 ? 'Late payer' : 'Good',
              payment_made_up_to_date: pay.payment_date || c.payment_made_up_to_date,
            };
          }
          return c;
        })
      );
    }

    const targetCust = customers.find((c) => c.id === pay.customer_id || c.customer_code === pay.customer_id);
    const wasOverdue = (targetCust?.total_overdue || 0) > 0;
    const isNowZero = Math.max(0, (targetCust?.total_overdue || 0) - (pay.amount || 0)) === 0;

    ActivityLogService.logAction(
      'Payments',
      'PAYMENT',
      wasOverdue ? (isNowZero ? 'Customer Due Cleared in Full' : 'Customer Overdue Partial Payment') : 'Customer Payment Received',
      `Recorded payment of AED ${pay.amount} for "${targetCust?.full_name || 'Customer'}" via ${(pay.payment_method || 'cash').replace('_', ' ')} (Ref: ${pay.reference_number || '-'})${wasOverdue ? ` - Outstanding due ${isNowZero ? 'fully settled (0 balance)' : 'partially cleared'}` : ''}`,
      { entityId: pay.customer_id }
    );

    // 2. Background sync to cloud
    try {
      await recordPayment(pay);
      const fresh = await fetchCustomers();
      setCustomers(fresh);
    } catch (err) {
      console.error('Failed to sync payment to cloud:', err);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    const targetPayment = payments.find(p => p.id === paymentId || p.payment_number === paymentId);
    if (!targetPayment) return;

    // 1. Instant optimistic update
    setPayments((prev) => prev.filter(p => p.id !== paymentId && p.payment_number !== paymentId));

    if (targetPayment.customer_id) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === targetPayment.customer_id || c.customer_code === targetPayment.customer_id) {
            const restoredOverdue = (c.total_overdue || 0) + (targetPayment.amount || 0);
            return {
              ...c,
              total_overdue: restoredOverdue,
              payment_rating: restoredOverdue > 0 ? 'Late payer' : 'Good',
            };
          }
          return c;
        })
      );
    }

    const targetCust = customers.find(c => c.id === targetPayment.customer_id || c.customer_code === targetPayment.customer_id);

    ActivityLogService.logAction(
      'Payments',
      'DELETE',
      'Payment Receipt Deleted',
      `Deleted receipt ${targetPayment.payment_number} of AED ${targetPayment.amount} for "${targetCust?.full_name || 'Customer'}" (due balance restored).`,
      { entityId: targetPayment.customer_id }
    );

    // 2. Background sync
    try {
      await deletePayment(paymentId);
      const freshCust = await fetchCustomers();
      const freshInv = await fetchInvoices();
      setCustomers(freshCust);
      setInvoices(freshInv);
    } catch (err) {
      console.error('Failed to sync deleted payment:', err);
    }
  };

  const handleSaveSettings = async (st: Partial<BusinessSettings>) => {
    const updated = await updateBusinessSettings(st);
    setSettings(updated);
    ActivityLogService.logAction(
      'Settings',
      'CONFIG_CHANGE',
      'Business Configuration Saved',
      `Updated contact details and business profile preferences (Phone: ${st.phone || ''})`
    );
  };

  const handleExportCsv = () => {
    exportCustomersToExcel(customers, 'all', 'xlsx');
    ActivityLogService.logAction(
      'Customers',
      'EXPORT',
      'Customers Exported to Excel',
      `Exported full directory of ${customers.length} customer records to Excel.`
    );
  };

  const handleImportCustomers = async (importedRows: ParsedImportRow[], mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      localStorage.removeItem('karama_customers');
    }
    for (const row of importedRows) {
      await saveCustomer(row as any);
    }
    ActivityLogService.logAction(
      'Customers',
      'IMPORT',
      'Customers Imported from Excel',
      `Imported ${importedRows.length} customers into database using ${mode} mode.`
    );
    await loadData();
    alert(`Successfully imported ${importedRows.length} customers into the mess database!`);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    if (currentUser) {
      ActivityLogService.logAction(
        'Authentication',
        'LOGOUT',
        'User Logged Out',
        `User "${currentUser.username}" (${currentUser.roleTitle}) logged out of application session.`
      );
    }
    AuthService.logout();
    setCurrentUser(null);
  };

  // Check if system license is suspended (and not bypassed by developer account)
  if (licenseState.isLocked && currentUser?.username !== 'developer') {
    return (
      <div className="min-h-screen bg-[#090d16] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
        {/* Glow */}
        <div className="absolute w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-md w-full bg-[#111726]/95 border border-rose-500/40 rounded-3xl p-7 shadow-2xl shadow-rose-950/60 backdrop-blur-xl relative z-10 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-[11px] font-bold text-rose-400 tracking-wider uppercase mb-3">
            <span>● Software License Suspended</span>
          </div>

          <h1 className="text-xl font-black text-white tracking-tight mb-2">
            Access Temporarily Blocked
          </h1>

          <p className="text-sm text-slate-300 mb-5 leading-relaxed">
            {licenseState.reason || 'This software subscription is currently suspended due to pending billing settlement.'}
          </p>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-5 text-left text-xs text-slate-300 space-y-1.5">
            <div className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-1">Reactivation Contact</div>
            <div>📧 Email: <span className="font-mono text-white">support@karamamess.ae</span></div>
            <div>📞 Direct: <span className="font-mono text-white">+971 50 123 4567</span></div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 mt-2">
              Contact the developer with your system ID to restore service immediately.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={verifyLicense}
              disabled={isVerifyingLicense}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingLicense ? 'animate-spin' : ''}`} />
              <span>{isVerifyingLicense ? 'Verifying Cloud License...' : 'Check License Status Again'}</span>
            </button>
            <button
              onClick={() => setIsDevBypassModalOpen(true)}
              className="text-[11px] text-slate-500 hover:text-slate-400 transition-colors py-1 cursor-pointer"
            >
              Master Developer Bypass
            </button>
          </div>
        </div>

        {/* Developer Master Bypass Modal */}
        {isDevBypassModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
            <div className="bg-[#131b26] border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Developer Master Override</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">Enter developer credentials to unlock full administrative access.</p>

              <form onSubmit={handleDevBypass} className="space-y-3">
                {devBypassError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{devBypassError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Developer ID</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Enter developer ID"
                    value={devUser}
                    onChange={(e) => setDevUser(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d131f] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Developer Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter developer password"
                    value={devPass}
                    onChange={(e) => setDevPass(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d131f] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDevBypassModalOpen(false);
                      setDevBypassError(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    Override &amp; Unlock
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Public Customer Registration & Meal Enrollment Page (No login required)
  if (isPublicOnboarding) {
    return (
      <CustomerOnboardingView
        onBackToLogin={() => {
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, '', window.location.pathname);
          }
          setIsPublicOnboarding(false);
        }}
      />
    );
  }

  // If user is not authenticated, display full screen Login / Forgot Password / Sign Up
  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={async (user) => {
          setCurrentUser(user);
          // Instantly sync with central cloud database upon user login
          try {
            await loadData();
            await checkConnection();
          } catch (e) {
            console.warn('Auto cloud sync on login failed:', e);
          }
        }}
        onOpenCustomerRegister={() => setIsPublicOnboarding(true)}
      />
    );
  }

  const isViewer = currentUser?.role === 'viewer';

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 font-sans antialiased">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLogout={handleLogout}
        userRole={currentUser.role}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-56 min-w-0 max-w-full flex flex-col min-h-screen">
        <Header
          userName={currentUser.username}
          userRole={currentUser.roleTitle}
          isViewer={isViewer}
          isCloud={cloudStatus.isLive}
          cloudStatus={cloudStatus}
          onCheckCloud={() => checkConnection(true)}
          isCheckingCloud={isCheckingCloud}
          onRefresh={loadData}
          isRefreshing={isRefreshing}
          onLogout={handleLogout}
          customers={customers}
          invoices={invoices}
          onSelectTab={setCurrentTab}
          onViewCustomer={(cust) => setViewingProfileCustomer(cust)}
          latestRegistrant={latestRegistrant}
          onDismissLatestRegistrant={() => setLatestRegistrant(null)}
        />

        <main className="p-5 md:p-6 flex-1 min-w-0 max-w-full overflow-y-auto">
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 4 Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                  title="Total Customers"
                  value={metrics.totalCustomers}
                  badgeText="TOTAL"
                  badgeColor="blue"
                  icon={Users}
                  iconBg="bg-blue-500/10 border border-blue-500/20"
                  iconColor="text-blue-400"
                />

                <StatCard
                  title="Running Accounts"
                  value={metrics.runningAccounts}
                  badgeText="ACTIVE"
                  badgeColor="green"
                  icon={UserCheck}
                  iconBg="bg-emerald-500/10 border border-emerald-500/20"
                  iconColor="text-emerald-400"
                />

                <StatCard
                  title="Total Overdue"
                  value={formatAED(metrics.totalOutstandingDues)}
                  badgeText={metrics.totalOutstandingDues > 0 ? "OVERDUE" : "CLEAR"}
                  badgeColor={metrics.totalOutstandingDues > 0 ? "red" : "green"}
                  icon={AlertCircle}
                  iconBg="bg-rose-500/10 border border-rose-500/20"
                  iconColor="text-rose-400"
                />

                <StatCard
                  title="Payments Due Soon"
                  value={metrics.dueSoonCount}
                  badgeText="UPCOMING"
                  badgeColor="yellow"
                  icon={Clock}
                  iconBg="bg-amber-500/10 border border-amber-500/20"
                  iconColor="text-amber-400"
                />
              </div>

              {/* Upcoming Scheduled Cancellations & Exits Notice Widget */}
              {approachingCancellations.length > 0 && (
                <div className="bg-gradient-to-r from-amber-950/40 via-[#151c2c] to-rose-950/30 border border-amber-500/40 rounded-2xl p-5 shadow-xl shadow-black/30">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        <CalendarX className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-black text-white tracking-tight">
                            Approaching Cancellations ({approachingCancellations.length})
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                            Advance Notice Given
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Customers scheduled to stop mess service within the next 15 days or mid-month cycle
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentTab('customers')}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Manage All in Directory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Customer cards grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {approachingCancellations.slice(0, 6).map((item) => (
                      <div
                        key={item.customer.id}
                        onClick={() => setViewingProfileCustomer(item.customer)}
                        className="p-3.5 rounded-xl bg-[#0f1422]/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="font-bold text-white text-sm truncate group-hover:text-amber-300 transition-colors">
                                {item.customer.full_name}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-amber-400 font-semibold">#{item.customer.customer_code}</span>
                                <span>•</span>
                                <span className="truncate">{item.customer.building_name_cache || 'Building'}</span>
                                {item.customer.apartment_cache ? ` (Apt ${item.customer.apartment_cache})` : ''}
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 border ${item.badge.bg} ${item.badge.textColor} ${item.badge.border}`}>
                              {item.badge.label}
                            </span>
                          </div>

                          <div className="mt-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-500 block text-[10px]">Exit Date</span>
                              <span className="font-mono font-bold text-slate-200">{item.targetDateDisplay}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-500 block text-[10px]">Mid-Month Pro-Rata</span>
                              <span className="font-mono font-bold text-amber-300">{formatAED(item.proRata.proRataAmount)}</span>
                            </div>
                          </div>

                          {item.reason && (
                            <p className="text-[11px] text-slate-400 italic mt-2 truncate">
                              "{item.reason}"
                            </p>
                          )}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              sendCancellationWhatsApp(item);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>

                          <span className="text-[11px] text-slate-400 group-hover:text-amber-400 font-semibold flex items-center gap-0.5">
                            <span>View Profile</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Middle Section: Accounts Overview (Half Page) & Status Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <AccountsChart
                  totalCustomers={metrics.totalCustomers}
                  runningAccounts={metrics.runningAccounts}
                  overdueAccounts={metrics.overdueInvoicesCount}
                />
                <StatusOverviewCard
                  metrics={metrics}
                  customers={customers}
                  onViewAll={() => setCurrentTab('customers')}
                />
              </div>

              {/* Bottom Split: Recent Customer Accounts & Upcoming Payments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <RecentCustomersTable
                  customers={metrics.recentCustomers}
                  allCustomers={customers}
                  onViewAll={() => setCurrentTab('customers')}
                  onSelectCustomer={(cust) => setViewingProfileCustomer(cust)}
                />
                <UpcomingPaymentsTable
                  customers={metrics.upcomingPayments}
                  onViewAll={() => setCurrentTab('overdue')}
                  onSelectCustomer={(cust) => setViewingProfileCustomer(cust)}
                />
              </div>
            </div>
          )}

          {currentTab === 'customers' && (
            <CustomerList
              customers={customers}
              buildings={buildings}
              mealPlans={mealPlans}
              invoices={invoices}
              payments={payments}
              isReadOnly={isViewer}
              onAddCustomer={() => {
                setEditingCustomer(null);
                setIsCustomerModalOpen(true);
              }}
              onEditCustomer={(cust) => {
                setEditingCustomer(cust);
                setIsCustomerModalOpen(true);
              }}
              onDeleteCustomer={handleDeleteCustomer}
              onDeleteAllCustomers={handleDeleteAllCustomers}
              onExportCsv={handleExportCsv}
              onImportCustomers={handleImportCustomers}
              onRecordPayment={handleRecordPayment}
              onSaveCustomer={handleSaveCustomer}
              onSyncAllCustomerRates={handleSyncAllCustomerRates}
            />
          )}

          {currentTab === 'buildings' && (
            <BuildingList
              buildings={buildings}
              customers={customers}
              isReadOnly={isViewer}
              onAddBuilding={handleAddBuilding}
              onDeleteBuilding={handleDeleteBuilding}
              onDeleteEmptyBuildings={handleDeleteEmptyBuildings}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceSheet customers={customers} />
          )}

          {currentTab === 'meal-plans' && (
            <MealPlanList
              mealPlans={mealPlans}
              customers={customers}
              isReadOnly={isViewer}
              onAddPlan={handleSaveMealPlan}
              onEditPlan={handleSaveMealPlan}
              onDeletePlan={handleDeleteMealPlan}
              onSyncAllCustomerRates={handleSyncAllCustomerRates}
            />
          )}

          {currentTab === 'billing' && (
            <InvoiceList
              invoices={invoices}
              customers={customers}
              settings={settings}
              isReadOnly={isViewer}
              onGenerateInvoice={handleGenerateInvoice}
              onEditInvoice={handleEditInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onAutoGenerateInvoices={handleAutoGenerateInvoices}
            />
          )}

          {currentTab === 'payments' && (
            <PaymentList
              payments={payments}
              customers={customers}
              invoices={invoices}
              isReadOnly={isViewer}
              onRecordPayment={handleRecordPayment}
              onDeletePayment={handleDeletePayment}
            />
          )}

          {currentTab === 'vendor-accounts' && (
            <VendorAccountsView currentUser={currentUser} />
          )}

          {currentTab === 'overdue' && (
            <OverdueList
              customers={customers}
              buildings={buildings}
              mealPlans={mealPlans}
              invoices={invoices}
              payments={payments}
              isReadOnly={isViewer}
              onOpenPayment={(c) => {
                setEditingCustomer(c);
                setIsCustomerModalOpen(true);
              }}
              onRecordPayment={handleRecordPayment}
              onSaveCustomer={handleSaveCustomer}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              metrics={metrics}
              onExportCsv={handleExportCsv}
            />
          )}

          {!isViewer && (currentTab === 'admin' || currentTab === 'staff') && (
            <AdminView
              currentUser={currentUser}
              onUserSessionUpdate={(user) => setCurrentUser(user)}
            />
          )}

          {!isViewer && currentTab === 'settings' && (
            <BusinessSettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              currentUsername={currentUser?.username || 'admin'}
            />
          )}

          {currentTab === 'help' && <HelpView />}
        </main>
      </div>

      {/* Customer Add/Edit Modal */}
      {isCustomerModalOpen && (
        <CustomerModal
          isOpen={isCustomerModalOpen}
          onClose={() => {
            setIsCustomerModalOpen(false);
            setEditingCustomer(null);
          }}
          onSave={handleSaveCustomer}
          customer={editingCustomer}
          buildings={buildings}
          mealPlans={mealPlans}
        />
      )}

      {/* Global 360° Profile & In-Place Bill Settlement Modal */}
      <CustomerDetailModal
        isOpen={Boolean(viewingProfileCustomer)}
        customer={
          viewingProfileCustomer
            ? customers.find((c) => c.id === viewingProfileCustomer.id) || viewingProfileCustomer
            : null
        }
        customers={customers}
        buildings={buildings}
        mealPlans={mealPlans}
        invoices={invoices}
        payments={payments}
        isReadOnly={isViewer}
        onClose={() => setViewingProfileCustomer(null)}
        onEdit={(cust) => {
          setViewingProfileCustomer(null);
          setEditingCustomer(cust);
          setIsCustomerModalOpen(true);
        }}
        onRecordPayment={handleRecordPayment}
        onSaveCustomer={handleSaveCustomer}
      />

      {/* Modern In-App Logout Confirmation Modal (Never freezes Electron window) */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-slate-700/80 rounded-2xl w-full max-w-sm p-6 shadow-2xl shadow-black/80 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Log Out Confirmation</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to sign out of Karama Mess Management?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/20 cursor-pointer"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Live Online Registration Notification Toast */}
      <NewRegistrationToast
        customer={newRegistrationAlert}
        onViewCustomer={(cust) => {
          setViewingProfileCustomer(cust);
          setNewRegistrationAlert(null);
        }}
        onDismiss={() => setNewRegistrationAlert(null)}
      />
    </div>
  );
};
