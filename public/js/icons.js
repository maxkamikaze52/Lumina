/* Astrolab — icon set. One path map, used for nav, badges and buttons. */
(function () {
  'use strict';
  const P = {
    spark: 'M12 2l2.2 6.2L20 10l-5.8 1.8L12 18l-2.2-6.2L4 10l5.8-1.8z',
    bit: 'M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.4l6-.8z',
    compass: 'M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 6.5l-2 5-5 2 2-5z',
    book: 'M4 5.5A2.5 2.5 0 016.5 3H19v15H6.5A2.5 2.5 0 004 20.5zM19 18v3H6.5',
    scroll: 'M6 3h12v15a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3zm3 5h6M9 12h6',
    pencil: 'M4 20l4-1 11-11-3-3L5 16zM15 5l3 3',
    laurel: 'M12 3c-4 3-7 7-7 11a7 7 0 0014 0c0-4-3-8-7-11zM12 8v10',
    trophy: 'M8 4h8v6a4 4 0 01-8 0zM6 5H3v3a3 3 0 003 3M18 5h3v3a3 3 0 01-3 3M10 17h4l1 4H9z',
    flask: 'M9 3h6v5l4 9a2 2 0 01-2 3H7a2 2 0 01-2-3l4-9zM8 14h8',
    column: 'M4 21h16M6 21V8l6-4 6 4v13M10 21v-7h4v7',
    star: 'M12 2l2.9 6.6 7.1.7-5.3 4.7 1.6 7-6.3-3.7L5.7 21l1.6-7L2 9.3l7.1-.7z',
    flame: 'M12 2c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 1 0 2-1 1-9z',
    triquetra: 'M12 3a5 5 0 014 8 5 5 0 01-8 0 5 5 0 014-8zm0 8a5 5 0 100 10 5 5 0 000-10z',
    gem: 'M6 3h12l3 6-9 12L3 9zM3 9h18M9 3l-3 6 6 12 6-12-3-6',
    mortarboard: 'M2 9l10-4 10 4-10 4zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5',
    podium: 'M3 21V11h5v10zm6.5 0V5h5v16zm6.5 0V14h5v7z',
    calendar: 'M4 6h16v15H4zM8 3v5M16 3v5M4 10h16',
    sun: 'M12 6a6 6 0 100 12 6 6 0 000-12zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
    guitar: 'M15 3l6 6-4 4-6-6zM11 8l-4 4m0 0a4 4 0 00-3 7 4 4 0 007-3 4 4 0 00-4-4z',
    times: 'M6 6l12 12M18 6L6 18',
    divide: 'M5 12h14M12 6.5v.01M12 17.5v.01',
    target: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a5 5 0 100 10 5 5 0 000-10zm0 3.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
    bolt: 'M13 2L5 14h6l-1 8 8-12h-6z',
    mic: 'M12 3a3 3 0 013 3v5a3 3 0 01-6 0V6a3 3 0 013-3zM5 11a7 7 0 0014 0M12 18v3',
    crown: 'M3 8l4 3 5-6 5 6 4-3-2 11H5z',
    grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    quill: 'M20 3c-6 1-11 5-13 11l-3 7 7-3c6-2 10-7 9-15zM8 16l4-4',
    chain: 'M9 12l2 2M7 8l3-3a4 4 0 016 6l-3 3M17 16l-3 3a4 4 0 01-6-6l3-3',
    globe: 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20',
    map: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14',
    flag: 'M5 21V4h9l-1 3 5 1v7H8M5 15h11',
    home: 'M4 11l8-7 8 7v9h-5v-5H9v5H4z',
    games: 'M7 8h10a5 5 0 015 5l-1 4a2.5 2.5 0 01-4 1.5L15 17H9l-2 1.5A2.5 2.5 0 013 17l-1-4a5 5 0 015-5zm2 3v4M7 13h4M16 12h.01M18 14h.01',
    store: 'M4 9h16l-1-5H5zM5 9v11h14V9M9 20v-6h6v6',
    character: 'M12 3a7 7 0 100 14 7 7 0 000-14zM5 21c1-4 4-6 7-6s6 2 7 6',
    room: 'M3 20V8l9-5 9 5v12M9 20v-6h6v6',
    boards: 'M4 20V10h4v10zM10 20V4h4v16zM16 20v-7h4v7z',
    profile: 'M12 3a4 4 0 100 8 4 4 0 000-8zM4 21c0-4 4-7 8-7s8 3 8 7',
    speaker: 'M4 9h4l5-4v14l-5-4H4zM16 8a5 5 0 010 8M18.5 5.5a9 9 0 010 13',
    check: 'M4 12l5 5L20 6',
    x: 'M6 6l12 12M18 6L6 18',
    lock: 'M6 11h12v9H6zM9 11V8a3 3 0 016 0v3',
    play: 'M7 4l12 8-12 8z',
    plus: 'M12 5v14M5 12h14',
    trash: 'M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14',
    rotate: 'M4 12a8 8 0 1114 5M4 12V6M4 12h6',
    zoom: 'M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l4 4M8 11h6M11 8v6',
    arrow: 'M5 12h13M13 6l6 6-6 6',
    clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l4 2',
    heart: 'M12 20S4 15 4 9.5A4.5 4.5 0 0112 7a4.5 4.5 0 018 2.5C20 15 12 20 12 20z'
  };
  function icon(name, cls) {
    const d = P[name] || P.spark;
    return `<svg class="ico ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  }
  function filled(name, cls) {
    const d = P[name] || P.spark;
    return `<svg class="ico ${cls || ''}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`;
  }
  window.ICONS = P;
  window.icon = icon;
  window.iconFilled = filled;
})();
