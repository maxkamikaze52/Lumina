/* Astrolab — WorldQuest: an interactive 2D world map. 196 countries, six modes,
   capitals and flags, and the Extreme World Challenge. */
(function () {
  'use strict';
  const App = window.App, icon = window.icon;
  const esc = App.esc, num = App.num, cap = App.cap;

  const WQ = {
    world: null, byName: {}, continent: 'Europe', difficulty: 'beginner',
    mode: 'locate', game: null
  };
  const CONTS = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];
  const WQ_ART = [
    { id: 'locate', art: 'locate', name: 'FIND THE COUNTRY', sub: 'Name given, click it on the map' },
    { id: 'identify', art: 'identify', name: 'NAME THE COUNTRY', sub: 'One country glows - pick its name' },
    { id: 'capital', art: 'capital', name: 'CAPITAL CITIES', sub: 'Do you know the capital?' },
    { id: 'flag', art: 'flag', name: 'FLAGS', sub: 'Whose flag is this?' },
    { id: 'marathon', art: 'marathon', name: 'MARATHON', sub: '20 countries, timed' },
    { id: 'challenge', art: 'challenge', name: 'THE 196', sub: 'All 196 - the extreme challenge' }
  ];
  const ROUND_SIZE = { locate: 10, identify: 10, capital: 10, flag: 10 };

  async function load() {
    if (WQ.world) return WQ.world;
    const res = await fetch('/data/world.json');
    WQ.world = await res.json();
    WQ.world.countries.forEach((c) => { WQ.byName[c.name] = c; });
    return WQ.world;
  }

  const pools = () => {
    const all = WQ.world.countries;
    return WQ.continent === 'World' ? all : all.filter((c) => c.continent === WQ.continent);
  };

  /* difficulty: which countries appear + what help is given */
  function difficultyPool(list) {
    const d = WQ.difficulty;
    const area = (c) => c.area;
    if (d === 'beginner') return list.slice().sort((a, b) => area(b) - area(a)).slice(0, Math.max(8, Math.round(list.length * 0.45)));
    if (d === 'intermediate') return list;
    if (d === 'advanced') return list;
    if (d === 'expert') return list;
    return list;
  }
  const help = () => ({
    highlight: WQ.difficulty === 'beginner',
    hints: WQ.difficulty === 'beginner' || WQ.difficulty === 'intermediate',
    labels: WQ.difficulty === 'beginner',
    seconds: { beginner: 0, intermediate: 0, advanced: 0, expert: 0 }[WQ.difficulty]
  });

  /* ---------------- map rendering ---------------- */
  function mapSVG(opts) {
    const o = opts || {};
    const w = WQ.world;
    return `<svg viewBox="${o.viewBox || '0 0 2000 1010'}" id="wq-svg" role="application"
      aria-label="World map — click a country">
      <rect width="2000" height="1010" fill="#101a30"/>
      <g id="wq-zoom">
        ${w.countries.map((c) => `<path class="land ${o.classes ? o.classes(c) : ''}" data-c="${esc(c.name)}"
          d="${c.path}"><title>${esc(c.name)}</title></path>`).join('')}
        ${o.capitals ? o.capitals.map((cp) => `<circle class="cap" cx="${cp.x}" cy="${cp.y}" r="${cp.r || 4}"/>`).join('') : ''}
        ${(o.labels || []).map((l) => `<text class="lbl" x="${l.x}" y="${l.y}">${esc(l.text)}</text>`).join('')}
      </g>
    </svg>`;
  }

  /* viewBox zoom/pan controller */
  function attachMap(main, opts) {
    const svg = main.querySelector('#wq-svg');
    if (!svg) return;
    const wrap = main.querySelector('.wq-map');
    let vb = { x: 0, y: 0, w: 2000, h: 1010 };
    const apply = () => svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    function zoom(factor, cx, cy) {
      const nw = App.clamp(vb.w * factor, 90, 2000);
      const scale = nw / vb.w;
      const px = cx == null ? vb.x + vb.w / 2 : cx;
      const py = cy == null ? vb.y + vb.h / 2 : cy;
      vb.x = px - (px - vb.x) * scale;
      vb.y = py - (py - vb.y) * scale;
      vb.w = nw; vb.h = nw * 0.505;
      clampPan(); apply();
    }
    function clampPan() {
      vb.x = App.clamp(vb.x, -vb.w * 0.1, 2000 - vb.w * 0.9);
      vb.y = App.clamp(vb.y, -vb.h * 0.1, 1010 - vb.h * 0.9);
    }
    function centreOn(c, factor) {
      const cx = c.cx, cy = c.cy;
      const nw = App.clamp(Math.max(c.bbox[2] - c.bbox[0], c.bbox[3] - c.bbox[1]) * (factor || 8), 90, 1400);
      vb.w = nw; vb.h = nw * 0.505;
      vb.x = cx - vb.w / 2; vb.y = cy - vb.h / 2;
      clampPan(); apply();
    }
    wrap.addEventListener('wheel', (e) => {
      e.preventDefault();
      const r = svg.getBoundingClientRect();
      const px = vb.x + (e.clientX - r.left) / r.width * vb.w;
      const py = vb.y + (e.clientY - r.top) / r.height * vb.h;
      zoom(e.deltaY > 0 ? 1.18 : 0.85, px, py);
    }, { passive: false });

    let drag = null;
    wrap.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.map-tools') || e.target.closest('.map-list')) return;
      drag = { x: e.clientX, y: e.clientY, vx: vb.x, vy: vb.y, moved: false };
      wrap.classList.add('dragging');
    });
    wrap.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const r = svg.getBoundingClientRect();
      const dx = (e.clientX - drag.x) / r.width * vb.w;
      const dy = (e.clientY - drag.y) / r.height * vb.h;
      if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 4) drag.moved = true;
      vb.x = drag.vx - dx; vb.y = drag.vy - dy;
      clampPan(); apply();
    });
    wrap.addEventListener('pointerup', () => { wrap.classList.remove('dragging'); setTimeout(() => { drag = null; }, 0); });
    wrap.addEventListener('pointercancel', () => { drag = null; wrap.classList.remove('dragging'); });

    const tools = main.querySelector('.map-tools');
    if (tools) {
      tools.querySelector('[data-zoom="in"]').onclick = () => zoom(0.7);
      tools.querySelector('[data-zoom="out"]').onclick = () => zoom(1.45);
      tools.querySelector('[data-zoom="reset"]').onclick = () => { vb = { x: 0, y: 0, w: 2000, h: 1010 }; apply(); };
    }
    svg.querySelectorAll('.land').forEach((p) => {
      p.addEventListener('click', (e) => {
        if (drag && drag.moved) return;
        if (opts.onPick) opts.onPick(p.dataset.c, e);
      });
    });
    return { zoom, centreOn, get vb() { return vb; } };
  }

  /* ---------------- small-country helper panel ---------------- */
  function pickerHTML(names) {
    return `<div class="map-list" id="wq-list">${names.map((n) =>
      `<button data-pick="${esc(n)}">${esc(n)}</button>`).join('')}</div>`;
  }

  /* ---------------- flags (emoji from ISO code) ---------------- */
  const flagEmoji = (iso2) => {
    if (!iso2 || iso2.length !== 2) return '🏳️';
    return String.fromCodePoint(...iso2.toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0)));
  };
  const flagHTML = (c, size) => `<span class="flag" style="font-size:${size || 64}px;line-height:1"
    role="img" aria-label="Flag of ${esc(c.name)}">${flagEmoji(c.iso2)}</span>`;

  /* ---------------- one question round ---------------- */
  function startGame(mode) {
    const pool = difficultyPool(pools());
    if (!pool.length) return App.toast('No countries in that pool', 'x');
    const size = mode === 'challenge' ? WQ.world.countries.length
      : mode === 'marathon' ? 20 : ROUND_SIZE[mode] || 10;
    const queue = App.shuffle(pool.slice()).slice(0, Math.min(size, pool.length));
    WQ.game = {
      mode, queue, index: 0, answers: [], startedAt: performance.now(),
      streak: 0, correct: 0, wrong: 0, capitals: 0, flags: 0, countryDetail: [],
      continent: WQ.continent, difficulty: WQ.difficulty, done: false, deadline: 0
    };
    const body = {
      game: 'worldquest', mode: mode === 'challenge' ? 'challenge' : mode,
      difficulty: WQ.difficulty, meta: { continent: WQ.continent, mode }
    };
    App.API.post('/api/session/start', body).then((r) => {
      WQ.game.sessionId = r.sessionId;
      WQ.game.tag = 'wq-' + r.sessionId;
      drawQuestion(App.stage());
    }).catch((e) => {
      WQ.game = null;
      App.toast(e.message, 'x');
    });
  }

  function drawQuestion(main) {
    const gm = WQ.game;
    if (!gm) return;
    if (gm.index >= gm.queue.length) return finish(main);
    const target = gm.queue[gm.index];
    const mode = gm.mode;
    const opts = help();

    const mapClasses = (c) => {
      const stat = (App.state.stats.countryMap || {})[c.name];
      if (stat && stat.correct >= 2) return 'mastered';
      if (stat && stat.asked) return 'seen';
      return '';
    };

    if (mode === 'identify') {
      /* highlight one country, four name choices */
      const choices = App.shuffle([target.name].concat(
        App.shuffle(pools().filter((c) => c.name !== target.name)).slice(0, 3).map((c) => c.name)));
      main.innerHTML = `<div class="stack">
        ${gameHeader('Which country is highlighted?')}
        <div class="wq-map" id="map">
          ${mapSVG({ classes: (c) => (c.name === target.name ? 'target' : mapClasses(c)) })}
          <div class="map-tools">
            <button data-zoom="in" aria-label="Zoom in">+</button>
            <button data-zoom="out" aria-label="Zoom out">−</button>
            <button data-zoom="reset" aria-label="Reset view">⤢</button>
          </div>
        </div>
        <div class="choices">${choices.map((n) => `<button class="choice" data-answer="${esc(n)}">${esc(n)}</button>`).join('')}</div>
        <p class="small muted" id="fb">&nbsp;</p></div>`;
      const ctl = attachMap(main, {});
      ctl.centreOn(target, 4);
      main.querySelectorAll('[data-answer]').forEach((b) => {
        b.onclick = () => {
          const ok = b.dataset.answer === target.name;
          main.querySelectorAll('[data-answer]').forEach((x) => {
            if (x.dataset.answer === target.name) x.classList.add('ok');
            else if (x === b && !ok) x.classList.add('bad');
          });
          record(ok, target);
          main.querySelector('#fb').innerHTML = ok ? '✓ Correct' : `✕ That was <b>${esc(target.name)}</b>`;
          setTimeout(() => { gm.index++; drawQuestion(main); }, ok ? 800 : 1500);
        };
      });
      return;
    }

    if (mode === 'capital') {
      const others = App.shuffle(WQ.world.countries.filter((c) => c.name !== target.name && c.capital)).slice(0, 3);
      const choices = App.shuffle([target.capital].concat(others.map((c) => c.capital)));
      main.innerHTML = `<div class="stack">
        ${gameHeader(`What is the capital of ${target.name}?`)}
        <div class="card flat center" style="padding:26px">
          ${flagHTML(target, 54)}
          <h2 style="margin-top:10px">${esc(target.name)}</h2>
        </div>
        <div class="choices">${choices.map((n) => `<button class="choice" data-answer="${esc(n)}">${esc(n)}</button>`).join('')}</div>
        <p class="small muted" id="fb">&nbsp;</p></div>`;
      main.querySelectorAll('[data-answer]').forEach((b) => {
        b.onclick = () => {
          const ok = b.dataset.answer === target.capital;
          main.querySelectorAll('[data-answer]').forEach((x) => {
            if (x.dataset.answer === target.capital) x.classList.add('ok');
            else if (x === b && !ok) x.classList.add('bad');
          });
          record(ok, target, { capital: true });
          main.querySelector('#fb').innerHTML = ok ? '✓ Correct' : `✕ It is <b>${esc(target.capital)}</b>`;
          setTimeout(() => { gm.index++; drawQuestion(main); }, ok ? 800 : 1600);
        };
      });
      return;
    }

    if (mode === 'flag') {
      const others = App.shuffle(WQ.world.countries.filter((c) => c.name !== target.name)).slice(0, 3);
      const choices = App.shuffle([target].concat(others));
      main.innerHTML = `<div class="stack">
        ${gameHeader('Whose flag is this?')}
        <div class="card flat center" style="padding:34px">${flagHTML(target, 96)}</div>
        <div class="choices">${choices.map((c) => `<button class="choice" data-answer="${esc(c.name)}">${esc(c.name)}</button>`).join('')}</div>
        <p class="small muted" id="fb">&nbsp;</p></div>`;
      main.querySelectorAll('[data-answer]').forEach((b) => {
        b.onclick = () => {
          const ok = b.dataset.answer === target.name;
          main.querySelectorAll('[data-answer]').forEach((x) => {
            if (x.dataset.answer === target.name) x.classList.add('ok');
            else if (x === b && !ok) x.classList.add('bad');
          });
          record(ok, target, { flag: true });
          main.querySelector('#fb').innerHTML = ok ? '✓ Correct' : `✕ That flag is <b>${esc(target.name)}</b>`;
          setTimeout(() => { gm.index++; drawQuestion(main); }, ok ? 800 : 1500);
        };
      });
      return;
    }

    /* locate / marathon / challenge: name given, click the country */
    const small = target.area < 90;
    main.innerHTML = `<div class="stack">
      ${gameHeader(mode === 'challenge'
        ? `Find every country · ${gm.index + 1} of ${gm.queue.length}`
        : mode === 'marathon' ? 'Country Marathon' : `Find ${esc(target.name)}`)}
      <div class="card flat" style="padding:14px 18px">
        <div class="between"><div>
          <div class="eyebrow">${mode === 'marathon' || mode === 'challenge' ? 'Locate' : 'Click the country on the map'}</div>
          <h2 style="margin-top:2px">${esc(target.name)}</h2></div>
          <div class="row" style="gap:8px">
            ${opts.hints ? `<button class="btn ghost sm" id="hint">${icon('compass')} Hint</button>` : ''}
            <button class="btn ghost sm" id="skip">Skip</button></div></div>
        <p class="small muted" style="margin-top:6px" id="hintline">${small
          ? 'This country is very small — zoom in, or pick it from the list below.'
          : 'Drag to pan, scroll or use + / − to zoom.'}</p>
      </div>
      <div class="wq-map" id="map">
        ${mapSVG({ classes: mapClasses })}
        <div class="map-hud">🔥 ${gm.streak} · ${gm.correct}/${gm.answers.length} correct</div>
        <div class="map-tools">
          <button data-zoom="in" aria-label="Zoom in">+</button>
          <button data-zoom="out" aria-label="Zoom out">−</button>
          <button data-zoom="reset" aria-label="Reset view">⤢</button>
        </div>
      </div>
      <details class="card flat"><summary class="small">Country list (for tiny countries)</summary>
        ${pickerHTML(pools().map((c) => c.name).sort())}</details>
      <p class="small muted" id="fb">&nbsp;</p></div>`;

    const ctl = attachMap(main, {
      onPick: (name) => {
        const ok = name === target.name;
        const el = main.querySelector(`.land[data-c="${CSS.escape(name)}"]`);
        if (el) {
          el.classList.remove('correct', 'wrong');
          el.classList.add(ok ? 'correct' : 'wrong');
          if (!ok) {
            const t = main.querySelector(`.land[data-c="${CSS.escape(target.name)}"]`);
            if (t) t.classList.add('correct');
          }
        }
        record(ok, target);
        main.querySelector('#fb').innerHTML = ok ? '✓ Correct'
          : `✕ You clicked ${esc(name)}. ${esc(target.name)} is shown in green.`;
        main.querySelectorAll('#wq-list button').forEach((b) => { b.disabled = true; });
        if (!ok && target.area < 160) ctl.centreOn(target, 9);
        setTimeout(() => { gm.index++; drawQuestion(main); }, ok ? 750 : 1700);
      }
    });
    if (WQ.continent === 'World') ctl.zoom(0.55);
    if (WQ.mode === 'locate' && opts.highlight && gm.index === 0) ctl.centreOn(target, 6);

    main.querySelectorAll('[data-pick]').forEach((b) => {
      b.onclick = () => {
        const name = b.dataset.pick;
        const ok = name === target.name;
        record(ok, target);
        main.querySelector('#fb').innerHTML = ok ? '✓ Correct' : `✕ That was ${esc(name)}. It is ${esc(target.name)}.`;
        main.querySelectorAll('[data-pick]').forEach((x) => { x.disabled = true; });
        setTimeout(() => { gm.index++; drawQuestion(main); }, ok ? 750 : 1500);
      };
    });
    const hintBtn = main.querySelector('#hint');
    if (hintBtn) hintBtn.onclick = () => {
      main.querySelector('#hintline').textContent =
        `${target.name} is in ${target.continent}. It borders: ${neighbours(target).slice(0, 4).join(', ') || 'no land neighbours'}.`;
      gm.hintsUsed = (gm.hintsUsed || 0) + 1;
    };
    main.querySelector('#skip').onclick = () => {
      record(false, target);
      gm.index++; drawQuestion(main);
    };
  }

  /* rough neighbour hint: nearest countries by centroid distance */
  function neighbours(c) {
    return WQ.world.countries
      .filter((o) => o.name !== c.name && o.continent === c.continent)
      .map((o) => ({ n: o.name, d: Math.hypot(o.cx - c.cx, o.cy - c.cy) }))
      .sort((a, b) => a.d - b.d).slice(0, 4).map((x) => x.n);
  }

  function gameHeader(prompt) {
    const gm = WQ.game;
    const progress = Math.round((gm.index / gm.queue.length) * 100);
    return `<div class="between">
      <div><div class="eyebrow">WorldQuest · ${esc(cap(gm.difficulty))} · ${esc(gm.continent)}</div>
        <h2 style="margin-top:2px">${prompt}</h2></div>
      <div class="row" style="gap:8px;align-items:center">
        <span class="pill">${gm.index + 1} / ${gm.queue.length}</span>
        <button class="btn ghost sm" data-leave-world>${icon('games')} Astrolab</button></div>
    </div>
    <div class="track" style="height:6px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden">
      <i style="display:block;height:100%;width:${progress}%;background:var(--wq)"></i></div>`;
  }

  function record(ok, target, extra) {
    const gm = WQ.game;
    if (!gm) return;
    gm.answers.push({ n: target.name, ok });
    gm.countryDetail.push({ n: target.name, ok });
    if (extra && extra.capital) {
      gm.capitalDetail = gm.capitalDetail || [];
      gm.capitalDetail.push({ n: target.name, ok });
      if (ok) gm.capitals++;
    }
    if (extra && extra.flag) {
      gm.flagDetail = gm.flagDetail || [];
      gm.flagDetail.push(target.name);
      if (ok) gm.flags++;
    }
    if (ok) { gm.correct++; gm.streak++; } else { gm.wrong++; gm.streak = 0; }
  }

  async function finish(main) {
    const gm = WQ.game;
    if (!gm || gm.done) return;
    gm.done = true;
    const total = gm.answers.length;
    const correct = gm.correct;
    const duration = (performance.now() - gm.startedAt) / 1000;
    let reward = { xp: 0, starbits: 0, badges: [], class: null };
    try {
      reward = await App.API.post('/api/session/complete', {
        sessionId: gm.sessionId, tag: gm.tag, completed: true,
        correct, total, score: correct, duration,
        meta: {
          continent: gm.continent, mode: gm.mode, difficulty: gm.difficulty,
          capitalCorrect: gm.capitals, flagCorrect: gm.flags,
          timeSeconds: Math.round(duration)
        },
        details: { countries: gm.countryDetail, capitals: gm.capitalDetail || [], flags: gm.flagDetail || [] }
      });
      await App.reload();
    } catch (e) { App.toast(e.message, 'x'); }
    WQ.game = null;
    const acc = total ? Math.round(correct / total * 100) : 0;
    main.innerHTML = `<div class="stack">
      <div class="res-hero"><div class="eyebrow">${esc(cap(gm.mode))} complete</div>
        <b>${correct}/${total}</b><p class="muted">${acc}% accuracy over ${Math.round(duration)}s</p>
        <div class="res-grid">
          <div><b style="color:var(--jade)">+${num(reward.xp)}</b><span>XP</span></div>
          <div><b style="color:var(--amber)">+${num(reward.starbits)}</b><span>Starbits</span></div>
          <div><b>${gm.capitals}</b><span>capitals</span></div>
          <div><b>${gm.flags}</b><span>flags</span></div>
        </div></div>
      ${gm.answers.filter((a) => !a.ok).length ? `<div class="card flat"><div class="eyebrow">Missed</div>
        <p class="small" style="margin-top:8px">${gm.answers.filter((a) => !a.ok).map((a) => esc(a.n)).join(' · ')}</p></div>` : ''}
      <div class="row"><button class="btn jade" id="again">Play again</button>
        <button class="btn ghost" id="back">WorldQuest home</button></div>
    </div>`;
    if (reward.badges && reward.badges.length) App.celebrate(reward.badges);
    main.querySelector('#again').onclick = () => { WQ.mode = gm.mode; startGame(gm.mode); };
    main.querySelector('#back').onclick = () => open();
  }

  async function abandon() {
    const gm = WQ.game;
    WQ.game = null;
    if (gm && gm.sessionId) { try { await App.API.post('/api/session/abandon', { sessionId: gm.sessionId }); } catch (e) {} }
    App.toast('Left the challenge — nothing recorded', 'x');
    open();
  }

  /* ---------------- dashboard ---------------- */
  async function open() {
    if (App.world !== 'worldquest') App.enterWorld('worldquest');
    await load();
    const main = App.stage();
    const per = App.state.stats.perContinent;
    const countryMap = App.state.stats.countryMap || {};
    const masteredNames = Object.entries(countryMap).filter(([, v]) => v.correct >= 2).map(([k]) => k);
    const stats = App.state.stats.summary.wq;

    main.innerHTML = `<div class="stack">
      <div class="between"><div><div class="eyebrow">WorldQuest</div><h1 style="margin-top:4px">Learn the map</h1>
        <p class="lead" style="margin-top:6px">196 countries. Find them, name them, and learn their capitals and flags.</p></div>
        <div class="row" style="gap:8px">
          <span class="pill jade">${masteredNames.length} mastered</span>
          <span class="pill">${stats.identified} identified</span></div></div>

      <section class="wq-map" id="map" style="min-height:300px">
        ${mapSVG({ classes: (c) => {
          const st = countryMap[c.name];
          return st && st.correct >= 2 ? 'mastered' : st && st.asked ? 'seen' : '';
        } })}
        <div class="map-hud">Drag to move · scroll or + / − to zoom</div>
        <div class="map-tools">
          <button data-zoom="in" aria-label="Zoom in">+</button>
          <button data-zoom="out" aria-label="Zoom out">−</button>
          <button data-zoom="reset" aria-label="Reset view">⤢</button>
        </div>
      </section>

      <div class="giant" style="margin-top:4px">WHERE IN THE <em style="color:#4aa8ff">WORLD</em>?</div>
      <div class="tilegrid">
        ${WQ_ART.map((m) => ART.tile({
          art: m.art, name: m.name, sub: m.sub,
          label: m.art === 'challenge' ? '#ffd76a' : '#bfe0ff',
          action: `data-mode="${m.id}"`
        })).join('')}
      </div>

      <div class="playband" style="margin-top:20px">
        <div>
          <div class="giant" style="font-size:clamp(24px,3.6vw,38px)">${esc(WQ.continent === 'World' ? 'Whole world' : WQ.continent)}</div>
          <div class="meta" style="margin-top:8px">
            <span>Difficulty: <b>${esc(cap(WQ.difficulty))}</b></span>
            <span>Mastered: <b>${masteredNames.length}/196</b></span>
          </div>
        </div>
        <button class="btn jade" id="start" style="font-size:18px;padding:16px 28px">${icon('play')} PLAY</button>
      </div>

      <section class="card" style="margin-top:20px">
        <div class="between"><h2 style="font-size:20px;font-family:var(--display)">Choose your continent</h2>
          <span class="small muted">${masteredNames.length} of 196 mastered</span></div>
        <div class="cont-grid" style="margin-top:12px">
          ${CONTS.map((c) => {
            const v = per[c] || { total: 0, mastered: 0 };
            return `<button class="cont-card ${WQ.continent === c ? 'on' : ''}" data-cont="${esc(c)}"
              style="${WQ.continent === c ? 'border-color:var(--outline);box-shadow:0 5px 0 var(--outline)' : ''}">
              <b>${esc(c)}</b><span class="small muted">${v.mastered}/${v.total} mastered</span>
              <div class="bar"><i style="width:${v.total ? (v.mastered / v.total * 100).toFixed(0) : 0}%"></i></div></button>`;
          }).join('')}
          <button class="cont-card ${WQ.continent === 'World' ? 'on' : ''}" data-cont="World"
            style="${WQ.continent === 'World' ? 'border-color:var(--outline);box-shadow:0 5px 0 var(--outline)' : ''}">
            <b>All continents</b><span class="small muted">${masteredNames.length}/196 mastered</span>
            <div class="bar"><i style="width:${(masteredNames.length / 196 * 100).toFixed(0)}%"></i></div></button>
        </div>
      </section>

      <section class="grid g2">
        <div class="card">
          <div class="eyebrow">Difficulty</div>
          <div class="tilebar" style="margin:12px 0 0">
            ${[['beginner', 'BEGINNER'], ['intermediate', 'MEDIUM'], ['advanced', 'ADVANCED'], ['expert', 'EXPERT']].map(([v, t]) =>
              `<button class="tiletab ${WQ.difficulty === v ? 'on' : ''}" style="padding:10px 16px" data-diff="${v}">${t}</button>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="eyebrow">Your map</div>
          <div class="statline" style="margin-top:10px">
            <div><b>${stats.identified}</b><span>Identified</span></div>
            <div><b>${masteredNames.length}</b><span>Mastered</span></div>
            <div><b>${stats.capitals}</b><span>Capitals</span></div>
          </div>
          <div class="divider"></div>
          <p class="small muted">196 entries: the 193 UN members, Palestine, Vatican City and Taiwan.
            Territories are on the map but never asked.</p>
        </div>
      </section>
      <div class="row"><button class="btn jade" id="start">${icon('play')} Start ${esc(cap(WQ.mode))}</button>
        <span class="small muted" style="align-self:center">${WQ.continent} · ${esc(cap(WQ.difficulty))}</span></div>
    </div>`;

    const ctl = attachMap(main, {
      onPick: (name) => {
        const c = WQ.byName[name];
        if (c) { ctl.centreOn(c, 4); App.toast(`${name} — ${c.capital || 'no capital data'}`, 'map'); }
      }
    });
    main.querySelectorAll('[data-cont]').forEach((b) => { b.onclick = () => { WQ.continent = b.dataset.cont; open(); }; });
    main.querySelectorAll('[data-diff]').forEach((b) => { b.onclick = () => { WQ.difficulty = b.dataset.diff; open(); }; });
    main.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => { WQ.mode = b.dataset.mode; startGame(WQ.mode); }; });
    main.querySelector('#start').onclick = () => startGame(WQ.mode);
    App.onCleanup(() => {});
  }

  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'quit' && WQ.game) abandon();
  });

  window.WORLDQUEST = { open, startGame, get game() { return WQ.game; }, get data() { return WQ.world; } };
})();
