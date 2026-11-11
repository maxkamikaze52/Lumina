/* Astrolab — Spellbound: the DAILY HIVE.

   Seven letters in a honeycomb. Everyone gets a different hive (and different
   spoken words) every day, drawn from player id + date + level, so nobody can
   copy the person next to them. Words are worth more the longer they are; the
   spoken round pays by how fast you type. All answers live on the server.
*/
(function () {
  'use strict';
  const App = window.App, icon = window.icon;
  const esc = App.esc, num = App.num, cap = App.cap;

  const LEVELS = ['easy', 'intermediate', 'hard', 'extreme'];
  const LEVEL_LABEL = { easy: 'Easy', intermediate: 'Intermediate', hard: 'Hard', extreme: 'Extreme' };
  const LEVEL_SUB = {
    easy: '4–7 letters · common words',
    intermediate: '6–9 letters · one or two tricks',
    hard: '8–11 letters · silent letters, doubles',
    extreme: '10–12 letters · the ones that beat adults',
  };
  const LEVEL_MULT = { easy: 1.0, intermediate: 1.15, hard: 1.3, extreme: 1.45 };

  const H = {
    level: 'easy', hive: null, day: null, found: [], score: 0, streak: 0,
    running: false, mode: 'hive_hunt',
  };

  /* ---------------- data ---------------- */
  async function load(level) {
    const d = await App.API.get('/api/spellbound/daily?level=' + encodeURIComponent(level || H.level));
    H.hive = d.hive;
    H.day = d.today;
    H.level = d.hive.level;
    if (d.hive.mult) LEVEL_MULT[H.level] = d.hive.mult;   // server is the source of truth
    return d;
  }

  /* enterWorld() rebuilds the stage and returns it, so always ask it first */
  function mount() {
    if (App.world !== 'spellbound') return App.enterWorld('spellbound');
    return App.stage();
  }

  const hiveLetters = () => (H.hive ? H.hive.letters : []);
  const isPangram = (w) => H.hive && hiveLetters().every((c) => w.includes(c));

  /* ---------------- colour per level ---------------- */
  const LV = {
    easy: { bg1: '#17bd93', bg2: '#0f8f70', ink: '#0b3d31' },
    intermediate: { bg1: '#4c8dff', bg2: '#2f66d8', ink: '#12294f' },
    hard: { bg1: '#a06bff', bg2: '#7f4be0', ink: '#2c1a4f' },
    extreme: { bg1: '#ff5f6d', bg2: '#d9364a', ink: '#4a1016' },
  };
  const lv = () => LV[H.level] || LV.easy;

  /* ---------------- the honeycomb ---------------- */
  function honeycomb(letters, centre) {
    // exactly six ring letters by INDEX (robust even if a letter ever repeats);
    // the centre is drawn once, in the middle
    const centreIdx = Math.max(0, letters.indexOf(centre));
    const ring = letters.map((_, i) => i).filter((i) => i !== centreIdx);
    const cx = 190, cy = 190, R = 104;
    const slots = ring.map((idx, k) => {
      const a = (-90 + k * 60) * Math.PI / 180;
      return { idx, x: cx + R * Math.cos(a) * 1.0, y: cy + R * Math.sin(a) * 0.92 };
    });
    const hex = (x, y, r) => {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = (60 * i - 30) * Math.PI / 180;
        pts.push(`${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`);
      }
      return pts.join(' ');
    };
    let out = `<svg viewBox="0 0 380 400" class="sb-hive" role="img"
      aria-label="Honeycomb letters: ${esc(letters.join(' '))}, centre ${esc(centre)}">`;
    out += `<g class="sb-hive-lines" stroke="${lv().bg2}" stroke-width="3" opacity=".28">`;
    slots.forEach((s) => { out += `<line x1="${cx}" y1="${cy}" x2="${s.x.toFixed(1)}" y2="${s.y.toFixed(1)}"/>`; });
    out += `</g>`;
    slots.forEach((s) => {
      out += `<polygon class="sb-cell" points="${hex(s.x, s.y, 46)}" data-letter="${esc(letters[s.idx])}"
        tabindex="0" role="button" aria-label="letter ${esc(letters[s.idx])}"
        fill="#f7c65a" stroke="#8b5a2b" stroke-width="4" stroke-linejoin="round"/>`;
      out += `<text class="sb-cell-t" x="${s.x.toFixed(1)}" y="${(s.y + 12).toFixed(1)}">${esc(letters[s.idx].toUpperCase())}</text>`;
    });
    out += `<polygon class="sb-cell sb-centre" points="${hex(cx, cy, 56)}" data-letter="${esc(centre)}"
      tabindex="0" role="button" aria-label="centre letter ${esc(centre)}"
      fill="#ffd964" stroke="#5a3a1a" stroke-width="5" stroke-linejoin="round"/>`;
    out += `<text class="sb-cell-t sb-centre-t" x="${cx}" y="${cy + 15}">${esc(centre.toUpperCase())}</text>`;
    out += `</svg>`;
    return out;
  }

  /* the same honeycomb keyboard the spelling rounds use */
  function keypadHTML() {
    if (window.SPELLBOUND && window.SPELLBOUND.keypadHTML) return window.SPELLBOUND.keypadHTML();
    return '';
  }
  function bindKeypad(root, onKey) {
    root.querySelectorAll('[data-k]').forEach((b) => {
      b.onclick = () => onKey(b.dataset.k);
    });
  }

  /* ---------------- speech ---------------- */
  let voice = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const vs = window.speechSynthesis.getVoices();
    voice = vs.find((v) => v.lang === 'en-GB') || vs.find((v) => v.lang === 'en-US') ||
      vs.find((v) => v.lang && v.lang.startsWith('en')) || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }
  function speak(text, rate) {
    if (!('speechSynthesis' in window)) return false;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = rate || 0.9;
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
    return true;
  }
  const canSpeak = () => 'speechSynthesis' in window;

  /* ---------------- loading a level ---------------- */
  async function setLevel(level) {
    H.level = level;
    App.toast && null;
    await load(level);
    H.found = []; H.score = 0; H.streak = 0;
    renderMenu();
  }

  /* ---------------- the menu ---------------- */
  function renderMenu() {
    const main = mount();
    const h = H.hive;
    const pts = h ? h.points : {};
    main.innerHTML = `<div class="stack sb-daily">
      <div class="sb-head">
        <div>
          <span class="badge-pill" style="background:${lv().bg1}">Daily Hive</span>
          <div class="giant" style="margin-top:6px">TODAY'S <em style="color:${lv().bg1}">HONEYCOMB</em></div>
          <div class="meta" style="margin-top:8px">
            <span>${esc(h ? h.day : '')}</span>
            <span>Your letters: <b>${esc(h ? h.letters.join(' ').toUpperCase() : '')}</b></span>
            <span>Centre: <b>${esc(h ? h.centre.toUpperCase() : '')}</b></span>
          </div>
        </div>
        <div class="sb-today">
          <div class="eyebrow">Today best at this level</div>
          <div class="sb-big">${num((window.SB_TODAY_BEST || {})[H.level] || 0)}</div>
          <div class="small muted">Everyone else has different letters.</div>
        </div>
      </div>

      <div class="sb-levels">
        ${LEVELS.map((l) => `<button class="sb-level ${H.level === l ? 'on' : ''}" data-lvl="${l}"
          style="--c:${LV[l].bg1}">
          <b>${LEVEL_LABEL[l]}</b>
          <span>${LEVEL_SUB[l]}</span>
          <i>×${LEVEL_MULT[l].toFixed(1)} points · 5,000 words</i>
        </button>`).join('')}
      </div>

      <div class="sb-boardwrap">
        <div class="sb-board sb-comb">
          ${h ? honeycomb(h.letters, h.centre) : ''}
          <div class="sb-hint sb-paper" style="padding:8px 10px">Tap the letters. Words of 4+ letters. Every hive letter in
            one word is a <b>pangram</b> (+${h ? h.pangram : 100}).</div>
        </div>
        <div class="sb-side">
          ${window.ART.tile({ art: 'practice', name: 'WORD HUNT', sub: 'Find as many words as you can', label: LV[H.level].bg1, action: 'data-go="hive_hunt"' })}
          ${window.ART.tile({ art: 'builder', name: 'LISTEN & TYPE', sub: 'Hear the word, type it fast', label: '#ffc93c', action: 'data-go="hive_sprint"' })}
        </div>
      </div>

      <div class="sb-legend">
        ${Object.keys(pts).filter((k) => +k >= 4 && +k <= 9).map((k) =>
          `<span><b>${k}</b> letters · ${pts[k]} pts</span>`).join('')}
        <span><b>10+</b> letters · ${pts['10'] || 180}+ pts</span>
        <span>Harder mode multiplies everything ×${LEVEL_MULT[H.level]}</span>
      </div>
      <p class="small muted" style="margin:0">A fresh hive lands at midnight. Nobody can hand you
        their answers — the letters and the spoken words are yours alone.</p>
    </div>`;

    main.querySelectorAll('[data-lvl]').forEach((b) => { b.onclick = () => setLevel(b.dataset.lvl); });
    main.querySelectorAll('[data-go]').forEach((b) => { b.onclick = () => (b.dataset.go === 'hive_sprint' ? startSprint() : startHunt()); });
    bindLetters(main);
  }

  function bindLetters(root) {
    root.querySelectorAll('.sb-cell').forEach((c) => {
      const click = () => {
        const inp = root.querySelector('#sb-typed');
        if (!inp) return;
        inp.value += c.dataset.letter;
        inp.focus();
      };
      c.onclick = click;
      c.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); click(); } };
    });
  }

  /* ---------------- WORD HUNT ---------------- */
  function startHunt() {
    H.mode = 'hive_hunt';
    H.found = []; H.score = 0; H.streak = 0;
    const main = mount();
    const h = H.hive;
    main.innerHTML = `<div class="stack sb-game">
      <div class="sb-topbar">
        <button class="btn ghost" id="sb-back" style="transform:none">
          <span style="display:inline-block;transform:rotate(180deg)">${icon('arrow')}</span> Back</button>
        <div class="sb-hive-mini">${honeycomb(h.letters, h.centre)}</div>
        <div class="sb-stats">
          <div><b id="sb-score">0</b><span>points</span></div>
          <div><b id="sb-words">0</b><span>words</span></div>
          <div><b id="sb-clock">0:00</b><span>time</span></div>
        </div>
      </div>
      <div class="sb-play">
        <form class="sb-entry" id="sb-form" autocomplete="off">
          <input id="sb-typed" class="sb-input2" inputmode="latin" autocapitalize="off"
            autocorrect="off" spellcheck="false" aria-label="Type a word"
            placeholder="Type a word…" maxlength="20">
          <button class="btn ghost" type="button" id="sb-del" aria-label="Delete last letter">⌫</button>
          <button class="btn ghost" type="button" id="sb-shuffle" aria-label="Shuffle letters">⤨</button>
          <button class="btn jade" type="submit">Enter</button>
        </form>
        ${keypadHTML()}
        <div class="sb-msg" id="sb-msg" role="status" aria-live="polite"></div>
        <div class="sb-found" id="sb-found"></div>
      </div>
      <div class="sb-actions">
        <button class="btn ghost" id="sb-finish">Finish the hive</button>
        <span class="small muted">You are scored on what you type before you finish.</span>
      </div>
    </div>`;

    const typed = main.querySelector('#sb-typed');
    const msg = main.querySelector('#sb-msg');
    const startedAt = performance.now();
    const clock = main.querySelector('#sb-clock');
    const tick = setInterval(() => {
      const s = Math.floor((performance.now() - startedAt) / 1000);
      clock.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    }, 500);
    App.onCleanup(() => clearInterval(tick));

    bindLetters(main);
    bindKeypad(main, (k) => {
      if (k === 'del') typed.value = typed.value.slice(0, -1);
      else if (k === 'enter') main.querySelector('#sb-form').requestSubmit();
      else if (/^[a-z]$/.test(k)) typed.value += k;
      typed.focus();
    });
    setTimeout(() => typed.focus(), 60);

    main.querySelector('#sb-del').onclick = () => { typed.value = typed.value.slice(0, -1); typed.focus(); };
    main.querySelector('#sb-shuffle').onclick = () => {
      // shuffle the SIX ring letters only: the centre never moves, and the
      // grid must stay seven letters
      const ring = h.letters.filter((c) => c !== h.centre);
      for (let i = ring.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ring[i], ring[j]] = [ring[j], ring[i]];
      }
      const mini = main.querySelector('.sb-hive-mini');
      if (mini) mini.innerHTML = honeycomb(ring.concat([h.centre]), h.centre);
      bindLetters(main);
      typed.focus();
    };
    main.querySelector('#sb-back').onclick = () => { clearInterval(tick); renderMenu(); };

    const submit = async (e) => {
      if (e) e.preventDefault();
      const w = (typed.value || '').trim().toLowerCase();
      if (!w) return;
      typed.value = '';
      if (w.length < 4) return say('Four letters or more.', 'warn');
      if (H.found.some((f) => f.w === w)) return say('Already found.', 'warn');
      if (!hiveLetters().length) return;
      let res;
      try { res = await App.API.post('/api/spellbound/check', { level: H.level, word: w, day: H.day }); }
      catch (err) { return say(err.message, 'bad'); }
      if (!res.ok) return say(res.message, 'bad');
      // the clock that matters is from the first keystroke to Enter: thinking
      // time before you start typing is your own business
      const now = performance.now();
      const ms = Math.max(300, now - (firstKeyAt || now - 1200));
      const tgt = 700 + 250 * w.length;
      const speed = Math.max(0.4, Math.min(2.0, tgt / ms));
      const gained = Math.round(res.points * speed);
      H.found.push({ w, ms, points: gained, pangram: res.pangram, speed });
      H.score += gained;
      H.streak += 1;
      resetKeys();
      main.querySelector('#sb-score').textContent = num(H.score);
      main.querySelector('#sb-words').textContent = H.found.length;
      say(`${w.toUpperCase()}  +${gained}${res.pangram ? '  PANGRAM!' : ''}`, res.pangram ? 'pangram' : 'good');
      paintFound(main);
      typed.focus();
    };
    let firstKeyAt = 0;             // when you started typing THIS word
    typed.addEventListener('input', () => { if (!firstKeyAt) firstKeyAt = performance.now(); });
    const resetKeys = () => { firstKeyAt = 0; };
    main.querySelector('#sb-form').onsubmit = submit;
    main.querySelector('#sb-finish').onclick = async () => {
      clearInterval(tick);
      await settle((performance.now() - startedAt) / 1000);
    };

    function say(text, kind) {
      msg.textContent = text;
      msg.className = 'sb-msg ' + (kind || '');
      clearTimeout(say._t);
      say._t = setTimeout(() => { msg.textContent = ''; msg.className = 'sb-msg'; }, 2600);
    }
    function paintFound(root) {
      const box = root.querySelector('#sb-found');
      box.innerHTML = H.found.slice().sort((a, b) => b.points - a.points).map((f) =>
        `<span class="sb-chip ${f.pangram ? 'pangram' : ''}" title="${f.ms}ms (target ${700 + 250 * f.w.length}ms)">
          ${esc(f.w)}<i>+${f.points}</i></span>`).join('');
    }
  }

  /* ---------------- LISTEN & TYPE ---------------- */
  function startSprint() {
    H.mode = 'hive_sprint';
    const h = H.hive;
    const main = mount();
    const queue = h.challenge.slice();
    let i = 0, right = 0, speedSum = 0, startedAt = performance.now(), shownAt = 0;
    const results = [];

    main.innerHTML = `<div class="stack sb-game">
      <div class="sb-topbar">
        <button class="btn ghost" id="sp-back">
          <span style="display:inline-block;transform:rotate(180deg)">${icon('arrow')}</span> Back</button>
        <div class="sb-progress"><i id="sp-bar" style="width:0%"></i></div>
        <div class="sb-stats">
          <div><b id="sp-n">0/${queue.length}</b><span>words</span></div>
          <div><b id="sp-speed">–</b><span>speed</span></div>
          <div><b id="sp-clock">0:00</b><span>time</span></div>
        </div>
      </div>
      <div class="sb-sprint">
        <button class="btn jade sb-speaker" id="sp-say">${icon('speaker')} Hear it again</button>
        <div class="sb-len" id="sp-len"></div>
        <form class="sb-entry" id="sp-form" autocomplete="off">
          <input id="sp-typed" class="sb-input2 big" autocapitalize="off" autocorrect="off"
            spellcheck="false" aria-label="Type the word you heard" placeholder="Type what you hear…" maxlength="20">
          <button class="btn jade" type="submit">Enter</button>
        </form>
        ${keypadHTML()}
        <div class="sb-msg" id="sp-msg" role="status" aria-live="polite"></div>
        <div class="sb-typed-list" id="sp-list"></div>
        ${canSpeak() ? '' : '<p class="small muted">This browser has no speech voice, so the word is shown for a moment instead.</p>'}
      </div>
    </div>`;

    const clock = main.querySelector('#sp-clock');
    const tick = setInterval(() => {
      const s = Math.floor((performance.now() - startedAt) / 1000);
      clock.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    }, 500);
    App.onCleanup(() => clearInterval(tick));

    const input = main.querySelector('#sp-typed');
    const msg = main.querySelector('#sp-msg');
    bindKeypad(main, (k) => {
      if (k === 'del') input.value = input.value.slice(0, -1);
      else if (k === 'enter') main.querySelector('#sp-form').requestSubmit();
      else if (/^[a-z]$/.test(k)) input.value += k;
      input.focus();
    });

    function next() {
      if (i >= queue.length) return finish();
      const item = queue[i];
      main.querySelector('#sp-n').textContent = `${i}/${queue.length}`;
      main.querySelector('#sp-bar').style.width = `${(i / queue.length) * 100}%`;
      main.querySelector('#sp-len').innerHTML = Array.from({ length: item.w.length },
        () => '<i></i>').join('');
      input.value = '';
      input.focus();
      shownAt = performance.now();
      if (!speak(item.w, H.level === 'easy' ? 0.8 : 0.92)) {
        // no voice: flash the word, then hide it
        msg.textContent = item.w.toUpperCase();
        msg.className = 'sb-msg show';
        setTimeout(() => { if (msg.textContent === item.w.toUpperCase()) { msg.textContent = ''; msg.className = 'sb-msg'; } }, 900);
      }
    }
    function reveal(text, kind) {
      msg.textContent = text;
      msg.className = 'sb-msg ' + (kind || '');
    }

    main.querySelector('#sp-say').onclick = () => { const it = queue[i]; if (it) speak(it.w, 0.82); };

    main.querySelector('#sp-form').onsubmit = (e) => {
      e.preventDefault();
      const item = queue[i];
      if (!item) return;
      const typed = (input.value || '').trim().toLowerCase();
      if (!typed) return;
      const ms = Math.max(150, performance.now() - shownAt);
      const ok = typed === item.w;
      const tgt = 700 + 250 * item.w.length;
      const speed = Math.max(0.35, Math.min(2.0, tgt / ms));
      if (ok) {
        right += 1;
        speedSum += speed;
        results.push({ w: item.w, ok: true, ms });
        reveal(`${item.w.toUpperCase()}  ✓  ${(ms / 1000).toFixed(2)}s  ×${speed.toFixed(2)} speed`, 'good');
        main.querySelector('#sp-speed').textContent = `×${(speedSum / right).toFixed(2)}`;
      } else {
        results.push({ w: item.w, ok: false, ms });
        reveal(`It was ${item.w.toUpperCase()} — you typed ${typed || 'nothing'}`, 'bad');
      }
      const li = document.createElement('span');
      li.className = 'sb-chip ' + (ok ? '' : 'miss');
      li.innerHTML = `${esc(item.w)}<i>${ok ? (ms / 1000).toFixed(2) + 's' : 'miss'}</i>`;
      main.querySelector('#sp-list').prepend(li);
      i += 1;
      setTimeout(next, ok ? 320 : 900);
    };

    async function finish() {
      clearInterval(tick);
      main.querySelector('#sp-bar').style.width = '100%';
      window.speechSynthesis && window.speechSynthesis.cancel();
      await settle((performance.now() - startedAt) / 1000, results);
    }

    next();
  }

  /* ---------------- settle ---------------- */
  async function settle(duration, typed) {
    const main = mount();
    const body = {
      level: H.level, mode: H.mode, duration: duration,
      found: H.found.map((f) => ({ w: f.w, ms: f.ms })),
      typed: (typed || []).map((t) => ({ w: t.w, ok: t.ok, ms: t.ms })),
      completed: true,
    };
    main.innerHTML = '<div class="stack"><div class="card center"><b>Tallying the hive…</b></div></div>';
    let r;
    try { r = await App.API.post('/api/spellbound/daily/finish', body); }
    catch (e) { main.innerHTML = `<div class="card">${esc(e.message)}</div>`; return; }
    const best = Math.max(r.score || 0, (window.SB_TODAY_BEST || {})[H.level] || 0);
    window.SB_TODAY_BEST = Object.assign({}, window.SB_TODAY_BEST, { [H.level]: best });

    main.innerHTML = `<div class="stack">
      <div class="sb-result" style="--c:${lv().bg1}">
        <div class="eyebrow">${LEVEL_LABEL[H.level]} · ${H.mode === 'hive_sprint' ? 'Listen & Type' : 'Word Hunt'} · ${esc(H.day || '')}</div>
        <div class="sb-big">${num(r.score || 0)}</div>
        <div class="meta"><span>Hive points: <b>${num(r.wordPoints || 0)}</b></span>
          <span>Speed points: <b>${num(r.speedPoints || 0)}</b></span>
          <span>Words: <b>${r.found || 0}</b></span>
          <span>Pangrams: <b>${r.pangrams || 0}</b></span>
          ${r.total ? `<span>Typed right: <b>${r.correct}/${r.total}</b></span>` : ''}
          <span>Speed: <b>×${(r.speed || 1).toFixed ? (r.speed || 1).toFixed(2) : r.speed}</b></span></div>
        <div class="sb-reward">
          <div><b>+${num(r.xp || 0)}</b><span>XP</span></div>
          <div><b>+${num(r.starbits || 0)}</b><span>starbits</span></div>
          <div><b>×${r.multiplier || 1}</b><span>${LEVEL_LABEL[H.level]} multiplier</span></div>
        </div>
        ${r.recorded === false ? '<p class="small muted">This run was not recorded: ' + esc(r.reason || '') + '</p>' : ''}
      </div>
      <div class="row">
        <button class="btn jade" id="sb-again">Play again</button>
        <button class="btn ghost" id="sb-menu">Back to the hive</button>
      </div>
    </div>`;
    main.querySelector('#sb-again').onclick = () => (H.mode === 'hive_sprint' ? startSprint() : startHunt());
    main.querySelector('#sb-menu').onclick = () => renderMenu();
    H.found = []; H.score = 0;
    if (App.refreshWallet) App.refreshWallet();
  }

  /* ---------------- open ---------------- */
  async function open() {
    const main = mount();
    main.innerHTML = '<div class="stack"><div class="card center"><b>Handing you today\'s hive…</b></div></div>';
    try {
      const d = await load(H.level);
      window.SB_TODAY_BEST = d.today_best || {};
    } catch (e) {
      main.innerHTML = `<div class="card">${esc(e.message)}</div>`;
      return;
    }
    renderMenu();
  }

  window.SPELLBOUND = window.SPELLBOUND || {};
  window.SPELLBOUND.openDaily = open;
  window.SPELLBOUND.openHive = open;
  window.SPELLBOUND.startHunt = startHunt;
  window.SPELLBOUND.startSprint = startSprint;
  window.SPELLBOUND.setLevel = setLevel;
  Object.defineProperty(window.SPELLBOUND, 'daily', { get: () => H });
})();
