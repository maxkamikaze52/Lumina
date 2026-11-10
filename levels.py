"""Astrolab — the level ladder.

Twenty levels on an exponential curve: each one costs about 55% more XP than the
last, so the first few arrive quickly and the top of the ladder is a long climb.
Every level is also a badge, and the top of the ladder unlocks the last shop items.
"""

BASE_XP = 1500       # level 2 costs this much (10x the old XP unit)
GROWTH = 1.55        # each level costs 55% more than the one before
MAX_LEVEL = 20


def _round_to(v: float) -> int:
    if v < 1000:
        return int(round(v / 10) * 10)
    if v < 10000:
        return int(round(v / 100) * 100)
    if v < 100000:
        return int(round(v / 500) * 500)
    return int(round(v / 5000) * 5000)


def _threshold(n: int) -> int:
    """XP needed to *hold* level n (level 1 is always 0)."""
    if n <= 1:
        return 0
    return _round_to(BASE_XP * (GROWTH ** (n - 2)))


LEVELS = [
    {
        "n": n,
        "id": "lvl-%02d" % n,
        "name": "Level %d" % n,
        "xp": _threshold(n),
        "emblem": [
            "compass", "book", "scroll", "pencil", "laurel", "trophy", "flask",
            "column", "star", "crown", "gem", "bolt", "target", "flame",
            "grid", "times", "divide", "triquetra", "podium", "spark",
        ][n - 1],
    }
    for n in range(1, MAX_LEVEL + 1)
]

# what each level is called on the ladder, for the badge list and the profile
LEVEL_TITLES = {
    1: "First Note", 2: "Soundcheck", 3: "Warm-Up", 4: "Open Mic",
    5: "Support Act", 6: "Small Venue", 7: "Tour Bus", 8: "Headliner",
    9: "Sold Out", 10: "Gold Record", 11: "Platinum", 12: "Arena",
    13: "Stadium", 14: "Festival", 15: "Legend", 16: "Hall of Fame",
    17: "Icon", 18: "Superstar", 19: "Immortal", 20: "Starbit Legend",
}
for _l in LEVELS:
    _l["title"] = LEVEL_TITLES[_l["n"]]

XP_PER_LEVEL = {l["n"]: l["xp"] for l in LEVELS}


def level_for(xp: int) -> dict:
    """Which level this XP total is, how far into it, and what comes next."""
    cur = LEVELS[0]
    for l in LEVELS:
        if xp >= l["xp"]:
            cur = l
    nxt = next((l for l in LEVELS if l["xp"] > xp), None)
    if nxt:
        span = nxt["xp"] - cur["xp"]
        pct = (xp - cur["xp"]) / span if span else 1
        return {**cur, "next": nxt, "toNext": nxt["xp"] - xp,
                "pct": round(min(1, pct) * 100, 1)}
    return {**cur, "next": None, "toNext": 0, "pct": 100}
