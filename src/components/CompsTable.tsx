import React, { useState } from 'react';
import {
  Star,
  Users,
  Bed,
  Moon,
  ArrowUpDown,
  ShieldCheck,
  Building,
  Info,
  Check,
  FileDown,
  Eye,
} from 'lucide-react';
import { AirbnbListing } from '../types';

interface CompsTableProps {
  listings: AirbnbListing[];
  medianPrice: number;
}

export const CompsTable: React.FC<CompsTableProps> = ({ listings, medianPrice }) => {
  const [sortField, setSortField] = useState<'price' | 'rating' | 'accommodates' | 'reviews'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAllRows, setShowAllRows] = useState(false);
  const [selectedComp, setSelectedComp] = useState<AirbnbListing | null>(null);

  const handleSort = (field: 'price' | 'rating' | 'accommodates' | 'reviews') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'price' ? 'asc' : 'desc');
    }
  };

  const sortedListings = [...listings].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'price') {
      comparison = a.price - b.price;
    } else if (sortField === 'rating') {
      comparison = (b.review_scores_rating || 0) - (a.review_scores_rating || 0);
    } else if (sortField === 'accommodates') {
      comparison = a.accommodates - b.accommodates;
    } else if (sortField === 'reviews') {
      comparison = a.number_of_reviews - b.number_of_reviews;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Default is Top 10 matching comps as specified in requirement 5
  const displayedListings = showAllRows ? sortedListings : sortedListings.slice(0, 10);

  const exportCompsCsv = () => {
    const headers = [
      'Listing ID',
      'Title',
      'Neighborhood',
      'Space Type',
      'Property Style',
      'Bedrooms',
      'Bathrooms',
      'Accommodates',
      'Nightly Price USD',
      'Review Rating',
      'Review Count',
      'Minimum Nights',
    ];

    const rows = sortedListings.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.neighbourhood}"`,
      `"${l.room_type}"`,
      `"${l.property_type || 'Standard'}"`,
      l.bedrooms,
      l.bathrooms ?? 1,
      l.accommodates,
      l.price.toFixed(2),
      l.review_scores_rating ?? 'N/A',
      l.number_of_reviews,
      l.minimum_nights,
    ]);

    const csvText = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'monumental_hosts_comps_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="market-comps" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Competitive Market Comps
            </h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-700">
              {showAllRows ? `All ${listings.length} Matched Listings` : 'Top 10 Benchmark Comps'}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span>Direct Inside Airbnb DC Observations</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>Host identity sanitized</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {listings.length > 10 && (
            <button
              onClick={() => setShowAllRows(!showAllRows)}
              type="button"
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              {showAllRows ? 'Show Top 10 Only' : `View All ${listings.length} Comps`}
            </button>
          )}

          <button
            onClick={exportCompsCsv}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Comps CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      {displayedListings.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          No matching listings found for this filter combination.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-3 text-slate-500 font-mono">Rank</th>
                <th className="py-3 px-3">Listing Title & Area</th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Nightly Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Space & Style</th>
                <th
                  onClick={() => handleSort('accommodates')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>Accommodates</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Bed / Bath</th>
                <th
                  onClick={() => handleSort('rating')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>Review Rating</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Min Nights</th>
                <th className="py-3 px-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {displayedListings.map((comp, idx) => {
                const diffFromMedian = medianPrice > 0 ? comp.price - medianPrice : 0;
                const isSelected = selectedComp?.id === comp.id;

                return (
                  <tr
                    key={comp.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    {/* Rank index */}
                    <td className="py-3.5 px-3 font-mono text-slate-400 tabular-nums">
                      #{idx + 1}
                    </td>

                    {/* Listing Title & Neighborhood */}
                    <td className="py-3.5 px-3 min-w-[200px] max-w-xs">
                      <div className="font-semibold text-slate-900 truncate" title={comp.name}>
                        {comp.name}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500 flex items-center gap-1">
                        <span>{comp.neighbourhood}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-400">ID: {comp.id}</span>
                      </div>
                    </td>

                    {/* Price with tabular numerals */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="font-bold text-slate-900 font-mono text-sm tabular-nums">
                        ${comp.price.toFixed(0)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {diffFromMedian > 0 ? (
                          <span className="text-amber-800">
                            +${Math.abs(diffFromMedian).toFixed(0)} vs med
                          </span>
                        ) : diffFromMedian < 0 ? (
                          <span className="text-emerald-800">
                            -${Math.abs(diffFromMedian).toFixed(0)} vs med
                          </span>
                        ) : (
                          <span>at median</span>
                        )}
                      </div>
                    </td>

                    {/* Space Type & Property Style */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-700">
                      <div className="font-medium text-slate-900">{comp.room_type}</div>
                      {comp.property_type && (
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]" title={comp.property_type}>
                          {comp.property_type}
                        </div>
                      )}
                    </td>

                    {/* Accommodates */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-mono tabular-nums text-slate-800">
                      <div className="inline-flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{comp.accommodates} guests</span>
                      </div>
                    </td>

                    {/* Bed / Bath */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap text-slate-600 font-mono">
                      <span>{comp.bedrooms === 0 ? 'Studio' : `${comp.bedrooms} BR`}</span>
                      <span className="text-slate-300 mx-1">/</span>
                      <span>{comp.bathrooms ?? 1} BA</span>
                    </td>

                    {/* Review Rating */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      {comp.review_scores_rating ? (
                        <div>
                          <div className="inline-flex items-center gap-1 font-semibold text-slate-900 font-mono tabular-nums">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                            <span>{comp.review_scores_rating.toFixed(2)}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {comp.number_of_reviews} reviews
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No reviews</span>
                      )}
                    </td>

                    {/* Minimum Nights */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-mono tabular-nums text-slate-600">
                      {comp.minimum_nights} {comp.minimum_nights === 1 ? 'night' : 'nights'}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedComp(isSelected ? null : comp)}
                        type="button"
                        className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        title="View sanitized details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Host Privacy Guarantee Banner */}
      <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Host Privacy Protocol:</strong> Host names, host IDs, profile pictures, and host descriptions are strictly omitted from this competitive benchmark to comply with privacy requirements.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap hidden md:inline">
          Showing {displayedListings.length} of {listings.length} rows
        </span>
      </div>

      {/* Selected Comp Quick Detail Drawer */}
      {selectedComp && (
        <div className="mt-4 p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                Comp Detail Inspector (Sanitized)
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                {selectedComp.name}
              </h4>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                <span>{selectedComp.neighbourhood}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedComp.room_type}</span>
                {selectedComp.property_type && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">{selectedComp.property_type}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{selectedComp.bedrooms === 0 ? 'Studio' : `${selectedComp.bedrooms} Bedrooms`}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedComp.bathrooms ?? 1} Bathrooms</span>
                <span aria-hidden="true">·</span>
                <span>Accommodates {selectedComp.accommodates}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedComp(null)}
              className="text-xs text-slate-500 hover:text-slate-900 font-semibold px-2 py-1 bg-white border border-slate-200 rounded"
            >
              Close
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-amber-200/60">
            <div>
              <span className="text-slate-500 block text-[11px]">Nightly Price</span>
              <span className="font-bold text-slate-900 font-mono text-sm">${selectedComp.price.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Price per Guest</span>
              <span className="font-bold text-slate-900 font-mono text-sm">
                ${(selectedComp.price / Math.max(1, selectedComp.accommodates)).toFixed(2)} / guest
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Rating Score</span>
              <span className="font-bold text-slate-900 font-mono text-sm">
                {selectedComp.review_scores_rating ? `${selectedComp.review_scores_rating.toFixed(2)} ★` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Minimum Stay</span>
              <span className="font-bold text-slate-900 font-mono text-sm">
                {selectedComp.minimum_nights} night{selectedComp.minimum_nights > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
