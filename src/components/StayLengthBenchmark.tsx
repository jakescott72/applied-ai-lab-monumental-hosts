import React, { useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  ShieldAlert,
  Info,
  Scale,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { AirbnbListing, StayLengthBenchmarkStats } from '../types';
import { calculateStayLengthBenchmark } from '../utils/math';

interface StayLengthBenchmarkProps {
  listings: AirbnbListing[];
  neighborhoodName: string;
}

export const StayLengthBenchmark: React.FC<StayLengthBenchmarkProps> = ({
  listings,
  neighborhoodName,
}) => {
  const benchmark = useMemo(() => {
    return calculateStayLengthBenchmark(listings, neighborhoodName);
  }, [listings, neighborhoodName]);

  if (!benchmark || benchmark.sampleSize === 0) {
    return null;
  }

  const {
    medianMinimumNights,
    dominantBucket,
    dominantBucketLabel,
    dominantBucketPercentage,
    sampleSize,
    buckets,
    recommendedRule,
    practicalTakeaway,
    formulaFootnote,
  } = benchmark;

  const displayArea =
    neighborhoodName === 'ALL' || !neighborhoodName
      ? 'District-Wide Market'
      : `${neighborhoodName} Market`;

  return (
    <div id="stay-length" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Stay Length Benchmark
            </h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-700">
              {displayArea}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Empirical peer listing minimum stay requirements to guide turnover frequency and local policy compliance.
          </p>
        </div>

        {/* Dominant Strategy Label */}
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-lg self-start sm:self-auto font-medium">
          <span className="text-slate-400">Dominant Strategy:</span>
          <span className="font-bold text-slate-900 font-mono">{dominantBucketLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-slate-700">{dominantBucketPercentage}% of market</span>
        </div>
      </div>

      {/* Recommended Minimum Stay Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Prominent Recommendation Card */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-amber-400 font-bold mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Stay Policy</span>
            </div>
            <div className="mt-2 text-3xl font-extrabold tracking-tight text-white font-mono tabular-nums">
              {recommendedRule}
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Based on the median minimum nights rule across {sampleSize} active peer listings in {displayArea}.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Median Rule: {medianMinimumNights} night{medianMinimumNights === 1 ? '' : 's'}</span>
            <span className="font-mono text-amber-300">{dominantBucketPercentage}% {dominantBucket} share</span>
          </div>
        </div>

        {/* Three Standard Market Buckets Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Bucket 1: Short Stays */}
          <div
            className={`border rounded-xl p-4 flex flex-col justify-between transition-colors ${
              dominantBucket === 'short'
                ? 'bg-amber-50/40 border-amber-300/80 shadow-xs ring-1 ring-amber-400/30'
                : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-900">Short Stays</span>
                {dominantBucket === 'short' && (
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                    Dominant
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mb-2">1–3 Nights</div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {buckets.short.percentage}%
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-mono">
              <span>{buckets.short.count} of {sampleSize}</span>
              <span className="text-slate-400">Weekend/ADR</span>
            </div>
          </div>

          {/* Bucket 2: Medium Stays */}
          <div
            className={`border rounded-xl p-4 flex flex-col justify-between transition-colors ${
              dominantBucket === 'medium'
                ? 'bg-amber-50/40 border-amber-300/80 shadow-xs ring-1 ring-amber-400/30'
                : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-900">Medium Stays</span>
                {dominantBucket === 'medium' && (
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                    Dominant
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mb-2">4–29 Nights</div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {buckets.medium.percentage}%
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-mono">
              <span>{buckets.medium.count} of {sampleSize}</span>
              <span className="text-slate-400">Weekly/Diplomatic</span>
            </div>
          </div>

          {/* Bucket 3: Extended / Corporate Stays */}
          <div
            className={`border rounded-xl p-4 flex flex-col justify-between transition-colors ${
              dominantBucket === 'extended'
                ? 'bg-amber-50/40 border-amber-300/80 shadow-xs ring-1 ring-amber-400/30'
                : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-900">Extended Stays</span>
                {dominantBucket === 'extended' && (
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                    Dominant
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mb-2">30+ Nights</div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {buckets.extended.percentage}%
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-mono">
              <span>{buckets.extended.count} of {sampleSize}</span>
              <span className="text-slate-400">STR Cap Exempt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Breakdown Bar */}
      <div>
        <div className="flex justify-between items-center text-xs text-slate-600 mb-2 font-mono">
          <span>Peer Minimum Stay Distribution</span>
          <span className="text-slate-400 text-[11px]">
            1–3 nights ({buckets.short.percentage}%) · 4–29 nights ({buckets.medium.percentage}%) · 30+ nights ({buckets.extended.percentage}%)
          </span>
        </div>

        {/* 3-Part Stacked Distribution Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          {/* Short Stays */}
          <div
            style={{ width: `${Math.max(buckets.short.percentage > 0 ? 3 : 0, buckets.short.percentage)}%` }}
            className="bg-slate-900 hover:bg-slate-800 transition-all relative group cursor-pointer"
            title={`Short Stays (1–3 nights): ${buckets.short.percentage}% (${buckets.short.count} listings)`}
          />

          {/* Medium Stays */}
          <div
            style={{ width: `${Math.max(buckets.medium.percentage > 0 ? 3 : 0, buckets.medium.percentage)}%` }}
            className="bg-slate-500 hover:bg-slate-600 transition-all relative group cursor-pointer"
            title={`Medium Stays (4–29 nights): ${buckets.medium.percentage}% (${buckets.medium.count} listings)`}
          />

          {/* Extended Stays */}
          <div
            style={{ width: `${Math.max(buckets.extended.percentage > 0 ? 3 : 0, buckets.extended.percentage)}%` }}
            className="bg-amber-500 hover:bg-amber-600 transition-all relative group cursor-pointer"
            title={`Extended Stays (30+ nights): ${buckets.extended.percentage}% (${buckets.extended.count} listings)`}
          />
        </div>

        {/* Legend */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 inline-block" />
            <span>Short (1–3 nights): <strong className="text-slate-800 font-mono">{buckets.short.percentage}%</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-500 inline-block" />
            <span>Medium (4–29 nights): <strong className="text-slate-800 font-mono">{buckets.medium.percentage}%</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
            <span>Extended (30+ nights): <strong className="text-slate-800 font-mono">{buckets.extended.percentage}%</strong></span>
          </div>
        </div>
      </div>

      {/* Practical Strategic Takeaway */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5 flex items-start gap-3">
        <Scale className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Advisory Strategy & Operational Trade-Offs
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            {practicalTakeaway}
          </p>
        </div>
      </div>

      {/* Plain-text Data Footnote */}
      <div className="pt-2 text-[11px] text-slate-500 font-mono border-t border-slate-100 leading-normal">
        <span className="font-semibold text-slate-700 not-mono">Data Footnote: </span>
        {formulaFootnote}
      </div>
    </div>
  );
};
