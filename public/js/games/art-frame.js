/* Astrolab — the badge frame for a character.
   The same plate as the level badge, with the middle punched out, so a student's
   character sits inside their badge.  The silhouette of the plate is what tells
   two badges apart across a classroom, so the edges matter.
*/
(function () {
  'use strict';
  const A = window.ART = window.ART || {};

  A.avatarFrame = function (level, opts) {
    const o = opts || {};
    const size = o.size || 190;
    const n = Math.max(1, Math.min(100, level || 1));
    const inner = A.levelCrest(n, { size: 100 }) || '';
    const body = inner.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '');
    const family = A.crestTier(n);
    const glow = A.crestGlow(n);
    const id = 'af' + n + '-' + size;
    return `<svg class="avatar-frame badge-${family}" width="${size}" height="${size}"
      viewBox="0 0 100 100" role="img" aria-label="Level ${n} badge frame">
      <defs>
        <mask id="${id}">
          <rect width="100" height="100" fill="#fff"/>
          <circle cx="50" cy="46" r="26.5" fill="#000"/>
        </mask>
      </defs>
      <g mask="url(#${id})">${body}</g>
      <circle cx="50" cy="46" r="27" fill="none" stroke="#0a0818" stroke-width="2.4"/>
      <circle cx="50" cy="46" r="27" fill="none" stroke="${glow}" stroke-width=".9"
        opacity=".8"/>
    </svg>`;
  };
})();
