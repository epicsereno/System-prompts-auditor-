import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, Info, Copy, Check, Terminal, Zap } from 'lucide-react';
import { Finding, Severity } from '../types';

interface FindingCardProps {
  finding: Finding;
  index: number;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding, index }) => {
  const [copiedFix, setCopiedFix] = React.useState(false);

  const getSeverityBadge = (severity: Severity) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-950/80 text-red-300 border-red-700/80',
          icon: <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />,
          label: 'CRITICAL',
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-950/80 text-amber-300 border-amber-700/80',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          label: 'HIGH',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-950/60 text-yellow-300 border-yellow-700/60',
          icon: <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />,
          label: 'MEDIUM',
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
          label: 'LOW',
        };
    }
  };

  const badge = getSeverityBadge(finding.severity);

  const handleCopyFix = () => {
    navigator.clipboard.writeText(finding.proposedFix);
    setCopiedFix(true);
    setTimeout(() => setCopiedFix(false), 2000);
  };

  return (
    <div
      id={`finding-card-${finding.id || index}`}
      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition-all shadow-md flex flex-col space-y-3.5"
    >
      {/* Title & Badges Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${badge.bg}`}>
            {badge.icon}
            <span>[{badge.label}]</span>
          </span>

          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{finding.dimension}</span>
          </span>
        </div>

        <span className="text-[11px] font-mono text-slate-500">
          Finding #{index + 1}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-slate-100 tracking-tight leading-snug">
        {finding.title}
      </h3>

      {/* Location Quote */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-xs font-mono text-slate-300">
        <span className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
          LOCATION QUOTE:
        </span>
        <code className="text-amber-300/90 bg-amber-950/20 px-1 py-0.5 rounded border border-amber-900/40">
          "{finding.location}"
        </code>
      </div>

      {/* Concrete Failure & Trigger Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Concrete Failure Scenario */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-3">
          <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider block mb-1">
            CONCRETE FAILURE SCENARIO:
          </span>
          <p className="text-slate-300 leading-relaxed">
            {finding.failureScenario}
          </p>
        </div>

        {/* Trigger Condition */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-3">
          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">
            TRIGGER CONDITION:
          </span>
          <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
            {finding.triggerInput}
          </p>
        </div>
      </div>

      {/* Proposed Fix Box */}
      <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-3 relative group">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
            <Terminal className="w-3 h-3" />
            <span>PROPOSED FIX / REPLACEMENT LANGUAGE:</span>
          </span>

          <button
            onClick={handleCopyFix}
            className="p-1 text-emerald-400 hover:text-emerald-200 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 rounded transition-colors text-[10px] flex items-center space-x-1 font-mono"
            title="Copy fix replacement language"
          >
            {copiedFix ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
            <span>{copiedFix ? 'Copied' : 'Copy Fix'}</span>
          </button>
        </div>

        <p className="text-emerald-200 font-mono text-xs leading-relaxed whitespace-pre-wrap bg-slate-950/80 p-2.5 rounded border border-emerald-900/40">
          {finding.proposedFix}
        </p>
      </div>

    </div>
  );
};
