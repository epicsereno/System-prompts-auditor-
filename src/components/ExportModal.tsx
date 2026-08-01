import React from 'react';
import { X, Copy, Check, Download, FileText, Code } from 'lucide-react';
import { AuditReport } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, report }) => {
  const [copiedMd, setCopiedMd] = React.useState(false);
  const [copiedJson, setCopiedJson] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState<'markdown' | 'json'>('markdown');

  if (!isOpen || !report) return null;

  const generateMarkdownReport = () => {
    let md = `# System Prompt Audit Report
**Date:** ${new Date(report.timestamp).toLocaleString()}  
**Prompt Title:** ${report.promptTitle || 'Audited System Prompt'}  
**Overall Risk Score:** ${report.riskScores?.overall || 0}/100

---

## Verdict & Executive Summary
**Purpose:** ${report.verdict?.purpose || ''}  
**Single Critical Flaw:** ${report.verdict?.criticalFlaw || ''}  

> ${report.verdict?.fullVerdict || ''}

---

## Deployment Context
- **Target Audience:** ${report.deploymentContext?.userAudience || 'N/A'}
- **Interface Channel:** ${report.deploymentContext?.interfaceChannel || 'N/A'}
- **Connected Tools:** ${Array.isArray(report.deploymentContext?.connectedTools) ? report.deploymentContext.connectedTools.join(', ') : 'None'}
- **Failure Cost:** ${report.deploymentContext?.failureCost || 'N/A'}

---

## Risk Profile Metrics
- **Overall Risk:** ${report.riskScores?.overall || 0}/100
- **Injection Surface Risk:** ${report.riskScores?.injectionRisk || 0}%
- **Ambiguity Index:** ${report.riskScores?.ambiguityIndex || 0}%
- **Safeguard Coverage:** ${report.riskScores?.safeguardCoverage || 0}%
- **Tool Safety Risk:** ${report.riskScores?.toolSafety || 0}%
- **Enforcement Gaps:** ${report.riskScores?.enforcementGaps || 0}%

---

## Findings (${report.findings?.length || 0})

`;

    report.findings?.forEach((f, idx) => {
      md += `### [${f.severity}] ${f.title}
- **Dimension:** ${f.dimension}
- **Location Quote:** \`${f.location}\`
- **Concrete Failure Scenario:** ${f.failureScenario}
- **Trigger Condition:** \`${f.triggerInput}\`
- **Proposed Fix:**
\`\`\`
${f.proposedFix}
\`\`\`

`;
    });

    if (report.strengths?.length) {
      md += `---

## Retained Strengths
`;
      report.strengths.forEach((s) => {
        md += `- **${s.title}:** ${s.description}\n`;
      });
    }

    return md;
  };

  const mdContent = generateMarkdownReport();
  const jsonContent = JSON.stringify(report, null, 2);

  const handleCopy = () => {
    const text = exportFormat === 'markdown' ? mdContent : jsonContent;
    navigator.clipboard.writeText(text);
    if (exportFormat === 'markdown') {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } else {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const handleDownload = () => {
    const text = exportFormat === 'markdown' ? mdContent : jsonContent;
    const ext = exportFormat === 'markdown' ? 'md' : 'json';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-prompt-audit-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Export Audit Report</h3>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setExportFormat('markdown')}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                  exportFormat === 'markdown' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400'
                }`}
              >
                Markdown (.md)
              </button>
              <button
                onClick={() => setExportFormat('json')}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                  exportFormat === 'json' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400'
                }`}
              >
                JSON (.json)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Text Preview */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre-wrap">{exportFormat === 'markdown' ? mdContent : jsonContent}</pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end space-x-3 bg-slate-900">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
          >
            {(exportFormat === 'markdown' ? copiedMd : copiedJson) ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{(exportFormat === 'markdown' ? copiedMd : copiedJson) ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        </div>

      </div>
    </div>
  );
};
