"""Throwaway check of the forced Garage path. Deletes its player at the end."""
import store
import tablestar_path as tp

pid = store.create_player("ZZ Path Check")["id"]


def wipe():
    with store.db() as con:
        for t in ("perfacts", "meta", "sessions"):
            con.execute(f"DELETE FROM {t} WHERE player_id=?", (pid,))
        con.execute("DELETE FROM players WHERE id=?", (pid,))


try:
    p = tp.plan(pid)
    print("start        :", p["stage"], "|", p["cta"], "| ready", p["ready"])

    tp.after_garage(pid, 8, 30, 180, "test")
    p = tp.plan(pid)
    print("weak test    :", p["stage"], "| tables", p["targetTables"], "| ready", p["ready"],
          "|", p["seconds"], "s", p["mode"])

    for i in range(4):
        p = tp.plan(pid)
        if p["stage"] == "study":
            with store.db() as con:
                for k in tp._target_facts(pid, p["targets"]):
                    con.execute("INSERT OR REPLACE INTO perfacts VALUES(?,?,?,?,?)",
                                (pid, k, 5, 0, 700))
            r = tp.after_garage(pid, 20, 20, 60, "study")
            p = r["plan"]
            print("study round %d: -> %s | next study tables %s | paid %s"
                  % (i + 1, p["stage"], p["targetTables"], [a["reason"] for a in r["awarded"]]))
        r = tp.after_garage(pid, 34, 35, 60, "test")
        p = r["plan"]
        print("good test %d  : -> %s | streak %d/%d | next %s | paid %s"
              % (i + 1, p["stage"], p["goodStreak"], p["goodNeeded"], p["targetTables"],
                 [a["reason"] for a in r["awarded"]]))
        if p["mastered"]:
            break

    print("final        :", p["mastered"], "|", p["cta"], "| ops", p["ops"], "| targets", p["targets"])

    # a mastered player: a bad test must not take the deck away
    r = tp.after_garage(pid, 3, 20, 180, "test")
    print("bad test after mastery:", r["plan"]["stage"], r["plan"]["mode"])
finally:
    wipe()
    print("cleaned")
