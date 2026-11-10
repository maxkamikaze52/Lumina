"""Astrolab — progression service.

The single place that turns stored sessions into XP, Starbits, classes, badges,
daily challenges, statistics and leaderboards.  All three games go through it.
"""
from __future__ import annotations

import json, os, time
from collections import Counter, defaultdict

import catalogue
import config
import store

HERE = os.path.dirname(os.path.abspath(__file__))
_WORLD = None


def world() -> dict:
    global _WORLD
    if _WORLD is None:
        _WORLD = json.load(open(os.path.join(HERE, "public", "data", "world.json")))
    return _WORLD


def countries() -> list[dict]:
    return world()["countries"]


def country(name: str) -> dict | None:
    return next((c for c in countries() if c["name"] == name), None)


# --------------------------------------------------------------------------- #
# summary used by badge checks
# --------------------------------------------------------------------------- #
def build_summary(pid: str) -> dict:
    sessions = store.sessions_for(pid)
    perf = store.perfacts(pid)
    words = store.word_stats(pid)
    wq = store.country_stats(pid)
    caps = store.capital_stats(pid)
    badges = store.unlocked_badges(pid)
    p = store.get(pid)

    mult = sum(f["correct"] for f in perf if f["fact"].startswith("m:"))
    div = sum(f["correct"] for f in perf if f["fact"].startswith("d:"))
    tables = set()
    for f in perf:
        if f["fact"].startswith("m:") and f["correct"] > 0:
            a, b = f["fact"][2:].split("x")
            for v in (a, b):
                if v.isdigit() and 1 <= int(v) <= 12:
                    tables.add(int(v))

    ts_sessions = [s for s in sessions if s["game"] == "tablestar"]
    sb_sessions = [s for s in sessions if s["game"] == "spellbound"]
    wq_sessions = [s for s in sessions if s["game"] == "worldquest"]

    def challenge_cleared(sess: dict) -> bool:
        """The 196 challenge only counts when all 196 entries were answered correctly."""
        if sess["mode"] != "challenge":
            return False
        if (sess["total"] or 0) < 196 or (sess["correct"] or 0) < 196:
            return False
        try:
            meta = json.loads(sess["meta"] or "{}")
        except Exception:
            meta = {}
        return bool(meta.get("continent") == "World" or meta.get("mode") == "challenge")

    sb_lists = set()
    extreme_best = 0.0
    best_streak = 0
    for s in sb_sessions:
        meta = json.loads(s["meta"] or "{}")
        if meta.get("listId"):
            sb_lists.add(meta["listId"])
        best_streak = max(best_streak, int(meta.get("bestStreak", 0)))
        if s["difficulty"] == "extreme":
            extreme_best = max(extreme_best, s["accuracy"] or 0)

    mastered_words = sum(1 for w in words if w["box"] >= 4)
    cont_of = {c["name"]: c["continent"] for c in countries()}
    learned = {w["country"]: w for w in wq if w["correct"] > 0}
    mastered_countries = [w for w in wq if w["correct"] >= 2]
    by_cont = Counter(cont_of.get(w["country"], "?") for w in mastered_countries)
    by_cont.pop("?", None)

    studio = store.studio_runs(pid, 10)
    total_correct = sum(r["correct"] or 0 for r in studio)
    total_dur = sum(r["duration"] or 0 for r in studio)
    avg = (total_dur / total_correct) if total_correct else None
    sclass = config.studio_class(avg)
    idx = next((i for i, c in enumerate(config.STUDIO_CLASSES)
                if c["id"] == sclass["id"]), -1)

    days = {time.strftime("%Y-%m-%d", time.localtime(s["finished"])) for s in sessions}
    daily_done = 0
    for row in _all_daily_claimed(pid):
        daily_done += 1

    perfect_ts = any((s["accuracy"] or 0) >= 100 and (s["total"] or 0) >= 12
                     for s in ts_sessions)
    fast_run = any((s["correct"] or 0) > 0 and (s["duration"] or 0) / max(1, s["correct"]) < 2.0
                   for s in ts_sessions if s["mode"] != "studio")
    boards = leaderboards()
    overall_rows = boards["overall"]["all"]
    overall_rank = next((r["rank"] for r in overall_rows if r["id"] == pid), 999)
    game_ranks = {}
    for g in ("tablestar", "spellbound", "worldquest"):
        rows = boards[g]["all"]
        game_ranks[g] = (next((r["rank"] for r in rows if r["id"] == pid), 999), len(rows))
    # a top-10 badge only counts once there are 10+ players on that board, so a
    # player is never "top 10" of a field of one
    best_board_rank = 999
    if len(overall_rows) >= 10 and overall_rank <= 10:
        best_board_rank = overall_rank
    for g, (rank, size) in game_ranks.items():
        if size >= 10 and rank < best_board_rank:
            best_board_rank = rank

    cls = config.class_for(p["xp"])
    return {
        "games": len(sessions),
        "games_by": sorted({s["game"] for s in sessions}),
        "badges": len(badges),
        "class_n": cls["n"],
        "overall_rank": overall_rank,
        "overall_board_size": len(overall_rows),
        "best_board_rank": best_board_rank,
        "active_days": len(days),
        "daily_done": daily_done,
        "ts": {
            "runs": len(ts_sessions),
            "studio_runs": len([s for s in ts_sessions if s["mode"] == "studio"]),
            "mult": mult, "div": div, "perfect": 1 if perfect_ts else 0,
            "fast_run": 1 if fast_run else 0, "studio_idx": idx,
            "tables": sorted(tables), "avg": avg, "studio": sclass,
        },
        "sb": {
            "sessions": len(sb_sessions),
            "perfect": sum(1 for s in sb_sessions
                           if (s["accuracy"] or 0) >= 100 and (s["total"] or 0) >= 8),
            "best_streak": best_streak,
            "mastered": mastered_words,
            "seen": len(words),
            "lists": sorted(sb_lists),
            "extreme_best": extreme_best,
            "correct": sum(s["correct"] or 0 for s in sb_sessions),
        },
        "wq": {
            "identified": sum(w["correct"] for w in wq),
            "mastered": len(mastered_countries),
            "by_cont": dict(by_cont),
            "learned": len(learned),
            "capitals": sum(c["correct"] for c in caps),
            "flags": len(store.flags(pid)),
            "challenge_done": len([s for s in wq_sessions if challenge_cleared(s)]),
        },
    }


