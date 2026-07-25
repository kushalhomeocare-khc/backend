# Three Steps Section

"How it works" section for the homepage — scroll-reveal stepper matching
the color/font tokens from `style.css` (Treatment Plans section).

## Files

| File               | Purpose                                             |
|--------------------|------------------------------------------------------|
| `three-steps.html` | Standalone preview page — open in a browser to check it |
| `three-steps.css`  | All styles (scoped with a `ts-` prefix, won't clash) |
| `three-steps.js`   | Builds the markup and runs the scroll-reveal effect |
| `three-steps.json` | Editable source of truth for the copy/content       |
| `README.md`        | This file                                           |

No React, no build step, no dependencies — plain HTML/CSS/JS.

---

## Editing content

Edit `three-steps.json` first (it's the readable source of truth), then
copy the same values into the `DATA` object near the top of
`three-steps.js`. The JS keeps its own inline copy of the content
(rather than fetching the `.json` file) because most site builders'
custom-code blocks block relative-file fetches — keeping content inline
in the JS guarantees it works everywhere you paste it.

Icons: `vial`, `file`, `package` are built in. To add a new one, add an
entry to the `ICONS` object in `three-steps.js` with raw SVG path data
(`viewBox="0 0 24 24"`).

## Wiring the CTA button

`DATA.cta.buttonHref` in `three-steps.js` controls where "Explore
Treatment Plans" links to. Set it to `#treatment-plans` (anchor on the
same page) or a full URL.

---

## Uploading to your site

Upload all four files (`.html` is optional — it's just a local preview,
not needed on the live site) to any public folder on your host or CDN,
e.g.:

```
https://yourdomain.com/sections/three-steps/three-steps.css
https://yourdomain.com/sections/three-steps/three-steps.js
```

---

## Snippet for the site builder

Paste this where the section should appear. It only references the
hosted CSS/JS files, so it stays short and won't get clipped by a code
box's character limit — update the two URLs to wherever you upload the
files.

```html
<link rel="stylesheet" href="https://yourdomain.com/sections/three-steps/three-steps.css">
<div id="three-steps-root"></div>
<script src="https://yourdomain.com/sections/three-steps/three-steps.js" defer></script>
```

That's the entire embed — three lines. The script builds all the
markup into `#three-steps-root` on page load, so there's nothing else
to paste.

### If your site builder only allows one custom-code box (no separate head/body slots)

Some builders (older Squarespace/Wix embeds) only give you a single
insertion point. The snippet above works fine pasted as-is in that
single box — the `<link>` tag doesn't need to be in `<head>` to work.

### If your site builder strips `<script src="...">` tags

A few strict CMS sandboxes block external `<script src>` in custom-HTML
widgets for security. If that happens, ask your developer to add the
section as a proper template/component instead of a custom-code embed
— that's the more robust path, but is more than a copy-paste snippet.
