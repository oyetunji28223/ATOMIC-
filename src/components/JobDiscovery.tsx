import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  ExternalLink, 
  DollarSign, 
  Clock, 
  GraduationCap, 
  Briefcase, 
  Sparkles,
  FileText,
  Filter,
  Check
} from 'lucide-react';
import { JobListing, UserProfile } from '../types';

interface JobDiscoveryProps {
  jobs: JobListing[];
  profile: UserProfile;
  onSelectJobForMatch: (job: JobListing) => void;
  onSelectJobForTailor: (job: JobListing) => void;
  onSaveJobToApplications: (job: JobListing) => void;
  savedJobIds: Set<string>;
  initialFilter?: string;
}

export const JobDiscovery: React.FC<JobDiscoveryProps> = ({
  jobs,
  profile,
  onSelectJobForMatch,
  onSelectJobForTailor,
  onSaveJobToApplications,
  savedJobIds,
  initialFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState<string>(initialFilter || 'ALL');
  const [educationFilter, setEducationFilter] = useState<string>('ALL');
  const [salaryFilter, setSalaryFilter] = useState<string>('ALL');

  // Filtered jobs logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.description.toLowerCase().includes(q) ||
          job.mandatoryRequirements.some((r) => r.toLowerCase().includes(q)) ||
          job.preferredSkills.some((s) => s.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      // Eligibility filter
      if (eligibilityFilter !== 'ALL') {
        if (job.eligibility.status !== eligibilityFilter) return false;
      }

      // Education filter
      if (educationFilter === 'NO_DEGREE') {
        if (job.educationRequirement.includes('Bachelor')) return false;
      } else if (educationFilter === 'DEGREE_REQUIRED') {
        if (!job.educationRequirement.includes('Bachelor')) return false;
      }

      // Salary filter
      if (salaryFilter === 'TARGET_MATCH') {
        // Between $500 and $1,000/mo
        const minMatches = job.salary.minUSD >= 500 && job.salary.minUSD <= 1200;
        if (!minMatches) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, eligibilityFilter, educationFilter, salaryFilter]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vacancies by title, tool (AI Studio, Gemini, n8n, Make), or company..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Clear Filters */}
          {(eligibilityFilter !== 'ALL' || educationFilter !== 'ALL' || salaryFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setEligibilityFilter('ALL');
                setEducationFilter('ALL');
                setSalaryFilter('ALL');
                setSearchQuery('');
              }}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded transition-colors whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 mt-4 pt-4 border-t border-slate-800 text-xs">
          {/* Eligibility Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Eligibility:
            </span>
            <button
              onClick={() => setEligibilityFilter('ALL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                eligibilityFilter === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              All Listed ({jobs.length})
            </button>
            <button
              onClick={() => setEligibilityFilter('ELIGIBLE')}
              className={`px-2.5 py-1 rounded transition-colors ${
                eligibilityFilter === 'ELIGIBLE'
                  ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Nigeria Eligible ({jobs.filter((j) => j.eligibility.status === 'ELIGIBLE').length})
            </button>
            <button
              onClick={() => setEligibilityFilter('INELIGIBLE')}
              className={`px-2.5 py-1 rounded transition-colors ${
                eligibilityFilter === 'INELIGIBLE'
                  ? 'bg-rose-500/20 text-rose-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Ineligible ({jobs.filter((j) => j.eligibility.status === 'INELIGIBLE').length})
            </button>
          </div>

          {/* Education Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Education:
            </span>
            <button
              onClick={() => setEducationFilter('ALL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                educationFilter === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setEducationFilter('NO_DEGREE')}
              className={`px-2.5 py-1 rounded transition-colors ${
                educationFilter === 'NO_DEGREE'
                  ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              WAEC / Portfolio-First
            </button>
            <button
              onClick={() => setEducationFilter('DEGREE_REQUIRED')}
              className={`px-2.5 py-1 rounded transition-colors ${
                educationFilter === 'DEGREE_REQUIRED'
                  ? 'bg-rose-500/20 text-rose-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Strict BS Degree
            </button>
          </div>

          {/* Salary Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              Target Comp:
            </span>
            <button
              onClick={() => setSalaryFilter('ALL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                salaryFilter === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Any Range
            </button>
            <button
              onClick={() => setSalaryFilter('TARGET_MATCH')}
              className={`px-2.5 py-1 rounded transition-colors ${
                salaryFilter === 'TARGET_MATCH'
                  ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Matches Goal ($500–$1,000/mo)
            </button>
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 bg-slate-900/50 border border-slate-800/80 rounded-lg text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-slate-300">
            <span className="font-semibold text-white">ATOMIC AI Safety & Verification Standard:</span>{' '}
            All opportunities show source provenance, last audit date, and payout viability for Nigerian independent contractors. External links are untrusted third-party URLs; no application is ever submitted without your explicit, reviewed approval.
          </p>
        </div>
      </div>

      {/* Vacancy Card List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-lg p-6">
            <Briefcase className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-200">No matching vacancies found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Try relaxing your search terms or resetting filters to see all available international remote opportunities.
            </p>
            <button
              onClick={() => {
                setEligibilityFilter('ALL');
                setEducationFilter('ALL');
                setSalaryFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isEligible = job.eligibility.status === 'ELIGIBLE';
            const isIneligible = job.eligibility.status === 'INELIGIBLE';
            const isConditional = job.eligibility.status === 'CONDITIONAL';
            const isSaved = savedJobIds.has(job.id);

            return (
              <div
                key={job.id}
                className={`bg-slate-900 border rounded-lg p-5 transition-all ${
                  isIneligible
                    ? 'border-slate-800/80 opacity-80 hover:opacity-100'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Row: Title, Company, Eligibility Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800/70">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="font-medium text-slate-300">{job.company}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.remoteScope}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">Posted {job.postedDate}</span>
                      {job.isSponsored && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-medium">Sponsored</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {job.title}
                    </h3>
                  </div>

                  {/* Country Eligibility Status */}
                  <div className="shrink-0">
                    {isEligible && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Nigeria Remote Approved</span>
                      </div>
                    )}
                    {isConditional && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Conditional Contractor</span>
                      </div>
                    )}
                    {isIneligible && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Ineligible for Nigeria</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compensation & Key Metadata Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 py-3 bg-slate-950/40 rounded px-3 border border-slate-800/50 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Monthly Compensation</span>
                    <span className="font-mono font-bold text-sm text-white tabular-nums">
                      ${job.salary.minUSD.toLocaleString()}–${job.salary.maxUSD.toLocaleString()}/mo
                    </span>
                    <span className="block text-[11px] text-slate-400 font-mono tabular-nums">
                      ≈ ₦{job.salary.ngnEquivalentPerMonth.min.toLocaleString()}–₦{job.salary.ngnEquivalentPerMonth.max.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Education Criteria</span>
                    <span className={`font-medium ${isIneligible ? 'text-rose-300' : 'text-slate-200'}`}>
                      {job.educationRequirement}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {job.experienceLevel}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Contract & Payout</span>
                    <span className="text-slate-200 font-medium">
                      {job.eligibility.contractType}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      Via {job.payoutMethods.slice(0, 3).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Country Eligibility Details Banner */}
                <div
                  className={`p-3 rounded text-xs mb-4 ${
                    isEligible
                      ? 'bg-emerald-950/20 border border-emerald-800/40 text-emerald-200/90'
                      : isConditional
                      ? 'bg-amber-950/20 border border-amber-800/40 text-amber-200/90'
                      : 'bg-rose-950/25 border border-rose-800/40 text-rose-200/90'
                  }`}
                >
                  <div className="font-semibold mb-1 flex items-center justify-between">
                    <span>Eligibility Assessment for Nigerian Applicants:</span>
                    <span className="font-mono text-[11px] opacity-80">
                      Timezone: {job.eligibility.timezoneCompatibility}
                    </span>
                  </div>
                  <ul className="space-y-0.5 list-disc list-inside text-[11px] opacity-90">
                    {job.eligibility.reasons.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>

                {/* Description Excerpt */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                  {job.description}
                </p>

                {/* Key Skills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs">
                  <span className="text-slate-500 mr-1 text-[11px]">Required:</span>
                  {job.mandatoryRequirements.slice(0, 4).map((req, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono"
                    >
                      {req.length > 36 ? req.substring(0, 36) + '...' : req}
                    </span>
                  ))}
                </div>

                {/* Verification & Provenance Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{job.verification.verificationBadge}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">Source: {job.source}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">Audited {job.verification.lastCheckedDate}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectJobForMatch(job)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded font-medium transition-colors flex items-center gap-1.5 text-xs"
                      title="Inspect transparent 100-point rubric breakdown"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Inspect 100-Pt Match</span>
                    </button>

                    {!isIneligible && (
                      <button
                        onClick={() => onSelectJobForTailor(job)}
                        className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded font-medium transition-colors flex items-center gap-1.5 text-xs"
                        title="Open CV & cover letter studio for this position"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Tailor Application</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSaveJobToApplications(job)}
                      className={`px-2.5 py-1.5 rounded transition-colors text-xs font-medium flex items-center gap-1 ${
                        isSaved
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                      }`}
                      title={isSaved ? 'Job already tracked in pipeline' : 'Save to application pipeline'}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tracked</span>
                        </>
                      ) : (
                        <span>Track</span>
                      )}
                    </button>

                    <a
                      href={job.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                      title="View external job listing source (untrusted external URL)"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
