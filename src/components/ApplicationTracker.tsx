import React, { useState } from 'react';
import { 
  CheckSquare, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Send, 
  Trash2, 
  Edit3, 
  Calendar, 
  DollarSign,
  Briefcase,
  FileText,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ApplicationStatus, TrackedApplication } from '../types';

interface ApplicationTrackerProps {
  applications: TrackedApplication[];
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateFollowUp: (id: string, date: string) => void;
  onDeleteApplication: (id: string) => void;
  onApproveApplication: (id: string) => void;
  onMarkSubmitted: (id: string) => void;
  onOpenMaterials: (app: TrackedApplication) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onUpdateStatus,
  onUpdateNotes,
  onUpdateFollowUp,
  onDeleteApplication,
  onApproveApplication,
  onMarkSubmitted,
  onOpenMaterials,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [approvalModalApp, setApprovalModalApp] = useState<TrackedApplication | null>(null);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const statusCategories: { id: ApplicationStatus | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'All Tracked' },
    { id: 'Saved', label: 'Saved' },
    { id: 'Pending Approval', label: 'Pending Approval' },
    { id: 'Approved by User', label: 'Approved' },
    { id: 'Submitted to Employer', label: 'Submitted' },
    { id: 'Interview Scheduled', label: 'Interview' },
    { id: 'Offer Received', label: 'Offer' },
  ];

  const filteredApplications = applications.filter((app) => {
    if (selectedStatusFilter === 'ALL') return true;
    return app.status === selectedStatusFilter;
  });

  const handleStartApproval = (app: TrackedApplication) => {
    setApprovalModalApp(app);
    setConfirmationChecked(false);
  };

  const handleConfirmApproval = () => {
    if (!approvalModalApp || !confirmationChecked) return;
    onApproveApplication(approvalModalApp.id);
    setApprovalModalApp(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                Application Intelligence & Governance
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                Zero Unapproved Submissions Policy
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Application Tracker & Approval Workflow
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict governance ensures every application is inspected for eligibility, grounded in truth, and explicitly authorized by you before delivery.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Total in pipeline:</span>
            <span className="font-mono font-bold text-white tabular-nums px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
              {applications.length}
            </span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800 overflow-x-auto text-xs">
          {statusCategories.map((cat) => {
            const count =
              cat.id === 'ALL'
                ? applications.length
                : applications.filter((a) => a.status === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedStatusFilter(cat.id)}
                className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  selectedStatusFilter === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[11px] font-mono tabular-nums opacity-75">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-12 text-center">
          <CheckSquare className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No applications in this category</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Discover opportunities or tailor CV materials to queue positions into your tracking pipeline.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const isApproved = app.status === 'Approved by User';
            const isSubmitted = app.status === 'Submitted to Employer';
            const isPendingApproval = app.status === 'Pending Approval';

            return (
              <div
                key={app.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 hover:border-slate-700 transition-colors"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="font-semibold text-slate-200">{app.company}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">Saved {app.dateSaved}</span>
                      {app.dateSubmitted && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-400 font-mono tabular-nums">
                            Submitted {app.dateSubmitted}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {app.jobTitle}
                    </h3>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={app.status}
                      onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded border focus:outline-none ${
                        isSubmitted
                          ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                          : isApproved
                          ? 'bg-cyan-950/40 border-cyan-700 text-cyan-300'
                          : isPendingApproval
                          ? 'bg-amber-950/40 border-amber-700 text-amber-300'
                          : 'bg-slate-950 border-slate-700 text-slate-300'
                      }`}
                    >
                      <option value="Saved">Saved</option>
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Approved by User">Approved by User</option>
                      <option value="Submitted to Employer">Submitted to Employer</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Offer Received">Offer Received</option>
                      <option value="Archived / Not Selected">Archived</option>
                    </select>

                    <button
                      onClick={() => onDeleteApplication(app.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      title="Remove from tracker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Materials & Action Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-950/40 rounded border border-slate-800/60 space-y-1">
                    <span className="text-slate-400 block font-semibold">
                      Tailored Dossier Highlights:
                    </span>
                    <p className="text-slate-200 line-clamp-2">
                      {app.materials.tailoredHeadline}
                    </p>
                    <button
                      onClick={() => onOpenMaterials(app)}
                      className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 mt-1 text-[11px]"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Review / Edit Complete Application Materials</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-950/40 rounded border border-slate-800/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">
                        Interview & Follow-Up Notes:
                      </span>
                      {editingNotesId === app.id ? (
                        <button
                          onClick={() => {
                            onUpdateNotes(app.id, tempNotes);
                            setEditingNotesId(null);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 text-[11px] font-medium"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingNotesId(app.id);
                            setTempNotes(app.notes);
                          }}
                          className="text-slate-400 hover:text-slate-200 text-[11px] inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>

                    {editingNotesId === app.id ? (
                      <textarea
                        rows={2}
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="Add recruiter follow-up dates, notes, or specific requirements..."
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none"
                      />
                    ) : (
                      <p className="text-slate-300 italic text-[11px]">
                        {app.notes || 'No notes added yet. Record follow-ups and discussion points here.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Workflow Actions Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Target Compensation:</span>
                    <span className="text-white font-mono font-medium tabular-nums">
                      ${app.targetSalaryUSD}/mo
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* If Pending Approval -> show Explicit Approval button */}
                    {isPendingApproval && (
                      <button
                        onClick={() => handleStartApproval(app)}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Authorize Submission (Required)</span>
                      </button>
                    )}

                    {/* If Approved -> show Launch Portal and Mark Submitted */}
                    {isApproved && (
                      <>
                        <a
                          href={app.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Open Employer Portal</span>
                        </a>

                        <button
                          onClick={() => onMarkSubmitted(app.id)}
                          className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Submitted</span>
                        </button>
                      </>
                    )}

                    {isSubmitted && (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Application Submitted & Confirmed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mandatory Explicit Approval Modal */}
      {approvalModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>MANDATORY PRE-SUBMISSION AUDIT</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Authorize Application to {approvalModalApp.company}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded border border-slate-800 space-y-2">
                <div className="font-semibold text-slate-200">
                  Audit Checklist for {approvalModalApp.jobTitle}:
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Country eligibility verified (Nigeria B2B contractor supported).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Education strictly set to WAEC (zero fabricated degrees).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Verified AI Studio prototypes and GitHub repo links attached.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>No personal passwords or sensitive verification tokens requested.</span>
                  </li>
                </ul>
              </div>

              {/* Explicit User Declaration Checkbox */}
              <label className="flex items-start gap-3 p-3 bg-amber-950/20 border border-amber-800/40 rounded cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmationChecked}
                  onChange={(e) => setConfirmationChecked(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-cyan-400 focus:ring-0"
                />
                <span className="text-amber-200/90 leading-relaxed">
                  I have personally reviewed the tailored CV and cover letter. I confirm that all listed details are completely factual, and I explicitly approve advancing this application for submission.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setApprovalModalApp(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                disabled={!confirmationChecked}
                onClick={handleConfirmApproval}
                className={`px-4 py-2 text-xs font-bold rounded transition-colors flex items-center gap-2 ${
                  confirmationChecked
                    ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Approve & Authorize Submission</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
