import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { DatasetUpload } from './components/DatasetUpload';
import { FilterBar } from './components/FilterBar';
import { PricingSummary } from './components/PricingSummary';
import { AnnualRevenueCalculator } from './components/AnnualRevenueCalculator';
import { StayLengthBenchmark } from './components/StayLengthBenchmark';
import { CompsTable } from './components/CompsTable';
import { TransparencyAuditModal } from './components/TransparencyAuditModal';
import { AdvisoryReportModal } from './components/AdvisoryReportModal';
import { SAMPLE_DC_LISTINGS } from './data/sampleDcListings';
import { calculatePricingSummary } from './utils/math';
import { AirbnbListing, DatasetMeta, PropertyFilters } from './types';
import {
  ShieldCheck,
  TrendingUp,
  MapPin,
  CheckCircle2,
  FileSpreadsheet,
  Award,
} from 'lucide-react';

export default function App() {
  // Initial dataset: authentic Washington DC Inside Airbnb cleaned dataset
  const [allListings, setAllListings] = useState<AirbnbListing[]>(SAMPLE_DC_LISTINGS);
  const [meta, setMeta] = useState<DatasetMeta>({
    fileName: 'inside_airbnb_washington_dc_verified.csv',
    rowCount: SAMPLE_DC_LISTINGS.length,
    loadedAt: 'Initial Session',
    isSample: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<PropertyFilters>({
    neighborhood: 'ALL',
    roomType: 'ALL',
    bedrooms: 'ALL',
    minAccommodates: 0,
    searchQuery: '',
    sortBy: 'rating_desc',
  });

  // Modals state
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Apply filters to dataset
  const filteredListings = useMemo(() => {
    return allListings.filter((item) => {
      // Neighborhood filter
      if (filters.neighborhood !== 'ALL' && item.neighbourhood !== filters.neighborhood) {
        return false;
      }

      // Room type filter
      if (filters.roomType !== 'ALL' && item.room_type !== filters.roomType) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms !== 'ALL') {
        const bedNum = parseInt(filters.bedrooms, 10);
        if (item.bedrooms !== bedNum) {
          return false;
        }
      }

      // Minimum accommodates filter
      if (filters.minAccommodates && filters.minAccommodates > 0) {
        if (item.accommodates < filters.minAccommodates) {
          return false;
        }
      }

      // Search keyword filter
      if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesNeighbourhood = item.neighbourhood.toLowerCase().includes(query);
        if (!matchesName && !matchesNeighbourhood) {
          return false;
        }
      }

      return true;
    });
  }, [allListings, filters]);

  // Pricing summary calculation
  const stats = useMemo(() => {
    return calculatePricingSummary(filteredListings);
  }, [filteredListings]);

  // Human-readable filter description
  const filterDescription = useMemo(() => {
    const parts: string[] = [];
    if (filters.neighborhood !== 'ALL') parts.push(filters.neighborhood);
    else parts.push('All DC Neighborhoods');

    if (filters.roomType !== 'ALL') parts.push(filters.roomType);
    if (filters.bedrooms !== 'ALL') {
      parts.push(filters.bedrooms === '0' ? 'Studios' : `${filters.bedrooms}-BR`);
    }
    if (filters.minAccommodates && filters.minAccommodates > 0) {
      parts.push(`${filters.minAccommodates}+ Guests`);
    }
    return parts.join(' · ');
  }, [filters]);

  const handleDatasetLoaded = (newListings: AirbnbListing[], newMeta: DatasetMeta) => {
    setAllListings(newListings);
    setMeta(newMeta);
    // Reset filters to ALL when new dataset is loaded to prevent empty states
    setFilters({
      neighborhood: 'ALL',
      roomType: 'ALL',
      bedrooms: 'ALL',
      minAccommodates: 0,
      searchQuery: '',
      sortBy: 'rating_desc',
    });
  };

  const handleResetFilters = () => {
    setFilters({
      neighborhood: 'ALL',
      roomType: 'ALL',
      bedrooms: 'ALL',
      minAccommodates: 0,
      searchQuery: '',
      sortBy: 'rating_desc',
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        onExportReport={() => setShowReportModal(true)}
        onScrollToUpload={() => scrollToSection('dataset-upload')}
        onScrollToComps={() => scrollToSection('market-comps')}
        onScrollToAudit={() => setShowAuditModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Editorial Real Estate Advisory Banner */}
        <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[300px]">
            {/* Text Column */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Washington D.C. Property Asset Advisory</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  Precision Airbnb Yield & Pricing Intelligence
                </h1>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xl">
                  Benchmark your property against verified Inside Airbnb D.C. market datasets. Calculate exact median, 25th, and 75th percentile nightly rates with rigorous mathematical transparency and zero invented figures.
                </p>
              </div>

              {/* Trust markers */}
              <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Method R-7 Linear Interpolation</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Host Identity Sanitized</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Client-Side PapaParse</span>
                </div>
              </div>
            </div>

            {/* Architectural Photo Column with Scrim & Zero-Broken-Image Fallback */}
            <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
              <img
                src="/src/assets/images/dc_rowhouse_architecture_1794263259890.jpg"
                alt="Historic Washington DC Brick Rowhouse in Georgetown"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to elegant architectural gradient if image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.className =
                      'lg:col-span-5 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center p-8';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 right-4 text-[10px] text-white/70 font-mono">
                Georgetown Historic District, D.C.
              </div>
            </div>
          </div>
        </div>

        {/* Feature 1: CSV File Upload & Dataset Management */}
        <DatasetUpload
          currentMeta={meta}
          onDatasetLoaded={handleDatasetLoaded}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {/* Feature 2: Property Filter Form */}
        <FilterBar
          allListings={allListings}
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          matchedCount={filteredListings.length}
        />

        {/* Feature 3 & 4: Pricing Summary with Mathematical Transparency Footnotes */}
        <PricingSummary
          stats={stats}
          onOpenAudit={() => setShowAuditModal(true)}
          filterDescription={filterDescription}
        />

        {/* Feature: Annual Revenue & Take-Home Calculator */}
        <AnnualRevenueCalculator
          listings={filteredListings}
          medianPrice={stats ? stats.median : 0}
          filterDescription={filterDescription}
        />

        {/* Feature: Stay Length Benchmark */}
        <StayLengthBenchmark
          listings={filteredListings}
          neighborhoodName={filters.neighborhood}
        />

        {/* Feature 5: Top 10 Matching Comps Table (Host Sanitized) */}
        <CompsTable
          listings={filteredListings}
          medianPrice={stats ? stats.median : 0}
        />
      </main>

      {/* Mathematical Transparency Auditor Modal */}
      {showAuditModal && stats && (
        <TransparencyAuditModal
          stats={stats}
          filterDescription={filterDescription}
          onClose={() => setShowAuditModal(false)}
        />
      )}

      {/* Advisory Report Print / Export Modal */}
      {showReportModal && stats && (
        <AdvisoryReportModal
          stats={stats}
          filters={filters}
          topComps={filteredListings}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Editorial Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Monumental Hosts</span>
            <span aria-hidden="true">·</span>
            <span>Washington, D.C. Short-Term Rental Analytics</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Powered by Inside Airbnb Open Data</span>
            <span aria-hidden="true">·</span>
            <span>Confidential Client Advisory</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
