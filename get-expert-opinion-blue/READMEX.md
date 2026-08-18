# Get Expert Opinion CTA — Setup Instructions

This section is a self-contained banner (headline + copy + button) styled to
match the existing `online-treatment-cta` component. It needs one file
uploaded to your API host, plus one HTML snippet pasted into GoDaddy.

## Files in this folder

| File | Purpose |
|---|---|
| `get-expert-opinion.css` | All styling. Upload to your host. |
| `get-expert-opinion.js` | CTA click handling + mobile viewport fix. Upload to your host. |
| `get-expert-opinion.html` | The snippet you paste into GoDaddy's HTML section. |
| `content.json` | Reference copy of the text, for easy editing later. Not loaded by the browser. |
| `preview.html` | Local preview only — do not upload this one. |

## Step 1 — Upload CSS and JS to your API host

Upload these two files so they're reachable at:

- `https://api.kushalonline.com/get-expert-opinion-cta/get-expert-opinion.css`
- `https://api.kushalonline.com/get-expert-opinion-cta/get-expert-opinion.js`

This mirrors how `online-treatment.css` / `.js` are hosted for the existing
`online-treatment-cta` section — same folder structure, just a new
subfolder name.

## Step 2 — Add the HTML block in GoDaddy

1. Log in to GoDaddy Website Builder and open the page where this banner
   should appear (e.g. a condition page like Eczema, Sciatica, etc.).
2. Click **Add Section** (or edit an existing section) and choose the
   **HTML** / **Embed** section type — the same block type used for the
   Online Treatment section.
3. Open `get-expert-opinion.html` from this folder, copy the entire
   contents, and paste it into GoDaddy's HTML editor box.
4. Save/publish the section.

GoDaddy renders this HTML section inside its own iframe, so the `<link>`
and `<script>` tags at the top and bottom of the snippet are required —
they load the CSS/JS from your API host into that iframe. Don't strip
them out.

## Step 3 — Confirm it looks right

- Preview the page on both desktop and mobile in GoDaddy before publishing.
- Check that the **Get Expert Opinion** button is clickable and goes to
  `https://kushalonline.com/get-expert-opinion`.
- If the section looks unstyled (plain black text, no cyan background),
  the CSS file isn't loading yet — double-check the upload path in Step 1
  and that the URL in the `<link>` tag matches exactly.

## Editing the copy later

To change the headline, body text, or button text/link:

1. Edit the text directly inside `get-expert-opinion.html` (inside the
   `<h2 class="geo-headline">`, `<p class="geo-sub">`, and
   `<a class="geo-cta">` tags).
2. Re-paste the updated HTML into GoDaddy's HTML section.
3. Update `content.json` to match, so it stays a useful reference for
   next time — it is not read by the live page.

## Troubleshooting

- **Section looks fine locally but not on GoDaddy:** GoDaddy's HTML
  section iframe sometimes needs a hard refresh/republish to pick up
  CSS/JS changes — clear cache or bump a `?v=2` query string on the
  CSS/JS URLs if edits aren't showing.
- **Button doesn't navigate correctly:** the JS tries to escape GoDaddy's
  iframe so the link opens the full site instead of just the embedded
  frame. If a sandbox blocks that, it silently falls back to a normal
  in-frame navigation — this is a GoDaddy platform limitation, not a bug
  in this file.
- **Text touches the screen edges on mobile:** confirm the JS file loaded
  — it inserts a mobile viewport meta tag if GoDaddy's iframe document is
  missing one, which is what keeps the layout from zooming out on phones.
