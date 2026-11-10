/* Astrolab — procedural art. Every visual is SVG generated from item data. */
(function () {
  'use strict';
  const S = {};
  window.ART = S;

  S.item = (id) => ((window.App && App.state && App.state.catalogue.items) || [])
    .find((i) => i.id === id);

  S.hair = function (style) {
    const P = {
      buzz: '<path d="M35 42c0-13 8-21 21-21s21 8 21 21c-3-6-9-9-21-9s-18 3-21 9z"/>',
      bob: '<path d="M33 44c0-15 9-24 23-24s23 9 23 24c0 8-3 15-5 18l-4-22c-8 5-20 5-28 0l-4 22c-2-3-5-10-5-18z"/>',
      spiky: '<path d="M35 41c2-12 9-20 21-20s19 8 21 20l-6-6-3 8-4-9-4 9-4-9-4 9-4-8-3 7z"/>',
      side: '<path d="M34 42c0-14 9-22 22-22s22 8 22 22c-6-4-14-5-23-3-6 1-12 1-21 3z"/>',
      curly: '<path d="M33 45c-2-16 8-26 23-26s25 10 23 26c-4-3-6-8-8-6-2-6-8-8-14-8s-12 2-15 8c-2-2-5 3-9 6z"/>',
      pony: '<path d="M35 43c0-14 9-23 21-23s21 9 21 23c-5-5-12-7-21-7s-16 2-21 7z"/><path d="M71 46c8 4 10 14 6 25-3 8-9 11-13 9 4-4 5-11 5-18z"/>',
      bun: '<path d="M35 43c0-14 9-23 21-23s21 9 21 23c-5-5-12-7-21-7s-16 2-21 7z"/><circle cx="56" cy="16" r="9"/>',
      long: '<path d="M31 52c0-20 10-32 25-32s25 12 25 32v34c-4 0-8-4-9-12l-3-30c-8 5-18 5-26 0l-3 30c-1 8-5 12-9 12z"/>',
      afro: '<path d="M56 8c17 0 28 12 26 28-1 9-6 14-9 14-1-6-3-10-5-12-3-9-7-12-12-12s-9 3-12 12c-2 2-4 6-5 12-3 0-8-5-9-14C28 20 39 8 56 8z"/>',
      starlight: '<path d="M35 43c0-14 9-23 21-23s21 9 21 23c-5-5-12-7-21-7s-16 2-21 7z"/><circle cx="40" cy="30" r="2.4" opacity=".9"/><circle cx="70" cy="27" r="2"/><circle cx="56" cy="13" r="2.6"/><path d="M66 34l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" opacity=".85"/>'
    };
    return P[style] || P.buzz;
  };

  S.eyes = function (style, c) {
    c = c || '#2a2b4a';
    const M = {
      happy: `<path d="M45 62q4-5 8 0M59 62q4-5 8 0" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`,
      wide: `<circle cx="49" cy="62" r="5.4" fill="#fff"/><circle cx="63" cy="62" r="5.4" fill="#fff"/><circle cx="49" cy="62" r="2.8" fill="${c}"/><circle cx="63" cy="62" r="2.8" fill="${c}"/>`,
      sleepy: `<path d="M44 63h10M58 63h10" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`,
      sparkle: `<circle cx="49" cy="62" r="4.6" fill="${c}"/><circle cx="63" cy="62" r="4.6" fill="${c}"/><circle cx="50.6" cy="60.4" r="1.6" fill="#fff"/><circle cx="64.6" cy="60.4" r="1.6" fill="#fff"/>`,
      star: `<path d="M49 57l1.6 3.4 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="${c}"/><path d="M63 57l1.6 3.4 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="${c}"/>`
    };
    return M[style] || `<circle cx="49" cy="62" r="4.2" fill="${c}"/><circle cx="63" cy="62" r="4.2" fill="${c}"/><circle cx="50.4" cy="60.6" r="1.3" fill="#fff" opacity=".85"/><circle cx="64.4" cy="60.6" r="1.3" fill="#fff" opacity=".85"/>`;
  };

  S.mouth = function (style) {
    const M = {
      grin: '<path d="M48 73q8 9 16 0" fill="#7d2b3a" stroke="#5c2b2b" stroke-width="1.6"/><path d="M50 73.5h12" stroke="#fff" stroke-width="2.2"/>',
      neutral: '<path d="M50 76h12" stroke="#5c2b2b" stroke-width="2.6" stroke-linecap="round"/>',
      smirk: '<path d="M49 74q7 5 14-2" stroke="#5c2b2b" stroke-width="2.8" fill="none" stroke-linecap="round"/>',
      o: '<ellipse cx="56" cy="76" rx="4" ry="5" fill="#7d2b3a"/>',
      cat: '<path d="M49 72q3.5 5 7 0q3.5 5 7 0" stroke="#5c2b2b" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    };
    return M[style] || '<path d="M49 73q7 7 14 0" stroke="#5c2b2b" stroke-width="2.8" fill="none" stroke-linecap="round"/>';
  };

  S.top = function (style, c) {
    c = c || '#f4f0e6';
    const d = 'rgba(0,0,0,.18)';
    const M = {
      hoodie: `<path d="M34 112q0-16 12-22l10-5 10 5q12 6 12 22v52H34z" fill="${c}"/><path d="M46 90q10 10 20 0v10q-10 8-20 0z" fill="${d}"/><path d="M52 96v16M60 96v16" stroke="${d}" stroke-width="2"/><rect x="34" y="128" width="44" height="8" fill="${d}"/>`,
      jacket: `<path d="M34 112q0-16 12-22l10-4 10 4q12 6 12 22v52H34z" fill="${c}"/><path d="M56 90v74" stroke="rgba(0,0,0,.3)" stroke-width="2"/><path d="M44 96l-8 40M68 96l8 40" stroke="rgba(255,255,255,.16)" stroke-width="2"/><circle cx="56" cy="118" r="1.6" fill="#fff"/><circle cx="56" cy="132" r="1.6" fill="#fff"/>`,
      shirt: `<path d="M34 112q0-16 12-22l10-4 10 4q12 6 12 22v52H34z" fill="${c}"/><path d="M50 88l6 8 6-8-6-4z" fill="${d}"/><path d="M44 90l4 6-6 6M68 90l-4 6 6 6" stroke="rgba(0,0,0,.22)" stroke-width="2" fill="none"/>`,
      jumper: `<path d="M34 112q0-16 12-22l10-5 10 5q12 6 12 22v52H34z" fill="${c}"/><path d="M36 118h40M36 126h40M36 134h40" stroke="rgba(255,255,255,.14)" stroke-width="2"/><rect x="42" y="140" width="28" height="6" rx="3" fill="${d}"/>`,
      spacesuit: `<path d="M33 113q0-17 13-23l10-4 10 4q13 6 13 23v51H33z" fill="${c}"/><rect x="38" y="108" width="36" height="10" rx="4" fill="#2e3a66"/><circle cx="56" cy="128" r="8" fill="#2e3a66"/><circle cx="56" cy="128" r="3" fill="#6ff0d0"/><path d="M40 146h32M40 154h32" stroke="#2e3a66" stroke-width="2"/>`
    };
    return M[style] || `<path d="M35 112q0-15 12-21l9-5 9 5q12 6 12 21v52H35z" fill="${c}"/><path d="M46 91q10 8 20 0" fill="none" stroke="rgba(0,0,0,.16)" stroke-width="2"/><rect x="35" y="132" width="42" height="5" fill="rgba(0,0,0,.1)"/>`;
  };

  S.bottom = function (style, c) {
    c = c || '#4a6fa5';
    const M = {
      shorts: `<path d="M36 160h40l-3 28H57l-1-18-1 18H39z" fill="${c}"/>`,
      skirt: `<path d="M37 160h38l6 30H31z" fill="${c}"/><path d="M45 160l-3 30M56 160v30M67 160l3 30" stroke="rgba(0,0,0,.14)" stroke-width="1.6"/>`,
      jeans: `<path d="M36 160h40v46h-16l-4-30-4 30H36z" fill="${c}"/><path d="M40 166h32" stroke="rgba(255,255,255,.14)" stroke-width="2"/><circle cx="46" cy="174" r="1.4" fill="rgba(255,255,255,.3)"/><circle cx="66" cy="174" r="1.4" fill="rgba(255,255,255,.3)"/>`
    };
    return M[style] || `<path d="M36 160h40v44h-16l-4-28-4 28H36z" fill="${c}"/>`;
  };

  S.shoes = function (style, c) {
    c = c || '#f4f0e6';
    if (style === 'boots') return `<path d="M38 196h14v12q0 4-4 4H36v-6z" fill="${c}"/><path d="M60 196h14v12q0 4-4 4H60v-6z" fill="${c}"/><rect x="34" y="206" width="20" height="5" rx="2" fill="#2a2a2a"/><rect x="58" y="206" width="20" height="5" rx="2" fill="#2a2a2a"/>`;
    if (style === 'hi') return `<path d="M38 192h14v18H36v-8z" fill="${c}"/><path d="M60 192h14v18H60v-8z" fill="${c}"/><path d="M38 200h14M60 200h14" stroke="#fff" stroke-width="2"/><rect x="34" y="208" width="20" height="4" rx="2" fill="#fff"/><rect x="58" y="208" width="20" height="4" rx="2" fill="#fff"/>`;
    return `<path d="M38 198h14v10H35a3 3 0 010-6z" fill="${c}"/><path d="M60 198h14v10H60z" fill="${c}"/><rect x="35" y="206" width="18" height="4" rx="2" fill="rgba(0,0,0,.35)"/><rect x="59" y="206" width="18" height="4" rx="2" fill="rgba(0,0,0,.35)"/>`;
  };

  S.hat = function (style, c) {
    c = c || '#ff7a5c';
    const M = {
      beanie: `<path d="M37 40q2-18 19-18t19 18z" fill="${c}"/><rect x="35" y="38" width="42" height="7" rx="3" fill="rgba(0,0,0,.22)"/><circle cx="56" cy="18" r="4" fill="rgba(255,255,255,.85)"/>`,
      cap: `<path d="M37 38q3-16 19-16t19 16z" fill="${c}"/><path d="M37 38h24q6 0 6 6H35q0-6 2-6z" fill="rgba(0,0,0,.3)"/>`,
      bucket: `<path d="M40 36q2-14 16-14t16 14z" fill="${c}"/><path d="M34 36h44l-3 8H37z" fill="${c}"/>`,
      grad: `<path d="M26 34l30-11 30 11-30 11z" fill="${c}"/><rect x="40" y="38" width="32" height="6" rx="2" fill="rgba(0,0,0,.35)"/><path d="M82 36v16" stroke="${c}" stroke-width="2"/><circle cx="82" cy="54" r="3" fill="#ffc247"/>`,
      top: `<rect x="42" y="20" width="28" height="16" fill="${c}"/><rect x="36" y="34" width="40" height="5" rx="2" fill="${c}"/><rect x="42" y="28" width="28" height="4" fill="#c1443c"/>`,
      crown: `<path d="M34 36l4-16 9 8 9-14 9 14 9-8 4 16z" fill="${c}" stroke="#8a5c00" stroke-width="1.4"/><circle cx="56" cy="28" r="2.6" fill="#ff5c8a"/><circle cx="41" cy="30" r="2" fill="#6fb3ff"/><circle cx="71" cy="30" r="2" fill="#6fb3ff"/>`,
      helmet: `<path d="M36 40q2-20 20-20t20 20z" fill="${c}"/><rect x="34" y="38" width="44" height="6" rx="3" fill="rgba(0,0,0,.25)"/><path d="M48 22h16" stroke="#6fb3ff" stroke-width="3"/>`
    };
    return M[style] || '';
  };

  S.accessory = function (style, c) {
    c = c || '#2a2f5a';
    const M = {
      glasses: `<g fill="none" stroke="${c}" stroke-width="2"><circle cx="49" cy="62" r="7"/><circle cx="63" cy="62" r="7"/><path d="M42 61h-6M70 61h6M56 62h0"/></g>`,
      sun: `<g fill="${c}" opacity=".9"><rect x="41" y="57" width="16" height="10" rx="4"/><rect x="58" y="57" width="16" height="10" rx="4"/><path d="M57 61h1" stroke="${c}" stroke-width="2"/></g>`,
      scarf: `<path d="M40 88q16 10 32 0l2 8q-18 10-36 0z" fill="${c}"/><path d="M68 94l6 22-8 2-4-20z" fill="${c}"/>`,
      headphones: `<path d="M36 60a20 20 0 0140 0" fill="none" stroke="${c}" stroke-width="5"/><rect x="30" y="56" width="10" height="18" rx="5" fill="${c}"/><rect x="72" y="56" width="10" height="18" rx="5" fill="${c}"/>`,
      bow: `<path d="M50 92l-12-6v12zM62 92l12-6v12z" fill="${c}"/><circle cx="56" cy="92" r="4" fill="${c}"/>`,
      cape: `<path d="M36 104q20-8 40 0l10 72H26z" fill="${c}" opacity=".92"/>`,
      wings: `<g fill="${c}" opacity=".9"><path d="M36 110q-24-14-30 6 10 2 14 8-6 6 0 12 8-10 18-8z"/><path d="M76 110q24-14 30 6-10 2-14 8 6 6 0 12-8-10-18-8z"/></g>`
    };
    return M[style] || '';
  };

  S.back = function (style, c) {
    c = c || '#e07a5f';
    const M = {
      pack: `<rect x="38" y="100" width="36" height="46" rx="10" fill="${c}"/><rect x="46" y="112" width="20" height="14" rx="4" fill="rgba(0,0,0,.22)"/><path d="M40 104q16-8 32 0" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="3"/>`,
      jetpack: `<g fill="${c}"><rect x="34" y="104" width="12" height="38" rx="6"/><rect x="66" y="104" width="12" height="38" rx="6"/></g><rect x="46" y="108" width="20" height="8" rx="4" fill="#5f6b96"/><path d="M40 146l-3 16 5-4zM72 146l3 16-5-4z" fill="#ffb020"/>`,
      shell: `<path d="M56 98q26 0 26 26t-26 30q-26-4-26-30t26-26z" fill="${c}"/><path d="M56 108v34M40 120q16 6 32 0M42 134q14 6 28 0" stroke="rgba(255,255,255,.4)" stroke-width="2" fill="none"/>`
    };
    return M[style] || '';
  };
})();
