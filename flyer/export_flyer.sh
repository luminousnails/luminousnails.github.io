#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SVG="$SCRIPT_DIR/luminous-nails-pricelist.svg"
PDF="$SCRIPT_DIR/luminous-nails-pricelist.pdf"
PNG="$SCRIPT_DIR/luminous-nails-pricelist.png"
JPG="$SCRIPT_DIR/luminous-nails-pricelist.jpg"

if ! command -v rsvg-convert >/dev/null 2>&1; then
  echo "Missing required command: rsvg-convert" >&2
  exit 1
fi

if ! command -v magick >/dev/null 2>&1; then
  echo "Missing required command: magick" >&2
  exit 1
fi

rsvg-convert -f pdf -o "$PDF" "$SVG"
rsvg-convert -f png -o "$PNG" "$SVG"
magick "$PNG" "$JPG"

echo "Exported:"
echo "  $PDF"
echo "  $PNG"
echo "  $JPG"
