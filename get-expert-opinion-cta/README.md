# get-expert-opinion-cta

Dark-theme (#161616 background, #12CFFF cyan primary) reusable CTA section.
Same template is used on every condition page — only the content file changes.

## Folder structure

```
get-expert-opinion-cta/
├── get-expert-opinion.css      shared styles (upload once)
├── get-expert-opinion.js       shared logic — loads + merges content, renders it (upload once)
├── get-expert-opinion.html     embed snippet — paste into GoDaddy HTML section per page
└── content/
    ├── default.json            COMMON fields, shared by every condition
    └── eczema-dermatitis.json  VARIABLE fields for one specific condition
```

## How content is split

- **default.json** — subheading, description prefix/suffix, "Includes" list,
  fee note, CTA text + link. Edit this once and it updates every page.
- **`<condition>.json`** — only two fields per condition:
  - `heading` — e.g. "Looking for Eczema & Dermatitis Treatment?"
  - `description` — the variable middle portion of the description sentence.
    It's inserted between `default.json`'s `description.prefix` and `description.suffix`
    to form the full paragraph automatically.

## Adding a new condition

1. Copy `content/eczema-dermatitis.json`, rename it to match the condition
   (e.g. `content/sciatica-slip-disc.json`), lowercase with hyphens.
2. Fill in `heading` and `description` for that condition. Leave everything
   else out — it's inherited from `default.json`.
3. Upload the new file to `content/` on the server.
4. On the relevant page, paste `get-expert-opinion.html` and set:
   ```html
   <section class="geo-section" data-condition="sciatica-slip-disc" data-loading="true">
   ```
   The `data-condition` value must exactly match the JSON filename (no `.json`).

## CTA

Every condition shares the same CTA link and label, defined once in
`default.json`:
- Text: **Get Expert Opinion**
- URL: https://kushalonline.com/get-expert-opinion

## GoDaddy widget embed code

Paste this entire block into GoDaddy's HTML section for a condition page.
Only the `data-condition` value changes between pages — set it to match the
content file name (without `.json`).

```html
<!-- GET EXPERT OPINION SECTION — paste this entire block into GoDaddy's HTML section.
     CSS and JS are hosted at api.kushalonline.com/get-expert-opinion-cta/ — make sure
     they, and the matching content/<condition>.json file, are uploaded there.

     TO REUSE ON A DIFFERENT CONDITION PAGE:
     Just change the data-condition value below to match the content file name
     (without .json), e.g. data-condition="sciatica-slip-disc" -->

<link rel="stylesheet" href="https://api.kushalonline.com/get-expert-opinion-cta/get-expert-opinion.css">

<section class="geo-section" data-condition="eczema-dermatitis" data-loading="true">
  <div class="geo-wrap geo-content">
    <h2 class="geo-headline"></h2>
    <p class="geo-sub"></p>
    <p class="geo-desc"></p>

    <div class="geo-includes">
      <div class="geo-includes-heading"></div>
      <div class="geo-includes-list"></div>
    </div>

    <p class="geo-fee-note"></p>

    <a class="geo-cta" href="#" target="_top" onclick="return geoHandleCtaClick(this);"></a>
  </div>
</section>

<script src="https://api.kushalonline.com/get-expert-opinion-cta/get-expert-opinion.js"></script>
```

Before this works, `get-expert-opinion.css`, `get-expert-opinion.js`, and the
`content/` folder (with `default.json` and the relevant condition file) must
already be uploaded to `api.kushalonline.com/get-expert-opinion-cta/`.

## Notes

- The section starts hidden (`data-loading="true"`) and fades in once its
  JSON content loads, avoiding a flash of empty text.
- `get-expert-opinion.js` mirrors the iframe-escape and font-load resize
  behavior used in the existing `online-treatment-cta` component, so CTA
  clicks and GoDaddy auto-height both work the same way.
