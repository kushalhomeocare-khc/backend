/* ==========================================================================
   Kushal Online — Three Steps section
   three-steps.js
   Vanilla JS, no framework/build step required. Renders into any
   element with id="three-steps-root", then reveals the steps with a
   staggered cascade the first time the section appears (see notes in
   README on why this doesn't rely on precise scroll position — needed
   for embeds that wrap content in an iframe, e.g. GoDaddy's HTML block).

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
        image: "https://api.kushalonline.com/images/step1"
      },
      {
        eyebrow: "Step 2",
        title: "Share Case Details",
        body: "Our doctors review your case, gather additional information if required, and prepare your personalized prescription.",
        image: "https://api.kushalonline.com/images/step2"
      },
      {
        eyebrow: "Step 3",
        title: "Receive Medicines",
        body: "Medicines are delivered to your doorstep with clear dosage instructions and regular follow-up support.",
        image: "https://api.kushalonline.com/images/step3"
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

  function initReveal(root) {
    // NOTE on embeds that wrap content in an iframe (GoDaddy's "Add HTML"
    // section does this, as do several other site builders): an iframe
    // that auto-sizes to fit its content has no real internal scrolling,
    // so per-element "has this scrolled into view" checks can report
    // everything as visible immediately on load, which looks like "no
    // animation." To work reliably regardless of iframe wrapping, this
    // triggers ONCE when the section first appears, then cascades the
    // steps in with a staggered delay — rather than tying each step to
    // its own precise scroll offset.

    var steps = root.querySelectorAll(".ts-step");
    var fill = root.querySelector("#ts-track-fill");
    var stepper = root.querySelector(".ts-stepper");
    var triggered = false;
    var STAGGER_MS = 220;

    function revealAll() {
      if (triggered) return;
      triggered = true;

      steps.forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add("is-visible");
          var count = i + 1;
          var pct = steps.length ? (count / steps.length) * 100 : 0;
          fill.style.height =
            "calc(" + pct + "% - " + (count === steps.length ? 16 : 0) + "px)";
        }, i * STAGGER_MS);
      });
    }

    // Safety net: if nothing triggers the reveal within 1.5s (observer
    // blocked, unsupported, or behaving oddly inside a sandboxed embed),
    // reveal anyway so the section is never stuck invisible.
    var fallbackTimer = setTimeout(revealAll, 1500);

    if (!("IntersectionObserver" in window) || !stepper) {
      clearTimeout(fallbackTimer);
      revealAll();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            clearTimeout(fallbackTimer);
            revealAll();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(stepper);
  }

  function init() {
    var root = document.getElementById("three-steps-root");
    if (!root) return;
    render(root);
    initReveal(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
