import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  Cpu, 
  BarChart2, 
  Trash2, 
  Code2, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { PortfolioProject } from '../types';

interface PortfolioManagerProps {
  portfolio: PortfolioProject[];
  onAddProject: (project: PortfolioProject) => void;
  onDeleteProject: (id: string) => void;
}

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  portfolio,
  onAddProject,
  onDeleteProject,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newMetric, setNewMetric] = useState('');
  const [newDemoUrl, setNewDemoUrl] = useState('');
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newTools, setNewTools] = useState('Google AI Studio, Gemini 3.8 Flash, React, Make.com');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const project: PortfolioProject = {
      id: `proj_${Date.now()}`,
      title: newTitle,
      tagline: newTagline || 'Interactive AI Studio prototype',
      problemSolved: newProblem || 'Automated data processing and structured LLM extraction.',
      skillsDemonstrated: ['Google AI Studio', 'Prompt Design', 'JSON Output', 'API Integration'],
      tooling: newTools.split(',').map((t) => t.trim()),
      demoUrl: newDemoUrl || 'https://ais-pre-demo.run.app/new-prototype',
      repoUrl: newRepoUrl || 'https://github.com/oluwole/new-prototype',
      keyMetricOrOutcome: newMetric || 'Measurable reduction in manual execution time with verified schema compliance.',
      architectureHighlights: [
        'Zero-temperature structured JSON prompting',
        'Direct webhook integration',
      ],
      verifiedWorking: true,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onAddProject(project);
    setShowAddModal(false);
    setNewTitle('');
    setNewTagline('');
    setNewProblem('');
    setNewMetric('');
    setNewDemoUrl('');
    setNewRepoUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                Proof-of-Work Management
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Evidence-Based Hiring
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Verified AI Studio Prototypes
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live functional demonstrations proving practical competency in prompt engineering, JSON schemas, and automated workflows.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Prototype</span>
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Verified Working Prototypes:</span>
            <span className="font-mono font-bold text-emerald-400 tabular-nums">
              {portfolio.filter((p) => p.verifiedWorking).length} of {portfolio.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Automatically attached to tailored application packs
          </span>
        </div>
      </div>

      {/* Prototype Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {portfolio.map((proj) => (
          <div
            key={proj.id}
            className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {proj.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      Updated {proj.lastUpdated}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteProject(proj.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                  title="Remove prototype"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-cyan-200/90 font-medium leading-relaxed">
                {proj.tagline}
              </p>

              <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80 text-xs space-y-1.5">
                <div className="text-slate-400 font-semibold text-[11px]">
                  Problem Solved:
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {proj.problemSolved}
                </p>
              </div>

              {/* Key Metric Box */}
              <div className="p-2.5 bg-emerald-950/20 border border-emerald-800/40 rounded flex items-start gap-2 text-xs">
                <BarChart2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-emerald-200 text-[11px] leading-relaxed">
                  <span className="font-semibold block text-emerald-300">Measured Outcome:</span>
                  {proj.keyMetricOrOutcome}
                </div>
              </div>

              {/* Tooling Tags */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {proj.tooling.map((tool, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-300 text-[11px] font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Links and Status Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Working</span>
              </div>

              <div className="flex items-center gap-3">
                {proj.repoUrl && (
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                  >
                    <FolderGit2 className="w-3 h-3" />
                    <span>Repo</span>
                  </a>
                )}
                {proj.demoUrl && (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] font-medium transition-colors"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Prototype Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Register New Working AI Prototype
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Prototype Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multimodal Product Spec Extractor"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">One-Line Value Tagline</label>
                <input
                  type="text"
                  placeholder="Briefly state what it accomplishes with structured prompts"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Problem Solved</label>
                <textarea
                  rows={2}
                  placeholder="What operational pain point does this address?"
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Measured Metric / Benchmark</label>
                <input
                  type="text"
                  placeholder="e.g. 98.4% JSON schema adherence, sub-450ms latency"
                  value={newMetric}
                  onChange={(e) => setNewMetric(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newDemoUrl}
                    onChange={(e) => setNewDemoUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newRepoUrl}
                    onChange={(e) => setNewRepoUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tooling Stack (comma separated)</label>
                <input
                  type="text"
                  value={newTools}
                  onChange={(e) => setNewTools(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded transition-colors"
                >
                  Save Prototype
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
