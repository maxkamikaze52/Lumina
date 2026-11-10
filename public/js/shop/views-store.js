/* Astrolab — shop views: Store, My Character, My Room. Owned by the content side. */
(function () {
  'use strict';
  const App = window.App, ART = window.ART, icon = window.icon;
  const views = window.VIEWS;
  const esc = App.esc, num = App.num, cap = App.cap;
  const st = () => App.state;

  /* ----------------------------------------------------------- store --- */
  const CATS = ['All', 'Clothing', 'Accessories', 'Pets', 'Furniture', 'Decorations', 'Room themes', 'Special collections', 'Appearance'];
  const shopState = { cat: 'All', rarity: 'All' };

  views.store = async function (main) {
    const s = st();
    await App.reload();
    const owned = new Set(App.state.owned);
    const rarity = App.state.catalogue.rarity;
    const items = App.state.catalogue.items.filter((i) =>
      (shopState.cat === 'All' || i.cat === shopState.cat) &&
      (shopState.rarity === 'All' || i.rarity === shopState.rarity) &&
      i.price > 0);

    main.innerHTML = `<div class="stack">
      <div class="between"><div><div class="eyebrow">Store</div><h1 style="margin-top:4px">Spend your Starbits</h1>
        <p class="lead" style="margin-top:6px">Everything is earned in games. No real money, no loot boxes.</p></div>
        <div class="chip bits">${ART.starbit({ size: 18 })}<b>${num(App.state.player.starbits)}</b></div></div>

      <div class="filters">${CATS.map((c) => `<button class="pill ${shopState.cat === c ? 'jade' : ''}" data-cat="${c}">${c}</button>`).join('')}</div>
      <div class="filters">${['All', 'common', 'uncommon', 'rare', 'epic', 'legendary'].map((r) =>
        `<button class="pill ${shopState.rarity === r ? 'amber' : ''}" data-rar="${r}">${r === 'All' ? 'Any rarity' : rarity[r].label}</button>`).join('')}</div>

      <section class="shop-grid">
        ${items.map((i) => {
          const has = owned.has(i.id);
          const can = App.state.player.starbits >= i.price;
          return `<article class="shop-item">
            <div class="shop-thumb">${ART.thumb(i)}</div>
            <b>${esc(i.name)}</b>
            <span class="rar" style="color:${rarity[i.rarity].colour}">${rarity[i.rarity].label}</span>
            <div class="between" style="margin-top:auto">
              ${has ? '<span class="owned-tag">Owned</span>' : `<span class="price">${icon('bit')}${num(i.price)}</span>`}
              ${has ? `<button class="btn ghost sm" data-equip="${i.id}">${i.slot === 'furniture' || i.slot === 'theme' ? 'Room' : 'Wear'}</button>`
                : `<button class="btn sm ${can ? '' : 'ghost'}" data-buy="${i.id}" ${can ? '' : 'disabled'}>Buy</button>`}
            </div></article>`;
        }).join('')}
      </section>
      ${items.length ? '' : '<div class="empty">Nothing in this filter.</div>'}
      <p class="small muted">${App.state.catalogue.items.filter((i) => i.price > 0).length} items in the catalogue ·
        purchases are permanent and stored on the server.</p>
    </div>`;

    main.querySelectorAll('[data-cat]').forEach((b) => { b.onclick = () => { shopState.cat = b.dataset.cat; App.render(); }; });
    main.querySelectorAll('[data-rar]').forEach((b) => { b.onclick = () => { shopState.rarity = b.dataset.rar; App.render(); }; });

    main.querySelectorAll('[data-buy]').forEach((b) => {
      b.onclick = () => {
        const it = App.state.catalogue.items.find((i) => i.id === b.dataset.buy);
        App.modal(`<div class="row" style="gap:16px;align-items:center;flex-wrap:nowrap">
            <div class="shop-thumb" style="width:120px;height:140px;flex:none">${ART.thumb(it)}</div>
            <div><h2 style="font-size:22px">${esc(it.name)}</h2>
            <p class="small muted" style="margin-top:6px">${esc(it.desc)}</p>
            <p class="small" style="margin-top:10px">Rarity: <b>${esc(App.state.catalogue.rarity[it.rarity].label)}</b></p>
            <p class="price" style="margin-top:6px;color:var(--amber)">${icon('bit')} ${num(it.price)}</p></div></div>
          <div class="row" style="margin-top:18px"><button class="btn jade" id="ok">Buy for ${num(it.price)}</button>
          <button class="btn ghost" data-close>Cancel</button></div>`, (sheet) => {
          sheet.querySelector('#ok').onclick = async () => {
            try {
              const r = await App.API.post('/api/shop/buy', { item: it.id });
              await App.reload();
              App.closeModal(); App.toast(r.message, 'gem'); App.render();
            } catch (e) { App.toast(e.message, 'x'); }
          };
        });
      };
    });
    main.querySelectorAll('[data-equip]').forEach((b) => {
      b.onclick = () => {
        const it = App.state.catalogue.items.find((i) => i.id === b.dataset.equip);
        App.go(it.slot === 'furniture' || it.slot === 'theme' ? 'room' : 'character');
      };
    });
  };

  /* ------------------------------------------------------- character --- */
  const SLOT_LABEL = {
    skin: 'Skin', hair: 'Hair', hairColor: 'Hair colour', eyes: 'Eyes', eyeColor: 'Eye colour',
    mouth: 'Mouth', top: 'Top', bottom: 'Trousers', shoes: 'Shoes', hat: 'Hat',
    accessory: 'Accessory', back: 'Back', pet: 'Pet', effect: 'Effect'
  };
  const charState = { slot: 'top' };

  views.character = async function (main) {
    const s = st();
    const owned = new Set(s.owned);
    const equipped = s.player.character || {};
    const slot = charState.slot;
    const items = s.catalogue.items.filter((i) => i.slot === slot && (owned.has(i.id) || i.price === 0));

    main.innerHTML = `<div class="stack">
      <div><div class="eyebrow">My character</div><h1 style="margin-top:4px">Build your explorer</h1></div>
      <section class="char-stage">
        <div class="stack">
          <div class="stage"><div class="halo"></div>${ART.avatar(equipped, { label: 'Your character' })}</div>
          <div class="card flat small">
            <div class="between"><span class="muted">Owned items</span><b>${owned.size}</b></div>
            <div class="divider" style="margin:10px 0"></div>
            <button class="btn ghost sm block" data-nav="store">${icon('store')} Visit the store</button>
          </div>
        </div>
        <div class="card">
          <div class="slot-tabs">${Object.keys(SLOT_LABEL).map((sl) =>
            `<button data-slot="${sl}" class="${sl === slot ? 'on' : ''}">${SLOT_LABEL[sl]}</button>`).join('')}</div>
          <div class="between"><h3>${SLOT_LABEL[slot]}</h3>
            ${equipped[slot] ? `<button class="btn ghost sm" id="takeoff">Remove</button>` : ''}</div>
          <div class="swatches" style="margin-top:14px">
            ${items.map((i) => `<button class="swatch ${equipped[slot] === i.id ? 'on' : ''}" data-wear="${i.id}">
              ${['skin', 'eyeColor', 'hairColor'].includes(i.slot)
                ? `<span class="chipc" style="background:${i.colour}"></span>`
                : `<span class="mini">${ART.thumb(i)}</span>`}
              <span>${esc(i.name)}</span></button>`).join('') || '<div class="empty small">Nothing owned in this slot yet — look in the store.</div>'}
          </div>
        </div>
      </section>
    </div>`;

    main.querySelectorAll('[data-slot]').forEach((b) => {
      b.onclick = () => { charState.slot = b.dataset.slot; App.render(); };
    });
    main.querySelectorAll('[data-wear]').forEach((b) => {
      b.onclick = async () => {
        const next = Object.assign({}, equipped);
        next[slot] = b.dataset.wear;
        try {
          const r = await App.API.post('/api/character', { equipped: next });
          App.state.player.character = r.equipped;
          App.refreshWallet();
          App.render();
        } catch (e) { App.toast(e.message, 'x'); }
      };
    });
    const off = main.querySelector('#takeoff');
    if (off) off.onclick = async () => {
      const next = Object.assign({}, equipped); next[slot] = null;
      const r = await App.API.post('/api/character', { equipped: next });
      App.state.player.character = r.equipped; App.refreshWallet(); App.render();
    };
  };

  /* ------------------------------------------------------------ room --- */
  const roomState = { sel: null, dirty: false };

  views.room = async function (main) {
    const s = st();
    const owned = new Set(s.owned);
    const room = s.player.room || { theme: 'theme-study', items: [] };
    const theme = s.catalogue.items.find((i) => i.id === room.theme) || s.catalogue.items.find((i) => i.id === 'theme-study');
    const furniture = s.catalogue.items.filter((i) => i.ownedSlot === 'furniture' || i.slot === 'furniture');
    const mine = furniture.filter((i) => owned.has(i.id));

    main.innerHTML = `<div class="stack">
      <div class="between"><div><div class="eyebrow">My room</div><h1 style="margin-top:4px">Your study</h1></div>
        <div class="row" style="gap:8px">
          <button class="btn ghost sm" id="undo">${icon('rotate')} Reset layout</button>
          <button class="btn jade sm" id="save">${icon('check')} Save room</button></div></div>
      <section class="room-wrap">
        <div class="room-canvas" id="canvas">
          <svg viewBox="0 0 960 600" id="scene" aria-label="Your room">
            <defs>
              <linearGradient id="wallShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
              <linearGradient id="floorShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
              <pattern id="floorLines" width="40" height="600" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="600" stroke="rgba(0,0,0,.12)" stroke-width="2"/></pattern>
            </defs>
            <rect width="960" height="420" fill="${esc(theme.colour)}"/>
            <rect width="960" height="420" fill="url(#wallShade)"/>
            <rect y="420" width="960" height="180" fill="${esc(theme.floor || '#a9793f')}"/>
            <rect y="420" width="960" height="180" fill="url(#floorLines)"/>
            <rect y="414" width="960" height="10" fill="rgba(0,0,0,.22)"/>
            <g id="objects"></g>
          </svg>
          <div class="room-side">
            <button class="btn ghost sm" id="rotate" title="Rotate / flip">${icon('rotate')} Flip</button>
            <button class="btn ghost sm" id="remove" title="Remove">${icon('trash')} Remove</button>
          </div>
        </div>
        <aside class="room-side">
          <div class="card flat">
            <div class="eyebrow">Your furniture</div>
            <div class="tray" style="margin-top:10px" id="tray">
              ${mine.map((i) => `<button data-add="${i.id}" title="${esc(i.name)}">${ART.thumb(i)}</button>`).join('')
                || '<span class="small muted">Buy furniture in the store.</span>'}
            </div>
            <div class="divider"></div>
            <div class="eyebrow">Wall &amp; floor</div>
            <div class="tray" style="margin-top:10px">
              ${s.catalogue.items.filter((i) => i.slot === 'theme' && owned.has(i.id)).map((i) =>
                `<button data-theme="${i.id}" style="border-color:${i.id === room.theme ? 'var(--jade)' : ''}" title="${esc(i.name)}">${ART.thumb(i)}</button>`).join('')}
            </div>
          </div>
          <div class="card flat small muted">Click an object to select it, then drag to move.
            Use Flip to turn it around and Remove to take it out. Save keeps the layout for good.</div>
        </aside>
      </section>
    </div>`;

    let layout = { theme: room.theme, items: room.items.map((x) => Object.assign({}, x)) };

    function draw() {
      const g = main.querySelector('#objects');
      const sorted = layout.items.slice().sort((a, b) => (a.z - b.z) || (a.y - b.y));
      g.innerHTML = sorted.map((o) => {
        const it = s.catalogue.items.find((i) => i.id === o.item);
        if (!it) return '';
        return `<g class="placed ${roomState.sel === o.uid ? 'sel' : ''}" data-uid="${o.uid}"
          transform="translate(${o.x} ${o.y}) scale(${o.flip ? -1.6 : 1.6} 1.6)">
          ${ART.furniture(it.style, it.colour)}</g>`;
      }).join('');
      main.querySelectorAll('.placed').forEach((el) => {
        el.onpointerdown = (ev) => startDrag(ev, el.dataset.uid);
      });
    }

    function startDrag(ev, uid) {
      ev.preventDefault();
      roomState.sel = uid;
      const obj = layout.items.find((o) => o.uid === uid);
      const svg = main.querySelector('#scene');
      const pt = (e) => {
        const r = svg.getBoundingClientRect();
        return { x: (e.clientX - r.left) / r.width * 960, y: (e.clientY - r.top) / r.height * 600 };
      };
      const start = pt(ev);
      const off = { x: obj.x - start.x, y: obj.y - start.y };
      const move = (e) => {
        const p = pt(e);
        obj.x = Math.round(App.clamp(p.x + off.x, 20, 940));
        obj.y = Math.round(App.clamp(p.y + off.y, 60, 590));
        obj.z = obj.y > 430 ? 3 : obj.y > 300 ? 2 : 1;
        const el = main.querySelector(`[data-uid="${uid}"]`);
        if (el) el.setAttribute('transform', `translate(${obj.x} ${obj.y}) scale(${obj.flip ? -1.6 : 1.6} 1.6)`);
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        roomState.dirty = true;
        draw();
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      draw();
    }

    draw();

    main.querySelectorAll('[data-add]').forEach((b) => {
      b.onclick = () => {
        const uid = 'u' + Math.random().toString(36).slice(2, 7);
        layout.items.push({ uid, item: b.dataset.add, x: 480, y: 470, z: 2, flip: false });
        roomState.sel = uid; roomState.dirty = true; draw();
      };
    });
    main.querySelectorAll('[data-theme]').forEach((b) => {
      b.onclick = () => {
        layout.theme = b.dataset.theme; roomState.dirty = true;
        const t = s.catalogue.items.find((i) => i.id === b.dataset.theme);
        main.querySelector('#scene rect').setAttribute('fill', t.colour);
        main.querySelectorAll('[data-theme]').forEach((x) => { x.style.borderColor = ''; });
        b.style.borderColor = 'var(--jade)';
      };
    });
    main.querySelector('#rotate').onclick = () => {
      const o = layout.items.find((x) => x.uid === roomState.sel);
      if (!o) return App.toast('Select an object first', 'x');
      o.flip = !o.flip; roomState.dirty = true; draw();
    };
    main.querySelector('#remove').onclick = () => {
      if (!roomState.sel) return App.toast('Select an object first', 'x');
      layout.items = layout.items.filter((x) => x.uid !== roomState.sel);
      roomState.sel = null; roomState.dirty = true; draw();
    };
    main.querySelector('#undo').onclick = async () => {
      const d = App.state.catalogue.defaultRoom;
      layout = { theme: d.theme, items: d.items.map((x) => Object.assign({}, x)) };
      roomState.dirty = true; draw();
      App.toast('Layout reset — remember to save', 'rotate');
    };
    main.querySelector('#save').onclick = async () => {
      try {
        const r = await App.API.post('/api/room', { room: layout });
        App.state.player.room = r.room;
        roomState.dirty = false;
        App.toast('Room saved', 'check');
      } catch (e) { App.toast(e.message, 'x'); }
    };
  };
})();
