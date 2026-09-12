import fs from 'fs';
import { chromium } from 'playwright';

const logoB64 = fs.readFileSync('/home/user/okcib-app/logo.png').toString('base64');
const NAVY1 = '#0a1330', NAVY2 = '#132a5e', BLUE = '#2f6fed', GOLD = '#f5b400';

const ICONS = {
  hardhat: `<path d="M12 3a7 7 0 0 0-7 7v2H4a1 1 0 0 0-1 1v2h18v-2a1 1 0 0 0-1-1h-1v-2a7 7 0 0 0-7-7z"/><path d="M9 4.5V3"/><path d="M15 4.5V3"/>`,
  shielddoc: `<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-8V6z"/><path d="M9 12h6"/><path d="M9 15h4"/>`,
  stamp: `<circle cx="12" cy="9" r="5"/><path d="M9 14l-2 6h10l-2-6"/><path d="M12 6.5v5"/><path d="M9.5 9h5"/>`,
  docpen: `<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9 13l6-6 2 2-6 6H9z"/>`,
  shield: `<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-8V6z"/>`,
  badge: `<circle cx="12" cy="9" r="5"/><path d="M9 14l-2 6 5-3 5 3-2-6"/>`,
  leaf: `<path d="M4 20c8 0 14-6 14-14 0-1 0-2-.3-3-6 0-10 2-12 6-1.5 3-2 7-1.7 11z"/><path d="M4 20c2-6 6-10 12-12"/>`,
  scale: `<path d="M12 3v18"/><path d="M5 8h14"/><path d="M5 8l-3 6a3 3 0 0 0 6 0z"/><path d="M19 8l-3 6a3 3 0 0 0 6 0z"/><path d="M8 21h8"/>`,
};

function iconSvg(name, size=64){
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
}

function badge(iconName, label){
  return `
  <div style="display:flex;flex-direction:column;align-items:center;gap:0">
    <div style="width:190px;height:190px;border-radius:50%;border:5px solid ${GOLD};background:radial-gradient(circle at 35% 30%, rgba(255,255,255,0.10), rgba(255,255,255,0) 60%), ${NAVY2};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(0,0,0,0.45)">
      ${iconSvg(iconName, 84)}
    </div>
    <div style="margin-top:-14px;background:linear-gradient(180deg,#4a8bff,${BLUE});color:#fff;font-family:'Archivo',Arial,sans-serif;font-weight:900;font-size:22px;line-height:1.15;text-align:center;padding:14px 22px 10px;clip-path:polygon(6% 0,94% 0,100% 100%,0% 100%);min-width:230px;text-shadow:0 2px 3px rgba(0,0,0,0.35)">${label}</div>
  </div>`;
}

