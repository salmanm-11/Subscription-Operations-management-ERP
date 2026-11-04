// Karama Mess Single Page Application Frontend
const app = {
  currentTab: 'dashboard',
  stats: null,
  customers: [],
  areas: [],
  currentDeliveryArea: '',
  kitchenDate: new Date().toISOString().split('T')[0],

  init() {
    this.bindEvents();
    this.handleRoute();
    this.loadAllData();
  },

  bindEvents() {
    // Nav Tabs
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = btn.dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });

    // Mobile menu toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Refresh button
    document.getElementById('btn-refresh')?.addEventListener('click', () => this.loadAllData());

    // Quick add buttons in top header
    document.getElementById('btn-quick-customer')?.addEventListener('click', () => this.openCustomerModal());
    document.getElementById('btn-quick-ledger')?.addEventListener('click', () => this.openLedgerModal());

    // Customer search & filters
    const searchInput = document.getElementById('cust-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.filterCustomers());
    }
    document.getElementById('cust-filter-area')?.addEventListener('change', () => this.filterCustomers());
    document.getElementById('cust-filter-status')?.addEventListener('change', () => this.filterCustomers());
    document.getElementById('cust-filter-meals')?.addEventListener('change', () => this.filterCustomers());
    document.getElementById('cust-filter-rating')?.addEventListener('change', () => this.filterCustomers());
    document.getElementById('cust-filter-dues')?.addEventListener('change', () => this.filterCustomers());

    // Kitchen date controls
    const kDatePicker = document.getElementById('kitchen-date-picker');
    if (kDatePicker) {
      kDatePicker.value = this.kitchenDate;
      kDatePicker.addEventListener('change', (e) => {
        this.kitchenDate = e.target.value;
        this.loadKitchenData();
      });
    }
    document.getElementById('btn-kitchen-today')?.addEventListener('click', () => {
      this.kitchenDate = new Date().toISOString().split('T')[0];
      if (kDatePicker) kDatePicker.value = this.kitchenDate;
      this.loadKitchenData();
    });
    document.getElementById('btn-kitchen-prev')?.addEventListener('click', () => {
      const d = new Date(this.kitchenDate);
      d.setDate(d.getDate() - 1);
      this.kitchenDate = d.toISOString().split('T')[0];
      if (kDatePicker) kDatePicker.value = this.kitchenDate;
      this.loadKitchenData();
    });
    document.getElementById('btn-kitchen-next')?.addEventListener('click', () => {
      const d = new Date(this.kitchenDate);
      d.setDate(d.getDate() + 1);
      this.kitchenDate = d.toISOString().split('T')[0];
      if (kDatePicker) kDatePicker.value = this.kitchenDate;
      this.loadKitchenData();
    });

    // Delivery meal filter
    document.getElementById('delivery-meal-slot')?.addEventListener('change', () => this.loadDeliveryData());

    // Delivery area pills
    document.getElementById('delivery-area-pills')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.delivery-area-btn');
      if (!btn) return;
      document.querySelectorAll('.delivery-area-btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      this.currentDeliveryArea = btn.dataset.area || '';
      this.loadDeliveryData();
    });

    // Billing tier filter
    document.getElementById('billing-filter-tier')?.addEventListener('change', () => this.loadBillingData());

    // Days Calculator
    document.getElementById('btn-run-calc')?.addEventListener('click', () => this.runCalculator());
    document.getElementById('btn-calc-apply')?.addEventListener('click', () => this.applyCalculatorToCustomer());

    // Ledger month filter
    document.getElementById('ledger-month-select')?.addEventListener('change', () => this.loadLedgerData());

    // Modal forms submission
    document.getElementById('btn-save-customer')?.addEventListener('click', () => this.saveCustomer());
    document.getElementById('btn-save-payment')?.addEventListener('click', () => this.savePayment());
    document.getElementById('btn-save-ledger')?.addEventListener('click', () => this.saveLedgerEntry());
    document.getElementById('btn-save-group-payment')?.addEventListener('click', () => this.saveGroupPayment());
    document.getElementById('btn-save-baddebt')?.addEventListener('click', () => this.saveBadDebt());

    // Set default dates in calculator
    const todayStr = new Date().toISOString().split('T')[0];
    const calcStart = document.getElementById('calc-start-date');
    const calcEnd = document.getElementById('calc-end-date');
    if (calcStart && !calcStart.value) calcStart.value = todayStr;
    if (calcEnd && !calcEnd.value) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 10);
      calcEnd.value = nextWeek.toISOString().split('T')[0];
    }
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`tab-${hash}`)) {
      this.switchTab(hash);
    }
  },

  switchTab(tabName) {
    this.currentTab = tabName;
    window.location.hash = tabName;

    // Close mobile sidebar if open
    document.getElementById('sidebar')?.classList.remove('mobile-open');

    // Update active nav button
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update active tab panel
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
      pane.style.display = 'none';
    });

    const activePane = document.getElementById(`tab-${tabName}`);
    if (activePane) {
      activePane.classList.add('active');
      activePane.style.display = 'block';
    }

    // Update Header Title
    const titles = {
      dashboard: ['Dashboard', 'Live Mess Operations, Subscriptions & Accounts'],
      customers: ['Customer Subscriptions', 'Roster of Active, Trial, & Cancelled Customers'],
      kitchen: ['Kitchen Preparation Board', 'Batch Counts, Dietary Specifications & Custom Boxes'],
      delivery: ['Delivery Dispatch Routes', 'Driver Run Sheets Grouped by Building with Passcodes'],
      billing: ['Billing & Overdue Collections', 'Outstanding Dues, Payment Ratings & WhatsApp Reminders'],
      calculator: ['Days & Pro-Rata Calculator', 'Partial Month & Custom Subscription Fee Estimator'],
      ledger: ['Moms Accounts (Daily Ledger)', 'Financial Bookkeeping: Daily Charges, Collections & Balance'],
      groups: ['Group Accounts (Thahir Group)', 'Corporate Accounts & Multi-Staff Accommodation Billing'],
      'bad-debts': ['Bad Debts Register', 'Defaulted & Outstanding Accounts History'],
      mobile: ['Mobile Staff Access', 'Connect Drivers & Kitchen on Local Wi-Fi Network']
    };

    if (titles[tabName]) {
      document.getElementById('page-heading').innerText = titles[tabName][0];
      document.getElementById('page-subheading').innerText = titles[tabName][1];
    }

    // Trigger tab specific refresh
    if (tabName === 'kitchen') this.loadKitchenData();
    else if (tabName === 'delivery') this.loadDeliveryData();
    else if (tabName === 'billing') this.loadBillingData();
    else if (tabName === 'ledger') this.loadLedgerData();
    else if (tabName === 'groups') this.loadGroupsData();
    else if (tabName === 'bad-debts') this.loadBadDebtsData();
    else if (tabName === 'calculator') this.populateCalculatorCustomers();
  },

  async loadAllData() {
    await this.loadStats();
    await this.loadCustomers();
  },

  // 1. STATS
  async loadStats() {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (!data.success) return;
      this.stats = data.stats;

      // Update KPIs
      document.getElementById('kpi-active-subs').innerText = this.stats.activeCustomers;
      document.getElementById('kpi-subs-breakdown').innerText = `Trials: ${this.stats.trialCustomers} | Notice: ${this.stats.underNotice}`;
      
      document.getElementById('kpi-today-meals').innerText = this.stats.todayMeals.total;
      document.getElementById('kpi-meals-breakdown').innerText = `BF: ${this.stats.todayMeals.bf} | LN: ${this.stats.todayMeals.ln} | DN: ${this.stats.todayMeals.dn}`;
      
      document.getElementById('kpi-total-overdue').innerText = `AED ${Math.round(this.stats.totalOverdue).toLocaleString()}`;
      document.getElementById('kpi-debtors-count').innerText = `${this.stats.debtorsCount} pending accounts`;

      document.getElementById('kpi-bad-debts').innerText = `AED ${Math.round(this.stats.badDebtsTotal).toLocaleString()}`;
      document.getElementById('kpi-bad-debts-count').innerText = `${this.stats.badDebtsCount} past accounts`;

      // Sidebar badges
      const custBadge = document.getElementById('badge-cust-count');
      if (custBadge) custBadge.innerText = this.stats.activeCustomers;
      const duesBadge = document.getElementById('badge-dues');
      if (duesBadge) duesBadge.innerText = `${Math.round(this.stats.totalOverdue / 1000)}K`;

      // Local IP display
      if (this.stats.localIps && this.stats.localIps.length > 0) {
        const ip = this.stats.localIps[0];
        const port = this.stats.serverPort || 3000;
        const url = `http://${ip}:${port}`;
        const pill = document.getElementById('sidebar-ip-text');
        if (pill) pill.innerText = `Wi-Fi: ${ip}:${port}`;
        const urlBox = document.getElementById('mobile-url-box');
        if (urlBox) urlBox.innerText = url;
      }

      // Render Area distribution on Dashboard
      this.renderDashboardAreas();
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  },

  renderDashboardAreas() {
    const container = document.getElementById('dashboard-area-list');
    if (!container || !this.stats || !this.stats.areaStats) return;

    let html = '';
    for (const a of this.stats.areaStats) {
      html += `
        <div style="padding: 10px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 700; font-size: 14px;">${this.escape(a.area)}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
              BF: <b>${a.bf}</b> | LN: <b>${a.ln}</b> | DN: <b>${a.dn}</b>
            </div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:12px;">${a.count} Active</span>
            <div style="font-size: 11px; color: var(--danger); font-weight: 600; margin-top: 2px;">
              Dues: AED ${Math.round(a.dues || 0)}
            </div>
          </div>
        </div>
      `;
    }
    container.innerHTML = html || '<p style="padding:14px; color:var(--text-muted);">No area data</p>';
  },

  // 2. CUSTOMERS
  async loadCustomers() {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (!data.success) return;
      this.customers = data.customers;
      this.areas = data.areas || [];

      // Populate area select filters
      const areaFilter = document.getElementById('cust-filter-area');
      const modalArea = document.getElementById('cust-form-area');
      if (areaFilter) {
        areaFilter.innerHTML = '<option value="">All Areas</option>' + 
          this.areas.map(a => `<option value="${this.escape(a)}">${this.escape(a)}</option>`).join('');
      }

      this.renderCustomersTable(this.customers);
      this.renderDashboardNotices(this.customers);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  },

  filterCustomers() {
    const search = (document.getElementById('cust-search')?.value || '').toLowerCase().trim();
    const area = document.getElementById('cust-filter-area')?.value || '';
    const status = document.getElementById('cust-filter-status')?.value || '';
    const meal = document.getElementById('cust-filter-meals')?.value || '';
    const rating = document.getElementById('cust-filter-rating')?.value || '';
    const duesOnly = document.getElementById('cust-filter-dues')?.checked;

    const filtered = this.customers.filter(c => {
      if (search) {
        const matches = (c.customer_name || '').toLowerCase().includes(search) ||
                        (c.building_name || '').toLowerCase().includes(search) ||
                        (c.apartment || '').toLowerCase().includes(search) ||
                        (c.label || '').toLowerCase().includes(search) ||
                        (c.remarks || '').toLowerCase().includes(search) ||
                        (c.phone || '').toLowerCase().includes(search);
        if (!matches) return false;
      }

      if (area && c.area !== area) return false;
      if (status && c.status !== status) return false;
      if (rating && c.payment_rating !== rating) return false;
      if (duesOnly && (!c.total_overdue || c.total_overdue <= 0)) return false;

      if (meal === '3') {
        if (!(c.bf === 1 && c.ln === 1 && c.dn === 1)) return false;
      } else if (meal === '2') {
        const cnt = c.bf + c.ln + c.dn;
        if (cnt !== 2) return false;
      } else if (meal === '1') {
        const cnt = c.bf + c.ln + c.dn;
        if (cnt !== 1) return false;
      }

      return true;
    });

    this.renderCustomersTable(filtered);
  },

  renderCustomersTable(list) {
    const tbody = document.getElementById('customers-tbody');
    if (!tbody) return;

    if (!list || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 32px; color: var(--text-muted);">No customers found matching filter criteria.</td></tr>`;
      return;
    }

    let html = '';
    for (const c of list) {
      const statusClass = {
        'Running': 'badge-running',
        'Trial': 'badge-trial',
        'Under Notice': 'badge-notice',
        'Cancelled': 'badge-cancelled',
        'Paused': 'badge-paused'
      }[c.status] || 'badge-running';

      const ratingClass = {
        'Good': 'badge-good',
        'Late payer': 'badge-late',
        'Bad': 'badge-bad'
      }[c.payment_rating] || '';

      const mealsHtml = `
        <span class="badge-meal ${c.bf ? 'active' : ''}">BF</span>
        <span class="badge-meal ${c.ln ? 'active' : ''}">LN</span>
        <span class="badge-meal ${c.dn ? 'active' : ''}">DN</span>
      `;

      let labelDisplay = '';
      if (c.label) {
        labelDisplay += `<div class="diet-label">${this.escape(c.label)}</div>`;
      }
      if (c.delivery_time) {
        labelDisplay += `<div style="font-size:11px; color:#0369a1; font-weight:600; margin-top:2px;">⏰ ${this.escape(c.delivery_time)}</div>`;
      }
      if (c.door_passcode) {
        labelDisplay += `<div style="margin-top:2px;"><span class="badge-passcode">🔑 ${this.escape(c.door_passcode)}</span></div>`;
      }
      if (c.remarks) {
        labelDisplay += `<div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${this.escape(c.remarks)}</div>`;
      }

      const overdueAmount = parseFloat(c.total_overdue) || 0;
      const overdueDisplay = overdueAmount > 0 
        ? `<span style="color:var(--danger); font-weight:700;">AED ${overdueAmount}</span>` 
        : `<span style="color:var(--accent); font-weight:600;">0</span>`;

      html += `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--secondary); font-size: 14px;">${this.escape(c.customer_name)}</div>
            <span class="badge ${statusClass}">${this.escape(c.status)}</span>
            ${c.phone ? `<div style="font-size:11px; color:var(--text-muted); margin-top:2px;">📞 ${this.escape(c.phone)}</div>` : ''}
          </td>
          <td>
            <div style="font-weight: 600;">${this.escape(c.building_name)}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${this.escape(c.area)}</div>
          </td>
          <td>
            <span class="apt-badge">${this.escape(c.apartment || 'N/A')}</span>
          </td>
          <td>${mealsHtml}</td>
          <td>${labelDisplay || '<span style="color:#cbd5e1;">-</span>'}</td>
          <td>
            <div style="font-size: 12px;">${c.billed_up_to || '-'}</div>
            ${c.payment_made_up_to ? `<div style="font-size:11px; color:var(--text-muted);">Paid to: ${c.payment_made_up_to}</div>` : ''}
          </td>
          <td>${overdueDisplay}</td>
          <td>
            ${c.payment_rating ? `<span class="badge ${ratingClass}">${this.escape(c.payment_rating)}</span>` : '<span style="color:#cbd5e1;">-</span>'}
            ${c.payment_remarks ? `<div style="font-size:11px; color:var(--text-muted); margin-top:2px; max-width:180px;">${this.escape(c.payment_remarks)}</div>` : ''}
          </td>
          <td>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <button class="btn btn-sm btn-whatsapp" onclick="app.sendWhatsAppReminder(${c.id})" title="Send WhatsApp Payment Reminder">💬</button>
              <button class="btn btn-sm btn-success" onclick="app.openPaymentModal(${c.id})" title="Record Payment">💵</button>
              <button class="btn btn-sm btn-secondary" onclick="app.editCustomer(${c.id})" title="Edit Customer">✏️</button>
            </div>
          </td>
        </tr>
      `;
    }

    tbody.innerHTML = html;
  },

  renderDashboardNotices(customers) {
    const notices = customers.filter(c => c.status === 'Under Notice' || (c.remarks && c.remarks.includes('❌')));
    const countBadge = document.getElementById('dashboard-notice-count');
    if (countBadge) countBadge.innerText = `${notices.length} customers`;

    const container = document.getElementById('dashboard-notice-list');
    if (!container) return;

    if (notices.length === 0) {
      container.innerHTML = `<p style="padding:14px; color:var(--text-muted);">No upcoming cancellations or notices.</p>`;
      return;
    }

    let html = '';
    for (const n of notices.slice(0, 7)) {
      html += `
        <div style="padding: 10px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 700; font-size: 13px;">${this.escape(n.customer_name)} <span style="font-size:11px; color:var(--text-muted);">(${this.escape(n.building_name)} #${this.escape(n.apartment)})</span></div>
            <div style="font-size: 12px; color: var(--danger); margin-top: 2px;">${this.escape(n.remarks || n.label)}</div>
          </div>
          <div>
            <button class="btn btn-sm btn-secondary" onclick="app.editCustomer(${n.id})">Review</button>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  },

  // 3. KITCHEN PREPARATION BOARD
  async loadKitchenData() {
    try {
      const res = await fetch(`/api/kitchen?date=${this.kitchenDate}`);
      const data = await res.json();
      if (!data.success) return;

      const hc = data.headcounts;
      document.getElementById('kitchen-bf-count').innerText = hc.breakfast;
      document.getElementById('kitchen-ln-count').innerText = hc.lunch;
      document.getElementById('kitchen-dn-count').innerText = hc.dinner;
      document.getElementById('kitchen-total-count').innerText = hc.grandTotal;

      const dbCounts = data.dietaryBreakdown;
      document.getElementById('count-barik-rice').innerText = dbCounts.barikRiceCount;
      document.getElementById('count-normal-rice').innerText = dbCounts.normalRiceCount;
      document.getElementById('count-chapati-sets').innerText = dbCounts.chapathiSetCount;
      document.getElementById('count-handmade').innerText = dbCounts.handmadeChapathiCount;
      document.getElementById('count-pure-veg').innerText = dbCounts.pureVegCount;
      document.getElementById('count-no-fish').innerText = dbCounts.noFishCount;
      document.getElementById('count-no-beef').innerText = dbCounts.noBeefCount;
      document.getElementById('count-egg-sub').innerText = dbCounts.eggSubstituteCount;

      // Render Special list
      const tbody = document.getElementById('kitchen-special-tbody');
      if (tbody) {
        if (!data.specialOrders || data.specialOrders.length === 0) {
          tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">No special preparations today. All standard menus.</td></tr>`;
          return;
        }

        let html = '';
        for (const s of data.specialOrders) {
          const meals = [s.bf ? 'BF' : '', s.ln ? 'LN' : '', s.dn ? 'DN' : ''].filter(Boolean).join('+');
          html += `
            <tr>
              <td style="font-weight:700;">${this.escape(s.name)}</td>
              <td>${this.escape(s.building)} <br><span style="font-size:11px; color:var(--text-muted);">${this.escape(s.area)}</span></td>
              <td><span class="apt-badge">${this.escape(s.apartment || '-')}</span></td>
              <td><span class="badge badge-meal active">${meals}</span></td>
              <td>${s.deliveryTime ? `<b>⏰ ${this.escape(s.deliveryTime)}</b>` : 'Regular'}</td>
              <td>
                <div class="diet-label">${this.escape(s.label || s.remarks)}</div>
              </td>
            </tr>
          `;
        }
        tbody.innerHTML = html;
      }
    } catch (err) {
      console.error('Failed to load kitchen data:', err);
    }
  },

  // 4. DELIVERY RUN SHEET
  async loadDeliveryData() {
    try {
      const meal = document.getElementById('delivery-meal-slot')?.value || 'all';
      const area = this.currentDeliveryArea;
      const res = await fetch(`/api/delivery?area=${encodeURIComponent(area)}&meal=${meal}`);
      const data = await res.json();
      if (!data.success) return;

      const container = document.getElementById('delivery-route-container');
      if (!container) return;

      if (!data.buildings || data.buildings.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); padding:32px; text-align:center;">No delivery stops found for the selected area and meal slot.</p>`;
        return;
      }

      let html = '';
      for (const b of data.buildings) {
        html += `
          <div class="building-card">
            <div class="building-header">
              <div class="building-title">
                <span style="font-size:20px;">🏢</span>
                <div>
                  <h4>${this.escape(b.buildingName)}</h4>
                  <span style="font-size:12px; color:var(--text-muted);">${this.escape(b.area)}</span>
                </div>
              </div>
              <span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:12px;">${b.stops.length} Deliveries</span>
            </div>
            <div class="stops-list">
        `;

        for (const stop of b.stops) {
          const isDelivered = (meal === 'BF' && stop.status_bf === 'delivered') ||
                              (meal === 'LN' && stop.status_ln === 'delivered') ||
                              (meal === 'DN' && stop.status_dn === 'delivered');

          const mealPills = `
            ${stop.bf ? `<span class="badge-meal ${stop.status_bf === 'delivered' ? 'badge-good' : 'active'}">BF</span>` : ''}
            ${stop.ln ? `<span class="badge-meal ${stop.status_ln === 'delivered' ? 'badge-good' : 'active'}">LN</span>` : ''}
            ${stop.dn ? `<span class="badge-meal ${stop.status_dn === 'delivered' ? 'badge-good' : 'active'}">DN</span>` : ''}
          `;

          html += `
            <div class="stop-row ${isDelivered ? 'delivered' : ''}" id="stop-row-${stop.id}">
              <div class="stop-info">
                <div class="stop-name">
                  <span>${this.escape(stop.name)}</span>
                  <span class="apt-badge">Apt #${this.escape(stop.apartment || 'N/A')}</span>
                  ${stop.passcode ? `<span class="badge-passcode">🔑 ${this.escape(stop.passcode)}</span>` : ''}
                </div>
                <div class="stop-meta">
                  <span>⏰ ${this.escape(stop.deliveryTime)}</span>
                  <span>🍱 ${mealPills}</span>
                  ${stop.phone ? `<span>📞 <a href="tel:${this.escape(stop.phone)}" style="color:var(--primary); font-weight:600;">${this.escape(stop.phone)}</a></span>` : ''}
                </div>
                ${stop.label ? `<div class="diet-label" style="margin-top:4px;">${this.escape(stop.label)}</div>` : ''}
              </div>

              <div style="display:flex; align-items:center; gap:8px;">
                <button class="deliver-btn ${isDelivered ? 'is-delivered' : ''}" onclick="app.toggleDelivered(${stop.id}, '${meal}', this)">
                  <span>${isDelivered ? '✅ Delivered' : '◻ Mark Delivered'}</span>
                </button>
              </div>
            </div>
          `;
        }

        html += `
            </div>
          </div>
        `;
      }

      container.innerHTML = html;
    } catch (err) {
      console.error('Failed to load delivery data:', err);
    }
  },

  async toggleDelivered(custId, meal, btn) {
    const mealType = meal === 'all' ? 'LN' : meal;
    const isDelivered = btn.classList.contains('is-delivered');
    const newStatus = isDelivered ? 'pending' : 'delivered';

    try {
      const res = await fetch('/api/delivery/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: custId,
          meal_type: mealType,
          status: newStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        if (newStatus === 'delivered') {
          btn.classList.add('is-delivered');
          btn.innerHTML = '<span>✅ Delivered</span>';
          document.getElementById(`stop-row-${custId}`)?.classList.add('delivered');
        } else {
          btn.classList.remove('is-delivered');
          btn.innerHTML = '<span>◻ Mark Delivered</span>';
          document.getElementById(`stop-row-${custId}`)?.classList.remove('delivered');
        }
      }
    } catch (err) {
      alert('Failed to update delivery status: ' + err.message);
    }
  },

  // 5. BILLING & DUES
  async loadBillingData() {
    try {
      const minDue = parseFloat(document.getElementById('billing-filter-tier')?.value || '0');
      const res = await fetch(`/api/billing?minOverdue=${minDue}`);
      const data = await res.json();
      if (!data.success) return;

      document.getElementById('billing-total-overdue').innerText = `AED ${Math.round(data.totalOverdueSum).toLocaleString()}`;
      
      const lateCount = data.customers.filter(c => c.payment_rating === 'Late payer').length;
      const goodCount = this.customers.filter(c => c.total_overdue === 0).length;
      document.getElementById('billing-late-count').innerText = lateCount;
      document.getElementById('billing-good-count').innerText = goodCount;

      const tbody = document.getElementById('billing-tbody');
      if (!tbody) return;

      if (!data.customers || data.customers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">No outstanding balances matching filter.</td></tr>`;
        return;
      }

      let html = '';
      for (const c of data.customers) {
        html += `
          <tr>
            <td style="font-weight:700;">${this.escape(c.customer_name)}</td>
            <td>${this.escape(c.building_name)} <br><span style="font-size:11px; color:var(--text-muted);">${this.escape(c.area)}</span></td>
            <td><span class="apt-badge">${this.escape(c.apartment || '-')}</span></td>
            <td>${c.billed_up_to || '-'}</td>
            <td>${c.payment_made_up_to || '-'}</td>
            <td><span style="color:var(--danger); font-weight:800; font-size:15px;">AED ${c.total_overdue}</span></td>
            <td style="max-width:200px; font-size:12px; color:var(--text-muted);">${this.escape(c.payment_remarks || '-')}</td>
            <td>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-sm btn-whatsapp" onclick="app.sendWhatsAppReminder(${c.id})" title="Send WhatsApp Reminder">💬 WhatsApp</button>
                <button class="btn btn-sm btn-success" onclick="app.openPaymentModal(${c.id})" title="Log Payment">💵 Pay</button>
              </div>
            </td>
          </tr>
        `;
      }
      tbody.innerHTML = html;
    } catch (err) {
      console.error('Failed to load billing:', err);
    }
  },

  sendWhatsAppReminder(custId) {
    const cust = this.customers.find(c => c.id === custId);
    if (!cust) return;

    const overdue = cust.total_overdue || 0;
    const billedDate = cust.billed_up_to || 'the current period';

    const message = 
      `*Karama Mess & Catering - Payment Reminder*\n\n` +
      `Dear ${cust.customer_name},\n` +
      `Hope you are enjoying our tiffin meals! 🍲\n\n` +
      `This is a friendly reminder that your mess dues up to *${billedDate}* is *AED ${overdue}*.\n\n` +
      `Please arrange to settle the dues at your earliest convenience via Cash or Bank Transfer.\n` +
      `If you have already paid, kindly ignore this message or send the receipt.\n\n` +
      `Thank you!\n*Karama Mess Operations*`;

    let phone = (cust.phone || '').replace(/[^0-9]/g, '');
    if (phone.startsWith('05')) phone = '971' + phone.substring(1);
    else if (phone.length === 9) phone = '971' + phone;

    const waUrl = phone 
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
  },

  // 6. DAYS CALCULATOR
  async runCalculator() {
    const startDate = document.getElementById('calc-start-date')?.value;
    const endDate = document.getElementById('calc-end-date')?.value;
    const times = document.getElementById('calc-times')?.value;
    const deduction = document.getElementById('calc-deduction')?.value || '0';
    const customRate = document.getElementById('calc-custom-rate')?.value;

    if (!startDate || !endDate) {
      alert('Please select both Start Date and End Date.');
      return;
    }

    try {
      const res = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          times_of_food: times,
          deduction_amount: deduction,
          custom_daily_rate: customRate
        })
      });
      const data = await res.json();
      if (!data.success) return alert(data.error);

      const c = data.calculation;
      document.getElementById('res-days').innerText = `${c.numberOfDays} Days`;
      document.getElementById('res-rate').innerText = `AED ${c.dailyRate.toFixed(2)}`;
      document.getElementById('res-base').innerText = `AED ${c.baseCharges}`;
      document.getElementById('res-deduction').innerText = `AED ${c.deductionAmount}`;
      document.getElementById('res-times').innerText = `${c.timesOfFood} Times/day`;
      document.getElementById('res-final').innerText = `AED ${c.finalCharges}`;

      // Save for apply
      this.lastCalculation = c;
    } catch (err) {
      alert('Calculation failed: ' + err.message);
    }
  },

  populateCalculatorCustomers() {
    const sel = document.getElementById('calc-apply-customer');
    if (!sel) return;
    sel.innerHTML = '<option value="">Select customer to update...</option>' + 
      this.customers.map(c => `<option value="${c.id}">${this.escape(c.customer_name)} (${this.escape(c.building_name)} #${this.escape(c.apartment)}) - Dues: AED ${c.total_overdue}</option>`).join('');
  },

  async applyCalculatorToCustomer() {
    const custId = document.getElementById('calc-apply-customer')?.value;
    if (!custId || !this.lastCalculation) {
      alert('Please select a customer and calculate the charges first.');
      return;
    }

    const c = this.lastCalculation;
    if (!confirm(`Apply charge of AED ${c.finalCharges} to selected customer for period ${c.startDate} to ${c.endDate}?`)) return;

    try {
      const cust = this.customers.find(item => item.id == custId);
      const newOverdue = (cust.total_overdue || 0) + c.finalCharges;
      const remarks = (cust.remarks ? cust.remarks + '; ' : '') + `Billed ${c.numberOfDays} days (${c.startDate} to ${c.endDate}): ${c.finalCharges} AED`;

      const res = await fetch(`/api/customers/${custId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cust,
          billed_up_to: c.endDate,
          total_overdue: newOverdue,
          remarks
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('Customer bill updated successfully!');
        this.loadCustomers();
      }
    } catch (err) {
      alert('Failed to update customer: ' + err.message);
    }
  },

  // 7. MOMS ACCOUNTS (DAILY LEDGER)
  async loadLedgerData() {
    try {
      const month = document.getElementById('ledger-month-select')?.value || '';
      const res = await fetch(`/api/ledger?month=${month}`);
      const data = await res.json();
      if (!data.success) return;

      // Update month dropdown if needed
      const monthSel = document.getElementById('ledger-month-select');
      if (monthSel && monthSel.options.length <= 1 && data.availableMonths) {
        data.availableMonths.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m;
          opt.innerText = m;
          monthSel.appendChild(opt);
        });
      }

      document.getElementById('ledger-stat-charges').innerText = `AED ${data.summary.totalCharges.toLocaleString()}`;
      document.getElementById('ledger-stat-collected').innerText = `AED ${data.summary.totalPaid.toLocaleString()}`;
      document.getElementById('ledger-stat-net').innerText = `AED ${data.summary.netDifference.toLocaleString()}`;

      const tbody = document.getElementById('ledger-tbody');
      if (!tbody) return;

      if (!data.ledger || data.ledger.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 24px; color: var(--text-muted);">No ledger entries found.</td></tr>`;
        return;
      }

      let html = '';
      for (const r of data.ledger) {
        html += `
          <tr>
            <td style="font-weight:700;">${r.date}</td>
            <td>${r.day_name}</td>
            <td>${r.bf_count || 0}</td>
            <td>${r.ln_count || 0}</td>
            <td>${r.dn_count || 0}</td>
            <td style="font-weight:700; color:var(--secondary);">AED ${(r.daily_total_charges || 0).toFixed(2)}</td>
            <td style="font-weight:700; color:${r.amount_paid > 0 ? 'var(--accent)' : 'inherit'};">
              ${r.amount_paid > 0 ? `AED ${r.amount_paid}` : '-'}
            </td>
            <td style="font-weight:700; color:${r.balance < 0 ? 'var(--accent)' : 'var(--danger)'};">
              AED ${(r.balance || 0).toFixed(2)}
            </td>
            <td style="font-size:12px; color:var(--text-muted); max-width:200px;">${this.escape(r.remarks || '-')}</td>
          </tr>
        `;
      }
      tbody.innerHTML = html;
    } catch (err) {
      console.error('Failed to load ledger:', err);
    }
  },

  // 8. GROUP ACCOUNTS (THAHIR GROUP)
  async loadGroupsData() {
    try {
      const res = await fetch('/api/groups');
      const data = await res.json();
      if (!data.success) return;

      const container = document.getElementById('groups-container');
      if (!container) return;

      if (!data.groups || data.groups.length === 0) {
        container.innerHTML = `<p style="padding:20px; color:var(--text-muted);">No corporate groups found.</p>`;
        return;
      }

      let html = '';
      for (const g of data.groups) {
        html += `
          <div class="building-card" style="margin-bottom:28px;">
            <div class="building-header" style="background:#0f172a; color:#fff;">
              <div>
                <h4 style="color:#fff; font-size:17px;">🏢 ${this.escape(g.group_name)}</h4>
                <div style="font-size:12px; color:#94a3b8; margin-top:2px;">Coordinator: ${this.escape(g.coordinator_name)} (${this.escape(g.coordinator_phone || 'No phone')})</div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <button class="btn btn-sm btn-whatsapp" onclick="app.sendGroupWhatsAppStatement(${g.id})">💬 Share Statement</button>
                <button class="btn btn-sm btn-success" onclick="app.openGroupPaymentModal(${g.id})">💵 Record Payment</button>
              </div>
            </div>

            <!-- Group Financial Summary Bar -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px; padding:16px 20px; background:#f8fafc; border-bottom:1px solid var(--border);">
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Old Balance</div>
                <div style="font-size:16px; font-weight:700;">AED ${g.old_balance || 0}</div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Member Charges</div>
                <div style="font-size:16px; font-weight:700;">AED ${g.total_charges || 0}</div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Total Paid</div>
                <div style="font-size:16px; font-weight:700; color:var(--accent);">AED ${g.amount_paid || 0}</div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Total Overdue</div>
                <div style="font-size:18px; font-weight:800; color:var(--danger);">AED ${g.total_overdue || 0}</div>
              </div>
            </div>

            <!-- Members Table -->
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Building / Flat</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Rate</th>
                    <th>Amount (AED)</th>
                  </tr>
                </thead>
                <tbody>
                  ${g.members.map(m => `
                    <tr>
                      <td style="font-weight:700;">${this.escape(m.member_name)}</td>
                      <td>${this.escape(m.building)}</td>
                      <td>${m.start_date || '-'}</td>
                      <td>${m.end_date || '-'}</td>
                      <td><b>${m.days_count}</b></td>
                      <td>AED ${m.daily_rate}</td>
                      <td style="font-weight:700;">AED ${m.amount}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            ${g.notes ? `<div style="padding:10px 20px; font-size:12px; color:var(--text-muted); background:#fafafa; border-top:1px solid var(--border);">📝 <b>Payment Log:</b> ${this.escape(g.notes)}</div>` : ''}
          </div>
        `;
      }

      container.innerHTML = html;
      this.groups = data.groups;
    } catch (err) {
      console.error('Failed to load groups:', err);
    }
  },

  sendGroupWhatsAppStatement(groupId) {
    const grp = this.groups?.find(g => g.id === groupId);
    if (!grp) return;

    let statement = `*Karama Mess - Corporate Statement*\n*${grp.group_name}*\n\n`;
    statement += `Coordinator: ${grp.coordinator_name}\n`;
    statement += `------------------------------------\n`;
    grp.members.forEach(m => {
      statement += `${m.member_name} (${m.building}): ${m.days_count} days = AED ${m.amount}\n`;
    });
    statement += `------------------------------------\n`;
    statement += `Charges: AED ${grp.total_charges}\n`;
    if (grp.old_balance > 0) statement += `Old Balance: AED ${grp.old_balance}\n`;
    statement += `Paid: AED ${grp.amount_paid}\n`;
    statement += `*Overdue Balance: AED ${grp.total_overdue}*\n\n`;
    statement += `Please verify and transfer the remaining balance.\nThank you!`;

    let phone = (grp.coordinator_phone || '').replace(/[^0-9]/g, '');
    const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(statement)}` : `https://wa.me/?text=${encodeURIComponent(statement)}`;
    window.open(url, '_blank');
  },

  // 9. BAD DEBTS
  async loadBadDebtsData() {
    try {
      const res = await fetch('/api/bad-debts');
      const data = await res.json();
      if (!data.success) return;

      const tbody = document.getElementById('bad-debts-tbody');
      if (!tbody) return;

      let html = '';
      for (const b of data.badDebts) {
        html += `
          <tr>
            <td style="font-weight:700;">${this.escape(b.customer_name)}</td>
            <td>${this.escape(b.building_name)} <span class="apt-badge">${this.escape(b.apartment || '')}</span></td>
            <td>${this.escape(b.meals || '-')}</td>
            <td style="color:var(--danger); font-weight:800; font-size:15px;">AED ${b.amount_due}</td>
            <td style="font-size:12px; color:var(--text-muted);">${this.escape(b.notes || '-')}</td>
            <td>
              <span class="badge ${b.status === 'Recovered' ? 'badge-good' : 'badge-notice'}">${b.status}</span>
            </td>
            <td>
              ${b.status !== 'Recovered' ? `<button class="btn btn-sm btn-success" onclick="app.markDebtRecovered(${b.id})">Mark Recovered</button>` : '<span>-</span>'}
            </td>
          </tr>
        `;
      }
      tbody.innerHTML = html;
    } catch (err) {
      console.error('Failed to load bad debts:', err);
    }
  },

  async markDebtRecovered(id) {
    if (!confirm('Mark this bad debt as fully recovered?')) return;
    try {
      await fetch(`/api/bad-debts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Recovered' })
      });
      this.loadBadDebtsData();
      this.loadStats();
    } catch (err) {
      alert('Error updating debt: ' + err.message);
    }
  },

  // MODAL HANDLERS
  openCustomerModal(custId = null) {
    document.getElementById('modal-cust-title').innerText = custId ? 'Edit Customer' : 'Add New Customer';
    document.getElementById('cust-form-id').value = custId || '';

    if (custId) {
      const c = this.customers.find(item => item.id === custId);
      if (c) {
        document.getElementById('cust-form-name').value = c.customer_name || '';
        document.getElementById('cust-form-phone').value = c.phone || '';
        document.getElementById('cust-form-area').value = c.area || '';
        document.getElementById('cust-form-building').value = c.building_name || '';
        document.getElementById('cust-form-apt').value = c.apartment || '';
        document.getElementById('cust-form-status').value = c.status || 'Running';
        document.getElementById('cust-form-bf').checked = c.bf === 1;
        document.getElementById('cust-form-ln').checked = c.ln === 1;
        document.getElementById('cust-form-dn').checked = c.dn === 1;
        document.getElementById('cust-form-delivery-time').value = c.delivery_time || '';
        document.getElementById('cust-form-passcode').value = c.door_passcode || '';
        document.getElementById('cust-form-label').value = c.label || '';
        document.getElementById('cust-form-remarks').value = c.remarks || '';
        document.getElementById('cust-form-paydate').value = c.payment_made_up_to || '';
        document.getElementById('cust-form-billeddate').value = c.billed_up_to || '';
        document.getElementById('cust-form-overdue').value = c.total_overdue || 0;
        document.getElementById('cust-form-rating').value = c.payment_rating || '';
        document.getElementById('cust-form-payremarks').value = c.payment_remarks || '';
      }
    } else {
      document.getElementById('cust-form-name').value = '';
      document.getElementById('cust-form-phone').value = '';
      document.getElementById('cust-form-building').value = '';
      document.getElementById('cust-form-apt').value = '';
      document.getElementById('cust-form-status').value = 'Running';
      document.getElementById('cust-form-bf').checked = false;
      document.getElementById('cust-form-ln').checked = true;
      document.getElementById('cust-form-dn').checked = true;
      document.getElementById('cust-form-delivery-time').value = '';
      document.getElementById('cust-form-passcode').value = '';
      document.getElementById('cust-form-label').value = '';
      document.getElementById('cust-form-remarks').value = '';
      document.getElementById('cust-form-paydate').value = '';
      document.getElementById('cust-form-billeddate').value = '';
      document.getElementById('cust-form-overdue').value = 0;
      document.getElementById('cust-form-rating').value = 'Good';
      document.getElementById('cust-form-payremarks').value = '';
    }

    document.getElementById('modal-customer').classList.add('open');
  },

  editCustomer(custId) {
    this.openCustomerModal(custId);
  },

  async saveCustomer() {
    const id = document.getElementById('cust-form-id').value;
    const body = {
      customer_name: document.getElementById('cust-form-name').value.trim(),
      phone: document.getElementById('cust-form-phone').value.trim(),
      area: document.getElementById('cust-form-area').value,
      building_name: document.getElementById('cust-form-building').value.trim(),
      apartment: document.getElementById('cust-form-apt').value.trim(),
      status: document.getElementById('cust-form-status').value,
      bf: document.getElementById('cust-form-bf').checked,
      ln: document.getElementById('cust-form-ln').checked,
      dn: document.getElementById('cust-form-dn').checked,
      delivery_time: document.getElementById('cust-form-delivery-time').value.trim(),
      door_passcode: document.getElementById('cust-form-passcode').value.trim(),
      label: document.getElementById('cust-form-label').value.trim(),
      remarks: document.getElementById('cust-form-remarks').value.trim(),
      payment_made_up_to: document.getElementById('cust-form-paydate').value,
      billed_up_to: document.getElementById('cust-form-billeddate').value,
      total_overdue: parseFloat(document.getElementById('cust-form-overdue').value) || 0,
      payment_rating: document.getElementById('cust-form-rating').value,
      payment_remarks: document.getElementById('cust-form-payremarks').value.trim()
    };

    if (!body.customer_name || !body.building_name) {
      alert('Please enter customer name and building name.');
      return;
    }

    try {
      const url = id ? `/api/customers/${id}` : `/api/customers`;
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        this.closeModals();
        this.loadCustomers();
        this.loadStats();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to save customer: ' + err.message);
    }
  },

  openPaymentModal(custId) {
    const c = this.customers.find(item => item.id === custId);
    if (!c) return;

    document.getElementById('pay-form-cust-id').value = c.id;
    document.getElementById('pay-form-cust-name').innerText = `${c.customer_name} (${c.building_name} #${c.apartment})`;
    document.getElementById('pay-form-current-overdue').innerText = `Current Overdue Dues: AED ${c.total_overdue || 0}`;
    document.getElementById('pay-form-amount').value = c.total_overdue || 310;
    document.getElementById('pay-form-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('pay-form-paidupto').value = c.billed_up_to || '';
    document.getElementById('pay-form-remarks').value = '';

    document.getElementById('modal-payment').classList.add('open');
  },

  async savePayment() {
    const custId = document.getElementById('pay-form-cust-id').value;
    const amount = parseFloat(document.getElementById('pay-form-amount').value);
    const date = document.getElementById('pay-form-date').value;
    const method = document.getElementById('pay-form-method').value;
    const paidUpto = document.getElementById('pay-form-paidupto').value;
    const remarks = document.getElementById('pay-form-remarks').value;
    const inLedger = document.getElementById('pay-form-record-ledger').checked;

    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    try {
      const res = await fetch(`/api/customers/${custId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          date,
          payment_method: method,
          payment_made_up_to: paidUpto,
          remarks,
          record_in_ledger: inLedger
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Payment of AED ${amount} recorded successfully! Remaining overdue: AED ${data.newOverdue}`);
        this.closeModals();
        this.loadCustomers();
        this.loadStats();
        if (this.currentTab === 'billing') this.loadBillingData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to record payment: ' + err.message);
    }
  },

  openLedgerModal() {
    document.getElementById('ledger-form-date').value = new Date().toISOString().split('T')[0];
    if (this.stats && this.stats.todayMeals) {
      document.getElementById('ledger-form-bf').value = this.stats.todayMeals.bf;
      document.getElementById('ledger-form-ln').value = this.stats.todayMeals.ln;
      document.getElementById('ledger-form-dn').value = this.stats.todayMeals.dn;
    }
    document.getElementById('ledger-form-paid').value = 0;
    document.getElementById('ledger-form-remarks').value = '';

    document.getElementById('modal-ledger').classList.add('open');
  },

  async saveLedgerEntry() {
    const body = {
      date: document.getElementById('ledger-form-date').value,
      bf_count: document.getElementById('ledger-form-bf').value,
      ln_count: document.getElementById('ledger-form-ln').value,
      dn_count: document.getElementById('ledger-form-dn').value,
      amount_paid: document.getElementById('ledger-form-paid').value,
      remarks: document.getElementById('ledger-form-remarks').value
    };

    if (!body.date) {
      alert('Please enter date.');
      return;
    }

    try {
      const res = await fetch('/api/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        alert(`Ledger saved for ${data.date}! Daily total charges: AED ${data.charges}`);
        this.closeModals();
        this.loadLedgerData();
        this.loadStats();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to save ledger: ' + err.message);
    }
  },

  openGroupPaymentModal(groupId) {
    document.getElementById('grp-pay-id').value = groupId;
    document.getElementById('grp-pay-amount').value = '';
    document.getElementById('modal-group-payment').classList.add('open');
  },

  async saveGroupPayment() {
    const grpId = document.getElementById('grp-pay-id').value;
    const amount = parseFloat(document.getElementById('grp-pay-amount').value);
    if (!amount || amount <= 0) return alert('Enter payment amount');

    try {
      const res = await fetch(`/api/groups/${grpId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (data.success) {
        this.closeModals();
        this.loadGroupsData();
      }
    } catch (err) {
      alert('Failed to record group payment: ' + err.message);
    }
  },

  openBadDebtModal() {
    document.getElementById('debt-form-name').value = '';
    document.getElementById('debt-form-building').value = '';
    document.getElementById('debt-form-apt').value = '';
    document.getElementById('debt-form-meals').value = '';
    document.getElementById('debt-form-amount').value = '';
    document.getElementById('debt-form-notes').value = '';
    document.getElementById('modal-baddebt').classList.add('open');
  },

  async saveBadDebt() {
    const body = {
      customer_name: document.getElementById('debt-form-name').value.trim(),
      building_name: document.getElementById('debt-form-building').value.trim(),
      apartment: document.getElementById('debt-form-apt').value.trim(),
      meals: document.getElementById('debt-form-meals').value.trim(),
      amount_due: parseFloat(document.getElementById('debt-form-amount').value),
      notes: document.getElementById('debt-form-notes').value.trim()
    };

    if (!body.customer_name || !body.amount_due) return alert('Name and amount required');

    try {
      const res = await fetch('/api/bad-debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        this.closeModals();
        this.loadBadDebtsData();
        this.loadStats();
      }
    } catch (err) {
      alert('Failed to save bad debt: ' + err.message);
    }
  },

  closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  },

  // CSV EXPORTS
  exportCustomersCsv() {
    window.location.href = '/api/export/customers';
  },

  exportLedgerCsv() {
    window.location.href = '/api/export/ledger';
  },

  escape(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  app.init();
});
