#!/usr/bin/env python3
"""Build Spellbound's daily data: 4 x 5000 word tiers + honeycomb letter sets.

Inputs   /usr/share/dict/words (words) and /tmp/en_50k.txt (usage frequency)
Output   public/data/spellbound.json
"""
import json, math, random, re
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "data" / "spellbound.json"
DICT = Path("/usr/share/dict/words")
FREQ = Path("/tmp/en_50k.txt")

LEVELS = ["easy", "intermediate", "hard", "extreme"]
PER_LEVEL = 5000
SETS_PER_LEVEL = 48

# letters people actually trip over when spelling
HARD_LETTERS = set("jqxzvwky")
SILENT = ("gh", "kn", "wr", "mb", "mn", "ps", "pn", "ough", "eigh", "ie", "ei",
          "sc", "ph", "rh", "bt", "gn", "lm", "que", "our", "ae", "oe")
VOWELS = set("aeiouy")

# keep the hive school-safe
BANNED_EXACT = {"arse", "ass", "sex", "sexy", "hell", "damn", "crap", "turd", "privy"}
BANNED_PARTS = ("fuck", "shit", "cunt", "bitch", "whore", "porn", "rape", "nigg",
                "wank", "piss", "orgasm", "penis", "vagina", "clitor", "sperm",
                "cock", "dick", "slut", "anus", "titty", "scrot", "testicl", "pube",
                "boob", "bollock", "bastard", "bugger", "douche",
                # school-safe: anatomy, bodily functions, adult vocabulary
                "testi", "foreskin", "genital", "erecti", "masturb", "homosex",
                "sexu", "bdsm", "nudity", "naked", "nipple", "orgy", "incest",
                "semen", "sodom", "paedoph", "pedoph", "heroin", "cocaine",
                "diarrh", "vomit", "fart", "rectum", "prostit", "aborti", "suicid",
                "murder", "corpse", "cancer", "tumor", "tumour")


def banned(word):
    if word in BANNED_EXACT:
        return True
    return any(p in word for p in BANNED_PARTS)


# words that are really fragments of a name or a place, never used alone
FLAG_SKIP = {"grad", "mast", "rang", "putt", "specie", "obsess"}


def load_freq():
    """real usage frequency (wordfreq zipf), not dictionary order"""
    from wordfreq import zipf_frequency
    return zipf_frequency


def vocabulary():
    """Everyday English only: real usage, plus a lowercase-only dictionary entry.

    The lowercase check keeps proper nouns out (adrian, tunis and noaa are in the
    frequency list but only ever capitalised); the frequency floor in candidates()
    keeps archaic dictionary-only words out.
    """
    from wordfreq import top_n_list
    entries = DICT.read_text(encoding="utf-8", errors="ignore").split()
    lower = {w for w in entries if w == w.lower() and w.isalpha()}
    words = [w for w in top_n_list("en", 120000) if w in lower]
    # a real flag beats a truncated one: "carr", "chang", "machin", "kell"
    flags = {w for w in entries if not w.islower() and w.isalpha()}
    stems = {f.lower() for f in flags if f.lower() in lower}
    return [w for w in words if w not in stems and w not in FLAG_SKIP]


def candidates(rank):
    raw = vocabulary()
    out = set()
    for w in raw:
        lw = w.lower()
        if not (4 <= len(lw) <= 12):
            continue
        if not re.fullmatch(r"[a-z]+", lw):
            continue
        if rank(lw, "en") < 2.4:    # must be a word people actually meet
            continue
        if len(lw) < 4:
            continue
        if not (set(lw) & VOWELS):
            continue
        if w[0].isupper():          # proper nouns
            continue
        if re.search(r"(.)\1\1", lw):   # aaa
            continue
        if banned(lw):
            continue
        out.add(lw)
    return out


def difficulty(word, rank):
    """Higher = harder to spell. Familiarity, length, awkward letters, silent bits."""
    z = rank(word, "en")
    score = 3.6 * max(0.0, min(4.2, 6.2 - z))
    score += 0.55 * (len(word) - 3)
    score += 0.42 * sum(1 for c in word if c in HARD_LETTERS)
    score += 0.38 * sum(1 for p in SILENT if p in word)
    if re.search(r"(.)\1", word):
        score += 0.30
    if len(set(word)) >= 6:
        score += 0.25
    if word.endswith("ed") or word.endswith("ing"):
        score -= 0.15          # inflections are more predictable
    return score


