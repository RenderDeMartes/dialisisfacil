/* Diálisis Fácil · modo sin conexión: la guía (texto, íconos y subtítulos) funciona sin internet.
 * Los videos no se guardan: pesan mucho y vienen de archive.org. */
const VERSION = 'df-v3';
const BASE = [
  './', 'index.html', 'assets/css/app.css?v=3', 'assets/js/datos.js?v=3', 'assets/js/marca.js?v=3', 'assets/js/app.js?v=3',
  'img/favicon.svg', 'manifest.webmanifest'
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
  const propio = url.origin === location.origin;
  const fuente = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!propio && !fuente) return; // videos y todo lo demás: directo a la red

  // Primero la red (para recibir cambios), y si no hay conexión, lo guardado.
  e.respondWith(
    fetch(e.request).then((r) => {
      if (r.ok || r.type === 'opaque') { const copia = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copia)); }
      return r;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
  );
});
