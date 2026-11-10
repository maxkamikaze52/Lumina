/* Astrolab — the three TableStar mode cards.
   GARAGE  an actual electric guitar, drawn in the style of a poster
   STUDIO  a recording studio: desk, monitors, sliders, mic on a boom, "REC"
   SOUNDCHECK  headphones and a level meter — an audio check, which is what
               SOUNDCHECK actually is (a quick warm-up of mixed questions)
*/
(function () {
  'use strict';
  const A = window.ART = window.ART || {};
  const INK = '#1a1030';

  const spark = (x, y, r, c) => `<path d="M${x} ${y - r}l${r * .3} ${r * .62}
    ${r * .68} ${-.08}-${r * .52} ${r * .45} ${r * .19} ${r * .66}-${r * .63} ${-.34}
    -${r * .63} ${r * .34} ${r * .19} ${-.66}-${r * .52} ${-.45} ${r * .68} ${.08}z"
    fill="${c}" stroke="${INK}" stroke-width="2.4"/>`;

  /* ------------------------------------------------------------------ GARAGE */
  function guitar() {
    return `<g transform="translate(148 82) rotate(-16)">
      <!-- body: two bouts, drawn as one path so it reads as a guitar -->
      <path d="M-8 -4c-26 -4 -40 10 -38 26 1 12 10 16 12 24 3 14 16 22 30 20
               12-1 20-9 22-18 2-10-2-16 2-24 5-11-4-24-28-28z"
        fill="#e8455e" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M-30 6c-8 4-12 12-10 20 1 6 5 9 8 12" fill="none" stroke="#b62a42"
        stroke-width="4" opacity=".75"/>
      <!-- cutaway so it is not a blob -->
      <path d="M-40 30c6 4 10 10 12 18" fill="none" stroke="${INK}" stroke-width="3.4"
        opacity=".55"/>
      <!-- sound hole + rosette -->
      <circle cx="-6" cy="12" r="11" fill="${INK}"/>
      <circle cx="-6" cy="12" r="13.5" fill="none" stroke="#ffd77a" stroke-width="2.2"/>
      <!-- bridge + tailpiece -->
      <rect x="-16" y="30" width="22" height="6" rx="2" fill="${INK}" opacity=".85"/>
      <rect x="-18" y="38" width="26" height="4" rx="2" fill="#c8b6ff" opacity=".8"/>
      <!-- pickguard -->
      <path d="M2 8c10 2 12 12 8 20-6-4-10-12-8-20z" fill="#fff" opacity=".85"
        stroke="${INK}" stroke-width="2"/>
      <!-- volume + tone knobs -->
      <circle cx="14" cy="30" r="3.4" fill="${INK}"/>
      <circle cx="22" cy="24" r="3.4" fill="${INK}"/>
      <!-- neck -->
      <rect x="-8" y="-84" width="17" height="84" rx="3" fill="#c98b4a"
        stroke="${INK}" stroke-width="4"/>
      <!-- frets -->
      <g stroke="${INK}" stroke-width="2" opacity=".8">
        <line x1="-8" y1="-70" x2="9" y2="-70"/><line x1="-8" y1="-58" x2="9" y2="-58"/>
        <line x1="-8" y1="-46" x2="9" y2="-46"/><line x1="-8" y1="-34" x2="9" y2="-34"/>
        <line x1="-8" y1="-22" x2="9" y2="-22"/>
      </g>
      <!-- strings from bridge to nut -->
      <g stroke="#ffeecd" stroke-width="1.1" opacity=".95">
        <line x1="-12" y1="30" x2="-5" y2="-82"/><line x1="-9" y1="30" x2="-2" y2="-82"/>
        <line x1="-6" y1="30" x2="1" y2="-82"/><line x1="-3" y1="30" x2="4" y2="-82"/>
        <line x1="0" y1="30" x2="7" y2="-82"/>
      </g>
      <!-- headstock with tuning pegs -->
      <path d="M-9 -84h19l4 -24h-27z" fill="${INK}"/>
      <circle cx="-4" cy="-96" r="3" fill="#ffd77a"/><circle cx="4" cy="-96" r="3" fill="#ffd77a"/>
      <circle cx="-2" cy="-104" r="3" fill="#ffd77a"/><circle cx="6" cy="-104" r="3" fill="#ffd77a"/>
      <!-- strap button -->
      <circle cx="-42" cy="16" r="3" fill="${INK}"/>
    </g>`;
  }

  /* ------------------------------------------------------------------ STUDIO */
  function recordingStudio() {
    const fader = (x, h) => `<rect x="${x}" y="112" width="7" height="34" rx="3" fill="#2b1f4a"/>
      <rect x="${x + 1.5}" y="${112 + (34 - h * 34)}" width="4" height="${h * 34}" rx="2"
        fill="#5cffc0"/>
      <rect x="${x - 3}" y="${112 + (34 - h * 34) - 4}" width="13" height="6" rx="2"
        fill="#ffd77a" stroke="${INK}" stroke-width="1.4"/>`;
    const wave = Array.from({ length: 22 }, (_, i) => {
      const h = [6, 12, 20, 9, 16, 24, 11, 7, 18, 26, 14, 8, 20, 12, 6, 16, 22, 10, 14, 20, 9, 5][i];
      return `<rect x="${188 + i * 5.6}" y="${92 - h / 2}" width="3.4" height="${h}" rx="1.7"
        fill="${i % 3 ? '#5cffc0' : '#ffd77a'}"/>`;
    }).join('');
    return `<g>
      <!-- the room: acoustic foam behind -->
      <g opacity=".28">${Array.from({ length: 6 }, (_, i) =>
        `<rect x="${10 + i * 52}" y="${16 + (i % 2) * 12}" width="40" height="40" rx="4"
          fill="none" stroke="#ffd6a8" stroke-width="2"/>`).join('')}</g>

      <!-- desk -->
      <path d="M8 118h304v34H8z" fill="#2a1a4a" stroke="${INK}" stroke-width="4"/>
      <path d="M8 118h304" stroke="${INK}" stroke-width="4"/>
      ${fader(28, .82)}${fader(50, .55)}${fader(72, .95)}${fader(94, .4)}
      ${fader(116, .68)}${fader(138, .3)}
      <!-- mute / solo buttons -->
      <circle cx="166" cy="128" r="6" fill="#e8455e" stroke="${INK}" stroke-width="2"/>
      <circle cx="184" cy="128" r="6" fill="#ffd77a" stroke="${INK}" stroke-width="2"/>
      <circle cx="202" cy="128" r="6" fill="#5cffc0" stroke="${INK}" stroke-width="2"/>
      <!-- REC button, lit -->
      <circle cx="272" cy="130" r="9" fill="#e8455e" stroke="${INK}" stroke-width="2.6"/>
      <circle cx="272" cy="130" r="3.4" fill="#fff" opacity=".8"/>
      <text x="272" y="148" text-anchor="middle" font-family="Archivo Black, sans-serif"
        font-size="8" fill="#ffd77a" letter-spacing="1">REC</text>

      <!-- two near-field monitors, angled in -->
      <g transform="translate(52 62) rotate(-6)">
        <rect x="-34" y="-24" width="68" height="48" rx="6" fill="#20143c" stroke="${INK}" stroke-width="4"/>
        <circle cx="-10" cy="0" r="13" fill="#3a2a63" stroke="${INK}" stroke-width="2.6"/>
        <circle cx="-10" cy="0" r="5" fill="#ffd77a"/>
        <circle cx="18" cy="0" r="6" fill="#3a2a63" stroke="${INK}" stroke-width="2"/>
      </g>
      <g transform="translate(268 62) rotate(6)">
        <rect x="-34" y="-24" width="68" height="48" rx="6" fill="#20143c" stroke="${INK}" stroke-width="4"/>
        <circle cx="10" cy="0" r="13" fill="#3a2a63" stroke="${INK}" stroke-width="2.6"/>
        <circle cx="10" cy="0" r="5" fill="#ffd77a"/>
        <circle cx="-18" cy="0" r="6" fill="#3a2a63" stroke="${INK}" stroke-width="2"/>
      </g>

      <!-- the waveform on the console screen -->
      <rect x="180" y="56" width="132" height="46" rx="5" fill="#0e0a20" stroke="${INK}" stroke-width="3"/>
      ${wave}

      <!-- boom mic reaching over the desk -->
      <path d="M16 96l0 -46 54 -22" fill="none" stroke="${INK}" stroke-width="4"
        stroke-linecap="round"/>
      <g transform="translate(76 28) rotate(20)">
        <rect x="-9" y="-13" width="18" height="26" rx="9" fill="#efe8ff" stroke="${INK}" stroke-width="3.4"/>
        <path d="M-9 0h18" stroke="${INK}" stroke-width="2"/>
      </g>
    </g>`;
  }

  /* --------------------------------------------------------------- SOUNDCHECK */
  function soundcheck() {
    const bars = Array.from({ length: 15 }, (_, i) => {
      const h = [10, 18, 30, 22, 38, 48, 34, 26, 44, 52, 30, 20, 34, 22, 12][i];
      const lit = i < 11;
      return `<rect x="${22 + i * 16}" y="${120 - h}" width="9" height="${h}" rx="3"
        fill="${lit ? (i < 8 ? '#5cffc0' : i < 11 ? '#ffd77a' : '#3a2a63') : '#3a2a63'}"
        stroke="${INK}" stroke-width="1.6"/>`;
    }).join('');
    return `<g>
      <!-- headphones, big and obvious -->
      <path d="M96 84V64a44 44 0 0 1 88 0v20" fill="none" stroke="${INK}"
        stroke-width="11" stroke-linecap="round"/>
      <path d="M96 84V64a44 44 0 0 1 88 0v20" fill="none" stroke="#efe8ff"
        stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="96" cy="94" rx="17" ry="21" fill="#e8455e" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="184" cy="94" rx="17" ry="21" fill="#e8455e" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="96" cy="94" rx="8" ry="11" fill="#b62a42"/>
      <ellipse cx="184" cy="94" rx="8" ry="11" fill="#b62a42"/>
      <!-- level meter -->
      <rect x="12" y="118" width="252" height="10" rx="5" fill="#2b1f4a" stroke="${INK}" stroke-width="2"/>
      ${bars}
      <rect x="252" y="118" width="12" height="10" rx="4" fill="#e8455e" stroke="${INK}" stroke-width="2"/>
      <!-- a cheeky tick -->
      <path d="M240 44l10 12 20-24" fill="none" stroke="#5cffc0" stroke-width="7"
        stroke-linecap="round" stroke-linejoin="round"/>
    </g>`;
  }

  const WRAP = {
    garage: (bg1, bg2, ground) => `<defs>
        <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
        </linearGradient></defs>
      <rect width="320" height="160" fill="url(#mg)"/>
      <rect y="118" width="320" height="42" fill="${ground}"/>`,
    studio: (bg1, bg2, ground) => `<defs>
        <linearGradient id="ms" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
        </linearGradient></defs>
      <rect width="320" height="160" fill="url(#ms)"/>
      <rect y="118" width="320" height="42" fill="${ground}"/>`,
    sound: (bg1, bg2, ground) => `<defs>
        <linearGradient id="mc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
        </linearGradient></defs>
      <rect width="320" height="160" fill="url(#mc)"/>
      <rect y="118" width="320" height="42" fill="${ground}"/>`
  };

  A.modeArt = {
    garage: () => WRAP.garage('#3a1f0a', '#25130a', '#1a0d06') + spark(38, 30, 11, '#ffd77a')
      + spark(286, 26, 9, '#fff') + guitar(),
    studio: () => WRAP.studio('#2a1140', '#170a28', '#0f0619') + spark(20, 22, 8, '#ff9db1')
      + recordingStudio(),
    sound: () => WRAP.sound('#0d2a44', '#08192b', '#050f1c') + spark(288, 30, 9, '#5cffc0')
      + soundcheck()
  };
})();
