import { TrackedApplication } from '../types';

export const INITIAL_APPLICATIONS: TrackedApplication[] = [
  {
    id: 'app_promptflow_01',
    jobId: 'job_promptflow_ai_builder',
    jobTitle: 'Junior AI Prototype Builder & Workflow Specialist',
    company: 'PromptFlow Studios (UK / Remote)',
    companyWebsite: 'https://promptflowstudios.io',
    applicationUrl: 'https://weworkremotely.com/remote-jobs/promptflow-junior-ai-builder',
    status: 'Pending Approval',
    dateSaved: '2026-10-26',
    userApprovalConfirmed: false,
    materials: {
      tailoredHeadline: 'AI Product Builder & Prompt Workflow Specialist | Google AI Studio & Structured Outputs',
      executiveSummary: 'Hands-on AI Product Builder based in Lagos, Nigeria (WAT UTC+1), with proven expertise in Google AI Studio, structured prompt engineering, and end-to-end automation pipelines. Backed by functional live prototypes with 98%+ schema compliance, WAEC science distinction, and reliable solar/fiber infrastructure for remote contractor roles.',
      keyMatchingHighlights: [
        'Google AI Studio Specialization: Designed zero-hallucination prompt architectures using Gemini 3.8 Flash with structured JSON schemas.',
        'End-to-End Prototyping: Built interactive customer triage and multimodal catalog extractors using React and n8n webhooks.',
        'International Remote Readiness: Registered Deel/Payoneer contractor with dedicated solar power backup (8+ hours) and dual high-speed internet.',
      ],
      tailoredCoverLetter: 'Dear Hiring Team at PromptFlow Studios,\n\nI am writing to express my strong enthusiasm for the Junior AI Prototype Builder position...',
      recommendedPortfolioProjects: ['proj_ai_studio_triage', 'proj_catalog_extractor'],
    },
    notes: 'Recruiter stated in ATS posting that live prototype demos bypass initial phone screening.',
    targetSalaryUSD: 850,
    followUpDate: '2026-11-04',
  },
  {
    id: 'app_synthex_02',
    jobId: 'job_synthex_automation_junior',
    jobTitle: 'Junior AI Automation Specialist (Make / n8n / Gemini)',
    company: 'Synthex Automation Labs',
    companyWebsite: 'https://synthexlabs.co',
    applicationUrl: 'https://remotive.com/remote-jobs/synthex-automation-specialist',
    status: 'Saved',
    dateSaved: '2026-10-27',
    userApprovalConfirmed: false,
    materials: {
      tailoredHeadline: 'Junior AI Automation Specialist | Make.com, n8n & Gemini Workflows',
      executiveSummary: 'Practical automation specialist connecting Gemini API endpoints into Make.com and n8n scenarios for business operations.',
      keyMatchingHighlights: [
        'Webhook & API pipeline setup with zero-loss error handling.',
        'Grounded in WAEC analytical foundation and verified automation builds.',
      ],
      tailoredCoverLetter: 'Dear Synthex Team...',
      recommendedPortfolioProjects: ['proj_whatsapp_automation', 'proj_catalog_extractor'],
    },
    notes: 'Hourly contractor rate: $15/hr (~$900/mo) via Payoneer.',
    targetSalaryUSD: 900,
  },
];
