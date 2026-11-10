#!/usr/bin/env python3
"""Astrolab — local server.

Serves the single-page app from public/ and a JSON API.  Every reward, purchase,
badge and leaderboard number is computed here; the browser only renders.
"""
from __future__ import annotations

import json, mimetypes, os, re, secrets, sys, threading, time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

import catalogue
import config
import progression
import store
import api_shop
import tablestar_path

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(HERE, "public")
PORT = int(os.environ.get("ASTROLAB_PORT", "8807"))

store.init()

GAMES = {"tablestar": {"sound", "studio", "garage"},
         "spellbound": {"practice", "builder", "missing", "review"},
         "worldquest": {"locate", "identify", "capital", "flag", "marathon", "challenge"}}


def sanitise_name(raw) -> str:
    name = re.sub(r"[^\w\s'.-]", "", str(raw or "")).strip()
    return name[:18] or "Explorer"


# --------------------------------------------------------------------------- #
# API
# --------------------------------------------------------------------------- #
def api(path: str, method: str, body: dict, player: dict | None, q: dict) -> tuple[int, dict]:
    pid = player["id"] if player else None

    if path == "/api/player" and method == "POST":
        if player:
            return 200, {"player": player}
        name = sanitise_name(body.get("name"))
        p = store.create_player(name)
        return 200, {"player": p, "token": p["token"]}

    if path == "/api/player" and method == "PATCH":
        if not player:
            return 401, {"error": "no player"}
        name = sanitise_name(body.get("name"))
        with store.db() as con:
            con.execute("UPDATE players SET name=? WHERE id=?", (name, pid))
        if body.get("locale") in ("GB", "US"):
            store.save_locale(pid, body["locale"])
        progression.evaluate_badges(pid)
        return 200, state(pid)

    if not player:
        return 401, {"error": "no player"}

    if path == "/api/state":
        return 200, state(pid)

    # ---- shop side: buying, characters, rooms (api_shop.py) --------------
    handled = api_shop.handle(path, method, body, pid, player)
    if handled is not None:
        return handled

    if path == "/api/session/start" and method == "POST":
        game = body.get("game")
        mode = str(body.get("mode") or "")
        if game not in GAMES or mode not in GAMES[game]:
            return 400, {"error": "unknown game or mode"}
        difficulty = str(body.get("difficulty") or "normal")[:20]
        sid = store.open_session(pid, game, mode, difficulty, body.get("meta"))
        return 200, {"sessionId": sid, "startedAt": store.now()}

    if path == "/api/session/abandon" and method == "POST":
        sid = str(body.get("sessionId") or "")
        with store.db() as con:
            con.execute("DELETE FROM sessions WHERE id=? AND player_id=? AND finished IS NULL",
                        (sid, pid))
        return 200, {"abandoned": True}

    if path == "/api/session/complete" and method == "POST":
        return complete_session(pid, body)

    if path == "/api/daily/claim" and method == "POST":
        ok, msg, extra = progression.claim_daily(pid, int(body.get("idx", -1)))
        return (200 if ok else 400), {"ok": ok, "message": msg,
                                      "daily": progression.daily(pid), **(extra or {})}

    if path == "/api/badges":
        return 200, {"badges": progression.badge_list(pid)}

    if path == "/api/leaderboard":
        period = q.get("period", "all")
        if period not in ("all", "monthly", "weekly"):
            period = "all"
        return 200, progression.leaderboards(period)

    if path == "/api/studio":
        return 200, studio_table(pid)

    if path == "/api/tablestar/path":
        return 200, tablestar_path.plan(pid)

    if path == "/api/tablestar/plan":
        # the Garage (learning, forced) + the Studio ranks (speed, full deck)
        p = tablestar_path.plan(pid)
        p["ranks"] = config.rank_ladder()
        return 200, p

    if path == "/api/stats":
        return 200, progression.stats(pid)

    if path == "/api/locale" and method == "POST":
        if body.get("locale") in ("GB", "US"):
            store.save_locale(pid, body["locale"])
        return 200, {"locale": body.get("locale")}

    return 404, {"error": "not found"}


