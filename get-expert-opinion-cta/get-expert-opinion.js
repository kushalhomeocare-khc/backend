/**
 * get-expert-opinion.js
 * Hosted at: https://api.kushalonline.com/get-expert-opinion-cta/get-expert-opinion.js
 *
 * Two independent jobs (same pattern as online-treatment.js):
 *  1. geoHandleCtaClick — tries to open the CTA link in the SAME tab by
 *     escaping GoDaddy's HTML-section iframe, instead of staying trapped
 *     inside it. Falls back to a normal in-frame navigation if the
 *     browser's sandbox blocks the escape.
 *  2. Font-load resize signal — nudges GoDaddy's auto-height iframe to
 *     remeasure once the custom Google Fonts finish loading, since text
 *     can reflow after the initial (fallback-font) measurement and leave
 *     a gap at the bottom, especially on mobile.
 *
 * NOTE: content is NOT fetched dynamically here — each condition page has
 * its own get-expert-opinion.html with the text written directly into the
 * markup (see README.md). This avoids cross-origin fetch() calls, which
 * require CORS headers that api.kushalonline.com does not currently send.
 */

function geoHandleCtaClick(anchorEl) {
  var url = anchorEl.getAttribute('href');
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.href = url;
    } else {
      window.location.href = url;
    }
  } catch (e) {
    window.location.href = url;
  }
  return false;
}

(function () {
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
