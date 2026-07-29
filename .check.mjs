import { readFileSync } from 'fs';
import babel from '@babel/standalone';
const html = readFileSync(process.argv[2], 'utf8');
const m = html.match(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/);
if (!m) { console.error('no babel script found'); process.exit(1); }
try { babel.transform(m[1], { presets: ['react'] }); console.log('JSX OK:', process.argv[2]); }
catch (e) { console.error('FAIL:', e.message); process.exit(1); }
