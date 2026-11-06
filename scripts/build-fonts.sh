#!/usr/bin/env bash
#
# Génère les fichiers woff2 auto-hébergés de Google Sans Flex.
#
# - Source : TTF variable fourni avec la famille (axes ROND, opsz, slnt, wdth, wght).
# - On fige ROND=0, slnt=0 et wdth=100 : ces axes ne servent pas au site et
#   alourdissent inutilement le fichier.
# - On conserve wght et opsz, mais restreints aux plages réellement utilisées
#   (300-800 / 14-96) : la plage complète coûte ~50 Ko de plus pour rien.
# - Deux subsets (latin / latin-ext) pour ne charger que le nécessaire.
#
# Usage :
#   pnpm fonts
#   GOOGLE_SANS_FLEX_SRC=/chemin/vers/font.ttf pnpm fonts
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="${GOOGLE_SANS_FLEX_SRC:-$HOME/Downloads/fonts/Bricolage_Grotesque,Google_Sans_Flex,Rethink_Sans/Google_Sans_Flex/GoogleSansFlex-VariableFont_ROND,opsz,slnt,wdth,wght.ttf}"
OUT="$ROOT/public/fonts"
TMP="$(mktemp -d)"

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

if [[ ! -f "$SRC" ]]; then
  echo "Font source introuvable : $SRC" >&2
  echo "Définis GOOGLE_SANS_FLEX_SRC vers le TTF variable de Google Sans Flex." >&2
  exit 1
fi

mkdir -p "$OUT"

if [[ -f "$(dirname "$SRC")/OFL.txt" ]]; then
  cp "$(dirname "$SRC")/OFL.txt" "$OUT/OFL.txt"
fi

uv run --quiet --with fonttools --with brotli python - "$SRC" "$TMP" "$OUT" <<'PY'
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

src = Path(sys.argv[1])
tmp = Path(sys.argv[2])
out = Path(sys.argv[3])

print(f"Source : {src.name} ({src.stat().st_size / 1024 / 1024:.1f} Mo)")

font = TTFont(src)
instantiateVariableFont(
    font,
    {
        "ROND": 0,
        "slnt": 0,
        "wdth": 100,
        "opsz": (14, 96),
        "wght": (300, 800),
    },
    inplace=True,
)

instanced = tmp / "google-sans-flex-instanced.ttf"
font.save(instanced)
print(f"Axes restreints : ROND=0 slnt=0 wdth=100 opsz=14-96 wght=300-800")

SUBSETS = {
    "google-sans-flex-latin": (
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
        "U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,"
        "U+2212,U+2215,U+FEFF,U+FFFD"
    ),
    "google-sans-flex-latin-ext": (
        "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,"
        "U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,"
        "U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"
    ),
}

for name, unicodes in SUBSETS.items():
    target = out / f"{name}.woff2"
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
