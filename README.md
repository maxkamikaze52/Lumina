# Astrolab

Three worlds, one explorer. A local educational gaming platform with three games sharing
one player, one XP total, one Starbits wallet, one class ladder and one badge collection.

- **TableStar** — times tables and division at speed, with the original guitar.
- **Spellbound** — listen-and-spell, word lists, adaptive repetition, Word Builder, Missing Letters.
- **WorldQuest** — 196 countries on a real interactive map, capitals, flags, marathon, 196 challenge.

Everything is local: SQLite + a Python standard-library HTTP server. No accounts, no email,
no external services, no real-money purchases.

## Run it

```bash
cd ~/projects/lumina
python3 app.py            # http://127.0.0.1:8807
```

Registered as a launchd service named `astrolab` (survives restarts):
`service_status astrolab` · logs via `service_logs astrolab`.

## Rebuild the datasets

```bash
python3 data/build_world.py    # Natural Earth 50m -> public/data/world.json (196 countries)
python3 data/build_words.py    # spelling library      -> public/data/words.json
```

## Layout

The code is split in two halves that never edit the same file — see
[CONTRIBUTING.md](CONTRIBUTING.md) for the ownership table and how to work in parallel.

| File | Role | Owner |
|---|---|---|
| `app.py` | HTTP server + JSON API (routes, session recording) | games |
| `progression.py` | sessions -> XP/Starbits/classes/badges/leaderboards/statistics | games |
| `tablestar_path.py` | the forced Garage path (test -> study -> mastered) | games |
| `config.py` | classes, Studio speed ranks, reward formulas, badge rules, daily challenges | games |
| `api_shop.py` | buy / character / room routes | shop |
| `catalogue.py` | every shop item, starter kit, default room | shop |
| `store.py` | SQLite schema and access | shop |
| `public/js/games/` | the three games + all game artwork | games |
| `public/js/shop/` | Store, My Character, My Room + avatar/pet/furniture art | shop |
| `public/js/core.js` · `views.js` · `boot.js` | shell, router, Home/Games/Boards/Profile | shared |
| `public/css/games.css` · `shop.css` | game styles / shop styles | games · shop |

## Systems

**XP** is lifetime and never spent. **Starbits** are spendable and never touch XP or rankings.
A session only counts when it is *finished*: leaving early deletes the open session and awards
nothing, timers ending counts as finished, and a repeated submission (same `tag`) returns 409.

**Class ladder** (XP): Newcomer 0 · Student 300 · Junior Scholar 900 · Advanced Student 2,000 ·
Honor Student 3,800 · Academic Champion 6,500 · Professor 10,000 · Headmaster 15,000 ·
Legendary Scholar 22,000.

**Rewards** are tuned per minute of real effort, so no game dominates:
~110 XP/min for a fast maths run, ~93 for a spelling session, ~105 for geography, with the
196 challenge slightly ahead (~138) because it takes 15+ minutes. All formulas live in
`config.compute_reward`, with the multiplier table by difficulty. `config.plausible()` rejects
runs faster than 0.65 s per answer, which keeps the Studio speed board honest.

**Garage = learn, Studio = race.** The Garage forces the order (`tablestar_path.py`): a
3-minute multiplication test over all 1–12, then study of only the tables that test exposed
as weak (you cannot retake the test until those facts are secure), then the test again. Three
good tests in a row (90%+ on 15+ answers, the last one 96%+ and under 3 s an answer) and every
table and division is unlocked for good. **Studio always serves all 12 tables × and ÷** and
never gates anything — it only measures speed.

**Studio speed ranks** are the ladder and the badges at once (`config.STUDIO_CLASSES`, slowest
to fastest): Unsigned Act 9s · Breakthrough Artist 6s · Support Act 4.5s · Headliner 3.4s ·
Rock Star 2.6s · Rock Legend 2s · Rock Hero 1.5s. A rank is your average seconds per correct
answer across your last 10 completed Studio games (total active time ÷ total correct).

**Badges** (38) are all computed from stored data — no decorative ones. Top-10 badges need a
real field of 10+ players on that board.

**Persistence** is SQLite at `data/astrolab.db`. Back it up with `store.backup()`
(writes to `backups/`).

## The three game worlds

Pressing **Enter &lt;game&gt;** does not open a panel — it wipes the screen in the game's colour and
hands the whole window to that game (`#world` in `index.html`, `App.enterWorld/playGame/leaveWorld`
in `core.js`, painted by `public/css/worlds.css`):

- **TableStar** — a warm sunset stage: cream panels, chunky coral keys, the guitar on the right.
- **Spellbound** — a mint garden classroom: white cards, a big round speaker button, golden tiles.
- **WorldQuest** — sky above a turquoise sea: mint-green countries, white coastlines, white controls.

Each world has its own header (Astrolab · game name · live XP/Starbits) and one clear way back
("Astrolab" button, or any nav tab). The platform shell itself is a daylit palette
(`public/css/bright.css`) with the rounded **Fredoka** display face.

## Known limitations

- Speech uses the browser's built-in `SpeechSynthesis` voices; quality varies by machine, and
  a machine with no English voice says so instead of pretending.
- Flags are emoji glyphs (Unicode regional indicators) rather than drawn artwork.
- The room is 2D with depth ordering (3 layers), not a 3D environment.
- The 196-country set is documented in `WORLDQUEST_DATASET.md`, including which disputed
  territories are shown but never asked.
