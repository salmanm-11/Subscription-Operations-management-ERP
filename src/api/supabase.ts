// Supabase Client Wrapper & Cloud Synchronization Layer
// Fallbacks seamlessly to OfflineStorage when offline or when cloud credentials are being configured.

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OfflineStorage, DEFAULT_BUSINESS } from './offlineStorage';
import { Customer, Building, Room, MealPlan, Invoice, Payment, BusinessSettings, DashboardMetrics, Vendor, VendorTransaction, VendorPayment } from '../types';

let supabaseClient: SupabaseClient | null = null;

export type CloudConnectionState = 'live' | 'offline' | 'tables_missing' | 'local' | 'checking';

export interface CloudStatusResult {
  isLive: boolean;
  status: CloudConnectionState;
  label: string;
  message: string;
  latencyMs?: number;
  url?: string;
  lastChecked: string;
  details?: string;
}

let cachedStatus: CloudStatusResult = {
  isLive: false,
  status: 'checking',
  label: 'Checking...',
  message: 'Testing cloud database connection...',
  lastChecked: new Date().toLocaleTimeString(),
};

export function getCachedCloudStatus(): CloudStatusResult {
  return cachedStatus;
}

export function resetSupabaseClient(): void {
  supabaseClient = null;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  // Check Vite env first, then saved user config
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '';
  const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '';
  
  const saved = OfflineStorage.getSupabaseConfig();
  const url = (envUrl || saved.url || '').trim();
  const anonKey = (envKey || saved.anonKey || '').trim();

  if (url && anonKey && url.startsWith('http')) {
    try {
      supabaseClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabaseClient = null;
    }
  }

  return supabaseClient;
}

/**
 * Checks actual real-time cloud database connectivity.
 * Verifies that the cloud endpoint is reachable, the credentials are valid,
 * and the database tables are responding.
 */
export async function checkCloudStatus(timeoutMs: number = 5000): Promise<CloudStatusResult> {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '';
  const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '';
  const saved = OfflineStorage.getSupabaseConfig();
  const url = (envUrl || saved.url || '').trim();
  const anonKey = (envKey || saved.anonKey || '').trim();
  const now = new Date().toLocaleTimeString();

  if (!url || !anonKey || !url.startsWith('http')) {
    cachedStatus = {
      isLive: false,
      status: 'local',
      label: 'Local Mode',
      message: 'No cloud database URL configured. Using local offline storage.',
      url: url || 'None',
      lastChecked: now,
    };
    return cachedStatus;
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    cachedStatus = {
      isLive: false,
      status: 'offline',
      label: 'Cloud Offline',
      message: 'No internet connection detected on this device. Operating in offline mode.',
      url,
      lastChecked: now,
    };
    return cachedStatus;
  }

  const client = getSupabaseClient();
  if (!client) {
    cachedStatus = {
      isLive: false,
      status: 'offline',
      label: 'Cloud Offline',
      message: 'Failed to initialize Supabase client with current credentials.',
      url,
      lastChecked: now,
    };
    return cachedStatus;
  }

  const startTime = Date.now();
  try {
    const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) =>
      setTimeout(() => reject(new Error('Connection timed out (no response within 5s)')), timeoutMs)
    );

    // Test a lightweight query to verify the cloud database table responds
    const queryPromise = client.from('customers').select('id').limit(1);

    const { error } = await Promise.race([queryPromise, timeoutPromise]);
    const latency = Date.now() - startTime;

    if (!error) {
      cachedStatus = {
        isLive: true,
        status: 'live',
        label: 'Cloud Live',
        message: 'Connected to Supabase cloud database. Real-time sync is active.',
        latencyMs: latency,
        url,
        lastChecked: now,
      };
      return cachedStatus;
    }

    const errMsg = error.message || '';
    if (
      error.code === 'PGRST205' ||
      errMsg.toLowerCase().includes('schema cache') ||
      errMsg.toLowerCase().includes('not find the table') ||
      errMsg.toLowerCase().includes('relation')
    ) {
      cachedStatus = {
        isLive: false,
        status: 'tables_missing',
        label: 'Cloud Setup Needed',
        message: 'Cloud project is reachable, but database tables are not yet created in Supabase. Using local storage.',
        details: errMsg,
        latencyMs: latency,
        url,
        lastChecked: now,
      };
      return cachedStatus;
    }

    cachedStatus = {
      isLive: false,
      status: 'offline',
      label: 'Cloud Offline',
      message: 'Cloud database returned an error. Using local offline storage.',
      details: errMsg,
      latencyMs: latency,
      url,
      lastChecked: now,
    };
    return cachedStatus;
  } catch (err: any) {
    const latency = Date.now() - startTime;
    cachedStatus = {
      isLive: false,
      status: 'offline',
      label: 'Cloud Offline',
      message: 'Cannot reach Supabase cloud server. Operating in offline local mode.',
      details: err?.message || 'Network unreachable',
      latencyMs: latency,
      url,
      lastChecked: now,
    };
    return cachedStatus;
  }
}

