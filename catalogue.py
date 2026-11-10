"""Astrolab — item catalogue.

Every item is drawn from data (slot + style + colour) so the whole wardrobe and
room are plain SVG generated in the client.  Nothing here is a picture file: it
stays cheap to add items without an artist.
"""

RARITY = {
    "common":    {"price": 40,  "label": "Common",    "colour": "#8b93b8"},
    "uncommon":  {"price": 90,  "label": "Uncommon",  "colour": "#2ec4a6"},
    "rare":      {"price": 180, "label": "Rare",      "colour": "#3a9bff"},
    "epic":      {"price": 340, "label": "Epic",      "colour": "#a865ff"},
    "legendary": {"price": 600, "label": "Legendary", "colour": "#ffb020"},
}

SLOTS = ["skin", "hair", "hairColor", "eyes", "eyeColor", "mouth",
         "top", "bottom", "shoes", "hat", "accessory", "back", "pet", "effect"]

ITEMS = []


def item(iid, name, cat, slot, style, colour, rarity, price=None, desc="", extra=None):
    ITEMS.append({
        "id": iid, "name": name, "cat": cat, "slot": slot, "style": style,
        "colour": colour, "rarity": rarity,
        "price": RARITY[rarity]["price"] if price is None else price,
        "desc": desc, **(extra or {}),
    })


# --------------------------------------------------------------------------- #
# Character — appearance (cheap, so a new player can look like themselves)
# --------------------------------------------------------------------------- #
for iid, name, col, rar in [
    ("skin-porcelain", "Porcelain", "#f7d9c4", "common"),
    ("skin-peach", "Peach", "#f1c27d", "common"),
    ("skin-honey", "Honey", "#e0ac69", "common"),
    ("skin-amber", "Amber", "#c68642", "common"),
    ("skin-umber", "Umber", "#8d5524", "common"),
    ("skin-ebony", "Ebony", "#5b3a1e", "uncommon"),
]:
    item(iid, f"{name} skin", "Appearance", "skin", "round", col, rar,
         price=0 if rar == "common" else None, desc="Skin tone.")

for iid, name, style, rar in [
    ("hair-buzz", "Buzz Cut", "buzz", "common"),
    ("hair-bob", "Bob", "bob", "common"),
    ("hair-spiky", "Spiky", "spiky", "common"),
    ("hair-side", "Side Part", "side", "common"),
    ("hair-curly", "Curls", "curly", "uncommon"),
    ("hair-pony", "Ponytail", "pony", "uncommon"),
    ("hair-bun", "Top Bun", "bun", "rare"),
    ("hair-long", "Long Wave", "long", "rare"),
    ("hair-afro", "Afro", "afro", "epic"),
    ("hair-starlight", "Starlight", "starlight", "legendary"),
]:
    item(iid, name, "Appearance", "hair", style, "#3b2a20", rar,
         price=0 if iid == "hair-buzz" else None,
         desc="Hairstyle — combine it with any hair colour you own.")

for iid, name, col, rar in [
    ("hc-black", "Jet", "#211a17", "common"),
    ("hc-brown", "Chestnut", "#5a3b22", "common"),
    ("hc-blonde", "Sunlight", "#e2b45a", "common"),
    ("hc-auburn", "Auburn", "#8b3a1f", "uncommon"),
    ("hc-platinum", "Platinum", "#e9e4d8", "uncommon"),
    ("hc-coral", "Coral", "#ff6b6b", "rare"),
    ("hc-mint", "Mint", "#5fe0b5", "rare"),
    ("hc-violet", "Violet", "#a276ff", "epic"),
    ("hc-stardust", "Stardust", "url(#hairStar)", "legendary"),
]:
    item(iid, name, "Appearance", "hairColor", "solid", col, rar,
         price=0 if iid == "hc-brown" else None, desc="Hair colour.")

for iid, name, style, rar in [
    ("eye-round", "Open", "round", "common"),
    ("eye-happy", "Smiling", "happy", "common"),
    ("eye-wide", "Wide", "wide", "common"),
    ("eye-sleepy", "Sleepy", "sleepy", "uncommon"),
    ("eye-sparkle", "Sparkle", "sparkle", "rare"),
    ("eye-star", "Starstruck", "star", "epic"),
]:
    item(iid, name + " eyes", "Appearance", "eyes", style, "#2a2b4a", rar,
         price=0 if rar == "common" else None, desc="Eye shape.")

for iid, name, col, rar in [
    ("ec-brown", "Hazel", "#6b4423", "common"),
    ("ec-blue", "Blue", "#3fa7e0", "common"),
    ("ec-green", "Green", "#3f9e6b", "common"),
    ("ec-grey", "Grey", "#7c8798", "uncommon"),
    ("ec-amber", "Amber", "#d99a2b", "rare"),
    ("ec-violet", "Violet", "#8d5bd6", "epic"),
]:
    item(iid, name + " eyes", "Appearance", "eyeColor", "solid", col, rar,
         price=0 if rar == "common" else None, desc="Eye colour.")

