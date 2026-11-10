"""Astrolab — SHOP API (content side).

Everything about buying things, wearing things and placing things in a room.
The games side never edits this file; `app.py` just forwards the three routes
below to `handle()`.  Add or change catalogue rules here and in `catalogue.py`.
"""
from __future__ import annotations

import secrets

import catalogue
import store

# every route this module owns
ROUTES = {"/api/shop/buy", "/api/character", "/api/room"}


def handle(path: str, method: str, body: dict, pid: str, player: dict) -> tuple[int, dict] | None:
    """Return (status, payload), or None if the route is not ours."""
    if path not in ROUTES:
        return None

    if path == "/api/character" and method == "POST":
        equip = body.get("equipped") or {}
        owned = store.owned(pid)
        clean = {}
        for slot in catalogue.SLOTS:
            v = equip.get(slot)
            if v is None:
                clean[slot] = None
            elif v in catalogue.ITEM_BY_ID and v in owned:
                clean[slot] = v
        store.save_character(pid, clean)
        return 200, {"equipped": clean}

    if path == "/api/room" and method == "POST":
        room = body.get("room") or {}
        owned = store.owned(pid)
        theme = room.get("theme")
        if theme not in catalogue.ITEM_BY_ID or theme not in owned:
            theme = (player.get("room") or {}).get("theme", "theme-study")
        items = []
        for it in (room.get("items") or [])[:60]:
            iid = it.get("item")
            if iid not in catalogue.ITEM_BY_ID or iid not in owned:
                continue
            items.append({
                "uid": str(it.get("uid") or secrets.token_hex(3))[:12],
                "item": iid,
                "x": round(max(0, min(960, float(it.get("x", 400)))), 1),
                "y": round(max(0, min(600, float(it.get("y", 400)))), 1),
                "z": max(0, min(3, int(it.get("z", 1)))),
                "flip": bool(it.get("flip", False)),
            })
        layout = {"theme": theme, "items": items}
        store.save_room(pid, layout)
        return 200, {"room": layout}

    if path == "/api/shop/buy" and method == "POST":
        ok, msg = store.buy(pid, str(body.get("item") or ""))
        p = store.get(pid)
        return (200 if ok else 400), {"ok": ok, "message": msg,
                                      "starbits": p["starbits"],
                                      "owned": sorted(store.owned(pid))}

    return 405, {"error": "method not allowed"}