export function isCloudConnected(): boolean {
  return cachedStatus.isLive;
}

// ==========================================
// REMOTE LICENSE MANAGEMENT & KILL SWITCH
// ==========================================
export interface LicenseCheckResult {
  isLocked: boolean;
  status: string;
  reason: string;
  contactEmail?: string;
  contactPhone?: string;
}

export async function checkSystemLicense(): Promise<LicenseCheckResult> {
  // 1. Check local persistent lock status first (works offline so internet disconnect cannot bypass)
  const localStatus = OfflineStorage.getLicenseStatus();
  if (localStatus && (localStatus.startsWith('SUSPENDED') || localStatus.startsWith('LOCKED') || localStatus.startsWith('EXPIRED'))) {
    return {
      isLocked: true,
      status: 'SUSPENDED',
      reason: localStatus.replace(/^(SUSPENDED|LOCKED|EXPIRED):?\s*/i, '') || 'Software license has been temporarily suspended.',
      contactEmail: 'contact@karamamess.ae',
      contactPhone: '+971 50 123 4567',
    };
  }

  // 2. Check cloud status if Supabase is reachable
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('businesses')
        .select('trade_license_no')
        .limit(1)
        .single();

      if (!error && data) {
        const tradeNo = (data.trade_license_no || '').trim();
        if (
          tradeNo.toUpperCase().startsWith('SUSPENDED') ||
          tradeNo.toUpperCase().startsWith('LOCKED') ||
          tradeNo.toUpperCase().startsWith('EXPIRED')
        ) {
          const reason = tradeNo.replace(/^(SUSPENDED|LOCKED|EXPIRED):?\s*/i, '') || 'Software license has been suspended due to pending payment.';
          OfflineStorage.setLicenseStatus(tradeNo);
          return {
            isLocked: true,
            status: 'SUSPENDED',
            reason: reason,
            contactEmail: 'contact@karamamess.ae',
            contactPhone: '+971 50 123 4567',
          };
        } else {
          // Cloud indicates license is in good standing
          OfflineStorage.setLicenseStatus('ACTIVE');
        }
      }
    } catch (err) {
      console.warn('License verification cloud check error:', err);
    }
  }

  return {
    isLocked: false,
    status: 'ACTIVE',
    reason: '',
  };
}

export async function setRemoteLicenseLock(lock: boolean, reason: string = 'Payment overdue'): Promise<{ success: boolean; error?: string }> {
  const newStatus = lock ? `SUSPENDED: ${reason}` : 'DXB-MESS-2026-889';
  OfflineStorage.setLicenseStatus(lock ? newStatus : 'ACTIVE');
  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client
        .from('businesses')
        .update({ trade_license_no: newStatus, updated_at: new Date().toISOString() })
        .neq('id', 'placeholder-none');
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}

// ==========================================
// BUSINESS & SETTINGS
// ==========================================
export async function fetchBusinessSettings(): Promise<BusinessSettings> {
  const client = getSupabaseClient();
  if (!client) {
    return OfflineStorage.getSettings();
  }
  try {
    const { data, error } = await client.from('business_settings').select('*').limit(1).single();
    if (error || !data) return OfflineStorage.getSettings();
    return data as BusinessSettings;
  } catch {
    return OfflineStorage.getSettings();
  }
}

export async function updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
  const client = getSupabaseClient();
  const current = OfflineStorage.saveSettings(settings);
  if (client) {
    try {
      await client.from('business_settings').upsert({
        ...current,
        business_id: current.business_id,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Cloud sync error for settings:', err);
    }
  }
  return current;
}

// ==========================================
// CUSTOMERS
// ==========================================
export async function fetchCustomers(): Promise<Customer[]> {
  const client = getSupabaseClient();
  if (!client) {
    return OfflineStorage.getCustomers();
  }
  try {
    const { data, error } = await client
      .from('customers')
      .select('*, building:buildings(*), room:rooms(*), meal_plan:meal_plans(*)')
      .order('full_name', { ascending: true });
    
    if (error || !data) {
      console.warn('Supabase fetch customers failed, using local cache:', error?.message);
      return OfflineStorage.getCustomers();
    }
    const mapped = (data as any[]).map((c) => {
      let cancellationDate = c.cancellation_date;
      let cancellationReason = c.cancellation_reason;
      if (!cancellationDate && c.notes && c.notes.includes('[NOTICE: Cancelling on ')) {
        const match = c.notes.match(/\[NOTICE: Cancelling on (\d{4}-\d{2}-\d{2})(?: \| Reason: ([^\]]+))?\]/);
        if (match) {
          cancellationDate = match[1];
          if (match[2]) cancellationReason = match[2];
        }
      }
      if (!cancellationDate && c.status === 'cancelling_soon' && c.billing_end_date) {
        cancellationDate = c.billing_end_date;
      }
      return {
        ...c,
        cancellation_date: cancellationDate,
        cancellation_reason: cancellationReason,
      } as Customer;
    });
    OfflineStorage.setCustomers(mapped);
    return mapped;
  } catch {
    return OfflineStorage.getCustomers();
  }
}