POINTS = {4: 10, 5: 25, 6: 45, 7: 70, 8: 100, 9: 140, 10: 180, 11: 230, 12: 280}
PANGRAM_BONUS = 100


def points(word):
    return POINTS.get(len(word), 30 * len(word))


def hive_sets(pool, count, board=None):
    """Letter sets (7 letters) that make real words, drawn from this level's band.

    The hive's seven letters come from a long, hard word of *this* band, so the
    spoken round at Extreme really is Extreme. The board of words you can hunt
    also draws on the easier bands (`board`), the way a real Spelling Bee hive
    lets you find short words inside a hard letter set.
    """
    board = board or pool
    by_sig = {}
    for w in pool:
        if len(w) < 7:
            continue
        sig = "".join(sorted(set(w)))
        if len(sig) != 7:
            continue
        by_sig.setdefault(sig, set()).add(w)

    def formable(word, letters):
        return all(c in letters for c in word)

    scored = []
    for sig in by_sig:
        letters = set(sig)
        vals = sorted({w for w in board if len(w) >= 4 and formable(w, letters)})
        if len(vals) < 14:
            continue
        long_ones = [w for w in vals if len(w) >= 7 and w in pool]
        if len(long_ones) < 3:
            continue
        total = sum(points(w) for w in vals)
        # ranks by how many long words it holds, then by the size of the board
        scored.append((len(long_ones) * 3 + len(vals) + total / 400.0, sig, vals, total))

    scored.sort(reverse=True)
    picked, used_alpha = [], set()
    for sc, sig, vals, total in scored:
        if sig in used_alpha:
            continue
        # keep letter sets varied: no more than 2 sets sharing 6 of 7 letters
        if sum(1 for p in picked if len(set(p["sig"]) & set(sig)) >= 6) >= 2:
            continue
        centre = pick_centre(sig, vals)
        vals = [w for w in vals if centre in w]
        if len(vals) < 12:
            continue
        picked.append({"sig": sig, "letters": list(sig), "centre": centre,
                       "words": sorted(vals, key=lambda w: (len(w), w))})
        used_alpha.add(sig)
        if len(picked) >= count:
            break
    return picked


def pick_centre(sig, vals):
    """The centre letter should leave plenty of answers on the board."""
    best, best_n = sig[0], -1
    for c in sig:
        n = sum(1 for w in vals if c in w)
        if n > best_n:
            best, best_n = c, n
    return best


def main():
    rank = load_freq()
    pool = sorted(candidates(rank), key=lambda w: difficulty(w, rank))
    print("candidates", len(pool), "need", PER_LEVEL * len(LEVELS))
    assert len(pool) >= PER_LEVEL * len(LEVELS), (
        f"only {len(pool)} usable words: widen the frequency floor or the length cap")
    bands = []                       # difficulty bands, each PER_LEVEL words deep
    for i, lv in enumerate(LEVELS):
        lo = int(i * len(pool) / 4)
        bands.append(pool[lo:lo + PER_LEVEL])
        print(lv, len(bands[-1]), bands[-1][0], "->", bands[-1][-1])

    data = {"levels": {}, "points": {str(k): v for k, v in POINTS.items()},
            "pangram": PANGRAM_BONUS}
    for lv, words in zip(LEVELS, bands):
        # the board may use every band up to this one; the hive letters come
        # from this band, so a hard hive still throws hard spoken words.
        board = sorted({w for b in bands[:LEVELS.index(lv) + 1] for w in b})
        sets = hive_sets(words, SETS_PER_LEVEL, board)
        data["levels"][lv] = {
            "words": words,
            "sets": [{"letters": s["letters"], "centre": s["centre"], "words": s["words"]}
                     for s in sets],
        }
        print(lv, "words", len(words), "hive sets", len(sets),
              "avg answers", round(sum(len(s["words"]) for s in sets) / max(1, len(sets)), 1))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, separators=(",", ":")))
    print("wrote", OUT, OUT.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
