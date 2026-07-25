/* ==========================================================================
   Kushal Online — Three Steps section
   three-steps.js
   Vanilla JS, no framework/build step required. Renders into any
   element with id="three-steps-root", then reveals each step as it
   scrolls into view and fills the connecting line to match.

   Content is mirrored from three-steps.json — if you edit one,
   update the other. Kept inline here (rather than fetched) so this
   still works when pasted into a site builder's custom-code block,
   where relative-file fetches are often blocked.
   ========================================================================== */

(function () {
  var ICONS = {
    vial:
      '<rect x="6" y="2" width="12" height="20" rx="3"/><line x1="6" y1="9" x2="18" y2="9"/><line x1="9" y1="5.5" x2="9" y2="9"/><line x1="12" y1="5.5" x2="12" y2="9"/><line x1="15" y1="5.5" x2="15" y2="9"/>',
    file:
      '<path d="M4 4h13l3 3v13H4z"/><path d="M8 4v5h7V4"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>',
    package:
      '<path d="M10 2h4"/><path d="M10 2v5.2L4.8 16.5A2 2 0 0 0 6.6 20h10.8a2 2 0 0 0 1.8-3.5L14 7.2V2"/><line x1="8.5" y1="14" x2="15.5" y2="14"/>'
  };

  var DATA = {
    eyebrow: "How it works",
    heading: "Begin your personalized homeopathic treatment from home",
    subheading:
      "Three steps take you from first consultation to remedies on your doorstep — guided by a doctor at every stage.",
    steps: [
      {
        eyebrow: "Step 1",
        title: "Choose Your Plan",
        body: "Select a treatment plan, share your details and health concerns, then complete your secure online payment.",
        icon: "vial"
      },
      {
        eyebrow: "Step 2",
        title: "Share Case Details",
        body: "Our doctors review your case, gather additional information if required, and prepare your personalized prescription.",
        icon: "file"
      },
      {
        eyebrow: "Step 3",
        title: "Receive Medicines",
        body: "Medicines are delivered to your doorstep with clear dosage instructions and regular follow-up support.",
        icon: "package"
      }
    ],
    cta: {
      title: "Start Online Treatment",
      body: "Choose the treatment plan that best suits your needs and begin your journey to better health.",
      buttonText: "Explore Treatment Plans",
      buttonHref: "#treatment-plans"
    }
  };

  function svg(iconKey) {
    return (
      '<svg viewBox="0 0 24 24">' + (ICONS[iconKey] || ICONS.vial) + "</svg>"
    );
  }

  function render(root) {
    var stepsHtml = DATA.steps
      .map(function (step, i) {
        return (
          '<div class="ts-step" data-index="' +
          i +
          '">' +
          '<div class="ts-marker">' +
          svg(step.icon) +
          "</div>" +
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

    root.innerHTML =
      '<section class="ts-section">' +
      '<div class="ts-wrap">' +
      '<div class="ts-eyebrow">' +
      DATA.eyebrow +
      "</div>" +
      '<h2 class="ts-heading">' +
      DATA.heading +
      "</h2>" +
      '<p class="ts-sub">' +
      DATA.subheading +
      "</p>" +
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
      '">' +
      DATA.cta.buttonText +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
      "</a>" +
      "</div>" +
      "</div>" +
      "</section>";
  }

  function initReveal(root) {
    var steps = root.querySelectorAll(".ts-step");
    var fill = root.querySelector("#ts-track-fill");
    var visible = new Array(steps.length).fill(false);

    function updateFill() {
      var count = 0;
      for (var i = 0; i < visible.length; i++) {
        if (visible[i]) count = i + 1;
        else break;
      }
      var pct = steps.length ? (count / steps.length) * 100 : 0;
      fill.style.height =
        count === 0 ? "0%" : "calc(" + pct + "% - " + (count === steps.length ? 16 : 0) + "px)";
    }

    if (!("IntersectionObserver" in window)) {
      // Fallback: reveal everything immediately on unsupported browsers
      steps.forEach(function (el, i) {
        el.classList.add("is-visible");
        visible[i] = true;
      });
      updateFill();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var idx = Number(entry.target.getAttribute("data-index"));
            if (!visible[idx]) {
              visible[idx] = true;
              entry.target.classList.add("is-visible");
              updateFill();
            }
          }
        });
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" }
    );

    steps.forEach(function (el) {
      observer.observe(el);
    });
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