def _all_daily_claimed(pid: str) -> list:
    with store.db() as con:
        return con.execute("SELECT * FROM daily WHERE player_id=? AND claimed=1",
                           (pid,)).fetchall()


def evaluate_badges(pid: str) -> list[dict]:
    """Grant every badge whose rule now holds.  Returns the newly unlocked ones."""
    s = build_summary(pid)
    existing = store.unlocked_badges(pid)
    new = []
    for b in config.BADGES:
        if b["id"] in existing:
            continue
        try:
            ok = b["check"](s)
        except Exception:
            ok = False
        if ok:
            if store.grant_badge(pid, b["id"]):
                new.append(public_badge(b["id"], time.time()))
                # badges can unlock other badges (Collector counts badges)
                s["badges"] = len(existing) + len(new)
    return new


def public_badge(bid: str, unlocked_at: float | None) -> dict:
    b = config.BADGE_BY_ID[bid]
    return {"id": bid, "name": b["name"], "desc": b["desc"], "game": b["game"],
            "icon": b["icon"], "unlocked": unlocked_at is not None,
            "at": unlocked_at}


def badge_list(pid: str) -> list[dict]:
    got = store.unlocked_badges(pid)
    return [public_badge(b["id"], got.get(b["id"])) for b in config.BADGES]


# --------------------------------------------------------------------------- #
# daily challenges
# --------------------------------------------------------------------------- #
def daily(pid: str) -> list[dict]:
    today = config.date_key(time.time())
    rows = store.daily_rows(pid, today)
    out = []
    for i, ch in enumerate(config.todays_challenges(pid, today)):
        row = rows.get(i) or {"progress": 0, "claimed": 0, "part": None}
        out.append({"idx": i, "kind": ch["kind"], "goal": ch["goal"], "text": ch["text"],
                    "bits": ch["bits"], "xp": ch["xp"],
                    "progress": min(row["progress"], ch["goal"]),
                    "done": row["progress"] >= ch["goal"],
                    "claimed": bool(row["claimed"]),
                    "part": json.loads(row["part"]) if row["part"] else {}})
    return out


