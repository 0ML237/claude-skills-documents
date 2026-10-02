#!/usr/bin/env bash
# Vérifie les outils nécessaires à la génération DOCX/PDF et affiche
# les commandes d'installation à exécuter pour tout ce qui manque.
# Code de sortie : 0 si tout est présent, 1 sinon.

set -u

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
missing=0

say_ok() { printf '  \033[32mOK\033[0m    %s\n' "$1"; }
say_ko() { printf '  \033[31mMANQUE\033[0m %s\n' "$1"; missing=$((missing+1)); }
say_info() { printf '        %s\n' "$1"; }

echo "Vérification de l'environnement de doc-mise-en-forme"
echo

# --- Node ---
if command -v node >/dev/null 2>&1; then
  say_ok "node ($(node --version))"
else
  say_ko "node"
  say_info "Installer : brew install node"
fi

# --- npm ---
if command -v npm >/dev/null 2>&1; then
  say_ok "npm ($(npm --version))"
else
  say_ko "npm"
  say_info "Installer : brew install node"
fi

# --- Paquets npm : docx, js-yaml (locaux au dossier du skill) ---
if [ -d "$SKILL_DIR/node_modules/docx" ]; then
  say_ok "paquet npm docx (dans $SKILL_DIR)"
else
  say_ko "paquet npm docx"
  say_info "Installer : cd \"$SKILL_DIR\" && npm install docx js-yaml"
fi
if [ -d "$SKILL_DIR/node_modules/js-yaml" ]; then
  say_ok "paquet npm js-yaml (dans $SKILL_DIR)"
else
  say_ko "paquet npm js-yaml"
  say_info "Installer : cd \"$SKILL_DIR\" && npm install docx js-yaml"
fi

# --- LibreOffice (soffice) ---
SOFFICE=""
if command -v soffice >/dev/null 2>&1; then
  SOFFICE="$(command -v soffice)"
elif [ -x "/Applications/LibreOffice.app/Contents/MacOS/soffice" ]; then
  SOFFICE="/Applications/LibreOffice.app/Contents/MacOS/soffice"
fi
if [ -n "$SOFFICE" ]; then
  say_ok "soffice ($SOFFICE)"
else
  say_ko "soffice (LibreOffice)"
  say_info "macOS : brew install --cask libreoffice"
  say_info "Linux : apt-get install libreoffice   (ou équivalent)"
fi

# --- Poppler : pdftoppm, pdffonts, pdfinfo ---
for bin in pdftoppm pdffonts pdfinfo; do
  if command -v "$bin" >/dev/null 2>&1; then
    say_ok "$bin"
  else
    say_ko "$bin"
    say_info "Installer Poppler : brew install poppler   (macOS)"
    say_info "                     apt-get install poppler-utils   (Linux)"
  fi
done

# --- Pandoc (pour les cas redesign : extraction d'un DOCX en Markdown) ---
if command -v pandoc >/dev/null 2>&1; then
  say_ok "pandoc ($(pandoc --version | head -n1 | awk '{print $2}'))"
else
  say_ko "pandoc"
  say_info "Installer : brew install pandoc   (ou apt-get install pandoc)"
fi

# --- Polices : Georgia, Arial, Courier New ---
# Priorité à fc-list ; sinon, repli sur les répertoires système macOS.
check_font() {
  local name="$1"
  if command -v fc-list >/dev/null 2>&1; then
    if fc-list 2>/dev/null | grep -qi "^[^:]*: *${name}:"; then
      say_ok "police $name"
      return
    fi
  fi
  # Repli macOS
  for dir in /System/Library/Fonts/Supplemental /Library/Fonts "$HOME/Library/Fonts"; do
    [ -d "$dir" ] || continue
    if ls "$dir" 2>/dev/null | grep -qi "^${name}[^A-Za-z]"; then
      say_ok "police $name (fichier $dir/${name}.ttf)"
      return
    fi
  done
  say_ko "police $name"
  say_info "Installer la police $name ou ajuster charte.json pour utiliser une police installée"
}
check_font "Georgia"
check_font "Arial"
check_font "Courier New"

echo
if [ "$missing" -eq 0 ]; then
  echo "Tout est présent. La chaîne peut être lancée."
  exit 0
else
  echo "$missing élément(s) manquant(s). Installer puis relancer ce script."
  exit 1
fi
