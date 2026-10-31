import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { CURATED_JOB_LISTINGS } from './src/data/curatedJobs.ts';
import { INITIAL_USER_PROFILE } from './src/data/defaultProfile.ts';
import { INITIAL_PORTFOLIO_PROJECTS } from './src/data/initialPortfolio.ts';
import { calculateJobMatch } from './src/utils/matchingEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI on server only
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: GET /api/jobs - List curated jobs
app.get('/api/jobs', (req: Request, res: Response) => {
  const { role, eligibility, minSalary, maxSalary, search } = req.query;

  let filtered = [...CURATED_JOB_LISTINGS];

  if (eligibility) {
    filtered = filtered.filter(
      (job) => job.eligibility.status.toLowerCase() === String(eligibility).toLowerCase()
    );
  }

  if (role) {
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(String(role).toLowerCase()) ||
        job.department.toLowerCase().includes(String(role).toLowerCase())
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.mandatoryRequirements.some((r) => r.toLowerCase().includes(q))
    );
  }

  if (minSalary) {
    filtered = filtered.filter((job) => job.salary.minUSD >= Number(minSalary));
  }

  if (maxSalary) {
    filtered = filtered.filter((job) => job.salary.maxUSD <= Number(maxSalary));
  }

  res.json({
    total: filtered.length,
    jobs: filtered,
    metadata: {
      sourceTimestamp: new Date().toISOString(),
      exchangeRateUSDToNGN: 1500,
      candidateCountry: 'Nigeria',
    },
  });
});

