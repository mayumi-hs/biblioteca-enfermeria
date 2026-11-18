// Service worker mínimo: intenta siempre la red primero (así ves la versión más nueva)
// y usa una copia guardada solo si no hay internet. No guarda datos de Supabase.
const CACHE = 'biblioteca-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then((res) => {
      const copia = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copia)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then((r) => r || caches.match('./')))
  );
});
