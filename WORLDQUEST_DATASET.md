# Astrolab — the 196-country WorldQuest dataset

WorldQuest asks about **exactly 196 countries**. Because country counts differ between
standards, the list is fixed and documented here rather than inferred.

## Composition

| Group | Count |
|---|---|
| UN member states | 193 |
| UN observer states (Palestine, Vatican City) | 2 |
| Taiwan | 1 |
| **Total** | **196** |

- Boundaries and names: **Natural Earth 1:50m Admin-0** (`data/ne_admin0_50m.geojson`),
  public domain. Regenerated into `public/data/world.json` by `data/build_world.py`.
- Continents follow the usual school-atlas convention: the Americas are two continents,
  Russia is listed under Europe, Turkey and the Caucasus under Asia.
- Transcontinental states are listed **once**, so a country can never be asked twice.

## What is deliberately not asked

Territories and dependencies in the Natural Earth file are drawn on the map (so shapes
look right) but are **never quizzed**: Greenland, Puerto Rico, Hong Kong, Macau, Western
Sahara, Kosovo, Somaliland, Northern Cyprus, the Falklands and similar. They are not in
the 196 and no badge depends on them.

Kosovo, Western Sahara, Taiwan and Palestine are politically disputed. The dataset makes
no claim about recognition: it simply fixes a list so gameplay and badges are stable.

## Completion rules

- **Extreme World Challenge** counts a run as complete only when all 196 entries in the
  queue have been *correctly* identified. A single miss ends the run as incomplete and no
  completion is recorded (`mode: "challenge"` in the session row).
- Continent modes draw from the same list, filtered by continent.
- `wq-196` ("The 196") unlocks only on a completed challenge session.

## Counts per continent

Europe 47, Asia 46, Africa 54, North America 23, South America 12, Oceania 14 = 196.
(Africa includes Cape Verde, São Tomé and Príncipe, Comoros, Mauritius, Seychelles.)
