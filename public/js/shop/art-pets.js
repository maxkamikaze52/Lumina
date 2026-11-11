/* Astrolab — shop art, part 2: pets, effects, the composed avatar and item thumbnails. */
(function () {
  'use strict';
  const S = window.ART;
  const LINE = S.LINE, DARK = '#1d1a33';

  // a thick outlined stroke (tails, limbs): dark underlay + coloured top
  const thick = (d, c, w) => S.ln(d, LINE, w + 2.2) + S.ln(d, c, w) + S.ln(d, '#fff', Math.max(.8, w * .22), .22);
  const eye = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${(r * 1.25).toFixed(2)}" fill="${DARK}"/><circle cx="${x + r * .38}" cy="${y - r * .5}" r="${(r * .42).toFixed(2)}" fill="#fff"/>`;
  const groundShadow = (rx) => `<ellipse cx="0" cy="0" rx="${rx}" ry="3.2" fill="#000" opacity=".28"/>`;
  const dim = (d, c, o) => S.P(d, c, o) + S.dk(d, .26);   // same shape, one step darker

  /* Pets stand on the ground at (0,0) and grow upwards; about 30 units tall. */
  S.pets = function (style, c) {
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

  /* Effects come in two layers: 'back' sits behind the character, 'front' floats over it. */
  S.effect = function (style, c, layer) {
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

  /* --------------------------------------------------------------- composed */
  const inst = (slot, e) => S.item(e && e[slot]);

  S.figure = function (e, o) {
    o = o || {};
    const hair = inst('hair', e), hc = inst('hairColor', e), eyes = inst('eyes', e), ec = inst('eyeColor', e), mouth = inst('mouth', e);
    const top = inst('top', e), bottom = inst('bottom', e), shoes = inst('shoes', e);
    const hat = inst('hat', e), acc = inst('accessory', e), back = inst('back', e), pet = inst('pet', e), fx = inst('effect', e);
    const accBack = acc && (acc.style === 'cape' || acc.style === 'wings');
    const bare = (inner) => inner;
    return (fx ? S.effect(fx.style, fx.colour, 'back') : '') +
      (accBack ? S.accessory(acc.style, acc.colour) : '') +
      (back ? S.back(back.style, back.colour) : '') +
      '<ellipse cx="56" cy="207" rx="32" ry="5" fill="#000" opacity=".3"/>' +
      S.legs() +
      (bottom ? S.bottom(bottom.style, bottom.colour) : S.bottom('shorts', '#6b7394')) +
      (shoes ? S.shoes(shoes.style, shoes.colour) : bare(S.P('M33 203q-4 6 1 8h18q2-6-1-8z', S.SKIN, { shade: 'shV' }) + S.mirror(S.P('M33 203q-4 6 1 8h18q2-6-1-8z', S.SKIN, { shade: 'shV' })))) +
      S.neck() + S.arms() +
      (top ? S.top(top.style, top.colour) : S.P(S.TORSO, S.SKIN, { shade: 'shH' })) +
      (back ? S.backFront(back.style) : '') +
      S.head() + (eyes ? S.eyes(eyes.style, ec && ec.colour) : '') + (mouth ? S.mouth(mouth.style) : '') +
      (hair ? S.hair(hair.style, hc ? hc.colour : '#3b2a20') : '') +
      (hat ? S.hat(hat.style, hat.colour) : '') +
      (acc && !accBack ? S.accessory(acc.style, acc.colour) : '') +
      (pet ? `<g transform="translate(90 206)">${S.pets(pet.style, pet.colour)}</g>` : '') +
      (fx ? S.effect(fx.style, fx.colour, 'front') : '');
  };

  S.avatar = function (equipped, opts) {
    const o = opts || {}, e = equipped || {};
    const bg = o.background === false ? '' :
      `<rect width="112" height="212" fill="url(#avBg)"/><rect width="112" height="212" fill="url(#avSpot)"/>${S.starfield()}`;
    return `<svg class="avatar" viewBox="0 0 112 212" role="img" aria-label="${o.label || 'Player character'}">${bg}${S.figure(e, o)}</svg>`;
  };

  /* A round colour chip (hair colour, eye colour) — an SVG so gradient colours like Stardust work. */
  S.swatch = function (it) {
    const iris = it.slot === 'eyeColor';
    return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="${it.colour}" stroke="${LINE}" stroke-width="1.600"/>` +
      `<circle cx="32" cy="32" r="22" fill="url(#shR)"/>` +
      (iris ? `<circle cx="32" cy="33" r="9" fill="${DARK}"/><circle cx="37" cy="27" r="4" fill="#fff"/><circle cx="26.500" cy="38.500" r="2" fill="#fff" opacity=".8"/>`
        : S.hl('M18 24q4-9 14-10-9 3-14 10z', .55)) + '</svg>';
  };

  /* Thumbnails: each slot has its own framing. */
  const BOX = {
    hair: '20 2 72 80', eyes: '38 48 36 28', mouth: '40 62 32 24', top: '18 82 76 84', bottom: '28 152 56 54',
    shoes: '22 184 68 32', hat: '20 6 72 46', back: '18 84 76 72', pet: '-30 -66 74 70', effect: '0 8 112 170'
  };
  const ACC_BOX = {
    glasses: '30 50 52 24', sun: '30 50 52 24', scarf: '30 82 52 46', headphones: '24 36 64 46', bow: '32 76 48 26',
    cape: '16 92 80 88', wings: '-2 86 116 66'
  };
  const ACC_ON_HEAD = ['glasses', 'sun', 'headphones'];

  S.thumb = function (it) {
    if (!it) return '';
    const box = (inner, vb) => `<svg viewBox="${vb}">${inner}</svg>`;
    switch (it.slot) {
      case 'eyeColor': case 'hairColor': return box(S.swatch(it).replace(/^<svg[^>]*>|<\/svg>$/g, ''), '0 0 64 64');
      case 'hair': return box(S.head() + S.eyes('round', '#3b7fd0') + S.mouth('smile') + S.hair(it.style, it.colour), BOX.hair);
      case 'eyes': return box(S.head() + S.eyes(it.style, '#3b7fd0'), BOX.eyes);
      case 'mouth': return box(S.head() + S.mouth(it.style), BOX.mouth);
      case 'top': return box(S.arms() + S.top(it.style, it.colour), BOX.top);
      case 'bottom': return box(S.legs() + S.bottom(it.style, it.colour), BOX.bottom);
      case 'shoes': return box(S.shoes(it.style, it.colour), BOX.shoes);
      case 'hat': return box(S.head() + S.hat(it.style, it.colour), BOX.hat);
      case 'accessory': {
        const dummy = S.neck() + S.P(S.TORSO, '#39406b', { shade: 'shH' });
        const inner = it.style === 'cape' || it.style === 'wings'
          ? S.accessory(it.style, it.colour) + dummy
          : ACC_ON_HEAD.includes(it.style) ? S.head() + S.eyes('round', '#3b7fd0') + S.accessory(it.style, it.colour)
            : dummy + S.accessory(it.style, it.colour);
        return box(inner, ACC_BOX[it.style] || '24 42 64 58');
      }
      case 'back': return box(S.back(it.style, it.colour) + S.P(S.TORSO, '#39406b', { shade: 'shH' }) + S.backFront(it.style), BOX.back);
      case 'pet': return box(S.pets(it.style, it.colour), BOX.pet);
      case 'effect': return box(S.effect(it.style, it.colour, 'back') + `<g opacity=".16">${S.C(56, 56, 22, '#fff', { shade: false, line: false })}${S.P(S.TORSO, '#fff', { shade: false, line: false })}</g>` + S.effect(it.style, it.colour, 'front'), BOX.effect);
      case 'theme': return box(S.room ? S.room(it) : '', '0 0 960 600');
      case 'furniture': return box(S.furniture(it.style, it.colour), (S.furnBox && S.furnBox[it.style]) || '-40 -70 80 76');
      default: return '';
    }
  };
})();
