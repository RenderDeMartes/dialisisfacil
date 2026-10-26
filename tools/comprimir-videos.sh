#!/usr/bin/env bash
# Comprime los videos originales (sin subtítulos quemados) para la web,
# en 1080p y 720p, y saca una imagen de portada de cada uno.
# Los originales no se tocan.
#
# Uso (Git Bash):  bash tools/comprimir-videos.sh
set -euo pipefail

FFMPEG="${FFMPEG:-$(ls /c/Users/*/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin/ffmpeg.exe 2>/dev/null | head -1)}"
SRC="${SRC:-/f/Dialisis_Videos/SubtitlesInFles}"
OUT="${OUT:-/f/Dialisis_Videos/Web}"
POS="$(cd "$(dirname "$0")/.." && pwd)/img/videos"

mkdir -p "$OUT/1080" "$OUT/720" "$POS"

# nombre original | nombre nuevo | segundo de la portada
while IFS='|' read -r orig slug ss; do
  in="$SRC/$orig.mp4"
  [ -f "$POS/$slug.jpg" ] || "$FFMPEG" -nostdin -hide_banner -loglevel error -y -ss "$ss" -i "$in" \
    -frames:v 1 -vf "scale=640:-2" -q:v 6 "$POS/$slug.jpg"
  for h in 1080 720; do
    out="$OUT/$h/$slug-$h.mp4"
    [ -f "$out" ] && continue
    crf=$([ "$h" = 1080 ] && echo 23 || echo 26)
    echo "== $slug $h"
    "$FFMPEG" -nostdin -hide_banner -loglevel error -y -i "$in" \
      -vf "scale=-2:$h" -c:v libx264 -preset slow -crf "$crf" -profile:v high -pix_fmt yuv420p \
      -c:a aac -b:a 96k -ac 1 -movflags +faststart "$out.part.mp4"
    mv "$out.part.mp4" "$out"
  done
done <<'EOF'
Aviso importante|00-aviso-importante|3
Paso 00 Limpieza habitacion|01-limpiar-el-cuarto|20
Paso 01 Calentar la bolsa|02-calentar-la-bolsa|8
Paso 02 Reunir materiales y tomar presion arterial|03-reunir-materiales-y-presion|8
Paso 03 Lavado de manos sencillo|04-lavado-de-manos-sencillo|16
Paso 04 Limpieza de botella|05-limpiar-la-botella-de-alcohol|10
Paso 05 Lavado de manos completo|06-lavado-de-manos-completo|24
Paso 06 Limpieza mesa y gigante|07-limpiar-la-mesa-y-el-gigante|20
Paso 07 Limpieza de yodo y suero|08-limpiar-el-yodo-y-la-bolsa|16
Paso 08 Limpieza Organizador|09-lavar-el-organizador|14
Paso 09 Limpieza cateter y botella de alcohol|10-limpiar-el-cateter|14
Paso 10 Lavado de manos 5 minutos|11-lavado-de-manos-de-5-minutos|30
Paso 11 Iniciar procesio dialisis|12-abrir-y-colgar-la-bolsa|40
Paso 12 Conectar el paciente al organizador y drenar paciente|13-conectar-y-drenar|32
Paso 13 Introducir liquido al paciente|14-dejar-entrar-el-liquido|24
Paso 14 Desconectar paciente|15-desconectar|44
Paso 15 Medicion de liquido|16-medir-el-liquido-y-recoger|20
EOF

du -sh "$OUT/1080" "$OUT/720"
