/* Astrolab — views: Home, Games, Leaderboards, Profile. */
(function () {
  'use strict';
  const App = window.App, ART = window.ART, icon = window.icon;
  const views = (window.VIEWS = window.VIEWS || {});
  const esc = App.esc, num = App.num, cap = App.cap;
  const st = () => App.state;

  const heroArt = {
    tablestar: `<svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="ga1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a2036"/><stop offset="1" stop-color="#1e1226"/></linearGradient>
      <linearGradient id="ga2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb27a"/><stop offset="1" stop-color="#c9455a"/></linearGradient></defs>
      <rect width="400" height="180" fill="url(#ga1)"/>
      ${[0,1,2,3,4,5,6,7,8,9].map(i=>`<rect x="${14+i*40}" y="${128-(i%3)*16}" width="5" height="${26+(i%3)*16}" rx="2.5" fill="#ff8a5c" opacity="${0.1+i*0.03}"/>`).join('')}
      <g transform="translate(268 -14) rotate(15) scale(.62)">
        <rect x="44" y="4" width="32" height="44" rx="4" fill="#8a6236"/><rect x="44" y="48" width="32" height="252" fill="#7a5230"/>
        <ellipse cx="60" cy="336" rx="35" ry="30" fill="url(#ga2)"/><ellipse cx="60" cy="402" rx="47" ry="53" fill="url(#ga2)"/>
        <circle cx="60" cy="370" r="14.5" fill="#20180f" stroke="#ffd166" stroke-width="3"/></g>
      <text x="24" y="96" font-family="Bricolage Grotesque,sans-serif" font-size="58" font-weight="800" fill="#fff6e5" opacity=".95">8×7</text>
      <text x="24" y="128" font-family="Outfit,sans-serif" font-size="15" fill="#ffb99d">= ?</text></svg>`,
    spellbound: `<svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="gb1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#123a33"/><stop offset="1" stop-color="#0f1d2c"/></linearGradient></defs>
      <rect width="400" height="180" fill="url(#gb1)"/>
      <g opacity=".9">${['n','e','c','e','s','s','a','r','y'].map((ch,i)=>`<g transform="translate(${34+i*37} ${86+(i%2)*10})">
        <rect width="30" height="34" rx="5" fill="#f5efe1"/><text x="15" y="24" font-family="Bricolage Grotesque,sans-serif" font-size="19" font-weight="700" fill="#20243a" text-anchor="middle">${ch}</text></g>`).join('')}</g>
      <circle cx="330" cy="52" r="26" fill="none" stroke="#2ec4a6" stroke-width="2" opacity=".7"/>
      <path d="M320 52h20M330 42v20" stroke="#2ec4a6" stroke-width="2" opacity=".7"/></svg>`,
    worldquest: `<svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><radialGradient id="gw1"><stop offset="0" stop-color="#2f6f96"/><stop offset="1" stop-color="#122740"/></radialGradient></defs>
      <rect width="400" height="180" fill="url(#gw1)"/>
      <g opacity=".85" transform="translate(60 20) scale(1.5)">
        <path d="M20 40l26-14 22 8-6 18 14 12-12 16-24-2-10 12-18-16 8-18z" fill="#2f7d6b" stroke="#7fd6c0" stroke-width="1"/>
        <path d="M96 22l30 6 8 20-14 10 6 16 20 4-8 18-26-6-10-22 8-16-14-10z" fill="#2a4a63" stroke="#5f89a8" stroke-width="1"/>
        <path d="M156 62l24 2 8 18-10 14-20-4-6-16z" fill="#2a4a63" stroke="#5f89a8" stroke-width="1"/>
        <path d="M52 110l22 6 4 16-24 6-10-16z" fill="#2a4a63" stroke="#5f89a8" stroke-width="1"/>
      </g>
      <circle cx="303" cy="84" r="34" fill="none" stroke="#6fb3ff" stroke-width="1.6" opacity=".8"/>
      <path d="M303 50v68M269 84h68" stroke="#6fb3ff" stroke-width="1" opacity=".5"/>
      <circle cx="316" cy="72" r="4" fill="#ffc247"/></svg>`
  };

  const gameMeta = {
    tablestar: { tag: 'Mathematics', colour: 'var(--ts)', desc: 'Times tables and division at speed, with a guitar that fills up as you play.' },
    spellbound: { tag: 'Spelling', colour: 'var(--sb)', desc: 'Listen, spell, and master word lists — including the words that beat you.' },
    worldquest: { tag: 'Geography', colour: 'var(--wq)', desc: 'Find countries, capitals and flags on a real interactive map of the world.' }
  };

  function badgesFor(state, game) {
    return state.badges.filter((b) => b.game === game);
  }

  function overallRank(state, game) {
    const rows = state.leaderboards[game].all;
    const me = rows.find((r) => r.id === state.player.id);
    return me ? me.rank : null;
  }

  /* ------------------------------------------------------------ home --- */
  views.home = async function (main) {
    const s = st(), p = s.player, cls = s.stats.class;
    const lb = s.leaderboards.overall.all;
    const rank = (lb.find((r) => r.id === p.id) || {}).rank;
    const recent = s.stats.recent.slice(0, 4);
    const unlocked = s.badges.filter((b) => b.unlocked).slice(-5).reverse();
    const daily = s.daily || [];
    const doneDaily = daily.filter((d) => d.claimed).length;

    main.innerHTML = `<div class="stack">
      <section class="hero">
        <div>
          <div class="eyebrow">${icon('compass')} ${esc(s.platform.name)} · Level ${cls.n} · ${esc(cls.title)}</div>
          <h1 style="margin-top:8px">Welcome back,<br><em>${esc(p.name)}</em></h1>
          <div class="classbar">
            <div class="between small">
              <span class="muted">${cls.next ? `Next: Level ${cls.next.n} · ${esc(cls.next.title)}` : 'Top of the ladder'}</span>
              <span><b class="num">${num(p.xp)}</b> XP${cls.next ? ` · ${num(cls.toNext)} to go` : ''}</span></div>
            <div class="track lvl"><i style="width:${cls.pct}%"></i></div>
            <div class="lvl-strip">
              ${(s.stats.stages || []).map((st) => `<span class="lvl-pip stage ${st.from <= cls.n ? 'on' : ''}
                ${st.from <= cls.n && cls.n <= st.to ? 'me' : ''}"
                title="${esc(st.name)} · levels ${st.from}–${st.to}">
                <span style="display:contents;--glow:${ART.crestGlow(st.to)}">${ART.levelCrest(st.to, { size: 46, locked: st.from > cls.n })}</span></span>`).join('')}
            </div>
            <div class="statline">
              <div><b>${num(p.starbits)}</b><span>Starbits</span></div>
              <div><b>${s.stats.sessions}</b><span>Games finished</span></div>
              <div><b>${s.badges.filter((b) => b.unlocked).length}</b><span>Badges</span></div>
              <div><b>${rank ? '#' + rank : '—'}</b><span>Overall rank</span></div>
            </div>
          </div>
        </div>
        <div class="hero-figure"><div class="ring"></div><div class="ring b"></div>
          <div class="framed-avatar">
            ${ART.avatarFrame(cls.n, { size: 240 })}
            <div class="framed-inner">${ART.avatar(p.character, { label: p.name + ' character' })}</div>
          </div>
        </div>
      </section>

      <section class="grid g3">
        <div class="card">
          <div class="between"><div><div class="eyebrow">Today</div><h3 style="margin-top:4px">Daily challenges</h3></div>
            <span class="pill jade">${doneDaily}/${daily.length}</span></div>
          <div class="stack" style="gap:10px;margin-top:14px">
            ${daily.map((d) => `<div>
              <div class="between small"><span>${esc(d.text)}</span>
                <span class="muted">${d.progress}/${d.goal}</span></div>
              <div class="track" style="height:7px;border-radius:99px;background:rgba(255,255,255,.1);margin-top:6px;overflow:hidden">
                <i style="display:block;height:100%;width:${Math.min(100, (d.progress / d.goal) * 100)}%;background:${d.done ? 'var(--jade)' : 'var(--amber)'}"></i></div>
              ${d.claimed ? '<p class="small" style="color:var(--jade);margin-top:4px">Collected ✓</p>'
                : d.done ? `<button class="btn jade sm block" style="margin-top:6px" data-claim="${d.idx}">
                    Collect +${d.xp} XP · +${d.bits} Starbits</button>` : ''}
            </div>`).join('')}
          </div>
          <button class="btn ghost sm block" style="margin-top:14px" data-nav="games">Play something</button>
        </div>

        <div class="card">
          <div class="eyebrow">Recently played</div>
          <div class="stack" style="gap:10px;margin-top:10px">
            ${recent.length ? recent.map((r) => `<div class="between small" style="gap:8px">
              <div><b style="font-family:var(--display)">${esc(App.LABEL[r.game])}</b>
                <span class="muted"> · ${esc(cap(r.mode))}</span><br>
                <span class="muted">${App.fmtShort(r.finished)} · ${r.correct}/${r.total} · ${r.accuracy}%</span></div>
              <div style="text-align:right"><b class="num" style="color:var(--jade)">+${r.xp}</b><br>
                <span class="muted">XP</span></div></div>`).join('')
              : '<div class="empty small">No games finished yet — your first run sets your baseline.</div>'}
          </div>
        </div>

        <div class="card">
          <div class="eyebrow">Latest achievements</div>
          <div class="stack" style="gap:10px;margin-top:10px">
            ${unlocked.length ? unlocked.map((b) => `<div class="row" style="gap:10px;flex-wrap:nowrap;align-items:center">
              <div class="medal" style="margin:0;width:32px;height:32px">${icon(b.icon)}</div>
              <div class="small"><b>${esc(b.name)}</b><br><span class="muted">${esc(b.desc)}</span></div>
            </div>`).join('') : '<div class="empty small">Finish a game to unlock your first badges.</div>'}
          </div>
          <button class="btn ghost sm block" style="margin-top:14px" data-nav="profile">All badges</button>
        </div>
      </section>

      <section class="card">
        <div class="between"><div><div class="eyebrow">Featured challenge</div>
          <h3 style="margin-top:4px">${s.stats.summary.wq.mastered >= 150 ? 'The 196 challenge is within reach' : 'Build your world map'}</h3></div>
          <button class="btn sm" data-nav="games">${icon('play')} Go</button></div>
        <p class="lead" style="margin-top:10px">You have mastered <b>${s.stats.summary.wq.mastered}</b> of 196 countries.
          ${s.stats.summary.sb.mastered} words are marked mastered, and your Studio speed class is
          <b>${esc(s.stats.studio.class.name)}</b>.</p>
      </section>
    </div>`;

    main.querySelectorAll('[data-claim]').forEach((b) => {
      b.onclick = async () => {
        try {
          const r = await App.API.post('/api/daily/claim', { idx: Number(b.dataset.claim) });
          App.toast(r.message, 'bit');
          if (r.badges && r.badges.length) App.celebrate(r.badges);
          await App.reload();
          App.render({ keepScroll: true });
        } catch (e) { App.toast(e.message, 'x'); }
      };
    });
  };

  /* ----------------------------------------------------------- games --- */
  views.games = async function (main) {
    const s = st();
    const cards = ['tablestar', 'spellbound', 'worldquest'].map((g) => {
      const m = gameMeta[g];
      const b = badgesFor(s, g);
      const got = b.filter((x) => x.unlocked).length;
      const rank = overallRank(s, g);
      const sum = s.stats.summary;
      const prog = g === 'tablestar' ? Math.min(1, (sum.ts.mult + sum.ts.div) / 400)
        : g === 'spellbound' ? Math.min(1, sum.sb.mastered / 90)
          : Math.min(1, sum.wq.mastered / 196);
      const best = g === 'tablestar' ? `${sum.ts.runs} runs`
        : g === 'spellbound' ? `${sum.sb.correct} correct`
          : `${sum.wq.identified} identified`;
      return `<article class="game-card" style="--g1:#1b2244;--gaccent:${m.colour}">
        <div class="game-art">${heroArt[g]}</div>
        <div class="game-body">
          <div class="game-tag">${m.tag}</div>
          <h3>${App.LABEL[g]}</h3>
          <p class="small muted">${m.desc}</p>
          <div class="meter"><i style="width:${(prog * 100).toFixed(0)}%"></i></div>
          <div class="game-meta">
            <span><b>${best}</b></span>
            <span>${rank ? 'Rank <b>#' + rank + '</b>' : 'Unranked'}</span>
            <span><b>${got}</b>/${b.length} badges</span>
          </div>
          <div class="game-foot">
            <div class="medals">${b.filter((x) => x.unlocked).slice(0, 5).map((x) => `<span class="medal" title="${esc(x.name)}">${icon(x.icon)}</span>`).join('') || '<span class="small muted">No badges yet</span>'}</div>
            <button class="btn sm" data-open="${g}">${icon('play')} Enter ${App.LABEL[g]}</button>
          </div>
        </div></article>`;
    }).join('');

    main.innerHTML = `<div class="stack">
      <div class="between"><div><div class="eyebrow">The academy</div><h1 style="margin-top:4px">Three worlds</h1>
        <p class="lead" style="margin-top:6px">Every game feeds the same XP, Starbits, class and badges.</p></div></div>
      <section class="grid" style="grid-template-columns:repeat(auto-fit,minmax(290px,1fr))">${cards}</section>
      <section class="card flat small muted">More games can be added to this library as plugins: each one
        reports finished sessions through the same shared reward service, so progression never forks.</section>
    </div>`;
    main.querySelectorAll('[data-open]').forEach((b) => {
      b.onclick = () => App.openGame(b.dataset.open);
    });
  };

  /* ---------------------------------------------------------- boards --- */
  const boardState = { game: 'overall', period: 'all' };

  views.boards = async function (main) {
    const s = st();
    let data;
    try { data = await App.API.get('/api/leaderboard?period=' + boardState.period); } catch (e) { data = s.leaderboards; }
    const rows = (data[boardState.game] || { all: [] }).all || [];
    const me = s.player.id;
    const top3 = rows.slice(0, 3);
    const podOrder = [top3[1], top3[0], top3[2]];

    const cols = {
      overall: ['Total XP', (r) => num(r.value)],
      tablestar: ['XP', (r) => num(r.value)],
      spellbound: ['XP', (r) => num(r.value)],
      worldquest: ['XP', (r) => num(r.value)]
    };
    main.innerHTML = `<div class="stack">
      <div class="between">
        <div><div class="eyebrow">Leaderboards</div><h1 style="margin-top:4px">The academy ranking</h1></div>
        <div class="segbar" id="period">${['all', 'monthly', 'weekly'].map((p) =>
          `<button data-p="${p}" class="${boardState.period === p ? 'on' : ''}">${p === 'all' ? 'All-time' : cap(p)}</button>`).join('')}</div>
      </div>
      <div class="segbar" id="game" style="flex-wrap:wrap">${['overall', 'tablestar', 'spellbound', 'worldquest'].map((g) =>
        `<button data-g="${g}" class="${boardState.game === g ? 'on' : ''}">${g === 'overall' ? 'Overall' : App.LABEL[g]}</button>`).join('')}</div>

      ${top3.length ? `<section class="podium">
        ${podOrder.map((r) => r ? `<div class="pod ${r.rank === 1 ? 'first' : ''}" style="--pc:${r.rank === 1 ? 'var(--amber)' : r.rank === 2 ? '#cfd6ee' : 'var(--coral)'}">
          <span class="rangep">#${r.rank}</span>
          <div class="face">${ART.avatar(r.character, { background: false })}</div>
          <b>${esc(r.name)}</b><span class="val">${num(r.value)} XP</span><br>
          <span class="small muted">${esc(r.class.name)}</span></div>` : '<div></div>').join('')}
      </section>` : ''}

      <section class="card" style="padding:10px 6px">
        <table class="lb"><thead><tr><th>#</th><th>Player</th><th class="hide-sm">Class</th>
          <th>${cols[boardState.game][0]}</th>${boardState.game === 'tablestar' ? '<th class="hide-sm">Studio</th>' : ''}
          ${boardState.game === 'spellbound' ? '<th class="hide-sm">Mastered</th>' : ''}
          ${boardState.game === 'worldquest' ? '<th class="hide-sm">Countries</th>' : ''}
          <th class="hide-sm">Games</th></tr></thead><tbody>
          ${rows.length ? rows.map((r) => `<tr class="${r.id === me ? 'me' : ''}">
            <td class="rank">${r.rank}</td>
            <td><div class="who"><span class="face">${ART.avatar(r.character, { background: false })}</span>
              <span>${esc(r.name)}${r.id === me ? ' <span class="pill jade">you</span>' : ''}</span></div></td>
            <td class="hide-sm">${esc(r.class.name)}</td>
            <td class="num">${num(r.value)}</td>
            ${boardState.game === 'tablestar' ? `<td class="hide-sm">${r.studioAvg ? r.studioAvg + 's · ' + esc(r.studioClass) : '—'}</td>` : ''}
            ${boardState.game === 'spellbound' ? `<td class="hide-sm">${r.mastered || 0}</td>` : ''}
            ${boardState.game === 'worldquest' ? `<td class="hide-sm">${r.countries || 0}</td>` : ''}
            <td class="hide-sm">${r.games || 0}</td></tr>`).join('')
            : '<tr><td colspan="7" class="muted small" style="padding:20px">No finished games in this window yet.</td></tr>'}
        </tbody></table>
      </section>
      <p class="small muted">Only finished sessions count. Weekly resets on Monday 00:00 and monthly on
        the 1st (your local time). Starbits spending never touches these numbers.</p>
      ${boardState.game === 'tablestar' ? '<section id="studio" class="stack"></section>' : ''}
    </div>`;

    main.querySelectorAll('#period [data-p]').forEach((b) => {
      b.onclick = () => { boardState.period = b.dataset.p; App.render(); };
    });
    main.querySelectorAll('#game [data-g]').forEach((b) => {
      b.onclick = () => { boardState.game = b.dataset.g; App.render(); };
    });
    if (boardState.game === 'tablestar') await studioPanel(main.querySelector('#studio'));
  };

  async function studioPanel(host) {
    if (!host) return;
    const d = await App.API.get('/api/studio');
    const c = d.class;
    host.innerHTML = `<section class="card">
      <div class="between"><div><div class="eyebrow">Studio speed ranking</div>
        <h3 style="margin-top:4px">${esc(c.name)}</h3></div>
        <span class="pill amber">${d.runs}/10 runs${d.remaining ? ` · ${d.remaining} to establish` : ''}</span></div>
      <p class="small muted" style="margin-top:8px">Average seconds per correct answer over your last 10
        completed Studio runs${d.avg ? `: <b style="color:var(--paper)">${d.avg}s</b>` : ' — no correct answers yet'}.</p>
      ${d.previous.avg && d.avg ? `<p class="small ${d.avg < d.previous.avg ? 'pill jade' : 'pill coral'}" style="margin-top:8px">
        ${d.avg < d.previous.avg ? 'Improving' : 'Slower'} than the previous 10 runs (${d.previous.avg}s)</p>` : ''}
      <div class="divider"></div>
      <table class="lb"><thead><tr><th>#</th><th>Player</th><th>Avg / correct</th><th class="hide-sm">Class</th><th class="hide-sm">Runs</th></tr></thead><tbody>
        ${d.board.length ? d.board.slice(0, 10).map((r) => `<tr class="${r.id === st().player.id ? 'me' : ''}">
          <td class="rank">${r.rank}</td><td><div class="who"><span class="face">${ART.avatar(r.character, { background: false })}</span>${esc(r.name)}</div></td>
          <td class="num">${r.avg}s</td><td class="hide-sm">${esc(r.class)}</td><td class="hide-sm">${r.runs}</td></tr>`).join('')
          : '<tr><td colspan="5" class="muted small">No established Studio runs yet — be the first.</td></tr>'}
      </tbody></table></section>`;
  }
  App.studioPanel = studioPanel;

  /* --------------------------------------------------------- profile --- */
  views.profile = async function (main) {
    const s = st(), p = s.player, cls = s.stats.class, sum = s.stats.summary;
    const byGame = { platform: [], tablestar: [], spellbound: [], worldquest: [] };
    s.badges.forEach((b) => (byGame[b.game] || byGame.platform).push(b));
    const classIdx = s.classes.findIndex((c) => c.id === cls.id);
    main.innerHTML = `<div class="stack">
      <section class="card">
        <div class="between" style="align-items:flex-start">
          <div class="row" style="gap:18px;align-items:center;flex-wrap:nowrap">
            <div class="framed-avatar small">${ART.avatarFrame(cls.n, { size: 96 })}
              <div class="framed-inner">${ART.avatar(p.character, { background: false })}</div></div>
            <div><h1 style="font-size:30px">${esc(p.name)}</h1>
              <div class="row" style="gap:8px;margin-top:6px">
                <span class="pill amber">${esc(cls.name)}</span>
                <span class="pill">${num(p.xp)} XP</span>
                <span class="pill">${num(p.starbits)} Starbits</span>
                <span class="pill">${s.stats.sessions} games</span></div></div>
          </div>
          <button class="btn ghost sm" id="rename">${icon('pencil')} Rename</button>
        </div>
        <div class="classbar"><div class="track"><i style="width:${cls.pct}%"></i></div>
          <div class="between small muted"><span>Level ${cls.n} · ${esc(cls.title)}</span>
          <span>${cls.next ? 'Level ' + cls.next.n + ' in ' + num(cls.toNext) + ' XP' : 'Top of the ladder'}</span></div></div>
        <div class="divider"></div>
        <h3 style="margin-bottom:10px">The 20 levels</h3>
        ${(s.stats.stages || []).map((st) => `
          <div class="stage-block">
            <div class="stage-head ${st.from <= cls.n && cls.n <= st.to ? 'me' : ''}">
              <b>${esc(st.name)}</b>
              <span>levels ${st.from}–${st.to}${st.xp ? ' · ' + num(st.xp) + ' XP' : ''}</span>
            </div>
            <div class="lvl-ladder">${s.classes.slice(st.from - 1, st.to).map((c, k) => `<div class="lvl-card ${c.n < cls.n ? 'done' : c.n === cls.n ? 'me' : 'todo'}"
              style="--glow:${ART.crestGlow(c.n)}"
              title="Level ${c.n} · ${esc(c.title)} — ${num(c.xp)} XP">
              ${ART.levelCrest(c.n, { size: 96, locked: c.n > cls.n })}
              <b>${esc(c.title)}</b>
              <span>${c.n === 1 ? 'start' : num(c.xp) + ' XP'}</span></div>`).join('')}</div>
          </div>`).join('')}
      </section>

      <section class="grid g3">
        <div class="card"><div class="eyebrow">TableStar</div><h3 style="margin:4px 0 10px">Maths fluency</h3>
          <div class="small muted">${sum.ts.runs} runs · ${sum.ts.mult} multiplication and ${sum.ts.div} division answers correct.</div>
          <div class="divider"></div>
          <div class="small">Tables answered correctly: ${sum.ts.tables.length ? sum.ts.tables.join(', ') : '—'}</div>
          <div class="small" style="margin-top:6px">Studio class: <b>${esc(sum.ts.studio.name)}</b>${sum.ts.avg ? ` · ${sum.ts.avg.toFixed(2)}s per correct` : ''}</div>
        </div>
        <div class="card"><div class="eyebrow">Spellbound</div><h3 style="margin:4px 0 10px">Spelling mastery</h3>
          <div class="small muted">${sum.sb.sessions} sessions · ${sum.sb.correct} correct · ${sum.sb.seen} different words attempted.</div>
          <div class="divider"></div>
          <div class="small">Mastered: <b>${sum.sb.mastered}</b> words · best streak ${sum.sb.best_streak}</div>
          <div class="small" style="margin-top:6px">Extreme best accuracy: ${sum.sb.extreme_best ? sum.sb.extreme_best + '%' : '—'}</div>
        </div>
        <div class="card"><div class="eyebrow">WorldQuest</div><h3 style="margin:4px 0 10px">Geographical mastery</h3>
          <div class="small muted">${sum.wq.identified} countries identified · ${sum.wq.capitals} capitals · ${sum.wq.flags} flags.</div>
          <div class="divider"></div>
          <div class="stack" style="gap:8px">${Object.entries(s.stats.perContinent).map(([cont, v]) => `<div>
            <div class="between small"><span>${cont}</span><span class="muted">${v.mastered}/${v.total}</span></div>
            <div class="track" style="height:6px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden;margin-top:4px">
              <i style="display:block;height:100%;width:${(v.mastered / v.total * 100).toFixed(0)}%;background:var(--wq)"></i></div>
          </div>`).join('')}</div>
        </div>
      </section>

      ${['platform', 'tablestar', 'spellbound', 'worldquest'].map((g) => `<section>
        <div class="between"><h2 style="font-size:22px">${g === 'platform' ? 'Platform achievements' : App.LABEL[g] + ' badges'}</h2>
          <span class="small muted">${byGame[g].filter((b) => b.unlocked).length}/${byGame[g].length}</span></div>
        <div class="badge-grid" style="margin-top:12px">
          ${byGame[g].map((b) => {
            const r = b.rarity || {};
            const prestige = b.prestige ? ` pre-${b.prestige}` : '';
            const ring = b.prestige
              ? `<span class="pre-ring">${'★'.repeat(b.prestige)}</span>` : '';
            return `<div class="badge ${b.unlocked ? '' : 'locked'}${prestige}" title="${esc(b.desc)}">
              ${ring}
              <div class="hex">${icon(b.icon)}</div>
              <b>${esc(b.name)}</b>
              <span class="badge-desc">${esc(b.desc)}</span>
              <span class="rarity ${r.pct >= 100 ? 'all' : r.pct <= 5 ? 'rare' : ''}">
                ${r.pct != null ? (r.pct === 100 ? 'everyone has it' : r.pct + '% of students') : ''}
                ${r.label && r.pct !== 100 ? `<i>${esc(r.label)}</i>` : ''}
              </span></div>`;
          }).join('')}
        </div></section>`).join('')}

      <section class="card"><div class="eyebrow">Session history</div>
        <table class="lb" style="margin-top:8px"><thead><tr><th>Game</th><th class="hide-sm">Mode</th><th>Score</th>
          <th>Accuracy</th><th>XP</th><th class="hide-sm">When</th></tr></thead><tbody>
          ${s.stats.recent.map((r) => `<tr><td>${App.LABEL[r.game]}</td><td class="hide-sm">${esc(cap(r.mode))}</td>
            <td class="num">${r.correct}/${r.total}</td><td>${r.accuracy}%</td>
            <td class="num" style="color:var(--jade)">+${r.xp}</td>
            <td class="hide-sm muted">${App.fmtShort(r.finished)} ${App.fmtTime ? '' : ''}</td></tr>`).join('')
            || '<tr><td colspan="6" class="muted small" style="padding:16px">Nothing finished yet.</td></tr>'}
        </tbody></table></section>
    </div>`;

    main.querySelector('#rename').onclick = () => {
      App.modal(`<h2>Display name</h2><p class="small muted" style="margin:8px 0 14px">This is the only
        name other players see. Use a nickname, not a real name.</p>
        <input id="nn" maxlength="18" value="${esc(p.name)}" style="width:100%;padding:14px;border-radius:12px;
          background:rgba(0,0,0,.3);border:2px solid rgba(255,255,255,.16);color:#fffaf0;font-size:18px">
        <div class="row" style="margin-top:14px"><button class="btn" id="save">Save</button>
        <button class="btn ghost" data-close>Cancel</button></div>`, (sheet) => {
        sheet.querySelector('#save').onclick = async () => {
          const name = sheet.querySelector('#nn').value.trim();
          await App.API.patch('/api/player', { name });
          await App.reload(); App.closeModal(); App.render();
        };
      });
    };
  };
})();
