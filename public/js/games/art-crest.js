/* Astrolab — the level badge.
   100 levels, and every one of them is a *different* badge:
     - the SHAPE of the plate changes with the stage (circle, shield, hexagon,
       star, octagon, flower, gear, gem, cross, sunburst);
     - the MOTIF inside changes every single level (10 motifs x 10 variants);
     - the ORNAMENT on the rim changes every level;
     - the colour family changes every ten levels.
   The number sits on a plate at the foot so it never fights the art.
*/
(function () {
  'use strict';
  const A = window.ART = window.ART || {};

  const M = {
    gray:     { deep:'#141a24', mid:'#7c8798', light:'#eef2f8', glass:'#c3cddd', edge:'#4d5666' },
    bronze:   { deep:'#3a1d08', mid:'#b8692a', light:'#ffcf9a', glass:'#e8a86e', edge:'#7d4310' },
    copper:   { deep:'#3d1409', mid:'#c25526', light:'#ffc093', glass:'#e89567', edge:'#82290d' },
    silver:   { deep:'#1b2432', mid:'#b9c7da', light:'#ffffff', glass:'#dee9f8', edge:'#6b7a90' },
    gold:     { deep:'#3c2a02', mid:'#dcae2e', light:'#fff2b8', glass:'#ffdf85', edge:'#7d5c00' },
    jade:     { deep:'#04291f', mid:'#2fbb82', light:'#c9ffe9', glass:'#8ce8c0', edge:'#0a5c42' },
    sapphire: { deep:'#05193d', mid:'#357fe0', light:'#cbe4ff', glass:'#84bcff', edge:'#0b3f80' },
    amethyst: { deep:'#240b3d', mid:'#9660e0', light:'#e6d2ff', glass:'#c39dff', edge:'#542383' },
    crimson:  { deep:'#3d0512', mid:'#d43555', light:'#ffcbd8', glass:'#ff8fa6', edge:'#7d0f28' },
    prism:    { deep:'#1a1038', mid:'#f06ad0', light:'#e8f6ff', glass:'#ffd19a', edge:'#6a2fb0' }
  };
  const FAMILIES = ['gray','bronze','copper','silver','gold','jade','sapphire','amethyst','crimson','prism'];

  /* ---------- the plate shape: one per stage ---------- */
  function plate(stage, t, id) {
    const C = 50;
    if (stage === 0) return `<circle cx="${C}" cy="${C - 3}" r="34" fill="url(#${id}m)"/>`;
    if (stage === 1) return `<path d="M50 8l30 8v26c0 16-13 27-30 35-17-8-30-19-30-35V16z"
      fill="url(#${id}m)"/>`;                                        // shield
    if (stage === 2) {                                                 // hexagon
      const p = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        p.push((C + 34 * Math.cos(a)).toFixed(1) + ',' + (C - 3 + 34 * Math.sin(a)).toFixed(1));
      }
      return `<polygon points="${p.join(' ')}" fill="url(#${id}m)"/>`;
    }
    if (stage === 3) {                                                 // 8-point star
      const p = [];
      for (let i = 0; i < 16; i++) {
        const a = (Math.PI * 2 * i) / 16 - Math.PI / 2;
        const r = i % 2 ? 26 : 36;
        p.push((C + r * Math.cos(a)).toFixed(1) + ',' + (C - 3 + r * Math.sin(a)).toFixed(1));
      }
      return `<polygon points="${p.join(' ')}" fill="url(#${id}m)"/>`;
    }
    if (stage === 4) {                                                 // octagon
      const p = [];
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8 - Math.PI / 8;
        p.push((C + 34 * Math.cos(a)).toFixed(1) + ',' + (C - 3 + 34 * Math.sin(a)).toFixed(1));
      }
      return `<polygon points="${p.join(' ')}" fill="url(#${id}m)"/>`;
    }
    if (stage === 5) {                                                 // flower
      let d = '';
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12;
        const r = i % 2 ? 30 : 36;
        d += (i ? 'L' : 'M') + (C + r * Math.cos(a)).toFixed(1) + ' '
           + (C - 3 + r * Math.sin(a)).toFixed(1);
      }
      return `<path d="${d}Z" fill="url(#${id}m)" stroke="${t.edge}" stroke-width="1.4"/>`;
    }
    if (stage === 6) {                                                 // gear
      let d = '';
      const teeth = 14;
      for (let i = 0; i < teeth * 2; i++) {
        const a = (Math.PI * i) / teeth;
        const r = i % 2 ? 30 : 35.5;
        d += (i ? 'L' : 'M') + (C + r * Math.cos(a)).toFixed(1) + ' '
           + (C - 3 + r * Math.sin(a)).toFixed(1);
      }
      return `<path d="${d}Z" fill="url(#${id}m)"/>`;
    }
    if (stage === 7) {                                                 // gem
      return `<path d="M50 6l26 14v24c0 14-12 22-26 26-14-4-26-12-26-26V20z"
        fill="url(#${id}m)"/><path d="M50 6l26 14H24z" fill="${t.light}" opacity=".35"/>`;
    }
    if (stage === 8) {                                                 // cross / four points
      return `<path d="M50 6l9 20 20 3-14 15 3 21-18-11-18 11 3-21-14-15 20-3z"
        fill="url(#${id}m)"/>`;
    }
    return `<g fill="url(#${id}m)">` + Array.from({ length: 20 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 20 - Math.PI / 2;
      const r = i % 2 ? 24 : 37;
      return `<path d="M50 47L${(50 + r * Math.cos(a - 0.16)).toFixed(1)} ${(47 + r * Math.sin(a - 0.16)).toFixed(1)}
        L${(50 + r * Math.cos(a + 0.16)).toFixed(1)} ${(47 + r * Math.sin(a + 0.16)).toFixed(1)}z"/>`;
    }).join('') + '</g>';
  }

  /* ---------- the motif: 10 families x 10 variants = 100 ---------- */
  function motif(step, variant, t) {
    const w = '#fff', e = t.edge;
    const base = step;                       // 0..9
    const v = variant;                       // 0..9
    const grow = 1 + v * 0.055;
    const k = (x) => (x * grow).toFixed(2);

    // each motif family is drawn once, and the variant changes its count,
    // its fill or its inner detail, so 1..100 never repeat
    switch (base) {
      case 0: { // RINGS
        const rings = 1 + v;
        let out = '';
        for (let i = 0; i < rings; i++) {
          out += `<circle cx="50" cy="44" r="${(k(6 + i * 3.2))}" fill="none"
            stroke="${w}" stroke-width="${2.6 - i * 0.16}" opacity="${0.95 - i * 0.06}"/>`;
        }
        return out + (v >= 5 ? `<circle cx="50" cy="44" r="2.4" fill="${w}"/>` : '');
      }
      case 1: { // GRID / BOOK
        let out = `<rect x="${50 - k(13)}" y="${44 - k(12)}" width="${k(26)}" height="${k(24)}"
          fill="none" stroke="${w}" stroke-width="2.8" rx="${v > 4 ? 4 : 0}"/>`;
        for (let i = 1; i <= v; i++) {
          out += `<line x1="${50 - k(13)}" y1="${(44 - k(12) + i * (k(24) / (v + 1))).toFixed(1)}"
            x2="${50 + k(13)}" y2="${(44 - k(12) + i * (k(24) / (v + 1))).toFixed(1)}"
            stroke="${w}" stroke-width="1.8"/>`;
        }
        return out;
      }
      case 2: { // QUILL
        let out = `<path d="M${50 - k(11)} ${44 + k(12)} Q50 ${44 - k(14)} ${50 + k(13)} ${44 - k(14)}
          Q${50 + k(4)} ${44} ${50 - k(11)} ${44 + k(12)}z" fill="${w}" opacity=".92"/>`;
        if (v >= 3) out += `<line x1="${50 - k(10)}" y1="${44 + k(11)}" x2="${50 + k(6)}"
          y2="${44 - k(10)}" stroke="${e}" stroke-width="1.6"/>`;
        if (v >= 6) out += `<circle cx="${50 + k(12)}" cy="${44 - k(11)}" r="2" fill="${w}"/>`;
        return out;
      }
      case 3: { // STAR, points = v + 5
        const pts = 5 + v;
        let d = '';
        for (let i = 0; i < pts * 2; i++) {
          const a = (Math.PI * i) / pts - Math.PI / 2;
          const r = i % 2 ? k(6) : k(16);
          d += (i ? 'L' : 'M') + (50 + r * Math.cos(a)).toFixed(1) + ' '
             + (44 + r * Math.sin(a)).toFixed(1);
        }
        return `<path d="${d}Z" fill="${w}" opacity=".94"/>`;
      }
      case 4: { // LAUREL / LEAVES
        let out = '';
        for (let side of [-1, 1]) {
          for (let i = 0; i < 2 + v; i++) {
            const y = 44 + 10 - i * (k(20) / (2 + v));
            out += `<ellipse cx="${50 + side * (k(6) + i * 1.4)}" cy="${y.toFixed(1)}"
              rx="${3.4}" ry="${2.2}" transform="rotate(${side * (28 + i * 6)} ${50 + side * (k(6) + i * 1.4)} ${y.toFixed(1)})"
              fill="${w}" opacity="${0.95 - i * 0.07}"/>`;
          }
        }
        return out + (v >= 7 ? `<circle cx="50" cy="44" r="3" fill="${w}"/>` : '');
      }
      case 5: { // TROPHY / CUP
        const wide = k(15 + v * 0.6);
        let out = `<path d="M${50 - wide / 2} ${44 - k(11)}h${wide}v${k(8)}
          a${wide / 2} ${k(8)} 0 0 1 -${wide} 0z" fill="${w}" opacity=".94"/>
          <rect x="${50 - k(2)}" y="${44 + k(4)}" width="${k(4)}" height="${k(6)}" fill="${w}"/>
          <rect x="${50 - k(7)}" y="${44 + k(9)}" width="${k(14)}" height="${k(3)}" rx="1.5" fill="${w}"/>`;
        if (v >= 4) out += `<circle cx="${50}" cy="${44 - k(6)}" r="${1.8 + v * 0.12}" fill="${e}"
          opacity=".5"/>`;
        return out;
      }
      case 6: { // FLASK / DROP
        const drop = v % 2 === 0;
        if (drop) {
          return `<path d="M50 ${44 - k(15)}c-${k(9)} ${k(11)} -${k(11)} ${k(15)} 0 ${k(19)}
            c${k(11)} -${k(4)} ${k(9)} -${k(8)} 0 -${k(19)}z" fill="${w}" opacity=".92"/>
            <ellipse cx="46" cy="${44 + k(2)}" rx="2.4" ry="3.6" fill="${e}" opacity=".35"/>`;
        }
        return `<path d="M${50 - k(8)} ${44 - k(12)}h${k(16)}v${k(5)}l${k(5)} ${k(11)}
          a3 3 0 0 1 -3 4h-${k(20)}a3 3 0 0 1 -3 -4l${k(5)} -${k(11)}z"
          fill="${w}" opacity=".92"/><circle cx="50" cy="${44 + k(4)}" r="${2 + v * 0.12}"
          fill="${e}" opacity=".45"/>`;
      }
      case 7: { // SHARDS
        let out = '';
        const n = 3 + v;
        for (let i = 0; i < n; i++) {
          const a = (Math.PI * 2 * i) / n - Math.PI / 2;
          const r1 = k(5), r2 = k(15);
          out += `<path d="M${(50 + r1 * Math.cos(a)).toFixed(1)} ${(44 + r1 * Math.sin(a)).toFixed(1)}
            L${(50 + r2 * Math.cos(a - .22)).toFixed(1)} ${(44 + r2 * Math.sin(a - .22)).toFixed(1)}
            L${(50 + r2 * Math.cos(a + .22)).toFixed(1)} ${(44 + r2 * Math.sin(a + .22)).toFixed(1)}z"
            fill="${w}" opacity="${0.95 - i * 0.04}"/>`;
        }
        return out;
      }
      case 8: { // CROWN / WINGS
        if (v < 5) {
          const sp = 2 + v;
          let out = '';
          for (let i = 0; i < sp; i++) {
            const x = 50 + (i - (sp - 1) / 2) * k(7);
            out += `<path d="M${x} ${44 + k(8)}l${k(2.6)} ${-k(9)} ${k(2.6)} ${k(9)}"
              fill="${w}" opacity=".95"/>`;
          }
          return out + `<rect x="${50 - k(12)}" y="${44 + k(7)}" width="${k(24)}"
            height="${k(4)}" rx="2" fill="${w}"/>`;
        }
        let out = '';
        for (let side of [-1, 1]) {
          for (let i = 0; i < 3; i++) {
            out += `<path d="M${50 + side * k(8)} ${44 + (i - 1) * 5}
              q${side * k(9)} -1 ${side * k(12)} -${4 + i}z"
              fill="${w}" opacity="${0.9 - i * 0.1}"/>`;
          }
        }
        return out;
      }
      default: { // BURST / SUN
        let out = '';
        const rays = 6 + v * 2;
        for (let i = 0; i < rays; i++) {
          const a = (Math.PI * 2 * i) / rays - Math.PI / 2;
          out += `<line x1="${(50 + k(7) * Math.cos(a)).toFixed(1)}" y1="${(44 + k(7) * Math.sin(a)).toFixed(1)}"
            x2="${(50 + k(15) * Math.cos(a)).toFixed(1)}" y2="${(44 + k(15) * Math.sin(a)).toFixed(1)}"
            stroke="${w}" stroke-width="${v > 5 ? 2.4 : 2.8}" stroke-linecap="round"/>`;
        }
        return out + `<circle cx="50" cy="44" r="${(4 + v * 0.35).toFixed(1)}" fill="${w}"/>`;
      }
    }
  }

  /* ---------- rim: one clean band, one ornament, nothing overlapping ----------
     The plate's largest radius is 37, so ornaments sit at 41 with a radius of
     at most 2.6 — always inside the 100 box and never on top of the art.  Every
     ornament gets a thin dark outline so it reads whatever the metal colour is. */
  function rim(step, n, t) {
    const C = 50, cy = 47, R = 41;
    const OUT = '#0a0818';
    let out = `<circle cx="${C}" cy="${cy}" r="${R - 2}" fill="none" stroke="${OUT}"
      stroke-width="1.4" opacity=".55"/>`;
    const kind = n % 5;
    if (kind === 0) {
      // even studs
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
        const x = C + R * Math.cos(a), y = cy + R * Math.sin(a);
        out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.4"
          fill="${t.light}" stroke="${OUT}" stroke-width="1"/>`;
      }
    } else if (kind === 1) {
      // segmented band
      out += `<circle cx="${C}" cy="${cy}" r="${R}" fill="none" stroke="${t.light}"
        stroke-width="2.2" stroke-dasharray="6 5" opacity=".95"/>`;
    } else if (kind === 2) {
      // diamonds between the plate and the band, evenly spaced
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8 - Math.PI / 8;
        const x = C + R * Math.cos(a), y = cy + R * Math.sin(a);
        out += `<rect x="${(x - 2.2).toFixed(1)}" y="${(y - 2.2).toFixed(1)}" width="4.4"
          height="4.4" transform="rotate(45 ${x.toFixed(1)} ${y.toFixed(1)})"
          fill="${t.light}" stroke="${OUT}" stroke-width="1"/>`;
      }
    } else if (kind === 3) {
      // a double band, no ornament loose in space
      out += `<circle cx="${C}" cy="${cy}" r="${R}" fill="none" stroke="${t.mid}"
          stroke-width="2.6" stroke-linecap="round"/>
        <circle cx="${C}" cy="${cy}" r="${R - 4}" fill="none" stroke="${t.light}"
          stroke-width="1.2" opacity=".8"/>`;
    } else {
      // small beads, tight to the band
      for (let i = 0; i < 20; i++) {
        const a = (Math.PI * 2 * i) / 20;
        out += `<circle cx="${(C + (R - 1) * Math.cos(a)).toFixed(1)}"
          cy="${(cy + (R - 1) * Math.sin(a)).toFixed(1)}" r="1.5"
          fill="${t.light}" stroke="${OUT}" stroke-width=".5"/>`;
      }
    }
    return out;
  }

  let seq = 0;

  A.levelCrest = function (n, opts) {
    const o = opts || {};
    const size = o.size || 96;
    const idx = Math.max(1, Math.min(100, n)) - 1;
    const stage = Math.min(9, Math.floor(idx / 10));
    const step = idx % 10;                       // position in the stage
    const family = FAMILIES[stage];
    const t = M[family];
    const id = 'bd' + (++seq);

    let svg = `<defs>
        <linearGradient id="${id}m" x1=".15" y1="0" x2=".85" y2="1">
          <stop offset="0" stop-color="${t.light}"/>
          <stop offset=".42" stop-color="${t.mid}"/>
          <stop offset=".74" stop-color="${t.deep}"/>
          <stop offset="1" stop-color="${t.mid}"/>
        </linearGradient>
        <radialGradient id="${id}g" cx=".34" cy=".26" r=".95">
          <stop offset="0" stop-color="${t.mid}"/>
          <stop offset=".55" stop-color="${t.deep}"/>
          <stop offset="1" stop-color="#0a0818"/>
        </radialGradient>
      </defs>
      ${plate(stage, t, id)}
      <circle cx="50" cy="44" r="24" fill="url(#${id}g)" stroke="#0a0818" stroke-width="1.6"/>
      <circle cx="50" cy="44" r="21.5" fill="none" stroke="${t.light}" stroke-width=".8"
        opacity=".5"/>
      <ellipse cx="42" cy="33" rx="9" ry="5" fill="#fff" opacity=".26"/>
      <g stroke="#0a0818" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
        ${motif(step, n % 10 === 0 ? 9 : n % 10, t)}
      </g>
      ${rim(step, n, t)}
      <g class="num-plate">
        <rect x="32" y="76.5" width="36" height="13" rx="6.5" fill="${t.deep}"
          stroke="${t.mid}" stroke-width="1.4"/>
        <text x="50" y="83.4" text-anchor="middle" dominant-baseline="middle"
          font-family="Archivo Black, Arial Black, sans-serif" font-size="10.5"
          fill="${t.light}">${n}</text>
      </g>`;

    return `<svg class="crest badge-${family} eg-${stage}-${step}${o.locked ? ' locked' : ''}"
      width="${size}" height="${size}" viewBox="0 0 100 100" role="img"
      aria-label="Level ${n} badge, ${family}, design ${stage + 1}-${step + 1}">${svg}</svg>`;
  };

  A.crestTier = (n) => FAMILIES[Math.min(9, Math.floor((Math.max(1, n) - 1) / 10))];
  A.crestGlow = (n) => M[A.crestTier(n)].mid;
})();
