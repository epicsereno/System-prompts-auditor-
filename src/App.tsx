import React from 'react';
import { Header } from './components/Header';
import { PromptEditor } from './components/PromptEditor';
import { RiskMeter } from './components/RiskMeter';
import { FindingCard } from './components/FindingCard';
import { StrengthsView } from './components/StrengthsView';
import { PassNotesView } from './components/PassNotesView';
import { RevisedPromptView } from './components/RevisedPromptView';
import { AdversarialSandbox } from './components/AdversarialSandbox';
import { AuditHistoryModal } from './components/AuditHistoryModal';
import { ExportModal } from './components/ExportModal';
import { SAMPLE_PROMPTS } from './data/samplePrompts';
import { AuditReport, DeploymentContext, Finding, SamplePrompt, Severity } from './types';
import { ShieldAlert, ShieldCheck, Filter, Search, Sparkles, Layers, Zap, Cpu, FileCode, CheckCircle2 } from 'lucide-react';

export default function App() {
  const initialSample = SAMPLE_PROMPTS[0];

  const [promptText, setPromptText] = React.useState<string>(initialSample.promptText);
  const [promptTitle, setPromptTitle] = React.useState<string>(initialSample.title);
  const [deploymentContext, setDeploymentContext] = React.useState<DeploymentContext>(initialSample.deploymentContext);

  const [auditReport, setAuditReport] = React.useState<AuditReport | null>(null);
  const [isAuditing, setIsAuditing] = React.useState<boolean>(false);
  const [auditError, setAuditError] = React.useState<string | null>(null);

  const [activeTab, setActiveTab] = React.useState<'findings' | 'strengths' | 'passNotes' | 'revised' | 'sandbox'>('findings');
  const [severityFilter, setSeverityFilter] = React.useState<'ALL' | Severity>('ALL');
  const [dimensionFilter, setDimensionFilter] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const [savedReports, setSavedReports] = React.useState<AuditReport[]>(() => {
    try {
      const stored = localStorage.getItem('system_prompt_audits');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = React.useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = React.useState<boolean>(false);

  // Save reports to localStorage
  const saveReportToHistory = (newReport: AuditReport) => {
    const updated = [newReport, ...savedReports.filter((r) => r.id !== newReport.id)].slice(0, 20);
    setSavedReports(updated);
    try {
      localStorage.setItem('system_prompt_audits', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save audit report to localStorage', e);
    }
  };

  const handleClearHistory = () => {
    setSavedReports([]);
    try {
      localStorage.removeItem('system_prompt_audits');
    } catch (e) {}
  };

  const handleSelectSample = (sample: SamplePrompt) => {
    setPromptTitle(sample.title);
    setPromptText(sample.promptText);
    setDeploymentContext(sample.deploymentContext);
    setAuditReport(null);
    setAuditError(null);
  };

  const handleRunAudit = async () => {
    if (!promptText.trim()) return;

    setIsAuditing(true);
    setAuditError(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText,
          deploymentContext,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Audit analysis failed');
      }

      const data = await res.json();

      const newReport: AuditReport = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        promptTitle: promptTitle || 'System Prompt',
        promptText,
        deploymentContext,
        verdict: data.verdict,
        findings: data.findings || [],
        strengths: data.strengths || [],
        riskScores: data.riskScores || {
          overall: 50,
          injectionRisk: 50,
          ambiguityIndex: 50,
          safeguardCoverage: 50,
          toolSafety: 50,
          enforcementGaps: 50,
        },
        passNotes: data.passNotes || {
          literalPass: 'Pass 1 complete.',
          adversarialPass: 'Pass 2 complete.',
          holisticPass: 'Pass 3 complete.',
        },
      };

      setAuditReport(newReport);
      saveReportToHistory(newReport);
      setActiveTab('findings');
    } catch (err: any) {
      setAuditError(err.message || 'Audit failed. Check server logs or Gemini key.');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleReset = () => {
    setPromptText('');
    setPromptTitle('Custom Prompt');
    setAuditReport(null);
    setAuditError(null);
  };

  const handleApplyRevisedPrompt = (revisedText: string) => {
    setPromptText(revisedText);
    setAuditReport(null);
    setAuditError(null);
  };

  // Filter Findings
  const filteredFindings = React.useMemo(() => {
    if (!auditReport?.findings) return [];

    return auditReport.findings.filter((f) => {
      // Severity filter
      if (severityFilter !== 'ALL' && f.severity.toUpperCase() !== severityFilter) {
        return false;
      }

      // Dimension filter
      if (dimensionFilter !== 'ALL' && f.dimension !== dimensionFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = f.title.toLowerCase().includes(q);
        const inLoc = f.location.toLowerCase().includes(q);
        const inScenario = f.failureScenario.toLowerCase().includes(q);
        const inTrigger = f.triggerInput.toLowerCase().includes(q);
        const inFix = f.proposedFix.toLowerCase().includes(q);
        return inTitle || inLoc || inScenario || inTrigger || inFix;
      }

      return true;
    });
  }, [auditReport, severityFilter, dimensionFilter, searchQuery]);

  // Extract unique dimensions for filter
  const availableDimensions = React.useMemo(() => {
    if (!auditReport?.findings) return [];
    const dims = new Set<string>();
    auditReport.findings.forEach((f) => dims.add(f.dimension));
    return Array.from(dims);
  }, [auditReport]);

  return (
    <div id="app-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      
      {/* Top Navigation */}
      <Header
        onSelectSample={handleSelectSample}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        hasAuditResults={!!auditReport}
        onReset={handleReset}
      />

      {/* Main Grid Workspace */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Prompt Input & Deployment Context */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <PromptEditor
            promptText={promptText}
            setPromptText={setPromptText}
            deploymentContext={deploymentContext}
            setDeploymentContext={setDeploymentContext}
            onRunAudit={handleRunAudit}
            isAuditing={isAuditing}
            auditError={auditError}
          />
        </div>

        {/* Right Column: Audit Results & Deep Security Analysis */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          {auditReport ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              
              {/* Verdict Summary Header Banner */}
              <div id="verdict-banner" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                    <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
                      Audit Verdict & Risk Profile
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(auditReport.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {/* Verdict text */}
                <div className="space-y-2">
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      PROMPT PURPOSE & CRITICAL FLAW:
                    </span>
                    <p className="font-sans text-sm text-slate-200 mb-2">
                      {auditReport.verdict?.fullVerdict || auditReport.verdict?.purpose}
                    </p>
                  </div>

                  {auditReport.verdict?.criticalFlaw && (
                    <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-start space-x-2.5">
                      <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-red-300 block mb-0.5">Primary Critical Vulnerability:</span>
                        <span>{auditReport.verdict.criticalFlaw}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Risk Radar Meter */}
                <RiskMeter scores={auditReport.riskScores} />
              </div>

              {/* Navigation Tabs */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-lg flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-1 overflow-x-auto py-1">
                  
                  <button
                    id="tab-findings"
                    onClick={() => setActiveTab('findings')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      activeTab === 'findings'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Findings</span>
                    <span className="px-1.5 py-0.2 bg-slate-950/40 rounded text-[10px] font-mono">
                      {auditReport.findings?.length || 0}
                    </span>
                  </button>

                  <button
                    id="tab-strengths"
                    onClick={() => setActiveTab('strengths')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      activeTab === 'strengths'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Strengths</span>
                    <span className="px-1.5 py-0.2 bg-slate-950/40 rounded text-[10px] font-mono">
                      {auditReport.strengths?.length || 0}
                    </span>
                  </button>

                  <button
                    id="tab-pass-notes"
                    onClick={() => setActiveTab('passNotes')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      activeTab === 'passNotes'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>3-Pass Notes</span>
                  </button>

                  <button
                    id="tab-revised"
                    onClick={() => setActiveTab('revised')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      activeTab === 'revised'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hardened Prompt</span>
                  </button>

                  <button
                    id="tab-sandbox"
                    onClick={() => setActiveTab('sandbox')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      activeTab === 'sandbox'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-red-400" />
                    <span>Red-Team Simulator</span>
                  </button>

                </div>
              </div>

              {/* Tab Content Display */}
              {activeTab === 'findings' && (
                <div className="space-y-4">
                  
                  {/* Filters Bar */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    
                    {/* Severity Pills */}
                    <div className="flex items-center space-x-1 overflow-x-auto">
                      {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
                        <button
                          key={sev}
                          onClick={() => setSeverityFilter(sev)}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold border transition-colors ${
                            severityFilter === sev
                              ? sev === 'CRITICAL'
                                ? 'bg-red-950 text-red-300 border-red-700'
                                : sev === 'HIGH'
                                ? 'bg-amber-950 text-amber-300 border-amber-700'
                                : sev === 'MEDIUM'
                                ? 'bg-yellow-950 text-yellow-300 border-yellow-700'
                                : sev === 'LOW'
                                ? 'bg-slate-800 text-blue-300 border-slate-700'
                                : 'bg-slate-800 text-slate-200 border-slate-700'
                              : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>

                    {/* Dimension Filter & Search */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      {availableDimensions.length > 0 && (
                        <select
                          value={dimensionFilter}
                          onChange={(e) => setDimensionFilter(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1 font-mono focus:outline-none"
                        >
                          <option value="ALL">All Dimensions</option>
                          {availableDimensions.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      )}

                      <div className="relative flex-1 sm:w-44">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Search findings..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-2.5 py-1 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Findings Cards List */}
                  {filteredFindings.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs font-mono">
                      No findings match the selected filters.
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {filteredFindings.map((finding, idx) => (
                        <FindingCard key={finding.id || idx} finding={finding} index={idx} />
                      ))}
                    </div>
                  )}

                </div>
              )}

              {activeTab === 'strengths' && (
                <StrengthsView strengths={auditReport.strengths} />
              )}

              {activeTab === 'passNotes' && (
                <PassNotesView passNotes={auditReport.passNotes} />
              )}

              {activeTab === 'revised' && (
                <RevisedPromptView
                  originalPrompt={promptText}
                  findings={auditReport.findings}
                  strengths={auditReport.strengths}
                  deploymentContext={deploymentContext}
                  onApplyRevisedPrompt={handleApplyRevisedPrompt}
                />
              )}

              {activeTab === 'sandbox' && (
                <AdversarialSandbox promptText={promptText} />
              )}

            </div>
          ) : (
            /* Empty State when no audit has been run yet */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center min-h-[480px] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="max-w-md space-y-2">
                <h3 className="text-base font-semibold text-slate-100">
                  Ready to Audit System Prompt
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Paste any agent system prompt or choose a pre-built sample on the left. Click <strong className="text-amber-400">Audit System Prompt</strong> to trigger a comprehensive 3-pass vulnerability analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg pt-4 text-left font-mono text-[11px]">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-amber-400 font-bold block">Pass 1 — Literal</span>
                  <p className="text-slate-400 text-[10px]">Unintended rule satisfaction & ambiguous objects.</p>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-amber-400 font-bold block">Pass 2 — Adversarial</span>
                  <p className="text-slate-400 text-[10px]">Indirect tool output injection & authority hijack.</p>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-amber-400 font-bold block">Pass 3 — Holistic</span>
                  <p className="text-slate-400 text-[10px]">Rule collisions, context pressure & safeguards.</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Audit History Modal */}
      <AuditHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedReports={savedReports}
        onLoadReport={(report) => {
          setAuditReport(report);
          setPromptText(report.promptText);
          setPromptTitle(report.promptTitle);
          setDeploymentContext(report.deploymentContext);
        }}
        onClearHistory={handleClearHistory}
      />

      {/* Export Report Modal */}
      {auditReport && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          report={auditReport}
        />
      )}

    </div>
  );
}
