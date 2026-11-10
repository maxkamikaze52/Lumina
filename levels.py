"""Astrolab — the level ladder.

One hundred levels.  Each level costs about 4.5% more than the one before, and
the first ten also climb linearly so the start is not a blur: level 100 sits at
4,638,000 XP, which is roughly 977 perfect 50-question Studio games.

Every level is a badge, and the badges carry the design: the emblem changes
motif every level and changes colour family every ten.
"""

MAX_LEVEL = 100
BASE = 600          # the linear term: level 2 costs ~630
GROWTH = 1.045      # ...and each level after that is 4.5% more expensive


def _round_to(v: float) -> int:
    if v < 5000:
        return int(round(v / 10) * 10)
    if v < 100000:
        return int(round(v / 100) * 100)
    return int(round(v / 1000) * 1000)


def _threshold(n: int) -> int:
    """Total XP needed to hold level n (level 1 is always 0)."""
    if n <= 1:
        return 0
    return _round_to(BASE * (n - 1) * (GROWTH ** (n - 1)))


# ten stages of ten levels, each a colour family and a name
STAGES = [
    ("Soundcheck", "gray"), ("Open Mic", "bronze"), ("Club Circuit", "copper"),
    ("Support Act", "silver"), ("Headliner", "gold"), ("Tour Bus", "jade"),
    ("Arena", "sapphire"), ("Stadium", "amethyst"), ("Legend", "crimson"),
    ("Hall of Fame", "prism"),
]

ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

EMBLEMS = [
    "compass", "book", "scroll", "pencil", "laurel", "trophy", "flask",
    "column", "star", "crown", "gem", "bolt", "target", "flame",
    "grid", "times", "divide", "triquetra", "podium", "spark",
]


def _stage_of(n: int) -> tuple[str, str]:
    i = min(len(STAGES) - 1, (n - 1) // 10)
    return STAGES[i][0], STAGES[i][1]


LEVELS = []
for _n in range(1, MAX_LEVEL + 1):
    _stage, _metal = _stage_of(_n)
    _step = min(9, (_n - 1) % 10)
    LEVELS.append({
        "n": _n,
        "id": "lvl-%03d" % _n,
        "name": "Level %d" % _n,
        "title": "%s %s" % (_stage, ROMAN[_step]) if _n % 10 else _stage,
        "stage": _stage,
        "metal": _metal,
        "step": _step,
        "xp": _threshold(_n),
        "emblem": EMBLEMS[_step],
    })

# the XP figure and the short name, for the ladder display
XP_PER_LEVEL = {l["n"]: l["xp"] for l in LEVELS}
LEVEL_TITLES = {l["n"]: l["title"] for l in LEVELS}


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
