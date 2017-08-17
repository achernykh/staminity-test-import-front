'use strict';

const DEBUG = true;
const version = '0.5.2-beta#321';
const preload = 'index.html,manifest.json,assets/locale/angular-locale_en.js,assets/locale/angular-locale_ru.js';
const cacheKey = `static-0.5.2-beta#321`;
const urlsToCache = [/http:\/\/.*/, /https:\/\/.*/, /\/assets\//];

self.addEventListener('install', (event) => {
	console.log('sw install', event);
	event.waitUntil(initCache().then(dump('sw install done'), dumpError('sw install err')));
});

self.addEventListener('activate', (event) => {
	console.log('sw activate', event);
	event.waitUntil(clearOldCaches().then(dump('sw activate done'), dumpError('sw activate err')));
});

self.addEventListener('fetch', (event) => {
	let { request } = event;
	event.respondWith(
		dump('sw fetch', request, 'cache?')(shouldCache(request))? cachedFetch(request) : fetch(request)
	);
});

function initCache () {
	return caches.open(cacheKey)
		.then((cache) => cache.addAll(preload.split(',')))
		.then(() => self.skipWaiting());
}

function clearOldCaches () {
	return caches.keys()
		.then((keys) => Promise.all(keys.filter((key) => key !== cacheKey).map((key) => caches.delete(key))))
		.then(() => self.clients.claim());
}

function shouldCache (request) {
	return !!urlsToCache.find((regexp) => regexp.test(request.url));
}

function cachedFetch (request) {
	return caches.match(request)
		.then(hasResult)
		.then(dump('sw cached', request), dumpError('sw not cached', request))
		.catch(() => {
			let response = fetch(request);
			let cache = caches.open(cacheKey);

			Promise.all([response, cache])
			.then(([response, cache]) => {
				cache.put(request, response.clone());
			});

			return response;
		});
}

function hasResult (result) {
	if (result) {
		return result;
	} else {
		throw new Error();
	}
}

function dump (...msgs) {
	return (arg) => {
		DEBUG && console.log(...msgs, arg);
		return arg;
	};
}

function dumpError (...msgs) {
	return (error) => {
		DEBUG && console.log(...msgs, error);
		throw error;
	};
}