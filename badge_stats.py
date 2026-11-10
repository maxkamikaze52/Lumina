"""How rare is a badge right now?

The percentage is computed from the live database every time it is asked for, so
it moves as students earn badges: 3 of 12 players -> 25%.  When everybody has it,
it says 100%.  Nothing is cached, so it cannot go stale.
"""
from __future__ import annotations

import store


def population() -> int:
    """How many students count for the percentage."""
    with store.db() as con:
        n = con.execute("SELECT COUNT(*) c FROM players").fetchone()["c"]
    return int(n or 0)


def owned_counts() -> dict[str, int]:
    """badge_id -> how many players hold it."""
    with store.db() as con:
        rows = con.execute(
            "SELECT badge_id, COUNT(*) c FROM badges GROUP BY badge_id").fetchall()
    return {r["badge_id"]: int(r["c"]) for r in rows}


def rarity(badge_id: str, total: int, counts: dict[str, int] | None = None) -> dict:
    """{owners, total, pct, label} for one badge, against a given population."""
    counts = owned_counts() if counts is None else counts
    owners = int(counts.get(badge_id, 0))
    total = max(total, owners, 1)
    pct = round(owners * 100 / total) if total else 0
    if owners == 0:
        label = "nobody yet"
    elif pct >= 100:
        label = "everyone"
    elif pct >= 75:
        label = "most students"
    elif pct >= 40:
        label = "many students"
    elif pct >= 15:
        label = "some students"
    elif pct >= 5:
        label = "few students"
    else:
        label = "very few"
    return {"owners": owners, "total": total, "pct": pct, "label": label}


def all_rarity() -> dict[str, dict]:
    """Every badge's rarity in one pass, so a badge page is one query, not 150."""
    total = population()
    counts = owned_counts()
    return {bid: rarity(bid, total, counts) for bid in counts} | {
        # badges nobody has yet still need a row
    }


def rarity_table() -> dict:
    total = population()
    counts = owned_counts()
    return {"total": total, "counts": counts}
