/* ==========================================================================
   Kushal Online — Treatment Plans
   plans.js
   ==========================================================================
   Vanilla JS, no build step, no frameworks — same convention as glossary.js.
   Loads plans.json, detects the visitor's region from their browser
   timezone, sets the toggle accordingly, and renders plan cards, the
   "Please Note" block, and the payment block for whichever region is
   currently selected.
   ========================================================================== */

(function () {
  "use strict";

  var DATA_URL = "plans.json";
  var data = null;

  var toggleIndia = document.getElementById("region-india");
  var toggleGlobal = document.getElementById("region-global");
  var regionHeader = document.getElementById("regionHeader");
  var plansStage = document.getElementById("plansStage");
  var noteBlock = document.getElementById("noteBlock");
  var nriBlock = document.getElementById("nriBlock");

  /* ---------- region icons ---------- */
  var ICONS = {
    india:
      '<svg viewBox="0 0 100 100">' +
        '<defs>' +
          '<clipPath id="kushalFlagClip"><circle cx="50" cy="50" r="48"/></clipPath>' +
          '<radialGradient id="kushalFlagSheen" cx="32%" cy="26%" r="70%">' +
            '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>' +
            '<stop offset="45%" stop-color="#ffffff" stop-opacity="0.12"/>' +
            '<stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>' +
          '</radialGradient>' +
          '<radialGradient id="kushalFlagShade" cx="50%" cy="50%" r="65%">' +
            '<stop offset="68%" stop-color="#000000" stop-opacity="0"/>' +
            '<stop offset="100%" stop-color="#000000" stop-opacity="0.18"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<g clip-path="url(#kushalFlagClip)">' +
          '<rect x="0" y="0" width="100" height="33.4" fill="#FF9933"/>' +
          '<rect x="0" y="33.3" width="100" height="33.4" fill="#FFFFFF"/>' +
          '<rect x="0" y="66.6" width="100" height="33.4" fill="#128807"/>' +
          '<circle cx="50" cy="50" r="10" fill="none" stroke="#000080" stroke-width="1.5"/>' +
          '<g stroke="#000080" stroke-width="0.6">' +
            '<line x1="53.00" y1="50.00" x2="59.30" y2="50.00"/><line x1="52.90" y1="50.78" x2="58.98" y2="52.41"/>' +
            '<line x1="52.60" y1="51.50" x2="58.05" y2="54.65"/><line x1="52.12" y1="52.12" x2="56.58" y2="56.58"/>' +
            '<line x1="51.50" y1="52.60" x2="54.65" y2="58.05"/><line x1="50.78" y1="52.90" x2="52.41" y2="58.98"/>' +
            '<line x1="50.00" y1="53.00" x2="50.00" y2="59.30"/><line x1="49.22" y1="52.90" x2="47.59" y2="58.98"/>' +
            '<line x1="48.50" y1="52.60" x2="45.35" y2="58.05"/><line x1="47.88" y1="52.12" x2="43.42" y2="56.58"/>' +
            '<line x1="47.40" y1="51.50" x2="41.95" y2="54.65"/><line x1="47.10" y1="50.78" x2="41.02" y2="52.41"/>' +
            '<line x1="47.00" y1="50.00" x2="40.70" y2="50.00"/><line x1="47.10" y1="49.22" x2="41.02" y2="47.59"/>' +
            '<line x1="47.40" y1="48.50" x2="41.95" y2="45.35"/><line x1="47.88" y1="47.88" x2="43.42" y2="43.42"/>' +
            '<line x1="48.50" y1="47.40" x2="45.35" y2="41.95"/><line x1="49.22" y1="47.10" x2="47.59" y2="41.02"/>' +
            '<line x1="50.00" y1="47.00" x2="50.00" y2="40.70"/><line x1="50.78" y1="47.10" x2="52.41" y2="41.02"/>' +
            '<line x1="51.50" y1="47.40" x2="54.65" y2="41.95"/><line x1="52.12" y1="47.88" x2="56.58" y2="43.42"/>' +
            '<line x1="52.60" y1="48.50" x2="58.05" y2="45.35"/><line x1="52.90" y1="49.22" x2="58.98" y2="47.59"/>' +
          '</g>' +
          '<circle cx="50" cy="50" r="1.6" fill="#000080"/>' +
          '<circle cx="50" cy="50" r="48" fill="url(#kushalFlagShade)"/>' +
          '<circle cx="50" cy="50" r="48" fill="url(#kushalFlagSheen)"/>' +
        '</g>' +
        '<circle cx="50" cy="50" r="46.5" fill="none" stroke="#F0B429" stroke-width="1.3" opacity="0.6"/>' +
      '</svg>',
    global:
      '<span class="badge-emoji" role="img" aria-label="Global">\uD83C\uDF0D</span>'
  };

  var CHECK_SVG =
    '<svg viewBox="0 0 20 20" fill="none">' +
      '<path d="M4 10.5L8 14.5L16 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  /* ---------- region detection ---------- */
  function detectRegion() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") {
        return "india";
      }
    } catch (e) {
      /* Intl not available — fall through to default */
    }
    return "global";
  }

  /* ---------- building one plan card ---------- */
  function buildPlanItem(plan, isOpen, payment) {
    var item = document.createElement("div");
    item.className = "plan-item" + (isOpen ? " open" : "");

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "plan-trigger";
    trigger.innerHTML =
      '<div class="left">' +
        '<div class="plan-name">' + plan.name +
          '<span class="plan-tag">' + plan.tag + '</span>' +
        '</div>' +
        '<div class="plan-rate">' + plan.rate + '</div>' +
      '</div>' +
      '<div class="right">' +
        '<div class="plan-price">' + plan.price + '</div>' +
        '<svg class="plan-chev" viewBox="0 0 20 20" fill="none">' +
          '<path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</div>';

    var panel = document.createElement("div");
    panel.className = "plan-panel";

    var inner = document.createElement("div");
    inner.className = "plan-panel-inner";

    if (plan.highlight && plan.highlight.length) {
      // richer expanded view: highlight row + "Treatment Plan Includes" checklist
      var highlightRow = document.createElement("div");
      highlightRow.className = "plan-highlight";
      plan.highlight.forEach(function (h) {
        var item = document.createElement("span");
        item.className = "item";
        item.innerHTML = '<span class="dot"></span>' + h;
        highlightRow.appendChild(item);
      });
      inner.appendChild(highlightRow);

      if (plan.includes && plan.includes.length) {
        var includesLabel = document.createElement("p");
        includesLabel.className = "plan-includes-label";
        includesLabel.textContent = "What's Included";
        inner.appendChild(includesLabel);

        var grid = document.createElement("div");
        grid.className = "plan-includes-grid";
        plan.includes.forEach(function (inc) {
          var row = document.createElement("div");
          row.className = "plan-include-item";
          row.innerHTML = '<span class="plan-include-check">' + CHECK_SVG + '</span>' + inc;
          grid.appendChild(row);
        });
        inner.appendChild(grid);
      }
    } else if (plan.bullets && plan.bullets.length) {
      // simple baseline plan: plain bullet list
      var ul = document.createElement("ul");
      plan.bullets.forEach(function (b) {
        var li = document.createElement("li");
        li.textContent = b;
        ul.appendChild(li);
      });
      inner.appendChild(ul);
    }

    var cta = document.createElement("a");
    cta.href = plan.ctaUrl || "#";
    cta.target = "_top"; // break out of the GoDaddy iframe so checkout opens as a full page
    cta.rel = "noopener";
    cta.className = "plan-cta";
    cta.textContent = "Select This Treatment Plan";
    cta.setAttribute("data-plan-id", plan.id);

    inner.appendChild(cta);

    if (payment) {
      var payNote = document.createElement("div");
      payNote.className = "plan-payment-note";
      payNote.innerHTML =
        '<p class="ppn-sub">' + payment.sub + '</p>' +
        '<p class="ppn-powered">' + payment.poweredBy + '</p>';
      inner.appendChild(payNote);
    }

    panel.appendChild(inner);

    trigger.addEventListener("click", function () {
      var willOpen = !item.classList.contains("open");

      // close any sibling panels for a clean single-open accordion
      Array.prototype.forEach.call(plansStage.querySelectorAll(".plan-item"), function (sib) {
        if (sib !== item) {
          sib.classList.remove("open");
          sib.querySelector(".plan-panel").style.maxHeight = null;
        }
      });

      item.classList.toggle("open", willOpen);
      panel.style.maxHeight = willOpen ? panel.scrollHeight + "px" : null;
      reportHeightSoon();
    });

    item.appendChild(trigger);
    item.appendChild(panel);

    if (isOpen) {
      // set after insertion so scrollHeight is measurable
      requestAnimationFrame(function () {
        panel.style.maxHeight = panel.scrollHeight + "px";
      });
    }

    // Keep the open panel's max-height in sync with its actual content
    // height. Without this, a panel that's open by default (e.g. the
    // default-selected plan on first page load) can be measured before
    // the web font finishes swapping in, leaving it clipped/partially
    // visible until the user interacts with something else. This
    // observer re-measures whenever the content's rendered size changes
    // for any reason (font swap, image load, window resize, text reflow).
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () {
        if (item.classList.contains("open")) {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
      ro.observe(inner);
    }

    // Fallback / extra safety net for browsers without ResizeObserver,
    // and to catch the web font swap explicitly where supported.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (item.classList.contains("open")) {
          panel.style.maxHeight = panel.scrollHeight + "px";
          reportHeightSoon();
        }
      });
    }

    return item;
  }

  /* ---------- render a full region ---------- */
  function renderRegion(regionKey) {
    var region = data[regionKey];
    regionHeader.innerHTML = "";
    plansStage.innerHTML = "";
    noteBlock.innerHTML = "";
    nriBlock.innerHTML = "";

    if (!region) return;

    // region header: flag/globe badge + title
    if (region.headerTitle) {
      var header = document.createElement("div");
      header.className = "region-header";
      var subheadingHtml = region.headerSubtitle
        ? '<p class="region-subheading">' + region.headerSubtitle + '</p>'
        : "";
      header.innerHTML =
        '<div class="region-badge badge-' + regionKey + '">' + (ICONS[regionKey] || "") + '</div>' +
        '<div class="region-copy">' +
          '<p class="region-heading">' + region.headerTitle + '</p>' +
          subheadingHtml +
        '</div>';
      regionHeader.appendChild(header);
    }

    if (region.placeholder) {
      var ph = document.createElement("div");
      ph.className = "plan-placeholder";
      ph.textContent = "Global plan details go here \u2014 this section is wired up and will populate as soon as pricing is added to plans.json.";
      plansStage.appendChild(ph);
    } else {
      region.plans.forEach(function (plan) {
        var isOpen = plan.id === region.defaultPlan;
        plansStage.appendChild(buildPlanItem(plan, isOpen, region.payment));
      });
    }

    // notes
    if (region.notes && region.notes.length) {
      var noteWrap = document.createElement("div");
      noteWrap.className = "note-block";

      var h2 = document.createElement("h2");
      h2.textContent = "Please Note";
      noteWrap.appendChild(h2);

      var ul = document.createElement("ul");
      region.notes.forEach(function (n) {
        var li = document.createElement("li");
        li.textContent = n;
        ul.appendChild(li);
      });
      noteWrap.appendChild(ul);
      noteBlock.appendChild(noteWrap);
    }

    // NRI pricing callout (currently only present for Global)
    if (region.nriPricing) {
      var nri = region.nriPricing;
      var nriWrap = document.createElement("div");
      nriWrap.className = "nri-block";

      var bodyHtml = nri.body
        .split("\n\n")
        .map(function (para) { return "<p>" + para + "</p>"; })
        .join("");

      nriWrap.innerHTML =
        '<h2>' + nri.heading + '</h2>' +
        bodyHtml +
        '<p class="nri-disclaimer">' + nri.disclaimer + '</p>' +
        '<a href="' + (nri.whatsappUrl || "#") + '" target="_top" rel="noopener" class="nri-cta">' + nri.ctaLabel + '</a>';

      nriBlock.appendChild(nriWrap);
    }
  }

  /* ---------- report height to parent (for GoDaddy iframe embed) ---------- */
  function reportHeight() {
    if (window.parent === window) return; // not in an iframe, skip
    var height = document.body.scrollHeight;
    window.parent.postMessage({ type: "kushalResize", height: height }, "*");
  }

  // report after layout settles (accordion open/close transition is 0.35s)
  function reportHeightSoon() {
    reportHeight();
    setTimeout(reportHeight, 400);
  }

  /* ---------- toggle wiring ---------- */
  function currentRegion() {
    return toggleGlobal.checked ? "global" : "india";
  }

  function onToggleChange() {
    renderRegion(currentRegion());
    reportHeightSoon();
  }

  toggleIndia.addEventListener("change", onToggleChange);
  toggleGlobal.addEventListener("change", onToggleChange);

  window.addEventListener("resize", reportHeight);

  /* ---------- boot ---------- */
  fetch(DATA_URL)
    .then(function (res) { return res.json(); })
    .then(function (json) {
      data = json;

      var detected = detectRegion();
      if (detected === "india") {
        toggleIndia.checked = true;
      } else {
        toggleGlobal.checked = true;
      }

      renderRegion(detected);
      reportHeightSoon();
    })
    .catch(function (err) {
      plansStage.innerHTML = '<div class="plan-placeholder">Could not load plans.json \u2014 check the file is in the same folder as index.html.</div>';
      console.error("plans.js:", err);
    });
})();
