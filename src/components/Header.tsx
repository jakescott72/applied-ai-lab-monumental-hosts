import React from 'react';
import { Building2, Download, FileSpreadsheet, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onExportReport: () => void;
  onScrollToUpload: () => void;
  onScrollToComps: () => void;
  onScrollToAudit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportReport,
  onScrollToUpload,
  onScrollToComps,
  onScrollToAudit,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <a
              href="#"
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap"
            >
              Monumental Hosts
            </a>
          </div>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a
              href="#pricing-benchmarks"
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Pricing Benchmarks
            </a>
            <a
              href="#annual-revenue"
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Annual Revenue
            </a>
            <a
              href="#stay-length"
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Stay Length
            </a>
            <a
              href="#market-comps"
              onClick={(e) => {
                e.preventDefault();
                onScrollToComps();
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Competitor Comps
            </a>
            <a
              href="#math-audit"
              onClick={(e) => {
                e.preventDefault();
                onScrollToAudit();
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Methodology & Audit
            </a>
            <a
              href="#dataset-upload"
              onClick={(e) => {
                e.preventDefault();
                onScrollToUpload();
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Dataset Management
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onExportReport}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Host Advisory</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
