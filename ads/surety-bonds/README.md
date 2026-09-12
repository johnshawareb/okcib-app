# Oklahoma surety bond social ads (PNG)

Square 1254x1254 image posts, matching the original Auto Dealer Bonds design. Regenerate the four
built ads (not the dealer one, which is the original reference file) with:

```
npm install playwright --no-save   # once, needs the bundled Chromium at /opt/pw-browsers
node build_png.mjs
```

## Post captions / purchase links

| File | Link to put in the post |
|------|--------------------------|
| `AUTO_DEALER_BONDS.png` | `https://mybondapp.com/94833393/DirectNavBond?BondType=R3502MBA2&State=OK` |
| `NOTARY_BONDS.png` | `https://mybondapp.com/94833393/DirectNavBond?BondType=N3500MBA2&State=OK` |
| `SECURITY_GUARD_BONDS.png` | Unarmed: `https://mybondapp.com/94833393/DirectNavBond?BondType=R3583MBA2&State=OK` · Armed: `https://mybondapp.com/94833393/DirectNavBond?BondType=R3504MBA2&State=OK` |
| `CONTRACTOR_BONDS.png` | `https://www.bondexchange.com/bondquote?referral=surety-pro-link&layout-agency=318338&agent=83590` (no direct MyBondApp code on the site for this one) |
| `OMMA_GROWER_BONDS.png` | `https://www.bondexchange.com/bondquote?referral=surety-pro-link&layout-agency=318338&agent=83590` |

These are the same links already live on okcinsurancebrokers.com's bond pages. Since these are flat
images, the link goes in the post's link field or caption, not baked into the pixels.
