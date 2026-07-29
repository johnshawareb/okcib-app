#!/usr/bin/env node
// Copies forms.config.json into the #embedded-config block of each schema-driven
// form so the HTML files still work when dropped in without the config alongside.
//
//   node agency-crm/forms/sync-embedded-config.mjs        # write
//   node agency-crm/forms/sync-embedded-config.mjs --check # verify only (CI)

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const configPath = join(here, 'forms.config.json');
const check = process.argv.includes('--check');

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const BLOCK = /(<script type="application\/json" id="embedded-config">\n)([\s\S]*?)(\n<\/script>)/;

let stale = 0;
for (const form of config.forms) {
  if (form.renderer !== 'schema' || !form.file) continue;

  const htmlPath = join(here, form.file);
  const html = readFileSync(htmlPath, 'utf8');
  if (!BLOCK.test(html)) {
    console.error(`✗ ${form.file}: no #embedded-config block found`);
    process.exitCode = 1;
    continue;
  }

  // Embed the whole config, minus the step definitions of other forms — each file
  // only needs its own schema, and the registry entries stay small.
  const embedded = {
    ...config,
    forms: config.forms.map(f => (f.id === form.id ? f : { ...f, steps: undefined })),
  };
  const json = JSON.stringify(embedded, (k, v) => (v === undefined ? undefined : v), 2);
  const updated = html.replace(BLOCK, (_, open, current, close) => {
    if (current.trim() !== json.trim()) stale++;
    return open + json + close;
  });

  if (check) {
    if (updated !== html) console.error(`✗ ${form.file}: embedded config is out of date — run npm run forms:sync`);
  } else if (updated !== html) {
    writeFileSync(htmlPath, updated);
    console.log(`✓ ${form.file}: embedded config updated`);
  } else {
    console.log(`· ${form.file}: already up to date`);
  }
}

if (check && stale > 0) process.exitCode = 1;
