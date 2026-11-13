/* Astrolab — shop art, part 2: tops, bottoms and shoes.
   Every garment is cut from the body's own outline (ART.TORSO, ART.ARM, ART.LEG_*), so a sleeve is just
   the arm drawn fatter, trousers are the legs drawn fatter, and nothing ever floats off the figure. */
(function () {
  'use strict';
  const S = window.ART;
  const INK = 'rgba(20,10,34,.55)';

  /* ---- colour helpers: a second tone for trims, drawn from the garment's own colour ---- */
  const hex = (c) => /^#[0-9a-f]{6}$/i.test(c || '');
  const mix = (c, to, t) => {
    if (!hex(c)) return c;
    const a = [1, 3, 5].map((i) => parseInt(c.substr(i, 2), 16)), b = [1, 3, 5].map((i) => parseInt(to.substr(i, 2), 16));
    return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
  };
  const dark = (c, t) => mix(c, '#14102a', t == null ? .28 : t);
  const light = (c, t) => mix(c, '#ffffff', t == null ? .35 : t);
  S.mix = mix; S.darker = dark; S.lighter = light;

  /* ------------------------------------------------------------------ TOPS */
  const AL = 33, ALL = 92;           // how much of the arm a sleeve covers: short / long (percent of the path)
  const sleeves = (c, to, cuff, o) => {
    o = o || {};
    const one = (arm) => S.limb(arm, o.w || 12.600, c, { to, cap: 'butt' }) +
      (cuff ? S.limb(arm, (o.w || 12.600) + .4, cuff, { from: to - (o.cuffLen || 5), to, cap: 'butt', shade: true }) : '');
    return one(S.ARM) + one(S.ARM_R);
  };
  const torso = (c, o) => S.P(S.TORSO, c, o || { shade: 'shH' }) + S.hl('M42 104q2-8 8-11-5 4-6 13z', .26) + S.dk('M69 100q4 10 3 36l3-1q1-28-6-35z', .1);
  const hem = (c, y, h) => S.R(37, y, 38, h || 5, 2.200, c, { shade: 'shV' }) + S.dk(`M37 ${y}h38v${h || 5}H37z`, .14);
  const crew = (c) => S.P('M48.500 89.500Q56 99.500 63.500 89.500L62 87.500Q56 94.500 50 87.500Z', c, { shade: 'shV' }) + S.dk('M50 88Q56 94.500 62 88L61 87Q56 92 51 87Z', .22);
  const vneck = (c) => S.P('M49 89.500L56 101 63 89.500 61.500 88 56 96 50.500 88Z', c, { shade: 'shV' });
  const folds = () => S.ln('M44 132q12 5 24 0', '#000', 1.200, .13) + S.ln('M46 110q4 8 2 18', '#000', 1.100, .1) + S.ln('M66 112q-3 8-1 16', '#000', 1.100, .1);
  const button = (x, y, c) => S.C(x, y, 1.400, c || '#fffaf0', { sw: .7, shade: false });

  S.top = function (style, c) {
    c = c || '#f4f0e6';
    const M = {
      tee: () => torso(c) + folds() + crew(c) + hem(c, 158, 4.500) + sleeves(c, AL),
      tank: () => S.P('M42 92C44 90 47 89.500 50 89L52 88.500Q56 99 60 88.500L62 89C65 89.500 68 90 70 92L73 132C73.300 145 74.500 154 75 162L37 162C37.500 154 38.700 145 39 132Z', c, { shade: 'shH' }) +
        folds() + hem(c, 158, 4.500) +
        S.ln('M41 98q-1 10 1 18', '#000', 1, .1) + S.hl('M44 104q2-8 8-11-5 4-6 13z', .25),
      stripe: () => torso(c) + `<g clip-path="inset(0)">` + [104, 112, 120, 128, 136, 144, 152].map((y) => `<path d="M39 ${y}H73L73.300 ${y + 3.400}H38.700Z" fill="#fff" opacity=".9"/>`).join('') + '</g>' +
        folds() + crew('#fff') + hem(c, 158, 4.500) +
        sleeves(c, AL + 6, null) + S.limb(S.ARM, 13, '#fff', { from: 12, to: 16, cap: 'butt', shade: true }) + S.limb(S.ARM_R, 13, '#fff', { from: 12, to: 16, cap: 'butt', shade: true }),
      polo: () => torso(c) + folds() + S.P('M47 88L56 97 65 88 62 85.500Q56 91 50 85.500Z', light(c, .35), { shade: 'shV' }) + S.ln('M56 97v12', '#000', 1.200, .3) + button(56, 101) + button(56, 107) +
        S.P('M46 88L52 96 56 92 51 86Z', light(c, .3), { shade: 'shD', sw: 1 }) + S.P('M66 88L60 96 56 92 61 86Z', light(c, .3), { shade: 'shD', sw: 1 }) + hem(c, 158, 4.500) + sleeves(c, AL, dark(c, .1), { cuffLen: 3.600 }),
      jersey: () => torso(c) + folds() + vneck(light(c, .6)) + hem(c, 158, 4.500) + sleeves(c, AL, light(c, .6), { cuffLen: 3.600 }) +
        S.ln('M40 96q-1 20 0 40M72 96q1 20 0 40', '#fff', 1.800, .85) +
        `<text x="56" y="140" text-anchor="middle" font-family="Fredoka,Arial Black,sans-serif" font-weight="700" font-size="24" fill="#fff" stroke="${INK}" stroke-width=".8">7</text>`,
      hoodie: () => S.P('M42 86Q56 80 70 86L74 100 56 106 38 100Z', dark(c, .22), { shade: 'shV' }) + torso(c) + folds() +
        S.P('M46 90Q56 104 66 90L63 86Q56 92 49 86Z', dark(c, .3), { shade: 'shV' }) + S.ln('M52 99v15M60 99v15', '#fff', 1.600, .9) + S.dot(52, 115.500, 1.400, '#fff') + S.dot(60, 115.500, 1.400, '#fff') +
        S.P('M42 134h28q3 0 3 3.500v10.500H39v-10.500q0-3.500 3-3.500z', c, { shade: 'shV' }) + S.dk('M42 134h28q3 0 3 3.500v10.500H39v-10.500q0-3.500 3-3.500z', .16) + S.ln('M41 136l-2 11M71 136l2 11', '#000', 1, .2) +
        hem(dark(c, .12), 157, 6) + sleeves(c, ALL, dark(c, .12), { cuffLen: 6 }),
      jacket: () => torso(c) + folds() + S.ln('M56 92V162', INK, 1.500) + S.ln('M57.500 94V160', '#fff', 1, .3) +
        S.P('M46 88L56 102 52 106 41 95Z', dark(c, .1), { shade: 'shD' }) + S.P('M66 88L56 102 60 106 71 95Z', dark(c, .1), { shade: 'shD' }) + S.R(54.600, 103, 3, 6, 1, '#ffd166', { sw: .8 }) +
        S.ln('M40 134h9M63 134h9', '#000', 1.200, .3) + hem(dark(c, .15), 157, 6) + sleeves(c, ALL, dark(c, .15), { cuffLen: 6 }),
      shirt: () => torso(c) + folds() + S.ln('M56 96V162', '#000', 1.100, .25) + [104, 116, 128, 140, 152].map((y) => button(56, y)).join('') +
        S.P('M46 88L53 98 56 92 51 86Z', '#fff', { shade: 'shV' }) + S.P('M66 88L59 98 56 92 61 86Z', '#fff', { shade: 'shV' }) +
        S.R(60, 114, 9, 9, 1.500, c, { shade: 'shV', sw: 1 }) + S.ln('M60 117h9', '#000', 1, .2) + hem(c, 158, 4) + sleeves(c, ALL, light(c, .25), { cuffLen: 4.500 }),
      jumper: () => torso(c) + [0, 1, 2, 3, 4, 5, 6].map((i) => S.ln(`M${41 + i * 4.800} 112v44`, '#000', 1.100, .12)).join('') +
        S.ln('M38 118q18 6 36 0', '#fff', 2.200, .22) + S.ln('M38 126q18 6 36 0', '#fff', 1.400, .18) +
        S.P('M47 87Q56 97 65 87L67 90Q56 103 45 90Z', c, { shade: 'shV' }) + S.dk('M47 87Q56 97 65 87L67 90Q56 103 45 90Z', .24) +
        hem(c, 156, 7) + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => S.ln(`M${40 + i * 4.500} 157v6`, '#000', 1, .2)).join('') + sleeves(c, ALL, c, { cuffLen: 6 }),
      cardigan: () => S.P(S.TORSO, '#f4f0e6', { shade: 'shH' }) + crew('#f4f0e6') +
        S.P('M40 99C40 93 44 91 49 89.500L52 88.500 54 160 37 162C37.500 154 38.700 145 39 132Z', c, { shade: 'shH' }) + S.P('M72 99C72 93 68 91 63 89.500L60 88.500 58 160 75 162C74.500 154 73.300 145 73 132Z', c, { shade: 'shH' }) +
        S.ln('M54 92V160M58 92V160', INK, 1.100) + [104, 116, 128, 140].map((y) => S.C(56, y, 1.500, '#fffaf0', { sw: .7, shade: false })).join('') + folds() + sleeves(c, ALL, dark(c, .12), { cuffLen: 5 }),
      varsity: () => torso(c) + folds() + S.ln('M56 92V162', INK, 1.400) + S.P('M47 88L56 100 65 88 62.500 86Q56 92 49.500 86Z', '#fff', { shade: 'shV' }) +
        hem('#fff', 157, 6) + sleeves('#fff', ALL, c, { cuffLen: 6 }) + `<text x="46" y="120" text-anchor="middle" font-family="Fredoka,Arial Black,sans-serif" font-weight="700" font-size="16" fill="#fff" stroke="${INK}" stroke-width=".7">A</text>`,
      blazer: () => torso(c) + folds() + S.ln('M56 100V162', INK, 1.300) + S.P('M47 88L56 114 64 88 61 86Q56 98 51 86Z', '#fff', { shade: 'shV' }) + S.P('M64 88L66 91 59 118 56 114Z', dark(c, .18), { shade: 'shD' }) + S.P('M48 88L46 91 53 118 56 114Z', dark(c, .18), { shade: 'shD' }) +
        S.P('M61 122h8v6h-8z', dark(c, .1), { shade: 'shV', sw: 1 }) + S.P('M44 118l5-1v6l-5 1z', '#ffc247', { shade: 'shD', sw: .8 }) + button(56, 130, '#ffd166') + button(56, 144, '#ffd166') + hem(c, 158, 4) + sleeves(c, ALL, c, { cuffLen: 2 }),
      labcoat: () => S.P('M37 108L33 178 56 182 79 178 75 108Z', '#fff', { shade: 'shH' }) + S.P(S.TORSO, '#fff', { shade: 'shH' }) + S.P('M44 90L56 140 68 90 63 86Q56 100 49 86Z', '#eaf2ff', { shade: 'shV' }) +
        S.ln('M56 128V180', INK, 1.200) + [136, 148, 160].map((y) => button(56, y, '#c8d6ee')).join('') + S.R(60, 144, 11, 11, 1.600, '#fff', { shade: 'shV', sw: 1 }) + S.ln('M62 146v-6M65 146v-4', '#3a9bff', 1.300) +
        S.P('M44 90L51 100 56 94 51 86Z', '#fff', { shade: 'shD', sw: 1 }) + S.P('M68 90L61 100 56 94 61 86Z', '#fff', { shade: 'shD', sw: 1 }) + sleeves('#fff', ALL, '#dbe6f8', { cuffLen: 5 }),
      hawaiian: () => torso(c) + `<g opacity=".9">${[[46, 112], [64, 122], [50, 138], [66, 148], [44, 150], [62, 104]].map((p, i) => `<g transform="translate(${p[0]} ${p[1]}) rotate(${i * 50})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-3.600" rx="1.800" ry="2.800" fill="${i % 2 ? '#ffe9a8' : '#ff9fb8'}" transform="rotate(${a})"/>`).join('')}<circle r="1.300" fill="#ffc247"/></g>`).join('')}</g>` +
        S.P('M46 88L53 98 56 92 51 86Z', light(c, .4), { shade: 'shD', sw: 1 }) + S.P('M66 88L59 98 56 92 61 86Z', light(c, .4), { shade: 'shD', sw: 1 }) + S.ln('M56 96V162', '#000', 1, .22) + folds() + hem(c, 158, 4) + sleeves(c, AL + 4, null),
      overalls: () => S.P(S.TORSO, '#f4f0e6', { shade: 'shH' }) + crew('#f4f0e6') + sleeves('#f4f0e6', AL, null) +
        S.P('M41 130H71L74 162H38Z', c, { shade: 'shH' }) + S.P('M43 130L42 95 47 94 50 130Z', c, { shade: 'shV' }) + S.P('M69 130L70 95 65 94 62 130Z', c, { shade: 'shV' }) +
        S.R(47, 118, 18, 14, 2.500, c, { shade: 'shV', sw: 1.100 }) + S.ln('M49 121h14', '#fff', 1, .35, 0) + S.C(45, 98, 1.700, '#ffd166', { sw: .8, shade: 'shR' }) + S.C(67, 98, 1.700, '#ffd166', { sw: .8, shade: 'shR' }) + S.ln('M41 134h30', '#fff', 1, .3),
      puffer: () => S.P(S.TORSO, c, { shade: 'shH' }) + [102, 114, 126, 138, 150].map((y) => S.ln(`M39 ${y}q17 4 34 0`, '#000', 1.300, .2) + S.ln(`M40 ${y - 3}q16 3 32 0`, '#fff', 1, .2)).join('') +
        S.ln('M56 92V162', INK, 1.300) + S.P('M46 87Q56 101 66 87L64 84Q56 92 48 84Z', dark(c, .1), { shade: 'shV' }) + hem(dark(c, .15), 158, 5) +
        sleeves(c, ALL, dark(c, .1), { cuffLen: 5, w: 13.400 }) + [34, 46, 58, 70].map((p) => S.limb(S.ARM, 13.400, 'none', { from: p, to: p + .1, cap: 'butt', shade: false, lineCol: 'rgba(0,0,0,.28)', sw: 0 })).join(''),
      tracksuit: () => torso(c) + folds() + S.ln('M56 92V162', INK, 1.300) + S.ln('M40 99L40 160M72 99L72 160', '#fff', 1.800, .9) + S.P('M47 88L56 98 65 88 62.500 85Q56 91 49.500 85Z', dark(c, .1), { shade: 'shV' }) +
        hem(dark(c, .15), 158, 5) + sleeves(c, ALL, dark(c, .15), { cuffLen: 5 }) + S.limb(S.ARM, 12.800, '#fff', { from: 4, to: 7, cap: 'butt', shade: false, line: false }),
      dress: () => S.P('M40 99C40 93 44 91 49 89.500L52 88.500Q56 91.500 60 88.500L63 89.500C68 91 72 93 72 99L71 128 86 184Q56 192 26 184L41 128Z', c, { shade: 'shV' }) + crew(c) + S.R(39, 124, 34, 5, 2, dark(c, .18), { shade: 'shV' }) +
        [0, 1, 2, 3, 4, 5, 6].map((i) => S.ln(`M${40 + i * 5.400} 131l${(i - 3) * 3.800} 52`, '#000', 1.100, .1)).join('') + S.ln('M27 183q29 7 58 0', '#fff', 1.400, .4) + S.hl('M42 106q2-8 8-11-5 4-6 13z', .26) + sleeves(c, AL - 8, null),
      spacesuit: () => torso(c) + S.P('M44 88Q56 100 68 88V96Q56 106 44 96Z', '#2e3a66', { shade: 'shV' }) + S.R(40, 106, 32, 18, 4, '#2e3a66', { shade: 'shV' }) + S.R(44, 110, 10, 6, 1.500, '#1a2140', { sw: .8 }) +
        S.dot(60, 113, 2.200, '#6ff0d0') + S.dot(66, 113, 2.200, '#ff7a5c') + S.dot(60, 119.500, 2.200, '#ffd166') + S.dot(66, 119.500, 2.200, '#8fb8ff') +
        S.R(37, 132, 38, 6, 2, '#2e3a66', { shade: 'shV' }) + S.R(52, 131, 8, 8, 2, '#ffd166', { sw: .9 }) + S.ln('M40 146h32M40 152h32', '#2e3a66', 2, .85) + S.ln('M39 124v36M73 124v36', '#ff9d3c', 2, .9) +
        hem('#2e3a66', 158, 5) + sleeves(c, ALL, '#2e3a66', { cuffLen: 7 }) + S.limb(S.ARM, 12.800, '#ff9d3c', { from: 36, to: 39, cap: 'butt', shade: false, line: false }) + S.limb(S.ARM_R, 12.800, '#ff9d3c', { from: 36, to: 39, cap: 'butt', shade: false, line: false }),
      robe: () => S.P('M40 99C40 93 44 91 49 89.500L52 88.500Q56 91.500 60 88.500L63 89.500C68 91 72 93 72 99L71 128 90 190Q56 200 22 190L41 128Z', c, { shade: 'shV' }) + S.P('M47 88L56 108 65 88 62 86Q56 98 50 86Z', light(c, .35), { shade: 'shV' }) +
        S.ln('M56 108V190', INK, 1.200) + S.R(38, 126, 36, 5, 2, '#ffd166', { shade: 'shV', sw: 1 }) + S.ln('M24 188q32 9 64 0', '#ffd166', 2.200, .9) +
        [[46, 150], [66, 160], [52, 174], [72, 178], [40, 168]].map((p) => `<path d="${S.star(p[0], p[1], 3.600, 1.500)}" fill="#ffe29a" opacity=".95"/>`).join('') +
        S.P('M39 99C31 106 24 118 22 134L36 138C36 126 38 114 42 108Z', c, { shade: 'shH' }) + S.P('M73 99C81 106 88 118 90 134L76 138C76 126 74 114 70 108Z', c, { shade: 'shH' }) + S.ln('M24 133q6 4 12 3M88 133q-6 4-12 3', '#ffd166', 2),
      armour: () => S.P(S.TORSO, '#7f8cae', { shade: 'shH' }) + sleeves('#5b6788', 55, null) +
        S.P('M40 99C40 93 44 91 49 89.500L52 88.500Q56 91.500 60 88.500L63 89.500C68 91 72 93 72 99L73 136Q56 142 39 136Z', 'url(#mSilver)', { shade: 'shH' }) +
        S.ln('M56 92V138', INK, 1.200) + S.ln('M42 112q14 6 28 0M42 124q14 6 28 0', INK, 1.100, .7) + S.P('M52 106h8l-1 8-3 3-3-3z', 'url(#mGold)', { shade: 'shD', sw: 1 }) +
        S.P('M39 140Q56 148 73 140L76 164 56 168 36 164Z', '#5b6788', { shade: 'shV' }) + S.ln('M46 144v20M56 146v22M66 144v20', INK, 1, .6) +
        S.P('M28 96Q28 84 42 88L42 108Q30 108 28 96Z', 'url(#mSilver)', { shade: 'shD' }) + S.P('M84 96Q84 84 70 88L70 108Q82 108 84 96Z', 'url(#mSilver)', { shade: 'shD' }) + S.ln('M30 98h10M82 98h-10', INK, 1, .6),
    };
    return (M[style] || M.tee)();
  };

  /* ---------------------------------------------------------------- BOTTOMS */
  // legs are the same strokes as the body, so trousers are just fatter legs
  const pair = (L, w, c, o) => S.limb(S.LEG_L, w, c, Object.assign({ cap: 'butt' }, o)) + S.limb(S.LEG_R, w, c, Object.assign({ cap: 'butt' }, o));
  const hips = (c) => S.P('M38 150H74L75.500 164Q75 171 71 171H41Q37 171 36.500 164Z', c, { shade: 'shV' });
  const band = (c) => S.R(37.500, 149, 37, 5.500, 2.200, c, { shade: 'shV' }) + S.dk('M37.500 149h37v5.500h-37z', .2);
  const belt = (c) => S.R(37.500, 149, 37, 5, 1.600, c || '#3a2a20', { shade: 'shV', sw: 1 }) + S.R(53.500, 149.500, 5, 4, 1, '#ffd166', { sw: .7, shade: 'shV' });
  const seamLeg = () => S.ln('M56 160v16', '#000', 1.200, .3);

  S.bottom = function (style, c) {
    c = c || '#4a6fa5';
    const M = {
      jeans: () => pair(c, 16.800, c, { to: 94 }) + hips(c) + band(dark(c, .12)) + seamLeg() + S.ln('M41 156q7 1 9 9M71 156q-7 1-9 9', '#fff', 1.100, .38) +
        S.dot(45, 158, .9, '#e8c47a') + S.dot(67, 158, .9, '#e8c47a') + S.ln('M44 184q3 2 6 0M62 184q3 2 6 0', '#fff', 1, .25) + S.ln('M42 166l-1 28M70 166l1 28', '#fff', 1, .16),
      trousers: () => pair(c, 16.800, c, { to: 94 }) + hips(c) + band(dark(c, .12)) + seamLeg() + S.ln('M47 164l-.4 30M65 164l.4 30', '#000', 1.100, .14) + S.ln('M41 158h7M64 158h7', '#000', 1.200, .22),
      track: () => pair(c, 16.800, c, { to: 94 }) + hips(c) + band(dark(c, .12)) + seamLeg() + S.ln('M41 150L38 196M71 150L74 196', '#fff', 2, .85) + S.ln('M52 152h8', '#fff', 1.300, .7),
      joggers: () => pair(c, 16.800, c, { to: 88 }) + hips(c) + band(dark(c, .12)) + seamLeg() + pair(c, 14.600, dark(c, .16), { from: 86, to: 96 }) + S.ln('M42 168q4 8 3 20M70 168q-4 8-3 20', '#000', 1.100, .12),
      baggy: () => pair(c, 19.600, c, { to: 94 }) + hips(c) + band(dark(c, .12)) + seamLeg() + S.ln('M38 170q2 12 0 26M74 170q-2 12 0 26', '#fff', 1.200, .22) + S.ln('M46 168q-2 12 0 24M66 168q2 12 0 24', '#000', 1.100, .12),
      cargo: () => pair(c, 17, c, { to: 94 }) + hips(c) + belt('#4a3a2a') + seamLeg() + S.R(38.500, 168, 11, 12, 1.600, c, { shade: 'shV', sw: 1.100 }) + S.R(62.500, 168, 11, 12, 1.600, c, { shade: 'shV', sw: 1.100 }) +
        S.ln('M38.500 171h11M62.500 171h11', '#000', 1, .25) + S.dot(44, 175, 1, '#ffd166') + S.dot(68, 175, 1, '#ffd166'),
      leggings: () => pair(c, 14.800, c, { to: 94 }) + hips(c) + band(dark(c, .15)) + seamLeg() + S.ln('M43 160l-1 34', '#fff', 1.400, .25),
      shorts: () => pair(c, 17.600, c, { to: 46 }) + hips(c) + band(dark(c, .12)) + seamLeg() + S.ln('M41 158q5 2 7 8M71 158q-5 2-7 8', '#fff', 1.100, .3) + S.ln('M42 178h12M58 178h12', '#000', 1.100, .2),
      bermuda: () => pair(c, 17.600, c, { to: 70 }) + hips(c) + belt('#4a3a2a') + seamLeg() + S.R(41, 166, 9, 9, 1.400, c, { shade: 'shV', sw: 1 }) + S.R(62, 166, 9, 9, 1.400, c, { shade: 'shV', sw: 1 }) + S.ln('M42 186h12M58 186h12', '#000', 1.100, .2),
      skirt: () => S.P('M38 150H74L86 186Q56 192 26 186Z', c, { shade: 'shV' }) + band(dark(c, .12)) + [42, 48, 54, 60, 66, 72].map((x, i) => S.ln(`M${x} 156l${(i - 2.500) * 2.600} 30`, '#000', 1.100, .13)).join('') + S.ln('M27 185q29 6 58 0', '#fff', 1.200, .3),
      pleated: () => S.P('M38 150H74L84 182Q56 188 28 182Z', c, { shade: 'shV' }) + band(dark(c, .12)) + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => S.ln(`M${39 + i * 4.200} 156l${(i - 4) * 2.600} 26`, '#000', 1.100, i % 2 ? .12 : .02)).join('') + S.ln('M29 181q27 6 54 0', '#fff', 1.100, .3),
      kilt: () => S.P('M38 150H74L83 180Q56 186 29 180Z', c, { shade: 'shV' }) + band(dark(c, .12)) + [160, 168, 176].map((y) => S.ln(`M35 ${y}H77`, '#fff', 1.300, .5)).join('') + [42, 52, 62, 72].map((x) => S.ln(`M${x} 152V180`, '#000', 1.500, .3)).join('') +
        S.P('M56 150l1 10h13l-1-10z', dark(c, .2), { shade: 'shV', sw: 1 }) + S.C(60, 157, 1.200, '#ffd166', { shade: false, sw: .6 }),
      tutu: () => S.P('M38 150H74L90 176Q56 192 22 176Z', c, { shade: 'shV' }) + band(dark(c, .12)) + [0, 1, 2, 3, 4, 5].map((i) => S.ln(`M${24 + i * 12.800} 178q4 6 8 0`, '#fff', 1.300, .5)).join('') + S.ln('M30 170q26 12 52 0', '#fff', 1.500, .35) + S.ln('M34 162q22 10 44 0', '#fff', 1.200, .28),
      greaves: () => pair('url(#mSilver)', 17.600, c, { to: 94 }) + hips('#5b6788') + belt('#3a2a20') + seamLeg() + S.ln('M42 176h11M59 176h11', INK, 1.200) + S.ln('M42 184h11M59 184h11', INK, 1.200) + S.C(47, 170, 2.600, 'url(#mGold)', { sw: .8, shade: false }) + S.C(65, 170, 2.600, 'url(#mGold)', { sw: .8, shade: false }),
      spacepants: () => pair(c, 16.800, c, { to: 94 }) + hips(c) + band(dark(c, .12)) + seamLeg() + S.ln('M41 152L38 196M71 152L74 196', '#ff9d3c', 2, .9) + S.R(40, 168, 9, 8, 1.400, dark(c, .2), { shade: 'shV', sw: 1 }) + S.R(63, 168, 9, 8, 1.400, dark(c, .2), { shade: 'shV', sw: 1 }) + S.ln('M44 184h9M59 184h9', '#000', 1.200, .25),
    };
    return (M[style] || M.trousers)();
  };

  /* ------------------------------------------------------------------ SHOES */
  const foot = (body, extra) => body + (extra || '');
  S.shoes = function (style, c) {
    c = c || '#f4f0e6';
    const sole = (col) => S.R(31.500, 206.500, 30, 4.500, 2.200, col || '#fff', { shade: 'shV', sw: 1.100 });
    const L = {
      trainers: () => S.P('M39 194H55.500V203Q61 204 61.500 207.500V208H33Q31.500 207 32 205 33 202 37 201.500L39 200Z', c, { shade: 'shH' }) + sole('#fff') + S.P('M39 194H55.500V198H39Z', dark(c, .1), { shade: 'shV', sw: 1 }) +
        S.ln('M41 199l9 2.500M41 202l9 2', '#fff', 1.300, .85) + S.hl('M34 203q3-2 8-1.500-5 0-8 1.500z', .55) + S.ln('M52 202l5 .8', dark(c, .3), 1.600, .7),
      boots: () => S.P('M38.500 188H55.500V203Q61 204 61.500 207.500V209H33Q31 208 32 205 33 202 37 201.500L38.500 200Z', c, { shade: 'shH' }) + S.R(38, 188, 18, 6, 2, dark(c, .1), { shade: 'shV' }) + S.ln('M41 195h12M41 199h12', '#000', 1.200, .25) + sole('#2a2530') + S.hl('M34 204q3-2 8-1.500-5 0-8 1.500z', .45),
      hi: () => S.P('M38.500 190H55.500V203Q61 204 61.500 207.500V208H33Q31.500 207 32 205 33 202 37 201.500L38.500 200Z', c, { shade: 'shH' }) + sole('#fff') + S.R(38, 190, 18, 5, 2, '#fff', { shade: 'shV', sw: 1 }) +
        S.dot(41.500, 197, 1.100, '#fff') + S.dot(41.500, 201, 1.100, '#fff') + S.ln('M42 197l9 2.500M42 201l9 2', '#fff', 1.300, .9) + S.C(47, 192.500, 2.200, '#fff', { sw: .8, shade: false }) + S.P('M33 206q8-3 13 0z', '#fff', { shade: false, line: false, op: .9 }),
      sandal: () => S.P('M33 205Q32 203 36 202.500L56 202.500Q61 203 61.500 207.500V208H33Q31.500 207 33 205Z', dark(c, .1), { shade: 'shV' }) + sole(dark(c, .25)) +
        S.ln('M41 202l-1-6M50 202l1-6', c, 3) + S.ln('M38.500 196h15', c, 3) + S.ln('M38.500 196h15', '#fff', 1, .4) + S.P('M39 194H55V199H39Z', S.SKIN, { shade: false, line: false, op: 0 }),
      slipper: () => S.P('M38 196H55.500V203Q62 203 62 207.500Q62 210 59 210H34Q31 210 32 206 33 202 37 201.500L38 200Z', c, { shade: 'shR' }) + S.ln('M36 204q3-2 7-1', '#fff', 1.600, .5) +
        S.C(40, 201, 1.200, '#fff', { shade: false, sw: .6 }) + S.P('M56 202q4 0 5 4', 'none', { shade: false, line: false }) + S.P('M33.500 204q-2-5 3-5l1 3z', dark(c, .2), { shade: 'shV', sw: 1 }) + S.P('M43 199l-1-5 4 2z', dark(c, .2), { shade: 'shV', sw: 1 }),
      loafer: () => S.P('M39 197H55.500V203Q60 203.500 60.500 207V208H33.500Q32 207 32.500 205 33.500 202 37 201.500L39 200Z', c, { shade: 'shH' }) + sole('#2a2530') + S.R(40, 197, 15, 2.600, 1.200, dark(c, .22), { shade: 'shV', sw: .8 }) + S.R(44, 196, 7, 3.200, 1, '#ffd166', { sw: .7, shade: 'shV' }) + S.hl('M35 203q3-2 7-1.500-5 0-7 1.500z', .5),
      rain: () => S.P('M38 186H56V203Q61 204 61.500 207.500V209H33Q31 208 32 205 33 202 37 201.500L38 200Z', c, { shade: 'shH' }) + S.R(37.500, 186, 19, 4, 1.800, dark(c, .1), { shade: 'shV' }) + sole(dark(c, .25)) + S.hl('M40 190q-1 8 0 14l2-1q-1-6 0-13z', .5) + S.hl('M34 204q3-2 8-1.500-5 0-8 1.500z', .5),
      skate: () => S.P('M38.500 191H55.500V202Q61 203 61.500 206.500V207H33Q31.500 206 32 204 33 201 37 200.500L38.500 199Z', c, { shade: 'shH' }) + S.R(34, 207, 26, 2.600, 1.200, '#c5cde6', { shade: 'shV', sw: 1 }) + S.C(37, 211, 2.200, '#ffc247', { sw: .9, shade: 'shR' }) + S.C(55, 211, 2.200, '#ffc247', { sw: .9, shade: 'shR' }) + S.C(46, 211, 2.200, '#ffc247', { sw: .9, shade: 'shR' }) +
        S.ln('M41 196l9 2.500M41 200l9 2', '#fff', 1.300, .85) + S.R(38, 191, 18, 4, 1.800, '#fff', { shade: 'shV', sw: 1 }),
      glow: () => S.P('M39 194H55.500V203Q61 204 61.500 207.500V208H33Q31.500 207 32 205 33 202 37 201.500L39 200Z', c, { shade: 'shH' }) + S.R(31.500, 206.500, 30, 4.500, 2.200, '#fff', { shade: false, sw: 1.100 }) +
        S.R(31.500, 208, 30, 2.600, 1.300, '#6ff0d0', { shade: false, line: false, op: .95 }) + `<rect x="30" y="206" width="33" height="7" rx="3.500" fill="#6ff0d0" opacity=".22"/>` + S.ln('M41 199l9 2.500M41 202l9 2', '#6ff0d0', 1.400, .95),
      moon: () => S.P('M36 190H58V203Q64 203.500 64 208Q64 211 61 211H32Q29 211 30 207 31 203 36 202Z', c, { shade: 'shR' }) + S.R(29.500, 207, 35, 5, 2.500, '#8a93b8', { shade: 'shV', sw: 1.200 }) + S.ln('M36 195q10 3 20 0M35 200q11 3 22 0', '#000', 1.200, .2) + S.hl('M33 205q4-3 10-2-6 0-10 2z', .5),
      clog: () => S.P('M38 196H55.500V203Q61 203.500 61.500 207V208.500H33Q31.500 207.500 32.500 205 33.500 202 37 201.500L38 200Z', c, { shade: 'shH' }) + sole(dark(c, .3)) + S.ln('M39 197h16', '#000', 1.200, .2) + S.dot(46, 200, 1.200, '#fff', .8) + S.hl('M34 204q3-2 7-1.500-5 0-7 1.500z', .5),
      flipflop: () => S.P('M33 205Q32 203 36 202.500L56 202.500Q61 203 61.500 207.500V208H33Q31.500 207 33 205Z', c, { shade: 'shV' }) + sole(dark(c, .25)) + S.ln('M46 202L40 196M46 202l8-6', '#fff', 1.800, .95),
      knight: () => S.P('M37 188H56V203Q62 204 62.500 208V209H32Q30 208 31 205 32 202 36 201.500L37 200Z', 'url(#mSilver)', { shade: 'shH' }) + S.ln('M38 194h17M38 199h17', INK, 1.100, .7) + sole('#5b6788') + S.P('M33 203q4-2 9-1', 'none', { shade: false, line: false }) + S.hl('M34 204q3-2 8-1.500-5 0-8 1.500z', .6),
    };
    const left = (L[style] || L.trainers)();
    return left + S.mirror(left);
  };
  S.bareFoot = () => { const one = S.P('M39 196H55V203Q60 203.500 60.500 207V208H34Q32 207.500 33 205 34 202 38 201.500Z', S.SKIN, { shade: 'shH' }); return one + S.mirror(one); };
})();
