import React from 'react';
import { X, CheckCircle, Calculator, Hash, ListFilter, ArrowRight } from 'lucide-react';
import { PricingSummaryStats } from '../types';

interface TransparencyAuditModalProps {
  stats: PricingSummaryStats;
  filterDescription: string;
  onClose: () => void;
}

export const TransparencyAuditModal: React.FC<TransparencyAuditModalProps> = ({
  stats,
  filterDescription,
  onClose,
}) => {
  const n = stats.sampleSize;
  const rawValues = stats.rawValues;

  // Compute rank for Q1 and Q3
  const rankQ1 = 1 + 0.25 * (n - 1);
  const floorQ1 = Math.floor(rankQ1);
  const fracQ1 = rankQ1 - floorQ1;

  const rankQ3 = 1 + 0.75 * (n - 1);
  const floorQ3 = Math.floor(rankQ3);
  const fracQ3 = rankQ3 - floorQ3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-slate-900" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Mathematical Transparency & Verification Audit
              </h3>
              <p className="text-xs text-slate-500">
                Filter predicate: {filterDescription} (Exact n = {n} rows)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          {/* Audit Summary Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Zero-Hallucination Mathematical Guarantee</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Every percentile and pricing advisory figure presented to the host is computed deterministically from the parsed Inside Airbnb rows. Below is the step-by-step mathematical proof and complete sorted price array.
            </p>
          </div>

          {/* 1. Sorted Price Vector Array */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-500" />
                <span>1. Verified Sorted Price Array ($P_1 \dots P_{n}$)</span>
              </h4>
              <span className="font-mono text-slate-500 text-[11px]">
                {n} observation{n === 1 ? '' : 's'} sorted ascending
              </span>
            </div>
            <div className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] max-h-36 overflow-y-auto leading-relaxed border border-slate-800">
              {rawValues.map((val, idx) => (
                <span
                  key={idx}
                  className={`inline-block mr-2 ${
                    idx === Math.floor(n / 2) || (n % 2 === 0 && idx === n / 2 - 1)
                      ? 'text-amber-400 font-bold underline'
                      : idx === floorQ1 - 1
                      ? 'text-blue-300 font-semibold'
                      : idx === floorQ3 - 1
                      ? 'text-purple-300 font-semibold'
                      : 'text-slate-300'
                  }`}
                  title={`Index [${idx + 1}]: $${val.toFixed(2)}`}
                >
                  [{idx + 1}]: ${val.toFixed(0)}
                  {idx < rawValues.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>
            <div className="mt-1.5 flex items-center gap-4 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                <span>Q1 boundary</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span>Median position</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
                <span>Q3 boundary</span>
              </span>
            </div>
          </div>

          {/* 2. Step-by-Step Median Derivation */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              2. Median Rate Calculation
            </h4>
            <div className="bg-slate-50 p-3 rounded-lg font-mono text-xs text-slate-800 space-y-1">
              <div>Sample Size (n) = {n} ({n % 2 === 1 ? 'Odd' : 'Even'})</div>
              {n % 2 === 1 ? (
                <>
                  <div>Index Formula = (n + 1) / 2 = ({n} + 1) / 2 = {(n + 1) / 2}</div>
                  <div>Exact Value = Sorted[{(n + 1) / 2}] = <span className="font-bold text-amber-700">${stats.median.toFixed(2)}</span></div>
                </>
              ) : (
                <>
                  <div>Indices Formula = n/2 and n/2 + 1 = {n / 2} and {n / 2 + 1}</div>
                  <div>Lower Value Sorted[{n / 2}] = ${rawValues[n / 2 - 1]?.toFixed(2)}</div>
                  <div>Upper Value Sorted[{n / 2 + 1}] = ${rawValues[n / 2]?.toFixed(2)}</div>
                  <div>Mean = (${rawValues[n / 2 - 1]?.toFixed(2)} + ${rawValues[n / 2]?.toFixed(2)}) / 2 = <span className="font-bold text-amber-700">${stats.median.toFixed(2)}</span></div>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              {stats.formulaDetails.medianFormula}
            </p>
          </div>

          {/* 3. Step-by-Step 25th Percentile (Q1) Derivation */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              3. 25th Percentile (Q1) Derivation (Method R-7 / NIST)
            </h4>
            <div className="bg-slate-50 p-3 rounded-lg font-mono text-xs text-slate-800 space-y-1">
              <div>Rank Formula: r = 1 + 0.25 × (n - 1) = 1 + 0.25 × ({n} - 1) = {rankQ1.toFixed(4)}</div>
              <div>Integer Rank (k) = ⌊{rankQ1.toFixed(4)}⌋ = {floorQ1}</div>
              <div>Fractional Weight (d) = {rankQ1.toFixed(4)} - {floorQ1} = {fracQ1.toFixed(4)}</div>
              <div>Sorted[{floorQ1}] = ${rawValues[floorQ1 - 1]?.toFixed(2)}</div>
              {floorQ1 < n && (
                <div>Sorted[{floorQ1 + 1}] = ${rawValues[floorQ1]?.toFixed(2)}</div>
              )}
              <div className="pt-1 text-slate-900 font-bold">
                Interpolated Q1 = ${rawValues[floorQ1 - 1]?.toFixed(2)} + {fracQ1.toFixed(4)} × (${rawValues[floorQ1]?.toFixed(2)} - ${rawValues[floorQ1 - 1]?.toFixed(2)}) = <span className="text-blue-700">${stats.p25.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              {stats.formulaDetails.p25Formula}
            </p>
          </div>

          {/* 4. Step-by-Step 75th Percentile (Q3) Derivation */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              4. 75th Percentile (Q3) Derivation (Method R-7 / NIST)
            </h4>
            <div className="bg-slate-50 p-3 rounded-lg font-mono text-xs text-slate-800 space-y-1">
              <div>Rank Formula: r = 1 + 0.75 × (n - 1) = 1 + 0.75 × ({n} - 1) = {rankQ3.toFixed(4)}</div>
              <div>Integer Rank (k) = ⌊{rankQ3.toFixed(4)}⌋ = {floorQ3}</div>
              <div>Fractional Weight (d) = {rankQ3.toFixed(4)} - {floorQ3} = {fracQ3.toFixed(4)}</div>
              <div>Sorted[{floorQ3}] = ${rawValues[floorQ3 - 1]?.toFixed(2)}</div>
              {floorQ3 < n && (
                <div>Sorted[{floorQ3 + 1}] = ${rawValues[floorQ3]?.toFixed(2)}</div>
              )}
              <div className="pt-1 text-slate-900 font-bold">
                Interpolated Q3 = ${rawValues[floorQ3 - 1]?.toFixed(2)} + {fracQ3.toFixed(4)} × (${rawValues[floorQ3]?.toFixed(2)} - ${rawValues[floorQ3 - 1]?.toFixed(2)}) = <span className="text-purple-700">${stats.p75.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              {stats.formulaDetails.p75Formula}
            </p>
          </div>

          {/* 5. Interquartile Range (IQR) & Spread */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900 block">Interquartile Range (IQR)</span>
              <span className="text-[11px] text-slate-500">Spread of middle 50% market: Q3 - Q1</span>
            </div>
            <div className="text-right font-mono">
              <span className="text-base font-bold text-slate-900">
                ${stats.iqr.toFixed(2)}
              </span>
              <span className="text-slate-400 block text-[10px]">
                (${stats.p75.toFixed(0)} - ${stats.p25.toFixed(0)})
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
