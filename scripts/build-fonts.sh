#!/usr/bin/env bash
#
# Génère les fichiers woff2 auto-hébergés d'Inter et de Rethink Sans.
#
# - Inter : axe `wght` restreint à 400-800, axe `opsz` 14-32 conservé.
# - Rethink Sans : axe `wght` restreint à 400-800.
# - Deux subsets (latin / latin-ext) pour ne charger que le nécessaire.
# - Les variantes italiques sont produites séparément : le navigateur ne les
#   télécharge que si une italique est réellement rendue.
#
# Usage :
#   pnpm fonts
#   INTER_SRC=/chemin/vers/Inter-VariableFont_opsz,wght.ttf pnpm fonts
#   RETHINK_SANS_SRC=/chemin/vers/RethinkSans-VariableFont_wght.ttf pnpm fonts
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RETHINK_SRC="${RETHINK_SANS_SRC:-$HOME/Downloads/fonts/Bricolage_Grotesque,Google_Sans_Flex,Rethink_Sans/Rethink_Sans/RethinkSans-VariableFont_wght.ttf}"
RETHINK_ITALIC_SRC="${RETHINK_SANS_ITALIC_SRC:-$(dirname "$RETHINK_SRC")/RethinkSans-Italic-VariableFont_wght.ttf}"
INTER_SRC="${INTER_SRC:-$HOME/Downloads/fonts/Inter/Inter-VariableFont_opsz,wght.ttf}"
INTER_ITALIC_SRC="${INTER_ITALIC_SRC:-$(dirname "$INTER_SRC")/Inter-Italic-VariableFont_opsz,wght.ttf}"
OUT="$ROOT/public/fonts"
TMP="$(mktemp -d)"

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

for file in "$RETHINK_SRC" "$RETHINK_ITALIC_SRC" "$INTER_SRC" "$INTER_ITALIC_SRC"; do
  if [[ ! -f "$file" ]]; then
    echo "Font source introuvable : $file" >&2
    echo "Définis RETHINK_SANS_SRC / RETHINK_SANS_ITALIC_SRC / INTER_SRC / INTER_ITALIC_SRC." >&2
    exit 1
  fi
done

mkdir -p "$OUT"

# Chaque famille garde sa propre licence dans public/fonts.
if [[ -f "$(dirname "$RETHINK_SRC")/OFL.txt" ]]; then
  cp "$(dirname "$RETHINK_SRC")/OFL.txt" "$OUT/OFL-RethinkSans.txt"
fi

if [[ -f "$(dirname "$INTER_SRC")/OFL.txt" ]]; then
  cp "$(dirname "$INTER_SRC")/OFL.txt" "$OUT/OFL-Inter.txt"
fi

uv run --quiet --with fonttools --with brotli python - \
  "$RETHINK_SRC" "$RETHINK_ITALIC_SRC" "$INTER_SRC" "$INTER_ITALIC_SRC" \
  "$TMP" "$OUT" <<'PY'
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

sources = {
    "rethink-sans": Path(sys.argv[1]),
    "rethink-sans-italic": Path(sys.argv[2]),
    "inter": Path(sys.argv[3]),
    "inter-italic": Path(sys.argv[4]),
}
tmp = Path(sys.argv[5])
out = Path(sys.argv[6])

SUBSETS = {
    "latin": (
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
        "U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,"
        "U+2212,U+2215,U+FEFF,U+FFFD"
    ),
    "latin-ext": (
        "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,"
        "U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,"
        "U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"
    ),
}

for prefix, source in sources.items():
    print(f"Source : {source.name} ({source.stat().st_size / 1024:.0f} Ko)")

    font = TTFont(source)
    # Rethink n'a que `wght` ; Inter conserve `opsz` pour l'optical sizing.
    instantiateVariableFont(font, {"wght": (400, 800)}, inplace=True)

    axes = [(axis.axisTag, axis.minValue, axis.maxValue) for axis in font["fvar"].axes]
    print(f"Axes conservés : {axes} ({prefix})")

    instanced = tmp / f"{prefix}-instanced.ttf"
    font.save(instanced)

    for suffix, unicodes in SUBSETS.items():
        target = out / f"{prefix}-{suffix}.woff2"
        subset.main(
            [
                str(instanced),
                f"--unicodes={unicodes}",
                "--layout-features=kern,liga,calt,ccmp,mark,mkmk",
                "--no-hinting",
                "--name-IDs=*",
                "--name-languages=*",
                "--flavor=woff2",
                f"--output-file={target}",
            ]
        )
        print(f"Écrit : {target.name} ({target.stat().st_size / 1024:.0f} Ko)")
PY
