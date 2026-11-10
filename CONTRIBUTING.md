# Working together on Lumina

Two people, two halves. **Nobody edits a file the other person owns.** If a change
needs something on the other side, use the seam described at the bottom instead of
editing across the line.

## Two halves

| | **Games — Max** | **Shop — friend** |
|---|---|---|
| Python | `app.py` (routes + session recording), `progression.py`, `tablestar_path.py`, `config.py` (classes, rewards, speed ranks, badges) | `api_shop.py`, `catalogue.py`, `store.py` |
| JS | `public/js/games/*` (tablestar, spellbound, worldquest, art-guitar, art-games) | `public/js/shop/*` (views-store = Store/Character/Room, art-avatar, art-pets, art-furniture) |
| CSS | `public/css/games.css`, `public/css/worlds.css` | `public/css/shop.css` |
| Shared, change only by agreement | `public/index.html`, `public/js/core.js`, `public/js/views.js` (Home/Games/Boards/Profile), `public/css/app.css`, `bright.css` | same |

That is the whole rule. `index.html` lists scripts in load order; adding a new file on
your side means adding one line there — tell the other person when you do.

## Why it is split this way

- The Store, **My Character** and **My Room** screens live in `public/js/shop/views-store.js`,
  they draw with `public/js/shop/art-*.js`, and they talk only to `/api/shop/buy`,
  `/api/character` and `/api/room` — all of which are now in **`api_shop.py`**. Item data
  is `catalogue.py`. The shop side can change all of that without touching a game file.
- The three games are their own files, their own CSS (`games.css`), and their rules are
  decided on the server in `progression.py` / `tablestar_path.py` / `config.py`.
- `app.py` no longer contains shop code. It forwards those three routes to
  `api_shop.handle()`, which returns `None` for anything it does not own.

## The seams (how to cross without colliding)

**Shop side adds a screen or a rule:** put the code in `public/js/shop/` and
`api_shop.py`. If you need data the state endpoint does not send yet, ask the games side
to add it to `app.state()` — do not edit `app.py` yourself.

**Games side needs an item:** read `catalogue.ITEM_BY_ID` (server) or
`App.state.catalogue` (browser, already loaded). Never hard-code an item id in a game.

**New shop route:** add it to `ROUTES` and `handle()` in `api_shop.py`. No other file
changes. **New game route:** add it in `app.py` above the shop block.

**Shared file change:** say so in the PR description, and land it on its own so the
other person can pull it before starting work. Small and separate beats big and mixed.

## Branches and pull requests

Do not both push to `main`.

```bash
# once
git clone git@github.com:maxkamikaze52/Lumina.git && cd Lumina

# every time you work
git pull                     # start from what the other person has
git checkout -b shop/new-pets
# ...edit...
git add -A && git commit -m "shop: three new pets"
git push -u origin shop/new-pets
```

Then open a pull request on GitHub and let the other person merge it. `main` stays
working, and neither of you can overwrite the other's files by accident: if you both
touch the same file, git refuses the merge instead of silently replacing anything.

Name branches `shop/...` or `games/...` so it is obvious who owns the PR.

## Run it

```bash
python3 app.py     # http://127.0.0.1:8807
```

The database (`data/astrolab.db`) is **not** in git — it holds real player data. It is
created on first run; to start clean, delete it.

## Checks before pushing

```bash
python3 -m py_compile app.py api_shop.py config.py progression.py store.py catalogue.py tablestar_path.py
for f in public/js/*.js public/js/shop/*.js public/js/games/*.js; do node --check "$f"; done
PYTHONPATH=. python3 data/check_path.py     # Garage path still works
```
