# Diálisis Fácil

Guía visual gratuita para hacer la **diálisis peritoneal en casa**, paso a paso: 42 pasos con íconos, voz, cronómetros y videos con subtítulos y transcripción. Está pensada para hacerse entre dos personas: una lee y la otra hace.

Sitio: https://dialisisfacil.com/ · Un proyecto de [VEUX](https://veuxweb.com/es/).

> Aviso: esta guía es una ayuda visual y no es oficial. No reemplaza las indicaciones del médico ni la capacitación de la unidad de diálisis.

## Qué tiene

- **Mobile first y accesible:** letra Atkinson Hyperlegible, contraste AAA, botones grandes, navegación con teclado y con el dedo, y lectores de pantalla.
- **Ajustes guardados en el dispositivo** (sin cookies): tamaño de letra, colores (claro, oscuro, alto contraste), espaciado, menos movimiento, voz y velocidad, subtítulos, calidad de video y pantalla siempre encendida.
- **Voz:** cada paso se puede escuchar con la voz del navegador (Web Speech API), y se puede leer en automático al cambiar de paso.
- **Cronómetros:** el lavado de manos de 5 minutos guiado por partes, con avisos de voz y sonido, y las esperas de drenaje e infusión.
- **Videos:** cada paso abre su parte del video. Subtítulos `.vtt` y una transcripción en la que se puede tocar cualquier frase para ir a ese momento.
- **Sin conexión:** el texto de la guía funciona sin internet (service worker). Los videos no.
- **Para imprimir:** «Los 42 pasos» sale bien en papel.

## Estructura

```
index.html              página única (rutas con #/…)
assets/js/datos.js      fases, 42 pasos, videos y el lavado de 5 minutos  ← el contenido se edita aquí
assets/js/marca.js      logo e íconos de la marca como SVG
assets/js/app.js        navegación, voz, ajustes, cronómetros y reproductor
assets/css/app.css      estilos y temas
subs/*.vtt              subtítulos corregidos (también arman la transcripción)
img/videos/*.jpg        portadas de los videos
marca/                  kit de marca: manual (kit/), SVG sueltos (descargas/) y el .zip
tools/                  scripts para comprimir videos, exportar la marca y preparar la subida
sw.js                   modo sin conexión
```

No hay paso de compilación: se sube la carpeta tal cual al hosting (Apache).

## Videos

Los videos viven en Internet Archive, en el item [`dialisisfacil`](https://archive.org/details/dialisisfacil): gratis, sin anuncios y sin gastar el ancho de banda del hosting. La dirección se cambia en `ARCHIVO`, dentro de `assets/js/datos.js`.

Cada video está en 1080p (por defecto) y 720p (opción «Ahorro de datos» en Ajustes), con el nombre `<id>-1080.mp4` y `<id>-720.mp4`.

Para regenerarlos desde los originales:

```bash
bash tools/comprimir-videos.sh        # necesita ffmpeg
node tools/preparar-archive.mjs       # deja un .srt junto a cada video
```

## Ver la página en su computadora

```bash
python -m http.server 8642
```

Luego abra http://localhost:8642 (los subtítulos no cargan si se abre el archivo directo).

## Colaborar

- Sugerencias y correcciones: https://veuxweb.com/es/
- Profesionales de salud: la hoja de revisión de íconos está en `marca/kit/Revision Clinica de Iconos.dc.html`.
- Código, traducciones o adaptaciones para su unidad: abra un issue o un pull request.

Para cambiar el logo o los íconos, edite `assets/js/marca.js` y vuelva a exportar con `node tools/exportar-marca.mjs`.

## Licencia

El código, el logo, los íconos, los colores y los textos de la guía son de dominio público bajo [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.es). La tipografía Atkinson Hyperlegible tiene su propia licencia (SIL Open Font License).
