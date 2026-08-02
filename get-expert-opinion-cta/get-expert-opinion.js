/**
 * get-expert-opinion.js
 * Hosted at: https://api.kushalonline.com/get-expert-opinion-cta/get-expert-opinion.js
 *
 * Jobs:
 *  1. Read the section's data-condition attribute (e.g. "eczema-dermatitis"),
 *     fetch content/default.json (common fields) and content/<condition>.json
 *     (variable fields), merge them, and render into the DOM.
 *  2. geoHandleCtaClick — escapes GoDaddy's HTML-section iframe to open the
 *     CTA link in the top-level page, falling back to in-frame navigation
 *     if the browser sandbox blocks it.
 *  3. Font-load resize signal — nudges GoDaddy's auto-height iframe to
 *     remeasure once the custom Google Fonts finish loading, since text
 *     can reflow after the initial (fallback-font) measurement.
 */

var GEO_BASE_URL = 'https://api.kushalonline.com/get-expert-opinion-cta/content/';

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

function geoBuildTickSvg() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="#052832" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg>';
}

function geoRenderContent(section, merged) {
  var headingEl = section.querySelector('.geo-headline');
  var subEl = section.querySelector('.geo-sub');
  var descEl = section.querySelector('.geo-desc');
  var includesHeadingEl = section.querySelector('.geo-includes-heading');
  var includesListEl = section.querySelector('.geo-includes-list');
  var feeNoteEl = section.querySelector('.geo-fee-note');
  var ctaEl = section.querySelector('.geo-cta');

  if (headingEl) headingEl.textContent = merged.heading || '';
  if (subEl) subEl.textContent = merged.subheading || '';
  if (descEl) {
    var prefix = (merged.description && merged.description.prefix) || '';
    var suffix = (merged.description && merged.description.suffix) || '';
    descEl.textContent = prefix + (merged.descriptionVariable || '') + suffix;
  }
  if (includesHeadingEl) includesHeadingEl.textContent = (merged.includes && merged.includes.heading) || 'Includes';
  if (includesListEl && merged.includes && merged.includes.items) {
    includesListEl.innerHTML = merged.includes.items.map(function (item) {
      return '<div class="geo-includes-item"><span class="geo-tick">' + geoBuildTickSvg() + '</span><span class="label">' + item + '</span></div>';
    }).join('');
  }
  if (feeNoteEl) feeNoteEl.textContent = merged.feeNote || '';
  if (ctaEl && merged.cta) {
    ctaEl.textContent = merged.cta.text || 'Get Expert Opinion';
    ctaEl.setAttribute('href', merged.cta.url || '#');
  }

  section.setAttribute('data-loading', 'false');
}

function geoInitSection(section) {
  var condition = section.getAttribute('data-condition');
  if (!condition) {
    console.error('get-expert-opinion: missing data-condition attribute on .geo-section');
    return;
  }

  var defaultReq = fetch(GEO_BASE_URL + 'default.json').then(function (r) { return r.json(); });
  var conditionReq = fetch(GEO_BASE_URL + condition + '.json').then(function (r) { return r.json(); });

  Promise.all([defaultReq, conditionReq])
    .then(function (results) {
      var def = results[0];
      var cond = results[1];
      var merged = {
        heading: cond.heading,
        subheading: def.subheading,
        description: def.description,
        descriptionVariable: cond.description,
        includes: def.includes,
        feeNote: def.feeNote,
        cta: def.cta
      };
      geoRenderContent(section, merged);
      window.dispatchEvent(new Event('resize'));
    })
    .catch(function (err) {
      console.error('get-expert-opinion: failed to load content for "' + condition + '"', err);
    });
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
  var sections = document.querySelectorAll('.geo-section[data-condition]');
  for (var i = 0; i < sections.length; i++) {
    geoInitSection(sections[i]);
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