export async function saveCustomer(customer: Partial<Customer>): Promise<Customer> {
  const localSaved = OfflineStorage.saveCustomer(customer);
  const client = getSupabaseClient();
  if (client) {
    try {
      let syncedNotes = localSaved.notes || '';
      syncedNotes = syncedNotes.replace(/\[NOTICE: Cancelling on [^\]]+\]\s*/g, '').trim();
      if (localSaved.cancellation_date && localSaved.status !== 'cancelled') {
        const noticeTag = `[NOTICE: Cancelling on ${localSaved.cancellation_date}${localSaved.cancellation_reason ? ` | Reason: ${localSaved.cancellation_reason}` : ''}]`;
        syncedNotes = syncedNotes ? `${noticeTag} ${syncedNotes}` : noticeTag;
      }

      const payload: any = {
        id: localSaved.id,
        business_id: localSaved.business_id || DEFAULT_BUSINESS.id,
        customer_code: localSaved.customer_code,
        full_name: localSaved.full_name,
        phone: localSaved.phone || '',
        email: localSaved.email || '',
        building_id: (localSaved.building_id && localSaved.building_id !== 'custom') ? localSaved.building_id : null,
        room_id: localSaved.room_id || null,
        building_name_cache: localSaved.building_name_cache || '',
        apartment_cache: localSaved.apartment_cache || '',
        meal_plan_id: localSaved.meal_plan_id || null,
        has_breakfast: Boolean(localSaved.has_breakfast),
        has_lunch: localSaved.has_lunch !== undefined ? Boolean(localSaved.has_lunch) : true,
        has_dinner: localSaved.has_dinner !== undefined ? Boolean(localSaved.has_dinner) : true,
        monthly_rate: localSaved.monthly_rate || 380,
        dietary_preferences: localSaved.dietary_preferences || '',
        delivery_time: localSaved.delivery_time || '',
        door_passcode: localSaved.door_passcode || '',
        joining_date: localSaved.joining_date || new Date().toISOString().split('T')[0],
        billing_start_date: localSaved.billing_start_date || null,
        billing_end_date: localSaved.cancellation_date || localSaved.billing_end_date || null,
        status: localSaved.status || 'active',
        payment_rating: localSaved.payment_rating || 'Good',
        total_overdue: localSaved.total_overdue || 0,
        payment_made_up_to_date: localSaved.payment_made_up_to_date || null,
        billed_up_to_date: localSaved.billed_up_to_date || null,
        managed_by: localSaved.managed_by || 'customer',
        notes: syncedNotes,
        updated_at: new Date().toISOString()
      };

      let { data, error } = await client.from('customers').upsert(payload);

      // Handle duplicate customer_code collision (PostgreSQL error 23505)
      if (error && (error.code === '23505' || error.message?.includes('customer_code'))) {
        console.warn('Customer code collision detected, resolving highest code from cloud...');
        const { data: cloudCodes } = await client
          .from('customers')
          .select('customer_code')
          .order('created_at', { ascending: false })
          .limit(100);

        const nums = (cloudCodes || []).map((c: any) => parseInt(c.customer_code?.replace(/\D/g, '') || '0') || 0);
        const maxCodeNum = Math.max(0, ...nums);
        payload.customer_code = `CUST-${String(maxCodeNum + 1).padStart(3, '0')}`;
        localSaved.customer_code = payload.customer_code;
        OfflineStorage.saveCustomer(localSaved);

        const retry = await client.from('customers').upsert(payload);
        error = retry.error;
      }

      if (error) {
        console.error('Cloud sync error saving customer:', error.message);
      }
    } catch (err) {
      console.error('Cloud sync error saving customer:', err);
    }
  }
  return localSaved;
}

