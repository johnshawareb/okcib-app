import { chromium } from 'playwright';
import { offlineCDN } from './.stub.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errs = [];
const p2 = await b.newPage(); await offlineCDN(p2);
p2.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
p2.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text().slice(0,200)); });
await p2.goto('http://localhost:3111/agency-crm/forms/hoa-quote.html', { waitUntil: 'networkidle' });
await p2.waitForTimeout(2000);
console.log('h1:', await p2.locator('h1').first().innerText());
// step 1
await p2.getByPlaceholder('e.g. Quail Creek Homeowners Association').fill('Config-Driven HOA');
await p2.getByRole('button', { name: 'HOA', exact: true }).click();
await p2.getByPlaceholder('e.g. 120').fill('64');
await p2.getByPlaceholder('123 Community Drive').fill('12 Schema St');
await p2.getByPlaceholder('Oklahoma City').fill('Yukon');
console.log('state default:', await p2.locator('input').filter({ hasText: '' }).evaluateAll(els => els.find(e => e.value === 'Oklahoma') ? 'Oklahoma' : 'MISSING'));
await p2.getByPlaceholder('73101').fill('73099');
await p2.getByRole('button', { name: 'Professional Management' }).click();
console.log('conditional mgmt field:', await p2.getByPlaceholder('Company name').count());
await p2.getByRole('button', { name: /Continue/ }).click();
// step 2
await p2.getByPlaceholder('e.g. 8').fill('4');
await p2.getByPlaceholder('e.g. 2001').fill('2005');
await p2.getByRole('button', { name: 'Frame', exact: true }).click();
await p2.getByRole('button', { name: /Continue/ }).click();
// step 3
await p2.getByPlaceholder('e.g. 5').fill('7');
await p2.getByRole('button', { name: 'No', exact: true }).first().click();  // hasEmployees = No
await p2.getByRole('button', { name: 'Yes', exact: true }).nth(3).click(); // priorClaims = Yes (choices: COI Y/N/Sometimes, STR Y/N/Restricted...)
await p2.waitForTimeout(300);
const claimDetails = await p2.getByPlaceholder(/Type of claim/).count();
console.log('priorClaims textarea shown:', claimDetails);
if (claimDetails) await p2.getByPlaceholder(/Type of claim/).fill('2024 CC&R dispute, settled');
await p2.getByRole('button', { name: /Continue/ }).click();
// step 4
await p2.getByText('Directors & Officers', { exact: true }).click();
await p2.getByText('Crime / Fidelity Bond', { exact: true }).click();
await p2.getByRole('button', { name: 'Yes', exact: true }).first().click(); // currentCarrier = Yes
await p2.locator('input[type=date]').fill('2026-10-01');
await p2.getByRole('button', { name: /Continue/ }).click();
// step 5 — test mustMatch
await p2.getByPlaceholder('First and last name').fill('Pat President');
await p2.locator('select').first().selectOption('Board President');
await p2.getByPlaceholder('you@email.com').fill('pat@example.com');
await p2.getByPlaceholder('Confirm email').fill('pat@wrong.com');
await p2.getByPlaceholder('(405) 555-0100').fill('4055551234');
await p2.locator('select').nth(1).selectOption('Call');
await p2.waitForTimeout(200);
console.log('mismatch blocks submit:', !(await p2.getByRole('button', { name: /Submit Quote Request/ }).isEnabled()));
await p2.getByPlaceholder('Confirm email').fill('pat@example.com');
await p2.waitForTimeout(200);
await p2.getByRole('button', { name: /Submit Quote Request/ }).click();
await p2.waitForTimeout(2000);
console.log('final:', await p2.locator('h1').first().innerText());
console.log('ERRORS:', errs.length ? errs : 'none');
await b.close();
