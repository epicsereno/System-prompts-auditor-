import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Zap, Scale, Lock } from 'lucide-react';
import { RiskScores } from '../types';

interface RiskMeterProps {
  scores: RiskScores;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ scores }) => {
  const getRiskColor = (score: number, inverse = false) => {
    const val = inverse ? 100 - score : score;
    if (val >= 70) return { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-800/60', bar: 'bg-red-500' };
    if (val >= 40) return { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-800/60', bar: 'bg-amber-500' };
    return { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-800/60', bar: 'bg-emerald-500' };
  };

  const overallTheme = getRiskColor(scores.overall);

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
      {/* Overall Score Badge */}
      <div className={`md:col-span-2 p-4 rounded-xl border ${overallTheme.border} ${overallTheme.bg} flex flex-col justify-between relative overflow-hidden shadow-lg`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Overall Risk Profile
          </span>
          <ShieldAlert className={`w-5 h-5 ${overallTheme.text}`} />
        </div>

        <div className="my-2 flex items-baseline space-x-2">
          <span className={`text-4xl font-extrabold font-mono ${overallTheme.text}`}>
            {scores.overall}
          </span>
          <span className="text-xs text-slate-400 font-mono">/ 100</span>
        </div>

        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className={`h-full ${overallTheme.bar} transition-all duration-500 rounded-full`}
            style={{ width: `${scores.overall}%` }}
          ></div>
        </div>

        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>{scores.overall >= 70 ? 'CRITICAL RISK' : scores.overall >= 40 ? 'ELEVATED RISK' : 'LOW RISK'}</span>
          <span>{scores.overall >= 70 ? 'Requires Revision' : scores.overall >= 40 ? 'Hardening Recommended' : 'Hardened'}</span>
        </div>
      </div>

      {/* Sub Scores Grid */}
      <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        
        {/* Injection Surface */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">Injection Surface</span>
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </div>
          <div className="my-1.5 flex items-baseline space-x-1">
            <span className="text-lg font-bold font-mono text-slate-100">{scores.injectionRisk}</span>
            <span className="text-[10px] text-slate-500">%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${getRiskColor(scores.injectionRisk).bar}`}
              style={{ width: `${scores.injectionRisk}%` }}
            ></div>
          </div>
        </div>

        {/* Ambiguity Index */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">Ambiguity Index</span>
            <Scale className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          </div>
          <div className="my-1.5 flex items-baseline space-x-1">
            <span className="text-lg font-bold font-mono text-slate-100">{scores.ambiguityIndex}</span>
            <span className="text-[10px] text-slate-500">%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${getRiskColor(scores.ambiguityIndex).bar}`}
              style={{ width: `${scores.ambiguityIndex}%` }}
            ></div>
          </div>
        </div>

        {/* Safeguard Coverage */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">Safeguard Coverage</span>
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>
          <div className="my-1.5 flex items-baseline space-x-1">
            <span className="text-lg font-bold font-mono text-slate-100">{scores.safeguardCoverage}</span>
            <span className="text-[10px] text-slate-500">%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${getRiskColor(scores.safeguardCoverage, true).bar}`}
              style={{ width: `${scores.safeguardCoverage}%` }}
            ></div>
          </div>
        </div>

        {/* Tool Safety */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">Tool Safety Risk</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          </div>
          <div className="my-1.5 flex items-baseline space-x-1">
            <span className="text-lg font-bold font-mono text-slate-100">{scores.toolSafety}</span>
            <span className="text-[10px] text-slate-500">%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${getRiskColor(scores.toolSafety).bar}`}
              style={{ width: `${scores.toolSafety}%` }}
            ></div>
          </div>
        </div>

        {/* Enforcement Gaps */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">Enforcement & Observable Test Gaps</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          </div>
          <div className="my-1.5 flex items-baseline space-x-1">
            <span className="text-lg font-bold font-mono text-slate-100">{scores.enforcementGaps}</span>
            <span className="text-[10px] text-slate-500">%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${getRiskColor(scores.enforcementGaps).bar}`}
              style={{ width: `${scores.enforcementGaps}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
};
