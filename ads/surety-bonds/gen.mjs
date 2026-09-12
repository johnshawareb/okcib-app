import fs from 'fs';
const RED='#E63946', NAVY='#1F3A93', INK='#14172B', PAPER='#F7F5F0';
const logo = `<div style="display:flex;align-items:center;gap:12px">
  <svg width="40" height="44" viewBox="0 0 40 44" fill="none" stroke-width="5" stroke-linejoin="round"><path d="M20 3 L36 12 V32 L20 41 L4 32 V12 Z" stroke="${RED}"></path><path d="M20 12 L28 16.5 V27.5 L20 32 L12 27.5 V16.5 Z" stroke="${NAVY}"></path></svg>
  <div style="display:flex;flex-direction:column;line-height:1">
    <span style="font-family:'Anton',Impact,sans-serif;font-size:26px;letter-spacing:2px;color:${RED}">OKC</span>
    <span style="font-family:'Archivo',Arial,sans-serif;font-weight:700;font-size:10px;letter-spacing:2.5px;color:${NAVY}">INSURANCE BROKERS</span>
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
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Archivo:wght@400;600;700;900&amp;display=swap">
  <style>
    body { margin: 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; background: ${PAPER}; }
    a { color: ${RED}; text-decoration: none; } a:hover { color: ${NAVY}; }
  </style>
</helmet>`;
const tail = `</x-dc>
</body>
</html>
`;
const ads = [
 { file:'Main', tag:'AUTO DEALERS', amount:'$25,000', label:'Oklahoma Used Motor Vehicle Dealer Bond', hook:'Dealer bond due? Done today.',
   body:'Required by the Used Motor Vehicle &amp; Parts Commission before you can license or renew. Send your dealer name and license number, we bind and email the sealed bond.',
   chips:['Used and wholesale dealers','Rebuilders: $15,000','Same day when quoted by noon'] },
 { file:'Contractor', tag:'CONTRACTORS', amount:'$5,000', label:'Oklahoma CIB Contractor License Bond', hook:'Get licensed. Get bonded. Get to work.',
   body:'Electrical, plumbing, mechanical and roofing trades licensed by the Construction Industries Board need a $5,000 continuous bond in the license holder&#39;s name. Pair it with the $50K GL the board also requires.',
   chips:['Continuous bond, 30 day notice','Bond plus GL in one call','Bid, performance and payment bonds too'] },
 { file:'Notary', tag:'NOTARIES', amount:'$10,000', label:'Oklahoma Notary Bond, new 2026 amount', hook:'Notary bond jumped to $10K. We have it.',
   body:'Since January 1, 2026 Oklahoma requires a $10,000 notary bond for the four year commission, up from $1,000. New commissions and renewals both need the new amount.',
   chips:['Four year term','Optional notary E&amp;O add on','Filed with the Secretary of State'] },
 { file:'Title', tag:'CAR TITLES', amount:'No title?', label:'Oklahoma Lost Title Bond (bonded title)', hook:'Lost the title? Bond it. Drive it.',
   body:'Service Oklahoma accepts a title bond when the original title is lost, never transferred or missing. Bring the vehicle value and VIN, we set the bond amount and issue the three year bond.',
   chips:['Cars, trucks, trailers, boats, RVs','Three year term','Bond amount set by vehicle value'] },
 { file:'Court', tag:'ESTATES &amp; COURTS', amount:'Court bonds', label:'Probate, guardian and appeal bonds', hook:'The court needs a bond. Not a headache.',
   body:'Oklahoma judges require bonds for executors, administrators, guardians and appeals. We work directly with your attorney&#39;s office so the bond is filed before the hearing.',
   chips:['Probate and administrator bonds','Guardianship bonds','Appeal and injunction bonds'] },
];
for (const a of ads) {
  const html = `${head}
<div style="width:1200px;height:628px;position:relative;overflow:hidden;background:${PAPER};color:${INK};display:flex">
  <div style="position:absolute;left:-140px;top:-40px;width:560px;height:760px;background:${RED};transform:skewX(-12deg)"></div>
  <div style="position:absolute;left:380px;top:-40px;width:36px;height:760px;background:${NAVY};transform:skewX(-12deg)"></div>
  <div style="position:relative;width:420px;padding:44px 0 44px 48px;display:flex;flex-direction:column;justify-content:space-between;color:#FFFFFF">
    <div style="font-family:'Archivo',Arial,sans-serif;font-weight:900;font-size:16px;letter-spacing:4px">${a.tag}</div>
    <div style="display:flex;flex-direction:column;gap:6px">
      <div style="font-family:'Anton',Impact,sans-serif;font-size:${a.amount.length>8?'84px':'116px'};line-height:0.95;letter-spacing:-1px">${a.amount}</div>
      <div style="font-family:'Archivo',Arial,sans-serif;font-weight:700;font-size:18px;line-height:1.3;max-width:300px">${a.label}</div>
    </div>
    <div style="font-family:'Archivo',Arial,sans-serif;font-weight:600;font-size:14px;letter-spacing:1px;opacity:0.9">OKLAHOMA CITY · EDMOND · STATEWIDE</div>
  </div>
  <div style="position:relative;flex:1;padding:44px 52px 44px 64px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="display:flex;justify-content:space-between;align-items:center">
      ${logo}
      <div style="font-family:'Archivo',Arial,sans-serif;font-weight:700;font-size:13px;letter-spacing:2px;color:${NAVY};border:2px solid ${NAVY};padding:6px 12px">SURETY BONDS</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:18px">
      <h1 style="margin:0;font-family:'Anton',Impact,sans-serif;font-size:58px;line-height:1;color:${INK};text-wrap:balance">${a.hook}</h1>
      <p style="margin:0;font-size:18px;line-height:1.45;color:#3A3D52;max-width:600px;text-wrap:pretty">${a.body}</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${a.chips.map(c=>`<span style="font-weight:700;font-size:14px;color:${NAVY};background:#E9ECF7;padding:7px 12px">${c}</span>`).join('\n        ')}
      </div>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:20px">
      <a href="https://okcinsurancebrokers.com/bond-insurance/" style="display:flex;align-items:center;gap:12px;background:${RED};color:#FFFFFF;font-family:'Archivo',Arial,sans-serif;font-weight:900;font-size:20px;letter-spacing:1px;padding:18px 28px">
        <span>GET YOUR BOND</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M13 5l7 7-7 7"></path></svg>
      </a>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
        <span style="font-weight:900;font-size:22px;color:${NAVY}">(405) 509-9433</span>
        <span style="font-weight:600;font-size:14px;color:#3A3D52">okcinsurancebrokers.com/bond-insurance</span>
      </div>
    </div>
  </div>
</div>
${tail}`;
  fs.writeFileSync(`${a.file}.dc.html`, html);
}
// Direction B: stacked navy, amount-first, no diagonal
fs.writeFileSync('DirectionB.dc.html', `${head}
<div style="width:1200px;height:628px;position:relative;overflow:hidden;background:${NAVY};color:#FFFFFF;display:flex;flex-direction:column;justify-content:space-between;padding:48px 56px;box-sizing:border-box">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <div style="font-family:'Anton',Impact,sans-serif;font-size:26px;letter-spacing:2px">OKC <span style="font-family:'Archivo',Arial,sans-serif;font-weight:700;font-size:12px;letter-spacing:3px">INSURANCE BROKERS</span></div>
    <div style="font-weight:700;font-size:13px;letter-spacing:3px;opacity:0.8">DIRECTION B · NAVY BLOCK</div>
  </div>
  <div style="display:flex;align-items:flex-end;gap:40px">
    <div style="font-family:'Anton',Impact,sans-serif;font-size:230px;line-height:0.85;color:${RED}">$25K</div>
    <div style="display:flex;flex-direction:column;gap:12px;padding-bottom:14px">
      <div style="font-family:'Anton',Impact,sans-serif;font-size:44px;line-height:1">Oklahoma dealer bond.<br>Bound today.</div>
      <div style="font-size:18px;line-height:1.4;opacity:0.9;max-width:520px">Required before the Used Motor Vehicle &amp; Parts Commission licenses or renews you. Send name and license number, get the sealed bond by email.</div>
    </div>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center">
    <a href="https://okcinsurancebrokers.com/bond-insurance/" style="background:#FFFFFF;color:${NAVY};font-weight:900;font-size:20px;letter-spacing:1px;padding:18px 30px">GET YOUR BOND</a>
    <span style="font-weight:900;font-size:22px">(405) 509-9433</span>
  </div>
</div>
${tail}`);
// Direction C: light editorial, red rule, big serif-free type
fs.writeFileSync('DirectionC.dc.html', `${head}
<div style="width:1200px;height:628px;position:relative;overflow:hidden;background:#FFFFFF;color:${INK};display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));box-sizing:border-box">
  <div style="padding:52px 40px 52px 60px;display:flex;flex-direction:column;justify-content:space-between;border-right:14px solid ${RED}">
    <div style="font-weight:700;font-size:13px;letter-spacing:3px;color:${NAVY}">DIRECTION C · SPLIT EDITORIAL</div>
    <div style="font-family:'Anton',Impact,sans-serif;font-size:72px;line-height:0.98">Dealer bond due?<br><span style="color:${RED}">Done today.</span></div>
    <div style="font-weight:900;font-size:22px;color:${NAVY}">(405) 509-9433</div>
  </div>
  <div style="padding:52px 60px 52px 48px;display:flex;flex-direction:column;justify-content:space-between;background:${PAPER}">
    <div style="font-family:'Anton',Impact,sans-serif;font-size:26px;letter-spacing:2px;color:${RED}">OKC <span style="font-family:'Archivo',Arial,sans-serif;font-weight:700;font-size:12px;letter-spacing:3px;color:${NAVY}">INSURANCE BROKERS</span></div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="font-size:19px;line-height:1.45;color:#3A3D52">$25,000 Oklahoma Used Motor Vehicle Dealer Bond. Required before the commission licenses or renews you. Send name and license number, get the sealed bond by email.</div>
      <ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;font-weight:700;font-size:16px;color:${NAVY}">
        <li>Used and wholesale dealers</li><li>Rebuilders: $15,000</li><li>Same day when quoted by noon</li>
      </ul>
    </div>
    <a href="https://okcinsurancebrokers.com/bond-insurance/" style="align-self:flex-start;background:${RED};color:#FFFFFF;font-weight:900;font-size:20px;letter-spacing:1px;padding:18px 30px">GET YOUR BOND</a>
  </div>
</div>
${tail}`);
const row = (y, files) => files.map((f,i)=>({file:`${f}.dc.html`,x:i*1300,y,w:1200,h:628}));
fs.writeFileSync('canvas.json', JSON.stringify({
  artboards:[...row(0,['Main','Contractor','Notary']), ...row(780,['Title','Court']), ...row(1560,['DirectionB','DirectionC'])],
  annotations:[
    {id:'research', x:0, y:-300, w:520, text:'WHAT OKLAHOMA IS BUYING (research, Sep 2026)\n1. Used motor vehicle dealer bond: $25,000 (rebuilders $15,000). Your #1 bond line already.\n2. CIB contractor license bond: $5,000 continuous, all CIB trades incl. roofing (HB 1628 roofing endorsement drives new registrations). Board also requires $50K GL: cross sell.\n3. Notary bond: raised to $10,000 on Jan 1, 2026 (was $1,000). Every renewal needs the new amount.\n4. Lost title bonds: steady walk in demand from Service Oklahoma.\n5. Court bonds: probate, guardianship, appeal. Attorney referral play.\nMarkets: RLI (40% commission), Bond Exchange, Ashton, Travelers.'},
    {id:'links', x:560, y:-300, w:520, text:'PURCHASE LINK: no bond specific form exists yet. All buttons point to okcinsurancebrokers.com/bond-insurance/ plus (405) 509-9433.\nRecommended: add a free Jotform "Surety Bond Application" (3 of 5 slots used) and swap the button URL before posting.\nRow 1 and 2: the five ads (1200x628 for Facebook and LinkedIn link posts). Row 3: two alternate looks for the same dealer ad.'}
  ],
  launch:{view:'canvas'}
}, null, 2));
