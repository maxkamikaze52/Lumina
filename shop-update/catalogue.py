"""Astrolab — item catalogue (the shop's stock).

Every item is drawn from data (slot + style + colour), so the whole wardrobe and room are plain
SVG generated in the browser (public/js/shop/art-*.js).  Nothing here is a picture file: adding an
item is one line in a table below, plus — only for a brand-new *style* — a drawing in the art files.

Rules the rest of the app relies on (do not break them):
  * item ids are permanent: players own them and have them saved in their character and room;
  * price 0 means "free for everyone" (starter looks), it is never sold;
  * `level` locks an item behind a player level — store.buy() enforces it on the server.
"""

RARITY = {
    "common":    {"price": 40,  "label": "Common",    "colour": "#8b93b8"},
    "uncommon":  {"price": 90,  "label": "Uncommon",  "colour": "#2ec4a6"},
    "rare":      {"price": 180, "label": "Rare",      "colour": "#3a9bff"},
    "epic":      {"price": 340, "label": "Epic",      "colour": "#a865ff"},
    "legendary": {"price": 600, "label": "Legendary", "colour": "#ffb020"},
}

# every slot a character can fill (one item each).  Order = order of the tabs on My Character.
SLOTS = ["hair", "hairColor", "eyes", "eyeColor", "mouth", "face",
         "top", "bottom", "shoes", "hat", "neck", "back", "hand", "pet", "effect"]

# how the store and the wardrobe group things: (group id, label, [(category, label)])
GROUPS = [
    ("hair",    "Hair",        [("Hairstyles", "Styles"), ("Hair colours", "Colours")]),
    ("face",    "Face",        [("Eyes", "Eyes"), ("Eye colours", "Eye colour"), ("Mouths", "Mouths"), ("Face extras", "Extras")]),
    ("clothes", "Clothes",     [("Tops", "Tops"), ("Bottoms", "Bottoms"), ("Shoes", "Shoes")]),
    ("gear",    "Accessories", [("Headwear", "Hats"), ("Neckwear", "Neck"), ("Back", "Back"), ("In hand", "In hand")]),
    ("friends", "Pets & auras", [("Pets", "Pets"), ("Auras", "Auras")]),
    ("room",    "Room",        [("Furniture", "Furniture"), ("Decorations", "Decor"), ("Room themes", "Wall & floor")]),
]

# higher rarities unlock with your level, so there is something to grow into (store.buy enforces it)
LEVEL_GATE = {"epic": 3, "legendary": 6}

ITEMS = []
_SEEN = set()


def item(iid, name, cat, slot, style, colour, rarity, price=None, desc="", level=None, extra=None):
    assert iid not in _SEEN, "duplicate item id: " + iid
    _SEEN.add(iid)
    it = {
        "id": iid, "name": name, "cat": cat, "slot": slot, "style": style,
        "colour": colour, "rarity": rarity,
        "price": RARITY[rarity]["price"] if price is None else price,
        "desc": desc, **(extra or {}),
    }
    level = level or (LEVEL_GATE.get(rarity) if it["price"] > 0 else None)
    if level:
        it["level"] = level
    ITEMS.append(it)


# --------------------------------------------------------------------------- #
# Colour names (shared by clothes and furniture, so ids read the same everywhere)
# --------------------------------------------------------------------------- #
COL = {
    "cream": "#f4f0e6", "coral": "#ff7a5c", "azure": "#3a9bff", "jade": "#2ec4a6", "sun": "#ffcf5c",
    "midnight": "#2a2f5a", "indigo": "#5b6ee1", "rose": "#ff6b9d", "sand": "#f4a261", "navy": "#27324f",
    "violet": "#8b5cf6", "brick": "#c1443c", "white": "#ffffff", "ice": "#9ad5ff", "gold": "#ffd166",
    "clay": "#e07a5f", "sage": "#81b29a", "wheat": "#f2cc8f", "pearl": "#dfe8ff", "lilac": "#c4b5fd",
    "denim": "#4a6fa5", "steel": "#8b93b8", "forest": "#3f7d5a", "charcoal": "#3a3f63", "mint": "#7ff5d4",
    "peach": "#ffb4a2", "sky": "#8ecae6", "oak": "#c9a06a", "walnut": "#b08968", "birch": "#d9c3a5",
    "slate": "#7f8fa6", "fern": "#7fb069", "flame": "#ff7a5c", "leaf": "#4f9d69", "ocean": "#4a7fb5",
    "black": "#211a17", "plum": "#6a4c93",
}


def clothes(prefix, cat, slot, label, style, rarity, cols, free=None, desc=None, level=None):
    for c in cols:
        item(f"{prefix}-{style}-{c}", f"{c.title()} {label}", cat, slot, style, COL[c], rarity,
             price=0 if free == c else None, desc=desc or f"{label} in {c}.", level=level)