export async function deleteCustomer(id: string): Promise<boolean> {
  OfflineStorage.deleteCustomer(id);
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('customers').delete().eq('id', id);
    } catch (err) {
      console.error('Cloud sync error deleting customer:', err);
    }
  }
  return true;
}

export async function deleteAllCustomers(): Promise<void> {
  OfflineStorage.deleteAllCustomers();
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('customers').delete().neq('id', 'placeholder-none');
    } catch (err) {
      console.error('Cloud clear customers error:', err);
    }
  }
}

// ==========================================
// BUILDINGS & ROOMS
// ==========================================
export async function fetchBuildings(): Promise<Building[]> {
  const client = getSupabaseClient();
  if (!client) return OfflineStorage.getBuildings();
  try {
    const { data, error } = await client.from('buildings').select('*').order('name', { ascending: true });
    if (error || !data || data.length === 0) return OfflineStorage.getBuildings();
    OfflineStorage.setBuildings(data as Building[]);
    return data as Building[];
  } catch {
    return OfflineStorage.getBuildings();
  }
}

export async function saveBuilding(building: Partial<Building>): Promise<Building> {
  const local = OfflineStorage.saveBuilding(building);
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('buildings').upsert(local);
    } catch (err) {
      console.error('Cloud sync error saving building:', err);
    }
  }
  return local;
}

export async function deleteBuilding(id: string): Promise<boolean> {
  OfflineStorage.deleteBuilding(id);
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('buildings').delete().eq('id', id);
    } catch (err) {
      console.error('Cloud sync error deleting building:', err);
    }
  }
  return true;
}

export async function deleteBuildings(ids: string[]): Promise<boolean> {
  if (!ids || ids.length === 0) return true;
  OfflineStorage.deleteBuildings(ids);
  const client = getSupabaseClient();
  if (client) {
    try {
      for (let i = 0; i < ids.length; i += 50) {
        const chunk = ids.slice(i, i + 50);
        await client.from('buildings').delete().in('id', chunk);
      }
    } catch (err) {
      console.error('Cloud sync error batch deleting buildings:', err);
    }
  }
  return true;
}

export async function pruneEmptyBuildings(customers: Customer[]): Promise<number> {
  const currentBuildings = OfflineStorage.getBuildings();
  const residingCustomers = customers.filter(c => c.status !== 'left' && c.status !== 'cancelled');
  const occupiedIds = new Set(residingCustomers.map(c => c.building_id).filter(Boolean));
  const occupiedNames = new Set(residingCustomers.map(c => (c.building_name_cache || '').toLowerCase().trim()).filter(Boolean));
  const emptyBuildingIds = currentBuildings
    .filter(b => !occupiedIds.has(b.id) && !(b.name && occupiedNames.has(b.name.toLowerCase().trim())))
    .map(b => b.id);

  if (emptyBuildingIds.length > 0) {
    await deleteBuildings(emptyBuildingIds);
  }
  return emptyBuildingIds.length;
}

// ==========================================
// MEAL PLANS
// ==========================================
export async function fetchMealPlans(): Promise<MealPlan[]> {
  const client = getSupabaseClient();
  if (!client) return OfflineStorage.getMealPlans();
  try {
    const { data, error } = await client.from('meal_plans').select('*').order('monthly_price', { ascending: true });
    if (error || !data) return OfflineStorage.getMealPlans();
    return data as MealPlan[];
  } catch {
    return OfflineStorage.getMealPlans();
  }
}

export async function saveMealPlan(plan: Partial<MealPlan>): Promise<MealPlan> {
  const local = OfflineStorage.saveMealPlan(plan);
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('meal_plans').upsert(local);
    } catch (err) {
      console.error('Cloud sync error saving meal plan:', err);
    }
  }
  return local;
}

export async function deleteMealPlan(id: string): Promise<boolean> {
  const success = OfflineStorage.deleteMealPlan(id);
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('meal_plans').delete().eq('id', id);
    } catch (err) {
      console.error('Cloud sync error deleting meal plan:', err);
    }
  }
  return success;
}

// ==========================================
// INVOICES & PAYMENTS
// ==========================================
export async function fetchInvoices(): Promise<Invoice[]> {
  const client = getSupabaseClient();
  if (!client) return OfflineStorage.getInvoices();
  try {
    const { data, error } = await client.from('invoices').select('*, customer:customers(*)').order('issue_date', { ascending: false });
    if (error || !data) return OfflineStorage.getInvoices();
    OfflineStorage.setInvoices(data as Invoice[]);
    return data as Invoice[];
  } catch {
    return OfflineStorage.getInvoices();
  }
}

export async function createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
  const local = OfflineStorage.saveInvoice(invoice);
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('invoices').insert(local);
    } catch (err) {
      console.error('Cloud sync error creating invoice:', err);
    }
  }
  return local;
}

