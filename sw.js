// Version bump erzwingt Cache-Invalidierung bei allen Clients
const CACHE = 'fitcore-v3';
const ASSETS = [
  '/FitCore/',
  '/FitCore/index.html',
  '/FitCore/manifest.json',
  '/FitCore/icon-192.png',
  '/FitCore/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k))) // ALLE alten Caches löschen, nicht nur fremde
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network-first statt cache-first — verhindert, dass alte Versionen kleben bleiben
  e.respondWith(
    fetch(e.request).then(res => {
      const resClone = res.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, resClone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
