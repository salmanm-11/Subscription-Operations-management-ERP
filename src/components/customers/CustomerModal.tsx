import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, UserCheck, PhoneCall, AlertCircle, Building2, Plus, Search, MapPin, Calendar } from 'lucide-react';
import { Customer, Building, MealPlan, CustomerStatus } from '../../types';
import { AuthService } from '../../api/authService';
import { OfflineStorage } from '../../api/offlineStorage';
import { saveBuilding } from '../../api/supabase';
import { calculateDailyMealRate } from '../../utils/cancellationService';
import { resolveExpectedMonthlyRate } from '../../utils/mealPlanPricingService';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Partial<Customer>) => void;
  customer?: Customer | null;
  buildings: Building[];
  mealPlans: MealPlan[];
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customer,
  buildings,
  mealPlans,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [email, setEmail] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [localBuildings, setLocalBuildings] = useState<Building[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [isCustomArea, setIsCustomArea] = useState<boolean>(false);
  const [customAreaInput, setCustomAreaInput] = useState<string>('');
  const [buildingSearch, setBuildingSearch] = useState('');
  const [customBuildingName, setCustomBuildingName] = useState('');
  const [isAddBuildingModalOpen, setIsAddBuildingModalOpen] = useState(false);
  const [newBuildingName, setNewBuildingName] = useState('');
  const [newBuildingArea, setNewBuildingArea] = useState('Karama Central');
  const [newBuildingAddress, setNewBuildingAddress] = useState('');
  const [isCustomNewBuildingArea, setIsCustomNewBuildingArea] = useState(false);
  const [isSavingNewBuilding, setIsSavingNewBuilding] = useState(false);

  const [apartment, setApartment] = useState('');
  const [mealPlanId, setMealPlanId] = useState('');
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [hasLunch, setHasLunch] = useState(true);
  const [hasDinner, setHasDinner] = useState(true);
  const [monthlyRate, setMonthlyRate] = useState(380);
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [doorPasscode, setDoorPasscode] = useState('');
  const [paymentMadeUpTo, setPaymentMadeUpTo] = useState('2026-10-06');
  const [billedUpTo, setBilledUpTo] = useState('2026-10-31');
  const [totalOverdue, setTotalOverdue] = useState<number>(0);
  const [status, setStatus] = useState<CustomerStatus>('active');
  const [managedBy, setManagedBy] = useState<string>('admin');
  const [notes, setNotes] = useState('');
  const [hasCancellationNotice, setHasCancellationNotice] = useState<boolean>(false);
  const [cancellationDate, setCancellationDate] = useState<string>('');
  const [cancellationReason, setCancellationReason] = useState<string>('');

  const availableUsers = AuthService.getUsers();

  // Combine parent buildings and local fallback
  const availableBuildings = useMemo(() => {
    if (localBuildings && localBuildings.length > 0) return localBuildings;
    if (buildings && buildings.length > 0) return buildings;
    return OfflineStorage.getBuildings();
  }, [localBuildings, buildings]);

  // Extract all distinct area clusters and their building counts
  const availableAreas = useMemo(() => {
    const counts: Record<string, number> = {};
    availableBuildings.forEach((b) => {
      const a = (b.area || 'Karama Central').replace(/^[\p{Emoji}\p{Symbol}\s\u200B-\u200D\uFE0F]+/u, '').trim();
      counts[a] = (counts[a] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [availableBuildings]);

  // Filter buildings dynamically by the selected area cluster & search term
  const buildingsForSelectedArea = useMemo(() => {
    let list = availableBuildings;
    if (selectedArea && selectedArea !== 'all') {
      list = list.filter(
        (b) => (b.area || '').toLowerCase() === selectedArea.toLowerCase()
      );
    }
    if (buildingSearch.trim()) {
      const term = buildingSearch.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(term) ||
          (b.area && b.area.toLowerCase().includes(term)) ||
          (b.address && b.address.toLowerCase().includes(term))
      );
    }
    return list;
  }, [availableBuildings, selectedArea, buildingSearch]);

  useEffect(() => {
    const list = (buildings && buildings.length > 0) ? buildings : OfflineStorage.getBuildings();
    setLocalBuildings(list);

    if (customer) {
      setFullName(customer.full_name || '');
      setPhone(customer.phone || '');
      setEmergencyContact(customer.emergency_contact || '');
      setEmail(customer.email || '');

      // Resolve building ID from customer or match by name
      let matched = list.find((b) => b.id === customer.building_id);
      if (!matched && customer.building_name_cache) {
        matched = list.find(
          (b) => b.name.toLowerCase() === customer.building_name_cache!.toLowerCase()
        );
      }
      if (matched) {
        setSelectedArea(matched.area || 'Karama Central');
        setIsCustomArea(false);
        setCustomAreaInput('');
        setBuildingId(matched.id);
        setCustomBuildingName(matched.name);
      } else if (customer.building_name_cache) {
        setSelectedArea('all');
        setIsCustomArea(false);
        setCustomAreaInput('');
        setBuildingId('custom');
        setCustomBuildingName(customer.building_name_cache);
      } else {
        setSelectedArea('');
        setIsCustomArea(false);
        setCustomAreaInput('');
        setBuildingId('');
        setCustomBuildingName('');
      }

      setApartment(customer.apartment_cache || '');
      setMealPlanId(customer.meal_plan_id || '');
      setHasBreakfast(Boolean(customer.has_breakfast));
      setHasLunch(Boolean(customer.has_lunch));
      setHasDinner(Boolean(customer.has_dinner));
      setMonthlyRate(customer.monthly_rate || 380);
      setDietaryPreferences(customer.dietary_preferences || '');
      setDeliveryTime(customer.delivery_time || '');
      setDoorPasscode(customer.door_passcode || '');
      setPaymentMadeUpTo(customer.payment_made_up_to_date || customer.billing_start_date || '2026-10-06');
      setBilledUpTo(customer.billed_up_to_date || customer.billing_end_date || '2026-10-31');
      setTotalOverdue(customer.total_overdue || 0);
      let initialNoticeDate = customer.cancellation_date || '';
      let initialNoticeReason = customer.cancellation_reason || '';
      if (!initialNoticeDate && customer.notes && customer.notes.includes('[NOTICE: Cancelling on ')) {
        const match = customer.notes.match(/\[NOTICE: Cancelling on (\d{4}-\d{2}-\d{2})(?: \| Reason: ([^\]]+))?\]/);
        if (match) {
          initialNoticeDate = match[1];
          if (match[2]) initialNoticeReason = match[2];
        }
      }
      if (!initialNoticeDate && customer.status === 'cancelling_soon' && customer.billing_end_date) {
        initialNoticeDate = customer.billing_end_date;
      }
      if (!initialNoticeDate && customer.status === 'cancelling_soon') {
        const d = new Date();
        d.setDate(d.getDate() + 5);
        initialNoticeDate = d.toISOString().split('T')[0];
      }

      const noticeActive = Boolean(
        customer.status === 'cancelling_soon' ||
        (initialNoticeDate && customer.status !== 'cancelled' && customer.status !== 'left')
      );
      setHasCancellationNotice(noticeActive);
      setCancellationDate(initialNoticeDate);
      setCancellationReason(initialNoticeReason);
      setStatus(noticeActive ? 'cancelling_soon' : (customer.status || 'active'));
      setManagedBy(customer.managed_by === 'manager' ? 'manager' : (customer.managed_by === 'online_self_service' || (customer.managed_by && customer.managed_by.includes('online')) ? 'online_self_service' : 'admin'));
      setNotes(customer.notes || '');
    } else {
      setFullName('');
      setPhone('');
      setEmergencyContact('');
      setEmail('');
      setSelectedArea('');
      setIsCustomArea(false);
      setCustomAreaInput('');
      setBuildingId('');
      setCustomBuildingName('');
      setApartment('');
      setMealPlanId(mealPlans[0]?.id || '');
      setHasBreakfast(false);
      setHasLunch(true);
      setHasDinner(true);
      setMonthlyRate(380);
      setDietaryPreferences('');
      setDeliveryTime('6:00 AM');
      setDoorPasscode('');
      setPaymentMadeUpTo(new Date().toISOString().split('T')[0]);
      setBilledUpTo(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
      setTotalOverdue(0);
      setStatus('active');
      setManagedBy('admin');
      setNotes('');
      setHasCancellationNotice(false);
      setCancellationDate('');
      setCancellationReason('');
    }
  }, [customer, isOpen, buildings, mealPlans]);

  if (!isOpen) return null;

  const handleQuickAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuildingName.trim()) return;

    try {
      setIsSavingNewBuilding(true);
      const created = await saveBuilding({
        name: newBuildingName.trim(),
        area: newBuildingArea.trim(),
        address: newBuildingAddress.trim() || `${newBuildingName.trim()}, Karama, Dubai`,
      });

      const updated = [created, ...availableBuildings.filter((b) => b.id !== created.id)];
      setLocalBuildings(updated);
      setSelectedArea(created.area || 'Karama Central');
      setBuildingId(created.id);
      setCustomBuildingName(created.name);
      setIsAddBuildingModalOpen(false);
      setNewBuildingName('');
      setNewBuildingAddress('');
    } catch (err) {
      console.error('Failed to quick add building:', err);
    } finally {
      setIsSavingNewBuilding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const selectedBuilding = availableBuildings.find((b) => b.id === buildingId);
    const resolvedBuildingName = selectedBuilding
      ? selectedBuilding.name
      : buildingId === 'custom'
      ? customBuildingName.trim()
      : customBuildingName.trim() || customer?.building_name_cache || '';

    const isNotice = hasCancellationNotice || status === 'cancelling_soon';
    let finalCancelDate = isNotice ? (cancellationDate.trim() || undefined) : undefined;
    if (isNotice && !finalCancelDate) {
      const d = new Date();
      d.setDate(d.getDate() + 5);
      finalCancelDate = d.toISOString().split('T')[0];
    }
    const finalStatus: CustomerStatus = isNotice ? 'cancelling_soon' : status;

    let finalNotes = notes.trim();
    finalNotes = finalNotes.replace(/\[NOTICE: Cancelling on [^\]]+\]\s*/g, '').trim();
    if (isNotice && finalCancelDate) {
      const noticeTag = `[NOTICE: Cancelling on ${finalCancelDate}${cancellationReason ? ` | Reason: ${cancellationReason.trim()}` : ''}]`;
      finalNotes = finalNotes ? `${noticeTag} ${finalNotes}` : noticeTag;
    }

    onSave({
      id: customer?.id,
      full_name: fullName.trim(),
      phone: phone.trim(),
      emergency_contact: emergencyContact.trim(),
      email: email.trim(),
      building_id: (buildingId && buildingId !== 'custom') ? buildingId : undefined,
      building_name_cache: resolvedBuildingName,
      apartment_cache: apartment.trim(),
      meal_plan_id: mealPlanId ? mealPlanId : undefined,
      has_breakfast: hasBreakfast,
      has_lunch: hasLunch,
      has_dinner: hasDinner,
      monthly_rate: Number(monthlyRate),
      dietary_preferences: dietaryPreferences.trim(),
      delivery_time: deliveryTime.trim(),
      door_passcode: doorPasscode.trim(),
      billing_start_date: paymentMadeUpTo || undefined,
      billing_end_date: isNotice && finalCancelDate ? finalCancelDate : (billedUpTo || undefined),
      cancellation_date: finalCancelDate,
      cancellation_reason: isNotice && cancellationReason ? cancellationReason.trim() : undefined,
      cancellation_notice_date: isNotice ? (customer?.cancellation_notice_date || new Date().toISOString().split('T')[0]) : undefined,
      payment_made_up_to_date: paymentMadeUpTo || undefined,
      billed_up_to_date: billedUpTo || undefined,
      total_overdue: Math.max(0, Number(totalOverdue) || 0),
      status: finalStatus,
      managed_by: managedBy,
      notes: finalNotes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151c2c] border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/60 custom-scrollbar">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#151c2c] z-10">
          <div>
            <h3 className="text-lg font-bold text-white">
              {customer ? 'Edit Customer Profile' : 'Add New Customer'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customer record in Karama Mess operations (AED billing)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Fayas"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Phone Number (WhatsApp)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +971 50 123 4567"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                  <span>Emergency Contact</span>
                </span>
                <span className="text-[10px] text-rose-400/80 font-medium">SOS / Roommate / Relative</span>
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. +971 52 987 6543 (Roommate / Kin)"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. customer@example.ae"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 2-Step Accommodation Selector: 1. Area Cluster -> 2. Building */}
          <div className="p-3.5 sm:p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Accommodation & Delivery Location</h4>
                  <p className="text-[10px] text-slate-400">Step 1: Pick Area Cluster → Step 2: Select Building</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewBuildingArea(selectedArea && selectedArea !== 'all' ? selectedArea : 'Karama Central');
                  setIsAddBuildingModalOpen(true);
                }}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ New Building</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Step 1: Which Area? */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>1. Which Area? *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomArea(!isCustomArea);
                      if (!isCustomArea) setCustomAreaInput('');
                    }}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                  >
                    {isCustomArea ? 'Select from list' : '+ New Area'}
                  </button>
                </div>

                {!isCustomArea ? (
                  <select
                    value={selectedArea}
                    onChange={(e) => {
                      if (e.target.value === '__NEW_AREA__') {
                        setIsCustomArea(true);
                        setCustomAreaInput('');
                      } else {
                        const newArea = e.target.value;
                        setSelectedArea(newArea);
                        setNewBuildingArea(newArea && newArea !== 'all' ? newArea : 'Karama Central');
                        if (newArea && newArea !== 'all') {
                          const currentBuilding = availableBuildings.find((b) => b.id === buildingId);
                          if (currentBuilding && (currentBuilding.area || '').toLowerCase() !== newArea.toLowerCase()) {
                            setBuildingId('');
                            setCustomBuildingName('');
                          }
                        }
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="">-- Select Area Cluster First --</option>
                    <option value="all">🌐 All Areas ({availableBuildings.length} buildings)</option>
                    {availableAreas.map(([areaName, count]) => (
                      <option key={areaName} value={areaName}>
                        {areaName} ({count})
                      </option>
                    ))}
                    <option value="__NEW_AREA__" className="text-amber-400 font-bold">
                      ➕ + Add New Area Cluster...
                    </option>
                  </select>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={customAreaInput}
                      onChange={(e) => {
                        setCustomAreaInput(e.target.value);
                        setSelectedArea(e.target.value);
                        setNewBuildingArea(e.target.value);
                      }}
                      placeholder="Type new area name (e.g. Al Satwa)..."
                      className="w-full px-3 py-2 bg-slate-950 border border-amber-500/60 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomArea(false)}
                      className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Step 2: Which Building? */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold text-xs flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>2. Which Building? *</span>
                  </label>
                  {selectedArea && selectedArea !== 'all' && (
                    <span className="text-[10px] text-sky-400 font-semibold truncate max-w-[130px]">
                      {selectedArea}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={
                        selectedArea && selectedArea !== 'all'
                          ? `Search buildings in ${selectedArea}...`
                          : "Search 300+ buildings..."
                      }
                      value={buildingSearch}
                      onChange={(e) => setBuildingSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <select
                    value={buildingId}
                    onChange={(e) => {
                      if (e.target.value === '__NEW_BUILDING__') {
                        setNewBuildingArea(selectedArea && selectedArea !== 'all' ? selectedArea : 'Karama Central');
                        setIsAddBuildingModalOpen(true);
                      } else {
                        setBuildingId(e.target.value);
                        if (e.target.value !== 'custom') {
                          const found = availableBuildings.find((b) => b.id === e.target.value);
                          if (found) {
                            setCustomBuildingName(found.name);
                            if (!selectedArea) setSelectedArea(found.area || 'Karama Central');
                          }
                        }
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="">
                      {!selectedArea
                        ? 'Select Building (Pick Area on left first)...'
                        : `Select Building (${buildingsForSelectedArea.length} available)...`}
                    </option>
                    {buildingsForSelectedArea.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} {(!selectedArea || selectedArea === 'all') && b.area ? `(${b.area})` : ''}
                      </option>
                    ))}
                    <option value="__NEW_BUILDING__" className="text-amber-400 font-bold">
                      ➕ + Add New Building in this Area...
                    </option>
                    <option value="custom">✏️ Other / Custom Building (Type Name)...</option>
                  </select>

                  {buildingId === 'custom' && (
                    <input
                      type="text"
                      placeholder="Type custom building name..."
                      value={customBuildingName}
                      onChange={(e) => setCustomBuildingName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-amber-500/50 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400 animate-fadeIn"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Apartment / Room Number */}
            <div className="pt-1">
              <label className="block text-slate-300 font-semibold mb-1.5 text-xs">Apartment / Room # *</label>
              <input
                type="text"
                required
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="e.g. 211, Flat 104, Room 5B"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Meals included */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-semibold text-xs sm:text-sm">Meal Selection</label>
              <div className="text-[11px] font-bold text-amber-400">
                {hasBreakfast && hasLunch && hasDinner
                  ? '3 Time (Full Package - AED 380/mo)'
                  : ((hasBreakfast ? 1 : 0) + (hasLunch ? 1 : 0) + (hasDinner ? 1 : 0)) === 2
                  ? '2 Time (AED 300/mo • AED 10/day)'
                  : ((hasBreakfast ? 1 : 0) + (hasLunch ? 1 : 0) + (hasDinner ? 1 : 0)) === 1
                  ? '1 Time (AED 180/mo • AED 6/day)'
                  : 'No Meals Selected'}
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer text-slate-200 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  checked={hasBreakfast}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHasBreakfast(checked);
                    const rate = resolveExpectedMonthlyRate(
                      { has_breakfast: checked, has_lunch: hasLunch, has_dinner: hasDinner },
                      mealPlans
                    );
                    setMonthlyRate(rate);
                  }}
                  className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span>Breakfast (BF)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-200 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  checked={hasLunch}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHasLunch(checked);
                    const rate = resolveExpectedMonthlyRate(
                      { has_breakfast: hasBreakfast, has_lunch: checked, has_dinner: hasDinner },
                      mealPlans
                    );
                    setMonthlyRate(rate);
                  }}
                  className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span>Lunch (LN)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-200 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  checked={hasDinner}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHasDinner(checked);
                    const rate = resolveExpectedMonthlyRate(
                      { has_breakfast: hasBreakfast, has_lunch: hasLunch, has_dinner: checked },
                      mealPlans
                    );
                    setMonthlyRate(rate);
                  }}
                  className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span>Dinner (DN)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <label className="text-slate-300 font-semibold text-xs sm:text-sm">Monthly Fee (AED) *</label>
                <div className="flex gap-1 flex-wrap">
                  {mealPlans && mealPlans.length > 0 ? (
                    mealPlans
                      .filter((p) => p.is_active !== false && p.monthly_price)
                      .sort((a, b) => (a.monthly_price || 0) - (b.monthly_price || 0))
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setMonthlyRate(p.monthly_price);
                            setMealPlanId(p.id);
                            if (p.includes_breakfast !== undefined) setHasBreakfast(Boolean(p.includes_breakfast));
                            if (p.includes_lunch !== undefined) setHasLunch(Boolean(p.includes_lunch));
                            if (p.includes_dinner !== undefined) setHasDinner(Boolean(p.includes_dinner));
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border cursor-pointer transition-all ${
                            monthlyRate === p.monthly_price
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          }`}
                          title={`${p.name}: AED ${p.monthly_price}`}
                        >
                          {p.monthly_price}
                        </button>
                      ))
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setMonthlyRate(180)}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                      >
                        180
                      </button>
                      <button
                        type="button"
                        onClick={() => setMonthlyRate(300)}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer"
                      >
                        300
                      </button>
                      <button
                        type="button"
                        onClick={() => setMonthlyRate(380)}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer"
                      >
                        380
                      </button>
                    </>
                  )}
                </div>
              </div>
              <input
                type="number"
                step="0.5"
                required
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Account Status</label>
              <select
                value={hasCancellationNotice ? 'cancelling_soon' : (status === 'left' ? 'cancelled' : status)}
                onChange={(e) => {
                  const newStatus = e.target.value as CustomerStatus;
                  setStatus(newStatus);
                  if (newStatus === 'cancelling_soon') {
                    setHasCancellationNotice(true);
                    if (!cancellationDate) {
                      const d = new Date();
                      d.setDate(d.getDate() + 5);
                      setCancellationDate(d.toISOString().split('T')[0]);
                    }
                  } else {
                    setHasCancellationNotice(false);
                    setCancellationDate('');
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="active">Active (Running)</option>
                <option value="cancelling_soon">⚠️ Cancelling Soon (On Notice)</option>
                <option value="trial">Trial</option>
                <option value="paused">Temporarily Paused</option>
                <option value="inactive">Inactive</option>
                <option value="cancelled">Cancelled (Left Mess)</option>
              </select>
            </div>
          </div>

          {/* Scheduled Cancellation / Notice Period Section */}
          <div className="bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-900 border border-rose-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-400" />
                <span className="text-xs sm:text-sm font-bold text-white">Scheduled Cancellation / Notice</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-rose-300">
                <input
                  type="checkbox"
                  checked={hasCancellationNotice}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHasCancellationNotice(checked);
                    if (checked) {
                      setStatus('cancelling_soon');
                      if (!cancellationDate) {
                        const d = new Date();
                        d.setDate(d.getDate() + 5);
                        setCancellationDate(d.toISOString().split('T')[0]);
                      }
                    } else {
                      if (status === 'cancelling_soon') {
                        setStatus('active');
                      }
                      setCancellationDate('');
                    }
                  }}
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 bg-slate-950 border-slate-700 cursor-pointer"
                />
                <span>Customer gave notice to leave</span>
              </label>
            </div>

            {hasCancellationNotice && (
              <div className="space-y-3 pt-2 border-t border-slate-800 animate-fadeIn">
                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                    <label className="text-xs font-semibold text-slate-300">Planned Final Meal Date</label>
                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 3);
                          setCancellationDate(d.toISOString().split('T')[0]);
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer"
                      >
                        +3 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 5);
                          setCancellationDate(d.toISOString().split('T')[0]);
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer"
                      >
                        +5 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 7);
                          setCancellationDate(d.toISOString().split('T')[0]);
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                      >
                        +7 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          if (d.getDate() >= 15) d.setMonth(d.getMonth() + 1);
                          const y = d.getFullYear();
                          const m = String(d.getMonth() + 1).padStart(2, '0');
                          setCancellationDate(`${y}-${m}-15`);
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer"
                      >
                        Mid-Month (15th)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          const y = d.getFullYear();
                          const m = d.getMonth() + 1;
                          const lastDay = new Date(y, m, 0).getDate();
                          setCancellationDate(`${y}-${String(m).padStart(2, '0')}-${lastDay}`);
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                      >
                        End of Month
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    required={hasCancellationNotice}
                    value={cancellationDate}
                    onChange={(e) => setCancellationDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-rose-500/50 rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Notice Remarks</label>
                  <input
                    type="text"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="e.g. Leaving UAE, Room shifting to Deira, Vacation from 15th..."
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>

                {/* Pro-rata estimation preview */}
                {cancellationDate && (() => {
                  const targetD = new Date(cancellationDate);
                  const daysInMonth = isNaN(targetD.getTime()) ? 30 : new Date(targetD.getFullYear(), targetD.getMonth() + 1, 0).getDate();
                  const daily = calculateDailyMealRate(
                    Number(monthlyRate) || 380,
                    { has_breakfast: hasBreakfast, has_lunch: hasLunch, has_dinner: hasDinner },
                    daysInMonth
                  );
                  const activeD = isNaN(targetD.getTime()) ? 15 : Math.max(1, targetD.getDate());
                  const proRataEst = Math.round(daily * activeD * 100) / 100;
                  return (
                    <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400">Mid-Month Pro-Rata Settlement: </span>
                        <span className="text-[10px] text-slate-500 font-mono">(AED {daily}/day × {activeD}d)</span>
                      </div>
                      <span className="font-mono font-bold text-amber-300">
                        AED {proRataEst.toFixed(2)}
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Who is this customer? Dropdown */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80 shadow-sm">
            <label className="block text-slate-300 font-semibold mb-1.5 text-xs sm:text-sm flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Who is this customer?</span>
              </span>
            </label>
            <select
              value={managedBy}
              onChange={(e) => setManagedBy(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="online_self_service">Online</option>
              {availableUsers
                .filter((u) => u.username !== 'admin' && u.username !== 'manager')
                .map((u) => (
                  <option key={u.id} value={u.username}>
                    {u.username} ({u.fullName})
                  </option>
                ))}
            </select>
          </div>

          {/* Outstanding Due Balance Field */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Outstanding Dues / Opening Balance (AED)</span>
              </label>
              {Number(totalOverdue) > 0 ? (
                <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Overdue Active
                </span>
              ) : (
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  No Due (Good Standing)
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-mono">
                AED
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={totalOverdue}
                onChange={(e) => setTotalOverdue(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Set or adjust customer's pending due balance. Setting to 0 marks the account in good standing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Payment Made Up To The Date</label>
              <input
                type="date"
                value={paymentMadeUpTo}
                onChange={(e) => setPaymentMadeUpTo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Billed Up To The Date</label>
              <input
                type="date"
                value={billedUpTo}
                onChange={(e) => setBilledUpTo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Delivery Target Time</label>
              <input
                type="text"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                placeholder="e.g. 5:45 AM, 6:00 AM, 12:00 PM"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Door Passcode / Key</label>
              <input
                type="text"
                value={doorPasscode}
                onChange={(e) => setDoorPasscode(e.target.value)}
                placeholder="e.g. 4695#, 7580#"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Dietary Preferences & Packing Notes</label>
            <textarea
              rows={2}
              value={dietaryPreferences}
              onChange={(e) => setDietaryPreferences(e.target.value)}
              placeholder="e.g. No chapati, No fish curry, No porota, Barik rice only, Veg only"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Subscription Notes / Starting Date</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Starting from 1 September 2026 ✅"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{customer ? 'Update Profile' : 'Save Customer'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick Add Building Modal */}
      {isAddBuildingModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-amber-500/40 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h4 className="text-base font-bold text-white">Add New Building</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBuildingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickAddBuilding} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Building Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Falaknaz, Al Wasl R Block"
                  value={newBuildingName}
                  onChange={(e) => setNewBuildingName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Area Cluster *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomNewBuildingArea(!isCustomNewBuildingArea)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                  >
                    {isCustomNewBuildingArea ? 'Select from list' : '+ Type New Area'}
                  </button>
                </div>
                {!isCustomNewBuildingArea ? (
                  <select
                    value={newBuildingArea}
                    onChange={(e) => {
                      if (e.target.value === '__TYPE_NEW__') {
                        setIsCustomNewBuildingArea(true);
                      } else {
                        setNewBuildingArea(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-medium"
                  >
                    {availableAreas.map(([areaName, count]) => (
                      <option key={areaName} value={areaName}>
                        {areaName} ({count})
                      </option>
                    ))}
                    <option value="__TYPE_NEW__" className="text-amber-400 font-bold">
                      ➕ + Type New Area Cluster...
                    </option>
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Type new area name (e.g. Al Satwa)..."
                    value={newBuildingArea}
                    onChange={(e) => setNewBuildingArea(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-amber-500/60 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Address / Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Karama Center, Dubai"
                  value={newBuildingAddress}
                  onChange={(e) => setNewBuildingAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBuildingModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingNewBuilding}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {isSavingNewBuilding ? 'Saving...' : 'Save & Select Building'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
