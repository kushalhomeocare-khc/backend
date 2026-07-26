/* ==========================================================================
   BUILD MARKER: v19-fill-reset-opacity — search for this exact string
   in the live served file to confirm you have this version, not an
   older one.
   ==========================================================================
   Kushal Online — Three Steps section
   three-steps.js
   Vanilla JS, no framework/build step required.

   Reveal behavior: content is fully visible by default (see CSS — no
   opacity:0 gating). The grow/shrink/tilt effect is driven by
   IntersectionObserver's intersectionRatio, NOT scroll position or
   getBoundingClientRect() — this is what actually works inside
   GoDaddy's "Add HTML" iframe embed (see README for why).

   Content is mirrored from three-steps.json — if you edit one, update
   the other. Kept inline here (rather than fetched) so this still
   works when pasted into a site builder's custom-code block, where
   relative-file fetches are often blocked.
   ========================================================================== */

(function () {
  var DATA = {
    steps: [
      {
        eyebrow: "Step 1",
        title: "Choose Your Plan",
        body: "Select a treatment plan, share your details and health concerns, then complete your secure online payment.",
        image: "https://api.kushalonline.com/image/step1.jpg"
      },
      {
        eyebrow: "Step 2",
        title: "Share Case Details",
        body: "Our doctors review your case, gather additional information and prepare your personalized prescription.",
        image: "https://api.kushalonline.com/image/step2.jpg"
      },
      {
        eyebrow: "Step 3",
        title: "Receive Medicines",
        body: "Medicines are delivered to your doorstep with clear dosage instructions and follow-up support.",
        image: "https://api.kushalonline.com/image/step3.jpg"
      }
    ],
    cta: {
      title: "Start Online Treatment",
      body: "Choose the treatment plan that best suits your needs and begin your journey to better health.",
      buttonText: "Explore Treatment Plans",
      buttonHref: "https://kushalonline.com/start-online-treatment"
    }
  };

  function render(root) {
    var stepsHtml = DATA.steps
      .map(function (step, i) {
        return (
          '<div class="ts-step' +
          (i === 0 ? " ts-step-first" : "") +
          '" data-index="' +
          i +
          '">' +
          '<div class="ts-card">' +
          '<div class="ts-marker"><img src="' +
          step.image +
          '" alt="' +
          step.title +
          '" loading="lazy"></div>' +
          '<div class="ts-step-eyebrow">' +
          step.eyebrow +
          "</div>" +
          "<h3>" +
          step.title +
          "</h3>" +
          "<p>" +
          step.body +
          "</p>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    // target="_top" so the CTA breaks out of any embedding iframe
    // (e.g. GoDaddy's HTML block) and navigates the full browser tab
    // instead of loading inside the sandboxed frame.
    root.innerHTML =
      '<section class="ts-section">' +
      '<div class="ts-wrap">' +
      '<div class="ts-stepper">' +
      '<div class="ts-track"></div>' +
      '<div class="ts-track-fill" id="ts-track-fill"></div>' +
      '<div class="ts-track-arrow" id="ts-arrow-1"></div>' +
      '<div class="ts-track-arrow" id="ts-arrow-2"></div>' +
      '<div class="ts-track-arrow" style="top:auto;bottom:0px"></div>' +
      stepsHtml +
      '<div class="ts-track-connector"></div>' +
      "</div>" +
      '<div class="ts-cta-panel">' +
      "<h3>" +
      DATA.cta.title +
      "</h3>" +
      "<p>" +
      DATA.cta.body +
      "</p>" +
      '<a class="ts-cta-btn" href="' +
      DATA.cta.buttonHref +
      '" target="_top" rel="noopener">' +
      DATA.cta.buttonText +
      "</a>" +
      "</div>" +
      "</div>" +
      "</section>";
  }

  function initIntersectionEffect(root) {
    var steps = Array.prototype.slice.call(root.querySelectorAll(".ts-step"));
    var ctaPanel = root.querySelector(".ts-cta-panel");
    var animatedEls = ctaPanel ? steps.concat([ctaPanel]) : steps;
    var fill = root.querySelector("#ts-track-fill");
    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !steps.length || !("IntersectionObserver" in window)) {
      return; // CSS default already shows everything at full size/opacity
    }

    var ratios = animatedEls.map(function () {
      return 0;
    });

    function applyStep(el, ratio) {
      // Capped at 1.0 (no overshoot) — an earlier version went up to
      // 1.06 for a bigger "pop," but that let cards spill slightly past
      // the section's right edge and create unwanted horizontal scroll
      // space, which was likely causing stuck/sideways scrolling.
      var scale = 0.8 + ratio * 0.2;
      // Floor raised from 0.45 to 0.92 — the fade was applying to the
      // WHOLE card including its background, so even though the card's
      // own background is near-opaque at rest, fading the element's
      // opacity down during scroll transitions let the timeline behind
      // it show through anyway. A much higher floor keeps the timeline
      // hidden throughout, at the cost of a more subtle fade effect.
      var opacity = 0.92 + ratio * 0.08;
      var tilt = (1 - ratio) * 9; // degrees

      el.style.transform =
        "scale(" + scale.toFixed(3) + ") rotateX(" + tilt.toFixed(2) + "deg)";
      el.style.opacity = Math.min(1, opacity).toFixed(2);

      if (ratio > 0.6) {
        el.classList.add("is-active");
      } else {
        el.classList.remove("is-active");
      }
    }

    // Many thresholds so intersectionRatio reports fine-grained changes
    // as each step scrolls through, instead of a handful of jumps.
    var THRESHOLDS = [];
    for (var t = 0; t <= 1; t += 0.02) THRESHOLDS.push(t);

    animatedEls.forEach(function (el, i) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            ratios[i] = entry.intersectionRatio;
            applyStep(el, entry.intersectionRatio);
          });
        },
        { threshold: THRESHOLDS }
      );
      observer.observe(el);
    });

    // --- Fill line: per-step observers again (a whole-stepper single
    // observer was tried, but since the stepper is much taller than half
    // the viewport, its own intersectionRatio can mathematically never
    // reach 1.0 — only a fraction of an oversized target can ever fit in
    // the shrunk detection zone, capping the fill partway regardless of
    // scroll position). Individual cards ARE shorter than that zone, so
    // their own ratio can properly reach 1.0. To avoid the ORIGINAL bug
    // (a card losing its contribution once it scrolls fully off-screen
    // and its live ratio drops to 0), this tracks each card's PEAK ratio
    // instead of its live value — once a card has been fully passed, it
    // keeps contributing 1.0 to the total even after it's scrolled away.
    // BUT: if left purely monotonic, scrolling all the way back up past
    // the whole section would leave the fill stuck solid indefinitely
    // (peaks never being able to decrease). Fix: if every step's LIVE
    // ratio is simultaneously ~0 (meaning the whole section has scrolled
    // out of view in some direction), reset all peaks — safe either way,
    // since if the section was never reached yet the peaks are already 0.
    var peakRatios = steps.map(function () {
      return 0;
    });
    var liveRatios = steps.map(function () {
      return 0;
    });

    function updateFill() {
      if (!fill) return;

      var allZero = liveRatios.every(function (r) {
        return r < 0.01;
      });
      if (allZero) {
        for (var j = 0; j < peakRatios.length; j++) peakRatios[j] = 0;
      }

      var sum = peakRatios.reduce(function (a, b) {
        return a + b;
      }, 0);
      var progress = sum / steps.length;
      fill.style.height = (Math.max(0, Math.min(1, progress)) * 100).toFixed(1) + "%";
    }

    steps.forEach(function (el, i) {
      var fillObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            liveRatios[i] = entry.intersectionRatio;
            peakRatios[i] = Math.max(peakRatios[i], entry.intersectionRatio);
            updateFill();
          });
        },
        { threshold: THRESHOLDS, rootMargin: "0px 0px -65% 0px" }
      );
      fillObserver.observe(el);
    });
  }

  function positionGapArrows(root) {
    var steps = root.querySelectorAll(".ts-step");
    var arrow1 = root.querySelector("#ts-arrow-1");
    var arrow2 = root.querySelector("#ts-arrow-2");
    if (steps.length < 3 || !arrow1 || !arrow2) return;

    // offsetTop/offsetHeight are local-page layout measurements (safe
    // even inside an iframe embed — unlike scroll-position tracking,
    // measuring where elements sit relative to each other on the same
    // page always works). This finds the actual midpoint of the gap
    // between cards, rather than guessing at fixed percentages that
    // don't line up with real card heights.
    // Positioned just above the next card's top edge (not the gap's
    // exact midpoint), per feedback that centered placement looked too
    // buried between cards.
    var gap1 = steps[1].offsetTop - 14;
    var gap2 = steps[2].offsetTop - 14;

    arrow1.style.top = gap1 + "px";
    arrow2.style.top = gap2 + "px";
  }

  function init() {
    var root = document.getElementById("three-steps-root");
    if (!root) return;
    render(root);
    initIntersectionEffect(root);
    positionGapArrows(root);
    window.addEventListener("resize", function () {
      positionGapArrows(root);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
