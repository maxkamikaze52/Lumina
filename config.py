"""Astrolab — shared progression rules.

Everything that decides *how much* a game is worth lives here, on the server, so a
game can never invent its own reward.  The client reports what happened; this module
decides what that is worth and which badges it unlocks.
"""
from __future__ import annotations

import math

PLATFORM = {
    "name": "Astrolab",
    "tagline": "Three worlds. One explorer.",
    "currency": "Starbits",
    "points": "XP",
}

# --------------------------------------------------------------------------- #
# Levels (platform-wide, driven by lifetime XP).  The ladder itself lives in
# levels.py; `class_for` is kept as the one name the rest of the code calls.
# --------------------------------------------------------------------------- #
import levels as _levels

CLASSES = _levels.LEVELS


def class_for(xp: int) -> dict:
    """The level this XP total holds, with progress into the next one."""
    return _levels.level_for(xp)


def level_progress(xp: int) -> dict:
    c = class_for(xp)
    return {"class": c["name"], "classN": c["n"], "hue": 212, "pct": c["pct"],
            "title": c["title"]}


# --------------------------------------------------------------------------- #
# Studio speed ranks (TableStar).  The ladder is the gig bill: slowest at the
# bottom (Unsigned Act) and fastest at the top (Rock Hero).  Every rank is also
# a badge, so the badges ARE the ladder.  `max` is the seconds-per-correct-
# answer ceiling of each band; `from` is where the band starts on the axis.
# --------------------------------------------------------------------------- #
STUDIO_CLASSES = [
    {"id": "unsigned", "tone": "#d02b3f", "name": "Unsigned Act", "max": 9.0, "from": 6.0, "icon": "mic",
     "desc": "Nobody has heard of you yet. Every act starts in the garage."},
    {"id": "breakthrough", "tone": "#e2552f", "name": "Breakthrough Artist", "max": 6.0, "from": 5.0, "icon": "bolt",
     "desc": "The first real crowd. Six seconds a fact is still a search."},
    {"id": "support", "tone": "#f0902c", "name": "Support Act", "max": 4.5, "from": 4.0, "icon": "star",
     "desc": "You hold the stage on your own. Recall is arriving faster now."},
    {"id": "headliner", "tone": "#f2c421", "name": "Headliner", "max": 3.4, "from": 3.0, "icon": "gem",
     "desc": "Your name is on the poster. Threeish seconds a fact, all tables."},
    {"id": "rockstar", "tone": "#b7cf32", "name": "Rock Star", "max": 2.6, "from": 2.0, "icon": "crown",
     "desc": "Under three seconds. The answer arrives before the question ends."},
    {"id": "legend", "tone": "#7cc63f", "name": "Rock Legend", "max": 2.0, "from": 1.0, "icon": "trophy",
     "desc": "Two seconds a fact, multiplication and division alike."},
    {"id": "hero", "tone": "#2fbf71", "name": "Rock Hero", "max": 1.5, "from": 0.0, "icon": "spark",
     "desc": "Instant. Nothing on the ladder is faster than this."},
]
RANK_IDS = [c["id"] for c in STUDIO_CLASSES]


def studio_class(avg: float | None) -> dict:
    """Ranks run slowest -> fastest, so take the last band the average fits."""
    if avg is None:
        return {"id": "unranked", "name": "Unranked", "idx": -1,
                "desc": "Finish a Studio run to get on the bill."}
    idx = None
    for i, c in enumerate(STUDIO_CLASSES):
        if avg <= c["max"]:
            idx = i
    if idx is None:
        return {"id": "outside", "name": "Off the bill", "idx": -1,
                "desc": "Slower than the slowest rank — drill your weak tables in the Garage."}
    c = STUDIO_CLASSES[idx]
    faster = STUDIO_CLASSES[idx + 1] if idx + 1 < len(STUDIO_CLASSES) else None
    slower = STUDIO_CLASSES[idx - 1] if idx > 0 else None
    return {**c, "idx": idx, "next": faster,
            # seconds per answer still to shave to reach the rank above
            "toNext": round(avg - faster["max"], 2) if faster else None,
            "guard": slower["max"] if slower else None}