# --------------------------------------------------------------------------- #
# Hair — styles and colours
# --------------------------------------------------------------------------- #
for iid, name, style, rar in [
    ("hair-buzz", "Buzz Cut", "buzz", "common"), ("hair-crew", "Crew Cut", "crew", "common"),
    ("hair-bob", "Bob", "bob", "common"), ("hair-spiky", "Spiky", "spiky", "common"),
    ("hair-side", "Side Part", "side", "common"), ("hair-messy", "Messy", "messy", "common"),
    ("hair-pixie", "Pixie", "pixie", "common"), ("hair-slick", "Slick Back", "slick", "common"),
    ("hair-curly", "Curls", "curly", "uncommon"), ("hair-pony", "Ponytail", "pony", "uncommon"),
    ("hair-curtains", "Curtains", "curtains", "uncommon"), ("hair-wavy", "Waves", "wavy", "uncommon"),
    ("hair-shaggy", "Shaggy", "shaggy", "uncommon"), ("hair-pigtails", "Pigtails", "pigtails", "uncommon"),
    ("hair-bun", "Top Bun", "bun", "rare"), ("hair-long", "Long Wave", "long", "rare"),
    ("hair-quiff", "Quiff", "quiff", "rare"), ("hair-braid", "Braid", "braid", "rare"),
    ("hair-twinbuns", "Space Buns", "twinbuns", "rare"), ("hair-topknot", "Top Knot", "topknot", "rare"),
    ("hair-wolf", "Wolf Cut", "wolf", "rare"), ("hair-sidebraid", "Side Braid", "sidebraid", "rare"),
    ("hair-afro", "Afro", "afro", "epic"), ("hair-mohawk", "Mohawk", "mohawk", "epic"),
    ("hair-locs", "Long Locs", "locs", "epic"),
    ("hair-starlight", "Starlight", "starlight", "legendary"),
    ("hair-flame", "Living Flame", "flame", "legendary"),
    ("hair-crystal", "Crystal Crown", "crystal", "legendary"),
]:
    item(iid, name, "Hairstyles", "hair", style, "#3b2a20", rar, price=0 if iid == "hair-buzz" else None,
         desc="Hairstyle — wear it in any hair colour you own.")

for iid, name, col, rar in [
    ("hc-black", "Jet", "#211a17", "common"), ("hc-brown", "Chestnut", "#5a3b22", "common"),
    ("hc-blonde", "Sunlight", "#e2b45a", "common"), ("hc-ginger", "Ginger", "#c8561f", "common"),
    ("hc-auburn", "Auburn", "#8b3a1f", "uncommon"), ("hc-platinum", "Platinum", "#e9e4d8", "uncommon"),
    ("hc-silver", "Silver", "#aab2c8", "uncommon"), ("hc-coral", "Coral", "#ff6b6b", "rare"),
    ("hc-mint", "Mint", "#5fe0b5", "rare"), ("hc-sky", "Sky", "#5fb3ff", "rare"),
    ("hc-pink", "Bubblegum", "#ff8fc0", "rare"), ("hc-violet", "Violet", "#a276ff", "epic"),
    ("hc-sunset", "Sunset", "url(#hairSunset)", "epic"), ("hc-ocean", "Deep Ocean", "url(#hairOcean)", "epic"),
    ("hc-candy", "Cotton Candy", "url(#hairCandy)", "epic"), ("hc-aurora", "Aurora", "url(#hairAurora)", "legendary"),
    ("hc-stardust", "Stardust", "url(#hairStar)", "legendary"), ("hc-galaxy", "Galaxy", "url(#hairGalaxy)", "legendary"),
    ("hc-rainbow", "Rainbow", "url(#hairRainbow)", "legendary"), ("hc-gold", "Pure Gold", "url(#hairGold)", "legendary"),
]:
    item(iid, name, "Hair colours", "hairColor", "solid", col, rar, price=0 if iid == "hc-brown" else None, desc="Hair colour.")

# --------------------------------------------------------------------------- #
# Face — eyes, eye colours, mouths and face extras
# --------------------------------------------------------------------------- #
for iid, name, style, rar in [
    ("eye-round", "Open", "round", "common"), ("eye-happy", "Smiling", "happy", "common"),
    ("eye-wide", "Wide", "wide", "common"), ("eye-puppy", "Puppy", "puppy", "common"),
    ("eye-sleepy", "Sleepy", "sleepy", "uncommon"), ("eye-lashes", "Lashes", "lashes", "uncommon"),
    ("eye-determined", "Determined", "determined", "uncommon"), ("eye-wink", "Wink", "wink", "uncommon"),
    ("eye-sparkle", "Sparkle", "sparkle", "rare"), ("eye-cat", "Cat", "cat", "rare"),
    ("eye-heart", "Heart", "heart", "epic"), ("eye-star", "Starstruck", "star", "epic"),
]:
    item(iid, name + " eyes", "Eyes", "eyes", style, "#2a2b4a", rar, price=0 if rar == "common" else None, desc="Eye shape.")

