const CACHE_NAME = 'universe-priyanka-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './css/style.css',
  './js/particles.js',
  './js/music.js',
  './js/gallery.js',
  './js/timeline.js',
  './js/vault.js',
  './js/puzzle.js',
  './js/main.js',
  './js/extras.js',
  './manifest.json'
];

const PHOTO_ASSETS = [
  './assets/photos/p1.jpg',
  './assets/photos/p2.jpg',
  './assets/photos/p3.jpg',
  './assets/photos/p4.jpg',
  './assets/photos/p5.jpg',
  './assets/photos/p6.jpg',
  './assets/photos/p7.webp',
  './assets/photos/p8.jpg',
  './assets/photos/p9.jpg',
  './assets/photos/p10.jpg',
  './assets/photos/p11.jpg',
  './assets/photos/p12.jpg',
  './assets/photos/p13.jpg',
  './assets/photos/p14.png'
];

const MUSIC_ASSETS = [
  './assets/music/khayaal.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE)
        .then(() => cache.addAll(PHOTO_ASSETS).catch(() => {}))
        .then(() => cache.addAll(MUSIC_ASSETS).catch(() => {}));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin !== location.origin && !url.hostname.includes('fonts.googleapis.com') && !url.hostname.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