// Endpoint: POST /api/gemini/match - AI Enhanced Match Analysis
app.post('/api/gemini/match', async (req: Request, res: Response) => {
  try {
    const { jobId, profile = INITIAL_USER_PROFILE, portfolio = INITIAL_PORTFOLIO_PROJECTS } = req.body;
    const job = CURATED_JOB_LISTINGS.find((j) => j.id === jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job listing not found' });
    }

    // First, run deterministic 100-point rubric
    const rubricScore = calculateJobMatch(job, profile, portfolio);

    // If Gemini API is available and not disqualified, get rich qualitative insights
    if (apiKey) {
      try {
        const prompt = `
You are ATOMIC's Senior International Remote Career Intelligence Auditor.
Analyze the alignment between this Nigerian candidate and the international job vacancy.

CANDIDATE FACTS (DO NOT INVENT EXTRA CREDENTIALS):
- Country: Nigeria (WAT UTC+1)
- Education: WAEC (West African Senior School Certificate Examination) - Secondary School ONLY
- Technical Experience: Google AI Studio, Gemini Flash, Prompt Engineering, Structured JSON Outputs, React prototyping, Make.com/n8n automation.
- Target Salary: $500–$1,000/month
- Verified Working Prototypes: ${(portfolio as any[]).map((p: any) => p.title).join('; ')}

JOB VACANCY:
- Title: ${job.title} at ${job.company}
- Remote Scope: ${job.remoteScope}
- Mandatory Requirements: ${job.mandatoryRequirements.join('; ')}
- Education Requirement: ${job.educationRequirement}
- Eligibility for Nigeria: ${job.eligibility.status} (${job.eligibility.badgeLabel})

INSTRUCTIONS:
1. Provide a sharp, honest analysis of their competitive advantages and gaps.
2. If the job requires a strict BS in CS or US citizenship, explicitly affirm the disqualification.
3. Recommend how the candidate should present their Google AI Studio prototypes to win over the hiring manager.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction:
              'You are a transparent, realistic international career advisor. Never invent fake university degrees or non-existent company experience for the candidate. Return structured JSON.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                aiAuditSummary: { type: Type.STRING },
                keyCompetitiveStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                potentialGapsOrRisks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                prototypeDemonstrationStrategy: { type: Type.STRING },
              },
              required: [
                'aiAuditSummary',
                'keyCompetitiveStrengths',
                'potentialGapsOrRisks',
                'prototypeDemonstrationStrategy',
              ],
            },
          },
        });

        const geminiInsights = JSON.parse(response.text || '{}');
        return res.json({
          matchResult: rubricScore,
          aiInsights: geminiInsights,
        });
      } catch (geminiErr: any) {
        console.error('Gemini match insight error:', geminiErr);
        // Fallback gracefully to rubric calculation
        return res.json({
          matchResult: rubricScore,
          aiInsights: {
            aiAuditSummary: rubricScore.summaryAdvice,
            keyCompetitiveStrengths: [
              'Hands-on expertise in Google AI Studio and structured JSON outputs',
              'Proven working prototypes directly accessible online',
              '0-1 hour timezone alignment with European and UK teams',
            ],
            potentialGapsOrRisks: [
              'Self-taught portfolio approach requires high demonstration clarity to bypass automated ATS filters',
            ],
            prototypeDemonstrationStrategy:
              'Include live links to your customer triage and multimodal extraction prototypes in the first paragraph of your communication.',
          },
        });
      }
    }

    return res.json({
      matchResult: rubricScore,
      aiInsights: {
        aiAuditSummary: rubricScore.summaryAdvice,
        keyCompetitiveStrengths: [
          'Practical AI Studio prompt tuning and schema design',
          'Fast turnaround on lightweight React/automation prototypes',
        ],
        potentialGapsOrRisks: ['Ensure proof of power/internet uptime is clearly noted'],
        prototypeDemonstrationStrategy: 'Provide GitHub repos and live demo URLs prominently.',
      },
    });
  } catch (err: any) {
    console.error('Match endpoint error:', err);
    res.status(500).json({ error: 'Failed to compute match score', details: err.message });
  }
});

// Endpoint: POST /api/gemini/tailor - Generate Tailored CV Highlights & Grounded Cover Letter
app.post('/api/gemini/tailor', async (req: Request, res: Response) => {
  try {
    const { jobId, profile = INITIAL_USER_PROFILE, portfolio = INITIAL_PORTFOLIO_PROJECTS } = req.body;
    const job = CURATED_JOB_LISTINGS.find((j) => j.id === jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job listing not found' });
    }

    if (job.eligibility.status === 'INELIGIBLE') {
      return res.status(400).json({
        error: 'Cannot generate application materials for an ineligible job vacancy.',
        reason: job.eligibility.badgeLabel,
      });
    }

    // Default grounded templates if Gemini is unavailable
    const fallbackMaterials = {
      tailoredHeadline: `AI Product Builder & Prompt Workflow Specialist | Google AI Studio & Structured Outputs`,
      executiveSummary: `Hands-on AI Product Builder based in Lagos, Nigeria (WAT UTC+1), with proven expertise in Google AI Studio, structured prompt engineering, and end-to-end automation pipelines. Backed by functional live prototypes with 98%+ schema compliance, WAEC science distinction, and reliable solar/fiber infrastructure for remote contractor roles.`,
      keyMatchingHighlights: [
        `Google AI Studio Specialization: Designed zero-hallucination prompt architectures using Gemini 3.8 Flash with structured JSON schemas.`,
        `End-to-End Prototyping: Built interactive customer triage and multimodal catalog extractors using React and n8n webhooks.`,
        `International Remote Readiness: Registered Deel/Payoneer contractor with dedicated solar power backup (8+ hours) and dual high-speed internet.`,
      ],
      tailoredCoverLetter: `Dear Hiring Team at ${job.company},

I am writing to express my strong enthusiasm for the ${job.title} position.

As an AI Product Builder based in Nigeria, I specialize in translating complex business requirements into reliable LLM workflows using Google AI Studio, structured JSON schemas, and automation platforms like Make.com and n8n. 

Rather than relying solely on theoretical knowledge, I focus on building tangible, working prototypes. For instance, I recently developed a Customer Support Triage Agent that achieved sub-450ms latency with 98.4% schema adherence across 200 benchmark test cases, as well as a multimodal product spec extractor that processes unstructured documents 8x faster than manual entry.

My remote work environment is thoroughly equipped with a dedicated solar inverter backup system (ensuring uninterrupted 8+ hour uptime) and dual redundant internet connections. Working in West Africa Time (UTC+1) provides seamless overlap with your team. I am ready to collaborate as an independent B2B contractor with verified Deel and Payoneer onboarding.

I would welcome the opportunity to demonstrate my interactive AI Studio prototypes and discuss how I can contribute immediately to ${job.company}'s goals.

Sincerely,
${profile.fullName}
Lagos, Nigeria | ${profile.email}`,
      recommendedPortfolioProjects: (portfolio as any[]).slice(0, 2).map((p: any) => p.id),
    };

    if (apiKey) {
      try {
        const prompt = `
Generate tailored application materials for ${profile.fullName} applying to "${job.title}" at "${job.company}".

ABSOLUTE SAFETY & TRUTHFULNESS DIRECTIVES:
1. Candidate location: Nigeria.
2. Candidate education: WAEC (Secondary School). NEVER INVENT OR IMPLY A COLLEGE DEGREE, UNIVERSITY ATTENDANCE, OR FAKE CERTIFICATION.
3. Candidate experience: Self-taught, practical AI prototyping in Google AI Studio, Gemini Flash, prompt engineering, structured JSON, React, and workflow automation (n8n/Make).
4. Emphasize verified working prototypes: ${(portfolio as any[]).map((p: any) => `${p.title}: ${p.tagline}`).join('; ')}.
5. Address the specific job requirements: ${job.mandatoryRequirements.join('; ')}.
6. Tone: Professional, articulate, results-driven, humble yet confident in practical execution.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction:
              'You are ATOMIC Career Studio. You craft truthful, high-impact application materials for African remote tech talent without ever hallucinating credentials or inventing college degrees.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                tailoredHeadline: { type: Type.STRING },
                executiveSummary: { type: Type.STRING },
                keyMatchingHighlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                tailoredCoverLetter: { type: Type.STRING },
                recommendedPortfolioProjects: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'tailoredHeadline',
                'executiveSummary',
                'keyMatchingHighlights',
                'tailoredCoverLetter',
                'recommendedPortfolioProjects',
              ],
            },
          },
        });

        const tailoredData = JSON.parse(response.text || '{}');
        return res.json({
          materials: {
            ...fallbackMaterials,
            ...tailoredData,
            recommendedPortfolioProjects: (portfolio as any[]).slice(0, 2).map((p: any) => p.id),
          },
        });
      } catch (geminiErr: any) {
        console.error('Gemini tailor error:', geminiErr);
        return res.json({ materials: fallbackMaterials });
      }
    }

    return res.json({ materials: fallbackMaterials });
  } catch (err: any) {
    console.error('Tailor error:', err);
    res.status(500).json({ error: 'Failed to tailor application materials', details: err.message });
  }
});

