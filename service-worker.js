const CACHE = 'wedding-weekend-v1';
const OFFLINE_FILES = [
  './', './index.html', './saturday.html', './style.css', './script.js',
  './manifest.webmanifest', './wedding-weekend.ics',
  './assets/lakeside-watercolor.png', './assets/event-watercolors.png',
  './assets/icon-192.png', './assets/icon-512.png', './assets/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(OFFLINE_FILES)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('wedding-weekend-') && key !== CACHE).map(key => caches.delete(key))
  )));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request).then(response => response || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