for iid, name, col, rar in [
    ("ec-brown", "Hazel", "#6b4423", "common"), ("ec-blue", "Blue", "#3fa7e0", "common"),
    ("ec-green", "Green", "#3f9e6b", "common"), ("ec-grey", "Grey", "#7c8798", "uncommon"),
    ("ec-teal", "Teal", "#1fb5b0", "uncommon"), ("ec-amber", "Amber", "#d99a2b", "rare"),
    ("ec-rose", "Rose", "#e2527f", "rare"), ("ec-violet", "Violet", "#8d5bd6", "epic"),
    ("ec-sunset", "Sunset", "url(#eyeSunset)", "epic"), ("ec-galaxy", "Galaxy", "url(#eyeGalaxy)", "legendary"),
]:
    item(iid, name + " eyes", "Eye colours", "eyeColor", "solid", col, rar, price=0 if rar == "common" else None, desc="Eye colour.")

for iid, name, style, rar in [
    ("mouth-smile", "Smile", "smile", "common"), ("mouth-grin", "Grin", "grin", "common"),
    ("mouth-neutral", "Calm", "neutral", "common"), ("mouth-tiny", "Tiny smile", "tiny", "common"),
    ("mouth-smirk", "Smirk", "smirk", "uncommon"), ("mouth-o", "Surprised", "o", "uncommon"),
    ("mouth-teeth", "Big smile", "teeth", "uncommon"), ("mouth-pout", "Pout", "pout", "uncommon"),
    ("mouth-tongue", "Cheeky", "tongue", "rare"), ("mouth-cat", "Cat", "cat", "rare"),
    ("mouth-wavy", "Wobbly", "wavy", "rare"), ("mouth-laugh", "Laughing", "laugh", "epic"),
    ("mouth-fang", "Fang", "fang", "epic"),
]:
    item(iid, name, "Mouths", "mouth", style, "#5c2b2b", rar, price=0 if rar == "common" else None, desc="Mouth.")

for iid, name, style, col, rar in [
    ("face-freckles", "Freckles", "freckles", "#b9774f", "common"), ("face-blush", "Rosy Cheeks", "blush", "#ff6b8a", "common"),
    ("acc-glasses", "Glasses", "glasses", "#2a2f5a", "common"), ("face-glasses-red", "Red Glasses", "glasses", "#d8324f", "common"),
    ("face-square", "Square Glasses", "square", "#27324f", "common"), ("acc-sun", "Sunglasses", "sun", "#151829", "common"),
    ("face-whiskers", "Whiskers", "whiskers", "#2a2f5a", "uncommon"), ("face-starpaint", "Star Paint", "starpaint", "#ffd166", "uncommon"),
    ("face-bolt", "Lightning Paint", "bolt", "#3a9bff", "uncommon"), ("face-moustache", "Moustache", "moustache", "#3b2a20", "uncommon"),
    ("face-goggles", "Explorer Goggles", "goggles", "#8a6a3a", "rare"), ("face-monocle", "Monocle", "monocle", "#d9a21a", "rare"),
    ("face-eyepatch", "Eye Patch", "eyepatch", "#2a2530", "rare"), ("face-beard", "Beard", "beard", "#4a3020", "rare"),
    ("face-mask", "Hero Mask", "mask", "#c1443c", "epic"), ("face-starshade", "Star Shades", "starshade", "#ff5c8a", "epic"),
    ("face-heartshade", "Heart Shades", "heartshade", "#ff6b9d", "epic"),
]:
    item(iid, name, "Face extras", "face", style, col, rar, desc="Face extra.")

# --------------------------------------------------------------------------- #
# Clothing
# --------------------------------------------------------------------------- #
TOPS = [
    ("tee", "T-Shirt", "common", ["cream", "coral", "azure", "jade", "sun", "midnight", "rose", "lilac"]),
    ("tank", "Tank Top", "common", ["white", "azure", "coral", "jade"]),
    ("stripe", "Stripy Tee", "uncommon", ["navy", "coral", "jade"]),
    ("polo", "Polo", "uncommon", ["jade", "navy", "rose"]),
    ("jersey", "Team Shirt", "uncommon", ["brick", "azure", "sun"]),
    ("hoodie", "Hoodie", "uncommon", ["indigo", "rose", "jade", "sand"]),
    ("jumper", "Jumper", "uncommon", ["clay", "sage", "wheat"]),
    ("overalls", "Dungarees", "uncommon", ["denim", "sage", "brick"]),
    ("tracksuit", "Tracksuit Top", "uncommon", ["azure", "brick", "jade"]),
    ("dress", "Dress", "uncommon", ["rose", "lilac", "azure", "sun"]),
    ("jacket", "Jacket", "rare", ["navy", "violet", "brick"]),
    ("shirt", "Shirt", "rare", ["white", "ice", "gold"]),
    ("cardigan", "Cardigan", "rare", ["sage", "rose", "navy"]),
    ("varsity", "Varsity Jacket", "rare", ["brick", "navy", "jade"]),
    ("blazer", "Blazer", "rare", ["navy", "forest", "brick"]),
    ("hawaiian", "Holiday Shirt", "rare", ["jade", "coral", "azure"]),
    ("puffer", "Puffer Jacket", "rare", ["rose", "azure", "sun", "midnight"]),
    ("labcoat", "Lab Coat", "epic", ["white"]),
    ("robe", "Wizard Robe", "epic", ["violet", "midnight"]),
    ("spacesuit", "Flight Suit", "legendary", ["pearl"]),
    ("armour", "Knight Armour", "legendary", ["steel"]),
]
for style, label, rar, cols in TOPS:
    for c in cols:
        item(f"top-{style}-{c}", f"{c.title()} {label}", "Tops", "top", style, COL[c], rar,
             price=0 if (style == "tee" and c == "cream") else None, desc=f"{label} in {c}.")

