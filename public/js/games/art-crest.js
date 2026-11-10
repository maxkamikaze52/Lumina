/* Astrolab — the level crest.
   Built from the level number and deliberately excessive, but every level sits
   inside its own edge design, so 19 and 20 never look the same.  The shape of
   the outline changes with the level:
     1-4   smooth bronze disc
     5-8   silver ring with scalloped teeth
     9-12  gold ring with a jewelled notch at each corner
     13-16 plasma ring with spikes that break the circle
     17-19 legend ring with a crown of long points, alternating length
     20    the same crown, closed — a full sunburst halo
   Everything is drawn inside a 100x100 box with room for the points, so nothing
   is ever cropped.  The number is small and dead centre.
*/
(function () {
  'use strict';
  const A = window.ART = window.ART || {};

  const TIERS = [
    { name: 'bronze', dark: '#5c2f05', mid: '#e08a2e', hot: '#ffe0a8', glow: '#ff9d2e', accent: '#ffcf7a' },
    { name: 'silver', dark: '#2f3a4d', mid: '#dfeaff', hot: '#ffffff', glow: '#8fd0ff', accent: '#eaf4ff' },
    { name: 'gold', dark: '#6b4700', mid: '#ffcf3a', hot: '#fffbd6', glow: '#ffd23a', accent: '#fff0a8' },
    { name: 'plasma', dark: '#5c0730', mid: '#ff4b86', hot: '#ffd6e6', glow: '#ff2e77', accent: '#ffa8c8' },
    { name: 'legend', dark: '#04503a', mid: '#5cffc0', hot: '#e9fff8', glow: '#2effb0', accent: '#a8ffe0' }
  ];

  const tierIndex = (n) => Math.min(TIERS.length - 1, Math.floor((n - 1) / 4));
  const C = 50;
  const BASE = 27;                 // face radius, comfortably inside the box
  const RIM = 8;                   // base metal band
  let seq = 0;

  // points around a circle, for the star-shaped outlines
  function starPath(points, rOuter, rInner, rot) {
    let d = '';
    for (let i = 0; i < points * 2; i++) {
      const a = (Math.PI * i) / points - Math.PI / 2 + (rot || 0);
      const r = i % 2 ? rInner : rOuter;
      const x = C + r * Math.cos(a), y = C + r * Math.sin(a);
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    return d + 'Z';
  }

  /* the outline that makes each level its own shape */
  function edge(n, t, r, id) {
    const tier = tierIndex(n);
    const step = (n - 1) % 4;      // position inside the tier: 0..3
    let out = '';

    // 1. the metal band: round for tiers 1-2, faceted higher up
    if (tier <= 1) {
      out += `<circle cx="${C}" cy="${C}" r="${r}" fill="none"
        stroke="url(#${id}m)" stroke-width="${RIM + step * 0.8}"/>`;
    } else if (tier === 2) {
      // gold: sixteen facets
      const pts = [];
      for (let i = 0; i < 16; i++) {
        const a = (Math.PI * 2 * i) / 16;
        pts.push((C + r * Math.cos(a)).toFixed(1) + ',' + (C + r * Math.sin(a)).toFixed(1));
      }
      out += `<polygon points="${pts.join(' ')}" fill="none" stroke="url(#${id}m)"
        stroke-width="${RIM + step * 0.9}" stroke-linejoin="round"/>`;
    } else if (tier === 3) {
      // plasma: twelve deep teeth
      out += `<path d="${starPath(12, r + 4, r - 1)}" fill="none" stroke="url(#${id}m)"
        stroke-width="${RIM + step}" stroke-linejoin="miter"/>`;
    } else {
      // legend: 17-19 get a crown of points; 20 closes into a full sunburst
      const pts = n === 20 ? 24 : 12 + step * 2;
      out += `<path d="${starPath(pts, r + 5, r - 2, n === 20 ? 0 : 0.13)}" fill="none"
        stroke="url(#${id}m)" stroke-width="${RIM + 1}" stroke-linejoin="miter"/>`;
    }

    // 2. the teeth/scallops that differ inside a tier
    if (tier === 1) {
      const teeth = 8 + step * 2;
      for (let i = 0; i < teeth; i++) {
        const a = (Math.PI * 2 * i) / teeth - Math.PI / 2;
        out += `<circle cx="${(C + (r + 1) * Math.cos(a)).toFixed(1)}"
          cy="${(C + (r + 1) * Math.sin(a)).toFixed(1)}" r="${1.9 + step * 0.35}"
          fill="${t.mid}" stroke="${t.dark}" stroke-width=".8"/>`;
      }
    }
    if (tier === 2) {
      const gems = 4 + step;
      for (let i = 0; i < gems; i++) {
        const a = (Math.PI * 2 * i) / gems - Math.PI / 2;
        const x = C + (r + 1.5) * Math.cos(a), y = C + (r + 1.5) * Math.sin(a);
        out += `<rect x="${(x - 2.2).toFixed(1)}" y="${(y - 2.2).toFixed(1)}" width="4.4"
          height="4.4" transform="rotate(45 ${x.toFixed(1)} ${y.toFixed(1)})"
          fill="${t.hot}" stroke="${t.dark}" stroke-width=".9"/>`;
      }
    }
    if (tier === 3 || tier === 4) {
      // a second, shorter ring of points offset from the first
      const pts = 10 + step * 2 + (n === 20 ? 10 : 0);
      for (let i = 0; i < pts; i++) {
        const a = (Math.PI * 2 * i) / pts - Math.PI / 2 + Math.PI / pts;
        const r1 = r + 1, r2 = r + 5 + step * 1.6 + (n === 20 ? 4 : 0);
        out += `<line x1="${(C + r1 * Math.cos(a)).toFixed(1)}" y1="${(C + r1 * Math.sin(a)).toFixed(1)}"
          x2="${(C + r2 * Math.cos(a)).toFixed(1)}" y2="${(C + r2 * Math.sin(a)).toFixed(1)}"
          stroke="${t.mid}" stroke-width="${2.6 + step * 0.4}" stroke-linecap="round"/>
          <line x1="${(C + r1 * Math.cos(a)).toFixed(1)}" y1="${(C + r1 * Math.sin(a)).toFixed(1)}"
          x2="${(C + r2 * Math.cos(a)).toFixed(1)}" y2="${(C + r2 * Math.sin(a)).toFixed(1)}"
          stroke="${t.hot}" stroke-width="1" stroke-linecap="round" opacity=".9"/>`;
      }
    }
    return out;
  }

  A.levelCrest = function (n, opts) {
    const o = opts || {};
    const size = o.size || 96;
    const t = TIERS[tierIndex(n)];
    const id = 'cr' + (++seq);
    const p = (n - 1) / 19;
    const r = BASE + 1.5 * p;                 // the face grows a little
    const blur = 2.6 + 3.4 * p;               // halo
    const haloOp = 0.5 + 0.35 * p;

    let svg = `<defs>
        <linearGradient id="${id}m" x1=".2" y1="0" x2=".8" y2="1">
          <stop offset="0" stop-color="${t.hot}"/>
          <stop offset=".35" stop-color="${t.mid}"/>
          <stop offset=".72" stop-color="${t.dark}"/>
          <stop offset="1" stop-color="${t.mid}"/>
        </linearGradient>
        <radialGradient id="${id}c" cx=".5" cy=".42" r=".62">
          <stop offset="0" stop-color="${t.dark}"/>
          <stop offset=".72" stop-color="#08060f"/>
          <stop offset="1" stop-color="#000"/>
        </radialGradient>
        <radialGradient id="${id}h" cx=".5" cy=".5" r=".5">
          <stop offset=".38" stop-color="${t.glow}" stop-opacity="0"/>
          <stop offset=".75" stop-color="${t.glow}" stop-opacity=".85"/>
          <stop offset="1" stop-color="${t.glow}" stop-opacity="0"/>
        </radialGradient>
        <filter id="${id}f" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="${blur.toFixed(2)}"/>
        </filter>
      </defs>

      <circle cx="${C}" cy="${C}" r="${30 + 3 * p}" fill="url(#${id}h)"
              filter="url(#${id}f)" opacity="${haloOp.toFixed(2)}"/>

      <circle cx="${C}" cy="${C}" r="${r}" fill="url(#${id}c)"/>
      <circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="${t.accent}"
        stroke-width="1.2" opacity=".5"/>
      ${edge(n, t, r, id)}
      <circle cx="${C}" cy="${C}" r="${r - 5}" fill="none" stroke="${t.glow}"
        stroke-width="1" opacity=".3" stroke-dasharray="2 3"/>`;

    const digits = String(n).length;
    const numSize = digits > 1 ? 20 + 2 * p : 23 + 2 * p;
    svg += `<text x="${C}" y="${C - 2}" text-anchor="middle" dominant-baseline="middle"
        font-family="Archivo Black, Arial Black, sans-serif" font-size="${numSize.toFixed(1)}"
        fill="#fff" stroke="#05030c" stroke-width="2.4" paint-order="stroke">${n}</text>
      <text x="${C}" y="${C + (digits > 1 ? 12 : 11)}" text-anchor="middle"
        font-family="Archivo Black, Arial Black, sans-serif" font-size="5"
        letter-spacing="1.6" fill="${t.hot}" opacity=".95">LEVEL</text>`;

    // tier stars along the foot, plus one per level inside the tier
    const st = Math.min(7, tierIndex(n) + 1 + ((n - 1) % 4) * 0.0);
    for (let i = 0; i < st; i++) {
      const x = C + (i - (st - 1) / 2) * 7;
      svg += `<path d="M${x} ${C + 17}l1.4 2.8 3.1.4-2.2 2.1.5 3-2.8-1.6-2.8 1.6.5-3-2.2-2.1 3.1-.4z"
                fill="${t.accent}" stroke="#05030c" stroke-width=".5"/>`;
    }

    return `<svg class="crest crest-${t.name} crest-n${n}${o.locked ? ' locked' : ''}"
      width="${size}" height="${size}" viewBox="0 0 100 100" role="img"
      aria-label="Level ${n}, ${t.name} crest">${svg}</svg>`;
  };

  A.crestTier = (n) => TIERS[tierIndex(n)].name;
  A.crestGlow = (n) => TIERS[tierIndex(n)].glow;
})();
