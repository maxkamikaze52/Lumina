
/* -------------------------------------------------------------------------
   THE STARBIT — the app's coin. One drawing, reused everywhere.
   A cut seven-point star struck from gold, with a bright bevel, a dark rim
   and the star's own gleam, so it reads at 14px in a chip and at 160px.
   ------------------------------------------------------------------------- */
(function () {
  'use strict';
  const S = window.ART;
  let gradId = 0;

  S.starbit = function (opts) {
    const o = opts || {};
    const id = 'sb' + (++gradId);
    const size = o.size || 24;
    const pts = [];
    // seven points, alternating outer and inner radius, starting at the top
    for (let i = 0; i < 14; i++) {
      const r = i % 2 ? 6.4 : 12;
      const a = (Math.PI / 7) * i - Math.PI / 2;
      pts.push(`${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`);
    }
    const star = pts.join(' ');
    return `<svg class="starbit" width="${size}" height="${size}" viewBox="0 0 24 24"
      role="img" aria-label="Starbit">
      <defs>
        <linearGradient id="${id}-g" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stop-color="#fff3b0"/>
          <stop offset="0.42" stop-color="#ffcd3c"/>
          <stop offset="1" stop-color="#e09b00"/>
        </linearGradient>
        <linearGradient id="${id}-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff9d00"/>
          <stop offset="1" stop-color="#a35d00"/>
        </linearGradient>
      </defs>
      <polygon points="${star}" fill="url(#${id}-r)" transform="translate(0 .55)"/>
      <polygon points="${star}" fill="url(#${id}-g)" stroke="#4a2a00" stroke-width="1.1"
        stroke-linejoin="round"/>
      <path d="M12 3.1 13.5 8.2 18.4 9.6 14.2 12.1 15 16.9 12 14.3 9 16.9 9.8 12.1 5.6 9.6 10.5 8.2z"
        fill="#fffbe2" opacity=".55"/>
      <circle cx="8.4" cy="7.2" r="1.15" fill="#fffdf2" opacity=".95"/>
    </svg>`;
  };

  S.starbitChip = function (amount, opts) {
    const o = opts || {};
    return `<span class="starbit-chip ${o.cls || ''}">${S.starbit({ size: o.size || 18 })}
      <b>${window.App ? window.App.num(amount) : amount}</b></span>`;
  };
})();
