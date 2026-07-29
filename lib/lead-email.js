import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const FORMS_CONFIG = join(dirname(fileURLToPath(import.meta.url)), '..', 'agency-crm', 'forms', 'forms.config.json');

// Read per call so config edits take effect without restarting the server.
export function loadFormSchema(quoteType) {
  try {
    const config = JSON.parse(readFileSync(FORMS_CONFIG, 'utf8'));
    return (config.forms || []).find(f => f.quoteType === quoteType && f.steps) || null;
  } catch (err) {
    return null;
  }
}

const shown = (v) => (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== '');
const render = (v) => (Array.isArray(v) ? v.join(', ') : String(v));

// Builds the notification from the form schema in forms.config.json, so the email
// never drifts from the questions the applicant actually answered.
export function schemaEmailBody(d, submission, schema, { dashboardUrl } = {}) {
  const used = new Set(['quoteType', 'source', 'submittedAt', 'confirmEmail']);
  const sections = [];

  for (const step of schema.steps) {
    const lines = [];
    for (const field of step.fields) {
      if (!field.name) continue;
      used.add(field.name);
      // Confirmation fields (confirm e-mail) just repeat the value they validate.
      if (field.mustMatch || !shown(d[field.name])) continue;
      lines.push(`  ${field.label}\n    ${render(d[field.name])}`);
    }
    if (lines.length) sections.push(`${step.title.toUpperCase()}\n${lines.join('\n')}`);
  }

  // Anything the schema doesn't know about (e.g. a lead from the shorter public
  // site form) still makes it into the email rather than being dropped.
  const extra = Object.keys(d).filter(k => !used.has(k) && shown(d[k]));
  if (extra.length) {
    sections.push(`ADDITIONAL DETAIL\n${extra.map(k => `  ${k}: ${render(d[k])}`).join('\n')}`);
  }

  const heading = 'New 🏢 Community Association Submission — OKC Insurance Brokers';
  return [
    heading,
    '='.repeat(heading.length),
    `Submitted: ${new Date(submission.createdAt).toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT`,
    d.source ? `Source:    ${d.source}` : null,
    schema.basedOn ? `Based on:  ${schema.basedOn}` : null,
    '',
    sections.join('\n\n'),
    '',
    dashboardUrl ? `View in dashboard: ${dashboardUrl}` : null,
  ].filter(v => v !== null).join('\n');
}
