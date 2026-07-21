====================================================================
KUSHAL ONLINE — A-Z CONDITIONS GLOSSARY
README
====================================================================

This is a self-contained, framework-free web app. It is plain HTML,
CSS, and JavaScript — no build step, no npm, no dependencies. Upload
the folder as-is and it works.


--------------------------------------------------------------------
1. FOLDER STRUCTURE
--------------------------------------------------------------------

glossary/
  index.html      -> Page structure only. No disease content inside.
  style.css        -> All styling (colors, layout, glass effect, animations).
  glossary.js       -> Loads diseases.json and builds the whole page.
  diseases.json     -> All condition data (name, description, link).
  README.txt        -> This file.

How they connect:
  index.html  loads  style.css  (for appearance)
  index.html  loads  glossary.js  (at the bottom, before </body>)
  glossary.js  fetches  diseases.json  (at runtime, in the browser)

If any of these 4 files is missing or renamed, the page will not
work correctly. Keep all four together in the same folder.


--------------------------------------------------------------------
2. HOSTING
--------------------------------------------------------------------

This project is meant to be hosted at:

    https://api.kushalonline.com/glossary/

Steps:
  1. Upload the entire "glossary" folder to your hosting/server,
     so that index.html sits at:
         https://api.kushalonline.com/glossary/index.html
     and the other 3 files sit right next to it in the same folder:
         https://api.kushalonline.com/glossary/style.css
         https://api.kushalonline.com/glossary/glossary.js
         https://api.kushalonline.com/glossary/diseases.json

  2. Open https://api.kushalonline.com/glossary/ directly in a
     browser to confirm it loads and works on its own, before
     embedding it anywhere.

  3. Because glossary.js fetches diseases.json using a relative
     path ("diseases.json"), the 4 files MUST stay in the same
     folder on the server. Do not move diseases.json elsewhere
     unless you also update the "dataUrl" value inside the CONFIG
     object at the top of glossary.js.

No server-side code, no database, and no build tools are required.
Any standard static file host (Apache, Nginx, S3 + CloudFront,
Netlify, Vercel, GitHub Pages, etc.) can serve this folder.


--------------------------------------------------------------------
3. EMBEDDING ON kushalonline.com USING AN IFRAME
--------------------------------------------------------------------

On https://kushalonline.com/a-z-conditions, embed the hosted app
with a simple iframe, for example:

    <iframe
      src="https://api.kushalonline.com/glossary/"
      title="A-Z Conditions Glossary"
      style="width:100%; border:0; min-height:1400px;"
      loading="lazy">
    </iframe>

Notes on the iframe:
  - "min-height" is a starting guess. Because the glossary's height
    changes as letters/accordions open and close, you may want a
    generous fixed height, OR use a small resize script that posts
    the content height from inside the iframe to the parent page
    (this is optional and not included by default, to keep things
    simple — ask if you'd like this added later).
  - The glossary already has its own left/right spacing built in
    (2px), so the iframe itself can safely be set to 100% width.


--------------------------------------------------------------------
4. HOW TO ADD A NEW DISEASE / CONDITION
--------------------------------------------------------------------

Open diseases.json in any text editor. Each condition is one entry
that looks like this:

    {
      "letter": "A",
      "name": "Acidity",
      "description": "A burning sensation in the stomach or chest due to excess gastric acid.",
      "url": ""
    }

To add a new condition:
  1. Copy one existing entry (the { ... } block, including the
     surrounding curly braces).
  2. Paste it as a new item in the array, separated by a comma
     from the entry before it.
  3. Change the 4 values:
       "letter"      -> the single capital letter it should appear
                          under (e.g. "A", "B", "C")
       "name"         -> the condition name, exactly as you want it
                          displayed. If it has an alternate name,
                          write it in brackets, e.g.:
                              "Vitiligo (Leucoderma, White Patches)"
                          The search box automatically becomes
                          searchable by both the main name and
                          anything inside the brackets.
       "description"  -> the one-line description shown when the
                          condition is expanded.
       "url"          -> leave as "" (empty) if there is no
                          treatment page yet, or paste the full
                          page URL if one exists (see section 5).
  4. Save the file and re-upload it to the server (or overwrite it
     if using a file manager / FTP).
  5. Refresh the page — the new condition appears automatically. No
     other file needs to change.

IMPORTANT: diseases.json must stay valid JSON. Common mistakes to
avoid:
  - Forgetting a comma between two { ... } entries.
  - Adding a comma after the very last entry in the list (not
    allowed in JSON).
  - Using curly “smart” quotes instead of straight " quotes.

If you're not sure, open the file in a JSON validator (search
"JSON validator" online, paste the contents, and it will tell you
exactly where a mistake is) before uploading.


--------------------------------------------------------------------
5. HOW TO ADD A TREATMENT PAGE LINK LATER
--------------------------------------------------------------------

Every condition without its own treatment page currently has:

    "url": ""

When a treatment page is ready, open diseases.json, find that
condition, and paste the link between the quotes:

    "url": "https://kushalonline.com/adhd-treatment"

That's the entire change. Nothing else needs editing. The small
link button on that condition will appear automatically the next
time the page loads — no link button is shown while "url" is empty.


--------------------------------------------------------------------
6. EDITING TEXT / BEHAVIOUR (NO CODING NEEDED)
--------------------------------------------------------------------

Open glossary.js and look near the very top for a block called
CONFIG. These values can be changed directly without touching any
other code:

    searchPlaceholder    -> placeholder text inside the search box
    noResultsMessage     -> message shown when a search finds nothing
    collapseLabel         -> button text when the A-Z list is expanded
    expandLabel            -> button text when the A-Z list is collapsed
    defaultOpenLetter      -> set to e.g. "A" to auto-open a letter on
                               page load, or leave as "" for none
    fadeDurationMs          -> how fast letter cards fade (milliseconds)
    heightDurationMs        -> how fast the layout resizes between
                               letters (milliseconds)
    desktopColumns         -> number of A-Z buttons per row on desktop
    mobileColumns           -> number of A-Z buttons per row on mobile
    desktopBreakpoint       -> screen width (px) where "desktop" begins


--------------------------------------------------------------------
7. WHAT NOT TO EDIT UNLESS NECESSARY
--------------------------------------------------------------------

  - style.css controls all colors, spacing, glass effect, shadows,
    and animations. Changing values here changes the visual design.
  - The rest of glossary.js (below the CONFIG block) controls how
    search, the A-Z grid, and the accordion behave. Only change this
    if you want to change how the glossary actually functions.
  - index.html should stay minimal. Do not add disease content
    directly into it — always add new conditions through
    diseases.json instead, so the page stays easy to maintain.


--------------------------------------------------------------------
8. BROWSER SUPPORT
--------------------------------------------------------------------

Tested patterns used in this project (fetch, CSS grid, CSS custom
properties, arrow functions) work on all current versions of:
  Chrome, Safari, Firefox, Edge, iPhone Safari, Android Chrome.

No Internet Explorer support is included or required.

====================================================================
End of README
====================================================================
