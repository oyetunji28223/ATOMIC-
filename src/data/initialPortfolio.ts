import { PortfolioProject } from '../types';

export const INITIAL_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj_ai_studio_triage',
    title: 'Customer Inquiry Triage & Sentiment Routing Agent',
    tagline: 'Google AI Studio prototype categorizing incoming B2B requests with strict JSON schemas',
    problemSolved:
      'Reduced manual triage delay by parsing raw customer support inquiries into priority tiers, department routing, and draft responses using Gemini 3.8 Flash with structured JSON output.',
    skillsDemonstrated: [
      'Google AI Studio',
      'Gemini 3.8 Flash',
      'JSON Schema Definition',
      'System Prompt Tuning',
      'Edge-Case Sanitization',
    ],
    tooling: ['Google AI Studio', 'Gemini SDK', 'React 19', 'Tailwind CSS'],
    demoUrl: 'https://ais-pre-demo.run.app/customer-triage-agent',
    repoUrl: 'https://github.com/oluwole/ai-studio-triage-prototype',
    keyMetricOrOutcome: 'Sub-450ms processing latency with 98.4% JSON schema adherence across 200 benchmark test cases.',
    architectureHighlights: [
      'System prompt calibrated with zero-temperature structured response constraint',
      'Dual-language handling (English & French customer queries)',
      'Fallback handling for ambiguous or low-confidence requests',
    ],
    verifiedWorking: true,
    lastUpdated: '2026-10-24',
  },
  {
    id: 'proj_catalog_extractor',
    title: 'Multimodal E-Commerce Product Spec Extractor',
    tagline: 'Automated extraction of technical specs and attributes from product images and supplier PDFs',
    problemSolved:
      'Eliminated hours of manual catalog data entry by feeding product spec sheets and product photos into multimodal Gemini prompts to populate standardized database rows.',
    skillsDemonstrated: [
      'Multimodal Prompting',
      'Document Parsing',
      'Data Normalization',
      'n8n Webhook Pipeline',
    ],
    tooling: ['Google AI Studio', 'n8n', 'Python Scripts', 'Google Sheets API'],
    demoUrl: 'https://ais-pre-demo.run.app/multimodal-extractor',
    repoUrl: 'https://github.com/oluwole/multimodal-catalog-pipeline',
    keyMetricOrOutcome: 'Processes catalog items 8x faster than manual entry, saving ~15 hours/week for merchant catalogs.',
    architectureHighlights: [
      'Combines image resolution calibration with OCR validation',
      'Webhook listener triggers automatic sync to Airtable/PostgreSQL',
      'Error alerting channel via Telegram bots when attributes fail validation',
    ],
    verifiedWorking: true,
    lastUpdated: '2026-10-18',
  },
  {
    id: 'proj_prompt_eval_harness',
    title: 'Prompt Regression & Few-Shot Evaluation Suite',
    tagline: 'Interactive testing harness for benchmarking prompt versions against test suites',
    problemSolved:
      'Helps teams compare prompt iterations side-by-side to detect hallucinations, formatting drifts, and latency shifts before deployment.',
    skillsDemonstrated: [
      'Prompt Evaluation',
      'Benchmarking & Metrics',
      'React UI Development',
      'Vite & Express Architecture',
    ],
    tooling: ['Google AI Studio', 'TypeScript', 'React 19', 'Express.js'],
    demoUrl: 'https://ais-pre-demo.run.app/prompt-evaluator',
    repoUrl: 'https://github.com/oluwole/prompt-eval-harness',
    keyMetricOrOutcome: 'Enables 1-click batch runs across 50 test inputs with automatic grading of expected vs actual tokens.',
    architectureHighlights: [
      'Visual diff of prompt responses',
      'Cost and latency tracking per token',
      'Exportable test reports in CSV and JSON formats',
    ],
    verifiedWorking: true,
    lastUpdated: '2026-10-28',
  },
  {
    id: 'proj_whatsapp_automation',
    title: 'Automated WhatsApp Business Lead Qualification Flow',
    tagline: 'Webhook-driven chatbot qualifying leads and scheduling appointments via Make.com and Gemini',
    problemSolved:
      'Captures incoming customer chats, extracts buyer budget and timeline using AI, and syncs qualified leads directly to Google Calendar and CRM.',
    skillsDemonstrated: [
      'Make.com Automations',
      'WhatsApp Cloud API',
      'Conversational AI Flows',
      'Zapier / Webhooks',
    ],
    tooling: ['Make.com', 'Gemini API', 'WhatsApp Business Webhooks', 'Google Calendar API'],
    demoUrl: 'https://ais-pre-demo.run.app/lead-qualifier-flow',
    repoUrl: 'https://github.com/oluwole/whatsapp-lead-automation',
    keyMetricOrOutcome: 'Automated 70% of first-touch lead qualifications with 0 missed inquiries outside working hours.',
    architectureHighlights: [
      'State-aware lead qualification branching',
      'Polite escalation to human reps for custom requests',
      'Timezone conversion for Nigerian & European business partners',
    ],
    verifiedWorking: true,
    lastUpdated: '2026-10-12',
  },
];
