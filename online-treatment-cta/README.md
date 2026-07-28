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

4. **Paste the snippet below** into that box (this is the exact contents of `online-treatment.html`). Nothing else needs to be added or combined — the `<link>` and `<script src>` tags at the top/bottom already point to your hosted CSS/JS.

```html
<link rel="stylesheet" href="https://api.kushalonline.com/online-treatment-cta/online-treatment.css">

<section class="ot-section">
  <div class="ot-wrap">
    <p class="ot-sub">Begin Online Homeopathy Treatment<br class="mobile-break"> from the Comfort of Your Home.</p>

    <div class="ot-steps">
      <div class="ot-step">
        <span class="ot-step-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        </span>
        <span class="ot-step-body">
          <div class="ot-step-title"><span class="step-num">Step 1</span><span class="step-heading">Select a Treatment Plan</span></div>
          <div class="ot-step-desc">Choose a plan that fits your needs and make the secure online payment.</div>
        </span>
      </div>
      <div class="ot-step">
        <span class="ot-step-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 15h6M9 11h6"/></svg>
        </span>
        <span class="ot-step-body">
          <div class="ot-step-title"><span class="step-num">Step 2</span><span class="step-heading">Share Case Details</span></div>
          <div class="ot-step-desc">Doctor reviews your case and prepares your prescription after detailed case evaluation.</div>
        </span>
      </div>
      <div class="ot-step">
        <span class="ot-step-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="7" width="14" height="11" rx="1"/><path d="M15 10h4l3 3.5V18h-2"/><circle cx="6" cy="19.5" r="1.6"/><circle cx="17.5" cy="19.5" r="1.6"/></svg>
        </span>
        <span class="ot-step-body">
          <div class="ot-step-title"><span class="step-num">Step 3</span><span class="step-heading">Receive Medicines</span></div>
          <div class="ot-step-desc">Homeopathy medicines are delivered to your doorstep across India &amp; worldwide.</div>
        </span>
      </div>
    </div>

    <div class="ot-trust">
      <div class="ot-trust-card">
        <span class="ot-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-4z"/></svg></span>
        <div class="ot-trust-text">25+ Years Experience</div>
      </div>
      <div class="ot-trust-card">
        <span class="ot-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></span>
        <div class="ot-trust-text">50,000+ Cases Treated</div>
      </div>
      <div class="ot-trust-card">
        <span class="ot-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg></span>
        <div class="ot-trust-text">Fully Confidential</div>
      </div>
    </div>

    <a class="ot-cta" href="https://kushalonline.com/start-online-treatment" target="_top" onclick="return otHandleCtaClick(this);">
      Start Online Treatment
    </a>
  </div>
</section>

<script src="https://api.kushalonline.com/online-treatment-cta/online-treatment.js"></script>
```

5. Leave **Forced Height** blank (auto), save, and publish. Test on both desktop and mobile.

## CONFIRMED root cause found (this was the actual bug)

Your screenshot showed the step cards cut off with a hard, unrounded right edge — proof the cards themselves were rendering wider than the phone screen, not a GoDaddy platform quirk.

**The bug:** `online-treatment.css` had a rule `.ot-section *{ box-sizing: border-box; ... }` — that `*` is a *descendant* selector, meaning it applied to everything **inside** `.ot-section` but explicitly excluded `.ot-section` itself. Since the section has `width: 100%` plus `padding: 2px 20px 2px` but was never given `box-sizing: border-box` on itself, the browser used the default `content-box` model — which adds padding *on top of* the specified width, instead of including it within that width. That pushed the whole section (and everything inside it) about 40px wider than the screen, which is exactly what caused the sideways scroll.

**Fixed** by changing that rule to `.ot-section, .ot-section *{ ... }` so the section includes itself. This is a confirmed, direct fix — not a guess this time. Re-upload the CSS file and this should be resolved on mobile.

## About the "opens in a frame" issue — please read

GoDaddy's HTML section always renders your code inside an iframe on the page. This is documented, known behavior — GoDaddy's own troubleshooting guidance says links inside this section need `target="_blank"` specifically because the embedded code sits inside an iframe.

The CTA link here (`online-treatment.js` → `otHandleCtaClick`) actively **tries** to escape that iframe and open in the same tab, using `window.top.location.href`. This is a genuine attempt — not just the plain `target="_top"` attribute you tried before, which was blocked outright.

**Being upfront: this may still not work.** Whether a script can navigate the top-level page from inside an iframe depends on sandbox restrictions GoDaddy applies internally — settings I can't see or control from outside their platform. If GoDaddy blocks *all* top-navigation attempts (not just the plain HTML attribute), this script will also fail silently, and the link will stay stuck in the frame.

**If it doesn't work after testing:** the reliable fallback is `target="_blank"` (opens in a new tab) — not as clean, but guaranteed to work since it doesn't require escaping the frame. To switch to that: in `online-treatment.html`, remove `onclick="return otHandleCtaClick(this);"` and change `target="_top"` to `target="_blank"`, then re-paste the updated block into GoDaddy.

## About the white line gap on mobile

