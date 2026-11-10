"""Astrolab — player store (SQLite).

One player row holds identity + economy; child tables hold the game records that
the reward and badge systems read.  Nothing about a player's progress lives in the
browser: the client can only read what this module returns.
"""
from __future__ import annotations

import json, os, secrets, shutil, sqlite3, time
from contextlib import contextmanager

import catalogue
import config

HERE = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(HERE, "data", "astrolab.db")

SCHEMA = """
CREATE TABLE IF NOT EXISTS players(
  id TEXT PRIMARY KEY, token TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  created REAL NOT NULL, xp INTEGER DEFAULT 0, starbits INTEGER DEFAULT 0,
  character TEXT, room TEXT, last_seen REAL, locale TEXT DEFAULT 'GB'
);
CREATE TABLE IF NOT EXISTS sessions(
  id TEXT PRIMARY KEY, player_id TEXT NOT NULL, game TEXT NOT NULL, mode TEXT NOT NULL,
  difficulty TEXT NOT NULL, started REAL, finished REAL, duration REAL,
  correct INTEGER, total INTEGER, score INTEGER, xp INTEGER, starbits INTEGER,
  accuracy REAL, meta TEXT, tag TEXT, flagged INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS s_player ON sessions(player_id, game);
CREATE TABLE IF NOT EXISTS inventory(
  player_id TEXT NOT NULL, item_id TEXT NOT NULL, bought REAL,
  PRIMARY KEY(player_id, item_id)
);
CREATE TABLE IF NOT EXISTS badges(
  player_id TEXT NOT NULL, badge_id TEXT NOT NULL, unlocked REAL,
  PRIMARY KEY(player_id, badge_id)
);
CREATE TABLE IF NOT EXISTS wordstats(
  player_id TEXT NOT NULL, word TEXT NOT NULL, attempts INTEGER DEFAULT 0,
  correct INTEGER DEFAULT 0, wrong INTEGER DEFAULT 0, streak INTEGER DEFAULT 0,
  box INTEGER DEFAULT 1, last REAL, PRIMARY KEY(player_id, word)
);
CREATE TABLE IF NOT EXISTS countrystats(
  player_id TEXT NOT NULL, country TEXT NOT NULL, asked INTEGER DEFAULT 0,
  correct INTEGER DEFAULT 0, last REAL, PRIMARY KEY(player_id, country)
);
CREATE TABLE IF NOT EXISTS daily(
  player_id TEXT NOT NULL, day TEXT NOT NULL, idx INTEGER NOT NULL,
  progress INTEGER DEFAULT 0, claimed INTEGER DEFAULT 0, part TEXT,
  PRIMARY KEY(player_id, day, idx)
);
CREATE TABLE IF NOT EXISTS flags(
  player_id TEXT NOT NULL, flag TEXT NOT NULL, PRIMARY KEY(player_id, flag)
);
CREATE TABLE IF NOT EXISTS perfacts(
  player_id TEXT NOT NULL, fact TEXT NOT NULL, correct INTEGER DEFAULT 0,
  wrong INTEGER DEFAULT 0, ms REAL, PRIMARY KEY(player_id, fact)
);
CREATE TABLE IF NOT EXISTS capitalstats(
  player_id TEXT NOT NULL, country TEXT NOT NULL, correct INTEGER DEFAULT 0,
  wrong INTEGER DEFAULT 0, PRIMARY KEY(player_id, country)
);
CREATE TABLE IF NOT EXISTS meta(
  player_id TEXT NOT NULL, k TEXT NOT NULL, v TEXT,
  PRIMARY KEY(player_id, k)
);
"""


def meta_get(pid: str, k: str, default=None):
    with db() as con:
        row = con.execute("SELECT v FROM meta WHERE player_id=? AND k=?", (pid, k)).fetchone()
    return row["v"] if row else default


def meta_set(pid: str, k: str, v: str):
    with db() as con:
        con.execute("INSERT INTO meta(player_id,k,v) VALUES(?,?,?)"
                    " ON CONFLICT(player_id,k) DO UPDATE SET v=excluded.v", (pid, k, v))


@contextmanager
def db():
    con = sqlite3.connect(DB_PATH, timeout=15)
    con.row_factory = sqlite3.Row
    try:
        yield con
        con.commit()
    finally:
        con.close()


