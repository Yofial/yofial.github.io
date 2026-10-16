const CACHE = 'mishna-bekviuta-v2';
const SHELL = ['./', './index.html', './style.css', './app.js', './config.json', './schedule.json', './episodes.json',
  './manifest.webmanifest', './icon.svg', './icon-192.png', './hero-temple.jpg', './favicon.ico'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first with cache fallback: the site and texts already opened from Sefaria keep working offline.
// Progress API, sign-in and the Spotify player are never cached.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const own = url.origin === self.location.origin;
  if (own ? url.pathname.includes('/api/') : !/(^|\.)sefaria\.org$|fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: own && req.mode === 'navigate' })
        .then(hit => hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
  );
});
