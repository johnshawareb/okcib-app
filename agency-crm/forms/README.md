# Agency CRM — Webforms

Drop-in quote forms for the agency CRM. Each form is a single self-contained HTML file
(React + Tailwind from CDN, no build step) that POSTs JSON to the CRM intake endpoint.

## Forms

| File | Lead type | `quoteType` sent |
|---|---|---|
| `hoa-quote.html` | HOA / condo / community association | `hoa` |

## Using a form

**Standalone page** — serve the file and link to it:

```
https://okcib.com/agency-crm/forms/hoa-quote.html
```

**Embedded** — iframe it into a CRM page:

```html
<iframe src="/agency-crm/forms/hoa-quote.html" style="width:100%;height:1200px;border:0"></iframe>
```

## Pointing it at an endpoint

The submit endpoint resolves in this order:

1. `?endpoint=` query string — `hoa-quote.html?endpoint=https://crm.okcib.com/api/leads`
2. `data-endpoint` on `<body>`
3. Default `/api/quote` (the endpoint in `server.js` at the repo root)

`?source=` overrides the `source` field recorded on the lead (default
`agency-crm/forms/hoa-quote`), which is useful for tracking where a lead came from.

## Payload

A single JSON object: every field name from the schema, plus `quoteType`, `source`, and
`submittedAt`. Multi-select fields (`amenities`, `protection`, `vendors`, `fundControls`,
`coverageLines`) are arrays of strings; everything else is a string.

## Editing fields

`hoa-quote.html` is schema-driven — the `SCHEMA` array near the top of the script block is
the whole form. Add, remove, or reorder fields there; the renderer handles layout,
validation, and the payload automatically.

Field kinds: `text`, `date`, `textarea`, `select`, `choice` (single-select buttons),
`multi` (checkbox list), `note` (static callout). Options: `required`, `showIf(form)` for
conditional display, `half`/`third` to share a row, `cols` for button-grid width, `help`
for hint text.

## Relationship to the public site

The public marketing site (`/index.html` at the repo root) has its own HOA quote page at
`#/hoa-quote` with the same fields and the same `quoteType: 'hoa'` payload. If you change
the questions in one, mirror them in the other so the dashboard and agent email stay
consistent.