export async function updateInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
  const local = OfflineStorage.saveInvoice(invoice);
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('invoices').upsert(local);
    } catch (err) {
      console.error('Cloud sync error updating invoice:', err);
    }
  }
  return local;
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const success = OfflineStorage.deleteInvoice(id);
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('invoices').delete().eq('id', id);
    } catch (err) {
      console.error('Cloud sync error deleting invoice:', err);
    }
  }
  return success;
}

export async function fetchPayments(): Promise<Payment[]> {
  const client = getSupabaseClient();
  if (!client) return OfflineStorage.getPayments();
  try {
    const { data, error } = await client.from('payments').select('*, customer:customers(*)').order('payment_date', { ascending: false });
    if (error || !data) return OfflineStorage.getPayments();
    OfflineStorage.setPayments(data as Payment[]);
    return data as Payment[];
  } catch {
    return OfflineStorage.getPayments();
  }
}

export async function recordPayment(payment: Partial<Payment>): Promise<Payment> {
  const local = OfflineStorage.recordPayment(payment);
  const client = getSupabaseClient();
  if (client) {
    try {
      // 1. Record payment transaction in cloud
      await client.from('payments').insert(local);

      // 2. Synchronize the customer's reduced overdue and updated payment date to cloud
      if (payment.customer_id) {
        const customers = OfflineStorage.getCustomers();
        const updatedCust = customers.find(
          c => c.id === payment.customer_id || c.customer_code === payment.customer_id
        );
        if (updatedCust) {
          const { error: custErr } = await client
            .from('customers')
            .update({
              total_overdue: updatedCust.total_overdue ?? 0,
              payment_rating: updatedCust.payment_rating || ((updatedCust.total_overdue ?? 0) > 0 ? 'Late payer' : 'Good'),
              payment_made_up_to_date: updatedCust.payment_made_up_to_date,
              updated_at: new Date().toISOString()
            })
            .eq('id', updatedCust.id);
          if (custErr) {
            console.error('Cloud sync error updating customer overdue on payment:', custErr);
          }
        }
      }

      // 3. Synchronize any updated invoices to cloud
      if (local.invoice_id) {
        const invoices = OfflineStorage.getInvoices();
        const updatedInv = invoices.find(
          i => i.id === local.invoice_id || i.invoice_number === local.invoice_id
        );
        if (updatedInv) {
          await client
            .from('invoices')
            .update({
              paid_amount: updatedInv.paid_amount,
              balance_amount: updatedInv.balance_amount,
              status: updatedInv.status,
              updated_at: new Date().toISOString()
            })
            .eq('id', updatedInv.id);
        }
      } else if (payment.customer_id) {
        const invoices = OfflineStorage.getInvoices();
        const custInvoices = invoices.filter(i => i.customer_id === payment.customer_id);
        for (const inv of custInvoices) {
          await client
            .from('invoices')
            .update({
              paid_amount: inv.paid_amount,
              balance_amount: inv.balance_amount,
              status: inv.status,
              updated_at: new Date().toISOString()
            })
            .eq('id', inv.id);
        }
      }
    } catch (err) {
      console.error('Cloud sync error recording payment:', err);
    }
  }
  return local;
}

// ==========================================
// DASHBOARD METRICS
// ==========================================
export async function fetchDashboardMetrics(
  customCustomers?: Customer[],
  customInvoices?: Invoice[],
  customPayments?: Payment[]
): Promise<DashboardMetrics> {
  return OfflineStorage.getDashboardMetrics(customCustomers, customInvoices, customPayments);
}

// ==========================================
// VENDOR ACCOUNTS MANAGEMENT MODULE
// ==========================================
export async function fetchVendors(): Promise<Vendor[]> {
  const client = getSupabaseClient();
  if (!client) {
    return OfflineStorage.getVendors();
  }
  try {
    const { data, error } = await client
      .from('vendors')
      .select('*')
      .order('name', { ascending: true });
    
    if (error || !data || data.length === 0) {
      const localVendors = OfflineStorage.getVendors();
      if (localVendors.length > 0 && !error) {
        for (const lv of localVendors) {
          await saveVendor(lv);
        }
      }
      return OfflineStorage.getVendors();
    }
    OfflineStorage.setVendors(data as Vendor[]);
    return data as Vendor[];
  } catch {
    return OfflineStorage.getVendors();
  }
}

