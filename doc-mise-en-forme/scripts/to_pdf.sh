#!/usr/bin/env bash
# Convertit un DOCX en PDF avec LibreOffice en mode headless.
# soffice met automatiquement à jour les champs (sommaire, numéros de page)
# à l'ouverture du document grâce à l'attribut updateFields du DOCX.
#
# Usage : to_pdf.sh <entree.docx> [dossier_sortie]

set -eu

if [ $# -lt 1 ]; then
  echo "Usage : $0 <entree.docx> [dossier_sortie]" >&2
  exit 2
fi

INPUT="$1"
OUTDIR="${2:-$(dirname "$INPUT")}"

# Localise soffice (PATH ou /Applications sur macOS).
SOFFICE=""
if command -v soffice >/dev/null 2>&1; then
  SOFFICE="$(command -v soffice)"
elif [ -x "/Applications/LibreOffice.app/Contents/MacOS/soffice" ]; then
  SOFFICE="/Applications/LibreOffice.app/Contents/MacOS/soffice"
else
  echo "soffice introuvable. Installer LibreOffice (macOS : brew install --cask libreoffice)." >&2
  exit 1
fi

mkdir -p "$OUTDIR"

# Dossier utilisateur temporaire pour isoler les paramètres (évite les conflits
# si une instance de LibreOffice est déjà ouverte).
TMP_PROFILE="$(mktemp -d)"
trap 'rm -rf "$TMP_PROFILE"' EXIT

"$SOFFICE" \
  --headless \
  --nologo \
  --nofirststartwizard \
  --norestore \
  -env:UserInstallation="file://$TMP_PROFILE" \
  --convert-to pdf \
  --outdir "$OUTDIR" \
  "$INPUT" >/dev/null

base="$(basename "$INPUT" .docx)"
out="$OUTDIR/${base}.pdf"
if [ -f "$out" ]; then
  echo "PDF écrit : $out"
else
  echo "Échec de la conversion." >&2
  exit 1
fi