def rank_ladder() -> list[dict]:
    """Fastest first, for drawing the ladder (0s at the top)."""
    return [{"id": c["id"], "name": c["name"], "max": c["max"], "from": c["from"],
             "icon": c["icon"], "tone": c["tone"], "desc": c["desc"]}
            for c in reversed(STUDIO_CLASSES)]


# --------------------------------------------------------------------------- #
# Reward rules.  Every game earns XP on the same scale: roughly 6–10 XP for a
# correct answer plus an accuracy bonus, so effort is worth the same everywhere.
# --------------------------------------------------------------------------- #
DIFFICULTY_MULT = {
    # TableStar modes
    "sound": 1.0, "studio": 1.05, "garage": 0.95,
    # Spellbound
    "easy": 1.0, "medium": 1.15, "hard": 1.3, "extreme": 1.45,
    # WorldQuest
    "beginner": 1.0, "intermediate": 1.1, "advanced": 1.25, "expert": 1.4,
}

# Rewards are tuned per *minute of real effort*, not per session: a fast maths run
# answers ~20 questions a minute, a spelling session manages ~8 words, geography
# ~10 countries.  The resulting XP/minute lands in the same 90-130 band for all three.
XP_SCALE = 10   # one knob for the whole economy: same ratios, bigger numbers

XP_PER_CORRECT = {"tablestar": 3.4, "spellbound": 8.5, "worldquest": 8.0}
BITS_PER_CORRECT = {"tablestar": 0.8, "spellbound": 1.5, "worldquest": 1.4}
ACCURACY_BONUS = {"tablestar": 26, "spellbound": 30, "worldquest": 28}
COMPLETION_XP = {"tablestar": 15, "spellbound": 25, "worldquest": 25}
COMPLETION_BITS = {"tablestar": 2, "spellbound": 3, "worldquest": 3}


def compute_reward(game: str, mode: str, difficulty: str, correct: int,
                   total: int, duration: float) -> dict:
    """Reward a *completed* session. Inputs are already sanity-checked."""
    if game not in XP_PER_CORRECT:
        raise ValueError("unknown game")
    mult = DIFFICULTY_MULT.get(difficulty, DIFFICULTY_MULT.get(mode, 1.0))
    acc = (correct / total) if total else 0.0
    # The Nth correct answer is worth more than the first: a run is multiplied by
    # how far past the game's par you got, so a long, accurate run pays off.
    par = max(8, int((duration or 60) / 60 * 20))       # ~20 answers a minute is par
    ramp = 1.0 + min(1.5, max(0, correct - par) / max(1, par) * 0.75)
    xp = correct * XP_PER_CORRECT[game] * mult * ramp
    xp += acc * ACCURACY_BONUS[game] * ramp
    xp += COMPLETION_XP[game]
    if acc >= 0.99 and correct >= 10:
        xp += 12 * ramp  # flawless run bonus
    bits = correct * BITS_PER_CORRECT[game] * (0.85 + 0.3 * mult) * (1 + (ramp - 1) * 0.6)
    bits += COMPLETION_BITS[game]
    if acc >= 0.99 and correct >= 10:
        bits += 6
    return {
        "xp": int(round(xp * XP_SCALE)),
        "starbits": int(round(bits * XP_SCALE)),
        "accuracy": round(acc * 100, 1),
        "multiplier": mult,
    }


def plausible(correct: int, total: int, duration: float) -> tuple[bool, str]:
    """Reject records no human could produce. 0.65 s is the floor for a read+answer."""
    if correct < 0 or total < 0:
        return False, "negative counts"
    if correct > total:
        return False, "correct exceeds answers"
    if duration <= 0:
        return False, "zero duration"
    if total > duration / 0.65 + 3:
        return False, "answers faster than humanly possible"
    if duration > 60 * 60 * 3:
        return False, "session too long"
    return True, ""


