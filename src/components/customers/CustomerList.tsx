import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, Utensils, Phone, PhoneCall, Building2, FileSpreadsheet, Upload, ChevronDown, Clock, Eye, AlertTriangle, Check, X, Share2, Copy, MessageSquare, ExternalLink, Globe, Edit2, RotateCcw, RefreshCw } from 'lucide-react';
import { Customer, Building, MealPlan, Invoice, Payment } from '../../types';
import { formatAED } from '../../utils/currency';
import { formatDateDDMMMYYYY } from '../../utils/dateFormatter';
import { exportCustomersToExcel, downloadCustomerTemplate, ParsedImportRow } from '../../utils/excelService';
import { getCustomerCancellationNotice } from '../../utils/cancellationService';
import { ExcelImportModal } from '../excel/ExcelImportModal';
import { CustomerDetailModal } from './CustomerDetailModal';

interface CustomerListProps {
  customers: Customer[];
  buildings: Building[];
  mealPlans: MealPlan[];
  invoices?: Invoice[];
  payments?: Payment[];
  isReadOnly?: boolean;
  onAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onDeleteAllCustomers?: () => Promise<void> | void;
  onExportCsv: () => void;
  onImportCustomers?: (rows: ParsedImportRow[], mode: 'merge' | 'replace') => void;
  onRecordPayment?: (payment: Partial<Payment>) => Promise<void> | void;
  onSaveCustomer?: (customer: Partial<Customer>) => Promise<void> | void;
  onSyncAllCustomerRates?: () => Promise<number | void> | void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  buildings,
  mealPlans,
  invoices = [],
  payments = [],
  isReadOnly = false,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onDeleteAllCustomers,
  onExportCsv,
  onImportCustomers,
  onRecordPayment,
  onSaveCustomer,
  onSyncAllCustomerRates,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [handlerFilter, setHandlerFilter] = useState<string>('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isShareLinkModalOpen, setIsShareLinkModalOpen] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  // Dedicated Web Registration Portal Link Management
  const DEFAULT_REGISTRATION_URL = 'https://customer-self-registration.vercel.app';
  const STORAGE_KEY = 'karama_registration_portal_url';

  const [registrationUrl, setRegistrationUrl] = useState<string>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && saved.startsWith('http')) return saved;
      }
      if (typeof window !== 'undefined' && window.location.origin && window.location.origin.startsWith('http') && !window.location.origin.includes('localhost') && !window.location.origin.includes('file:')) {
        return `${window.location.origin}/?join=true`;
      }
    } catch {
      // fallback
    }
    return DEFAULT_REGISTRATION_URL;
  });

  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');

  const getRegistrationLink = () => {
    if (registrationUrl && registrationUrl.startsWith('http') && !registrationUrl.startsWith('file:')) {
      return registrationUrl;
    }
    return DEFAULT_REGISTRATION_URL;
  };

  const handleStartEditingUrl = () => {
    setUrlInputValue(registrationUrl);
    setIsEditingUrl(true);
  };

  const handleSaveCustomUrl = () => {
    let clean = urlInputValue.trim();
    if (!clean) {
      clean = DEFAULT_REGISTRATION_URL;
    } else if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    setRegistrationUrl(clean);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, clean);
      }
    } catch {
      // fallback
    }
    setIsEditingUrl(false);
  };

  const handleResetToDefault = () => {
    setRegistrationUrl(DEFAULT_REGISTRATION_URL);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // fallback
    }
    setUrlInputValue(DEFAULT_REGISTRATION_URL);
    setIsEditingUrl(false);
  };

  const handleCopyRegistrationLink = async () => {
    try {
      await navigator.clipboard.writeText(getRegistrationLink());
      setHasCopiedLink(true);
      setTimeout(() => setHasCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleShareOnWhatsApp = () => {
    const text = `Hello! 👋 Please register for Karama Homely Mess using this link and select your daily meals:\n${getRegistrationLink()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const [isSyncingFees, setIsSyncingFees] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleSyncCustomerFees = async () => {
    if (!onSyncAllCustomerRates) return;
    setIsSyncingFees(true);
    setSyncFeedback(null);
    try {
      const count = await onSyncAllCustomerRates();
      setSyncFeedback(
        typeof count === 'number'
          ? `Successfully synchronized monthly fees for ${count} customers based on configured meal plans!`
          : 'Successfully synchronized customer monthly fees with meal plans!'
      );
      setTimeout(() => setSyncFeedback(null), 6000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncingFees(false);
    }
  };

  // Main customer search input ref
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Searchable building combobox dropdown state
  const [isBuildingDropdownOpen, setIsBuildingDropdownOpen] = useState(false);
  const [buildingSearchQuery, setBuildingSearchQuery] = useState('');
  const buildingDropdownRef = useRef<HTMLDivElement>(null);
  const buildingSearchInputRef = useRef<HTMLInputElement>(null);

  // Quick keyboard shortcut: Press '/' or 'Ctrl+F' to jump to search box
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      const isInputActive = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT';
      if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f')) && !isInputActive) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Auto-focus search input & handle click outside for building combobox
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (buildingDropdownRef.current && !buildingDropdownRef.current.contains(e.target as Node)) {
        setIsBuildingDropdownOpen(false);
      }
    };
    if (isBuildingDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      const timer = setTimeout(() => {
        buildingSearchInputRef.current?.focus();
      }, 50);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        clearTimeout(timer);
      };
    }
  }, [isBuildingDropdownOpen]);

  // Building-to-Area lookup for lightning-fast customer matching
  const buildingAreaMap = useMemo(() => {
    const map = new Map<string, string>();
    buildings.forEach((b) => {
      const area = (b.area || 'Karama Central').replace(/^[\p{Emoji}\p{Symbol}\s\u200B-\u200D\uFE0F]+/u, '').trim();
      if (b.id) map.set(b.id, area);
      if (b.name) {
        const cleanName = b.name.toLowerCase().trim();
        map.set(cleanName, area);
        map.set(cleanName.replace(/[^a-z0-9]/g, ''), area);
      }
    });
    return map;
  }, [buildings]);

  // Extract unique Area Clusters with building counts
  const availableAreas = useMemo(() => {
    const counts: Record<string, number> = {};
    buildings.forEach((b) => {
      const a = (b.area || 'Karama Central').replace(/^[\p{Emoji}\p{Symbol}\s\u200B-\u200D\uFE0F]+/u, '').trim();
      if (a) counts[a] = (counts[a] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [buildings]);

  // Dynamically filter buildings list based on selected area cluster
  const filteredBuildings = useMemo(() => {
    if (areaFilter === 'all') return buildings;
    return buildings.filter(
      (b) => (b.area || 'Karama Central').trim().toLowerCase() === areaFilter.trim().toLowerCase()
    );
  }, [buildings, areaFilter]);

  // Filtered buildings list incorporating search query inside dropdown
  const searchFilteredBuildings = useMemo(() => {
    const q = buildingSearchQuery.trim().toLowerCase();
    if (!q) return filteredBuildings;
    return filteredBuildings.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.area && b.area.toLowerCase().includes(q)) ||
        (b.address && b.address.toLowerCase().includes(q))
    );
  }, [filteredBuildings, buildingSearchQuery]);

  const selectedBuildingObj = useMemo(() => {
    if (buildingFilter === 'all') return null;
    return buildings.find((b) => b.id === buildingFilter);
  }, [buildings, buildingFilter]);

  const getCustomerArea = (c: Customer): string => {
    if (c.building_id && buildingAreaMap.has(c.building_id)) {
      return buildingAreaMap.get(c.building_id)!;
    }
    const nameCache = (c.building_name_cache || '').toLowerCase().trim();
    if (nameCache) {
      if (buildingAreaMap.has(nameCache)) return buildingAreaMap.get(nameCache)!;
      const stripped = nameCache.replace(/[^a-z0-9]/g, '');
      if (buildingAreaMap.has(stripped)) return buildingAreaMap.get(stripped)!;
      const found = buildings.find((b) => {
        const bName = b.name.toLowerCase().trim();
        return bName.includes(nameCache) || nameCache.includes(bName);
      });
      if (found && found.area) return found.area.trim();
    }
    return '';
  };

  // Keep viewingCustomer fresh whenever customers state updates
  useEffect(() => {
    if (viewingCustomer) {
      const fresh = customers.find(
        (c) => c.id === viewingCustomer.id || c.customer_code === viewingCustomer.customer_code
      );
      if (
        fresh &&
        (fresh.total_overdue !== viewingCustomer.total_overdue ||
          fresh.payment_rating !== viewingCustomer.payment_rating ||
          fresh.payment_made_up_to_date !== viewingCustomer.payment_made_up_to_date)
      ) {
        setViewingCustomer(fresh);
      }
    }
  }, [customers, viewingCustomer]);

  // Helper to normalize phone numbers for forgiving search (handles 050..., +97150..., 50...)
  const normalizeDigits = (val: string) => {
    const d = val.replace(/\D/g, '');
    return d.replace(/^971/, '').replace(/^0/, '');
  };

  // High-performance, forgiving, multi-term customer search & filter
  const filtered = useMemo(() => {
    const rawSearch = (searchTerm || '').trim().toLowerCase();
    const searchTokens = rawSearch ? rawSearch.split(/\s+/).filter(Boolean) : [];

    return customers.filter((c) => {
      // 1. Multi-term, multi-field, forgiving search filter
      if (searchTokens.length > 0) {
        const fullName = (c.full_name || '').toLowerCase();
        const code = (c.customer_code || '').toLowerCase();
        const codeDigits = code.replace(/\D/g, '');
        const phone = String(c.phone || '');
        const phoneDigits = phone.replace(/\D/g, '');
        const normPhone = normalizeDigits(phone);
        const emergency = String(c.emergency_contact || '');
        const emergencyDigits = emergency.replace(/\D/g, '');
        const normEmergency = normalizeDigits(emergency);
        const buildingName = (c.building_name_cache || c.building?.name || '').toLowerCase();
        const apt = String(c.apartment_cache || c.room?.room_number || '').toLowerCase();
        const aptDigits = apt.replace(/\D/g, '');
        const dietary = (c.dietary_preferences || '').toLowerCase();
        const deliveryTime = (c.delivery_time || '').toLowerCase();
        const passcode = (c.door_passcode || '').toLowerCase();
        const area = getCustomerArea(c).toLowerCase();
        const company = (c.company_name || '').toLowerCase();
        const notes = (c.notes || '').toLowerCase();

        // Every token must match at least one attribute of the customer
        const matchesAllTokens = searchTokens.every((token) => {
          const cleanTokenDigits = token.replace(/\D/g, '');
          const normTokenDigits = normalizeDigits(token);
          return (
            fullName.includes(token) ||
            company.includes(token) ||
            code.includes(token) ||
            (cleanTokenDigits && codeDigits.includes(cleanTokenDigits)) ||
            phone.includes(token) ||
            (cleanTokenDigits && phoneDigits.includes(cleanTokenDigits)) ||
            (normTokenDigits && normPhone.includes(normTokenDigits)) ||
            emergency.includes(token) ||
            (cleanTokenDigits && emergencyDigits.includes(cleanTokenDigits)) ||
            (normTokenDigits && normEmergency.includes(normTokenDigits)) ||
            buildingName.includes(token) ||
            apt.includes(token) ||
            (cleanTokenDigits && aptDigits.includes(cleanTokenDigits)) ||
            dietary.includes(token) ||
            deliveryTime.includes(token) ||
            passcode.includes(token) ||
            area.includes(token) ||
            notes.includes(token)
          );
        });

        if (!matchesAllTokens) return false;
      }

      // 2. Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'cancelling_soon') {
          if (c.status === 'cancelling_soon') {
            // Matched directly by status
          } else if (c.status === 'cancelled' || c.status === 'left') {
            return false;
          } else {
            const notice = getCustomerCancellationNotice(c);
            if (!notice) return false;
          }
        } else if (statusFilter === 'cancelled' || statusFilter === 'left') {
          if (c.status !== 'left' && c.status !== 'cancelled') return false;
        } else if (c.status !== statusFilter) {
          return false;
        }
      }

      // 3. Area filter
      if (areaFilter !== 'all') {
        const custArea = getCustomerArea(c);
        if (!custArea || custArea.toLowerCase() !== areaFilter.toLowerCase()) {
          return false;
        }
      }

      // 4. Building filter
      if (buildingFilter !== 'all') {
        if (c.building_id !== buildingFilter && c.building_name_cache !== buildingFilter) {
          return false;
        }
      }

      // 5. Customer type / handler filter
      if (handlerFilter !== 'all') {
        const managed = (c.managed_by || '').toLowerCase();
        if (handlerFilter === 'online') {
          if (managed !== 'online_self_service' && !managed.includes('online')) {
            return false;
          }
        } else if (handlerFilter === 'admin') {
          if (managed && managed !== 'admin' && managed !== 'customer' && managed !== 'regular') {
            return false;
          }
        } else if (managed !== handlerFilter.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [customers, searchTerm, statusFilter, areaFilter, buildingFilter, handlerFilter, buildingAreaMap, buildings]);

  return (
    <div className="space-y-4 max-w-full min-w-0">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Customer Directory</h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
            Manage customer profiles, subscriptions, and accommodation
            <span className="text-slate-500 mx-1.5">•</span>
            <span className="text-amber-400 font-bold">{filtered.length}</span> of {customers.length} customers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Import Excel Button (Hidden in Read-Only) */}
          {!isReadOnly && (
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1c1f26] hover:bg-[#252932] text-slate-200 text-xs font-bold border border-[#2c313d] transition-colors shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-[#ff8d24]" />
              <span>Import</span>
            </button>
          )}

          {/* Export Excel Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1c1f26] hover:bg-[#252932] text-slate-200 text-xs font-bold border border-[#2c313d] transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#ff8d24]" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {isExportMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl bg-[#16181d] border border-slate-700 shadow-xl z-30 py-1.5 animate-fadeIn"
                onClick={() => setIsExportMenuOpen(false)}
              >
                <button
                  onClick={() => exportCustomersToExcel(customers, 'all', 'xlsx')}
                  className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Export All (.xlsx)</span>
                  <span className="text-[10px] text-slate-500 font-mono">{customers.length}</span>
                </button>
                <button
                  onClick={() => exportCustomersToExcel(customers, 'active', 'xlsx')}
                  className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Active Only (.xlsx)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {customers.filter(c => c.status === 'active' || c.status === 'cancelling_soon').length}
                  </span>
                </button>
                <button
                  onClick={() => exportCustomersToExcel(customers, 'overdue', 'xlsx')}
                  className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Overdue Accounts (.xlsx)</span>
                  <span className="text-[10px] text-rose-400 font-mono">
                    {customers.filter(c => (c.total_overdue || 0) > 0).length}
                  </span>
                </button>
                <button
                  onClick={() => exportCustomersToExcel(customers, 'all', 'csv')}
                  className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"
                >
                  Export All (.csv)
                </button>
                {!isReadOnly && (
                  <>
                    <div className="h-px bg-slate-800 my-1" />
                    <button
                      onClick={() => downloadCustomerTemplate('xlsx')}
                      className="w-full text-left px-4 py-2 text-xs text-amber-400 hover:bg-slate-800 font-semibold flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Blank Template</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Delete All Customers Button (Admin only) */}
          {!isReadOnly && customers.length > 0 && onDeleteAllCustomers && (
            <button
              onClick={() => setIsDeleteAllModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 text-xs font-bold border border-rose-500/30 transition-colors shadow-sm cursor-pointer"
              title="Delete all customer records with confirmation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete All ({customers.length})</span>
            </button>
          )}

          {/* Customer Self-Registration Link Button */}
          {!isReadOnly && (
            <button
              onClick={() => setIsShareLinkModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1c1f26] hover:bg-[#252932] text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Customer Registration Link (Send to customers on WhatsApp)"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Registration Link</span>
            </button>
          )}

          {/* Sync Customer Fees to Meal Plans Button */}
          {!isReadOnly && onSyncAllCustomerRates && (
            <button
              onClick={handleSyncCustomerFees}
              disabled={isSyncingFees}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1c1f26] hover:bg-[#252932] text-[#ff8d24] border border-orange-500/30 text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              title="Automatically update all customer monthly rates to match active meal plans"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFees ? 'animate-spin' : ''}`} />
              <span>{isSyncingFees ? 'Syncing...' : 'Sync Fees to Plans'}</span>
            </button>
          )}

          {!isReadOnly && (
            <button
              onClick={onAddCustomer}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff8d24] to-[#f95900] hover:from-[#ff9c3a] hover:to-[#ff6810] text-slate-950 text-xs font-black shadow-md shadow-orange-500/20 transition-all active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              <span>Add Customer</span>
            </button>
          )}
        </div>
      </div>

      {syncFeedback && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Filter toolbar */}
      <div className="bg-[#16181d] border border-[#242730] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5 shadow-md shadow-black/10">
        <div
          onClick={() => searchInputRef.current?.focus()}
          className="relative flex-1 min-w-[200px] cursor-text group"
        >
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, code, phone, room, building, notes... (Press '/' to focus)"
            className="w-full pl-9 pr-9 py-2 bg-[#111317] border border-[#242730] rounded-xl text-xs text-white placeholder-[#687284] focus:outline-none focus:border-[#ff8d24] transition-colors cursor-text pointer-events-auto"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSearchTerm('');
                searchInputRef.current?.focus();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111317] border border-[#242730] rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#ff8d24] font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (Running)</option>
            <option value="cancelling_soon">⚠️ Cancelling Soon (On Notice)</option>
            <option value="trial">Trial</option>
            <option value="paused">Temporarily Paused</option>
            <option value="inactive">Inactive</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Which Area? Area Cluster filter */}
          <select
            value={areaFilter}
            onChange={(e) => {
              setAreaFilter(e.target.value);
              setBuildingFilter('all');
            }}
            className={`bg-[#111317] border rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none transition-colors ${
              areaFilter !== 'all'
                ? 'border-[#ff8d24] text-orange-400 bg-orange-500/10'
                : 'border-[#242730] text-slate-200 focus:border-[#ff8d24]'
            }`}
            title="Filter by Which Area / Delivery Cluster"
          >
            <option value="all">Which Area? Area Cluster (All)</option>
            {availableAreas.map(([areaName, count]) => (
              <option key={areaName} value={areaName}>
                {areaName} ({count})
              </option>
            ))}
          </select>

          {/* Searchable Building Combobox Dropdown */}
          <div ref={buildingDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsBuildingDropdownOpen(!isBuildingDropdownOpen);
                if (!isBuildingDropdownOpen) {
                  setBuildingSearchQuery('');
                }
              }}
              className={`flex items-center justify-between gap-1.5 bg-[#111317] border rounded-xl px-2.5 py-2 text-xs transition-all cursor-pointer min-w-[170px] max-w-[240px] ${
                buildingFilter !== 'all'
                  ? 'border-[#ff8d24] text-orange-400 bg-orange-500/10 font-semibold shadow-sm'
                  : 'border-[#242730] text-slate-200 hover:border-[#383e4e]'
              }`}
              title="Filter by Building (Click to open search box)"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className={`w-3.5 h-3.5 shrink-0 ${buildingFilter !== 'all' ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="truncate">
                  {selectedBuildingObj
                    ? selectedBuildingObj.name
                    : areaFilter === 'all'
                    ? `All Buildings (${buildings.length})`
                    : `All in ${areaFilter} (${filteredBuildings.length})`}
                </span>
              </div>
              {buildingFilter !== 'all' ? (
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBuildingFilter('all');
                    setBuildingSearchQuery('');
                  }}
                  className="p-0.5 hover:bg-amber-500/20 rounded text-amber-400 hover:text-white transition-colors"
                  title="Clear building filter"
                >
                  <X className="w-3.5 h-3.5" />
                </span>
              ) : (
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform ${isBuildingDropdownOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {isBuildingDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-84 bg-[#131b2a] border border-slate-700/90 rounded-2xl shadow-2xl shadow-black/90 z-50 overflow-hidden animate-fadeIn backdrop-blur-md">
                {/* Search Box Header */}
                <div className="p-2.5 bg-slate-900/95 border-b border-slate-700/80 sticky top-0 z-10 space-y-1.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      ref={buildingSearchInputRef}
                      type="text"
                      value={buildingSearchQuery}
                      onChange={(e) => setBuildingSearchQuery(e.target.value)}
                      placeholder={`Search ${filteredBuildings.length} buildings...`}
                      className="w-full pl-8 pr-7 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff8d24] font-medium"
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsBuildingDropdownOpen(false);
                        } else if (e.key === 'Enter' && searchFilteredBuildings.length === 1) {
                          setBuildingFilter(searchFilteredBuildings[0].id);
                          setIsBuildingDropdownOpen(false);
                          setBuildingSearchQuery('');
                        }
                      }}
                    />
                    {buildingSearchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setBuildingSearchQuery('');
                          buildingSearchInputRef.current?.focus();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
                    <span>
                      Showing {searchFilteredBuildings.length} of {filteredBuildings.length}
                    </span>
                    {areaFilter !== 'all' && (
                      <span className="text-amber-400 font-semibold truncate max-w-[130px]">
                        {areaFilter}
                      </span>
                    )}
                  </div>
                </div>

                {/* Scrollable Building Options List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 p-1 custom-scrollbar">
                  {/* All Buildings Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setBuildingFilter('all');
                      setIsBuildingDropdownOpen(false);
                      setBuildingSearchQuery('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      buildingFilter === 'all'
                        ? 'bg-amber-500/15 text-amber-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {areaFilter === 'all'
                          ? `All Buildings (${buildings.length})`
                          : `All in ${areaFilter} (${filteredBuildings.length})`}
                      </span>
                    </span>
                    {buildingFilter === 'all' && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </button>

                  {/* Filtered Buildings List */}
                  {searchFilteredBuildings.map((b) => {
                    const isSelected = buildingFilter === b.id;
                    const residentCount = customers.filter(
                      (c) => c.building_id === b.id || (c.building && c.building.id === b.id)
                    ).length;

                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setBuildingFilter(b.id);
                          setIsBuildingDropdownOpen(false);
                          setBuildingSearchQuery('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 font-bold'
                            : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-semibold truncate text-white">{b.name}</div>
                          {b.area && (
                            <div className="text-[10px] text-slate-400 truncate">{b.area}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {residentCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                              {residentCount}
                            </span>
                          )}
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}

                  {searchFilteredBuildings.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400">
                      <p className="font-medium text-slate-300">No buildings found</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        No matches for "{buildingSearchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Who is this customer? Filter */}
          <select
            value={handlerFilter}
            onChange={(e) => setHandlerFilter(e.target.value)}
            className="bg-[#111317] border border-[#242730] rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-[#ff8d24]"
            title="Filter by customer account type"
          >
            <option value="all">All Customer Types</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="online">Online</option>
          </select>

          {(searchTerm || statusFilter !== 'all' || areaFilter !== 'all' || buildingFilter !== 'all' || handlerFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setAreaFilter('all');
                setBuildingFilter('all');
                setBuildingSearchQuery('');
                setHandlerFilter('all');
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#16181d] border border-[#242730] rounded-2xl overflow-hidden shadow-xl shadow-black/30">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#121419] text-slate-300 border-b border-slate-700/80 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-2.5 px-2 text-center whitespace-nowrap w-24">Status</th>
                <th className="py-2.5 px-2 whitespace-nowrap w-20">Code</th>
                <th className="py-2.5 px-2.5 whitespace-nowrap min-w-[130px]">Customer</th>
                <th className="py-2.5 px-2 whitespace-nowrap min-w-[120px]">Building &amp; Room</th>
                <th className="py-2.5 px-1 text-center whitespace-nowrap w-20">Meals</th>
                <th className="py-2.5 px-2.5 min-w-[150px]">Dietary &amp; Delivery Notes</th>
                <th className="py-2.5 px-2 text-right whitespace-nowrap w-24">Monthly Fee</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap w-28">Payment Up To</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap w-28">Billed Up To</th>
                <th className="py-2.5 px-2.5 text-right whitespace-nowrap w-24">Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                    No customers match the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const overdue = c.total_overdue || 0;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setViewingCustomer(c)}
                      className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
                      title="Click anywhere on this row to view full profile, edit details, or record payments"
                    >
                      {/* 1. Status Column (First) */}
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${
                            c.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : c.status === 'cancelling_soon'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-black'
                              : c.status === 'trial'
                              ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                              : c.status === 'paused'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : (c.status === 'left' || c.status === 'cancelled')
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {c.status === 'cancelling_soon'
                            ? 'Cancelling'
                            : (c.status === 'left' || c.status === 'cancelled')
                            ? 'Cancelled'
                            : c.status}
                        </span>
                        {(() => {
                          const notice = getCustomerCancellationNotice(c);
                          if (!notice) return null;
                          return (
                            <div className="mt-1">
                              <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tight border ${notice.badge.bg} ${notice.badge.textColor} ${notice.badge.border} animate-pulse`}
                                title={`Planned Exit: ${notice.targetDateDisplay}`}
                              >
                                On Notice
                              </span>
                            </div>
                          );
                        })()}
                      </td>

                      {/* 2. Customer Code */}
                      <td className="py-2.5 px-2 font-mono text-amber-400 font-bold whitespace-nowrap">
                        <span className="flex items-center gap-1 text-amber-300 group-hover:underline">
                          {c.customer_code}
                        </span>
                      </td>

                      {/* 3. Customer Name & Info */}
                      <td className="py-2.5 px-2.5 min-w-[130px]">
                        <div className="font-bold text-white text-xs sm:text-sm tracking-tight group-hover:text-amber-300 transition-colors flex items-center gap-1.5 flex-wrap">
                          <span>{c.full_name}</span>
                          {c.managed_by === 'online_self_service' && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" title="Registered via online link">
                              🌐 Online
                            </span>
                          )}
                        </div>
                        {c.company_name && (
                          <div className="flex items-center gap-1 text-[11px] text-sky-300 font-semibold mt-0.5" title="Company / Workplace">
                            <Building2 className="w-3 h-3 text-sky-400 shrink-0" />
                            <span>{c.company_name}</span>
                          </div>
                        )}
                        {c.phone && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-0.5">
                            <Phone className="w-3 h-3 text-amber-400/80 shrink-0" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                        {c.emergency_contact && (
                          <div className="flex items-center gap-1 text-[10px] text-rose-300 font-semibold mt-0.5" title="Emergency Contact">
                            <PhoneCall className="w-3 h-3 text-rose-400 shrink-0" />
                            <span>SOS: {c.emergency_contact}</span>
                          </div>
                        )}
                        {(() => {
                          const notice = getCustomerCancellationNotice(c);
                          if (!notice) return null;
                          return (
                            <div className="mt-1">
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${notice.badge.bg} ${notice.badge.textColor} ${notice.badge.border}`}
                                title={`Scheduled cancellation on ${notice.targetDateDisplay} (${notice.daysRemaining >= 0 ? `${notice.daysRemaining} days left` : 'overdue'})`}
                              >
                                <span>⚠️ {notice.badge.label}</span>
                              </span>
                            </div>
                          );
                        })()}
                      </td>

                      {/* 4. Building & Room */}
                      <td className="py-2.5 px-2 text-slate-200 min-w-[120px]">
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span>{c.building_name_cache || c.building?.name || 'Unassigned'}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 ml-5 mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span>Apt {c.apartment_cache || 'N/A'}</span>
                          {getCustomerArea(c) && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 font-medium">
                              {getCustomerArea(c)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Meals */}
                      <td className="py-2.5 px-1 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${c.has_breakfast ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40' : 'bg-slate-800/60 text-slate-600'}`}>BF</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${c.has_lunch ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800/60 text-slate-600'}`}>LN</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${c.has_dinner ? 'bg-blue-500/25 text-blue-300 border border-blue-500/40' : 'bg-slate-800/60 text-slate-600'}`}>DN</span>
                        </div>
                      </td>

                      {/* 6. Dietary & Delivery Notes */}
                      <td className="py-2.5 px-2.5 min-w-[150px]">
                        <div className="space-y-1">
                          {c.dietary_preferences ? (
                            <div className="text-xs text-amber-200/95 font-medium leading-relaxed whitespace-pre-line break-words">
                              {c.dietary_preferences}
                            </div>
                          ) : (
                            <span className="text-slate-600 text-xs">-</span>
                          )}
                          {c.delivery_time && (
                            <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>Time: {c.delivery_time}</span>
                            </div>
                          )}
                          {c.door_passcode && (
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                              🔑 {c.door_passcode}
                            </span>
                          )}
                          {c.notes && c.notes !== c.dietary_preferences && (
                            <div className="text-[11px] text-slate-400 italic break-words mt-0.5">
                              📝 {c.notes}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 7. Monthly Fee */}
                      <td className="py-2.5 px-2 text-right font-bold text-white whitespace-nowrap font-mono text-xs">
                        {formatAED(c.monthly_rate)}
                      </td>

                      {/* 8. Payment Made Up To Date */}
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <span className="inline-flex items-center font-mono text-xs font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                          {formatDateDDMMMYYYY(c.payment_made_up_to_date || c.billing_start_date || '2026-10-31')}
                        </span>
                      </td>

                      {/* 9. Billed Up To Date */}
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <span className="inline-flex items-center font-mono text-xs font-bold text-slate-200 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700/70">
                          {formatDateDDMMMYYYY(c.billed_up_to_date || c.billing_end_date || '2026-10-31')}
                        </span>
                      </td>

                      {/* 10. Overdue */}
                      <td className="py-2.5 px-2.5 text-right font-black whitespace-nowrap font-mono text-xs">
                        <span className={overdue > 0 ? 'text-rose-400 drop-shadow-sm' : 'text-emerald-400'}>
                          {formatAED(overdue)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(rows, mode) => {
          if (onImportCustomers) {
            onImportCustomers(rows, mode);
          }
          setIsImportModalOpen(false);
        }}
      />

      {/* 1-Click Customer 360° Profile & Details Modal */}
      <CustomerDetailModal
        isOpen={Boolean(viewingCustomer)}
        isReadOnly={isReadOnly}
        customer={
          viewingCustomer
            ? customers.find((c) => c.id === viewingCustomer.id) || viewingCustomer
            : null
        }
        customers={customers}
        onClose={() => setViewingCustomer(null)}
        buildings={buildings}
        mealPlans={mealPlans}
        invoices={invoices}
        payments={payments}
        onEdit={(cust) => {
          setViewingCustomer(null);
          onEditCustomer(cust);
        }}
        onRecordPayment={onRecordPayment}
        onSaveCustomer={onSaveCustomer}
        onDeleteCustomer={onDeleteCustomer}
      />

      {/* Confirmation Modal for Delete All Customers */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#16181d] border border-rose-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete All Customers?</h3>
                <p className="text-xs text-rose-400 font-semibold mt-0.5">Permanent Deletion Warning</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>
                Are you sure you want to permanently delete all <strong className="text-white font-mono">{customers.length}</strong> customer records?
              </p>
              <p className="text-slate-400 text-[11px]">
                This action cannot be undone. All customer profiles, meal plans, and subscriptions will be wiped from both local storage and the cloud database.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeletingAll}
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingAll}
                onClick={async () => {
                  if (onDeleteAllCustomers) {
                    setIsDeletingAll(true);
                    try {
                      await onDeleteAllCustomers();
                    } finally {
                      setIsDeletingAll(false);
                      setIsDeleteAllModalOpen(false);
                    }
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeletingAll ? 'Deleting All...' : 'Yes, Delete All Customers'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Registration Link Modal */}
      {isShareLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#16181d] border border-emerald-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Customer Self-Registration Link</h3>
                  <p className="text-xs text-slate-400">Share with new customers on WhatsApp</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareLinkModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Send this link to any new customer. They can fill out their name, WhatsApp number, room, and meal plan on their mobile phone. Once submitted, they will <strong>automatically appear inside your software in real-time</strong>!
              </p>

              {/* Editable Registration Portal Link */}
              {isEditingUrl ? (
                <div className="space-y-2 p-3 bg-slate-900 border border-amber-500/50 rounded-2xl animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      Public Registration Web URL
                    </span>
                    <button
                      type="button"
                      onClick={handleResetToDefault}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      title="Reset to default Vercel portal"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={urlInputValue}
                    onChange={(e) => setUrlInputValue(e.target.value)}
                    placeholder="https://customer-self-registration.vercel.app"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#ff8d24]"
                    autoFocus
                  />
                  <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setUrlInputValue('https://customer-self-registration.vercel.app')}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      Default Vercel
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrlInputValue('https://salmanm-11.github.io/Customer-Self-Registration/')}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      GitHub Pages
                    </button>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1.5">
                    <button
                      type="button"
                      onClick={() => setIsEditingUrl(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCustomUrl}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow cursor-pointer"
                    >
                      Save URL
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-amber-300 truncate select-all" title={getRegistrationLink()}>
                      {getRegistrationLink()}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyRegistrationLink}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 shrink-0 border border-slate-700 cursor-pointer"
                    >
                      {hasCopiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-emerald-400" />
                      Live web link
                    </span>
                    <button
                      type="button"
                      onClick={handleStartEditingUrl}
                      className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Change Link</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleShareOnWhatsApp}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </button>
              <a
                href={getRegistrationLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Preview Form</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
