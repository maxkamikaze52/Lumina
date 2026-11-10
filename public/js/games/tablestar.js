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
    // the question is always decided one step ahead, so a small preview of the
    // *next* one can sit above and to the right of what you are answering
    let q = g.nextQ, guard = 0;
    while (!q || q.text === g.lastText) {
      if (guard++ > 8) break;
      q = makeQuestion(g.pool, g.ops);
    }
    g.q = q; g.lastText = q.text; g.typed = ''; g.busy = false; g.t0 = performance.now();
    let nq = makeQuestion(g.pool, g.ops), g2 = 0;
    while (nq.text === q.text && g2++ < 8) nq = makeQuestion(g.pool, g.ops);
    g.nextQ = nq;

    const el = main_el.querySelector('#ts-q');
    el.innerHTML = q.op === 'mul'
      ? `${q.a}<span class="op">×</span>${q.b}`
      : `${q.a}<span class="op">÷</span>${q.b}`;
    el.setAttribute('aria-label', `${q.text} equals`);
    const nxt = main_el.querySelector('#ts-next');
    if (nxt) {
      nxt.innerHTML = `<span class="lbl">next</span>` +
        (nq.op === 'mul' ? `${nq.a}<span class="op">×</span>${nq.b}`
                         : `${nq.a}<span class="op">÷</span>${nq.b}`);
    }
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

  /* One span per letter, so the paint can run out of the bottom of the glyphs.
     Which letters drip, and how far, is fixed per word — no reflow, no jitter. */
  function stampLetters(word) {
    const DRIP = [0, 1, 0, 2, 0, 0, 1, 0, 2, 0, 1, 0, 0, 2];
    const chars = word.toUpperCase().split('').map((ch, i) => {
      if (ch === ' ') return '<span class="gap"></span>';
      const d = DRIP[i % DRIP.length];
      const drip = d ? `<i class="drip d${d}" style="--dw:${d === 2 ? 0.22 : 0.34}"></i>` : '';
      return `<span class="ch" style="--i:${i}">${esc(ch)}${drip}</span>`;
    }).join('');
    return `<div class="stamp-text">${chars}</div>`;
  }

  function renderResults(session, correct, total, acc, mean, duration, reward, rejected) {
    const studio = session.mode === 'studio' ? App.state._studio : null;
    const missed = [...new Set(session.facts.filter((f) => !f.ok).map((f) => {
      const [kind, rest] = f.f.split(':');
      const [a, b] = rest.split('x');
      return kind === 'm' ? `${a} × ${b} = ${a * b}` : `${a * b} ÷ ${a} = ${b}`;
    }))].slice(0, 6);
    const rankName = studio && studio.class ? studio.class.name : null;
    main_el.innerHTML = `<div class="stack ts">
      ${rankName ? `<div class="stamp-wrap">
        <div class="stamp-glow"></div>
        <div class="stamp-rings"><span></span><span></span></div>
        <div class="stamp">
          ${stampLetters(rankName)}
          <div class="stamp-sub">your studio class</div>
        </div>
      </div>` : ''}
      <div class="res-stage">
        <div class="res-beams" aria-hidden="true"><i style="--r:-22deg"></i><i style="--r:8deg"></i><i style="--r:26deg"></i></div>
        <div class="res-floor" aria-hidden="true"></div>
        <div class="res-inner">
          <div class="res-eyebrow">${esc(label(session.mode))} · THAT'S A WRAP</div>
          <div class="res-score">${correct}</div>
          <div class="res-sub">correct in ${Math.round(duration)} seconds</div>
          <div class="res-stats">
            <div><b>${acc}%</b><span>accuracy</span></div>
            <div><b>${mean ? mean.toFixed(2) + 's' : '—'}</b><span>per correct</span></div>
            <div><b class="xp">+${num(reward.xp)}</b><span>XP</span></div>
            <div><b class="bits">+${num(reward.starbits)}</b><span class="with-coin">
              ${ART.starbit({ size: 15 })} Starbits</span></div>
          </div>
          <div class="res-pills">
            <span class="pill">best streak ${session.best}</span>
            <span class="pill">${esc(reward.class ? reward.class.name : '')}</span>
          </div>
        </div>
      </div>

      <div class="res-notes">
        ${studio ? `<div class="note">
          <div class="note-head">Studio speed rank</div>
          <b class="note-big">${esc(studio.class.name)}</b>
          <p>${studio.avg ? studio.avg + 's per correct answer over your last ten games.' : 'Answer some questions correctly to get on the speed board.'}</p>
          <span class="pill">${studio.runs}/10 games</span>
        </div>` : ''}
        ${session.mode === 'garage' && PLAN ? `<div class="note">
          <div class="note-head">Next up in the Garage</div>
          <b class="note-big">${esc(PLAN.cta)}</b>
          <p>${PLAN.targetTables && PLAN.targetTables.length ? 'Tables to learn: ' + PLAN.targetTables.join(' · ') : 'Every table and division is open.'}</p>
          ${PLAN.lastTest ? `<span class="pill">last gig ${Math.round(PLAN.lastTest.accuracy * 100)}%</span>` : ''}
        </div>` : ''}
        ${missed.length ? `<div class="note">
          <div class="note-head">Worth another look</div>
          <p class="note-facts">${missed.join(' &nbsp;·&nbsp; ')}</p>
        </div>` : ''}
        ${rejected ? `<div class="note bad">
          <div class="note-head">Run not recorded</div>
          <p>${esc(rejected)} — the server rejects runs faster than a human can read.</p>
        </div>` : ''}
      </div>

      <div class="res-actions">
        <button class="act act-again" id="again">${icon('play')} PLAY AGAIN</button>
        <button class="act act-back" id="home">${icon('arrow')} BACK</button>
      </div>
      ${reward.badges && reward.badges.length ? `<p class="res-badges">New badges: ${reward.badges.map((b) => esc(b.name)).join(', ')}</p>` : ''}
    </div>`;
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
      if (path && !path.ready) {
        App.toast(`Learn tables ${(path.targetTables || []).join(', ') || 'shown above'} first — ${path.secure}/${path.total} facts are secure.`, 'x');
        return;
      }
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
        typed: '', results: [], facts: [], ok: 0, streak: 0, best: 0, busy: false, t0: 0, iv: null,
        nextQ: null
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
          <div class="ts-next" id="ts-next" aria-hidden="true"></div>
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
    // the venue: a dark hall, a lit stage and a crowd with their hands up
    const host = document.getElementById('world');
    if (host && !host.querySelector('.venue')) {
      host.insertAdjacentHTML('afterbegin',
        `<div class="venue" aria-hidden="true">${ART.concert()}</div>`);
    }
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
        ${ART.tile({ art: 'mode:garage', name: 'GARAGE', sub: 'Gig, then learn what it exposes', label: '#ffe08a', action: 'data-tab="garage"' })}
        ${ART.tile({ art: 'mode:studio', name: 'STUDIO', sub: '12 × 12 · all divisions · ranked', label: '#e0c9ff', action: 'data-tab="studio"' })}
        ${ART.tile({ art: 'mode:sound', name: 'SOUNDCHECK', sub: '25 questions · 2–12 · warm-up', label: '#a8f0c8', action: 'data-tab="sound"' })}
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
        <span class="mi"><i class="mi-ic">${icon('grid')}</i>
          <em>Tables</em><b>${esc(opts.tables)}</b></span>
        <span class="mi"><i class="mi-ic">${icon('star')}</i>
          <em>Players</em><b>${esc(opts.items)}</b></span>
        <span class="mi"><i class="mi-ic">${icon('calendar')}</i>
          <em>Time</em><b>${opts.time}</b></span>
        <span class="mi coin"><i class="mi-ic gold">${ART.starbit({ size: 26 })}</i>
          <em>Starbits</em><b>${esc(opts.coin)}</b></span>
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

  /* The Studio Speed slider. Each rank gets its own row with a real minimum
     height so the names can never collide, and the seconds axis is positioned
     through the same piecewise map so ticks line up with the band edges. */
  function speedGauge(ranks, mine, d) {
    if (!ranks.length) return '<p class="small muted">Ranks are loading.</p>';
    const TOTAL = 660, MIN = 64;
    const weight = ranks.map((r) => Math.max(0.15, r.max - r.from));
    const wsum = weight.reduce((a, b) => a + b, 0);
    let hs = weight.map((w) => Math.max(MIN, (w / wsum) * TOTAL));
    const k = TOTAL / hs.reduce((a, b) => a + b, 0);
    hs = hs.map((h) => h * k);

    const top = [], acc = [];
    let run = 0;
    ranks.forEach((r, i) => { top.push(run); acc.push(run); run += hs[i]; });
    // seconds -> px, interpolating inside whichever rank band holds that second
    const pxFor = (s) => {
      for (let i = 0; i < ranks.length; i++) {
        const r = ranks[i];
        if (s <= r.max || i === ranks.length - 1) {
          const t = Math.max(0, Math.min(1, (s - r.from) / (r.max - r.from)));
          return top[i] + t * hs[i];
        }
      }
      return TOTAL;
    };

    const ticks = [0, 1, 2, 3, 4, 5, 6, 7].map((s) =>
      `<span class="tick" style="top:${pxFor(s).toFixed(1)}px">${s}s</span>`).join('');
    const bands = ranks.map((r, i) => {
      const on = r.id && r.id === mine.id;
      return `<div class="band ${on ? 'on' : ''}"
        style="height:${hs[i].toFixed(1)}px;--tone:${r.tone || '#4aa8ff'}">
        <span class="band-bar"></span>
        <span class="band-name">${esc(r.name)}</span>
        <span class="band-thresh">${r.max}s</span>
      </div>`;
    }).join('');
    const prev = (d.previous && d.previous.avg) || null;
    const knob = (s, cls, tag) => s == null ? '' :
      `<div class="slide-knob ${cls}" style="top:${pxFor(s).toFixed(1)}px"><i></i></div>
       <div class="slide-val ${cls}" style="top:${pxFor(s).toFixed(1)}px">
         <small>${tag}</small>${s}s</div>`;
    return `<div class="slider">
      <div class="slider-axis" style="height:${TOTAL}px">${ticks}</div>
      <div class="slider-track" style="height:${TOTAL}px">
        <span class="slider-rail"></span>
        <div class="slider-bands">${bands}</div>
        ${knob(d.avg, 'now', 'YOU')}${prev != null && prev !== d.avg ? knob(prev, 'prev', 'BEFORE') : ''}
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
      disabled: false,
      extra: `<div class="len-pick" role="group" aria-label="Length of the round">
        <span class="small">Length</span>
        ${[1, 2, 3].map((m) => `<button class="len ${GARAGE_MIN === m ? 'on' : ''}"
          data-len="${m}" aria-pressed="${GARAGE_MIN === m}">${m} min</button>`).join('')}
      </div>`
    })}
    <div class="studio-body one">
      <div class="garage-info">
        <div class="row" style="align-items:center;gap:18px;flex-wrap:wrap">
          <button class="btn-go" data-mode="garage">
            ${icon('play')} ${esc(p.ready ? p.cta : 'Learning round unfinished')}</button>
          <span class="pill ${p.mastered ? 'jade' : 'amber'}">${p.mastered ? 'Unlocked' : `Good gigs in a row ${p.goodStreak}/${p.goodNeeded}`}</span>
        </div>
        <p class="garage-why">${esc(p.detail)}</p>
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
