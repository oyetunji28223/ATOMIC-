/**
 * ATOMIC - International Job Discovery & Career Intelligence Types
 */

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string; // "Nigeria"
  city: string; // "Lagos"
  timezone: string; // "WAT (UTC+1)"
  education: {
    qualification: string; // "WAEC (West African Senior School Certificate Examination)"
    school: string;
    yearCompleted: string;
    honors?: string;
    verifiedSecondary: boolean;
  };
  careerTarget: {
    primaryRole: string; // "AI Product Builder"
    secondaryRole: string; // "Junior AI Automation Specialist"
    monthlyIncomeGoalUSD: {
      min: number; // 500
      max: number; // 1000
    };
    preferredEmploymentTypes: string[]; // ["Remote Contract", "Freelance B2B", "Part-Time Contractor"]
  };
  technicalExperience: {
    primaryTools: string[]; // ["Google AI Studio", "Gemini 3.8 Flash / Flash-Lite", "Prompt Design", "JSON Schema Definition", "System Instructions"]
    automationTools: string[]; // ["n8n", "Make.com", "Zapier", "Python Webhooks", "REST APIs"]
    webTech: string[]; // ["React 19", "TypeScript", "Tailwind CSS", "Vite"]
    summary: string;
  };
  hardwareAndSetup: {
    devices: string[]; // ["Laptop (Core i7, 16GB RAM)", "Android Phone (Testing & PWA check)"]
    powerBackup: string; // "Solar Inverter + Backup Battery (6-8 hrs sustained)"
    connectivity: string; // "Dual ISP (4G Mobile Broadband + Fibre Line)"
  };
  payoutAndCompliance: {
    supportedPayoutMethods: string[]; // ["Deel", "Payoneer", "Geegpay", "Grey.co", "Direct Wire (USD Domiciliary)"]
    identityStatus: string; // "NIN Verified, Valid Nigerian International Passport"
    taxContractReadiness: string; // "Independent Contractor (W-8BEN compliant)"
  };
}

export interface VerificationIndicators {
  domainVerified: boolean;
  companyRegistryVerified: boolean;
  noFeeApplicationVerified: boolean;
  trustedPlatformVerified: boolean;
  verificationBadge: 'Verified Employer' | 'Verified Partner Listing' | 'Third-Party Aggregated' | 'Unverified / Caution';
  lastCheckedDate: string;
  verificationNotes: string;
}

export interface EligibilityDetails {
  status: 'ELIGIBLE' | 'CONDITIONAL' | 'INELIGIBLE';
  badgeLabel: string;
  reasons: string[];
  contractType: 'Independent Contractor (B2B)' | 'EOR (Employer of Record)' | 'Direct Employee (US Only)' | 'Global Freelance';
  timezoneCompatibility: 'Excellent (0-2h diff)' | 'Manageable (4-6h diff)' | 'Challenging (7-9h diff)';
  payoutViabilityInNigeria: boolean;
  requiredDocuments: string[];
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyWebsite: string;
  companyLocation: string;
  remoteScope: 'Worldwide Remote' | 'EMEA Remote (Europe, Middle East, Africa)' | 'US Only' | 'UK/EU Only' | 'Global Emerging Markets';
  department: string;
  experienceLevel: 'Entry / Junior' | 'Junior to Mid' | 'No Experience Required / Portfolio Based' | 'Senior (Restricted)';
  educationRequirement: 'No Degree Required (Portfolio Driven)' | 'WAEC / High School Diploma Accepted' | 'Associate or Equivalent' | 'Strict Bachelor in CS Required';
  salary: {
    minUSD: number;
    maxUSD: number;
    period: 'month' | 'year';
    isHourly?: boolean;
    hourlyRate?: number;
    ngnEquivalentPerMonth: {
      min: number;
      max: number;
      exchangeRateUsed: number; // e.g. 1500 NGN/USD
    };
  };
  payoutMethods: string[];
  description: string;
  keyResponsibilities: string[];
  mandatoryRequirements: string[];
  preferredSkills: string[];
  eligibility: EligibilityDetails;
  verification: VerificationIndicators;
  source: string;
  sourceUrl: string;
  isSponsored: boolean;
  postedDate: string;
  applicationDeadline?: string;
}

export interface RubricCategoryScore {
  category: string;
  score: number;
  maxScore: number;
  weightPercentage: number;
  status: 'Full Points' | 'Partial Points' | 'Deduction' | 'Disqualified Gate';
  rationale: string;
  recommendations: string[];
}

export interface MatchScoreResult {
  jobId: string;
  totalScore: number; // 0 - 100
  isDisqualified: boolean;
  disqualificationReason?: string;
  suitabilityVerdict: 'High Match' | 'Viable Match' | 'Challenging Match' | 'Disqualified / Ineligible';
  categories: {
    countryEligibility: RubricCategoryScore; // 25 pts max
    skillAlignment: RubricCategoryScore; // 30 pts max
    experienceFit: RubricCategoryScore; // 15 pts max
    educationFlexibility: RubricCategoryScore; // 15 pts max
    compensationAlignment: RubricCategoryScore; // 10 pts max
    portfolioEvidence: RubricCategoryScore; // 5 pts max
  };
  summaryAdvice: string;
  actionableNextSteps: string[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  tagline: string;
  problemSolved: string;
  skillsDemonstrated: string[];
  tooling: string[]; // ["Google AI Studio", "Gemini 3.8 Flash", "React", "Make.com"]
  demoUrl?: string;
  repoUrl?: string;
  keyMetricOrOutcome: string;
  architectureHighlights: string[];
  verifiedWorking: boolean;
  lastUpdated: string;
}

export interface ApplicationMaterials {
  tailoredHeadline: string;
  executiveSummary: string;
  keyMatchingHighlights: string[];
  tailoredCoverLetter: string;
  recommendedPortfolioProjects: string[]; // project IDs
  interviewPreparationNotes?: {
    expectedQuestions: string[];
    recommendedTalkingPoints: string[];
    technicalProofDemonstrations: string[];
  };
}

export type ApplicationStatus =
  | 'Saved'
  | 'Materials Ready'
  | 'Pending Approval'
  | 'Approved by User'
  | 'Submitted to Employer'
  | 'Interview Scheduled'
  | 'Offer Received'
  | 'Archived / Not Selected';

export interface TrackedApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyWebsite: string;
  applicationUrl: string;
  status: ApplicationStatus;
  dateSaved: string;
  dateApproved?: string;
  dateSubmitted?: string;
  userApprovalConfirmed: boolean;
  materials: ApplicationMaterials;
  notes: string;
  targetSalaryUSD: number;
  followUpDate?: string;
}
