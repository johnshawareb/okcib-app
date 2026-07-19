import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync, openSync, readSync, closeSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { timingSafeEqual, createHash } from 'crypto';
import { createTransport } from 'nodemailer';
import multer from 'multer';
import { config } from 'dotenv';
import { runQuoteAgent } from './agents/quote-agent.js';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);

// Behind cPanel/Apache reverse proxy — trust it so req.ip reflects the client.
app.set('trust proxy', true);
app.use(express.json({ limit: '256kb' })); // quote payloads are small; cap to blunt abuse

// Security headers on every response (defense-in-depth for the dashboard XSS fix).
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  // Lock the dashboard down hard: even if an escape were missed, connect/img-src
  // 'self' blocks the exfiltration channel a stored-XSS payload would use.
  if (req.path === '/dashboard.html') {
    res.setHeader('Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src https://fonts.gstatic.com; " +
      "img-src 'self' data:; connect-src 'self'; " +
      "object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  }
  next();
});

// Auth must be registered before express.static, or static would serve
// dashboard.html unauthenticated (requireDashboardAuth is hoisted).
app.use(['/dashboard.html', '/api/quotes', '/api/agent', '/data'], requireDashboardAuth);

// Never let express.static hand out source, config, or secret files that happen
// to live in this directory (server.js, package.json, the agent, .env, etc.).
const BLOCKED_STATIC = /^\/(server\.js|package(-lock)?\.json|vite\.config\.js|postcss\.config\.js|tailwind\.config\.js|\.env.*|agents(\/|$))/i;
app.use((req, res, next) => {
  if (BLOCKED_STATIC.test(req.path)) return res.status(403).send('Forbidden');
  next();
});
app.use(express.static(__dirname, { dotfiles: 'deny' }));

// File upload setup
const upload = multer({
  dest: join(__dirname, 'data', 'uploads'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const ok = ['application/pdf','image/jpeg','image/jpg','image/png','image/gif'].includes(file.mimetype);
    cb(null, ok);
  }
});

// SSE clients for real-time updates
const sseClients = new Map();

// Simple file-based storage
const DB_FILE = join(__dirname, 'data', 'submissions.json');

function loadDB() {
  if (!existsSync(DB_FILE)) return { submissions: [] };
  return JSON.parse(readFileSync(DB_FILE, 'utf8'));
}

function saveDB(db) {
  const dir = join(__dirname, 'data');
  if (!existsSync(dir)) { mkdirSync(dir, { recursive: true }); }
  writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// ─── EMAIL ────────────────────────────────────────────────────────────────────
const mailer = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendSubmissionEmail(submission) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  const d = submission.data;
  const name = d.name || `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'Unknown';
  const type = d.quoteType === 'home' ? '🏠 Home' : '🚗 Auto';

  const body = `
New ${type} Quote Request — OKC Insurance Brokers
================================================
Submitted: ${new Date(submission.createdAt).toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT

CONTACT
  Name:    ${name}
  Email:   ${d.email || '—'}
  Phone:   ${d.phone || '—'}
  ZIP:     ${d.zip || '—'}
  Call:    ${d.callTime || 'Any time'}

${d.year ? `VEHICLE\n  ${d.year} ${d.make} ${d.model}${d.vin ? `\n  VIN: ${d.vin}` : ''}\n  Use: ${d.vehicleUse || '—'}\n` : ''}
COVERAGE
  Type:       ${d.coverageType || '—'}
  Deductible: $${d.deductible || '—'}
  Incidents:  ${d.incidents || 'None'}
  Current:    ${d.currentCarrier || 'None'}

${d.notes ? `NOTES\n  ${d.notes}\n` : ''}
View in dashboard: http://localhost:${process.env.PORT || 3000}/dashboard.html
  `.trim();

  const mailOptions = {
    from: `"OKCIB Quote Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.SUBMISSION_EMAIL || 'info@okcinsurancebrokers.com',
    subject: `New ${type} Quote — ${name} (${d.zip || ''})`,
    text: body,
  };
  if (submission.policyFile) {
    mailOptions.attachments = [{
      filename: submission.policyFile.originalName,
      path: join(__dirname, 'data', 'uploads', submission.policyFile.filename),
    }];
  }
  try { await mailer.sendMail(mailOptions); } catch (err) { console.error('❌ Email failed:', err.message, err.code); }
}

const escapeHtml = (s) => String(s)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

