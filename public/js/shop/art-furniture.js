/* Astrolab — shop art: room objects. Owned by the content side. */
(function () {
  'use strict';
  const S = window.ART;

  /* Furniture drawn around its base point (0,0). */
  S.furniture = function (style, c) {
    c = c || '#c9a06a';
    const d = 'rgba(0,0,0,.22)';
    const M = {
      bed: `<rect x="-34" y="-28" width="68" height="28" rx="4" fill="${c}"/><rect x="-34" y="-44" width="68" height="17" rx="4" fill="${d}"/><rect x="-30" y="-40" width="24" height="11" rx="4" fill="#fff" opacity=".8"/>`,
      desk: `<rect x="-28" y="-18" width="56" height="6" rx="2" fill="${c}"/><rect x="-25" y="-12" width="5" height="20" fill="${d}"/><rect x="20" y="-12" width="5" height="20" fill="${d}"/><rect x="-18" y="-12" width="14" height="9" fill="${d}" opacity=".6"/>`,
      chair: `<rect x="-11" y="-27" width="22" height="6" rx="2" fill="${c}"/><rect x="-12" y="-21" width="24" height="4" rx="2" fill="${c}"/><rect x="-2" y="-17" width="4" height="14" fill="${d}"/><rect x="-11" y="-3" width="22" height="3" rx="1" fill="${d}"/>`,
      sofa: `<rect x="-30" y="-16" width="60" height="16" rx="5" fill="${c}"/><rect x="-30" y="-31" width="60" height="16" rx="6" fill="${c}"/><rect x="-31" y="-31" width="10" height="31" rx="5" fill="${d}"/><rect x="21" y="-31" width="10" height="31" rx="5" fill="${d}"/>`,
      wardrobe: `<rect x="-22" y="-60" width="44" height="60" rx="3" fill="${c}"/><rect x="-18" y="-56" width="16" height="52" fill="${d}" opacity=".45"/><rect x="2" y="-56" width="16" height="52" fill="${d}" opacity=".45"/><circle cx="-4" cy="-28" r="1.7" fill="#ffd166"/><circle cx="4" cy="-28" r="1.7" fill="#ffd166"/>`,
      bookshelf: `<rect x="-24" y="-66" width="48" height="66" rx="3" fill="${c}"/><rect x="-20" y="-62" width="40" height="58" fill="${d}" opacity=".4"/><g fill="#ff8a5c"><rect x="-18" y="-58" width="5" height="16"/><rect x="-11" y="-60" width="4" height="18"/></g><g fill="#2ec4a6"><rect x="-5" y="-58" width="6" height="16"/><rect x="3" y="-60" width="4" height="18"/></g><g fill="#ffd166"><rect x="9" y="-58" width="5" height="16"/></g><rect x="-20" y="-40" width="40" height="2" fill="${d}"/><g fill="#6fb3ff"><rect x="-17" y="-36" width="5" height="14"/><rect x="-10" y="-34" width="4" height="12"/></g><rect x="-20" y="-20" width="40" height="2" fill="${d}"/>`,
      cabinet: `<rect x="-18" y="-32" width="36" height="32" rx="3" fill="${c}"/><rect x="-15" y="-29" width="30" height="12" fill="${d}" opacity=".45"/><rect x="-15" y="-14" width="30" height="11" fill="${d}" opacity=".45"/><circle cx="0" cy="-23" r="1.4" fill="#fff" opacity=".6"/>`,
      lamp: `<path d="M0 0v-42" stroke="${d}" stroke-width="3"/><ellipse cx="0" cy="0" rx="9" ry="3" fill="${d}"/><path d="M-12-42h24l-5-15h-14z" fill="${c}"/><circle cx="0" cy="-34" r="10" fill="#fff6c2" opacity=".26"/>`,
      rug: `<ellipse cx="0" cy="0" rx="72" ry="19" fill="${c}" opacity=".85"/><ellipse cx="0" cy="0" rx="54" ry="13" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="2"/>`,
      beanbag: `<ellipse cx="0" cy="-13" rx="25" ry="17" fill="${c}"/><ellipse cx="0" cy="-6" rx="25" ry="8" fill="${d}" opacity=".35"/>`,
      poster: `<rect x="-16" y="-42" width="32" height="42" rx="2" fill="${c}"/><rect x="-12" y="-38" width="24" height="18" fill="rgba(255,255,255,.5)"/><rect x="-12" y="-15" width="24" height="10" fill="rgba(0,0,0,.25)"/>`,
      painting: `<rect x="-20" y="-32" width="40" height="32" rx="2" fill="#c9a06a"/><rect x="-17" y="-29" width="34" height="26" fill="${c.startsWith('url') ? c : '#6fb3ff'}"/><circle cx="0" cy="-17" r="5" fill="#ffe29a" opacity=".9"/>`,
      plant: `<ellipse cx="0" cy="-2" rx="9" ry="3" fill="#c98b5e"/><path d="M-7-4h14l-2-11H-5z" fill="#c98b5e"/><path d="M0-15q-12-6-10-19 10 2 12 12M0-15q10-8 8-21-9 3-10 15M0-15v-17" stroke="${c}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
      clock: `<circle cx="0" cy="-17" r="13" fill="${c}"/><circle cx="0" cy="-17" r="10" fill="none" stroke="${d}" stroke-width="1.4"/><path d="M0-17v-6M0-17l4 3" stroke="#20243a" stroke-width="1.8" stroke-linecap="round"/>`,
      trophy: `<path d="M-6 0h12v-6h-12z" fill="#c9a06a"/><path d="M-9-33h18v10a9 9 0 01-18 0z" fill="${c}"/><path d="M-12-31h-4a5 5 0 005 6M12-31h4a5 5 0 01-5 6" fill="none" stroke="${c}" stroke-width="2"/><rect x="-2" y="-22" width="4" height="16" fill="#e0a12b"/>`,
      computer: `<rect x="-18" y="-31" width="36" height="24" rx="2" fill="#20243a"/><rect x="-15" y="-28" width="30" height="18" fill="${c}"/><rect x="-4" y="-7" width="8" height="5" fill="#4b5480"/><rect x="-12" y="-2" width="24" height="2" rx="1" fill="#4b5480"/>`,
      globe: `<path d="M-6 0h12l-2-9h-8z" fill="#c9a06a"/><circle cx="0" cy="-23" r="14" fill="${c}"/><path d="M-14-23h28M0-37c6 8 6 20 0 28M0-37c-6 8-6 20 0 28" stroke="rgba(255,255,255,.45)" stroke-width="1.2" fill="none"/>`,
      telescope: `<path d="M-14 0l7-11M14 0l-7-11" stroke="${c}" stroke-width="3"/><path d="M-18-32l34-10 4 12-34 10z" fill="${c}"/><circle cx="20" cy="-36" r="5" fill="#6fb3ff" opacity=".85"/>`,
      models: `<ellipse cx="0" cy="-17" rx="14" ry="6" fill="none" stroke="${c}" stroke-width="2"/><ellipse cx="0" cy="-17" rx="14" ry="6" fill="none" stroke="${c}" stroke-width="2" transform="rotate(60 0 -17)"/><ellipse cx="0" cy="-17" rx="14" ry="6" fill="none" stroke="${c}" stroke-width="2" transform="rotate(120 0 -17)"/><circle cx="0" cy="-17" r="3.4" fill="#ffd166"/>`,
      mobile: `<path d="M0-56v9" stroke="${c}" stroke-width="2"/><path d="M-18-38l18-9 18 9-18 11z" fill="none" stroke="${c}" stroke-width="1.6"/><circle cx="-18" cy="-38" r="4.2" fill="#ff8a5c"/><circle cx="18" cy="-38" r="4.2" fill="#2ec4a6"/><circle cx="0" cy="-27" r="4.6" fill="${c}"/>`
    };
    return M[style] || `<rect x="-16" y="-26" width="32" height="26" rx="3" fill="${c}"/>`;
  };
})();
