const CACHE = 'insight-cache-v1';
const OFFLINE_POSTS = 'insight-offline-posts';

self.addEventListener('install', (e) => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Offline queue for journal posts
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method === 'POST' && url.pathname === '/api/entries') {
    event.respondWith((async () => {
      try {
        const res = await fetch(event.request.clone());
        return res;
      } catch (err) {
        const body = await event.request.clone().json().catch(() => null);
        const stored = await caches.open(OFFLINE_POSTS);
        const key = Date.now() + ':' + Math.random().toString(36).slice(2);
        await stored.put(new Request('/offline-post/' + key), new Response(JSON.stringify(body || {}), { headers: { 'Content-Type': 'application/json' } }));
        return new Response(JSON.stringify({ ok: false, offline: true }), { status: 202, headers: { 'Content-Type': 'application/json' } });
      }
    })());
    return;
  }
});

// Sync endpoint trigger
self.addEventListener('message', async (event) => {
  if (event.data === 'sync-offline-posts') {
    const stored = await caches.open(OFFLINE_POSTS);
    const requests = await stored.keys();
    for (const req of requests) {
      const res = await stored.match(req);
      const data = await res.json();
      try {
        await fetch('/api/entries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        await stored.delete(req);
      } catch (_) {}
    }
  }
});


