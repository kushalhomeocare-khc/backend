# Kushal Online — Accordion Widgets: GoDaddy Deployment Guide

Two widgets, sharing one stylesheet:

| Widget | Folder | Files |
|---|---|---|
| Treatment Plans | `/plans/` | `index.html`, `plans.js`, `plans.json`, `style.css` |
| Consultation Fee | `/consult/` | `index.html`, `consult.js`, `consult.json`, `style.css` |

`style.css` is now a single combined file — the original plan-card/toggle styles plus the consult-widget additions (icons, note list). Both folders carry an identical copy of it. Edit one and copy it into the other if you make style changes later.

Live URL for the consult widget:
**`https://api.kushalonline.com/consult`**

---

## GoDaddy Website Builder — iframe embed

GoDaddy's Website Builder ("Websites + Marketing") can't accept raw HTML/JS/CSS files — it only lets you embed external content via an iframe. The consult widget is already hosted at `api.kushalonline.com/consult`, so this is a straight embed.

Both `plans.js` and `consult.js` post a `kushalResize` message to the parent window whenever the accordion opens/closes, so the iframe needs a small listener script to grow and shrink with the content — otherwise you'd get a fixed-height box with a scrollbar or clipped content.

### In the GoDaddy editor
**Add Section → Embed → Embed your own code**, then paste:

```html
<iframe
  id="kushalConsultFrame"
  src="https://api.kushalonline.com/consult"
  style="width:100%; border:0; display:block;"
  scrolling="no"
  title="Consultation Fee">
</iframe>

<script>
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'kushalResize') {
      var frame = document.getElementById('kushalConsultFrame');
      if (frame) frame.style.height = e.data.height + 'px';
    }
  });
</script>
```

That's it for the consult widget — publish the page and it's live.

### If you're also embedding the Treatment Plans widget on the same page
Add a second iframe with its own `id`, and use one shared listener instead of two:

```html
<iframe id="kushalPlansFrame" src="https://api.kushalonline.com/plans"
  style="width:100%; border:0; display:block;" scrolling="no" title="Treatment Plans"></iframe>

<iframe id="kushalConsultFrame" src="https://api.kushalonline.com/consult"
  style="width:100%; border:0; display:block;" scrolling="no" title="Consultation Fee"></iframe>

<script>
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'kushalResize') return;
    var frames = document.querySelectorAll('#kushalPlansFrame, #kushalConsultFrame');
    frames.forEach(function (f) {
      if (f.contentWindow === e.source) f.style.height = e.data.height + 'px';
    });
  });
</script>
```
(Swap in the actual Plans widget URL once that's hosted — `api.kushalonline.com/plans` above is a placeholder matching the consult pattern.)

### Publish checklist
- Open the live page on desktop and mobile.
- Open/close each accordion tab (India, Global, Please Note) and confirm the iframe grows/shrinks — no scrollbar, nothing clipped.
- Click **Book Consultation** for both India and Global and confirm it opens the payment URL in the full browser tab, not trapped inside the iframe (this is handled by `target="_top"`, already set on the buttons).

---

## Editing content later
You never need to touch the JS or HTML for copy/price changes — only the JSON:
- Fees, included items, Please Note bullets → `consult.json`
- Plan prices, names, notes, NRI text → `plans.json`

Re-upload the edited `.json` file to the server and the page updates automatically.

---

## Troubleshooting
- **Iframe shows a scrollbar or cuts off content** → confirm the listener script is on the parent GoDaddy page and the `id` in the script matches the `id` on the `<iframe>` tag.
- **Blank iframe** → open `https://api.kushalonline.com/consult` directly in a new tab. If it's blank there too, check the browser console — likely `consult.json` isn't in the same folder as `index.html` on the server.
- **Buttons don't leave the iframe when clicked** → confirm nothing stripped `target="_top"` from the CTA links; it's set by default in `consult.js`.
