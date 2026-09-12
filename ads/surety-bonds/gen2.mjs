import fs from 'fs';
const RED='#E03045', NAVY='#0F2460', GOLD='#F59E0B', INK='#0F172A', PAPER='#F8FAFC';
const BONDEX = 'https://www.bondexchange.com/bondquote?referral=surety-pro-link&layout-agency=318338&agent=83590';
const logo = `<div style="display:flex;align-items:center;gap:10px">
  <svg width="34" height="38" viewBox="0 0 40 44" fill="none" stroke-width="5" stroke-linejoin="round"><path d="M20 3 L36 12 V32 L20 41 L4 32 V12 Z" stroke="#FFFFFF"></path><path d="M20 12 L28 16.5 V27.5 L20 32 L12 27.5 V16.5 Z" stroke="${GOLD}"></path></svg>
  <div style="display:flex;flex-direction:column;line-height:1">
    <span style="font-family:'Archivo Black',Arial,sans-serif;font-size:22px;letter-spacing:1px;color:#FFFFFF">OKC</span>
    <span style="font-family:'Archivo',Arial,sans-serif;font-weight:700;font-size:9px;letter-spacing:2px;color:${GOLD}">INSURANCE BROKERS</span>
  </div></div>`;
const head = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&amp;family=Archivo:wght@500;700;800;900&amp;display=swap">
  <style>
    body { margin: 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; background: ${PAPER}; }
    a { color: inherit; text-decoration: none; }
  </style>
</helmet>`;
const tail = `</x-dc>
</body>
</html>
`;
function frame(inner){
  return `${head}
<div style="width:1200px;height:628px;position:relative;overflow:hidden;background:${NAVY};color:#FFFFFF;box-sizing:border-box;display:flex;flex-direction:column">
  <div style="position:absolute;right:-220px;top:-260px;width:640px;height:640px;border-radius:50%;background:${RED};opacity:0.9"></div>
  <div style="position:absolute;right:-40px;bottom:-260px;width:520px;height:520px;border-radius:50%;background:${GOLD};opacity:0.16"></div>
  ${inner}
</div>
${tail}`;
}
function ctaBtn(label, href, primary){
  const bg = primary ? GOLD : '#FFFFFF';
  const fg = primary ? INK : NAVY;
  return `<a href="${href}" style="display:inline-flex;align-items:center;gap:10px;background:${bg};color:${fg};font-weight:900;font-size:18px;letter-spacing:0.3px;padding:15px 24px;border-radius:999px;box-shadow:0 10px 24px rgba(0,0,0,0.25)">${label} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${fg}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M13 5l7 7-7 7"></path></svg></a>`;
}

// 1. AUTO DEALER
fs.writeFileSync('Dealer.dc.html', frame(`
  <div style="position:relative;padding:44px 56px 0;display:flex;justify-content:space-between;align-items:center">
    ${logo}
    <div style="font-weight:800;font-size:13px;letter-spacing:3px;color:${GOLD};border:2px solid ${GOLD};padding:6px 14px;border-radius:999px">SURETY BONDS</div>
  </div>
  <div style="position:relative;flex:1;padding:20px 56px 0;display:flex;flex-direction:column;justify-content:center;gap:16px;max-width:760px">
    <div style="font-weight:900;font-size:14px;letter-spacing:4px;color:${GOLD}">AUTO DEALERS &amp; WHOLESALERS</div>
    <h1 style="margin:0;font-family:'Archivo Black',Arial,sans-serif;font-size:64px;line-height:0.98;color:#FFFFFF;text-wrap:balance">Dealer bond.<br>Bound today.</h1>
    <p style="margin:0;font-size:19px;line-height:1.5;color:#D7DEF5;max-width:620px">The $25,000 Oklahoma used and wholesale motor vehicle dealer bond. Buy online in minutes &mdash; most bonds issued same day.</p>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px">
      <span style="font-weight:700;font-size:14px;color:#FFFFFF;background:rgba(255,255,255,0.12);padding:8px 14px;border-radius:999px">Rebuilders $15,000</span>
      <span style="font-weight:700;font-size:14px;color:#FFFFFF;background:rgba(255,255,255,0.12);padding:8px 14px;border-radius:999px">City occupation bond $1,000</span>
    </div>
  </div>
  <div style="position:relative;padding:0 56px 44px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap">
    ${ctaBtn('Buy the Dealer Bond Online', 'https://mybondapp.com/94833393/DirectNavBond?BondType=R3502MBA2&State=OK', true)}
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
      <span style="font-weight:900;font-size:22px">(405) 509-9433</span>
      <span style="font-weight:600;font-size:13px;color:#B9C3E8">okcinsurancebrokers.com/bond-insurance</span>
    </div>
  </div>
`));