def bump_daily(pid: str, game: str, correct: int, total: int, accuracy: float,
               perfect: bool, words: set, capitals: int, studio: bool, meta: dict):
    """Advance today's challenges from a real completed session."""
    today = config.date_key(time.time())
    rows = store.daily_rows(pid, today)
    challenges = config.todays_challenges(pid, today)
    increments = {
        "ts_correct": correct if game == "tablestar" else 0,
        "ts_studio": 1 if (game == "tablestar" and studio) else 0,
        "sb_correct": correct if game == "spellbound" else 0,
        "sb_perfect": 1 if (game == "spellbound" and perfect) else 0,
        "sb_words": len(words) if game == "spellbound" else 0,
        "wq_correct": correct if game == "worldquest" else 0,
        "wq_capitals": capitals if game == "worldquest" else 0,
        "sessions": 1,
        "accuracy": 1 if accuracy >= 90 else 0,
    }
    for i, ch in enumerate(challenges):
        row = rows.get(i)
        cur = dict(row) if row else {"progress": 0, "claimed": 0, "part": None}
        part = json.loads(cur["part"]) if cur["part"] else {}
        if ch["kind"] == "all_three":
            part["games"] = sorted(set(part.get("games", [])) | {game})
            part["all"] = part["games"]
            progress = len(part["games"])
            cur["part"] = json.dumps(part)
        else:
            progress = cur["progress"] + increments.get(ch["kind"], 0)
        if progress > cur["progress"]:
            with store.db() as con:
                con.execute(
                    "INSERT INTO daily(player_id,day,idx,progress,claimed,part)"
                    " VALUES(?,?,?,?,?,?) ON CONFLICT(player_id,day,idx) DO UPDATE"
                    " SET progress=excluded.progress, part=excluded.part",
                    (pid, today, i, progress, cur["claimed"], cur["part"]))


def claim_daily(pid: str, idx: int) -> tuple[bool, str, dict | None]:
    ch = daily(pid)
    if idx < 0 or idx >= len(ch):
        return False, "No such challenge.", None
    c = ch[idx]
    if not c["done"]:
        return False, "Not finished yet.", None
    if c["claimed"]:
        return False, "Already collected.", None
    today = config.date_key(time.time())
    with store.db() as con:
        cur = con.execute(
            "UPDATE daily SET claimed=1 WHERE player_id=? AND day=? AND idx=? AND claimed=0",
            (pid, today, idx))
        if cur.rowcount != 1:
            return False, "Already collected.", None
        store.credit(con, pid, c["xp"], c["bits"])
    badges = evaluate_badges(pid)
    return True, f"+{c['xp']} XP · +{c['bits']} Starbits", {"badges": badges}


# --------------------------------------------------------------------------- #
# leaderboards
# --------------------------------------------------------------------------- #
PERIODS = {"all": None, "monthly": 30 * 86400, "weekly": 7 * 86400}


def _period_start(period: str) -> float | None:
    span = PERIODS.get(period)
    if not span:
        return None
    if period == "weekly":  # calendar week, Monday 00:00
        t = time.localtime()
        midnight = time.mktime((t.tm_year, t.tm_mon, t.tm_mday, 0, 0, 0, 0, 0, -1))
        return midnight - t.tm_wday * 86400
    if period == "monthly":
        t = time.localtime()
        return time.mktime((t.tm_year, t.tm_mon, 1, 0, 0, 0, 0, 0, -1))
    return None


