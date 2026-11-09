import React, { useMemo } from 'react';
import { Filter, RotateCcw, Search, SlidersHorizontal, MapPin, Home, Bed, Users } from 'lucide-react';
import { AirbnbListing, PropertyFilters } from '../types';

interface FilterBarProps {
  allListings: AirbnbListing[];
  filters: PropertyFilters;
  onFilterChange: (newFilters: PropertyFilters) => void;
  onResetFilters: () => void;
  matchedCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  allListings,
  filters,
  onFilterChange,
  onResetFilters,
  matchedCount,
}) => {
  // Dynamically extract unique neighborhoods with counts
  const neighborhoodOptions = useMemo(() => {
    const counts = new Map<string, number>();
    allListings.forEach((l) => {
      counts.set(l.neighbourhood, (counts.get(l.neighbourhood) || 0) + 1);
    });
    return Array.from(counts.keys())
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        value: name,
        label: name,
        count: counts.get(name) || 0,
      }));
  }, [allListings]);

  // Dynamically extract unique room types with counts
  const roomTypeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    allListings.forEach((l) => {
      counts.set(l.room_type, (counts.get(l.room_type) || 0) + 1);
    });
    return Array.from(counts.keys())
      .sort()
      .map((name) => ({
        value: name,
        label: name,
        count: counts.get(name) || 0,
      }));
  }, [allListings]);

  // Dynamically extract unique bedroom values with counts
  const bedroomOptions = useMemo(() => {
    const counts = new Map<number, number>();
    allListings.forEach((l) => {
      counts.set(l.bedrooms, (counts.get(l.bedrooms) || 0) + 1);
    });
    return Array.from(counts.keys())
      .sort((a, b) => a - b)
      .map((val) => ({
        value: String(val),
        label: val === 0 ? 'Studio (0 BR)' : val === 1 ? '1 Bedroom' : `${val} Bedrooms`,
        rawVal: val,
        count: counts.get(val) || 0,
      }));
  }, [allListings]);

  const hasActiveFilters =
    filters.neighborhood !== 'ALL' ||
    filters.roomType !== 'ALL' ||
    filters.bedrooms !== 'ALL' ||
    (filters.minAccommodates && filters.minAccommodates > 1) ||
    Boolean(filters.searchQuery);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Property Advisory Filter Criteria
          </h2>
        </div>

        {/* Unboxed metadata count */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-900 tabular-nums">
            {matchedCount.toLocaleString()}
          </span>
          <span>of {allListings.length.toLocaleString()} matching</span>
          <span aria-hidden="true">·</span>
          <span>{allListings.length > 0 ? ((matchedCount / allListings.length) * 100).toFixed(1) : 0}% sample</span>
          {hasActiveFilters && (
            <>
              <span aria-hidden="true">·</span>
              <button
                onClick={onResetFilters}
                className="text-amber-700 hover:text-amber-900 font-medium hover:underline inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Neighborhood Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>DC Neighborhood</span>
          </label>
          <select
            value={filters.neighborhood}
            onChange={(e) => onFilterChange({ ...filters, neighborhood: e.target.value })}
            className="w-full text-xs font-medium bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-colors"
          >
            <option value="ALL">All Neighborhoods ({allListings.length})</option>
            {neighborhoodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.count})
              </option>
            ))}
          </select>
        </div>

        {/* Room Type Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Room Type</span>
          </label>
          <select
            value={filters.roomType}
            onChange={(e) => onFilterChange({ ...filters, roomType: e.target.value })}
            className="w-full text-xs font-medium bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-colors"
          >
            <option value="ALL">All Room Types ({allListings.length})</option>
            {roomTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.count})
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-slate-500" />
            <span>Bedrooms</span>
          </label>
          <select
            value={filters.bedrooms}
            onChange={(e) => onFilterChange({ ...filters, bedrooms: e.target.value })}
            className="w-full text-xs font-medium bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-colors"
          >
            <option value="ALL">Any Bedroom Count ({allListings.length})</option>
            {bedroomOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.count})
              </option>
            ))}
          </select>
        </div>

        {/* Accommodates / Minimum Guests */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Minimum Guests</span>
          </label>
          <select
            value={filters.minAccommodates || 0}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                minAccommodates: parseInt(e.target.value, 10) || 0,
              })
            }
            className="w-full text-xs font-medium bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-colors"
          >
            <option value="0">Any Capacity</option>
            <option value="2">2+ Guests</option>
            <option value="4">4+ Guests</option>
            <option value="6">6+ Guests</option>
            <option value="8">8+ Guests</option>
          </select>
        </div>
      </div>

      {/* Sub-row for search keyword and quick presets */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title keywords (e.g. loft, rowhouse, rooftop)..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-[11px] font-medium text-slate-400">Quick Presets:</span>
          <button
            type="button"
            onClick={() =>
              onFilterChange({
                ...filters,
                neighborhood: 'Georgetown',
                roomType: 'Entire home/apt',
                bedrooms: '2',
              })
            }
            className="px-2 py-1 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            Georgetown 2-BR
          </button>
          <button
            type="button"
            onClick={() =>
              onFilterChange({
                ...filters,
                neighborhood: 'Dupont Circle',
                roomType: 'Entire home/apt',
                bedrooms: '1',
              })
            }
            className="px-2 py-1 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            Dupont 1-BR
          </button>
          <button
            type="button"
            onClick={() =>
              onFilterChange({
                ...filters,
                neighborhood: 'Capitol Hill',
                roomType: 'Entire home/apt',
                bedrooms: 'ALL',
              })
            }
            className="px-2 py-1 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            Capitol Hill All
          </button>
        </div>
      </div>
    </div>
  );
};
