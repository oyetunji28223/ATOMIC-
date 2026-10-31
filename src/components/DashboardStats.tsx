import React from 'react';
import { Globe, DollarSign, CheckCircle2, ShieldAlert, Cpu, BatteryCharging } from 'lucide-react';
import { JobListing, TrackedApplication, UserProfile } from '../types';

interface DashboardStatsProps {
  jobs: JobListing[];
  applications: TrackedApplication[];
  profile: UserProfile;
  onFilterEligibleClick: () => void;
  onViewApplicationsClick: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  jobs,
  applications,
  profile,
  onFilterEligibleClick,
  onViewApplicationsClick,
}) => {
  const fullyEligibleCount = jobs.filter((j) => j.eligibility.status === 'ELIGIBLE').length;
  const ineligibleCount = jobs.filter((j) => j.eligibility.status === 'INELIGIBLE').length;
  const submittedCount = applications.filter((a) => a.status === 'Submitted to Employer').length;
  const pendingApprovalCount = applications.filter((a) => a.status === 'Pending Approval').length;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 sm:p-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Career Intelligence Center</span>
            <span aria-hidden="true">·</span>
            <span>West Africa Time (UTC+1)</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">B2B Contractor Ready</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Welcome back, {profile.fullName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Targeting {profile.careerTarget.primaryRole} & {profile.careerTarget.secondaryRole} roles with portfolio-backed demonstration.
          </p>
        </div>

        {/* Quick Operational Status Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 rounded border border-slate-700/60 text-slate-300">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span>Solar Inverter (8h)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 rounded border border-slate-700/60 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Deel / Payoneer Ready</span>
          </div>
        </div>
      </div>

      {/* 4-KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {/* Metric 1 */}
        <div className="p-3 bg-slate-950/40 rounded border border-slate-800/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Target</span>
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              ${profile.careerTarget.monthlyIncomeGoalUSD.min}–${profile.careerTarget.monthlyIncomeGoalUSD.max}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5 tabular-nums">
            ≈ ₦750,000–₦1,500,000/mo
          </div>
        </div>

        {/* Metric 2 */}
        <button
          onClick={onFilterEligibleClick}
          className="p-3 bg-slate-950/40 rounded border border-slate-800/50 text-left hover:border-emerald-500/50 transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Nigeria Eligible Jobs</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-400 group-hover:text-emerald-300">
              {fullyEligibleCount}
            </span>
            <span className="text-xs text-slate-400">of {jobs.length} listed</span>
          </div>
          <div className="text-[11px] text-emerald-500/80 font-medium mt-0.5">
            100% remote contractor approved
          </div>
        </button>

        {/* Metric 3 */}
        <div className="p-3 bg-slate-950/40 rounded border border-slate-800/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ineligible Filtered</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-rose-400">
              {ineligibleCount}
            </span>
            <span className="text-xs text-slate-400">auto-flagged</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Time saved on restricted postings
          </div>
        </div>

        {/* Metric 4 */}
        <button
          onClick={onViewApplicationsClick}
          className="p-3 bg-slate-950/40 rounded border border-slate-800/50 text-left hover:border-cyan-500/50 transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Application Pipeline</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-cyan-400 group-hover:text-cyan-300">
              {applications.length}
            </span>
            <span className="text-xs text-slate-400">
              ({submittedCount} sent, {pendingApprovalCount} pending)
            </span>
          </div>
          <div className="text-[11px] text-cyan-500/80 font-medium mt-0.5">
            Zero auto-submissions without review
          </div>
        </button>
      </div>
    </div>
  );
};
