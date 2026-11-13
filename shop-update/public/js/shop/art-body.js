/* Astrolab — shop art, part 3: worn gear — hats, face items, neckwear, back items and things held in a hand.
   (This file used to hold an unused body drawing; the body now lives in art-avatar.js.) */
(function () {
  'use strict';
  const S = window.ART;
  const LINE = S.LINE, P = S.P, R = S.R, E = S.E, C = S.C, ln = S.ln, hl = S.hl, dk = S.dk, dot = S.dot;
  const dark = (c, t) => S.darker(c, t), light = (c, t) => S.lighter(c, t);

  /* -------------------------------------------------------------------- hats */
  S.hat = function (style, c) {
    c = c || '#ff7a5c';
    const M = {
      beanie: () => P('M36 41q1-21 20-21t20 21z', c, { shade: 'shD' }) + [41, 47, 53, 59, 65, 71].map((x) => ln(`M${x} 22.500v17`, '#000', 1.100, .14)).join('') +
        P('M33 38h46q1 7-1 8H34q-2-1-1-8z', c, { shade: 'shV' }) + dk('M33 38h46q1 7-1 8H34q-2-1-1-8z', .2) + [37, 42, 47, 52, 57, 62, 67, 72, 76].map((x) => ln(`M${x} 39v6`, '#000', 1, .2)).join('') +
        C(56, 17, 5.400, '#fff', { shade: 'shR', sw: 1.100 }),
      cap: () => P('M36 40q1-20 20-20t20 20z', c, { shade: 'shD' }) + ln('M56 20.500v19M46 22q-3 8-3 17.500M66 22q3 8 3 17.500', '#000', 1.100, .2) + dot(56, 20.500, 1.700, c) +
        P('M33 39h34q8 0 11 6-6-2-12-2H33z', c, { shade: 'shV' }) + dk('M33 39h34q8 0 11 6-6-2-12-2H33z', .3) + hl('M42 25q5-4 10-4-6 1-10 4z', .4),
      bucket: () => P('M40 37q1-15 16-15t16 15z', c, { shade: 'shD' }) + P('M32 37h48q2 6-2 8l-8-3H42l-8 3q-4-2-2-8z', c, { shade: 'shV' }) + dk('M32 37h48q2 6-2 8l-8-3H42l-8 3q-4-2-2-8z', .15) +
        R(40, 33, 32, 4, 1.500, c, { shade: 'shV', sw: 1 }) + dk('M40 33h32v4H40z', .22) + hl('M44 26q4-3 9-3-5 1-9 3z', .4),
      grad: () => P('M40 33q16-5 32 0v11q-16 5-32 0z', c, { shade: 'shV' }) + dk('M40 38q16 5 32 0v6q-16 5-32 0z', .2) + P('M24 31l32-11 32 11-32 12z', c, { shade: 'shD' }) + dot(56, 31.500, 2, '#ffc247') +
        ln('M56 31.500l26 7v14', '#ffc247', 1.500) + P('M79 52h6l1.500 9h-9z', '#ffc247', { shade: 'shV', sw: 1 }),
      top: () => P('M43 20h26l1 16H42z', c, { shade: 'shH' }) + P('M42 26.500h28v5H42z', '#c1443c', { shade: 'shV', sw: 1 }) + E(56, 20, 13, 3.200, c, { shade: 'shV', sw: 1.200 }) +
        E(56, 36.500, 23, 5, c, { shade: 'shV' }) + dk('M33 36.500a23 5 0 0046 0z', .25) + hl('M47 22l-1 12 2-12z', .45),
      crown: () => P('M34 38l3-17 10 9 9-15 9 15 10-9 3 17z', c, { shade: 'shD', line: '#7a4c00', sw: 1.400 }) + hl('M37 25l3 12 3-9z', .5) + R(34, 34, 44, 6, 2, c, { shade: 'shV', line: '#7a4c00', sw: 1.300 }) +
        `<circle cx="56" cy="29" r="3.100" fill="#ff5c8a" stroke="#7a4c00" stroke-width="1"/><circle cx="43" cy="30.500" r="2.200" fill="#6fb3ff" stroke="#7a4c00" stroke-width=".9"/><circle cx="69" cy="30.500" r="2.200" fill="#6fb3ff" stroke="#7a4c00" stroke-width=".9"/>` +
        S.glint(56, 13, 3, '#fff', .9) + dot(47, 21, 1.500, '#ffe29a') + dot(56, 14, 1.500, '#ffe29a') + dot(65, 21, 1.500, '#ffe29a'),
      helmet: () => P('M34 52q-3-32 22-32t22 32q-3 4-5 0-2-3-5-3H44q-3 0-5 3-2 4-5 0z', c, { shade: 'shR' }) + P('M40 36q16-7 32 0 2 8 0 12-16 6-32 0-2-4 0-12z', '#27325e', { shade: 'shV', sw: 1.200 }) + hl('M44 38q8-4 16-2-8 0-16 6z', .55) +
        ln('M56 20.500v-8', LINE, 1.500) + dot(56, 11, 2.400, '#ff5c5c'),
      visor: () => `<ellipse cx="56" cy="50" rx="33" ry="34" fill="#fff" opacity=".1"/>` + P('M30 52Q28 16 56 16T82 52Q82 76 56 82 30 76 30 52Z', 'rgba(190,225,255,.18)', { shade: false, line: c, sw: 2.600 }) +
        hl('M38 30q6-9 18-10-14 3-18 10z', .6) + hl('M72 62q4-6 4-14-1 8-4 14z', .35) + R(28, 70, 56, 8, 4, c, { shade: 'shV', sw: 1.200 }) + dot(34, 74, 1.400, '#6ff0d0') + dot(78, 74, 1.400, '#ff7a5c'),
      beret: () => P('M32 40Q30 22 52 22T84 34Q86 44 70 42 52 38 32 40Z', c, { shade: 'shD' }) + dot(60, 21, 2.200, c) + ln('M40 28q6-4 14-4', '#fff', 1.200, .35) + dk('M36 40q20-3 44 0v2q-24-2-44 0z', .2),
      cowboy: () => P('M44 32Q44 18 56 18T68 32Z', c, { shade: 'shH' }) + P('M22 38Q30 30 44 34L68 34Q82 30 90 38Q80 48 56 44 32 48 22 38Z', c, { shade: 'shV' }) + R(44, 29, 24, 4, 1.400, '#c1443c', { shade: 'shV', sw: 1 }) + dk('M32 40q24 8 48 0v2q-24 8-48 0z', .18) + ln('M50 20q6 3 12 0', '#000', 1, .25),
      wizard: () => P('M30 42Q40 38 56 38T82 42Q72 46 56 46T30 42Z', c, { shade: 'shV' }) + P('M40 40Q42 24 52 14 60 2 74 -6 68 6 70 18 74 28 72 40Z', c, { shade: 'shD' }) + R(40, 34, 32, 4, 1.500, '#ffd166', { shade: 'shV', sw: 1 }) +
        `<path d="${S.star(55, 24, 3.600, 1.500)}" fill="#ffe29a"/><path d="${S.star(62, 14, 2.600, 1.100)}" fill="#ffe29a"/>`,
      pirate: () => P('M28 40Q34 18 56 16T84 40Q70 34 56 40 42 34 28 40Z', c, { shade: 'shD' }) + R(30, 36, 52, 5, 2, dark(c, .2), { shade: 'shV', sw: 1 }) + P('M56 22c-4 0-5 4-3 6l-3 3 3 1 3-2 3 2 3-1-3-3c2-2 1-6-3-6z', '#fff', { shade: false, sw: .8 }) + dot(55, 25.500, .8, '#222') + dot(57.500, 25.500, .8, '#222'),
      chef: () => P('M38 40V30Q30 28 32 22T44 14Q50 8 56 12 62 8 68 14 80 16 80 24T74 30V40Z', '#fff', { shade: 'shR' }) + R(38, 36, 36, 6, 2, '#eef2fb', { shade: 'shV', sw: 1 }) + ln('M46 20q-2 8 0 14M56 16v18M66 20q2 8 0 14', '#000', 1, .12),
      party: () => P('M42 40L56 2 70 40Z', c, { shade: 'shD' }) + [12, 22, 32].map((y, i) => ln(`M${50 - i * 1.500} ${y}l${12 + i * 3} -4`, '#fff', 2, .8)).join('') + C(56, 3, 3.600, '#ffd166', { shade: 'shR', sw: 1 }) + E(56, 40, 15, 2.800, dark(c, .2), { shade: 'shV', sw: 1 }),
      headband: () => P('M31 42Q56 28 81 42L81 47Q56 33 31 47Z', c, { shade: 'shV' }) + ln('M36 40q20-8 40 0', '#fff', 1, .4),
      bunny: () => P('M40 36Q28 6 38 4 48 4 50 34Z', c, { shade: 'shH' }) + P('M72 36Q84 6 74 4 64 4 62 34Z', c, { shade: 'shH' }) + P('M41 32Q35 12 39 9 44 10 46 31Z', '#ffb3c8', { shade: false, line: false }) + P('M71 32Q77 12 73 9 68 10 66 31Z', '#ffb3c8', { shade: false, line: false }) + ln('M33 40Q56 28 79 40', c, 5),
      cat: () => P('M34 40Q30 20 38 14L50 28Z', c, { shade: 'shD' }) + P('M78 40Q82 20 74 14L62 28Z', c, { shade: 'shD' }) + P('M37 34Q35 24 39 20L45 28Z', '#ffb3c1', { shade: false, line: false }) + P('M75 34Q77 24 73 20L67 28Z', '#ffb3c1', { shade: false, line: false }),
      horns: () => P('M38 36Q30 24 34 12 42 18 46 32Z', c, { shade: 'shD' }) + P('M74 36Q82 24 78 12 70 18 66 32Z', c, { shade: 'shD' }) + hl('M36 22q0-4 2-6', .6),
      halo: () => `<ellipse cx="56" cy="16" rx="17" ry="4.600" fill="none" stroke="${LINE}" stroke-width="5"/><ellipse cx="56" cy="16" rx="17" ry="4.600" fill="none" stroke="#ffe08a" stroke-width="3"/><ellipse cx="56" cy="15" rx="17" ry="4.600" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/>` + S.glint(40, 12, 2.400, '#fff', .9),
      flowers: () => ln('M33 40Q56 26 79 40', '#4f9d69', 4) + [[36, 38, '#ff7a9c'], [46, 33, '#ffd166'], [56, 31, '#fff'], [66, 33, '#a97bff'], [76, 38, '#ff7a9c']].map((f, i) => `<g transform="translate(${f[0]} ${f[1]})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-3.200" rx="2.200" ry="3.200" fill="${f[2]}" stroke="${LINE}" stroke-width=".6" transform="rotate(${a})"/>`).join('')}<circle r="1.700" fill="#ffc247"/></g>`).join(''),
      viking: () => P('M34 46Q30 18 56 16T78 46Q56 40 34 46Z', '#9aa4c7', { shade: 'shR' }) + R(32, 40, 48, 5, 2, '#6a4a2a', { shade: 'shV', sw: 1 }) + P('M32 40Q18 36 18 18 28 24 36 34Z', '#f4efe6', { shade: 'shD' }) + P('M80 40Q94 36 94 18 84 24 76 34Z', '#f4efe6', { shade: 'shD' }) + dot(56, 42, 1.800, '#ffd166'),
      hardhat: () => P('M34 40Q34 18 56 18T78 40Z', c, { shade: 'shR' }) + R(28, 38, 56, 6, 3, c, { shade: 'shV', sw: 1.200 }) + R(50, 14, 12, 8, 3, dark(c, .1), { shade: 'shV', sw: 1 }) + hl('M40 28q6-7 14-8-9 2-14 8z', .5),
      santa: () => P('M33 40Q30 14 56 14T80 22 92 44 76 40Z', c, { shade: 'shD' }) + R(31, 36, 50, 8, 4, '#fff', { shade: 'shV', sw: 1.100 }) + C(90, 44, 5, '#fff', { shade: 'shR', sw: 1 }),
      propeller: () => P('M36 41q1-21 20-21t20 21z', c, { shade: 'shD' }) + [0, 1, 2, 3].map((i) => P(`M${36 + i * 10} 21q5-6 10 0v20h-10z`, ['#ff5c5c', '#ffd166', '#3a9bff', '#2ec4a6'][i], { shade: 'shV', sw: .8, op: .95 })).join('').replace(/./g, (m) => m) +
        R(55, 12, 2, 8, 1, '#8a93b8', { sw: .8 }) + P('M40 12Q56 6 72 12Q56 16 40 12Z', '#ffd166', { shade: 'shV', sw: 1 }) + C(56, 12, 2, '#ff5c5c', { sw: .8 }),
      straw: () => E(56, 38, 31, 7, '#e8c878', { shade: 'shV' }) + P('M40 38Q40 22 56 22T72 38Z', '#e8c878', { shade: 'shH' }) + R(40, 31, 32, 4, 1.500, c, { shade: 'shV', sw: 1 }) + ln('M30 38q26 8 52 0', '#b8944a', 1, .6),
      headphones: () => ln('M35 58a21 21 0 0142 0', c, 5.500) + ln('M35 58a21 21 0 0142 0', '#fff', 1.400, .35) + R(29, 53, 10, 19, 5, c, { shade: 'shH' }) + R(73, 53, 10, 19, 5, c, { shade: 'shH' }) +
        R(31.500, 56, 5, 13, 2.500, '#000', { shade: false, line: false, op: .22 }) + R(75.500, 56, 5, 13, 2.500, '#000', { shade: false, line: false, op: .22 }) + hl('M30.500 56q1-3 3-3.500-2 2-2 6z', .5),
    };
    return (M[style] || (() => ''))();
  };

  /* --------------------------------------------------------------- face items */
  S.faceItem = function (style, c) {
    c = c || '#2a2f5a';
    const X = [48.600, 63.400];
    const M = {
      glasses: () => X.map((x) => C(x, 62.500, 7.600, 'rgba(180,220,255,.2)', { line: c, sw: 1.900, shade: false })).join('') + ln('M54.600 61.500q1.400-1.600 2.800 0', c, 1.700) + ln('M41 61l-8-2.500M71.800 61l8-2.500', c, 1.700) + hl('M43 59q3-3 6-1-4 0-6 1z', .75) + hl('M58 59q3-3 6-1-4 0-6 1z', .75),
      square: () => X.map((x) => R(x - 7, 56.500, 14, 11.500, 3, 'rgba(180,220,255,.2)', { line: c, sw: 1.900, shade: false })).join('') + ln('M55.600 60.500h.8', c, 1.700) + ln('M41.600 60l-8-1.500M70.400 60l8-1.500', c, 1.700) + hl('M43 59.500l4-.5-2 3z', .7),
      sun: () => P('M41 57h15.500q1 9-3 11-4 2-9 0-4-3-3.500-11z', c, { shade: 'shV', sw: 1.200 }) + P('M56.500 57H72q.5 8-3.500 11-5 2-9 0-4-2-3-11z', c, { shade: 'shV', sw: 1.200 }) + ln('M56 58.500h1', c, 2.200) + ln('M41 58.500l-8-1.500M72 58.500l8-1.500', c, 1.800) + hl('M43 59.500l5 0-3 4z', .5) + hl('M59 59.500l5 0-3 4z', .5),
      starshade: () => P(S.star(48.600, 62.500, 9.600, 4.400), c, { shade: 'shV', sw: 1.200 }) + P(S.star(63.400, 62.500, 9.600, 4.400), c, { shade: 'shV', sw: 1.200 }) + ln('M56 62h0', c, 2) + hl('M45 58l4-1-2 3z', .6),
      heartshade: () => P(S.heart(48.600, 62.500, 5.400), c, { shade: 'shV', sw: 1.200 }) + P(S.heart(63.400, 62.500, 5.400), c, { shade: 'shV', sw: 1.200 }) + ln('M54 59h4', c, 1.800) + hl('M44 59l3-1-1.500 2z', .6),
      goggles: () => ln('M30 60Q56 52 82 60', '#6a4a2a', 4) + X.map((x) => C(x, 62.500, 7.600, 'rgba(140,220,255,.35)', { line: c, sw: 2.800, shade: false })).join('') + X.map((x) => hl(`M${x - 5} 59q3-3 7-2-5 0-7 2z`, .7)).join(''),
      monocle: () => C(63.400, 62.500, 8, 'rgba(255,240,180,.18)', { line: '#d9a21a', sw: 1.800, shade: false }) + ln('M70 68q6 14 2 30', '#d9a21a', 1) + hl('M58.600 59q3-3 6-1-4 0-6 1z', .7),
      eyepatch: () => ln('M33 52L80 70', '#2a2530', 2) + E(48.600, 62.500, 7.200, 7.800, '#2a2530', { shade: 'shR', sw: 1.200 }),
      mask: () => P('M33 58Q40 52 48.600 56 56 58 63.400 56 72 52 79 58 78 70 70 70 64 68 56 64 48 68 42 70L34 70Z', c, { shade: 'shV' }) + X.map((x) => E(x, 62.500, 5, 4, '#fff', { shade: false, sw: 1 })).join('') + X.map((x) => dot(x, 62.500, 2.400, '#1d1a33')).join(''),
      freckles: () => [[41, 69], [44, 71], [47, 68.500], [65, 68.500], [68, 71], [71, 69], [43, 67], [69, 67]].map((p) => dot(p[0], p[1], .9, '#b9774f', .75)).join(''),
      blush: () => E(41, 70, 6.400, 3.800, '#ff6b8a', { shade: false, line: false, op: .48 }) + E(71, 70, 6.400, 3.800, '#ff6b8a', { shade: false, line: false, op: .48 }) + ln('M38 69l1.500 3M41 68.500l1.500 3.500M44 68.500l1.500 3', '#fff', .9, .7),
      whiskers: () => ln('M33 68l-9-2M33 71l-9 2M79 68l9-2M79 71l9 2', c, 1.200, .85) + `<path d="M54.500 69h3l-1.500 2z" fill="#ff8fa3"/>`,
      starpaint: () => `<path d="${S.star(70, 68, 4.800, 2)}" fill="${c}" stroke="#fff" stroke-width=".8" stroke-linejoin="round"/>` + S.glint(76, 63, 1.800, '#fff', .9),
      bolt: () => `<path d="M42 64l5-7-1.500 5.500h4l-5 8 1.500-6z" fill="${c}" stroke="#fff" stroke-width=".6" stroke-linejoin="round" transform="translate(0 2)"/>`,
      moustache: () => P('M56 71q-4-3-10-1 -2 5 4 5 4-1 6-4zM56 71q4-3 10-1 2 5-4 5-4-1-6-4z', c, { shade: 'shV', sw: 1 }),
      beard: () => P('M33 66Q36 86 56 86T79 66Q74 78 56 78T33 66Z', c, { shade: 'shV' }) + ln('M44 82q12 4 24 0', '#000', 1, .2),
    };
    return (M[style] || (() => ''))();
  };

  /* --------------------------------------------------------------- neckwear */
  S.neckItem = function (style, c) {
    c = c || '#e2768b';
    const M = {
      scarf: () => P('M39 88q17 12 34 0l2 9q-19 12-38 0z', c, { shade: 'shV' }) + ln('M42 91q14 8 28 0', '#fff', 1.400, .35) + P('M64 95l10 26-9 3-7-24z', c, { shade: 'shH' }) + ln('M66 106l8-2M64 114l8-2', '#fff', 1.500, .4) + ln('M65 123v4M69 122v4M73 121v4', c, 1.600),
      bow: () => P('M52 91L38 83q-3 8 0 16z', c, { shade: 'shV' }) + P('M60 91L74 83q3 8 0 16z', c, { shade: 'shV' }) + R(52, 87, 8, 9, 3, c, { shade: 'shD' }) + hl('M53.500 88.500h3l-2 3z', .5),
      tie: () => P('M52 90h8l-1 5 4 30-7 6-7-6 4-30z', c, { shade: 'shH' }) + P('M51 88h10l-1 5h-8z', dark(c, .15), { shade: 'shV' }) + ln('M54 108l4-4M54 116l4-4', '#fff', 1.400, .5),
      pendant: () => ln('M46 90Q56 106 66 90', '#ffd166', 1.400) + `<path d="${S.star(56, 108, 5.600, 2.600)}" fill="${c}" stroke="#a06a00" stroke-width="1" stroke-linejoin="round"/>` + hl('M53 105l3-3-1 4z', .7),
      bandana: () => P('M41 88Q56 96 71 88L56 112Z', c, { shade: 'shD' }) + [[50, 94], [56, 98], [62, 94], [56, 104]].map((p) => dot(p[0], p[1], 1, '#fff', .8)).join('') + ln('M41 88Q56 96 71 88', dark(c, .3), 1.400),
      medal: () => ln('M48 90L56 112M64 90L56 112', '#c1443c', 3) + C(56, 116, 6.400, 'url(#mGold)', { sw: 1.200, shade: 'shR' }) + `<path d="${S.star(56, 116, 4, 1.800)}" fill="#fff" opacity=".7"/>`,
      lei: () => [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => { const t = i / 8, x = 42 + t * 28, y = 90 + Math.sin(t * Math.PI) * 14; return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-2.600" rx="1.800" ry="2.600" fill="${['#ff7a9c', '#ffd166', '#fff'][i % 3]}" stroke="${LINE}" stroke-width=".5" transform="rotate(${a})"/>`).join('')}<circle r="1.200" fill="#ffc247"/></g>`; }).join(''),
      pearls: () => Array.from({ length: 11 }, (_, i) => { const t = i / 10, x = 43 + t * 26, y = 90 + Math.sin(t * Math.PI) * 11; return C(x.toFixed(1), y.toFixed(1), 2.200, '#fff8ee', { shade: 'shR', sw: .7 }); }).join(''),
      lanyard: () => ln('M46 90L56 124M66 90L56 124', c, 2.600) + R(50, 122, 12, 16, 2, '#fff', { shade: 'shV', sw: 1.200 }) + R(53, 125, 6, 6, 1, '#9ad5ff', { shade: false, sw: .6 }) + ln('M52 134h8M52 136h5', '#000', .9, .4),
      collar: () => P('M44 92Q56 104 68 92L66 96Q56 108 46 96Z', c, { shade: 'shV' }) + C(56, 104, 3, '#ffd166', { sw: 1, shade: 'shR' }) + ln('M55 104h2', '#a06a00', .8),
    };
    return (M[style] || (() => ''))();
  };

  /* -------------------------------------------------------------- back items */
  S.back = function (style, c) {
    c = c || '#e07a5f';
    const wing = (grad, feather) => {
      const w = P('M36 106Q20 78 2 82 8 92 10 100 4 102 2 112 10 112 12 120 6 126 10 134 18 134 30 124Q34 116 38 112Z', grad, { shade: 'shV' }) + ln('M32 108Q18 98 8 96M32 114Q20 110 10 112M34 120Q24 122 14 128', feather || '#000', 1.200, .22) + hl('M26 96q-8-8-20-10 12 0 20 10z', .5);
      return w + S.mirror(w);
    };
    const M = {
      pack: () => P('M33 98q0-8 8-8h30q8 0 8 8v48q0 6-6 6H39q-6 0-6-6z', c, { shade: 'shH' }) + P('M40 112h32v26q0 3-3 3H43q-3 0-3-3z', c, { shade: 'shV' }) + dk('M40 112h32v26q0 3-3 3H43q-3 0-3-3z', .2) + ln('M40 118h32', '#000', 1.200, .25) + R(52, 122, 8, 5, 1.500, '#ffd166', { sw: .9 }),
      jetpack: () => { const t = P('M24 100q0-10 9-10t9 10v38q0 6-9 6t-9-6z', c, { shade: 'shH' }) + R(24, 106, 18, 5, 1, '#5f6b96', { sw: 1 }) + R(24, 124, 18, 4, 1, '#5f6b96', { sw: 1 }) + P('M27 146h12l-2 6H29z', '#4a5278', { shade: 'shV' }) + P('M29 152q4 22 8 0 2 6-4 14-6-8-4-14z', '#ffb020', { shade: false, line: false }) + P('M31 152q2 12 4 0-1 6-2 8-2-2-2-8z', '#fff6c2', { shade: false, line: false }); return t + S.mirror(t) + R(40, 104, 32, 8, 3, '#5f6b96', { shade: 'shV', sw: 1 }); },
      shell: () => P('M56 90q32 0 32 30t-32 38q-32-8-32-38t32-30z', c, { shade: 'shR' }) + ln('M56 94v62M36 110q20 8 40 0M34 126q22 10 44 0M40 142q16 8 32 0', '#fff', 1.600, .42) + hl('M40 102q6-9 16-10-12 3-16 10z', .45),
      cape: () => P('M38 96q18-9 36 0l15 86H23z', c, { shade: 'shV' }) + ln('M45 106l-10 72M56 104v76M67 106l10 72', '#000', 1.300, .17) + ln('M24 180q32 9 64 0', '#fff', 1.400, .3) + hl('M38 100q-6 28-9 58l3-1q2-28 8-52z', .22),
      guitar: () => P('M63 96l22-26 6 5-22 26z', '#8a5a2a', { shade: 'shH' }) + P('M44 122q-6-10 4-16t16 2q8 8 2 18-4 8-14 6-8-2-8-10z', c, { shade: 'shR' }) + C(54, 118, 3.600, '#2a1a12', { shade: false, sw: 1 }) + ln('M36 108l24 20', '#fff', .8, .5) + R(60, 90, 10, 6, 2, '#2a1a12', { sw: 1 }),
      solar: () => P('M30 98L10 128 24 140 40 112Z', '#2a3a7a', { shade: 'shD' }) + P('M82 98L102 128 88 140 72 112Z', '#2a3a7a', { shade: 'shD' }) + ln('M20 112l14 14M16 120l14 14M32 104l-4 12', '#9fc4ff', 1, .8) + ln('M92 112l-14 14M96 120l-14 14M80 104l4 12', '#9fc4ff', 1, .8) + R(36, 100, 40, 36, 8, c, { shade: 'shH' }),
      balloons: () => ln('M56 100Q50 70 36 50', '#fff', 1, .7) + ln('M56 100Q60 66 56 40', '#fff', 1, .7) + ln('M56 100Q66 70 78 54', '#fff', 1, .7) + [[36, 44, '#ff5c8a'], [56, 32, '#ffd166'], [78, 48, '#3a9bff']].map((b) => E(b[0], b[1], 9, 11, b[2], { shade: 'shR', sw: 1.100 }) + hl(`M${b[0] - 4} ${b[1] - 6}q3-4 6-3-4 0-6 3z`, .7)).join(''),
      wings: () => wing(c.indexOf('url(') === 0 ? c : 'url(#wingGold)'),
      angel: () => wing('url(#wingAngel)', '#7a8bb8'),
      fairy: () => wing('url(#wingFairy)', '#8a6bd6'),
      bat: () => wing('url(#wingBat)', '#d8a8ff'),
      flame: () => wing('url(#wingFlame)', '#fff'),
      butterfly: () => { const w = P('M36 104Q14 80 4 92 0 104 18 112 4 118 8 134 24 138 36 118Z', c, { shade: 'shR' }) + dot(14, 100, 3, '#fff', .7) + dot(14, 126, 2.400, '#fff', .7) + ln('M34 110Q20 108 10 100M34 114Q22 120 12 128', '#000', 1, .2); return w + S.mirror(w); },
    };
    return (M[style] || (() => ''))();
  };
  // parts of a back item that sit in front of the body (straps)
  S.backFront = function (style) {
    if (style === 'pack') return ln('M42 94q-2 26 0 56', '#000', 3.600, .5) + ln('M70 94q2 26 0 56', '#000', 3.600, .5) + ln('M42 94q-2 26 0 56', '#fff', 1, .18) + ln('M70 94q2 26 0 56', '#fff', 1, .18);
    if (style === 'jetpack') return ln('M41 104q2 20 4 38M71 104q-2 20-4 38', '#2a3050', 3);
    if (style === 'shell') return ln('M41 98q2 20 0 44M71 98q-2 20 0 44', '#2a6e5c', 3);
    if (style === 'cape') return P('M40 92L56 100 72 92 70 96 56 104 42 96Z', c0('#c1443c'), { shade: 'shV', sw: 1 });
    if (style === 'guitar') return ln('M40 94L80 138', '#2a1a12', 2.600, .85);
    if (style === 'solar') return ln('M42 96q-2 26 0 50M70 96q2 26 0 50', '#000', 3, .4);
    return '';
  };
  const c0 = (x) => x;

  /* ------------------------------------------------------------- held items */
  // drawn in front of the figure's right hand (the one on the viewer's right, at about 78,152)
  S.hand = function (style, c) {
    c = c || '#e2768b';
    const M = {
      book: () => R(74, 136, 18, 24, 2, c, { shade: 'shD' }) + R(76, 138, 14, 20, 1, '#fff8ee', { shade: false, sw: .8 }) + ln('M79 143h8M79 147h8M79 151h6', '#000', .9, .3),
      wand: () => ln('M78 156L98 124', '#6a4a2a', 3) + ln('M78 156L98 124', '#fff', .8, .3) + `<path d="${S.star(99, 120, 6.200, 2.600)}" fill="#ffd166" stroke="#a06a00" stroke-width="1" stroke-linejoin="round"/>` + S.glint(106, 114, 2.400, '#fff', .9),
      balloon: () => ln('M78 152Q74 130 84 112', '#fff', 1, .8) + E(84, 100, 11, 13, c, { shade: 'shR', sw: 1.200 }) + hl('M78 92q3-5 7-4-5 1-7 4z', .7) + P('M82 112l2 3 2-3z', c, { shade: false, sw: .8 }),
      flag: () => ln('M80 158V112', '#6a4a2a', 2.400) + P('M81 112h22l-5 8 5 8H81z', c, { shade: 'shH' }) + `<path d="${S.star(90, 120, 3.600, 1.600)}" fill="#fff"/>`,
      lantern: () => ln('M78 152V138', '#6a4a2a', 1.600) + `<circle cx="78" cy="148" r="16" fill="url(#shGlow)" opacity=".6"/>` + R(71, 140, 14, 18, 3, '#ffd166', { shade: 'shR', sw: 1.200 }) + R(72, 136, 12, 4, 1.500, '#6a4a2a', { sw: 1 }) + E(78, 149, 3.400, 5, '#fff6c2', { shade: false, line: false, op: .95 }),
      icecream: () => P('M72 144l6 20 6-20z', '#e8c070', { shade: 'shH' }) + ln('M74 148l8 4M73 154l8 4', '#a8742a', 1, .6) + C(78, 140, 7, c, { shade: 'shR' }) + C(78, 133, 5.400, light(c, .4), { shade: 'shR' }) + dot(78, 126.500, 1.800, '#c1243c'),
      spyglass: () => `<g transform="rotate(-38 78 150)">` + R(72, 128, 12, 30, 3, '#b8742a', { shade: 'shH' }) + R(70, 124, 16, 8, 2, '#d99a2b', { shade: 'shV' }) + R(73, 150, 10, 8, 2, '#8a5a2a', { shade: 'shV' }) + '</g>',
      controller: () => P('M68 144h20q6 0 7 6l1 8q0 4-4 3l-6-4H70l-6 4q-4 1-4-3l1-8q1-6 7-6z', c, { shade: 'shD' }) + R(70, 147, 6, 2, 1, '#fff', { shade: false, line: false, op: .9 }) + R(72, 145, 2, 6, 1, '#fff', { shade: false, line: false, op: .9 }) + dot(85, 148, 1.600, '#ff5c5c') + dot(82, 151, 1.600, '#3a9bff'),
    };
    return (M[style] || (() => ''))();
  };
  // fingers curl over whatever is held
  S.handGrip = () => C(78, 152.500, 5.400, S.SKIN, { shade: 'shR' });
})();
