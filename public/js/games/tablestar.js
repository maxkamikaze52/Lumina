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
      : mode === 'garage' ? `Garage · ${stage === 'test' ? '3-minute test' : stage === 'study' ? 'study round' : 'full deck'}`
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
     speed only.  GARAGE is the learning path: 3-minute tests and study rounds. */
  async function start(mode) {
    try {
      const path = mode === 'garage' ? (PLAN || await App.API.get('/api/tablestar/plan')) : null;
      if (path) PLAN = path;
      const stage = mode === 'garage' ? (path.mode || 'test') : null;
      if (path && !path.ready) { App.toast('Finish the study round first — then the test comes back.', 'x'); return; }
      const r = await App.API.post('/api/session/start',
        { game: 'tablestar', mode, difficulty: stage || mode,
          meta: { stage, tables: mode === 'studio' ? ALL_TABLES : (path ? path.targetTables : TS.tables),
                  ops: mode === 'studio' ? 'both' : (path ? path.ops : TS.ops) } });
      const pool = mode === 'studio' || (path && path.mastered) ? ALL_TABLES
        : mode === 'sound' ? [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        : (path && path.targetTables && path.targetTables.length ? path.targetTables.slice() : TS.tables.slice());
      const ops = mode === 'studio' || (path && path.mastered) ? 'both'
        : mode === 'sound' ? 'both' : (path ? path.ops : TS.ops);
      const round = mode === 'garage' ? (path.seconds || 60) * 1000 : ROUND;
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
  /* Play from the library: take over the screen with TableStar's own world. */
  App.openGame = async function (game) {
    App.playGame(game);
  };

  function open() {
    App.enterWorld('tablestar');
    showMenu();
  }
  function showMenu() {
    const main = App.stage();
    const s = App.state.stats.summary;
    main.innerHTML = `<div class="stack ts">
      <div class="world-title">
        <span class="badge-pill">Maths at speed</span>
        <span class="small muted">Garage: learn · Studio: 60 s, all tables and all divisions</span>
      </div>
      <div class="giant">PICK A <em>STAGE</em></div>
      <div class="tilebar">
        <button class="tiletab on" data-tab="play">${icon('play')} Single player</button>
        <button class="tiletab" data-tab="speed">${icon('bolt')} Speed ranks</button>
      </div>
      <div id="ts-panel">
        <div id="ts-plan"><div class="card flat muted">Reading your Garage path…</div></div>
        <div class="tilegrid" style="margin-top:20px">
          ${ART.tile({ art: 'studio', name: 'STUDIO', sub: 'All tables × and ÷ · ranked', label: '#ffb36b', action: 'data-mode="studio"' })}
          ${ART.tile({ art: 'garage', name: 'GARAGE', sub: 'Test, then study what bites', label: '#ffe08a', action: 'data-mode="garage"' })}
          ${ART.tile({ art: 'speed', name: 'SOUNDCHECK', sub: '25 questions · 2–12', label: '#a8f0c8', action: 'data-mode="sound"' })}
          ${ART.tile({ art: 'gig', name: 'GIG', sub: 'All tables · mix of × and ÷', label: '#c9b6ff', action: 'data-mode="sound"' })}
        </div>

        <div class="playband" style="margin-top:20px">
          <div>
            <div class="giant" style="font-size:clamp(26px,4vw,42px)">STUDIO</div>
            <div class="meta" style="margin-top:8px">
              <span>Tables: <b>All tables</b></span>
              <span>Mode: <b>× and ÷</b></span>
              <span><b>1 XP per correct answer</b></span>
            </div>
          </div>
          <button class="btn jade" data-mode="studio" style="font-size:18px;padding:16px 28px">${icon('play')} PLAY</button>
        </div>

        <section class="grid g2" style="margin-top:20px">
          <div class="card">
            <div class="eyebrow">Your numbers</div>
            <div class="statline" style="margin-top:10px">
              <div><b>${s.ts.runs}</b><span>Games</span></div>
              <div><b>${s.ts.mult}</b><span>× correct</span></div>
              <div><b>${s.ts.div}</b><span>÷ correct</span></div>
            </div>
            <div class="divider"></div>
            <div class="between"><span class="small muted">Speed rank</span>
              <b class="pill amber">${esc(s.ts.studio.name)}</b></div>
            <p class="small muted" style="margin-top:8px">${s.ts.avg ? s.ts.avg.toFixed(2) + 's per correct answer, averaged over your last ten Studio games.' : 'Finish a Studio game to get on the bill.'}</p>
            <button class="btn ghost sm block" style="margin-top:12px" data-tab="speed">See the speed ranks</button>
          </div>
          <div class="card">
            <div class="eyebrow">How it works</div>
            <p class="small" style="margin-top:8px"><b>Garage</b> — where you learn. A 3-minute test over every table,
              then study of the tables it found weak, then the test again. Not optional.</p>
            <p class="small muted" style="margin-top:6px">Three good tests in a row and every table and division
              is unlocked for good.</p>
            <p class="small" style="margin-top:10px"><b>Studio</b> — where you race. Always all the times
              tables and all the divisions; your rank is your average seconds per answer.</p>
          </div>
        </section>
      </div>
      <div id="ts-speed" hidden></div>
    </div>`;
    main_el = main;
    main.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => start(b.dataset.mode); });
    loadPlan();
    main.querySelectorAll('.tilebar [data-tab]').forEach((b) => {
      b.onclick = async () => {
        main.querySelectorAll('.tilebar [data-tab]').forEach((x) => x.classList.toggle('on', x === b));
        const isSpeed = b.dataset.tab === 'speed';
        main.querySelector('#ts-panel').hidden = isSpeed;
        const host = main.querySelector('#ts-speed');
        host.hidden = !isSpeed;
        if (isSpeed) {
          host.innerHTML = '<div class="card flat muted">Loading the ranks…</div>';
          const d = await App.API.get('/api/studio');
          if (!PLAN) { try { PLAN = await App.API.get('/api/tablestar/plan'); } catch (e) {} }
          host.innerHTML = rankLadder(d, PLAN);
          host.querySelectorAll('[data-mode]').forEach((x) => { x.onclick = () => start(x.dataset.mode); });
        }
      };
    });
  }

  /* ------------------------------------------------------ rank ladder --- */
  /* Studio Speed, drawn the way the Studio does it: the seconds run down the
     left, the ranks from fastest at the top to slowest at the bottom, and your
     own average marked on the scale.  Each rank is the badge you earn. */
  function rankLadder(d, plan) {
    const ranks = (plan && plan.ranks) || [
      { name: 'Rock Hero', max: 1.5 }, { name: 'Rock Legend', max: 2 },
      { name: 'Rock Star', max: 2.6 }, { name: 'Headliner', max: 3.4 },
      { name: 'Support Act', max: 4.5 }, { name: 'Breakthrough Artist', max: 6 },
      { name: 'Unsigned Act', max: 9 }];
    const mine = d.class || {};
    const rows = ranks.map((r) => `<div class="rank-row ${r.id && r.id === mine.id ? 'on' : ''}">
        <span class="rank-sec">${r.max}s</span>
        <span class="rank-badge">${icon(r.icon || 'bolt')}</span>
        <span class="rank-name">${esc(r.name)}</span>
        ${r.id && r.id === mine.id && d.avg ? `<span class="rank-you">${d.avg}s</span>` : ''}
      </div>`).join('');
    return `<div class="card rank-card">
      <div class="between">
        <div><div class="eyebrow">Studio speed</div>
          <div class="giant" style="font-size:clamp(24px,3.4vw,36px)">${esc(mine.name || 'Unranked')}</div></div>
        <span class="pill amber">${d.runs}/10 games${d.remaining ? ` · ${d.remaining} to go` : ''}</span>
      </div>
      <p class="small muted" style="margin-top:8px">${d.avg ? `Your average is <b>${d.avg}s</b> per correct answer — the average of your last ten Studio games.` : 'Finish a Studio game with correct answers in it.'}
        ${mine.toNext != null && mine.next ? ` Shave <b>${mine.toNext}s</b> per answer to reach ${esc(mine.next.name)}.` : ''}</p>
      <div class="rank-ladder">${rows}</div>
      <p class="small muted" style="margin-top:10px">Each rank is a badge: reach it and it lands in your collection.</p>
      <div class="row" style="margin-top:12px"><button class="btn jade" data-mode="studio">${icon('play')} Play Studio</button>
        <button class="btn ghost" data-mode="garage">${icon('play')} Go to the Garage</button></div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="eyebrow">Everyone's average</div>
      <table class="lb"><thead><tr><th>#</th><th>Player</th><th>Avg</th><th class="hide-sm">Rank</th></tr></thead><tbody>
        ${d.board.length ? d.board.slice(0, 10).map((r) => `<tr class="${r.id === App.state.player.id ? 'me' : ''}">
          <td class="rank">${r.rank}</td>
          <td><div class="who"><span class="face">${ART.avatar(r.character, { background: false })}</span>${esc(r.name)}</div></td>
          <td class="num">${r.avg}s</td><td class="hide-sm">${esc(r.class)}</td></tr>`).join('')
          : '<tr><td colspan="4" class="small muted" style="padding:16px">Nobody has a Studio game in yet. Yours could be the first.</td></tr>'}
      </tbody></table>
    </div>`;
  }

  /* ----------------------------------------------- the Garage path UI --- */
  async function loadPlan() {
    const host = main_el && main_el.querySelector('#ts-plan');
    if (!host) return;
    try { PLAN = await App.API.get('/api/tablestar/plan'); } catch (e) { return; }
    const p = PLAN;
    const steps = [
      { t: '3-minute test', d: 'Every table, 1-12, all at once.' },
      { t: 'Study the weak tables', d: 'Until those facts are secure.' },
      { t: 'All tables + all divisions', d: 'Earned with three good tests in a row.' }
    ];
    const order = p.stage === 'mastered' ? 2 : p.stage === 'study' ? 1 : 0;
    const grid = p.tableGrid.map((t) => {
      const hot = (p.targetTables || []).includes(t.table);
      const weak = t.accuracy == null || t.accuracy < 0.7;
      return `<span class="tt ${hot ? 'hot' : ''} ${weak ? 'weak' : ''}" title="table ${t.table}">${t.table}</span>`;
    }).join('');
    host.innerHTML = `<div class="card garage-card">
      <div class="between">
        <div><div class="eyebrow">Garage · the learning path</div>
          <h3 style="margin-top:4px">${esc(p.cta)}</h3></div>
        <span class="pill ${p.mastered ? 'jade' : 'amber'}">${p.mastered ? 'Unlocked' : `Good tests in a row ${p.goodStreak}/${p.goodNeeded}`}</span>
      </div>
      <p class="small muted" style="margin-top:8px">${esc(p.detail)}</p>
      <div class="steps">${steps.map((s, i) => `<div class="step ${i === order ? 'on' : ''} ${i < order ? 'done' : ''}">
        <b>${i + 1}</b><span>${esc(s.t)}</span></div>`).join('')}</div>
      <div class="between" style="margin-top:16px">
        <div class="small muted">Tables to study</div>
        <div class="small muted">${p.secure}/${p.total} facts secure</div>
      </div>
      <div class="ttgrid">${grid}</div>
      <div class="row" style="margin-top:14px">
        <button class="btn ${p.ready ? 'jade' : 'ghost'}" data-mode="garage" ${p.ready ? '' : 'disabled'}>
          ${icon('play')} ${esc(p.ready ? p.cta : 'Study round unfinished')}</button>
        <button class="btn ghost" data-mode="studio">${icon('bolt')} Studio (speed)</button>
      </div>
      ${p.lastTest ? `<p class="small muted" style="margin-top:10px">Last test: ${Math.round(p.lastTest.accuracy * 100)}% at
        ${p.lastTest.perAnswer}s per answer${p.lastTest.excellent ? ' — excellent' : ''}.</p>` : ''}
    </div>`;
    host.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => start(b.dataset.mode); });
  }

  document.addEventListener('keydown', onKey);
  window.TABLESTAR = { open, showMenu, start, get session() { return g; } };
})();
