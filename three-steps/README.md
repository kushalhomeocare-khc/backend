# Three Steps Section

Step-by-step section for the homepage — glassmorphism cards with a
continuous scroll-linked grow/shrink + tilt effect, image markers,
white background with a brand-blue (#12CFFF) and near-black (#161616)
contrast palette. No intro header — the section starts directly at
Step 1.

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
- Step images: `https://api.kushalonline.com/images/step1.jpg`, `step2.jpg`,
  `step3.jpg` — confirm this exact path loads in a browser tab before
  relying on it; an earlier message used `image/step1.jpg` (singular),
  this uses `images/` (plural) matching the base URL set up earlier
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

## How the scroll animation works

Content is fully visible by default — the CSS doesn't hide anything
behind a JS-controlled opacity gate. `three-steps.js` continuously
reads scroll position (throttled via `requestAnimationFrame`) and:

- Scales each step up toward `1.0` and tilts it flat as it nears the
  vertical center of the viewport — this is the "grows as you scroll
  to it" effect.
- Scales it down toward `0.88` and tilts it slightly as it moves away
  from center, in either direction.
- Adds an `.is-active` class (brighter marker ring, deeper card shadow)
  to whichever step is currently centered.
- Fills the connecting line continuously based on how far you've
  scrolled through the whole step list, not in one jump.

Because this runs on every scroll/resize event rather than a one-time
"has this appeared yet" trigger, it keeps responding as you scroll up
and down, not just on first appearance — matching a continuous
parallax feel rather than a single reveal animation.

`prefers-reduced-motion: reduce` disables all of this and shows the
section static at full size/opacity.

### GoDaddy / iframe embeds

An earlier version of this script tried to work around a theoretical
iframe-sandboxing issue by triggering all steps at once shortly after
the section appeared — in testing that actually made it look like
nothing was animating at all, since everything settled before you'd
scrolled far enough to see it. The current version ties the effect
directly to live scroll position instead, which is both simpler and
matches what you actually see happening on the page. If GoDaddy's
embed does turn out to block scroll detection entirely, the section
still displays correctly (just static) since visibility was never
gated on JS in the first place — only the extra motion is.

This same iframe consideration is why the CTA link uses
`target="_top"` (see above) — without it, links can open inside the
small embedded frame instead of the real page.

### Quick check if it's not animating

Open the page, right-click → Inspect → Console, and scroll — you
should see `transform` and `opacity` on `.ts-step` elements changing
live in the Elements panel. If they never change at all while
scrolling, check the Network tab for `three-steps.js` — a 404 or
blocked request means the script isn't loading, and you'd need the
inline version instead (see above).
