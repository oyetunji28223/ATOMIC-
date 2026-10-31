import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  FileText, 
  Compass,
  Check,
  RefreshCw
} from 'lucide-react';
import { JobListing, MatchScoreResult, PortfolioProject, UserProfile } from '../types';
import { calculateJobMatch } from '../utils/matchingEngine';

interface MatchInspectorProps {
  job: JobListing | null;
  profile: UserProfile;
  portfolio: PortfolioProject[];
  onClose: () => void;
  onProceedToTailor: (job: JobListing) => void;
  onSaveJob: (job: JobListing) => void;
  isSaved: boolean;
}

export const MatchInspector: React.FC<MatchInspectorProps> = ({
  job,
  profile,
  portfolio,
  onClose,
  onProceedToTailor,
  onSaveJob,
  isSaved,
}) => {
  const [matchResult, setMatchResult] = useState<MatchScoreResult | null>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (!job) return;

    // Calculate local deterministic match result immediately
    const deterministic = calculateJobMatch(job, profile, portfolio);
    setMatchResult(deterministic);

    // Call server API for deep Gemini insights
    setLoadingAi(true);
    fetch('/api/gemini/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: job.id, profile, portfolio }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.matchResult) setMatchResult(data.matchResult);
        if (data.aiInsights) setAiInsights(data.aiInsights);
      })
      .catch((err) => {
        console.error('Error fetching AI match:', err);
      })
      .finally(() => {
        setLoadingAi(false);
      });
  }, [job, profile, portfolio]);

  if (!job || !matchResult) return null;

  const categories = Object.values(matchResult.categories);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-4 sm:p-5 flex items-start justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px]">
                100-Point Transparent Match System
              </span>
              <span aria-hidden="true">·</span>
              <span>{job.company}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {job.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Top Score Banner */}
          <div
            className={`p-5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              matchResult.isDisqualified
                ? 'bg-rose-950/20 border-rose-800/40'
                : matchResult.totalScore >= 80
                ? 'bg-emerald-950/20 border-emerald-800/40'
                : 'bg-cyan-950/20 border-cyan-800/40'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {matchResult.isDisqualified ? (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <span
                  className={`text-base font-bold ${
                    matchResult.isDisqualified
                      ? 'text-rose-300'
                      : matchResult.totalScore >= 80
                      ? 'text-emerald-300'
                      : 'text-cyan-300'
                  }`}
                >
                  Verdict: {matchResult.suitabilityVerdict}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {matchResult.summaryAdvice}
              </p>
            </div>

            {/* Score circle */}
            <div className="text-right sm:text-center shrink-0">
              <div
                className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums ${
                  matchResult.isDisqualified ? 'text-rose-400 line-through' : 'text-white'
                }`}
              >
                {matchResult.totalScore}
                <span className="text-base text-slate-500 font-normal">/100</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {matchResult.isDisqualified ? 'Disqualified Gate' : 'Weighted Rubric'}
              </span>
            </div>
          </div>

          {/* Hard Disqualification Notice if applicable */}
          {matchResult.isDisqualified && (
            <div className="p-4 bg-rose-950/30 border border-rose-800/60 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-300">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>ATOMIC Absolute Safety Rule: Non-Negotiable Gatekeeper Triggered</span>
              </div>
              <p className="text-rose-200/90 leading-relaxed">
                This vacancy requires credentials or citizenship that Nigerian remote candidates cannot legally satisfy ({matchResult.disqualificationReason}). ATOMIC forbids treating high technical skills as approval when a mandatory legal or residency requirement fails.
              </p>
            </div>
          )}

          {/* Detailed 6-Category Rubric Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Transparent Evaluation Rubric
            </h3>

            <div className="space-y-2.5">
              {categories.map((cat, idx) => {
                const isFull = cat.score === cat.maxScore;
                const isDisq = cat.status === 'Disqualified Gate';
                const percentage = Math.round((cat.score / cat.maxScore) * 100);

                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-lg text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isDisq ? (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        ) : isFull ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                        <span className="font-semibold text-slate-200">
                          {cat.category}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          ({cat.weightPercentage}% weight)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-100 tabular-nums">
                          {cat.score} / {cat.maxScore} pts
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            isDisq
                              ? 'bg-rose-500/20 text-rose-300'
                              : isFull
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {cat.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isDisq
                            ? 'bg-rose-500'
                            : percentage >= 80
                            ? 'bg-emerald-400'
                            : 'bg-cyan-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Rationale and Recommendations */}
                    <div className="text-slate-400 space-y-1 pt-1">
                      <p className="leading-relaxed">{cat.rationale}</p>
                      {cat.recommendations.map((rec, rIdx) => (
                        <p key={rIdx} className="text-cyan-300/80 text-[11px]">
                          → {rec}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Qualitative Strategic Audit */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Gemini 3.8 Flash Strategic Analysis</span>
              </div>
              {loadingAi && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Auditing with Gemini...</span>
                </div>
              )}
            </div>

            {aiInsights ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium mb-1">
                    Competitive Strengths to Highlight:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {aiInsights.keyCompetitiveStrengths?.map((str: string, i: number) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium mb-1">
                    Prototype Demonstration Playbook:
                  </span>
                  <p className="text-cyan-200 bg-cyan-950/20 p-2.5 rounded border border-cyan-800/30 leading-relaxed">
                    {aiInsights.prototypeDemonstrationStrategy}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Evaluating candidate alignment and tactical advantage...
              </p>
            )}
          </div>

          {/* Actionable Next Steps */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Recommended Next Steps
            </h4>
            <div className="space-y-1.5 text-xs">
              {matchResult.actionableNextSteps.map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10">
          <div className="text-xs text-slate-400">
            {matchResult.isDisqualified
              ? 'Application generation locked due to legal country ineligibility.'
              : 'Materials generated with WAEC qualification & verified prototype links.'}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSaveJob(job)}
              className={`px-3.5 py-2 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaved ? 'In Pipeline' : 'Save to Pipeline'}</span>
            </button>

            {!matchResult.isDisqualified && (
              <button
                onClick={() => {
                  onClose();
                  onProceedToTailor(job);
                }}
                className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Open CV & Letter Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {matchResult.isDisqualified && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded transition-colors"
              >
                Dismiss Ineligible
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
