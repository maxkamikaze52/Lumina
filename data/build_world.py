#!/usr/bin/env python3
"""Build Astrolab's WorldQuest map + country dataset.

Source: Natural Earth 1:50m Admin-0 countries + populated places (public domain).
Output: public/data/world.json  (SVG-ready Mercator paths, centroids, metadata)

The 196-country dataset = 193 UN member states + 2 UN observer states
(Palestine, Vatican City) + Taiwan. This is documented in WORLDQUEST_DATASET.md.
"""
import json, math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'public', 'data')
os.makedirs(OUT, exist_ok=True)

W, H = 2000.0, 1010.0
LAT_MAX = 83.6  # clip polar regions: Mercator blows up near poles


def merc(lon, lat):
    lat = max(-LAT_MAX, min(LAT_MAX, lat))
    x = (lon + 180.0) / 360.0 * W
    y = (1.0 - math.log(math.tan(math.radians(45 + lat / 2))) / math.pi) / 2.0 * H
    return x, y


# ---- the 196 quiz countries: name -> continent ------------------------------
# Continents follow the common school atlas convention (the Americas kept whole,
# Russia in Europe, Turkey and the Caucasus in Asia).  Transcontinental states are
# listed once, under the continent used by the school curriculum.
EUROPE = ("Albania|Andorra|Austria|Belarus|Belgium|Bosnia and Herzegovina|Bulgaria|Croatia|"
          "Cyprus|Czech Republic|Denmark|Estonia|Finland|France|Germany|Greece|Hungary|Iceland|"
          "Ireland|Italy|Kosovo|Latvia|Liechtenstein|Lithuania|Luxembourg|Malta|Moldova|Monaco|"
          "Montenegro|Netherlands|North Macedonia|Norway|Poland|Portugal|Romania|Russia|San Marino|"
          "Serbia|Slovakia|Slovenia|Spain|Sweden|Switzerland|Turkey|Ukraine|United Kingdom|Vatican City")
ASIA = ("Afghanistan|Armenia|Azerbaijan|Bahrain|Bangladesh|Bhutan|Brunei|Cambodia|China|Taiwan|"
        "Georgia|India|Indonesia|Iran|Iraq|Israel|Japan|Jordan|Kazakhstan|Kuwait|Kyrgyzstan|Laos|"
        "Lebanon|Malaysia|Maldives|Mongolia|Myanmar|Nepal|North Korea|Oman|Pakistan|Palestine|"
        "Philippines|Qatar|Saudi Arabia|Singapore|South Korea|Sri Lanka|Syria|Tajikistan|Thailand|"
        "Turkmenistan|United Arab Emirates|Uzbekistan|Vietnam|Yemen")
AFRICA = ("Algeria|Angola|Benin|Botswana|Burkina Faso|Burundi|Cape Verde|Cameroon|"
          "Central African Republic|Chad|Comoros|Democratic Republic of the Congo|"
          "Republic of the Congo|Djibouti|Egypt|Equatorial Guinea|Eritrea|Eswatini|Ethiopia|Gabon|"
          "The Gambia|Ghana|Guinea|Guinea-Bissau|Ivory Coast|Kenya|Lesotho|Liberia|Libya|Madagascar|"
          "Malawi|Mali|Mauritania|Mauritius|Morocco|Mozambique|Namibia|Niger|Nigeria|Rwanda|"
          "\u0053\u0061\u006f Tome and Principe|Senegal|Seychelles|Sierra Leone|Somalia|South Africa|"
          "South Sudan|Sudan|Tanzania|Togo|Tunisia|Uganda|Zambia|Zimbabwe")
NORTH_AMERICA = ("Antigua and Barbuda|The Bahamas|Barbados|Belize|Canada|Costa Rica|Cuba|Dominica|"
                 "Dominican Republic|El Salvador|Grenada|Guatemala|Haiti|Honduras|Jamaica|Mexico|"
                 "Nicaragua|Panama|Saint Kitts and Nevis|Saint Lucia|"
                 "Saint Vincent and the Grenadines|Trinidad and Tobago|United States of America")
SOUTH_AMERICA = ("Argentina|Bolivia|Brazil|Chile|Colombia|Ecuador|Guyana|Paraguay|Peru|Suriname|"
                 "Uruguay|Venezuela")
OCEANIA = ("Australia|Fiji|Kiribati|Marshall Islands|Federated States of Micronesia|Nauru|"
           "New Zealand|Palau|Papua New Guinea|Samoa|Solomon Islands|Tonga|Tuvalu|Vanuatu")

