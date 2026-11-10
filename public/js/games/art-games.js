/* Astrolab — poster art for the mode tiles. Flat shapes, thick outlines. */
(function () {
  'use strict';
  const S = window.ART;
  const O = '#22305c';
  const OL = 'stroke="#22305c" stroke-width="5" stroke-linejoin="round"';

  const star = (x, y, r, c) => `<path d="M${x} ${y - r}l${r * .3} ${r * .65} ${r * .72} -.1-${r * .55} ${r * .48} ${r * .2} ${r * .7}-${r * .67} -.36-${r * .67} .36 ${r * .2} -.7-${r * .55} -.48 ${r * .72} .1z" fill="${c}" ${OL} stroke-width="3"/>`;

  S.poster = function (kind) {
    switch (kind) {
      /* ---------- TableStar ---------- */
      case 'gig':
        return `<rect width="320" height="160" fill="#a06bff"/>
          <path d="M0 118c60-26 96 22 160 4s104-38 160-10v48H0z" fill="#7f4be0"/>
          ${star(40, 34, 15, '#ffc93c')}${star(276, 46, 12, '#ffc93c')}${star(232, 24, 9, '#fff')}
          <g transform="translate(160 96)">
            <rect x="-30" y="-46" width="60" height="14" rx="4" fill="#22305c"/>
            <circle cx="-14" cy="-38" r="12" fill="#5b6ee1" ${OL} stroke-width="4"/>
            <circle cx="16" cy="-38" r="12" fill="#5b6ee1" ${OL} stroke-width="4"/>
            <rect x="-70" y="-30" width="30" height="20" rx="4" fill="#fff" ${OL} stroke-width="4"/>
            <rect x="42" y="-30" width="30" height="20" rx="4" fill="#fff" ${OL} stroke-width="4"/>
            <path d="M18-20l-30 10 26 6-22 26" fill="none" stroke="#ff4d5e" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
            <text x="-6" y="30" font-family="Fredoka,sans-serif" font-size="30" font-weight="700" fill="#fff" text-anchor="middle">×12</text>
          </g>`;
      case 'studio': {
        return `<defs>
            <linearGradient id="ps-a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#ffa45c"/><stop offset="1" stop-color="#f5813a"/>
            </linearGradient>
            <linearGradient id="ps-b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#ef7a34"/><stop offset="1" stop-color="#dd6a28"/>
            </linearGradient>
          </defs>
          <rect width="320" height="160" fill="url(#ps-a)"/>
          <rect y="104" width="320" height="56" fill="url(#ps-b)"/>
          <path d="M0 104h320" stroke="#22305c" stroke-width="3" opacity=".25"/>
          ${star(292, 26, 10, '#ffe14d')}${star(258, 40, 6, '#fff')}

          <!-- microphone on a stand, with a cable -->
          <g transform="translate(66 80)">
            <rect x="-20" y="-34" width="40" height="52" rx="20" fill="#fff" stroke="#22305c" stroke-width="5"/>
            <path d="M-20 6h40" stroke="#22305c" stroke-width="4"/>
            <rect x="-13" y="-24" width="26" height="6" rx="3" fill="#e9eefc"/>
            <rect x="-13" y="-13" width="26" height="6" rx="3" fill="#e9eefc"/>
            <path d="M0 18v22" stroke="#22305c" stroke-width="6" stroke-linecap="round"/>
            <path d="M-24 40h48" stroke="#22305c" stroke-width="7" stroke-linecap="round"/>
            <path d="M22 4c22 6 14 30 -6 34" fill="none" stroke="#22305c" stroke-width="4"
              stroke-linecap="round" opacity=".85"/>
            <circle cx="0" cy="-8" r="5" fill="#dfe6f8" opacity=".9"/>
          </g>

          <!-- screen with fast-forward chevrons, stand and shadow bar -->
          <g transform="translate(212 76)">
            <rect x="-58" y="-58" width="116" height="78" rx="14" fill="#22305c" stroke="#22305c" stroke-width="5"/>
            <rect x="-50" y="-50" width="100" height="62" rx="9" fill="#1b2747"/>
            <path d="M-34-38l24 24-24 24" fill="none" stroke="#ffc93c" stroke-width="10"
              stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4-38l24 24-24 24" fill="none" stroke="#2ecc71" stroke-width="10"
              stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="-12" y="20" width="24" height="10" rx="3" fill="#22305c"/>
            <rect x="-40" y="30" width="80" height="9" rx="4" fill="#22305c" stroke="#22305c" stroke-width="3"/>
            <circle cx="46" cy="-52" r="3" fill="#5b6ee1"/>
            <circle cx="46" cy="-42" r="3" fill="#ff5a68"/>
          </g>`;
      }
      case 'speed':
      case 'soundcheck': {
        const ticks = Array.from({ length: 12 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 12;
          const long = i % 3 === 0;
          const r1 = 44, r2 = long ? 34 : 38;
          return `<line x1="${(160 + r1 * Math.sin(a)).toFixed(1)}" y1="${(80 - r1 * Math.cos(a)).toFixed(1)}"
            x2="${(160 + r2 * Math.sin(a)).toFixed(1)}" y2="${(80 - r2 * Math.cos(a)).toFixed(1)}"
            stroke="#22305c" stroke-width="${long ? 4 : 2.4}" stroke-linecap="round" opacity=".55"/>`;
        }).join('');
        return `<defs>
            <linearGradient id="pc-a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#5fb0ff"/><stop offset="1" stop-color="#3f93ea"/>
            </linearGradient>
            <linearGradient id="pc-b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#3c8ce0"/><stop offset="1" stop-color="#2f78c6"/>
            </linearGradient>
          </defs>
          <rect width="320" height="160" fill="url(#pc-a)"/>
          <rect y="104" width="320" height="56" fill="url(#pc-b)"/>
          <path d="M0 104h320" stroke="#22305c" stroke-width="3" opacity=".22"/>
          ${star(44, 30, 10, '#ffe14d')}${star(280, 34, 9, '#fff')}
          <circle cx="46" cy="120" r="3" fill="#fff" opacity=".6"/>
          <circle cx="278" cy="122" r="3" fill="#fff" opacity=".6"/>

          <g transform="translate(160 80)">
            <circle r="58" fill="#22305c" stroke="#22305c" stroke-width="4"/>
            <circle r="52" fill="#fff"/>
            <circle r="52" fill="none" stroke="#dfe8f8" stroke-width="3"/>
            ${ticks}
            <path d="M0-34v34" stroke="#22305c" stroke-width="9" stroke-linecap="round"/>
            <path d="M0 0l24 16" stroke="#22305c" stroke-width="9" stroke-linecap="round"/>
            <circle r="7" fill="#22305c"/><circle r="2.6" fill="#ff5a68"/>
            <circle cx="-18" cy="-22" r="7" fill="#fff" opacity=".55"/>
          </g>
          <path d="M22 108h40M258 108h40" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
          <path d="M22 122h26M272 122h26" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
      }

      /* ---------- Spellbound ---------- */
      case 'practice':
        return `<rect width="320" height="160" fill="#22c8a5"/>
          <g transform="translate(160 80)">
            <rect x="-64" y="-40" width="128" height="72" rx="14" fill="#fff" ${OL}/>
            <path d="M-40-12h34M-40 6h58" stroke="${O}" stroke-width="6" stroke-linecap="round"/>
            <circle cx="42" cy="-6" r="18" fill="#ffc93c" ${OL} stroke-width="4"/>
            <path d="M36-6l4 5 8-9" fill="none" stroke="${O}" stroke-width="4" stroke-linecap="round"/>
          </g>
          <g transform="translate(66 96)">
            <path d="M-16-18h32l-4 22a12 12 0 01-24 0z" fill="#fff" ${OL} stroke-width="4"/>
            <path d="M0 4v14M-12 18h24" stroke="${O}" stroke-width="5" stroke-linecap="round"/>
          </g>
          ${star(276, 38, 12, '#ffc93c')}`;
      case 'builder':
        return `<rect width="320" height="160" fill="#ffc93c"/>
          ${['C', 'A', 'T'].map((c, i) => `<g transform="translate(${86 + i * 62} 80) rotate(${i === 1 ? 8 : -6})">
            <rect x="-24" y="-30" width="48" height="60" rx="8" fill="#fff" ${OL}/>
            <text y="12" font-family="Fredoka,sans-serif" font-size="32" font-weight="700" fill="#22305c" text-anchor="middle">${c}</text></g>`).join('')}
          <path d="M232 108c14 0 22 8 22 18" fill="none" stroke="${O}" stroke-width="5" stroke-linecap="round" stroke-dasharray="7 7"/>
          ${star(44, 36, 12, '#ff8a3d')}`;
      case 'missing':
        return `<rect width="320" height="160" fill="#ff6fae"/>
          <g transform="translate(160 80)">
            <rect x="-110" y="-34" width="220" height="68" rx="12" fill="#fff" ${OL}/>
            ${[0, 1, 2, 3, 4, 5].map((i) => `<text x="${-86 + i * 34}" y="12" font-family="Fredoka,sans-serif" font-size="30" font-weight="700" fill="${i === 2 || i === 4 ? '#ff6fae' : '#22305c'}" text-anchor="middle">${i === 2 || i === 4 ? '_' : 'SPELL'[i]}</text>`).join('')}
          </g>
          ${star(48, 38, 12, '#ffc93c')}${star(272, 42, 10, '#fff')}`;
      case 'review':
        return `<rect width="320" height="160" fill="#a06bff"/>
          <g transform="translate(160 82)">
            <path d="M-54-44h108v66l-24 20H-54z" fill="#fff" ${OL}/>
            <path d="M-32-22h56M-32-4h40M-32 14h28" stroke="#22305c" stroke-width="5" stroke-linecap="round"/>
            <circle cx="52" cy="26" r="24" fill="#ffc93c" ${OL} stroke-width="4"/>
            <path d="M52 12v16l10 6" fill="none" stroke="${O}" stroke-width="4" stroke-linecap="round"/>
          </g>`;
      case 'lists':
        return `<rect width="320" height="160" fill="#3a9bff"/>
          ${[0, 1, 2].map((i) => `<g transform="translate(${72 + i * 66} ${76 + (i % 2) * 8}) rotate(${i * 4 - 4})">
            <rect x="-26" y="-34" width="52" height="68" rx="8" fill="#fff" ${OL} stroke-width="4"/>
            <path d="M-14-16h28M-14-2h28M-14 12h18" stroke="#22305c" stroke-width="4" stroke-linecap="round"/></g>`).join('')}
          ${star(270, 36, 11, '#ffc93c')}`;

      /* ---------- WorldQuest ---------- */
      case 'locate':
        return `<rect width="320" height="160" fill="#cfe9ff"/>
          <g transform="translate(150 84)">
            <circle r="56" fill="#2ecc71" ${OL}/>
            <path d="M-56-14h26l10 18-8 22 14 16M4-56l6 22 20 10-6 22M30 22l16 12" fill="none" stroke="#22305c" stroke-width="5" stroke-linejoin="round"/>
            <circle cx="52" cy="26" r="16" fill="#ff4d5e" ${OL} stroke-width="5"/>
            <path d="M52 16v12l8 6" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
          </g>
          <g transform="translate(258 54)"><path d="M0-20c11 0 18 8 18 18 0 13-18 28-18 28S-18 11-18-2c0-10 7-18 18-18z" fill="#ff4d5e" ${OL} stroke-width="4"/><circle cx="0" cy="-2" r="6" fill="#fff"/></g>
          ${star(46, 38, 12, '#ffc93c')}`;
      case 'identify':
        return `<rect width="320" height="160" fill="#ffc93c"/>
          <g transform="translate(160 84)">
            <path d="M-96-40l34-12 30 14 34-12 32 10-4 62-34 12-30-14-34 12-30-10z" fill="#2ecc71" ${OL} stroke-width="4"/>
            <path d="M-62-46v66M-2-38v66M64-44v66" stroke="${O}" stroke-width="4"/>
            <circle cx="-30" cy="2" r="17" fill="#ff4d5e" ${OL} stroke-width="4"/>
            <text x="-30" y="9" font-family="Fredoka,sans-serif" font-size="20" font-weight="700" fill="#fff" text-anchor="middle">?</text>
          </g>`;
      case 'capital':
        return `<rect width="320" height="160" fill="#a06bff"/>
          <g transform="translate(150 88)">
            <path d="M-54 24h108v10H-54z" fill="#fff" ${OL} stroke-width="4"/>
            <rect x="-14" y="-52" width="28" height="76" fill="#fff" ${OL} stroke-width="4"/>
            <path d="M-14-52l14-16 14 16z" fill="#ffc93c" ${OL} stroke-width="4"/>
            <path d="M-40 24V-8h18v32M22 24V-8h18v32" fill="#e7eefc" ${OL} stroke-width="4"/>
            <circle cx="0" cy="-22" r="7" fill="#ffc93c" stroke="${O}" stroke-width="3"/>
          </g>
          ${star(272, 40, 12, '#ffc93c')}${star(46, 34, 11, '#fff')}`;
      case 'flag':
        return `<rect width="320" height="160" fill="#3a9bff"/>
          <g transform="translate(160 80)">
            <path d="M-58-48v96" stroke="${O}" stroke-width="7" stroke-linecap="round"/>
            <path d="M-58-48h104v54H-58z" fill="#ff4d5e" ${OL}/>
            <path d="M-40-30h30l12 12-12 12h-30z" fill="#fff" ${OL} stroke-width="3"/>
            <circle cx="18" cy="-12" r="10" fill="#ffc93c" stroke="${O}" stroke-width="3"/>
          </g>
          ${star(276, 36, 12, '#ffc93c')}${star(46, 120, 10, '#fff')}`;
      case 'marathon':
        return `<rect width="320" height="160" fill="#ff8a3d"/>
          <g transform="translate(160 84)">
            <circle r="54" fill="#fff" ${OL}/>
            <path d="M0-54a54 54 0 0128 100" fill="#2ecc71" ${OL} stroke-width="4"/>
            <path d="M-6-28l22 28-22 28" fill="none" stroke="${O}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          ${star(44, 38, 12, '#ffc93c')}${star(276, 42, 10, '#fff')}`;
      case 'challenge':
        return `<rect width="320" height="160" fill="#22305c"/>
          <g transform="translate(160 86)">
            <circle r="52" fill="#2ecc71" ${OL}/>
            <path d="M-52-12h22l8 14-6 18 12 14M10-52l4 20 18 8-4 18M28 16l14 12" fill="none" stroke="#22305c" stroke-width="4"/>
            <path d="M-26-64l8-20 20 10 20-10 8 20z" fill="#ffc93c" ${OL} stroke-width="4"/>
            <circle cx="-26" cy="-70" r="3" fill="#ff4d5e"/>
          </g>
          ${star(42, 40, 13, '#ffc93c')}${star(278, 44, 12, '#ffc93c')}${star(258, 120, 9, '#fff')}`;
      case 'europe': case 'asia': case 'africa': case 'americas': case 'oceania':
        return `<rect width="320" height="160" fill="#cfe9ff"/><text x="160" y="100" font-size="60" text-anchor="middle">${kind === 'europe' ? '🇪🇺' : kind === 'asia' ? '🌏' : kind === 'africa' ? '🌍' : kind === 'americas' ? '🌎' : '🏝️'}</text>`;
      default:
        return `<rect width="320" height="160" fill="#cfe9ff"/>${star(160, 80, 30, '#ffc93c')}`;
    }
  };

  /* a labelled mode tile, the way the game menus are laid out */
  S.tile = function (opts) {
    const o = opts || {};
    const art = typeof o.art === 'string' && o.art.indexOf('mode:') === 0 && window.ART.modeArt
      ? window.ART.modeArt[o.art.slice(5)]()
      : S.poster(o.art);
    return `<button class="tile-card ${o.on ? 'on' : ''}" ${o.action || ''} aria-pressed="${!!o.on}">
      <div class="tile-art" style="--a1:${o.a1 || '#cfe9ff'};--a2:${o.a2 || '#fff3c4'}"><svg
        viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice"
        aria-hidden="true">${art}</svg></div>
      <div class="tile-label" style="--label:${o.label || '#ffc93c'}">
        <b>${o.name}</b><span>${o.sub || ''}</span></div>
      ${o.on ? `<span class="tile-check">${window.icon('check')}</span>` : ''}
    </button>`;
  };
})();

/* -------------------------------------------------------------------------
   The TableStar venue: a dark hall, a lit stage with screens, haze and a
   silhouette crowd with their hands up. Drawn once behind the world.
   ------------------------------------------------------------------------- */
(function () {
  'use strict';
  const S = window.ART;

  S.concert = function () {
    // a simple hand-up silhouette, repeated at different sizes along the floor
    const hand = (x, y, s, rot) => `
      <g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
        <circle cx="0" cy="-34" r="15"/>
        <path d="M-20 -18q20 -8 40 0v34h-40z"/>
        <path d="M-15 -20l-9 -46 8 -2 11 40z"/>
        <path d="M16 -20l11 -50 8 2 -9 52z"/>
      </g>`;
    const heads = [];
    let x = -30, i = 0;
    while (x < 1640) {
      const s = 1.5 + (i % 3) * 0.22;
      const y = 560 + (i % 2) * 16;
      heads.push(hand(x, y, s, (i % 2 ? 6 : -5)));
      x += 74 + (i % 4) * 12;
      i++;
    }
    const spot = (x, color, rot, w) => `
      <g transform="rotate(${rot} ${x} 0)" opacity=".55">
        <polygon points="${x - 10},0 ${x + 10},0 ${x + w},620 ${x - w},620" fill="url(#beam-${color})"/>
      </g>`;
    return `<svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="beam-m" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff6fd8" stop-opacity=".75"/>
          <stop offset="1" stop-color="#ff6fd8" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="beam-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#6fb8ff" stop-opacity=".7"/>
          <stop offset="1" stop-color="#6fb8ff" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="beam-o" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffb75e" stop-opacity=".7"/>
          <stop offset="1" stop-color="#ffb75e" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="haze" cx=".5" cy=".1" r=".9">
          <stop offset="0" stop-color="#7a5cff" stop-opacity=".38"/>
          <stop offset="1" stop-color="#7a5cff" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="stageglow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stop-color="#ffe6b0" stop-opacity=".55"/>
          <stop offset="1" stop-color="#ffe6b0" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="1600" height="700" fill="#0a0616"/>
      <ellipse cx="800" cy="120" rx="900" ry="420" fill="url(#haze)"/>

      <!-- beams -->
      ${spot(210, 'm', 7, 190)}
      ${spot(470, 'b', 3, 150)}
      ${spot(800, 'o', 0, 130)}
      ${spot(1130, 'b', -3, 150)}
      ${spot(1390, 'm', -7, 190)}

      <!-- side speaker stacks -->
      <g fill="#0d0a1c" stroke="#241a3f" stroke-width="3">
        <rect x="60" y="150" width="120" height="360" rx="8"/>
        <rect x="1420" y="150" width="120" height="360" rx="8"/>
      </g>
      <g fill="#3a2a63">
        <circle cx="120" cy="220" r="16"/><circle cx="120" cy="290" r="16"/>
        <circle cx="120" cy="360" r="16"/><circle cx="120" cy="430" r="16"/>
        <circle cx="1480" cy="220" r="16"/><circle cx="1480" cy="290" r="16"/>
        <circle cx="1480" cy="360" r="16"/><circle cx="1480" cy="430" r="16"/>
      </g>

      <!-- stage -->
      <ellipse cx="800" cy="520" rx="520" ry="130" fill="url(#stageglow)"/>
      <g>
        <rect x="520" y="300" width="560" height="150" rx="10" fill="#150f2b" stroke="#2c2148" stroke-width="3"/>
        <rect x="548" y="322" width="230" height="106" rx="6" fill="#221641" opacity=".9"/>
        <rect x="822" y="322" width="230" height="106" rx="6" fill="#221641" opacity=".9"/>
        <!-- performer silhouettes on the stage -->
        <g fill="#05030c">
          <circle cx="700" cy="372" r="15"/><path d="M676 400h48v50h-48z"/>
          <circle cx="900" cy="366" r="17"/><path d="M874 396h52v54h-52z"/>
          <path d="M896 350l34 -28 6 8 -32 26z"/>
        </g>
        <rect x="500" y="450" width="600" height="16" rx="4" fill="#0b0718"/>
      </g>

      <!-- crowd, silhouetted against the light -->
      <g fill="#05030c">${heads.join('')}</g>
      <rect y="596" width="1600" height="104" fill="#05030c"/>
    </svg>`;
  };
})();

/* -------------------------------------------------------------------------
   THE STARBIT — the app's coin.  A struck-metal lotus in a milled ring, on a
   gold disc: silver-grey petals with a hot bevel, so it reads at 15px and 200px.
   ------------------------------------------------------------------------- */
(function () {
  'use strict';
  const S = window.ART;
  let n = 0;

  const OUTER = '<ellipse cx="50" cy="34" rx="6.6" ry="15.4" transform="rotate(0.0 50 34)"/><ellipse cx="50" cy="34" rx="6.6" ry="15.4" transform="rotate(45.0 50 34)"/><ellipse cx="50" cy="34" rx="6.6" ry="15.4" transform="rotate(90.0 50 34)"/><ellipse cx="50" cy="34" rx="6.6" ry="15.4" transform="rotate(135.0 50 34)"/><ellipse cx="50" cy="34" rx="6.6" ry="15.4" transform="rotate(180.0 50 34)"/><ellipse cx="50" cy="34" rx="6.6" ry="15.4" transform="rotate(225.0 50 34)"/><ellipse cx="50" cy="34" rx="6.6" ry="15.4" transform="rotate(270.0 50 34)"/><ellipse cx="50" cy="34" rx="6.6" ry="15.4" transform="rotate(315.0 50 34)"/>';
  const INNER = '<ellipse cx="50" cy="38" rx="5.2" ry="11.4" transform="rotate(22.5 50 38)"/><ellipse cx="50" cy="38" rx="5.2" ry="11.4" transform="rotate(67.5 50 38)"/><ellipse cx="50" cy="38" rx="5.2" ry="11.4" transform="rotate(112.5 50 38)"/><ellipse cx="50" cy="38" rx="5.2" ry="11.4" transform="rotate(157.5 50 38)"/><ellipse cx="50" cy="38" rx="5.2" ry="11.4" transform="rotate(202.5 50 38)"/><ellipse cx="50" cy="38" rx="5.2" ry="11.4" transform="rotate(247.5 50 38)"/><ellipse cx="50" cy="38" rx="5.2" ry="11.4" transform="rotate(292.5 50 38)"/><ellipse cx="50" cy="38" rx="5.2" ry="11.4" transform="rotate(337.5 50 38)"/>';

  S.starbit = function (opts) {
    const o = opts || {};
    const size = o.size || 24;
    const id = 'sb' + (++n);
    return '<svg class="starbit" width="' + size + '" height="' + size +
      '" viewBox="0 0 100 100" role="img" aria-label="Starbit" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      // the coin face: warm gold, lit from the top left
      '<radialGradient id="' + id + 'c" cx=".36" cy=".3" r=".82">' +
      '<stop offset="0" stop-color="#fff6c0"/><stop offset=".42" stop-color="#ffd04a"/>' +
      '<stop offset=".82" stop-color="#d99400"/><stop offset="1" stop-color="#8a5a00"/>' +
      '</radialGradient>' +
      // the metal the petals are struck from
      '<linearGradient id="' + id + 'm" x1="0" y1="0" x2=".35" y2="1">' +
      '<stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#e6e9f2"/>' +
      '<stop offset=".62" stop-color="#aab0c2"/><stop offset="1" stop-color="#6b7286"/>' +
      '</linearGradient>' +
      '<linearGradient id="' + id + 'r" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#fff3b8"/><stop offset=".5" stop-color="#e0a21a"/>' +
      '<stop offset="1" stop-color="#8a5a00"/></linearGradient>' +
      '<filter id="' + id + 's" x="-30%" y="-30%" width="160%" height="160%">' +
      '<feDropShadow dx="0" dy="1.2" stdDeviation="1.4" flood-color="#5a3800" ' +
      'flood-opacity=".55"/></filter>' +
      '</defs>' +

      /* the coin body: dark rim, gold face, milled inner ring */
      '<circle cx="50" cy="50" r="47" fill="#5a3800"/>' +
      '<circle cx="50" cy="50" r="44" fill="url(#' + id + 'r)"/>' +
      '<circle cx="50" cy="50" r="44" fill="url(#' + id + 'c)"/>' +
      '<circle cx="50" cy="50" r="39.5" fill="none" stroke="#8a5a00" stroke-width="1.6" ' +
      'opacity=".55"/>' +
      '<circle cx="50" cy="50" r="36" fill="none" stroke="#fff3b8" stroke-width="1.2" ' +
      'opacity=".45"/>' +

      /* the lotus, struck metal, with a soft drop shadow so it sits proud */
      '<g filter="url(#' + id + 's)">' +
      '<g fill="url(#' + id + 'm)" stroke="#5c6377" stroke-width=".9" ' +
      'stroke-linejoin="round">' + OUTER + '</g>' +
      '<g fill="url(#' + id + 'm)" stroke="#6b7286" stroke-width=".8" ' +
      'stroke-linejoin="round" opacity=".95">' + INNER + '</g>' +
      /* the boss: a small struck dome in the centre */
      '<circle cx="50" cy="50" r="9.2" fill="url(#' + id + 'm)" stroke="#5c6377" ' +
      'stroke-width=".9"/>' +
      '<circle cx="50" cy="50" r="4.6" fill="none" stroke="#ffffff" stroke-width="1.1" ' +
      'opacity=".7"/>' +
      '</g>' +

      /* specular highlights: a crescent on the coin and a glint on the boss */
      '<path d="M18 32a34 34 0 0 1 20 -17" fill="none" stroke="#fffdf0" stroke-width="3" ' +
      'stroke-linecap="round" opacity=".7"/>' +
      '<circle cx="47" cy="47" r="2.2" fill="#fff" opacity=".9"/>' +
      '</svg>';
  };

  S.starbitChip = function (amount, opts) {
    const o = opts || {};
    const txt = window.App ? window.App.num(amount) : amount;
    return '<span class="starbit-chip ' + (o.cls || '') + '">' +
      S.starbit({ size: o.size || 18 }) + '<b>' + txt + '</b></span>';
  };
})();

