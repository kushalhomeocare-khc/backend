/* ==========================================================================
   Kushal Online — Three Steps section
   three-steps.js
   Vanilla JS, no framework/build step required.

   Reveal behavior: content is fully visible by default (see CSS — no
   opacity:0 gating). The grow/shrink/tilt effect is driven by
   IntersectionObserver's intersectionRatio, NOT scroll position or
   getBoundingClientRect(). This matters specifically for GoDaddy's
   "Add HTML" embed (and similar site-builder embeds): those wrap
   custom code in an iframe that's sized to fit its content and never
   scrolls internally, which means getBoundingClientRect() inside it
   returns a frozen value — it can't see the outer page scrolling at
   all. IntersectionObserver is different: per spec it computes real
   visibility against the top-level page even from inside a nested
   iframe (this is the same mechanism cross-origin ad iframes use to
   report viewability), so it keeps working where scroll-position
   tracking doesn't.

   Each step gets its own observer with many thresholds, so
   intersectionRatio updates in fine steps as it scrolls through the
   viewport — used to drive scale/opacity/tilt continuously rather
   than as a single on/off trigger.

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
        body: "Our doctors review your case, gather additional information if required, and prepare your personalized prescription.",
        image: "https://api.kushalonline.com/image/step2.jpg"
      },
      {
        eyebrow: "Step 3",
        title: "Receive Medicines",
        body: "Medicines are delivered to your doorstep with clear dosage instructions and regular follow-up support.",
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
          '<div class="ts-step" data-index="' +
          i +
          '">' +
          '<div class="ts-marker"><img src="' +
          step.image +
          '" alt="' +
          step.title +
          '" loading="lazy"></div>' +
          '<div class="ts-step-eyebrow">' +
          step.eyebrow +
          "</div>" +
          '<div class="ts-card">' +
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
      stepsHtml +
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
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
      "</a>" +
      "</div>" +
      "</div>" +
      "</section>";
  }

  function initIntersectionEffect(root) {
    var steps = Array.prototype.slice.call(root.querySelectorAll(".ts-step"));
    var fill = root.querySelector("#ts-track-fill");
    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !steps.length || !("IntersectionObserver" in window)) {
      return; // CSS default already shows everything at full size/opacity
    }

    var ratios = steps.map(function () {
      return 0;
    });

    function applyStep(el, ratio) {
      var scale = 0.88 + ratio * 0.12; // 0.88 -> 1.0
      var opacity = 0.55 + ratio * 0.45; // 0.55 -> 1.0
      var tilt = (1 - ratio) * 7; // degrees, always tilts back slightly at the edges

      el.style.transform =
        "scale(" + scale.toFixed(3) + ") rotateX(" + tilt.toFixed(2) + "deg)";
      el.style.opacity = opacity.toFixed(2);

      if (ratio > 0.6) {
        el.classList.add("is-active");
      } else {
        el.classList.remove("is-active");
      }
    }

    function updateFill() {
      if (!fill) return;
      var sum = ratios.reduce(function (a, b) {
        return a + b;
      }, 0);
      var progress = sum / steps.length; // 0..1 across all steps combined
      fill.style.height = (Math.max(0, Math.min(1, progress)) * 100).toFixed(1) + "%";
    }

    // Many thresholds so intersectionRatio reports fine-grained changes
    // as each step scrolls through, instead of a handful of jumps.
    var THRESHOLDS = [];
    for (var t = 0; t <= 1; t += 0.02) THRESHOLDS.push(t);

    steps.forEach(function (el, i) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            ratios[i] = entry.intersectionRatio;
            applyStep(el, entry.intersectionRatio);
            updateFill();
          });
        },
        { threshold: THRESHOLDS }
      );
      observer.observe(el);
    });
  }

  function init() {
    var root = document.getElementById("three-steps-root");
    if (!root) return;
    render(root);
    initIntersectionEffect(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