OUR_CONT = {}
for _cont, _block in (('Europe', EUROPE), ('Asia', ASIA), ('Africa', AFRICA),
                      ('North America', NORTH_AMERICA), ('South America', SOUTH_AMERICA),
                      ('Oceania', OCEANIA)):
    for _n in _block.split('|'):
        assert _n not in OUR_CONT, _n
        OUR_CONT[_n] = _cont
assert len(OUR_CONT) == 196, len(OUR_CONT)

# natural earth names -> our names
NE_TO_OURS = {
    'People\'s Republic of China': 'China',
    'East Timor': 'Timor-Leste',
    'Ivory Coast': 'Ivory Coast',
    'United States of America': 'United States of America',
    'Democratic Republic of the Congo': 'Democratic Republic of the Congo',
    'Republic of the Congo': 'Republic of the Congo',
    'The Bahamas': 'The Bahamas',
    'The Gambia': 'The Gambia',
    'Czech Republic': 'Czech Republic',
    'São Tomé and Príncipe': 'Sao Tome and Principe',
}
CAP_BY_NAME = {
    'Nauru': {'name': 'Yaren', 'lat': -0.547, 'lon': 166.917},
    'Palestine': {'name': 'Ramallah', 'lat': 31.903, 'lon': 35.203},
    'South Sudan': {'name': 'Juba', 'lat': 4.85, 'lon': 31.6},
}

geo = json.load(open(os.path.join(HERE, 'ne_admin0_50m.geojson')))
by_name = {}
for f in geo['features']:
    p = f['properties']
    nm = p.get('NAME_EN') or p.get('NAME')
    by_name[nm] = f

# match features to our 196-country list -------------------------------------
countries = []
missing = []
seen = set()
for f in geo['features']:
    p = f['properties']
    ne_name = p.get('NAME_EN') or p.get('NAME')
    our = NE_TO_OURS.get(ne_name, ne_name)
    if our not in OUR_CONT:
        continue  # territory / dependency: drawn on the map but never quizzed
    seen.add(our)
    countries.append((our, OUR_CONT[our], f, p))

missing = [n for n in OUR_CONT if n not in seen]
if missing:
    print('MISSING FROM 50m DATASET:', missing, file=sys.stderr)

# capitals -------------------------------------------------------------------
caps = json.load(open(os.path.join(HERE, 'ne_capitals_50m.geojson')))
cap_by_a3 = {}
for f in caps['features']:
    p = f['properties']
    if p.get('featurecla') != 'Admin-0 capital':
        continue
    a3 = p.get('adm0_a3')
    if a3 and a3 not in cap_by_a3:
        cap_by_a3[a3] = {'name': p['name'], 'lat': p['latitude'], 'lon': p['longitude']}
# countries with more than one official capital: use the administrative one
CAP_OVERRIDE = {
    'ZAF': {'name': 'Pretoria', 'lat': -25.70, 'lon': 28.23},
    'LKA': {'name': 'Sri Jayawardenepura Kotte', 'lat': 6.89, 'lon': 79.92},
    'BOL': {'name': 'Sucre', 'lat': -19.03, 'lon': -65.26},
    'NLD': {'name': 'Amsterdam', 'lat': 52.37, 'lon': 4.90},
    'CIV': {'name': 'Yamoussoukro', 'lat': 6.82, 'lon': -5.28},
    'TZA': {'name': 'Dodoma', 'lat': -6.17, 'lon': 35.75},
    'ISR': {'name': 'Jerusalem', 'lat': 31.78, 'lon': 35.22},
}

# small-country display anchors (px) are computed from geometry, fine as is.
def rings(geom):
    if geom['type'] == 'Polygon':
        return [geom['coordinates'][0]]
    out = []
    for poly in geom['coordinates']:
        out.append(poly[0])
    return out


def fmt(v):
    return f'{v:.1f}'.rstrip('0').rstrip('.')


def path_for(geom):
    parts = []
    for ring in rings(geom):
        pts = []
        for lon, lat in ring:
            if lat < -85 or lat > 85:
                continue
            x, y = merc(lon, lat)
            pts.append(f'{fmt(x)},{fmt(y)}')
        if len(pts) >= 3:
            parts.append('M' + 'L'.join(pts) + 'Z')
    return ''.join(parts)