function page({tagTop, headTop, headBottom, tagline, badges, ctaLabel}){
  return `<!doctype html><html><head><meta charset="utf-8">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@600;700;800;900&display=swap">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{width:1254px;height:1254px;font-family:'Archivo',Arial,sans-serif;position:relative;overflow:hidden;
      background:
        radial-gradient(circle at 18% 8%, rgba(245,180,0,0.16), rgba(245,180,0,0) 42%),
        radial-gradient(circle at 85% 90%, rgba(47,111,237,0.28), rgba(47,111,237,0) 45%),
        linear-gradient(160deg, ${NAVY1} 0%, ${NAVY2} 55%, ${NAVY1} 100%);
    }
    .noise{position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.015) 0 2px,transparent 2px 4px)}
    .rule{flex:1;height:3px;background:linear-gradient(90deg, transparent, ${GOLD}, transparent)}
  </style></head><body>
  <div class="noise"></div>
  <div style="position:relative;height:100%;display:flex;flex-direction:column;align-items:center;padding:70px 70px 60px">
    <div style="font-family:'Archivo',Arial,sans-serif;font-weight:800;font-size:26px;letter-spacing:6px;color:${GOLD};margin-bottom:6px">${tagTop}</div>
    <div style="font-family:'Anton',Impact,sans-serif;font-size:110px;line-height:0.92;color:#FFFFFF;text-align:center;text-shadow:0 6px 0 rgba(0,0,0,0.35), 0 14px 30px rgba(0,0,0,0.5);text-transform:uppercase">${headTop}</div>
    <div style="display:flex;align-items:center;gap:22px;width:100%;max-width:900px;margin:6px 0 8px">
      <div class="rule"></div>
      <div style="font-family:'Anton',Impact,sans-serif;font-size:118px;line-height:0.92;color:${BLUE};text-shadow:0 6px 0 rgba(0,0,0,0.35), 0 14px 34px rgba(0,0,0,0.55);white-space:nowrap">${headBottom}</div>
      <div class="rule"></div>
    </div>
    <div style="display:flex;gap:70px;margin-top:34px">
      ${badges.map(b=>badge(b.icon,b.label)).join('')}
    </div>
    <div style="width:70%;height:3px;background:${GOLD};margin:34px 0 22px;border-radius:2px"></div>
    <div style="font-family:'Archivo',Arial,sans-serif;font-weight:800;font-size:32px;color:#FFFFFF;text-align:center;margin-bottom:24px">${tagline}</div>
    <img src="data:image/png;base64,${logoB64}" style="width:340px;height:auto;margin-bottom:22px" />
    <div style="display:flex;align-items:center;gap:16px;background:linear-gradient(180deg,#4a8bff,${BLUE});border:3px solid ${GOLD};border-radius:14px;padding:20px 40px;box-shadow:0 12px 28px rgba(0,0,0,0.4)">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <span style="font-family:'Archivo',Arial,sans-serif;font-weight:900;font-size:34px;color:#FFFFFF">${ctaLabel}</span>
    </div>
    <div style="margin-top:24px;border:2px solid ${GOLD};border-radius:10px;padding:14px 40px;display:flex;gap:18px;align-items:center">
      <span style="font-family:'Archivo',Arial,sans-serif;font-weight:900;font-size:24px;color:#FFFFFF">OKCIB.com</span>
      <span style="color:${GOLD};font-weight:900;font-size:24px">|</span>
      <span style="font-family:'Archivo',Arial,sans-serif;font-weight:900;font-size:24px;color:#FFFFFF">405-509-9433</span>
    </div>
  </div>
  </body></html>`;
}

const ADS = [
  { file: 'CONTRACTOR_BONDS', tagTop:'OKLAHOMA TRADES', headTop:'CONTRACTOR', headBottom:'BONDS', tagline:'HVAC, plumbing, electrical. Bound same day.',
    badges:[{icon:'hardhat',label:'LICENSE BOND $5,000'},{icon:'shielddoc',label:'BID & PERFORMANCE BONDS'}], ctaLabel:'Purchase Online Today' },
  { file: 'NOTARY_BONDS', tagTop:'NEW & RENEWING NOTARIES', headTop:'NOTARY', headBottom:'BONDS', tagline:'Now $10,000. Bound online in minutes.',
    badges:[{icon:'stamp',label:'NOTARY BOND $10,000'},{icon:'docpen',label:'POA LETTER SAME DAY'}], ctaLabel:'Purchase Online Today' },
  { file: 'SECURITY_GUARD_BONDS', tagTop:'ARMED & UNARMED', headTop:'SECURITY GUARD', headBottom:'BONDS', tagline:'Unarmed from $50. Armed from $100.',
    badges:[{icon:'shield',label:'UNARMED BOND $5,000'},{icon:'badge',label:'ARMED BOND $10,000'}], ctaLabel:'Purchase Online Today' },
  { file: 'OMMA_GROWER_BONDS', tagTop:'COMMERCIAL GROWERS', headTop:'OMMA GROWER', headBottom:'BONDS', tagline:'About $2,500 a year. Statewide.',
    badges:[{icon:'leaf',label:'GROWER BOND $50,000'},{icon:'scale',label:'OMMA COMPLIANCE'}], ctaLabel:'Get Your Bond Quote' },
];

const out = 'png';
fs.mkdirSync(out, {recursive:true});
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const pg = await browser.newPage({ viewport: { width: 1254, height: 1254 } });
for (const ad of ADS) {
  await pg.setContent(page(ad), { waitUntil: 'networkidle' });
  await pg.waitForTimeout(200);
  await pg.screenshot({ path: `${out}/${ad.file}.png` });
  console.log('wrote', ad.file);
}
await browser.close();