// 2. CONTRACTOR
fs.writeFileSync('Contractor.dc.html', frame(`
  <div style="position:relative;padding:44px 56px 0;display:flex;justify-content:space-between;align-items:center">
    ${logo}
    <div style="font-weight:800;font-size:13px;letter-spacing:3px;color:${GOLD};border:2px solid ${GOLD};padding:6px 14px;border-radius:999px">SURETY BONDS</div>
  </div>
  <div style="position:relative;flex:1;padding:20px 56px 0;display:flex;flex-direction:column;justify-content:center;gap:16px;max-width:760px">
    <div style="font-weight:900;font-size:14px;letter-spacing:4px;color:${GOLD}">HVAC &middot; PLUMBING &middot; ELECTRICAL &middot; CONCRETE</div>
    <h1 style="margin:0;font-family:'Archivo Black',Arial,sans-serif;font-size:64px;line-height:0.98;color:#FFFFFF;text-wrap:balance">Get licensed.<br>Get bonded.</h1>
    <p style="margin:0;font-size:19px;line-height:1.5;color:#D7DEF5;max-width:620px">The $5,000 Oklahoma contractor license bond, issued online with same-day email delivery. Bid, performance and payment bonds too.</p>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px">
      <span style="font-weight:700;font-size:14px;color:#FFFFFF;background:rgba(255,255,255,0.12);padding:8px 14px;border-radius:999px">CIB license bond</span>
      <span style="font-weight:700;font-size:14px;color:#FFFFFF;background:rgba(255,255,255,0.12);padding:8px 14px;border-radius:999px">Bid &amp; performance bonds</span>
    </div>
  </div>
  <div style="position:relative;padding:0 56px 44px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap">
    ${ctaBtn('Buy Your License Bond Online', BONDEX, true)}
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
      <span style="font-weight:900;font-size:22px">(405) 509-9433</span>
      <span style="font-weight:600;font-size:13px;color:#B9C3E8">okcinsurancebrokers.com/bond-insurance</span>
    </div>
  </div>
`));

// 3. NOTARY
fs.writeFileSync('Notary.dc.html', frame(`
  <div style="position:relative;padding:44px 56px 0;display:flex;justify-content:space-between;align-items:center">
    ${logo}
    <div style="font-weight:800;font-size:13px;letter-spacing:3px;color:${GOLD};border:2px solid ${GOLD};padding:6px 14px;border-radius:999px">SURETY BONDS</div>
  </div>
  <div style="position:relative;flex:1;padding:20px 56px 0;display:flex;flex-direction:column;justify-content:center;gap:16px;max-width:760px">
    <div style="font-weight:900;font-size:14px;letter-spacing:4px;color:${GOLD}">NEW COMMISSIONS &amp; RENEWALS</div>
    <h1 style="margin:0;font-family:'Archivo Black',Arial,sans-serif;font-size:64px;line-height:0.98;color:#FFFFFF;text-wrap:balance">Notary bond.<br>Buy it online.</h1>
    <p style="margin:0;font-size:19px;line-height:1.5;color:#D7DEF5;max-width:620px">Now $10,000, up from $1,000. Get bonded online in minutes &mdash; the executed bond and Power of Attorney letter arrive by email the same day.</p>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px">
      <span style="font-weight:700;font-size:14px;color:#FFFFFF;background:rgba(255,255,255,0.12);padding:8px 14px;border-radius:999px">Four-year term</span>
      <span style="font-weight:700;font-size:14px;color:#FFFFFF;background:rgba(255,255,255,0.12);padding:8px 14px;border-radius:999px">Filed with the Secretary of State</span>
    </div>
  </div>
  <div style="position:relative;padding:0 56px 44px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap">
    ${ctaBtn('Buy the Notary Bond Online', 'https://mybondapp.com/94833393/DirectNavBond?BondType=N3500MBA2&State=OK', true)}
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
      <span style="font-weight:900;font-size:22px">(405) 509-9433</span>
      <span style="font-weight:600;font-size:13px;color:#B9C3E8">okcinsurancebrokers.com/bond-insurance</span>
    </div>
  </div>
`));

// 4. SECURITY GUARD
fs.writeFileSync('SecurityGuard.dc.html', frame(`
  <div style="position:relative;padding:44px 56px 0;display:flex;justify-content:space-between;align-items:center">
    ${logo}
    <div style="font-weight:800;font-size:13px;letter-spacing:3px;color:${GOLD};border:2px solid ${GOLD};padding:6px 14px;border-radius:999px">SURETY BONDS</div>
  </div>
  <div style="position:relative;flex:1;padding:20px 56px 0;display:flex;flex-direction:column;justify-content:center;gap:16px;max-width:760px">
    <div style="font-weight:900;font-size:14px;letter-spacing:4px;color:${GOLD}">ARMED &amp; UNARMED GUARDS</div>
    <h1 style="margin:0;font-family:'Archivo Black',Arial,sans-serif;font-size:64px;line-height:0.98;color:#FFFFFF;text-wrap:balance">Guard bond.<br>From $50.</h1>
    <p style="margin:0;font-size:19px;line-height:1.5;color:#D7DEF5;max-width:620px">$5,000 unarmed bond from $50, $10,000 armed bond from $100. Buy online in minutes.</p>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px">
      <span style="font-weight:700;font-size:14px;color:#FFFFFF;background:rgba(255,255,255,0.12);padding:8px 14px;border-radius:999px">Agency bond $100,000</span>
      <span style="font-weight:700;font-size:14px;color:#FFFFFF;background:rgba(255,255,255,0.12);padding:8px 14px;border-radius:999px">Same-day email delivery</span>
    </div>
  </div>
  <div style="position:relative;padding:0 56px 44px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap">
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      ${ctaBtn('Unarmed, from $50', 'https://mybondapp.com/94833393/DirectNavBond?BondType=R3583MBA2&State=OK', true)}
      ${ctaBtn('Armed, from $100', 'https://mybondapp.com/94833393/DirectNavBond?BondType=R3504MBA2&State=OK', false)}
    </div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
      <span style="font-weight:900;font-size:22px">(405) 509-9433</span>
      <span style="font-weight:600;font-size:13px;color:#B9C3E8">okcinsurancebrokers.com/bond-insurance</span>
    </div>
  </div>
`));

