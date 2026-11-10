"""Astrolab — TableStar's learning path (the Garage).

Learning happens in the GARAGE.  The ladder is forced, so a player cannot skip
straight to the fun:

  1. TEST   a 3-minute multiplication test over the whole 1-12 grid
  2. STUDY  the tables that test exposed as weak — that is all the Garage lets
            you play until those facts are secure
  3. TEST   another 3-minute test, automatically, once the study round is done
  4. back to 2 with the next weakest tables, until three tests in a row are good
     and the last one is excellent
  5. MASTERED  from then on both the Garage and Studio serve ALL the times
            tables and ALL the divisions, and the test never comes back.

STUDIO is not part of this path: it is always the full deck (1-12 × and 1-12 ÷)
and it only measures speed.  Speed ranks live in `config.STUDIO_CLASSES`.
"""
from __future__ import annotations

import json

import store

# the 78 distinct multiplication facts of a 12x12 table (a x b and b x a are one fact)
MUL_FACTS = [(a, b) for a in range(1, 13) for b in range(a, 13)]

STAGES = ["test", "study", "mastered"]
STAGE_TOKENS = {"study": 25, "test": 20, "mastered": 150}

# a test round is this long, and a study round is shorter (it is a drill)
TEST_SECONDS = 180
STUDY_SECONDS = 60

# how a test is judged
GOOD_ACCURACY = 0.90        # "you did well enough": 90%+ of a full-grid test
GOOD_MIN_ANSWERS = 15       # ...on a real attempt, not three lucky questions
EXCELLENT_ACCURACY = 0.96   # "really, really well"
EXCELLENT_PER_ANSWER = 3.0  # seconds per correct answer
GOOD_IN_A_ROW = 3           # tests in a row, the last one excellent, and it's yours

# a fact is secure once it has been answered right twice at 80%+
SECURE_MIN_CORRECT = 2
SECURE_ACCURACY = 0.80

TEACH_BLOCK = 2             # weakest *tables* drilled in one study round


def fact_key(a: int, b: int) -> str:
    return f"m:{min(a, b)}x{max(a, b)}"


def _rows(pid: str) -> dict:
    return {r["fact"]: r for r in store.perfacts(pid)}


def _secure(row) -> bool:
    if not row:
        return False
    c, w = row["correct"] or 0, row["wrong"] or 0
    if c < SECURE_MIN_CORRECT:
        return False
    return c / max(1, c + w) >= SECURE_ACCURACY


def grid(pid: str) -> list[dict]:
    rows = _rows(pid)
    out = []
    for a, b in MUL_FACTS:
        r = rows.get(fact_key(a, b))
        out.append({
            "key": fact_key(a, b), "a": a, "b": b, "answer": a * b,
            "correct": (r["correct"] if r else 0),
            "wrong": (r["wrong"] if r else 0),
            "ms": round(r["ms"] or 0) if r else 0,
            "secure": _secure(r),
        })
    return out


def tables(pid: str) -> list[dict]:
    """Every table 1-12 scored on its own twelve facts, weakest first."""
    facts = grid(pid)
    out = []
    for t in range(1, 13):
        mine = [f for f in facts if f["a"] == t or f["b"] == t]
        c = sum(f["correct"] for f in mine)
        w = sum(f["wrong"] for f in mine)
        seen = c + w
        out.append({
            "table": t,
            "accuracy": round(c / seen, 3) if seen else None,
            "correct": c, "wrong": w,
            "secure": sum(1 for f in mine if f["secure"]),
            "facts": len(mine),
            "ms": round(sum(f["ms"] for f in mine) / len(mine)) if any(f["ms"] for f in mine) else 0,
        })
    # weakest first: fewest facts secure, then worst accuracy, then most misses
    out.sort(key=lambda x: (round(x["secure"] / x["facts"], 3),
                            x["accuracy"] if x["accuracy"] is not None else -1,
                            -x["wrong"], x["table"]))
    return out


def _target_facts(pid: str, targets: list[int]) -> list[str]:
    """Every fact of the chosen tables (a table is both of its factors)."""
    want = set(targets)
    return [f["key"] for f in grid(pid) if f["a"] in want or f["b"] in want]


