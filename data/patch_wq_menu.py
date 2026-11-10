import re

path = 'public/js/worldquest.js'
s = open(path).read()

# 1) mode tile data, declared once inside the closure
anchor = "  const CONTS = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];"
if 'WQ_ART' not in s:
    s = s.replace(anchor, anchor + """
  const WQ_ART = [
    { id: 'locate', art: 'locate', name: 'FIND THE COUNTRY', sub: 'Name given, click it on the map' },
    { id: 'identify', art: 'identify', name: 'NAME THE COUNTRY', sub: 'One country glows - pick its name' },
    { id: 'capital', art: 'capital', name: 'CAPITAL CITIES', sub: 'Do you know the capital?' },
    { id: 'flag', art: 'flag', name: 'FLAGS', sub: 'Whose flag is this?' },
    { id: 'marathon', art: 'marathon', name: 'MARATHON', sub: '20 countries, timed' },
    { id: 'challenge', art: 'challenge', name: 'THE 196', sub: 'All 196 - the extreme challenge' }
  ];""")

start = s.index('      <section class="card">\n        <div class="between"><h2 style="font-size:20px">Continent</h2>')
end = s.index('      <div class="row"><button class="btn jade" id="start">')

new = '''      <div class="giant" style="margin-top:4px">WHERE IN THE <em style="color:#4aa8ff">WORLD</em>?</div>
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
'''
s = s[:start] + new + s[end:]
open(path, 'w').write(s)
print('WQ menu replaced; WQ_ART present:', 'WQ_ART' in s)
