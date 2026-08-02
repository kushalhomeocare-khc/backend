# get-expert-opinion-cta

Dark-theme (#161616 background, #12CFFF cyan primary) reusable CTA section,
modeled directly on the existing `online-treatment-cta` component.

## Folder structure

```
get-expert-opinion-cta/
├── get-expert-opinion.css      shared styles (upload once)
├── get-expert-opinion.js       shared logic — CTA click + font-load resize (upload once)
├── eczema-dermatitis.html      embed snippet for Eczema & Dermatitis
├── sciatica-slip-disc.html     embed snippet for Sciatica & Slip Disc (add as needed)
└── ...                         one .html file per condition
```

## How this works

Just like `online-treatment.html`, the text for each condition is written
**directly into the HTML** — not loaded dynamically from JSON. This matters:
`fetch()`-ing JSON from `api.kushalonline.com` requires that domain to send
CORS headers, which it currently does not, so a JSON-driven version fails
with a blocked-by-CORS error inside GoDaddy's iframe. Hardcoding the text
into the HTML sidesteps that entirely — `.css` and `.js` load fine via
`<link>`/`<script src>` either way, only `fetch()` needs CORS.

Each condition's `.html` file is self-contained and fully readable — it's
its own record of that condition's content, so there's no separate JSON
file to keep in sync.

## Common vs. variable lines

**Common (identical on every condition page)** — appears verbatim in every
condition's HTML:
- Subheading: "Consult our experienced Homeopathic doctors for an expert opinion."
- Description prefix: "Every case is carefully evaluated to develop a personalized
  Homeopathic treatment approach focused on "
- Description suffix: "." (closes the sentence after the variable phrase)
- "Includes" heading + the 4 tick-bullet items (Doctor Consultation, Case
  Evaluation, Medical Report Review, Treatment Recommendation)
- Fee note (bold italic): "Doctor's expert opinion is available online for
  a nominal consultation fee"
- CTA text: "Get Expert Opinion"
- CTA link: https://kushalonline.com/get-expert-opinion

**Variable (different per condition)**:
- Heading — e.g. "Looking for Eczema & Dermatitis Treatment?"
- Description's middle phrase — slots between the common prefix and suffix,
  e.g. "reducing itching, redness, inflammation, dryness, scaling, and
  recurrent flare-ups while supporting long-term skin health"

## Adding a new condition

1. Duplicate `eczema-dermatitis.html` and rename it to the new condition,
   e.g. `sciatica-slip-disc.html`.
2. In the copy, change only:
   - the `<h2 class="geo-headline">` text
   - the `<p class="geo-desc">` text (keep the common prefix/suffix wording,
     swap the middle phrase)
   - update the top comment's filename reference
   Leave the subheading, includes list, fee note, and CTA untouched.
3. Copy the finished `.html` file's contents into GoDaddy's HTML section
   on that condition's page.

## GoDaddy widget embed code

Paste this entire block into GoDaddy's HTML section for the Eczema &
Dermatitis page (this is `eczema-dermatitis.html` — see "Adding a new
condition" above for other pages):

```html
<!-- GET EXPERT OPINION SECTION — paste this entire block into GoDaddy's HTML section.
     CSS and JS are hosted at api.kushalonline.com/get-expert-opinion-cta/ — make sure
     both files are uploaded there and load correctly before publishing.

     This is eczema-dermatitis.html. Each condition gets its own HTML file
     named after it (e.g. sciatica-slip-disc.html, psoriasis.html) — copy
     this file, rename it, and only edit the text marked VARIABLE below.
     See README.md for the full list of common vs. variable lines. -->

<link rel="stylesheet" href="https://api.kushalonline.com/get-expert-opinion-cta/get-expert-opinion.css">

<section class="geo-section">
  <div class="geo-wrap">
    <h2 class="geo-headline">Looking for Eczema &amp; Dermatitis Treatment?</h2>
    <p class="geo-sub">Consult our experienced Homeopathic doctors for an expert opinion.</p>
    <p class="geo-desc">Every case is carefully evaluated to develop a personalized Homeopathic treatment approach focused on reducing itching, redness, inflammation, dryness, scaling, and recurrent flare-ups while supporting long-term skin health.</p>

    <div class="geo-includes">
      <div class="geo-includes-heading">Includes</div>
      <div class="geo-includes-list">
        <div class="geo-includes-item">
          <span class="geo-tick"><svg viewBox="0 0 24 24" fill="none" stroke="#052832" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg></span>
          <span class="label">Doctor Consultation</span>
        </div>
        <div class="geo-includes-item">
          <span class="geo-tick"><svg viewBox="0 0 24 24" fill="none" stroke="#052832" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg></span>
          <span class="label">Case Evaluation</span>
        </div>
        <div class="geo-includes-item">
          <span class="geo-tick"><svg viewBox="0 0 24 24" fill="none" stroke="#052832" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg></span>
          <span class="label">Medical Report Review</span>
        </div>
        <div class="geo-includes-item">
          <span class="geo-tick"><svg viewBox="0 0 24 24" fill="none" stroke="#052832" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg></span>
          <span class="label">Treatment Recommendation</span>
        </div>
      </div>
    </div>

    <p class="geo-fee-note">Doctor&rsquo;s expert opinion is available online for a nominal consultation fee</p>

    <a class="geo-cta" href="https://kushalonline.com/get-expert-opinion" target="_top" onclick="return geoHandleCtaClick(this);">
      Get Expert Opinion
    </a>
  </div>
</section>

<script src="https://api.kushalonline.com/get-expert-opinion-cta/get-expert-opinion.js"></script>
```

Before this works, `get-expert-opinion.css` and `get-expert-opinion.js` must
already be uploaded to `api.kushalonline.com/get-expert-opinion-cta/`.

## CTA

Every condition shares the same CTA link and label:
- Text: **Get Expert Opinion**
- URL: https://kushalonline.com/get-expert-opinion