for iid, name, style, col, rar in [
    ("bot-jeans", "Blue Jeans", "jeans", "#4a6fa5", "common"), ("bot-chinos", "Chinos", "trousers", "#c9b48a", "common"),
    ("bot-track", "Track Pants", "track", "#3a3f63", "common"), ("bot-shorts", "Shorts", "shorts", "#7fb069", "common"),
    ("bot-shorts-blue", "Blue Shorts", "shorts", "#3a9bff", "common"), ("bot-leggings", "Leggings", "leggings", "#2a2f5a", "common"),
    ("bot-cargo", "Cargos", "cargo", "#6b705c", "uncommon"), ("bot-skirt", "Skirt", "skirt", "#e2768b", "uncommon"),
    ("bot-joggers", "Joggers", "joggers", "#6b7394", "uncommon"), ("bot-baggy", "Baggy Jeans", "baggy", "#7a9bc8", "uncommon"),
    ("bot-bermuda", "Long Shorts", "bermuda", "#c9b48a", "uncommon"), ("bot-pleated", "Pleated Skirt", "pleated", "#3a3f63", "uncommon"),
    ("bot-kilt", "Tartan Kilt", "kilt", "#c1443c", "rare"), ("bot-nebula", "Nebula Trousers", "trousers", "#6a4c93", "rare"),
    ("bot-suit", "Smart Trousers", "trousers", "#23263f", "rare"), ("bot-tutu", "Tutu", "tutu", "#ffb4d0", "rare"),
    ("bot-holo", "Holo Shorts", "shorts", "#7ff5d4", "epic"), ("bot-greaves", "Knight Greaves", "greaves", "#8b93b8", "epic"),
    ("bot-spacepants", "Flight Trousers", "spacepants", "#dfe8ff", "legendary"),
]:
    item(iid, name, "Bottoms", "bottom", style, col, rar, price=0 if iid == "bot-jeans" else None, desc="Bottoms.")

for iid, name, style, col, rar in [
    ("shoe-trainers", "Trainers", "trainers", "#f4f0e6", "common"), ("shoe-trainers-red", "Red Trainers", "trainers", "#ff5c5c", "common"),
    ("shoe-flipflop", "Flip-flops", "flipflop", "#3a9bff", "common"), ("shoe-sandal", "Sandals", "sandal", "#c9a06a", "common"),
    ("shoe-boots", "Boots", "boots", "#4a3728", "uncommon"), ("shoe-canvas", "Canvas Shoes", "trainers", "#2ec4a6", "uncommon"),
    ("shoe-loafer", "Loafers", "loafer", "#4a3728", "uncommon"), ("shoe-slipper", "Bunny Slippers", "slipper", "#ff9cc4", "uncommon"),
    ("shoe-rain", "Rain Boots", "rain", "#ffd166", "uncommon"), ("shoe-clog", "Clogs", "clog", "#e0a860", "uncommon"),
    ("shoe-hi", "High Tops", "hi", "#2a2f5a", "rare"), ("shoe-skate", "Roller Skates", "skate", "#ff5c8a", "rare"),
    ("shoe-glow", "Glow Sneakers", "glow", "#2a2f5a", "epic"), ("shoe-moon", "Moon Boots", "moon", "#dfe4f2", "epic"),
    ("shoe-knight", "Knight Boots", "knight", "#8b93b8", "epic"),
]:
    item(iid, name, "Shoes", "shoes", style, col, rar, price=0 if iid == "shoe-trainers" else None, desc="Shoes.")

