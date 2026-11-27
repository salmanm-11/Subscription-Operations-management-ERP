# 🛰️ Orbit ERP — Enterprise Subscription & Operations Platform

> **Engineered by Hiro Axis Technologies**  
> A high-performance, local-first enterprise ERP and recurring subscription management platform built with React 18, TypeScript, Vite, Tailwind CSS, and Supabase Realtime synchronization.

---

## 🌟 Executive Overview

**Orbit ERP** is a modern mission-critical operational system designed to automate recurring client subscriptions, automated pro-rata invoicing, multi-driver dispatch runs, daily meal/service fulfillment tracking, and real-time vendor ledger accounting.

Featuring an **offline-first local cache architecture**, Orbit operates with zero downtime — performing instant sub-millisecond local reads/writes while synchronizing seamlessly with cloud infrastructure across multiple client devices.

---

## 🚀 Key Architectural Modules

### 1. 👥 Client Subscriptions & Ledger Management
- Comprehensive client registry with multi-zone geographic delivery clustering.
- Real-time subscription state machine (`Active`, `Trial`, `Pending Renewal`, `Paused`, `Terminated`).
- Dynamic pro-rata billing engine with automated calendar cycle adjustments.
- Instant 1-click WhatsApp payment receipts and renewal notifications.

### 2. 📊 High-Contrast Operations Dashboard
- Real-time KPI telemetry: Active Contracts, Pending Settlements, Revenue Trajectory, Overdue Balances.
- Interactive weekly revenue performance charts with peak-day trajectory indicators.
- Live system status overview and active subscription notifications.

### 3. 🛵 Route Dispatch & Delivery Execution
- Geographic building and cluster dispatch sheets with door passcode records and delivery drop notes.
- Driver dispatch run sheets with instant 1-click execution logging.
- Direct customer communication channels via telephony and instant messaging.

### 4. 🏢 Vendor Operations & Trade Credit Ledger
- Multi-supplier procurement ledger with automated balance tracking.
- Statement generation, payment tracking, and audit trails.

### 5. 🔒 Security & Cryptographic Hashing
- Secure client-side cryptographic **SHA-256 password hashing**.
- Zero-exposure credential storage and session persistence.
- Complete environment separation via `.env` configuration.
- Remote kill-switch and developer license governance.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18 (Hooks, Suspense, Concurrent Mode) |
| **Language** | TypeScript 5.6 (Strict Type Safety) |
| **Build Tool & Bundler** | Vite 5.4 with HMR |
| **Styling & UI** | Tailwind CSS 3.4 (Obsidian Matte Theme, Neon Accents) |
| **Icons** | Lucide React |
| **Cloud Synchronization** | Supabase JS Client & Realtime WebSocket Channels |
| **Desktop Wrapper** | Electron 32 (Cross-Platform Native Desktop Packaging) |
| **Quality Assurance** | Vitest (Automated Test Suite with 100% Pass Rate) |

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/salmanm-11/karama-mess-web.git
   cd karama-mess-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Add your cloud credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Run Automated Test Suite:**
   ```bash
   npm test
   ```

---

## 📄 License
Proprietary software. Developed and maintained by **Hiro Axis Technologies**. All rights reserved.