def state(pid: str) -> dict:
    p = store.get(pid)
    owned = sorted(store.owned(pid))
    return {
        "player": {k: v for k, v in p.items()},
        "catalogue": catalogue.public_catalogue(),
        "classes": config.CLASSES,
        "studioClasses": config.STUDIO_CLASSES,
        "badges": progression.badge_list(pid),
        "badgeCatalogue": [{k: b[k] for k in ("id", "name", "desc", "game", "icon")}
                           for b in config.BADGES],
        "daily": progression.daily(pid),
        "stats": progression.stats(pid),
        "leaderboards": progression.leaderboards("all"),
        "owned": owned,
        "games": list(GAMES),
        "platform": config.PLATFORM,
    }


def studio_table(pid: str) -> dict:
    """Studio speed ranking over the player's last 10 completed runs."""
    runs = store.studio_runs(pid, 10)
    tc = sum(r["correct"] or 0 for r in runs)
    td = sum(r["duration"] or 0 for r in runs)
    avg = (td / tc) if tc else None
    cls = config.studio_class(avg)
    prev_avg = None
    if len(runs) >= 10:
        older = store.studio_runs(pid, 20)[10:]
        oc = sum(r["correct"] or 0 for r in older)
        od = sum(r["duration"] or 0 for r in older)
        prev_avg = (od / oc) if oc else None
    # the whole academy's studio board, same formula
    board = []
    for other in store.list_public():
        r = store.studio_runs(other["id"], 10)
        c = sum(x["correct"] or 0 for x in r)
        d = sum(x["duration"] or 0 for x in r)
        if c == 0:
            continue
        board.append({"id": other["id"], "name": other["name"], "avg": round(d / c, 2),
                      "correct": c, "runs": len(r),
                      "character": other["character"],
                      "class": config.studio_class(d / c)["name"]})
    board.sort(key=lambda x: (x["avg"], -x["correct"]))
    for i, row in enumerate(board):
        row["rank"] = i + 1
    return {"avg": round(avg, 2) if avg else None, "class": cls,
            "runs": len(runs), "remaining": max(0, 10 - len(runs)),
            "previous": {"avg": round(prev_avg, 2) if prev_avg else None},
            "board": board[:50],
            "history": [{"at": r["finished"], "correct": r["correct"],
                         "duration": round(r["duration"] or 0, 1),
                         "avg": round((r["duration"] or 0) / max(1, r["correct"] or 1), 2),
                         "accuracy": r["accuracy"], "xp": r["xp"]}
                        for r in runs]}


