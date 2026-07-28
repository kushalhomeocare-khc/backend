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