# --------------------------------------------------------------------------- #
# Accessories
# --------------------------------------------------------------------------- #
for iid, name, style, col, rar in [
    ("hat-beanie", "Beanie", "beanie", "#ff7a5c", "common"), ("hat-beanie-blue", "Blue Beanie", "beanie", "#3a9bff", "common"),
    ("hat-cap", "Cap", "cap", "#3a9bff", "common"), ("hat-cap-red", "Red Cap", "cap", "#d8324f", "common"),
    ("hat-headband", "Sweatband", "headband", "#ff5c8a", "common"), ("hat-straw", "Straw Hat", "straw", "#c1443c", "common"),
    ("hat-bucket", "Bucket Hat", "bucket", "#2ec4a6", "uncommon"), ("acc-headphones", "Headphones", "headphones", "#3a9bff", "uncommon"),
    ("hat-beret", "Beret", "beret", "#c1443c", "uncommon"), ("hat-hardhat", "Builder's Helmet", "hardhat", "#ffc247", "uncommon"),
    ("hat-party", "Party Hat", "party", "#ff5c8a", "uncommon"), ("hat-cat", "Cat Ears", "cat", "#2a2f5a", "uncommon"),
    ("hat-bunny", "Bunny Ears", "bunny", "#f4f0e6", "uncommon"), ("hat-propeller", "Propeller Cap", "propeller", "#ff5c5c", "uncommon"),
    ("hat-grad", "Graduation Cap", "grad", "#23263f", "rare"), ("hat-top", "Top Hat", "top", "#1b1d33", "rare"),
    ("hat-cowboy", "Cowboy Hat", "cowboy", "#9a6a3a", "rare"), ("hat-chef", "Chef's Hat", "chef", "#ffffff", "rare"),
    ("hat-pirate", "Pirate Hat", "pirate", "#2a2530", "rare"), ("hat-flowers", "Flower Crown", "flowers", "#ffffff", "rare"),
    ("hat-santa", "Festive Hat", "santa", "#d8324f", "rare"), ("hat-viking", "Viking Helmet", "viking", "#9aa4c7", "epic"),
    ("hat-horns", "Little Horns", "horns", "#c1443c", "epic"), ("hat-wizard", "Wizard Hat", "wizard", "#6a4c93", "epic"),
    ("hat-helmet", "Explorer Helmet", "helmet", "#e6ebff", "epic"), ("hat-halo", "Halo", "halo", "#ffe08a", "legendary"),
    ("hat-visor", "Space Helmet", "visor", "#c5cde6", "legendary"), ("hat-crown", "Star Crown", "crown", "#ffb020", "legendary"),
]:
    item(iid, name, "Headwear", "hat", style, col, rar, desc="Headwear.")

for iid, name, style, col, rar in [
    ("acc-scarf", "Scarf", "scarf", "#e2768b", "common"), ("neck-scarf-blue", "Blue Scarf", "scarf", "#3a9bff", "common"),
    ("neck-bandana", "Bandana", "bandana", "#c1443c", "common"), ("acc-bow", "Bow Tie", "bow", "#c1443c", "uncommon"),
    ("neck-tie", "Tie", "tie", "#3a9bff", "uncommon"), ("neck-lanyard", "School Lanyard", "lanyard", "#2ec4a6", "uncommon"),
    ("neck-collar", "Bell Collar", "collar", "#ff5c8a", "uncommon"), ("neck-pendant", "Star Pendant", "pendant", "#ffd166", "rare"),
    ("neck-lei", "Flower Lei", "lei", "#ff7a9c", "rare"), ("neck-pearls", "Pearls", "pearls", "#fff8ee", "rare"),
    ("neck-medal", "Gold Medal", "medal", "#ffc247", "epic"),
]:
    item(iid, name, "Neckwear", "neck", style, col, rar, desc="Worn around the neck.")

for iid, name, style, col, rar in [
    ("back-pack", "Backpack", "pack", "#e07a5f", "common"), ("back-pack-blue", "Blue Backpack", "pack", "#3a9bff", "common"),
    ("back-cape-red", "Red Cape", "cape", "#c1443c", "uncommon"), ("back-balloons", "Balloon Bunch", "balloons", "#ff5c8a", "uncommon"),
    ("back-guitar", "Guitar", "guitar", "#d9702a", "rare"), ("acc-cape", "Explorer Cape", "cape", "#6a4c93", "rare"),
    ("back-butterfly", "Butterfly Wings", "butterfly", "#ff9cc4", "rare"), ("back-fairy", "Fairy Wings", "fairy", "url(#wingFairy)", "epic"),
    ("back-bat", "Bat Wings", "bat", "url(#wingBat)", "epic"), ("back-jetpack", "Jetpack", "jetpack", "#9aa4c7", "epic"),
    ("back-solar", "Solar Panels", "solar", "#9aa4c7", "epic"), ("back-angel", "Angel Wings", "angel", "url(#wingAngel)", "legendary"),
    ("back-flame", "Phoenix Wings", "flame", "url(#wingFlame)", "legendary"), ("acc-wings", "Star Wings", "wings", "url(#wingGold)", "legendary"),
    ("back-shell", "Shell Pack", "shell", "#2ec4a6", "legendary"),
]:
    item(iid, name, "Back", "back", style, col, rar, desc="Worn on the back.")