for iid, name, style, rar in [
    ("mouth-smile", "Smile", "smile", "common"),
    ("mouth-grin", "Grin", "grin", "common"),
    ("mouth-neutral", "Calm", "neutral", "common"),
    ("mouth-smirk", "Smirk", "smirk", "uncommon"),
    ("mouth-o", "Surprised", "o", "uncommon"),
    ("mouth-cat", "Cat", "cat", "rare"),
]:
    item(iid, name, "Appearance", "mouth", style, "#5c2b2b", rar,
         price=0 if rar == "common" else None, desc="Mouth.")

# --------------------------------------------------------------------------- #
# Clothing
# --------------------------------------------------------------------------- #
TOPS = [
    ("tee", "T-Shirt", "common", ["#f4f0e6", "#ff7a5c", "#3a9bff", "#2ec4a6", "#ffcf5c", "#2a2f5a"]),
    ("hoodie", "Hoodie", "uncommon", ["#5b6ee1", "#ff6b9d", "#2ec4a6", "#f4a261"]),
    ("jacket", "Jacket", "rare", ["#27324f", "#8b5cf6", "#c1443c"]),
    ("shirt", "Shirt", "rare", ["#ffffff", "#9ad5ff", "#ffd166"]),
    ("jumper", "Jumper", "uncommon", ["#e07a5f", "#81b29a", "#f2cc8f"]),
    ("spacesuit", "Flight Suit", "legendary", ["#dfe8ff"]),
]
for style, label, rar, cols in TOPS:
    for colour in cols:
        slug = {"#f4f0e6": "cream", "#ff7a5c": "coral", "#3a9bff": "azure", "#2ec4a6": "jade",
                "#ffcf5c": "sun", "#2a2f5a": "midnight", "#5b6ee1": "indigo",
                "#ff6b9d": "rose", "#f4a261": "sand", "#27324f": "navy", "#8b5cf6": "violet",
                "#c1443c": "brick", "#ffffff": "white", "#9ad5ff": "ice", "#ffd166": "gold",
                "#e07a5f": "clay", "#81b29a": "sage", "#f2cc8f": "wheat", "#dfe8ff": "pearl"}[colour]
        item(f"top-{style}-{slug}", f"{slug.title()} {label}", "Clothing", "top",
             style, colour, rar, price=0 if (style == "tee" and slug == "cream") else None,
             desc=f"{label} in {slug}.")

for iid, name, style, col, rar in [
    ("bot-jeans", "Blue Jeans", "jeans", "#4a6fa5", "common"),
    ("bot-chinos", "Chinos", "trousers", "#c9b48a", "common"),
    ("bot-track", "Track Pants", "trousers", "#3a3f63", "common"),
    ("bot-shorts", "Shorts", "shorts", "#7fb069", "common"),
    ("bot-shorts-blue", "Blue Shorts", "shorts", "#3a9bff", "common"),
    ("bot-cargo", "Cargos", "trousers", "#6b705c", "uncommon"),
    ("bot-skirt", "Skirt", "skirt", "#e2768b", "uncommon"),
    ("bot-nebula", "Nebula Trousers", "trousers", "#6a4c93", "rare"),
    ("bot-suit", "Smart Trousers", "trousers", "#23263f", "rare"),
    ("bot-holo", "Holo Shorts", "shorts", "#7ff5d4", "epic"),
]:
    item(iid, name, "Clothing", "bottom", style, col, rar,
         price=0 if iid == "bot-jeans" else None, desc="Bottoms.")

for iid, name, style, col, rar in [
    ("shoe-trainers", "Trainers", "trainers", "#f4f0e6", "common"),
    ("shoe-trainers-red", "Red Trainers", "trainers", "#ff5c5c", "common"),
    ("shoe-boots", "Boots", "boots", "#4a3728", "uncommon"),
    ("shoe-canvas", "Canvas Shoes", "trainers", "#2ec4a6", "uncommon"),
    ("shoe-hi", "High Tops", "hi", "#2a2f5a", "rare"),
    ("shoe-moon", "Moon Boots", "boots", "#dfe4f2", "epic"),
]:
    item(iid, name, "Clothing", "shoes", style, col, rar,
         price=0 if iid == "shoe-trainers" else None, desc="Shoes.")

