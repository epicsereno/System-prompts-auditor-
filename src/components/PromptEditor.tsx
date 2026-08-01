import React from 'react';
import { Play, Copy, Trash2, Settings, ShieldAlert, Check, Layers } from 'lucide-react';
import { DeploymentContext } from '../types';

interface PromptEditorProps {
  promptText: string;
  setPromptText: (text: string) => void;
  deploymentContext: DeploymentContext;
  setDeploymentContext: React.Dispatch<React.SetStateAction<DeploymentContext>>;
  onRunAudit: () => void;
  isAuditing: boolean;
  auditError: string | null;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  promptText,
  setPromptText,
  deploymentContext,
  setDeploymentContext,
  onRunAudit,
  isAuditing,
  auditError,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [showContext, setShowContext] = React.useState(true);

  const linesCount = promptText.split('\n').length;
  const wordCount = promptText.trim() ? promptText.trim().split(/\s+/).length : 0;
  const charCount = promptText.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToolToggle = (toolName: string) => {
    setDeploymentContext((prev) => {
      const exists = prev.connectedTools.includes(toolName);
      const updated = exists
        ? prev.connectedTools.filter((t) => t !== toolName)
        : [...prev.connectedTools, toolName];
      return { ...prev, connectedTools: updated };
    });
  };

  const commonTools = [
    'File System Write',
    'Shell/Terminal CLI',
    'SQL DB Execution',
    'Financial/Refund API',
    'Web Search Retrieval',
    'Email/Slack Messaging',
  ];

  return (
    <div id="prompt-editor-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col space-y-4">
      
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
            System Prompt Input
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-copy-prompt"
            onClick={handleCopy}
            disabled={!promptText}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center space-x-1"
            title="Copy prompt text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          
          <button
            id="btn-clear-prompt"
            onClick={() => setPromptText('')}
            disabled={!promptText}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center space-x-1"
            title="Clear prompt text"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative rounded-xl border border-slate-800 bg-slate-950/90 font-mono text-xs overflow-hidden focus-within:border-amber-500/50 transition-colors">
        <div className="flex">
          {/* Line Numbers */}
          <div className="py-3 px-2 text-right bg-slate-900/60 text-slate-600 select-none border-r border-slate-800/50 w-10 shrink-0 font-mono text-[11px] leading-5">
            {Array.from({ length: Math.max(linesCount, 1) }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Text Area */}
          <textarea
            id="prompt-textarea"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Paste system prompt verbatim... (e.g., 'You are an autonomous agent with shell access...')"
            rows={14}
            className="w-full py-3 px-3.5 bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none resize-y leading-5 font-mono text-[12px]"
          />
        </div>

        {/* Stats Footer */}
        <div className="bg-slate-900/80 px-3 py-1.5 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center space-x-3">
            <span>{linesCount} lines</span>
            <span>•</span>
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>
          <span className="text-slate-500 text-[10px] uppercase">UTF-8 Plaintext</span>
        </div>
      </div>

      {/* Deployment Context & Risk Settings Accordion */}
      <div className="border border-slate-800/80 rounded-xl bg-slate-950/40 overflow-hidden">
        <button
          id="btn-toggle-context"
          onClick={() => setShowContext(!showContext)}
          className="w-full px-4 py-2.5 flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 text-left transition-colors text-xs font-medium text-slate-300"
        >
          <div className="flex items-center space-x-2">
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>Deployment Context & Tool Capabilities</span>
          </div>
          <span className="text-[10px] text-amber-400 bg-amber-950/50 border border-amber-800/40 px-2 py-0.5 rounded font-mono">
            {deploymentContext.failureCost.split(' - ')[0]}
          </span>
        </button>

        {showContext && (
          <div className="p-4 space-y-3.5 text-xs border-t border-slate-800/60">
            {/* User Audience & Channel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1 text-[11px]">User Audience</label>
                <input
                  type="text"
                  value={deploymentContext.userAudience}
                  onChange={(e) => setDeploymentContext({ ...deploymentContext, userAudience: e.target.value })}
                  placeholder="e.g. Public Anonymous Users, Internal Engineers"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/50 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1 text-[11px]">Interface / Channel</label>
                <input
                  type="text"
                  value={deploymentContext.interfaceChannel}
                  onChange={(e) => setDeploymentContext({ ...deploymentContext, interfaceChannel: e.target.value })}
                  placeholder="e.g. Web Chat API, Slack Bot, Terminal CLI"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/50 text-xs"
                />
              </div>
            </div>

            {/* Failure Cost Impact */}
            <div>
              <label className="block text-slate-400 font-medium mb-1 text-[11px]">
                Failure Cost & Risk Exposure
              </label>
              <select
                value={deploymentContext.failureCost}
                onChange={(e) => setDeploymentContext({ ...deploymentContext, failureCost: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/50 text-xs font-mono"
              >
                <option value="Critical - Arbitrary Code Execution / Financial Payout / Data Corruption">
                  Critical - Arbitrary Code Execution / Financial / Data Loss
                </option>
                <option value="High - Unauthorized PII Exfiltration / Brand Damage">
                  High - Unauthorized PII / Security Breach / Brand Damage
                </option>
                <option value="Medium - Degraded Customer Experience / Quality Flaws">
                  Medium - Quality Degradation / Customer Confusion
                </option>
                <option value="Low - Internal Utility / Mild Quality Flaw">
                  Low - Internal Dev Scratchpad / Low Impact
                </option>
              </select>
            </div>

            {/* Connected Tools Toggles */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5 text-[11px]">
                Connected Tools & Privileges
              </label>
              <div className="flex flex-wrap gap-1.5">
                {commonTools.map((tool) => {
                  const active = deploymentContext.connectedTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => handleToolToggle(tool)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors flex items-center space-x-1 ${
                        active
                          ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{active ? '✓' : '+'}</span>
                      <span>{tool}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audit Trigger Button */}
      {auditError && (
        <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
          <span>{auditError}</span>
        </div>
      )}

      <button
        id="btn-run-audit"
        onClick={onRunAudit}
        disabled={isAuditing || !promptText.trim()}
        className="w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wide uppercase transition-all shadow-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-red-950/30"
      >
        {isAuditing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Executing 3-Pass Audit (Literal, Adversarial, Holistic)...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Audit System Prompt</span>
          </>
        )}
      </button>

      {/* Methodology Badges */}
      <div className="flex items-center justify-center space-x-4 text-[10px] text-slate-500 uppercase tracking-wider font-mono pt-1">
        <span className="flex items-center space-x-1">
          <Layers className="w-3 h-3 text-slate-400" />
          <span>Pass 1: Literal</span>
        </span>
        <span>•</span>
        <span className="flex items-center space-x-1">
          <Layers className="w-3 h-3 text-slate-400" />
          <span>Pass 2: Adversarial</span>
        </span>
        <span>•</span>
        <span className="flex items-center space-x-1">
          <Layers className="w-3 h-3 text-slate-400" />
          <span>Pass 3: Holistic</span>
        </span>
      </div>

    </div>
  );
};