// Branded confirmation sent to the customer after they submit a quote request
async function sendCustomerConfirmationEmail(submission) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  const d = submission.data;
  if (!d.email) return; // customer left no email — nothing to send
  const firstNameRaw = d.firstName || (d.name || '').trim().split(/\s+/)[0] || '';
  const firstName = escapeHtml(firstNameRaw);
  const type = d.quoteType === 'home' ? 'home' : 'auto';
  const callTimeRaw = d.callTime && d.callTime !== 'Any time'
    ? `during your preferred time (${d.callTime})`
    : 'shortly';
  const callTime = escapeHtml(callTimeRaw);
  const agencyPhone = '(405) 509-9433';
  const agencyEmail = process.env.SUBMISSION_EMAIL || 'info@okcinsurancebrokers.com';

  const text = `
Hi${firstNameRaw ? ` ${firstNameRaw}` : ''},

Thanks for requesting a ${type} insurance quote from OKC Insurance Brokers!

We've received your request and one of our licensed agents will call you ${callTimeRaw} to go over your options. As an independent brokerage, we shop multiple carriers to find you the best coverage at the best price.

Need to reach us sooner?
  Phone: ${agencyPhone}
  Email: ${agencyEmail}

Talk soon,
OKC Insurance Brokers
  `.trim();

  const html = `
<div style="margin:0;padding:24px 12px;background:#eff6ff;font-family:Inter,system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dbeafe;">
    <div style="background:#1e3a8a;padding:24px 32px;border-bottom:4px solid #f59e0b;">
      <span style="color:#ffffff;font-size:20px;font-weight:700;">OKC Insurance Brokers</span>
    </div>
    <div style="padding:32px;color:#1f2937;font-size:15px;line-height:1.6;">
      <p style="margin:0 0 16px;">Hi${firstName ? ` ${firstName}` : ''},</p>
      <p style="margin:0 0 16px;">Thanks for requesting a <strong>${type} insurance quote</strong> — we've received your request!</p>
      <p style="margin:0 0 16px;">One of our licensed agents will call you <strong>${callTime}</strong> to go over your options. As an independent brokerage, we shop multiple carriers to find you the best coverage at the best price.</p>
      <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:6px;padding:16px 20px;margin:0 0 16px;">
        <p style="margin:0 0 4px;font-weight:600;color:#1e40af;">Need to reach us sooner?</p>
        <p style="margin:0;">📞 <a href="tel:+14055099433" style="color:#2563eb;text-decoration:none;">${agencyPhone}</a><br>
        ✉️ <a href="mailto:${agencyEmail}" style="color:#2563eb;text-decoration:none;">${agencyEmail}</a></p>
      </div>
      <p style="margin:0;">Talk soon,<br><strong>OKC Insurance Brokers</strong></p>
    </div>
    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
      You're receiving this because you requested a quote at okcinsurancebrokers.com. No action is needed.
    </div>
  </div>
</div>`;

  try {
    await mailer.sendMail({
      from: `"OKC Insurance Brokers" <${process.env.EMAIL_USER}>`,
      to: d.email,
      replyTo: agencyEmail,
      subject: `We received your ${type} quote request — OKC Insurance Brokers`,
      text,
      html,
    });
    console.log(`✅ Confirmation email sent to ${d.email}`);
  } catch (err) {
    console.error('❌ Customer confirmation email failed:', err.message, err.code);
  }
}

// ─── AMS (agency CRM) FORWARDING ──────────────────────────────────────────────
// Forwards each submission to the insurance-ams pipeline webhook so website
// leads show up in the agency CRM automatically. Configure with:
//   AMS_WEBHOOK_URL    e.g. https://your-ams-domain.com/api/webhooks/okcib
//   AMS_WEBHOOK_SECRET must match OKCIB_WEBHOOK_SECRET on the AMS side
async function forwardToAMS(submission) {
  if (!process.env.AMS_WEBHOOK_URL || !process.env.AMS_WEBHOOK_SECRET) return;
  const payload = JSON.stringify({
    submissionId: submission.id,
    createdAt: submission.createdAt,
    data: submission.data,
  });
  const delays = [0, 2000, 4000, 8000];
  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt]) await new Promise(r => setTimeout(r, delays[attempt]));
    try {
      const resp = await fetch(process.env.AMS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-okcib-secret': process.env.AMS_WEBHOOK_SECRET },
        body: payload,
      });
      if (resp.ok) {
        const result = await resp.json().catch(() => ({}));
        console.log(`✅ Lead forwarded to AMS (lead #${result.leadId ?? '?'}${result.existing ? ', existing' : ''})`);
        return;
      }
      // 4xx means the AMS rejected the payload — retrying won't help
      if (resp.status < 500) {
        console.error(`❌ AMS rejected lead (HTTP ${resp.status}):`, await resp.text().catch(() => ''));
        return;
      }
      console.error(`⚠️  AMS forward attempt ${attempt + 1} failed (HTTP ${resp.status})`);
    } catch (err) {
      console.error(`⚠️  AMS forward attempt ${attempt + 1} failed:`, err.message);
    }
  }
  console.error('❌ AMS forward gave up after retries; submission is still saved locally', submission.id);
}

