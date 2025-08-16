const VERSION = 'v2';
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const CORE_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => ![STATIC_CACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k)));
      // Store current version marker
      const meta = await caches.open(STATIC_CACHE);
      await meta.put(new Request('/__app_version'), new Response(VERSION));
      await clients.claim();
    })()
  );
});

async function checkVersion() {
  try {
    const res = await fetch('/api/version', { cache: 'no-store' });
    if (!res.ok) return;
    const { version } = await res.json();
    const cache = await caches.open(STATIC_CACHE);
    const stored = await cache.match('/__app_version');
    const current = stored ? await stored.text() : null;
    if (version && current && version !== current) {
      // prefetch core assets then activate new SW
      await caches.open(STATIC_CACHE).then(c => c.addAll(CORE_ASSETS));
      self.skipWaiting();
      const cs = await clients.matchAll({ type: 'window' });
      cs.forEach(c => c.postMessage({ type: 'NEW_VERSION', version }));
    }
  } catch {}
}

setInterval(checkVersion, 60 * 1000); // poll each minute

function isHtml(request) {
  return request.mode === 'navigate' || (request.headers.get('accept')||'').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  // HTML navigation: Network first -> offline fallback
  if (isHtml(request)) {
    event.respondWith(
      fetch(request).catch(async () => (await caches.open(STATIC_CACHE)).match('/offline.html'))
    );
    return;
  }
  // Other: Stale-While-Revalidate
  event.respondWith(
    caches.open(RUNTIME_CACHE).then(async cache => {
      const cached = await cache.match(request);
      const fetchPromise = fetch(request).then(res => {
        if (res.status === 200 && request.url.startsWith(self.location.origin)) {
          cache.put(request, res.clone());
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
