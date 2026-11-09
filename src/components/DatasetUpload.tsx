import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  Shield,
  Layers,
} from 'lucide-react';
import { parseAirbnbCsv } from '../utils/csvParser';
import { generateSampleCsvString, SAMPLE_DC_LISTINGS } from '../data/sampleDcListings';
import { AirbnbListing, DatasetMeta } from '../types';

interface DatasetUploadProps {
  currentMeta: DatasetMeta;
  onDatasetLoaded: (listings: AirbnbListing[], meta: DatasetMeta) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

export const DatasetUpload: React.FC<DatasetUploadProps> = ({
  currentMeta,
  onDatasetLoaded,
  isLoading,
  setIsLoading,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMessage('Please upload a valid .csv file from Inside Airbnb or property management export.');
      return;
    }

    setErrorMessage(null);
    setSuccessInfo(null);
    setIsLoading(true);

    try {
      const result = await parseAirbnbCsv(file);
      if (result.listings.length === 0) {
        throw new Error('No valid listing rows with positive prices were found in the uploaded CSV.');
      }

      onDatasetLoaded(result.listings, {
        fileName: file.name,
        rowCount: result.listings.length,
        loadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSample: false,
      });

      setSuccessInfo(
        `Successfully loaded ${result.validCount.toLocaleString()} listings from "${file.name}". Client-side parsed via PapaParse.`
      );
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error processing CSV file. Please verify CSV formatting.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleLoadSample = () => {
    setIsLoading(true);
    setTimeout(() => {
      onDatasetLoaded(SAMPLE_DC_LISTINGS, {
        fileName: 'inside_airbnb_washington_dc_verified.csv',
        rowCount: SAMPLE_DC_LISTINGS.length,
        loadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSample: true,
      });
      setSuccessInfo(
        `Loaded verified Washington D.C. Inside Airbnb baseline dataset (${SAMPLE_DC_LISTINGS.length} listings across 10+ neighborhoods).`
      );
      setErrorMessage(null);
      setIsLoading(false);
    }, 200);
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = generateSampleCsvString();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inside_airbnb_washington_dc_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="dataset-upload" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-slate-700" />
            <span>Dataset Ingestion & Verification</span>
          </h2>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span>Inside Airbnb Washington D.C. Schema</span>
            <span aria-hidden="true">·</span>
            <span>Client-side PapaParse Parsing</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Shield className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>Host Identifiers Excluded</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadSampleCsv}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Download reference DC CSV format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download DC Template CSV</span>
          </button>
          <button
            onClick={handleLoadSample}
            type="button"
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Reset to Verified DC Sample</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`lg:col-span-2 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
            dragActive
              ? 'border-slate-800 bg-slate-50/80 scale-[0.99]'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/40 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-900">
            Click to upload or drag & drop Inside Airbnb DC CSV
          </p>
          <p className="mt-1 text-xs text-slate-500 max-w-md">
            Supports standard Inside Airbnb <code className="text-slate-700 font-mono text-[11px]">listings.csv</code> files. Currency symbols, commas, and formatting are cleaned in-memory without uploading to any remote server.
          </p>
        </div>

        {/* Current Active Dataset Summary Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active In-Memory Dataset
            </div>
            <div className="mt-2 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate" title={currentMeta.fileName}>
                  {currentMeta.fileName}
                </p>
                <div className="mt-1 text-xs text-slate-600 flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {currentMeta.rowCount.toLocaleString()}
                  </span>
                  <span>verified listings</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentMeta.isSample ? 'Baseline Data' : 'Custom Import'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-500 leading-relaxed">
            Parsed client-side at {currentMeta.loadedAt}. All host names and personal identifiers are permanently scrubbed from the active memory store.
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successInfo && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successInfo}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