def init():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with db() as con:
        con.executescript(SCHEMA)


def now() -> float:
    return time.time()


# --------------------------------------------------------------------------- #
# players
# --------------------------------------------------------------------------- #
def create_player(name: str) -> dict:
    pid = "p_" + secrets.token_hex(6)
    token = secrets.token_urlsafe(24)
    with db() as con:
        con.execute(
            "INSERT INTO players(id,token,name,created,xp,starbits,character,room,last_seen)"
            " VALUES(?,?,?,?,0,60,?,?,?)",
            (pid, token, name[:20], now(), json.dumps(catalogue.DEFAULT_EQUIPPED),
             json.dumps(catalogue.DEFAULT_ROOM), now()))
        for iid in catalogue.STARTER:
            con.execute("INSERT OR IGNORE INTO inventory VALUES(?,?,?)", (pid, iid, now()))
    return get(pid)


def by_token(token: str) -> dict | None:
    with db() as con:
        row = con.execute("SELECT * FROM players WHERE token=?", (token,)).fetchone()
    return dict(row) if row else None


def get(pid: str) -> dict | None:
    with db() as con:
        row = con.execute("SELECT * FROM players WHERE id=?", (pid,)).fetchone()
    if not row:
        return None
    p = dict(row)
    p["character"] = json.loads(p["character"] or "{}")
    p["room"] = json.loads(p["room"] or "{}")
    return p


def touch(pid: str):
    with db() as con:
        con.execute("UPDATE players SET last_seen=? WHERE id=?", (now(), pid))


def list_public() -> list[dict]:
    with db() as con:
        rows = con.execute("SELECT id,name,xp,character,created FROM players").fetchall()
    return [{"id": r["id"], "name": r["name"], "xp": r["xp"],
             "character": json.loads(r["character"] or "{}"), "created": r["created"]}
            for r in rows]


def save_character(pid: str, equip: dict):
    with db() as con:
        con.execute("UPDATE players SET character=? WHERE id=?",
                    (json.dumps(equip), pid))


def save_room(pid: str, room: dict):
    with db() as con:
        con.execute("UPDATE players SET room=? WHERE id=?", (json.dumps(room), pid))


def save_locale(pid: str, locale: str):
    with db() as con:
        con.execute("UPDATE players SET locale=? WHERE id=?", (locale, pid))


# --------------------------------------------------------------------------- #
# economy helpers — always inside a transaction with a guard
# --------------------------------------------------------------------------- #
def credit(con, pid: str, xp: int, bits: int):
    con.execute("UPDATE players SET xp=xp+?, starbits=starbits+? WHERE id=?",
                (max(0, int(xp)), max(0, int(bits)), pid))


def spend(con, pid: str, cost: int) -> bool:
    cur = con.execute(
        "UPDATE players SET starbits=starbits-? WHERE id=? AND starbits>=?",
        (cost, pid, cost))
    return cur.rowcount == 1


# --------------------------------------------------------------------------- #
# sessions
# --------------------------------------------------------------------------- #
def open_session(pid: str, game: str, mode: str, difficulty: str, meta: dict | None) -> str:
    sid = "s_" + secrets.token_hex(8)
    with db() as con:
        con.execute(
            "INSERT INTO sessions(id,player_id,game,mode,difficulty,started,meta,tag)"
            " VALUES(?,?,?,?,?,?,?,NULL)",
            (sid, pid, game, mode, difficulty, now(), json.dumps(meta or {})))
    return sid


def find_session(pid: str, tag: str) -> dict | None:
    """A duplicate submission check: a finished session with the same client tag."""
    with db() as con:
        row = con.execute(
            "SELECT * FROM sessions WHERE player_id=? AND tag=? AND finished IS NOT NULL",
            (pid, tag)).fetchone()
    return dict(row) if row else None


def find_open(pid: str, sid: str) -> dict | None:
    with db() as con:
        row = con.execute(
            "SELECT * FROM sessions WHERE id=? AND player_id=? AND finished IS NULL",
            (sid, pid)).fetchone()
    return dict(row) if row else None


