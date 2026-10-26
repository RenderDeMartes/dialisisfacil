# Subir los videos a Internet Archive

> Pendiente: subir solo cuando la enfermera haya aprobado los videos.

Los videos comprimidos, cada uno con su `.srt`, salen de `bash tools/comprimir-videos.sh` y `node tools/preparar-archive.mjs`:

- `F:\Dialisis_Videos\Web\1080\` (17 MP4 + 17 SRT, unos 600 MB)
- `F:\Dialisis_Videos\Web\720\` (17 MP4 + 17 SRT, unos 195 MB)

## Pasos

1. Entre a https://archive.org/upload con la cuenta del proyecto.
2. Arrastre los 68 archivos de las dos carpetas. No cambie los nombres: la página los busca así.
3. Llene los datos del item:

| Campo | Valor |
|---|---|
| Page URL (identificador) | `dialisisfacil` |
| Title | Diálisis Fácil · Diálisis peritoneal en casa, paso a paso |
| Description | ver abajo |
| Subject tags | diálisis peritoneal; diálisis; salud; enfermería; tutorial; accesibilidad; español |
| Creator | Diálisis Fácil · VEUX |
| Language | Spanish |
| License | Creative Commons · Attribution-NonCommercial-NoDerivs 4.0 (CC BY-NC-ND 4.0) |
| Collection | Community Video |

Descripción:

```
Videos de la guía Diálisis Fácil (https://dialisisfacil.com/): diálisis peritoneal en casa, paso a paso, con una enfermera especialista. 17 videos cortos, en 1080p y 720p, con subtítulos en español.

Esta guía es una ayuda visual y no es oficial. No reemplaza las indicaciones de su médico ni la capacitación de su unidad de diálisis.

Licencia CC BY-NC-ND 4.0: se pueden compartir dando crédito, sin uso comercial y sin modificarlos.
```

4. Suba y espere a que archive.org termine de procesar (puede tardar unas horas).
5. Revise que abra `https://archive.org/download/dialisisfacil/02-calentar-la-bolsa-1080.mp4`.

Si el identificador `dialisisfacil` ya no está libre, use otro y cámbielo en `ARCHIVO`, dentro de `assets/js/datos.js`.
