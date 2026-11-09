import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Calendar,
  Percent,
  Sliders,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { AirbnbListing, PricingSummaryStats } from '../types';
import { calculateAnnualRevenue } from '../utils/math';

interface AnnualRevenueCalculatorProps {
  listings: AirbnbListing[];
  medianPrice: number;
  filterDescription: string;
}

export const AnnualRevenueCalculator: React.FC<AnnualRevenueCalculatorProps> = ({
  listings,
  medianPrice,
  filterDescription,
}) => {
  // Management fee slider state (10% to 30%, default at 20%)
  const [feePercent, setFeePercent] = useState<number>(20);
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  // Compute revenue estimates dynamically based on filtered listings & fee slider
  const revenueEstimate = useMemo(() => {
    return calculateAnnualRevenue(listings, medianPrice, feePercent);
  }, [listings, medianPrice, feePercent]);

  if (!revenueEstimate || medianPrice <= 0) {
    return null;
  }

  const {
    estimatedBookedNights,
    rawMedianBookedNights,
    isCapped,
    occupancyRatePercent,
    grossAnnualRevenue,
    managementFeeAmount,
    netOwnerTakeHome,
    activeListingCount,
    formulaDetails,
  } = revenueEstimate;

  return (
    <div id="annual-revenue" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Annual Revenue & Take-Home Calculator
            </h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-700">
              {filterDescription}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Yield projections based on empirical availability patterns from matched DC Inside Airbnb records.
          </p>
        </div>

        {/* Inline Summary Sentence */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3.5 py-2 text-xs text-slate-700 font-medium">
          Based on a median of{' '}
          <strong className="text-slate-900 font-mono tabular-nums">
            {estimatedBookedNights} booked nights/year
          </strong>{' '}
          at{' '}
          <strong className="text-slate-900 font-mono tabular-nums">
            ${Math.round(medianPrice)}/night
          </strong>
          .
        </div>
      </div>

      {/* Property Management Fee Slider Controls */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label
              htmlFor="fee-slider"
              className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              <span>Property Management Fee Percentage</span>
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              Interactive fee deduction applied to gross bookings (full-service management, guest communication & cleaning turnover).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {feePercent}%
            </span>
            <span className="text-xs text-slate-500 font-sans">management fee</span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="mt-4 space-y-2">
          <input
            id="fee-slider"
            type="range"
            min="10"
            max="30"
            step="1"
            value={feePercent}
            onChange={(e) => setFeePercent(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          />

          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>10% (Co-hosting / Light)</span>
            <span className="font-sans text-slate-700 font-medium">Standard D.C. Baseline: 20%</span>
            <span>30% (Full Turnkey Luxury)</span>
          </div>
        </div>

        {/* Quick fee presets */}
        <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-medium text-slate-400">Quick Fee Presets:</span>
          {[15, 20, 25].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setFeePercent(preset)}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                feePercent === preset
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {preset}% {preset === 20 ? '(Standard)' : preset === 15 ? '(Co-host)' : '(Turnkey)'}
            </button>
          ))}
        </div>
      </div>

      {/* The 3 Core Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Projected Gross Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">Projected Gross Revenue</span>
              <span className="text-[11px] font-mono text-slate-400">Annual Gross</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                ${grossAnnualRevenue.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">/ year</span>
            </div>
            <div className="mt-1 text-xs text-slate-600 flex items-center gap-1.5 flex-wrap">
              <span className="font-mono tabular-nums">{estimatedBookedNights} nights</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">${Math.round(medianPrice)}/night</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-500">{occupancyRatePercent}% occ</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono leading-tight">
            Median rate × estimated booked nights
          </div>
        </div>

        {/* 2. Management Fee Deduction */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">Management Fee Deduction</span>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">{feePercent}% Fee</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-amber-700 font-mono tabular-nums">
                -${managementFeeAmount.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">/ year</span>
            </div>
            <div className="mt-1 text-xs text-slate-600 font-mono tabular-nums">
              {feePercent}% of ${grossAnnualRevenue.toLocaleString()} gross
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono leading-tight">
            Covers guest management, pricing yield & operations
          </div>
        </div>

        {/* 3. Net Owner Payout (Take-Home) */}
        <div className="bg-emerald-50/50 border-2 border-emerald-600/80 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-900 mb-2">
              <span className="font-bold text-emerald-950">Net Owner Payout</span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                {100 - feePercent}% Net
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-emerald-900 font-mono tabular-nums">
                ${netOwnerTakeHome.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-700">/ year</span>
            </div>
            <div className="mt-1 text-xs text-emerald-800 font-mono tabular-nums">
              ~${Math.round(netOwnerTakeHome / 12).toLocaleString()} / month net take-home
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 text-[11px] text-emerald-800 font-mono leading-tight font-medium">
            Gross revenue minus management fee deduction
          </div>
        </div>
      </div>

      {/* Expandable Transparency Footnote & Formula Auditor */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-500" />
            <span>Transparency & Methodology Footnote: Exact Formulas & Occupancy Logic</span>
          </div>
          {showFormulaDetails ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showFormulaDetails && (
          <div className="px-4 pb-4 pt-2 border-t border-slate-200 text-xs text-slate-600 space-y-3 font-mono">
            <div>
              <span className="font-bold text-slate-900 font-sans block mb-0.5">
                1. Booked Nights Estimation Formula:
              </span>
              <p className="text-[11px] leading-relaxed text-slate-700">
                {formulaDetails.bookedNightsFormula}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-900 font-sans block mb-0.5">
                2. Projected Gross Annual Revenue:
              </span>
              <p className="text-[11px] leading-relaxed text-slate-700">
                {formulaDetails.grossRevenueFormula}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-900 font-sans block mb-0.5">
                3. Management Fee Deduction:
              </span>
              <p className="text-[11px] leading-relaxed text-slate-700">
                {formulaDetails.managementFeeFormula}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-900 font-sans block mb-0.5">
                4. Net Owner Take-Home Payout:
              </span>
              <p className="text-[11px] leading-relaxed text-slate-700">
                {formulaDetails.netTakeHomeFormula}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 font-sans leading-normal">
              Note: Unbooked nights are directly observed from the Inside Airbnb availability column (<code className="font-mono text-slate-700">365 - availability_365</code>). Listings with 0 availability and 0 reviews are treated as inactive and excluded from median computation.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
