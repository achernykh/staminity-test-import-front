'use strict';

const version = '0.5.1-beta#61'; // increment in order to force a cache update
const toCache = 'index.html,manifest.json,assets/picture/lp-bg-03-1440.jpg,assets/js/app.js,assets/js/vendor.js,assets/locale/angular-locale_ru.js,assets/icon/expand_more.svg,assets/css/vendor.css,assets/css/app.css,assets/icon/ru.svg,assets/icon/en.svg,assets/picture/lp-scheme-01.png,assets/picture/lp-scheme-02.png,assets/picture/lp-scheme-03.png,assets/picture/lp-devices-01.png,assets/picture/lp-devices-02.png,assets/picture/lp-user-01.png,assets/picture/lp-user-02.png,assets/picture/lp-user-03.png,assets/icon/ripple.svg,assets/icon/logo_typo_mono.svg,assets/icon/logo_mono.svg,assets/picture/lp-bg-09-1440.jpg,assets/picture/lp-bg-10-1440.jpg,assets/picture/lp-bg-11-1440.jpg';

self.addEventListener('install', (event) => {
    event.waitUntil(
    caches.open('static-0.5.1-beta#61')
        .then((cache) => cache.addAll(toCache.split(','))
        .then(() => self.skipWaiting()))
);
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {

});

/**this.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).catch(() => {
            return fetch(event.request).then((response) => {
                return caches.open('static-0.5.1-beta#61').then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});**/

/**self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).catch(function() {
            return fetch(event.request).then(function(response) {
                return caches.open('v1').then(function(cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});**/