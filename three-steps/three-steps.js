/* ==========================================================================
   Kushal Online — Three Steps section
   three-steps.js
   Vanilla JS, no framework/build step required.

   Reveal behavior: content is fully visible by default (see CSS — no
   opacity:0 gating). This script continuously reads scroll position and
   scales/tilts each step up as it nears the vertical center of the
   viewport, and back down as it moves away — a real scroll-linked
   "grows near you, shrinks away" effect, not a one-time trigger. Runs
   on a rAF-throttled scroll/resize listener so it works smoothly on
   any page that scrolls normally (including inside an auto-height
   iframe embed, as long as the iframe scrolls with the page).

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
        image: "https://api.kushalonline.com/images/step1.jpg"
      },
      {
        eyebrow: "Step 2",
        title: "Share Case Details",
        body: "Our doctors review your case, gather additional information if required, and prepare your personalized prescription.",
        image: "https://api.kushalonline.com/images/step2.jpg"
      },
      {
        eyebrow: "Step 3",
        title: "Receive Medicines",
        body: "Medicines are delivered to your doorstep with clear dosage instructions and regular follow-up support.",
        image: "https://api.kushalonline.com/images/step3.jpg"
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

  function initScrollEffect(root) {
    var steps = Array.prototype.slice.call(root.querySelectorAll(".ts-step"));
    var fill = root.querySelector("#ts-track-fill");
    var stepper = root.querySelector(".ts-stepper");
    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !steps.length) return;

    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var viewportCenter = vh / 2;

      steps.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var elCenter = rect.top + rect.height / 2;
        var offset = elCenter - viewportCenter; // negative = above center
        var dist = Math.abs(offset);
        var maxDist = vh * 0.75;
        var t = Math.min(dist / maxDist, 1); // 0 = centered, 1 = far away

        var scale = 1 - t * 0.12; // 1.0 down to 0.88
        var opacity = 1 - t * 0.45; // 1.0 down to 0.55
        var tiltDeg = Math.max(-7, Math.min(7, (offset / vh) * 14));

        el.style.transform =
          "scale(" + scale.toFixed(3) + ") rotateX(" + (-tiltDeg).toFixed(2) + "deg)";
        el.style.opacity = opacity.toFixed(2);

        if (t < 0.32) {
          el.classList.add("is-active");
        } else {
          el.classList.remove("is-active");
        }
      });

      if (fill && stepper) {
        var stepperRect = stepper.getBoundingClientRect();
        var progress =
          (viewportCenter - stepperRect.top) / (stepperRect.height || 1);
        progress = Math.max(0, Math.min(1, progress));
        fill.style.height = (progress * 100).toFixed(1) + "%";
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  function init() {
    var root = document.getElementById("three-steps-root");
    if (!root) return;
    render(root);
    initScrollEffect(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