def centroid(geom):
    # area-weighted centroid of the largest polygon, in lon/lat then projected
    best, best_area = None, -1
    for poly in (geom['coordinates'] if geom['type'] == 'MultiPolygon' else [geom['coordinates']]):
        ring = poly[0]
        a = 0.0
        cx = cy = 0.0
        for i in range(len(ring) - 1):
            x0, y0 = ring[i]
            x1, y1 = ring[i + 1]
            cr = x0 * y1 - x1 * y0
            a += cr
            cx += (x0 + x1) * cr
            cy += (y0 + y1) * cr
        if abs(a) < 1e-9:
            continue
        a *= 0.5
        cx /= (6 * a)
        cy /= (6 * a)
        if abs(a) > best_area:
            best_area, best = abs(a), (cx, cy)
    if not best:
        ring = (geom['coordinates'] if geom['type'] == 'Polygon' else geom['coordinates'][0])[0]
        best = (sum(p[0] for p in ring) / len(ring), sum(p[1] for p in ring) / len(ring))
    lon, lat = best
    # clamp to a vertex-ish sane value
    lat = max(-60.0, min(78.0, lat))
    return merc(lon, lat)


def bbox(geom):
    xs, ys = [], []
    for ring in rings(geom):
        for lon, lat in ring:
            x, y = merc(lon, lat)
            xs.append(x)
            ys.append(y)
    return [min(xs), min(ys), max(xs), max(ys)]


# alternative accepted spellings for typing modes
ALIASES = {
    'United States of America': ['United States', 'USA', 'US'],
    'United Kingdom': ['UK', 'Great Britain', 'Britain'],
    'United Arab Emirates': ['UAE'],
    'Democratic Republic of the Congo': ['DRC', 'Congo-Kinshasa', 'Dem. Rep. Congo'],
    'Republic of the Congo': ['Congo', 'Congo-Brazzaville'],
    'Czech Republic': ['Czechia'],
    'Ivory Coast': ["Cote d'Ivoire", 'Côte d’Ivoire'],
    'Myanmar': ['Burma'],
    'Eswatini': ['Swaziland'],
    'Timor-Leste': ['East Timor'],
    'Cape Verde': ['Cabo Verde'],
    'The Bahamas': ['Bahamas'],
    'The Gambia': ['Gambia'],
    'Federated States of Micronesia': ['Micronesia'],
    'North Macedonia': ['Macedonia'],
    'Vatican City': ['Vatican', 'Holy See'],
    'São Tomé and Príncipe': ['Sao Tome and Principe'],
}

out = []
for our, cont, f, p in countries:
    geom = f['geometry']
    if geom['type'] not in ('Polygon', 'MultiPolygon'):
        continue
    cx, cy = centroid(geom)
    a3 = p.get('ADM0_A3')
    cap = CAP_OVERRIDE.get(a3) or CAP_BY_NAME.get(our) or cap_by_a3.get(a3)
    out.append({
        'id': p.get('ISO_A3_EH') if p.get('ISO_A3_EH') not in ('-99', None) else p.get('ADM0_A3'),
        'name': our,
        'continent': cont,
        'path': path_for(geom),
        'cx': round(cx, 1), 'cy': round(cy, 1),
        'bbox': [round(v, 1) for v in bbox(geom)],
        'area': round(abs(p.get('LABELRANK', 5)) and 0, 1),  # replaced below
        'iso2': p.get('ISO_A2_EH') if p.get('ISO_A2_EH') not in ('-99', None) else p.get('ISO_A2'),
        'capital': (cap['name'] if cap else None),
        'capital_lat': (round(cap['lat'], 3) if cap else None),
        'capital_lon': (round(cap['lon'], 3) if cap else None),
        'aliases': ALIASES.get(our, []),
    })

# rough display area in px^2 from the bbox (used for the "too small to click" hint)
for c in out:
    x0, y0, x1, y1 = c['bbox']
    c['area'] = round((x1 - x0) * (y1 - y0), 1)

out.sort(key=lambda c: c['name'])
print('quiz countries:', len(out))
print('without capital:', [c['name'] for c in out if not c['capital']])
from collections import Counter
print(Counter(c['continent'] for c in out))

json.dump({'viewBox': [0, 0, W, H], 'countries': out},
          open(os.path.join(OUT, 'world.json'), 'w'), separators=(',', ':'))
print('wrote', os.path.join(OUT, 'world.json'),
      round(os.path.getsize(os.path.join(OUT, 'world.json')) / 1024), 'KB')