for iid, name, style, col, rar in [
    ("hand-book", "Storybook", "book", "#e2768b", "common"), ("hand-icecream", "Ice Cream", "icecream", "#ff9cc4", "common"),
    ("hand-icecream-mint", "Mint Ice Cream", "icecream", "#7ff5d4", "common"), ("hand-flag", "Flag", "flag", "#3a9bff", "uncommon"),
    ("hand-balloon", "Balloon", "balloon", "#ff5c8a", "uncommon"), ("hand-balloon-blue", "Blue Balloon", "balloon", "#3a9bff", "uncommon"),
    ("hand-controller", "Game Controller", "controller", "#6a4c93", "uncommon"), ("hand-spyglass", "Spyglass", "spyglass", "#d99a2b", "rare"),
    ("hand-lantern", "Lantern", "lantern", "#ffd166", "rare"), ("hand-wand", "Star Wand", "wand", "#ffd166", "epic"),
]:
    item(iid, name, "In hand", "hand", style, col, rar, desc="Held in your hand.")

# --------------------------------------------------------------------------- #
# Pets and auras
# --------------------------------------------------------------------------- #
for iid, name, style, col, rar in [
    ("pet-cat", "Pocket Cat", "cat", "#f0a868", "common"), ("pet-dog", "Pup", "dog", "#a9744f", "common"),
    ("pet-bunny", "Bunny", "bunny", "#f4f0e6", "common"), ("pet-frog", "Tree Frog", "frog", "#6fe07a", "common"),
    ("pet-owl", "Study Owl", "owl", "#8b6f4e", "uncommon"), ("pet-penguin", "Penguin", "penguin", "#2a3050", "uncommon"),
    ("pet-turtle", "Turtle", "turtle", "#5fb878", "uncommon"), ("pet-panda", "Panda", "panda", "#ffffff", "uncommon"),
    ("pet-fox", "Fox Kit", "fox", "#e07a3f", "rare"), ("pet-axo", "Axolotl", "axo", "#ff9cc4", "rare"),
    ("pet-bee", "Busy Bee", "bee", "#ffd24a", "rare"), ("pet-slime", "Slime", "slime", "#6fe07a", "rare"),
    ("pet-ghost", "Friendly Ghost", "ghost", "#f4f0ff", "rare"), ("pet-jelly", "Moon Jelly", "jelly", "#c9a8ff", "epic"),
    ("pet-robot", "Robo Buddy", "robot", "#9aa4c7", "epic"), ("pet-alien", "Little Alien", "alien", "#9fe36b", "epic"),
    ("pet-dragon", "Hatchling Dragon", "dragon", "#5fd0a8", "epic"), ("pet-comet", "Comet Sprite", "comet", "url(#petGlow)", "legendary"),
]:
    item(iid, name, "Pets", "pet", style, col, rar, desc="A companion that follows you around Astrolab.")

for iid, name, style, col, rar in [
    ("fx-bubbles", "Bubbles", "bubbles", "#8fe3ff", "uncommon"), ("fx-leaves", "Falling Leaves", "leaves", "#f0a040", "uncommon"),
    ("fx-notes", "Music Notes", "notes", "#a276ff", "uncommon"), ("fx-confetti", "Confetti", "confetti", "#ff5c8a", "uncommon"),
    ("fx-sparkle", "Sparkle Trail", "sparkle", "#ffd166", "rare"), ("fx-snow", "Snowfall", "snow", "#bfe6ff", "rare"),
    ("fx-hearts", "Floating Hearts", "hearts", "#ff5c8a", "rare"), ("fx-sakura", "Cherry Blossom", "sakura", "#ff9fb8", "rare"),
    ("fx-pixels", "Pixel Rain", "pixels", "#6ff0d0", "rare"), ("fx-fireflies", "Fireflies", "fireflies", "#d8ff7a", "epic"),
    ("fx-lightning", "Static Spark", "lightning", "#ffe14a", "epic"), ("fx-ember", "Embers", "ember", "#ff8a3c", "epic"),
    ("fx-flames", "Fire Aura", "flames", "#ff7a2a", "epic"), ("fx-orbit", "Star Orbit", "orbit", "#ffd166", "legendary"),
    ("fx-rings", "Halo Rings", "rings", "#6fd8ff", "legendary"), ("fx-rainbow", "Rainbow Arc", "rainbow", "#ffffff", "legendary"),
    ("fx-galaxy", "Galaxy Aura", "galaxy", "#a276ff", "legendary"),
]:
    item(iid, name, "Auras", "effect", style, col, rar, desc="A cosmetic effect around your character.")

