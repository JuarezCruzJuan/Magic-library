const CACHE_NAME = 'magic-library-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/css/bootstrap.min.css',
  '/css/font-awesome.min.css',
  '/js/bootstrap.bundle.min.js',
  '/js/jquery.min.js',
  '/css/animate.min.css',
  '/css/owl.carousel.min.css',
  '/css/owl.theme.default.min.css',
  '/js/wow.min.js',
  '/js/owl.carousel.min.js',
  '/css/style.css'
];

// Instalación del service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Abriendo caché');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia de caché: Network First para recursos de la API
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la respuesta es exitosa, la guardamos en caché
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, intentamos obtener del caché
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Si no hay respuesta en caché, retornamos un error personalizado
            return new Response('Sin conexión y sin datos en caché', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
        })
    );
  } else {
    // Para otros recursos, usamos Cache First
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((response) => {
            // Solo cacheamos respuestas exitosas
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
        })
        .catch(() => {
          // Si falla tanto el caché como la red, retornamos una página offline
          if (event.request.destination === 'document') {
            return caches.match('/offline.html').then((offlineResponse) => {
              return offlineResponse || new Response('Sin conexión', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
          }
          // Para otros recursos, retornamos un error genérico
          return new Response('Recurso no disponible offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        })
    );
  }
});

// Manejo de actualizaciones del service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});