def leaderboards(period: str = "all") -> dict:
    since = _period_start(period)
    start = since or 0
    players = store.list_public()
    with store.db() as con:
        rows = con.execute(
            "SELECT player_id,game,mode,correct,total,accuracy,duration,finished,flagged,xp,meta"
            " FROM sessions WHERE finished IS NOT NULL AND finished>=?", (start,)).fetchall()
    agg = defaultdict(lambda: {
        "xp": 0, "games": 0, "correct": 0, "best": 0, "words": 0, "countries": 0,
        "capitals": 0, "flags": 0, "runs": 0, "dur": 0.0, "best_acc": 0.0,
        "best_time": None, "challenge": 0, "continents": 0})
    per_game = {"tablestar": defaultdict(dict), "spellbound": defaultdict(dict),
                "worldquest": defaultdict(dict)}
    for r in rows:
        if r["flagged"]:
            continue
        pid, game = r["player_id"], r["game"]
        a = agg[(pid, game)]
        a["xp"] += r["xp"] or 0          # XP earned in *this game* inside the window
        a["games"] += 1
        a["correct"] += r["correct"] or 0
        a["best_acc"] = max(a["best_acc"], r["accuracy"] or 0)
        if game == "tablestar":
            a["dur"] += r["duration"] or 0
            if r["mode"] == "studio":
                a["runs"] += 1
        if game == "worldquest":
            if r["mode"] == "challenge":
                a["challenge"] += 1
                ft = (r["meta"] or "{}")
                try:
                    m = json.loads(ft)
                except Exception:
                    m = {}
                t = m.get("timeSeconds")
                if t and (a["best_time"] is None or t < a["best_time"]):
                    a["best_time"] = t
    # lifetime XP from the player row (never rewritten by spending)
    lifetime = {p["id"]: p["xp"] for p in players}
    names = {p["id"]: p for p in players}
    chars = {p["id"]: p["character"] for p in players}

    def board_for(game: str | None, extra: bool = False) -> list[dict]:
        out = []
        if game is None:
            for p in players:
                days = _active_days(p["id"], start)
                month_xp = _xp_since(p["id"], start)
                out.append({"id": p["id"], "name": p["name"],
                            "value": (month_xp if since else p["xp"]),
                            "lifetime": p["xp"], "character": p["character"],
                            "class": config.class_for(p["xp"]),
                            "games": store.session_count(p["id"]),
                            "days": days})
        else:
            for p in players:
                a = agg.get((p["id"], game), {})
                if not a.get("games"):
                    continue
                meta = {}
                if game == "tablestar":
                    studio = store.studio_runs(p["id"], 10)
                    tc = sum(s["correct"] or 0 for s in studio)
                    td = sum(s["duration"] or 0 for s in studio)
                    avg = (td / tc) if tc else None
                    meta = {"studioAvg": round(avg, 2) if avg else None,
                            "studioClass": config.studio_class(avg)["name"],
                            "studioRuns": len(studio)}
                if game == "spellbound":
                    ws = store.word_stats(p["id"])
                    meta = {"words": len(ws),
                            "mastered": sum(1 for w in ws if w["box"] >= 4),
                            "bestAcc": round(max([r["accuracy"] or 0 for r in rows
                                                  if r["player_id"] == p["id"]
                                                  and r["game"] == "spellbound"] or [0]), 1)}
                if game == "worldquest":
                    cs = store.country_stats(p["id"])
                    conts = {c["continent"]: 0 for c in countries()}
                    cont_of = {c["name"]: c["continent"] for c in countries()}
                    for c in cs:
                        if c["correct"] >= 2:
                            conts[cont_of.get(c["country"], "?")] = conts.get(
                                cont_of.get(c["country"], "?"), 0) + 1
                    meta = {"countries": sum(c["correct"] for c in cs),
                            "mastered": sum(1 for c in cs if c["correct"] >= 2),
                            "capitals": sum(c["correct"] for c in store.capital_stats(p["id"])),
                            "flags": len(store.flags(p["id"])),
                            "continents": sum(1 for v in conts.values() if v > 0),
                            "bestTime": a.get("best_time")}
                out.append({"id": p["id"], "name": p["name"],
                            "value": (a["xp"] if since else p["xp"]),
                            "lifetime": p["xp"], "character": p["character"],
                            "class": config.class_for(p["xp"]),
                            "games": a["games"], "bestAcc": round(a.get("best_acc", 0), 1),
                            "correct": a["correct"], **meta})
        out.sort(key=lambda r: (-r["value"], r["name"].lower()))
        prev = None
        for i, r in enumerate(out):
            r["rank"] = i + 1
            r["move"] = 0 if prev is None or prev["value"] != r["value"] else 0
            prev = r
        return out

    return {"period": period,
            "overall": {"all": board_for(None)},
            "tablestar": {"all": board_for("tablestar")},
            "spellbound": {"all": board_for("spellbound")},
            "worldquest": {"all": board_for("worldquest")}}


