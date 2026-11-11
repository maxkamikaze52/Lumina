/* Astrolab — shop art, part 1: shared toolkit + the character's body, hair, face and clothes.
   Everything is SVG generated from item data. House style: soft dark outlines, light from the
   top-left, gradient shading laid over each flat colour so any item colour still looks lit. */
(function () {
  'use strict';
  const S = {};
  window.ART = S;

  S.item = (id) => ((window.App && App.state && App.state.catalogue.items) || [])
    .find((i) => i.id === id);

  /* ------------------------------------------------------------------ toolkit */
  const LINE = 'rgba(30,22,56,.6)';
  const DARK = '#1d1a33';
  S.LINE = LINE;

  // an outlined shape with a soft shading overlay on top of its flat colour
  S.sh = function (tag, attrs, fill, o) {
    o = o || {};
    const stroke = o.line === false ? '' :
      ` stroke="${o.line || LINE}" stroke-width="${o.sw == null ? 1.3 : o.sw}" stroke-linejoin="round" stroke-linecap="round"`;
    const base = `<${tag} ${attrs} fill="${fill}"${stroke}${o.op ? ` opacity="${o.op}"` : ''}/>`;
    return o.shade === false ? base : base + `<${tag} ${attrs} fill="url(#${o.shade || 'shV'})"/>`;
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

  /* one hidden <svg> holds every gradient the art refers to (shared by all items on the page) */
  const stop = (o, c, a) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`;
  const DEFS = `<svg id="art-defs" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>
    <linearGradient id="shV" x1="0" y1="0" x2="0" y2="1">${stop(0, '#fff', .34)}${stop(.45, '#fff', 0)}${stop(1, '#000', .3)}</linearGradient>
    <linearGradient id="shD" x1="0" y1="0" x2="1" y2="1">${stop(0, '#fff', .4)}${stop(.5, '#fff', 0)}${stop(1, '#000', .32)}</linearGradient>
    <linearGradient id="shH" x1="0" y1="0" x2="1" y2="0">${stop(0, '#000', .28)}${stop(.28, '#fff', .2)}${stop(.6, '#fff', 0)}${stop(1, '#000', .32)}</linearGradient>
    <radialGradient id="shR" cx=".34" cy=".3" r=".9">${stop(0, '#fff', .55)}${stop(.4, '#fff', 0)}${stop(1, '#000', .34)}</radialGradient>
    <linearGradient id="shUp" x1="0" y1="0" x2="0" y2="1">${stop(0, '#000', .34)}${stop(.7, '#000', 0)}</linearGradient>
    <radialGradient id="shGlow">${stop(0, '#fff', .9)}${stop(.4, '#fff', .25)}${stop(1, '#fff', 0)}</radialGradient>
    <linearGradient id="avBg" x1="0" y1="0" x2="0" y2="1">${stop(0, '#2c3766')}${stop(1, '#141a33')}</linearGradient>
    <radialGradient id="avSpot" cx=".5" cy=".42" r=".6">${stop(0, '#9fc4ff', .26)}${stop(1, '#9fc4ff', 0)}</radialGradient>
    <linearGradient id="hairStar" x1="0" y1="0" x2="1" y2="1">${stop(0, '#ffd166')}${stop(.35, '#ff6f91')}${stop(.7, '#9a86e0')}${stop(1, '#6fd8ff')}</linearGradient>
    <linearGradient id="wingGold" x1="0" y1="0" x2="0" y2="1">${stop(0, '#fff3c4')}${stop(.5, '#ffd166')}${stop(1, '#e0932b')}</linearGradient>
    <radialGradient id="petGlow">${stop(0, '#fffbe0')}${stop(.45, '#ffe08a')}${stop(1, '#ff9d5c')}</radialGradient>
    <linearGradient id="artSun" x1="0" y1="0" x2="0" y2="1">${stop(0, '#6a4c93')}${stop(.55, '#ff7a8a')}${stop(1, '#ffd27a')}</linearGradient>
    <linearGradient id="artWave" x1="0" y1="0" x2="0" y2="1">${stop(0, '#bff0ff')}${stop(.5, '#4fb0e8')}${stop(1, '#1f4f9a')}</linearGradient>
  </defs></svg>`;
  S.DEFS = DEFS;
  (function inject() {
    if (typeof document === 'undefined') return;
    const add = () => { if (!document.getElementById('art-defs')) document.body.insertAdjacentHTML('afterbegin', DEFS); };
    if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
  })();

  /* ------------------------------------------------------------------- body */
  // One shared skin tone: players choose clothes and hair, not skin (keeps the wardrobe simple).
  const SKIN = '#f0c298', SKIN_D = '#d99a72';
  S.SKIN = SKIN;

  S.legs = () =>
    S.P('M38 156h17v44q0 3-3 3H41q-3 0-3-3z', SKIN, { shade: 'shH' }) +
    S.P('M57 156h17v44q0 3-3 3H60q-3 0-3-3z', SKIN, { shade: 'shH' });

  S.arms = () => {
    const one = S.P('M39 95C31 97 27 108 27 121l-1 24q0 5 4.5 5h5q4.5 0 4.5-5l1-26z', SKIN, { shade: 'shH' }) +
      S.C(33.4, 150, 5.6, SKIN, { shade: 'shR' }) + S.hl('M30.6 148q1.4-3 4-3.4-2.6 1-4 3.4z', .5);
    return one + S.mirror(one);
  };

  S.neck = () => S.P('M49.5 80h13v17q-6.5 6-13 0z', SKIN, { shade: 'shH' }) + S.dk('M49.5 88q6.5 6 13 0v-3q-6.5 5-13 0z', .2);

  S.head = function () {
    const face = 'M30.5 55c0-15 11-26.5 25.5-26.5S81.5 40 81.5 55c0 15-10.5 28-25.5 28S30.5 70 30.5 55z';
    return S.E(31, 58, 4.6, 5.8, SKIN, { shade: 'shH' }) + S.E(81, 58, 4.6, 5.8, SKIN, { shade: 'shH' }) +
      `<ellipse cx="31.6" cy="58.4" rx="1.8" ry="3" fill="${SKIN_D}" opacity=".7"/><ellipse cx="80.4" cy="58.4" rx="1.8" ry="3" fill="${SKIN_D}" opacity=".7"/>` +
      S.P(face, SKIN, { shade: 'shR' }) +
      `<ellipse cx="41.5" cy="69.5" rx="5.2" ry="3" fill="#ff7f86" opacity=".3"/><ellipse cx="70.5" cy="69.5" rx="5.2" ry="3" fill="#ff7f86" opacity=".3"/>` +
      S.ln('M54.6 67.2q1.4 2.1 2.9 0', '#b9774f', 1.3, .75);
  };

  /* ------------------------------------------------------------------- eyes */
  S.eyes = function (style, c) {
    c = c || '#2a2b4a';
    const X = [49, 63];
    const each = (fn) => X.map(fn).join('');
    const brows = S.ln('M43.5 55q5.5-3.2 10.5-.6', '#3a2a24', 1.9, .6) + S.ln('M58 54.4q5-2.6 10.5.6', '#3a2a24', 1.9, .6);
    const iris = (x, y, r) => S.C(x, y, r, c, { line: false, shade: 'shR' }) +
      `<circle cx="${x}" cy="${y + .3}" r="${(r * .5).toFixed(2)}" fill="${DARK}"/>`;
    const shine = (x, y) => `<circle cx="${x + 1.5}" cy="${y - 1.9}" r="1.3" fill="#fff"/><circle cx="${x - 1.4}" cy="${y + 1.9}" r=".7" fill="#fff" opacity=".8"/>`;
    const M = {
      happy: () => each((x) => S.ln(`M${x - 5.2} 63.4q5.2-7.4 10.4 0`, DARK, 2.7) + S.ln(`M${x + 4.4} 60.2l1.9-1.6`, DARK, 1.3)),
      wide: () => each((x) => S.E(x, 62, 6.2, 6.8, '#fff', { sw: 1.1, shade: 'shV' }) + iris(x, 62.6, 3.6) + shine(x, 62.6)),
      sleepy: () => each((x) => `<path d="M${x - 5} 62.4a5 5 0 0010 0z" fill="#fff" stroke="${LINE}" stroke-width="1"/>` +
        `<path d="M${x - 3.4} 62.4a3.4 3.4 0 006.8 0z" fill="${c}"/>` + S.ln(`M${x - 5.8} 62.4h11.6`, DARK, 2.5) + S.ln(`M${x + 5} 62.6l1.8 1.4`, DARK, 1.2)),
      sparkle: () => each((x) => S.E(x, 62, 5.4, 6.2, c, { sw: 1.1, shade: 'shR' }) +
        `<ellipse cx="${x}" cy="62.6" rx="2.6" ry="3.4" fill="${DARK}"/><circle cx="${x + 1.9}" cy="60" r="2" fill="#fff"/><circle cx="${x - 1.8}" cy="64.4" r="1" fill="#fff"/>` +
        S.ln(`M${x - 5.8} 60.4q5.8-6.4 11.6 0`, DARK, 1.6) + S.glint(x + 7, 56.4, 2.2, '#fff', .9)),
      star: () => each((x) => `<path d="${S.star(x, 62, 6.6, 2.8)}" fill="${c}" stroke="${LINE}" stroke-width="1" stroke-linejoin="round"/>` +
        `<path d="${S.star(x, 62, 6.6, 2.8)}" fill="url(#shD)"/><circle cx="${x - 1.2}" cy="60.6" r="1.1" fill="#fff" opacity=".9"/>`)
    };
    const fn = M[style] || (() => each((x) => S.E(x, 62.4, 5.4, 5.9, '#fff', { sw: 1.1, shade: 'shV' }) + iris(x, 62.8, 3.7) + shine(x, 62.8) +
      S.ln(`M${x - 5.8} 61q5.8-6 11.6 0`, DARK, 1.7)));
    return brows + fn();
  };

  /* ------------------------------------------------------------------ mouth */
  S.mouth = function (style) {
    const M = {
      grin: () => `<path d="M48.4 72.4q7.6 11.4 15.2 0z" fill="#7d2b3a" stroke="#4a1a26" stroke-width="1.4" stroke-linejoin="round"/>` +
        `<path d="M49.4 73.2h13.2q-1.2 3-6.6 3.2-5.4-.2-6.6-3.2z" fill="#fff"/><ellipse cx="56" cy="78.6" rx="4" ry="2" fill="#ff7a8a"/>`,
      neutral: () => S.ln('M51 75.6q5 1.2 10 0', '#8a3a42', 2.3),
      smirk: () => S.ln('M50 74.6q6.4 3.8 13.2-2.6', '#8a3a42', 2.5) + S.ln('M63.6 71.4l1.2-1', '#8a3a42', 1.3),
      o: () => '<ellipse cx="56" cy="76" rx="3.8" ry="4.8" fill="#7d2b3a" stroke="#4a1a26" stroke-width="1.3"/><ellipse cx="56" cy="78" rx="2.2" ry="1.7" fill="#ff7a8a"/>',
      cat: () => S.ln('M49.4 72.6q3.3 5.4 6.6 0q3.3 5.4 6.6 0', '#8a3a42', 2.2) + '<path d="M54.6 69.6h2.8l-1.4 1.8z" fill="#ff8fa3"/>'
    };
    return (M[style] || (() => S.ln('M49.6 73.4q6.4 7 12.8 0', '#8a3a42', 2.5) + S.ln('M48.4 72.6l1.2 1M63.6 72.6l-1.2 1', '#8a3a42', 1.2, .8)))();
  };

  /* ------------------------------------------------------------------- hair */
  S.hair = function (style, c) {
    c = c || '#3b2a20';
    const base = (d) => S.P(d, c, { shade: 'shD', sw: 1.3 });
    const strand = (d, op) => S.ln(d, '#000', 1.1, op == null ? .2 : op);
    const D = {
      buzz: () => base('M35 43c0-13 8-21.500 21-21.500S77 30 77 43c-3-6-9-9.500-21-9.500S38 37 35 43z') +
        S.hl('M41 34c4-7.500 11-10.500 18-11-8 1.500-14 5.500-18 11z', .32) +
        [[44, 30], [50, 27], [58, 26], [65, 28], [70, 32], [47, 34], [62, 31]].map((p) => S.dot(p[0], p[1], .7, '#000', .22)).join(''),
      bob: () => base('M33 44c0-15 9-24.500 23-24.500S79 29 79 44c0 8-3 15-5 18l-4-22c-8 5-20 5-28 0l-4 22c-2-3-5-10-5-18z') +
        strand('M50 22q-5 8-9 17') + strand('M62 22q3 6 8 15') + strand('M44 40q6 3 12 1') +
        S.hl('M40 30q4-8 12-9-7 3-12 9z', .34) + S.dk('M34 50q1 8 5 12l-1-14z', .12),
      spiky: () => base('M34 44c0-7 2-13 6-17l-3-13 11 7 4-13 6 11 8-10 1 15 8-5-3 15c3 3 3 7 3 10l-6-8-3 9-4-10-4 10-4-10-4 10-4-9z') +
        strand('M44 30l3 9') + strand('M58 26l2 9') + strand('M68 30l-2 8') + S.hl('M40 27l-1-8 6 4z', .4),
      side: () => base('M34 43c0-14 9-22.500 22-22.500S78 29 78 43c-6-4-14-5.500-23-3-6 1.500-12 1.500-21 3z') +
        strand('M44 36q8-3 18-4') + strand('M42 29q10-6 22-4') + strand('M52 22q-6 5-8 10') + S.hl('M42 27q6-6 14-6-9 2-14 6z', .34),
      curly: () => base('M32.500 47c-4-5-3-12 2-15-2-6 2-12.500 8-12.500 3-5 11-6.500 15-2.500 5-3 12-1 14 4 6 0 10 6.500 8 12.500 4 3 5 10 1 15-2-4-5-6-8-6-3-4-8-6-14-6s-11 2-14 6c-4 0-7 2-12 6z') +
        [[40, 28], [52, 22], [64, 24], [72, 32], [36, 38], [76, 40]].map((p) => S.ln(`M${p[0] - 3} ${p[1]}q3-4 6 0`, '#000', 1.1, .22)).join('') +
        S.hl('M42 24q5-5 11-4-7 1-11 4z', .36),
      pony: () => S.P('M71 45c8 4 10 15 6 26-3 8-9 12-14 9 5-5 6-11 6-18z', c, { shade: 'shD' }) +
        base('M35 43c0-14 9-23 21-23s21 9 21 23c-5-5-12-7-21-7s-16 2-21 7z') +
        S.R(68.500, 40, 7, 6, 2, '#ff6b9d', { sw: 1 }) + strand('M73 52q3 8 0 16', .25) + strand('M44 30q8-4 16-2') + S.hl('M42 28q5-6 13-6-8 2-13 6z', .34),
      bun: () => S.C(56, 15.500, 9, c, { shade: 'shR' }) + strand('M50 14q6 4 12 0', .25) + strand('M52 19q4 2 8 0', .22) +
        base('M35 43c0-14 9-23 21-23s21 9 21 23c-5-5-12-7-21-7s-16 2-21 7z') + S.R(48, 20, 16, 3.5, 1.5, '#ff6b9d', { sw: 1 }) +
        strand('M45 30q8-4 16-2') + S.hl('M42 28q5-6 13-6-8 2-13 6z', .34),
      long: () => base('M31 52c0-20 10-32.500 25-32.500S81 32 81 52v34c-4 0-8-4-9-12l-3-30c-8 5-18 5-26 0l-3 30c-1 8-5 12-9 12z') +
        strand('M37 56q-1 14 -2 26') + strand('M75 56q1 14 2 26') + strand('M48 24q-5 8-8 18') + strand('M62 24q4 7 9 16') + S.hl('M40 30q5-8 14-9-9 3-14 9z', .34),
      afro: () => base('M56 8c17 0 28 12 26 28-1 9-6 14-9 14-1-6-3-10-5-12-3-9-7-12-12-12s-9 3-12 12c-2 2-4 6-5 12-3 0-8-5-9-14C28 20 39 8 56 8z') +
        [[40, 22], [56, 14], [72, 22], [34, 36], [78, 36], [48, 28], [64, 28]].map((p) => S.ln(`M${p[0] - 3} ${p[1]}q3-4 6 0`, '#000', 1.1, .22)).join('') +
        S.hl('M38 20q6-8 16-9-11 3-16 9z', .36),
      starlight: () => base('M35 43c0-14 9-23 21-23s21 9 21 23c-5-5-12-7-21-7s-16 2-21 7z') +
        strand('M44 30q8-4 16-2') + S.hl('M42 28q5-6 13-6-8 2-13 6z', .4) +
        S.glint(41, 30, 3.4, '#fff', .95) + S.glint(71, 27, 2.8, '#fff', .9) + S.glint(56, 13, 3.6, '#fff', .95) + S.glint(69, 38, 2.4, '#ffe9a8', .9)
    };
    return (D[style] || D.buzz)();
  };

  /* ---------------------------------------------------------------- clothes */
  // sleeves are drawn with the top; the matching arms/hands are drawn underneath
  const SL_LONG = 'M39 95C31 97 27 108 27 121l-1 21h16l1-23z';
  const SL_SHORT = 'M39 95C32 96.500 27.500 102 27 110v9l15.500 1z';
  const sleeves = (c, long, cuff) => {
    const one = S.P(long ? SL_LONG : SL_SHORT, c, { shade: 'shH' }) +
      (long ? S.ln('M30 108q-1 12 0 24', '#000', 1.2, .14) : S.ln('M30 108q0 5 1 9', '#000', 1.1, .14)) +
      (long && cuff ? S.P('M26.2 136.500h15.800l.3 5.500H26z', c, { shade: 'shH' }) + S.dk('M26.2 136.500h15.800l.3 5.500H26z', .24) +
        S.ln('M28 139h12', '#fff', 1, .25) : '');
    return one + S.mirror(one);
  };
  const TORSO = 'M36 109c0-12 5-18 13-21l7-3 7 3c8 3 13 9 13 21l-1 55H37z';
  S.TORSO = TORSO;
  const torso = (c, o) => S.P(TORSO, c, o || { shade: 'shH' }) + S.hl('M40 104q2-9 8-12-5 5-5 14z', .3) + S.dk('M70 100q4 8 3 40l3-1q1-30-6-39z', .1);

  S.top = function (style, c) {
    c = c || '#f4f0e6';
    const rib = (d) => S.ln(d, '#000', 2.4, .22);
    const M = {
      hoodie: () => S.P('M44 88q-4 9 1 14l11 5 11-5q5-5 1-14-5 7-12 7t-12-7z', c, { shade: 'shV' }) + S.dk('M44 88q-4 9 1 14l11 5 11-5q5-5 1-14-5 7-12 7t-12-7z', .22) +
        torso(c) + S.P('M47 90q9 9 18 0v7q-9 7-18 0z', c, { shade: 'shV' }) + S.dk('M47 90q9 9 18 0v7q-9 7-18 0z', .22) +
        S.ln('M52 97v16M60 97v16', '#fff', 1.6, .9) + S.dot(52, 114, 1.3, '#fff') + S.dot(60, 114, 1.3, '#fff') +
        S.P('M42 130h28l3 17H39z', c, { shade: 'shV' }) + S.dk('M42 130h28l3 17H39z', .18) + S.ln('M44 131l-3 15M68 131l3 15', '#000', 1, .2) +
        S.R(37, 158, 38, 7, 2.500, c, { shade: 'shV' }) + S.dk('M37 158h38v7H37z', .22) + sleeves(c, true, true),
      jacket: () => torso(c) + S.ln('M56 90v74', '#000', 1.6, .5) + S.ln('M57.5 92v72', '#fff', 1, .25) +
        S.P('M47 88l9 13-3 5-10-8z', c, { shade: 'shD' }) + S.P('M65 88l-9 13 3 5 10-8z', c, { shade: 'shD' }) +
        S.dk('M47 88l9 13-3 5-10-8z', .2) + S.dk('M65 88l-9 13 3 5 10-8z', .2) +
        S.ln('M40 130h8M64 130h8', '#000', 1.3, .35) + S.R(54.500, 108, 3, 5, 1, '#ffd166', { sw: .8 }) +
        S.R(37, 158, 38, 6, 2, c, { shade: 'shV' }) + S.dk('M37 158h38v6H37z', .22) +
        S.ln('M44 96l-4 36M68 96l4 36', '#fff', 1.6, .16) + sleeves(c, true, true),
      shirt: () => torso(c) + S.P('M50 86l6 9 6-9-3-2h-6z', '#fff', { shade: 'shV' }) +
        S.P('M44 90l5 -3 7 10-7 7-6-7z', c, { shade: 'shD' }) + S.P('M68 90l-5-3-7 10 7 7 6-7z', c, { shade: 'shD' }) +
        S.ln('M56 97v67', '#000', 1.2, .25) + [104, 116, 128, 140, 152].map((y) => S.C(56, y, 1.5, '#fff', { sw: .7, shade: false })).join('') +
        S.R(60, 114, 10, 10, 1.500, c, { shade: 'shV', sw: 1 }) + S.ln('M60 117h10', '#000', 1, .2) + sleeves(c, true, true) +
        S.dot(34, 138.5, 1.3, '#fff') + S.dot(78, 138.5, 1.3, '#fff'),
      jumper: () => torso(c) + [0, 1, 2, 3, 4, 5, 6].map((i) => S.ln(`M${40 + i * 5} 118v28`, '#000', 1.2, .13)).join('') +
        S.ln('M37 112q19 6 38 0', '#fff', 2.4, .22) + S.ln('M37 119q19 6 38 0', '#fff', 2.4, .22) + S.ln('M37 126q19 6 38 0', '#fff', 1.4, .18) +
        S.P('M48 87q8 9 16 0l2 3q-10 11-20 0z', c, { shade: 'shV' }) + S.dk('M48 87q8 9 16 0l2 3q-10 11-20 0z', .24) +
        S.R(37, 156, 38, 8, 3, c, { shade: 'shV' }) + S.dk('M37 156h38v8H37z', .2) +
        [0, 1, 2, 3, 4, 5, 6, 7].map((i) => S.ln(`M${40 + i * 4.5} 157v6`, '#000', 1, .2)).join('') + sleeves(c, true, true),
      spacesuit: () => torso(c) + S.P('M44 88q12 12 24 0v8q-12 9-24 0z', '#2e3a66', { shade: 'shV' }) +
        S.R(40, 104, 32, 18, 4, '#2e3a66', { shade: 'shV' }) + S.R(44, 108, 10, 6, 1.500, '#1a2140', { sw: .8 }) +
        S.dot(60, 111, 2.2, '#6ff0d0') + S.dot(66, 111, 2.2, '#ff7a5c') + S.dot(60, 117.500, 2.2, '#ffd166') + S.dot(66, 117.500, 2.2, '#8fb8ff') +
        S.P('M37 132h38v6H37z', '#2e3a66', { shade: 'shV' }) + S.R(52, 131, 8, 8, 2, '#ffd166', { sw: .9 }) +
        S.ln('M40 146h32M40 152h32', '#2e3a66', 2, .85) + S.ln('M38 124v36M74 124v36', '#ff9d3c', 2, .9) +
        S.R(37, 158, 38, 6, 2, '#2e3a66', { shade: 'shV' }) +
        sleeves(c, true, false) + S.P('M26.200 134h15.800l.3 8H26z', '#2e3a66', { shade: 'shH' }) + S.mirror(S.P('M26.200 134h15.800l.3 8H26z', '#2e3a66', { shade: 'shH' })) +
        S.ln('M27 121h14', '#ff9d3c', 2, .9) + S.mirror(S.ln('M27 121h14', '#ff9d3c', 2, .9))
    };
    return (M[style] || (() => torso(c) + S.P('M47 88q9 9 18 0l1 3q-10 11-20 0z', c, { shade: 'shV' }) + S.dk('M47 88q9 9 18 0l1 3q-10 11-20 0z', .26) +
      S.ln('M42 130q14 4 28 0', '#000', 1.2, .14) + S.ln('M44 118q4 6 2 12', '#000', 1.1, .1) + S.R(37, 158, 38, 6, 2, c, { shade: 'shV' }) + S.dk('M37 158h38v6H37z', .12) + sleeves(c, false)))();
    // (default = t-shirt)
  };

  S.bottom = function (style, c) {
    c = c || '#4a6fa5';
    const band = S.R(36, 156, 40, 6, 2, c, { shade: 'shV' }) + S.dk('M36 156h40v6H36z', .26);
    const M = {
      shorts: () => S.P('M37 159h38l-3 30H57.500l-1.500-15-1.500 15H40z', c, { shade: 'shH' }) + band +
        S.ln('M40 170q4 2 6 8', '#000', 1.2, .22) + S.ln('M72 170q-4 2-6 8', '#000', 1.2, .22) + S.ln('M41 183h14M57 183h14', '#000', 1.2, .22) +
        S.dk('M40 185h15l-.3 4H40z', .16) + S.dk('M57.500 185h14.500l-.700 4H57.500z', .16),
      skirt: () => S.P('M37 159h38l7 32H30z', c, { shade: 'shV' }) + band +
        [40, 46, 52, 58, 64, 70].map((x, i) => S.ln(`M${x} 163l${(i - 2.500) * 1.800} 26`, '#000', 1.2, .16)).join('') +
        S.hl('M38 164l-6 22 3-1 6-20z', .2) + S.ln('M31 187q25 5 50 0', '#fff', 1.2, .3),
      jeans: () => S.P('M37 159h38v43H57.500l-1.500-26-1.500 26H37z', c, { shade: 'shH' }) + band +
        S.ln('M56 162v14', '#000', 1.3, .35) + S.ln('M39 164q8 1 10 10', '#fff', 1.2, .35) + S.ln('M73 164q-8 1-10 10', '#fff', 1.2, .35) +
        S.dot(46, 165, 1, '#e8c47a') + S.dot(66, 165, 1, '#e8c47a') + S.ln('M37.500 168q1 14 1.500 30', '#fff', 1, .25) +
        S.dk('M37 195h16.500v7H37z', .2) + S.dk('M58.500 195H75v7H58.500z', .2) + S.ln('M40 190q5 2 10 0', '#000', 1.2, .22) + S.ln('M62 190q5 2 10 0', '#000', 1.2, .22)
    };
    return (M[style] || (() => S.P('M37 159h38v43H57.500l-1.500-26-1.500 26H37z', c, { shade: 'shH' }) + band +
      S.ln('M56 162v14', '#000', 1.2, .3) + S.ln('M45 165v33', '#000', 1.1, .13) + S.ln('M67 165v33', '#000', 1.1, .13) +
      S.ln('M39 166h6M67 166h6', '#000', 1.2, .25) + S.dk('M37 196h16.500v6H37z', .18) + S.dk('M58.500 196H75v6H58.500z', .18)))();
  };

  S.shoes = function (style, c) {
    c = c || '#f4f0e6';
    const L = {
      boots: () => S.P('M37 186h15v17h2q5 1 5 6v3H32.500q-3 0-3-3.500 0-4 4-5l3-1z', c, { shade: 'shH' }) +
        S.P('M37 186h15v6H37z', c, { shade: 'shV' }) + S.dk('M37 186h15v6H37z', .22) + S.ln('M40 196h10M40 200h10', '#000', 1.2, .25) +
        S.P('M30 207h25.500v5H31q-1.500 0-1-5z', '#2a2530', { shade: 'shV' }),
      hi: () => S.P('M37.500 190h14.500v14h2q5 1 5 6v2H32.500q-3 0-3-3 0-4 4-5l3.500-1z', c, { shade: 'shH' }) +
        S.P('M30 205h24l1 1q3 .5 3.500 3.500v1.500H32.500q-3 0-3-2.500 0-2.500.5-3.500z', '#fff', { shade: 'shV', sw: 1.1 }) +
        S.dot(44.500, 193.500, 1.400, '#fff') + S.ln('M39 197l10 3M39 201l10 3', '#fff', 1.4, .9) + S.ln('M38 190h14', '#fff', 2.2, .9),
    };
    const left = (L[style] || (() => S.P('M38 195h14v9q6 1 6 6v2H33q-3 0-3-3 0-4 4-5l3-1z', c, { shade: 'shH' }) +
      S.P('M30 207h27q1 3 0 5H32q-3 0-2-5z', '#fff', { shade: 'shV', sw: 1.1 }) + S.ln('M39 198l9 3M39 202l9 3', '#fff', 1.3, .8) + S.hl('M33 205q3-2 8-1-5 0-8 1z', .5)))();
    return left + S.mirror(left);
  };

  /* -------------------------------------------------------------------- hats */
  S.hat = function (style, c) {
    c = c || '#ff7a5c';
    const M = {
      beanie: () => S.P('M36 41q1-21 20-21t20 21z', c, { shade: 'shD' }) +
        [41, 47, 53, 59, 65, 71].map((x) => S.ln(`M${x} 22.500v17`, '#000', 1.1, .14)).join('') +
        S.P('M33 38h46q1 7-1 8H34q-2-1-1-8z', c, { shade: 'shV' }) + S.dk('M33 38h46q1 7-1 8H34q-2-1-1-8z', .2) +
        [37, 42, 47, 52, 57, 62, 67, 72, 76].map((x) => S.ln(`M${x} 39v6`, '#000', 1, .2)).join('') +
        `<circle cx="56" cy="17" r="5.4" fill="#fff" stroke="${LINE}" stroke-width="1.1"/><circle cx="56" cy="17" r="5.4" fill="url(#shR)"/>` + S.dot(54, 15.500, 1, '#d8dcff'),
      cap: () => S.P('M36 40q1-20 20-20t20 20z', c, { shade: 'shD' }) + S.ln('M56 20.500v19M46 22q-3 8-3 17.500M66 22q3 8 3 17.500', '#000', 1.1, .2) +
        S.dot(56, 20.500, 1.7, c) + S.P('M33 39h34q8 0 11 6-6-2-12-2H33z', c, { shade: 'shV' }) + S.dk('M33 39h34q8 0 11 6-6-2-12-2H33z', .3) + S.hl('M42 25q5-4 10-4-6 1-10 4z', .4),
      bucket: () => S.P('M40 37q1-15 16-15t16 15z', c, { shade: 'shD' }) +
        S.P('M32 37h48q2 6-2 8l-8-3H42l-8 3q-4-2-2-8z', c, { shade: 'shV' }) + S.dk('M32 37h48q2 6-2 8l-8-3H42l-8 3q-4-2-2-8z', .15) +
        S.R(40, 33, 32, 4, 1.500, c, { shade: 'shV', sw: 1 }) + S.dk('M40 33h32v4H40z', .22) + S.ln('M36 41q20 5 40 0', '#fff', 1, .4) + S.hl('M44 26q4-3 9-3-5 1-9 3z', .4),
      grad: () => S.P('M40 33q16-5 32 0v11q-16 5-32 0z', c, { shade: 'shV' }) + S.dk('M40 38q16 5 32 0v6q-16 5-32 0z', .2) +
        S.P('M24 31l32-11 32 11-32 12z', c, { shade: 'shD' }) + S.ln('M24 31l32 12 32-12', '#000', 1, .2) + S.dot(56, 31.500, 2, '#ffc247') +
        S.ln('M56 31.500l26 7v14', '#ffc247', 1.5) + S.P('M79 52h6l1.500 9h-9z', '#ffc247', { shade: 'shV', sw: 1 }) + S.hl('M30 31l22-8-14 9z', .35),
      top: () => S.P('M43 20h26l1 16H42z', c, { shade: 'shH' }) + S.P('M42 26.500h28v5H42z', '#c1443c', { shade: 'shV', sw: 1 }) +
        S.E(56, 20, 13, 3.200, c, { shade: 'shV', sw: 1.2 }) + S.E(56, 36.500, 23, 5, c, { shade: 'shV' }) + S.dk('M33 36.500a23 5 0 0046 0z', .25) + S.hl('M47 22l-1 12 2-12z', .45) + S.dot(66, 29, 1.300, '#ffd166'),
      crown: () => S.P('M34 38l3-17 10 9 9-15 9 15 10-9 3 17z', c, { shade: 'shD', line: '#7a4c00', sw: 1.4 }) +
        S.hl('M37 25l3 12 3-9z', .5) + S.R(34, 34, 44, 6, 2, c, { shade: 'shV', line: '#7a4c00', sw: 1.3 }) +
        S.dot(56, 27, 3, '#ff5c8a', .0) + `<circle cx="56" cy="29" r="3.100" fill="#ff5c8a" stroke="#7a4c00" stroke-width="1"/><circle cx="55" cy="28" r="1" fill="#fff" opacity=".8"/>` +
        `<circle cx="43" cy="30.500" r="2.200" fill="#6fb3ff" stroke="#7a4c00" stroke-width=".9"/><circle cx="69" cy="30.500" r="2.200" fill="#6fb3ff" stroke="#7a4c00" stroke-width=".9"/>` +
        S.glint(56, 13, 3, '#fff', .9) + S.dot(47, 21, 1.500, '#ffe29a') + S.dot(56, 14, 1.500, '#ffe29a') + S.dot(65, 21, 1.500, '#ffe29a'),
      helmet: () => S.P('M34 52q-3-32 22-32t22 32q-3 4-5 0-2-3-5-3H44q-3 0-5 3-2 4-5 0z', c, { shade: 'shR' }) +
        S.P('M40 36q16-7 32 0 2 8 0 12-16 6-32 0-2-4 0-12z', '#27325e', { shade: 'shV', sw: 1.2 }) + S.hl('M44 38q8-4 16-2-8 0-16 6z', .55) + S.hl('M62 44l8-5-3 7z', .3) +
        S.ln('M56 20.500v-8', LINE, 1.5) + S.dot(56, 11, 2.400, '#ff5c5c') + S.P('M30 48h6v10h-6z', '#9aa4c7', { shade: 'shH', sw: 1 }) + S.P('M76 48h6v10h-6z', '#9aa4c7', { shade: 'shH', sw: 1 }) + S.dot(33, 53, 1.300, '#6ff0d0') + S.dot(79, 53, 1.300, '#6ff0d0')
    };
    return (M[style] || (() => ''))();
  };

  /* ------------------------------------------------------------ accessories */
  S.accessory = function (style, c) {
    c = c || '#2a2f5a';
    const M = {
      glasses: () => `<g>${S.C(49, 62.500, 7.600, 'rgba(180,220,255,.22)', { line: c, sw: 2, shade: false })}${S.C(63, 62.500, 7.600, 'rgba(180,220,255,.22)', { line: c, sw: 2, shade: false })}</g>` +
        S.ln('M56.500 61q-.5-1.200 0 0M55.600 61.500q.8-1.200 1.800 0', c, 1.8) + S.ln('M41.400 61l-6-2M70.600 61l6-2', c, 1.8) + S.hl('M44 59q3-3 6-1-4 0-6 1z', .75) + S.hl('M58 59q3-3 6-1-4 0-6 1z', .75),
      sun: () => S.P('M40.500 57h16q1 9-3 11-4 2-9 0-4-3-4-11z', c, { shade: 'shV', sw: 1.2 }) + S.P('M58.500 57h16q0 8-4 11-5 2-9 0-4-2-3-11z', c, { shade: 'shV', sw: 1.2 }) +
        S.ln('M56.500 58.500h2', c, 2.200) + S.ln('M40.500 58l-5-1.500M74.500 58l5-1.500', c, 1.800) + S.hl('M43 59.500l5 0-3 4z', .55) + S.hl('M61 59.500l5 0-3 4z', .55),
      scarf: () => S.P('M39 87q17 11 34 0l2 9q-19 11-38 0z', c, { shade: 'shV' }) + S.ln('M42 90q14 7 28 0', '#fff', 1.4, .35) +
        S.P('M66 94l9 24-9 3-6-22z', c, { shade: 'shH' }) + S.ln('M66 105l8 -2M64 112l8-2', '#fff', 1.5, .4) + S.ln('M68 120l7-2', '#000', 1.2, .0) +
        S.ln('M63 120.500v4M67 119.500v4M71 118.500v4', c, 1.600),
      headphones: () => S.ln('M35 60a21 21 0 0142 0', c, 5.500) + S.ln('M35 60a21 21 0 0142 0', '#fff', 1.4, .35) +
        S.R(29, 55, 10, 19, 5, c, { shade: 'shH' }) + S.R(73, 55, 10, 19, 5, c, { shade: 'shH' }) +
        S.R(31.500, 58, 5, 13, 2.500, '#000', { shade: false, line: false, op: .22 }) + S.R(75.500, 58, 5, 13, 2.500, '#000', { shade: false, line: false, op: .22 }) +
        S.hl('M30.500 58q1-3 3-3.500-2 2-2 6z', .5) + S.hl('M74.500 58q1-3 3-3.500-2 2-2 6z', .5),
      bow: () => S.P('M52 91l-14-8q-3 8 0 16z', c, { shade: 'shV' }) + S.P('M60 91l14-8q3 8 0 16z', c, { shade: 'shV' }) +
        S.ln('M46 89l-6-3M46 94l-6 3M66 89l6-3M66 94l6 3', '#000', 1, .22) + S.R(52, 87, 8, 9, 3, c, { shade: 'shD' }) + S.hl('M53.500 88.500h3l-2 3z', .5),
      cape: () => S.P('M38 98q18-9 36 0l13 80H25z', c, { shade: 'shV' }) + S.dk('M38 98q18-9 36 0l-2 6q-16-6-32 0z', .0) +
        S.P('M30 174q26 9 52 0l5 4H25z', c, { shade: 'shV', line: false }) + S.ln('M45 108l-9 66M56 106v70M67 108l9 66', '#000', 1.3, .17) +
        S.ln('M26 177q30 8 60 0', '#fff', 1.4, .3) + S.hl('M38 102q-6 28-8 56l3-1q2-28 8-52z', .22),
      wings: () => {
        const w = S.P('M36 112q-22-26-34-8 8 4 10 12-8 2-10 12 8 4 12 2-4 8 2 12 6-2 8-10 4 6 8 4z', c, { shade: 'shV' }) +
          S.ln('M30 112q-14-2-22 -2M30 118q-12 2-18 6M32 124q-8 4-12 10', '#000', 1.2, .18) + S.hl('M28 106q-10-6-20 -2 12-2 20 2z', .5);
        return w + S.mirror(w);
      }
    };
    return (M[style] || (() => ''))();
  };

  /* ------------------------------------------------------------ back items */
  S.back = function (style, c) {
    c = c || '#e07a5f';
    const M = {
      pack: () => S.P('M33 100q0-8 8-8h30q8 0 8 8v46q0 6-6 6H39q-6 0-6-6z', c, { shade: 'shH' }) +
        S.P('M40 114h32v26q0 3-3 3H43q-3 0-3-3z', c, { shade: 'shV' }) + S.dk('M40 114h32v26q0 3-3 3H43q-3 0-3-3z', .2) + S.ln('M40 120h32', '#000', 1.2, .25) + S.R(52, 124, 8, 5, 1.500, '#ffd166', { sw: .9 }),
      jetpack: () => {
        const tank = S.P('M25 102q0-10 8-10t8 10v38q0 6-8 6t-8-6z', c, { shade: 'shH' }) + S.R(25, 108, 16, 5, 1, '#5f6b96', { sw: 1 }) + S.R(25, 126, 16, 4, 1, '#5f6b96', { sw: 1 }) +
          S.P('M27 148h12l-2 6H29z', '#4a5278', { shade: 'shV' }) + S.P('M29 154q4 22 8 0 2 6-4 14-6-8-4-14z', '#ffb020', { shade: false, line: false }) + S.P('M31 154q2 12 4 0-1 6-2 8-2-2-2-8z', '#fff6c2', { shade: false, line: false });
        return tank + S.mirror(tank) + S.R(40, 106, 32, 8, 3, '#5f6b96', { shade: 'shV', sw: 1 });
      },
      shell: () => S.P('M56 92q30 0 30 30t-30 36q-30-6-30-36t30-30z', c, { shade: 'shR' }) +
        S.ln('M56 96v60M36 112q20 8 40 0M34 128q22 10 44 0M40 144q16 8 32 0', '#fff', 1.6, .42) + S.hl('M40 104q6-9 16-10-12 3-16 10z', .45)
    };
    return (M[style] || (() => ''))();
  };

  // parts of a back item that sit in front of the body (straps)
  S.backFront = function (style) {
    if (style === 'pack') return S.ln('M42 96q-2 26 0 56', '#000', 3.600, .5) + S.ln('M70 96q2 26 0 56', '#000', 3.600, .5) + S.ln('M42 96q-2 26 0 56', '#fff', 1, .18) + S.ln('M70 96q2 26 0 56', '#fff', 1, .18);
    if (style === 'jetpack') return S.ln('M41 106q2 20 4 38M71 106q-2 20-4 38', '#2a3050', 3);
    if (style === 'shell') return S.ln('M41 98q2 20 0 44M71 98q-2 20 0 44', '#2a6e5c', 3);
    return '';
  };

  S.starfield = () => [[10, 18], [98, 30], [18, 96], [100, 118], [12, 160], [92, 176]].map((p, i) => S.dot(p[0], p[1], i % 2 ? .9 : 1.3, '#fff', .45)).join('');
})();
