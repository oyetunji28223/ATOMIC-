# API keys and environment configuration

**Rule: no API key or secret is committed to this repository.** Do not paste a
key into source code, issues, commit messages, or logs.

## Required to run

None. The demo works without any key and uses deterministic fallback text.

## Optional keys

| Variable | Purpose | How to obtain | Where to set it |
|---|---|---|---|
| `GEMINI_API_KEY` | Enables live Gemini-generated career insights | Create a free key in Google AI Studio (`https://aistudio.google.com/apikey`). Usage beyond the free tier may cost money. | Deployment environment variable, or GitHub repository secret if a workflow needs it in future. Never in a file. |
| `PORT` | HTTP port | Local choice; default `3000` | Environment variable |
| `HOST` | Bind address | Container default `0.0.0.0`; use `127.0.0.1` locally | Environment variable |
| `APP_URL` | Public URL metadata | Your deployed link | Environment variable |

## GitHub Secrets

GitHub Actions in this repo runs `npm run lint`, `npm run build`, and
`npm run smoke`. It needs **no secrets**. If you later add a workflow that calls
Gemini, add `GEMINI_API_KEY` under repository Settings → Secrets and variables
→ Actions, then reference it as `${{ secrets.GEMINI_API_KEY }}` in that workflow.

To enable live AI on the deployed app, set `GEMINI_API_KEY` in the hosting
environment and redeploy. The current public deployment intentionally has no
key set.

## What I did not do

I did not search GitHub for "free" keys or reuse credentials found in public
repos. Those keys belong to someone else, are likely revoked or rate-limited,
and using them would be credential misuse.
