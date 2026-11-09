import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Calculator,
  Info,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PricingSummaryStats } from '../types';

interface PricingSummaryProps {
  stats: PricingSummaryStats | null;
  onOpenAudit: () => void;
  filterDescription: string;
}

export const PricingSummary: React.FC<PricingSummaryProps> = ({
  stats,
  onOpenAudit,
  filterDescription,
}) => {
  if (!stats || stats.sampleSize === 0) {
    return (
      <div
        id="pricing-benchmarks"
        className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-500 mb-3">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Matching Listings Found</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
          No listings match your selected filter criteria ({filterDescription}). Try broadening the neighborhood, room type, or bedroom filters above.
        </p>
      </div>
    );
  }

  // Calculate position percentages for visual distribution bar
  const minVal = stats.min;
  const maxVal = stats.max;
  const range = maxVal - minVal || 1;
  const p25Pos = Math.min(100, Math.max(0, ((stats.p25 - minVal) / range) * 100));
  const medianPos = Math.min(100, Math.max(0, ((stats.median - minVal) / range) * 100));
  const p75Pos = Math.min(100, Math.max(0, ((stats.p75 - minVal) / range) * 100));

  return (
    <div id="pricing-benchmarks" className="space-y-6">
      {/* Header bar with audit action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Market Pricing Benchmarks
            </h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-500">
              {filterDescription}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Computed in real time from strictly filtered Inside Airbnb DC records. Zero synthetic estimates.
          </p>
        </div>

        <button
          onClick={onOpenAudit}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Calculator className="w-3.5 h-3.5 text-slate-500" />
          <span>Audit Math & Sorted Array</span>
        </button>
      </div>

      {/* The 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Median Price */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">Median Nightly Rate</span>
              <span className="text-[11px] font-mono text-slate-400">50th %ile</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                ${Math.round(stats.median)}
              </span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>
            <div className="mt-1 text-xs text-slate-600 font-mono">
              Exact: ${stats.median.toFixed(2)}
            </div>
          </div>

          {/* Mathematical Footnote */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 leading-snug font-mono">
              <span className="font-semibold text-slate-700 not-mono block mb-0.5">Formula & Count:</span>
              {stats.formulaDetails.medianFormula}
            </p>
          </div>
        </div>

        {/* 2. 25th Percentile (Q1) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">25th Percentile (Q1)</span>
              <span className="text-[11px] font-mono text-slate-400">Lower Quartile</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                ${Math.round(stats.p25)}
              </span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>
            <div className="mt-1 text-xs text-slate-600 font-mono">
              Exact: ${stats.p25.toFixed(2)}
            </div>
          </div>

          {/* Mathematical Footnote */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 leading-snug font-mono">
              <span className="font-semibold text-slate-700 not-mono block mb-0.5">Formula & Count:</span>
              {stats.formulaDetails.p25Formula}
            </p>
          </div>
        </div>

        {/* 3. 75th Percentile (Q3) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">75th Percentile (Q3)</span>
              <span className="text-[11px] font-mono text-slate-400">Upper Quartile</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                ${Math.round(stats.p75)}
              </span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>
            <div className="mt-1 text-xs text-slate-600 font-mono">
              Exact: ${stats.p75.toFixed(2)}
            </div>
          </div>

          {/* Mathematical Footnote */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 leading-snug font-mono">
              <span className="font-semibold text-slate-700 not-mono block mb-0.5">Formula & Count:</span>
              {stats.formulaDetails.p75Formula}
            </p>
          </div>
        </div>

        {/* 4. Sample Size (n) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">Sample Size</span>
              <span className="text-[11px] font-mono text-slate-400">Matched n</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {stats.sampleSize.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">comps</span>
            </div>
            <div className="mt-1 text-xs text-slate-600">
              IQR Spread: <span className="font-mono font-medium">${stats.iqr.toFixed(2)}</span>
            </div>
          </div>

          {/* Mathematical Footnote */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 leading-snug font-mono">
              <span className="font-semibold text-slate-700 not-mono block mb-0.5">Formula & Count:</span>
              {stats.formulaDetails.sampleSizeFormula}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Price Distribution & Advisory Guidance Band */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold tracking-tight text-white">
                Advisory Yield Strategy & Pricing Brackets
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-300 max-w-xl">
              Property management recommendation derived mathematically from the interquartile range (IQR).
            </p>
          </div>

          {/* Quick secondary metrics */}
          <div className="flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-sans">Min</span>
              <span className="text-slate-200 tabular-nums">${stats.min.toFixed(0)}</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-sans">Mean (Avg)</span>
              <span className="text-slate-200 tabular-nums">${stats.mean.toFixed(2)}</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-sans">Max</span>
              <span className="text-slate-200 tabular-nums">${stats.max.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Visual Distribution Range Bar */}
        <div className="mt-6 pt-2">
          <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>Observed Low: ${stats.min.toFixed(0)}</span>
            <span className="text-amber-300 font-sans font-medium text-[11px]">
              Interquartile Core Market: ${stats.p25.toFixed(0)} — ${stats.p75.toFixed(0)}
            </span>
            <span>Observed High: ${stats.max.toFixed(0)}</span>
          </div>

          {/* Track Bar */}
          <div className="relative h-4 bg-slate-800 rounded-full overflow-visible">
            {/* 25% to 75% IQR Highlight */}
            <div
              className="absolute top-0 bottom-0 bg-amber-500/30 border-x border-amber-400/80 rounded"
              style={{
                left: `${p25Pos}%`,
                width: `${Math.max(2, p75Pos - p25Pos)}%`,
              }}
            />

            {/* Q1 Pin */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-300 border-2 border-slate-900"
              style={{ left: `${p25Pos}%` }}
              title={`Q1: $${stats.p25.toFixed(2)}`}
            />

            {/* Median Pin */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-900 shadow-sm"
              style={{ left: `${medianPos}%` }}
              title={`Median: $${stats.median.toFixed(2)}`}
            />

            {/* Q3 Pin */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-300 border-2 border-slate-900"
              style={{ left: `${p75Pos}%` }}
              title={`Q3: $${stats.p75.toFixed(2)}`}
            />
          </div>

          <div className="relative mt-2 h-6 text-[11px] font-mono text-slate-400">
            <span
              className="absolute -translate-x-1/2 text-slate-300"
              style={{ left: `${p25Pos}%` }}
            >
              Q1: ${Math.round(stats.p25)}
            </span>
            <span
              className="absolute -translate-x-1/2 text-amber-300 font-bold"
              style={{ left: `${medianPos}%` }}
            >
              Med: ${Math.round(stats.median)}
            </span>
            <span
              className="absolute -translate-x-1/2 text-slate-300"
              style={{ left: `${p75Pos}%` }}
            >
              Q3: ${Math.round(stats.p75)}
            </span>
          </div>
        </div>

        {/* 3 Practical Host Advice Tiers */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 rounded-lg p-3.5 border border-slate-700/50">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              High-Occupancy / Low-Friction
            </div>
            <div className="mt-1 text-base font-bold text-white font-mono tabular-nums">
              ${Math.round(stats.p25)}
              <span className="text-xs text-slate-400 font-sans font-normal"> / night</span>
            </div>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Recommended for newly listed DC properties, off-peak months, or hosts prioritizing &gt;85% occupancy rate over peak ADR.
            </p>
          </div>

          <div className="bg-amber-950/40 rounded-lg p-3.5 border border-amber-600/40">
            <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
              Market Equilibrium (Median)
            </div>
            <div className="mt-1 text-base font-bold text-amber-300 font-mono tabular-nums">
              ${Math.round(stats.median)}
              <span className="text-xs text-slate-400 font-sans font-normal"> / night</span>
            </div>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Exact middle-market benchmark for established listings with typical DC guest amenities and solid 4.8+ ratings.
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-lg p-3.5 border border-slate-700/50">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Premium / Peak Demand
            </div>
            <div className="mt-1 text-base font-bold text-white font-mono tabular-nums">
              ${Math.round(stats.p75)}
              <span className="text-xs text-slate-400 font-sans font-normal"> / night</span>
            </div>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              For properties with designated parking, historic architecture, private outdoor patios, or peak cherry blossom/congressional weeks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
