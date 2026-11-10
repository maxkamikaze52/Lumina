/* Astrolab — core: API client, shared state, router, UI primitives. */
(function () {
  'use strict';

  const API = {
    token: localStorage.getItem('astrolab_token') || '',
    async call(path, opts) {
      const o = opts || {};
      const headers = { 'Content-Type': 'application/json' };
      if (API.token) headers['X-Astrolab-Token'] = API.token;
      const res = await fetch(path, {
        method: o.method || 'GET', headers, credentials: 'same-origin',
        body: o.body ? JSON.stringify(o.body) : undefined
      });
      let data = {};
      try { data = await res.json(); } catch (e) { data = {}; }
      if (data && data.token) {
        API.token = data.token;
        localStorage.setItem('astrolab_token', data.token);
      }
      if (!res.ok) {
        const err = new Error(data.message || data.error || 'Something went wrong');
        err.status = res.status;
        throw err;
      }
      return data;
    },
    get: (p) => API.call(p),
    post: (p, b) => API.call(p, { method: 'POST', body: b || {} }),
    patch: (p, b) => API.call(p, { method: 'PATCH', body: b || {} })
  };

  const App = { state: null, route: { name: 'home' }, cleanups: [], API };
  window.App = App;
  window.API = API;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (n) => Number(n || 0).toLocaleString('en-GB');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rand(a.length)];
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmtDate = (ts) => new Date(ts * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const fmtShort = (ts) => new Date(ts * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  const LABEL = { tablestar: 'TableStar', spellbound: 'Spellbound', worldquest: 'WorldQuest' };

  Object.assign(App, { esc, num, clamp, rand, pick, shuffle, fmtDate, fmtShort, cap, LABEL });

  /* ---------- UI primitives ---------- */
  App.toast = function (msg, iconName) {
    const host = document.getElementById('toasts');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `${window.icon(iconName || 'check')}<span>${esc(msg)}</span>`;
    host.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; }, 3200);
    setTimeout(() => el.remove(), 3800);
  };

  App.modal = function (html, onMount) {
    const host = document.getElementById('modal');
    host.hidden = false;
    host.className = 'modal';
    host.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
    host.querySelectorAll('[data-close]').forEach((b) => { b.onclick = App.closeModal; });
    host.onclick = (e) => { if (e.target === host) App.closeModal(); };
    if (onMount) onMount(host.querySelector('.sheet'));
  };
  App.closeModal = function () {
    const host = document.getElementById('modal');
    host.hidden = true;
    host.innerHTML = '';
  };

  /* badge unlock burst + toast */
  App.celebrate = function (badges) {
    (badges || []).forEach((b, i) => setTimeout(() => {
      App.toast(`Badge unlocked — ${b.name}`, b.icon || 'star');
    }, i * 260));
  };

  App.refreshWallet = function () {
    const p = App.state.player;
    [['w-xp', p.xp], ['w-xp-w', p.xp], ['w-bits', p.starbits], ['w-bits-w', p.starbits]]
      .forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.textContent = num(val); });
    const av = document.getElementById('w-avatar');
    if (av) av.innerHTML = window.ART.avatar(p.character, { background: false });
  };

  App.reload = async function () {
    App.state = await API.get('/api/state');
    App.refreshWallet();
    return App.state;
  };

  /* ------------------------------------------------------------------ *
   * Game worlds: a game replaces the whole screen, not a panel.
   * ------------------------------------------------------------------ */
  const WORLDS = {
    tablestar: { name: 'TableStar', sub: 'Maths at speed', colour: '#ffe3cd' },
    spellbound: { name: 'Spellbound', sub: 'Spell and master', colour: '#d6f9ec' },
    worldquest: { name: 'WorldQuest', sub: 'Learn the map', colour: '#d9efff' }
  };

  App.world = null;

  App.enterWorld = function (game) {
    const w = WORLDS[game];
    if (!w) return;
    App.world = game;
    App.cleanup();
    document.body.classList.add('in-world');
    const host = document.getElementById('world');
    host.className = 'world-' + game + ' on';
    host.setAttribute('aria-hidden', 'false');
    host.innerHTML = `
      <div class="world-bar">
        <button class="world-back" data-leave-world>${window.icon('arrow')} Astrolab</button>
        <span class="logo">${window.icon('spark')}${esc(w.name)}</span>
        <span class="spacer"></span>
        <div class="world-bits">
          <span class="w" title="Lifetime XP">${window.icon('spark')}<b id="w-xp-w">${num(App.state.player.xp)}</b></span>
          <span class="w" title="Starbits">${window.ART.starbit({ size: 18 })}<b id="w-bits-w">${num(App.state.player.starbits)}</b></span>
        </div>
      </div>
      <div class="world-body"><div class="world-inner" id="world-inner"></div></div>`;
    const stage = host.querySelector('#world-inner');
    host.querySelector('[data-leave-world]').onclick = () => App.leaveWorld();
    App.refreshWallet();
    return stage;
  };

  App.stage = function () {
    return document.getElementById('world-inner') || document.getElementById('main');
  };

  App.leaveWorld = function () {
    const host = document.getElementById('world');
    App.cleanup();
    App.world = null;
    document.body.classList.remove('in-world');
    host.classList.remove('on');
    host.setAttribute('aria-hidden', 'true');
    setTimeout(() => { if (!App.world) host.innerHTML = ''; }, 320);
    App.go('games');
  };

  /* Play a game: a short wipe of the game's own colour, then the world appears. */
  App.playGame = function (game) {
    const w = WORLDS[game];
    if (!w) return;
    const warp = document.getElementById('warp');
    warp.style.setProperty('--wc', w.colour);
    const art = {
      tablestar: '<svg viewBox="0 0 120 120" width="96" height="96"><circle cx="60" cy="60" r="54" fill="#ff8a5c"/><text x="60" y="78" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="52" font-weight="700" fill="#fff">×÷</text></svg>',
      spellbound: '<svg viewBox="0 0 120 120" width="96" height="96"><circle cx="60" cy="60" r="54" fill="#17bd93"/><text x="60" y="82" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="60" font-weight="700" fill="#fff">Aa</text></svg>',
      worldquest: '<svg viewBox="0 0 120 120" width="96" height="96"><circle cx="60" cy="60" r="54" fill="#4aa8ff"/><path d="M28 70l18-26 16 14 14-22 16 34z" fill="#d6f3e6"/></svg>'
    };
    warp.innerHTML = `<div class="burst"></div><div class="warp-art">${art[game]}
      <div class="name">${esc(w.name)}</div><div class="sub">${esc(w.sub)}</div></div>`;
    warp.classList.add('go');
    setTimeout(() => {
      if (game === 'tablestar') window.TABLESTAR.open();
      else if (game === 'spellbound') window.SPELLBOUND.open();
      else window.WORLDQUEST.open();
    }, 300);
    setTimeout(() => { warp.classList.remove('go'); warp.innerHTML = ''; }, 700);
  };

  /* ---------- router ---------- */
  const ROUTES = ['home', 'games', 'store', 'character', 'room', 'boards', 'profile'];
  App.go = function (name, params) {
    if (!ROUTES.includes(name)) name = 'home';
    if (App.world) App.leaveWorld();          // navigating away closes the game world
    if (location.hash !== '#/' + name) {
      history.pushState({}, '', '#/' + name);
    }
    App.route = { name, params: params || {} };
    App.render();
  };
  window.addEventListener('popstate', () => {
    App.route = { name: (location.hash || '#/home').slice(2) || 'home', params: {} };
    App.render();
  });

  App.cleanup = function () {
    App.cleanups.forEach((fn) => { try { fn(); } catch (e) {} });
    App.cleanups = [];
  };
  App.onCleanup = function (fn) { App.cleanups.push(fn); };

  App.render = async function (opts) {
    const keepScroll = !!(opts && opts.keepScroll);
    const here = window.scrollY;
    App.cleanup();
    const main = document.getElementById('main');
    const view = window.VIEWS[App.route.name] || window.VIEWS.home;
    main.innerHTML = '<div class="card flat muted">Loading…</div>';
    try {
      await view(main, App.route.params);
    } catch (e) {
      console.error(e);
      main.innerHTML = `<div class="card"><h2>Something went wrong</h2>
        <p class="muted" style="margin-top:8px">${esc(e.message)}</p>
        <button class="btn ghost sm" style="margin-top:14px" onclick="location.reload()">Reload</button></div>`;
    }
    App.paintTabs();
    // A re-render after a click (collect, buy, save) must not throw you back to
    // the top of a long page.  Only a fresh navigation scrolls up.
    if (keepScroll) window.scrollTo({ top: here, behavior: 'auto' });
    else window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  };

  const TABS = [
    ['home', 'home', 'Home'], ['games', 'games', 'Games'], ['store', 'store', 'Store'],
    ['character', 'character', 'Character'], ['room', 'room', 'Room'],
    ['boards', 'boards', 'Boards'], ['profile', 'profile', 'Profile']
  ];
  App.paintTabs = function () {
    const html = TABS.map(([id, ic, label]) =>
      `<button class="tab ${App.route.name === id ? 'on' : ''}" data-tab="${id}">
        ${window.icon(ic)}<span>${label}</span></button>`).join('');
    const tabs = document.getElementById('tabs');
    tabs.innerHTML = html;
    tabs.querySelectorAll('[data-tab]').forEach((b) => { b.onclick = () => App.go(b.dataset.tab); });
    const dock = document.getElementById('dock');
    dock.innerHTML = TABS.slice(0, 6).map(([id, ic, label]) =>
      `<button class="${App.route.name === id ? 'on' : ''}" data-tab="${id}">
        ${window.icon(ic)}<span>${label}</span></button>`).join('');
    dock.querySelectorAll('[data-tab]').forEach((b) => { b.onclick = () => App.go(b.dataset.tab); });
  };

  /* delegation for any [data-nav] / [data-leave-world] button */
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-leave-world]')) { App.leaveWorld(); return; }
    const nav = e.target.closest('[data-nav]');
    if (nav) App.go(nav.dataset.nav);
  });
})();
