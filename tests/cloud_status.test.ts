import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Header } from '../src/components/layout/Header';
import { CloudStatusResult } from '../src/api/supabase';

describe('Cloud Live Indicator & Diagnostics Verification', () => {
  it('renders Header with Cloud Live (connected) indicator and pulsing dot', () => {
    const liveStatus: CloudStatusResult = {
      isLive: true,
      status: 'live',
      label: 'Cloud Live',
      message: 'Connected to Supabase cloud database. Real-time sync is active.',
      latencyMs: 85,
      url: 'https://test-project.supabase.co',
      lastChecked: '17:45:00',
    };

    const html = renderToString(
      React.createElement(Header, {
        userName: 'Admin',
        userRole: 'Administrator',
        isCloud: true,
        cloudStatus: liveStatus,
      })
    );

    expect(html).toContain('Cloud Live');
    expect(html).toContain('animate-ping');
  });

  it('renders Header with Cloud Offline indicator when disconnected', () => {
    const offlineStatus: CloudStatusResult = {
      isLive: false,
      status: 'offline',
      label: 'Cloud Offline',
      message: 'Cannot reach Supabase cloud server. Operating in offline local mode.',
      details: 'Connection timed out',
      url: 'https://test-project.supabase.co',
      lastChecked: '17:45:00',
    };

    const html = renderToString(
      React.createElement(Header, {
        userName: 'Admin',
        userRole: 'Administrator',
        isCloud: false,
        cloudStatus: offlineStatus,
      })
    );

    expect(html).toContain('Cloud Offline');
  });

  it('renders Header with Cloud Setup Needed when tables are missing', () => {
    const setupStatus: CloudStatusResult = {
      isLive: false,
      status: 'tables_missing',
      label: 'Cloud Setup Needed',
      message: 'Cloud project is reachable, but database tables are not yet created in Supabase.',
      details: "Could not find the table 'public.customers' in the schema cache",
      latencyMs: 140,
      url: 'https://test-project.supabase.co',
      lastChecked: '17:45:00',
    };

    const html = renderToString(
      React.createElement(Header, {
        userName: 'Admin',
        userRole: 'Administrator',
        isCloud: false,
        cloudStatus: setupStatus,
      })
    );

    expect(html).toContain('Cloud Setup Needed');
  });

  it('renders Header with Checking state during test', () => {
    const checkingStatus: CloudStatusResult = {
      isLive: false,
      status: 'checking',
      label: 'Checking...',
      message: 'Testing cloud connection...',
      lastChecked: '17:45:00',
    };

    const html = renderToString(
      React.createElement(Header, {
        userName: 'Admin',
        userRole: 'Administrator',
        isCloud: false,
        cloudStatus: checkingStatus,
        isCheckingCloud: true,
      })
    );

    expect(html).toContain('Checking...');
    expect(html).toContain('animate-spin');
  });
});
