import React from 'react';
import { ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { Strength } from '../types';

interface StrengthsViewProps {
  strengths: Strength[];
}

export const StrengthsView: React.FC<StrengthsViewProps> = ({ strengths }) => {
  if (!strengths || strengths.length === 0) {
    return (
      <div className="p-6 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">
        No specific strengths identified in this prompt iteration.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Retained Strengths & Effective Guardrails
          </h3>
          <p className="text-xs text-slate-400">
            Rules and structures that work well and MUST NOT be deleted during prompt revision.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {strengths.map((strength, idx) => (
          <div
            key={strength.id || idx}
            className="p-3.5 bg-slate-950/70 border border-emerald-900/40 rounded-xl flex items-start space-x-3"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-emerald-300">{strength.title}</span>
                {strength.location && (
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    {strength.location}
                  </span>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed">
                {strength.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
