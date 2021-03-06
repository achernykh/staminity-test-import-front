'use strict';

const DEBUG = true;
const version = '<%= version%>';
const preload = '<%= cache%>';
const cacheKey = `static-${version}`;
const whitelist = ['https://'];
const blacklist = ['/sw.js', 'favicon.ico?', 'https://www.google-analytics.com', 'https://mc.yandex.ru', 'https://omnidesk.ru/bundles/'];

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

	if (shouldHandle(request)) {
		event.respondWith(cachedFetch(request));
	}
});

function initCache () {
  return self.skipWaiting(); 
  // return caches.open(cacheKey) 
  //   .then((cache) => cache.addAll(preload.split(','))) 
  //   .then(() => self.skipWaiting()); 
}

function clearOldCaches () {
	return caches.keys()
		.then((keys) => Promise.all(keys.filter((key) => key !== cacheKey).map((key) => caches.delete(key))))
		.then(() => self.clients.claim());
}

function shouldHandle (request) {
	return request.method === 'GET' 
		&& !!whitelist.find((url) => request.url.startsWith(url))
		&& !blacklist.find((url) => request.url.includes(url));
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