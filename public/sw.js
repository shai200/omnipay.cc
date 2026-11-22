// v2: v1 cached every successful GET, including signed-in API responses such
// as /api/profile and /api/auth/get-session, and replayed them when offline.
// Bumping the name makes the activate handler delete those caches.
const CACHE_NAME = 'omnipurchase-v2';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        console.warn('Some assets could not be cached on install');
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Only public, same-origin GETs are cached. API routes carry account data and
// session state, and third-party requests (Stripe) must never be replayed
// from a cache, so both always go straight to the network.
function isCacheable(request) {
  if (request.method !== 'GET') return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith('/api/')) return false;
  return true;
}

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (!isCacheable(event.request)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful, non-private responses
        const cacheControl = response.headers.get('Cache-Control') || '';
        if (response && response.status === 200 && response.type === 'basic' && !/no-store|private/i.test(cacheControl)) {
          const responseToCache = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache))
          );
        }
        return response;
      })
      .catch(() => {
        // Return cached response on network failure
        return caches.match(event.request).then((response) => {
          return response || new Response('Offline - cached version unavailable', { status: 503 });
        });
      })
  );
});