# --------------------------------------------------------------------------- #
# Room — furniture  (style, label, rarity, [colour names])
# --------------------------------------------------------------------------- #
FURN = [
    ("bed", "Bed", "common", ["sky", "peach", "lilac"]), ("desk", "Desk", "common", ["oak", "cream"]),
    ("chair", "Chair", "common", ["azure", "clay"]), ("cabinet", "Cabinet", "common", ["birch", "slate"]),
    ("lamp", "Lamp", "common", ["gold", "ice"]), ("rug", "Rug", "common", ["rose", "fern", "indigo"]),
    ("beanbag", "Beanbag", "common", ["flame", "azure"]), ("coffeetable", "Coffee Table", "common", ["oak", "cream"]),
    ("sofa", "Sofa", "uncommon", ["jade", "plum", "rose"]), ("wardrobe", "Wardrobe", "uncommon", ["walnut", "cream"]),
    ("bookshelf", "Bookshelf", "uncommon", ["walnut", "birch"]), ("armchair", "Armchair", "uncommon", ["indigo", "sage", "coral"]),
    ("dresser", "Dresser", "uncommon", ["birch", "walnut"]), ("floorlamp", "Floor Lamp", "uncommon", ["gold", "mint"]),
    ("mirror", "Standing Mirror", "uncommon", ["walnut", "gold"]), ("tv", "TV Stand", "rare", ["midnight", "oak"]),
    ("gamingdesk", "Gaming Desk", "rare", ["charcoal", "plum"]), ("fishtank", "Fish Tank", "rare", ["azure"]),
    ("piano", "Piano", "epic", ["black", "cream"]),
]
for style, label, rar, cols in FURN:
    for c in cols:
        item(f"room-{style}-{c}", f"{c.title()} {label}", "Furniture", "furniture", style, COL[c], rar,
             desc=f"{label} for your room.", extra={"w": 90, "h": 80})

# decorations: colour may be a gradient defined in art-avatar.js
DECOR = [
    ("poster", "Poster", "common", [("coral", "#ff7a5c"), ("azure", "#3a9bff"), ("jade", "#2ec4a6")]),
    ("plant", "Plant", "common", [("leaf", "#4f9d69"), ("fern", "#7fb069")]),
    ("clock", "Clock", "common", [("cream", "#f4f0e6")]),
    ("cactus", "Cactus", "common", [("sage", "#6fa06f")]),
    ("vase", "Flower Vase", "common", [("rose", "#ff7a9c"), ("sun", "#ffcf5c")]),
    ("bunting", "Bunting", "common", [("rainbow", "#ff5c8a")]),
    ("painting", "Painting", "uncommon", [("sun", "url(#artSun)"), ("wave", "url(#artWave)"), ("forest", "url(#artForest)")]),
    ("computer", "Computer", "uncommon", [("navy", "#2a2f5a"), ("cream", "#e8e2d4")]),
    ("monstera", "Monstera", "uncommon", [("leaf", "#3f9e6b")]),
    ("bonsai", "Bonsai", "rare", [("jade", "#4f9d69")]),
    ("lavalamp", "Lava Lamp", "rare", [("coral", "#ff5c8a"), ("azure", "#3a9bff")]),
    ("trophy", "Trophy", "rare", [("gold", "#ffb020")]),
    ("globe", "Globe", "rare", [("ocean", "#4a7fb5")]),
    ("models", "Science Models", "rare", [("mint", "#5fd0a8")]),
    ("neon", "Neon Sign", "epic", [("pink", "url(#artNeon)")]),
    ("rocket", "Rocket Model", "epic", [("red", "#ff5c5c")]),
    ("telescope", "Telescope", "epic", [("birch", "#d9c3a5")]),
    ("mobile", "Planet Mobile", "legendary", [("gold", "#ffb020")]),
]
for style, label, rar, cols in DECOR:
    for slug, c in cols:
        item(f"dec-{style}-{slug}", f"{slug.title()} {label}", "Decorations", "furniture", style, c, rar,
             desc=f"{label} decoration.", extra={"w": 60, "h": 60})

# room themes (wall + floor in one purchase)
for iid, name, wall, floor, rar in [
    ("theme-study", "Warm Study", "#f3e6cf", "#a9793f", "common"), ("theme-sky", "Sky Blue", "#dcefff", "#8fb8d8", "common"),
    ("theme-beach", "Beach Hut", "#d8f1f4", "#e8cf9a", "uncommon"), ("theme-forest", "Forest Cabin", "#e4efdc", "#7c6a4f", "uncommon"),
    ("theme-candy", "Candy Shop", "#ffe0ee", "#f6b6d0", "uncommon"), ("theme-library", "Old Library", "#7a5238", "#4a3020", "rare"),
    ("theme-space", "Observatory", "#1b2350", "#3a4272", "rare"), ("theme-sakura", "Sakura", "#ffe6ec", "#d9a7a0", "rare"),
    ("theme-snow", "Snow Lodge", "#e8f1fb", "#9a7a5a", "rare"), ("theme-arcade", "Arcade", "#1b1840", "#2e2a66", "epic"),
    ("theme-lab", "Science Lab", "#eaf7f4", "#9fb8b2", "epic"), ("theme-under", "Under the Sea", "#2a79b8", "#d9c28a", "epic"),
    ("theme-cosmic", "Cosmic Suite", "#241a4a", "#4a3f8f", "legendary"),
]:
    item(iid, name, "Room themes", "theme", "theme", wall, rar, desc="Wallpaper and floor together.", extra={"floor": floor})

ITEM_BY_ID = {i["id"]: i for i in ITEMS}

