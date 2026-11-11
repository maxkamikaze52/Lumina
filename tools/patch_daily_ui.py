#!/usr/bin/env python3
"""Second Spellbound UI pass: hive board, input class, hex keyboard in the daily game."""
import pathlib

p = pathlib.Path(__file__).resolve().parent.parent / "public" / "js" / "games" / "spellbound-daily.js"
t = p.read_text()
done = []

# 1. the board is now a wooden comb, not a dark card
old_board = """    main.innerHTML = `<div class="stack sb-daily">"""
if old_board in t:
    done.append("daily root classes present")

if "sb-board\">" in t:
    t = t.replace('<div class="sb-board">', '<div class="sb-board sb-comb">')
    done.append("board -> wooden comb")

if '<div class="sb-hint">' in t:
    t = t.replace('<div class="sb-hint">', '<div class="sb-hint sb-paper" style="padding:8px 10px">')
    done.append("hint -> paper plate")

# 2. the input used a class that did not exist in the stylesheet
t = t.replace('class="sb-input" inputmode="latin"', 'class="sb-input2" inputmode="latin"')
t = t.replace('class="sb-input big" autocapitalize="off"', 'class="sb-input2 big" autocapitalize="off"')
done.append("input class -> sb-input2")

# 3. real hex keyboard in both daily mini-games
if "function keypadHTML" not in t:
    t = t.replace("""  /* ---------------- speech ---------------- */""",
"""  /* the same honeycomb keyboard the spelling rounds use */
  function keypadHTML() {
    if (window.SPELLBOUND && window.SPELLBOUND.keypadHTML) return window.SPELLBOUND.keypadHTML();
    return '';
  }
  function bindKeypad(root, onKey) {
    root.querySelectorAll('[data-k]').forEach((b) => {
      b.onclick = () => onKey(b.dataset.k);
    });
  }

  /* ---------------- speech ---------------- */""")
    done.append("keypad helpers added")

# word hunt: keyboard under the entry, typing lands in the input
if "${keypadHTML()}" not in t:
    t = t.replace("""        <div class="sb-msg" id="sb-msg" role="status" aria-live="polite"></div>
        <div class="sb-found" id="sb-found"></div>""",
"""        ${keypadHTML()}
        <div class="sb-msg" id="sb-msg" role="status" aria-live="polite"></div>
        <div class="sb-found" id="sb-found"></div>""")
    done.append("word hunt: hex keyboard")

# listen & type: keyboard works by submitting on enter
if "${keypadHTML()}" not in t or t.count("${keypadHTML()}") < 2:
    t = t.replace("""        <div class="sb-msg" id="sp-msg" role="status" aria-live="polite"></div>
        <div class="sb-typed-list" id="sp-list"></div>""",
"""        ${keypadHTML()}
        <div class="sb-msg" id="sp-msg" role="status" aria-live="polite"></div>
        <div class="sb-typed-list" id="sp-list"></div>""")
    done.append("listen&type: hex keyboard")

# 4. wire the keys to the inputs
if "bindKeypad(main" not in t:
    t = t.replace("""    bindLetters(main);
    setTimeout(() => typed.focus(), 60);""",
"""    bindLetters(main);
    bindKeypad(main, (k) => {
      if (k === 'del') typed.value = typed.value.slice(0, -1);
      else if (k === 'enter') main.querySelector('#sb-form').requestSubmit();
      else if (/^[a-z]$/.test(k)) typed.value += k;
      typed.focus();
    });
    setTimeout(() => typed.focus(), 60);""")
    done.append("word hunt keys wired")

if "bindKeypad(main, (k) => {\n      if (k === 'del') input.value" not in t:
    t = t.replace("""    const input = main.querySelector('#sp-typed');
    const msg = main.querySelector('#sp-msg');""",
"""    const input = main.querySelector('#sp-typed');
    const msg = main.querySelector('#sp-msg');
    bindKeypad(main, (k) => {
      if (k === 'del') input.value = input.value.slice(0, -1);
      else if (k === 'enter') main.querySelector('#sp-form').requestSubmit();
      else if (/^[a-z]$/.test(k)) input.value += k;
      input.focus();
    });""")
    done.append("listen&type keys wired")

p.write_text(t)
print("\n".join("  - " + d for d in done) or "  (nothing changed)")
