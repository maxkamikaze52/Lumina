/* Astrolab — the badge that frames a student's character.
   Geometry, in the SVG's own 0..100 space:
     head opening   circle at (50, 44)  r = 27      ← the avatar shows through
     inner rim      r = 27 .. 30
     spoke ring     r = 30 .. 45       (the decorative panels, outside the head)
     diamonds       r = 45..48
     level plate    bottom, y 76..92, drawn last and never masked
   The head can never cover the badge, because the badge lives outside r = 27.
*/
(function () {
  'use strict';
  const A = window.ART = window.ART || {};
  const INK = '#0a0818';
  let seq = 0;

  const CX = 50, CY = 44, HEAD = 27, RING_IN = 30, RING_OUT = 45;

  /* the family colour for a level, straight from the crest palette */
  function tones(level) {
    if (A.crestTier) {
      const t = A.crestTier(level);
      if (t && t.light) return { light: t.light, mid: t.mid || t.light, deep: t.deep || '#1a0f33' };
    }
    return { light: '#ff6fae', mid: '#d6449a', deep: '#2a0f2e' };
  }

  /* a radial panel: a wedge of the ring, drawn as a quad between two radii */
  function spoke(i, count, t, gap) {
    const step = (Math.PI * 2) / count;
    const a0 = i * step - Math.PI / 2 + gap;
    const a1 = (i + 1) * step - Math.PI / 2 - gap;
    const r0 = RING_IN + 0.5, r1 = RING_OUT - (i % 2 ? 1.5 : 0);
    const p = (r, a) => (CX + r * Math.cos(a)).toFixed(2) + ' ' + (CY + r * Math.sin(a)).toFixed(2);
    return '<path d="M' + p(r0, a0) + ' L' + p(r1, a0) + ' L' + p(r1, a1) + ' L' + p(r0, a1) +
      ' Z" fill="url(#TONE)" stroke="' + INK + '" stroke-width="0.8" stroke-linejoin="round"/>';
  }

  A.avatarFrame = function (level, opts) {
    const o = opts || {};
    const size = o.size || 240;
    const n = Math.max(1, Math.min(100, level || 1));
    const id = 'af' + (++seq);
    const t = tones(n);
    const count = n >= 90 ? 16 : n >= 60 ? 14 : 12;

    let spokes = '';
    for (let i = 0; i < count; i++) {
      spokes += spoke(i, count, t, 0.014).split('url(#TONE)').join('url(#' + id + 'p)');
    }

    /* a pale diamond stud between every other spoke pair */
    let studs = '';
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 * i) / 8 - Math.PI / 4;
      const x = CX + 44 * Math.cos(a), y = CY + 44 * Math.sin(a);
      studs += '<rect x="' + (x - 2.6).toFixed(2) + '" y="' + (y - 2.6).toFixed(2) +
        '" width="5.2" height="5.2" transform="rotate(45 ' + x.toFixed(2) + ' ' +
        y.toFixed(2) + ')" fill="#fffaf6" stroke="' + INK + '" stroke-width="0.7"/>';
    }

    return '<svg class="avatar-frame" width="' + size + '" height="' + size +
      '" viewBox="0 0 100 100" role="img" aria-label="Level ' + n + ' badge" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<linearGradient id="' + id + 'p" x1="0" y1="0" x2="0.2" y2="1">' +
      '<stop offset="0" stop-color="' + t.light + '"/>' +
      '<stop offset=".55" stop-color="' + t.mid + '"/>' +
      '<stop offset="1" stop-color="' + t.deep + '"/>' +
      '</linearGradient>' +
      '<radialGradient id="' + id + 'o" cx=".5" cy=".5" r=".5">' +
      '<stop offset=".62" stop-color="' + t.light + '" stop-opacity=".42"/>' +
      '<stop offset="1" stop-color="' + t.light + '" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<mask id="' + id + 'h">' +
      '<rect width="100" height="100" fill="#fff"/>' +
      '<circle cx="' + CX + '" cy="' + CY + '" r="' + HEAD + '" fill="#000"/>' +
      '</mask>' +
      '</defs>' +

      /* glow behind the ring, then the ring itself, then the studs */
      '<circle cx="' + CX + '" cy="' + CY + '" r="47" fill="url(#' + id + 'o)"/>' +
      '<g mask="url(#' + id + 'h)">' + spokes + '</g>' +
      studs +

      /* the rim of the head opening: dark, hot, then a hairline */
      '<circle cx="' + CX + '" cy="' + CY + '" r="' + (HEAD + 1.6) + '" fill="none" ' +
      'stroke="' + INK + '" stroke-width="5"/>' +
      '<circle cx="' + CX + '" cy="' + CY + '" r="' + (HEAD + 1.6) + '" fill="none" ' +
      'stroke="' + t.light + '" stroke-width="2"/>' +
      '<circle cx="' + CX + '" cy="' + CY + '" r="' + (HEAD - 0.6) + '" fill="none" ' +
      'stroke="' + INK + '" stroke-width="1.2" opacity=".8"/>' +

      /* the level plate: outside the head circle, at the bottom, on top */
      '<g class="num-plate">' +
      '<rect x="27" y="76" width="46" height="17" rx="8.5" fill="' + INK + '"/>' +
      '<rect x="29" y="78" width="42" height="13" rx="6.5" fill="' + t.deep + '" ' +
      'stroke="' + t.light + '" stroke-width="1.6"/>' +
      '<text x="50" y="85.4" text-anchor="middle" dominant-baseline="middle" ' +
      'font-family="Archivo Black, Arial Black, sans-serif" font-size="10" fill="' + t.light +
      '">' + n + '</text>' +
      '</g>' +
      '</svg>';
  };

  /* A circle-cropped bust of the character, sized to exactly fill the head
     opening above: the opening is 54 units of the 100 box, and the avatar's head
     is a circle at (56, 56) with r = 26 in its own 112 x 212 box. */
  A.avatarHead = function (equipped, opts) {
    const o = opts || {};
    const label = o.label || 'Player character';
    const svg = (window.ART.avatar(equipped, { background: false, label }) || '');
    return svg
      .replace(/<ellipse cx="56" cy="206"[^>]*\/>/, '')     // drop the ground shadow
      .replace('<svg class="avatar"', '<svg class="avatar avatar-head"')
      .replace('viewBox="0 0 112 212"',
        'viewBox="17 17 78 78" preserveAspectRatio="xMidYMid slice"');
  };
})();
