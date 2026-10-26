#!/usr/bin/env bash
# Genera descargas/guia-dialisis-facil.pdf desde la vista «Los 42 pasos» (#/pasos),
# con los estilos de impresión de assets/css/app.css. Usa Edge o Chrome sin ventana.
#
# Uso (Git Bash), con la página servida en el puerto 8642:
#   python -m http.server 8642 &
#   bash tools/generar-pdf.sh
set -euo pipefail

URL="${URL:-http://localhost:8642/#/pasos}"
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
SALIDA="$RAIZ/descargas/guia-dialisis-facil.pdf"

for c in "${NAVEGADOR:-}" \
  "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
  "/c/Program Files/Microsoft/Edge/Application/msedge.exe" \
  "/c/Program Files/Google/Chrome/Application/chrome.exe" \
  "$(command -v chromium || true)" "$(command -v google-chrome || true)"; do
  [ -n "$c" ] && [ -f "$c" ] && NAV="$c" && break
done
[ -n "${NAV:-}" ] || { echo "No encontré Edge ni Chrome" >&2; exit 1; }

PERFIL="$(mktemp -d)"
destino="$SALIDA"; perfil="$PERFIL"
if command -v cygpath >/dev/null; then destino="$(cygpath -w "$SALIDA")"; perfil="$(cygpath -w "$PERFIL")"; fi

mkdir -p "$(dirname "$SALIDA")"
"$NAV" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
  --user-data-dir="$perfil" --print-to-pdf="$destino" "$URL" 2>/dev/null
rm -rf "$PERFIL"
ls -la "$SALIDA"