export async function saveVendor(vendor: any, user = 'admin'): Promise<Vendor> {
  const local = OfflineStorage.saveVendor(vendor, user);
  const client = getSupabaseClient();
  if (client) {
    try {
      const payload: any = {
        id: local.id,
        business_id: local.business_id,
        vendor_code: local.vendor_code,
        name: local.name,
        contact_person: local.contact_person || null,
        phone: local.phone || null,
        address: local.address || null,
        category: local.category,
        breakfast_rate: local.breakfast_rate || 0,
        lunch_rate: local.lunch_rate || 0,
        dinner_rate: local.dinner_rate || 0,
        service_charge_config: local.service_charge_config || { type: 'fixed', value: 0, is_enabled: false },
        delivery_charge_config: local.delivery_charge_config || { type: 'fixed', value: 0, is_enabled: false },
        packing_charge_config: local.packing_charge_config || { type: 'fixed', value: 0, is_enabled: false },
        other_charges_config: local.other_charges_config || { type: 'fixed', value: 0, is_enabled: false },
        opening_balance: local.opening_balance || 0,
        payment_terms: local.payment_terms || 'Weekly',
        status: local.status || 'active',
        notes: local.notes || null,
        updated_at: new Date().toISOString()
      };
      await client.from('vendors').upsert(payload, { onConflict: 'id' });
    } catch (err) {
      console.error('Cloud sync error for vendor:', err);
    }
  }
  return local;
}

export async function deleteVendor(id: string, user = 'admin'): Promise<boolean> {
  const success = OfflineStorage.deleteVendor(id, user);
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('vendors').delete().eq('id', id);
    } catch (err) {
      console.error('Cloud delete vendor error:', err);
    }
  }
  return success;
}

export async function fetchVendorTransactions(vendorId?: string): Promise<VendorTransaction[]> {
  const client = getSupabaseClient();
  if (!client) {
    return OfflineStorage.getVendorTransactions(vendorId);
  }
  try {
    let query = client.from('vendor_transactions').select('*').order('date', { ascending: false });
    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }
    const { data, error } = await query;
    if (error || !data) {
      return OfflineStorage.getVendorTransactions(vendorId);
    }
    if (!vendorId && data.length > 0) {
      OfflineStorage.setVendorTransactions(data as VendorTransaction[]);
    }
    return data as VendorTransaction[];
  } catch {
    return OfflineStorage.getVendorTransactions(vendorId);
  }
}

export async function saveVendorTransaction(tx: any, user = 'admin'): Promise<VendorTransaction> {
  const local = OfflineStorage.saveVendorTransaction(tx, user);
  const client = getSupabaseClient();
  if (client) {
    try {
      const payload: any = {
        id: local.id,
        business_id: local.business_id,
        vendor_id: local.vendor_id,
        vendor_name_cache: local.vendor_name_cache || null,
        transaction_type: local.transaction_type,
        date: local.date,
        day_name: local.day_name || null,
        description: local.description || null,
        breakfast_qty: local.breakfast_qty || 0,
        lunch_qty: local.lunch_qty || 0,
        dinner_qty: local.dinner_qty || 0,
        breakfast_rate: local.breakfast_rate || 0,
        lunch_rate: local.lunch_rate || 0,
        dinner_rate: local.dinner_rate || 0,
        meal_charges: local.meal_charges || 0,
        service_charge: local.service_charge || 0,
        delivery_charge: local.delivery_charge || 0,
        packing_charge: local.packing_charge || 0,
        other_charges: local.other_charges || 0,
        discount: local.discount || 0,
        total_charges: local.total_charges || 0,
        amount_paid: local.amount_paid || 0,
        running_balance: local.running_balance || 0,
        payment_method: local.payment_method || null,
        reference_no: local.reference_no || null,
        remarks: local.remarks || null,
        updated_at: new Date().toISOString()
      };
      await client.from('vendor_transactions').upsert(payload, { onConflict: 'id' });
    } catch (err) {
      console.error('Cloud sync error for vendor transaction:', err);
    }
  }
  return local;
}

export async function deleteVendorTransaction(id: string, user = 'admin'): Promise<boolean> {
  const success = OfflineStorage.deleteVendorTransaction(id, user);
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('vendor_transactions').delete().eq('id', id);
    } catch (err) {
      console.error('Cloud delete vendor transaction error:', err);
    }
  }
  return success;
}

export async function fetchVendorPayments(vendorId?: string): Promise<VendorPayment[]> {
  const client = getSupabaseClient();
  if (!client) {
    return OfflineStorage.getVendorPayments(vendorId);
  }
  try {
    let query = client.from('vendor_payments').select('*').order('payment_date', { ascending: false });
    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }
    const { data, error } = await query;
    if (error || !data) {
      return OfflineStorage.getVendorPayments(vendorId);
    }
    if (!vendorId && data.length > 0) {
      OfflineStorage.setVendorPayments(data as VendorPayment[]);
    }
    return data as VendorPayment[];
  } catch {
    return OfflineStorage.getVendorPayments(vendorId);
  }
}

