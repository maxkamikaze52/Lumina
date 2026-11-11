"""Spellbound — the Daily Hive.

Every player gets their OWN honeycomb and their OWN words for the day, derived
from (player id + date + level), so two people sitting next to each other cannot
copy: the letters, the centre and the speaking round all differ.

The word lists live on the server. The browser never sees the answers; it asks
/api/spellbound/check whether a typed word is real, and the score is settled
here.
"""
from __future__ import annotations

import hashlib
import json
import os
import random

import config
import store

HERE = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(HERE, "public", "data", "spellbound.json")

LEVELS = ("easy", "intermediate", "hard", "extreme")

# how much a harder mode is worth: the ONE source of truth is config, so the
# hive cannot drift from the rest of the economy
LEVEL_MULT = {lv: config.DIFFICULTY_MULT[lv] for lv in ("easy", "medium", "hard", "extreme")
              if lv in config.DIFFICULTY_MULT}
LEVEL_MULT["intermediate"] = config.DIFFICULTY_MULT.get("medium", 1.15)

# config's reward table names the second band "medium", the game calls it
# "intermediate": one translation, in one place.
REWARD_KEY = {"easy": "easy", "intermediate": "medium",
              "hard": "hard", "extreme": "extreme"}

# typing round: how long a word "should" take. Faster than this pays a bonus.
def target_ms(word: str) -> int:
    return 700 + 250 * len(word)


_cache: dict | None = None


def data() -> dict:
    global _cache
    if _cache is None:
        raw = json.loads(open(DATA_PATH, encoding="utf-8").read())
        levels = {}
        for lv, blk in raw["levels"].items():
            levels[lv] = {
                "words": set(blk["words"]),
                "sets": blk["sets"],
            }
        # The hive board for a level is every band up to it: a hard hive holds
        # hard letters, but short easy words are still fair game inside it.
        board, union = {}, set()
        for lv in LEVELS:
            union = union | levels[lv]["words"]
            board[lv] = set(union)
            levels[lv]["board"] = board[lv]
        _cache = {
            "levels": levels,
            "points": {int(k): v for k, v in raw["points"].items()},
            "pangram": int(raw.get("pangram", 100)),
        }
    return _cache


def points_for(word: str) -> int:
    table = data()["points"]
    if len(word) in table:
        return table[len(word)]
    return 30 * len(word)


def day_key() -> str:
    return config.date_key(store.now())


def _seed(pid: str, day: str, level: str) -> int:
    raw = f"{pid}|{day}|{level}".encode()
    return int.from_bytes(hashlib.sha256(raw).digest()[:8], "big")


def hive(pid: str, level: str, day: str | None = None) -> dict:
    """Today's honeycomb for this player at this level."""
    if level not in LEVELS:
        level = "easy"
    day = day or day_key()
    lv = data()["levels"][level]
    sets = lv["sets"]
    rng = random.Random(_seed(pid, day, level))
    s = sets[rng.randrange(len(sets))]
    letters = list(s["letters"])
    centre = s["centre"]

    # the speaking round: 10 words this hive can actually build
    pool = [w for w in s["words"] if len(w) >= 4]
    easy = level in ("easy", "intermediate")
    pool.sort(key=lambda w: (len(w) if easy else -len(w), w))
    head = pool[: max(20, len(pool) // 2)] if easy else pool
    rng.shuffle(head)
    picked = []
    for w in head:
        if len(picked) >= 10:
            break
        if any(abs(len(w) - len(x)) <= 1 and w[:3] == x[:3] for x in picked):
            continue
        picked.append(w)
    picked = sorted(picked, key=lambda w: (len(w), w))

    # Listen & Spell vocabulary: this player's own sample of the level's 5,000,
    # so the spoken round is different for everybody too. Longer words at the
    # harder levels, shorter at the easy ones.
    lv_words = sorted(data()["levels"][level]["words"])
    rng2 = random.Random(_seed(pid, day, level + "|spell"))
    want_len = {"easy": (4, 7), "intermediate": (5, 9),
                "hard": (7, 11), "extreme": (9, 12)}[level]
    band = [w for w in lv_words if want_len[0] <= len(w) <= want_len[1]]
    if len(band) < 40:
        band = lv_words
    spell = rng2.sample(band, min(20, len(band)))
    spell.sort(key=lambda w: (len(w), w))

    return {
        "day": day,
        "level": level,
        "letters": letters,
        "centre": centre,
        "mult": LEVEL_MULT[level],
        "points": {str(k): v for k, v in sorted(data()["points"].items())},
        "pangram": data()["pangram"],
        "challenge": [{"w": w, "ms": target_ms(w)} for w in picked],
        "spell": spell,
        "total": len(picked),
    }


def _clean(word: str) -> str:
    return "".join(c for c in str(word or "").lower() if "a" <= c <= "z")[:20]


def check(pid: str, level: str, word: str, day: str | None = None) -> dict:
    """Is this word buildable from today's hive, and what is it worth?"""
    if level not in LEVELS:
        level = "easy"
    h = hive(pid, level, day)
    w = _clean(word)
    if len(w) < 4:
        return {"ok": False, "reason": "short", "message": "Four letters or more."}
    letters = set(h["letters"])
    if set(w) - letters:
        return {"ok": False, "reason": "letters",
                "message": "That needs a letter that is not in the hive."}
    if w not in data()["levels"][level]["board"]:
        return {"ok": False, "reason": "notaword", "message": "Not a word I can accept here."}
    base = points_for(w)
    pangram = set(h["letters"]) <= set(w)
    return {"ok": True, "word": w, "base": base,
            "pangram": pangram, "bonus": h["pangram"] if pangram else 0,
            "points": int(round((base + (h["pangram"] if pangram else 0)) * h["mult"]))}


def speed_mult(ms: float, target: float) -> float:
    """Type it fast, get more. Half time = double; twice the time = a third."""
    if ms <= 0:
        return 1.0
    raw = target / ms
    return max(0.4, min(2.0, raw))
