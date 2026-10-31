import { UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user_oluwole_atomic_01',
  fullName: 'Oluwole Oyetunji',
  email: 'oyetunjioluwole0@gmail.com',
  phone: '+234 812 345 6789',
  country: 'Nigeria',
  city: 'Lagos',
  timezone: 'WAT (UTC+1, West Africa Time)',
  education: {
    qualification: 'WAEC (West African Senior School Certificate Examination)',
    school: 'Federal Government College, Nigeria',
    yearCompleted: '2021',
    honors: 'Distinction in Sciences & Computer Studies',
    verifiedSecondary: true,
  },
  careerTarget: {
    primaryRole: 'AI Product Builder',
    secondaryRole: 'Junior AI Automation Specialist',
    monthlyIncomeGoalUSD: {
      min: 500,
      max: 1000,
    },
    preferredEmploymentTypes: [
      'Remote Independent Contractor (B2B)',
      'Global Freelance Contract',
      'Hourly AI Workflow Specialist',
    ],
  },
  technicalExperience: {
    primaryTools: [
      'Google AI Studio',
      'Gemini 3.8 Flash & Flash-Lite',
      'System Instruction Engineering',
      'JSON Schema & Structured Outputs',
      'Multimodal Context & Image Prompting',
      'Few-Shot Prompt Calibration',
    ],
    automationTools: [
      'Make.com (Integromat)',
      'n8n Workflow Automation',
      'Zapier Webhooks',
      'REST API Integration',
      'Python Automation Scripts',
    ],
    webTech: [
      'React 19 Prototyping',
      'TypeScript',
      'Tailwind CSS',
      'Vite & Express Applets',
    ],
    summary:
      'Hands-on AI product builder specializing in rapid prototyping with Google AI Studio, structured LLM pipelines, and automated business workflows. Experienced in taking idea briefs into functional interactive web tools, validating structured JSON responses, and connecting external APIs. Grounded in practical delivery without inflated credentials.',
  },
  hardwareAndSetup: {
    devices: [
      'Workstation Laptop (Core i7, 16GB RAM, Dual SSD)',
      'Android Phone (Samsung Galaxy - Mobile QA & PWA validation)',
    ],
    powerBackup: 'Solar Inverter System with 200Ah Lithium Backup (8+ hrs uptime)',
    connectivity: 'Fiber Optic Broadband (50 Mbps) + 4G LTE Secondary Failover',
  },
  payoutAndCompliance: {
    supportedPayoutMethods: [
      'Deel Contractor Account',
      'Payoneer USD Receiving Account',
      'Geegpay Virtual USD Card & Payout',
      'Grey.co Global Bank Account',
      'Direct Wire to Nigerian USD Domiciliary Account',
    ],
    identityStatus: 'NIN Verified, Valid Nigerian International Passport (Current)',
    taxContractReadiness: 'W-8BEN Tax Form Ready for US/International Contractors',
  },
};
