import React from 'react';
import { X, Printer, Download, Building2, ShieldCheck, Check, Calendar, Moon } from 'lucide-react';
import { AirbnbListing, PricingSummaryStats, PropertyFilters } from '../types';
import { calculateAnnualRevenue, calculateStayLengthBenchmark } from '../utils/math';

interface AdvisoryReportModalProps {
  stats: PricingSummaryStats;
  filters: PropertyFilters;
  topComps: AirbnbListing[];
  onClose: () => void;
}

export const AdvisoryReportModal: React.FC<AdvisoryReportModalProps> = ({
  stats,
  filters,
  topComps,
  onClose,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const neighborhoodLabel = filters.neighborhood === 'ALL' ? 'District-Wide (All Neighborhoods)' : filters.neighborhood;
  const roomTypeLabel = filters.roomType === 'ALL' ? 'All Room Types' : filters.roomType;
  const bedroomLabel =
    filters.bedrooms === 'ALL'
      ? 'All Bedrooms'
      : filters.bedrooms === '0'
      ? 'Studio'
      : `${filters.bedrooms} Bedroom${parseInt(filters.bedrooms, 10) > 1 ? 's' : ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 print:max-w-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Top Bar (hidden on print) */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-900" />
            <h3 className="text-base font-bold text-slate-900">
              Host Advisory Brief — Ready to Print / Present
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Advisory Document */}
        <div className="p-8 sm:p-10 space-y-8 bg-white print:p-0">
          {/* Document Header */}
          <div className="flex justify-between items-start border-b border-slate-900 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-base">
                  MH
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Monumental Hosts
                  </h1>
                  <p className="text-xs text-slate-500">
                    Washington D.C. Short-Term Rental Asset Management
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-600 font-mono">
              <div className="font-semibold text-slate-900 font-sans">Client Pricing Advisory Report</div>
              <div className="mt-0.5 flex items-center justify-end gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5 inline" />
                <span>{currentDate}</span>
              </div>
              <div className="mt-0.5 text-[11px] text-slate-400">Data Source: Inside Airbnb D.C. Verified</div>
            </div>
          </div>

          {/* Property Profile Target */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Target Property Criteria
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">DC Neighborhood</span>
                <span className="font-bold text-slate-900 text-sm">{neighborhoodLabel}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Room Type</span>
                <span className="font-bold text-slate-900 text-sm">{roomTypeLabel}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Bedrooms</span>
                <span className="font-bold text-slate-900 text-sm">{bedroomLabel}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Matched Comps Sample</span>
                <span className="font-bold text-slate-900 text-sm font-mono">{stats.sampleSize} listings</span>
              </div>
            </div>
          </div>

          {/* Pricing Benchmarks & Transparency Notes */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3 tracking-tight">
              Verified Market Pricing Benchmarks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 25th Percentile */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="text-xs text-slate-500 font-medium">25th Percentile (Q1)</div>
                <div className="mt-1 text-2xl font-bold text-slate-900 font-mono">
                  ${stats.p25.toFixed(2)}
                  <span className="text-xs text-slate-500 font-sans font-normal"> / night</span>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500 font-mono leading-tight">
                  <span className="font-bold text-slate-700 not-mono block">Exact Formula:</span>
                  {stats.formulaDetails.p25Formula}
                </div>
              </div>

              {/* Median */}
              <div className="border-2 border-slate-900 rounded-xl p-4 bg-white shadow-xs">
                <div className="text-xs text-slate-700 font-bold">Median Nightly Rate (50th %ile)</div>
                <div className="mt-1 text-2xl font-bold text-slate-900 font-mono">
                  ${stats.median.toFixed(2)}
                  <span className="text-xs text-slate-500 font-sans font-normal"> / night</span>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500 font-mono leading-tight">
                  <span className="font-bold text-slate-700 not-mono block">Exact Formula:</span>
                  {stats.formulaDetails.medianFormula}
                </div>
              </div>

              {/* 75th Percentile */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="text-xs text-slate-500 font-medium">75th Percentile (Q3)</div>
                <div className="mt-1 text-2xl font-bold text-slate-900 font-mono">
                  ${stats.p75.toFixed(2)}
                  <span className="text-xs text-slate-500 font-sans font-normal"> / night</span>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500 font-mono leading-tight">
                  <span className="font-bold text-slate-700 not-mono block">Exact Formula:</span>
                  {stats.formulaDetails.p75Formula}
                </div>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-slate-500 font-mono">
              Note on Sample Size: {stats.formulaDetails.sampleSizeFormula} (Interquartile Range IQR: ${stats.iqr.toFixed(2)})
            </div>
          </div>

          {/* Pricing Advisory Recommendations */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Management Rate Advisory Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="font-bold text-slate-900">Base Low Season / High Occupancy</div>
                <div className="mt-0.5 text-base font-bold text-slate-800 font-mono">
                  ${Math.round(stats.p25)} / night
                </div>
                <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">
                  Anchor strategy to achieve 85%+ booking velocity, capture early booking window travelers, and build review velocity.
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-900">Market Equilibrium Target</div>
                <div className="mt-0.5 text-base font-bold text-slate-900 font-mono">
                  ${Math.round(stats.median)} / night
                </div>
                <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">
                  Recommended standard baseline rate during average D.C. tourism and business travel demand months.
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-900">Peak Demand / Event Rate</div>
                <div className="mt-0.5 text-base font-bold text-slate-800 font-mono">
                  ${Math.round(stats.p75)} / night
                </div>
                <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">
                  Surge rate applied during Congressional sessions, Cherry Blossom Festival (March-April), and major D.C. conventions.
                </p>
              </div>
            </div>
          </div>

          {/* Annual Revenue & Take-Home Projection */}
          {(() => {
            const annualRev = calculateAnnualRevenue(topComps, stats.median, 20);
            if (!annualRev) return null;
            return (
              <div className="border border-slate-200 rounded-xl p-5 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Annual Revenue & Take-Home Projection
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    Based on a median of {annualRev.estimatedBookedNights} booked nights/year at ${Math.round(stats.median)}/night
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Projected Gross Revenue</span>
                    <span className="text-xl font-bold text-slate-900 font-mono">
                      ${annualRev.grossAnnualRevenue.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      {annualRev.estimatedBookedNights} nights × ${stats.median.toFixed(0)}/night
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Management Fee (20%)</span>
                    <span className="text-xl font-bold text-amber-700 font-mono">
                      -${annualRev.managementFeeAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      Deduction for full operations & yield management
                    </span>
                  </div>

                  <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-300">
                    <span className="text-emerald-900 block text-[11px] font-bold">Net Owner Payout</span>
                    <span className="text-xl font-bold text-emerald-950 font-mono">
                      ${annualRev.netOwnerTakeHome.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-700 block mt-0.5 font-mono">
                      ~${Math.round(annualRev.netOwnerTakeHome / 12).toLocaleString()} / month net
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-[10px] text-slate-500 font-mono border-t border-slate-100 pt-2 leading-relaxed">
                  Formula & Transparency: {annualRev.formulaDetails.bookedNightsFormula}
                </div>
              </div>
            );
          })()}

          {/* Stay Length Policy Benchmark */}
          {(() => {
            const stayBenchmark = calculateStayLengthBenchmark(topComps, filters.neighborhood);
            if (!stayBenchmark) return null;
            return (
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Stay Length & Minimum Nights Strategy
                  </h3>
                  <span className="text-[11px] font-bold text-slate-900 font-mono">
                    {stayBenchmark.recommendedRule}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Short (1–3 Nights)</span>
                    <span className="font-bold text-slate-900 font-mono">{stayBenchmark.buckets.short.percentage}%</span>
                    <span className="text-[10px] text-slate-400 block">{stayBenchmark.buckets.short.count} listings</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Medium (4–29 Nights)</span>
                    <span className="font-bold text-slate-900 font-mono">{stayBenchmark.buckets.medium.percentage}%</span>
                    <span className="text-[10px] text-slate-400 block">{stayBenchmark.buckets.medium.count} listings</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Extended (30+ Nights)</span>
                    <span className="font-bold text-slate-900 font-mono">{stayBenchmark.buckets.extended.percentage}%</span>
                    <span className="text-[10px] text-slate-400 block">{stayBenchmark.buckets.extended.count} listings</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  {stayBenchmark.practicalTakeaway}
                </p>
              </div>
            );
          })()}

          {/* Comps Summary Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Benchmark Competitive Set (Top Matching Comps)
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 inline" />
                <span>Host Personal Info Strictly Excluded</span>
              </span>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-[10px] font-semibold text-slate-600 uppercase">
                <tr>
                  <th className="py-2 px-3">Listing</th>
                  <th className="py-2 px-3">Neighborhood</th>
                  <th className="py-2 px-3 text-right">Price</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3 text-center">Capacity</th>
                  <th className="py-2 px-3 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topComps.slice(0, 10).map((comp, idx) => (
                  <tr key={comp.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-medium text-slate-900 max-w-[200px] truncate">
                      {comp.name}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{comp.neighbourhood}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ${comp.price.toFixed(0)}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{comp.room_type}</td>
                    <td className="py-2 px-3 text-center font-mono">{comp.accommodates} guests</td>
                    <td className="py-2 px-3 text-right font-mono">
                      {comp.review_scores_rating ? `${comp.review_scores_rating.toFixed(2)} ★` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Sign-off */}
          <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-800">Monumental Hosts LLC</p>
              <p className="text-[11px] text-slate-400">1050 Connecticut Avenue NW, Washington, D.C. 20036</p>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              Verified mathematical analysis · No simulated estimates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