// ─── RATE LIMITING ────────────────────────────────────────────────────────────
// Minimal in-memory fixed-window limiter (no external dependency). Keyed by IP.
function rateLimiter({ windowMs, max }) {
  const hits = new Map(); // ip -> { count, resetAt }
  return function (req, res, next) {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    let rec = hits.get(ip);
    if (!rec || now > rec.resetAt) { rec = { count: 0, resetAt: now + windowMs }; hits.set(ip, rec); }
    rec.count++;
    // Opportunistic cleanup so the map can't grow unbounded.
    if (hits.size > 5000) for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    if (rec.count > max) {
      res.setHeader('Retry-After', Math.ceil((rec.resetAt - now) / 1000));
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
  };
}
const quoteLimiter = rateLimiter({ windowMs: 60 * 60 * 1000, max: 15 }); // 15 submissions/IP/hour
const authLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });  // 20 auth attempts/IP/15min

// ─── DASHBOARD AUTH ───────────────────────────────────────────────────────────
// HTTP Basic auth for the broker dashboard and lead APIs. The public quote
// form endpoint (POST /api/quote) stays open.
function requireDashboardAuth(req, res, next) {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    return res.status(503).send('Dashboard locked: set DASHBOARD_PASSWORD in .env to enable access.');
  }
  return authLimiter(req, res, () => {
    const header = req.headers.authorization || '';
    if (header.startsWith('Basic ')) {
      const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
      const pass = decoded.slice(decoded.indexOf(':') + 1);
      // Hash both sides to fixed-length digests: constant-time, no length leak,
      // and never throws on multibyte input (raw-buffer compare would).
      const a = createHash('sha256').update(pass).digest();
      const b = createHash('sha256').update(password).digest();
      if (timingSafeEqual(a, b)) return next();
    }
    res.setHeader('WWW-Authenticate', 'Basic realm="OKCIB Dashboard"');
    res.status(401).send('Authentication required');
  });
}

// ─── INPUT VALIDATION ─────────────────────────────────────────────────────────
// Treat everything from the public form as untrusted: enforce object shape, cap
// field count / string length / nesting depth so a malicious or malformed body
// can't bloat the store or wreck downstream consumers. (XSS is handled by
// escaping at render time in the dashboard.)
function sanitizeQuoteData(raw) {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'Submission must be an object' };
  }
  const MAX_KEYS = 80, MAX_STR = 4000, MAX_DEPTH = 4, MAX_ARR = 50;
  function walk(v, depth) {
    if (depth > MAX_DEPTH) return null;
    if (typeof v === 'string') return v.length > MAX_STR ? v.slice(0, MAX_STR) : v;
    if (typeof v === 'number' || typeof v === 'boolean' || v === null) return v;
    if (Array.isArray(v)) return v.slice(0, MAX_ARR).map(x => walk(x, depth + 1));
    if (typeof v === 'object') {
      const out = {};
      let n = 0;
      for (const k of Object.keys(v)) {
        if (n++ >= MAX_KEYS) break;
        out[String(k).slice(0, 100)] = walk(v[k], depth + 1);
      }
      return out;
    }
    return null; // functions/symbols/undefined dropped
  }
  const cleaned = walk(raw, 0);
  if (!cleaned || Object.keys(cleaned).length === 0) return { ok: false, error: 'Empty submission' };
  return { ok: true, data: cleaned };
}

