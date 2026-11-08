import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App';
import { CustomerDetailModal } from '../src/components/customers/CustomerDetailModal';
import { CustomerList } from '../src/components/customers/CustomerList';
import { Customer, Building, MealPlan } from '../src/types';
import { OfflineStorage } from '../src/api/offlineStorage';

describe('App rendering verification', () => {
  it('renders App without throwing runtime exceptions', () => {
    if (typeof localStorage === 'undefined') {
      const storage: Record<string, string> = {};
      (globalThis as any).localStorage = {
        getItem: (k: string) => storage[k] || null,
        setItem: (k: string, v: string) => { storage[k] = v; },
        removeItem: (k: string) => { delete storage[k]; },
        clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
      };
    }

    expect(() => {
      const html = renderToString(React.createElement(App));
      expect(html).toBeDefined();
    }).not.toThrow();
  });

  it('renders CustomerDetailModal closed and open without hook count mismatch', () => {
    const mockCustomer: Customer = {
      id: 'cust-101',
      business_id: 'biz-1',
      customer_code: 'CUST-101',
      full_name: 'Saran',
      phone: '+971 50 5670387',
      emergency_contact: '+971 55 1234567',
      monthly_rate: 310,
      has_breakfast: false,
      has_lunch: true,
      has_dinner: true,
      status: 'active',
      joining_date: '2026-10-01',
      billing_start_date: '2026-10-01',
      payment_made_up_to_date: '2026-10-06',
      billed_up_to_date: '2026-10-31',
      total_overdue: 250,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
    };

    // 1. Closed state
    expect(() => {
      const closedHtml = renderToString(
        React.createElement(CustomerDetailModal, {
          isOpen: false,
          customer: mockCustomer,
          onClose: () => {},
          onEdit: () => {},
        })
      );
      expect(closedHtml).toBe('');
    }).not.toThrow();

    // 2. Open state (Opening the modal must execute the same number of hooks)
    expect(() => {
      const openHtml = renderToString(
        React.createElement(CustomerDetailModal, {
          isOpen: true,
          customer: mockCustomer,
          onClose: () => {},
          onEdit: () => {},
        })
      );
      expect(openHtml).toContain('Saran');
      expect(openHtml).toContain('CUST-101');
      expect(openHtml).toContain('250');
    }).not.toThrow();
  });

  it('computes live dashboard metrics matching customer list counts accurately', () => {
    const mockList = [
      { id: '1', status: 'active', has_breakfast: true, has_lunch: true, has_dinner: true, total_overdue: 100, monthly_rate: 380 },
      { id: '2', status: 'active', has_breakfast: false, has_lunch: true, has_dinner: true, total_overdue: 0, monthly_rate: 310 },
      { id: '3', status: 'paused', has_breakfast: false, has_lunch: false, has_dinner: false, total_overdue: 50, monthly_rate: 380 },
      { id: '4', status: 'trial', has_breakfast: true, has_lunch: false, has_dinner: false, total_overdue: 0, monthly_rate: 180 },
    ];

    const metrics = OfflineStorage.getDashboardMetrics(mockList as unknown as Customer[]);
    expect(metrics.totalCustomers).toBe(4);
    expect(metrics.activeCustomers).toBe(2);
    expect(metrics.runningAccounts).toBe(2);
    expect(metrics.trialCustomers).toBe(1);
    expect(metrics.inactiveCustomers).toBe(1);
    expect(metrics.totalOutstandingDues).toBe(150);
    expect(metrics.todayBreakfast).toBe(2);
  });

  it('renders CustomerList with Which Area? Area Cluster filter and clusters', () => {
    const mockBuildings: Building[] = [
      { id: 'bld-1', business_id: 'biz-1', name: 'Al Rostamani', area: 'Hamdan Colony & Post', created_at: '2026-10-01T00:00:00Z' },
      { id: 'bld-2', business_id: 'biz-1', name: 'Vijazla', area: 'Park, Pioneer & ADCB', created_at: '2026-10-01T00:00:00Z' },
      { id: 'bld-3', business_id: 'biz-1', name: 'Al Wasl D', area: 'Karama Central', created_at: '2026-10-01T00:00:00Z' },
    ];

    const mockCustomers: Customer[] = [
      {
        id: 'cust-1',
        business_id: 'biz-1',
        customer_code: 'CUST-001',
        full_name: 'Aaromal',
        building_id: 'bld-2',
        building_name_cache: 'Vijazla',
        apartment_cache: '106',
        status: 'active',
        has_breakfast: false,
        has_lunch: true,
        has_dinner: true,
        monthly_rate: 380,
      } as Customer,
    ];

    const html = renderToString(
      React.createElement(CustomerList, {
        customers: mockCustomers,
        buildings: mockBuildings,
        mealPlans: [],
        onAddCustomer: () => {},
        onEditCustomer: () => {},
        onDeleteCustomer: () => {},
        onExportCsv: () => {},
      })
    );

    // Verify "Which Area? Area Cluster" dropdown is rendered
    expect(html).toContain('Which Area? Area Cluster (All)');
    expect(html).toContain('Hamdan Colony &amp; Post');
    expect(html).toContain('Park, Pioneer &amp; ADCB');
    expect(html).toContain('Karama Central');
    expect(html).toContain('All Buildings (3)');
    expect(html).toContain('Vijazla');
    expect(html).toContain('Filter by Building (Click to open search box)');
  });

  it('hides registration notification in Header when customer is deleted from customers roster', async () => {
    const { Header } = await import('../src/components/layout/Header');
    const deletedCustomer: Customer = {
      id: 'cust-deleted-121',
      customer_code: 'CUST-121',
      full_name: 'Jsh',
      managed_by: 'online_self_service',
    } as Customer;

    // 1. When customer has been deleted (customers array is empty or does not include cust-deleted-121)
    const htmlDeleted = renderToString(
      React.createElement(Header, {
        customers: [],
        latestRegistrant: deletedCustomer,
      })
    );
    expect(htmlDeleted).not.toContain('New Reg');
    expect(htmlDeleted).not.toContain('Jsh');
    expect(htmlDeleted).not.toContain('CUST-121');

    // 2. When customer exists in customers roster, Header shows the registration badge
    const htmlActive = renderToString(
      React.createElement(Header, {
        customers: [deletedCustomer],
        latestRegistrant: deletedCustomer,
      })
    );
    expect(htmlActive).toContain('New Reg');
    expect(htmlActive).toContain('Jsh');
    expect(htmlActive).toContain('CUST-121');
  });
});
