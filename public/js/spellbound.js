/* Astrolab — Spellbound: listen, spell, master. Original mechanics inspired by
   structured spelling practice (word lists, difficulty bands, spaced repetition). */
(function () {
  'use strict';
  const App = window.App, icon = window.icon;
  const esc = App.esc, num = App.num, cap = App.cap;

  const SB = {
    data: null, list: 'common', level: 'beginner', difficulty: 'medium', mode: 'practice',
    locale: 'GB', session: null
  };

  async function loadWords() {
    if (SB.data) return SB.data;
    const res = await fetch('/data/words.json');
    SB.data = await res.json();
    return SB.data;
  }

  const wordsFor = (listId) => {
    const list = SB.data.lists.find((l) => l.id === listId);
    const topic = list ? list.topic : listId;
    return SB.data.words.filter((w) => (w.topics || [w.topic]).includes(topic) &&
      (w.locale === 'both' || w.locale === SB.locale));
  };

  const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced', 'expert'];
  const levelFilter = (words, level) => {
    const i = LEVEL_ORDER.indexOf(level);
    const wanted = [LEVEL_ORDER[i], LEVEL_ORDER[Math.min(3, i + 1)]];
    const out = words.filter((w) => wanted.includes(w.level));
    return out.length >= 6 ? out : words;
  };

  /* ---- speech ---- */
  let voice = null;
  function speak(text, rate) {
    if (!('speechSynthesis' in window)) { App.toast('This browser has no speech voice'); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = SB.locale === 'US' ? 'en-US' : 'en-GB';
    u.rate = rate || (SB.difficulty === 'easy' ? 0.82 : 0.92);
    u.pitch = 1;
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  }
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const vs = window.speechSynthesis.getVoices();
    const want = SB.locale === 'US' ? 'en-US' : 'en-GB';
    voice = vs.find((v) => v.lang === want) || vs.find((v) => v.lang.startsWith('en')) || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  /* ---- spaced repetition: pick words, weighting the weak ones ---- */
  function buildQueue(words, size) {
    const stats = (App.state.stats.wordMap) || {};
    const scored = words.map((w) => {
      const st = stats[w.w] || { attempts: 0, box: 0, wrong: 0 };
      let weight = 1;
      if (st.wrong > 0) weight += st.wrong * 1.6;
      if (st.box === 0) weight += 1.4;         // never seen
      if (st.box >= 4) weight *= 0.35;         // mastered: rare
      if (st.box >= 5) weight *= 0.4;
      return { w, weight: Math.max(0.15, weight) };
    });
    const out = [];
    const pool = scored.slice();
    while (out.length < Math.min(size, words.length) && pool.length) {
      const total = pool.reduce((s, x) => s + x.weight, 0);
      let r = Math.random() * total, idx = 0;
      for (; idx < pool.length; idx++) { r -= pool[idx].weight; if (r <= 0) break; }
      const chosen = pool.splice(Math.min(idx, pool.length - 1), 1)[0];
      out.push(chosen.w);
    }
    return out;
  }

  /* ---- start a session ---- */
  async function startSession(mode) {
    await loadWords();
    const all = levelFilter(wordsFor(SB.list), SB.level);
    const size = mode === 'review' ? 8 : 10;
    let words;
    if (mode === 'review') {
      const stats = App.state.stats.wordMap || {};
      const difficult = all.filter((w) => stats[w.w] && stats[w.w].wrong >= 1 && stats[w.w].box < 4);
      words = (difficult.length ? difficult : all.slice()).slice(0, size);
      if (!words.length) return App.toast('No difficult words in this list yet', 'check');
    } else {
      words = buildQueue(all, size);
    }
    SB.session = {
      mode, listId: SB.list, difficulty: SB.difficulty, queue: App.shuffle(words),
      index: 0, answers: [], streak: 0, bestStreak: 0, hints: 0, startedAt: performance.now(), done: false
    };
    try {
      const r = await App.API.post('/api/session/start', {
        game: 'spellbound', mode, difficulty: SB.difficulty,
        meta: { listId: SB.list, level: SB.level, words: words.map((w) => w.w) }
      });
      SB.session.sessionId = r.sessionId;
      SB.session.tag = 'sb-' + r.sessionId;
    } catch (e) { return App.toast(e.message, 'x'); }
    drawRound(App.stage());
  }

  function currentWord() {
    const s = SB.session;
    return s && s.queue[s.index];
  }

  function drawRound(main) {
    const s = SB.session;
    if (!s) return;
    if (s.index >= s.queue.length) return finishSession(main);
    const w = currentWord();
    const mode = s.mode;
    const diff = SB.difficulty;
    if (mode === 'builder') return drawBuilder(main, w);
    if (mode === 'missing') return drawMissing(main, w);

    const shown = diff === 'easy';
    main.innerHTML = `<div class="stack">
      <div class="between"><div class="eyebrow">Spellbound · ${esc(cap(diff))} · word ${s.index + 1} of ${s.queue.length}</div>
        <button class="btn ghost sm" data-leave-world>${icon('games')} Astrolab</button></div>
      <div class="progress-dots">${s.queue.map((_, i) => `<i class="${i < s.answers.length ? (s.answers[i].ok ? 'ok' : 'bad') : ''}"></i>`).join('')}</div>
      <div class="sb-play">
        ${shown ? `<div class="sb-word">${esc(w.w)}</div><p class="small muted center">Look at it, then spell it. The spelling hides when you start typing.</p>`
          : '<p class="small muted center">Listen, then spell the word.</p>'}
        <button class="sb-say" id="say" aria-label="Play the word">${icon('speaker')}</button>
        <div class="sb-input">
          <input id="answer" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
            aria-label="Type the spelling" placeholder="type the word">
          <button class="btn jade" id="check">Check</button>
        </div>
        <div class="sb-copy">
          <button class="btn ghost sm" id="repeat">${icon('speaker')} Repeat</button>
          <button class="btn ghost sm" id="hint">Hint</button>
          ${diff === 'easy' || diff === 'medium' ? '<button class="btn ghost sm" id="def">Definition</button>' : ''}
        </div>
        <p class="small muted center" style="margin-top:12px" id="fb">&nbsp;</p>
      </div></div>`;

    const input = main.querySelector('#answer');
    const fb = main.querySelector('#fb');
    let attempts = 0;
    const limit = diff === 'extreme' ? 1 : diff === 'hard' ? 2 : 99;

    if (diff !== 'easy') setTimeout(() => speak(w.w), 250);
    main.querySelector('#say').onclick = () => { attempts++; speak(w.w); if (attempts > limit) App.toast('Try to picture the word', 'x'); };
    main.querySelector('#repeat').onclick = () => {
      if (attempts >= limit && diff !== 'medium' && diff !== 'easy') {
        fb.textContent = 'No repeats left on this word.';
        return;
      }
      attempts++; speak(w.w, 0.8);
    };
    main.querySelector('#hint').onclick = () => {
      if (diff === 'extreme') { fb.textContent = 'No hints in Extreme.'; return; }
      s.hints++;
      const parts = w.w.split('');
      const shownCount = Math.max(1, Math.floor(parts.length / 3));
      fb.textContent = `Starts with “${w.w.slice(0, shownCount)}” · ${w.w.length} letters` +
        (w.note ? ` · ${w.note}` : '');
    };
    const defBtn = main.querySelector('#def');
    if (defBtn) defBtn.onclick = () => speak(`${w.w}. ${w.def}. ${w.sent}`, 0.95);

    input.addEventListener('input', () => {
      if (shown && input.value.length) main.querySelector('.sb-word').textContent = '';
      fb.textContent = '\u00a0';
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });
    main.querySelector('#check').onclick = () => submit();
    input.focus();

    function submit() {
      const val = input.value.trim();
      if (!val) return;
      const ok = normalise(val) === normalise(w.w);
      input.classList.add(ok ? 'ok' : 'bad');
      s.answers.push({ w: w.w, ok, typed: val, mode });
      if (ok) { s.streak++; s.bestStreak = Math.max(s.bestStreak, s.streak); speak('Correct'); }
      else { s.streak = 0; speak(w.w, 0.75); }
      fb.innerHTML = ok ? '✓ Correct' : `✕ It is spelt <b>${esc(w.w)}</b> — ${esc(w.sent)}`;
      main.querySelector('#check').disabled = true;
      input.disabled = true;
      setTimeout(() => { s.index++; drawRound(main); }, ok ? 900 : 2100);
    }
    main.querySelector('#quit').onclick = () => abandon();
  }

  const normalise = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();

  /* ---- Word Builder: arrange shuffled letters ---- */
  function drawBuilder(main, w) {
    const s = SB.session;
    const letters = App.shuffle(w.w.replace(/[^a-zA-Z']/g, '').split(''));
    main.innerHTML = `<div class="stack">
      <div class="between"><div class="eyebrow">Word Builder · ${s.index + 1} of ${s.queue.length}</div>
        <button class="btn ghost sm" data-leave-world>${icon('games')} Astrolab</button></div>
      <div class="sb-play">
        <p class="small muted center">Put the letters in order. Drag them, or tap a letter then a slot.</p>
        <div class="slots" id="slots">${letters.map((_, i) => `<div class="slot" data-slot="${i}"></div>`).join('')}</div>
        <div class="letter-tiles" id="tiles">${letters.map((ch, i) =>
          `<button class="tile" draggable="true" data-i="${i}" data-ch="${esc(ch)}">${esc(ch)}</button>`).join('')}</div>
        <div class="sb-copy">
          <button class="sb-say" style="width:64px;height:64px" id="say" aria-label="Play the word">${icon('speaker')}</button>
          <button class="btn ghost sm" id="undo">Undo</button>
          <button class="btn jade" id="check">Check</button>
        </div>
        <p class="small muted center" style="margin-top:10px" id="fb">${esc(w.def)}</p>
      </div></div>`;

    const placed = new Array(letters.length).fill(null);
    let selected = null;
    const slotsEl = main.querySelector('#slots');
    const tilesEl = main.querySelector('#tiles');

    function paint() {
      slotsEl.querySelectorAll('[data-slot]').forEach((el) => {
        const p = placed[+el.dataset.slot];
        el.textContent = p ? p.ch : '';
        el.classList.toggle('filled', !!p);
      });
      tilesEl.querySelectorAll('[data-i]').forEach((el) => {
        el.classList.toggle('used', placed.some((p) => p && p.i === +el.dataset.i));
      });
    }
    function place(slot, tileIdx) {
      for (let i = 0; i < placed.length; i++) if (placed[i] && placed[i].i === tileIdx) placed[i] = null;
      const t = tilesEl.querySelector(`[data-i="${tileIdx}"]`);
      placed[slot] = { i: tileIdx, ch: t.dataset.ch };
      paint();
    }
    tilesEl.querySelectorAll('[data-i]').forEach((t) => {
      t.onclick = () => {
        selected = +t.dataset.i;
        tilesEl.querySelectorAll('.tile').forEach((x) => { x.style.outline = x === t ? '3px solid var(--jade)' : ''; });
        const free = placed.findIndex((p) => !p);
        if (free >= 0) place(free, selected);
      };
      t.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', t.dataset.i); });
    });
    slotsEl.querySelectorAll('[data-slot]').forEach((el) => {
      el.ondragover = (e) => e.preventDefault();
      el.ondrop = (e) => {
        e.preventDefault();
        const i = e.dataTransfer.getData('text/plain');
        if (i !== '') place(+el.dataset.slot, +i);
      };
      el.onclick = () => {
        if (placed[+el.dataset.slot]) { placed[+el.dataset.slot] = null; paint(); }
      };
    });
    main.querySelector('#undo').onclick = () => {
      const last = placed.map((p, i) => (p ? i : -1)).filter((i) => i >= 0).pop();
      if (last != null) { placed[last] = null; paint(); }
    };
    main.querySelector('#say').onclick = () => speak(w.w);
    main.querySelector('#check').onclick = () => {
      const guess = placed.map((p) => (p ? p.ch : '')).join('');
      const ok = normalise(guess) === normalise(w.w);
      s.answers.push({ w: w.w, ok, typed: guess, mode: 'builder' });
      const fb = main.querySelector('#fb');
      fb.innerHTML = ok ? '✓ Built correctly' : `✕ The word is <b>${esc(w.w)}</b>`;
      slotsEl.querySelectorAll('[data-slot]').forEach((el) => el.classList.add(ok ? 'ok' : 'bad'));
      main.querySelector('#check').disabled = true;
      if (ok) s.streak++; else s.streak = 0;
      s.bestStreak = Math.max(s.bestStreak, s.streak);
      setTimeout(() => { s.index++; drawRound(main); }, ok ? 900 : 2000);
    };
    main.querySelector('#quit').onclick = () => abandon();
    setTimeout(() => speak(w.w), 250);
  }

  /* ---- Missing Letters ---- */
  function drawMissing(main, w) {
    const s = SB.session;
    const word = w.w;
    const hard = SB.difficulty === 'hard' || SB.difficulty === 'extreme';
    const gapCount = Math.max(1, Math.round(word.replace(/[^a-zA-Z]/g, '').length * (hard ? 0.5 : 0.32)));
    const letters = word.split('');
    const candidates = letters.map((c, i) => (/[a-z]/i.test(c) ? i : -1)).filter((i) => i >= 0);
    const gaps = App.shuffle(candidates.slice()).slice(0, gapCount).sort((a, b) => a - b);
    const blanks = gaps.map(() => '');

    main.innerHTML = `<div class="stack">
      <div class="between"><div class="eyebrow">Missing Letters · ${s.index + 1} of ${s.queue.length}</div>
        <button class="btn ghost sm" data-leave-world>${icon('games')} Astrolab</button></div>
      <div class="sb-play">
        <p class="small muted center">${esc(w.def)}</p>
        <div class="gaps" id="gaps">${letters.map((c, i) => gaps.includes(i)
          ? `<span class="u" data-gap="${gaps.indexOf(i)}">_</span>`
          : `<span>${esc(c)}</span>`).join('')}</div>
        <div class="sb-copy">
          <button class="sb-say" style="width:64px;height:64px" id="say" aria-label="Play the word">${icon('speaker')}</button>
          <button class="btn ghost sm" id="back">Delete</button>
          <button class="btn ghost sm" id="clear">Clear</button>
        </div>
        ${keypadHTML()}
        <p class="small muted center" style="margin-top:10px" id="fb">${esc(w.sent.replace(new RegExp(word, 'gi'), '___'))}</p>
      </div></div>`;

    let focus = 0;
    function paint() {
      main.querySelectorAll('[data-gap]').forEach((el) => {
        const i = +el.dataset.gap;
        el.textContent = blanks[i] || '_';
        el.style.color = i === focus ? 'var(--amber)' : '';
      });
    }
    function type(ch) {
      if (ch === 'del') { focus = Math.max(0, focus - (blanks[focus] ? 0 : 1)); blanks[focus] = ''; }
      else if (ch === 'clear') blanks.fill('');
      else if (/^[a-z]$/i.test(ch)) {
        blanks[focus] = ch;
        if (focus < blanks.length - 1) focus++;
      }
      paint();
    }
    main.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => type(b.dataset.k); });
    main.querySelectorAll('[data-gap]').forEach((el) => {
      el.onclick = () => { focus = +el.dataset.gap; paint(); };
    });
    main.querySelector('#back').onclick = () => type('del');
    main.querySelector('#clear').onclick = () => type('clear');
    main.querySelector('#say').onclick = () => speak(w.w);
    const keyHandler = (e) => {
      if (/^[a-z]$/i.test(e.key)) type(e.key);
      else if (e.key === 'Backspace') type('del');
      else if (e.key === 'Enter') check();
    };
    document.addEventListener('keydown', keyHandler);
    App.onCleanup(() => document.removeEventListener('keydown', keyHandler));

    function check() {
      const guess = letters.map((c, i) => (gaps.includes(i) ? (blanks[gaps.indexOf(i)] || '_') : c)).join('');
      const ok = normalise(guess) === normalise(word);
      s.answers.push({ w: word, ok, typed: guess, mode: 'missing' });
      const fb = main.querySelector('#fb');
      fb.innerHTML = ok ? '✓ Correct' : `✕ <b>${esc(word)}</b>`;
      if (ok) { s.streak++; } else s.streak = 0;
      s.bestStreak = Math.max(s.bestStreak, s.streak);
      document.removeEventListener('keydown', keyHandler);
      setTimeout(() => { s.index++; drawRound(main); }, ok ? 900 : 2000);
    }
    main.querySelector('#quit').onclick = () => abandon();
    setTimeout(() => speak(w.w), 250);
    paint();
  }

  function keypadHTML() {
    const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    return `<div style="max-width:520px;margin:14px auto 0;display:grid;gap:6px">
      ${rows.map((r, i) => `<div style="display:flex;gap:5px;justify-content:center">
        ${i === 2 ? '<button class="btn ghost sm" data-k="del">⌫</button>' : ''}
        ${r.split('').map((c) => `<button class="btn ghost sm" style="min-width:34px;padding:8px 0;flex:1" data-k="${c}">${c}</button>`).join('')}
      </div>`).join('')}
      <div style="display:flex;justify-content:center;margin-top:4px">
        <button class="btn jade sm" onclick="this.closest('.sb-play').querySelector('[data-k]')" hidden></button></div>
    </div>`;
  }

  async function abandon() {
    const s = SB.session;
    SB.session = null;
    if (s && s.sessionId) { try { await App.API.post('/api/session/abandon', { sessionId: s.sessionId }); } catch (e) {} }
    App.toast('Session left — nothing recorded', 'x');
    open();
  }

  async function finishSession(main) {
    const s = SB.session;
    if (!s || s.done) return;
    s.done = true;
    const total = s.answers.length;
    const correct = s.answers.filter((a) => a.ok).length;
    const duration = (performance.now() - s.startedAt) / 1000;
    let reward = { xp: 0, starbits: 0, badges: [], class: null };
    try {
      reward = await App.API.post('/api/session/complete', {
        sessionId: s.sessionId, tag: s.tag, completed: true,
        correct, total, score: correct, duration,
        meta: { listId: s.listId, difficulty: s.difficulty, bestStreak: s.bestStreak, hints: s.hints },
        details: { words: s.answers.map((a) => ({ w: a.w, ok: a.ok })) }
      });
      await App.reload();
    } catch (e) { App.toast(e.message, 'x'); }
    SB.session = null;
    main.innerHTML = `<div class="stack">
      <div class="res-hero"><div class="eyebrow">Session complete</div>
        <b>${correct}/${total}</b><p class="muted">${total ? Math.round(correct / total * 100) : 0}% correct · best streak ${s.bestStreak}</p>
        <div class="res-grid">
          <div><b style="color:var(--jade)">+${num(reward.xp)}</b><span>XP</span></div>
          <div><b style="color:var(--amber)">+${num(reward.starbits)}</b><span>Starbits</span></div>
          <div><b>${s.answers.filter((a) => a.ok).length}</b><span>correct</span></div>
        </div></div>
      <div class="card flat"><div class="eyebrow">Review</div>
        ${s.answers.map((a) => `<div class="between small" style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06)">
          <span>${a.ok ? '✓' : '✕'} <b>${esc(a.w)}</b>${!a.ok && a.typed ? ` <span class="muted">(you wrote “${esc(a.typed)}”)</span>` : ''}</span>
          <span class="muted">${esc(a.mode)}</span></div>`).join('')}</div>
      <div class="row"><button class="btn jade" id="again">Practise again</button>
        <button class="btn ghost" id="back">Spellbound home</button></div>
    </div>`;
    if (reward.badges && reward.badges.length) App.celebrate(reward.badges);
    main.querySelector('#again').onclick = () => startSession(s.mode);
    main.querySelector('#back').onclick = () => open();
  }

  /* ---- dashboard ---- */
  async function open() {
    if (App.world !== 'spellbound') App.enterWorld('spellbound');
    await loadWords();
    const main = App.stage();
    const stats = App.state.stats;
    const wordMap = stats.wordMap || {};
    const seen = Object.keys(wordMap).length;
    const mastered = Object.values(wordMap).filter((w) => w.box >= 4).length;
    const difficult = Object.values(wordMap).filter((w) => w.wrong >= 1 && w.box < 4).length;
    const levelCounts = {};
    const words = wordsFor(SB.list);
    words.forEach((w) => { levelCounts[w.level] = (levelCounts[w.level] || 0) + 1; });

    main.innerHTML = `<div class="stack">
      <div class="world-title">
        <span class="badge-pill">Spelling</span>
        <div class="segbar" style="margin-left:auto">
          <button data-locale="GB" class="${SB.locale === 'GB' ? 'on' : ''}">British</button>
          <button data-locale="US" class="${SB.locale === 'US' ? 'on' : ''}">American</button></div>
      </div>
      <div class="giant">PICK A <em style="color:#17bd93">GAME</em></div>
      <div class="tilegrid">
        ${ART.tile({ art: 'practice', name: 'LISTEN & SPELL', sub: 'Hear it, type it, check it', label: '#a8f0c8', action: 'data-mode="practice"' })}
        ${ART.tile({ art: 'builder', name: 'WORD BUILDER', sub: 'Scrambled letters, put them right', label: '#ffe08a', action: 'data-mode="builder"' })}
        ${ART.tile({ art: 'missing', name: 'MISSING LETTERS', sub: 'Fill the gaps', label: '#ffc2dd', action: 'data-mode="missing"' })}
        ${ART.tile({ art: 'review', name: 'MY TRICKY WORDS', sub: `${difficult} word${difficult === 1 ? '' : 's'} to revisit`, label: '#d8c8ff', action: 'id="review"' })}
      </div>

      <div class="playband" style="margin-top:20px">
        <div>
          <div class="giant" style="font-size:clamp(26px,4vw,42px)">${esc((SB.data.lists.find((l) => l.id === SB.list) || {}).name || 'Word list')}</div>
          <div class="meta" style="margin-top:8px">
            <span>Level: <b>${esc(cap(SB.level))}</b></span>
            <span>Difficulty: <b>${esc(cap(SB.difficulty))}</b></span>
            <span>Words: <b>${words.length}</b></span>
          </div>
        </div>
        <button class="btn jade" id="go" style="font-size:18px;padding:16px 28px">${icon('play')} PLAY</button>
      </div>

      <section class="grid g2" style="margin-top:20px">
        <div class="card">
          <div class="eyebrow">Difficulty</div>
          <div class="tilebar" style="margin:12px 0 0">
            ${[['easy', 'EASY', 'Word shown'], ['medium', 'MEDIUM', 'Audio only'],
               ['hard', 'HARD', 'Two repeats'], ['extreme', 'EXTREME', 'Timed, no hints']].map(([v, t, d]) =>
              `<button class="tiletab ${SB.difficulty === v ? 'on' : ''}" data-diff="${v}"
                style="flex-direction:column;align-items:flex-start;gap:0;padding:10px 16px">
                ${t}<span style="font-size:11px;text-transform:none;letter-spacing:0;font-weight:500;color:#5a6a92">${d}</span></button>`).join('')}
          </div>
          <div class="divider"></div>
          <div class="eyebrow">School level</div>
          <div class="tilebar" style="margin:12px 0 0">
            ${['beginner', 'intermediate', 'advanced', 'expert'].map((lv) =>
              `<button class="tiletab ${SB.level === lv ? 'on' : ''}" style="padding:9px 14px;font-size:13px"
                data-level="${lv}">${cap(lv)}</button>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="eyebrow">Your spelling</div>
          <div class="statline" style="margin-top:10px">
            <div><b>${seen}</b><span>Words seen</span></div>
            <div><b>${mastered}</b><span>Mastered</span></div>
            <div><b>${difficult}</b><span>Tricky</span></div></div>
          <div class="divider"></div>
          <p class="small muted">Words you get wrong come back sooner. Words you master fade into the
            background — that is the whole trick.</p>
        </div>
      </section>

      <section class="card">
        <div class="between"><h2 style="font-size:20px">Word lists</h2>
          <span class="small muted">${words.length} words in this list</span></div>
        <div class="word-lists" style="margin-top:12px">
          ${SB.data.lists.map((l) => {
            const on = l.id === SB.list;
            const topic = l.topic;
            const listWords = SB.data.words.filter((w) => (w.topics || [w.topic]).includes(topic));
            const done = listWords.filter((w) => wordMap[w.w] && wordMap[w.w].box >= 4).length;
            return `<button class="list-card ${on ? 'on' : ''}" data-list="${l.id}">
              <b>${esc(l.name)}</b><span>${listWords.length} words · ${done} mastered</span>
              <div class="progress-dots">${listWords.slice(0, 12).map((w) =>
                `<i class="${wordMap[w.w] ? (wordMap[w.w].box >= 4 ? 'ok' : 'bad') : ''}"></i>`).join('')}</div></button>`;
          }).join('')}
        </div>
        <div class="divider"></div>
        <div class="between"><span class="eyebrow">School level</span></div>
        <div class="filters" style="margin:8px 0 0">
          ${LEVEL_ORDER.map((lv) => `<button class="pill ${SB.level === lv ? 'jade' : ''}" data-level="${lv}">
            ${cap(lv)} · ${levelCounts[lv] || 0}</button>`).join('')}
        </div>
        <div class="row" style="margin-top:16px">
          <button class="btn jade" id="go">${icon('play')} Start ${esc(SB.difficulty)} session</button>
          <span class="small muted" style="align-self:center">10 words, chosen by what you find hard.</span>
        </div>
      </section>
    </div>`;

    main.querySelectorAll('[data-list]').forEach((b) => { b.onclick = () => { SB.list = b.dataset.list; open(); }; });
    main.querySelectorAll('[data-level]').forEach((b) => { b.onclick = () => { SB.level = b.dataset.level; open(); }; });
    main.querySelectorAll('[data-diff]').forEach((b) => { b.onclick = () => { SB.difficulty = b.dataset.diff; open(); }; });
    main.querySelectorAll('[data-locale]').forEach((b) => {
      b.onclick = async () => {
        SB.locale = b.dataset.locale;
        try { await App.API.post('/api/locale', { locale: SB.locale }); } catch (e) {}
        pickVoice(); open();
      };
    });
    main.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => startSession(b.dataset.mode); });
    main.querySelector('#go').onclick = () => startSession('practice');
    main.querySelector('#review').onclick = () => startSession('review');
  }

  window.SPELLBOUND = {
    open, startSession,
    get config() { return SB; },
    get session() { return SB.session; }
  };
})();