// Verify an uploaded file really is a PDF/image by its magic bytes, not just its
// client-claimed MIME type (which multer trusts).
function fileSignatureOk(path) {
  let fd;
  try {
    fd = openSync(path, 'r');
    const buf = Buffer.alloc(8);
    const n = readSync(fd, buf, 0, 8, 0);
    const b = buf.subarray(0, n);
    const is = (sig) => b.length >= sig.length && sig.every((v, i) => b[i] === v);
    return (
      is([0x25, 0x50, 0x44, 0x46]) ||                             // %PDF
      is([0xFF, 0xD8, 0xFF]) ||                                   // JPEG
      is([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]) ||     // PNG
      is([0x47, 0x49, 0x46, 0x38])                               // GIF8
    );
  } catch { return false; }
  finally { if (fd !== undefined) { try { closeSync(fd); } catch {} } }
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// POST /api/quote — save a new submission
app.post('/api/quote', quoteLimiter, upload.single('policy'), async (req, res) => {
  const cleanupUpload = () => { if (req.file) { try { unlinkSync(req.file.path); } catch {} } };

  let bodyData;
  try {
    bodyData = req.body.data ? JSON.parse(req.body.data) : req.body;
  } catch {
    cleanupUpload();
    return res.status(400).json({ error: 'Invalid submission data' });
  }

  const clean = sanitizeQuoteData(bodyData);
  if (!clean.ok) { cleanupUpload(); return res.status(400).json({ error: clean.error }); }

  if (req.file && !fileSignatureOk(req.file.path)) {
    cleanupUpload();
    return res.status(400).json({ error: 'Uploaded policy must be a PDF or image' });
  }

  const db = loadDB();
  const submission = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    data: clean.data,
    policyFile: req.file ? { filename: req.file.filename, originalName: req.file.originalname, size: req.file.size } : null,
    quotes: [],
  };
  db.submissions.push(submission);
  saveDB(db);
  res.json({ success: true, id: submission.id });

  // Fire email notifications + CRM forwarding async (don't block response)
  sendSubmissionEmail(submission).catch(err =>
    console.error('Email notification failed:', err.message)
  );
  sendCustomerConfirmationEmail(submission).catch(err =>
    console.error('Customer confirmation failed:', err.message)
  );
  forwardToAMS(submission).catch(err =>
    console.error('AMS forwarding failed:', err.message)
  );
});

// GET /api/quotes — list all submissions
app.get('/api/quotes', (req, res) => {
  const db = loadDB();
  res.json(db.submissions.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

// GET /api/quotes/:id — get one submission
app.get('/api/quotes/:id', (req, res) => {
  const db = loadDB();
  const sub = db.submissions.find(s => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Not found' });
  res.json(sub);
});

// POST /api/agent/quote/:id — trigger the quoting agent
app.post('/api/agent/quote/:id', async (req, res) => {
  const db = loadDB();
  const sub = db.submissions.find(s => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Not found' });

  sub.status = 'running';
  sub.quotes = [];
  saveDB(db);
  res.json({ success: true, message: 'Agent started' });

  const emit = (event) => {
    const clients = sseClients.get(req.params.id) || [];
    clients.forEach(c => c.write(`data: ${JSON.stringify(event)}\n\n`));
    const freshDB = loadDB();
    const freshSub = freshDB.submissions.find(s => s.id === req.params.id);
    if (freshSub) {
      if (event.type === 'quote') freshSub.quotes.push(event);
      if (event.type === 'done') freshSub.status = 'complete';
      if (event.type === 'error') freshSub.status = 'error';
      saveDB(freshDB);
    }
  };

  try {
    await runQuoteAgent(sub.data, emit);
  } catch (err) {
    emit({ type: 'error', message: err.message });
  }
});

// GET /api/agent/stream/:id — SSE for real-time agent updates
app.get('/api/agent/stream/:id', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const id = req.params.id;
  if (!sseClients.has(id)) sseClients.set(id, []);
  sseClients.get(id).push(res);

  req.on('close', () => {
    const clients = sseClients.get(id) || [];
    sseClients.set(id, clients.filter(c => c !== res));
  });
});

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Error handler — turns upload/parse failures into clean 4xx (never a 500 that
// hangs the request) and removes any partially-written upload.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (req.file) { try { unlinkSync(req.file.path); } catch {} }
  const tooBig = err && err.code === 'LIMIT_FILE_SIZE';
  console.error('Request error:', err && err.message);
  if (!res.headersSent) {
    res.status(tooBig ? 413 : 400).json({ error: tooBig ? 'File too large (10MB max)' : 'Bad request' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🛡️  OKCIB Quote Server running at http://localhost:${PORT}`);
  console.log(`📋  Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`📧  Email notifications: ${process.env.EMAIL_USER ? '✅ configured' : '⚠️  not configured (add EMAIL_USER + EMAIL_PASS to .env)'}`);
  console.log(`🔐  Dashboard auth: ${process.env.DASHBOARD_PASSWORD ? '✅ enabled' : '⚠️  LOCKED — set DASHBOARD_PASSWORD in .env to access the dashboard'}`);
  if (process.env.DASHBOARD_PASSWORD && process.env.DASHBOARD_PASSWORD.length < 12) {
    console.log('⚠️  DASHBOARD_PASSWORD is short (<12 chars) — use a longer passphrase.');
  }
  console.log(`📊  AMS lead forwarding: ${process.env.AMS_WEBHOOK_URL && process.env.AMS_WEBHOOK_SECRET ? '✅ configured' : '⚠️  not configured (add AMS_WEBHOOK_URL + AMS_WEBHOOK_SECRET to .env)'}`);
  console.log(`\nPress Ctrl+C to stop\n`);
});
