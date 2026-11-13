"""Astrolab — SHOP API (content side).

Everything about buying things, wearing things and placing things in a room.
The games side never edits this file; `app.py` just forwards every request to
`handle()`, which returns None for anything it does not own.

Routes
  POST /api/shop/buy       {item}            buy one item (level locks are checked in store.buy)
  POST /api/shop/buy-set   {set}             buy every piece of a set you do not own, at the set price
  POST /api/character      {equipped:{...}}  save what the character wears
  POST /api/room           {room:{...}}      save the room layout
"""
from __future__ import annotations

import secrets

import catalogue
import config
import store

# every route this module owns
ROUTES = {"/api/shop/buy", "/api/shop/buy-set", "/api/character", "/api/room"}


def _usable(item_id, owned: set) -> bool:
    """You may wear / place an item you own, or any free starter item."""
    return item_id in catalogue.ITEM_BY_ID and (item_id in owned or catalogue.is_free(item_id))


def _buy_set(pid: str, set_id: str) -> tuple[bool, str, int]:
    """Buy the missing pieces of a set in ONE transaction: all of them or none."""
    s = next((x for x in catalogue.SET_LIST if x["id"] == set_id), None)
    if not s:
        return False, "That set does not exist.", 0
    owned = store.owned(pid)
    missing = [i for i in s["items"] if i not in owned and not catalogue.is_free(i)]
    if not missing:
        return False, "You already own every piece.", 0
    level = int(config.class_for(store.get(pid)["xp"])["n"])
    for i in missing:
        need = int(catalogue.ITEM_BY_ID[i].get("level") or 1)
        if level < need:
            return False, "%s is locked until level %d." % (catalogue.ITEM_BY_ID[i]["name"], need), 0
    cost = catalogue.set_price(s["items"], owned)
    with store.db() as con:
        if not store.spend(con, pid, cost):
            return False, "Not enough Starbits.", cost
        for i in missing:
            con.execute("INSERT OR IGNORE INTO inventory VALUES(?,?,?)", (pid, i, store.now()))
    return True, "%s set added to your collection." % s["name"], cost


def handle(path: str, method: str, body: dict, pid: str, player: dict) -> tuple[int, dict] | None:
    """Return (status, payload), or None if the route is not ours."""
    if path not in ROUTES:
        return None

    if path == "/api/character" and method == "POST":
        equip = body.get("equipped") or {}
        owned = store.owned(pid)
        clean = {slot: None for slot in catalogue.SLOTS}
        # an item goes in the slot it belongs to, whatever key the browser filed it under
        # (this also quietly upgrades characters saved before glasses/scarves/wings had slots of their own)
        for v in equip.values():
            if isinstance(v, str) and _usable(v, owned):
                clean[catalogue.ITEM_BY_ID[v]["slot"]] = v
        store.save_character(pid, clean)
        return 200, {"equipped": clean}

    if path == "/api/room" and method == "POST":
        room = body.get("room") or {}
        owned = store.owned(pid)
        theme = room.get("theme")
        if not (_usable(theme, owned) and catalogue.ITEM_BY_ID[theme]["slot"] == "theme"):
            theme = (player.get("room") or {}).get("theme", "theme-study")
        items = []
        for it in (room.get("items") or [])[:60]:
            iid = it.get("item")
            if not _usable(iid, owned) or catalogue.ITEM_BY_ID[iid]["slot"] != "furniture":
                continue
            try:
                items.append({
                    "uid": str(it.get("uid") or secrets.token_hex(3))[:12],
                    "item": iid,
                    "x": round(max(0, min(960, float(it.get("x", 400)))), 1),
                    "y": round(max(0, min(600, float(it.get("y", 400)))), 1),
                    "z": max(0, min(3, int(it.get("z", 1)))),
                    "flip": bool(it.get("flip", False)),
                })
            except (TypeError, ValueError):
                continue
        layout = {"theme": theme, "items": items}
        store.save_room(pid, layout)
        return 200, {"room": layout}

    if path == "/api/shop/buy" and method == "POST":
        ok, msg = store.buy(pid, str(body.get("item") or ""))
        p = store.get(pid)
        return (200 if ok else 400), {"ok": ok, "message": msg,
                                      "starbits": p["starbits"],
                                      "owned": sorted(store.owned(pid))}

    if path == "/api/shop/buy-set" and method == "POST":
        ok, msg, cost = _buy_set(pid, str(body.get("set") or ""))
        p = store.get(pid)
        return (200 if ok else 400), {"ok": ok, "message": msg, "spent": cost if ok else 0,
                                      "starbits": p["starbits"],
                                      "owned": sorted(store.owned(pid))}

    return 405, {"error": "method not allowed"}
