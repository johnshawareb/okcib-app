# Agency CRM — Webforms

Webforms for the agency CRM. **`forms.config.json` is the source of truth**: it registers
every form, its lead `quoteType`, its submit endpoint, and — for schema-driven forms — the
full step/field definition. The HTML files are thin renderers that fetch the config and
render whatever it says.

## Registry (`forms.config.json`)

| id | Lead type | Renderer |
|---|---|---|
| `auto-quote` | `auto` | public site page (`/#/auto-quote`) — registered for reference, fields live in `index.html` |
| `home-quote` | `home` | public site page (`/#/home-quote`) — registered for reference, fields live in `index.html` |
| `hoa-quote` | `hoa` | **schema-driven** — steps/fields defined entirely in the config, rendered by `hoa-quote.html` |

Top-level `endpoint` is the default submit URL for every form; a form can override it with
its own `endpoint` key.

## Using the HOA form

**Standalone page** — serve the folder and link to it:

```
https://okcib.com/agency-crm/forms/hoa-quote.html
```

**Embedded** — iframe it into a CRM page:

```html
<iframe src="/agency-crm/forms/hoa-quote.html" style="width:100%;height:1200px;border:0"></iframe>
```

The renderer fetches `forms.config.json` from the same directory, so deploy the two files
together (plus any other schema-driven forms you add).

### Query-string overrides

| Param | Meaning | Default |
|---|---|---|
| `?form=` | which form id from the config to render | `<body data-form-id>` (`hoa-quote`) |
| `?config=` | URL of the config file | `forms.config.json` next to the page |
| `?endpoint=` | submit endpoint | form `endpoint`, then config `endpoint` (`/api/quote`) |
| `?source=` | lead-source tag stored on the submission | form `source` (`agency-crm/forms/hoa-quote`) |

## Payload

A single JSON POST: every field name from the schema, plus `quoteType`, `source`, and
`submittedAt`. `multi` fields (`amenities`, `protection`, `vendors`, `fundControls`,
`coverageLines`) are arrays of strings; everything else is a string.

## Editing fields

Edit **`forms.config.json`** — not the HTML. Add, remove, or reorder fields under the
form's `steps`; the renderer handles layout, validation, and the payload automatically.

Field kinds: `text`, `date`, `textarea`, `select`, `choice` (single-select buttons),
`multi` (checkbox list), `note` (static callout).

Field options:

- `required: true` — gates the Continue/Submit button
- `showIf: { "field": "hasEmployees", "equals": ["Yes"] }` — conditional display
- `mustMatch: "email"` — value must equal another field (used for confirm-email)
- `default: "Oklahoma"` — initial value
- `half` / `third` — share a row with the adjacent same-width field
- `cols` — button-grid width for `choice`
- `help` — hint text under the control

Adding a whole new form = add an entry to `forms` with `renderer: "schema"` and `steps`,
then copy `hoa-quote.html` to `<id>.html` and set `<body data-form-id="<id>">` (or just
link `hoa-quote.html?form=<id>`).

## Relationship to the public site

The public marketing site (`/index.html` at the repo root) has its own HOA quote page at
`#/hoa-quote` with the same fields and the same `quoteType: 'hoa'` payload. If you change
the questions in the config, mirror them there so the dashboard and agent email stay
consistent.
