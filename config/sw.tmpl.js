'use strict';

const version = '<%= version%>'; // increment in order to force a cache update
const toCache = '<%= cache%>';

self.addEventListener('install', (event) => {
    event.waitUntil(
    caches.open(`static-${version}`)
        .then((cache) => cache.addAll(toCache.split(','))
        .then(() => self.skipWaiting()))
);
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

/**self.addEventListener('fetch', (event) => {
    console.log('fetch request',event.request);
    event.respondWith(caches.match(event.request)
            .catch(() => {
                return fetch(event.request).then((response) => {
                    console.log('fetch cache',response);
                    return caches.open('v1').then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
    );
});**/