This is a timing issue: GoDaddy measures your content's height to size its iframe, but the custom Google Fonts load a beat after that first measurement, and text can reflow — especially on mobile, where lines wrap differently. `online-treatment.js` asks the browser to re-signal a resize once fonts are fully loaded, which should prompt GoDaddy to remeasure.

This is a reasonable fix attempt, but I can't confirm GoDaddy's iframe listens for that specific signal internally. **If the gap persists after testing:** go back into the HTML section's settings and set a small fixed height in "Forced Height" (a bit taller than the content) instead of leaving it blank — a fixed height sidesteps the whole timing problem entirely.

## Appendix: online-treatment.css (upload as-is to the server)

```css
@import url('https://fonts.googleapis.com/css2?family=Fjalla+One&family=Roboto:wght@300;400;500;700&display=swap');

:root{
  --brand:            #12CFFF;
  --brand-light:      #5CE1FF;
  --brand-deep:       #049FCB;
  --brand-deepest:    #027A9E;
  --ink:              #05303F;
  --ink-soft:         #35606E;
  --white:            #fff;
  --glass-bg:         rgba(255, 255, 255, 0.68);
  --glass-bg-strong:  rgba(255, 255, 255, 0.86);
  --glass-border:     rgba(255, 255, 255, 0.55);

  --shadow-card:      0 3px 10px rgba(3, 60, 78, 0.07), 0 1px 3px rgba(3, 60, 78, 0.05);
  --shadow-card-hover:0 8px 20px rgba(3, 60, 78, 0.12), 0 3px 8px rgba(3, 60, 78, 0.06);
  --shadow-icon:      0 6px 14px rgba(3, 60, 78, 0.22);

  --radius-xl: 28px;
  --radius-lg: 22px;
  --radius-md: 16px;

  --ease-premium: cubic-bezier(0.22, 1, 0.36, 1);
  --font-heading: 'Fjalla One', sans-serif;
  --font-body: 'Roboto', sans-serif;
}
.ot-section, .ot-section *{ box-sizing: border-box; margin:0; padding:0; -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none; }
html, body{
  overflow-x: hidden;
  max-width: 100%;
}

/* ============ SECTION SHELL ============ */
.ot-section{
  position: relative;
  width: 100%;
  max-width: 100%;
  padding: 2px 20px 2px;
  overflow-x: hidden;
  background: var(--brand);
  font-family: var(--font-body);
  color: var(--ink);
}
.ot-wrap{
  position: relative;
  z-index: 1;
  max-width: 460px;
  margin: 0 auto;
}

/* ---- headline / sub ---- */
.ot-headline{
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: 34px;
  line-height: 1.15;
  letter-spacing: 0.2px;
  color: var(--ink);
  margin-bottom: 14px;
  white-space: nowrap;
  text-align: center;
}
.ot-sub{
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 17.5px;
  letter-spacing: 0.3px;
  line-height: 1.3;
  color: var(--ink);
  margin-bottom: 14px;
  max-width: 400px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 420px){
  .ot-headline{
    font-size: calc(6.6vw - 1px);
  }
  .mobile-break{
    display: block;
  }
}
.mobile-break{
  display: none;
}

/* ============ GLASS STEP CARDS ============ */
.ot-steps{
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 14px;
}
.ot-step{
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  border-radius: var(--radius-lg);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  transition: box-shadow 0.3s var(--ease-premium), transform 0.3s var(--ease-premium);
}
.ot-step::before{
  content:"";
  position:absolute; inset:0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 32%);
  opacity:0.7;
  pointer-events:none;
}
.ot-step:hover{
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-1px);
}
.ot-step-icon{
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  width: 48px; height: 48px;
  border-radius: var(--radius-md);
  background: linear-gradient(155deg, var(--brand-light) 0%, var(--brand-deep) 100%);
  box-shadow: var(--shadow-icon);
  display: flex; align-items: center; justify-content: center;
}
.ot-step-icon svg{ width: 23px; height: 23px; }
.ot-step-body{ position: relative; z-index: 1; }
.ot-step-title{
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: 17.5px;
  letter-spacing: 0.2px;
  color: var(--ink);
  margin-bottom: 2px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}
.ot-step-title .step-num{
  color: var(--white);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 11.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: linear-gradient(155deg, var(--brand-light) 0%, var(--brand-deep) 100%);
  border-radius: 6px;
  padding: 4px 10px;
}
.ot-step-title .step-heading{
  font-size: 20.5px;
}
.ot-step-desc{
  font-family: var(--font-body);
  font-size: 18px;
  line-height: 1.3;
  color: var(--ink-soft);
}

/* ============ TRUST STRIP ============ */
.ot-trust{
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.ot-trust-card{
  flex: 1;
  text-align: center;
  padding: 16px 8px;
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
}
.ot-trust-card svg{
  width: 17px; height: 17px;
  stroke: var(--white);
}
.ot-trust-icon{
  width: 31.5px; height: 31.5px;
  border-radius: 9px;
  background: linear-gradient(155deg, var(--brand-light) 0%, var(--brand-deep) 100%);
  box-shadow: var(--shadow-icon);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
}
.ot-trust-text{
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 13px;
  line-height: 1.3;
  color: var(--ink);
}

/* ============ CTA ============ */
.ot-cta,
.ot-cta:link,
.ot-cta:visited,
.ot-cta:active,
.ot-cta:focus,
.ot-cta:focus-visible,
.ot-cta:hover{
  text-decoration: none;
  outline: none;
  border: none;
  box-shadow: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
}
.ot-cta{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  background: var(--ink);
  color: var(--white);
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: 15px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 18px 0;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 10px 24px -8px rgba(5,48,63,0.55);
  transition: transform 0.2s var(--ease-premium), box-shadow 0.2s var(--ease-premium), background 0.2s;
}
.ot-cta svg{ width: 17px; height: 17px; }
.ot-cta:hover{
  background: #082433;
  transform: translateY(-1px);
  box-shadow: 0 14px 28px -8px rgba(5,48,63,0.6);
}
/* ============ DESKTOP-ONLY LAYOUT ============ */
@media (min-width: 900px){
  .ot-cta{
    width: 50%;
    margin: 0 auto;
    display: flex;
  }
  .ot-wrap{
    max-width: 1000px;
  }
  .ot-sub{
    max-width: 700px;
    font-size: 20.5px;
    line-height: 1.4;
  }
  .ot-steps{
    flex-direction: row;
    align-items: stretch;
  }
  .ot-step{
    flex: 1;
    min-width: 0;
  }
  .ot-step-body{
    min-width: 0;
  }
  .ot-step-desc{
    overflow-wrap: break-word;
  }
  .ot-step-title{
    gap: 12px;
    margin-bottom: 12px;
  }
  .ot-trust{
    justify-content: center;
  }
  .ot-trust-card{
    flex: 0 1 220px;
  }
  .ot-trust-icon{
    width: 34.7px;
    height: 34.7px;
  }
  .ot-trust-card svg{
    width: 18.7px;
    height: 18.7px;
  }
  .ot-trust-text{
    font-size: 15px;
  }
}

```

