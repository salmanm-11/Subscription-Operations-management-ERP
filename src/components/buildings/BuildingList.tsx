import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Key, 
  Users, 
  Pencil, 
  Trash2, 
  Search, 
  Sparkles, 
  X,
  RefreshCw 
} from 'lucide-react';
import { Building, Customer } from '../../types';

interface BuildingListProps {
  buildings: Building[];
  customers: Customer[];
  onAddBuilding: (building: Partial<Building>) => void;
  onDeleteBuilding?: (id: string) => void;
  onDeleteEmptyBuildings?: () => Promise<void> | void;
}

const normalizeCluster = (s?: string): string => {
  if (!s) return '';
  return s.replace(/^[\p{Emoji}\p{Symbol}\s\u200B-\u200D\uFE0F]+/u, '').trim();
};

const DEFAULT_CLUSTERS = [
  'Karama Central',
  'Park, Pioneer & ADCB',
  'Hamdan Colony & Post',
  'Karama Center - Pyramid',
  'Burjman & Mankhool',
];

const getCustomClustersFromStorage = (): string[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem('karama_custom_clusters');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.map((c) => normalizeCluster(c)).filter(Boolean);
        }
      }
    }
  } catch {}
  return [];
};

const saveCustomClustersToStorage = (clusters: string[]) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('karama_custom_clusters', JSON.stringify(clusters.map(normalizeCluster)));
    }
  } catch {}
};

