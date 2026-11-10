/* Astrolab — the level crest.
   One SVG per level, built from the level number.  It develops as you climb:
   a bronze laurel at 1, wings from 5, gems set in the rim from 9, starburst
   spikes from 16, and a full crown at 20.  The rim gets heavier and the glow
   gets hotter with every level, and the glow colour changes with each tier.
   The number is always dead centre — small, so the crest around it can be big.
*/
(function () {
  'use strict';
  const A = window.ART = window.ART || {};

  // five tiers: metal, glow colour, and how loud the glow is allowed to get
  const TIERS = [
    { name: 'bronze', light: '#8a4a12', mid: '#d98a3c', hot: '#ffc98a', glow: '#ff9d3c' },
    { name: 'silver', light: '#5d6675', mid: '#cdd8e8', hot: '#ffffff', glow: '#9fd2ff' },
    { name: 'gold', light: '#8a5c00', mid: '#ffd24a', hot: '#fff4b8', glow: '#ffd24a' },
    { name: 'plasma', light: '#7c0f38', mid: '#ff5f8d', hot: '#ffd0e0', glow: '#ff4f86' },
    { name: 'legend', light: '#0b6b4d', mid: '#7cf7c4', hot: '#e8fff8', glow: '#5cffc0' }
  ];

  const tierIndex = (n) => Math.min(TIERS.length - 1, Math.floor((n - 1) / 4));
  const wings = (n) => (n >= 16 ? 3 : n >= 8 ? 2 : n >= 5 ? 1 : 0);
  const gems = (n) => (n >= 12 ? Math.min(8, Math.floor((n - 12) / 1) + 3) : n >= 9 ? 2 : 0);
  const spikes = (n) => (n >= 16 ? 8 + (n - 16) : 0);
  const stars = (n) => Math.min(5, tierIndex(n) + 1);

  let seq = 0;

  A.levelCrest = function (n, opts) {
    const o = opts || {};
    const size = o.size || 96;
    const t = TIERS[tierIndex(n)];
    const id = 'cr' + (++seq);
    const C = 50;
    const p = (n - 1) / 19;                     // 0 → 1 up the whole ladder
    const glowBlur = 2.2 + 5.6 * p;             // the halo gets wider
    const glowOp = 0.30 + 0.55 * p;             // and brighter
    const rimW = 7.5 + 3.5 * p;                 // the metal rim gets heavier
    const R = 30 + 3 * p;                       // and the face smaller
    const dim = o.locked ? ' opacity=".82"' : '';

    // --- glow halo -------------------------------------------------------
    let svg = `<defs>
        <radialGradient id="${id}r" cx=".35" cy=".28" r=".85">
          <stop offset="0" stop-color="${t.hot}"/>
          <stop offset=".45" stop-color="${t.mid}"/>
          <stop offset="1" stop-color="${t.light}"/>
        </radialGradient>
        <radialGradient id="${id}g" cx=".5" cy=".5" r=".5">
          <stop offset=".55" stop-color="${t.glow}" stop-opacity="0"/>
          <stop offset=".86" stop-color="${t.glow}" stop-opacity=".95"/>
          <stop offset="1" stop-color="${t.glow}" stop-opacity="0"/>
        </radialGradient>
        <filter id="${id}f" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="${glowBlur.toFixed(2)}"/>
        </filter>
      </defs>
      <circle cx="${C}" cy="${C}" r="${40 + 5 * p}" fill="url(#${id}g)"
              filter="url(#${id}f)" opacity="${glowOp.toFixed(2)}"/>`;

    // --- the spikes, outside everything: the crest explodes at the top ----
    const sp = spikes(n);
    for (let i = 0; i < sp; i++) {
      const a = (Math.PI * 2 * i) / sp - Math.PI / 2;
      const r1 = 40, r2 = 45 + 4 * p;
      svg += `<line x1="${(C + r1 * Math.cos(a)).toFixed(1)}" y1="${(C + r1 * Math.sin(a)).toFixed(1)}"
        x2="${(C + r2 * Math.cos(a)).toFixed(1)}" y2="${(C + r2 * Math.sin(a)).toFixed(1)}"
        stroke="${t.mid}" stroke-width="${2.6 + 1.4 * p}" stroke-linecap="round"
        filter="url(#${id}f)" opacity=".85"/>`;
    }

    // --- wings, growing outward with the tier ----------------------------
    const w = wings(n);
    for (let i = 0; i < w; i++) {
      const dy = (i - (w - 1) / 2) * 10;
      const len = 12 + 3 * p;
      svg += `<path d="M${C - 30} ${C + dy}q-${len} -3 -${len + 6} -${len * 0.7}
                  q${len * 0.7} 1 ${len + 2} ${len * 0.5}z" fill="${t.mid}"
                  stroke="${t.light}" stroke-width="1.2"/>
              <path d="M${C + 30} ${C + dy}q${len} -3 ${len + 6} -${len * 0.7}
                  q-${len * 0.7} 1 -${len + 2} ${len * 0.5}z" fill="${t.mid}"
                  stroke="${t.light}" stroke-width="1.2"/>`;
    }

    // --- the heavy metal rim --------------------------------------------
    svg += `<circle cx="${C}" cy="${C}" r="${40 - rimW / 2}" fill="none"
              stroke="url(#${id}r)" stroke-width="${rimW.toFixed(1)}"/>
            <circle cx="${C}" cy="${C}" r="${40 - rimW}" fill="none"
              stroke="${t.light}" stroke-width="1.6" opacity=".85"/>
            <circle cx="${C}" cy="${C}" r="${40 - 1}" fill="none"
              stroke="${t.hot}" stroke-width="1.4" opacity=".7"/>`;

    // --- the face --------------------------------------------------------
    svg += `<circle cx="${C}" cy="${C}" r="${R - rimW / 2 + 2}" fill="#0d0a1a"/>
            <circle cx="${C}" cy="${C}" r="${R - rimW / 2 + 2}" fill="none"
              stroke="${t.glow}" stroke-width="1.2" opacity=".5"/>`;

    // --- gems set into the rim ------------------------------------------
    const gm = gems(n);
    for (let i = 0; i < gm; i++) {
      const a = (Math.PI * 2 * i) / gm - Math.PI / 2;
      const rr = 40 - rimW / 2;
      const x = C + rr * Math.cos(a), y = C + rr * Math.sin(a);
      svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${2.6 + 0.9 * p}"
                fill="${t.hot}" stroke="${t.light}" stroke-width="1"/>`;
    }

    // --- the number, small, in the middle -------------------------------
    const digits = String(n).length;
    const numSize = (digits > 1 ? 25 : 28) + 2 * p;
    svg += `<text x="${C}" y="${C - 1}" text-anchor="middle" dominant-baseline="middle"
        font-family="Archivo Black, Arial Black, sans-serif" font-size="${numSize.toFixed(1)}"
        fill="#fff" stroke="#0d0a1a" stroke-width="2.2" paint-order="stroke">${n}</text>
      <text x="${C}" y="${C + (digits > 1 ? 15 : 14)}" text-anchor="middle"
        font-family="Archivo Black, Arial Black, sans-serif" font-size="6.2"
        letter-spacing="1.8" fill="${t.hot}" opacity=".9">LEVEL</text>`;

    // --- a star per tier reached, at the foot of the face ---------------
    const st = stars(n);
    for (let i = 0; i < st; i++) {
      const x = C + (i - (st - 1) / 2) * 8.4;
      svg += `<path d="M${x} ${C + 22}l1.7 3.4 3.8.5-2.7 2.6.7 3.7-3.5-1.9-3.5 1.9.7-3.7-2.7-2.6 3.8-.5z"
                fill="${t.glow}" stroke="#0d0a1a" stroke-width=".6"/>`;
    }

    return `<svg class="crest crest-${t.name}${o.locked ? ' locked' : ''}"
      width="${size}" height="${size}" viewBox="0 0 100 100" role="img"
      aria-label="Level ${n}, ${t.name} crest"${dim}>${svg}</svg>`;
  };

  A.crestTier = (n) => TIERS[tierIndex(n)].name;
  A.crestGlow = (n) => TIERS[tierIndex(n)].glow;
})();
