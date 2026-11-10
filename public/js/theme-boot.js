/* Astrolab — theme bootstrap.  Runs in <head>, before anything paints, so the
   saved choice is applied with no white flash.  A file (not inline) because the
   page's CSP is script-src 'self'. */
(function () {
  'use strict';
  var t = null;
  try { t = localStorage.getItem('astrolab-theme'); } catch (e) {}
  if (t !== 'dark' && t !== 'light') {
    t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', t);
})();
