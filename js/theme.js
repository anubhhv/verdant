/* VERDANT — theme.js
   Handles light/dark toggle + persistence
   Include ONCE on every page, after the <body> tag opens.
*/
(function () {
  'use strict';

  // ── Apply saved theme immediately (before paint) ─────────────────────────
  const STORAGE_KEY = 'verdant_theme';
  const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  // ── Build the toggle button ───────────────────────────────────────────────
  function buildButton() {
    const btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.className = 'theme-toggle';
    btn.title = 'Toggle light / dark mode';
    btn.setAttribute('aria-label', 'Toggle light / dark mode');
    updateIcon(btn, saved);
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEY, next);
      updateIcon(btn, next);

      // Spin animation
      btn.style.transform = 'scale(1.15) rotate(20deg)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
    });
  }

  function updateIcon(btn, theme) {
    btn.innerHTML = theme === 'dark'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }

  // ── Wait for DOM then inject ──────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildButton);
  } else {
    buildButton();
  }
})();