# --------------------------------------------------------------------------- #
# Sets — buy a whole look at once for less (the server works out the saving)
# --------------------------------------------------------------------------- #
SET_DISCOUNT = 0.2
SETS = [
    ("astronaut", "Astronaut", "Ready for the observatory roof.",
     ["top-spacesuit-pearl", "bot-spacepants", "shoe-moon", "hat-visor", "back-jetpack", "pet-robot"]),
    ("wizard", "Apprentice Wizard", "Robes, a hat and a wand that mostly works.",
     ["top-robe-violet", "hat-wizard", "hand-wand", "neck-pendant", "back-cape-red", "pet-owl"]),
    ("knight", "Knight", "Shiny, heavy and very brave.",
     ["top-armour-steel", "bot-greaves", "shoe-knight", "hat-viking", "back-cape-red"]),
    ("pirate", "Pirate Crew", "Eye patch, stripes and a parrot-free deck.",
     ["hat-pirate", "face-eyepatch", "top-stripe-navy", "bot-bermuda", "shoe-boots", "hand-spyglass"]),
    ("cosy", "Cosy Day", "Hoodie weather, slippers and a cat.",
     ["top-hoodie-indigo", "bot-joggers", "shoe-slipper", "hat-beanie", "neck-scarf-blue", "pet-cat"]),
    ("sporty", "Match Day", "Team shirt, sweatband and fast shoes.",
     ["top-jersey-brick", "bot-shorts", "shoe-trainers-red", "hat-headband", "hand-flag"]),
    ("fairy", "Garden Fairy", "Flowers, wings and floating petals.",
     ["top-dress-lilac", "back-fairy", "hat-flowers", "neck-pearls", "pet-bunny", "fx-sakura"]),
    ("scientist", "Lab Day", "Goggles on, notes out.",
     ["top-labcoat-white", "bot-suit", "face-goggles", "neck-lanyard", "hand-book", "shoe-loafer"]),
    ("bedroom", "Dream Bedroom", "A cosy room for a long think.",
     ["theme-sky", "room-bed-sky", "room-rug-indigo", "room-lamp-gold", "dec-lavalamp-azure", "dec-bunting-rainbow"]),
    ("arcade", "Arcade Den", "Neon, a screen and a very comfy beanbag.",
     ["theme-arcade", "room-gamingdesk-charcoal", "room-beanbag-azure", "dec-neon-pink", "dec-lavalamp-coral"]),
]
SET_LIST = []
for sid, name, desc, ids in SETS:
    for i in ids:
        assert i in ITEM_BY_ID, "set %s uses unknown item %s" % (sid, i)
    SET_LIST.append({"id": sid, "name": name, "desc": desc, "items": ids})


def set_price(ids, owned=()):
    """What the pieces of a set still cost (minus what you own), with the set saving taken off."""
    full = sum(ITEM_BY_ID[i]["price"] for i in ids if i not in owned)
    return int(round(full * (1 - SET_DISCOUNT)))


STARTER = ["hair-buzz", "hc-brown", "eye-round", "ec-brown", "mouth-smile",
           "top-tee-cream", "bot-jeans", "shoe-trainers", "theme-study",
           # the pieces that are already placed in the starting room
           "room-desk-oak", "room-chair-azure", "room-bookshelf-walnut",
           "dec-plant-leaf", "room-rug-fern"]

DEFAULT_EQUIPPED = {
    "hair": "hair-buzz", "hairColor": "hc-brown",
    "eyes": "eye-round", "eyeColor": "ec-brown", "mouth": "mouth-smile",
    "top": "top-tee-cream", "bottom": "bot-jeans", "shoes": "shoe-trainers",
    "face": None, "hat": None, "neck": None, "back": None, "hand": None, "pet": None, "effect": None,
}

DEFAULT_ROOM = {
    "theme": "theme-study",
    "items": [
        {"uid": "r1", "item": "room-desk-oak", "x": 470, "y": 420, "z": 2, "flip": False},
        {"uid": "r2", "item": "room-chair-azure", "x": 590, "y": 440, "z": 3, "flip": False},
        {"uid": "r3", "item": "room-bookshelf-walnut", "x": 790, "y": 430, "z": 1, "flip": False},
        {"uid": "r4", "item": "dec-plant-leaf", "x": 200, "y": 470, "z": 2, "flip": False},
        {"uid": "r5", "item": "room-rug-fern", "x": 500, "y": 530, "z": 0, "flip": False},
    ],
}


def is_free(item_id):
    it = ITEM_BY_ID.get(item_id)
    return bool(it) and it["price"] == 0


def public_catalogue():
    """What the client is allowed to know (everything — it is all shop stock)."""
    return {
        "rarity": RARITY,
        "slots": SLOTS,
        "groups": [{"id": g, "label": l, "cats": [{"cat": c, "label": cl} for c, cl in cs]} for g, l, cs in GROUPS],
        "items": ITEMS,
        "sets": SET_LIST,
        "setDiscount": SET_DISCOUNT,
        "starter": STARTER,
        "defaultEquipped": DEFAULT_EQUIPPED,
        "defaultRoom": DEFAULT_ROOM,
    }
