/* Astrolab — art part 2: pets, effects, the composed avatar. */
(function () {
  'use strict';
  const S = window.ART;

  S.pets = function (style, c) {
    c = c || '#f0a868';
    const M = {
      cat: `<g><ellipse rx="16" ry="14" fill="${c}"/><path d="M-13-8l-3-13 10 7M13-8l3-13-10 7" fill="${c}"/><circle cx="-5" cy="-2" r="2" fill="#20243a"/><circle cx="5" cy="-2" r="2" fill="#20243a"/><path d="M-2 5q2 3 4 0" stroke="#20243a" stroke-width="1.6" fill="none"/><path d="M-16 12q-10 4-8 12" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`,
      dog: `<g><ellipse rx="17" ry="13" fill="${c}"/><ellipse cx="-9" cy="-8" rx="5" ry="8" fill="rgba(0,0,0,.24)"/><ellipse cx="9" cy="-8" rx="5" ry="8" fill="rgba(0,0,0,.24)"/><circle cx="-4" cy="-1" r="2" fill="#20243a"/><circle cx="6" cy="-1" r="2" fill="#20243a"/><ellipse cx="1" cy="5" rx="4" ry="3" fill="#20243a"/><path d="M14 4q10-4 8 8" stroke="${c}" stroke-width="4" fill="none"/></g>`,
      owl: `<g><ellipse rx="16" ry="17" fill="${c}"/><circle cx="-6" cy="-4" r="6" fill="#fff"/><circle cx="6" cy="-4" r="6" fill="#fff"/><circle cx="-6" cy="-4" r="2.6" fill="#20243a"/><circle cx="6" cy="-4" r="2.6" fill="#20243a"/><path d="M0 2l3 4h-6z" fill="#e2a33f"/></g>`,
      fox: `<g><ellipse rx="16" ry="13" fill="${c}"/><path d="M-14-6l-4-12 11 6M14-6l4-12-11 6" fill="${c}"/><path d="M-4 4q4 5 8 0" fill="#fff6e5"/><circle cx="-5" cy="-2" r="2" fill="#20243a"/><circle cx="5" cy="-2" r="2" fill="#20243a"/><path d="M12 6q10 2 6 12" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`,
      axo: `<g><ellipse rx="18" ry="11" fill="${c}"/><path d="M-14 2l-10-6M-14 4l-9 4M14 2l10-6M14 4l9 4" stroke="${c}" stroke-width="3" stroke-linecap="round"/><circle cx="-7" cy="-2" r="1.8" fill="#20243a"/><circle cx="1" cy="-2" r="1.8" fill="#20243a"/><path d="M-4 4q3 3 6 0" stroke="#20243a" stroke-width="1.4" fill="none"/></g>`,
      dragon: `<g><ellipse rx="15" ry="14" fill="${c}"/><path d="M-12-10l-4-9 9 5M12-10l4-9-9 5" fill="${c}"/><path d="M0 12q-8 10 0 16 8-6 0-16z" fill="${c}"/><circle cx="-5" cy="-2" r="2.2" fill="#20243a"/><circle cx="5" cy="-2" r="2.2" fill="#20243a"/><path d="M-4 6q4 4 8 0" stroke="#20243a" stroke-width="1.6" fill="none"/></g>`,
      comet: `<g><circle r="14" fill="${c}"/><circle cx="-4" cy="-4" r="5" fill="#fff" opacity=".55"/><path d="M14 4q16 6 26-2" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-3" cy="0" r="1.8" fill="#20243a"/><circle cx="5" cy="0" r="1.8" fill="#20243a"/></g>`
    };
    return M[style] || '';
  };

  S.effect = function (style, c) {
    c = c || '#ffd166';
    const M = {
      sparkle: `<g fill="${c}"><path d="M26 60l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z"/><path d="M88 92l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z"/><path d="M84 44l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z"/></g>`,
      snow: `<g fill="#fff" opacity=".85"><circle cx="28" cy="50" r="2.4"/><circle cx="88" cy="70" r="2"/><circle cx="40" cy="120" r="1.8"/><circle cx="80" cy="130" r="2.6"/><circle cx="60" cy="30" r="1.6"/></g>`,
      bubbles: `<g fill="none" stroke="${c}" stroke-width="1.6" opacity=".85"><circle cx="26" cy="80" r="7"/><circle cx="86" cy="60" r="5"/><circle cx="76" cy="120" r="4"/><circle cx="34" cy="44" r="4.5"/></g>`,
      fireflies: `<g fill="${c}"><circle cx="30" cy="70" r="3"/><circle cx="84" cy="54" r="2.4"/><circle cx="70" cy="110" r="2.8"/><circle cx="42" cy="36" r="2.2"/><circle cx="90" cy="96" r="3.2"/></g>`,
      galaxy: `<g><ellipse cx="56" cy="126" rx="54" ry="11" fill="none" stroke="${c}" stroke-width="1.6" opacity=".7"/><ellipse cx="56" cy="126" rx="54" ry="11" fill="none" stroke="${c}" stroke-width="1.2" opacity=".35" transform="rotate(18 56 126)"/><circle cx="104" cy="120" r="2" fill="${c}"/><circle cx="12" cy="130" r="1.8" fill="${c}"/></g>`
    };
    return M[style] || '';
  };

  const inst = (slot, e) => S.item(e && e[slot]);
  const DEFS = `<defs>
    <linearGradient id="avBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26305a"/><stop offset="1" stop-color="#171d38"/></linearGradient>
    <linearGradient id="hairStar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd166"/><stop offset=".5" stop-color="#ff6f91"/><stop offset="1" stop-color="#9a86e0"/></linearGradient>
    <linearGradient id="wingGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe29a"/><stop offset="1" stop-color="#e0a12b"/></linearGradient>
    <radialGradient id="petGlow"><stop offset="0" stop-color="#fff2c4"/><stop offset="1" stop-color="#ff9d5c"/></radialGradient>
  </defs>`;

  S.avatar = function (equipped, opts) {
    const o = opts || {}, e = equipped || {};
    const skin = inst('skin', e), hair = inst('hair', e), hc = inst('hairColor', e);
    const eyes = inst('eyes', e), ec = inst('eyeColor', e), mouth = inst('mouth', e);
    const top = inst('top', e), bottom = inst('bottom', e), shoes = inst('shoes', e);
    const hat = inst('hat', e), acc = inst('accessory', e), back = inst('back', e);
    const pet = inst('pet', e), fx = inst('effect', e);
    const sk = skin ? skin.colour : '#f1c27d';
    const bg = o.background === false ? '' : '<rect width="112" height="212" fill="url(#avBg)"/>';
    const SOFT = '<defs><radialGradient id="avSoft"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>';
    const accBack = acc && (acc.style === 'cape' || acc.style === 'wings');
    return `<svg class="avatar" viewBox="0 0 112 212" role="img" aria-label="${o.label || 'Player character'}">
      ${DEFS}${SOFT}${bg}
      ${fx ? S.effect(fx.style, fx.colour) : ''}
      ${accBack ? S.accessory(acc.style, acc.colour) : ''}
      ${back ? S.back(back.style, back.colour) : ''}
      ${pet && pet.style === 'comet' ? '<circle cx="98" cy="134" r="28" fill="url(#petGlow)" opacity=".18"/>' : ''}
      <!-- soft contact shadow, plus a tighter one right under the feet -->
      <ellipse cx="56" cy="207" rx="36" ry="7" fill="url(#avSoft)"/>
      <ellipse cx="56" cy="205" rx="20" ry="3.4" fill="rgba(0,0,0,.28)"/>

      <!-- legs: two tapered limbs with a shadow between them, under the clothes -->
      <path d="M48 150c-1 16-2 30-1 46" stroke="${sk}" stroke-width="15"
        stroke-linecap="round" fill="none"/>
      <path d="M64 150c1 16 2 30 1 46" stroke="${sk}" stroke-width="15"
        stroke-linecap="round" fill="none"/>
      <path d="M48 150c-1 16-2 30-1 46" stroke="rgba(0,0,0,.10)" stroke-width="5"
        stroke-linecap="round" fill="none" transform="translate(4 0)"/>
      <path d="M64 150c1 16 2 30 1 46" stroke="rgba(255,255,255,.14)" stroke-width="4"
        stroke-linecap="round" fill="none" transform="translate(-3 0)"/>
      <path d="M56 156v40" stroke="rgba(0,0,0,.16)" stroke-width="6" stroke-linecap="round"/>

      <!-- neck: narrower than the head, with a shadow under the jaw -->
      <path d="M50 72h12v24H50z" fill="${sk}"/>
      <path d="M50 72v24h4V72z" fill="rgba(0,0,0,.07)"/>
      <path d="M61 72v24h1V72z" fill="rgba(255,255,255,.12)"/>
      <ellipse cx="56" cy="80" rx="7.4" ry="3.6" fill="rgba(0,0,0,.20)"/>

      <!-- shoulders / upper chest, under the clothes -->
      <path d="M38 94q18-7 36 0l6 24H32z" fill="${sk}"/>
      <path d="M38 94q10-4 18-4" stroke="rgba(255,255,255,.16)" stroke-width="3"
        fill="none" stroke-linecap="round"/>

      ${bottom ? S.bottom(bottom.style, bottom.colour) : ''}
      ${shoes ? S.shoes(shoes.style, shoes.colour) : ''}
      ${top ? S.top(top.style, top.colour) : ''}

      <!-- arms: shoulder, elbow, wrist and a hand, with a shadow side -->
      <g class="av-arms">
        <path d="M39 101c-5 10-7 22-6 33 1 8 2 13 3 16" stroke="${sk}" stroke-width="12"
          stroke-linecap="round" fill="none"/>
        <path d="M39 101c-5 10-7 22-6 33 1 8 2 13 3 16" stroke="rgba(255,255,255,.18)"
          stroke-width="4" stroke-linecap="round" fill="none" transform="translate(-2 -1)"/>
        <path d="M39 101c-5 10-7 22-6 33 1 8 2 13 3 16" stroke="rgba(0,0,0,.10)"
          stroke-width="4" stroke-linecap="round" fill="none" transform="translate(4 2)"/>
        <path d="M73 101c5 10 7 22 6 33-1 8-2 13-3 16" stroke="${sk}" stroke-width="12"
          stroke-linecap="round" fill="none"/>
        <path d="M73 101c5 10 7 22 6 33-1 8-2 13-3 16" stroke="rgba(255,255,255,.18)"
          stroke-width="4" stroke-linecap="round" fill="none" transform="translate(2 -1)"/>
        <path d="M73 101c5 10 7 22 6 33-1 8-2 13-3 16" stroke="rgba(0,0,0,.10)"
          stroke-width="4" stroke-linecap="round" fill="none" transform="translate(-4 2)"/>
        <!-- hands -->
        <ellipse cx="35" cy="152" rx="5.6" ry="6.4" fill="${sk}"/>
        <ellipse cx="38.4" cy="149" rx="2.2" ry="3" fill="${sk}"/>
        <path d="M31 155a5 5 0 0 1 7 1" stroke="rgba(0,0,0,.14)" stroke-width="2"
          fill="none" stroke-linecap="round"/>
        <ellipse cx="77" cy="152" rx="5.6" ry="6.4" fill="${sk}"/>
        <ellipse cx="73.6" cy="149" rx="2.2" ry="3" fill="${sk}"/>
        <path d="M74 156a5 5 0 0 1 7-1" stroke="rgba(0,0,0,.14)" stroke-width="2"
          fill="none" stroke-linecap="round"/>
      </g>

      <!-- head: scaled down for a more human proportion, shaded like a sphere -->
      <g transform="translate(56 54) scale(.87) translate(-56 -54)">
        <ellipse cx="32" cy="59" rx="4.4" ry="5.2" fill="${sk}"/>
        <ellipse cx="34" cy="60.5" rx="2.4" ry="2.8" fill="rgba(0,0,0,.14)"/>
        <ellipse cx="80" cy="59" rx="4.4" ry="5.2" fill="${sk}"/>
        <ellipse cx="78" cy="60.5" rx="2.4" ry="2.8" fill="rgba(0,0,0,.14)"/>
        <circle cx="56" cy="56" r="26" fill="${sk}"/>
        <ellipse cx="46" cy="44" rx="17" ry="14" fill="#fff" opacity=".12"/>
        <path d="M76 68a26 26 0 0 1-34 8" stroke="rgba(0,0,0,.10)" stroke-width="10"
          fill="none" stroke-linecap="round"/>
        <path d="M36 62a26 26 0 0 1 8-18" stroke="rgba(255,255,255,.16)" stroke-width="4"
          fill="none" stroke-linecap="round"/>
        <ellipse cx="56" cy="78" rx="12" ry="4" fill="rgba(0,0,0,.07)"/>
        ${hair ? `<g fill="${hc ? hc.colour : '#3b2a20'}">${S.hair(hair.style)}</g>` : ''}
        <path d="M34 40q22-12 44 0" stroke="rgba(0,0,0,.10)" stroke-width="4" fill="none"
          stroke-linecap="round"/>
        ${eyes ? S.eyes(eyes.style, ec && ec.colour) : ''}
        ${mouth ? S.mouth(mouth.style) : ''}
        ${hat ? S.hat(hat.style, hat.colour) : ''}
        ${acc && !accBack ? S.accessory(acc.style, acc.colour) : ''}
      </g>
      ${pet ? `<g transform="translate(98 138)">${S.pets(pet.style, pet.colour)}</g>` : ''}
    </svg>`;
  };

  S.thumb = function (it) {
    if (!it) return '';
    const box = (inner, vb) => `<svg viewBox="${vb || '0 0 112 212'}">${inner}</svg>`;
    switch (it.slot) {
      case 'skin': case 'eyeColor': case 'hairColor':
        return box(`<circle cx="56" cy="106" r="46" fill="${it.colour}"/>`);
      case 'hair': return box(`<g fill="${it.colour}">${S.hair(it.style)}</g>`, '22 0 68 80');
      case 'eyes': return box(S.eyes(it.style, it.colour), '38 48 36 28');
      case 'mouth': return box(S.mouth(it.style), '42 64 28 22');
      case 'top': return box(S.top(it.style, it.colour), '26 78 60 72');
      case 'bottom': return box(S.bottom(it.style, it.colour), '30 152 52 52');
      case 'shoes': return box(S.shoes(it.style, it.colour), '28 188 56 26');
      case 'hat': return box(S.hat(it.style, it.colour), '20 8 72 40');
      case 'accessory': return box(S.accessory(it.style === 'cape' ? 'scarf' : it.style, it.colour), '24 42 64 58');
      case 'back': return box(S.back(it.style, it.colour), '22 88 68 62');
      case 'pet': return box(`<g transform="translate(56 130)">${S.pets(it.style, it.colour)}</g>`);
      case 'effect': return box(S.effect(it.style, it.colour), '10 20 92 120');
      case 'theme': return box(`<rect width="112" height="212" fill="${it.colour}"/><rect y="150" width="112" height="62" fill="${it.floor || '#a9793f'}"/>`);
      case 'furniture': return box(`<g transform="translate(56 190) scale(1.9)">${S.furniture(it.style, it.colour)}</g>`);
      default: return '';
    }
  };
})();
