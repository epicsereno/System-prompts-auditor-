import React from 'react';
import { ShieldCheck, History, Download, Sparkles, FileText, ChevronDown } from 'lucide-react';
import { SAMPLE_PROMPTS } from '../data/samplePrompts';
import { SamplePrompt } from '../types';

interface HeaderProps {
  onSelectSample: (sample: SamplePrompt) => void;
  onOpenHistory: () => void;
  onOpenExport: () => void;
  hasAuditResults: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectSample,
  onOpenHistory,
  onOpenExport,
  hasAuditResults,
  onReset,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header id="app-header" className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 via-amber-500 to-emerald-500 p-[2px] shadow-lg shadow-red-950/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold tracking-tight text-white">System Prompt Auditor</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-red-950/80 text-red-400 border border-red-800/50">
                PROMPT-SEC v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Literal, Adversarial & Holistic vulnerability analysis for AI agent governance
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Preset Prompts Dropdown */}
          <div className="relative">
            <button
              id="btn-sample-prompts"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Sample Prompts</span>
              <span className="md:hidden">Samples</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div
                id="sample-prompts-dropdown"
                className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs"
              >
                <div className="px-3 py-1.5 border-b border-slate-800 font-medium text-slate-400 uppercase tracking-wider text-[10px]">
                  Select Pre-built System Prompt
                </div>
                {SAMPLE_PROMPTS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      onSelectSample(sample);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-800/80 transition-colors flex flex-col space-y-0.5 border-b border-slate-800/40 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{sample.title}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-amber-400 font-mono">
                        {sample.category}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px] line-clamp-1">{sample.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audit History */}
          <button
            id="btn-audit-history"
            onClick={onOpenHistory}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Saved Audit Reports"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Export Report */}
          {hasAuditResults && (
            <button
              id="btn-export-report"
              onClick={onOpenExport}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          )}

          {/* New Audit Reset */}
          <button
            id="btn-new-audit"
            onClick={onReset}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

      </div>
    </header>
  );
};
