import React from 'react';
import { Layers, Search, ShieldAlert, Cpu } from 'lucide-react';
import { PassNotes } from '../types';

interface PassNotesViewProps {
  passNotes: PassNotes;
}

export const PassNotesView: React.FC<PassNotesViewProps> = ({ passNotes }) => {
  return (
    <div className="space-y-4">
      
      {/* Pass 1: Literal */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center space-x-2 text-blue-400 font-semibold text-xs uppercase tracking-wider">
          <Search className="w-4 h-4" />
          <span>Pass 1 — Literal Compliance Check</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
          {passNotes.literalPass}
        </p>
      </div>

      {/* Pass 2: Adversarial */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Pass 2 — Adversarial Attack Surface & Untrusted Data Paths</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
          {passNotes.adversarialPass}
        </p>
      </div>

      {/* Pass 3: Holistic */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Pass 3 — Holistic Structure, Precedence & Context Pressure</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
          {passNotes.holisticPass}
        </p>
      </div>

    </div>
  );
};
