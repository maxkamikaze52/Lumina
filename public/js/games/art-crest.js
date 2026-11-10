/* Astrolab — the level badge.
   One ornate emblem per level, in the language of a ranked-badge sheet: a glassy
   dome in the middle, a thick decorated ring around it, and a motif inside.  The
   colour family changes every ten levels and the motif changes every level, so
   no two badges in the ladder look the same.  The level number sits on a plate
   at the foot of the badge, never lost in the ornament.
*/
(function () {
  'use strict';
  const A = window.ART = window.ART || {};

  /* ten colour families, ten steps each */
  const METALS = {
    gray:     { deep: '#1d2430', mid: '#8f9bb0', light: '#eef2f8', glass: '#cfd8e6', edge: '#5d6779' },
    bronze:   { deep: '#3a1d08', mid: '#c2762e', light: '#ffd8a6', glass: '#f0c08a', edge: '#8a4d15' },
    copper:   { deep: '#3d1409', mid: '#d0642f', light: '#ffc9a0', glass: '#f2a97e', edge: '#8f3312' },
    silver:   { deep: '#1b2432', mid: '#cfdaea', light: '#ffffff', glass: '#e6eefb', edge: '#7d8ba1' },
    gold:     { deep: '#3c2a02', mid: '#e8b crowd', light: '#fff3c0', glass: '#ffe493', edge: '#8c6600' },
    jade:     { deep: '#04291f', mid: '#39c98d', light: '#d6fff0', glass: '#9df0cb', edge: '#0d6b4d' },
    sapphire: { deep: '#05193d', mid: '#3f8ce8', light: '#d4e8ff', glass: '#93c6ff', edge: '#0e4a8f' },
    amethyst: { deep: '#240b3d', mid: '#a06ee8', light: '#ecd9ff', glass: '#cda9ff', edge: '#5f2a94' },
    crimson:  { deep: '#3d0512', mid: '#e0405f', light: '#ffd6df', glass: '#ff9db1', edge: '#8c1230' },
    prism:    { deep: '#1a1038', mid: '#ff7ad9', light: '#e8f6ff', glass: '#ffd9a8', edge: '#7a3bc0' }
  };
  /* gold above is fixed for clarity */
  METALS.gold = { deep: '#3c2a02', mid: '#e8b93a', light: '#fff3c0', glass: '#ffe493', edge: '#8c6600' };

  /* the ring decoration for each step inside a stage */
  const RING = ['plain', 'studded', 'notched', 'twisted', 'scalloped', 'spiked',
    'gemmed', 'braided', 'winged', 'crowned'];

  /* the motif drawn inside the dome, one per level */
  function motif(step, t) {
    const c = '#ffffff', s = t.edge;
    switch (step) {
      case 0: return `<circle cx="50" cy="46" r="13" fill="none" stroke="${c}" stroke-width="2.6" opacity=".92"/>
        <circle cx="50" cy="46" r="5" fill="${c}" opacity=".9"/>`;
      case 1: return `<path d="M36 34h28v24H36z" fill="none" stroke="${c}" stroke-width="2.6"/>
        <path d="M50 34v24M36 46h28" stroke="${c}" stroke-width="2"/>`;
      case 2: return `<path d="M42 30h16v8l-4 22h-8l-4-22z" fill="${c}" opacity=".9"/>`;
      case 3: return `<path d="M50 30l6 14 14 2-10 10 2 14-12-6-12 6 2-14-10-10 14-2z"
        fill="${c}" opacity=".92"/>`;
      case 4: return `<path d="M50 62V32M50 40l-10-6M50 40l10-6M50 50l-11-6M50 50l11-6"
        stroke="${c}" stroke-width="2.8" stroke-linecap="round" fill="none"/>`;
      case 5: return `<path d="M34 58c0-11 7-20 16-20s16 9 16 20z" fill="${c}" opacity=".9"/>
        <rect x="34" y="58" width="32" height="5" rx="2" fill="${c}"/>`;
      case 6: return `<path d="M50 30c-9 6-14 12-14 20 0 6 6 10 14 10s14-4 14-10c0-8-5-14-14-20z"
        fill="${c}" opacity=".88"/><circle cx="50" cy="50" r="4" fill="${s}"/>`;
      case 7: return `<path d="M50 28l7 12h-14zM36 52l12-7v14zM64 52l-12-7v14z"
        fill="${c}" opacity=".9"/><circle cx="50" cy="48" r="3.4" fill="${s}"/>`;
      case 8: return `<path d="M38 60c-4-14 2-26 12-30 10 4 16 16 12 30z" fill="${c}" opacity=".9"/>
        <path d="M50 34v26" stroke="${s}" stroke-width="2"/>`;
      default: return `<path d="M50 26l5 11 12 1-9 9 3 12-11-6-11 6 3-12-9-9 12-1z"
        fill="${c}"/><circle cx="50" cy="52" r="16" fill="none" stroke="${c}"
        stroke-width="1.6" opacity=".65"/>`;
    }
  }

  /* the ring ornament, drawn as a path or a set of studs around r */
  function ring(step, t, r) {
    const C = 50;
    let out = '';
    if (step === 1) {
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        out += `<circle cx="${(C + r * Math.cos(a)).toFixed(1)}" cy="${(C + r * Math.sin(a)).toFixed(1)}"
          r="2.6" fill="${t.light}" stroke="${t.edge}" stroke-width=".7"/>`;
      }
    } else if (step === 2) {
      const pts = [];
      for (let i = 0; i < 16; i++) {
        const a = (Math.PI * 2 * i) / 16;
        const rr = i % 2 ? r - 3 : r + 1;
        pts.push((C + rr * Math.cos(a)).toFixed(1) + ',' + (C + rr * Math.sin(a)).toFixed(1));
      }
      out += `<polygon points="${pts.join(' ')}" fill="none" stroke="${t.light}"
        stroke-width="2" opacity=".9"/>`;
    } else if (step === 3) {
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        out += `<path d="M${(C + (r - 4) * Math.cos(a)).toFixed(1)} ${(C + (r - 4) * Math.sin(a)).toFixed(1)}
          q${(3 * Math.cos(a + 1)).toFixed(1)} ${(3 * Math.sin(a + 1)).toFixed(1)}
          ${(4 * Math.cos(a)).toFixed(1)} ${(4 * Math.sin(a)).toFixed(1)}"
          stroke="${t.light}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
      }
    } else if (step === 4) {
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
        out += `<circle cx="${(C + (r + 1) * Math.cos(a)).toFixed(1)}"
          cy="${(C + (r + 1) * Math.sin(a)).toFixed(1)}" r="4.2" fill="${t.mid}"
          stroke="${t.edge}" stroke-width="1"/>`;
      }
    } else if (step === 5) {
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
        out += `<line x1="${(C + r * Math.cos(a)).toFixed(1)}" y1="${(C + r * Math.sin(a)).toFixed(1)}"
          x2="${(C + (r + 6) * Math.cos(a)).toFixed(1)}" y2="${(C + (r + 6) * Math.sin(a)).toFixed(1)}"
          stroke="${t.light}" stroke-width="2.6" stroke-linecap="round"/>`;
      }
    } else if (step === 6) {
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const x = C + r * Math.cos(a), y = C + r * Math.sin(a);
        out += `<rect x="${(x - 3).toFixed(1)}" y="${(y - 3).toFixed(1)}" width="6" height="6"
          transform="rotate(45 ${x.toFixed(1)} ${y.toFixed(1)})" fill="${t.light}"
          stroke="${t.edge}" stroke-width=".9"/>`;
      }
    } else if (step === 7) {
      out += `<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="${t.light}"
        stroke-width="2" stroke-dasharray="5 4" opacity=".9"/>
        <circle cx="${C}" cy="${C}" r="${r - 4}" fill="none" stroke="${t.light}"
        stroke-width="1.4" stroke-dasharray="2 5" opacity=".7"/>`;
    } else if (step === 8) {
      for (const dir of [-1, 1]) {
        for (let i = 0; i < 3; i++) {
          out += `<path d="M${C + dir * (r - 2)} ${C + i * 6 - 6}
            q${dir * 12} -2 ${dir * 16} -8 q${-dir * 8} 1 ${-dir * 12} 3z"
            fill="${t.mid}" stroke="${t.edge}" stroke-width="1"/>`;
        }
      }
    } else {
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        const long = i % 3 === 0;
        out += `<line x1="${(C + r * Math.cos(a)).toFixed(1)}" y1="${(C + r * Math.sin(a)).toFixed(1)}"
          x2="${(C + (r + (long ? 10 : 5)) * Math.cos(a)).toFixed(1)}"
          y2="${(C + (r + (long ? 10 : 5)) * Math.sin(a)).toFixed(1)}"
          stroke="${t.light}" stroke-width="${long ? 3 : 2}" stroke-linecap="round"/>`;
      }
    }
    return out;
  }

  let seq = 0;

  A.levelCrest = function (n, opts) {
    const o = opts || {};
    const size = o.size || 96;
    const step = Math.max(0, Math.min(9, (n - 1) % 10));
    const stageIdx = Math.min(9, Math.floor((n - 1) / 10));
    const family = ['gray', 'bronze', 'copper', 'silver', 'gold', 'jade',
      'sapphire', 'amethyst', 'crimson', 'prism'][stageIdx];
    const t = METALS[family];
    const id = 'bd' + (++seq);
    const C = 50, r = 30;                 // the dome

    let svg = `<defs>
        <radialGradient id="${id}g" cx=".38" cy=".3" r=".85">
          <stop offset="0" stop-color="${t.light}"/>
          <stop offset=".45" stop-color="${t.glass}"/>
          <stop offset="1" stop-color="${t.mid}"/>
        </radialGradient>
        <linearGradient id="${id}m" x1=".15" y1="0" x2=".85" y2="1">
          <stop offset="0" stop-color="${t.light}"/>
          <stop offset=".4" stop-color="${t.mid}"/>
          <stop offset=".75" stop-color="${t.deep}"/>
          <stop offset="1" stop-color="${t.mid}"/>
        </linearGradient>
        <radialGradient id="${id}s" cx=".5" cy=".5" r=".5">
          <stop offset=".6" stop-color="${t.mid}" stop-opacity="0"/>
          <stop offset=".88" stop-color="${t.mid}" stop-opacity=".45"/>
          <stop offset="1" stop-color="${t.mid}" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <circle cx="${C}" cy="${C - 4}" r="42" fill="url(#${id}s)"/>`;

    /* the decorated ring, then the metal band over it */
    svg += ring(step, t, 33);
    svg += `<circle cx="${C}" cy="${C - 4}" r="33" fill="none" stroke="url(#${id}m)"
        stroke-width="7"/>
      <circle cx="${C}" cy="${C - 4}" r="36.5" fill="none" stroke="${t.deep}"
        stroke-width="1.4" opacity=".85"/>
      <circle cx="${C}" cy="${C - 4}" r="29.5" fill="none" stroke="${t.light}"
        stroke-width="1.2" opacity=".75"/>`;

    /* the glassy dome */
    svg += `<circle cx="${C}" cy="${C - 4}" r="${r - 4}" fill="url(#${id}g)"
        stroke="${t.edge}" stroke-width="1.6"/>
      <ellipse cx="${C - 7}" cy="${C - 18}" rx="13" ry="8" fill="#fff" opacity=".38"/>
      <circle cx="${C}" cy="${C - 4}" r="${r - 4}" fill="none" stroke="#fff"
        stroke-width=".9" opacity=".45"/>`;

    /* the motif, tinted to the family so it always reads */
    svg += `<g opacity=".95">${motif(step, t)}</g>`;

    /* the plate with the number */
    svg += `<rect x="${C - 17}" y="70" width="34" height="17" rx="8.5" fill="${t.deep}"
        stroke="${t.mid}" stroke-width="1.6"/>
      <text x="${C}" y="${80.5}" text-anchor="middle" dominant-baseline="middle"
        font-family="Archivo Black, Arial Black, sans-serif" font-size="12"
        fill="${t.light}">${n}</text>`;

    return `<svg class="crest badge-${family}${o.locked ? ' locked' : ''}"
      width="${size}" height="${size}" viewBox="0 0 100 100" role="img"
      aria-label="Level ${n} badge, ${family}">${svg}</svg>`;
  };

  A.crestTier = (n) => ['gray', 'bronze', 'copper', 'silver', 'gold', 'jade',
    'sapphire', 'amethyst', 'crimson', 'prism'][Math.min(9, Math.floor((n - 1) / 10))];
  A.crestGlow = (n) => METALS[A.crestTier(n)].mid;
})();
