/* Astrolab — the three TableStar mode cards, drawn with depth.
   Everything gets a gradient, a highlight and a shadow, so the cards read as
   objects standing on a floor rather than flat icons.
   GARAGE  an electric guitar in a spotlight
   STUDIO  a recording studio: desk, monitors, console, boom mic, REC
   SOUNDCHECK  headphones over a level meter (a warm-up, which is what it is)
*/
(function () {
  'use strict';
  const A = window.ART = window.ART || {};
  const INK = '#140b26';

  const spark = (x, y, r, c) => `<path d="M${x} ${y - r}l${r * .3} ${r * .62}
    ${r * .68} ${-.08}-${r * .52} ${r * .45} ${r * .19} ${r * .66}-${r * .63} ${-.34}
    -${r * .63} ${r * .34} ${r * .19} ${-.66}-${r * .52} ${-.45} ${r * .68} ${.08}z"
    fill="${c}" stroke="${INK}" stroke-width="2.4"/>`;

  /* a shared stage: gradient wall, spotlight, floor with reflection, vignette */
  function stage(id, top, mid, floor, glow) {
    return `<defs>
        <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${mid}"/>
        </linearGradient>
        <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${floor}"/><stop offset="1" stop-color="${INK}"/>
        </linearGradient>
        <radialGradient id="${id}s" cx=".5" cy=".1" r=".8">
          <stop offset="0" stop-color="${glow}" stop-opacity=".55"/>
          <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="${id}v" cx=".5" cy=".45" r=".78">
          <stop offset=".55" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".42"/>
        </radialGradient>
      </defs>
      <rect width="320" height="160" fill="url(#${id}w)"/>
      <ellipse cx="160" cy="34" rx="150" ry="86" fill="url(#${id}s)"/>
      <rect y="118" width="320" height="42" fill="url(#${id}f)"/>
      <rect y="117" width="320" height="2" fill="#fff" opacity=".10"/>`;
  }

  const vignette = (id) => `<rect width="320" height="160" fill="url(#${id}v)"/>`;

  /* ------------------------------------------------------------------ GARAGE */
  /* A flat-cartoon Stratocaster: red-orange body, big cream pickguard, three
     slanted single coils, two knobs, tremolo arm, thick navy outline.  The body
     and pickguard paths were generated from measured outlines, so the shape
     really is a double cutaway with a waist. */
  const G_BODY = 'M -3.0 -63.0 Q -10.0 -62.0 -19.0 -61.0 Q -28.0 -60.0 -36.0 -53.0 Q -44.0 -46.0 -46.0 -38.0 Q -48.0 -30.0 -44.0 -25.0 Q -40.0 -20.0 -34.0 -17.0 Q -28.0 -14.0 -26.0 -7.0 Q -24.0 0.0 -26.0 7.0 Q -28.0 14.0 -31.0 20.0 Q -34.0 26.0 -33.0 33.0 Q -32.0 40.0 -26.0 46.0 Q -20.0 52.0 -11.0 55.0 Q -2.0 58.0 7.0 56.0 Q 16.0 54.0 23.0 48.0 Q 30.0 42.0 33.0 34.0 Q 36.0 26.0 35.0 19.0 Q 34.0 12.0 32.0 5.0 Q 30.0 -2.0 33.0 -8.0 Q 36.0 -14.0 40.0 -17.0 Q 44.0 -20.0 45.0 -26.0 Q 46.0 -32.0 42.0 -40.0 Q 38.0 -48.0 30.0 -54.0 Q 22.0 -60.0 13.0 -62.0 Q 4.0 -64.0 -3.0 -63.0 Z';
  const G_GUARD = 'M -30.0 2.0 Q -30.0 -6.0 -22.0 -10.0 Q -14.0 -14.0 -2.0 -13.0 Q 10.0 -12.0 18.0 -8.0 Q 26.0 -4.0 28.0 3.0 Q 30.0 10.0 29.0 19.0 Q 28.0 28.0 23.0 36.0 Q 18.0 44.0 9.0 47.0 Q 0.0 50.0 -9.0 47.0 Q -18.0 44.0 -23.0 36.0 Q -28.0 28.0 -29.0 19.0 Q -30.0 10.0 -30.0 2.0 Z';

  function guitar() {
    const pickup = (y, tilt) => '<g transform="rotate(' + tilt + ' -2 ' + y + ')">' +
      '<rect x="-17" y="' + y + '" width="32" height="8" rx="3" fill="#f6f1ff" ' +
      'stroke="' + INK + '" stroke-width="2"/>' +
      '<circle cx="-10" cy="' + (y + 4) + '" r="1.1" fill="#7a719e"/>' +
      '<circle cx="-2" cy="' + (y + 4) + '" r="1.1" fill="#7a719e"/>' +
      '<circle cx="7" cy="' + (y + 4) + '" r="1.1" fill="#7a719e"/></g>';
    const knob = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r +
      '" fill="#fff9f2" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M' + (x - r * 0.6) + ' ' + y + 'h' + (r * 1.2) + '" stroke="' + INK +
      '" stroke-width="1.2" opacity=".55"/>';
    const s = [];
    s.push('<g transform="translate(206 128) rotate(-22) scale(.5)">');
    s.push('<ellipse cx="0" cy="62" rx="54" ry="8" fill="#000" opacity=".45"/>');

    // neck + fretboard + frets + inlays, all above the body
    s.push('<rect x="-13" y="-238" width="26" height="182" fill="#e0ab6c" stroke="' + INK +
      '" stroke-width="5"/>');
    s.push('<rect x="-9.5" y="-236" width="19" height="176" fill="#241611" stroke="' + INK +
      '" stroke-width="2"/>');
    const frets = [-214, -196, -179, -163, -148, -134, -121, -109, -98, -88, -79, -71];
    s.push('<g stroke="#d9d2ea" stroke-width="1.8" opacity=".92">' +
      frets.map((y) => '<line x1="-9.5" y1="' + y + '" x2="9.5" y2="' + y + '"/>').join('') +
      '</g>');
    s.push('<g fill="#fffaf0" opacity=".9">' +
      [-205, -171, -140, -113, -93, -75].map((y) =>
        '<circle cx="0" cy="' + y + '" r="2.2"/>').join('') +
      '<rect x="-2.6" y="-156" width="5.2" height="9" rx="2"/></g>');

    // headstock: 6 in a row on one side, Strat style
    s.push('<path d="M-13 -238h26l13 -30c2 -8 -3 -14 -11 -14h-30c-8 0 -13 6 -11 14z" ' +
      'fill="#1d1334" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>');
    s.push('<g class="gt-pegs" fill="#ffd77a" stroke="' + INK + '" stroke-width="1.4">' +
      [-268, -256, -244].map((y) => '<circle cx="-22" cy="' + y + '" r="3.6"/>').join('') +
      [-268, -256, -244].map((y) => '<circle cx="20" cy="' + y + '" r="3.6"/>').join('') +
      '</g>');
    s.push('<rect x="-13" y="-239" width="26" height="4" fill="#f2ead6" stroke="' + INK +
      '" stroke-width="1.4"/>');

    // body: outline pass then fill pass
    s.push('<path d="' + G_BODY + '" fill="' + INK + '" stroke="' + INK +
      '" stroke-width="11" stroke-linejoin="round"/>');
    s.push('<path class="gt-body" d="' + G_BODY + '" fill="#e8552b" stroke="' + INK + '" stroke-width="5"/>');
    // rounded edge: a darker band inside the outline
    s.push('<path d="' + G_BODY + '" fill="none" stroke="#b83a18" stroke-width="7" opacity=".55"/>');

    // the big cream pickguard
    s.push('<path class="gt-guard" d="' + G_GUARD + '" fill="#fdf3de" stroke="' + INK + '" stroke-width="4"/>');

    // three slanted single coils, bridge first
    s.push(pickup(6, -7), pickup(20, -7), pickup(34, -7));
    // bridge + tremolo
    s.push('<rect x="-20" y="46" width="38" height="8" rx="2" fill="#cfc7e8" stroke="' + INK +
      '" stroke-width="2.4"/>');
    s.push('<g stroke="' + INK + '" stroke-width="1.1" opacity=".7">' +
      [-15, -9, -3, 3, 9, 15].map((x) => '<line x1="' + x + '" y1="46" x2="' + x +
        '" y2="54"/>').join('') + '</g>');
    s.push('<path d="M16 50l14 12 10-4" fill="none" stroke="#cfc7e8" stroke-width="4" ' +
      'stroke-linecap="round"/><circle cx="16" cy="50" r="4" fill="#9d93c4" stroke="' + INK +
      '" stroke-width="1.6"/>');
    // two knobs, on the guard, lower right
    s.push(knob(16, 28, 5.6), knob(25, 38, 5.6));
    // output jack + strap button
    s.push('<circle cx="-34" cy="52" r="3.6" fill="#cfc7e8" stroke="' + INK +
      '" stroke-width="1.6"/>');
    s.push('<circle cx="-40" cy="-24" r="3.6" fill="#cfc7e8" stroke="' + INK +
      '" stroke-width="1.6"/>');

    // six strings, saddles to nut
    s.push('<g class="gt-strings" stroke="#fffdf4" stroke-width="1.2" opacity=".92">' +
      [-15, -9, -3, 3, 9, 15].map((x) => '<line x1="' + x + '" y1="47" x2="' +
        (x * 0.62).toFixed(1) + '" y2="-238"/>').join('') + '</g>');

    // gloss on the upper bout
    s.push('<path d="M-40 -20c6-12 18-20 30-22" fill="none" stroke="#fff" stroke-width="5" ' +
      'stroke-linecap="round" opacity=".3"/>');
    s.push('</g>');
    return s.join('');
  }

  /* ------------------------------------------------------------------ STUDIO */
  function recordingStudio() {
    const fader = (x, h) => {
      const y = 108 + (34 - h * 34);
      return `<rect x="${x}" y="108" width="8" height="34" rx="4" fill="#120a22"/>
        <rect x="${x + 2}" y="${y + 6}" width="4" height="${(h * 34) - 6}" rx="2" fill="#5cffc0"/>
        <rect x="${x - 4}" y="${y}" width="16" height="7" rx="2" fill="#ffd77a"
          stroke="${INK}" stroke-width="1.6"/>
        <rect x="${x - 2}" y="${y + 1.4}" width="12" height="2" rx="1" fill="#fff" opacity=".6"/>`;
    };
    const wave = [6, 12, 20, 9, 16, 24, 11, 7, 18, 26, 14, 8, 20, 12, 6, 16, 22, 10, 14, 20]
      .map((h, i) => `<rect x="${188 + i * 6}" y="${86 - h / 2}" width="3.6" height="${h}" rx="1.8"
        fill="${i % 3 ? '#5cffc0' : '#ffd77a'}" opacity="${i > 16 ? .55 : 1}"/>`).join('');
    const foam = Array.from({ length: 6 }, (_, i) =>
      `<rect x="${6 + i * 54}" y="${8 + (i % 2) * 14}" width="42" height="42" rx="4"
        fill="none" stroke="#ffd6a8" stroke-width="2" opacity=".22"/>`).join('');
    return `<defs>
        <linearGradient id="sdesk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3a2566"/><stop offset="1" stop-color="#1d1236"/>
        </linearGradient>
        <linearGradient id="smon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2d1f52"/><stop offset="1" stop-color="#170f2c"/>
        </linearGradient>
        <linearGradient id="sscr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#12244a"/><stop offset="1" stop-color="#08101f"/>
        </linearGradient>
      </defs>
      ${foam}

      <!-- desk: top surface, front panel, shadow under it -->
      <rect x="6" y="112" width="308" height="10" fill="#4a2f80"/>
      <rect x="6" y="120" width="308" height="34" fill="url(#sdesk)" stroke="${INK}" stroke-width="3"/>
      <rect x="6" y="120" width="308" height="3" fill="#fff" opacity=".10"/>
      ${[0, 1, 2, 3].map((i) => `<circle cx="${18 + i * 82}" cy="146" r="2.2" fill="#6b5aa0"/>`).join('')}

      <!-- console screen with waveform, above the faders -->
      <rect x="176" y="52" width="140" height="52" rx="6" fill="url(#sscr)" stroke="${INK}" stroke-width="3"/>
      <rect x="181" y="57" width="130" height="42" rx="3" fill="#0a1526" opacity=".8"/>
      <line x1="184" y1="86" x2="306" y2="86" stroke="#5cffc0" stroke-width=".8" opacity=".35"/>
      ${wave}
      <circle cx="308" cy="56" r="2.4" fill="#e8455e"/><circle cx="300" cy="56" r="2.4" fill="#5cffc0"/>

      <!-- faders on the desk top -->
      ${fader(24, .82)}${fader(46, .55)}${fader(68, .95)}${fader(90, .4)}
      ${fader(112, .68)}${fader(134, .3)}
      <circle cx="162" cy="126" r="6.5" fill="#e8455e" stroke="${INK}" stroke-width="2"/>
      <circle cx="180" cy="126" r="6.5" fill="#ffd77a" stroke="${INK}" stroke-width="2"/>
      <circle cx="198" cy="126" r="6.5" fill="#5cffc0" stroke="${INK}" stroke-width="2"/>
      <circle cx="272" cy="132" r="10" fill="#e8455e" stroke="${INK}" stroke-width="2.6"/>
      <circle cx="272" cy="130" r="4" fill="#ff9db1"/>
      <text x="272" y="152" text-anchor="middle" font-family="Archivo Black, sans-serif"
        font-size="8.5" fill="#ffd77a" letter-spacing="1.4">REC</text>

      <!-- monitors, angled in, with shadow -->
      <ellipse cx="56" cy="96" rx="40" ry="7" fill="#000" opacity=".4"/>
      <g transform="translate(54 64) rotate(-6)">
        <rect x="-36" y="-26" width="72" height="52" rx="7" fill="url(#smon)"
          stroke="${INK}" stroke-width="4"/>
        <rect x="-32" y="-22" width="34" height="44" rx="4" fill="#0d0819" opacity=".7"/>
        <circle cx="8" cy="0" r="14" fill="#3a2a63" stroke="${INK}" stroke-width="2.6"/>
        <circle cx="8" cy="0" r="7" fill="#221741" stroke="${INK}" stroke-width="1.6"/>
        <circle cx="8" cy="0" r="3" fill="#ffd77a"/>
        <circle cx="8" cy="-9" r="2.6" fill="#cbb9ff" opacity=".8"/>
        <rect x="-30" y="16" width="16" height="3" rx="1.5" fill="#5cffc0" opacity=".8"/>
      </g>
      <ellipse cx="266" cy="96" rx="40" ry="7" fill="#000" opacity=".4"/>
      <g transform="translate(268 64) rotate(6)">
        <rect x="-36" y="-26" width="72" height="52" rx="7" fill="url(#smon)"
          stroke="${INK}" stroke-width="4"/>
        <rect x="-2" y="-22" width="34" height="44" rx="4" fill="#0d0819" opacity=".7"/>
        <circle cx="-8" cy="0" r="14" fill="#3a2a63" stroke="${INK}" stroke-width="2.6"/>
        <circle cx="-8" cy="0" r="7" fill="#221741" stroke="${INK}" stroke-width="1.6"/>
        <circle cx="-8" cy="0" r="3" fill="#ffd77a"/>
        <circle cx="-8" cy="-9" r="2.6" fill="#cbb9ff" opacity=".8"/>
      </g>

      <!-- boom mic -->
      <path d="M14 104V58l58-24" fill="none" stroke="${INK}" stroke-width="4.4"
        stroke-linecap="round"/>
      <path d="M14 104V58l58-24" fill="none" stroke="#8f86b8" stroke-width="1.6"
        stroke-linecap="round" opacity=".8"/>
      <g transform="translate(78 29) rotate(22)">
        <rect x="-10" y="-14" width="20" height="28" rx="10" fill="#efe8ff" stroke="${INK}" stroke-width="3.4"/>
        <path d="M-10 0h20M-10 -5h20M-10 5h20" stroke="${INK}" stroke-width="1" opacity=".5"/>
        <rect x="-4" y="-11" width="8" height="4" rx="2" fill="#cbb9ff"/>
      </g>`;
  }

  /* --------------------------------------------------------------- SOUNDCHECK */
  function soundcheck() {
    const bars = [10, 18, 30, 22, 38, 48, 34, 26, 44, 52, 30, 20, 34, 22, 12]
      .map((h, i) => `<rect x="${20 + i * 17}" y="${118 - h}" width="10" height="${h}" rx="3"
        fill="${i < 8 ? '#5cffc0' : i < 11 ? '#ffd77a' : '#33254f'}" stroke="${INK}" stroke-width="1.6"/>`)
      .join('');
    const scale = Array.from({ length: 8 }, (_, i) =>
      `<line x1="${26 + i * 34}" y1="112" x2="${26 + i * 34}" y2="${i % 2 ? 108 : 105}"
        stroke="#8f86b8" stroke-width="1.4" opacity=".7"/>`).join('');
    return `<defs>
        <linearGradient id="hpad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff7a8c"/><stop offset="1" stop-color="#b62a42"/>
        </linearGradient>
      </defs>
      <!-- cable -->
      <path d="M186 104c22 10 30 2 40 -6" fill="none" stroke="${INK}" stroke-width="3.4"
        stroke-linecap="round" opacity=".85"/>
      <!-- headband: dark, then metal, then highlight -->
      <path d="M92 88V64a48 48 0 0 1 96 0v24" fill="none" stroke="${INK}"
        stroke-width="13" stroke-linecap="round"/>
      <path d="M92 88V64a48 48 0 0 1 96 0v24" fill="none" stroke="#efe8ff"
        stroke-width="7" stroke-linecap="round"/>
      <path d="M100 86V64a40 40 0 0 1 40 -40" fill="none" stroke="#fff" stroke-width="2"
        stroke-linecap="round" opacity=".8"/>
      <!-- ear cups with cushions -->
      <ellipse cx="92" cy="96" rx="19" ry="23" fill="url(#hpad)" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="92" cy="96" rx="9" ry="12" fill="#8f1f33"/>
      <ellipse cx="88" cy="86" rx="4" ry="3" fill="#fff" opacity=".5"/>
      <ellipse cx="188" cy="96" rx="19" ry="23" fill="url(#hpad)" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="188" cy="96" rx="9" ry="12" fill="#8f1f33"/>
      <ellipse cx="184" cy="86" rx="4" ry="3" fill="#fff" opacity=".5"/>
      <!-- meter -->
      ${scale}
      <rect x="10" y="118" width="270" height="11" rx="5.5" fill="#150d28" stroke="${INK}" stroke-width="2"/>
      ${bars}
      <rect x="256" y="118" width="13" height="11" rx="4" fill="#e8455e" stroke="${INK}" stroke-width="2"/>
      <!-- green tick -->
      <path d="M244 40l11 13 22-26" fill="none" stroke="${INK}" stroke-width="11"
        stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M244 40l11 13 22-26" fill="none" stroke="#5cffc0" stroke-width="6"
        stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  A.modeArt = {
    garage: () => stage('mg', '#3d2210', '#1d1008', '#2a1608', '#ffb05e')
      + spark(36, 28, 11, '#ffd77a') + spark(288, 24, 8, '#fff') + guitar() + vignette('mg'),
    studio: () => stage('ms', '#3a1550', '#150a26', '#2a1145', '#ff7fb0')
      + recordingStudio() + vignette('ms'),
    sound: () => stage('mc', '#0f3452', '#061525', '#0b2438', '#6fd8ff')
      + spark(292, 26, 9, '#5cffc0') + soundcheck() + vignette('mc')
  };
})();
