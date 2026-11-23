# ATOMIC — International Remote Job Discovery & Career Intelligence

A React + Express application that helps a Nigeria-based, portfolio-first candidate
discover remote roles, check eligibility, score fit with a transparent 100-point
rubric, and prepare application materials. Built for a public demo deployment.

## Status

Verified locally: dependency install, TypeScript check, production build, server
bundle, and an end-to-end smoke test of all public endpoints. No live AI key or
external service is required to run the demo.

## Stack

- React 19, TypeScript, Vite 6, Tailwind CSS 4
- Express 4 server (bundled to `dist/server.mjs` for production)
- Optional Google Gemini API (`@google/genai`) for richer text generation
- No database: job listings and profile data are committed TypeScript fixtures

## Quick start (development)

Requires Node.js 22+. The documented workflow uses npm and `package-lock.json`,
which is the authoritative lockfile. The `bun.lock` file predates the dependency
alignment in this version and is not used by these commands.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The dev server uses Vite middleware.

## Production build and run

```bash
npm install
npm run lint          # TypeScript check
npm run build         # Vite client build + bundled Express server
npm start             # serves the built client and API on PORT (default 3000)
npm run smoke         # starts the built server and verifies all endpoints
```

`npm start` uses plain Node against `dist/server.mjs`. It does **not** need the
`tsx` dev runtime or dev dependencies at runtime.

### Environment variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `PORT` | no | `3000` | HTTP listen port |
| `HOST` | no | `0.0.0.0` | Bind address; set to `127.0.0.1` for local-only runs |
| `GEMINI_API_KEY` | no | empty | Enables Gemini-generated insights; without it, deterministic fallback text is returned |
| `APP_URL` | no | empty | Optional public URL metadata |

Copy `.env.example` to `.env` if you want to set these locally. Never commit `.env`.

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Liveness plus `aiConfigured` flag |
| `GET` | `/api/jobs` | Curated jobs with `role`, `search`, `eligibility`, `minSalary`, `maxSalary` filters |
| `POST` | `/api/gemini/match` | 100-point rubric score; adds Gemini insight when a key is set |
| `POST` | `/api/gemini/tailor` | Tailored CV headline, highlights, and cover letter |
| `POST` | `/api/gemini/interview-prep` | Likely questions and talking points |

All three AI endpoints degrade to grounded fallback content when the key is
missing or the upstream call fails. Ineligible listings are rejected by the
tailoring endpoint.

## Docker

```bash
docker build -t atomic-career .
docker run --rm -p 3000:3000 atomic-career
```

Pass `-e GEMINI_API_KEY=...` only if you want live AI text. Do not bake keys into
the image.

## Deployment notes and limitations

- The API is **unauthenticated** by design: all data is public demo content and
  there are no writes, payments, or user accounts. Put it behind TLS and a
  rate-limiting proxy if exposing it publicly.
- There is no persistence. Submissions and generated text are not stored.
- The 7 job listings are curated demo fixtures, not a live job feed. Salary
  conversion uses a fixed illustrative rate.
- AI output can be wrong even with a key; the UI presents it as advisory, not
  as verified fact. The deterministic rubric remains the primary score.
- `HOST=0.0.0.0` is the container default. Set `HOST=127.0.0.1` when running
  directly on a shared host.
