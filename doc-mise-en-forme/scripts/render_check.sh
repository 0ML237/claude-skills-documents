#!/usr/bin/env bash
# Convertit un PDF en images (une par page), liste les polices embarquées
# et affiche le nombre de pages. Sert au contrôle visuel de design-premium.md.
#
# Usage : render_check.sh <fichier.pdf> [dossier_sortie_images]
#
# Sortie : <dossier>/page-01.png, page-02.png, ... + un fichier infos.txt
# contenant le compte de pages et la liste des polices.

set -eu

if [ $# -lt 1 ]; then
  echo "Usage : $0 <fichier.pdf> [dossier_sortie]" >&2
  exit 2
fi

PDF="$1"
if [ ! -f "$PDF" ]; then
  echo "PDF introuvable : $PDF" >&2
  exit 1
fi

DEFAULT_DIR="$(dirname "$PDF")/$(basename "$PDF" .pdf)-pages"
OUTDIR="${2:-$DEFAULT_DIR}"
mkdir -p "$OUTDIR"

# Nombre de pages (pdfinfo).
PAGES=$(pdfinfo "$PDF" | awk -F': *' '/^Pages/{print $2}')
echo "Nombre de pages : $PAGES"

# Rendu PNG : 150 DPI. pdftoppm pad automatiquement le numéro sur la largeur
# du nombre total de pages.
pdftoppm -png -r 150 "$PDF" "$OUTDIR/page"

# Liste des polices embarquées.
echo
echo "Polices embarquées (pdffonts) :"
pdffonts "$PDF"

# Fichier récapitulatif à côté des images.
{
  echo "PDF : $PDF"
  echo "Pages : $PAGES"
  echo
  echo "pdffonts :"
  pdffonts "$PDF"
} > "$OUTDIR/infos.txt"

echo
echo "Images écrites dans : $OUTDIR"
