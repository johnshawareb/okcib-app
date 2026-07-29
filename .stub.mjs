import { readFileSync } from 'fs';
export async function offlineCDN(page) {
  await page.route('**://unpkg.com/**', async route => {
    const url = route.request().url();
    let file = null;
    if (url.includes('babel')) file = 'node_modules/@babel/standalone/babel.min.js';
    else if (url.includes('react-dom')) file = url.includes('production') ? 'node_modules/react-dom/umd/react-dom.production.min.js' : 'node_modules/react-dom/umd/react-dom.development.js';
    else if (url.includes('react')) file = url.includes('production') ? 'node_modules/react/umd/react.production.min.js' : 'node_modules/react/umd/react.development.js';
    if (!file) return route.abort();
    route.fulfill({ contentType: 'application/javascript', body: readFileSync(file, 'utf8') });
  });
  await page.route('**://cdn.tailwindcss.com/**', route =>
    route.fulfill({ contentType: 'application/javascript', body: 'window.tailwind={config:{}};' }));
  await page.route('**://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
}
