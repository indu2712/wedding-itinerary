const CACHE = 'wedding-weekend-v5';
const OFFLINE_FILES = [
  './', './index.html', './saturday.html', './style.css?v=5', './script.js?v=4', './notifications.js?v=1',
  './vendor/add-to-homescreen/add-to-homescreen.min.css', './vendor/add-to-homescreen/add-to-homescreen_en.min.js',
  './manifest.webmanifest', './wedding-weekend.ics',
  './assets/lakeside-watercolor.jpg', './assets/event-watercolors.jpg',
  './vendor/add-to-homescreen/assets/android-chrome-bouncing-arrow.svg',
  './vendor/add-to-homescreen/assets/android-chrome-install-and-create-shortcut.svg',
  './vendor/add-to-homescreen/assets/android-chrome-more-button-2.svg',
  './vendor/add-to-homescreen/assets/android-edge-add-to-home-screen-button.svg',
  './vendor/add-to-homescreen/assets/android-edge-more-button.svg',
  './vendor/add-to-homescreen/assets/desktop-safari-bouncing-arrow.svg',
  './vendor/add-to-homescreen/assets/desktop-safari-dock.svg',
  './vendor/add-to-homescreen/assets/desktop-safari-menu.svg',
  './vendor/add-to-homescreen/assets/generic-more-button.svg',
  './vendor/add-to-homescreen/assets/generic-vertical-down-bouncing-arrow.svg',
  './vendor/add-to-homescreen/assets/generic-vertical-up-bouncing-arrow.svg',
  './vendor/add-to-homescreen/assets/ios-chrome-bouncing-arrow.svg',
  './vendor/add-to-homescreen/assets/ios-chrome-more-button-2.svg',
  './vendor/add-to-homescreen/assets/ios-safari-add-to-home-screen-button-2.svg',
  './vendor/add-to-homescreen/assets/ios-safari-bouncing-arrow.svg',
  './vendor/add-to-homescreen/assets/ios-safari-ios26-more-grey-arrow-button.svg',
  './vendor/add-to-homescreen/assets/ios-safari-ios26-more-white-button.svg',
  './vendor/add-to-homescreen/assets/ios-safari-ios26-share-button.svg',
  './vendor/add-to-homescreen/assets/ios-safari-ios27-bar-button.svg',
  './vendor/add-to-homescreen/assets/ios-safari-ios27-more-grey-arrow-button.svg',
  './vendor/add-to-homescreen/assets/ios-safari-ios27-share-button.svg',
  './vendor/add-to-homescreen/assets/ios-safari-sharing-api-button-2.svg',
  './vendor/add-to-homescreen/assets/openinsafari-button.png',
  './assets/icon-192.png', './assets/icon-512.png', './assets/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(OFFLINE_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('wedding-weekend-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request).then(response => response || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
