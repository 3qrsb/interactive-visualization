const STATIC_CACHE = 'my-viz-app-static-v1';
const DYNAMIC_CACHE = 'my-viz-app-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
  
    if (requestUrl.hostname === 'newsapi.org') {
      event.respondWith(
        caches.open(DYNAMIC_CACHE).then((cache) => {
          return fetch(event.request)
            .then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              console.log('[Service Worker] Cached news for:', event.request.url);
              return networkResponse;
            })
            .catch(() => {
              return cache.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                  console.log('[Service Worker] Serving cached news for:', event.request.url);
                  return cachedResponse;
                } else {
                  console.log('[Service Worker] No cached news available for:', event.request.url);
                  return new Response(JSON.stringify({
                    articles: [],
                    message: "No cached news available. Please check your network connection."
                  }), {
                    headers: { 'Content-Type': 'application/json' }
                  });
                }
              });
            });
        })
      );
    } else {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || fetch(event.request);
        })
      );
    }
  });
