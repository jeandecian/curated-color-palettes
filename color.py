import json


def get_rgb(hex):
    return tuple(int(hex[i : i + 2], 16) for i in (1, 3, 5))


def normalize_rgb(rgb):
    return tuple(x / 255 for x in rgb)


def calculate_chroma(c_max, c_min):
    return c_max - c_min


def calculate_hue(chroma, c_max, normalized_rgb):
    if chroma == 0:
        return 0

    index = normalized_rgb.index(c_max)

    hue = (
        120 * index
        + 60
        * (normalized_rgb[(index + 1) % 3] - normalized_rgb[(index + 2) % 3])
        / chroma
        + 360
    ) % 360

    return hue


palettes = json.load(open("palettes.json"))

for palette in palettes:
    for color in palette["colors"]:
        color["rgb"] = get_rgb(color["hex"])
        normalized_rgb = normalize_rgb(color["rgb"])

        c_max = max(normalized_rgb)
        c_min = min(normalized_rgb)

        chroma = calculate_chroma(c_max, c_min)

        color["hue"] = calculate_hue(chroma, c_max, normalized_rgb)

    palette["colors"] = sorted(palette["colors"], key=lambda x: x["hue"])

json.dump(palettes, open("palettes.json", "w"), indent=2)
