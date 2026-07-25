/* ==========================================================================
   BUILD MARKER: v10-cta-anim-copy-update — search for this exact string
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
          '<div class="ts-step" data-index="' +
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
      // Wider range than earlier drafts so the grow/shrink is clearly
      // visible: 0.8 -> 1.06 (slightly overshoots 1.0 at full visibility
      // for a more noticeable "pop"), opacity 0.45 -> 1.0.
      var scale = 0.8 + ratio * 0.26;
      var opacity = 0.45 + ratio * 0.55;
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

    // --- Fill line: separate observer, biased to the top half of the
    // viewport (rootMargin shrinks the bottom edge by 50%). A step only
    // starts registering "passed" once it crosses above the vertical
    // center of the screen, so the line stays dotted below center and
    // fills solid above it — reversible as you scroll back down, since
    // it's just live intersection state each frame, not a one-time flag.
    var fillRatios = steps.map(function () {
      return 0;
    });

    function updateFill() {
      if (!fill) return;
      var sum = fillRatios.reduce(function (a, b) {
        return a + b;
      }, 0);
      var progress = sum / steps.length;
      fill.style.height = (Math.max(0, Math.min(1, progress)) * 100).toFixed(1) + "%";
    }

    steps.forEach(function (el, i) {
      var fillObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            fillRatios[i] = entry.intersectionRatio;
            updateFill();
          });
        },
        { threshold: THRESHOLDS, rootMargin: "0px 0px -50% 0px" }
      );
      fillObserver.observe(el);
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
