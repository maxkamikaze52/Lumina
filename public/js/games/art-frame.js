/* Astrolab — the badge frame for a character.
   The same plate as the level badge, with the middle punched out, so a student's
   character sits inside their badge.  The silhouette of the plate is what tells
   two badges apart across a classroom, so the edges matter.
*/
(function () {
  'use strict';
  const A = window.ART = window.ART || {};

  /* A CIRCLE-CROPPED HEAD, for placing inside a badge.  The character SVG is
     scaled and shifted so only the head fills the frame. */
  A.avatarHead = function (equipped, opts) {
    const o = opts || {};
    const label = o.label || 'Player character';
    const svg = (window.ART.avatar(equipped, { background: false, label }) || '');
    // the avatar is drawn in a 112x212 box with the head around y=52; zoom in on it
    return svg.replace('<svg class="avatar"', '<svg class="avatar avatar-head"')
      .replace('viewBox="0 0 112 212"', 'viewBox="18 6 76 76" preserveAspectRatio="xMidYMid slice"');
  };

  A.avatarFrame = function (level, opts) {
    const o = opts || {};
    const size = o.size || 190;
    const n = Math.max(1, Math.min(100, level || 1));
    const inner = A.levelCrest(n, { size: 100 }) || '';
    // split the badge drawing from its number plate: the plate must sit ON TOP of
    // the mask, never inside the hole that the head shows through
    const withoutPlate = inner.replace(/<g class="num-plate">[\s\S]*?<\/g>/, '');
    const plate = (inner.match(/<g class="num-plate">[\s\S]*?<\/g>/) || [''])[0];
    const body = withoutPlate.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '');
    const family = A.crestTier(n);
    const glow = A.crestGlow(n);
    const id = 'af' + n + '-' + size;
    return `<svg class="avatar-frame badge-${family}" width="${size}" height="${size}"
      viewBox="0 0 100 100" role="img" aria-label="Level ${n} badge frame">
      <defs>
        <mask id="${id}">
          <rect width="100" height="100" fill="#fff"/>
          <circle cx="50" cy="43" r="25" fill="#000"/>
        </mask>
      </defs>
      <g mask="url(#${id})">${body}</g>
      <circle cx="50" cy="43" r="25.4" fill="none" stroke="#0a0818" stroke-width="2.4"/>
      <circle cx="50" cy="43" r="25.4" fill="none" stroke="${glow}" stroke-width=".9"
        opacity=".8"/>
      ${plate}
    </svg>`;
  };
})();