// Endpoint: POST /api/gemini/interview-prep - Generate realistic interview questions & talking points
app.post('/api/gemini/interview-prep', async (req: Request, res: Response) => {
  try {
    const { jobId, profile = INITIAL_USER_PROFILE, portfolio = INITIAL_PORTFOLIO_PROJECTS } = req.body;
    const job = CURATED_JOB_LISTINGS.find((j) => j.id === jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const fallbackPrep = {
      expectedQuestions: [
        `"How do you handle edge cases and hallucinations when designing system prompts in Google AI Studio?"`,
        `"Can you walk us through an automation workflow you built where an LLM returned an invalid JSON response?"`,
        `"How do you maintain reliable uptime and timezone alignment while working remotely from Nigeria?"`,
        `"Since your background is portfolio-based rather than a computer science degree, how do you approach learning complex technical topics?"`,
      ],
      recommendedTalkingPoints: [
        `Anchor responses in your Customer Support Triage prototype: explain how temperature calibration and structured JSON schemas forced deterministic outputs.`,
        `Highlight your hardware reliability: mention your solar inverter system (8+ hrs uptime) and dual ISP fiber/4G setup.`,
        `Emphasize your practical, rapid learning cadence: how you build live working prototypes in AI Studio rather than relying on abstract theory.`,
      ],
      technicalProofDemonstrations: [
        `Offer to screen-share Google AI Studio to demonstrate real-time prompt tuning and response comparison.`,
        `Demonstrate your live n8n / Make webhook listener handling JSON payloads.`,
      ],
    };

    if (apiKey) {
      try {
        const prompt = `
Create interview preparation questions and tactical talking points for ${profile.fullName} applying for "${job.title}" at "${job.company}".

Profile facts:
- Country: Nigeria
- Education: WAEC
- Strengths: Google AI Studio, Gemini 3.8 Flash, Prompt Tuning, JSON Schema validation, React prototyping, Make.com automations.
- Available projects: ${(portfolio as any[]).map((p: any) => p.title).join(', ')}.

Provide honest, rigorous technical interview questions they are likely to encounter and strategic talking points to demonstrate their true competence.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction:
              'You are an expert technical interviewer preparing an international remote candidate for real interview rounds. Ground every answer in authentic skills.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                expectedQuestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                recommendedTalkingPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                technicalProofDemonstrations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'expectedQuestions',
                'recommendedTalkingPoints',
                'technicalProofDemonstrations',
              ],
            },
          },
        });

        const prepData = JSON.parse(response.text || '{}');
        return res.json({ prep: prepData });
      } catch (geminiErr: any) {
        console.error('Gemini prep error:', geminiErr);
        return res.json({ prep: fallbackPrep });
      }
    }

    return res.json({ prep: fallbackPrep });
  } catch (err: any) {
    res.status(500).json({ error: 'Interview prep failed', details: err.message });
  }
});

// Mount Vite middleware for dev or static files for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ATOMIC Career Platform Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
