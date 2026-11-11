#!/usr/bin/env python3
"""One-shot patch for Spellbound: American-only, in-game Back, hex keyboard."""
import pathlib
import re

p = pathlib.Path(__file__).resolve().parent.parent / "public" / "js" / "games" / "spellbound.js"
t = p.read_text()
before_len = len(t)
report = []

# ---- 1. American spelling only ---------------------------------------------
if "locale: 'GB'" in t:
    t = t.replace("locale: 'GB', session: null", "locale: 'US', session: null")
    report.append("default locale -> US")
t = t.replace("u.lang = SB.locale === 'US' ? 'en-US' : 'en-GB';", "u.lang = 'en-US';")
t = t.replace("const want = SB.locale === 'US' ? 'en-US' : 'en-GB';", "const want = 'en-US';")

old_toggle = """        <div class="segbar" style="margin-left:auto">
          <button data-locale="GB" class="${SB.locale === 'GB' ? 'on' : ''}">British</button>
          <button data-locale="US" class="${SB.locale === 'US' ? 'on' : ''}">American</button></div>"""
if old_toggle in t:
    t = t.replace(old_toggle, '        <span class="badge-pill" style="margin-left:auto">'
                               'American spelling</span>')
    report.append("removed British/American toggle")

# the click handlers for the toggle are dead now
t, n = re.subn(r"    main\.querySelectorAll\('\[data-locale\]'\)\.forEach\(\(b\) => \{\n"
               r"(?:.*\n)*?    \}\);\n", "", t, count=1)
if n:
    report.append("removed locale handlers")

# ---- 2. Back leaves the mini-game, not Spellbound --------------------------
t, n = re.subn(r'<button class="btn ghost sm" data-leave-world>\$\{icon\(\'games\'\)\} Astrolab</button>',
               '<button class="btn ghost sm" id="quit">${icon(\'arrow\')} Back</button>', t)
report.append(f"mini-game back buttons: {n}")

# the crash: some screens never had #quit, so this threw and killed the round
t = t.replace("    main.querySelector('#quit').onclick = () => abandon();",
              "    const quit = main.querySelector('#quit');\n"
              "    if (quit) quit.onclick = () => abandon();")
report.append("guarded #quit handler")

# ---- 3. the honeycomb keyboard ---------------------------------------------
start = t.index("  function keypadHTML() {")
end = t.index("  async function abandon()")
new_kp = """  /* a real honeycomb keyboard: hex keys, flat-topped, tiling like comb */
  function keypadHTML() {
    const rows = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
                  ['z', 'x', 'c', 'v', 'b', 'n', 'm']];
    return `<div class="sb-keys" id="keys" role="group" aria-label="Letter keyboard">
      ${rows.map((r, i) => `<div class="sb-keyrow">
        ${i === 2 ? '<button class="sb-key sb-key-wide sb-key-mid" data-k="del" aria-label="Delete last letter">⌫</button>' : ''}
        ${r.map((c) => `<button class="sb-key" data-k="${c}" aria-label="${c}">${c}</button>`).join('')}
        ${i === 2 ? '<button class="sb-key sb-key-wide sb-key-go" data-k="enter" aria-label="Enter">↵</button>' : ''}
      </div>`).join('')}
    </div>`;
  }

"""
t = t[:start] + new_kp + t[end:]
report.append("replaced keypad with hex keyboard")

# ---- 4. the Missing Letters keypad must understand del / clear / enter ------
t = t.replace("""    function type(ch) {
      if (ch === 'del') { focus = Math.max(0, focus - (blanks[focus] ? 0 : 1)); blanks[focus] = ''; }
      else if (ch === 'clear') blanks.fill('');""",
"""    function type(ch) {
      if (ch === 'enter') { check(); return; }
      if (ch === 'del') {
        if (blanks[focus]) blanks[focus] = '';
        else { focus = Math.max(0, focus - 1); blanks[focus] = ''; }
        paint(); return;
      }
      if (ch === 'clear') { blanks.fill(''); paint(); return; }""")
report.append("missing-letters keypad handles enter/del")

p.write_text(t)
print("\n".join("  - " + r for r in report))
print(f"  bytes {before_len} -> {len(t)}")