def close_session(con, sid: str, correct: int, total: int, score: int, xp: int,
                  bits: int, accuracy: float, duration: float, meta: dict, tag: str,
                  flagged: int = 0):
    con.execute(
        "UPDATE sessions SET finished=?,duration=?,correct=?,total=?,score=?,xp=?,"
        "starbits=?,accuracy=?,meta=?,tag=?,flagged=? WHERE id=?",
        (now(), duration, correct, total, score, xp, bits, accuracy,
         json.dumps(meta), tag, flagged, sid))


def sessions_for(pid: str) -> list[dict]:
    with db() as con:
        rows = con.execute(
            "SELECT * FROM sessions WHERE player_id=? AND finished IS NOT NULL"
            " ORDER BY finished DESC", (pid,)).fetchall()
    return [dict(r) for r in rows]


def session_count(pid: str, game: str | None = None, mode: str | None = None) -> int:
    q = "SELECT COUNT(*) c FROM sessions WHERE player_id=? AND finished IS NOT NULL"
    args = [pid]
    if game:
        q += " AND game=?"
        args.append(game)
    if mode:
        q += " AND mode=?"
        args.append(mode)
    with db() as con:
        return con.execute(q, args).fetchone()["c"]


def studio_runs(pid: str, limit: int = 10) -> list[dict]:
    with db() as con:
        rows = con.execute(
            "SELECT * FROM sessions WHERE player_id=? AND game='tablestar'"
            " AND mode='studio' AND finished IS NOT NULL AND flagged=0"
            " ORDER BY finished DESC LIMIT ?", (pid, limit)).fetchall()
    return [dict(r) for r in rows]


# --------------------------------------------------------------------------- #
# inventory / badges / stats
# --------------------------------------------------------------------------- #
def owned(pid: str) -> set[str]:
    with db() as con:
        return {r["item_id"] for r in
                con.execute("SELECT item_id FROM inventory WHERE player_id=?", (pid,))}


def buy(pid: str, item_id: str) -> tuple[bool, str]:
    it = catalogue.ITEM_BY_ID.get(item_id)
    if not it:
        return False, "That item does not exist."
    with db() as con:
        has = con.execute("SELECT 1 FROM inventory WHERE player_id=? AND item_id=?",
                          (pid, item_id)).fetchone()
        if has:
            return False, "You already own this."
        if not spend(con, pid, it["price"]):
            return False, "Not enough Starbits."
        con.execute("INSERT INTO inventory VALUES(?,?,?)", (pid, item_id, now()))
    return True, "Added to your collection."


def unlocked_badges(pid: str) -> dict[str, float]:
    with db() as con:
        return {r["badge_id"]: r["unlocked"] for r in
                con.execute("SELECT badge_id,unlocked FROM badges WHERE player_id=?", (pid,))}


def grant_badge(pid: str, badge_id: str) -> bool:
    with db() as con:
        cur = con.execute("INSERT OR IGNORE INTO badges VALUES(?,?,?)",
                          (pid, badge_id, now()))
        return cur.rowcount == 1


def word_stats(pid: str) -> list[dict]:
    with db() as con:
        rows = con.execute("SELECT * FROM wordstats WHERE player_id=?", (pid,)).fetchall()
    return [dict(r) for r in rows]


def country_stats(pid: str) -> list[dict]:
    with db() as con:
        rows = con.execute("SELECT * FROM countrystats WHERE player_id=?", (pid,)).fetchall()
    return [dict(r) for r in rows]


def capital_stats(pid: str) -> list[dict]:
    with db() as con:
        rows = con.execute("SELECT * FROM capitalstats WHERE player_id=?", (pid,)).fetchall()
    return [dict(r) for r in rows]


def perfacts(pid: str) -> list[dict]:
    with db() as con:
        rows = con.execute("SELECT * FROM perfacts WHERE player_id=?", (pid,)).fetchall()
    return [dict(r) for r in rows]


def daily_rows(pid: str, day: str) -> dict[int, dict]:
    with db() as con:
        rows = con.execute("SELECT * FROM daily WHERE player_id=? AND day=?",
                           (pid, day)).fetchall()
    return {r["idx"]: dict(r) for r in rows}


def backup() -> str:
    os.makedirs(os.path.join(HERE, "backups"), exist_ok=True)
    dest = os.path.join(HERE, "backups",
                        time.strftime("astrolab-%Y%m%d-%H%M%S.db"))
    shutil.copyfile(DB_PATH, dest)
    return dest
