import React from 'react';
import { X, Trash2, Calendar, ShieldAlert, ArrowRight, FileText } from 'lucide-react';
import { AuditReport } from '../types';

interface AuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedReports: AuditReport[];
  onLoadReport: (report: AuditReport) => void;
  onClearHistory: () => void;
}

export const AuditHistoryModal: React.FC<AuditHistoryModalProps> = ({
  isOpen,
  onClose,
  savedReports,
  onLoadReport,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">Saved Audit History</h3>
          </div>

          <div className="flex items-center space-x-2">
            {savedReports.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-red-400 hover:text-red-300 px-2.5 py-1 rounded-lg bg-red-950/50 border border-red-800/60 transition-colors flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {savedReports.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              No saved audit reports found. Audit a system prompt to save history.
            </div>
          ) : (
            savedReports.map((report) => (
              <div
                key={report.id}
                onClick={() => {
                  onLoadReport(report);
                  onClose();
                }}
                className="p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-slate-200 group-hover:text-amber-400 transition-colors">
                      {report.promptTitle || 'Untitled System Prompt'}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      Score: {report.riskScores?.overall || 0}/100
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {report.verdict?.criticalFlaw || report.verdict?.purpose}
                  </p>

                  <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(report.timestamp).toLocaleString()}</span>
                    </span>
                    <span>•</span>
                    <span>{report.findings?.length || 0} Findings</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0 ml-3" />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
