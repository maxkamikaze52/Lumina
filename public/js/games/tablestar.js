/* Astrolab — TableStar: multiplication + division, ENTER submission, Studio mode.
   Ported from the original Tablestar app (same three modes, same guitar idea),
   with division, a proper keypad and server-recorded sessions. */
(function () {
  'use strict';
  const App = window.App, ART = window.ART, icon = window.icon;
  const esc = App.esc, num = App.num;

  const ROUND = 60000;
  const TS = { tables: [2, 5, 10], ops: 'both', mode: 'studio' };
  let g = null;
  let PLAN = null;          // the Garage path + Studio ranks, from /api/tablestar/plan

  const opsFor = (ops) => (ops === 'mul' ? ['mul'] : ops === 'div' ? ['div'] : ['mul', 'div']);
  const ALL_TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  function makeQuestion(pool, ops) {
    const table = App.pick(pool);        // one of the chosen tables
    const other = 1 + App.rand(12);      // the other factor, 1-12
    const kind = App.pick(opsFor(ops));
    if (kind === 'mul') {
      // show the factors in a random order, but the fact key is canonical
      const pair = Math.random() < 0.5 ? [table, other] : [other, table];
      return {
        op: 'mul', a: pair[0], b: pair[1], answer: table * other,
        key: `m:${Math.min(table, other)}x${Math.max(table, other)}`,
        text: `${pair[0]} × ${pair[1]}`
      };
    }
    // division: dividend is always a product of two 1-12 facts (so 1-144),
    // divisor is always 1-12 and the answer is always a whole number 1-12
    const product = table * other;
    return {
      op: 'div', a: product, b: table, answer: other,
      key: `d:${Math.min(table, other)}x${Math.max(table, other)}`,
      text: `${product} ÷ ${table}`
    };
  }

  function keypad() {
    return `<div class="keypad" role="group" aria-label="Number pad">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => `<button data-key="${k}" aria-label="${k}">${k}</button>`).join('')}
      <button class="del" data-key="clear" aria-label="Clear answer">C</button>
      <button data-key="0" aria-label="0">0</button>
      <button data-key="del" aria-label="Delete last digit">⌫</button>
      <button class="enter" style="grid-column:span 3" data-key="enter">ENTER ⏎</button>
    </div>`;
  }

  function hud(mode, stage) {
    const what = mode === 'studio' ? 'Studio · every table and every division'
      : mode === 'garage' ? `Garage · ${stage === 'test' ? 'the gig' : stage === 'study' ? 'learning round' : 'free play'}`
      : 'Soundcheck · 2–12';
    return `<div class="ts-hud"><span>${esc(what)} · answer as many as you can</span>
      <span id="ts-score">Correct 0</span></div>`;
  }
  const label = (m) => (m === 'sound' ? 'Soundcheck' : m === 'studio' ? 'Studio' : 'Garage');

  function renderKeypad(main) {
    main.querySelectorAll('[data-key]').forEach((b) => {
      b.onclick = () => press(b.dataset.key);
    });
  }

  function paint(t) {
    if (!g) return;
    const ok = g.results.filter((r) => r === 'ok').length;
    main_el.querySelector('#ts-score').textContent = 'Correct ' + ok;
    main_el.querySelector('#ts-gtr').innerHTML = ART.guitar({ results: g.results, correct: ok });
    main_el.querySelector('#ts-streak').innerHTML = g.streak > 1 ? '🔥 ' + g.streak + ' in a row' : '&nbsp;';
  }
  let main_el = null;

  function press(k) {
    if (!g || g.busy) return;
    const box = main_el.querySelector('#ts-ans');
    if (k === 'del') g.typed = g.typed.slice(0, -1);
    else if (k === 'clear') g.typed = '';
    else if (k === 'enter') { submit(); return; }
    else if (/^[0-9]$/.test(k) && g.typed.length < 3) g.typed += k;
    box.textContent = g.typed;
    box.classList.toggle('blank', !g.typed);
  }

  function submit() {
    if (!g || g.busy || g.typed === '') return;
    const correct = Number(g.typed) === g.q.answer;
    g.busy = true;
    const ms = performance.now() - g.t0;
    const box = main_el.querySelector('#ts-ans');
    const fb = main_el.querySelector('#ts-feedback');
    box.classList.remove('ok', 'bad');
    box.classList.add(correct ? 'ok' : 'bad');
    if (!correct) fb.textContent = `Not quite — ${g.q.text} = ${g.q.answer}`;
    fb.className = 'ts-feedback ' + (correct ? 'ok' : 'bad');
    if (correct) fb.textContent = '✓';
    g.results.push(correct ? 'ok' : 'bad');
    g.facts.push({ f: g.q.key, ok: correct, ms: Math.round(ms) });
    if (correct) { g.ok++; g.streak++; g.best = Math.max(g.best, g.streak); }
    else g.streak = 0;
    paint();
    const delay = correct ? 230 : 900;
    setTimeout(() => {
      if (!g) return;
      nextQuestion();
    }, delay);
  }

  function nextQuestion() {
    if (!g) return;
    if (performance.now() >= g.endsAt) return finish();
    let q = makeQuestion(g.pool, g.ops), guard = 0;
    while (q.text === g.lastText && guard++ < 6) q = makeQuestion(g.pool, g.ops);
    g.q = q; g.lastText = q.text; g.typed = ''; g.busy = false; g.t0 = performance.now();
    const el = main_el.querySelector('#ts-q');
    el.innerHTML = q.op === 'mul'
      ? `${q.a}<span class="op">×</span>${q.b}`
      : `${q.a}<span class="op">÷</span>${q.b}`;
    el.setAttribute('aria-label', `${q.text} equals`);
    const box = main_el.querySelector('#ts-ans');
    box.textContent = ''; box.className = 'ts-ans blank';
    const fb = main_el.querySelector('#ts-feedback');
    fb.textContent = ''; fb.className = 'ts-feedback';
  }

  function tick() {
    if (!g) return;
    const left = Math.max(0, g.endsAt - performance.now());
    const tm = main_el.querySelector('#ts-clock');
    if (tm) { tm.textContent = (left / 1000).toFixed(1); tm.classList.toggle('low', left < 10000); }
    const bar = main_el.querySelector('#ts-bar');
    if (bar) bar.style.transform = `scaleX(${left / g.round})`;
    if (left <= 0) finish();
  }

  async function finish() {
    if (!g || g.done) return;
    g.done = true;
    clearInterval(g.iv);
    const session = g;
    g = null;
    const total = session.facts.length;
    const correct = session.ok;
    const acc = total ? Math.round((correct / total) * 100) : 0;
    const duration = Math.min(session.round, performance.now() - session.startedAt) / 1000;
    const mean = correct ? session.facts.filter((f) => f.ok).reduce((s, f) => s + f.ms, 0) / correct / 1000 : null;

    let reward = { xp: 0, starbits: 0, badges: [], class: App.state.stats.class };
    let rejected = null;
    try {
      reward = await App.API.post('/api/session/complete', {
        sessionId: session.sessionId, tag: session.tag, completed: true,
        correct, total, score: correct, duration,
        stage: session.stage || null,
        meta: { mode: session.mode, stage: session.stage || null, tables: session.pool,
                ops: session.ops, bestStreak: session.best },
        details: { facts: session.facts }
      });
      await App.reload();
    } catch (e) {
      rejected = e.message;
      App.toast(e.message, 'x');
    }
    if (reward.path) PLAN = Object.assign(PLAN || {}, reward.path);
    if (session.mode === 'studio' || session.mode === 'garage') {
      try { PLAN = await App.API.get('/api/tablestar/plan'); } catch (e) {}
      try { App.state._studio = await App.API.get('/api/studio'); } catch (e) {}
    }
    renderResults(session, correct, total, acc, mean, duration, reward, rejected);
  }

  function renderResults(session, correct, total, acc, mean, duration, reward, rejected) {
    const studio = session.mode === 'studio' ? App.state._studio : null;
    main_el.innerHTML = `<div class="stack ts">
      <div class="results">
        <div class="res-hero">
          <div class="eyebrow">${label(session.mode)} complete</div>
          <b>${correct}</b>
          <p class="muted">correct in ${Math.round(duration)} seconds</p>
          <div class="res-grid">
            <div><b>${acc}%</b><span>accuracy</span></div>
            <div><b>${mean ? mean.toFixed(2) + 's' : '—'}</b><span>per correct</span></div>
            <div><b style="color:var(--jade)">+${num(reward.xp)}</b><span>XP</span></div>
            <div><b style="color:var(--amber)">+${num(reward.starbits)}</b><span>Starbits</span></div>
          </div>
          <div class="row" style="justify-content:center;margin-top:14px">
            <span class="pill">🔥 best streak ${session.best}</span>
            <span class="pill jade">${esc(reward.class ? reward.class.name : '')}</span>
          </div>
        </div>
        ${studio ? `<div class="card flat">
          <div class="between"><div><div class="eyebrow">Studio speed rank</div>
            <h3 style="margin-top:4px">${esc(studio.class.name)}</h3></div>
            <span class="pill amber">${studio.runs}/10 runs${studio.remaining ? ' · ' + studio.remaining + ' to go' : ''}</span></div>
          <p class="small muted" style="margin-top:8px">${studio.avg ? 'Average ' + studio.avg + 's per correct answer over your last 10 runs.' : 'Answer some questions correctly to get on the bill.'}</p>
        </div>` : ''}
        ${session.mode === 'garage' && PLAN ? `<div class="card flat">
          <div class="eyebrow">Garage · what happens next</div>
          <h3 style="margin-top:4px">${esc(PLAN.cta)}</h3>
          <p class="small muted" style="margin-top:6px">${esc(PLAN.detail)}</p>
          ${PLAN.targetTables && PLAN.targetTables.length ? `<p class="small" style="margin-top:8px">Tables to study: <b>${PLAN.targetTables.join(', ')}</b></p>` : ''}
          ${PLAN.lastTest ? `<p class="small" style="margin-top:8px">Last test: <b>${Math.round(PLAN.lastTest.accuracy * 100)}%</b>
            at ${PLAN.lastTest.perAnswer}s per answer · good ${PLAN.goodStreak}/${PLAN.goodNeeded} in a row${PLAN.lastTest.excellent ? ' · excellent' : ''}</p>` : ''}
        </div>` : ''}
        ${rejected ? `<div class="card flat" style="border-color:rgba(255,111,145,.4)">
          <div class="eyebrow">Run not recorded</div>
          <p class="small" style="margin-top:6px">${esc(rejected)}</p>
          <p class="small muted" style="margin-top:6px">The server rejects runs faster than a human can
            read a question, so the speed ranking stays honest.</p></div>` : ''}
        ${session.facts.some((f) => !f.ok) ? `<div class="card flat"><div class="eyebrow">Worth another look</div>
          <p class="small" style="margin-top:8px">${[...new Set(session.facts.filter((f) => !f.ok).map((f) => {
            const [kind, rest] = f.f.split(':');
            const [a, b] = rest.split('x');
            return kind === 'm' ? `${a} × ${b} = ${a * b}` : `${a * b} ÷ ${a} = ${b}`;
          }))].slice(0, 8).join(' · ')}</p></div>` : ''}
        <div class="row"><button class="btn jade" id="again">${icon('play')} Play again</button>
          <button class="btn ghost" id="home">Back</button></div>
        ${reward.badges && reward.badges.length ? '<p class="small">New badges: ' + reward.badges.map((b) => esc(b.name)).join(', ') + '</p>' : ''}
      </div></div>`;
    if (reward.badges && reward.badges.length) App.celebrate(reward.badges);
    main_el.querySelector('#again').onclick = () => start(session.mode);
    main_el.querySelector('#home').onclick = () => showMenu();
  }

  /* ------------------------------------------------------------ setup --- */
  /* STUDIO is always the full deck: every table 1-12, × and ÷, 60 seconds,
     speed only.  GARAGE is the learning path: a gig, then learning rounds. */
  async function start(mode) {
    try {
      const path = mode === 'garage' ? (PLAN || await App.API.get('/api/tablestar/plan')) : null;
      if (path) PLAN = path;
      const stage = mode === 'garage' ? (path.mode || 'test') : null;
      if (path && !path.ready) { App.toast('Finish the learning round first — then the next gig opens.', 'x'); return; }
      const r = await App.API.post('/api/session/start',
        { game: 'tablestar', mode, difficulty: stage || mode,
          meta: { stage, tables: mode === 'studio' ? ALL_TABLES : (path ? path.targetTables : TS.tables),
                  ops: mode === 'studio' ? 'both' : (path ? path.ops : TS.ops) } });
      const pool = mode === 'studio' || (path && path.mastered) ? ALL_TABLES
        : mode === 'sound' ? [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        : (path && path.targetTables && path.targetTables.length ? path.targetTables.slice() : TS.tables.slice());
      const ops = mode === 'studio' || (path && path.mastered) ? 'both'
        : mode === 'sound' ? 'both' : (path ? path.ops : TS.ops);
      const round = mode === 'garage' ? GARAGE_MIN * 60000 : ROUND;
      g = {
        mode, stage, pool: pool.length ? pool : [2], ops, round, sessionId: r.sessionId,
        tag: 'ts-' + r.sessionId, startedAt: performance.now(), endsAt: performance.now() + round,
        typed: '', results: [], facts: [], ok: 0, streak: 0, best: 0, busy: false, t0: 0, iv: null
      };
      drawGame();
    } catch (e) { App.toast(e.message, 'x'); }
  }

  function drawGame() {
    main_el.innerHTML = `<div class="stack ts">
      <div class="ts-stage">
        <div class="ts-play">
          ${hud(g.mode, g.stage)}
          <div class="between" style="margin-bottom:6px">
            <span class="ts-clock" id="ts-clock">${Math.round(g.round / 1000)}.0</span>
            <span class="small muted" id="ts-streak">&nbsp;</span>
          </div>
          <div class="ts-timer"><i id="ts-bar"></i></div>
          <div class="ts-q" id="ts-q">&nbsp;</div>
          <div class="ts-ans blank" id="ts-ans" aria-live="polite"></div>
          <div class="ts-feedback" id="ts-feedback"></div>
          ${keypad()}
          <p class="small muted center" style="margin-top:10px">Type with the keyboard or tap the pad.
            ENTER submits — nothing is sent until you press it.</p>
        </div>
        <div class="ts-guitar"><div id="ts-gtr">${ART.guitar({})}</div>
          <div class="small muted">progress</div></div>
      </div>
      <div class="between"><button class="btn ghost sm" id="quit">Leave</button>
        <span class="small muted">Leaving before the timer ends abandons the run — no XP, no rank.</span></div>
    </div>`;
    renderKeypad(main_el);
    main_el.querySelector('#quit').onclick = () => abandon();
    nextQuestion();
    paint();
    g.iv = setInterval(tick, 100);
    tick();
  }

  async function abandon() {
    if (!g) return;
    const id = g.sessionId;
    g.done = true; clearInterval(g.iv); g = null;
    try { await App.API.post('/api/session/abandon', { sessionId: id }); } catch (e) {}
    App.toast('Run abandoned — nothing recorded', 'x');
    App.leaveWorld();
  }

  function onKey(e) {
    if (!g) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (/^[0-9]$/.test(e.key)) { e.preventDefault(); press(e.key); }
    else if (e.key === 'Backspace') { e.preventDefault(); press('del'); }
    else if (e.key === 'Delete' || e.key === 'Escape') { press('clear'); }
    else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); press('enter'); }
  }

  /* ------------------------------------------------------------- menu --- */
  /* Called by App.playGame: take over the screen with TableStar's world. */
  App.openGame = async function (game) { App.playGame(game); };

  function open() {
    App.enterWorld('tablestar');
    showMenu();
  }

  /* Clicking a card SELECTS that section and the section's own panel opens
     below it — nothing launches until you press PLAY inside the panel. */
  let TS_TAB = 'garage';
  let GARAGE_MIN = 3;      // how long a Garage round is: 1, 2 or 3 minutes

  function showMenu() {
    const main = App.stage();
    main.innerHTML = `<div class="stack ts">
      <div class="world-title">
        <span class="badge-pill">Maths at speed</span>
        <span class="small muted">The Garage decides what you practise next</span>
      </div>
      <div class="giant">YOUR <em>GIG</em></div>

      <div class="tilegrid" id="ts-cards">
        ${ART.tile({ art: 'garage', name: 'GARAGE', sub: 'Gig, then learn what it exposes', label: '#ffe08a', action: 'data-tab="garage"' })}
        ${ART.tile({ art: 'studio', name: 'STUDIO', sub: '12 × 12 · all divisions · ranked', label: '#b9a6ff', action: 'data-tab="studio"' })}
        ${ART.tile({ art: 'speed', name: 'SOUNDCHECK', sub: '25 questions · 2–12', label: '#a8f0c8', action: 'data-tab="sound"' })}
      </div>

      <div id="ts-tab"></div>
    </div>`;
    main_el = main;
    main.querySelectorAll('#ts-cards [data-tab]').forEach((b) => {
      b.onclick = () => { TS_TAB = b.dataset.tab; showMenu(); };
    });
    showTab(TS_TAB, main);
  }

  function showTab(tab, main) {
    main.querySelectorAll('#ts-cards [data-tab]').forEach((b) => {
      const on = b.dataset.tab === tab;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
    });
    const host = main.querySelector('#ts-tab');
    host.innerHTML = '<div class="card flat muted">Loading…</div>';
    if (tab === 'garage') garageTab(host);
    else if (tab === 'studio') studioTab(host);
    else soundTab(host);
  }


  /* The purple header every mode wears: name, PLAY, and what the mode is. */
  function modeBand(opts) {
    return `<div class="studio-band">
      <div class="studio-band-top">
        <h2 class="studio-title">${esc(opts.name)}</h2>
        <button class="play-big" data-mode="${opts.mode}" ${opts.disabled ? 'disabled' : ''}>
          ${icon('play')} PLAY</button>
      </div>
      <div class="studio-meta">
        <span>${icon('grid')} <b>Tables:</b> ${esc(opts.tables)}</span>
        <span>${icon('bolt')} <b>${esc(opts.items)}</b></span>
        <span>${icon('play')} ${opts.time}</span>
        <span class="coin">${opts.coin}</span>
      </div>
      ${opts.extra || ''}
    </div>`;
  }

  /* --------------------------------------------------- STUDIO section --- */
  /* The ranks exactly as the Studio's own scale: seconds down the left, the
     fastest rank at the top, your average marked, and the games you played. */
  async function studioTab(host) {
    let d = {}, plan = PLAN;
    try { d = await App.API.get('/api/studio'); } catch (e) {}
    if (!plan) { try { plan = PLAN = await App.API.get('/api/tablestar/plan'); } catch (e) {} }
    const ranks = (plan && plan.ranks) || [];
    const mine = d.class || {};
    const recent = (d.history || []).slice(0, 10);
    const secs = recent.reduce((a, r) => a + (r.duration || 0), 0);
    const right = recent.reduce((a, r) => a + (r.correct || 0), 0);
    const qpm = secs ? Math.round((right / secs) * 60) : null;

    host.innerHTML = `<div class="studio-panel">
      ${modeBand({ name: 'STUDIO', mode: 'studio', tables: 'all tables × and ÷',
        items: '1 player', time: '60 seconds', coin: '1 per correct answer' })}

      <div class="studio-body">
        <div class="studio-speed">
          <div class="block-head">${icon('bolt')} STUDIO SPEED</div>
          ${speedGauge(ranks, mine, d)}
        </div>

        <div class="studio-games">
          <h3 class="strip-title">10 MOST RECENT STUDIO GAMES</h3>
          ${recent.length ? `<table class="recent-games">
            <thead><tr><th>WHEN</th><th>SCORE</th></tr></thead><tbody>
              ${recent.map((r) => `<tr><td>${esc(ago(r.at))}</td><td class="num">${r.correct}</td></tr>`).join('')}
            </tbody></table>` : '<div class="empty-row">No games yet</div>'}
          <div class="recent-stats">
            <div class="stat-plain"><span>Average score (q/min)</span><b>${qpm != null ? qpm : '—'}</b></div>
            <div class="stat-bar"><span>Studio speed (sec/question)</span><b>${d.avg ? d.avg : '—'}</b></div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:16px">
        <h3 class="strip-title">Everyone's average</h3>
        <table class="lb"><thead><tr><th>#</th><th>Player</th><th>Avg</th><th class="hide-sm">Rank</th></tr></thead><tbody>
          ${d.board && d.board.length ? d.board.slice(0, 10).map((r) => `<tr class="${r.id === App.state.player.id ? 'me' : ''}">
            <td class="rank">${r.rank}</td>
            <td><div class="who"><span class="face">${ART.avatar(r.character, { background: false })}</span>${esc(r.name)}</div></td>
            <td class="num">${r.avg}s</td><td class="hide-sm">${esc(r.class)}</td></tr>`).join('')
            : '<tr><td colspan="4" class="small muted" style="padding:16px">Nobody has a Studio game in yet. Yours could be the first.</td></tr>'}
        </tbody></table>
      </div>
    </div>`;
    host.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => start(b.dataset.mode); });
  }

  /* The Studio Speed gauge: seconds down the middle, the rank names against it,
     the band you are in lit up, and two markers — this average and the one before. */
  function speedGauge(ranks, mine, d) {
    if (!ranks.length) return '<p class="small muted">Ranks are loading.</p>';
    const TOP = 0, BOTTOM = 7;
    const pct = (s) => Math.max(0, Math.min(100, (s - TOP) / (BOTTOM - TOP) * 100));
    const ticks = [0, 1, 2, 3, 4, 5, 6, 7].map((s) =>
      `<span class="tick" style="top:${pct(s)}%">${s}s</span>`).join('');
    const bands = ranks.map((r) => {
      const on = r.id && r.id === mine.id;
      const h = pct(r.max) - pct(r.from);
      return `<div class="band ${on ? 'on' : ''}"
        style="--h:${h.toFixed(2)}%;--tone:${r.tone || '#4aa8ff'}">
        <span class="band-thresh">${r.max}s</span>
        <span class="band-name">${esc(r.name)}</span>
      </div>`;
    }).join('');
    const prev = (d.previous && d.previous.avg) || null;
    const knob = (s, cls) => s == null ? '' :
      `<div class="slide-knob ${cls}" style="top:${pct(s)}%"><i></i></div>`;
    return `<div class="slider">
      <div class="slider-axis">${ticks}</div>
      <div class="slider-track">
        <span class="slider-rail"></span>
        <div class="slider-bands">${bands}</div>
        ${knob(d.avg, 'now')}${prev != null && prev !== d.avg ? knob(prev, 'prev') : ''}
      </div>
    </div>
    <div class="slider-foot">
      ${d.avg ? `You are at <b>${d.avg}s</b>` : 'Play a game to get a marker'}
      ${mine.toNext != null && mine.next ? ` · <b>${mine.toNext}s</b> to ${esc(mine.next.name)}` : ''}
    </div>`;
  }

  function ago(ts) {
    if (!ts) return '—';
    const s = Math.max(0, Date.now() / 1000 - ts);
    if (s < 90) return 'just now';
    if (s < 3600) return Math.round(s / 60) + ' min ago';
    if (s < 86400) return Math.round(s / 3600) + ' hours ago';
    if (s < 86400 * 30) return Math.round(s / 86400) + ' days ago';
    return Math.round(s / (86400 * 30)) + ' months ago';
  }

  function when(ts) {
    if (!ts) return '—';
    const d = new Date(ts * 1000);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' +
           d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  /* ---------------------------------------------------- GARAGE section --- */
  /* Learn side: the forced path, then the full board of every multiplication
     and every division as a heat map — red is bad, green is good, grey is not
     tried yet, exactly like a times-tables grid. */
  async function garageTab(host) {
    let p = PLAN;
    if (!p) { try { p = PLAN = await App.API.get('/api/tablestar/plan'); } catch (e) {} }
    if (!p) { host.innerHTML = '<div class="card flat muted">The Garage path could not be loaded.</div>'; return; }
    const steps = [
      { t: 'The gig', d: 'Every table at once, to find your level.' },
      { t: 'Learn what it exposes', d: 'Only the tables you struggled on.' },
      { t: 'Another gig, then free play', d: 'All tables and divisions once you are secure.' }
    ];
    const order = p.stage === 'mastered' ? 2 : p.stage === 'study' ? 1 : 0;
    const gig = p.stage !== 'study';
    host.innerHTML = `${modeBand({
      name: 'GARAGE', mode: 'garage',
      tables: gig ? 'all tables' : (p.targetTables.length ? p.targetTables.join(', ') : 'all tables'),
      items: '1 player', time: `${GARAGE_MIN}m`, coin: '1 per correct answer',
      disabled: !p.ready,
      extra: `<div class="len-pick" role="group" aria-label="Length of the round">
        <span class="small">Length</span>
        ${[1, 2, 3].map((m) => `<button class="len ${GARAGE_MIN === m ? 'on' : ''}"
          data-len="${m}" aria-pressed="${GARAGE_MIN === m}">${m} min</button>`).join('')}
      </div>`
    })}
    <div class="studio-body one">
      <div class="garage-info">
        <div class="between">
          <div><div class="eyebrow">Next up</div>
            <h2 style="margin-top:4px">${esc(p.cta)}</h2></div>
          <span class="pill ${p.mastered ? 'jade' : 'amber'}">${p.mastered ? 'Unlocked' : `Good gigs in a row ${p.goodStreak}/${p.goodNeeded}`}</span>
        </div>
        <div class="steps">${steps.map((s, i) => `<div class="step ${i === order ? 'on' : ''} ${i < order ? 'done' : ''}">
          <b>${i + 1}</b><span>${esc(s.t)}</span></div>`).join('')}</div>
        <div class="bar-line">
          <span>${p.secure}/${p.total} facts secure</span>
          ${p.lastTest ? `<span>Last gig: <b>${Math.round(p.lastTest.accuracy * 100)}%</b> at ${p.lastTest.perAnswer}s</span>` : ''}
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="between"><div><div class="eyebrow">Times tables</div>
        <h3 style="margin-top:2px">Every multiplication</h3></div>
        ${heatKey()}</div>
      <div class="heatmap">${heatGrid(p.mulHeat, '×')}</div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="between"><div><div class="eyebrow">Divisions</div>
        <h3 style="margin-top:2px">Every division</h3></div>
        ${heatKey()}</div>
      <div class="heatmap">${heatGrid(p.divHeat, '÷')}</div>
    </div>`;
    host.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => start(b.dataset.mode); });
    host.querySelectorAll('[data-len]').forEach((b) => {
      b.onclick = () => { GARAGE_MIN = Number(b.dataset.len); garageTab(host); };
    });
  }

  function heatKey() {
    return `<div class="heat-key small muted"><span class="sw red"></span>struggling
      <span class="sw amber"></span>getting there
      <span class="sw green"></span>secure
      <span class="sw grey"></span>not tried</div>`;
  }

  /* one cell per fact, coloured by how it has actually gone */
  function heatGrid(cells, op) {
    if (!cells || !cells.length) return '<p class="small muted">No data yet.</p>';
    const head = `<div class="heat-row heat-head"><span class="heat-lab"></span>
      ${[...Array(12)].map((_, i) => `<span class="heat-col">${i + 1}</span>`).join('')}</div>`;
    let body = '';
    for (let a = 1; a <= 12; a++) {
      body += `<div class="heat-row"><span class="heat-lab">${a}${op}</span>`;
      for (let b = 1; b <= 12; b++) {
        const c = cells.find((x) => x.a === a && x.b === b) || {};
        const cls = c.secure ? 'green' : c.seen === 0 ? 'grey'
          : (c.acc == null ? 'grey' : c.acc >= 0.8 ? 'amber' : 'red');
        const label = `${a} ${op === '×' ? 'times' : 'divided by'} ${b}: ` +
          (c.seen ? `${Math.round((c.acc || 0) * 100)}% right in ${c.seen} go${c.seen === 1 ? '' : 'es'}` : 'not tried yet');
        body += `<span class="heat-cell ${cls}" title="${esc(label)}">${op === '×' ? a * b : a * b}</span>`;
      }
      body += '</div>';
    }
    return head + body;
  }

  /* ------------------------------------------------- SOUNDCHECK section --- */
  function soundTab(host) {
    const s = App.state.stats.summary;
    host.innerHTML = `${modeBand({ name: 'SOUNDCHECK', mode: 'sound', tables: '2 to 12 × and ÷',
      items: '1 player', time: '60 seconds', coin: '1 per correct answer' })}
    <div class="studio-body one">
      <div class="garage-info">
        <div class="statline">
          <div><b>${s.ts.runs}</b><span>Games played</span></div>
          <div><b>${s.ts.mult}</b><span>× correct</span></div>
          <div><b>${s.ts.div}</b><span>÷ correct</span></div>
        </div>
      </div>
    </div>`;
    host.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => start(b.dataset.mode); });
  }

  document.addEventListener('keydown', onKey);
  window.TABLESTAR = { open, showMenu, start, get session() { return g; } };
})();
