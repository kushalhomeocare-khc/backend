/* ==========================================================================
   Kushal Online — A-Z Glossary
   glossary.js
   ==========================================================================
   Vanilla JS only. No frameworks, no build step, no dependencies.

   This file:
     - Loads diseases.json
     - Builds the A-Z button grid dynamically
     - Builds every letter card + accordion dynamically
     - Reproduces the exact search / accordion / A-Z interaction behaviour
       from the original az-glossary-folded.html
     - Adds accessibility attributes (aria-expanded, aria-controls, etc.)
     - Exposes a single CONFIG object at the top for easy editing
   ========================================================================== */

(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     CONFIGURATION
     Edit these values to change behaviour without touching any logic below.
     ------------------------------------------------------------------------ */
  const CONFIG = {
    // Text
    searchPlaceholder: 'Search conditions...',
    noResultsMessage: 'No conditions match your search.',
    collapseLabel: 'Collapse',
    expandLabel: 'Show all letters',

    // Behaviour
    defaultOpenLetter: '',   // e.g. 'A' to auto-open a letter on page load, '' for none

    // Animation timing (ms) — mirrors the transition durations in style.css.
    // If you change a transition duration in style.css, update the matching
    // value here too so the JS timing and CSS timing stay in sync.
    fadeDurationMs: 160,     // letter-card fade out/in (matches .letter-card transition)
    heightDurationMs: 200,   // stage height morph (matches .card-stage transition)

    // Grid columns — applied dynamically so you can tune desktop vs mobile
    // without editing CSS. Both default to 6 to match the original design.
    desktopColumns: 6,
    mobileColumns: 6,
    desktopBreakpoint: 1024, // px — must match the @media rule in style.css

    // Path to the data file (relative to index.html)
    dataUrl: 'diseases.json',

    // When embedded in an iframe, report content height to the parent page
    // so the iframe can resize itself instead of using a fixed height
    // (avoids empty space when folded, and internal scrollbars when a
    // letter/accordion makes the content taller). See README for the
    // matching parent-page listener snippet. Set to false to disable.
    reportHeightToParent: true
  };

  const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  /* ------------------------------------------------------------------------
     DOM REFERENCES
     All expected to exist in index.html.
     ------------------------------------------------------------------------ */
  const els = {
    azBlock: document.getElementById('azBlock'),
    azToggle: document.getElementById('azToggle'),
    azToggleLabel: document.getElementById('azToggleLabel'),
    azGridWrap: document.getElementById('azGridWrap'),
    azGrid: document.getElementById('azGrid'),
    searchInput: document.getElementById('searchInput'),
    clearBtn: document.getElementById('clearBtn'),
    noResults: document.getElementById('noResults'),
    stage: document.getElementById('glossary')
  };

  /* ------------------------------------------------------------------------
     STATE
     ------------------------------------------------------------------------ */
  let diseasesByLetter = {};   // { A: [ {name, description, url}, ... ], ... }
  let letterCardEls = [];      // cached NodeList-like array once built
  let azButtonEls = [];        // cached A-Z button elements once built

  /* ------------------------------------------------------------------------
     UTILITIES
     ------------------------------------------------------------------------ */

  // Turn "Main Name (Alt, Alt2)" into ["main name", "alt", "alt2"] lowercase
  // search terms — matches the original data-name "startsWith" matching.
  const getSearchTerms = (name) => {
    const match = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (!match) return [name.trim().toLowerCase()];
    const terms = [match[1].trim().toLowerCase()];
    match[2].split(',').forEach((part) => {
      const trimmed = part.trim().toLowerCase();
      if (trimmed) terms.push(trimmed);
    });
    return terms;
  };

  // Build a URL-safe, id-safe slug from a disease name (used for element ids)
  const slugify = (name, letter, index) => {
    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${letter.toLowerCase()}-${base || 'item'}-${index}`;
  };

  const svgChevron = () =>
    `<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;

  const svgArrow = () =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

  /* ------------------------------------------------------------------------
     DATA LOADING
     ------------------------------------------------------------------------ */
  const loadDiseases = async () => {
    const response = await fetch(CONFIG.dataUrl, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Failed to load ${CONFIG.dataUrl}: ${response.status}`);
    }
    const diseases = await response.json();

    const byLetter = {};
    ALL_LETTERS.forEach((letter) => { byLetter[letter] = []; });

    diseases.forEach((disease) => {
      const letter = (disease.letter || '').toUpperCase();
      if (byLetter[letter]) {
        byLetter[letter].push(disease);
      }
    });

    return byLetter;
  };

  /* ------------------------------------------------------------------------
     BUILD: A-Z BUTTON GRID
     ------------------------------------------------------------------------ */
  const buildAzGrid = (byLetter) => {
    const fragment = document.createDocumentFragment();

    ALL_LETTERS.forEach((letter) => {
      const hasData = byLetter[letter] && byLetter[letter].length > 0;
      const btn = document.createElement('button');
      btn.className = hasData ? 'az-btn' : 'az-btn disabled';
      btn.textContent = letter;
      btn.setAttribute('data-letter', letter);
      btn.setAttribute('type', 'button');
      if (!hasData) {
        btn.disabled = true;
      } else {
        btn.setAttribute('aria-pressed', 'false');
      }
      fragment.appendChild(btn);
    });

    els.azGrid.appendChild(fragment);
    applyColumns();
  };

  /* ------------------------------------------------------------------------
     BUILD: LETTER CARDS + ACCORDIONS
     ------------------------------------------------------------------------ */
  const buildGlossary = (byLetter) => {
    const fragment = document.createDocumentFragment();

    ALL_LETTERS.forEach((letter) => {
      const entries = byLetter[letter];
      if (!entries || entries.length === 0) return;

      const section = document.createElement('section');
      section.className = 'letter-card';
      section.setAttribute('data-letter', letter);

      const heading = document.createElement('h2');
      heading.className = 'letter-heading';
      heading.textContent = letter;
      section.appendChild(heading);

      entries.forEach((disease, index) => {
        section.appendChild(buildAccordionItem(disease, letter, index));
      });

      fragment.appendChild(section);
    });

    els.stage.appendChild(fragment);
  };

  const buildAccordionItem = (disease, letter, index) => {
    const id = slugify(disease.name, letter, index);
    const panelId = `panel-${id}`;
    const triggerId = `trigger-${id}`;

    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.setAttribute('data-search', getSearchTerms(disease.name).join('|'));

    const trigger = document.createElement('button');
    trigger.className = 'accordion-trigger';
    trigger.type = 'button';
    trigger.id = triggerId;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', panelId);
    trigger.innerHTML = `<span class="name">${escapeHtml(disease.name)}</span>${svgChevron()}`;

    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', triggerId);

    const inner = document.createElement('div');
    inner.className = 'panel-inner';

    const desc = document.createElement('p');
    desc.textContent = disease.description || '';
    inner.appendChild(desc);

    // Only render the link button when a real url is present.
    // An empty "url": "" in diseases.json IS the placeholder — no link
    // button is shown until a real URL is filled in there.
    if (disease.url && disease.url.trim() !== '') {
      const link = document.createElement('a');
      link.className = 'cta-icon';
      link.href = disease.url;
      link.setAttribute('target', '_top'); // break out of the iframe, load in the full parent tab
      link.setAttribute('aria-label', 'View treatment');
      link.innerHTML = svgArrow();
      inner.appendChild(link);
    }

    panel.appendChild(inner);
    item.appendChild(trigger);
    item.appendChild(panel);
    return item;
  };

  const escapeHtml = (str) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ------------------------------------------------------------------------
     GRID COLUMNS (desktop vs mobile, per CONFIG)
     ------------------------------------------------------------------------ */
  const applyColumns = () => {
    const isDesktop = window.innerWidth >= CONFIG.desktopBreakpoint;
    const columns = isDesktop ? CONFIG.desktopColumns : CONFIG.mobileColumns;
    els.azGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  };

  /* ------------------------------------------------------------------------
     A-Z COLLAPSE / EXPAND
     ------------------------------------------------------------------------ */
  const setAzCollapsed = (collapsed) => {
    if (collapsed) {
      const firstBtn = els.azGrid.querySelector('.az-btn');
      const rowHeight = firstBtn ? firstBtn.getBoundingClientRect().height : 60;
      const gap = parseFloat(getComputedStyle(els.azGrid).rowGap || '0');
      els.azGridWrap.style.maxHeight = `${rowHeight + gap}px`;
    } else {
      els.azGridWrap.style.maxHeight = '';
    }
    els.azBlock.classList.toggle('collapsed', collapsed);
    els.azToggleLabel.textContent = collapsed ? CONFIG.expandLabel : CONFIG.collapseLabel;
    els.azToggle.setAttribute(
      'aria-label',
      collapsed ? 'Expand alphabet list' : 'Collapse alphabet list'
    );
    els.azToggle.setAttribute('aria-expanded', String(!collapsed));
  };

  /* ------------------------------------------------------------------------
     LETTER CARD CROSSFADE
     Stage height is locked to the outgoing card's height during the swap so
     the layout never collapses/jumps, then morphs to the new card's height.
     ------------------------------------------------------------------------ */
  const switchTo = (target) => {
    const current = els.stage.querySelector('.letter-card.show');

    // lock stage at its current rendered height so nothing jumps
    els.stage.style.height = `${els.stage.offsetHeight}px`;
    void els.stage.offsetHeight; // force reflow

    if (current) {
      current.classList.remove('visible');
      // fold back any expanded condition descriptions before it hides
      closeAllAccordionItems(current);
    }

    setTimeout(() => {
      if (current) current.classList.remove('show');

      if (target) {
        target.classList.add('show');
        const targetHeight = target.scrollHeight;
        els.stage.style.height = `${targetHeight}px`;
        void target.offsetWidth;
        requestAnimationFrame(() => target.classList.add('visible'));
      } else {
        els.stage.style.height = '0px';
      }

      // release the fixed height back to auto once settled, so content
      // like the condition accordion can still expand the stage naturally
      setTimeout(() => { els.stage.style.height = ''; }, CONFIG.heightDurationMs);
    }, current ? CONFIG.fadeDurationMs : 0);
  };

  /* ------------------------------------------------------------------------
     ACCORDION (only one condition open at a time)
     ------------------------------------------------------------------------ */
  const closeAllAccordionItems = (scope) => {
    const root = scope || document;
    root.querySelectorAll('.accordion-item.open').forEach((item) => {
      item.classList.remove('open');
      const trigger = item.querySelector('.accordion-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  const toggleAccordionItem = (item) => {
    const isOpen = item.classList.contains('open');
    // only one disease stays open at a time
    closeAllAccordionItems();
    if (!isOpen) {
      item.classList.add('open');
      const trigger = item.querySelector('.accordion-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }
  };

  /* ------------------------------------------------------------------------
     SEARCH
     ------------------------------------------------------------------------ */
  const runSearch = () => {
    const q = els.searchInput.value.trim().toLowerCase();
    els.clearBtn.style.display = q ? 'block' : 'none';
    els.stage.style.height = ''; // let search-driven multi-card display size naturally
    azButtonEls.forEach((b) => b.classList.remove('active')); // typing always clears letter selection

    if (!q) {
      letterCardEls.forEach((c) => {
        c.classList.remove('show');
        c.classList.remove('visible');
      });
      document.querySelectorAll('.accordion-item').forEach((item) => {
        item.style.display = '';
        item.classList.remove('open');
        const trigger = item.querySelector('.accordion-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
      els.noResults.style.display = 'none';
      return;
    }

    let anyVisible = false;

    letterCardEls.forEach((section) => {
      let sectionHasMatch = false;

      section.querySelectorAll('.accordion-item').forEach((item) => {
        const terms = item.getAttribute('data-search').split('|');
        const match = terms.some((term) => term.indexOf(q) === 0);
        item.style.display = match ? '' : 'none';

        // search results show name only, never auto-expand description
        item.classList.remove('open');
        const trigger = item.querySelector('.accordion-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');

        if (match) {
          sectionHasMatch = true;
          anyVisible = true;
        }
      });

      section.classList.toggle('show', sectionHasMatch);
      section.classList.toggle('visible', sectionHasMatch);
    });

    els.noResults.style.display = anyVisible ? 'none' : 'block';
  };

  /* ------------------------------------------------------------------------
     EVENT WIRING (event delegation — one listener per container)
     ------------------------------------------------------------------------ */
  const wireEvents = () => {
    // A-Z grid: delegated click handling for all letter buttons
    els.azGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.az-btn:not(.disabled)');
      if (!btn) return;

      const letter = btn.getAttribute('data-letter');
      const alreadyActive = btn.classList.contains('active');

      azButtonEls.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });

      if (alreadyActive) {
        switchTo(null);
      } else {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        switchTo(document.querySelector(`.letter-card[data-letter="${letter}"]`));
      }
    });

    // Glossary stage: delegated click handling for every accordion trigger
    els.stage.addEventListener('click', (e) => {
      const trigger = e.target.closest('.accordion-trigger');
      if (!trigger) return;
      toggleAccordionItem(trigger.parentElement);
    });

    // Search box focus: collapse A-Z grid and deselect any active letter
    els.searchInput.addEventListener('focus', () => {
      setAzCollapsed(true);
      const activeBtn = els.azGrid.querySelector('.az-btn.active');
      if (activeBtn) {
        activeBtn.classList.remove('active');
        activeBtn.setAttribute('aria-pressed', 'false');
        switchTo(null);
      }
    });

    // Search input typing
    els.searchInput.addEventListener('input', runSearch);

    // Clear search
    els.clearBtn.addEventListener('click', () => {
      els.searchInput.value = '';
      runSearch();
      els.searchInput.focus();
    });

    // A-Z collapse/expand toggle button
    els.azToggle.addEventListener('click', () => {
      setAzCollapsed(!els.azBlock.classList.contains('collapsed'));
    });

    // Recalculate collapsed row height + column count on resize
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        applyColumns();
        if (els.azBlock.classList.contains('collapsed')) {
          setAzCollapsed(true);
        }
      }, 100);
    });
  };

  /* ------------------------------------------------------------------------
     IFRAME HEIGHT REPORTING
     Tells the parent page (kushalonline.com) exactly how tall the content
     is, any time it changes — so the embedding iframe can resize itself
     instead of using a guessed fixed height.
     ------------------------------------------------------------------------ */
  const reportHeight = () => {
    if (!CONFIG.reportHeightToParent) return;
    if (window.parent === window) return; // not embedded in an iframe, nothing to report
    const height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.getBoundingClientRect().height
);

    window.parent.postMessage({ type: 'kushal-glossary-height', height }, '*');
  };

  const wireHeightReporting = () => {
    if (!CONFIG.reportHeightToParent) return;

    // Fires on every content/layout change: letter switch, accordion open,
    // search filtering, A-Z collapse/expand — anything that changes height.
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(() => reportHeight());
      observer.observe(document.body);
    }

    // Belt-and-suspenders: also report on window resize and after the
    // letter-card / accordion CSS transitions finish settling.
    window.addEventListener('resize', reportHeight);
    document.addEventListener('transitionend', reportHeight);

    reportHeight();
  };

  /* ------------------------------------------------------------------------
     INIT
     ------------------------------------------------------------------------ */
  const applyStaticText = () => {
    els.searchInput.setAttribute('placeholder', CONFIG.searchPlaceholder);
    els.noResults.textContent = CONFIG.noResultsMessage;
    els.azToggleLabel.textContent = CONFIG.collapseLabel;
  };

  const init = async () => {
    applyStaticText();

    try {
      diseasesByLetter = await loadDiseases();
    } catch (err) {
      els.noResults.textContent = 'Unable to load conditions right now.';
      els.noResults.style.display = 'block';
      // eslint-disable-next-line no-console
      console.error(err);
      reportHeight();
      return;
    }

    buildAzGrid(diseasesByLetter);
    buildGlossary(diseasesByLetter);

    letterCardEls = Array.from(document.querySelectorAll('.letter-card'));
    azButtonEls = Array.from(els.azGrid.querySelectorAll('.az-btn:not(.disabled)'));

    wireEvents();
    wireHeightReporting();

    if (CONFIG.defaultOpenLetter) {
      const letter = CONFIG.defaultOpenLetter.toUpperCase();
      const btn = els.azGrid.querySelector(`.az-btn[data-letter="${letter}"]:not(.disabled)`);
      if (btn) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        switchTo(document.querySelector(`.letter-card[data-letter="${letter}"]`));
      }
    }

    reportHeight();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
