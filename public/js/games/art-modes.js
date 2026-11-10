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
  /* A Strat-style electric guitar.  The body is built as a UNION of overlapping
     shapes drawn twice — once with a thick ink outline, once filled without a
     stroke — which gives one clean double-cutaway silhouette (two horns, a
     waist, two rounded bouts) with no internal seams.  That silhouette is what
     makes it read as an electric guitar rather than an acoustic blob. */
  const BODY_PARTS = [
    [-4, 40, 31, 23],    // lower bout
    [-4, 16, 19, 13],    // waist
    [-4, -2, 25, 15],    // upper bout
    [-26, -18, 10, 13],  // left horn (longer)
    [14, -14, 9, 11]     // right horn
  ];
  const partEll = (p, attrs) => '<ellipse cx="' + p[0] + '" cy="' + p[1] +
    '" rx="' + p[2] + '" ry="' + p[3] + '" ' + attrs + '/>';

  function guitar() {
    const union = (attrs) => BODY_PARTS.map((p) => partEll(p, attrs)).join('');
    const pickup = (y) => '<g transform="rotate(-5 -2 ' + y + ')">' +
      '<rect x="-16" y="' + y + '" width="30" height="7" rx="2.5" fill="#f2ecff" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<circle cx="-9" cy="' + (y + 3.5) + '" r="1" fill="#6b6290"/>' +
      '<circle cx="-2" cy="' + (y + 3.5) + '" r="1" fill="#6b6290"/>' +
      '<circle cx="6" cy="' + (y + 3.5) + '" r="1" fill="#6b6290"/></g>';
    return '<g transform="translate(154 86) rotate(-18) scale(1.05)">' +
      '<defs>' +
      '<linearGradient id="gb" x1=".1" y1="0" x2=".9" y2="1">' +
      '<stop offset="0" stop-color="#ff8394"/><stop offset=".35" stop-color="#e63a56"/>' +
      '<stop offset=".72" stop-color="#b41f3b"/><stop offset="1" stop-color="#780f24"/></linearGradient>' +
      '<linearGradient id="gn" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#f2c894"/><stop offset=".5" stop-color="#cb8a48"/>' +
      '<stop offset="1" stop-color="#7d4a1e"/></linearGradient>' +
      '<linearGradient id="gm" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#efeaf9"/><stop offset=".5" stop-color="#a49cc8"/>' +
      '<stop offset="1" stop-color="#5b5480"/></linearGradient>' +
      '<linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#2e1d16"/><stop offset="1" stop-color="#160d0a"/>' +
      '</linearGradient>' +
      '</defs>' +

      '<ellipse cx="4" cy="84" rx="54" ry="10" fill="#000" opacity=".5"/>' +

      /* neck first, so the body covers its join */
      '<rect x="-11" y="-112" width="22" height="92" fill="url(#gn)" stroke="' + INK + '" stroke-width="4"/>' +
      '<rect x="-8" y="-110" width="16" height="88" fill="url(#gf)" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<g stroke="#d8d2e8" stroke-width="1.5" opacity=".9">' +
      '<line x1="-8" y1="-100" x2="8" y2="-100"/><line x1="-8" y1="-89" x2="8" y2="-89"/>' +
      '<line x1="-8" y1="-78" x2="8" y2="-78"/><line x1="-8" y1="-67" x2="8" y2="-67"/>' +
      '<line x1="-8" y1="-56" x2="8" y2="-56"/><line x1="-8" y1="-45" x2="8" y2="-45"/>' +
      '<line x1="-8" y1="-34" x2="8" y2="-34"/></g>' +
      '<g fill="#fff8e6" opacity=".85">' +
      '<circle cx="0" cy="-95" r="1.7"/><circle cx="0" cy="-73" r="1.7"/>' +
      '<circle cx="0" cy="-51" r="1.7"/><circle cx="0" cy="-29" r="1.7"/></g>' +

      /* headstock: asymmetric, six pegs, like a Strat */
      '<path d="M-11 -112h22l-4 -36c-6 -4 -14 -4 -19 0z" fill="#1b1230" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<g class="gt-pegs" fill="#ffd77a" stroke="' + INK + '" stroke-width="1.1">' +
      '<circle cx="-9" cy="-122" r="2.8"/><circle cx="9" cy="-122" r="2.8"/>' +
      '<circle cx="-10" cy="-132" r="2.8"/><circle cx="10" cy="-132" r="2.8"/>' +
      '<circle cx="-11" cy="-142" r="2.8"/><circle cx="11" cy="-142" r="2.8"/></g>' +
      '<rect x="-11" y="-113" width="22" height="3.4" fill="#efe6cf" stroke="' + INK + '" stroke-width="1.2"/>' +

      /* the body: ink pass, then fill pass */
      '<g transform="translate(0 -2)">' +
      '<g class="gt-body" fill="' + INK + '" stroke="' + INK + '" stroke-width="9" stroke-linejoin="round">' +
      union('') + '</g>' +
      '<g fill="url(#gb)">' + union('') + '</g>' +
      /* a soft inner shade so the body has a rounded edge */
      '<g fill="#000" opacity=".10">' +
      partEll([-4, 44, 26, 17], '') + partEll([-4, 22, 15, 8], '') + '</g>' +
      '</g>' +

      /* pickguard sweep, hardware, knobs */
      '<path d="M-1 8c15 3 21 11 18 22-11 1-21-9-18-22z" fill="#fff8f2" opacity=".93" stroke="' + INK + '" stroke-width="1.6"/>' +
      pickup(8) + pickup(20) + pickup(32) +
      '<rect x="-18" y="40" width="34" height="9" rx="2.5" fill="url(#gm)" stroke="' + INK + '" stroke-width="2"/>' +
      '<g stroke="' + INK + '" stroke-width="1" opacity=".65">' +
      '<line x1="-13" y1="40" x2="-13" y2="49"/><line x1="-7" y1="40" x2="-7" y2="49"/>' +
      '<line x1="-1" y1="40" x2="-1" y2="49"/><line x1="5" y1="40" x2="5" y2="49"/>' +
      '<line x1="11" y1="40" x2="11" y2="49"/></g>' +
      '<path d="M12 50l16 7 7 -7" fill="none" stroke="url(#gm)" stroke-width="3.4" stroke-linecap="round"/>' +
      '<circle cx="12" cy="50" r="3.4" fill="#cbc3e6" stroke="' + INK + '" stroke-width="1.4"/>' +
      '<g stroke="' + INK + '" stroke-width="1.6" fill="#fff8f2">' +
      '<circle cx="16" cy="16" r="4.6"/><circle cx="-26" cy="36" r="4.6"/><circle cx="-26" cy="50" r="4.6"/></g>' +
      '<g fill="#ffd77a"><circle cx="16" cy="16" r="1.5"/><circle cx="-26" cy="36" r="1.5"/><circle cx="-26" cy="50" r="1.5"/></g>' +
      '<circle cx="-32" cy="58" r="3" fill="url(#gm)" stroke="' + INK + '" stroke-width="1.4"/>' +
      '<circle cx="-34" cy="10" r="3" fill="url(#gm)" stroke="' + INK + '" stroke-width="1.4"/>' +

      /* six strings, from the saddles to the nut */
      '<g class="gt-strings" stroke="#fff8ea" stroke-width="1.05" opacity=".9">' +
      '<line x1="-13" y1="44" x2="-9" y2="-110"/><line x1="-7" y1="44" x2="-5" y2="-110"/>' +
      '<line x1="-1" y1="44" x2="-1" y2="-110"/><line x1="5" y1="44" x2="3" y2="-110"/>' +
      '<line x1="11" y1="44" x2="7" y2="-110"/></g>' +

      /* gloss */
      '<path d="M-30 -14c6-6 14-9 22-8" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" opacity=".38"/>' +
      '<path d="M-24 54c9 4 20 2 25-4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".2"/>' +
      '</g>';
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
