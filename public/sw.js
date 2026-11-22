// Bump the version whenever caching rules change so old caches are deleted.
const CACHE_NAME = 'omnipurchase-v2';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Only public, same-origin GETs are cached. API responses carry account data
// (profile, date of birth, address, wallets, session) and must never be written
// to a cache that outlives sign-out on a shared device.
function isCacheable(request) {
  if (request.method !== 'GET') return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith('/api/')) return false;
  if (request.headers.has('authorization')) return false;
  return true;
}

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
          return undefined;
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache for public assets only
self.addEventListener('fetch', (event) => {
  if (!isCacheable(event.request)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful, non-private responses
        const cacheControl = response.headers.get('cache-control') || '';
        if (response && response.status === 200 && response.type === 'basic' && !/no-store|private/i.test(cacheControl)) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
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
