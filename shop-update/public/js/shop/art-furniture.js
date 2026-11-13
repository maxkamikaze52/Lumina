/* Astrolab — shop art, part 3: room furniture, decorations and the wall + floor themes.
   Owned by the content side. Furniture is drawn around its base point (0,0), y grows upwards. */
(function () {
  'use strict';
  const S = window.ART;
  const WOOD = '#b98a52';
  const gs = (rx) => `<ellipse cx="0" cy="0" rx="${rx}" ry="3.4" fill="#000" opacity=".24"/>`;
  const dk = S.dk, hl = S.hl, ln = S.ln, P = S.P, R = S.R, E = S.E, C = S.C;

  // view boxes (x y w h) so thumbnails frame each object properly
  S.furnBox = {
    bed: '-40 -52 80 56', desk: '-36 -40 72 44', chair: '-20 -42 40 46', sofa: '-40 -42 80 46', wardrobe: '-32 -72 64 76',
    bookshelf: '-30 -72 60 76', cabinet: '-26 -40 52 44', lamp: '-24 -66 48 70', rug: '-78 -24 156 48', beanbag: '-32 -36 64 40',
    poster: '-22 -48 44 52', painting: '-28 -42 56 48', plant: '-20 -52 40 56', clock: '-22 -38 44 44', trophy: '-22 -42 44 46',
    computer: '-26 -38 52 42', globe: '-22 -44 44 48', telescope: '-28 -50 56 54', models: '-26 -44 52 48', mobile: '-28 -68 56 74'
  };

  S.furniture = function (style, c) {
    c = c || '#c9a06a';
    const M = {
      bed: () => gs(40) + R(-36, -46, 72, 24, 4, WOOD, { shade: 'shV' }) + R(-33, -43, 66, 5, 2, '#fff', { shade: false, line: false, op: .14 }) +
        R(-4, -1, 6, 4, 1, '#7a5530', { sw: 1 }) + R(-34, -3, 6, 5, 1, '#7a5530', { sw: 1 }) + R(28, -3, 6, 5, 1, '#7a5530', { sw: 1 }) +
        E(-17, -32, 13, 6.500, '#fffdf6', { shade: 'shR' }) + E(15, -32, 13, 6.500, '#fffdf6', { shade: 'shR' }) +
        R(-36, -28, 72, 27, 6, c, { shade: 'shV' }) + R(-36, -28, 72, 9, 5, '#fff', { shade: false, line: false, op: .3 }) + ln('M-36-19.500h72', '#000', 1.200, .2) +
        ln('M-24-16v14M-8-16v14M8-16v14M24-16v14', '#000', 1.100, .1) + dk('M-36-6h72v5q0 2-2 2H-34q-2 0-2-2z', .14),
      desk: () => gs(34) + R(-27, -22, 54, 22, 2, c, { shade: 'shV' }) + R(-31, -28, 62, 7, 2.500, c, { shade: 'shV' }) + dk('M-31-22h62v1.500h-62z', .22) +
        hl('M-29-27h30l-1 2h-29z', .45) + R(-24, -19, 17, 8, 1.500, c, { shade: 'shV', sw: 1 }) + R(-24, -10, 17, 8, 1.500, c, { shade: 'shV', sw: 1 }) + dk('M-24-19h17v8h-17z', .12) +
        E(-15.500, -15, 2, 1.200, '#ffd166', { shade: false, sw: .7 }) + E(-15.500, -6, 2, 1.200, '#ffd166', { shade: false, sw: .7 }) +
        R(21, -21, 5, 21, 1, c, { shade: 'shH' }) + R(-5, -21, 3, 21, 1, c, { shade: 'shH' }) + dk('M-5-21h3v21h-3z', .1) +
        R(17, -36, 7, 8, 1.500, '#e07a5f', { shade: 'shH', sw: 1 }) + ln('M19-36l-1-6M21.500-36v-7M23.500-36l1-5', '#3a9bff', 1.300) + ln('M19-36l-1-6', '#ffd166', 1.300),
      chair: () => gs(14) + R(-9, -38, 18, 17, 3, c, { shade: 'shV' }) + ln('M-4-37v14M0-37v14M4-37v14', '#000', 1.100, .14) + R(-11, -22, 22, 7, 2.500, c, { shade: 'shV' }) + hl('M-9-21h18l-1 2h-16z', .4) +
        R(-10, -15, 3, 15, 1, c, { shade: 'shH' }) + R(7, -15, 3, 15, 1, c, { shade: 'shH' }) + ln('M-7-7h14', '#000', 1.200, .22),
      sofa: () => gs(40) + R(-31, -36, 62, 22, 8, c, { shade: 'shV' }) + hl('M-26-34h52l-2 3h-48z', .35) +
        R(-37, -29, 12, 29, 6, c, { shade: 'shH' }) + R(25, -29, 12, 29, 6, c, { shade: 'shH' }) +
        R(-26, -22, 26, 14, 5, c, { shade: 'shV' }) + R(0, -22, 26, 14, 5, c, { shade: 'shV' }) + ln('M0-21v12', '#000', 1.200, .3) + dk('M-26-11h52v3h-52z', .15) +
        R(-32, -3, 5, 5, 1, '#4a3322', { sw: 1 }) + R(27, -3, 5, 5, 1, '#4a3322', { sw: 1 }) +
        ln('M-30-28q-2 10 0 22M30-28q2 10 0 22', '#fff', 1.200, .25) + P('M12-34q8-2 10 6l-2 8q-8 2-10-4z', '#fff', { shade: 'shR', op: .55, sw: 1 }),
      wardrobe: () => gs(26) + R(-24, -68, 48, 6, 2, c, { shade: 'shV' }) + R(-22, -62, 44, 59, 2, c, { shade: 'shH' }) +
        R(-19, -58, 17, 51, 2, c, { shade: 'shV', sw: 1 }) + R(2, -58, 17, 51, 2, c, { shade: 'shV', sw: 1 }) + dk('M-19-58h17v51h-17zM2-58h17v51H2z', .1) +
        ln('M-15-54h9M6-54h9M-15-10h9M6-10h9', '#000', 1, .18) + E(-5, -32, 1.600, 3, '#ffd166', { shade: 'shR', sw: .8 }) + E(5, -32, 1.600, 3, '#ffd166', { shade: 'shR', sw: .8 }) +
        R(-21, -3, 6, 5, 1, '#5a3d22', { sw: 1 }) + R(15, -3, 6, 5, 1, '#5a3d22', { sw: 1 }),
      bookshelf: () => {
        const books = (y, list) => { let x = -19; return list.map((b) => { const r = R(x, y - b[1], b[0], b[1], 1, b[2], { shade: 'shH', sw: .8 }) + ln(`M${x + b[0] / 2} ${y - b[1] + 3}v6`, '#fff', .8, .35); x += b[0] + .6; return r; }).join(''); };
        return gs(28) + R(-25, -68, 50, 68, 2, c, { shade: 'shH' }) + R(-21.500, -64.500, 43, 61, 1, '#000', { shade: false, line: false, op: .3 }) +
          books(-45, [[5, 15, '#ff8a5c'], [4, 17, '#2ec4a6'], [6, 14, '#ffd166'], [4, 16, '#6fb3ff'], [5, 15, '#e2768b'], [4, 13, '#a276ff'], [6, 16, '#2ec4a6']]) +
          R(-22, -46, 44, 3, 1, c, { shade: 'shV', sw: .9 }) +
          books(-25, [[4, 14, '#6fb3ff'], [5, 16, '#ff8a5c'], [5, 13, '#ffd166'], [4, 16, '#a276ff'], [6, 14, '#2ec4a6']]) +
          P('M10-25l7-14 5 2-6 14z', '#e2768b', { shade: 'shH', sw: .8 }) + R(-22, -26, 44, 3, 1, c, { shade: 'shV', sw: .9 }) +
          R(-17, -22, 12, 18, 2, '#e07a5f', { shade: 'shV', sw: .9 }) + P('M-15-22q3-5 6 0z', '#4f9d69', { shade: false, line: false }) +
          books(-4, [[7, 14, '#3a9bff'], [5, 12, '#ffd166'], [6, 15, '#ff7a5c']]) + R(-22, -4, 44, 3, 1, c, { shade: 'shV', sw: .9 });
      },
      cabinet: () => gs(22) + R(-20, -36, 40, 4, 2, c, { shade: 'shV' }) + R(-18, -32, 36, 29, 2, c, { shade: 'shH' }) +
        R(-15, -29, 14, 23, 1.500, c, { shade: 'shV', sw: 1 }) + R(1, -29, 14, 23, 1.500, c, { shade: 'shV', sw: 1 }) + dk('M-15-29h14v23h-14zM1-29h14v23H1z', .1) +
        E(-4, -17, 1.300, 1.300, '#fff', { shade: 'shR', sw: .7 }) + E(4, -17, 1.300, 1.300, '#fff', { shade: 'shR', sw: .7 }) +
        R(-16, -3, 4, 5, 1, '#5a3d22', { sw: 1 }) + R(12, -3, 4, 5, 1, '#5a3d22', { sw: 1 }),
      lamp: () => gs(11) + `<circle cx="0" cy="-48" r="26" fill="url(#shGlow)" opacity=".35"/>` + E(0, -2, 9.500, 3, '#6a5a48', { shade: 'shV' }) + R(-1.500, -44, 3, 42, 1, '#8a7a62', { shade: 'shH', sw: 1 }) +
        P('M-14-42l4-17h20l4 17z', c, { shade: 'shH' }) + E(0, -42, 14, 2.800, c, { shade: 'shV', sw: 1 }) + E(0, -42, 11, 1.800, '#fff7c9', { shade: false, line: false, op: .85 }) + hl('M-9-57l-2 12 3-12z', .5),
      rug: () => `<ellipse cx="0" cy="2" rx="74" ry="20" fill="#000" opacity=".18"/>` + E(0, 0, 72, 19, c, { shade: 'shV' }) +
        `<ellipse cx="0" cy="0" rx="62" ry="15" fill="none" stroke="#fff" stroke-width="2" opacity=".38"/><ellipse cx="0" cy="0" rx="52" ry="12" fill="none" stroke="#000" stroke-width="1.200" opacity=".18" stroke-dasharray="4 4"/>` +
        [-40, -26, -13, 13, 26, 40].map((x) => `<circle cx="${x}" cy="0" r="2" fill="#fff" opacity=".45"/>`).join('') +
        P('M0-6l10 6-10 6-10-6z', '#fff', { shade: false, line: false, op: .4 }) + ln('M-56-9q56-8 112 0', '#fff', 1, .18),
      beanbag: () => gs(28) + P('M-26 0q-4-16 8-24 12-8 30-1 16 7 14 25z', c, { shade: 'shR' }) + ln('M-14-22q-6 12-4 22M10-24q6 12 4 24M-2-26q2 12 0 26', '#000', 1.100, .16) +
        hl('M-18-18q4-6 10-8-6 4-10 8z', .5) + dk('M-24-4q22 6 48 0v4h-48z', .12) + P('M-6-26q6-2 12 0-6 2-12 0z', '#000', { shade: false, line: false, op: .16 }),
      poster: () => R(-17, -44, 34, 44, 1.500, c, { shade: 'shV' }) + R(-14, -41, 28, 26, 1, '#10142b', { shade: false, sw: .9 }) +
        [[-10, -37], [8, -35], [0, -30], [-9, -24], [10, -22]].map((p) => S.dot(p[0], p[1], .9, '#fff', .9)).join('') +
        C(-1, -29, 6.500, '#ffd166', { shade: 'shR', sw: 1 }) + `<ellipse cx="-1" cy="-28" rx="11" ry="2.600" fill="none" stroke="#ff9d5c" stroke-width="1.400" transform="rotate(-18 -1 -28)"/>` +
        R(-12, -11, 24, 3, 1, '#fff', { shade: false, line: false, op: .8 }) + R(-8, -6, 16, 2, 1, '#fff', { shade: false, line: false, op: .5 }) +
        `<path d="M-17-44l7 0-7 7z" fill="#fff" opacity=".35"/><rect x="-3" y="-46" width="6" height="4" fill="#ffd166" opacity=".8"/>`,
      painting: () => {
        const wave = String(c).indexOf('artWave') >= 0, sun = String(c).indexOf('artSun') >= 0;
        const art = wave ? `<rect x="-17" y="-31" width="34" height="26" fill="${c}"/>` + P('M-17-16q5-5 9 0t9 0 9 0 8-3v14h-34z', '#2a7bc4', { shade: false, line: false }) + P('M-17-11q5-4 9 0t9 0 9 0 8-2v8h-34z', '#1f4f9a', { shade: false, line: false }) + ln('M-12-18q2-2 4 0M2-17q2-2 4 0', '#fff', 1, .7) + S.dot(8, -25, 2.400, '#fff', .8)
          : sun ? `<rect x="-17" y="-31" width="34" height="26" fill="${c}"/>` + C(4, -19, 6, '#ffe29a', { shade: 'shR', line: false }) + P('M-17-11l9-9 8 7 7-5 10 8v5h-34z', '#4a2f6f', { shade: false, line: false }) + P('M-17-8l12-6 10 6 12-5v8h-34z', '#2e1c4d', { shade: false, line: false })
            : `<rect x="-17" y="-31" width="34" height="26" fill="#6fb3ff"/>` + C(0, -17, 5, '#ffe29a', { shade: false, line: false, op: .9 });
        return R(-21, -35, 42, 34, 2, '#b98a52', { shade: 'shD' }) + R(-18.500, -32.500, 37, 29, 1, '#f4efe6', { shade: false, sw: .8 }) + art + hl('M-17-31h12l-8 10h-4z', .18) +
          R(-17, -31, 34, 26, 0, 'none', { shade: false, sw: .9 });
      },
      plant: () => {
        const leaf = (a, len, col) => `<g transform="translate(0 -15) rotate(${a})">` + P(`M0 0q-${len * .38} -${len * .5} 0 -${len}q${len * .38} ${len * .5} 0 ${len}z`, col, { shade: 'shD', sw: 1.100 }) + ln(`M0 -2v-${len - 4}`, '#000', .8, .2) + '</g>';
        return gs(11) + leaf(-62, 22, c) + leaf(62, 22, c) + leaf(-34, 28, c) + leaf(34, 28, c) + leaf(0, 32, c) + leaf(-12, 24, c) + leaf(14, 24, c) +
          P('M-8-16h16l-2 14q-.5 2-2.500 2h-7q-2 0-2.500-2z', '#c98b5e', { shade: 'shH' }) + R(-9.500, -18, 19, 4.500, 2, '#d9996b', { shade: 'shV', sw: 1.100 }) +
          hl('M-6-13l1.500 9-2.500-9z', .4) + ln('M-5-8h10', '#000', 1, .12);
      },
      clock: () => `<circle cx="0" cy="-19" r="15" fill="${WOOD}" stroke="${S.LINE}" stroke-width="1.300"/><circle cx="0" cy="-19" r="15" fill="url(#shD)"/>` +
        C(0, -19, 11.500, c, { shade: 'shR', sw: 1 }) + Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${(Math.sin(a) * 9.600).toFixed(1)} ${(-19 - Math.cos(a) * 9.600).toFixed(1)}L${(Math.sin(a) * (i % 3 ? 8.600 : 7.600)).toFixed(1)} ${(-19 - Math.cos(a) * (i % 3 ? 8.600 : 7.600)).toFixed(1)}" stroke="#20243a" stroke-width="${i % 3 ? 1 : 1.600}" stroke-linecap="round"/>`; }).join('') +
        ln('M0-19v-7', '#20243a', 1.800) + ln('M0-19l5 3', '#20243a', 1.500) + ln('M0-19l-2 6', '#e0443c', .9) + S.dot(0, -19, 1.600, '#20243a') + hl('M-9-26q5-5 11-5-8 2-11 5z', .45),
      trophy: () => gs(10) + R(-9, -6, 18, 6, 2, '#6a4a2a', { shade: 'shV' }) + R(-6, -10, 12, 5, 1.500, '#8a6236', { shade: 'shV', sw: 1 }) +
        P('M-2-10h4l1 6h-6z', c, { shade: 'shH', sw: 1 }) + R(-2.500, -22, 5, 13, 1.500, c, { shade: 'shH', sw: 1 }) +
        ln('M-11-37q-10 0-9 8 1 6 8 6', S.LINE, 4.200) + ln('M-11-37q-10 0-9 8 1 6 8 6', c, 2.400) + ln('M11-37q10 0 9 8-1 6-8 6', S.LINE, 4.200) + ln('M11-37q10 0 9 8-1 6-8 6', c, 2.400) + P('M-11-40h22v9q0 11-11 12-11-1-11-12z', c, { shade: 'shH' }) + E(0, -40, 11, 2.400, c, { shade: 'shV', sw: 1 }) +
        `<path d="${S.star(0, -30, 4.200, 1.800)}" fill="#fff" opacity=".8"/>` + hl('M-8-39l-1 8q1 6 4 8-3-8-3-16z', .55),
      computer: () => gs(18) + R(-20, -37, 40, 28, 3, c, { shade: 'shD' }) + R(-17, -34, 34, 21, 1.500, '#10162f', { shade: false, sw: 1 }) +
        R(-17, -34, 34, 21, 1.500, '#2a5fb5', { shade: 'shV', line: false, op: .55 }) + R(-14, -31, 14, 6, 1, '#fff', { shade: false, line: false, op: .85 }) + R(-14, -23, 9, 6, 1, '#ffd166', { shade: false, line: false, op: .9 }) +
        R(2, -30, 12, 12, 1, '#2ec4a6', { shade: false, line: false, op: .8 }) + hl('M-16-33l14 0-9 19h-5z', .15) + S.dot(15, -11, 1, '#6ff0d0') +
        P('M-3-9h6l2 6h-10z', c, { shade: 'shH', sw: 1 }) + R(-10, -4, 20, 3, 1.500, c, { shade: 'shV', sw: 1 }),
      globe: () => gs(10) + P('M-8 0h16l-2-4h-12z', '#8a6236', { shade: 'shV', sw: 1 }) + R(-1.500, -10, 3, 7, 1, '#8a6236', { shade: 'shH', sw: .9 }) +
        ln('M-17-18a17 17 0 0014 22', '#b98a52', 2.200) + C(0, -24, 15, c, { shade: 'shR' }) +
        P('M-9-30q4-4 8-1 2 4-2 6-6 1-6-5z', '#6fbf73', { shade: false, line: false }) + P('M3-24q5-3 8 2 0 6-5 8-5-3-3-10z', '#6fbf73', { shade: false, line: false }) + P('M-10-18q3 1 4 5-4-1-4-5z', '#6fbf73', { shade: false, line: false }) +
        ln('M-15-24h30M0-39q-7 15 0 30M0-39q7 15 0 30', '#fff', .9, .4) + hl('M-10-33q4-5 10-6-8 2-10 6z', .55),
      telescope: () => gs(18) + ln('M-14 0l8-18M14 0l-8-18M0 0v-16', S.LINE, 4.200) + ln('M-14 0l8-18M14 0l-8-18M0 0v-16', '#8a6236', 2.600) +
        `<g transform="rotate(-24 0 -20)">` + R(-24, -28, 40, 11, 3, c, { shade: 'shV' }) + R(-6, -29, 4, 13, 1, '#8a6236', { shade: 'shV', sw: .9 }) + R(8, -29, 4, 13, 1, '#8a6236', { shade: 'shV', sw: .9 }) +
        R(16, -26, 10, 7, 2, '#5a4a38', { shade: 'shV', sw: 1 }) + R(-27, -29.500, 5, 14, 2, '#8a6236', { shade: 'shV', sw: 1 }) + `<ellipse cx="-24.500" cy="-22.500" rx="1.800" ry="5.200" fill="#6fb3ff" opacity=".85"/>` + '</g>' + S.dot(0, -18, 2.200, '#5a4a38'),
      models: () => gs(10) + R(-1.500, -14, 3, 12, 1, '#8a6236', { shade: 'shH', sw: .9 }) + E(0, -2, 8, 2.600, '#8a6236', { shade: 'shV', sw: 1 }) +
        [0, 60, 120].map((a) => `<ellipse cx="0" cy="-26" rx="17" ry="6.500" fill="none" stroke="${S.LINE}" stroke-width="3.400" transform="rotate(${a} 0 -26)"/><ellipse cx="0" cy="-26" rx="17" ry="6.500" fill="none" stroke="${c}" stroke-width="2" transform="rotate(${a} 0 -26)"/>`).join('') +
        C(0, -26, 5, '#ffd166', { shade: 'shR' }) + C(15, -21, 2.600, '#fff', { shade: 'shR', sw: .9 }) + C(-8, -35, 2.600, '#ff8a5c', { shade: 'shR', sw: .9 }) + C(-9, -17, 2.600, '#6fb3ff', { shade: 'shR', sw: .9 }),
      mobile: () => R(-22, -66, 44, 3, 1.500, '#8a6236', { shade: 'shV', sw: 1 }) +
        ln('M-14-63v14M0-63v22M14-63v8', S.LINE, 1.200) +
        C(-14, -45, 5.500, '#ff8a5c', { shade: 'shR' }) + C(14, -51, 4.200, '#6fb3ff', { shade: 'shR' }) +
        C(0, -33, 9, c, { shade: 'shR' }) + `<ellipse cx="0" cy="-33" rx="15" ry="3.600" fill="none" stroke="${S.LINE}" stroke-width="3.200" transform="rotate(-18 0 -33)"/><ellipse cx="0" cy="-33" rx="15" ry="3.600" fill="none" stroke="#ffe29a" stroke-width="1.800" transform="rotate(-18 0 -33)"/>` +
        C(0, -33, 9, 'none', { shade: false, sw: .0, line: false }) + ln('M14-47v8', S.LINE, 1) + `<path d="${S.star(14, -34, 4.200, 1.800)}" fill="#ffe29a" stroke="${S.LINE}" stroke-width="1"/>` +
        ln('M-14-39v6', S.LINE, 1) + C(-14, -29, 2.600, '#a276ff', { shade: 'shR', sw: .9 }) + hl('M-4-39q3-3 6-3-4 1-6 3z', .6)
    };
    return (M[style] || (() => R(-16, -26, 32, 26, 3, c, { shade: 'shV' })))();
  };

  /* ------------------------------------------------------------------- room */
  // deterministic scatter so stars/petals are stable between renders
  const rnd = (seed) => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

  const windowFrame = (x, y, w, h, glass, extra) =>
    R(x - 8, y - 8, w + 16, h + 16, 8, '#f4efe6', { shade: 'shD', sw: 1.500 }) +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${glass}"/>` + (extra || '') +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#shV)" opacity=".7"/>` +
    R(x + w / 2 - 3, y, 6, h, 1, '#f4efe6', { shade: 'shH', sw: 1 }) + R(x, y + h / 2 - 3, w, 6, 1, '#f4efe6', { shade: 'shV', sw: 1 }) +
    R(x - 14, y + h + 6, w + 28, 9, 3, '#e8e0d2', { shade: 'shV', sw: 1.300 }) +
    `<path d="M${x + 8} ${y + 8}l${w * .35} 0-${w * .25} ${h * .5}h-${w * .2}z" fill="#fff" opacity=".18"/>`;

  S.room = function (t) {
    const wall = t.colour || '#f3e6cf', floor = t.floor || '#a9793f', id = t.id || '';
    const r = rnd(id.length * 977 + 13);
    const dark = id === 'theme-space' || id === 'theme-cosmic';
    let deco = '', win = '';
    if (id === 'theme-study') {
      for (let x = 0; x < 960; x += 48) deco += `<rect x="${x}" y="0" width="24" height="410" fill="#fff" opacity=".14"/>`;
      win = windowFrame(96, 70, 150, 180, '#bfe3ff', `<circle cx="190" cy="120" r="20" fill="#fff6c2" opacity=".9"/><path d="M96 230q40-30 80-10t70-8v38H96z" fill="#7fb069" opacity=".9"/>`) +
        `<path d="M70 62q8 90 0 210 14-6 22-12-6-90 0-186z" fill="#e2768b" opacity=".85"/><path d="M270 62q-8 90 0 210-14-6-22-12 6-90 0-186z" fill="#e2768b" opacity=".85"/>`;
    } else if (id === 'theme-sky') {
      [[140, 90, 1], [520, 60, 1.2], [800, 120, .9], [330, 160, .7]].forEach((p) => { deco += `<g fill="#fff" opacity=".7" transform="translate(${p[0]} ${p[1]}) scale(${p[2]})"><ellipse rx="46" ry="14"/><ellipse cx="-24" cy="-10" rx="22" ry="14"/><ellipse cx="14" cy="-14" rx="26" ry="16"/></g>`; });
      win = windowFrame(640, 80, 170, 170, '#9ad0ff', `<ellipse cx="700" cy="150" rx="40" ry="12" fill="#fff" opacity=".85"/><ellipse cx="750" cy="200" rx="30" ry="9" fill="#fff" opacity=".7"/>`);
    } else if (id === 'theme-forest') {
      for (let x = 0; x < 960; x += 60) deco += `<rect x="${x}" y="0" width="2" height="412" fill="#000" opacity=".1"/><rect x="${x + 3}" y="0" width="2" height="412" fill="#fff" opacity=".18"/>`;
      win = windowFrame(100, 80, 160, 170, '#cfe8c4', `<path d="M100 250l30-90 30 90zM150 250l36-110 36 110zM212 250l26-80 26 80z" fill="#4f9d69" opacity=".9"/>`) +
        `<g transform="translate(760 70)"><circle r="26" fill="#d9c3a5"/><circle r="26" fill="url(#shR)"/><path d="M-14 0l8 5 14-12" stroke="#5a4a38" stroke-width="3" fill="none"/></g>`;
    } else if (id === 'theme-space') {
      for (let i = 0; i < 70; i++) deco += `<circle cx="${(r() * 960).toFixed(0)}" cy="${(r() * 400).toFixed(0)}" r="${(r() * 1.6 + .6).toFixed(1)}" fill="#fff" opacity="${(r() * .6 + .3).toFixed(2)}"/>`;
      deco += `<path d="M120 120l70 40 60-60 80 70" fill="none" stroke="#9fc4ff" stroke-width="1.200" opacity=".4"/>`;
      win = `<ellipse cx="720" cy="190" rx="130" ry="120" fill="#e8e0d2" stroke="${S.LINE}" stroke-width="2"/><ellipse cx="720" cy="190" rx="118" ry="108" fill="#0b1030"/>` +
        `<ellipse cx="740" cy="170" rx="90" ry="40" fill="#a276ff" opacity=".3" transform="rotate(-24 740 170)"/><ellipse cx="700" cy="210" rx="60" ry="22" fill="#3a9bff" opacity=".3" transform="rotate(-24 700 210)"/>` +
        Array.from({ length: 24 }, () => `<circle cx="${(620 + r() * 200).toFixed(0)}" cy="${(100 + r() * 180).toFixed(0)}" r="${(r() * 1.500 + .6).toFixed(1)}" fill="#fff"/>`).join('') +
        `<circle cx="780" cy="130" r="14" fill="#ffd166"/><circle cx="780" cy="130" r="14" fill="url(#shR)"/><ellipse cx="720" cy="190" rx="118" ry="108" fill="url(#shD)" opacity=".6"/>`;
    } else if (id === 'theme-sakura') {
      deco += `<path d="M960 40q-120 40-200 120M880 90q-60-20-110-10M820 140q-50 30-80 70" fill="none" stroke="#7a4a3a" stroke-width="7" stroke-linecap="round"/>`;
      for (let i = 0; i < 46; i++) { const x = r() * 960, y = r() * 400; deco += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(r() * 5 + 5).toFixed(1)}" ry="${(r() * 3 + 3.500).toFixed(1)}" fill="${i % 3 ? '#ff9fb8' : '#ffd0dc'}" opacity=".85" transform="rotate(${(r() * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; }
      win = windowFrame(110, 80, 150, 170, '#fff0f4', `<circle cx="150" cy="140" r="38" fill="#ff9fb8" opacity=".7"/><circle cx="210" cy="170" r="30" fill="#ffc2d2" opacity=".8"/>`);
    } else if (id === 'theme-lab') {
      for (let x = 0; x <= 960; x += 64) deco += `<path d="M${x} 0v412" stroke="#000" stroke-width="1.500" opacity=".1"/>`;
      for (let y = 0; y <= 412; y += 64) deco += `<path d="M0 ${y}h960" stroke="#000" stroke-width="1.500" opacity=".1"/>`;
      deco += `<rect y="0" width="960" height="26" fill="#2ec4a6" opacity=".5"/>`;
      win = windowFrame(660, 80, 170, 150, '#bfeee6', `<path d="M660 230l50-70 40 40 40-60 40 90z" fill="#2ec4a6" opacity=".5"/>`) +
        `<g transform="translate(130 150)"><rect x="-44" y="48" width="88" height="8" rx="3" fill="#cfd8dc" stroke="${S.LINE}" stroke-width="1.200"/><path d="M-30 48v-26l-8-14h22l-8 14v26z" fill="#9fe8d6" stroke="${S.LINE}" stroke-width="1.200"/><path d="M8 48v-18h24v18z" fill="#ff9fb8" stroke="${S.LINE}" stroke-width="1.200"/><circle cx="-12" cy="38" r="3" fill="#fff" opacity=".7"/></g>`;
    } else if (id === 'theme-cosmic') {
      deco += `<ellipse cx="260" cy="150" rx="260" ry="120" fill="#7a5cff" opacity=".28"/><ellipse cx="720" cy="230" rx="240" ry="110" fill="#ff5c9a" opacity=".2"/><ellipse cx="480" cy="90" rx="200" ry="60" fill="#3ad0ff" opacity=".16"/>`;
      for (let i = 0; i < 90; i++) deco += `<circle cx="${(r() * 960).toFixed(0)}" cy="${(r() * 405).toFixed(0)}" r="${(r() * 1.800 + .5).toFixed(1)}" fill="${i % 4 ? '#fff' : '#ffd166'}" opacity="${(r() * .6 + .35).toFixed(2)}"/>`;
      deco += `<g transform="translate(790 110)"><circle r="46" fill="#ff9d5c"/><circle r="46" fill="url(#shR)"/><ellipse rx="78" ry="14" fill="none" stroke="#ffe29a" stroke-width="5" transform="rotate(-20)" opacity=".9"/></g>` +
        `<g transform="translate(150 80)"><circle r="20" fill="#6fd8ff"/><circle r="20" fill="url(#shR)"/></g>`;
    }
    const gloss = dark ? '' : `<rect width="960" height="412" fill="url(#shV)" opacity=".5"/>`;
    // floor: perspective planks
    let planks = '';
    [424, 440, 460, 486, 518, 558].forEach((y) => { planks += `<path d="M0 ${y}h960" stroke="#000" stroke-width="1.600" opacity=".16"/>`; });
    const rows = [[424, 440], [440, 460], [460, 486], [486, 518], [518, 558], [558, 600]];
    rows.forEach((row, ri) => { const w = 90 + ri * 34; for (let x = -((ri * 47) % w); x < 960; x += w) planks += `<path d="M${x.toFixed(0)} ${row[0]}V${row[1]}" stroke="#000" stroke-width="1.200" opacity=".13"/>`; });
    return `<rect width="960" height="420" fill="${wall}"/>` + deco + gloss +
      (dark ? `<rect width="960" height="420" fill="url(#shUp)" opacity=".5"/>` : '') + win +
      `<rect y="416" width="960" height="180" fill="${floor}"/>` + `<rect y="416" width="960" height="190" fill="url(#shUp)"/>` + planks +
      `<rect y="402" width="960" height="18" fill="${dark ? '#000' : '#fff'}" opacity="${dark ? .3 : .55}"/><rect y="402" width="960" height="18" fill="url(#shV)"/><path d="M0 420h960" stroke="#000" stroke-width="2" opacity=".28"/>` +
      `<path d="M120 420h200l60 180H20z" fill="#fff" opacity="${dark ? .05 : .1}"/>`;
  };
})();

/* ---- more furniture, decorations and room themes (added alongside the originals above) ---- */
(function () {
  'use strict';
  const S = window.ART;
  const WOOD = '#b98a52';
  const dk = S.dk, hl = S.hl, ln = S.ln, P = S.P, R = S.R, E = S.E, C = S.C, dot = S.dot;
  const gs = (rx) => `<ellipse cx="0" cy="0" rx="${rx}" ry="3.4" fill="#000" opacity=".24"/>`;
  const darker = (c, t) => S.darker(c, t), lighter = (c, t) => S.lighter(c, t);
  const legs = (xs, h) => xs.map((x) => R(x - 1.600, -(h || 6), 3.200, h || 6, 1, '#5a3d22', { shade: 'shH', sw: .9 })).join('');

  Object.assign(S.furnBox, {
    coffeetable: '-34 -30 68 34', armchair: '-30 -42 60 46', dresser: '-30 -42 60 46', floorlamp: '-24 -76 48 80', mirror: '-22 -62 44 66',
    tv: '-36 -56 72 60', gamingdesk: '-38 -54 76 58', fishtank: '-36 -50 72 54', piano: '-38 -56 76 60',
    cactus: '-18 -48 36 52', vase: '-18 -50 36 54', bunting: '-48 -52 96 50', monstera: '-30 -56 60 60', bonsai: '-24 -44 48 48',
    lavalamp: '-14 -54 28 58', neon: '-34 -50 68 54', rocket: '-24 -66 48 70'
  });

  const N = {
    coffeetable: (c) => gs(30) + legs([-24, 24], 14) + R(-30, -22, 60, 8, 3, c, { shade: 'shV' }) + hl('M-27-21h28l-1 2h-26z', .45) + R(-14, -26, 14, 4, 1, '#e07a5f', { shade: 'shH', sw: .9 }) + R(-12, -29, 12, 3, 1, '#3a9bff', { shade: 'shH', sw: .9 }) + R(12, -30, 7, 8, 1.500, '#fff', { shade: 'shR', sw: .9 }) + ln('M19-27q4 0 4 3t-4 3', '#fff', 1, .8),
    armchair: (c) => gs(24) + R(-17, -40, 34, 28, 9, c, { shade: 'shV' }) + hl('M-13-38h26l-2 3h-22z', .35) + R(-23, -28, 9, 26, 4.500, c, { shade: 'shH' }) + R(14, -28, 9, 26, 4.500, c, { shade: 'shH' }) + R(-16, -22, 32, 14, 5, c, { shade: 'shV' }) + dk('M-16-11h32v3h-32z', .16) + ln('M0-21v12', '#000', 1, .2) + legs([-18, 18], 5),
    dresser: (c) => gs(26) + legs([-21, 21], 5) + R(-26, -36, 52, 32, 2, c, { shade: 'shH' }) + R(-26, -38, 52, 5, 2, darker(c, .1), { shade: 'shV' }) + [0, 1, 2].map((i) => R(-22, -31 + i * 9, 44, 8, 1.500, c, { shade: 'shV', sw: .9 }) + C(0, -27 + i * 9, 1.500, '#ffd166', { sw: .7, shade: 'shR' })).join('') + C(-12, -44, 4, '#7fb069', { shade: 'shR', sw: .9 }) + R(-14, -40, 4, 3, 1, '#c98b5e', { sw: .8 }),
    floorlamp: (c) => gs(10) + `<circle cx="0" cy="-60" r="28" fill="url(#shGlow)" opacity=".32"/>` + E(0, -2, 9, 3, '#5a5a6a', { shade: 'shV' }) + R(-1.400, -58, 2.800, 56, 1, '#8a8a9a', { shade: 'shH', sw: .9 }) + P('M-13-54l4-16h18l4 16z', c, { shade: 'shH' }) + E(0, -54, 13, 2.600, c, { shade: 'shV', sw: 1 }) + E(0, -54, 10, 1.600, '#fff7c9', { shade: false, line: false, op: .85 }),
    mirror: (c) => gs(14) + ln('M-14 0l6-22M14 0l-6-22', '#5a3d22', 2.600) + E(0, -38, 15, 22, c, { shade: 'shD' }) + E(0, -38, 12, 19, '#cfe9f7', { shade: 'shV', sw: 1 }) + hl('M-8-48q3-8 9-10-6 4-9 10z', .75) + hl('M6-30q3-4 4-10-1 6-4 10z', .35),
    tv: (c) => gs(32) + R(-32, -20, 64, 18, 2, c, { shade: 'shH' }) + R(-28, -17, 26, 12, 1.500, c, { shade: 'shV', sw: .9 }) + R(2, -17, 26, 12, 1.500, c, { shade: 'shV', sw: .9 }) + C(-15, -11, 1.200, '#ffd166', { shade: false, sw: .5 }) + C(15, -11, 1.200, '#ffd166', { shade: false, sw: .5 }) +
      R(-24, -52, 48, 31, 3, '#1a1d33', { shade: 'shD' }) + R(-21, -49, 42, 25, 1.500, '#2a6fd0', { shade: 'shV', sw: .8 }) + P('M-21-24l10-12 8 7 8-10 16 15z', '#2ec4a6', { shade: false, line: false, op: .85 }) + C(10, -42, 4, '#ffe29a', { shade: false, line: false }) + hl('M-19-47l16 0-10 20h-6z', .18),
    gamingdesk: (c) => gs(34) + R(-34, -24, 68, 6, 3, c, { shade: 'shV' }) + R(-31, -18, 3, 18, 1, darker(c, .2), { shade: 'shH', sw: .9 }) + R(28, -18, 3, 18, 1, darker(c, .2), { shade: 'shH', sw: .9 }) +
      R(-18, -48, 36, 24, 3, '#10142b', { shade: 'shD' }) + R(-15, -45, 30, 18, 1.500, '#7a45e0', { shade: 'shV', sw: .8 }) + P('M-15-30l8-8 6 5 6-8 10 11z', '#ff5cc8', { shade: false, line: false, op: .8 }) + R(-4, -25, 8, 4, 1, '#222', { sw: .8 }) +
      R(-14, -28, 28, 0, 0, 'none', { shade: false, line: false }) + R(-20, -27, 40, 3, 1.500, '#2a2f5a', { shade: 'shV', sw: .9 }) + [-16, -8, 0, 8, 16].map((x, i) => dot(x, -25.500, .9, ['#ff5c5c', '#ffd166', '#6ff0d0', '#3a9bff', '#ff5cc8'][i])).join('') + E(26, -29, 4, 3, '#2a2f5a', { sw: .8 }),
    fishtank: (c) => gs(32) + R(-30, -14, 60, 14, 2, '#5a3d22', { shade: 'shH' }) + R(-30, -48, 60, 34, 3, 'rgba(160,215,255,.35)', { shade: 'shV', line: '#cfe6ff', sw: 1.400 }) + R(-28, -34, 56, 18, 0, 'rgba(60,140,230,.5)', { shade: false, line: false }) + P('M-28-16q14-3 28 0t28 0v2h-56z', '#e8cf9a', { shade: false, line: false }) +
      P('M-16-24l-4-10 8 4z', '#2ec4a6', { shade: false, line: false }) + P('M16-24l2-12 6 12z', '#4f9d69', { shade: false, line: false }) + E(-6, -28, 5, 3, '#ff9d3c', { shade: 'shR', sw: .8 }) + P('M-11-28l-4-3v6z', '#ff9d3c', { shade: false, sw: .6 }) + E(10, -36, 4, 2.400, '#ffd166', { shade: 'shR', sw: .8 }) + [[-20, -40], [-14, -44], [20, -44]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="1.400" fill="none" stroke="#fff" stroke-width=".7" opacity=".8"/>`).join('') + hl('M-26-46h12l-8 14h-4z', .3),
    piano: (c) => gs(36) + legs([-28, 28], 8) + R(-34, -50, 68, 44, 3, c, { shade: 'shH' }) + R(-31, -47, 62, 16, 2, darker(c, .15), { shade: 'shV', sw: .9 }) + R(-31, -26, 62, 8, 1, '#fffaf0', { shade: 'shV', sw: .9 }) + [-24, -17, -10, -3, 4, 11, 18, 25].map((x) => ln(`M${x} -26v8`, '#000', .7, .5)).join('') + [-20, -13, 1, 8, 15].map((x) => R(x - 1.600, -26, 3.200, 5, .8, '#222', { shade: false, sw: .5 })).join('') +
      R(-34, -6, 68, 3, 1, darker(c, .3), { shade: 'shV', sw: .9 }) + S.R(-34, -52, 68, 4, 2, c, { shade: 'shV' }) + ln('M-20-40h12M2-40h18', '#fff', 1, .25),
    cactus: (c) => gs(11) + P('M-8-16h16l-2 14q-.5 2-2.500 2h-7q-2 0-2.500-2z', '#c98b5e', { shade: 'shH' }) + R(-9.500, -18, 19, 4.500, 2, '#d9996b', { shade: 'shV', sw: 1.100 }) + R(-5, -42, 10, 26, 5, c, { shade: 'shH' }) + P('M-5-30h-4q-5 0-5-6v-6q0-3 3-3t3 3v4q0 2 3 2z', c, { shade: 'shH', sw: 1 }) + P('M5-26h4q5 0 5-5v-5q0-3-3-3t-3 3v3q0 2-3 2z', c, { shade: 'shH', sw: 1 }) +
      ln('M0-40v20M-2-30v6', '#000', .8, .2) + dot(0, -43, 2.400, '#ff7a9c') + dot(0, -43, 1, '#ffe29a'),
    vase: (c) => gs(10) + P('M-6-2Q-9-12-5-18l-1-4h12l-1 4q4 6 1 16z', '#8ecae6', { shade: 'shH' }) + hl('M-4-16q0 7-1 11l2-1q0-5 0-10z', .5) +
      [[-8, -34, '#fff'], [0, -42, c], [8, -34, c], [-3, -30, '#ffd166'], [4, -28, '#fff']].map((f) => ln(`M0-20Q${f[0] / 2} -26 ${f[0]} ${f[1] + 3}`, '#4f9d69', 1.200) + `<g transform="translate(${f[0]} ${f[1]})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-3.400" rx="2.200" ry="3.200" fill="${f[2]}" stroke="${S.LINE}" stroke-width=".6" transform="rotate(${a})"/>`).join('')}<circle r="1.500" fill="#ffc247"/></g>`).join(''),
    bunting: (c) => ln('M-46-44Q0-30 46-44', '#8a6a3a', 1.200) + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => { const t = (i + .5) / 9, x = -46 + t * 92, y = -44 + Math.sin(t * Math.PI) * 13; return P(`M${x - 5} ${y}h10l-5 12z`, ['#ff5c8a', '#ffd166', '#3a9bff', '#2ec4a6', '#a276ff'][i % 5], { shade: 'shV', sw: .9 }); }).join(''),
    monstera: (c) => gs(13) + [[-50, 26], [50, 26], [-24, 34], [24, 34], [0, 38], [-10, 28], [12, 30]].map((l) => `<g transform="translate(0 -14) rotate(${l[0]})">` + P(`M0 0q-${l[1] * .5} -${l[1] * .4} -${l[1] * .1} -${l[1]} ${l[1] * .6} -${l[1] * .3} ${l[1] * .1} ${l[1]}z`.replace(/\s+/g, ' '), c, { shade: 'shD', sw: 1 }) + ln(`M0 -2v-${l[1] - 4}`, '#000', .8, .22) + `<ellipse cx="-3" cy="-${l[1] * .6}" rx="1.200" ry="2" fill="#000" opacity=".2"/></g>`).join('') +
      P('M-9-16h18l-2 14q-.5 2-2.500 2h-9q-2 0-2.500-2z', '#e8e2d4', { shade: 'shH' }) + R(-10.500, -18, 21, 4.500, 2, '#f4efe6', { shade: 'shV', sw: 1.100 }),
    bonsai: (c) => gs(14) + P('M-12-8h24l-2 8H-10z', '#7a5a3a', { shade: 'shH' }) + R(-13, -11, 26, 4, 1.500, '#8a6a4a', { shade: 'shV', sw: 1 }) + ln('M0-10Q-4-20 4-26Q10-32 0-38', '#6a4a2a', 3.400) + [[-12, -30, 9], [8, -36, 10], [14, -24, 7], [-4, -40, 8]].map((b) => C(b[0], b[1], b[2], c, { shade: 'shR' })).join(''),
    lavalamp: (c) => gs(9) + P('M-7-2h14l-2-10h-10z', '#5a5a6a', { shade: 'shH' }) + P('M-5-12h10l4-34h-18z', 'rgba(180,230,255,.4)', { shade: 'shV', line: '#cfe6ff', sw: 1.100 }) + P('M-4-12h8l3-14h-14z', c, { shade: 'shR', line: false, op: .85 }) + C(0, -32, 3.600, c, { shade: 'shR', line: false }) + C(-1, -40, 2.400, c, { shade: 'shR', line: false }) + P('M-3-46h6l1-4h-8z', '#5a5a6a', { shade: 'shH', sw: .9 }) + hl('M-5-42q-1 12 0 24l2-1q-1-10 0-22z', .4),
    neon: () => `<g stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="${S.star(0, -26, 22, 9)}" stroke="#ff5cc8" stroke-width="7" opacity=".25"/><path d="${S.star(0, -26, 22, 9)}" stroke="#ff5cc8" stroke-width="3"/><path d="${S.star(0, -26, 22, 9)}" stroke="#fff" stroke-width="1" opacity=".85"/><path d="M-32-8Q-16-2 0-8T32-8" stroke="#2ad6ff" stroke-width="3"/><path d="M-32-8Q-16-2 0-8T32-8" stroke="#fff" stroke-width=".9" opacity=".8"/></g>`,
    rocket: (c) => gs(14) + ln('M-14 0l6-14M14 0l-6-14', '#6a6a7a', 2.800) + P('M0-62Q-12-48-11-24L-11-14H11L11-24Q12-48 0-62Z', '#fff', { shade: 'shH' }) + P('M0-62Q-8-54-10-42L10-42Q8-54 0-62Z', c, { shade: 'shH', sw: 1.100 }) + C(0, -32, 5, '#6fb3ff', { shade: 'shR', sw: 1.400 }) + hl('M-3-35q2-2 4-1-3 0-4 1z', .8) +
      P('M-11-24l-10 14 10-2z', c, { shade: 'shD', sw: 1 }) + P('M11-24l10 14-10-2z', c, { shade: 'shD', sw: 1 }) + P('M-5-14h10l-2 8-3 6-3-6z', '#ffb020', { shade: false, line: false }) + P('M-2-14h4l-1 6-1 3-1-3z', '#fff6c2', { shade: false, line: false }),
  };
  const oldF = S.furniture;
  S.furniture = function (style, c) { return N[style] ? N[style](c || '#c9a06a') : oldF(style, c); };

  /* ------------------------------------------------------------ new room themes */
  const oldRoom = S.room;
  const rnd = (seed) => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const win = (x, y, w, h, glass, inner, round) => (round ? `<circle cx="${x + w / 2}" cy="${y + h / 2}" r="${w / 2 + 8}" fill="#f4efe6" stroke="${S.LINE}" stroke-width="1.500"/><circle cx="${x + w / 2}" cy="${y + h / 2}" r="${w / 2}" fill="${glass}"/>${inner}<circle cx="${x + w / 2}" cy="${y + h / 2}" r="${w / 2}" fill="url(#shV)" opacity=".6"/>`
    : R(x - 8, y - 8, w + 16, h + 16, 8, '#f4efe6', { shade: 'shD', sw: 1.500 }) + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${glass}"/>${inner}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#shV)" opacity=".6"/>` + R(x + w / 2 - 3, y, 6, h, 1, '#f4efe6', { shade: 'shH', sw: 1 }) + R(x, y + h / 2 - 3, w, 6, 1, '#f4efe6', { shade: 'shV', sw: 1 }) + R(x - 14, y + h + 6, w + 28, 9, 3, '#e8e0d2', { shade: 'shV', sw: 1.300 }));
  const T = {
    'theme-beach': () => { let d = ''; for (let x = 0; x < 960; x += 60) d += `<rect x="${x}" y="0" width="2.500" height="410" fill="#000" opacity=".08"/>`;
      return d + win(600, 70, 230, 170, '#7fd0ff', `<rect x="600" y="170" width="230" height="70" fill="#2a8fd0"/><path d="M600 176q30-10 58 0t58 0 58 0 56 0v10h-230z" fill="#fff" opacity=".5"/><circle cx="780" cy="110" r="18" fill="#fff6c2"/>`, false) +
        `<g transform="translate(180 60) rotate(-12)"><path d="M0 0q30 60 0 150 -30-90 0-150z" fill="#ff7a5c" stroke="${S.LINE}" stroke-width="2"/><path d="M0 10v130" stroke="#fff" stroke-width="3" opacity=".8"/></g>` +
        `<g transform="translate(320 100)"><path d="M0 0l30 50-30 50-30-50z" fill="#ffd166" stroke="${S.LINE}" stroke-width="1.500"/><circle cy="50" r="7" fill="#fff"/></g>`; },
    'theme-candy': () => { let d = ''; for (let y = 20; y < 400; y += 60) for (let x = (y / 60 % 2) * 30; x < 960; x += 60) d += `<circle cx="${x}" cy="${y}" r="9" fill="#fff" opacity=".45"/>`;
      for (let x = 0; x < 960; x += 40) d += `<path d="M${x} 0h20l-20 22z" fill="${(x / 40) % 2 ? '#ff7aa8' : '#fff'}"/>`;
      return d + win(110, 80, 150, 160, '#ffd9ec', `<circle cx="150" cy="150" r="30" fill="#ff9fc8"/><circle cx="215" cy="180" r="22" fill="#c9b8ff"/>`, false) + `<g transform="translate(700 150)"><circle r="46" fill="#ff9fc8" stroke="${S.LINE}" stroke-width="2"/><path d="M0-46a46 46 0 010 92" fill="none" stroke="#fff" stroke-width="10" opacity=".7"/><path d="M-46 0a46 46 0 0192 0" fill="none" stroke="#ffd166" stroke-width="8" opacity=".8"/></g>`; },
    'theme-library': () => { let d = ''; const r = rnd(7); const cols = ['#c1443c', '#2a6fd0', '#2ec4a6', '#ffc247', '#8a4bff', '#e07a5f', '#4f9d69'];
      for (let row = 0; row < 3; row++) { const y = 60 + row * 110; d += `<rect x="0" y="${y + 86}" width="960" height="10" fill="#3a2414"/>`; let x = 6; while (x < 940) { const w = 12 + r() * 14, h = 52 + r() * 30; d += `<rect x="${x.toFixed(0)}" y="${(y + 86 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" rx="2" fill="${cols[Math.floor(r() * cols.length)]}" stroke="#000" stroke-opacity=".3"/>`; x += w + 1; } }
      return d + `<g transform="translate(480 150)"><rect x="-70" y="-60" width="140" height="120" rx="6" fill="#f4efe6" stroke="${S.LINE}" stroke-width="2"/><rect x="-60" y="-50" width="120" height="100" fill="url(#artSun)"/></g>`; },
    'theme-snow': () => win(110, 70, 190, 180, '#bfe0f5', `<path d="M110 250l40-110 40 110zM180 250l50-130 50 130zM250 250l30-80 30 80z" fill="#fff" stroke="#9fc0d8"/><path d="M130 250l20-60 20 60z" fill="#4f9d69" opacity=".7"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${130 + i * 22}" cy="${90 + (i * 37) % 130}" r="2" fill="#fff"/>`).join('')}`, false) +
      `<path d="M400 40q80 30 160 0t160 0 160 0" fill="none" stroke="#2f7d4f" stroke-width="7"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${420 + i * 60}" cy="${58 + (i % 2) * 10}" r="6" fill="${['#ff5c5c', '#ffd166', '#6fb3ff', '#fff'][i % 4]}"/>`).join('') + `<path d="M-0 410h960" stroke="#fff" opacity=".6" stroke-width="4"/>`,
    'theme-arcade': () => { let d = ''; for (let x = 0; x <= 960; x += 60) d += `<path d="M${x} 0V410" stroke="#8a4bff" stroke-width="1.200" opacity=".35"/>`; for (let y = 0; y <= 410; y += 60) d += `<path d="M0 ${y}H960" stroke="#2ad6ff" stroke-width="1.200" opacity=".3"/>`;
      const inv = (x, y, c) => `<g transform="translate(${x} ${y})" fill="${c}">${[[2, 0], [8, 0], [3, 1], [7, 1], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [1, 3], [2, 3], [4, 3], [5, 3], [6, 3], [8, 3], [9, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [0, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [10, 5], [0, 6], [2, 6], [8, 6], [10, 6], [3, 7], [4, 7], [6, 7], [7, 7]].map((p) => `<rect x="${p[0] * 6}" y="${p[1] * 6}" width="6" height="6"/>`).join('')}</g>`;
      return d + inv(120, 80, '#6ff0d0') + inv(760, 130, '#ff5cc8') + inv(430, 60, '#ffd166') + `<path d="M0 100H960" stroke="#ff5cc8" stroke-width="5" opacity=".9"/><path d="M0 100H960" stroke="#fff" stroke-width="1.200" opacity=".7"/>`; },
    'theme-under': () => { const r = rnd(11); let d = ''; for (let i = 0; i < 6; i++) d += `<path d="M${120 + i * 140} 0l40 410h-60z" fill="#fff" opacity=".07"/>`; for (let i = 0; i < 26; i++) d += `<circle cx="${(r() * 960).toFixed(0)}" cy="${(r() * 400).toFixed(0)}" r="${(r() * 6 + 2).toFixed(1)}" fill="none" stroke="#fff" stroke-width="1.200" opacity=".5"/>`;
      d += [[200, 120], [600, 200], [820, 90]].map((p, i) => `<g transform="translate(${p[0]} ${p[1]})"><ellipse rx="22" ry="12" fill="${['#ff9d3c', '#ffd166', '#ff7aa8'][i]}" stroke="${S.LINE}" stroke-width="1.500"/><path d="M22 0l16-12v24z" fill="${['#ff9d3c', '#ffd166', '#ff7aa8'][i]}" stroke="${S.LINE}" stroke-width="1.500"/><circle cx="-11" cy="-2" r="2.600" fill="#1d1a33"/></g>`).join('');
      return d + [[60, 410], [140, 410], [880, 410], [800, 410]].map((p, i) => `<path d="M${p[0]} ${p[1]}q-14-40 0-80t0-80" fill="none" stroke="#2fae5a" stroke-width="9" stroke-linecap="round"/>`).join(''); },
  };
  S.room = function (t) {
    const base = oldRoom(t);
    if (!T[t.id]) return base;
    const i = base.indexOf('/>') + 2;
    return base.slice(0, i) + T[t.id]() + base.slice(i);
  };
})();