def complete_session(pid: str, body: dict) -> tuple[int, dict]:
    sid = str(body.get("sessionId") or "")
    tag = str(body.get("tag") or "")[:64]
    if tag and store.find_session(pid, tag):
        return 409, {"error": "duplicate", "message": "This run was already recorded."}
    s = store.find_open(pid, sid)
    if not s:
        return 400, {"error": "no open session", "message": "That session was not started here."}

    game, mode = s["game"], s["mode"]
    meta = body.get("meta") or {}
    try:
        correct = max(0, int(body.get("correct", 0)))
        total = max(0, int(body.get("total", 0)))
        score = max(0, int(body.get("score", correct)))
        duration = float(body.get("duration", 0))
    except (TypeError, ValueError):
        return 400, {"error": "bad numbers"}
    total = min(total, 400)          # a 196-country run plus retries
    correct = min(correct, total)
    duration = min(max(duration, 0.1), 3 * 3600)
    score = min(score, 100000)
    if not body.get("completed", False):
        with store.db() as con:
            con.execute("DELETE FROM sessions WHERE id=?", (sid,))
        return 400, {"error": "abandoned", "message": "Unfinished runs are not recorded."}

    ok, why = config.plausible(correct, total, duration)
    if not ok:
        with store.db() as con:
            con.execute("DELETE FROM sessions WHERE id=?", (sid,))
        return 400, {"error": "implausible", "message": why}

    accuracy = round((correct / total) * 100, 1) if total else 0.0
    difficulty = s["difficulty"] or "normal"
    reward = config.compute_reward(game, mode, difficulty, correct, total, duration)
    xp, bits = reward["xp"], reward["starbits"]

    details = body.get("details") or {}
    flags_gained = []
    with store.db() as con:
        # ---- per-game detail tables (these drive mastery + badges) ----------
        if game == "tablestar":
            for f in (details.get("facts") or [])[:400]:
                fact = str(f.get("f"))[:12]
                good = bool(f.get("ok"))
                ms = float(f.get("ms") or 0)
                if not fact:
                    continue
                row = con.execute(
                    "SELECT correct,wrong,ms FROM perfacts WHERE player_id=? AND fact=?",
                    (pid, fact)).fetchone()
                if row:
                    con.execute(
                        "UPDATE perfacts SET correct=correct+?,wrong=wrong+?,ms=?"
                        " WHERE player_id=? AND fact=?",
                        (1 if good else 0, 0 if good else 1,
                         (row["ms"] * 0.6 + ms * 0.4) if row["ms"] else ms, pid, fact))
                else:
                    con.execute("INSERT INTO perfacts VALUES(?,?,?,?,?)",
                                (pid, fact, 1 if good else 0, 0 if good else 1, ms))
        if game == "spellbound":
            for w in (details.get("words") or [])[:200]:
                word = str(w.get("w"))[:40]
                if not word:
                    continue
                good = bool(w.get("ok"))
                row = con.execute(
                    "SELECT attempts,correct,wrong,streak,box FROM wordstats"
                    " WHERE player_id=? AND word=?", (pid, word)).fetchone()
                if row:
                    streak = (row["streak"] + 1) if good else 0
                    box = min(5, row["box"] + 1) if good else 1
                    con.execute(
                        "UPDATE wordstats SET attempts=attempts+1,correct=correct+?,"
                        "wrong=wrong+?,streak=?,box=?,last=? WHERE player_id=? AND word=?",
                        (1 if good else 0, 0 if good else 1, streak, box,
                         store.now(), pid, word))
                else:
                    con.execute("INSERT INTO wordstats VALUES(?,?,?,?,?,?,?,?)",
                                (pid, word, 1, 1 if good else 0, 0 if good else 1,
                                 1 if good else 0, 1 if good else 1, store.now()))
        if game == "worldquest":
            for c in (details.get("countries") or [])[:400]:
                name = str(c.get("n"))[:60]
                if name not in {x["name"] for x in progression.countries()}:
                    continue
                good = bool(c.get("ok"))
                row = con.execute(
                    "SELECT asked,correct FROM countrystats WHERE player_id=? AND country=?",
                    (pid, name)).fetchone()
                if row:
                    con.execute("UPDATE countrystats SET asked=asked+1,correct=correct+?,last=?"
                                " WHERE player_id=? AND country=?",
                                (1 if good else 0, store.now(), pid, name))
                else:
                    con.execute("INSERT INTO countrystats VALUES(?,?,?,?,?)",
                                (pid, name, 1, 1 if good else 0, store.now()))
            for c in (details.get("capitals") or [])[:200]:
                name = str(c.get("n"))[:60]
                if not name:
                    continue
                good = bool(c.get("ok"))
                row = con.execute(
                    "SELECT correct,wrong FROM capitalstats WHERE player_id=? AND country=?",
                    (pid, name)).fetchone()
                if row:
                    con.execute("UPDATE capitalstats SET correct=correct+?,wrong=wrong+?"
                                " WHERE player_id=? AND country=?",
                                (1 if good else 0, 0 if good else 1, pid, name))
                else:
                    con.execute("INSERT INTO capitalstats VALUES(?,?,?,?)",
                                (pid, name, 1 if good else 0, 0 if good else 1))
            for name in (details.get("flags") or [])[:200]:
                nm = str(name)[:60]
                if nm in {x["name"] for x in progression.countries()}:
                    con.execute("INSERT OR IGNORE INTO flags VALUES(?,?)", (pid, nm))

        store.close_session(con, sid, correct, total, score, xp, bits, accuracy,
                            duration, meta, tag)
        store.credit(con, pid, xp, bits)

    # ---- daily challenges, then badges -----------------------------------
    perfect = accuracy >= 100 and total >= 6
    progression.bump_daily(pid, game, correct, total, accuracy, perfect,
                           {w.get("w") for w in (details.get("words") or [])},
                           len(details.get("capitals") or []),
                           mode == "studio", meta)
    new_badges = progression.evaluate_badges(pid)

    # ---- TableStar pays Starbits for its own levels ----------------------
    path_info, tokens = None, []
    if game == "tablestar":
        if mode == "studio":
            st = studio_table(pid)
            idx = next((i for i, c in enumerate(config.STUDIO_CLASSES)
                        if c["id"] == st["class"]["id"]), -1)
            tokens += tablestar_path.after_studio(pid, correct, duration, idx)["awarded"]
        else:
            # the Garage, and the 3-minute test/study rounds that live in it
            stage = str(body.get("stage") or ("test" if mode == "test" else mode))
            path_info = tablestar_path.after_garage(pid, correct, total, duration, stage)
            tokens += path_info["awarded"]
        if tokens:
            new_badges += progression.evaluate_badges(pid)

    p = store.get(pid)
    return 200, {
        "xp": xp, "starbits": bits, "accuracy": accuracy,
        "multiplier": reward["multiplier"],
        "totals": {"xp": p["xp"], "starbits": p["starbits"]},
        "class": config.class_for(p["xp"]),
        "badges": new_badges,
        "daily": progression.daily(pid),
        "sessionId": sid,
        "tokens": tokens,
        "path": path_info["path"] if path_info else None,
    }


