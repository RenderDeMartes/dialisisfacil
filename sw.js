/* Diálisis Fácil · modo sin conexión: la guía (texto, íconos y subtítulos) funciona sin internet.
 * Los videos no se guardan: pesan mucho y vienen de archive.org. */
const VERSION = 'df-v9';
const BASE = [
  './', 'index.html', 'assets/css/app.css?v=9', 'assets/js/datos.js?v=9', 'assets/js/marca.js?v=9', 'assets/js/app.js?v=9',
  'img/favicon.svg', 'manifest.webmanifest',
  'assets/fuentes/atkinson-hyperlegible-next-latin.woff2', 'assets/fuentes/atkinson-hyperlegible-mono-latin.woff2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin !== location.origin) return; // videos y todo lo demás: directo a la red

  // Primero la red (para recibir cambios), y si no hay conexión, lo guardado.
  // Solo se guardan respuestas completas (200): el audio a veces llega por partes (206).
  e.respondWith(
    fetch(e.request).then((r) => {
      if (r.status === 200) { const copia = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copia)).catch(() => {}); }
      return r;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
  );
});