# --------------------------------------------------------------------------- #
# Badges.  `check(s)` is evaluated against a summary of the player's real data.
# --------------------------------------------------------------------------- #
def level_badges() -> list[dict]:
    """One badge per level, generated from the ladder so they can never drift."""
    out = []
    for l in _levels.LEVELS:
        out.append(dict(
            id="level-%02d" % l["n"],
            name="Level %d · %s" % (l["n"], l["title"]),
            game="platform", icon=l["emblem"],
            desc=("Reach level %d (%s XP)." % (l["n"], format(l["xp"], ","))
                  if l["n"] > 1 else "Start your climb."),
            check=(lambda s, n=l["n"]: s["class_n"] >= n)))
    return out


LEVEL_BY_N = {l["n"]: l for l in _levels.LEVELS}

BADGES = level_badges() + [
    # --- platform -----------------------------------------------------------
    dict(id="first-game", name="First Steps", game="platform", icon="spark",
         desc="Complete your first game.", check=lambda s: s["games"] >= 1),
    dict(id="dedicated", name="Dedicated Learner", game="platform", icon="flame",
         desc="Complete 100 games.", check=lambda s: s["games"] >= 100),
    dict(id="all-rounder", name="All-Rounder", game="platform", icon="triquetra",
         desc="Play all three games.", check=lambda s: len(s["games_by"]) >= 3),
    dict(id="collector", name="Collector", game="platform", icon="gem",
         desc="Earn 25 badges.", check=lambda s: s["badges"] >= 25),
    dict(id="scholar", name="Scholar", game="platform", icon="mortarboard",
         desc="Reach Honor Student.", check=lambda s: s["class_n"] >= 5),
    dict(id="headmaster", name="The Long Game", game="platform", icon="column",
         desc="Reach Headmaster.", check=lambda s: s["class_n"] >= 8),
    dict(id="champion", name="Champion", game="platform", icon="podium",
         desc="Reach the top 10 of any game leaderboard.", check=lambda s: s["best_board_rank"] <= 10),
    dict(id="legendary", name="Legendary", game="platform", icon="star",
         desc="Reach the top 10 of the overall leaderboard.", check=lambda s: s["overall_rank"] <= 10),
    dict(id="streak-7", name="Seven Days Running", game="platform", icon="calendar",
         desc="Play on seven different days.", check=lambda s: s["active_days"] >= 7),
    dict(id="daily-10", name="Daily Devotion", game="platform", icon="sun",
         desc="Finish 10 daily challenges.", check=lambda s: s["daily_done"] >= 10),
    # --- TableStar ----------------------------------------------------------
    dict(id="ts-first", name="Soundcheck", game="tablestar", icon="guitar",
         desc="Complete a TableStar run.", check=lambda s: s["ts"]["runs"] >= 1),
    dict(id="ts-mult", name="Multiplication Master", game="tablestar", icon="times",
         desc="Answer 250 multiplication questions correctly.", check=lambda s: s["ts"]["mult"] >= 250),
    dict(id="ts-div", name="Division Master", game="tablestar", icon="divide",
         desc="Answer 150 division questions correctly.", check=lambda s: s["ts"]["div"] >= 150),
    dict(id="ts-perfect", name="Perfect Accuracy", game="tablestar", icon="target",
         desc="Finish a run with 100% accuracy (12+ answers).", check=lambda s: s["ts"]["perfect"] >= 1),
    dict(id="ts-speed", name="Speed Champion", game="tablestar", icon="bolt",
         desc="Average under 2 seconds per correct answer in a run.", check=lambda s: s["ts"]["fast_run"] >= 1),
    dict(id="ts-studio", name="Studio Veteran", game="tablestar", icon="mic",
         desc="Complete 20 Studio runs.", check=lambda s: s["ts"]["studio_runs"] >= 20),
    # the speed ladder: each rank is a badge, slowest to fastest
    dict(id="ts-rank-unsigned", name="Unsigned Act", game="tablestar", icon="mic",
         desc="Get on the Studio bill.", check=lambda s: s["ts"]["studio_idx"] >= 0),
    dict(id="ts-rank-breakthrough", name="Breakthrough Artist", game="tablestar", icon="bolt",
         desc="Average under 6 seconds per correct answer.", check=lambda s: s["ts"]["studio_idx"] >= 1),
    dict(id="ts-rank-support", name="Support Act", game="tablestar", icon="star",
         desc="Average under 4.5 seconds per correct answer.", check=lambda s: s["ts"]["studio_idx"] >= 2),
    dict(id="ts-rank-headliner", name="Headliner", game="tablestar", icon="gem",
         desc="Average under 3.4 seconds per correct answer.", check=lambda s: s["ts"]["studio_idx"] >= 3),
    dict(id="ts-rank-rockstar", name="Rock Star", game="tablestar", icon="crown",
         desc="Average under 2.6 seconds per correct answer.", check=lambda s: s["ts"]["studio_idx"] >= 4),
    dict(id="ts-rank-legend", name="Rock Legend", game="tablestar", icon="trophy",
         desc="Average under 2 seconds per correct answer.", check=lambda s: s["ts"]["studio_idx"] >= 5),
    dict(id="ts-rank-hero", name="Rock Hero", game="tablestar", icon="spark",
         desc="Average under 1.5 seconds per correct answer — the top of the bill.",
         check=lambda s: s["ts"]["studio_idx"] >= 6),
    dict(id="ts-tables", name="All Twelve", game="tablestar", icon="grid",
         desc="Answer correctly from every table 1–12.", check=lambda s: len(s["ts"]["tables"]) >= 12),
    # --- Spellbound ---------------------------------------------------------
    dict(id="sb-first", name="First Words", game="spellbound", icon="quill",
         desc="Complete a spelling session.", check=lambda s: s["sb"]["sessions"] >= 1),
    dict(id="sb-perfect", name="Perfect Speller", game="spellbound", icon="target",
         desc="Finish a session without a single mistake (8+ words).", check=lambda s: s["sb"]["perfect"] >= 1),
    dict(id="sb-streak", name="Consecutive", game="spellbound", icon="chain",
         desc="Spell 20 words correctly in a row.", check=lambda s: s["sb"]["best_streak"] >= 20),
    dict(id="sb-master", name="Vocabulary Master", game="spellbound", icon="book",
         desc="Master 50 different words.", check=lambda s: s["sb"]["mastered"] >= 50),
    dict(id="sb-champion", name="Spelling Champion", game="spellbound", icon="trophy",
         desc="Complete every word list at least once.", check=lambda s: len(s["sb"]["lists"]) >= 9),
    dict(id="sb-collector", name="Word Collector", game="spellbound", icon="gem",
         desc="Attempt 150 different words.", check=lambda s: s["sb"]["seen"] >= 150),
    dict(id="sb-expert", name="Extreme Speller", game="spellbound", icon="bolt",
         desc="Score 90%+ on an Extreme session.", check=lambda s: s["sb"]["extreme_best"] >= 90),
    dict(id="sb-wordsmith", name="Wordsmith", game="spellbound", icon="quill",
         desc="Spell 500 words correctly in total.", check=lambda s: s["sb"]["correct"] >= 500),
    # --- WorldQuest ---------------------------------------------------------
    dict(id="wq-first", name="First Continent", game="worldquest", icon="globe",
         desc="Identify your first country.", check=lambda s: s["wq"]["identified"] >= 1),
    dict(id="wq-europe", name="European Explorer", game="worldquest", icon="map",
         desc="Master 40 European countries.", check=lambda s: s["wq"]["by_cont"].get("Europe", 0) >= 40),
    dict(id="wq-asia", name="Asian Explorer", game="worldquest", icon="map",
         desc="Master 35 Asian countries.", check=lambda s: s["wq"]["by_cont"].get("Asia", 0) >= 35),
    dict(id="wq-africa", name="African Explorer", game="worldquest", icon="map",
         desc="Master 40 African countries.", check=lambda s: s["wq"]["by_cont"].get("Africa", 0) >= 40),
    dict(id="wq-namerica", name="North American Explorer", game="worldquest", icon="map",
         desc="Master 15 North American countries.", check=lambda s: s["wq"]["by_cont"].get("North America", 0) >= 15),
    dict(id="wq-samerica", name="South American Explorer", game="worldquest", icon="map",
         desc="Master 10 South American countries.", check=lambda s: s["wq"]["by_cont"].get("South America", 0) >= 10),
    dict(id="wq-oceania", name="Oceania Explorer", game="worldquest", icon="map",
         desc="Master 10 Oceanian countries.", check=lambda s: s["wq"]["by_cont"].get("Oceania", 0) >= 10),
    dict(id="wq-world", name="World Explorer", game="worldquest", icon="globe",
         desc="Master at least one country in every continent.", check=lambda s: len(s["wq"]["by_cont"]) >= 6),
    dict(id="wq-capital", name="Capital Master", game="worldquest", icon="column",
         desc="Name 100 capitals correctly.", check=lambda s: s["wq"]["capitals"] >= 100),
    dict(id="wq-flag", name="Flag Expert", game="worldquest", icon="flag",
         desc="Identify 100 flags correctly.", check=lambda s: s["wq"]["flags"] >= 100),
    dict(id="wq-196", name="The 196", game="worldquest", icon="crown",
         desc="Complete the Extreme World Challenge: all 196 countries.",
         check=lambda s: s["wq"]["challenge_done"] >= 1),
    dict(id="wq-global", name="Global Champion", game="worldquest", icon="trophy",
         desc="Master 100 countries across the world.", check=lambda s: s["wq"]["mastered"] >= 100),
]