# --------------------------------------------------------------------------- #
# HTTP plumbing
# --------------------------------------------------------------------------- #
class Handler(SimpleHTTPRequestHandler):
    server_version = "Astrolab/1.0"

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=PUBLIC, **kw)

    def log_message(self, fmt, *args):
        if "/api/" in (args[0] if args else ""):
            sys.stderr.write("%s %s\n" % (self.address_string(), fmt % args))

    def _player(self) -> dict | None:
        tok = self.headers.get("X-Astrolab-Token")
        if not tok:
            cookie = self.headers.get("Cookie") or ""
            m = re.search(r"astrolab_token=([^;]+)", cookie)
            tok = m.group(1) if m else None
        return store.by_token(tok) if tok else None

    def _json(self, code: int, payload: dict, headers: dict | None = None):
        raw = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        for k, v in (headers or {}).items():
            self.send_header(k, v)
        self.end_headers()
        try:
            self.wfile.write(raw)
        except BrokenPipeError:
            pass

    def _security_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Permissions-Policy", "geolocation=(), camera=(), microphone=()")
        # assets are edited all day: never let the browser serve a stale game
        p = urlparse(self.path).path
        if p.endswith((".js", ".css", ".html")) or p == "/":
            self.send_header("Cache-Control", "no-cache, must-revalidate")

    def end_headers(self):
        self._security_headers()
        super().end_headers()

    def do_GET(self):
        u = urlparse(self.path)
        if u.path.startswith("/api/"):
            q = {k: v[0] for k, v in parse_qs(u.query).items()}
            try:
                code, payload = api(u.path, "GET", {}, self._player(), q)
            except Exception as e:  # never leak a traceback to the client
                sys.stderr.write("api error %s: %r\n" % (u.path, e))
                code, payload = 500, {"error": "server error"}
            return self._json(code, payload)
        if u.path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def do_POST(self):
        u = urlparse(self.path)
        if not u.path.startswith("/api/"):
            return self._json(404, {"error": "not found"})
        length = int(self.headers.get("Content-Length") or 0)
        if length > 400_000:
            return self._json(413, {"error": "payload too large"})
        raw = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw or b"{}")
            if not isinstance(body, dict):
                body = {}
        except Exception:
            return self._json(400, {"error": "bad json"})
        try:
            code, payload = api(u.path, "POST", body, self._player(), {})
        except Exception as e:
            sys.stderr.write("api error %s: %r\n" % (u.path, e))
            code, payload = 500, {"error": "server error"}
        headers = {}
        if payload.get("token"):
            headers["Set-Cookie"] = (
                f"astrolab_token={payload['token']}; Path=/; Max-Age=31536000; SameSite=Lax")
        return self._json(code, payload, headers)

    def do_PATCH(self):
        u = urlparse(self.path)
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw or b"{}")
        except Exception:
            body = {}
        try:
            code, payload = api(u.path, "PATCH", body, self._player(), {})
        except Exception as e:
            sys.stderr.write("api error %s: %r\n" % (u.path, e))
            code, payload = 500, {"error": "server error"}
        return self._json(code, payload)

    def send_head(self):
        # long cache for the dataset, none for the app shell
        if self.path.startswith("/data/"):
            self.extensions_map[".json"] = "application/json"
        return super().send_head()


def main():
    mimetypes.add_type("application/json", ".json")
    mimetypes.add_type("image/svg+xml", ".svg")
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    srv.daemon_threads = True
    print(f"Astrolab on http://127.0.0.1:{PORT}", flush=True)
    srv.serve_forever()


if __name__ == "__main__":
    main()