const row = (y, files) => files.map((f,i)=>({file:`${f}.dc.html`,x:i*1300,y,w:1200,h:628}));
fs.writeFileSync('canvas.json', JSON.stringify({
  artboards:[...row(0,['Dealer','Contractor']), ...row(780,['Notary','SecurityGuard'])],
  annotations:[
    {id:'links-note', x:0, y:-320, w:900, text:'REAL PURCHASE LINKS pulled from your live site (okcinsurancebrokers.com bond pages) via MyBondApp direct-issue codes:\nDealer R3502MBA2, Notary N3500MBA2, Unarmed guard R3583MBA2, Armed guard R3504MBA2.\nContractor license bonds have no direct MyBondApp code on your site, so that button goes to your Bond Exchange storefront link, same as your website.\nEvery button click starts the buyer\'s own online application, no John involvement needed unless credit fails.'}
  ],
  launch:{view:'canvas'}
}, null, 2));

// 5. OMMA
fs.writeFileSync('OMMA.dc.html', frame(`
  <div style="position:relative;padding:44px 56px 0;display:flex;justify-content:space-between;align-items:center">
    ${logo}
    <div style="font-weight:800;font-size:13px;letter-spacing:3px;color:${GOLD};border:2px solid ${GOLD};padding:6px 14px;border-radius:999px">SURETY BONDS</div>
  </div>
  <div style="position:relative;flex:1;padding:20px 56px 0;display:flex;flex-direction:column;justify-content:center;gap:16px;max-width:760px">
    <div style="font-weight:900;font-size:14px;letter-spacing:4px;color:${GOLD}">COMMERCIAL GROWERS</div>
    <h1 style="margin:0;font-family:'Archivo Black',Arial,sans-serif;font-size:64px;line-height:0.98;color:#FFFFFF;text-wrap:balance">OMMA bond.<br>About $2,500/yr.</h1>
    <p style="margin:0;font-size:19px;line-height:1.5;color:#D7DEF5;max-width:620px">OMMA requires commercial grower licensees to post a $50,000 surety bond, unless the land has been owned 5+ years. Average premium through us runs about $2,500 a year.</p>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px">
      <span style="font-weight:700;font-size:14px;color:#FFFFFF;background:rgba(255,255,255,0.12);padding:8px 14px;border-radius:999px">$50,000 bond amount</span>
      <span style="font-weight:700;font-size:14px;color:#FFFFFF;background:rgba(255,255,255,0.12);padding:8px 14px;border-radius:999px">5+ year land ownership waives it</span>
    </div>
  </div>
  <div style="position:relative;padding:0 56px 44px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap">
    ${ctaBtn('Buy the OMMA Bond Online', BONDEX, true)}
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
      <span style="font-weight:900;font-size:22px">(405) 509-9433</span>
      <span style="font-weight:600;font-size:13px;color:#B9C3E8">okcinsurancebrokers.com/bond-insurance</span>
    </div>
  </div>
`));

const row2 = (y, files) => files.map((f,i)=>({file:`${f}.dc.html`,x:i*1300,y,w:1200,h:628}));
fs.writeFileSync('canvas.json', JSON.stringify({
  artboards:[...row2(0,['Main','Contractor','OMMA']), ...row2(780,['Notary','SecurityGuard'])],
  annotations:[
    {id:'links-note', x:0, y:-320, w:900, text:'REAL PURCHASE LINKS pulled from your live site (okcinsurancebrokers.com bond pages) via MyBondApp direct-issue codes:\nDealer R3502MBA2, Notary N3500MBA2, Unarmed guard R3583MBA2, Armed guard R3504MBA2.\nContractor license bonds and the OMMA bond have no direct MyBondApp code on your site, so those buttons go to your Bond Exchange storefront link, same as your website.\nEvery button click starts the buyer\'s own online application, no John involvement needed unless credit fails.'}
  ],
  launch:{view:'canvas'}
}, null, 2));
