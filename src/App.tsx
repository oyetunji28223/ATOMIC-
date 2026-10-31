/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CURATED_JOB_LISTINGS } from './data/curatedJobs';
import { INITIAL_USER_PROFILE } from './data/defaultProfile';
import { INITIAL_PORTFOLIO_PROJECTS } from './data/initialPortfolio';
import { INITIAL_APPLICATIONS } from './data/initialApplications';
import { 
  ApplicationMaterials, 
  ApplicationStatus, 
  JobListing, 
  PortfolioProject, 
  TrackedApplication, 
  UserProfile 
} from './types';

import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { JobDiscovery } from './components/JobDiscovery';
import { MatchInspector } from './components/MatchInspector';
import { CVStudio } from './components/CVStudio';
import { ApplicationTracker } from './components/ApplicationTracker';
import { UserProfileHub } from './components/UserProfileHub';
import { PortfolioManager } from './components/PortfolioManager';
import { MobileNav } from './components/MobileNav';

export default function App() {
  // State: Active View Tab
  const [activeTab, setActiveTab] = useState<string>('discover');

  // State: Profile (with localStorage persistence)
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('atomic_user_profile');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  // State: Portfolio Projects (with localStorage persistence)
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(() => {
    try {
      const saved = localStorage.getItem('atomic_portfolio');
      return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO_PROJECTS;
    } catch {
      return INITIAL_PORTFOLIO_PROJECTS;
    }
  });

  // State: Applications (with localStorage persistence)
  const [applications, setApplications] = useState<TrackedApplication[]>(() => {
    try {
      const saved = localStorage.getItem('atomic_applications');
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  // State: Jobs (loaded from server or curated list)
  const [jobs, setJobs] = useState<JobListing[]>(CURATED_JOB_LISTINGS);

  // Modal / Inspection state
  const [selectedJobForMatch, setSelectedJobForMatch] = useState<JobListing | null>(null);
  const [selectedJobForStudio, setSelectedJobForStudio] = useState<JobListing | null>(null);

  // Fast filter triggers
  const [discoveryFilter, setDiscoveryFilter] = useState<string>('ALL');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('atomic_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('atomic_portfolio', JSON.stringify(portfolio));
    } catch (e) {
      console.error(e);
    }
  }, [portfolio]);

  useEffect(() => {
    try {
      localStorage.setItem('atomic_applications', JSON.stringify(applications));
    } catch (e) {
      console.error(e);
    }
  }, [applications]);

  // Fetch live jobs from API endpoint
  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      })
      .catch((err) => {
        console.warn('Using client-side curated listings:', err);
      });
  }, []);

  // Application Actions
  const handleSaveJobToApplications = (job: JobListing) => {
    // Check if already in applications
    const existing = applications.find((a) => a.jobId === job.id);
    if (existing) return;

    const newApp: TrackedApplication = {
      id: `app_${job.id}_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      companyWebsite: job.companyWebsite,
      applicationUrl: job.sourceUrl,
      status: 'Saved',
      dateSaved: new Date().toISOString().split('T')[0],
      userApprovalConfirmed: false,
      materials: {
        tailoredHeadline: `AI Product Builder & Prototype Specialist | Google AI Studio`,
        executiveSummary: `Targeting ${job.title} at ${job.company}. Practical developer with WAEC education and live Gemini prototypes.`,
        keyMatchingHighlights: [
          'Demonstrated Google AI Studio prompt calibration with structured JSON outputs.',
          'Solar power backup and fiber internet for remote contractor engagement.',
        ],
        tailoredCoverLetter: `Dear Hiring Team at ${job.company},\n\nI am writing to express my interest in the ${job.title} vacancy...`,
        recommendedPortfolioProjects: portfolio.slice(0, 2).map((p) => p.id),
      },
      notes: `Discovered from ${job.source}. Eligible: ${job.eligibility.badgeLabel}`,
      targetSalaryUSD: job.salary.minUSD,
    };

    setApplications([newApp, ...applications]);
  };

  const handleQueueForApproval = (job: JobListing, materials: ApplicationMaterials) => {
    const existingIndex = applications.findIndex((a) => a.jobId === job.id);
    if (existingIndex >= 0) {
      const updated = [...applications];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status: 'Pending Approval',
        materials,
      };
      setApplications(updated);
    } else {
      const newApp: TrackedApplication = {
        id: `app_${job.id}_${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        companyWebsite: job.companyWebsite,
        applicationUrl: job.sourceUrl,
        status: 'Pending Approval',
        dateSaved: new Date().toISOString().split('T')[0],
        userApprovalConfirmed: false,
        materials,
        notes: `Application dossier generated in Studio. Awaiting explicit user approval.`,
        targetSalaryUSD: job.salary.minUSD,
      };
      setApplications([newApp, ...applications]);
    }
    setActiveTab('applications');
  };

  const handleApproveApplication = (id: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id
          ? {
              ...app,
              status: 'Approved by User',
              userApprovalConfirmed: true,
              dateApproved: new Date().toISOString().split('T')[0],
            }
          : app
      )
    );
  };

  const handleMarkSubmitted = (id: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id
          ? {
              ...app,
              status: 'Submitted to Employer',
              dateSubmitted: new Date().toISOString().split('T')[0],
            }
          : app
      )
    );
  };

  const handleUpdateStatus = (id: string, newStatus: ApplicationStatus) => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, notes } : app))
    );
  };

  const handleUpdateFollowUp = (id: string, date: string) => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, followUpDate: date } : app))
    );
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  const handleOpenMaterials = (app: TrackedApplication) => {
    const job = jobs.find((j) => j.id === app.jobId);
    if (job) {
      setSelectedJobForStudio(job);
      setActiveTab('studio');
    }
  };

  const savedJobIds = new Set(applications.map((a) => a.jobId));
  const pendingApprovalsCount = applications.filter((a) => a.status === 'Pending Approval').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 lg:pb-8">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Persistent High-Yield Dashboard Metric Bar */}
        <DashboardStats
          jobs={jobs}
          applications={applications}
          profile={profile}
          onFilterEligibleClick={() => {
            setDiscoveryFilter('ELIGIBLE');
            setActiveTab('discover');
          }}
          onViewApplicationsClick={() => {
            setActiveTab('applications');
          }}
        />

        {/* View Routing */}
        {activeTab === 'discover' && (
          <JobDiscovery
            jobs={jobs}
            profile={profile}
            onSelectJobForMatch={(job) => setSelectedJobForMatch(job)}
            onSelectJobForTailor={(job) => {
              setSelectedJobForStudio(job);
              setActiveTab('studio');
            }}
            onSaveJobToApplications={handleSaveJobToApplications}
            savedJobIds={savedJobIds}
            initialFilter={discoveryFilter}
          />
        )}

        {activeTab === 'match' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <h2 className="text-lg font-bold text-white">100-Point Match Simulator</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select any vacancy from the job directory to review transparent rubric scoring and legal gatekeeper compliance.
              </p>
            </div>
            <JobDiscovery
              jobs={jobs}
              profile={profile}
              onSelectJobForMatch={(job) => setSelectedJobForMatch(job)}
              onSelectJobForTailor={(job) => {
                setSelectedJobForStudio(job);
                setActiveTab('studio');
              }}
              onSaveJobToApplications={handleSaveJobToApplications}
              savedJobIds={savedJobIds}
            />
          </div>
        )}

        {activeTab === 'studio' && (
          <CVStudio
            selectedJob={selectedJobForStudio}
            allJobs={jobs}
            onSelectJob={(job) => setSelectedJobForStudio(job)}
            profile={profile}
            portfolio={portfolio}
            onQueueForApproval={handleQueueForApproval}
          />
        )}

        {activeTab === 'applications' && (
          <ApplicationTracker
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onUpdateNotes={handleUpdateNotes}
            onUpdateFollowUp={handleUpdateFollowUp}
            onDeleteApplication={handleDeleteApplication}
            onApproveApplication={handleApproveApplication}
            onMarkSubmitted={handleMarkSubmitted}
            onOpenMaterials={handleOpenMaterials}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioManager
            portfolio={portfolio}
            onAddProject={(proj) => setPortfolio([proj, ...portfolio])}
            onDeleteProject={(id) => setPortfolio(portfolio.filter((p) => p.id !== id))}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfileHub
            profile={profile}
            onSaveProfile={(updated) => setProfile(updated)}
          />
        )}
      </main>

      {/* 100-Point Match Inspector Modal */}
      {selectedJobForMatch && (
        <MatchInspector
          job={selectedJobForMatch}
          profile={profile}
          portfolio={portfolio}
          onClose={() => setSelectedJobForMatch(null)}
          onProceedToTailor={(job) => {
            setSelectedJobForStudio(job);
            setActiveTab('studio');
          }}
          onSaveJob={handleSaveJobToApplications}
          isSaved={savedJobIds.has(selectedJobForMatch.id)}
        />
      )}

      {/* Touch-Friendly Android Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
      />
    </div>
  );
}