export async function recordVendorPayment(payment: any, user = 'admin'): Promise<VendorPayment> {
  const local = OfflineStorage.recordVendorPayment(payment, user);
  const client = getSupabaseClient();
  if (client) {
    try {
      const payload: any = {
        id: local.id,
        business_id: local.business_id,
        payment_number: local.payment_number,
        vendor_id: local.vendor_id,
        vendor_name_cache: local.vendor_name_cache || null,
        payment_date: local.payment_date,
        amount: local.amount || 0,
        payment_method: local.payment_method || 'cash',
        reference_number: local.reference_number || null,
        remarks: local.remarks || null,
        updated_at: new Date().toISOString()
      };
      await client.from('vendor_payments').upsert(payload, { onConflict: 'id' });
    } catch (err) {
      console.error('Cloud record vendor payment error:', err);
    }
  }
  return local;
}

export async function deleteVendorPayment(id: string, user = 'admin'): Promise<boolean> {
  const success = OfflineStorage.deleteVendorPayment(id, user);
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('vendor_payments').delete().eq('id', id);
    } catch (err) {
      console.error('Cloud delete vendor payment error:', err);
    }
  }
  return success;
}

export async function fetchVendorStatement(vendorId: string, startDate?: string, endDate?: string): Promise<any> {
  return OfflineStorage.getVendorStatement(vendorId, startDate, endDate);
}

export async function fetchVendorDashboardMetrics(): Promise<any> {
  return OfflineStorage.getVendorDashboardMetrics();
}

export async function fetchVendorAuditLogs(): Promise<any[]> {
  return OfflineStorage.getVendorAuditLogs();
}

export async function clearAllBusinessData(): Promise<void> {
  OfflineStorage.clearAllBusinessData();
  const client = getSupabaseClient();
  if (client) {
    try {
      await Promise.allSettled([
        client.from('customers').delete().neq('id', 'placeholder-none'),
        client.from('invoices').delete().neq('id', 'placeholder-none'),
        client.from('payments').delete().neq('id', 'placeholder-none'),
        client.from('vendors').delete().neq('id', 'placeholder-none'),
        client.from('vendor_transactions').delete().neq('id', 'placeholder-none'),
        client.from('vendor_payments').delete().neq('id', 'placeholder-none'),
      ]);
    } catch (err) {
      console.error('Cloud reset error:', err);
    }
  }
}

// ==========================================
// REALTIME MULTI-USER SYNCHRONIZATION
// ==========================================

export interface RealtimeSyncHandlers {
  onCustomerChange?: (event: 'INSERT' | 'UPDATE' | 'DELETE', customer: Customer, oldId?: string) => void;
  onPaymentChange?: (event: 'INSERT' | 'UPDATE' | 'DELETE', payment: Payment, oldId?: string) => void;
  onInvoiceChange?: (event: 'INSERT' | 'UPDATE' | 'DELETE', invoice: Invoice, oldId?: string) => void;
  onBuildingChange?: (event: 'INSERT' | 'UPDATE' | 'DELETE', building: Building, oldId?: string) => void;
  onLicenseChange?: (isLocked: boolean, reason?: string) => void;
  onVendorChange?: (event: 'INSERT' | 'UPDATE' | 'DELETE', vendor: Vendor, oldId?: string) => void;
  onVendorTransactionChange?: (event: 'INSERT' | 'UPDATE' | 'DELETE', tx: VendorTransaction, oldId?: string) => void;
  onVendorPaymentChange?: (event: 'INSERT' | 'UPDATE' | 'DELETE', payment: VendorPayment, oldId?: string) => void;
}

// Global active handler registry & shared singleton WebSocket channel
const activeSyncHandlers = new Set<RealtimeSyncHandlers>();
let sharedRealtimeChannel: any = null;
let isChannelSubscribed = false;