BADGE_BY_ID = {b["id"]: b for b in BADGES}

# --------------------------------------------------------------------------- #
# Daily challenges — three per player per day, deterministic, all real.
# kind is what the server increments from completed sessions.
# --------------------------------------------------------------------------- #
DAILY_POOL = [
    dict(kind="ts_correct", goal=20, text="Answer 20 TableStar questions correctly", bits=12, xp=10),
    dict(kind="ts_correct", goal=40, text="Answer 40 TableStar questions correctly", bits=20, xp=18),
    dict(kind="ts_studio", goal=1, text="Finish a Studio run", bits=10, xp=8),
    dict(kind="sb_correct", goal=20, text="Spell 20 words correctly", bits=12, xp=10),
    dict(kind="sb_perfect", goal=1, text="Finish a spelling session with no mistakes", bits=18, xp=15),
    dict(kind="sb_words", goal=15, text="Practise 15 different words", bits=14, xp=12),
    dict(kind="wq_correct", goal=15, text="Identify 15 countries", bits=12, xp=10),
    dict(kind="wq_correct", goal=30, text="Identify 30 countries", bits=20, xp=18),
    dict(kind="wq_capitals", goal=10, text="Name 10 capital cities", bits=14, xp=12),
    dict(kind="all_three", goal=3, text="Play all three games today", bits=25, xp=20),
    dict(kind="sessions", goal=3, text="Complete 3 game sessions", bits=15, xp=12),
    dict(kind="accuracy", goal=90, text="Finish a session with 90%+ accuracy", bits=12, xp=10),
]


def todays_challenges(seed: str, date_key: str) -> list[dict]:
    """Deterministic three challenges for a player/day (no storage needed)."""
    import hashlib
    h = hashlib.sha256(f"{seed}:{date_key}".encode()).digest()
    pool = list(DAILY_POOL)
    picked = []
    for i in range(3):
        idx = h[i] % len(pool)
        picked.append(pool.pop(idx))
    return picked


def date_key(ts: float) -> str:
    import datetime as dt
    return dt.datetime.fromtimestamp(ts).strftime("%Y-%m-%d")


def level_progress(xp: int) -> dict:
    """Small helper used by the leaderboard rows."""
    c = class_for(xp)
    return {"class": c["name"], "classN": c["n"], "hue": c["hue"], "pct": c["pct"]}


def geometry_km(a, b) -> float:
    """Great-circle distance, used to sanity-check capital answers."""
    lon1, lat1, lon2, lat2 = map(math.radians, [a[0], a[1], b[0], b[1]])
    dlon, dlat = lon2 - lon1, lat2 - lat1
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 6371 * 2 * math.asin(math.sqrt(h))
