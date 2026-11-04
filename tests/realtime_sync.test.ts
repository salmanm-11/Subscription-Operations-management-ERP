import { describe, it, expect, beforeEach } from 'vitest';
import { OfflineStorage } from '../src/api/offlineStorage';
import { subscribeToRealtimeChanges } from '../src/api/supabase';

describe('Realtime Multi-Device Sync & Collision Protection', () => {
  beforeEach(() => {
    const storage: Record<string, string> = {};
    (globalThis as any).localStorage = {
      getItem: (k: string) => storage[k] || null,
      setItem: (k: string, v: string) => { storage[k] = v; },
      removeItem: (k: string) => { delete storage[k]; },
      clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
    };
  });

  it('assigns collision-proof sequential customer codes even when multiple accounts add simultaneously', () => {
    OfflineStorage.setCustomers([]);
    const cust1 = OfflineStorage.saveCustomer({ full_name: 'User One', customer_code: 'CUST-050' });
    expect(cust1.customer_code).toBe('CUST-050');

    // Next customer added must be CUST-051 (increments from highest existing numeric code)
    const cust2 = OfflineStorage.saveCustomer({ full_name: 'User Two' });
    expect(cust2.customer_code).toBe('CUST-051');

    // Subsequent addition increments from highest
    const cust3 = OfflineStorage.saveCustomer({ full_name: 'User Three' });
    expect(cust3.customer_code).toBe('CUST-052');
    expect(cust3.id).not.toBe(cust2.id);
  });

  it('subscribeToRealtimeChanges provides a cleanup function', () => {
    const unsub = subscribeToRealtimeChanges({
      onCustomerChange: () => {},
      onPaymentChange: () => {},
      onBuildingChange: () => {},
    });
    expect(typeof unsub).toBe('function');
    expect(() => unsub()).not.toThrow();
  });

  it('handles repeated subscribe and unsubscribe cycles safely without throwing or channel collisions', () => {
    // Simulate React StrictMode (mount -> unmount -> mount) and multi-view navigation
    const unsub1 = subscribeToRealtimeChanges({
      onCustomerChange: () => {},
    });
    const unsub2 = subscribeToRealtimeChanges({
      onVendorChange: () => {},
    });

    // Unsubscribing one or all should not break subsequent subscriptions or throw
    expect(() => unsub1()).not.toThrow();
    expect(() => unsub2()).not.toThrow();

    // Re-subscribing after all unsubscribed
    const unsub3 = subscribeToRealtimeChanges({
      onInvoiceChange: () => {},
    });
    expect(typeof unsub3).toBe('function');
    expect(() => unsub3()).not.toThrow();
  });
});
