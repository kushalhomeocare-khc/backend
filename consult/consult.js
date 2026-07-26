/* ==========================================================================
   Kushal Online — Consultation Fee
   consult.js
   ==========================================================================
   Vanilla JS, no build step — same convention as plans.js. Loads
   consult.json and renders a single 3-item accordion: Consultation Fee
   (India), Consultation Fee (Global), and Please Note. Single-open,
   India expanded by default.
   ========================================================================== */

(function () {
  "use strict";

  var DATA_URL = "consult.json";
  var stage = document.getElementById("consultStage");

  /* ---------- icons ---------- */
  var ICONS = {
    india:
      '<svg viewBox="0 0 100 100">' +
        '<defs>' +
          '<clipPath id="consultFlagClip"><circle cx="50" cy="50" r="48"/></clipPath>' +
          '<radialGradient id="consultFlagSheen" cx="32%" cy="26%" r="70%">' +
            '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>' +
            '<stop offset="45%" stop-color="#ffffff" stop-opacity="0.12"/>' +
            '<stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>' +
          '</radialGradient>' +
          '<radialGradient id="consultFlagShade" cx="50%" cy="50%" r="65%">' +
            '<stop offset="68%" stop-color="#000000" stop-opacity="0"/>' +
            '<stop offset="100%" stop-color="#000000" stop-opacity="0.18"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<g clip-path="url(#consultFlagClip)">' +
          '<rect x="0" y="0" width="100" height="33.4" fill="#FF9933"/>' +
          '<rect x="0" y="33.3" width="100" height="33.4" fill="#FFFFFF"/>' +
          '<rect x="0" y="66.6" width="100" height="33.4" fill="#128807"/>' +
          '<circle cx="50" cy="50" r="10" fill="none" stroke="#000080" stroke-width="1.5"/>' +
          '<circle cx="50" cy="50" r="1.6" fill="#000080"/>' +
          '<circle cx="50" cy="50" r="48" fill="url(#consultFlagShade)"/>' +
          '<circle cx="50" cy="50" r="48" fill="url(#consultFlagSheen)"/>' +
        '</g>' +
        '<circle cx="50" cy="50" r="46.5" fill="none" stroke="#F0B429" stroke-width="1.3" opacity="0.6"/>' +
      '</svg>',
    global:
      '<svg viewBox="0 0 100 100">' +
        '<defs>' +
          '<radialGradient id="consultGlobeGrad" cx="34%" cy="28%" r="80%">' +
            '<stop offset="0%" stop-color="#8FD8FA"/>' +
            '<stop offset="52%" stop-color="#2E8FC0"/>' +
            '<stop offset="100%" stop-color="#123047"/>' +
          '</radialGradient>' +
          '<radialGradient id="consultGlobeSheen" cx="32%" cy="24%" r="45%">' +
            '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>' +
            '<stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>' +
          '</radialGradient>' +
          '<radialGradient id="consultGlobeShade" cx="50%" cy="50%" r="65%">' +
            '<stop offset="68%" stop-color="#000000" stop-opacity="0"/>' +
            '<stop offset="100%" stop-color="#000000" stop-opacity="0.22"/>' +
          '</radialGradient>' +
          '<clipPath id="consultGlobeClip"><circle cx="50" cy="50" r="48"/></clipPath>' +
        '</defs>' +
        '<g clip-path="url(#consultGlobeClip)">' +
          '<circle cx="50" cy="50" r="48" fill="url(#consultGlobeGrad)"/>' +
          '<g fill="#3FAE6A" opacity="0.92">' +
            '<path d="M12 18 C20 14 28 16 30 24 C32 30 26 34 20 32 C14 30 8 24 12 18 Z"/>' +
            '<path d="M24 50 C30 48 34 54 32 62 C30 70 24 74 20 68 C16 62 18 54 24 50 Z"/>' +
            '<path d="M46 12 C58 8 75 10 85 18 C90 22 88 28 80 26 C72 24 64 22 58 26 C52 30 44 28 42 22 C40 18 42 14 46 12 Z"/>' +
            '<path d="M46 38 C54 36 60 42 58 52 C56 62 50 70 46 66 C42 62 42 52 44 46 C45 43 45 40 46 38 Z"/>' +
            '<path d="M76 66 C82 64 88 68 86 74 C84 78 78 78 75 74 C73 71 74 68 76 66 Z"/>' +
          '</g>' +
          '<g stroke="rgba(255,255,255,0.35)" stroke-width="1" fill="none">' +
            '<ellipse cx="50" cy="50" rx="48" ry="18"/>' +
            '<ellipse cx="50" cy="50" rx="18" ry="48"/>' +
            '<line x1="2" y1="50" x2="98" y2="50"/>' +
          '</g>' +
          '<circle cx="50" cy="50" r="48" fill="url(#consultGlobeShade)"/>' +
          '<circle cx="50" cy="50" r="48" fill="url(#consultGlobeSheen)"/>' +
        '</g>' +
        '<circle cx="50" cy="50" r="46.5" fill="none" stroke="#F0B429" stroke-width="1.3" opacity="0.6"/>' +
      '</svg>',
    note:
      '<svg viewBox="0 0 100 100">' +
        '<circle cx="50" cy="50" r="48" fill="#1A5F85"/>' +
        '<rect x="30" y="24" width="40" height="52" rx="4" fill="#ffffff"/>' +
        '<rect x="38" y="36" width="24" height="4" rx="2" fill="#1A5F85"/>' +
        '<rect x="38" y="46" width="24" height="4" rx="2" fill="#1A5F85"/>' +
        '<rect x="38" y="56" width="16" height="4" rx="2" fill="#1A5F85"/>' +
      '</svg>'
  };

  var CHECK_SVG =
    '<svg viewBox="0 0 20 20" fill="none">' +
      '<path d="M4 10.5L8 14.5L16 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  var CHEV_SVG =
    '<svg class="plan-chev" viewBox="0 0 20 20" fill="none">' +
      '<path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  /* ---------- fee tab (India / Global) ---------- */
  function buildFeeItem(tab, isOpen) {
    var item = document.createElement("div");
    item.className = "plan-item" + (isOpen ? " open" : "");

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "plan-trigger";
    trigger.innerHTML =
      '<div class="left">' +
        '<div class="plan-name">' +
          '<span class="consult-icon">' + (ICONS[tab.icon] || "") + '</span>' +
          tab.heading +
        '</div>' +
      '</div>' +
      '<div class="right">' +
        '<div class="plan-price">' + tab.price + '</div>' +
        CHEV_SVG +
      '</div>';

    var panel = document.createElement("div");
    panel.className = "plan-panel";

    var inner = document.createElement("div");
    inner.className = "plan-panel-inner";

    if (tab.includes && tab.includes.length) {
      var includesLabel = document.createElement("p");
      includesLabel.className = "plan-includes-label";
      includesLabel.textContent = "What's Included";
      inner.appendChild(includesLabel);

      var grid = document.createElement("div");
      grid.className = "plan-includes-grid";
      tab.includes.forEach(function (inc) {
        var row = document.createElement("div");
        row.className = "plan-include-item";
        row.innerHTML = '<span class="plan-include-check">' + CHECK_SVG + '</span>' + inc;
        grid.appendChild(row);
      });
      inner.appendChild(grid);
    }

    var cta = document.createElement("a");
    cta.href = tab.ctaUrl || "#";
    cta.target = "_top";
    cta.rel = "noopener";
    cta.className = "plan-cta";
    cta.textContent = tab.ctaLabel || "Book Consultation";
    inner.appendChild(cta);

    if (tab.payment) {
      var payNote = document.createElement("div");
      payNote.className = "plan-payment-note";
      payNote.innerHTML =
        '<p class="ppn-sub">' + tab.payment.heading + '</p>' +
        '<p class="ppn-powered">' + tab.payment.poweredBy + '</p>' +
        '<p class="ppn-disclaimer">' + tab.payment.disclaimer + '</p>';
      inner.appendChild(payNote);
    }

    panel.appendChild(inner);
    item.appendChild(trigger);
    item.appendChild(panel);
    wireAccordionItem(item, trigger, panel, inner);

    return item;
  }

  /* ---------- please note tab ---------- */
  function buildNoteItem(tab, isOpen) {
    var item = document.createElement("div");
    item.className = "plan-item" + (isOpen ? " open" : "");

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "plan-trigger";
    trigger.innerHTML =
      '<div class="left">' +
        '<div class="plan-name">' +
          '<span class="consult-icon">' + ICONS.note + '</span>' +
          tab.heading +
        '</div>' +
      '</div>' +
      '<div class="right">' +
        CHEV_SVG +
      '</div>';

    var panel = document.createElement("div");
    panel.className = "plan-panel";

    var inner = document.createElement("div");
    inner.className = "plan-panel-inner";

    if (tab.intro) {
      var p = document.createElement("p");
      p.className = "consult-note-intro";
      p.textContent = tab.intro;
      inner.appendChild(p);
    }

    if (tab.bullets && tab.bullets.length) {
      var ul = document.createElement("ul");
      ul.className = "consult-note-list";
      tab.bullets.forEach(function (b) {
        var li = document.createElement("li");
        li.textContent = b;
        ul.appendChild(li);
      });
      inner.appendChild(ul);
    }

    panel.appendChild(inner);
    item.appendChild(trigger);
    item.appendChild(panel);
    wireAccordionItem(item, trigger, panel, inner);

    return item;
  }

  /* ---------- shared accordion wiring (single-open) ---------- */
  function wireAccordionItem(item, trigger, panel, inner) {
    trigger.addEventListener("click", function () {
      var willOpen = !item.classList.contains("open");

      Array.prototype.forEach.call(stage.querySelectorAll(".plan-item"), function (sib) {
        if (sib !== item) {
          sib.classList.remove("open");
          sib.querySelector(".plan-panel").style.maxHeight = null;
        }
      });

      item.classList.toggle("open", willOpen);
      panel.style.maxHeight = willOpen ? panel.scrollHeight + "px" : null;
      reportHeightSoon();
    });

    if (item.classList.contains("open")) {
      requestAnimationFrame(function () {
        panel.style.maxHeight = panel.scrollHeight + "px";
      });
    }

    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () {
        if (item.classList.contains("open")) {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
      ro.observe(inner);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (item.classList.contains("open")) {
          panel.style.maxHeight = panel.scrollHeight + "px";
          reportHeightSoon();
        }
      });
    }
  }

  /* ---------- report height to parent (for GoDaddy iframe embed) ---------- */
  function reportHeight() {
    if (window.parent === window) return;
    var height = document.body.scrollHeight;
    window.parent.postMessage({ type: "kushalResize", height: height }, "*");
  }

  function reportHeightSoon() {
    reportHeight();
    setTimeout(reportHeight, 400);
  }

  window.addEventListener("resize", reportHeight);

  /* ---------- boot ---------- */
  fetch(DATA_URL)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      stage.innerHTML = "";
      stage.appendChild(buildFeeItem(data.india, true));
      stage.appendChild(buildFeeItem(data.global, false));
      stage.appendChild(buildNoteItem(data.note, false));
      reportHeightSoon();
    })
    .catch(function (err) {
      stage.innerHTML = '<div class="plan-placeholder">Could not load consult.json \u2014 check the file is in the same folder as index.html.</div>';
      console.error("consult.js:", err);
    });
})();
