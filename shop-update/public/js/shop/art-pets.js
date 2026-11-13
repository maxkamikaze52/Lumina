/* Astrolab — shop art, part 4: pets, auras, the composed character and item thumbnails. */
(function () {
  'use strict';
  const S = window.ART;
  const LINE = S.LINE, DARK = '#1d1a33';
  const dark = (c, t) => S.darker(c, t), light = (c, t) => S.lighter(c, t);

  // a thick outlined stroke (tails, limbs): dark underlay + coloured top
  const thick = (d, c, w) => S.ln(d, LINE, w + 2.2) + S.ln(d, c, w) + S.ln(d, '#fff', Math.max(.8, w * .22), .22);
  const eye = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${(r * 1.25).toFixed(2)}" fill="${DARK}"/><circle cx="${x + r * .38}" cy="${y - r * .5}" r="${(r * .42).toFixed(2)}" fill="#fff"/>`;
  const groundShadow = (rx) => `<ellipse cx="0" cy="0" rx="${rx}" ry="3.2" fill="#000" opacity=".28"/>`;
  const dim = (d, c, o) => S.P(d, c, o) + S.dk(d, .26);   // same shape, one step darker

  /* Pets stand on the ground at (0,0) and grow upwards; about 30 units tall. */
  const petsOld = function (style, c) {
    c = c || '#f0a868';
    const M = {
      cat: () => groundShadow(15) + thick('M11-6q15 1 13-14', c, 4.400) +
        S.E(0, -9, 12, 9, c, { shade: 'shH' }) + S.E(0, -6, 6, 5, '#fff', { shade: false, line: false, op: .5 }) +
        S.E(-6.500, -1.800, 4.600, 2.800, c) + S.E(6.500, -1.800, 4.600, 2.800, c) +
        S.P('M-9.500-27l-2-11 9 5z', c, { shade: 'shD' }) + S.P('M9.500-27l2-11-9 5z', c, { shade: 'shD' }) +
        S.P('M-9-29l-1-6 4.500 3z', '#ffb3c1', { shade: false, line: false }) + S.P('M9-29l1-6-4.500 3z', '#ffb3c1', { shade: false, line: false }) +
        S.E(0, -22, 11.500, 9.800, c, { shade: 'shR' }) + S.ln('M-2.500-30.500v3M0-31.500v3.500M2.500-30.500v3', '#000', 1.200, .28) +
        eye(-4.600, -22, 1.700) + eye(4.600, -22, 1.700) + '<path d="M-1.200-18.400h2.400l-1.200 1.400z" fill="#ff8fa3"/>' +
        S.ln('M0-17q-1.600 2-3.200 1M0-17q1.600 2 3.200 1', '#5a3030', .9) + S.ln('M-6-18l-8-1.500M-6-16.500l-8 1.500M6-18l8-1.500M6-16.500l8 1.500', '#fff', .8, .8),
      dog: () => groundShadow(16) + thick('M12-9q10-4 9-13', c, 4.200) +
        S.E(0, -9, 13, 9, c, { shade: 'shH' }) + S.E(0, -6, 6.500, 5.500, '#fff', { shade: false, line: false, op: .4 }) +
        S.E(-6.500, -1.800, 5, 3, c) + S.E(6.500, -1.800, 5, 3, c) +
        S.E(0, -22, 11, 10, c, { shade: 'shR' }) +
        dim('M-9.500-27q-9 1-8.500 12 0 4.500 4 3.500 4-1.500 4.500-15.500z', c) + dim('M9.500-27q9 1 8.500 12 0 4.500-4 3.500-4-1.500-4.500-15.500z', c) +
        S.dk('M-8-26a4.500 4.500 0 109 0z', .0) + `<circle cx="-4.800" cy="-23" r="3.600" fill="#000" opacity=".16"/>` +
        S.E(0, -18, 6, 4.600, '#f6e0c8', { shade: 'shR' }) + S.E(0, -20.200, 2.600, 1.800, DARK, { shade: false, line: false }) +
        eye(-4.800, -24, 1.600) + eye(4.800, -24, 1.600) + S.ln('M0-18.600v1.400q-2 2-4 .5M0-17.200q2 2 4 .5', '#5a3030', .9) + S.P('M-1.600-15.600h3.200v3q-1.600 1.400-3.200 0z', '#ff7a8a', { shade: false, sw: .7 }),
      owl: () => groundShadow(14) +
        S.E(0, -14, 13, 15, c, { shade: 'shH' }) +
        S.P('M-13-16q-5 8-1 16l5-1q-2-7-1-14z', c, { shade: 'shH' }) + S.P('M13-16q5 8 1 16l-5-1q2-7 1-14z', c, { shade: 'shH' }) +
        S.E(0, -9, 8.200, 10.500, '#fff', { shade: false, line: false, op: .38 }) +
        [[-3, -11], [3, -11], [0, -7], [-5, -6], [5, -6], [0, -3]].map((p) => S.ln(`M${p[0] - 2.200} ${p[1]}q2.200 2.400 4.400 0`, '#000', 1, .26)).join('') +
        S.P('M-10-26l-3-8 8 3z', c, { shade: 'shD' }) + S.P('M10-26l3-8-8 3z', c, { shade: 'shD' }) +
        S.C(-5.500, -20, 5.600, '#fff4d8', { shade: 'shR' }) + S.C(5.500, -20, 5.600, '#fff4d8', { shade: 'shR' }) +
        S.C(-5.500, -20, 3.200, '#e2a33f', { line: false }) + S.C(5.500, -20, 3.200, '#e2a33f', { line: false }) + eye(-5.500, -20, 1.700) + eye(5.500, -20, 1.700) +
        S.P('M0-17l3 4.500h-6z', '#f0a63a', { shade: 'shV', sw: 1 }) + S.P('M-6 0q0-3 3-3t3 3z', '#f0a63a', { shade: false, sw: 1 }) + S.P('M0 0q0-3 3-3t3 3z', '#f0a63a', { shade: false, sw: 1 }),
      fox: () => groundShadow(16) +
        S.P('M10-6q17-2 15-19-10 1-14 9z', c, { shade: 'shD' }) + S.P('M20-14q4-6 5-11-5 1-8 5z', '#fff6e5', { shade: false, line: false }) +
        S.E(0, -9, 11.500, 9, c, { shade: 'shH' }) + S.E(0, -7, 5.800, 6.500, '#fff6e5', { shade: false, line: false }) +
        S.E(-5.500, -1.800, 4, 2.800, '#3a2a24') + S.E(5.500, -1.800, 4, 2.800, '#3a2a24') +
        S.P('M-11-22l-2-14 9 6q4-1 8 0l9-6-2 14q0 9-11 9t-11-9z', c, { shade: 'shR' }) +
        S.P('M-12.500-35.500l4 2.500-4 3z', '#3a2a24', { shade: false, line: false }) + S.P('M12.500-35.500l-4 2.500 4 3z', '#3a2a24', { shade: false, line: false }) +
        S.P('M-11-21q5 8.500 11 8.500t11-8.500q-4 12-11 12t-11-12z', '#fff6e5', { shade: false, line: false }) + eye(-5, -22.500, 1.600) + eye(5, -22.500, 1.600) +
        S.E(0, -16.200, 1.800, 1.300, DARK, { shade: false, line: false }) + S.ln('M0-15v1q-2 2-3 .6M0-14q2 2 3 .6', '#5a3030', .9),
      axo: () => groundShadow(15) + thick('M10-4q10 1 14-6', c, 5) +
        S.E(0, -6, 12, 6.500, c, { shade: 'shH' }) + S.E(0, -4, 7, 4, '#fff', { shade: false, line: false, op: .35 }) +
        S.E(-6.500, -1.500, 3.600, 2.200, c) + S.E(6.500, -1.500, 3.600, 2.200, c) +
        [-1, 1].map((s) => [[-5, -23], [-2, -17], [1, -11]].map((p, i) => thick(`M${s * (8 + i * .8)} ${-14 + i * 2.600}q${s * (6 + i)} ${p[0] + i} ${s * (11 + i)} ${-2 - i * 2}`, '#ff6f9c', 2.200)).join('')).join('') +
        S.E(0, -15, 12, 9.500, c, { shade: 'shR' }) + eye(-5, -15, 1.700) + eye(5, -15, 1.700) +
        `<ellipse cx="-8.500" cy="-11.500" rx="2.400" ry="1.500" fill="#ff5c8a" opacity=".45"/><ellipse cx="8.500" cy="-11.500" rx="2.400" ry="1.500" fill="#ff5c8a" opacity=".45"/>` +
        S.ln('M-3.200-11q3.200 3.200 6.400 0', '#7a2a44', 1.200),
      dragon: () => groundShadow(16) +
        S.P('M-9-14q-9-9-17-1 4 0 5 4-3 1-3 4 6-2 11 1z', c, { shade: 'shD' }) + S.P('M9-14q9-9 17-1-4 0-5 4 3 1 3 4-6-2-11 1z', c, { shade: 'shD' }) +
        thick('M8-4q16 2 14-10', c, 4.400) + S.P('M20-15l3-5 1 6z', '#ffe29a', { shade: false, sw: .9 }) +
        S.E(0, -9, 11.500, 10, c, { shade: 'shH' }) + S.E(0, -7, 6.800, 7.800, '#fff3d0', { shade: false, line: false, op: .75 }) +
        [-4, -1.600, .8, 3.200].map((y) => S.ln(`M-4.500 ${y - 5}q4.500 2.400 9 0`, '#000', .9, .14)).join('') +
        S.E(-6, -1.500, 4, 2.800, c) + S.E(6, -1.500, 4, 2.800, c) +
        S.P('M-5-31l-3-8 7 4z', '#ffe29a', { shade: 'shD', sw: 1 }) + S.P('M5-31l3-8-7 4z', '#ffe29a', { shade: 'shD', sw: 1 }) +
        S.E(0, -22, 10.500, 9.500, c, { shade: 'shR' }) + S.P('M-2.500-31l2.500-5 2.500 5z', c, { shade: 'shD', sw: 1 }) +
        S.E(0, -17.500, 6.200, 4.300, '#bdf0d8', { shade: 'shR', line: false }) + S.dot(-1.800, -17.800, .7, DARK) + S.dot(1.800, -17.800, .7, DARK) +
        eye(-5, -23, 1.700) + eye(5, -23, 1.700) + S.ln('M-2.500-14.500q2.500 1.800 5 0', '#2a4a3a', 1),
      comet: () => {
        const y = -34;
        return `<circle cx="0" cy="${y}" r="26" fill="url(#shGlow)" opacity=".5"/>` +
          S.ln(`M10 ${y + 4}q16 8 30 2`, '#ffe08a', 5, .55) + S.ln(`M10 ${y - 1}q18 0 32-8`, '#ffd166', 3, .5) + S.ln(`M9 ${y + 8}q14 12 26 12`, '#ff9d5c', 2.600, .5) +
          S.glint(36, y + 2, 3, '#fff', .95) + S.glint(30, y - 8, 2.200, '#fff', .9) + S.glint(24, y + 14, 2, '#fff', .9) +
          S.C(0, y, 13, c, { shade: 'shR' }) + S.hl(`M-8 ${y - 6}q3-6 9-7-6 3-9 7z`, .7) + eye(-4.400, y + 1, 1.800) + eye(4.400, y + 1, 1.800) +
          `<ellipse cx="-8" cy="${y + 5}" rx="2.200" ry="1.400" fill="#ff7a5c" opacity=".4"/><ellipse cx="8" cy="${y + 5}" rx="2.200" ry="1.400" fill="#ff7a5c" opacity=".4"/>` +
          S.ln(`M-2.400 ${y + 5}q2.400 2.200 4.800 0`, '#7a3a2a', 1.100);
      }
    };
    return (M[style] || (() => ''))();
  };


  /* ---- new companions (the first seven live above) ---- */
  const petsNew = {
    bunny: (c) => groundShadow(14) + S.E(0, -9, 11, 9, c, { shade: 'shH' }) + S.E(0, -6, 6, 5, '#fff', { shade: false, line: false, op: .5 }) + S.E(-6, -1.800, 4.400, 2.800, c) + S.E(6, -1.800, 4.400, 2.800, c) + S.C(11, -8, 3.400, '#fff', { shade: 'shR', sw: 1 }) +
      S.P('M-8-27Q-13-44-8-48-3-48-3-28Z', c, { shade: 'shH' }) + S.P('M8-27Q13-44 8-48 3-48 3-28Z', c, { shade: 'shH' }) + S.P('M-7-30Q-10-41-8-44-5-44-5-30Z', '#ffb3c8', { shade: false, line: false }) + S.P('M7-30Q10-41 8-44 5-44 5-30Z', '#ffb3c8', { shade: false, line: false }) +
      S.E(0, -22, 11, 9.600, c, { shade: 'shR' }) + eye(-4.600, -22, 1.700) + eye(4.600, -22, 1.700) + '<path d="M-1.200-18.400h2.400l-1.200 1.400z" fill="#ff8fa3"/>' + S.ln('M0-17q-1.600 2-3.200 1M0-17q1.600 2 3.200 1', '#5a3030', .9),
    panda: () => groundShadow(15) + S.E(0, -10, 12, 10, '#fff', { shade: 'shH' }) + S.E(-8, -2, 4.600, 3.600, '#2a2530') + S.E(8, -2, 4.600, 3.600, '#2a2530') + S.E(0, -9, 12.500, 5, '#2a2530', { shade: false, line: false, op: .0 }) +
      S.C(-9, -31, 4.400, '#2a2530', { shade: 'shR' }) + S.C(9, -31, 4.400, '#2a2530', { shade: 'shR' }) + S.E(0, -22, 12, 10.600, '#fff', { shade: 'shR' }) +
      S.E(-5, -22.500, 3.600, 4.400, '#2a2530', { shade: false, line: false }) + S.E(5, -22.500, 3.600, 4.400, '#2a2530', { shade: false, line: false }) + S.dot(-4.600, -23, 1.200, '#fff') + S.dot(5.400, -23, 1.200, '#fff') + S.E(0, -18, 2.200, 1.500, '#2a2530', { shade: false, line: false }) + S.ln('M0-16.600q-2 2-3.600 .6M0-16.600q2 2 3.600 .6', '#2a2530', .9),
    penguin: () => groundShadow(13) + S.E(0, -14, 11.500, 14, '#2a3050', { shade: 'shH' }) + S.E(0, -11, 7.600, 10.500, '#fff', { shade: 'shR', line: false }) + S.P('M-10-16q-6 6-4 12l4-2z', '#2a3050', { shade: 'shH', sw: 1 }) + S.P('M10-16q6 6 4 12l-4-2z', '#2a3050', { shade: 'shH', sw: 1 }) +
      S.E(-5, -1.200, 4.400, 2.200, '#ff9d3c', { sw: 1 }) + S.E(5, -1.200, 4.400, 2.200, '#ff9d3c', { sw: 1 }) + S.E(0, -27, 9.400, 8, '#2a3050', { shade: 'shR' }) + S.E(-3.600, -26.500, 3, 3.400, '#fff', { shade: false, line: false }) + S.E(3.600, -26.500, 3, 3.400, '#fff', { shade: false, line: false }) + eye(-3.600, -26.500, 1.200) + eye(3.600, -26.500, 1.200) + S.P('M0-24l-3 3 3 2 3-2z', '#ff9d3c', { shade: 'shV', sw: .9 }),
    frog: (c) => groundShadow(15) + S.E(0, -8, 13, 8.600, c, { shade: 'shH' }) + S.E(0, -5, 8, 5, '#e9ffd0', { shade: false, line: false, op: .7 }) + S.E(-9, -2, 5, 2.800, c) + S.E(9, -2, 5, 2.800, c) +
      S.C(-6.500, -19, 4.600, c, { shade: 'shR' }) + S.C(6.500, -19, 4.600, c, { shade: 'shR' }) + S.E(0, -15, 12, 8, c, { shade: 'shR' }) + S.C(-6.500, -19.600, 2.600, '#fff', { shade: false, sw: .8 }) + S.C(6.500, -19.600, 2.600, '#fff', { shade: false, sw: .8 }) + S.dot(-6.500, -19.600, 1.300, DARK) + S.dot(6.500, -19.600, 1.300, DARK) +
      S.ln('M-6-12q6 4 12 0', '#2a5a3a', 1.200) + S.E(-8, -12, 2.200, 1.300, '#ff8fa3', { shade: false, line: false, op: .5 }) + S.E(8, -12, 2.200, 1.300, '#ff8fa3', { shade: false, line: false, op: .5 }),
    bee: () => `<g transform="translate(0 -14)">` + S.E(-8, -12, 7, 5, '#dff4ff', { shade: 'shR', sw: .9, op: .85 }) + S.E(8, -12, 7, 5, '#dff4ff', { shade: 'shR', sw: .9, op: .85 }) + S.E(0, 0, 11, 9, '#ffd24a', { shade: 'shH' }) + [-4, 2].map((x) => `<path d="M${x} -8.600V8.600" stroke="#2a2530" stroke-width="3.600"/>`).join('') + S.C(-9, -2, 6, '#ffd24a', { shade: 'shR' }) + S.dot(-11, -3.500, 1.100, DARK) + S.dot(-7, -3.500, 1.100, DARK) + S.ln('M-10 -8l-3-5M-8 -8l1-5', DARK, 1) + S.P('M11 0l5 1-5 2z', '#2a2530', { shade: false, sw: .6 }) + '</g>' + `<ellipse cx="0" cy="0" rx="9" ry="2.600" fill="#000" opacity=".2"/>`,
    jelly: (c) => `<ellipse cx="0" cy="0" rx="10" ry="2.600" fill="#000" opacity=".16"/><g transform="translate(0 -20)">` + [-6, -2, 2, 6].map((x, i) => S.ln(`M${x} 6q${i % 2 ? -3 : 3} 6 0 12t${i % 2 ? 2 : -2} 6`, c, 2.200)).join('') + S.P('M-12 6Q-13-10 0-11T12 6Q6 9 0 6T-12 6Z', c, { shade: 'shR', op: .92 }) + eye(-4, -1, 1.500) + eye(4, -1, 1.500) + S.ln('M-2 3q2 1.600 4 0', '#6a2a5a', 1) + S.hl('M-8-4q2-4 6-5-5 1-6 5z', .7) + '</g>',
    robot: (c) => groundShadow(14) + S.R(-9, -22, 18, 17, 3, c, { shade: 'shH' }) + S.R(-5, -17, 10, 7, 1.500, '#1a2140', { sw: .9 }) + S.dot(-2, -13.500, 1.100, '#6ff0d0') + S.dot(2, -13.500, 1.100, '#6ff0d0') + S.R(-12, -20, 3, 9, 1.500, dark(c, .2), { shade: 'shV', sw: .9 }) + S.R(9, -20, 3, 9, 1.500, dark(c, .2), { shade: 'shV', sw: .9 }) + S.R(-6, -5, 4, 5, 1, dark(c, .2), { sw: .9 }) + S.R(2, -5, 4, 5, 1, dark(c, .2), { sw: .9 }) +
      S.R(-11, -38, 22, 16, 4, c, { shade: 'shR' }) + S.R(-8, -34, 16, 8, 2.500, '#1a2140', { sw: 1 }) + S.dot(-3.500, -30, 1.800, '#6ff0d0') + S.dot(3.500, -30, 1.800, '#6ff0d0') + S.ln('M0-38v-5', LINE, 1.400) + S.dot(0, -44, 2, '#ff5c5c', 1),
    ghost: () => groundShadow(11) + `<g transform="translate(0 -3)">` + S.P('M-11 0V-22Q-11-36 0-36T11-22V0L7-4 3.500 0 0-4-3.500 0-7-4Z', '#f4f0ff', { shade: 'shR', op: .95 }) + eye(-4, -24, 1.800) + eye(4, -24, 1.800) + S.E(0, -18, 2, 2.600, '#7a5aa0', { shade: false, line: false, op: .85 }) + S.E(-7, -19, 2.200, 1.400, '#ff8fb8', { shade: false, line: false, op: .5 }) + S.E(7, -19, 2.200, 1.400, '#ff8fb8', { shade: false, line: false, op: .5 }) + '</g>',
    slime: (c) => groundShadow(15) + S.P('M-15 0Q-17-6-12-14-8-28 0-28T12-14Q17-6 15 0Z', c, { shade: 'shR', op: .95 }) + S.hl('M-9-18q2-6 7-8-5 2-7 8z', .7) + eye(-4.500, -12, 1.800) + eye(4.500, -12, 1.800) + S.ln('M-2.500-7q2.500 2.600 5 0', '#1a5a3a', 1.200) + S.dot(8, -4, 1.200, '#fff', .7),
    turtle: (c) => groundShadow(15) + S.E(-8, -2, 3.600, 2.400, light(c, .1)) + S.E(8, -2, 3.600, 2.400, light(c, .1)) + S.P('M-13-6Q-13-22 0-22T13-6Z', c, { shade: 'shR' }) + S.ln('M0-22v16M-7-18l-3 12M7-18l3 12M-13-10h26', '#000', 1, .22) + S.E(-14, -10, 5, 4.600, light(c, .25), { shade: 'shR' }) + S.dot(-16, -11, 1, DARK) + S.ln('M-17-8q2 1.600 4 0', '#2a5a3a', .9),
    alien: (c) => groundShadow(12) + S.E(0, -10, 7, 8, c, { shade: 'shH' }) + S.E(-6, -1.500, 3.200, 2, c) + S.E(6, -1.500, 3.200, 2, c) + S.ln('M-7-14l-6 4M7-14l6 4', c, 2) +
      S.E(0, -26, 12, 11, c, { shade: 'shR' }) + S.ln('M-4-37l-3-5M4-37l3-5', LINE, 1.200) + S.dot(-7, -43, 2, '#ffe29a', 1) + S.dot(7, -43, 2, '#ffe29a', 1) + S.E(-5, -26, 3.600, 4.600, '#1a1330', { shade: false, line: false }) + S.E(5, -26, 3.600, 4.600, '#1a1330', { shade: false, line: false }) + S.dot(-4, -27.500, 1, '#fff') + S.dot(6, -27.500, 1, '#fff') + S.ln('M-2-19q2 1.600 4 0', '#2a5a3a', 1),
  };
  S.pets = function (style, c) { return petsNew[style] ? petsNew[style](c || '#9fe3b0') : petsOld(style, c); };

  /* Effects come in two layers: 'back' sits behind the character, 'front' floats over it. */
  const effOld = function (style, c, layer) {
    c = c || '#ffd166';
    const flake = (x, y, r) => [0, 60, 120].map((a) => `<path d="M${x - r} ${y}h${2 * r}" stroke="#fff" stroke-width="1.100" stroke-linecap="round" transform="rotate(${a} ${x} ${y})"/>`).join('');
    const F = {
      sparkle: () => [[22, 58, 5.500], [92, 92, 4.200], [88, 42, 3.600], [24, 128, 3.200], [96, 154, 3.800], [16, 28, 2.600], [70, 18, 2.800]].map((p, i) =>
        `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2] * 1.800}" fill="${c}" opacity=".16"/>` + S.glint(p[0], p[1], p[2], c, 1) + S.glint(p[0], p[1], p[2] * .5, '#fff', .95)).join('') +
        [[34, 40], [80, 66], [14, 100], [100, 130], [30, 168]].map((p) => S.dot(p[0], p[1], 1.200, c, .85)).join(''),
      snow: () => `<g opacity=".92">` + [[22, 40, 3.600], [90, 62, 3.200], [16, 110, 3], [96, 138, 3.800], [34, 168, 2.800]].map((p) => flake(p[0], p[1], p[2])).join('') + '</g>' +
        [[48, 24], [76, 34], [10, 72], [104, 100], [28, 142], [84, 176], [60, 190], [44, 10]].map((p, i) => S.dot(p[0], p[1], i % 3 ? 1.400 : 2, '#fff', .85)).join(''),
      bubbles: () => [[24, 80, 7], [88, 58, 5], [78, 122, 4.200], [32, 40, 4.600], [96, 150, 6], [16, 150, 3.400]].map((p) =>
        `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="1.200" stroke-opacity=".9"/><circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="url(#shR)"/>` +
        S.hl(`M${p[0] - p[2] * .6} ${p[1] - p[2] * .1}q.4-${p[2] * .6} ${p[2] * .7}-${p[2] * .7}-${p[2] * .5} ${p[2] * .2}-${p[2] * .7} ${p[2] * .8}z`, .8)).join(''),
      fireflies: () => [[30, 70, 3], [84, 54, 2.400], [70, 110, 2.800], [42, 36, 2.200], [90, 96, 3.200], [20, 138, 2.400], [96, 170, 2.600]].map((p) =>
        `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2] * 3.600}" fill="${c}" opacity=".16"/><circle cx="${p[0]}" cy="${p[1]}" r="${p[2] * 2}" fill="${c}" opacity=".3"/><circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="${c}"/><circle cx="${p[0]}" cy="${p[1]}" r="${p[2] * .5}" fill="#fff"/>`).join(''),
      galaxy: () => `<ellipse cx="56" cy="112" rx="54" ry="84" fill="${c}" opacity=".12"/><ellipse cx="56" cy="112" rx="40" ry="64" fill="${c}" opacity=".1"/>` +
        `<ellipse cx="56" cy="120" rx="54" ry="12" fill="none" stroke="${c}" stroke-width="1.800" opacity=".75" transform="rotate(-14 56 120)"/>` +
        `<ellipse cx="56" cy="120" rx="46" ry="9" fill="none" stroke="#fff" stroke-width="1" opacity=".4" transform="rotate(-14 56 120)"/>` +
        `<ellipse cx="56" cy="124" rx="54" ry="11" fill="none" stroke="${c}" stroke-width="1.200" opacity=".4" transform="rotate(16 56 124)"/>` +
        S.ln('M56 40q30-4 38 22t-24 46', c, 1.200, .45) + S.ln('M56 190q-30 4-38-22t24-46', c, 1.200, .45) +
        [[14, 40], [98, 50], [10, 90], [102, 120], [18, 170], [94, 184], [60, 12], [40, 200], [84, 22], [8, 140]].map((p, i) => S.dot(p[0], p[1], i % 3 ? 1 : 1.700, i % 2 ? '#fff' : c, .9)).join('') +
        S.glint(100, 80, 4, '#fff', .9) + S.glint(12, 112, 3.400, c, .95) + S.glint(88, 168, 3, '#fff', .8)
    };
    const BACK = style === 'galaxy';
    if ((layer === 'back') !== BACK && layer) return '';
    return (F[style] || (() => ''))();
  };


  /* ---- new auras: 'back' sits behind the character, 'front' floats over it ---- */
  const BACKFX = { galaxy: 1, rainbow: 1, rings: 1 };
  const spread = [[22, 58], [92, 92], [88, 42], [24, 128], [96, 154], [16, 28], [70, 18], [14, 96], [100, 64], [30, 168], [86, 188]];
  const fxNew = {
    hearts: (c) => spread.slice(0, 8).map((p, i) => `<path d="${S.heart(p[0], p[1], 2.400 + (i % 3) * .9)}" fill="${i % 2 ? c : '#ff8fb8'}" stroke="#fff" stroke-width=".6" opacity=".92"/>`).join(''),
    leaves: (c) => spread.slice(0, 9).map((p, i) => `<g transform="translate(${p[0]} ${p[1]}) rotate(${i * 47})"><path d="M0-4Q4-1 0 4-4-1 0-4z" fill="${i % 2 ? c : '#9fe36b'}" stroke="#2a6a3a" stroke-width=".6"/><path d="M0-3.400V3" stroke="#2a6a3a" stroke-width=".5"/></g>`).join(''),
    flames: (c) => [[18, 150, 1], [94, 140, 1.100], [24, 112, .8], [90, 100, .9], [100, 170, .8], [12, 176, .9]].map((p) => `<g transform="translate(${p[0]} ${p[1]}) scale(${p[2]})"><path d="M0 8Q-7 2-4-6 0-2 1-10 8-4 6 3 8 5 0 8z" fill="${c}"/><path d="M0 7Q-3 3-1-2 1 0 2-4 4-1 3 3 4 5 0 7z" fill="#fff3a0"/></g>`).join(''),
    lightning: (c) => [[20, 70, 1], [92, 60, .9], [14, 140, .8], [98, 130, 1], [30, 30, .7]].map((p) => `<path d="M${p[0]} ${p[1]}l5-9-2 6h5l-6 11 2-7z" transform="scale(${p[2]})" fill="${c}" stroke="#fff" stroke-width=".6" stroke-linejoin="round" style="transform-origin:${p[0]}px ${p[1]}px"/>`).join('') + S.glint(24, 100, 3, '#fff', .8) + S.glint(90, 90, 2.400, c, .9),
    sakura: (c) => spread.slice(0, 10).map((p, i) => `<g transform="translate(${p[0]} ${p[1]}) rotate(${i * 36})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-2.200" rx="1.500" ry="2.200" fill="${i % 2 ? c : '#ffd0dc'}" transform="rotate(${a})"/>`).join('')}<circle r=".8" fill="#ffc247"/></g>`).join(''),
    notes: (c) => [[22, 60], [92, 84], [18, 120], [96, 148], [86, 40]].map((p, i) => `<g transform="translate(${p[0]} ${p[1]})" fill="${i % 2 ? c : '#fff'}" stroke="${LINE}" stroke-width=".6"><ellipse cx="0" cy="0" rx="2.800" ry="2.100" transform="rotate(-20)"/><path d="M2.400-1V-9l4 1.600" fill="none" stroke-width="1.100"/></g>`).join(''),
    rainbow: () => `<path d="M6 150Q6 40 56 40T106 150" fill="none" stroke="url(#rainbowArc)" stroke-width="9" opacity=".8" stroke-linecap="round"/><path d="M6 150Q6 40 56 40T106 150" fill="none" stroke="#fff" stroke-width="1.400" opacity=".35" transform="translate(0 -3)"/>`,
    orbit: (c) => `<ellipse cx="56" cy="110" rx="46" ry="12" fill="none" stroke="${c}" stroke-width="1" opacity=".5" transform="rotate(-20 56 110)"/>` + [[14, 126], [98, 94], [56, 122]].map((p, i) => `<path d="${S.star(p[0], p[1], 5.400 - i, 2.300 - i * .3)}" fill="${i % 2 ? '#fff' : c}" stroke="${LINE}" stroke-width=".7" stroke-linejoin="round"/>`).join('') + S.glint(100, 130, 2.600, '#fff', .9),
    pixels: (c) => spread.slice(0, 10).map((p, i) => `<rect x="${p[0]}" y="${p[1]}" width="${3 + (i % 3)}" height="${3 + (i % 3)}" fill="${i % 3 ? c : '#fff'}" opacity=".9"/>`).join(''),
    rings: (c) => [[56, 188, 46, 9], [56, 188, 36, 6.500]].map((r, i) => `<ellipse cx="${r[0]}" cy="${r[1]}" rx="${r[2]}" ry="${r[3]}" fill="none" stroke="${c}" stroke-width="${i ? 1.600 : 2.800}" opacity="${i ? .6 : .85}"/>`).join('') + [[22, 186], [90, 190], [56, 197]].map((p) => S.glint(p[0], p[1], 3, '#fff', .9)).join(''),
    confetti: (c) => spread.map((p, i) => `<rect x="${p[0]}" y="${p[1]}" width="3.600" height="2" fill="${['#ff5c8a', '#ffd166', '#3a9bff', '#2ec4a6', c][i % 5]}" transform="rotate(${i * 33} ${p[0]} ${p[1]})"/>`).join(''),
    ember: (c) => spread.map((p, i) => `<circle cx="${p[0]}" cy="${p[1] + 20}" r="${1 + (i % 3) * .5}" fill="${i % 2 ? c : '#ffe29a'}" opacity=".9"/><circle cx="${p[0]}" cy="${p[1] + 20}" r="${3 + (i % 3)}" fill="${c}" opacity=".18"/>`).join(''),
  };
  S.effect = function (style, c, layer) {
    c = c || '#ffd166';
    if (fxNew[style]) { if (layer && (layer === 'back') !== !!BACKFX[style]) return ''; return fxNew[style](c); }
    return effOld(style, c, layer);
  };

  /* --------------------------------------------------------------- composed */
  // an item is drawn by what it IS (its slot), not by the key it was saved under, so old saves keep working
  const worn = (e) => { const by = {}; Object.keys(e || {}).forEach((k) => { const it = e[k] && S.item(e[k]); if (it) by[it.slot] = it; }); return by; };
  S.worn = worn;
  const FULL = { dress: 1, robe: 1 };

  S.figure = function (e, o) {
    o = o || {};
    const w = worn(e);
    const hair = w.hair, hc = w.hairColor, eyes = w.eyes, ec = w.eyeColor, mouth = w.mouth, top = w.top, bottom = w.bottom, shoes = w.shoes;
    const hat = w.hat, face = w.face, neck = w.neck, back = w.back, hand = w.hand, pet = w.pet, fx = w.effect;
    const full = top && FULL[top.style];
    const hcol = hc ? hc.colour : '#3b2a20';
    return (fx ? S.effect(fx.style, fx.colour, 'back') : '') +
      (back ? S.back(back.style, back.colour) : '') +
      (hair ? S.hairBack(hair.style, hcol) : '') +
      '<ellipse cx="56" cy="206" rx="32" ry="5" fill="#000" opacity=".3"/>' +
      S.legs() +
      (full ? '' : (bottom ? S.bottom(bottom.style, bottom.colour) : S.bottom('shorts', '#6b7394'))) +
      (shoes ? S.shoes(shoes.style, shoes.colour) : S.bareFoot()) +
      S.neck() + S.arms() + S.torso() +
      (top ? S.top(top.style, top.colour) : S.top('tank', '#e9edf7')) +
      (back ? S.backFront(back.style) : '') +
      (neck ? S.neckItem(neck.style, neck.colour) : '') +
      S.head() + (eyes ? S.eyes(eyes.style, ec && ec.colour) : S.eyes('round')) + (mouth ? S.mouth(mouth.style) : S.mouth('smile')) +
      (face && /^(freckles|blush|whiskers|starpaint|bolt)$/.test(face.style) ? S.faceItem(face.style, face.colour) : '') +
      (hair ? S.hair(hair.style, hcol) : '') +
      (face && !/^(freckles|blush|whiskers|starpaint|bolt)$/.test(face.style) ? S.faceItem(face.style, face.colour) : '') +
      (hat ? S.hat(hat.style, hat.colour) : '') +
      (hand ? S.hand(hand.style, hand.colour) + S.handGrip() : '') +
      (pet ? `<g transform="translate(92 206)">${S.pets(pet.style, pet.colour)}</g>` : '') +
      (fx ? S.effect(fx.style, fx.colour, 'front') : '');
  };

  S.avatar = function (equipped, opts) {
    const o = opts || {}, e = equipped || {};
    const bg = o.background === false ? '' :
      `<rect width="112" height="212" fill="url(#avBg)"/><rect width="112" height="212" fill="url(#avSpot)"/>${S.starfield()}`;
    return `<svg class="avatar" viewBox="0 0 112 212" role="img" aria-label="${o.label || 'Player character'}">${bg}${S.figure(e, o)}</svg>`;
  };

  /* Thumbnails: each slot has its own framing. */
  const BOX = {
    hair: '16 8 80 86', eyes: '36 46 40 30', mouth: '38 60 36 26', top: '14 82 84 86', bottom: '26 146 60 64',
    shoes: '22 184 68 32', hat: '16 2 80 56', back: '0 84 112 94', pet: '-32 -62 78 70', effect: '0 8 112 200'
  };
  const FACE_BOX = '24 36 64 56';
  const NECK_BOX = '28 72 56 60';
  const dummyTorso = () => S.neck() + S.P(S.TORSO, '#39406b', { shade: 'shH' });
  S.thumb = function (it) {
    if (!it) return '';
    const box = (inner, vb) => `<svg viewBox="${vb}">${inner}</svg>`;
    const head = (extra, hairStyle, hairCol) => S.hairBack(hairStyle || 'bob', hairCol || '#6a3c22') + S.neck() + S.head() + S.eyes('round', '#3b7fd0') + S.mouth('smile') + (extra || '');
    switch (it.slot) {
      case 'eyeColor': case 'hairColor': return box(S.swatch(it).replace(/^<svg[^>]*>|<\/svg>$/g, ''), '0 0 64 64');
      case 'hair': return box(S.hairBack(it.style, it.colour) + S.neck() + S.head() + S.eyes('round', '#3b7fd0') + S.mouth('smile') + S.hair(it.style, it.colour), BOX.hair);
      case 'eyes': return box(S.head() + S.eyes(it.style, '#3b7fd0'), BOX.eyes);
      case 'mouth': return box(S.head() + S.mouth(it.style), BOX.mouth);
      case 'top': return box(S.legs() + S.bottom('trousers', '#3a3f63') + S.neck() + S.arms() + S.torso() + S.top(it.style, it.colour), FULL[it.style] || it.style === 'labcoat' ? '8 82 96 112' : BOX.top);
      case 'bottom': return box(S.legs() + S.bottom(it.style, it.colour), BOX.bottom);
      case 'shoes': return box(S.legs() + S.shoes(it.style, it.colour), BOX.shoes);
      case 'hat': return box(S.neck() + S.head() + S.eyes('round', '#3b7fd0') + S.mouth('smile') + S.hat(it.style, it.colour), BOX.hat);
      case 'face': return box(S.head() + S.eyes('round', '#3b7fd0') + S.mouth('smile') + S.faceItem(it.style, it.colour), FACE_BOX);
      case 'neck': return box(dummyTorso() + S.neckItem(it.style, it.colour), NECK_BOX);
      case 'back': return box(S.back(it.style, it.colour) + dummyTorso() + S.backFront(it.style), (it.style === 'balloons' || it.style === 'guitar') ? '0 14 112 150' : BOX.back);
      case 'hand': return box(S.limb(S.ARM_R, 10.500, '#39406b') + S.hand(it.style, it.colour) + S.handGrip(), '50 90 62 80');
      case 'pet': return box(S.pets(it.style, it.colour), BOX.pet);
      case 'effect': return box(S.effect(it.style, it.colour, 'back') + `<g opacity=".16">${S.C(56, 56, 22, '#fff', { shade: false, line: false })}${S.P(S.TORSO, '#fff', { shade: false, line: false })}</g>` + S.effect(it.style, it.colour, 'front'), BOX.effect);
      case 'theme': return box(S.room ? S.room(it) : '', '0 0 960 600');
      case 'furniture': return box(S.furniture(it.style, it.colour), (S.furnBox && S.furnBox[it.style]) || '-40 -70 80 76');
      default: return '';
    }
  };
})();
