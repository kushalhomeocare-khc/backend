# Three Steps Section

Step-by-step section for the homepage — glassmorphism cards with a
continuous IntersectionObserver-driven grow/shrink + tilt effect, image
markers, white background with a brand-blue (#12CFFF) and near-black
(#161616) contrast palette. No intro header — the section starts
directly at Step 1.

## What changed in this round

- **Mobile layout**: card is full-width (100%) and sits *behind* the
  marker — the marker floats on top (`z-index` above the card), and
  the dotted/solid timeline runs behind the card too, so the card
  visually crosses over the timeline instead of sitting to its right.
- **Desktop layout (1024px+)**: reverts to a standard marker → card
  row, card capped at 70% width, no crossing.
- **Card color**: darker/more saturated light blue (was a very pale
  glass tint before).
- **Card padding**: reduced to a minimal `14px 16px 16px` (92px on the
  left on mobile only, to clear the floating marker).
- **Body text**: 16px on mobile, 18px on desktop (was 14.5px flat).
- **Fonts**: Fjalla One for all headings + the "STEP N" labels (now
  bigger — 15px mobile / 17px desktop, was 11px), Open Sans for body
  text (was Roboto).
- **Timeline**: extended past Step 3 with a connector spacer so it
  visibly reaches toward the "Start Online Treatment" panel below.
  The solid fill vs. dotted base was already reversible on scroll
  (fill = live average visibility of all steps) — that behavior is
  unchanged, just confirming it's there since it was easy to miss
  under the other issues.
- **CTA panel**: solid brand blue (`#12CFFF`) background; button is
  black (`#161616`) with brand-blue text (inverted from before).
- **Animation**: transition duration increased from 0.18s to 0.35s
  (was too quick to register), and the scale range widened from
  `0.88–1.0` to `0.8–1.06` (cards now visibly grow larger, slightly
  overshooting full size at peak visibility) so the effect reads
  clearly rather than being subtle.

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
- Step images: `https://api.kushalonline.com/image/step1.jpg`, `step2.jpg`,
  `step3.jpg` (singular `image/`) — confirmed this is the path in use;
  if any still show broken, double check the exact filename/case on
  the server matches these three exactly.
- CTA button: links to `https://kushalonline.com/start-online-treatment`,
  opens with `target="_top"` so it breaks out of any embedding iframe.

---

## Editing content

Edit `three-steps.json` first (it's the readable source of truth), then
copy the same values into the `DATA` object near the top of
`three-steps.js`. The JS keeps its own inline copy of the content
(rather than fetching the `.json` file) because most site builders'
custom-code blocks block relative-file fetches — keeping content inline
in the JS guarantees it works everywhere you paste it.

Each step uses a real image (not an icon), set via `image` in
`DATA.steps` in `three-steps.js`. Images render inside a circular
marker via `object-fit: cover`, so square or center-weighted images
work best.

The "STEP N" label now renders as the first line inside `.ts-card`
(previously it sat outside the card, above it) — this lines up with
the new mobile layout where the card is full-width and the marker
floats on top of it.

## Wiring the CTA button

`DATA.cta.buttonHref` in `three-steps.js` controls where "Explore
Treatment Plans" links to. The anchor also carries `target="_top"` so
that if this section is embedded inside an iframe (GoDaddy's HTML
block, or similar), clicking the button navigates the whole browser
tab instead of loading the destination page inside the small embedded
frame.

---

## Uploading to your site

Upload `three-steps.css` and `three-steps.js` to:

```
https://api.kushalonline.com/three-steps/three-steps.css
https://api.kushalonline.com/three-steps/three-steps.js
```

(`.html` is just a local preview file, not needed on the live site.)

When you update these files after an edit, hard-refresh (or open in a
private/incognito window) before judging the result — browsers and
some CDNs cache `.css`/`.js` aggressively by default.

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

### If your site builder strips `<script src="...">` tags

A few strict CMS sandboxes block external `<script src>` in custom-HTML
widgets for security. If that happens, ask and I can provide a fully
inline version (CSS + JS + HTML pasted together in one block, no
external file requests).

---

## How the animation works (and why it changed twice)

Content is fully visible by default — the CSS never hides anything
behind a JS-controlled opacity gate, so even if the animation fails to
run for some reason, the section still displays correctly, just static.

**Why earlier versions didn't animate on your site:** GoDaddy's "Add
HTML" section renders custom code inside an iframe sized to fit its
content, which never scrolls internally — the outer page scrolls, but
nothing scrolls *inside* that iframe. Two different scroll-detection
approaches both fail there for related but distinct reasons:

1. A one-time "has this appeared yet" trigger (an earlier version)
   fires almost immediately since the iframe's whole content is
   already "visible" to it — everything settles before you've
   scrolled far enough to notice.
2. Continuously reading `getBoundingClientRect()` (the version right
   before this one) returns a **frozen** value from inside a
   non-scrolling iframe, since nothing is scrolling in that frame's
   own coordinate system — so it never updates at all.

**What this version does instead:** it drives the effect off
`IntersectionObserver`'s `intersectionRatio`, which the browser
computes against the real top-level page even from inside a nested
iframe — this is the same mechanism cross-origin ad iframes rely on to
report real on-screen visibility. Each step has its own observer with
many thresholds, so the ratio updates in fine steps as it scrolls
through the viewport:

- Scale grows from `0.88` to `1.0` and tilt flattens from `7deg` to
  `0deg` as a step becomes more visible.
- Opacity rises from `0.55` to `1.0` the same way.
- `.is-active` (brighter marker ring, slightly deeper card shadow)
  applies once a step is more than 60% visible.
- The connecting line's fill height is the average visibility ratio
  across all three steps, so it fills continuously rather than in
  jumps.

`prefers-reduced-motion: reduce` disables all of this and shows the
section static at full size/opacity.

### Quick check if it's still not animating

Open the page, right-click → Inspect → Console, and run:

```js
'IntersectionObserver' in window
```

This should return `true` in any current browser. If it does and the
section still doesn't move while scrolling, check the Network tab for
`three-steps.js` — a 404 or blocked request means the script isn't
loading at all, and you'd need the inline version instead (see above).

---

## About the glass/shadow styling

Earlier drafts used large, heavily blue-tinted shadows (big blur radius
+ color) which read as a hazy "color spill" around cards rather than a
clean glass edge. This version uses smaller, mostly neutral
(black-based, low-opacity) shadows for depth, with a thin brand-blue
ring — not a glow — to mark the active step. `backdrop-filter` blur was
also reduced from 22px to 14px, closer to the original Treatment Plans
card styling.
