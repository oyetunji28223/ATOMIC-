import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Send, 
  ShieldCheck, 
  HelpCircle, 
  RefreshCw,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { 
  ApplicationMaterials, 
  JobListing, 
  PortfolioProject, 
  UserProfile 
} from '../types';

interface CVStudioProps {
  selectedJob: JobListing | null;
  allJobs: JobListing[];
  onSelectJob: (job: JobListing) => void;
  profile: UserProfile;
  portfolio: PortfolioProject[];
  onQueueForApproval: (job: JobListing, materials: ApplicationMaterials) => void;
}

export const CVStudio: React.FC<CVStudioProps> = ({
  selectedJob,
  allJobs,
  onSelectJob,
  profile,
  portfolio,
  onQueueForApproval,
}) => {
  const eligibleJobs = allJobs.filter((j) => j.eligibility.status !== 'INELIGIBLE');
  const currentJob = selectedJob || eligibleJobs[0] || null;

  const [activeTab, setActiveTab] = useState<'cv' | 'letter' | 'interview'>('cv');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [queuedNotification, setQueuedNotification] = useState(false);

  // Editable fields
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  const [coverLetter, setCoverLetter] = useState('');
  const [interviewPrep, setInterviewPrep] = useState<{
    expectedQuestions: string[];
    recommendedTalkingPoints: string[];
    technicalProofDemonstrations: string[];
  } | null>(null);

  // Load materials when job changes
  useEffect(() => {
    if (!currentJob) return;

    setLoading(true);
    fetch('/api/gemini/tailor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: currentJob.id, profile, portfolio }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.materials) {
          setHeadline(data.materials.tailoredHeadline || '');
          setSummary(data.materials.executiveSummary || '');
          setBulletPoints(data.materials.keyMatchingHighlights || []);
          setCoverLetter(data.materials.tailoredCoverLetter || '');
        }
      })
      .catch((err) => console.error('Tailor error:', err))
      .finally(() => setLoading(false));

    // Fetch interview prep in background
    fetch('/api/gemini/interview-prep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: currentJob.id, profile, portfolio }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.prep) setInterviewPrep(data.prep);
      })
      .catch((err) => console.error('Interview prep error:', err));
  }, [currentJob, profile, portfolio]);

  const handleCopyCurrent = () => {
    let text = '';
    if (activeTab === 'cv') {
      text = `${headline}\n\nEXECUTIVE SUMMARY:\n${summary}\n\nCORE DEMONSTRATED COMPETENCIES:\n${bulletPoints
        .map((b) => `• ${b}`)
        .join('\n')}\n\nEDUCATION:\n${profile.education.qualification} - ${profile.education.school} (${profile.education.yearCompleted})\n*Note: Truthful, non-fabricated portfolio-first background*\n\nVERIFIED PROTOTYPES:\n${portfolio
        .map((p) => `• ${p.title} (${p.demoUrl}): ${p.tagline}`)
        .join('\n')}`;
    } else if (activeTab === 'letter') {
      text = coverLetter;
    } else if (activeTab === 'interview' && interviewPrep) {
      text = `INTERVIEW PREPARATION FOR ${currentJob?.title} AT ${currentJob?.company}:\n\nEXPECTED QUESTIONS:\n${interviewPrep.expectedQuestions
        .map((q) => `• ${q}`)
        .join('\n')}\n\nSTRATEGIC TALKING POINTS:\n${interviewPrep.recommendedTalkingPoints
        .map((t) => `• ${t}`)
        .join('\n')}\n\nPROOF DEMONSTRATIONS:\n${interviewPrep.technicalProofDemonstrations
        .map((d) => `• ${d}`)
        .join('\n')}`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPack = () => {
    if (!currentJob) return;
    const fullText = `================================================================================
ATOMIC APPLICATION DOSSIER — TRUTHFUL & VERIFIED TALENT
Target Position: ${currentJob.title}
Target Employer: ${currentJob.company} (${currentJob.remoteScope})
Audited Last Date: ${currentJob.verification.lastCheckedDate}
Applicant: ${profile.fullName} (Lagos, Nigeria · WAT UTC+1)
Email: ${profile.email} | Phone: ${profile.phone}
================================================================================

1. PROFESSIONAL PROFILE HEADLINE:
${headline}

2. EXECUTIVE SUMMARY:
${summary}

3. TARGETED HIGHLIGHTS & DEMONSTRATED SKILLS:
${bulletPoints.map((b) => `• ${b}`).join('\n')}

4. GENUINE EDUCATION BACKGROUND:
Qualification: ${profile.education.qualification}
Institution: ${profile.education.school} (${profile.education.yearCompleted})
Honors: ${profile.education.honors}
*AI Safety Verification: WAEC Secondary Certificate. Zero fabricated tertiary degrees.*

5. LIVE VERIFIED PROTOTYPES & PROOF OF WORK:
${portfolio
  .map(
    (p) =>
      `• ${p.title}\n  Demo: ${p.demoUrl}\n  Repo: ${p.repoUrl}\n  Outcome: ${p.keyMetricOrOutcome}`
  )
  .join('\n\n')}

6. REMOTE WORK INFRASTRUCTURE:
Hardware: ${profile.hardwareAndSetup.devices.join(', ')}
Power Continuity: ${profile.hardwareAndSetup.powerBackup}
Internet: ${profile.hardwareAndSetup.connectivity}
B2B Invoicing: ${profile.payoutAndCompliance.supportedPayoutMethods.join(', ')}

================================================================================
TAILORED COVER LETTER
================================================================================

${coverLetter}
`;

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ATOMIC_Application_${currentJob.company.replace(/[^a-z0-9]/gi, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleQueueForApprovalClick = () => {
    if (!currentJob) return;
    const materials: ApplicationMaterials = {
      tailoredHeadline: headline,
      executiveSummary: summary,
      keyMatchingHighlights: bulletPoints,
      tailoredCoverLetter: coverLetter,
      recommendedPortfolioProjects: portfolio.slice(0, 2).map((p) => p.id),
      interviewPreparationNotes: interviewPrep || undefined,
    };
    onQueueForApproval(currentJob, materials);
    setQueuedNotification(true);
    setTimeout(() => setQueuedNotification(false), 3000);
  };

  if (!currentJob) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
        <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">No Eligible Vacancy Selected</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Please select a vacancy from the Discover Jobs tab to generate tailored, grounded application materials.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Studio Header & Target Job Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                CV & Cover Letter Studio
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Truthful Framing Guarantee
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Grounded Application Generator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generates materials strictly anchored in your WAEC education and verified AI Studio prototypes. Never invents college degrees or false employers.
            </p>
          </div>

          {/* Job Target Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Targeting:</span>
            <select
              value={currentJob.id}
              onChange={(e) => {
                const found = eligibleJobs.find((j) => j.id === e.target.value);
                if (found) onSelectJob(found);
              }}
              className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {eligibleJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.company}: {j.title} (${j.salary.minUSD}–${j.salary.maxUSD}/mo)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Job Context Card */}
        <div className="mt-4 p-3 bg-slate-950/40 rounded border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-slate-200">{currentJob.title}</span>
            <span className="text-slate-400 ml-2">at {currentJob.company}</span>
            <span className="text-emerald-400 ml-2">({currentJob.eligibility.badgeLabel})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-300">
              ${currentJob.salary.minUSD}–${currentJob.salary.maxUSD}/mo
            </span>
            <span className="text-slate-500 font-mono">
              (≈ ₦{currentJob.salary.ngnEquivalentPerMonth.min.toLocaleString()}–₦{currentJob.salary.ngnEquivalentPerMonth.max.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('cv')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 font-medium ${
              activeTab === 'cv'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tailored CV & Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('letter')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 font-medium ${
              activeTab === 'letter'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tailored Cover Letter</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 font-medium ${
              activeTab === 'interview'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interview Prep</span>
          </button>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-300 font-medium">
              Grounding application materials with Gemini 3.8 Flash...
            </p>
            <p className="text-[11px] text-slate-500">
              Aligning requirements without hallucinating tertiary degrees or fake credentials.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Tab 1: CV Highlights */}
            {activeTab === 'cv' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Professional Headline:
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tailored Executive Summary:
                  </label>
                  <textarea
                    rows={4}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-400 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Key Matching Competency Highlights (Demonstrated in AI Studio):
                  </label>
                  <div className="space-y-2">
                    {bulletPoints.map((bp, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 text-xs font-bold mt-2">•</span>
                        <input
                          type="text"
                          value={bp}
                          onChange={(e) => {
                            const updated = [...bulletPoints];
                            updated[idx] = e.target.value;
                            setBulletPoints(updated);
                          }}
                          className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grounded Education & Prototype Proof Anchors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
                  <div className="p-3 bg-slate-950/40 rounded border border-slate-800/60">
                    <span className="text-slate-400 block font-semibold mb-1">
                      Verified Education Record (WAEC):
                    </span>
                    <p className="text-slate-200">
                      {profile.education.qualification}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {profile.education.school} ({profile.education.yearCompleted}) · {profile.education.honors}
                    </p>
                    <span className="text-emerald-400 text-[10px] mt-1 block">
                      ✓ No fake degrees; portfolio demonstration establishes competence.
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950/40 rounded border border-slate-800/60">
                    <span className="text-slate-400 block font-semibold mb-1">
                      Attached Live Prototypes:
                    </span>
                    <ul className="text-slate-300 space-y-1 text-[11px]">
                      {portfolio.slice(0, 2).map((p) => (
                        <li key={p.id}>
                          • <span className="font-medium text-cyan-300">{p.title}</span> ({p.keyMetricOrOutcome})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Cover Letter */}
            {activeTab === 'letter' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Tailored Grounded Cover Letter:
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {coverLetter.length} characters
                  </span>
                </div>
                <textarea
                  rows={15}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>
            )}

            {/* Tab 3: Interview Prep */}
            {activeTab === 'interview' && (
              <div className="space-y-5">
                {interviewPrep ? (
                  <>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        High-Probability Technical Questions:
                      </h4>
                      <div className="space-y-2">
                        {interviewPrep.expectedQuestions.map((q, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-slate-950/60 border border-slate-800 rounded text-xs text-slate-300"
                          >
                            <span className="font-semibold text-cyan-300 block mb-1">
                              Question {idx + 1}:
                            </span>
                            {q}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Strategic Talking Points (Grounding in Actual Prototypes):
                      </h4>
                      <div className="space-y-2">
                        {interviewPrep.recommendedTalkingPoints.map((tp, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-slate-950/60 border border-slate-800 rounded text-xs text-slate-300"
                          >
                            <span className="font-semibold text-emerald-400 block mb-0.5">
                              Talking Point {idx + 1}:
                            </span>
                            {tp}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Live Demonstration Playbook:
                      </h4>
                      <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded text-xs text-cyan-200 space-y-1">
                        {interviewPrep.technicalProofDemonstrations.map((pd, idx) => (
                          <p key={idx}>• {pd}</p>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Loading interview preparation notes...
                  </div>
                )}
              </div>
            )}

            {/* Studio Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCurrent}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={handleDownloadPack}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full Dossier</span>
                </button>
              </div>

              {/* Primary action: Queue for User Approval */}
              <div className="flex items-center gap-3">
                {queuedNotification && (
                  <span className="text-xs text-emerald-400 font-medium animate-pulse">
                    Queued for your final review!
                  </span>
                )}
                <button
                  onClick={handleQueueForApprovalClick}
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Queue for Application Approval</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
