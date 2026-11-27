import React, { useState, useEffect } from 'react';
import { MobileTab, MobileBottomNav } from './components/MobileBottomNav';
import { MobileOnboardingView } from './screens/MobileOnboardingView';
import { MobileDashboardView } from './screens/MobileDashboardView';
import { MobileCustomerDetailView } from './screens/MobileCustomerDetailView';
import { MobileCustomerListView } from './screens/MobileCustomerListView';
import { MobileAttendanceView } from './screens/MobileAttendanceView';
import { MobilePaymentsView } from './screens/MobilePaymentsView';
import { MobileReportsView } from './screens/MobileReportsView';
import { MobileMoreView } from './screens/MobileMoreView';
import { MobileRecordPaymentModal } from './components/MobileRecordPaymentModal';
import { CustomerModal } from '../components/customers/CustomerModal';
import { Customer, Building, MealPlan, Invoice, Payment, BusinessSettings } from '../types';
import { CloudStatusResult } from '../api/supabase';

interface MobileAppProps {
  customers: Customer[];
  buildings: Building[];
  mealPlans: MealPlan[];
  invoices: Invoice[];
  payments: Payment[];
  settings: BusinessSettings;
  cloudStatus?: CloudStatusResult;
  onRefreshData?: () => void;
  onSaveCustomer: (customer: Partial<Customer>) => Promise<Customer | void>;
  onDeleteCustomer: (id: string) => Promise<boolean | void> | void;
  onRecordPayment: (payment: Partial<Payment>) => Promise<Payment | void>;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
  onSwitchToDesktop?: () => void;
}

export const MobileApp: React.FC<MobileAppProps> = ({
  customers,
  buildings,
  mealPlans,
  invoices,
  payments,
  settings,
  cloudStatus,
  onRefreshData,
  onSaveCustomer,
  onDeleteCustomer,
  onRecordPayment,
  onLogout,
  userName = 'Admin',
  userRole = 'Administrator',
  onSwitchToDesktop,
}) => {
  // Navigation State
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('orbit_mobile_onboarded') === 'true';
  });

  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [payingCustomer, setPayingCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Handle Onboarding Completion
  const handleFinishOnboarding = () => {
    localStorage.setItem('orbit_mobile_onboarded', 'true');
    setHasCompletedOnboarding(true);
  };

  // Keep viewingCustomer synchronized with latest live data
  const liveViewingCustomer = viewingCustomer
    ? customers.find((c) => c.id === viewingCustomer.id || c.customer_code === viewingCustomer.customer_code) || viewingCustomer
    : null;

  // 1. Render Onboarding Screen if not completed
  if (!hasCompletedOnboarding) {
    return (
      <MobileOnboardingView
        onGetStarted={handleFinishOnboarding}
        onSkip={handleFinishOnboarding}
      />
    );
  }

  // 2. Render Fullscreen Customer Details View if a customer is selected
  if (liveViewingCustomer) {
    return (
      <>
        <MobileCustomerDetailView
          customer={liveViewingCustomer}
          invoices={invoices}
          payments={payments}
          mealPlans={mealPlans}
          onBack={() => setViewingCustomer(null)}
          onRecordPayment={(c) => setPayingCustomer(c)}
          onEditCustomer={(c) => {
            setEditingCustomer(c);
            setIsCustomerModalOpen(true);
          }}
          onDeleteCustomer={onDeleteCustomer}
        />

        {payingCustomer && (
          <MobileRecordPaymentModal
            customer={payingCustomer}
            isOpen={Boolean(payingCustomer)}
            onClose={() => setPayingCustomer(null)}
            onConfirmPayment={async (p) => {
              await onRecordPayment(p);
            }}
          />
        )}

        {isCustomerModalOpen && (
          <CustomerModal
            isOpen={isCustomerModalOpen}
            onClose={() => {
              setIsCustomerModalOpen(false);
              setEditingCustomer(null);
            }}
            onSave={async (c) => {
              await onSaveCustomer(c);
              setIsCustomerModalOpen(false);
              setEditingCustomer(null);
            }}
            customer={editingCustomer}
            buildings={buildings}
            mealPlans={mealPlans}
          />
        )}
      </>
    );
  }

  // 3. Render Mark Attendance Screen if open
  if (isAttendanceOpen) {
    return (
      <MobileAttendanceView
        customers={customers}
        buildings={buildings}
        onBack={() => setIsAttendanceOpen(false)}
      />
    );
  }

  // 4. Main Tab Navigation Content
  return (
    <div className="min-h-screen bg-[#FBF8F5] text-stone-800">
      {activeTab === 'home' && (
        <MobileDashboardView
          customers={customers}
          invoices={invoices}
          payments={payments}
          userName={userName}
          onOpenMenu={() => setActiveTab('more')}
          onOpenAlerts={() => setActiveTab('more')}
          onMarkAttendance={() => setIsAttendanceOpen(true)}
          onViewCustomerList={() => setActiveTab('customers')}
          onViewOverdueList={() => setActiveTab('customers')}
        />
      )}

      {activeTab === 'customers' && (
        <MobileCustomerListView
          customers={customers}
          buildings={buildings}
          onSelectCustomer={(c) => setViewingCustomer(c)}
          onAddCustomer={() => {
            setEditingCustomer(null);
            setIsCustomerModalOpen(true);
          }}
        />
      )}

      {activeTab === 'payments' && (
        <MobilePaymentsView
          payments={payments}
          customers={customers}
          onOpenRecordPayment={() => {
            if (customers.length > 0) {
              setPayingCustomer(customers[0]);
            }
          }}
        />
      )}

      {activeTab === 'reports' && (
        <MobileReportsView
          customers={customers}
          payments={payments}
          invoices={invoices}
        />
      )}

      {activeTab === 'more' && (
        <MobileMoreView
          cloudStatus={cloudStatus}
          onRefreshData={onRefreshData}
          onLogout={onLogout}
          userName={userName}
          userRole={userRole}
        />
      )}

      {/* Persistent Bottom Tab Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(t) => setActiveTab(t)}
      />

      {/* Modals */}
      {payingCustomer && (
        <MobileRecordPaymentModal
          customer={payingCustomer}
          isOpen={Boolean(payingCustomer)}
          onClose={() => setPayingCustomer(null)}
          onConfirmPayment={async (p) => {
            await onRecordPayment(p);
          }}
        />
      )}

      {isCustomerModalOpen && (
        <CustomerModal
          isOpen={isCustomerModalOpen}
          onClose={() => {
            setIsCustomerModalOpen(false);
            setEditingCustomer(null);
          }}
          onSave={async (c) => {
            await onSaveCustomer(c);
            setIsCustomerModalOpen(false);
            setEditingCustomer(null);
          }}
          customer={editingCustomer}
          buildings={buildings}
          mealPlans={mealPlans}
        />
      )}
    </div>
  );
};