export const BuildingList: React.FC<BuildingListProps> = ({
  buildings,
  customers,
  onAddBuilding,
  onDeleteBuilding,
  onDeleteEmptyBuildings,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [name, setName] = useState('');
  const [area, setArea] = useState('Karama Central');
  const [isCustomArea, setIsCustomArea] = useState(false);
  const [customArea, setCustomArea] = useState('');
  const [address, setAddress] = useState('');
  const [passcode, setPasscode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState('all');
  const [occupancyFilter, setOccupancyFilter] = useState<'all' | 'occupied' | 'empty'>('all');
  const [isManageClustersOpen, setIsManageClustersOpen] = useState(false);
  const [isDeleteEmptyModalOpen, setIsDeleteEmptyModalOpen] = useState(false);
  const [isDeletingEmpty, setIsDeletingEmpty] = useState(false);

  // Helper to get active residing customers in a given building (excluding permanently left & cancelled)
  const getBuildingResidents = (b: Building): Customer[] => {
    const bName = (b.name || '').trim().toLowerCase();
    return customers.filter(
      (c) =>
        c.status !== 'left' &&
        c.status !== 'cancelled' &&
        (c.building_id === b.id ||
          (c.building_name_cache && c.building_name_cache.trim().toLowerCase() === bName))
    );
  };

  const getResidingCount = (b: Building): number => getBuildingResidents(b).length;

  const emptyBuildings = useMemo(() => {
    return buildings.filter((b) => getResidingCount(b) === 0);
  }, [buildings, customers]);

  const occupiedBuildings = useMemo(() => {
    return buildings.filter((b) => getResidingCount(b) > 0);
  }, [buildings, customers]);

  // Custom clusters saved in local storage
  const [customClusters, setCustomClusters] = useState<string[]>(() => getCustomClustersFromStorage());

  // Dynamically merge clusters from buildings, default clusters, and custom saved clusters (fully deduplicated & normalized)
  const allClusters = useMemo(() => {
    const list: string[] = [];
    const seen = new Set<string>();

    const add = (val?: string) => {
      if (!val) return;
      const clean = normalizeCluster(val);
      if (!clean) return;
      const lower = clean.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        list.push(clean);
      }
    };

    // 1. Add all clusters from live delivery buildings
    buildings.forEach((b) => add(b.area));
    // 2. Add standard known clusters
    DEFAULT_CLUSTERS.forEach(add);
    // 3. Add custom saved clusters
    customClusters.forEach(add);

    return list;
  }, [customClusters, buildings]);

  const handleOpenAdd = () => {
    setEditingBuilding(null);
    setName('');
    setArea(allClusters[0] || 'Karama Central');
    setIsCustomArea(false);
    setCustomArea('');
    setAddress('');
    setPasscode('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Building) => {
    setEditingBuilding(b);
    setName(b.name || '');
    const currentArea = normalizeCluster(b.area || '') || allClusters[0] || 'Karama Central';
    if (allClusters.some((c) => c.toLowerCase() === currentArea.toLowerCase())) {
      setArea(currentArea);
      setIsCustomArea(false);
      setCustomArea('');
    } else {
      setIsCustomArea(true);
      setCustomArea(currentArea);
    }
    setAddress(b.address || '');
    setPasscode(b.door_passcode || '');
    setIsModalOpen(true);
  };

  const handleSaveBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let finalArea = area;
    if (isCustomArea) {
      const trimmedCustom = customArea.trim();
      if (!trimmedCustom) {
        alert('Please enter a name for the custom area cluster.');
        return;
      }
      finalArea = trimmedCustom;
      // Save new cluster to storage if not already there
      if (!customClusters.some((c) => c.toLowerCase() === trimmedCustom.toLowerCase())) {
        const updated = [...customClusters, trimmedCustom];
        setCustomClusters(updated);
        saveCustomClustersToStorage(updated);
      }
    }

    onAddBuilding({
      id: editingBuilding?.id,
      name: name.trim(),
      area: finalArea,
      address: address.trim(),
      door_passcode: passcode.trim(),
    });

    setName('');
    setAddress('');
    setPasscode('');
    setEditingBuilding(null);
    setIsModalOpen(false);
  };

  const handleDeleteCustomCluster = (clusterToDelete: string) => {
    const updated = customClusters.filter((c) => c.toLowerCase() !== clusterToDelete.toLowerCase());
    setCustomClusters(updated);
    saveCustomClustersToStorage(updated);
  };

  // Filter buildings by search, cluster, and occupancy
  const filteredBuildings = useMemo(() => {
    return buildings.filter((b) => {
      // Occupancy filter
      const residentCount = getResidingCount(b);
      if (occupancyFilter === 'occupied' && residentCount === 0) return false;
      if (occupancyFilter === 'empty' && residentCount > 0) return false;

      // Cluster filter
      if (selectedClusterFilter !== 'all') {
        const buildingArea = normalizeCluster(b.area || '').toLowerCase();
        const targetFilter = normalizeCluster(selectedClusterFilter).toLowerCase();
        if (buildingArea !== targetFilter) {
          return false;
        }
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesArea = (b.area || '').toLowerCase().includes(q);
        const matchesAddress = (b.address || '').toLowerCase().includes(q);
        const matchesPasscode = (b.door_passcode || '').toLowerCase().includes(q);

        const buildingCustomers = getBuildingResidents(b);
        const matchesResident = buildingCustomers.some((c) => c.full_name.toLowerCase().includes(q));

        if (!matchesName && !matchesArea && !matchesAddress && !matchesPasscode && !matchesResident) {
          return false;
        }
      }

      return true;
    });
  }, [buildings, selectedClusterFilter, searchTerm, customers, occupancyFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Accommodation &amp; Buildings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage delivery clusters, buildings, and door codes
            <span className="text-slate-500 mx-1.5">•</span>
            <span className="text-emerald-400 font-bold">{occupiedBuildings.length}</span> with residents
            {emptyBuildings.length > 0 && (
              <>
                <span className="text-slate-500 mx-1.5">•</span>
                <span className="text-rose-400 font-bold">{emptyBuildings.length}</span> empty
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {emptyBuildings.length > 0 && onDeleteEmptyBuildings && (
            <button
              onClick={() => setIsDeleteEmptyModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 text-xs font-bold border border-rose-500/30 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              title="Delete all buildings with zero residents"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Delete Empty Buildings ({emptyBuildings.length})</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-colors cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Add Building</span>
          </button>
        </div>
      </div>

      {/* Empty Buildings Warning & 1-Click Purge Banner */}
      {emptyBuildings.length > 0 && onDeleteEmptyBuildings && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-rose-300 flex items-center gap-2">
                <span>{emptyBuildings.length} Empty Buildings Detected</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  0 Residents
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                These buildings currently have no customers residing in them. Only buildings with active customers will be retained.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteEmptyModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
          >
            🗑️ Delete All {emptyBuildings.length} Empty Buildings
          </button>
        </div>
      )}

      {/* Search & Area Cluster Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#151c2c] border border-[#222f47]/60 rounded-2xl p-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search buildings by name, address, or resident..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Cluster Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedClusterFilter}
            onChange={(e) => setSelectedClusterFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Clusters ({buildings.length})</option>
            {allClusters
              .map((c) => {
                const count = buildings.filter(
                  (b) => normalizeCluster(b.area || '').toLowerCase() === c.toLowerCase()
                ).length;
                return { name: c, count };
              })
              .filter((c) => c.count > 0 || customClusters.some((cc) => cc.toLowerCase() === c.name.toLowerCase()))
              .map(({ name, count }) => (
                <option key={name} value={name}>
                  {name} ({count})
                </option>
              ))}
          </select>

          {customClusters.length > 0 && (
            <button
              onClick={() => setIsManageClustersOpen(true)}
              className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-colors shrink-0 cursor-pointer"
              title="Manage custom area clusters"
            >
              Manage Clusters
            </button>
          )}

          {/* Occupancy Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700/80 shrink-0">
            <button
              type="button"
              onClick={() => setOccupancyFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                occupancyFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({buildings.length})
            </button>
            <button
              type="button"
              onClick={() => setOccupancyFilter('occupied')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                occupancyFilter === 'occupied'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              With Residents ({occupiedBuildings.length})
            </button>
            <button
              type="button"
              onClick={() => setOccupancyFilter('empty')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                occupancyFilter === 'empty'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Empty ({emptyBuildings.length})
            </button>
          </div>
        </div>
      </div>

      {/* Buildings Grid */}
      {filteredBuildings.length === 0 ? (
        <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl p-10 text-center text-slate-400">
          <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-600" />
          <p className="font-semibold text-sm text-slate-300">No buildings found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || selectedClusterFilter !== 'all'
              ? 'Try adjusting your search query or cluster filter.'
              : 'Click "Add Building" to register your first delivery accommodation.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBuildings.map((b) => {
            const buildingCustomers = getBuildingResidents(b);
            return (
              <div
                key={b.id}
                className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl p-5 shadow-lg shadow-black/20 hover:border-slate-600/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {buildingCustomers.length} Customers
                      </span>
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                        title="Edit Building & Area Cluster"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteBuilding && buildingCustomers.length === 0 && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete building "${b.name}"?`)) {
                              onDeleteBuilding(b.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                          title="Delete Building"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">{b.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-medium text-slate-300">{b.area || 'Karama'}</span>
                  </div>

                  {b.address && (
                    <div className="text-[11px] text-slate-400 mt-1 truncate">
                      {b.address}
                    </div>
                  )}

                  {b.door_passcode && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-sky-400 font-mono font-bold bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg w-fit">
                      <Key className="w-3 h-3 text-sky-400" />
                      <span>Passcode: {b.door_passcode}</span>
                    </div>
                  )}
                </div>

                {/* Customers preview in building */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-500" />
                    <span>Resident Customers:</span>
                  </div>
                  {buildingCustomers.length === 0 ? (
                    <p className="text-[11px] text-slate-600">No customers currently registered</p>
                  ) : (
                    <div className="space-y-1">
                      {buildingCustomers.slice(0, 3).map((cust) => (
                        <div key={cust.id} className="text-xs text-slate-300 flex justify-between">
                          <span className="font-medium text-white">{cust.full_name}</span>
                          <span className="text-slate-400">Apt {cust.apartment_cache || '-'}</span>
                        </div>
                      ))}
                      {buildingCustomers.length > 3 && (
                        <div className="text-[10px] text-amber-400 font-semibold pt-1">
                          + {buildingCustomers.length - 3} more residents
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Building Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">
                {editingBuilding ? `Edit Building: ${editingBuilding.name}` : 'Add New Building'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBuilding} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Building Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Falaknaz, Al Wasl R Block"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* Area Cluster with Custom Adding */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-300 font-semibold">Area Cluster *</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isCustomArea) {
                        setIsCustomArea(true);
                        setCustomArea('');
                      } else {
                        setIsCustomArea(false);
                      }
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {isCustomArea ? '← Select from list' : '+ Type Custom Area'}
                  </button>
                </div>

                {!isCustomArea ? (
                  <div className="space-y-1.5">
                    <select
                      value={area}
                      onChange={(e) => {
                        if (e.target.value === '__NEW_CUSTOM__') {
                          setIsCustomArea(true);
                          setCustomArea('');
                        } else {
                          setArea(e.target.value);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 font-medium"
                    >
                      {allClusters.map((cluster) => (
                        <option key={cluster} value={cluster}>
                          {cluster}
                        </option>
                      ))}
                      <option value="__NEW_CUSTOM__" className="text-amber-400 font-bold">
                        ➕ + Type / Add New Area Cluster...
                      </option>
                    </select>
                    <p className="text-[10px] text-slate-400">
                      Choose from existing clusters, or click <span className="text-amber-400 font-semibold cursor-pointer underline" onClick={() => setIsCustomArea(true)}>+ Type Custom Area</span> to add anything.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 p-3 bg-slate-900/90 border border-amber-500/40 rounded-xl">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Enter Custom Area Cluster:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCustomArea(false)}
                        className="text-slate-400 hover:text-white transition-colors text-[10px] underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <input
                      type="text"
                      autoFocus
                      required={isCustomArea}
                      value={customArea}
                      onChange={(e) => setCustomArea(e.target.value)}
                      placeholder="e.g. Al Satwa, Deira, Al Hudaiba, Business Bay..."
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-500/60 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
                    />

                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                      <span>✓</span> This cluster will be permanently saved and available in the list for all buildings.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Address / Landmark</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Near ADCB Metro Station, Karama"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Door Access Passcode (if any)</label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="e.g. 4695#"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-colors cursor-pointer"
                >
                  {editingBuilding ? 'Update Building' : 'Save Building'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Custom Clusters Modal */}
      {isManageClustersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Custom Area Clusters</h3>
              <button
                onClick={() => setIsManageClustersOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Manage your custom added delivery clusters. Removing a cluster removes it from future dropdown suggestions.
            </p>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {customClusters.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No custom clusters added yet.</p>
              ) : (
                customClusters.map((cluster) => (
                  <div
                    key={cluster}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <span className="font-medium truncate mr-2">{cluster}</span>
                    <button
                      onClick={() => handleDeleteCustomCluster(cluster)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                      title="Remove from custom list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsManageClustersOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Empty Buildings Confirmation Modal */}
      {isDeleteEmptyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151c2c] border border-rose-500/50 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Empty Buildings</h3>
                <p className="text-xs text-slate-400 mt-0.5">Remove buildings with 0 residing customers</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Buildings:</span>
                <span className="font-mono font-bold text-white">{buildings.length}</span>
              </div>
              <div className="flex justify-between items-center text-rose-400 font-bold">
                <span>Empty Buildings to Delete:</span>
                <span className="font-mono">{emptyBuildings.length}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>Buildings to Keep (With Residents):</span>
                <span className="font-mono">{occupiedBuildings.length}</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                All {occupiedBuildings.length} buildings with active residents will remain 100% safe and untouched.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteEmptyModalOpen(false)}
                disabled={isDeletingEmpty}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!onDeleteEmptyBuildings) return;
                  setIsDeletingEmpty(true);
                  try {
                    await onDeleteEmptyBuildings();
                    setIsDeleteEmptyModalOpen(false);
                  } finally {
                    setIsDeletingEmpty(false);
                  }
                }}
                disabled={isDeletingEmpty}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/50 transition-all cursor-pointer flex items-center gap-2"
              >
                {isDeletingEmpty ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete {emptyBuildings.length} Empty Buildings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
