// Servidor local para probar la página con los videos comprimidos, con soporte de
// Range (sin eso el navegador no puede adelantar el video al segundo de cada paso).
//
// Uso: node tools/servidor.mjs [puerto] [carpeta-de-videos]
//   La página queda en http://localhost:8642/ y los videos en /videos-locales/.
//   En la consola del navegador:
//     localStorage.setItem('df-archivo', 'http://localhost:8642/videos-locales/')
import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { dirname, join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const puerto = Number(process.argv[2]) || 8642;
const videos = process.argv[3] || 'F:/Dialisis_Videos/Web';
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.pdf': 'application/pdf',
  '.zip': 'application/zip', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.vtt': 'text/vtt; charset=utf-8', '.txt': 'text/plain; charset=utf-8'
};

createServer((req, res) => {
  let ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let base = raiz;
  if (ruta.startsWith('/videos-locales/')) {
    // <id>-1080.mp4 está en 1080/, <id>-720.mp4 en 720/
    const nombre = ruta.slice('/videos-locales/'.length);
    const q = (nombre.match(/-(1080|720)\.mp4$/) || [])[1];
    base = videos; ruta = q ? `/${q}/${nombre}` : `/${nombre}`;
  }
  if (ruta.endsWith('/')) ruta += 'index.html';
  const archivo = normalize(join(base, ruta));
  if (!archivo.startsWith(normalize(base)) || !existsSync(archivo) || statSync(archivo).isDirectory()) {
    res.writeHead(404); res.end('No encontrado'); return;
  }
  const { size } = statSync(archivo);
  const cabeceras = { 'Content-Type': TIPOS[extname(archivo).toLowerCase()] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
  const rango = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (rango) {
    const ini = rango[1] ? Number(rango[1]) : size - Number(rango[2]);
    const fin = rango[1] && rango[2] ? Math.min(Number(rango[2]), size - 1) : size - 1;
    res.writeHead(206, { ...cabeceras, 'Content-Range': `bytes ${ini}-${fin}/${size}`, 'Content-Length': fin - ini + 1 });
    createReadStream(archivo, { start: ini, end: fin }).pipe(res);
  } else {
    res.writeHead(200, { ...cabeceras, 'Content-Length': size });
    createReadStream(archivo).pipe(res);
  }
}).listen(puerto, '127.0.0.1', () => console.log(`Diálisis Fácil en http://localhost:${puerto}/`));