## Appendix: online-treatment.js (upload as-is to the server)

```javascript
/**
 * online-treatment.js
 * Hosted at: https://api.kushalonline.com/online-treatment-cta/online-treatment.js
 *
 * Two independent jobs:
 *  1. otHandleCtaClick — tries to open the CTA link in the SAME tab by
 *     escaping GoDaddy's HTML-section iframe, instead of staying trapped
 *     inside it. Falls back to a normal in-frame navigation if the
 *     browser's sandbox blocks the escape (see README.md — this is a
 *     platform limitation GoDaddy imposes, not something guaranteed to
 *     be fixable from inside the iframe).
 *  2. Font-load resize signal — nudges GoDaddy's auto-height iframe to
 *     remeasure once the custom Google Fonts finish loading, since text
 *     can reflow after the initial (fallback-font) measurement and leave
 *     a gap at the bottom, especially on mobile.
 */

function otHandleCtaClick(anchorEl) {
  var url = anchorEl.getAttribute('href');
  try {
    if (window.top && window.top !== window.self) {
      // We're inside an iframe (GoDaddy's HTML section). Try to navigate
      // the top-level page instead of just this inner frame.
      window.top.location.href = url;
    } else {
      window.location.href = url;
    }
  } catch (e) {
    // Sandbox blocked the cross-frame navigation attempt.
    // Fall back to normal navigation inside the current frame.
    window.location.href = url;
  }
  return false; // prevent the default <a> navigation from also firing
}

(function () {
  // If GoDaddy wraps this section in a container with a fixed pixel width
  // (set in the desktop editor) that isn't responsive on mobile, that
  // wrapper can force the whole widget wider than the phone screen —
  // even though our own layout is fully responsive. Walk up from our
  // section and neutralize any inline fixed-px width we find, as long
  // as that wrapper lives in the SAME document as our code (if the fixed
  // width instead lives on GoDaddy's own page, outside this iframe,
  // browser security blocks us from reaching it — see README).
  function neutralizeFixedWidthAncestors() {
    var el = document.querySelector('.ot-section');
    while (el && el !== document.documentElement) {
      if (el.style && el.style.width && el.style.width.indexOf('px') !== -1) {
        el.style.width = '100%';
        el.style.maxWidth = '100%';
      }
      el = el.parentElement;
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', neutralizeFixedWidthAncestors);
  } else {
    neutralizeFixedWidthAncestors();
  }
})();

(function () {
  // GoDaddy's HTML section renders this inside its own iframe document.
  // If that document lacks a mobile viewport meta tag, phones render it
  // at a wide desktop-style virtual viewport and shrink it to fit —
  // causing sideways scroll/panning on mobile only. Add the tag if missing.
  if (!document.querySelector('meta[name="viewport"]')) {
    var viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1';
    document.head.appendChild(viewportMeta);
  }
})();

(function () {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      window.dispatchEvent(new Event('resize'));
      setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 150);
      setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 500);
    });
  }
  window.addEventListener('load', function () {
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 300);
  });
})();

```
