/* Astrolab — shop art, part 1: the drawing toolkit, the character's body and face, hair and face paint.
   Everything is SVG generated from item data (no picture files).  House style: soft dark outlines,
   light from the top-left, a gradient shading pass laid over each flat colour so any item colour
   still looks lit.  The figure lives in a 112 x 212 box; the head is centred on (56,54), which the
   Profile avatar crop (art-frame.js) relies on — do not move it. */
(function () {
  'use strict';
  const S = window.ART = window.ART || {};

  S.item = (id) => ((window.App && App.state && App.state.catalogue && App.state.catalogue.items) || [])
    .find((i) => i.id === id);

  /* ------------------------------------------------------------------ toolkit */
  const LINE = 'rgba(30,22,56,.62)';
  const DARK = '#1d1a33';
  S.LINE = LINE; S.DARK = DARK;

  // an outlined shape with a soft shading overlay on top of its flat colour
  S.sh = function (tag, attrs, fill, o) {
    o = o || {};
    const stroke = o.line === false ? '' :
      ` stroke="${o.line || LINE}" stroke-width="${o.sw == null ? 1.3 : o.sw}" stroke-linejoin="round" stroke-linecap="round"`;
    const base = `<${tag} ${attrs} fill="${fill}"${stroke}${o.op ? ` opacity="${o.op}"` : ''}/>`;
    return o.shade === false ? base : base + `<${tag} ${attrs} fill="url(#${o.shade || 'shV'})"${o.op ? ` opacity="${o.op}"` : ''}/>`;
  };
  S.P = (d, fill, o) => S.sh('path', `d="${d}"`, fill, o);
  S.E = (cx, cy, rx, ry, fill, o) => S.sh('ellipse', `cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"`, fill, o);
  S.C = (cx, cy, r, fill, o) => S.sh('circle', `cx="${cx}" cy="${cy}" r="${r}"`, fill, o);
  S.R = (x, y, w, h, r, fill, o) => S.sh('rect', `x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"`, fill, o);
  S.hl = (d, op) => `<path d="${d}" fill="#fff" opacity="${op == null ? 0.4 : op}"/>`;
  S.dk = (d, op) => `<path d="${d}" fill="#000" opacity="${op == null ? 0.16 : op}"/>`;
  S.ln = (d, c, w, op) => `<path d="${d}" fill="none" stroke="${c || '#000'}" stroke-width="${w || 1}" stroke-linecap="round" stroke-linejoin="round"${op != null ? ` opacity="${op}"` : ''}/>`;
  S.dot = (cx, cy, r, c, op) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"${op != null ? ` opacity="${op}"` : ''}/>`;
  S.mirror = (inner) => `<g transform="matrix(-1 0 0 1 112 0)">${inner}</g>`;
  S.star = function (cx, cy, R, r, pts) {
    pts = pts || 5; let d = '';
    for (let i = 0; i < pts * 2; i++) {
      const a = -Math.PI / 2 + i * Math.PI / pts, rad = i % 2 ? r : R;
      d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rad).toFixed(2) + ' ' + (cy + Math.sin(a) * rad).toFixed(2);
    }
    return d + 'z';
  };
  S.glint = (cx, cy, s, c, op) =>   // four-point sparkle
    `<path d="M${cx} ${cy - s}Q${cx} ${cy} ${cx + s} ${cy}Q${cx} ${cy} ${cx} ${cy + s}Q${cx} ${cy} ${cx - s} ${cy}Q${cx} ${cy} ${cx} ${cy - s}z" fill="${c || '#fff'}"${op != null ? ` opacity="${op}"` : ''}/>`;
  S.heart = (cx, cy, s) => `M${cx} ${cy + s * .9}C${cx - s * 1.9} ${cy - s * .2} ${cx - s * .9} ${cy - s * 1.3} ${cx} ${cy - s * .35}C${cx + s * .9} ${cy - s * 1.3} ${cx + s * 1.9} ${cy - s * .2} ${cx} ${cy + s * .9}z`;

  // mirror a path written with ABSOLUTE commands (M L C Q H V Z) around the figure's centre line
  S.flip = function (d) {
    return d.replace(/([MLCQHVZ])([^MLCQHVZ]*)/g, (m, cmd, args) => {
      if (cmd === 'Z') return 'Z';
      const n = (args.match(/-?\d*\.?\d+/g) || []).map(Number);
      const out = cmd === 'H' ? n.map((v) => +(112 - v).toFixed(2))
        : cmd === 'V' ? n : n.map((v, i) => i % 2 ? v : +(112 - v).toFixed(2));
      return cmd + out.join(' ');
    });
  };

  /* A limb: a fat stroke along a path with an outline, a lit edge and a shaded edge.
     from/to trim it to part of the path (0..100), so one arm path draws the arm AND every sleeve. */
  S.limb = function (d, w, fill, o) {
    o = o || {};
    const a = o.from || 0, b = o.to == null ? 100 : o.to, cap = o.cap || 'round';
    const dash = (extra) => `pathLength="100" stroke-dasharray="${Math.max(.01, b - a + (extra || 0)).toFixed(2)} 400" stroke-dashoffset="${(-a).toFixed(2)}"`;
    const base = `d="${d}" fill="none" stroke-linecap="${cap}" stroke-linejoin="round"`;
    let out = o.line === false ? '' :
      `<path ${base} stroke="${o.lineCol || LINE}" stroke-width="${(w + (o.sw == null ? 2.6 : o.sw)).toFixed(2)}" ${dash(cap === 'butt' ? 1.1 : 0)}/>`;
    out += `<path ${base} stroke="${fill}" stroke-width="${w}" ${dash(0)}/>`;
    if (o.shade !== false) {
      out += `<path ${base} stroke="#fff" stroke-opacity=".2" stroke-width="${(w * .34).toFixed(2)}" transform="translate(${(-w * .2).toFixed(2)} -.3)" ${dash(0)}/>` +
        `<path ${base} stroke="#000" stroke-opacity=".17" stroke-width="${(w * .36).toFixed(2)}" transform="translate(${(w * .22).toFixed(2)} .3)" ${dash(0)}/>`;
    }
    return out;
  };

  /* one hidden <svg> holds every gradient the art refers to (shared by all items on the page) */
  const stop = (o, c, a) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`;
  const lg = (id, stops, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 == null ? 1 : y2}">${stops.map((s, i) => stop(i / (stops.length - 1), s)).join('')}</linearGradient>`;
  const DEFS = `<svg id="art-defs" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>
    <linearGradient id="shV" x1="0" y1="0" x2="0" y2="1">${stop(0, '#fff', .34)}${stop(.45, '#fff', 0)}${stop(1, '#000', .3)}</linearGradient>
    <linearGradient id="shD" x1="0" y1="0" x2="1" y2="1">${stop(0, '#fff', .4)}${stop(.5, '#fff', 0)}${stop(1, '#000', .32)}</linearGradient>
    <linearGradient id="shH" x1="0" y1="0" x2="1" y2="0">${stop(0, '#000', .26)}${stop(.28, '#fff', .2)}${stop(.6, '#fff', 0)}${stop(1, '#000', .3)}</linearGradient>
    <radialGradient id="shR" cx=".34" cy=".3" r=".9">${stop(0, '#fff', .55)}${stop(.4, '#fff', 0)}${stop(1, '#000', .34)}</radialGradient>
    <linearGradient id="shUp" x1="0" y1="0" x2="0" y2="1">${stop(0, '#000', .34)}${stop(.7, '#000', 0)}</linearGradient>
    <radialGradient id="shGlow">${stop(0, '#fff', .9)}${stop(.4, '#fff', .25)}${stop(1, '#fff', 0)}</radialGradient>
    <linearGradient id="irisShade" x1="0" y1="0" x2="0" y2="1">${stop(0, '#000', .5)}${stop(.5, '#000', 0)}${stop(1, '#fff', .3)}</linearGradient>
    <linearGradient id="avBg" x1="0" y1="0" x2="0" y2="1">${stop(0, '#2c3766')}${stop(1, '#141a33')}</linearGradient>
    <radialGradient id="avSpot" cx=".5" cy=".42" r=".6">${stop(0, '#9fc4ff', .26)}${stop(1, '#9fc4ff', 0)}</radialGradient>
    ${lg('hairStar', ['#ffd166', '#ff6f91', '#9a86e0', '#6fd8ff'])}
    ${lg('hairSunset', ['#ffd36b', '#ff7a8a', '#9a6bff'], 0, 0, 0, 1)}
    ${lg('hairOcean', ['#8ff0ff', '#3a8bff', '#5a4cff'], 0, 0, 0, 1)}
    ${lg('hairAurora', ['#8dffc0', '#4ad0ff', '#b07bff'])}
    ${lg('hairCandy', ['#ffc2e2', '#c9b8ff', '#b8f2ff'])}
    ${lg('hairFire', ['#ffe66b', '#ff8a3c', '#e0382c'], 0, 1, 0, 0)}
    ${lg('hairGold', ['#fff1b0', '#ffc247', '#d98a1c'])}
    ${lg('hairGalaxy', ['#3a2a80', '#7a45e0', '#ff6fc0'])}
    ${lg('hairRainbow', ['#ff6b6b', '#ffd166', '#6bd66b', '#4aa8ff', '#a97bff'], 0, 0, 0, 1)}
    ${lg('eyeGalaxy', ['#2b1f6a', '#8a4bff', '#ff7ad9'], 0, 0, 1, 1)}
    ${lg('eyeSunset', ['#ffe08a', '#ff7a5c', '#d9366b'], 0, 0, 0, 1)}
    ${lg('wingGold', ['#fff3c4', '#ffd166', '#e0932b'], 0, 0, 0, 1)}
    ${lg('wingAngel', ['#ffffff', '#e4eeff', '#b9cdf5'], 0, 0, 0, 1)}
    ${lg('wingFairy', ['#d2fbff', '#ffd0f2', '#b8a8ff'])}
    ${lg('wingBat', ['#7a3aa8', '#43206a', '#241040'], 0, 0, 0, 1)}
    ${lg('wingFlame', ['#fff3a0', '#ff9a3c', '#e0382c'], 0, 0, 0, 1)}
    ${lg('mGold', ['#fff1b0', '#ffc247', '#c9811a'])}
    ${lg('mSilver', ['#ffffff', '#c5cde6', '#8791b3'])}
    ${lg('mBronze', ['#ffd9b0', '#d98a4a', '#8a4a22'])}
    ${lg('lens', ['#d8f1ff', '#7fb8ee', '#3a6fb8'], 0, 0, 1, 1)}
    ${lg('petGlow', ['#fffbe0', '#ffe08a', '#ff9d5c'])}
    ${lg('artSun', ['#6a4c93', '#ff7a8a', '#ffd27a'], 0, 0, 0, 1)}
    ${lg('artWave', ['#bff0ff', '#4fb0e8', '#1f4f9a'], 0, 0, 0, 1)}
    ${lg('artForest', ['#9fe3b0', '#3f9e6b', '#1d5a43'], 0, 0, 0, 1)}
    ${lg('artNeon', ['#ff5cc8', '#8a4bff', '#2ad6ff'])}
    ${lg('rainbowArc', ['#ff6b6b', '#ffb84a', '#ffe66b', '#6bd66b', '#4aa8ff', '#a97bff'], 0, 0, 1, 0)}
    ${lg('slimeG', ['#d6ffb0', '#6fe07a', '#2fae5a'], 0, 0, 0, 1)}
  </defs></svg>`;
  S.DEFS = DEFS;
  (function inject() {
    if (typeof document === 'undefined') return;
    const add = () => { if (!document.getElementById('art-defs')) document.body.insertAdjacentHTML('afterbegin', DEFS); };
    if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
  })();

  /* ------------------------------------------------------------------- body */
  // One shared skin tone: players choose clothes and hair, not skin (keeps the wardrobe simple).
  const SKIN = '#f2c8a2', SKIN_D = '#d99a74';
  S.SKIN = SKIN; S.SKIN_D = SKIN_D;

  // shared silhouette paths — every garment is cut from these so clothes always fit the body
  S.ARM = 'M39.5 101C33.5 107.5 31.5 118 32 128C32.4 136 33.4 142 34 148';
  S.ARM_R = S.flip(S.ARM);
  S.LEG_L = 'M47.5 156L46.8 198';
  S.LEG_R = 'M64.5 156L65.2 198';
  S.TORSO = 'M40 99C40 93 44 91 49 89.500L52 88.500Q56 91.500 60 88.500L63 89.500C68 91 72 93 72 99L73 132C73.300 145 74.500 154 75 162L37 162C37.500 154 38.700 145 39 132Z';

  S.legs = () => S.limb(S.LEG_L, 15, SKIN) + S.limb(S.LEG_R, 15, SKIN);

  S.arms = () => {
    const hand = (x) => S.C(x, 152.5, 5.4, SKIN, { shade: 'shR' }) + S.hl(`M${x - 3} ${150.5}q1.6-2.4 4-2.6-2.4 1-4 2.6z`, .5);
    return S.limb(S.ARM, 10.5, SKIN) + hand(34) + S.limb(S.ARM_R, 10.5, SKIN) + hand(78);
  };

  S.neck = () => S.P('M49.500 78h13v18q-6.500 6-13 0z', SKIN, { shade: 'shH' }) + S.dk('M49.500 86q6.500 6 13 0v-3q-6.500 5-13 0z', .2);

  S.torso = () => S.P(S.TORSO, SKIN, { shade: 'shH' }) + S.ln('M47 100q9 4 18 0', '#a55a3a', 1.2, .2);

  S.head = function () {
    const face = 'M30.500 55c0-15 11-26.500 25.500-26.500S81.500 40 81.500 55c0 15-10.500 28-25.500 28S30.500 70 30.500 55z';
    return S.E(31, 58, 4.600, 5.800, SKIN, { shade: 'shH' }) + S.E(81, 58, 4.600, 5.800, SKIN, { shade: 'shH' }) +
      `<ellipse cx="31.600" cy="58.400" rx="1.800" ry="3" fill="${SKIN_D}" opacity=".7"/><ellipse cx="80.400" cy="58.400" rx="1.800" ry="3" fill="${SKIN_D}" opacity=".7"/>` +
      S.P(face, SKIN, { shade: 'shR' }) +
      `<ellipse cx="41" cy="70" rx="5.200" ry="3" fill="#ff7f86" opacity=".28"/><ellipse cx="71" cy="70" rx="5.200" ry="3" fill="#ff7f86" opacity=".28"/>` +
      S.ln('M54.800 67.600q1.200 1.800 2.600 0', '#b9774f', 1.200, .7);
  };

  /* ------------------------------------------------------------------- eyes */
  S.eyes = function (style, c) {
    c = c || '#2a2b4a';
    const X = [48.600, 63.400], Y = 62.500;
    const each = (fn) => X.map((x, i) => fn(x, i)).join('');
    const brow = (lift, tilt) => X.map((x, i) => {
      const y = 53.600 - (lift || 0), t = tilt || 0;
      return S.ln(`M${x - 5.200} ${(y + (i ? t : -t)).toFixed(2)}Q${x} ${(y - 2.400).toFixed(2)} ${x + 5.200} ${(y + (i ? -t : t)).toFixed(2)}`, '#3a2a24', 1.900, .6);
    }).join('');
    const sh = (x, y, big) => `<circle cx="${x + 1.700}" cy="${y - 2}" r="${big ? 1.700 : 1.400}" fill="#fff"/><circle cx="${x - 1.500}" cy="${y + 2.100}" r=".8" fill="#fff" opacity=".85"/>`;
    const iris = (x, y, rx, ry, pr) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#irisShade)"/>` +
      `<ellipse cx="${x}" cy="${y + .3}" rx="${(rx * (pr || .52)).toFixed(2)}" ry="${(ry * (pr || .52) * 1.05).toFixed(2)}" fill="${DARK}"/>`;
    const lid = (x, i, w, y) => S.ln(`M${x - w} ${y + 1.200}Q${x} ${y - 5.200} ${x + w} ${y + 1.200}`, DARK, 2) + S.ln(`M${x + (i ? 1 : -1) * w} ${y + 1.200}l${i ? 1.800 : -1.800} -1.400`, DARK, 1.400);
    const arc = (x, up) => S.ln(`M${x - 5.200} ${up ? 63.400 : 60.800}q5.200 ${up ? -7.400 : 7.400} 10.400 0`, DARK, 2.600);
    const M = {
      happy: () => each((x) => arc(x, true)),
      wide: () => each((x, i) => `<ellipse cx="${x}" cy="62.500" rx="6" ry="6.800" fill="#fff"/>` + iris(x, 62.800, 4.100, 5, .5) + sh(x, 62.800, true) + lid(x, i, 6, 59.800)),
      sleepy: () => each((x, i) => `<ellipse cx="${x}" cy="63" rx="4.600" ry="5" fill="${c}"/><ellipse cx="${x}" cy="63" rx="4.600" ry="5" fill="url(#irisShade)"/>` +
        `<ellipse cx="${x}" cy="63.600" rx="2.400" ry="2.800" fill="${DARK}"/><rect x="${x - 6}" y="55.500" width="12" height="7" fill="${SKIN}"/>` + S.ln(`M${x - 5.600} 62.300h11.200`, DARK, 2.300) + S.ln(`M${x + (i ? 5.600 : -5.600)} 62.300l${i ? 1.600 : -1.600} 1.600`, DARK, 1.200) + `<circle cx="${x + 1.600}" cy="64.800" r="1" fill="#fff"/>`),
      sparkle: () => each((x, i) => iris(x, 62.500, 4.900, 5.900, .46) + `<circle cx="${x + 1.900}" cy="59.800" r="2.200" fill="#fff"/><circle cx="${x - 1.800}" cy="65" r="1.100" fill="#fff"/>` + S.glint(x + 6.400, 56.600, 2.200, '#fff', .9) + lid(x, i, 5.600, 59.200)),
      star: () => each((x) => `<path d="${S.star(x, 62.500, 6.800, 3)}" fill="${c}" stroke="${DARK}" stroke-width="1.100" stroke-linejoin="round"/><path d="${S.star(x, 62.500, 6.800, 3)}" fill="url(#shD)"/><circle cx="${x - 1.200}" cy="61" r="1.100" fill="#fff" opacity=".9"/>`),
      wink: () => arc(X[0], true) + iris(X[1], 62.500, 4.400, 5.400) + sh(X[1], 62.500) + lid(X[1], 1, 5.200, 60),
      lashes: () => each((x, i) => iris(x, 62.500, 4.300, 5.300) + sh(x, 62.500) + lid(x, i, 5.200, 60) +
        S.ln(`M${x + (i ? 5.400 : -5.400)} 60.600l${i ? 3 : -3} -2.400M${x + (i ? 4.600 : -4.600)} 59.200l${i ? 2.200 : -2.200} -3`, DARK, 1.200)),
      cat: () => each((x, i) => `<ellipse cx="${x}" cy="62.500" rx="4.800" ry="5.300" fill="${c}"/><ellipse cx="${x}" cy="62.500" rx="4.800" ry="5.300" fill="url(#irisShade)"/>` +
        `<ellipse cx="${x}" cy="62.500" rx="1.500" ry="5" fill="${DARK}"/><circle cx="${x + 1.800}" cy="60" r="1.300" fill="#fff"/>` + lid(x, i, 5.600, 59.800) + S.ln(`M${x + (i ? 5.800 : -5.800)} 61.600l${i ? 3.400 : -3.400} -3`, DARK, 1.600)),
      heart: () => each((x) => `<path d="${S.heart(x, 62, 3.200)}" transform="translate(0 .4) scale(1.0)" fill="#ff5c8a" stroke="#a02a55" stroke-width="1" stroke-linejoin="round"/><circle cx="${x - 1.200}" cy="60.600" r="1" fill="#fff" opacity=".9"/>`),
      puppy: () => each((x, i) => iris(x, 63, 5, 5.800, .5) + `<circle cx="${x + 1.800}" cy="60.200" r="2" fill="#fff"/><circle cx="${x - 1.700}" cy="65.600" r="1.100" fill="#fff"/>` +
        S.ln(`M${x - 5.400} 59.600q5.400-3.200 10.800 0`, DARK, 1.800)),
      determined: () => each((x, i) => iris(x, 63, 4.300, 4.800) + sh(x, 63) + `<path d="M${x - 5.600} ${i ? 58.200 : 60}L${x + 5.600} ${i ? 60 : 58.200}V${i ? 55 : 55}H${x - 5.600}z" fill="${SKIN}"/>` +
        S.ln(`M${x - 5.600} ${i ? 58.200 : 60}L${x + 5.600} ${i ? 60 : 58.200}`, DARK, 2.300)),
    };
    const dflt = () => each((x, i) => iris(x, 62.500, 4.400, 5.400) + sh(x, 62.500) + lid(x, i, 5.200, 60));
    const tilt = style === 'determined' ? 1.600 : 0, lift = style === 'wide' || style === 'sparkle' ? 1 : 0;
    return brow(lift, tilt) + (M[style] || dflt)();
  };

  /* ------------------------------------------------------------------ mouth */
  S.mouth = function (style) {
    const T = '#8a3a42', IN = '#7d2b3a';
    const M = {
      grin: () => `<path d="M48.400 72.400q7.600 11.400 15.200 0z" fill="${IN}" stroke="#4a1a26" stroke-width="1.400" stroke-linejoin="round"/>` +
        `<path d="M49.600 73.200h12.800q-1.200 3-6.400 3.200-5.200-.2-6.400-3.200z" fill="#fff"/><ellipse cx="56" cy="78.800" rx="4" ry="2" fill="#ff7a8a"/>`,
      neutral: () => S.ln('M51.500 75.600q4.500 1.200 9 0', T, 2.200),
      smirk: () => S.ln('M50 74.800q6.400 3.600 13 -2.600', T, 2.400) + S.ln('M63.400 71.800l1.200-1', T, 1.300),
      o: () => `<ellipse cx="56" cy="76" rx="3.600" ry="4.600" fill="${IN}" stroke="#4a1a26" stroke-width="1.300"/><ellipse cx="56" cy="78" rx="2.100" ry="1.600" fill="#ff7a8a"/>`,
      cat: () => S.ln('M49.400 72.800q3.300 5.200 6.600 0q3.300 5.200 6.600 0', T, 2.100) + `<path d="M54.600 69.800h2.800l-1.400 1.800z" fill="#ff8fa3"/>`,
      teeth: () => `<path d="M49 72.400q7 9.400 14 0z" fill="${IN}" stroke="#4a1a26" stroke-width="1.300" stroke-linejoin="round"/><path d="M50.200 73h11.600q-.8 2.200-5.800 2.400-5-.2-5.800-2.400z" fill="#fff"/>`,
      tongue: () => S.ln('M49.600 73.400q6.400 6 12.800 0', T, 2.300) + `<path d="M53 76.200q3 5.200 6 0q-3 1.400-6 0z" fill="#ff7a8a" stroke="#c0405a" stroke-width="1" stroke-linejoin="round"/>`,
      pout: () => `<ellipse cx="56" cy="75.600" rx="3.600" ry="2.400" fill="#e0707a" stroke="${T}" stroke-width="1.100"/>` + S.ln('M52.600 75.400h6.800', T, .9, .8),
      laugh: () => `<path d="M47.600 71.800q8.400 15 16.800 0z" fill="${IN}" stroke="#4a1a26" stroke-width="1.400" stroke-linejoin="round"/><path d="M48.800 72.600h14.400q-.6 2.600-7.200 2.800-6.600-.2-7.200-2.800z" fill="#fff"/><ellipse cx="56" cy="79.200" rx="4.600" ry="2.600" fill="#ff7a8a"/>`,
      fang: () => S.ln('M49.200 73q6.800 6.600 13.600 0', T, 2.200) + `<path d="M51.800 75.200l1.400 3.200 1.400-2.600z" fill="#fff" stroke="${T}" stroke-width=".7" stroke-linejoin="round"/><path d="M59.600 75.800l1.400 3 1.400-3.400z" fill="#fff" stroke="${T}" stroke-width=".7" stroke-linejoin="round"/>`,
      tiny: () => S.ln('M52.600 74.600q3.400 2.600 6.800 0', T, 2),
      wavy: () => S.ln('M49.600 75q1.600-2.200 3.200 0t3.200 0 3.200 0 3.200 0', T, 2),
    };
    return (M[style] || (() => S.ln('M49.800 73.600q6.200 6.800 12.400 0', T, 2.400) + S.ln('M48.600 72.800l1.200 1M63.400 72.800l-1.200 1', T, 1.200, .8)))();
  };

  /* ------------------------------------------------------------------- hair
     Two layers: hairBack sits behind the head and shoulders, hair (the front) over the forehead and ears.
     Every shape is drawn against the same skull so any style sits correctly on any head. */
  const base = (d, c, o) => S.P(d, c, Object.assign({ shade: 'shD', sw: 1.3 }, o || {}));
  const strand = (d, op) => S.ln(d, '#000', 1.100, op == null ? .2 : op);
  const shine = (d, op) => S.hl(d, op == null ? .36 : op);
  const curls = (pts, r) => pts.map((p) => S.ln(`M${p[0] - (r || 3)} ${p[1]}q${r || 3}-${(r || 3) * 1.300} ${(r || 3) * 2} 0`, '#000', 1.100, .22)).join('');

  const DOME = 'M29.500 58C26 38 38 20 56 20S86 38 82.500 58';
  S.hairBack = function (style, c) {
    c = c || '#3b2a20';
    const B = {
      bob: () => base('M28 52C26 70 27 84 33 90L40 86H72L79 90C85 84 86 70 84 52Z', c, { shade: 'shV' }),
      long: () => base('M27 50C23 74 24 96 31 108Q40 114 44 106L68 106Q72 114 81 108C88 96 89 74 85 50Z', c, { shade: 'shV' }) + strand('M34 70q-2 16 0 32M78 70q2 16 0 32', .18),
      wavy: () => base('M27.500 50C24 70 25 92 33 100q4 4 8-2l2-8h26l2 8q4 6 8 2C87 92 88 70 84.500 50Z', c, { shade: 'shV' }) + strand('M32 72q3 10 0 22M80 72q-3 10 0 22', .18),
      wolf: () => base('M28 50C25 66 26 84 31 98l5-6 4 8 5-8h22l5 8 4-8 5 6C86 84 87 66 84 50Z', c, { shade: 'shV' }),
      shaggy: () => base('M28.500 52C26 66 27 80 31 90l5-5 4 6 6-6h20l6 6 4-6 5 5C85 80 86 66 83.500 52Z', c, { shade: 'shV' }),
      pony: () => base('M70 40C86 44 94 62 88 84C85 94 78 100 72 98C78 90 80 80 76 66C74 56 68 50 66 46Z', c) + strand('M80 56q6 12 0 28', .22),
      pigtails: () => base('M34 48C20 50 14 70 20 90C23 98 29 100 33 97C28 88 28 78 32 68Z', c) + base('M78 48C92 50 98 70 92 90C89 98 83 100 79 97C84 88 84 78 80 68Z', c) + strand('M24 62q-3 14 2 28M88 62q3 14 -2 28', .22),
      braid: () => base('M72 50C84 54 86 70 82 86L84 118Q82 126 76 124L74 92C72 80 72 66 66 56Z', c) + [74, 82, 90, 98, 106, 114].map((y, i) => strand(`M${74 + (i % 2) * 2} ${y}q4 3 8 0`, .35)).join('') + S.R(73, 116, 10, 5, 2, '#ff6b9d', { sw: 1 }),
      twinbuns: () => '',
      sidebraid: () => base('M30 48C20 56 18 76 24 94L22 112Q22 120 28 118L32 96C34 82 34 66 38 56Z', c) + [74, 82, 90, 98, 106].map((y, i) => strand(`M${22 + (i % 2) * 2} ${y}q4 3 8 0`, .35)).join(''),
      afro: () => '',
      locs: () => [27, 33, 79, 85].map((x, i) => base(`M${x} 52q${i < 2 ? -3 : 3} 28 ${i < 2 ? 1 : -1} 52q-2 4-5 0Q${x - 3} 76 ${x} 52z`, c, { shade: 'shH' })).join(''),
    };
    return (B[style] || (() => ''))();
  };

  S.hair = function (style, c) {
    c = c || '#3b2a20';
    const hairline = 'C78 43 70 38 56 38S34 43 31 52';
    const D = {
      buzz: () => base('M31.200 53C29.500 38 41 26.500 56 26.500S82.500 38 80.800 53C79 45 74 41 68 39.500 Q56 36.500 44 39.500 C38 41 33 45 31.200 53Z', c, { sw: 1.200 }) +
        shine('M40 33q6-6 14-6.500-9 1.500-14 6.500z', .3) + [[44, 33], [50, 30], [58, 29.500], [65, 31], [70, 35], [47, 36.500], [62, 34.500]].map((p) => S.dot(p[0], p[1], .65, '#000', .24)).join(''),
      crew: () => base('M29.500 55C27.500 37 39 23.500 56 23.500S84.500 37 82.500 55C80.500 46 76 41 70 39.500 Q56 33 42 39.500 C36 41 31.500 46 29.500 55Z', c) +
        strand('M44 30q-3 5-4 9M56 26v8M68 30q3 5 4 9', .2) + shine('M38 31q7-7 17-7.500-11 2-17 7.500z', .34),
      bob: () => base('M29 62C26 40 38 20 56 20S86 40 83 62L81.500 84Q80 88 76 87L73.500 62C72 50 66 43 56 42S40 50 38.500 62L36 87Q32 88 30.500 84Z', c, { shade: 'shD' }) +
        strand('M50 22q-5 8-8 18M62 22q3 6 9 16M44 41q6 3 12 1', .2) + shine('M38 30q5-9 14-10-9 3-14 10z', .36) + S.dk('M31 70q.5 8 3 14l-1-14z', .12),
      spiky: () => base('M30 56C28 46 30 38 34 33L30 16l13 8 3-14 8 12 7-14 4 16 9-8-1 18 8-4-5 17c3 4 4 9 4 14C77 46 72 42 66 41Q56 38 46 41C40 42 34 47 30 56Z', c, { shade: 'shD' }) +
        strand('M42 30l3 10M56 22l1 14M69 28l-3 11', .22) + shine('M37 26l-2-8 7 5z', .4),
      side: () => base('M29.500 57C27 37 39 21 56 21S85 37 82.500 57C81 49 77 44 70 42C62 39 50 38 42 41 C36 43 32 48 29.500 57Z', c) +
        strand('M42 33q9-5 22-3M44 38q10-4 22-2M56 22q-8 4-12 12', .22) + shine('M40 29q7-8 16-8-10 2-16 8z', .36),
      curly: () => base('M29 58C25 52 25 42 31 38 28 30 34 22 42 22 46 15 58 14 64 20 72 16 82 22 82 30 88 34 88 46 83 52 82 56 82 58 82.500 58 80 50 76 45 69 43 66 40 60 38 56 38S46 40 43 43C36 45 32 50 29 58Z', c) +
        curls([[40, 30], [53, 22], [66, 24], [74, 32], [34, 41], [79, 42], [48, 33], [62, 31]], 3.200) + shine('M38 26q6-6 14-5-9 1-14 5z', .36),
      pony: () => base('M30 56C28 37 40 22 56 22S84 37 82 56C79 47 74 43 68 41Q56 37 44 41C38 43 33 47 30 56Z', c) +
        S.R(68, 36, 8, 7, 2.500, '#ff6b9d', { sw: 1 }) + strand('M44 31q8-5 17-3M50 24q-5 5-7 11', .22) + shine('M40 29q6-7 15-7-9 2-15 7z', .38),
      bun: () => S.C(56, 14, 10, c, { shade: 'shR' }) + strand('M49 12q7 5 14 0M51 18q5 2 10 0', .26) + shine('M49 9q4-4 9-3-6 1-9 3z', .4) +
        base('M30 56C28 37 40 22 56 22S84 37 82 56C79 47 74 43 68 41Q56 37 44 41C38 43 33 47 30 56Z', c) + S.R(47, 20.500, 18, 4, 2, '#ff6b9d', { sw: 1 }) +
        strand('M44 31q8-5 17-3', .22) + shine('M40 29q6-7 15-7-9 2-15 7z', .38),
      long: () => base('M28.500 60C25 38 38 20 56 20S87 38 83.500 60L82 90Q80 96 76 94L73 66C72 52 66 43 56 42S40 52 39 66L36 94Q32 96 30 90Z', c) +
        strand('M50 22q-5 8-8 18M62 22q3 6 9 16', .2) + shine('M38 30q5-9 14-10-9 3-14 10z', .36),
      afro: () => base('M56 6C76 6 90 20 88 40C87 48 83 54 81 56 80 50 78 46 75 44 71 40 64 37 56 37S41 40 37 44C34 46 32 50 31 56 29 54 25 48 24 40 22 20 36 6 56 6Z', c, { shade: 'shR' }) +
        curls([[40, 20], [56, 12], [72, 20], [31, 36], [81, 36], [46, 28], [66, 28], [56, 22]], 3.400) + shine('M38 18q7-9 17-9-12 3-17 9z', .36),
      starlight: () => base('M30 56C28 37 40 22 56 22S84 37 82 56C79 47 74 43 68 41Q56 37 44 41C38 43 33 47 30 56Z', c) +
        strand('M44 31q8-5 17-3', .22) + shine('M40 29q6-7 15-7-9 2-15 7z', .42) +
        S.glint(41, 31, 3.600, '#fff', .95) + S.glint(71, 28, 3, '#fff', .9) + S.glint(56, 15, 3.800, '#fff', .95) + S.glint(70, 40, 2.400, '#ffe9a8', .9),
      messy: () => base('M29.500 57C26 40 34 24 48 22L46 14l9 6 6-8 4 9 9-3-1 10c7 4 11 14 9 24C80 48 76 43 70 41L66 46 62 40 56 47 50 40 46 45 42 41C36 43 32 48 29.500 57Z', c) +
        strand('M44 30l4 9M60 24l-1 10M70 30l-3 8', .24) + shine('M38 30q5-8 12-9-8 3-12 9z', .36),
      mohawk: () => base('M46 40C43 26 46 12 56 6 66 12 69 26 66 40Q56 36 46 40Z', c, { shade: 'shH' }) + strand('M51 14v22M56 10v26M61 14v22', .24) +
        base('M31 52C30 42 36 36 44 34 40 38 38 44 38 50 36 46 33 48 31 52ZM81 52C82 42 76 36 68 34 72 38 74 44 74 50 76 46 79 48 81 52Z', c, { sw: 1, shade: 'shV' }),
      pigtails: () => base('M30 56C28 37 40 22 56 22S84 37 82 56C79 47 74 43 68 41Q56 37 44 41C38 43 33 47 30 56Z', c) +
        S.R(26, 44, 8, 6, 2.500, '#ff6b9d', { sw: 1 }) + S.R(78, 44, 8, 6, 2.500, '#ff6b9d', { sw: 1 }) + strand('M44 31q8-5 17-3', .22) + shine('M40 29q6-7 15-7-9 2-15 7z', .38),
      braid: () => base('M29.500 58C27 37 39 21 56 21S85 37 82.500 58C80 48 76 43 70 41 62 38 50 38 42 41 36 43 32 48 29.500 58Z', c) +
        S.R(77, 40, 7, 5, 2, '#ff6b9d', { sw: 1 }) + strand('M42 33q9-5 22-3M56 22q-8 4-12 12', .22) + shine('M40 29q7-8 16-8-10 2-16 8z', .36),
      sidebraid: () => base('M29.500 58C27 37 39 21 56 21S85 37 82.500 58C80 48 76 43 70 41 62 38 50 38 42 41 36 43 32 48 29.500 58Z', c) +
        S.R(26, 52, 8, 5, 2, '#ff6b9d', { sw: 1 }) + strand('M42 33q9-5 22-3', .22) + shine('M40 29q7-8 16-8-10 2-16 8z', .36),
      twinbuns: () => S.C(37, 19, 8.600, c, { shade: 'shR' }) + S.C(75, 19, 8.600, c, { shade: 'shR' }) + strand('M31 17q6 4 12 0M69 17q6 4 12 0', .26) +
        base('M30 56C28 37 40 22 56 22S84 37 82 56C79 47 74 43 68 41Q56 37 44 41C38 43 33 47 30 56Z', c) + S.R(29, 24, 16, 3.600, 1.800, '#ff6b9d', { sw: 1 }) + S.R(67, 24, 16, 3.600, 1.800, '#ff6b9d', { sw: 1 }) + shine('M44 29q6-7 15-7-9 2-15 7z', .38),
      quiff: () => base('M29.500 57C26 40 33 24 46 18 52 10 70 10 76 20 84 28 84 44 82.500 57C81 49 77 44 70 42 62 39 50 41 42 43 36 45 32 50 29.500 57Z', c) +
        strand('M44 24q8-6 20-4M40 32q12-6 28-2M50 18q10-3 20 2', .24) + shine('M44 20q8-8 20-6-12 0-20 6z', .4),
      wavy: () => base('M28.500 62C25 38 38 20 56 20S87 38 83.500 62C82 52 78 46 72 43 66 40 60 38 56 38 52 38 46 40 40 43 34 46 30 52 28.500 62Z', c) +
        strand('M44 28q4-5 9-3M60 24q6 0 10 5M36 40q3-3 6-1', .22) + shine('M38 30q5-9 14-10-9 3-14 10z', .36),
      shaggy: () => base('M28.500 60C25 38 37 20 56 20S87 38 83.500 60C82 54 79 49 74 47L70 52 66 45 60 51 55 43 50 51 45 45 41 52 38 47C33 49 30 54 28.500 60Z', c) +
        strand('M44 30l3 8M58 24l-1 10M70 30l-3 8', .24) + shine('M38 30q5-9 14-10-9 3-14 10z', .36),
      pixie: () => base('M29.500 57C26 38 38 21 56 21S86 38 82.500 57C81 51 78 47 74 45 70 43 62 43 56 40 50 43 44 44 38 46 33 48 31 52 29.500 57Z', c) +
        strand('M44 30l2 8M64 26l-2 9M72 32l-3 7', .24) + shine('M40 29q6-7 15-7-9 2-15 7z', .4),
      slick: () => base('M29.500 54C27 36 40 22 56 22S85 36 82.500 54C81 46 78 42 73 39 62 33 50 33 39 39 34 42 31 46 29.500 54Z', c, { shade: 'shD' }) +
        strand('M38 36q18-9 38 0M36 31q20-10 42 0M42 26q14-5 28 0', .26) + shine('M40 29q8-7 18-6-12 0-18 6z', .45),
      curtains: () => base('M29.500 58C27 38 39 21 56 21S85 38 82.500 58C80 50 75 46 68 44 62 42 58 41 56 38 54 41 50 42 44 44 37 46 32 50 29.500 58Z', c) +
        strand('M44 28q4 4 8 8M68 28q-4 4-8 8M40 40q8-3 14-4', .24) + shine('M38 30q5-9 14-10-9 3-14 10z', .36),
      topknot: () => S.C(56, 12, 7.400, c, { shade: 'shR' }) + S.R(50, 17, 12, 4, 2, '#e0443c', { sw: 1 }) + strand('M50 10q6 4 12 0', .26) +
        base('M30 54C28 37 40 24 56 24S84 37 82 54C80 46 76 42 70 40Q56 35 42 40C36 42 32 46 30 54Z', c) + shine('M40 31q6-6 15-6-9 2-15 6z', .38),
      wolf: () => base('M28.500 60C25 38 37 20 56 20S87 38 83.500 60C82 52 79 47 75 45L72 52 66 42 60 50 56 40 52 50 46 42 40 52 37 45C33 47 30 52 28.500 60Z', c) +
        strand('M44 28l4 9M60 24l-1 9M70 30l-4 8', .24) + shine('M38 30q5-9 14-10-9 3-14 10z', .36),
      locs: () => base('M29.500 58C27 38 39 21 56 21S85 38 82.500 58C80 50 75 46 68 44 62 42 58 41 56 38 54 41 50 42 44 44 37 46 32 50 29.500 58Z', c) +
        strand('M44 28q4 4 8 8M68 28q-4 4-8 8', .24) + shine('M38 30q5-9 14-10-9 3-14 10z', .36),
      flame: () => base('M30 56C28 40 36 28 44 26 40 18 46 8 52 4 52 12 58 14 60 20 62 12 68 8 74 8 70 16 78 20 76 28 82 34 84 46 82 56 79 47 74 43 68 41Q56 37 44 41C38 43 33 47 30 56Z', c, { shade: 'shV' }) +
        strand('M50 14q-2 8 2 14M64 18q2 6-2 12', .3) + shine('M40 31q6-7 15-7-9 2-15 7z', .45),
      crystal: () => base('M30 56C28 40 34 30 40 26L34 10 46 20 50 2 58 18 66 4 70 20 82 12 74 28C80 34 84 44 82 56 79 47 74 43 68 41Q56 37 44 41C38 43 33 47 30 56Z', c, { shade: 'shD' }) +
        strand('M46 20l-2 14M58 18v16M70 20l-4 14', .3) + S.glint(48, 28, 3, '#fff', .9) + S.glint(66, 26, 2.600, '#fff', .85) + shine('M38 31l-3-14 8 9z', .5),
    };
    return (D[style] || D.buzz)();
  };

  /* ----------------------------------------------------------- colour chip */
  /* A round colour chip (hair colour, eye colour) — an SVG so gradient colours like Stardust work. */
  S.swatch = function (it) {
    const iris = it.slot === 'eyeColor';
    return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="${it.colour}" stroke="${LINE}" stroke-width="1.600"/>` +
      `<circle cx="32" cy="32" r="22" fill="url(#shR)"/>` +
      (iris ? `<circle cx="32" cy="33" r="9" fill="${DARK}"/><circle cx="37" cy="27" r="4" fill="#fff"/><circle cx="26.500" cy="38.500" r="2" fill="#fff" opacity=".8"/>`
        : S.hl('M18 24q4-9 14-10-9 3-14 10z', .55)) + '</svg>';
  };

  S.starfield = () => [[10, 18], [98, 30], [18, 96], [100, 118], [12, 160], [92, 176], [60, 8], [104, 70]].map((p, i) => S.dot(p[0], p[1], i % 2 ? .9 : 1.300, '#fff', .42)).join('');
})();
