import React, { useState } from 'react';
import { CalendarDays, Plus, Check, Pencil, Trash2, AlertTriangle, X, Users, Utensils } from 'lucide-react';
import { MealPlan, Customer } from '../../types';
import { formatAED } from '../../utils/currency';

interface MealPlanListProps {
  mealPlans: MealPlan[];
  customers?: Customer[];
  onAddPlan: (plan: Partial<MealPlan>) => void;
  onEditPlan?: (plan: Partial<MealPlan>) => void;
  onDeletePlan?: (id: string) => void;
}

export const MealPlanList: React.FC<MealPlanListProps> = ({
  mealPlans,
  customers = [],
  onAddPlan,
  onEditPlan,
  onDeletePlan,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<MealPlan | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState(380);
  const [perMealPrice, setPerMealPrice] = useState(13);
  const [hasBF, setHasBF] = useState(true);
  const [hasLN, setHasLN] = useState(true);
  const [hasDN, setHasDN] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setName('');
    setDescription('');
    setMonthlyPrice(380);
    setPerMealPrice(13);
    setHasBF(true);
    setHasLN(true);
    setHasDN(true);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: MealPlan) => {
    setEditingPlan(plan);
    setName(plan.name || '');
    setDescription(plan.description || '');
    setMonthlyPrice(plan.monthly_price || 0);
    setPerMealPrice(plan.per_meal_price || 0);
    setHasBF(Boolean(plan.includes_breakfast));
    setHasLN(Boolean(plan.includes_lunch));
    setHasDN(Boolean(plan.includes_dinner));
    setIsActive(plan.is_active !== undefined ? Boolean(plan.is_active) : true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Partial<MealPlan> = {
      id: editingPlan?.id,
      name: name.trim(),
      description: description.trim() || undefined,
      monthly_price: Number(monthlyPrice),
      per_meal_price: Number(perMealPrice),
      includes_breakfast: hasBF,
      includes_lunch: hasLN,
      includes_dinner: hasDN,
      is_active: isActive,
    };

    if (editingPlan && onEditPlan) {
      onEditPlan(payload);
    } else {
      onAddPlan(payload);
    }

    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingPlan || !onDeletePlan) return;
    onDeletePlan(deletingPlan.id);
    setDeletingPlan(null);
  };

  // Helper to count customers enrolled on this plan
  const getSubscribersCount = (planId: string, planName: string) => {
    return customers.filter(
      (c) => c.meal_plan_id === planId || (c.meal_plan && c.meal_plan.id === planId) || (c.notes && c.notes.toLowerCase().includes(planName.toLowerCase()))
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Meal Plans &amp; Pricing</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configurable meal packages in AED for Karama Mess customers
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add Meal Plan</span>
        </button>
      </div>

      {/* Meal Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mealPlans.map((mp) => {
          const subscriberCount = getSubscribersCount(mp.id, mp.name);

          return (
            <div
              key={mp.id}
              className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl p-6 shadow-lg shadow-black/20 hover:border-slate-600/60 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Row: Icon, Status, and Action Buttons */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm">
                    <CalendarDays className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        mp.is_active !== false
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {mp.is_active !== false ? 'Active' : 'Inactive'}
                    </span>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(mp)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                      title={`Edit ${mp.name}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    {onDeletePlan && (
                      <button
                        type="button"
                        onClick={() => setDeletingPlan(mp)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                        title={`Delete ${mp.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Plan Name & Description */}
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                  {mp.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">
                  {mp.description || 'Standard recurring daily mess meal subscription'}
                </p>

                {/* Pricing Details */}
                <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Monthly Price:</span>
                    <span className="font-extrabold text-white text-base font-mono">
                      {formatAED(mp.monthly_price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Per-Meal Price:</span>
                    <span className="font-semibold text-slate-300 font-mono">
                      {formatAED(mp.per_meal_price)}
                    </span>
                  </div>
                  {subscriberCount > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3 text-sky-400" />
                        <span>Enrolled Subscribers:</span>
                      </span>
                      <span className="font-bold text-sky-300 font-mono">
                        {subscriberCount} customers
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Row: Included Meals & Quick Actions */}
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Utensils className="w-3.5 h-3.5 text-amber-400" />
                    <span>Included Meals:</span>
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-[10px]">
                    <span
                      className={`px-2 py-0.5 rounded font-mono ${
                        mp.includes_breakfast
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-600'
                      }`}
                      title={mp.includes_breakfast ? 'Breakfast Included' : 'No Breakfast'}
                    >
                      BF
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono ${
                        mp.includes_lunch
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-600'
                      }`}
                      title={mp.includes_lunch ? 'Lunch Included' : 'No Lunch'}
                    >
                      LN
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono ${
                        mp.includes_dinner
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-600'
                      }`}
                      title={mp.includes_dinner ? 'Dinner Included' : 'No Dinner'}
                    >
                      DN
                    </span>
                  </div>
                </div>

                {/* Explicit Bottom Action Buttons for fast access */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(mp)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-amber-400 hover:text-amber-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit Plan</span>
                  </button>
                  {onDeletePlan && (
                    <button
                      type="button"
                      onClick={() => setDeletingPlan(mp)}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                      title="Delete this meal plan"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Meal Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingPlan ? 'Edit Meal Plan' : 'Add Custom Meal Plan'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPlan(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 2 Time (Lunch & Dinner Only), Weekend Special"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Regular meal service: Afternoon Lunch and Evening Dinner"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Monthly Price (AED) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Per-Meal (AED)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={perMealPrice}
                    onChange={(e) => setPerMealPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2">Included Meals</label>
                <div className="flex gap-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
                    <input
                      type="checkbox"
                      checked={hasBF}
                      onChange={(e) => setHasBF(e.target.checked)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span className="font-medium">Breakfast (BF)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
                    <input
                      type="checkbox"
                      checked={hasLN}
                      onChange={(e) => setHasLN(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                    />
                    <span className="font-medium">Lunch (LN)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
                    <input
                      type="checkbox"
                      checked={hasDN}
                      onChange={(e) => setHasDN(e.target.checked)}
                      className="rounded border-slate-700 text-blue-500 focus:ring-0"
                    />
                    <span className="font-medium">Dinner (DN)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Active for new customer subscriptions</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingPlan(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  {editingPlan ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-rose-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Meal Plan</h3>
                <p className="text-xs text-slate-400">This action will permanently delete this meal plan</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="font-bold text-white text-sm">{deletingPlan.name}</div>
              <div className="text-slate-400">
                Monthly Rate: <span className="text-white font-mono font-bold">{formatAED(deletingPlan.monthly_price)}</span>
              </div>
              {getSubscribersCount(deletingPlan.id, deletingPlan.name) > 0 && (
                <div className="pt-2 text-amber-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    Warning: {getSubscribersCount(deletingPlan.id, deletingPlan.name)} customers currently use this plan.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPlan(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};