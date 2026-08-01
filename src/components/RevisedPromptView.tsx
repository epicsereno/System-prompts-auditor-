import React from 'react';
import { Sparkles, Copy, Check, ArrowRight, ShieldCheck, RefreshCw, FileCode } from 'lucide-react';
import { AuditReport, Finding, Strength, DeploymentContext } from '../types';

interface RevisedPromptViewProps {
  originalPrompt: string;
  findings: Finding[];
  strengths: Strength[];
  deploymentContext: DeploymentContext;
  onApplyRevisedPrompt: (revisedText: string) => void;
}

export const RevisedPromptView: React.FC<RevisedPromptViewProps> = ({
  originalPrompt,
  findings,
  strengths,
  deploymentContext,
  onApplyRevisedPrompt,
}) => {
  const [revisedPrompt, setRevisedPrompt] = React.useState<string>('');
  const [keyImprovements, setKeyImprovements] = React.useState<string[]>([]);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [activeView, setActiveView] = React.useState<'revised' | 'split'>('revised');

  const handleGenerateFix = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText: originalPrompt,
          findings,
          strengths,
          deploymentContext,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate revised prompt');
      }

      const data = await res.json();
      setRevisedPrompt(data.revisedPrompt);
      setKeyImprovements(data.keyImprovements || []);
    } catch (err: any) {
      setError(err.message || 'Generation error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(revisedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-emerald-950 border border-emerald-800/80 rounded-lg text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Safety-Hardened System Prompt Generator
            </h3>
            <p className="text-xs text-slate-400">
              Generates a revised system prompt incorporating all audit fixes while preserving strengths.
            </p>
          </div>
        </div>

        {!revisedPrompt && (
          <button
            onClick={handleGenerateFix}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Hardening Prompt...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Hardened Prompt</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Main Revised Prompt Content */}
      {revisedPrompt ? (
        <div className="space-y-4">
          
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setActiveView('revised')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeView === 'revised' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hardened Prompt
              </button>
              <button
                onClick={() => setActiveView('split')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeView === 'split' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Split Comparison
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleGenerateFix}
                disabled={isGenerating}
                className="px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors flex items-center space-x-1"
                title="Regenerate hardened prompt"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 rounded-lg transition-colors flex items-center space-x-1 font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => onApplyRevisedPrompt(revisedPrompt)}
                className="px-3 py-1 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg transition-colors flex items-center space-x-1"
              >
                <span>Load in Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Key Improvements Badges */}
          {keyImprovements.length > 0 && (
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold block">
                APPLIED HARDENING STRUCTURAL IMPROVEMENTS:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                {keyImprovements.map((imp, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* View Container */}
          {activeView === 'revised' ? (
            <div className="relative rounded-xl border border-emerald-900/60 bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[500px] overflow-y-auto">
              <pre className="whitespace-pre-wrap">{revisedPrompt}</pre>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold block">
                  ORIGINAL PROMPT
                </span>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-slate-400 max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                  {originalPrompt}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold block">
                  HARDENED REVISED PROMPT
                </span>
                <div className="rounded-xl border border-emerald-900/60 bg-slate-950 p-3 font-mono text-[11px] text-emerald-200 max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                  {revisedPrompt}
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="p-8 text-center bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
          <FileCode className="w-8 h-8 text-slate-600 mx-auto" />
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-xs font-semibold text-slate-200">
              Ready to generate a hardened version of your prompt?
            </h4>
            <p className="text-[11px] text-slate-400">
              Our automated engine will rewrite your prompt to establish strict instruction vs data boundaries, eliminate unenforceable rules, and resolve all audit findings.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
