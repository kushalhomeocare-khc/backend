# Three Steps Section

Step-by-step section for the homepage — cascading reveal on appearance,
image markers, white background with a brand-blue (#12CFFF) and near-
black (#161616) contrast palette. No intro header — the section starts
directly at Step 1.

## Files

| File               | Purpose                                             |
|--------------------|------------------------------------------------------|
| `three-steps.html` | Standalone preview page — open in a browser to check it |
| `three-steps.css`  | All styles (scoped with a `ts-` prefix, won't clash) |
| `three-steps.js`   | Builds the markup and runs the reveal effect        |
| `three-steps.json` | Editable source of truth for the copy/content       |
| `README.md`        | This file                                           |

No React, no build step, no dependencies — plain HTML/CSS/JS.

---

## Live URLs currently wired in

- Section host: `https://api.kushalonline.com/three-steps/`
- Step images: `https://api.kushalonline.com/images/step1`, `step2`, `step3`
- CTA button: links to `https://kushalonline.com/start-online-treatment`,
  opens with `target="_top"` so it breaks out of any embedding iframe
  (this fixes the earlier issue where the link opened inside the frame
  instead of navigating the full page)

---

## Editing content

Edit `three-steps.json` first (it's the readable source of truth), then
copy the same values into the `DATA` object near the top of
`three-steps.js`. The JS keeps its own inline copy of the content
(rather than fetching the `.json` file) because most site builders'
custom-code blocks block relative-file fetches — keeping content inline
in the JS guarantees it works everywhere you paste it.

Each step now uses a real image (not an icon) — set via `image` in
`DATA.steps` in `three-steps.js`. Images render inside a circular
marker via `object-fit: cover`, so square or center-weighted images
work best.

## Wiring the CTA button

`DATA.cta.buttonHref` in `three-steps.js` controls where "Explore
Treatment Plans" links to — currently
`https://kushalonline.com/start-online-treatment`. The anchor also
carries `target="_top"` so that if this section is ever embedded inside
an iframe (GoDaddy's HTML block, or similar), clicking the button
navigates the whole browser tab instead of loading the destination
page inside the small embedded frame.

---

## Uploading to your site

Upload `three-steps.css` and `three-steps.js` to:

```
https://api.kushalonline.com/three-steps/three-steps.css
https://api.kushalonline.com/three-steps/three-steps.js
```

(`.html` is just a local preview file, not needed on the live site.)

---

## Snippet for the site builder

Paste this where the section should appear:

```html
<link rel="stylesheet" href="https://api.kushalonline.com/three-steps/three-steps.css">
<div id="three-steps-root"></div>
<script src="https://api.kushalonline.com/three-steps/three-steps.js" defer></script>
```

That's the entire embed — three lines. The script builds all the
markup into `#three-steps-root` on page load.

### If your site builder only allows one custom-code box (no separate head/body slots)

The snippet above works fine pasted as-is in a single box — the
`<link>` tag doesn't need to be in `<head>` to work.

### If your site builder strips `<script src="...">` tags

A few strict CMS sandboxes block external `<script src>` in custom-HTML
widgets for security. If that happens, ask and I can provide a fully
inline version (CSS + JS + HTML pasted together in one block, no
external file requests).

---

## GoDaddy Website Builder notes

GoDaddy's "Add HTML" section renders custom code inside an iframe that
auto-sizes to fit its content. Since that iframe has no independent
scrolling of its own (the outer page scrolls, not the iframe), a reveal
effect based on "has this element scrolled into the page's viewport"
can't detect real scroll position from inside it.

To work reliably inside that kind of embed, `three-steps.js` doesn't
tie each step to its own scroll offset. Instead:

- The whole section triggers once, the first time it appears at all.
- The three steps cascade in with a ~220ms stagger between them —
  reads as an animated entrance, just triggered on appearance rather
  than exact scroll position.
- A 1.5-second safety timer force-reveals the section if the trigger
  never fires for any reason, so it can never get stuck invisible.

This same iframe sandboxing is also why the CTA link needed
`target="_top"` (see above) — without it, links open inside the small
embedded frame instead of the real page.

### Quick check if animation still looks static

Open the page, right-click → Inspect → Console, and run:

```js
document.querySelectorAll('.ts-step.is-visible').length
```

- Returns `3` immediately on load → cascade fired correctly on
  appearance (expected, not a bug).
- Returns `0` and never changes → JS likely isn't running. Check the
  Network tab for `three-steps.js` — a 404 or blocked request means
  GoDaddy isn't loading it, and you'd need the inline version instead.