# --------------------------------------------------------------------------- #
# Accessories
# --------------------------------------------------------------------------- #
for iid, name, style, col, rar in [
    ("hat-beanie", "Beanie", "beanie", "#ff7a5c", "common"),
    ("hat-cap", "Cap", "cap", "#3a9bff", "common"),
    ("hat-bucket", "Bucket Hat", "bucket", "#2ec4a6", "uncommon"),
    ("hat-grad", "Graduation Cap", "grad", "#23263f", "rare"),
    ("hat-top", "Top Hat", "top", "#1b1d33", "rare"),
    ("hat-crown", "Star Crown", "crown", "#ffb020", "legendary"),
    ("hat-helmet", "Explorer Helmet", "helmet", "#e6ebff", "epic"),
]:
    item(iid, name, "Accessories", "hat", style, col, rar, desc="Headwear.")

for iid, name, style, col, rar in [
    ("acc-glasses", "Glasses", "glasses", "#2a2f5a", "common"),
    ("acc-sun", "Sunglasses", "sun", "#151829", "common"),
    ("acc-scarf", "Scarf", "scarf", "#e2768b", "uncommon"),
    ("acc-headphones", "Headphones", "headphones", "#3a9bff", "uncommon"),
    ("acc-bow", "Bow Tie", "bow", "#c1443c", "rare"),
    ("acc-cape", "Explorer Cape", "cape", "#6a4c93", "epic"),
    ("acc-wings", "Star Wings", "wings", "url(#wingGold)", "legendary"),
]:
    item(iid, name, "Accessories", "accessory", style, col, rar,
         extra={"back": style in ("cape", "wings")}, desc="Accessory.")

for iid, name, style, col, rar in [
    ("back-pack", "Backpack", "pack", "#e07a5f", "common"),
    ("back-pack-blue", "Blue Backpack", "pack", "#3a9bff", "common"),
    ("back-jetpack", "Jetpack", "jetpack", "#9aa4c7", "epic"),
    ("back-shell", "Shell Pack", "shell", "#2ec4a6", "legendary"),
]:
    item(iid, name, "Accessories", "back", style, col, rar, desc="Worn on the back.")

# --------------------------------------------------------------------------- #
# Pets
# --------------------------------------------------------------------------- #
for iid, name, style, col, rar in [
    ("pet-cat", "Pocket Cat", "cat", "#f0a868", "common"),
    ("pet-dog", "Pup", "dog", "#a9744f", "common"),
    ("pet-owl", "Study Owl", "owl", "#8b6f4e", "uncommon"),
    ("pet-fox", "Fox Kit", "fox", "#e07a3f", "rare"),
    ("pet-axo", "Axolotl", "axo", "#ff9cc4", "rare"),
    ("pet-dragon", "Hatchling Dragon", "dragon", "#5fd0a8", "epic"),
    ("pet-comet", "Comet Sprite", "comet", "url(#petGlow)", "legendary"),
]:
    item(iid, name, "Pets", "pet", style, col, rar, desc="A companion that follows you around Astrolab.")

for iid, name, style, col, rar in [
    ("fx-sparkle", "Sparkle Trail", "sparkle", "#ffd166", "rare"),
    ("fx-snow", "Snowfall", "snow", "#bfe6ff", "rare"),
    ("fx-bubbles", "Bubbles", "bubbles", "#8fe3ff", "uncommon"),
    ("fx-fireflies", "Fireflies", "fireflies", "#d8ff7a", "epic"),
    ("fx-galaxy", "Galaxy Aura", "galaxy", "#a276ff", "legendary"),
]:
    item(iid, name, "Special collections", "effect", style, col, rar,
         desc="A cosmetic effect around your character.")

# --------------------------------------------------------------------------- #
# Room — furniture
# --------------------------------------------------------------------------- #
FURN = [
    ("bed", "Bed", "common", ["#8ecae6", "#ffb4a2", "#bdb2ff"]),
    ("desk", "Desk", "common", ["#c9a06a", "#e8e2d4"]),
    ("chair", "Chair", "common", ["#3a9bff", "#e07a5f"]),
    ("sofa", "Sofa", "uncommon", ["#2ec4a6", "#6a4c93", "#e2768b"]),
    ("wardrobe", "Wardrobe", "uncommon", ["#b08968", "#e8e2d4"]),
    ("bookshelf", "Bookshelf", "uncommon", ["#b08968"]),
    ("cabinet", "Cabinet", "common", ["#d9c3a5", "#7f8fa6"]),
    ("lamp", "Lamp", "common", ["#ffd166", "#9ad5ff"]),
    ("rug", "Rug", "common", ["#e2768b", "#7fb069", "#5b6ee1"]),
    ("beanbag", "Beanbag", "common", ["#ff7a5c", "#3a9bff"]),
]
for style, label, rar, cols in FURN:
    for colour in cols:
        slug = {"#8ecae6": "sky", "#ffb4a2": "peach", "#bdb2ff": "lilac", "#c9a06a": "oak",
                "#e8e2d4": "cream", "#3a9bff": "azure", "#e07a5f": "coral", "#2ec4a6": "jade",
                "#6a4c93": "violet", "#e2768b": "rose", "#b08968": "walnut", "#d9c3a5": "birch",
                "#7f8fa6": "slate", "#ffd166": "gold", "#9ad5ff": "ice", "#7fb069": "fern",
                "#5b6ee1": "indigo", "#ff7a5c": "flame"}[colour]
        item(f"room-{style}-{slug}", f"{slug.title()} {label}", "Furniture", "furniture",
             style, colour, rar, price=0 if False else None,
             desc=f"{label} for your room.", extra={"w": 90, "h": 80})

