/* Astrolab — the level crest.
   One SVG per level, built from the level number, so a badge *develops* as you
   climb instead of being a number on a flat tile: bronze laurel at 1, iron ring
   at 5, wings at 8, gems at 12, star points at 16, full crown at 20.
   The number always sits in the middle.
*/
(function () {
  'use strict';
  const A = window.ART = window.ART || {};

  // progression tiers: colour, metal, and what gets added at each stage
  const TIERS = [
    { name: 'bronze', rim: '#b87333', face: '#3a2312', glow: '#e2955a', ink: '#ffe6c9' },
    { name: 'silver', rim: '#b9c4d4', face: '#2a3140', glow: '#dbe7f7', ink: '#f2f7ff' },
    { name: 'gold', rim: '#e8b13a', face: '#3a2a06', glow: '#ffd868', ink: '#fff7dd' },
    { name: 'plasma', rim: '#ff5f8d', face: '#34102a', glow: '#ff8fb3', ink: '#ffe9f1' },
    { name: 'legend', rim: '#7cf7c4', face: '#08281f', glow: '#a8ffe0', ink: '#e8fff8' }
  ];

  const tierOf = (n) => TIERS[Math.min(TIERS.length - 1, Math.floor((n - 1) / 4))];
  const stars = (n) => Math.min(5, Math.floor((n - 1) / 4) + 1);
  const wingCount = (n) => (n >= 8 ? (n >= 16 ? 3 : 2) : n >= 5 ? 1 : 0);
  const gems = (n) => (n >= 12 ? Math.min(6, Math.floor((n - 12) / 2) + 2) : 0);

  /* n = level (1-20), size in px, opts.locked dims it */
  A.levelCrest = function (n, opts) {
    const o = opts || {};
    const size = o.size || 96;
    const t = tierOf(n);
    const id = 'cr' + n + '-' + size;
    const C = 50, R = 34;

    // the base disc, with a thick metal rim
    let svg = `
      <circle cx="${C}" cy="${C}" r="${R + 6}" fill="${t.rim}" opacity=".95"/>
      <circle cx="${C}" cy="${C}" r="${R + 2}" fill="${t.face}"
              stroke="${t.glow}" stroke-width="2.5"/>
      <circle cx="${C}" cy="${C}" r="${R - 6}" fill="none" stroke="${t.glow}"
              stroke-width="1" opacity=".45" stroke-dasharray="3 4"/>`;

    // 1. the shield silhouette strengthens: a pair of laurel arms from level 2
    if (n >= 2) {
      svg += `<path d="M16 62q6 20 34 26 28-6 34-26" fill="none" stroke="${t.rim}"
                stroke-width="5" stroke-linecap="round" opacity=".95"/>`;
    }
    // 2. wings on the sides, one pair at 5, two at 8, three at 16
    const w = wingCount(n);
    for (let i = 0; i < w; i++) {
      const dy = i * 9 - (w - 1) * 4.5;
      svg += `<path d="M14 ${50 + dy}q-10 -6 -6 -14 6 4 10 6z" fill="${t.rim}" opacity=".9"/>
              <path d="M86 ${50 + dy}q10 -6 6 -14-6 4-10 6z" fill="${t.rim}" opacity=".9"/>`;
    }
    // 3. gems around the rim from level 12
    const gm = gems(n);
    for (let i = 0; i < gm; i++) {
      const a = (Math.PI * 2 * i) / gm - Math.PI / 2;
      const x = C + (R - 1) * Math.cos(a);
      const y = C + (R - 1) * Math.sin(a);
      svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4"
                fill="${t.glow}" stroke="#120a26" stroke-width="1.2"/>`;
    }
    // 4. star points above from level 16 — the crest becomes a starburst
    if (n >= 16) {
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        const x1 = C + (R + 8) * Math.cos(a), y1 = C + (R + 8) * Math.sin(a);
        const x2 = C + (R + 16) * Math.cos(a), y2 = C + (R + 16) * Math.sin(a);
        svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}"
                  y2="${y2.toFixed(1)}" stroke="${t.glow}" stroke-width="4" stroke-linecap="round"
                  opacity=".95"/>`;
      }
    }
    // 5. a tiny star row under the number, one per tier reached
    const st = stars(n);
    for (let i = 0; i < st; i++) {
      const x = C + (i - (st - 1) / 2) * 9;
      svg += `<path d="M${x} 78l2.1 4.3 4.7.6-3.4 3.2.9 4.6-4.3-2.3-4.3 2.3.9-4.6-3.4-3.2 4.7-.6z"
                fill="${t.glow}" opacity=".95" transform="translate(0 -2) scale(.62) translate(16 26)"/>`;
    }
    // 6. the number, always dead centre
    svg += `
      <text x="${C}" y="${C + 2}" text-anchor="middle" dominant-baseline="middle"
        font-family="Archivo Black, Arial Black, sans-serif" font-size="${n >= 10 ? 34 : 38}"
        fill="${t.ink}" stroke="#120a26" stroke-width="1.4" paint-order="stroke">${n}</text>
      <text x="${C}" y="${C + 24}" text-anchor="middle" font-family="Archivo Black, sans-serif"
        font-size="8" letter-spacing="1.6" fill="${t.glow}" opacity=".85">LEVEL</text>`;

    return `<svg class="crest ${o.locked ? 'locked' : ''}" width="${size}" height="${size}"
      viewBox="0 0 100 100" role="img"
      aria-label="Level ${n}, ${t.name} crest">${svg}</svg>`;
  };

  A.crestTier = (n) => tierOf(n).name;
})();
