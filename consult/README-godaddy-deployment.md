# Kushal Online — Accordion Widgets: GoDaddy Deployment Guide

This covers both accordion widgets you now have:

| Widget | Folder | Purpose |
|---|---|---|
| Treatment Plans | `/plans/` (root files: `index.html`, `plans.js`, `plans.json`, `style.css`) | India / Global plan cards, toggle-switch |
| Consultation Fee | `/consult/` | India / Global fee + Please Note, 3-tab accordion |

Both are plain HTML + CSS + vanilla JS — no build step, no frameworks. Both already have GoDaddy-iframe auto-resize built in (`postMessage`), because GoDaddy's Website Builder ("Websites + Marketing") does not let you paste raw HTML/JS directly into a page — it only allows embedding external content via an **iframe**. That's the deployment path below.

If instead you have **GoDaddy cPanel hosting** (not the drag-and-drop Website Builder), you can skip the iframe entirely — see Option B.

---

## Option A — GoDaddy Website Builder (iframe embed)

### Step 1 — Host the files somewhere with a public URL
GoDaddy's Website Builder can't store these files itself. Upload the folder to any static host and note the resulting URL, e.g.:
- GoDaddy cPanel hosting (if you have it) → e.g. `https://yourdomain.com/consult/index.html`
- Or any static host (Netlify, Vercel, S3, etc.)

Each widget is self-contained — upload `index.html`, the `.js` file, the `.json` file, and `style.css` (+ `consult.css` for the consult widget) into the **same folder** on the server. Relative paths (`href="style.css"`, `src="plans.js"`) depend on this.

### Step 2 — Add an Embed section in Website Builder
In the GoDaddy editor: **Add Section → Embed → Embed your own code**, then paste:

```html
<iframe
  id="kushalPlansFrame"
  src="https://yourdomain.com/plans/index.html"
  style="width:100%; border:0; display:block;"
  scrolling="no"
  title="Treatment Plans">
</iframe>

<script>
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'kushalResize') {
      var frame = document.getElementById('kushalPlansFrame');
      if (frame) frame.style.height = e.data.height + 'px';
    }
  });
</script>
```

For the consultation widget, duplicate this block with a different `id` (e.g. `kushalConsultFrame`) and point `src` at the consult page's URL. The listener script only needs to be added **once per page** — it works for every iframe on that page as long as each iframe has its own unique `id` and you match it in the listener (or use a shared class/lookup, see below).

**If you're embedding both widgets on the same GoDaddy page**, use this combined listener instead of adding the script twice:

```html
<iframe id="kushalPlansFrame" src="https://yourdomain.com/plans/index.html"
  style="width:100%; border:0; display:block;" scrolling="no" title="Treatment Plans"></iframe>

<iframe id="kushalConsultFrame" src="https://yourdomain.com/consult/index.html"
  style="width:100%; border:0; display:block;" scrolling="no" title="Consultation Fee"></iframe>

<script>
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'kushalResize') return;
    // Resize whichever iframe sent the message
    var frames = document.querySelectorAll('#kushalPlansFrame, #kushalConsultFrame');
    frames.forEach(function (f) {
      if (f.contentWindow === e.source) f.style.height = e.data.height + 'px';
    });
  });
</script>
```

### Step 3 — Publish and test
- Open the live page on desktop and mobile.
- Open/close each accordion tab and confirm the iframe grows/shrinks with no scrollbar or clipped content.
- Test both the India and Global toggle/tab states.
- Click through each "Book Consultation" / "Select This Treatment Plan" button and confirm it opens the correct payment URL in a full page (not trapped inside the iframe) — this works via `target="_top"` already set in the code.

---

## Option B — GoDaddy cPanel hosting (no iframe needed)

If you have traditional GoDaddy hosting with File Manager or FTP access:

1. Log into **GoDaddy → My Products → Web Hosting → Manage → File Manager** (or connect via FTP/SFTP).
2. Navigate to `public_html` (or the subfolder for your site).
3. Create two folders: `plans` and `consult`.
4. Upload the matching files into each folder exactly as provided — don't rename them, since `index.html` references `plans.js`/`plans.json` and `consult.js`/`consult.json`/`consult.css` by their exact filenames.
5. Visit `https://yourdomain.com/plans/` and `https://yourdomain.com/consult/` directly — no iframe or embed code needed. You can then link to these pages from your main navigation, or still iframe them into a Website Builder page using Option A if you want them inline on an existing page.

---

## File checklist

**`/plans/`**
- `index.html`
- `plans.js`
- `plans.json` — edit this to update prices, plan names, notes, NRI text
- `style.css`

**`/consult/`**
- `index.html`
- `consult.js`
- `consult.json` — edit this to update fees, included items, Please Note bullets
- `consult.css`
- `style.css`

To change any copy or pricing later, you only ever need to edit the `.json` file for that widget — the `.js` renders whatever is in it, no code changes needed.

---

## Troubleshooting

- **Iframe shows a scrollbar or cuts off content** → confirm the resize listener script is present on the parent GoDaddy page and that `id` values match between the iframe tag and the script.
- **Blank page in the iframe** → open the direct URL (e.g. `https://yourdomain.com/consult/index.html`) in a new tab; if it's blank there too, the JSON or JS failed to load — check the browser console and confirm all files are in the same folder.
- **Buttons don't leave the iframe when clicked** → confirm `target="_top"` wasn't stripped by whatever host you're using; it's already set on every CTA link in both widgets.
