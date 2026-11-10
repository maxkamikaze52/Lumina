/* Astrolab — the level crest.
   Built from the level number and deliberately excessive: a heavy metal ring,
   a full glow halo, spikes that break the circle, wings, gems, and a hot
   centre.  It grows louder with every level and the light changes colour with
   each tier.  The number is small and dead centre, so the crest can be huge.
*/
(function () {
  'use strict';
  const A = window.ART = window.ART || {};

  // five tiers: rim gradient, hot edge, glow, and the accent for gems/spikes
  const TIERS = [
    { name: 'bronze', dark: '#5c2f05', mid: '#e08a2e', hot: '#ffe0a8', glow: '#ff9d2e', accent: '#ffcf7a' },
    { name: 'silver', dark: '#2f3a4d', mid: '#dfeaff', hot: '#ffffff', glow: '#8fd0ff', accent: '#eaf4ff' },
    { name: 'gold', dark: '#6b4700', mid: '#ffcf3a', hot: '#fffbd6', glow: '#ffd23a', accent: '#fff0a8' },
    { name: 'plasma', dark: '#5c0730', mid: '#ff4b86', hot: '#ffd6e6', glow: '#ff2e77', accent: '#ffa8c8' },
    { name: 'legend', dark: '#04503a', mid: '#5cffc0', hot: '#e9fff8', glow: '#2effb0', accent: '#a8ffe0' }
  ];

  const tierIndex = (n) => Math.min(TIERS.length - 1, Math.floor((n - 1) / 4));
  const wings = (n) => (n >= 16 ? 3 : n >= 8 ? 2 : n >= 5 ? 1 : 0);
  const gems = (n) => (n >= 12 ? Math.min(10, n - 11) : n >= 9 ? 3 : 0);
  const spikes = (n) => (n >= 14 ? 9 + (n - 14) : 0);
  const stars = (n) => Math.min(5, tierIndex(n) + 1);

  let seq = 0;

  A.levelCrest = function (n, opts) {
    const o = opts || {};
    const size = o.size || 96;
    const t = TIERS[tierIndex(n)];
    const id = 'cr' + (++seq);
    const C = 50;
    const p = (n - 1) / 19;                       // 0 → 1 up the ladder
    const RIM = 9.5 + 4.5 * p;                    // 9.5 → 14: a thick band of metal
    const R = 34 + 2.5 * p;
    const blur = 3.5 + 6 * p;                     // 3.5 → 9.5 halo spread
    const haloOp = 0.55 + 0.4 * p;
    const spikeLen = 6 + 8 * p;

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
          <stop offset=".42" stop-color="${t.glow}" stop-opacity="0"/>
          <stop offset=".78" stop-color="${t.glow}" stop-opacity=".9"/>
          <stop offset="1" stop-color="${t.glow}" stop-opacity="0"/>
        </radialGradient>
        <filter id="${id}f" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="${blur.toFixed(2)}"/>
        </filter>
        <filter id="${id}fs" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.1"/>
        </filter>
      </defs>

      <circle cx="${C}" cy="${C}" r="${43 + 4 * p}" fill="url(#${id}h)"
              filter="url(#${id}f)" opacity="${haloOp.toFixed(2)}"/>`;

    // --- spikes that break the silhouette ------------------------------
    const sp = spikes(n);
    for (let i = 0; i < sp; i++) {
      const a = (Math.PI * 2 * i) / sp - Math.PI / 2;
      const long = i % 2 === 0;
      const r1 = 41, r2 = 41 + (long ? spikeLen : spikeLen * 0.55);
      const x1 = C + r1 * Math.cos(a), y1 = C + r1 * Math.sin(a);
      const x2 = C + r2 * Math.cos(a), y2 = C + r2 * Math.sin(a);
      svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}"
        y2="${y2.toFixed(1)}" stroke="${t.mid}" stroke-width="${long ? 4.6 : 3}"
        stroke-linecap="round"/>
        <line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}"
        y2="${y2.toFixed(1)}" stroke="${t.hot}" stroke-width="1.6" stroke-linecap="round"
        opacity=".9"/>`;
    }

    // --- wings, longer every tier --------------------------------------
    const w = wings(n);
    for (let i = 0; i < w; i++) {
      const dy = (i - (w - 1) / 2) * 11;
      const L = 15 + 5 * p;
      svg += `<path d="M${C - 32} ${C + dy}q-${L} -2 -${L + 8} -${L * .8}
                  q${L * .8} 2 ${L + 2} ${L * .55}z"
                  fill="${t.mid}" stroke="${t.dark}" stroke-width="1.4"/>
              <path d="M${C - 32} ${C + dy}q-${L * .55} -1 -${L * .9} -${L * .5}"
                  stroke="${t.hot}" stroke-width="1.4" fill="none" opacity=".8"/>
              <path d="M${C + 32} ${C + dy}q${L} -2 ${L + 8} -${L * .8}
                  q-${L * .8} 2 -${L + 2} ${L * .55}z"
                  fill="${t.mid}" stroke="${t.dark}" stroke-width="1.4"/>
              <path d="M${C + 32} ${C + dy}q${L * .55} -1 ${L * .9} -${L * .5}"
                  stroke="${t.hot}" stroke-width="1.4" fill="none" opacity=".8"/>`;
    }

    // --- the face, then the heavy metal band over it --------------------
    svg += `<circle cx="${C}" cy="${C}" r="${R}" fill="url(#${id}c)"/>
            <circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="${t.accent}"
              stroke-width="1.4" opacity=".55"/>
            <circle cx="${C}" cy="${C}" r="${R + RIM / 2}" fill="none"
              stroke="url(#${id}m)" stroke-width="${RIM.toFixed(1)}"/>
            <circle cx="${C}" cy="${C}" r="${R + RIM - 1}" fill="none"
              stroke="#06040e" stroke-width="2" opacity=".9"/>
            <circle cx="${C}" cy="${C}" r="${R + 1}" fill="none" stroke="${t.hot}"
              stroke-width="2" opacity=".55"/>
            <circle cx="${C}" cy="${C}" r="${R + RIM / 2}" fill="none" stroke="${t.hot}"
              stroke-width="1.2" opacity=".5" filter="url(#${id}fs)"/>`;

    // --- gems set right into the metal band ----------------------------
    const gm = gems(n);
    for (let i = 0; i < gm; i++) {
      const a = (Math.PI * 2 * i) / gm - Math.PI / 2;
      const rr = R + RIM / 2;
      const x = C + rr * Math.cos(a), y = C + rr * Math.sin(a);
      svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${3.1 + 1.2 * p}"
                fill="${t.hot}" stroke="${t.dark}" stroke-width="1.2"/>
              <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${1.3 + .5 * p}"
                fill="#fff" opacity=".95"/>`;
    }

    // --- a hot inner ring and the number -------------------------------
    svg += `<circle cx="${C}" cy="${C}" r="${R - 6}" fill="none" stroke="${t.glow}"
              stroke-width="1.1" opacity=".35" stroke-dasharray="2 3"/>`;

    const digits = String(n).length;
    const numSize = digits > 1 ? 22 + 2 * p : 25 + 2 * p;
    svg += `<text x="${C}" y="${C - 1.5}" text-anchor="middle" dominant-baseline="middle"
        font-family="Archivo Black, Arial Black, sans-serif" font-size="${numSize.toFixed(1)}"
        fill="#fff" stroke="#05030c" stroke-width="2.6" paint-order="stroke">${n}</text>
      <text x="${C}" y="${C + (digits > 1 ? 13 : 12)}" text-anchor="middle"
        font-family="Archivo Black, Arial Black, sans-serif" font-size="5.4"
        letter-spacing="1.7" fill="${t.hot}" opacity=".95">LEVEL</text>`;

    // --- tier stars at the foot ----------------------------------------
    const st = stars(n);
    for (let i = 0; i < st; i++) {
      const x = C + (i - (st - 1) / 2) * 7.6;
      svg += `<path d="M${x} ${C + 19}l1.5 3 3.4.4-2.4 2.3.6 3.3-3.1-1.7-3.1 1.7.6-3.3-2.4-2.3 3.4-.4z"
                fill="${t.accent}" stroke="#05030c" stroke-width=".55"/>`;
    }

    return `<svg class="crest crest-${t.name}${o.locked ? ' locked' : ''}"
      width="${size}" height="${size}" viewBox="0 0 100 100" role="img"
      aria-label="Level ${n}, ${t.name} crest">${svg}</svg>`;
  };

  A.crestTier = (n) => TIERS[tierIndex(n)].name;
  A.crestGlow = (n) => TIERS[tierIndex(n)].glow;
})();