def _meta(pid: str) -> dict:
    return {
        "stage": store.meta_get(pid, "gig_stage", "test"),
        "round": int(store.meta_get(pid, "gig_round", "0") or 0),
        "targets": json.loads(store.meta_get(pid, "gig_targets", "[]") or "[]"),
        "streak": int(store.meta_get(pid, "gig_streak", "0") or 0),
        "tests": int(store.meta_get(pid, "gig_tests", "0") or 0),
        "mastered": store.meta_get(pid, "gig_mastered", "") == "1",
        "last": json.loads(store.meta_get(pid, "gig_last_test", "null") or "null"),
    }


def _save(pid: str, **kw) -> None:
    for k, v in kw.items():
        if k == "targets":
            store.meta_set(pid, "gig_targets", json.dumps(v))
        elif k == "last":
            store.meta_set(pid, "gig_last_test", json.dumps(v))
        else:
            store.meta_set(pid, "gig_" + k, str(v))


def _targets_done(pid: str, targets: list[str]) -> bool:
    if not targets:
        return False
    rows = _rows(pid)
    return all(_secure(rows.get(k)) for k in targets)


def heatmap(pid: str, kind: str = "m") -> list[dict]:
    """The full 12x12 board for a colour map: every fact, how it has gone.

    `kind` is "m" for multiplication or "d" for division; division facts are
    stored against the same canonical pair, so the two maps line up.
    """
    rows = _rows(pid)
    out = []
    for a in range(1, 13):
        for b in range(1, 13):
            r = rows.get(f"{kind}:{min(a, b)}x{max(a, b)}")
            c = (r["correct"] or 0) if r else 0
            w = (r["wrong"] or 0) if r else 0
            seen = c + w
            out.append({
                "a": a, "b": b, "seen": seen,
                "acc": round(c / seen, 2) if seen else None,
                "secure": _secure(r),
                "ms": round(r["ms"]) if r and r["ms"] else 0,
            })
    return out


def plan(pid: str) -> dict:
    """The Garage: what you must do next, and why."""
    m = _meta(pid)
    facts = grid(pid)
    secure = sum(1 for f in facts if f["secure"])
    total = len(facts)
    ranked = tables(pid)

    if m["mastered"]:
        stage = "mastered"
        targets = []
        done = True
    else:
        stage = m["stage"] if m["stage"] in STAGES else "test"
        targets = m["targets"]
        done = _targets_done(pid, _target_facts(pid, targets))
        if stage == "test" and targets and not done:
            stage = "study"      # self-healing: the study round is not finished

    if stage == "test":
        cta, detail = "Take the 3-minute test", (
            "Three minutes, every table 1-12 at once. Whatever it exposes is what the "
            "Garage makes you learn before it will test you again.")
        secs, mode = TEST_SECONDS, "test"
    elif stage == "study":
        detail = ("Study the tables the test found weak. You cannot take the test again "
                  "until these facts are secure.")
        cta, secs, mode = "Study the weak tables", STUDY_SECONDS, "study"
    else:
        cta, detail = "Everything is unlocked", (
            "All the times tables and all the divisions, in the Garage and the Studio. "
            "The test never comes back.")
        secs, mode = STUDY_SECONDS, "full"

    target_tables = [int(t) for t in targets]
    return {
        "stage": stage,
        "stageIndex": STAGES.index(stage),
        "round": m["round"],
        "cta": cta,
        "detail": detail,
        "mode": mode,
        "seconds": secs,
        "ops": "mul" if stage != "mastered" else "both",
        "targets": targets,
        "targetTables": target_tables,
        "targetsDone": done,
        "ready": stage != "study" or done,
        "secure": secure, "total": total,
        "remaining": max(0, total - secure),
        "pct": round(secure / total * 100, 1) if total else 0,
        "goodStreak": m["streak"], "goodNeeded": GOOD_IN_A_ROW,
        "tests": m["tests"],
        "mastered": m["mastered"],
        "lastTest": m["last"],
        "weakest": ranked[:4],
        "tableGrid": [{"table": t["table"], "accuracy": t["accuracy"],
                       "wrong": t["wrong"], "secure": t["secure"]} for t in ranked],
        "mulHeat": heatmap(pid, "m"),
        "divHeat": heatmap(pid, "d"),
        "judge": {"good": GOOD_ACCURACY, "excellent": EXCELLENT_ACCURACY,
                  "perAnswer": EXCELLENT_PER_ANSWER, "minAnswers": GOOD_MIN_ANSWERS},
    }


