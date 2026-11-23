import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok: Boolean(ok) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

const port = await freePort();
const baseUrl = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ['dist/server.mjs'], {
  cwd: root,
  env: { ...process.env, NODE_ENV: 'production', HOST: '127.0.0.1', PORT: String(port), GEMINI_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let logs = '';
let lastError = '';
child.stdout.on('data', (chunk) => { logs += chunk.toString(); });
child.stderr.on('data', (chunk) => { logs += chunk.toString(); });
child.on('error', (error) => { lastError = error.message; });

let ready = false;
for (let attempt = 0; attempt < 50; attempt += 1) {
  if (child.exitCode !== null) break;
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    if (response.ok) { ready = true; break; }
    lastError = `HTTP ${response.status}`;
  } catch (error) {
    lastError = error.message;
  }
  await sleep(200);
}

check('production server starts and answers /api/health', ready, ready ? '' : `port=${port} error=${lastError} exit=${child.exitCode} logs=${logs.slice(-400)}`);

if (ready) {
  const json = async (route, options) => {
    const response = await fetch(`${baseUrl}${route}`, options);
    let body;
    try { body = await response.json(); } catch { body = null; }
    return { status: response.status, body };
  };
  const post = (route, payload) => json(route, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const health = await json('/api/health');
  check('health reports ok and no AI key', health.status === 200 && health.body?.status === 'ok' && health.body?.aiConfigured === false);

  const jobs = await json('/api/jobs');
  check('GET /api/jobs returns curated jobs', jobs.status === 200 && (jobs.body?.total ?? 0) >= 7, `total=${jobs.body?.total}`);

  const filtered = await json('/api/jobs?role=prompt&limit=10');
  check('GET /api/jobs applies role filtering', filtered.status === 200 && filtered.body.total > 0 && filtered.body.total < jobs.body.total, `filtered=${filtered.body?.total}`);

  const match = await post('/api/gemini/match', { jobId: 'job_promptflow_ai_builder' });
  check('POST /api/gemini/match works without API key', match.status === 200 && match.body?.matchResult !== undefined);

  const tailor = await post('/api/gemini/tailor', { jobId: 'job_promptflow_ai_builder' });
  check('POST /api/gemini/tailor returns grounded fallback', tailor.status === 200 && typeof tailor.body?.materials?.tailoredCoverLetter === 'string');

  const ineligible = await post('/api/gemini/tailor', { jobId: 'job_cloudscale_us_restricted' });
  check('ineligible job is rejected by tailor', ineligible.status === 400);

  const prep = await post('/api/gemini/interview-prep', { jobId: 'job_promptflow_ai_builder' });
  check('POST /api/gemini/interview-prep returns questions', prep.status === 200 && Array.isArray(prep.body?.prep?.expectedQuestions));

  const ui = await fetch(baseUrl);
  const html = await ui.text();
  check('production build serves the React client', ui.status === 200 && html.includes('id="root"'));

  const missing = await json('/api/definitely-not-a-route');
  check('unknown API route returns JSON 404', missing.status === 404 && missing.body?.error === 'API endpoint not found');
}

child.kill('SIGTERM');
await sleep(200);
if (child.exitCode === null) child.kill('SIGKILL');

const failed = results.filter((result) => !result.ok).length;
console.log(`\n${results.length - failed}/${results.length} smoke checks passed`);
process.exit(failed === 0 ? 0 : 1);
