#!/usr/bin/env bash
#
# Génère les fichiers woff2 auto-hébergés de Rethink Sans.
#
# - Sources : TTF variables fournis avec la famille (axe unique `wght`).
# - On conserve wght, restreint aux graisses réellement utilisées (400-800).
# - Deux subsets (latin / latin-ext) pour ne charger que le nécessaire.
# - Une variante italique est produite séparément : le navigateur ne la
#   télécharge que si une italique est réellement rendue.
#
# Usage :
#   pnpm fonts
#   RETHINK_SANS_SRC=/chemin/vers/RethinkSans-VariableFont_wght.ttf pnpm fonts
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="${RETHINK_SANS_SRC:-$HOME/Downloads/fonts/Bricolage_Grotesque,Google_Sans_Flex,Rethink_Sans/Rethink_Sans/RethinkSans-VariableFont_wght.ttf}"
SRC_ITALIC="${RETHINK_SANS_ITALIC_SRC:-$(dirname "$SRC")/RethinkSans-Italic-VariableFont_wght.ttf}"
OUT="$ROOT/public/fonts"
TMP="$(mktemp -d)"

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

for file in "$SRC" "$SRC_ITALIC"; do
  if [[ ! -f "$file" ]]; then
    echo "Font source introuvable : $file" >&2
    echo "Définis RETHINK_SANS_SRC / RETHINK_SANS_ITALIC_SRC vers les TTF variables." >&2
    exit 1
  fi
done

mkdir -p "$OUT"

if [[ -f "$(dirname "$SRC")/OFL.txt" ]]; then
  cp "$(dirname "$SRC")/OFL.txt" "$OUT/OFL.txt"
fi

uv run --quiet --with fonttools --with brotli python - "$SRC" "$SRC_ITALIC" "$TMP" "$OUT" <<'PY'
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

src = Path(sys.argv[1])
src_italic = Path(sys.argv[2])
tmp = Path(sys.argv[3])
out = Path(sys.argv[4])

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

SOURCES = {
    "rethink-sans": src,
    "rethink-sans-italic": src_italic,
}

for prefix, source in SOURCES.items():
    print(f"Source : {source.name} ({source.stat().st_size / 1024:.0f} Ko)")

    font = TTFont(source)
    instantiateVariableFont(font, {"wght": (400, 800)}, inplace=True)

    instanced = tmp / f"{prefix}-instanced.ttf"
    font.save(instanced)
    print(f"Axe restreint : wght=400-800 ({prefix})")

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
