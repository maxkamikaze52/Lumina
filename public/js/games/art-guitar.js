/* Astrolab — games art: the TableStar guitar. Owned by the games side. */
(function () {
  'use strict';
  const S = window.ART;

  /* The TableStar guitar: recognisable, but properly proportioned and finished. */
  S.guitar = function (opts) {
    const o = opts || {}, res = o.results || [], ok = o.correct || 0;
    const lit = (j) => ok >= (j + 1) * 5;
    const dots = res.slice(0, 20).map((r, k) => {
      const y = 58 + 244 * k / 19;
      const cls = r === 'ok' ? 'dot ok' : r === 'bad' ? 'dot bad' : 'dot';
      return `<circle id="d${k}" class="${cls}" cx="60" cy="${y.toFixed(1)}" r="3.4"/>`;
    }).join('');
    return `<svg viewBox="0 0 120 480" role="img" aria-label="Guitar progress: ${ok} correct">
      <defs>
        <linearGradient id="gHead" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3f2a17"/><stop offset=".5" stop-color="#8a6236"/><stop offset="1" stop-color="#38240f"/></linearGradient>
        <linearGradient id="gNeck" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a2414"/><stop offset=".45" stop-color="#7a5230"/><stop offset="1" stop-color="#33200f"/></linearGradient>
        <linearGradient id="gBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb27a"/><stop offset=".5" stop-color="#ff8a5c"/><stop offset="1" stop-color="#b83b52"/></linearGradient>
        <radialGradient id="gShine" cx=".32" cy=".22" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <linearGradient id="gPurfling" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d6"/><stop offset="1" stop-color="#e0c9a0"/></linearGradient>
      </defs>
      <polygon points="44,4 76,4 79,48 41,48" fill="url(#gHead)" stroke="#241408" stroke-width="1.2"/>
      <circle cx="60" cy="15" r="3.2" fill="#2a1a0b"/><circle cx="60" cy="26" r="3.2" fill="#2a1a0b"/><circle cx="60" cy="37" r="3.2" fill="#2a1a0b"/>
      ${[0,1,2,3,4,5].map((j) => `<circle class="peg${lit(j) ? ' lit' : ''}" cx="${j % 2 ? 88 : 32}" cy="${11 + Math.floor(j / 2) * 12}" r="3.6"/>`).join('')}
      <rect x="43" y="48" width="34" height="4" rx="1.5" fill="#e8e2d4"/>
      <rect x="44" y="52" width="32" height="252" rx="2" fill="url(#gNeck)"/>
      <rect x="44" y="52" width="32" height="252" rx="2" fill="url(#gShine)"/>
      ${[0,1,2,3,4,5,6,7,8,9].map((k) => `<line x1="44" x2="76" y1="${64 + k * 24}" y2="${64 + k * 24}" stroke="rgba(214,202,178,${k % 2 ? .34 : .16})" stroke-width="1"/>`).join('')}
      <rect x="43" y="98" width="34" height="4.5" rx="1" fill="#efe7d4" opacity=".9"/>
      <rect x="43" y="140" width="34" height="4.5" rx="1" fill="#efe7d4" opacity=".9"/>
      <rect x="43" y="182" width="34" height="4.5" rx="1" fill="#efe7d4" opacity=".9"/>
      <ellipse cx="60" cy="336" rx="35" ry="30" fill="url(#gBody)" stroke="#8c2f3f" stroke-width="2.2"/>
      <ellipse cx="60" cy="402" rx="47" ry="53" fill="url(#gBody)" stroke="#8c2f3f" stroke-width="2.2"/>
      <ellipse cx="60" cy="336" rx="29" ry="24" fill="none" stroke="url(#gPurfling)" stroke-width="1.2" opacity=".55"/>
      <ellipse cx="60" cy="402" rx="40" ry="46" fill="none" stroke="url(#gPurfling)" stroke-width="1.2" opacity=".55"/>
      <ellipse cx="60" cy="398" rx="36" ry="41" fill="url(#gShine)"/>
      <circle cx="60" cy="370" r="14.5" fill="#20180f" stroke="#ffd166" stroke-width="2.4"/>
      <circle cx="60" cy="370" r="9.5" fill="#33251a"/>
      <rect x="51" y="348" width="18" height="7" rx="3" fill="#2a1a10"/>
      <rect x="57" y="292" width="6" height="30" rx="2" fill="#2a1a10" opacity=".8"/>
      <path d="M39 424q21 9 42 0" stroke="#2a1a10" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M28 392q-4 14 2 24M92 392q4 14-2 24" stroke="rgba(255,255,255,.18)" stroke-width="2" fill="none"/>
      ${[0,1,2,3,4,5].map((j) => `<line class="str${lit(j) ? ' lit' : ''}" x1="${47.5 + j * 5}" y1="54" x2="${47.5 + j * 5}" y2="438"/>`).join('')}
      ${dots}
    </svg>`;
  };
})();
