import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { createTransport } from 'nodemailer';
import multer from 'multer';
import { config } from 'dotenv';
import { runQuoteAgent } from './agents/quote-agent.js';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.static(__dirname));

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
host: 'smtp.gmail.com',  port: 587,
secure: true,  auth: {
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

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// POST /api/quote — save a new submission
app.post('/api/quote', upload.single('policy'), async (req, res) => {
  const db = loadDB();
  const bodyData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const submission = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    data: bodyData,
    policyFile: req.file ? { filename: req.file.filename, originalName: req.file.originalname, size: req.file.size } : null,
    quotes: [],
  };
  db.submissions.push(submission);
  saveDB(db);
  res.json({ success: true, id: submission.id });

  // Fire email notification async (don't block response)
  sendSubmissionEmail(submission).catch(err =>
    console.error('Email notification failed:', err.message)
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🛡️  OKCIB Quote Server running at http://localhost:${PORT}`);
  console.log(`📋  Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`📧  Email notifications: ${process.env.EMAIL_USER ? '✅ configured' : '⚠️  not configured (add EMAIL_USER + EMAIL_PASS to .env)'}`);
  console.log(`\nPress Ctrl+C to stop\n`);
});
