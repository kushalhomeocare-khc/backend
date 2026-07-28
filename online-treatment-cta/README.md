# Online Treatment Section — GoDaddy Setup (hosted at api.kushalonline.com)

## Files in this folder
- `online-treatment.html` — **paste this entire file into GoDaddy's HTML section, as-is.** It already links to the hosted CSS/JS below — no manual combining needed.
- `online-treatment.css` — upload this to your server so it's reachable at `https://api.kushalonline.com/online-treatment-cta/online-treatment.css`
- `online-treatment.js` — upload this to your server so it's reachable at `https://api.kushalonline.com/online-treatment-cta/online-treatment.js`
- `content.json` — plain-text reference copy of all the wording. **Not loaded automatically** — see note inside the file.

## Setup steps

1. **Upload the CSS and JS files** to your server at the path `online-treatment-cta/`, so they're publicly reachable at:
   - `https://api.kushalonline.com/online-treatment-cta/online-treatment.css`
   - `https://api.kushalonline.com/online-treatment-cta/online-treatment.js`

2. **Verify both URLs work** — open each one directly in a browser tab before moving on. You should see the raw CSS or JS text load. If you get a 404, the files aren't in the right place yet — fix that first, since the whole section depends on these two loading correctly.

3. **In GoDaddy**, go to the site editor → the page with this section → click the HTML section (or add one: **+ Add Section → Files & Web → HTML**) → open **Custom Code**.

4. **Paste the entire contents of `online-treatment.html`** into that box. Nothing else needs to be added or combined — the `<link>` and `<script src>` tags at the top/bottom of that file already point to your hosted CSS/JS.

5. Leave **Forced Height** blank (auto), save, and publish. Test on both desktop and mobile.

## About the "opens in a frame" issue — please read

GoDaddy's HTML section always renders your code inside an iframe on the page. This is documented, known behavior — GoDaddy's own troubleshooting guidance says links inside this section need `target="_blank"` specifically because the embedded code sits inside an iframe.

The CTA link here (`online-treatment.js` → `otHandleCtaClick`) actively **tries** to escape that iframe and open in the same tab, using `window.top.location.href`. This is a genuine attempt — not just the plain `target="_top"` attribute you tried before, which was blocked outright.

**Being upfront: this may still not work.** Whether a script can navigate the top-level page from inside an iframe depends on sandbox restrictions GoDaddy applies internally — settings I can't see or control from outside their platform. If GoDaddy blocks *all* top-navigation attempts (not just the plain HTML attribute), this script will also fail silently, and the link will stay stuck in the frame.

**If it doesn't work after testing:** the reliable fallback is `target="_blank"` (opens in a new tab) — not as clean, but guaranteed to work since it doesn't require escaping the frame. To switch to that: in `online-treatment.html`, remove `onclick="return otHandleCtaClick(this);"` and change `target="_top"` to `target="_blank"`, then re-paste the updated block into GoDaddy.

## About the white line gap on mobile

This is a timing issue: GoDaddy measures your content's height to size its iframe, but the custom Google Fonts load a beat after that first measurement, and text can reflow — especially on mobile, where lines wrap differently. `online-treatment.js` asks the browser to re-signal a resize once fonts are fully loaded, which should prompt GoDaddy to remeasure.

This is a reasonable fix attempt, but I can't confirm GoDaddy's iframe listens for that specific signal internally. **If the gap persists after testing:** go back into the HTML section's settings and set a small fixed height in "Forced Height" (a bit taller than the content) instead of leaving it blank — a fixed height sidesteps the whole timing problem entirely.