# --------------------------------------------------------------------------- #
# Room — decorations and study equipment
# --------------------------------------------------------------------------- #
DECOR = [
    ("poster", "Poster", "common", ["#ff7a5c", "#3a9bff", "#2ec4a6"]),
    ("painting", "Painting", "uncommon", ["url(#artSun)", "url(#artWave)"]),
    ("plant", "Plant", "common", ["#4f9d69", "#7fb069"]),
    ("clock", "Clock", "common", ["#f4f0e6"]),
    ("trophy", "Trophy", "rare", ["#ffb020"]),
    ("computer", "Computer", "uncommon", ["#2a2f5a", "#e8e2d4"]),
    ("globe", "Globe", "rare", ["#4a7fb5"]),
    ("telescope", "Telescope", "epic", ["#d9c3a5"]),
    ("models", "Science Models", "rare", ["#5fd0a8"]),
    ("mobile", "Planet Mobile", "legendary", ["#ffb020"]),
]
for style, label, rar, cols in DECOR:
    for colour in cols:
        slug = {"#ff7a5c": "coral", "#3a9bff": "azure", "#2ec4a6": "jade", "url(#artSun)": "sun",
                "url(#artWave)": "wave", "#4f9d69": "leaf", "#7fb069": "fern", "#f4f0e6": "cream",
                "#ffb020": "gold", "#2a2f5a": "navy", "#e8e2d4": "cream", "#4a7fb5": "ocean",
                "#d9c3a5": "birch", "#5fd0a8": "mint"}[colour]
        item(f"dec-{style}-{slug}", f"{slug.title()} {label}", "Decorations", "furniture",
             style, colour, rar, desc=f"{label} decoration.", extra={"w": 60, "h": 60})

# --------------------------------------------------------------------------- #
# Room themes (wall + floor in one purchase)
# --------------------------------------------------------------------------- #
THEMES = [
    ("theme-study", "Warm Study", "#f3e6cf", "#a9793f", "common"),
    ("theme-sky", "Sky Blue", "#dcefff", "#8fb8d8", "common"),
    ("theme-forest", "Forest Cabin", "#e4efdc", "#7c6a4f", "uncommon"),
    ("theme-space", "Observatory", "#1b2350", "#3a4272", "rare"),
    ("theme-sakura", "Sakura", "#ffe6ec", "#d9a7a0", "rare"),
    ("theme-lab", "Science Lab", "#eaf7f4", "#9fb8b2", "epic"),
    ("theme-cosmic", "Cosmic Suite", "#241a4a", "#4a3f8f", "legendary"),
]
for iid, name, wall, floor, rar in THEMES:
    item(iid, name, "Room themes", "theme", "theme", wall, rar,
         desc="Wallpaper and floor together.", extra={"floor": floor})

ITEM_BY_ID = {i["id"]: i for i in ITEMS}

STARTER = ["skin-peach", "hair-buzz", "hc-brown", "eye-round", "ec-brown", "mouth-smile",
           "top-tee-cream", "bot-jeans", "shoe-trainers", "theme-study",
           # the pieces that are already placed in the starting room
           "room-desk-oak", "room-chair-azure", "room-bookshelf-walnut",
           "dec-plant-leaf", "room-rug-fern"]

DEFAULT_EQUIPPED = {
    "skin": "skin-peach", "hair": "hair-buzz", "hairColor": "hc-brown",
    "eyes": "eye-round", "eyeColor": "ec-brown", "mouth": "mouth-smile",
    "top": "top-tee-cream", "bottom": "bot-jeans", "shoes": "shoe-trainers",
    "hat": None, "accessory": None, "back": None, "pet": None, "effect": None,
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


def public_catalogue():
    """What the client is allowed to know (everything — it is all shop stock)."""
    return {
        "rarity": RARITY,
        "slots": SLOTS,
        "items": ITEMS,
        "starter": STARTER,
        "defaultEquipped": DEFAULT_EQUIPPED,
        "defaultRoom": DEFAULT_ROOM,
    }
