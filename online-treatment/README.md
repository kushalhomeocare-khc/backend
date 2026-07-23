# Kushal Online — Treatment Plans section

Same pattern as your A-Z glossary: `index.html` is a static shell,
`style.css` holds all styling, and `plans.js` renders everything else
by reading `plans.json`. To change any text, price, or link, edit
`plans.json` — you should never need to touch `index.html`, `style.css`,
or `plans.js` for routine content updates.

## Files

- `index.html` — static shell (brand, region toggle, empty containers)
- `style.css` — all styling (colors/fonts match the A-Z glossary)
- `plans.js` — reads `plans.json` and builds the page
- `plans.json` — all plan content, pricing, notes, and links

## Payment / checkout links

All links are live, pulled from the current production pages
(`treatment-plans-india` and `treatment-plans-global`):

| Plan | Links to |
|---|---|
| India — 1 Month | `https://pay.kushalonline.com/india.html?planid=1MTP` |
| India — 3 Months | `https://pay.kushalonline.com/india.html?planid=3MTP` |
| India — 6 Months | `https://pay.kushalonline.com/india.html?planid=6MTP` |
| India — 12 Months | `https://pay.kushalonline.com/india.html?planid=12MTP` |
| Global — 3 Months | `https://pay.kushalonline.com/global.html?plan=3MTP` |
| Global — 6 Months | `https://pay.kushalonline.com/global.html?plan=6MTP` |
| Global — 12 Months | `https://pay.kushalonline.com/global.html?plan=12MTP` |
| NRI/OCI WhatsApp enquiry | `https://api.kushalonline.com/nri.html` |

Each lives on a plan object's `"ctaUrl"` field, or on
`"global" → "nriPricing" → "whatsappUrl"`. If a checkout URL ever
changes, update it there — no HTML/JS edits needed.

## Region detection

`plans.js` checks the visitor's browser timezone
(`Intl.DateTimeFormat().resolvedOptions().timeZone`). `Asia/Kolkata`
opens the India tab; anything else opens Global. Visitors can still
tap the toggle to switch manually — detection only sets the default.

## Adding Global content later

The Global block in `plans.json` is fully populated now (pricing,
notes, payment, NRI callout). If pricing changes, edit the `"global"`
object directly — no code changes needed.

## Defaults

- India opens with the **3-Month** plan pre-expanded (`defaultPlan: "3m"`)
- Global opens with the **6-Month** plan pre-expanded (`defaultPlan: "6m"`)

Change these by editing the `"defaultPlan"` value in `plans.json`.