function ensureSharedRealtimeChannel(client: SupabaseClient): void {
  const channelName = 'karama-realtime-sync';

  // If we already have a channel that is joined/subscribing, reuse it
  if (sharedRealtimeChannel && isChannelSubscribed) {
    const st: string = (sharedRealtimeChannel as any).state || (sharedRealtimeChannel as any).subState || '';
    if (st === 'joined' || st === 'joining' || st === 'subscribing') return;
    // Channel is in an error/closed state — tear it down and recreate
    try { client.removeChannel(sharedRealtimeChannel); } catch {}
    sharedRealtimeChannel = null;
    isChannelSubscribed = false;
  }

  try {
    // Check if the Supabase client already has a live channel by this name
    const existing = (client.getChannels() || []).find(
      (ch: any) =>
        ch.topic === `realtime:${channelName}` ||
        ch.topic === channelName ||
        ch.subTopic === channelName
    );
    if (existing) {
      const existingState: string = (existing as any).state || (existing as any).subState || '';
      // Only reuse if it is in a good state — otherwise remove and recreate
      if (existingState === 'joined' || existingState === 'joining' || existingState === 'subscribing') {
        sharedRealtimeChannel = existing;
        isChannelSubscribed = true;
        return;
      }
      // Stale channel — remove it
      try { client.removeChannel(existing); } catch {}
    }

    // Create a brand-new channel and attach all postgres_changes listeners BEFORE subscribe
    const channel = client.channel(channelName, { config: { broadcast: { self: false } } });

    sharedRealtimeChannel = channel;
    isChannelSubscribed = true;

    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        (payload) => {
          const event = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
          const newRecord = payload.new as Customer;
          const oldRecord = payload.old as { id?: string };
          activeSyncHandlers.forEach((h) => {
            try { h.onCustomerChange?.(event, newRecord, oldRecord?.id); } catch (e) { console.error(e); }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        (payload) => {
          const event = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
          const newRecord = payload.new as Payment;
          const oldRecord = payload.old as { id?: string };
          activeSyncHandlers.forEach((h) => {
            try { h.onPaymentChange?.(event, newRecord, oldRecord?.id); } catch (e) { console.error(e); }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices' },
        (payload) => {
          const event = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
          const newRecord = payload.new as Invoice;
          const oldRecord = payload.old as { id?: string };
          activeSyncHandlers.forEach((h) => {
            try { h.onInvoiceChange?.(event, newRecord, oldRecord?.id); } catch (e) { console.error(e); }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'buildings' },
        (payload) => {
          const event = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
          const newRecord = payload.new as Building;
          const oldRecord = payload.old as { id?: string };
          activeSyncHandlers.forEach((h) => {
            try { h.onBuildingChange?.(event, newRecord, oldRecord?.id); } catch (e) { console.error(e); }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vendors' },
        (payload) => {
          const event = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
          const newRecord = payload.new as Vendor;
          const oldRecord = payload.old as { id?: string };
          activeSyncHandlers.forEach((h) => {
            try { h.onVendorChange?.(event, newRecord, oldRecord?.id); } catch (e) { console.error(e); }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vendor_transactions' },
        (payload) => {
          const event = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
          const newRecord = payload.new as VendorTransaction;
          const oldRecord = payload.old as { id?: string };
          activeSyncHandlers.forEach((h) => {
            try { h.onVendorTransactionChange?.(event, newRecord, oldRecord?.id); } catch (e) { console.error(e); }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vendor_payments' },
        (payload) => {
          const event = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
          const newRecord = payload.new as VendorPayment;
          const oldRecord = payload.old as { id?: string };
          activeSyncHandlers.forEach((h) => {
            try { h.onVendorPaymentChange?.(event, newRecord, oldRecord?.id); } catch (e) { console.error(e); }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'businesses' },
        (payload) => {
          const newRecord = payload.new as { trade_license_no?: string };
          const tradeNo = (newRecord?.trade_license_no || '').trim();
          const isLocked = tradeNo.toUpperCase().startsWith('SUSPENDED') || tradeNo.toUpperCase().startsWith('LOCKED');
          const reason = tradeNo.replace(/^(SUSPENDED|LOCKED|EXPIRED):?\s*/i, '');
          if (isLocked) {
            OfflineStorage.setLicenseStatus(tradeNo);
          } else {
            OfflineStorage.setLicenseStatus('ACTIVE');
          }
          activeSyncHandlers.forEach((h) => {
            try { h.onLicenseChange?.(isLocked, reason); } catch (e) { console.error(e); }
          });
        }
      )
      .subscribe((status) => {
        console.log('[Supabase Realtime] Multi-device sync status:', status);
      });
  } catch (err) {
    console.warn('[Supabase Realtime] Safe fallback on channel initialization:', err);
  }
}

export function subscribeToRealtimeChanges(handlers: RealtimeSyncHandlers): () => void {
  const client = getSupabaseClient();
  if (!client) {
    return () => {};
  }

  activeSyncHandlers.add(handlers);
  ensureSharedRealtimeChannel(client);

  return () => {
    activeSyncHandlers.delete(handlers);
    // Keep sharedRealtimeChannel persistent across component lifecycles to prevent
    // race conditions with Supabase's asynchronous channel teardown and avoid 'after subscribe()' errors.
  };
}

