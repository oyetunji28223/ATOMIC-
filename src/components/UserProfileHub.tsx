import React, { useState } from 'react';
import { 
  UserCheck, 
  GraduationCap, 
  Laptop, 
  Cpu, 
  DollarSign, 
  ShieldCheck, 
  Save, 
  BatteryCharging, 
  Globe, 
  Smartphone,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileHubProps {
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

export const UserProfileHub: React.FC<UserProfileHubProps> = ({
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                Verified Career Intelligence Profile
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Truthful Credentials Standard
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Candidate Dossier & Contractor Readiness
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified operational baseline for international remote hiring. Accurately reflects your WAEC secondary education, solar power setup, and live AI Studio prototypes.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-2 shadow-sm self-start md:self-auto"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                <span>Profile Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        {/* Operational Reliability Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-2 text-xs">
          <div className="p-3 bg-slate-950/40 rounded border border-slate-800/60 flex items-center gap-3">
            <BatteryCharging className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Power Continuity</span>
              <span className="font-semibold text-slate-200">Solar Inverter (8+ hrs backup)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/40 rounded border border-slate-800/60 flex items-center gap-3">
            <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Timezone Alignment</span>
              <span className="font-semibold text-slate-200">WAT (UTC+1 · 0-1h UK/EU sync)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/40 rounded border border-slate-800/60 flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Device Hardware</span>
              <span className="font-semibold text-slate-200">Laptop + Android Phone QA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Personal & Contact */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Personal & Location Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Country</label>
              <input
                type="text"
                disabled
                value={formData.country}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">City / State</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Timezone</label>
              <input
                type="text"
                disabled
                value={formData.timezone}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Education (Strict Truthfulness Enforcement) */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Grounded Educational Background</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Never Fabricate Degrees</span>
            </div>
          </div>

          <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded text-xs text-cyan-200/90 leading-relaxed">
            ATOMIC Safety Constitution strictly honors your authentic secondary education (WAEC). International employers hiring for prototype builders and automation specialists value verified live portfolio demonstrations over paper credentials.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Highest Qualification</label>
              <input
                type="text"
                value={formData.education.qualification}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: { ...formData.education, qualification: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Secondary School</label>
              <input
                type="text"
                value={formData.education.school}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: { ...formData.education, school: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Year Completed</label>
              <input
                type="text"
                value={formData.education.yearCompleted}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: { ...formData.education, yearCompleted: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Career Targets & Income */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            <span>Target Roles & Income Goal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Primary Target Role</label>
              <input
                type="text"
                value={formData.careerTarget.primaryRole}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    careerTarget: { ...formData.careerTarget, primaryRole: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Secondary Target Role</label>
              <input
                type="text"
                value={formData.careerTarget.secondaryRole}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    careerTarget: { ...formData.careerTarget, secondaryRole: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Min Target (USD/mo)</label>
              <input
                type="number"
                value={formData.careerTarget.monthlyIncomeGoalUSD.min}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    careerTarget: {
                      ...formData.careerTarget,
                      monthlyIncomeGoalUSD: {
                        ...formData.careerTarget.monthlyIncomeGoalUSD,
                        min: Number(e.target.value),
                      },
                    },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <span className="text-[10px] text-slate-500 font-mono block mt-1">
                ≈ ₦{(formData.careerTarget.monthlyIncomeGoalUSD.min * 1500).toLocaleString()}/mo
              </span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Max Target (USD/mo)</label>
              <input
                type="number"
                value={formData.careerTarget.monthlyIncomeGoalUSD.max}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    careerTarget: {
                      ...formData.careerTarget,
                      monthlyIncomeGoalUSD: {
                        ...formData.careerTarget.monthlyIncomeGoalUSD,
                        max: Number(e.target.value),
                      },
                    },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <span className="text-[10px] text-slate-500 font-mono block mt-1">
                ≈ ₦{(formData.careerTarget.monthlyIncomeGoalUSD.max * 1500).toLocaleString()}/mo
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Demonstrated Technical Tools */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Demonstrated Tools & Prototyping Stack</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">
                Primary AI & Prompting Competencies:
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.technicalExperience.primaryTools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-slate-300 font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Automation & Integration Platforms:
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.technicalExperience.automationTools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-slate-300 font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Technical Summary Prose:
              </label>
              <textarea
                rows={3}
                value={formData.technicalExperience.summary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    technicalExperience: {
                      ...formData.technicalExperience,
                      summary: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Payout & Compliance Readiness */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>International Contractor Payout & Tax Readiness</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-950/40 rounded border border-slate-800/60 space-y-1">
              <span className="text-slate-400 font-semibold block">Supported Payout Channels:</span>
              <ul className="text-slate-300 space-y-0.5">
                {formData.payoutAndCompliance.supportedPayoutMethods.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-950/40 rounded border border-slate-800/60 space-y-2">
              <div>
                <span className="text-slate-400 font-semibold block">Government Identity Status:</span>
                <span className="text-slate-200">
                  {formData.payoutAndCompliance.identityStatus}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">International Tax Compliance:</span>
                <span className="text-slate-200">
                  {formData.payoutAndCompliance.taxContractReadiness}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
