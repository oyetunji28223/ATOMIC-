import { JobListing, MatchScoreResult, PortfolioProject, RubricCategoryScore, UserProfile } from '../types';

/**
 * 100-Point Transparent Job Matching Engine
 * Strictly follows ATOMIC evaluation rules:
 * 1. Country & Remote Eligibility (25 pts) - Gatekeeper
 * 2. Demonstrated Skill Alignment (30 pts)
 * 3. Experience Level Fit (15 pts)
 * 4. Education Flexibility (15 pts)
 * 5. Compensation Alignment (10 pts)
 * 6. Portfolio Evidence (5 pts)
 *
 * RULE: Never treat a high numerical match as proof of suitability
 * if the applicant fails a mandatory eligibility requirement.
 */
export function calculateJobMatch(
  job: JobListing,
  profile: UserProfile,
  portfolio: PortfolioProject[]
): MatchScoreResult {
  // 1. Country & Remote Eligibility (25 pts max)
  let countryScore = 0;
  let countryStatus: RubricCategoryScore['status'] = 'Full Points';
  let isDisqualified = false;
  let disqualificationReason: string | undefined;

  if (job.eligibility.status === 'INELIGIBLE') {
    countryScore = 0;
    countryStatus = 'Disqualified Gate';
    isDisqualified = true;
    disqualificationReason = job.eligibility.badgeLabel || 'Failed mandatory country eligibility or visa residency constraint.';
  } else if (job.eligibility.status === 'CONDITIONAL') {
    countryScore = 15;
    countryStatus = 'Partial Points';
  } else {
    // 100% ELIGIBLE
    countryScore = 25;
    countryStatus = 'Full Points';
  }

  const countryCategory: RubricCategoryScore = {
    category: 'Country & Remote Eligibility',
    score: countryScore,
    maxScore: 25,
    weightPercentage: 25,
    status: countryStatus,
    rationale: isDisqualified
      ? `Disqualified: Employer restricts hiring to ${job.remoteScope} and cannot onboard contractors in Nigeria.`
      : job.eligibility.status === 'CONDITIONAL'
      ? `Conditional: Remote hiring in Nigeria possible via third-party contractor agreement, with minor timezone or tax documentation setup.`
      : `Full compliance: Employer recruits worldwide remote contractors via ${job.payoutMethods.join(', ')} with verified Nigerian payout support.`,
    recommendations: isDisqualified
      ? ['Do not apply to this role; strict local residency or citizenship laws legally prevent offshore contracting.']
      : ['Ensure your W-8BEN contractor form and valid NIN/Passport are ready for swift onboarding.'],
  };

  // 2. Demonstrated Skill Alignment (30 pts max)
  const userSkills = [
    ...profile.technicalExperience.primaryTools,
    ...profile.technicalExperience.automationTools,
    ...profile.technicalExperience.webTech,
  ].map((s) => s.toLowerCase());

  const jobReqText = [
    ...job.mandatoryRequirements,
    ...job.preferredSkills,
    job.description,
  ].join(' ').toLowerCase();

  let matchedKeywordsCount = 0;
  const keywordSignals = [
    { key: 'google ai studio', weight: 6 },
    { key: 'gemini', weight: 5 },
    { key: 'prompt', weight: 5 },
    { key: 'json', weight: 4 },
    { key: 'schema', weight: 3 },
    { key: 'make', weight: 3 },
    { key: 'n8n', weight: 3 },
    { key: 'zapier', weight: 2 },
    { key: 'webhook', weight: 3 },
    { key: 'react', weight: 3 },
    { key: 'typescript', weight: 2 },
    { key: 'prototype', weight: 4 },
    { key: 'evaluation', weight: 3 },
    { key: 'testing', weight: 2 },
  ];

  let potentialWeight = 0;
  let earnedWeight = 0;

  for (const signal of keywordSignals) {
    if (jobReqText.includes(signal.key)) {
      potentialWeight += signal.weight;
      // check if user has related skill
      const hasSkill = userSkills.some((us) => us.includes(signal.key));
      if (hasSkill) {
        earnedWeight += signal.weight;
        matchedKeywordsCount++;
      }
    }
  }

  const skillMatchRatio = potentialWeight > 0 ? earnedWeight / potentialWeight : 0.85;
  const rawSkillScore = Math.round(skillMatchRatio * 30);
  const skillScore = Math.min(30, Math.max(8, rawSkillScore));

  const skillCategory: RubricCategoryScore = {
    category: 'Demonstrated Skill Alignment',
    score: skillScore,
    maxScore: 30,
    weightPercentage: 30,
    status: skillScore >= 25 ? 'Full Points' : skillScore >= 18 ? 'Partial Points' : 'Deduction',
    rationale: `Matched ${matchedKeywordsCount} core competencies in AI Studio, structured JSON, system instructions, and prototype tooling against vacancy needs.`,
    recommendations:
      skillScore >= 25
        ? ['Your practical experience with Gemini and structured prompts directly matches job requirements.']
        : ['Emphasize your hands-on JSON schema validation and few-shot calibration in your cover letter.'],
  };

  // 3. Experience Level Fit (15 pts max)
  let expScore = 15;
  let expRationale = '';
  if (job.experienceLevel.includes('Entry') || job.experienceLevel.includes('Junior') || job.experienceLevel.includes('No Experience')) {
    expScore = 15;
    expRationale = 'Entry and Junior level positions align perfectly with your career target as an AI Product Builder.';
  } else if (job.experienceLevel.includes('Junior to Mid')) {
    expScore = 12;
    expRationale = 'Junior to Mid level expectations; realistic given your practical prototype portfolio.';
  } else {
    expScore = 4;
    expRationale = 'Role demands senior tenure or multi-year enterprise production track record.';
  }

  const expCategory: RubricCategoryScore = {
    category: 'Experience Level Fit',
    score: expScore,
    maxScore: 15,
    weightPercentage: 15,
    status: expScore >= 12 ? 'Full Points' : 'Partial Points',
    rationale: expRationale,
    recommendations: ['Frame your AI Studio prototypes as applied technical deliverables.'],
  };

  // 4. Education Flexibility (15 pts max)
  let eduScore = 15;
  let eduRationale = '';
  if (
    job.educationRequirement.includes('No Degree Required') ||
    job.educationRequirement.includes('WAEC') ||
    job.educationRequirement.includes('High School')
  ) {
    eduScore = 15;
    eduRationale = 'Degree-agnostic employer. Values demonstrated prototypes and problem-solving over formal university degrees.';
  } else if (job.educationRequirement.includes('Associate')) {
    eduScore = 8;
    eduRationale = 'Prefers post-secondary diploma, but may consider exceptional verified prototype portfolios.';
  } else {
    // Strict Bachelor Required
    eduScore = 0;
    eduRationale = 'Disqualifying barrier: Employer strictly requires an accredited Bachelor of Science in Computer Science.';
    if (!isDisqualified) {
      isDisqualified = true;
      disqualificationReason = 'Failed mandatory academic degree requirement (Strict BS CS required).';
    }
  }

  const eduCategory: RubricCategoryScore = {
    category: 'Education Flexibility',
    score: eduScore,
    maxScore: 15,
    weightPercentage: 15,
    status: eduScore >= 12 ? 'Full Points' : eduScore > 0 ? 'Partial Points' : 'Disqualified Gate',
    rationale: eduRationale,
    recommendations:
      eduScore >= 12
        ? ['Your WAEC certificate and self-driven technical aptitude satisfy the educational requirements.']
        : ['Focus your application on your live interactive prototypes to demonstrate competency.'],
  };

  // 5. Compensation Alignment (10 pts max)
  let compScore = 10;
  const userMin = profile.careerTarget.monthlyIncomeGoalUSD.min;
  const userMax = profile.careerTarget.monthlyIncomeGoalUSD.max;
  const jobMin = job.salary.minUSD;
  const jobMax = job.salary.maxUSD;

  let compRationale = '';
  if (jobMin >= userMin && jobMin <= userMax * 1.5) {
    compScore = 10;
    compRationale = `Offered salary range ($${jobMin} - $${jobMax}/month) aligns squarely with your target of $${userMin}-$${userMax}/month (approx ₦${(jobMin * 1500).toLocaleString()} - ₦${(jobMax * 1500).toLocaleString()}/month).`;
  } else if (jobMax < userMin) {
    compScore = 5;
    compRationale = `Offered compensation ($${jobMin}-$${jobMax}/month) is below your minimum $${userMin}/month income target.`;
  } else {
    compScore = 8;
    compRationale = `Compensation ($${jobMin}-$${jobMax}/month) exceeds entry-level targets; expectations may be higher.`;
  }

  const compCategory: RubricCategoryScore = {
    category: 'Compensation Alignment',
    score: compScore,
    maxScore: 10,
    weightPercentage: 10,
    status: compScore >= 8 ? 'Full Points' : 'Partial Points',
    rationale: compRationale,
    recommendations: ['Competitive contractor rate with low friction for remote onboarding.'],
  };

  // 6. Portfolio Evidence (5 pts max)
  let portScore = 0;
  const verifiedProjects = portfolio.filter((p) => p.verifiedWorking);
  if (verifiedProjects.length >= 3) {
    portScore = 5;
  } else if (verifiedProjects.length >= 1) {
    portScore = 3;
  } else {
    portScore = 1;
  }

  const portCategory: RubricCategoryScore = {
    category: 'Portfolio Evidence',
    score: portScore,
    maxScore: 5,
    weightPercentage: 5,
    status: portScore === 5 ? 'Full Points' : 'Partial Points',
    rationale: `You have ${verifiedProjects.length} verified live AI prototypes demonstrating Gemini prompt engineering, JSON schemas, and webhooks.`,
    recommendations: ['Attach live prototype demo URLs to your application for immediate employer verification.'],
  };

  // Calculate Total Score
  let totalScore = countryScore + skillScore + expScore + eduScore + compScore + portScore;
  totalScore = Math.min(100, Math.max(0, totalScore));

  // Determine Verdict
  let suitabilityVerdict: MatchScoreResult['suitabilityVerdict'] = 'Viable Match';
  if (isDisqualified) {
    suitabilityVerdict = 'Disqualified / Ineligible';
    // If disqualified, we still show the breakdown honestly, but verdict is unmistakably Ineligible
  } else if (totalScore >= 85) {
    suitabilityVerdict = 'High Match';
  } else if (totalScore >= 68) {
    suitabilityVerdict = 'Viable Match';
  } else {
    suitabilityVerdict = 'Challenging Match';
  }

  const summaryAdvice = isDisqualified
    ? `INELIGIBLE FOR APPLICATION: This vacancy cannot hire remote candidates in Nigeria due to strict legal, citizenship, or regulatory constraints (${disqualificationReason}). Do not spend time applying.`
    : totalScore >= 85
    ? `EXCELLENT OPPORTUNITY: Your hands-on Google AI Studio expertise, WAEC profile, and contractor payment readiness match this international role with high credibility.`
    : `VIABLE OPPORTUNITY: Strong skill and compensation overlap. Focus application materials strictly on your working prototype demonstrations.`;

  const actionableNextSteps = isDisqualified
    ? ['Archive or skip this listing to focus on 100% Nigeria-eligible worldwide remote roles.']
    : [
        'Generate tailored CV highlights focusing on your Google AI Studio prototypes.',
        'Review the personalized cover letter emphasizing problem-solving outcomes.',
        'Verify your Deel / Payoneer account status for contractor payment setup.',
        'Review application materials in the approval workflow before sending.',
      ];

  return {
    jobId: job.id,
    totalScore,
    isDisqualified,
    disqualificationReason,
    suitabilityVerdict,
    categories: {
      countryEligibility: countryCategory,
      skillAlignment: skillCategory,
      experienceFit: expCategory,
      educationFlexibility: eduCategory,
      compensationAlignment: compCategory,
      portfolioEvidence: portCategory,
    },
    summaryAdvice,
    actionableNextSteps,
  };
}
