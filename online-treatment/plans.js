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
  var paymentBlock = document.getElementById("paymentBlock");

  /* ---------- region icons (monoline SVG, no photos/flags) ---------- */
  var ICONS = {
    india:
      '<svg viewBox="0 0 100 100" fill="none">' +
        '<path d="M50 10 C40 10 32 20 34 32 C22 34 14 44 16 56 C10 62 10 74 18 80 C24 90 40 92 50 84 C60 92 76 90 82 80 C90 74 90 62 84 56 C86 44 78 34 66 32 C68 20 60 10 50 10 Z" ' +
          'stroke="#ffffff" stroke-width="2" fill="none" opacity="0.9"/>' +
        '<circle cx="50" cy="50" r="8" stroke="#F0B429" stroke-width="2" fill="none"/>' +
        '<line x1="50" y1="41" x2="50" y2="59" stroke="#F0B429" stroke-width="1.4"/>' +
        '<line x1="41" y1="50" x2="59" y2="50" stroke="#F0B429" stroke-width="1.4"/>' +
      '</svg>',
    global:
      '<svg viewBox="0 0 100 100" fill="none">' +
        '<circle cx="50" cy="50" r="36" stroke="#ffffff" stroke-width="2" opacity="0.9"/>' +
        '<ellipse cx="50" cy="50" rx="36" ry="15" stroke="#ffffff" stroke-width="1.4" opacity="0.7"/>' +
        '<ellipse cx="50" cy="50" rx="15" ry="36" stroke="#ffffff" stroke-width="1.4" opacity="0.7"/>' +
        '<circle cx="50" cy="50" r="2.6" fill="#F0B429"/>' +
        '<circle cx="68" cy="36" r="2.2" fill="#F0B429"/>' +
        '<circle cx="32" cy="64" r="2.2" fill="#F0B429"/>' +
      '</svg>'
  };

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
  function buildPlanItem(plan, currency, isOpen) {
    var item = document.createElement("div");
    item.className = "plan-item" + (isOpen ? " open" : "");

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "plan-trigger";
    trigger.innerHTML =
      '<div class="left">' +
        '<div class="plan-name">' + plan.name +
          '<span class="plan-tag ' + plan.tagType + '">' + plan.tag + '</span>' +
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

    var ul = document.createElement("ul");
    plan.bullets.forEach(function (b) {
      var li = document.createElement("li");
      li.textContent = b;
      ul.appendChild(li);
    });

    var cta = document.createElement("a");
    cta.href = plan.ctaUrl || "#";
    cta.className = "plan-cta";
    cta.textContent = "Select This Plan \u2192";
    cta.setAttribute("data-plan-id", plan.id);

    inner.appendChild(ul);
    inner.appendChild(cta);
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

    return item;
  }

  /* ---------- render a full region ---------- */
  function renderRegion(regionKey) {
    var region = data[regionKey];
    regionHeader.innerHTML = "";
    plansStage.innerHTML = "";
    noteBlock.innerHTML = "";
    nriBlock.innerHTML = "";
    paymentBlock.innerHTML = "";

    if (!region) return;

    // region header: icon badge + title/subtitle
    if (region.headerTitle) {
      var header = document.createElement("div");
      header.className = "region-header";
      header.innerHTML =
        '<div class="region-badge">' + (ICONS[regionKey] || "") + '</div>' +
        '<div class="region-copy">' +
          '<p class="region-heading">' + region.headerTitle + '</p>' +
          '<p class="region-subheading">' + (region.headerSubtitle || "") + '</p>' +
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
        plansStage.appendChild(buildPlanItem(plan, region.currency, isOpen));
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
        '<a href="' + (nri.whatsappUrl || "#") + '" class="nri-cta">' + nri.ctaLabel + '</a>';

      nriBlock.appendChild(nriWrap);
    }

    // payment
    if (region.payment) {
      var p = region.payment;
      var payWrap = document.createElement("div");
      payWrap.className = "payment-block";
      payWrap.innerHTML =
        '<div class="payment-heading-row">' +
          '<span class="line"></span>' +
          '<h2 class="payment-heading">' + p.heading + '</h2>' +
          '<span class="line"></span>' +
        '</div>' +
        '<p class="payment-sub">' + p.sub + '</p>' +
        '<p class="payment-powered">' + p.poweredBy + '</p>' +
        '<p class="payment-disclaimer">Note: ' + p.disclaimer + '</p>';
      paymentBlock.appendChild(payWrap);
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