def _pay(pid: str, tag: str, tokens: int, reason: str) -> dict | None:
    """Pay a level reward exactly once per tag."""
    paid = set(json.loads(store.meta_get(pid, "gig_paid", "[]") or "[]"))
    if tag in paid:
        return None
    paid.add(tag)
    store.meta_set(pid, "gig_paid", json.dumps(sorted(paid)))
    with store.db() as con:
        store.credit(con, pid, 0, tokens)
    return {"tokens": tokens, "reason": reason}


def _verdict(correct: int, total: int, duration: float) -> dict:
    acc = (correct / total) if total else 0.0
    per = (duration / correct) if correct else 99.0
    good = acc >= GOOD_ACCURACY and correct >= GOOD_MIN_ANSWERS
    excellent = good and acc >= EXCELLENT_ACCURACY and per <= EXCELLENT_PER_ANSWER
    return {"accuracy": round(acc, 3), "perAnswer": round(per, 2),
            "good": good, "excellent": excellent, "correct": correct, "total": total}


def after_garage(pid: str, correct: int, total: int, duration: float, stage: str) -> dict:
    """Called after a Garage session. Moves the forced path on if earned."""
    awarded: list[dict] = []
    before = plan(pid)
    m = _meta(pid)

    if m["mastered"]:
        if stage == "test":       # a mastered player may still test, it just does nothing
            pass
        return {"awarded": awarded, "plan": before, "advanced": False}

    if stage == "test":
        v = _verdict(correct, total, duration)
        tests = m["tests"] + 1
        streak = (m["streak"] + 1) if (v["good"] and v["excellent"]) else \
                 (max(1, m["streak"]) if v["good"] else 0)
        _save(pid, tests=tests, streak=streak, last={**v, "round": m["round"] + 1})
        if streak >= GOOD_IN_A_ROW:
            _save(pid, stage="mastered", mastered="1", targets=[])
            pay = _pay(pid, "stage:mastered", STAGE_TOKENS["mastered"],
                       "All tables and all divisions unlocked")
            if pay:
                awarded.append(pay)
        else:
            # the test decides what you study next: the weakest tables it exposed
            ranked = tables(pid)
            chosen = [t["table"] for t in ranked[:TEACH_BLOCK]]
            _save(pid, stage="study", round=m["round"] + 1, targets=chosen)
            pay = _pay(pid, f"test:{m['round']}", STAGE_TOKENS["test"],
                       f"Test {tests} sat — weak tables found")
            if pay:
                awarded.append(pay)
    elif stage == "study":
        if before["targetsDone"] or _targets_done(pid, _target_facts(pid, m["targets"])):
            _save(pid, stage="test")
            pay = _pay(pid, f"study:{m['round']}", STAGE_TOKENS["study"],
                       f"Round {m['round']} secure — the test is back")
            if pay:
                awarded.append(pay)

    after = plan(pid)
    return {"awarded": awarded, "plan": after, "advanced": after["stage"] != before["stage"]}


def after_session(pid: str, mode: str, correct: int, total: int, duration: float = 0) -> dict:
    """Kept for the old call sites: Garage sessions carry their stage in meta."""
    return after_garage(pid, correct, total, duration, mode)


def after_studio(pid: str, correct: int, duration: float, class_index: int) -> dict:
    """Studio pays 1 token per correct answer plus a one-off bonus for a new speed rank."""
    awarded = []
    if correct > 0:
        with store.db() as con:
            store.credit(con, pid, 0, correct)
        awarded.append({"tokens": correct, "reason": "1 per correct answer"})

    best = int(store.meta_get(pid, "studio_best", "-1") or -1)
    tier_bonus = [0, 20, 35, 55, 80, 110, 150]
    if class_index > best:
        store.meta_set(pid, "studio_best", str(class_index))
        pay = _pay(pid, f"speed:{class_index}", tier_bonus[min(class_index, 6)],
                   "New Studio speed rank")
        if pay:
            awarded.append(pay)
    return {"awarded": awarded}