def _active_days(pid: str, since: float) -> int:
    with store.db() as con:
        rows = con.execute(
            "SELECT finished FROM sessions WHERE player_id=? AND finished>=?",
            (pid, since)).fetchall()
    return len({time.strftime("%Y-%m-%d", time.localtime(r["finished"])) for r in rows})


def _xp_since(pid: str, since: float) -> int:
    with store.db() as con:
        row = con.execute(
            "SELECT COALESCE(SUM(xp),0) v FROM sessions WHERE player_id=? AND finished>=?"
            " AND flagged=0", (pid, since)).fetchone()
    return row["v"] or 0


# --------------------------------------------------------------------------- #
# per-game statistics
# --------------------------------------------------------------------------- #
def stats(pid: str) -> dict:
    s = build_summary(pid)
    p = store.get(pid)
    cls = config.class_for(p["xp"])
    sessions = store.sessions_for(pid)
    wq = store.country_stats(pid)
    caps = store.capital_stats(pid)
    cont_of = {c["name"]: c["continent"] for c in countries()}
    per_cont = {c: {"total": 0, "mastered": 0, "seen": 0}
                for c in ("Europe", "Asia", "Africa", "North America",
                          "South America", "Oceania")}
    for c in countries():
        per_cont[c["continent"]]["total"] += 1
    for row in wq:
        cont = cont_of.get(row["country"])
        if not cont:
            continue
        per_cont[cont]["seen"] += 1
        if row["correct"] >= 2:
            per_cont[cont]["mastered"] += 1
    words = store.word_stats(pid)
    perf = store.perfacts(pid)
    studio = store.studio_runs(pid, 10)
    tc = sum(r["correct"] or 0 for r in studio)
    td = sum(r["duration"] or 0 for r in studio)
    avg = (td / tc) if tc else None
    return {
        "xp": p["xp"], "starbits": p["starbits"], "class": cls,
        "level": {"n": cls["n"], "name": cls["name"], "title": cls["title"],
                  "xp": cls["xp"], "toNext": cls["toNext"], "pct": cls["pct"],
                  "next": (cls["next"]["n"] if cls.get("next") else None)},
        "levels": config.CLASSES,
        "studio": {"avg": avg, "class": config.studio_class(avg), "runs": len(studio)},
        "perContinent": per_cont,
        "words": {"seen": len(words), "mastered": sum(1 for w in words if w["box"] >= 4),
                  "difficult": sorted([w for w in words if w["wrong"] >= 2 and w["box"] < 4],
                                      key=lambda w: -w["wrong"])[:40],
                  "map": {w["word"]: {"attempts": w["attempts"], "correct": w["correct"],
                                      "wrong": w["wrong"], "box": w["box"], "last": w["last"]}
                          for w in words}},
        "wordMap": {w["word"]: {"attempts": w["attempts"], "correct": w["correct"],
                                "wrong": w["wrong"], "box": w["box"]} for w in words},
        "countryMap": {c["country"]: {"asked": c["asked"], "correct": c["correct"]} for c in wq},
        "capitals": {"asked": sum(c["correct"] + c["wrong"] for c in caps),
                     "correct": sum(c["correct"] for c in caps)},
        "facts": {"mult": s["ts"]["mult"], "div": s["ts"]["div"],
                  "tables": sorted(s["ts"]["tables"])},
        "recent": [{k: v for k, v in r.items() if k in
                    ("id", "game", "mode", "difficulty", "finished", "correct", "total",
                     "score", "xp", "starbits", "accuracy", "duration")}
                   for r in sessions[:12]],
        "sessions": len(sessions),
        "summary": s,
    }


def flags(pid: str) -> set[str]:
    with store.db() as con:
        return {r["flag"] for r in
                con.execute("SELECT flag FROM flags WHERE player_id=?", (pid,))}


store.flags = flags  # small helper used above
