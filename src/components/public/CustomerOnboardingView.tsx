import React, { useState, useEffect, useMemo } from 'react';
import { 
  UtensilsCrossed, 
  CheckCircle2, 
  Building2, 
  Phone, 
  User, 
  Calendar, 
  Clock, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Check, 
  AlertCircle, 
  ChefHat, 
  ShieldCheck, 
  ArrowRight,
  RotateCcw,
  Coffee,
  Sun,
  Moon,
  Info
} from 'lucide-react';
import { Building, Customer, BusinessSettings } from '../../types';
import { formatAED } from '../../utils/currency';
import { fetchBuildings, fetchBusinessSettings, saveCustomer } from '../../api/supabase';
import appIcon from '../../assets/app-icon.png';

interface CustomerOnboardingViewProps {
  onBackToLogin?: () => void;
}

const DELIVERY_AREAS = [
  'Hamdan Colony & Post',
  'Park, Pioneer & ADCB',
  'Karama Center - Pyramid',
  'Burjman & Mankhool',
  'Karama Central',
];

export const CustomerOnboardingView: React.FC<CustomerOnboardingViewProps> = ({ onBackToLogin }) => {
  // Data states
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>(DELIVERY_AREAS[0]);
  const [customAreaName, setCustomAreaName] = useState('');
  const [apartment, setApartment] = useState('');
  
  // Meal plan selection
  // Default to 3 times (full mess) as most popular
  const [selectedPlanType, setSelectedPlanType] = useState<'3-time' | '2-time' | '1-time'>('3-time');
  const [hasBreakfast, setHasBreakfast] = useState(true);
  const [hasLunch, setHasLunch] = useState(true);
  const [hasDinner, setHasDinner] = useState(true);

  // Dietary options
  const [foodType, setFoodType] = useState<'all' | 'veg'>('all');
  const [hasAllergy, setHasAllergy] = useState<boolean>(false);
  const [allergyDetails, setAllergyDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [joiningDate, setJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCustomer, setSubmittedCustomer] = useState<Customer | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load initial buildings and business settings from Supabase
  useEffect(() => {
    const initData = async () => {
      try {
        const [bldList, setts] = await Promise.all([
          fetchBuildings(),
          fetchBusinessSettings(),
        ]);
        setBuildings(bldList || []);
        setSettings(setts);
      } catch (err) {
        console.error('Failed to load initial onboarding data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // Update meal slot toggles when plan card is clicked
  const handleSelectPlan = (plan: '3-time' | '2-time' | '1-time') => {
    setSelectedPlanType(plan);
    if (plan === '3-time') {
      setHasBreakfast(true);
      setHasLunch(true);
      setHasDinner(true);
    } else if (plan === '2-time') {
      // Default to Breakfast & Lunch or Lunch & Dinner
      setHasBreakfast(true);
      setHasLunch(true);
      setHasDinner(false);
    } else if (plan === '1-time') {
      // Default to Lunch only
      setHasBreakfast(false);
      setHasLunch(true);
      setHasDinner(false);
    }
  };

  // Compute calculated monthly price based on meal selections
  const getMonthlyRate = () => {
    const mealCount = (hasBreakfast ? 1 : 0) + (hasLunch ? 1 : 0) + (hasDinner ? 1 : 0);
    if (mealCount === 3) return 380;
    if (mealCount === 2) return 300;
    if (mealCount === 1) return 180;
    return 380;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!trimmedPhone) {
      setErrorMessage('Please enter your WhatsApp mobile number.');
      return;
    }

    const mealCount = (hasBreakfast ? 1 : 0) + (hasLunch ? 1 : 0) + (hasDinner ? 1 : 0);
    if (mealCount === 0) {
      setErrorMessage('Please select at least one meal (Breakfast, Lunch, or Dinner).');
      return;
    }

    // Determine building / area name
    let resolvedBuildingName = selectedArea;
    let resolvedBuildingId: string | undefined = undefined;

    if (selectedArea === 'other') {
      resolvedBuildingName = customAreaName.trim() || 'Other Area';
    }

    const matchedBuilding = buildings.find(
      (b) =>
        (b.area && b.area.toLowerCase() === resolvedBuildingName.toLowerCase()) ||
        b.name.toLowerCase() === resolvedBuildingName.toLowerCase()
    );
    resolvedBuildingId = matchedBuilding?.id;

    setIsSubmitting(true);

    try {
      const newCustomerPayload: Partial<Customer> = {
        full_name: trimmedName,
        phone: trimmedPhone.startsWith('+') ? trimmedPhone : `+971 ${trimmedPhone.replace(/\D/g, '')}`,
        emergency_contact: emergencyContact.trim()
          ? (emergencyContact.trim().startsWith('+') ? emergencyContact.trim() : `+971 ${emergencyContact.replace(/\D/g, '')}`)
          : undefined,
        building_id: resolvedBuildingId,
        building_name_cache: resolvedBuildingName,
        apartment_cache: apartment.trim() || 'N/A',
        has_breakfast: hasBreakfast,
        has_lunch: hasLunch,
        has_dinner: hasDinner,
        monthly_rate: getMonthlyRate(),
        dietary_preferences: [
          foodType === 'veg' ? 'Veg Only' : 'Non-Veg & Veg',
          hasAllergy && allergyDetails.trim() ? `Allergy: ${allergyDetails.trim()}` : '',
          notes.trim() ? `Notes: ${notes.trim()}` : '',
        ].filter(Boolean).join(' | '),
        notes: notes.trim() || (hasAllergy ? `Allergy: ${allergyDetails.trim()}` : ''),
        joining_date: joiningDate,
        billing_start_date: joiningDate,
        status: 'active',
        managed_by: 'online_self_service',
      };

      const saved = await saveCustomer(newCustomerPayload);
      setSubmittedCustomer(saved);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMessage(err.message || 'Unable to submit your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp confirmation message link
  const getWhatsAppMessageUrl = () => {
    if (!submittedCustomer) return '';
    const messPhone = (settings?.phone || '+971509988776').replace(/\D/g, '');
    const mealsText = [
      submittedCustomer.has_breakfast ? 'Breakfast' : '',
      submittedCustomer.has_lunch ? 'Lunch' : '',
      submittedCustomer.has_dinner ? 'Dinner' : '',
    ].filter(Boolean).join(' + ');

    const msg = `Hi Karama Mess! 👋\nI have just registered for the mess service online.\n\n👤 *Name:* ${submittedCustomer.full_name}\n🔢 *Code:* #${submittedCustomer.customer_code}\n🏢 *Building:* ${submittedCustomer.building_name_cache} (Apt: ${submittedCustomer.apartment_cache})\n🍽️ *Meals:* ${mealsText} (AED ${submittedCustomer.monthly_rate}/mo)\n📅 *Joining Date:* ${submittedCustomer.joining_date}\n\nPlease confirm my daily delivery!`;
    return `https://wa.me/${messPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Aesthetic Ambient Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/15 via-emerald-500/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header & Brand Bar */}
      <header className="relative z-10 px-4 py-6 border-b border-slate-800/80 bg-[#0d131f]/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={appIcon} 
              alt="Karama Mess" 
              className="w-11 h-11 rounded-2xl shadow-lg shadow-amber-500/10 object-cover border border-amber-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white font-black text-lg tracking-wider">
                  KARAMA MESS
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Dubai • UAE
                </span>
              </div>
              <p className="text-[11px] text-amber-400 font-bold tracking-widest uppercase mt-0.5">
                Good Food. Happy People.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="relative z-10 flex-1 px-4 py-8 sm:py-12 max-w-2xl w-full mx-auto">
        {submittedCustomer ? (
          /* SUCCESS SCREEN */
          <div className="bg-[#111726]/95 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl animate-fadeIn space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Registration Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-2">
                Welcome to Karama Mess!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Your customer record has been created and synced directly into our mess kitchen system.
              </p>
            </div>

            {/* Generated Customer Code Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 max-w-sm mx-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Your Customer Account Code</span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400 tracking-wider">
                #{submittedCustomer.customer_code}
              </span>
            </div>

            {/* Summary Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400 font-semibold">Customer Name:</span>
                <span className="font-bold text-white text-sm">{submittedCustomer.full_name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400 font-semibold">Phone:</span>
                <span className="font-mono text-slate-200">{submittedCustomer.phone}</span>
              </div>
              {submittedCustomer.emergency_contact && (
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400 font-semibold">Emergency Contact:</span>
                  <span className="font-mono text-slate-300">{submittedCustomer.emergency_contact}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400 font-semibold">Building &amp; Room:</span>
                <span className="font-bold text-slate-200">{submittedCustomer.building_name_cache} (Apt {submittedCustomer.apartment_cache})</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400 font-semibold">Selected Meals:</span>
                <span className="font-bold text-emerald-400">
                  {[
                    submittedCustomer.has_breakfast ? 'Breakfast' : '',
                    submittedCustomer.has_lunch ? 'Lunch' : '',
                    submittedCustomer.has_dinner ? 'Dinner' : '',
                  ].filter(Boolean).join(' + ')}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400 font-semibold">Monthly Rate:</span>
                <span className="font-mono font-black text-amber-400 text-sm">{formatAED(submittedCustomer.monthly_rate)} / month</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 font-semibold">First Meal Starting:</span>
                <span className="font-mono text-slate-300">{submittedCustomer.joining_date}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={getWhatsAppMessageUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Message Mess Manager on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSubmittedCustomer(null);
                  setFullName('');
                  setPhone('');
                  setApartment('');
                  setNotes('');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                Register Another Customer
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <div className="bg-[#111726]/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 backdrop-blur-xl animate-fadeIn space-y-6">
            <div className="border-b border-slate-800/80 pb-5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Self-Service Onboarding</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                New Customer Registration
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Fill out your details below to activate your daily mess delivery service in Karama.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: Personal Details */}
              <div className="space-y-3.5">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>1. Personal Information</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohammed Salman"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090d16] border border-slate-700/80 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      WhatsApp Mobile Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none text-xs font-bold text-amber-400">
                        <span>🇦🇪</span>
                        <span>+971</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="50 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-20 pr-3.5 py-2.5 bg-[#090d16] border border-slate-700/80 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Emergency Contact / Alternate (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none text-xs font-bold text-slate-400">
                        <span>🇦🇪</span>
                        <span>+971</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="50 987 6543 (Roommate / Friend)"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        className="w-full pl-20 pr-3.5 py-2.5 bg-[#090d16] border border-slate-700/80 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Primary number is used for daily meal WhatsApp confirmations and billing statements.
                </p>
              </div>

              {/* SECTION 2: Room & Delivery Location */}
              <div className="space-y-3.5 pt-4 border-t border-slate-800">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>2. Delivery Building &amp; Room</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Building / Area Name <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#090d16] border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      {DELIVERY_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                      <option value="other" className="text-amber-400 font-bold">
                        ➕ + Add New Area / Other Building...
                      </option>
                    </select>
                  </div>

                  {selectedArea === 'other' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Type Building / Area Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Al Wasl Tower"
                        value={customAreaName}
                        onChange={(e) => setCustomAreaName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#090d16] border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Flat / Room / Bed No. <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apt 204, Room B"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#090d16] border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Meal Plan Tier Cards */}
              <div className="space-y-3.5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                    <span>3. Choose Your Meal Plan</span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-bold">Standard Dubai Mess Rates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Plan 1: 1-Time */}
                  <div
                    onClick={() => handleSelectPlan('1-time')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPlanType === '1-time'
                        ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-[#090d16] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-300">1 Time Daily</div>
                      <div className="text-lg font-black text-white mt-1">AED 180</div>
                      <div className="text-[10px] text-slate-400">~6 AED / meal</div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400">
                      Ideal for Office Lunch or Room Dinner only
                    </div>
                  </div>

                  {/* Plan 2: 2-Times */}
                  <div
                    onClick={() => handleSelectPlan('2-time')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPlanType === '2-time'
                        ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-[#090d16] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-300">2 Times Daily</div>
                      <div className="text-lg font-black text-white mt-1">AED 300</div>
                      <div className="text-[10px] text-slate-400">~10 AED / day</div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400">
                      Breakfast + Lunch OR Lunch + Dinner
                    </div>
                  </div>

                  {/* Plan 3: 3-Times (Featured) */}
                  <div
                    onClick={() => handleSelectPlan('3-time')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPlanType === '3-time'
                        ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/20 border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-[#090d16] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-3 px-2 py-0.2 rounded-full text-[9px] font-black uppercase bg-amber-500 text-slate-950">
                      Popular
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>Full Day (3 Times)</span>
                      </div>
                      <div className="text-lg font-black text-amber-400 mt-1">AED 380</div>
                      <div className="text-[10px] text-amber-200/80">~12.67 AED / day</div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-300">
                      Breakfast + Lunch + Dinner (Complete)
                    </div>
                  </div>
                </div>

                {/* Specific Meal Slot Checkboxes */}
                <div className="p-3.5 rounded-2xl bg-[#090d16] border border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Included Daily Meals:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setHasBreakfast(!hasBreakfast)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        hasBreakfast
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Breakfast</span>
                      {hasBreakfast && <Check className="w-3 h-3 text-amber-400" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasLunch(!hasLunch)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        hasLunch
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>Lunch</span>
                      {hasLunch && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasDinner(!hasDinner)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        hasDinner
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dinner</span>
                      {hasDinner && <Check className="w-3 h-3 text-sky-400" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Food Preference, Allergies & Notes */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                  <span>4. Food Preference &amp; Special Requests</span>
                </div>

                {/* Diet Type (Select One): Non-Veg & Veg OR Veg Only */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Food Preference (Select One):
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFoodType('all')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        foodType === 'all'
                          ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                          : 'bg-[#090d16] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
                        foodType === 'all' ? 'bg-amber-500 text-slate-950 font-black shadow-sm shadow-amber-500/20' : 'bg-slate-800 text-slate-400'
                      }`}>
                        🍖
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>Non-Veg &amp; Veg</span>
                          {foodType === 'all' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400">Regular mess menu</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFoodType('veg')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        foodType === 'veg'
                          ? 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/10'
                          : 'bg-[#090d16] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
                        foodType === 'veg' ? 'bg-emerald-500 text-slate-950 font-black shadow-sm shadow-emerald-500/20' : 'bg-slate-800 text-slate-400'
                      }`}>
                        🥗
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>Veg Only</span>
                          {foodType === 'veg' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-semibold">100% Vegetarian</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Any Food Allergies Toggle & Details */}
                <div className="p-3.5 rounded-2xl bg-[#090d16] border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Do you have any food allergies?</span>
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setHasAllergy(false);
                          setAllergyDetails('');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          !hasAllergy
                            ? 'bg-slate-800 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasAllergy(true)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          hasAllergy
                            ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                            : 'text-slate-400 hover:text-rose-300'
                        }`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>

                  {hasAllergy && (
                    <div className="pt-2 border-t border-slate-800/80 animate-fadeIn">
                      <label className="block text-[11px] font-semibold text-rose-300 mb-1">
                        Please specify your allergy:
                      </label>
                      <input
                        type="text"
                        required={hasAllergy}
                        placeholder="e.g. Peanut, Fish, Seafood, Egg, Dairy, etc."
                        value={allergyDetails}
                        onChange={(e) => setAllergyDetails(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-rose-500/40 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-400 font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* Specific items you don't want or special notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Items You Don't Want or Special Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. No fish curry, prefer barik rice, less spicy, leave tiffin outside room door, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090d16] border border-slate-700/80 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>

                {/* First Meal Starting Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    First Meal Starting Date <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#090d16] border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* RATE SUMMARY & SUBMIT */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border border-amber-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Monthly Subscription</span>
                    <span className="text-xs text-amber-300">Billed monthly in AED</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
                      {formatAED(getMonthlyRate())}
                    </span>
                    <span className="block text-[10px] text-slate-400">/ month</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCcw className="w-5 h-5 animate-spin" />
                      <span>Recording Your Registration...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration &amp; Join Mess</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-400">
          Karama Mess Management &amp; Catering • Al Karama, Dubai, UAE
        </p>
        <p className="text-[11px]">
          Direct Customer Service WhatsApp: {settings?.phone || '+971 50 123 4567'}
        </p>
      </footer>
    </div>
  );
};
