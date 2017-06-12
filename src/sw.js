'use strict';

const version = '0.5.1-beta#58'; // increment in order to force a cache update
const toCache = '';

self.addEventListener('install', (event) => {
    event.waitUntil(
    caches.open(`static-0.5.1-beta#58`)
        .then((cache) => cache.addAll(toCache.split(','))
        .then(() => self.skipWaiting()))
);
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

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