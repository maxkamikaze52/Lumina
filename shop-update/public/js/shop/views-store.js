/* Astrolab — shop views: Store, My Character, My Room.  Owned by the content side.
   Everything here talks to the server only through /api/shop/buy, /api/shop/buy-set,
   /api/character and /api/room (api_shop.py); item data is App.state.catalogue (catalogue.py). */
(function () {
  'use strict';
  const App = window.App, ART = window.ART, icon = window.icon;
  const views = window.VIEWS;
  const esc = App.esc, num = App.num;
  const st = () => App.state;
  const cat = () => st().catalogue;
  const byId = (id) => cat().items.find((i) => i.id === id);
  const RAR = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const rc = (i) => `--rc:${cat().rarity[i.rarity].colour}`;
  const coin = (n) => (ART.starbit ? ART.starbit({ size: n || 16 }) : icon('bit'));

  /* ---------------------------------------------------------------- helpers */
  const level = () => {
    const xp = st().player.xp || 0; let n = 1;
    (st().classes || []).forEach((c) => { if (xp >= c.xp) n = Math.max(n, c.n); });
    return n;
  };
  const ownedSet = () => new Set(st().owned);
  const has = (i, owned) => (owned || ownedSet()).has(i.id) || i.price === 0;
  const locked = (i) => !!i.level && i.level > level();
  const WALL = { poster: 1, painting: 1, clock: 1, bunting: 1, neon: 1, mobile: 1 };
  const isRoomItem = (i) => i.slot === 'furniture' || i.slot === 'theme';
  // equipped items are always keyed by the slot the ITEM belongs to (old saves are filed under looser keys)
  const norm = (e) => { const out = {}; Object.keys(e || {}).forEach((k) => { const it = e[k] && byId(e[k]); if (it) out[it.slot] = it.id; }); return out; };
  const mine = () => norm(st().player.character);
  const sortItems = (list, how) => list.slice().sort((a, b) => {
    if (how === 'price-up') return a.price - b.price || a.name.localeCompare(b.name);
    if (how === 'price-down') return b.price - a.price || a.name.localeCompare(b.name);
    if (how === 'name') return a.name.localeCompare(b.name);
    return RAR.indexOf(a.rarity) - RAR.indexOf(b.rarity) || a.price - b.price || a.name.localeCompare(b.name);
  });
  const rarPill = (r) => `<span class="sx-rar" style="--rc:${cat().rarity[r].colour}">${cat().rarity[r].label}</span>`;
  const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 2147483647; return h; };

  async function saveCharacter(next) {
    const r = await App.API.post('/api/character', { equipped: next });
    st().player.character = r.equipped;
    App.refreshWallet();
    return r.equipped;
  }

  /* a room scene as SVG markup: theme + placed objects (furniture is drawn at 1.6x, base point at x,y) */
  function placedMarkup(items, extraCls) {
    return items.slice().sort((a, b) => (a.z - b.z) || (a.y - b.y)).map((o) => {
      const it = byId(o.item);
      return it ? `<g class="placed ${extraCls || ''}" data-uid="${o.uid}" transform="translate(${o.x} ${o.y}) scale(${o.flip ? -1.6 : 1.6} 1.6)">${ART.furniture(it.style, it.colour)}</g>` : '';
    }).join('');
  }
  const spot = (it) => (WALL[it.style] ? 250 : 470);
  function autoLayout(its) {
    const floor = its.filter((i) => !WALL[i.style]), wall = its.filter((i) => WALL[i.style]);
    const out = [];
    floor.forEach((it, k) => out.push({ uid: 'p' + k, item: it.id, x: 150 + (k + .5) * (660 / Math.max(1, floor.length)), y: it.style === 'rug' ? 520 : 470, z: it.style === 'rug' ? 0 : 2, flip: false }));
    wall.forEach((it, k) => out.push({ uid: 'w' + k, item: it.id, x: 220 + k * 200, y: 250, z: 1, flip: false }));
    return out;
  }
  function roomScene(themeId, items) {
    const theme = byId(themeId) || byId('theme-study');
    return `<svg viewBox="0 0 960 600" class="sx-roomsvg" aria-hidden="true"><g>${ART.room(theme)}</g><g>${placedMarkup(items)}</g></svg>`;
  }

  /* ================================================================= STORE */
  const S = { group: 'featured', cat: null, rarity: 'all', sort: 'rarity', hideOwned: false, q: '', sel: null, set: null, pv: null, confirm: null };

  function groups() {
    return [{ id: 'featured', label: 'Featured', cats: [] }].concat(cat().groups, [{ id: 'sets', label: 'Sets', cats: [] }]);
  }
  function featured() {
    const day = new Date().toISOString().slice(0, 10), owned = ownedSet();
    const pool = cat().items.filter((i) => i.price > 0 && !owned.has(i.id) && !isRoomItem(i) && i.slot !== 'hairColor' && i.slot !== 'eyeColor');
    return pool.slice().sort((a, b) => (hash(day + a.id) - hash(day + b.id))).slice(0, 8);
  }
  function listForView() {
    const owned = ownedSet();
    let items;
    if (S.group === 'featured') items = featured();
    else {
      const g = groups().find((x) => x.id === S.group);
      const cats = g ? g.cats.map((c) => c.cat) : [];
      const c = S.cat && cats.includes(S.cat) ? S.cat : cats[0];
      items = cat().items.filter((i) => i.cat === c && i.price > 0);
    }
    const q = S.q.trim().toLowerCase();
    items = items.filter((i) => (S.rarity === 'all' || i.rarity === S.rarity) && (!S.hideOwned || !owned.has(i.id)) && (!q || i.name.toLowerCase().includes(q)));
    return S.group === 'featured' ? items : sortItems(items, S.sort);
  }

  views.store = async function (main) {
    await App.reload();
    S.pv = Object.assign({}, mine());
    if (!S.sel || !byId(S.sel)) S.sel = null;

    main.innerHTML = `<div class="sx sx-store">
      <header class="sx-head">
        <div><div class="eyebrow">Store</div><h1>Dress your explorer</h1>
          <p class="lead">Everything is earned by playing. No real money, no loot boxes — try anything on before you buy.</p></div>
        <div class="sx-wallet" title="Your Starbits">${coin(22)}<b id="sx-bits">${num(st().player.starbits)}</b></div>
      </header>
      <div class="sx-layout">
        <aside class="sx-left" id="sx-left"></aside>
        <section class="sx-right" id="sx-right"></section>
      </div></div>`;
    const left = main.querySelector('#sx-left'), right = main.querySelector('#sx-right');

    /* ------------ left: the stage, with a try-on preview and the buy panel */
    function paintLeft() {
      const it = S.sel ? byId(S.sel) : null, owned = ownedSet();
      let art;
      if (S.set) {
        const s = cat().sets.find((x) => x.id === S.set), its = s.items.map(byId);
        const room = its.filter(isRoomItem);
        art = room.length ? roomScene((its.find((i) => i.slot === 'theme') || { id: st().player.room.theme }).id, autoLayout(room.filter((i) => i.slot === 'furniture')))
          : `<div class="sx-avatar">${ART.avatar(S.pv, { background: false, label: 'Preview' })}</div>`;
      } else if (it && isRoomItem(it)) {
        const room = st().player.room || { theme: 'theme-study', items: [] };
        art = it.slot === 'theme' ? roomScene(it.id, room.items)
          : roomScene(room.theme, room.items.concat([{ uid: 'pv', item: it.id, x: 480, y: spot(it), z: 3, flip: false }]));
      } else art = `<div class="sx-avatar">${ART.avatar(S.pv, { background: false, label: 'Preview' })}</div>`;

      let panel;
      if (S.set) {
        const s = cat().sets.find((x) => x.id === S.set), its = s.items.map(byId);
        const missing = its.filter((i) => !has(i, owned)), price = Math.round(missing.reduce((a, i) => a + i.price, 0) * (1 - cat().setDiscount));
        const need = Math.max(...its.map((i) => i.level || 1)), can = st().player.starbits >= price;
        panel = `<div class="sx-detail"><div class="sx-dname">${esc(s.name)} set</div><p class="sx-ddesc">${esc(s.desc)}</p>
          <div class="sx-pieces">${its.map((i) => `<span class="sx-piece ${has(i, owned) ? 'own' : ''}" style="${rc(i)}" title="${esc(i.name)}">${ART.thumb(i)}</span>`).join('')}</div>
          ${missing.length ? `<div class="sx-buyrow"><button class="sx-btn primary" data-act="buyset" ${can && need <= level() ? '' : 'disabled'}>${coin(15)} ${num(price)} · buy ${missing.length === its.length ? 'the set' : `${missing.length} missing`}</button></div>
            <p class="sx-note">${need > level() ? `Some pieces unlock at level ${need}.` : can ? `Saves ${Math.round(cat().setDiscount * 100)}% against buying the pieces one by one.` : `You need ${num(price - st().player.starbits)} more Starbits.`}</p>`
            : '<p class="sx-note ok">You own the whole set.</p>'}
          <button class="sx-link" data-act="clear">Clear preview</button></div>`;
      } else if (it) {
        const own = has(it, owned), lk = locked(it), can = st().player.starbits >= it.price, wearable = !isRoomItem(it);
        const conf = S.confirm === it.id;
        let buttons;
        if (own) buttons = wearable ? `<button class="sx-btn primary" data-act="wear">Wear it</button>` : `<button class="sx-btn primary" data-act="place">Place in my room</button>`;
        else if (lk) buttons = `<button class="sx-btn" disabled>${icon('lock')} Unlocks at level ${it.level}</button>`;
        else if (!can) buttons = `<button class="sx-btn" disabled>${coin(15)} ${num(it.price)} — need ${num(it.price - st().player.starbits)} more</button>`;
        else buttons = `<button class="sx-btn primary ${conf ? 'sure' : ''}" data-act="buy">${conf ? 'Tap again to confirm' : `${coin(15)} Buy for ${num(it.price)}`}</button>` +
          (wearable ? `<button class="sx-btn ghost" data-act="buywear">Buy &amp; wear</button>` : '');
        panel = `<div class="sx-detail" style="${rc(it)}"><div class="sx-dtop">${rarPill(it.rarity)}${own ? '<span class="sx-owned">Owned</span>' : ''}</div>
          <div class="sx-dname">${esc(it.name)}</div><p class="sx-ddesc">${esc(it.desc)}</p>
          <div class="sx-buyrow">${buttons}</div>
          ${wearable ? '<button class="sx-link" data-act="clear">Reset to what I wear</button>' : '<button class="sx-link" data-act="clear">Close preview</button>'}</div>`;
      } else panel = `<div class="sx-detail blank"><div class="sx-dname">Try before you buy</div><p class="sx-ddesc">Tap any item to see it on your explorer. Nothing is spent until you press Buy.</p></div>`;

      left.innerHTML = `<div class="sx-stage"><div class="sx-halo"></div>${art}</div>${panel}`;
    }

    /* ------------ right: tabs, filters and the grid of items */
    function paintRight() {
      const gs = groups(), g = gs.find((x) => x.id === S.group) || gs[0];
      const subs = g.cats, curCat = subs.length ? (subs.find((c) => c.cat === S.cat) || subs[0]).cat : null;
      const owned = ownedSet();
      let body;
      if (S.group === 'sets') {
        body = `<div class="sx-sets">${cat().sets.map((s) => {
          const its = s.items.map(byId), missing = its.filter((i) => !has(i, owned)), full = missing.reduce((a, i) => a + i.price, 0), price = Math.round(full * (1 - cat().setDiscount));
          return `<button class="sx-set ${S.set === s.id ? 'sel' : ''}" data-set="${s.id}"><div class="sx-setname">${esc(s.name)}</div><div class="sx-setpieces">${its.map((i) => `<span class="sx-piece ${has(i, owned) ? 'own' : ''}" style="${rc(i)}">${ART.thumb(i)}</span>`).join('')}</div>
            <div class="sx-setfoot"><span>${esc(s.desc)}</span>${missing.length ? `<b>${coin(14)} ${num(price)}</b>` : '<b class="ok">Complete</b>'}</div></button>`;
        }).join('')}</div>`;
      } else {
        const list = listForView();
        body = `<div class="sx-grid">${list.map((i) => {
          const own = has(i, owned), lk = locked(i);
          return `<button class="sx-card ${S.sel === i.id ? 'sel' : ''} ${own ? 'owned' : ''} ${lk ? 'locked' : ''}" data-id="${i.id}" style="${rc(i)}" data-tier="${i.rarity}">
            <span class="sx-thumb">${ART.thumb(i)}${lk && !own ? `<span class="sx-lock">${icon('lock')} Lv ${i.level}</span>` : ''}</span>
            <span class="sx-name">${esc(i.name)}</span>
            <span class="sx-meta">${rarPill(i.rarity)}${own ? '<span class="sx-owned">Owned</span>' : `<span class="sx-price">${coin(13)}${num(i.price)}</span>`}</span></button>`;
        }).join('')}</div>${list.length ? '' : '<div class="sx-empty">Nothing matches — try another filter.</div>'}`;
      }
      right.innerHTML = `
        <nav class="sx-tabs" aria-label="Store sections">${gs.map((x) => `<button class="${x.id === S.group ? 'on' : ''}" data-group="${x.id}">${x.label}</button>`).join('')}</nav>
        ${subs.length > 1 ? `<nav class="sx-subtabs">${subs.map((c) => `<button class="${c.cat === curCat ? 'on' : ''}" data-cat="${c.cat}">${c.label}</button>`).join('')}</nav>` : ''}
        ${S.group === 'sets' ? '' : `<div class="sx-tools">
          <label class="sx-search">${icon('zoom')}<input type="search" id="sx-q" placeholder="Search items" value="${esc(S.q)}"></label>
          <div class="sx-rars"><button class="${S.rarity === 'all' ? 'on' : ''}" data-rar="all">All</button>${RAR.map((r) => `<button class="${S.rarity === r ? 'on' : ''}" data-rar="${r}" style="--rc:${cat().rarity[r].colour}" title="${cat().rarity[r].label}"><i></i>${cat().rarity[r].label}</button>`).join('')}</div>
          <select id="sx-sort" aria-label="Sort"><option value="rarity">Rarity</option><option value="price-up">Price: low to high</option><option value="price-down">Price: high to low</option><option value="name">Name</option></select>
          <label class="sx-check"><input type="checkbox" id="sx-hide" ${S.hideOwned ? 'checked' : ''}> Hide owned</label></div>`}
        ${S.group === 'featured' ? '<p class="sx-sub">Today’s picks — a fresh mix every day.</p>' : ''}
        ${body}`;
      const sort = right.querySelector('#sx-sort'); if (sort) sort.value = S.sort;
    }
    const all = () => { paintLeft(); paintRight(); };
    all();

    /* ------------ actions */
    async function buyItem(it, wear) {
      try {
        await App.API.post('/api/shop/buy', { item: it.id });
        await App.reload();
        App.toast(`${it.name} is yours!`, 'gem');
        if (wear && !isRoomItem(it)) { S.pv = Object.assign({}, norm(await saveWith(it))); }
        S.confirm = null; document.getElementById('sx-bits').textContent = num(st().player.starbits); all();
      } catch (e) { App.toast(e.message, 'x'); S.confirm = null; all(); }
    }
    async function saveWith(it) { const n = mine(); n[it.slot] = it.id; return saveCharacter(n); }

    main.addEventListener('click', async (ev) => {
      const t = ev.target.closest('button'); if (!t) return;
      if (t.dataset.group) { S.group = t.dataset.group; S.cat = null; S.sel = null; S.set = null; S.pv = Object.assign({}, mine()); S.confirm = null; return all(); }
      if (t.dataset.cat) { S.cat = t.dataset.cat; S.sel = null; S.pv = Object.assign({}, mine()); return all(); }
      if (t.dataset.rar) { S.rarity = t.dataset.rar; return paintRight(); }
      if (t.dataset.set) { const s = cat().sets.find((x) => x.id === t.dataset.set); S.set = s.id; S.sel = null; S.pv = Object.assign({}, mine()); s.items.map(byId).forEach((i) => { if (!isRoomItem(i)) S.pv[i.slot] = i.id; }); return all(); }
      if (t.dataset.id) {
        const it = byId(t.dataset.id); S.set = null; S.confirm = null;
        if (S.sel === it.id) { S.sel = null; S.pv = Object.assign({}, mine()); } else { S.sel = it.id; S.pv = Object.assign({}, mine()); if (!isRoomItem(it)) S.pv[it.slot] = it.id; }
        return all();
      }
      const act = t.dataset.act; if (!act) return;
      const it = S.sel ? byId(S.sel) : null;
      if (act === 'clear') { S.sel = null; S.set = null; S.pv = Object.assign({}, mine()); return all(); }
      if (act === 'buy') { if (S.confirm !== it.id) { S.confirm = it.id; paintLeft(); setTimeout(() => { if (S.confirm === it.id) { S.confirm = null; paintLeft(); } }, 3500); return; } return buyItem(it, false); }
      if (act === 'buywear') return buyItem(it, true);
      if (act === 'wear') { try { await saveWith(it); App.toast(`Wearing ${it.name}`, 'check'); S.pv = Object.assign({}, mine()); paintLeft(); } catch (e) { App.toast(e.message, 'x'); } return; }
      if (act === 'place') return App.go('room');
      if (act === 'buyset') {
        try {
          const r = await App.API.post('/api/shop/buy-set', { set: S.set });
          await App.reload(); App.toast(r.message, 'gem');
          const s = cat().sets.find((x) => x.id === S.set), n = mine(); s.items.map(byId).forEach((i) => { if (!isRoomItem(i)) n[i.slot] = i.id; });
          await saveCharacter(n);
          document.getElementById('sx-bits').textContent = num(st().player.starbits); all();
        } catch (e) { App.toast(e.message, 'x'); }
      }
    });
    main.addEventListener('input', (ev) => { if (ev.target.id === 'sx-q') { S.q = ev.target.value; const pos = ev.target.selectionStart; paintRight(); const q = right.querySelector('#sx-q'); q.focus(); q.setSelectionRange(pos, pos); } });
    main.addEventListener('change', (ev) => { if (ev.target.id === 'sx-sort') { S.sort = ev.target.value; paintRight(); } if (ev.target.id === 'sx-hide') { S.hideOwned = ev.target.checked; paintRight(); } });
  };

  /* ============================================================= CHARACTER */
  const SLOT_LABEL = {
    hair: 'Hairstyle', hairColor: 'Hair colour', eyes: 'Eyes', eyeColor: 'Eye colour', mouth: 'Mouth', face: 'Face extras',
    top: 'Top', bottom: 'Bottoms', shoes: 'Shoes', hat: 'Headwear', neck: 'Neck', back: 'Back', hand: 'In hand', pet: 'Pet', effect: 'Aura'
  };
  const REQUIRED = { hair: 1, hairColor: 1, eyes: 1, eyeColor: 1, mouth: 1, top: 1, bottom: 1, shoes: 1 };
  const WARD = [
    ['Hair', ['hair', 'hairColor']], ['Face', ['eyes', 'eyeColor', 'mouth', 'face']], ['Clothes', ['top', 'bottom', 'shoes']],
    ['Extras', ['hat', 'neck', 'back', 'hand']], ['Friends', ['pet', 'effect']]
  ];
  const C = { grp: 2, slot: 'top', hist: [] };

  views.character = async function (main) {
    let eq = mine(); const owned = ownedSet();
    const mineItems = (slot) => sortItems(cat().items.filter((i) => i.slot === slot && has(i, owned)), 'rarity');

    main.innerHTML = `<div class="sx sx-char">
      <header class="sx-head"><div><div class="eyebrow">My character</div><h1>Build your explorer</h1>
        <p class="lead">Changes save as you go. Wear anything you own — find more in the store.</p></div>
        <div class="sx-actions"><button class="sx-btn ghost" id="c-undo">${icon('rotate')} Undo</button><button class="sx-btn ghost" id="c-rand">${icon('spark')} Surprise me</button><button class="sx-btn ghost" data-nav="store">${icon('store')} Store</button></div></header>
      <div class="sx-layout">
        <aside class="sx-left"><div class="sx-stage tall"><div class="sx-halo"></div><div class="sx-avatar big" id="c-art"></div></div>
          <div class="sx-detail"><div class="sx-dname">${esc(st().player.name)}</div><p class="sx-ddesc" id="c-count"></p></div></aside>
        <section class="sx-right"><nav class="sx-tabs" id="c-groups"></nav><nav class="sx-subtabs" id="c-slots"></nav><div id="c-grid"></div></section>
      </div></div>`;
    const art = main.querySelector('#c-art');
    function paint() {
      art.innerHTML = ART.avatar(eq, { background: false, label: 'Your character' });
      main.querySelector('#c-count').textContent = `${cat().items.filter((i) => owned.has(i.id)).length} items in your collection`;
      main.querySelector('#c-groups').innerHTML = WARD.map((g, i) => `<button class="${i === C.grp ? 'on' : ''}" data-grp="${i}">${g[0]}</button>`).join('');
      const slots = WARD[C.grp][1]; if (!slots.includes(C.slot)) C.slot = slots[0];
      main.querySelector('#c-slots').innerHTML = slots.length > 1 ? slots.map((s) => `<button class="${s === C.slot ? 'on' : ''}" data-slot="${s}">${SLOT_LABEL[s]}${eq[s] ? '<i class="dot"></i>' : ''}</button>`).join('') : '';
      const items = mineItems(C.slot), none = !REQUIRED[C.slot];
      main.querySelector('#c-grid').innerHTML = `<div class="sx-grid small">${none ? `<button class="sx-card none ${eq[C.slot] ? '' : 'sel'}" data-wear=""><span class="sx-thumb"><span class="sx-x">${icon('x')}</span></span><span class="sx-name">None</span></button>` : ''}
        ${items.map((i) => `<button class="sx-card owned ${eq[C.slot] === i.id ? 'sel' : ''}" data-wear="${i.id}" style="${rc(i)}" data-tier="${i.rarity}"><span class="sx-thumb">${ART.thumb(i)}</span><span class="sx-name">${esc(i.name)}</span></button>`).join('')}
        <button class="sx-card more" data-nav="store"><span class="sx-thumb"><span class="sx-x">${icon('plus')}</span></span><span class="sx-name">Get more</span></button></div>`;
    }
    async function apply(next, quiet) {
      const before = eq; eq = next; paint();
      try { eq = norm(await saveCharacter(next)); } catch (e) { eq = before; App.toast(e.message, 'x'); }
      paint();
    }
    paint();
    main.addEventListener('click', (ev) => {
      const t = ev.target.closest('button'); if (!t) return;
      if (t.dataset.grp) { C.grp = +t.dataset.grp; C.slot = WARD[C.grp][1][0]; return paint(); }
      if (t.dataset.slot) { C.slot = t.dataset.slot; return paint(); }
      if (t.dataset.wear !== undefined) {
        C.hist.push(Object.assign({}, eq)); if (C.hist.length > 30) C.hist.shift();
        const next = Object.assign({}, eq); next[C.slot] = t.dataset.wear || null; return apply(next);
      }
    });
    main.querySelector('#c-undo').onclick = () => { const p = C.hist.pop(); if (p) apply(p); else App.toast('Nothing to undo', 'x'); };
    main.querySelector('#c-rand').onclick = () => {
      C.hist.push(Object.assign({}, eq));
      const next = {};
      cat().slots.forEach((s) => { const pool = mineItems(s); if (pool.length && (REQUIRED[s] || Math.random() < .55)) next[s] = App.pick(pool).id; });
      apply(next);
    };
  };

  /* ================================================================== ROOM */
  const R = { tab: 'Furniture', sel: null, me: true };
  const ROOM_TABS = [['Furniture', 'Furniture'], ['Decorations', 'Decor'], ['Room themes', 'Wall & floor']];

  views.room = async function (main) {
    const owned = ownedSet();
    const room0 = st().player.room || { theme: 'theme-study', items: [] };
    let layout = { theme: room0.theme, items: room0.items.map((x) => Object.assign({}, x)) }, dirty = false;
    const eq = mine();

    main.innerHTML = `<div class="sx sx-room">
      <header class="sx-head"><div><div class="eyebrow">My room</div><h1>Make it yours</h1>
        <p class="lead">Add furniture, drag it around, pick a wall and floor. <span id="r-count"></span></p></div>
        <div class="sx-actions"><button class="sx-btn ghost" id="r-reset">${icon('rotate')} Reset</button><button class="sx-btn primary" id="r-save">${icon('check')} Save room</button></div></header>
      <div class="sx-layout room">
        <section class="sx-roomwrap"><div class="sx-canvas" id="canvas"><svg viewBox="0 0 960 600" id="scene" aria-label="Your room"><g id="roomBg"></g><g id="objects"></g><g id="me" pointer-events="none"></g></svg></div>
          <div class="sx-roombar"><div class="sx-selbar" id="selbar"></div>
            <label class="sx-check"><input type="checkbox" id="r-me" ${R.me ? 'checked' : ''}> Show me in the room</label></div></section>
        <aside class="sx-right"><nav class="sx-tabs" id="r-tabs"></nav><div id="r-tray"></div>
          <p class="sx-note">Click an item to add it. Drag to move, arrow keys to nudge, Delete to remove.</p></aside>
      </div></div>`;
    const scene = main.querySelector('#scene'), objects = main.querySelector('#objects');
    const markDirty = (v) => { dirty = v; const b = main.querySelector('#r-save'); b.disabled = !v; b.classList.toggle('primary', v); b.classList.toggle('ghost', !v); b.lastChild.textContent = v ? ' Save room' : ' Saved'; };

    function bg() { main.querySelector('#roomBg').innerHTML = ART.room(byId(layout.theme) || byId('theme-study')); }
    function me() {
      const g = main.querySelector('#me');
      g.innerHTML = R.me ? `<g transform="translate(850 582) scale(1.4) translate(-56 -206)">${ART.figure(eq)}</g>` : '';
    }
    function draw() {
      objects.innerHTML = placedMarkup(layout.items);
      objects.querySelectorAll('.placed').forEach((el) => {
        el.onpointerdown = (ev) => startDrag(ev, el.dataset.uid);
        if (el.dataset.uid === R.sel) {
          const b = el.getBBox();
          el.insertAdjacentHTML('beforeend', `<rect class="selbox" x="${b.x - 3}" y="${b.y - 3}" width="${b.width + 6}" height="${b.height + 6}" rx="4" fill="none"/>`);
        }
      });
      main.querySelector('#r-count').textContent = `${layout.items.length} / 60 objects`;
      const bar = main.querySelector('#selbar'), o = layout.items.find((x) => x.uid === R.sel), it = o && byId(o.item);
      bar.innerHTML = o ? `<span class="sx-selname">${esc(it.name)}</span><button class="sx-btn ghost sm" data-r="flip">${icon('rotate')} Flip</button><button class="sx-btn ghost sm" data-r="dup">${icon('plus')} Copy</button><button class="sx-btn ghost sm" data-r="del">${icon('trash')} Remove</button>`
        : '<span class="sx-selname muted">Select something to flip, copy or remove it</span>';
    }
    function tray() {
      main.querySelector('#r-tabs').innerHTML = ROOM_TABS.map((t) => `<button class="${R.tab === t[0] ? 'on' : ''}" data-tab="${t[0]}">${t[1]}</button>`).join('');
      const list = sortItems(cat().items.filter((i) => i.cat === R.tab && has(i, owned)), 'rarity');
      main.querySelector('#r-tray').innerHTML = `<div class="sx-tray">${list.map((i) => `<button class="sx-card owned ${i.slot === 'theme' && layout.theme === i.id ? 'sel' : ''}" data-add="${i.id}" style="${rc(i)}" title="${esc(i.name)}"><span class="sx-thumb">${ART.thumb(i)}</span><span class="sx-name">${esc(i.name)}</span></button>`).join('')
        || '<div class="sx-empty">Nothing here yet — visit the store.</div>'}</div>`;
    }
    function startDrag(ev, uid) {
      ev.preventDefault(); R.sel = uid;
      const obj = layout.items.find((o) => o.uid === uid);
      const pt = (e) => { const r = scene.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * 960, y: (e.clientY - r.top) / r.height * 600 }; };
      const s = pt(ev), off = { x: obj.x - s.x, y: obj.y - s.y }; let moved = false;
      const move = (e) => {
        const p = pt(e); moved = true;
        obj.x = Math.round(App.clamp(p.x + off.x, 20, 940)); obj.y = Math.round(App.clamp(p.y + off.y, 60, 590));
        obj.z = obj.y > 430 ? 3 : obj.y > 300 ? 2 : 1;
        const el = objects.querySelector(`[data-uid="${uid}"]`); if (el) el.setAttribute('transform', `translate(${obj.x} ${obj.y}) scale(${obj.flip ? -1.6 : 1.6} 1.6)`);
      };
      const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); if (moved) markDirty(true); draw(); };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); draw();
    }
    function add(it) {
      if (it.slot === 'theme') { layout.theme = it.id; bg(); markDirty(true); return tray(); }
      if (layout.items.length >= 60) return App.toast('That is the most a room can hold (60)', 'x');
      const uid = 'u' + Math.random().toString(36).slice(2, 7), y = spot(it);
      layout.items.push({ uid, item: it.id, x: 480 + App.rand(60) - 30, y, z: y > 430 ? 3 : 1, flip: false });
      R.sel = uid; markDirty(true); draw();
    }
    bg(); me(); draw(); tray(); markDirty(false);

    main.addEventListener('click', (ev) => {
      const t = ev.target.closest('button'); if (!t) return;
      if (t.dataset.tab) { R.tab = t.dataset.tab; return tray(); }
      if (t.dataset.add) return add(byId(t.dataset.add));
      const o = layout.items.find((x) => x.uid === R.sel);
      if (t.dataset.r && o) {
        if (t.dataset.r === 'flip') o.flip = !o.flip;
        if (t.dataset.r === 'del') { layout.items = layout.items.filter((x) => x !== o); R.sel = null; }
        if (t.dataset.r === 'dup') { if (layout.items.length >= 60) return App.toast('That is the most a room can hold (60)', 'x'); const c = Object.assign({}, o, { uid: 'u' + Math.random().toString(36).slice(2, 7), x: Math.min(940, o.x + 24), y: Math.min(590, o.y + 10) }); layout.items.push(c); R.sel = c.uid; }
        markDirty(true); draw();
      }
    });
    scene.addEventListener('pointerdown', (ev) => { if (ev.target === scene || ev.target.closest('#roomBg')) { R.sel = null; draw(); } });
    main.querySelector('#r-me').onchange = (e) => { R.me = e.target.checked; me(); };
    const key = (e) => {
      const o = layout.items.find((x) => x.uid === R.sel); if (!o || /INPUT|SELECT|TEXTAREA/.test((e.target.tagName || ''))) return;
      const d = { ArrowLeft: [-6, 0], ArrowRight: [6, 0], ArrowUp: [0, -6], ArrowDown: [0, 6] }[e.key];
      if (d) { e.preventDefault(); o.x = App.clamp(o.x + d[0], 20, 940); o.y = App.clamp(o.y + d[1], 60, 590); markDirty(true); draw(); }
      else if (e.key === 'Delete' || e.key === 'Backspace') { layout.items = layout.items.filter((x) => x !== o); R.sel = null; markDirty(true); draw(); }
    };
    window.addEventListener('keydown', key); App.onCleanup(() => window.removeEventListener('keydown', key));
    main.querySelector('#r-reset').onclick = () => {
      const d = cat().defaultRoom; layout = { theme: d.theme, items: d.items.map((x) => Object.assign({}, x)) };
      R.sel = null; bg(); draw(); tray(); markDirty(true); App.toast('Layout reset — press Save to keep it', 'rotate');
    };
    main.querySelector('#r-save').onclick = async () => {
      try { const r = await App.API.post('/api/room', { room: layout }); st().player.room = r.room; layout = { theme: r.room.theme, items: r.room.items.map((x) => Object.assign({}, x)) }; markDirty(false); draw(); App.toast('Room saved', 'check'); }
      catch (e) { App.toast(e.message, 'x'); }
    };
  };
})();
