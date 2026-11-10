/* Astrolab — clothing art, drawn with depth.
   Every garment gets: a dark outline, a shadow pass on one side, a highlight
   pass on the other, seams and hardware.  Same function names as before, so
   every item in the catalogue picks this up with no data changes.
*/
(function () {
  'use strict';
  const S = window.ART;
  const INK = 'rgba(20,10,34,.55)';
  const SH = 'rgba(0,0,0,.16)';
  const HL = 'rgba(255,255,255,.20)';
  const STITCH = 'rgba(255,255,255,.35)';

  const torso = (c, extra) => `<path d="M34 112q0-16 12-22l10-5 10 5q12 6 12 22v52H34z"
      fill="${c}" stroke="${INK}" stroke-width="1.6"/>${extra}`;

  /* ------------------------------------------------------------------ TOPS */
  S.top = function (style, c) {
    c = c || '#f4f0e6';
    const M = {
      hoodie: torso(c, `
        <path d="M46 90q10 9 20 0v11q-10 8-20 0z" fill="${SH}"/>
        <path d="M46 90q10 9 20 0" fill="none" stroke="${INK}" stroke-width="1.4"/>
        <path d="M50 101v13M62 101v13" stroke="${STITCH}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="50" cy="115" r="2" fill="#cfc7e8" stroke="${INK}" stroke-width=".8"/>
        <circle cx="62" cy="115" r="2" fill="#cfc7e8" stroke="${INK}" stroke-width=".8"/>
        <path d="M41 128h30q3 0 3 4v14H38v-14q0-4 3-4z" fill="${HL}"/>
        <path d="M41 128h30q3 0 3 4v14H38v-14q0-4 3-4z" fill="none" stroke="${INK}" stroke-width="1.3"/>
        <path d="M40 129v17M72 129v17" stroke="${STITCH}" stroke-width="1" stroke-dasharray="2 2"/>
        <path d="M34 158h44v6H34z" fill="${SH}"/>
        <path d="M35 110q4 26 2 52M77 110q-4 26-2 52" stroke="${HL}" stroke-width="2.4" fill="none"/>
        <path d="M34 112q2-9 6-14" stroke="${INK}" stroke-width="1.2" fill="none"/>`),
      jacket: torso(c, `
        <path d="M56 90v74" stroke="${INK}" stroke-width="1.8"/>
        <path d="M50 90l6 8-6 6M62 90l-6 8 6 6" fill="${SH}" stroke="${INK}" stroke-width="1.2"/>
        <path d="M56 100v50" stroke="${STITCH}" stroke-width="1" stroke-dasharray="3 3"/>
        <circle cx="56" cy="106" r="2.4" fill="#d8d2ea" stroke="${INK}" stroke-width=".9"/>
        <path d="M56 108v8" stroke="${INK}" stroke-width="1.2"/>
        <rect x="38" y="122" width="12" height="10" rx="1.5" fill="${SH}" stroke="${INK}" stroke-width="1"/>
        <rect x="62" y="122" width="12" height="10" rx="1.5" fill="${SH}" stroke="${INK}" stroke-width="1"/>
        <path d="M38 122h12M62 122h12" stroke="${STITCH}" stroke-width="1"/>
        <path d="M34 152h44v6H34z" fill="${SH}"/>
        <path d="M36 112q3 24 2 46M76 112q-3 24-2 46" stroke="${HL}" stroke-width="2" fill="none"/>
        <path d="M44 96q-9 8-9 18" stroke="${INK}" stroke-width="1.1" fill="none"/>`),
      shirt: torso(c, `
        <path d="M50 88l6 9 6-9-6-4z" fill="${SH}" stroke="${INK}" stroke-width="1.2"/>
        <path d="M44 90l5 7-7 7M68 90l-5 7 7 7" fill="none" stroke="${INK}" stroke-width="1.2"/>
        <path d="M56 94v50" stroke="${SH}" stroke-width="5"/>
        <path d="M56 94v50" stroke="${INK}" stroke-width="1"/>
        <g fill="#fff8ee" stroke="${INK}" stroke-width=".8">
          <circle cx="56" cy="104" r="1.9"/><circle cx="56" cy="116" r="1.9"/>
          <circle cx="56" cy="128" r="1.9"/></g>
        <rect x="62" y="106" width="9" height="9" rx="1" fill="${SH}" stroke="${INK}" stroke-width=".9"/>
        <path d="M35 116q2 22 1 40M77 116q-2 22-1 40" stroke="${HL}" stroke-width="2.2" fill="none"/>
        <path d="M40 138q8 4 14 0M58 140q8 4 14 0" stroke="${SH}" stroke-width="1.4" fill="none"/>`),
      jumper: torso(c, `
        <g stroke="${HL}" stroke-width="1.6" fill="none">
          <path d="M42 104v48M50 104v48M62 104v48M70 104v48"/>
          <path d="M42 108l4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4"/>
          <path d="M70 108l-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4"/>
        </g>
        <path d="M34 158h44v6H34z" fill="${SH}"/>
        <g stroke="${INK}" stroke-width="1" opacity=".55">
          <path d="M34 158h44M34 112h44"/></g>
        <path d="M36 112q2 24 1 46M76 112q-2 24-1 46" stroke="${HL}" stroke-width="2" fill="none"/>`),
      spacesuit: `<path d="M33 113q0-17 13-23l10-4 10 4q13 6 13 23v51H33z"
          fill="${c}" stroke="${INK}" stroke-width="1.6"/>
        <path d="M38 108h36v11H38z" fill="#2e3a66" stroke="${INK}" stroke-width="1.2"/>
        <path d="M40 111h32" stroke="${HL}" stroke-width="1.4"/>
        <rect x="46" y="124" width="20" height="16" rx="3" fill="#2e3a66" stroke="${INK}" stroke-width="1.3"/>
        <g fill="#6ff0d0"><circle cx="51" cy="130" r="1.6"/><circle cx="56" cy="130" r="1.6"/>
          <circle cx="61" cy="130" r="1.6"/></g>
        <path d="M51 134v4M56 134v4M61 134v4" stroke="#6ff0d0" stroke-width="1" opacity=".7"/>
        <path d="M40 146h32M40 154h32" stroke="#2e3a66" stroke-width="2"/>
        <rect x="36" y="116" width="8" height="14" rx="3" fill="#3b4a7e" stroke="${INK}" stroke-width="1"/>
        <rect x="68" y="116" width="8" height="14" rx="3" fill="#3b4a7e" stroke="${INK}" stroke-width="1"/>
        <path d="M34 160h44v4H34z" fill="${SH}"/>`
    };
    return M[style] || torso(c, `
      <path d="M46 91q10 8 20 0" fill="none" stroke="${SH}" stroke-width="2"/>
      <path d="M35 132h42v5H35z" fill="${SH}"/>
      <path d="M36 112q2 24 1 46M76 112q-2 24-1 46" stroke="${HL}" stroke-width="2" fill="none"/>`);
  };

  /* --------------------------------------------------------------- BOTTOMS */
  S.bottom = function (style, c) {
    c = c || '#4a6fa5';
    const M = {
      shorts: `<path d="M36 160h40l-3 28H57l-1-18-1 18H39z" fill="${c}"
          stroke="${INK}" stroke-width="1.5"/>
        <path d="M36 160h40v6H36z" fill="${SH}"/>
        <path d="M56 166v6" stroke="${INK}" stroke-width="1.2"/>
        <path d="M40 168v6M72 168v6" stroke="${STITCH}" stroke-width="1.2"/>
        <path d="M39 182h16M57 182h16" stroke="${SH}" stroke-width="2"/>
        <path d="M40 162v24M72 162v24" stroke="${HL}" stroke-width="1.6"/>`,
      skirt: `<path d="M37 160h38l6 30H31z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
        <path d="M37 160h38v6H37z" fill="${SH}"/>
        <g stroke="${INK}" stroke-width="1.1" opacity=".55">
          <path d="M45 166l-4 30M53 166l-1 30M61 166l2 30M68 166l3 30"/></g>
        <g stroke="${HL}" stroke-width="1.4" opacity=".8">
          <path d="M41 166l-3 30M57 166v30M73 166l4 30"/></g>
        <path d="M31 190h56" stroke="${SH}" stroke-width="2"/>`,
      jeans: `<path d="M36 160h40v46h-16l-4-30-4 30H36z" fill="${c}"
          stroke="${INK}" stroke-width="1.5"/>
        <path d="M36 160h40v7H36z" fill="${SH}"/>
        <path d="M36 167h40" stroke="${STITCH}" stroke-width="1" stroke-dasharray="3 2"/>
        <g stroke="${INK}" stroke-width="1.1" fill="none" opacity=".6">
          <path d="M40 174q6 2 8 8M72 174q-6 2-8 8"/></g>
        <g fill="#d8c08a" stroke="${INK}" stroke-width=".7">
          <circle cx="42" cy="176" r="1.2"/><circle cx="70" cy="176" r="1.2"/></g>
        <path d="M52 168v10" stroke="${INK}" stroke-width="1.2"/>
        <path d="M39 190q2 8 0 14M73 190q-2 8 0 14" stroke="${HL}" stroke-width="1.8" fill="none"/>
        <path d="M44 202h8M60 202h8" stroke="${SH}" stroke-width="2"/>`
    };
    return M[style] || `<path d="M36 160h40v44h-16l-4-28-4 28H36z" fill="${c}"
        stroke="${INK}" stroke-width="1.5"/>
      <path d="M36 160h40v6H36z" fill="${SH}"/>
      <path d="M52 166v10" stroke="${INK}" stroke-width="1.2"/>
      <path d="M39 188q2 8 0 14M73 188q-2 8 0 14" stroke="${HL}" stroke-width="1.8" fill="none"/>`;
  };

  /* ---------------------------------------------------------------- SHOES */
  S.shoes = function (style, c) {
    c = c || '#f4f0e6';
    const lace = (x) => `<g stroke="${INK}" stroke-width="1.1" opacity=".8">
      <path d="M${x} 198h12M${x} 201h12M${x} 204h12"/></g>`;
    const M = {
      boots: `<g fill="${c}" stroke="${INK}" stroke-width="1.4">
          <path d="M38 194h13v12q0 5-5 5H37v-6z"/>
          <path d="M61 194h13v12q0 5-5 5H60v-6z"/></g>
        <path d="M38 194h13v5H38zM61 194h13v5H61z" fill="${HL}"/>
        <path d="M40 200h9M63 200h9" stroke="${STITCH}" stroke-width="1.2"/>
        <g fill="#2a2a2a"><rect x="33" y="208" width="21" height="5" rx="2"/>
          <rect x="58" y="208" width="21" height="5" rx="2"/></g>
        <path d="M33 208h21M58 208h21" stroke="${HL}" stroke-width="1"/>`,
      hi: `<g fill="${c}" stroke="${INK}" stroke-width="1.4">
          <path d="M38 190h13v20H36v-10z"/><path d="M61 190h13v20H60v-10z"/></g>
        <path d="M42 192h6M65 192h6" stroke="${SH}" stroke-width="2"/>
        ${lace(39)}${lace(62)}
        <path d="M36 208h17v4H36zM59 208h17v4H59z" fill="#fff" stroke="${INK}" stroke-width="1.1"/>
        <path d="M38 196h9M61 196h9" stroke="${HL}" stroke-width="1.6"/>`,
      default: `<g fill="${c}" stroke="${INK}" stroke-width="1.4">
          <path d="M38 197h12v8q0 3-3 3H34q-3 0-3-3v-2q0-3 3-3z"/>
          <path d="M62 197h12v8q0 3-3 3H60q-3 0-3-3v-2q0-3 3-3z"/></g>
        <path d="M33 203h17M60 203h17" stroke="${HL}" stroke-width="1.6"/>
        ${lace(39)}${lace(62)}
        <path d="M33 206h20v3H33zM59 206h20v3H59z" fill="rgba(0,0,0,.4)"/>
        <path d="M38 199h4M61 199h4" fill="#fff" opacity=".7"/>`
    };
    return M[style] || M.default;
  };

  /* ----------------------------------------------------------------- HATS */
  S.hat = function (style, c) {
    c = c || '#ff7a5c';
    const M = {
      beanie: `<path d="M37 41q2-19 19-19t19 19z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
        <g stroke="${SH}" stroke-width="1.4" opacity=".8">
          <path d="M43 24v16M49 22v18M56 21v19M63 22v18M69 24v16"/></g>
        <rect x="35" y="39" width="42" height="8" rx="3" fill="${c}" stroke="${INK}" stroke-width="1.4"/>
        <g stroke="${HL}" stroke-width="1.2">
          <path d="M38 43h36"/></g>
        <circle cx="56" cy="17" r="4" fill="${HL}" stroke="${INK}" stroke-width="1"/>`,
      cap: `<path d="M37 39q3-17 19-17t19 17z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
        <path d="M56 22v17" stroke="${SH}" stroke-width="1.3"/>
        <path d="M45 24q-6 6-7 15M67 24q6 6 7 15" stroke="${SH}" stroke-width="1.2" fill="none"/>
        <path d="M36 39h25q8 0 9 7H34q0-7 2-7z" fill="${SH}" stroke="${INK}" stroke-width="1.3"/>
        <circle cx="56" cy="21" r="2.2" fill="${HL}" stroke="${INK}" stroke-width=".8"/>`,
      bucket: `<path d="M40 37q2-15 16-15t16 15z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
        <path d="M33 37h46l-3 9H36z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
        <path d="M34 39h44" stroke="${HL}" stroke-width="1.3"/>
        <path d="M44 23v14M56 21v16M68 23v14" stroke="${SH}" stroke-width="1.2"/>`,
      grad: `<path d="M26 34l30-12 30 12-30 12z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
        <path d="M26 34l30 12 30-12" fill="none" stroke="${HL}" stroke-width="1.4"/>
        <rect x="40" y="38" width="32" height="7" rx="2" fill="${SH}" stroke="${INK}" stroke-width="1.2"/>
        <path d="M84 35v17" stroke="${c}" stroke-width="2"/>
        <circle cx="84" cy="54" r="3.2" fill="#ffc247" stroke="${INK}" stroke-width="1"/>
        <path d="M56 22v12" stroke="${INK}" stroke-width="1" opacity=".5"/>`,
      top: `<rect x="42" y="18" width="28" height="18" fill="${c}" stroke="${INK}" stroke-width="1.4"/>
        <path d="M42 18h28M42 36h28" stroke="${HL}" stroke-width="1.2"/>
        <rect x="42" y="26" width="28" height="5" fill="#c1443c" stroke="${INK}" stroke-width=".9"/>
        <rect x="35" y="35" width="42" height="6" rx="3" fill="${c}" stroke="${INK}" stroke-width="1.4"/>
        <path d="M38 38h36" stroke="${HL}" stroke-width="1.1"/>`,
      crown: `<path d="M34 37l4-17 9 8 9-15 9 15 9-8 4 17z" fill="${c}" stroke="#8a5c00"
          stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M38 30l6 3M74 30l-6 3" stroke="${HL}" stroke-width="1.6"/>
        <g><circle cx="56" cy="27" r="2.8" fill="#ff5c8a" stroke="#8a5c00" stroke-width=".7"/>
          <circle cx="41" cy="30" r="2.2" fill="#6fb3ff" stroke="#8a5c00" stroke-width=".7"/>
          <circle cx="71" cy="30" r="2.2" fill="#6fb3ff" stroke="#8a5c00" stroke-width=".7"/>
          <circle cx="48" cy="33" r="1.6" fill="#7cf7c4"/><circle cx="64" cy="33" r="1.6" fill="#7cf7c4"/></g>
        <rect x="34" y="36" width="44" height="4" fill="#8a5c00" opacity=".55"/>`,
      helmet: `<path d="M36 41q2-21 20-21t20 21z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
        <path d="M41 30q6-8 15-8" fill="none" stroke="${HL}" stroke-width="3"/>
        <rect x="34" y="39" width="44" height="7" rx="3" fill="${SH}" stroke="${INK}" stroke-width="1.3"/>
        <path d="M46 26q10-4 20 0" stroke="#6fb3ff" stroke-width="3" fill="none"/>
        <circle cx="66" cy="22" r="2" fill="#ff5c8a"/>`
    };
    return M[style] || '';
  };

  /* ------------------------------------------------------------ ACCESSORY */
  S.accessory = function (style, c) {
    c = c || '#2a2f5a';
    const M = {
      glasses: `<g fill="rgba(180,220,255,.35)" stroke="${c}" stroke-width="2.2">
          <circle cx="49" cy="62" r="7.4"/><circle cx="63" cy="62" r="7.4"/></g>
        <path d="M41.6 60h-5.6M70.4 60h5.6M56 62h0" stroke="${c}" stroke-width="2"/>
        <path d="M45 58q2-2 4-1M59 58q2-2 4-1" stroke="#fff" stroke-width="1.2" opacity=".85" fill="none"/>`,
      sun: `<g fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="1.2">
          <rect x="40.5" y="56.5" width="16" height="11" rx="4"/>
          <rect x="57.5" y="56.5" width="16" height="11" rx="4"/></g>
        <path d="M56.5 61h1" stroke="${c}" stroke-width="2.4"/>
        <path d="M43 59l3 6M60 59l3 6" stroke="rgba(255,255,255,.5)" stroke-width="1.4"/>`,
      scarf: `<path d="M40 88q16 10 32 0l2 9q-18 10-36 0z" fill="${c}" stroke="${INK}" stroke-width="1.3"/>
        <path d="M68 95l6 23-9 2-4-21z" fill="${c}" stroke="${INK}" stroke-width="1.3"/>
        <path d="M68 118l1 4M71 117l1 4M74 116l1 4" stroke="${SH}" stroke-width="1.4"/>
        <path d="M44 91q12 7 24 0" stroke="${HL}" stroke-width="1.4" fill="none"/>`,
      headphones: `<path d="M36 60a20 20 0 0140 0" fill="none" stroke="${c}" stroke-width="5.5"/>
        <path d="M38 58a18 18 0 0116-14" fill="none" stroke="${HL}" stroke-width="1.6"/>
        <g fill="${c}" stroke="${INK}" stroke-width="1.2">
          <rect x="29" y="55" width="11" height="19" rx="5.5"/>
          <rect x="72" y="55" width="11" height="19" rx="5.5"/></g>
        <g fill="${SH}"><rect x="32" y="59" width="5" height="11" rx="2.5"/>
          <rect x="75" y="59" width="5" height="11" rx="2.5"/></g>`,
      bow: `<path d="M50 92l-13-7v14zM62 92l13-7v14z" fill="${c}" stroke="${INK}" stroke-width="1.2"/>
        <path d="M52 90l-9-5M60 90l9-5" stroke="${HL}" stroke-width="1.2"/>
        <circle cx="56" cy="92" r="4.4" fill="${c}" stroke="${INK}" stroke-width="1.2"/>`,
      cape: `<path d="M36 104q20-8 40 0l10 72H26z" fill="${c}" stroke="${INK}" stroke-width="1.4"
          opacity=".96"/>
        <path d="M34 108q22-6 44 0" stroke="${HL}" stroke-width="2" fill="none"/>
        <path d="M32 172q24 4 48 0" stroke="${SH}" stroke-width="2" fill="none"/>`,
      wings: `<g fill="${c}" stroke="${INK}" stroke-width="1.2" opacity=".95">
          <path d="M36 110q-26-16-32 6 10 1 15 8-7 6-1 13 9-11 19-9z"/>
          <path d="M76 110q26-16 32 6-10 1-15 8 7 6 1 13-9-11-19-9z"/></g>
        <g stroke="${HL}" stroke-width="1.3" fill="none">
          <path d="M10 118q10 4 14 10M102 118q-10 4-14 10"/></g>`
    };
    return M[style] || '';
  };
})();
