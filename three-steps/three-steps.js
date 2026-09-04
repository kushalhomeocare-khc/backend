/* ==========================================================================
   BUILD MARKER: v31-junction-weight-pad — search for this exact string
   in the live served file to confirm you have this version, not an
   older one.
   ==========================================================================
   Kushal Online — Three Steps section
   three-steps.js
   Vanilla JS, no framework/build step required.

   Static rendering: no scroll-linked animation of any kind (grow/
   shrink/tilt effect and the vertical timeline/dotted-line/arrow
   system have both been removed per request). Cards, badges, and the
   CTA panel render at fixed size/opacity always — junction connectors
   between cards are still positioned via measured layout (see
   positionJunctions), which is unrelated to the removed animation.

   Content is mirrored from three-steps.json — if you edit one, update
   the other. Kept inline here (rather than fetched) so this still
   works when pasted into a site builder's custom-code block, where
   relative-file fetches are often blocked.
   ========================================================================== */

(function () {
  var DATA = {
    header: {
      title: "3 Simple Steps",
      subtitle: "Start your personalized homeopathic treatment from the comfort of your home."
    },
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
      '<div class="ts-header">' +
      "<h2>" +
      DATA.header.title +
      "</h2>" +
      "<p>" +
      DATA.header.subtitle +
      "</p>" +
      "</div>" +
      '<div class="ts-stepper">' +
      stepsHtml +
      '<div class="ts-junction" id="ts-junction-1"><span class="ts-junction-arrow"></span></div>' +
      '<div class="ts-junction" id="ts-junction-2"><span class="ts-junction-arrow"></span></div>' +
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

  function positionJunctions(root) {
    var steps = root.querySelectorAll(".ts-step");
    var j1 = root.querySelector("#ts-junction-1");
    var j2 = root.querySelector("#ts-junction-2");
    if (steps.length < 3 || !j1 || !j2) return;

    // offsetTop/offsetHeight are local-page layout measurements — safe
    // even inside an iframe embed, unlike scroll-position tracking.
    // Spans the full gap between two cards (from one card's bottom
    // edge to the next card's top edge) so the dashed line actually
    // touches/connects both cards, instead of floating as a short
    // segment centered in the middle of the gap.
    var gap1Top = steps[0].offsetTop + steps[0].offsetHeight;
    var gap1Bottom = steps[1].offsetTop;
    var gap2Top = steps[1].offsetTop + steps[1].offsetHeight;
    var gap2Bottom = steps[2].offsetTop;

    j1.style.top = gap1Top + "px";
    j1.style.height = Math.max(0, gap1Bottom - gap1Top) + "px";
    j2.style.top = gap2Top + "px";
    j2.style.height = Math.max(0, gap2Bottom - gap2Top) + "px";
  }

  function init() {
    var root = document.getElementById("three-steps-root");
    if (!root) return;
    render(root);
    positionJunctions(root);
    window.addEventListener("resize", function () {
      positionJunctions(root);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
