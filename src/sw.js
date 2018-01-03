'use strict';

const DEBUG = true;
const version = '0.5.2-beta#340';
const preload = 'index.html,manifest.json,assets/locale/angular-locale_en.js,assets/locale/angular-locale_ru.js,assets/icon/RestDay.svg,assets/icon/altitude.svg,assets/icon/apple-touch-icon-114x114.png,assets/icon/apple-touch-icon-120x120.png,assets/icon/apple-touch-icon-128x128.png,assets/icon/apple-touch-icon-144x144.png,assets/icon/apple-touch-icon-192x192.png,assets/icon/apple-touch-icon-228x228.png,assets/icon/apple-touch-icon-57x57.png,assets/icon/apple-touch-icon-60x60.png,assets/icon/apple-touch-icon-72x72.png,assets/icon/apple-touch-icon-76x76.png,assets/icon/bike.svg,assets/icon/bikeToRun.svg,assets/icon/bullet.svg,assets/icon/bullet_first.svg,assets/icon/bullet_last.svg,assets/icon/bullet_middle.svg,assets/icon/cadence.svg,assets/icon/cycling.svg,assets/icon/default.svg,assets/icon/default_sport.svg,assets/icon/default_zone.svg,assets/icon/distance.svg,assets/icon/duration.svg,assets/icon/elapsedDuration.svg,assets/icon/elevationGain.svg,assets/icon/elevationLoss.svg,assets/icon/en.png,assets/icon/en.svg,assets/icon/event.svg,assets/icon/expand_more.svg,assets/icon/facebook_clr.svg,assets/icon/favicon-16-16.png,assets/icon/favicon-196-196.png,assets/icon/favicon-228-228.png,assets/icon/favicon-32-32.png,assets/icon/favicon-48x48.png,assets/icon/favicon-64x64.png,assets/icon/favicon-96x96.png,assets/icon/garmin_off.png,assets/icon/garmin_on.png,assets/icon/google_clr.svg,assets/icon/gym.svg,assets/icon/heartRate.svg,assets/icon/hierarchical-structure.svg,assets/icon/indoorBike.svg,assets/icon/indoorRun.svg,assets/icon/infinity.svg,assets/icon/loading-bars.gif,assets/icon/logo-gorizontal.svg,assets/icon/logo_mono.svg,assets/icon/logo_typo_mono.svg,assets/icon/lp-analytics.svg,assets/icon/lp-browser.svg,assets/icon/lp-goal-1.svg,assets/icon/lp-screen.svg,assets/icon/lp-speed.svg,assets/icon/lp-statistics.svg,assets/icon/measurement.svg,assets/icon/movingDuration.svg,assets/icon/mstile-144x144.png,assets/icon/mstile-150x150.png,assets/icon/mstile-310x150.png,assets/icon/mstile-310x310.png,assets/icon/mstile-310x350.png,assets/icon/mstile-70x70.png,assets/icon/openWaterSwim.svg,assets/icon/other.svg,assets/icon/paceSpeed.svg,assets/icon/polar_off.png,assets/icon/polar_on.png,assets/icon/poolSwim.svg,assets/icon/power.svg,assets/icon/research-1.svg,assets/icon/ripple.svg,assets/icon/ru.png,assets/icon/ru.svg,assets/icon/run.svg,assets/icon/sickness.svg,assets/icon/ski.svg,assets/icon/speed.svg,assets/icon/statistics-1.svg,assets/icon/straight.svg,assets/icon/strava_off.png,assets/icon/strava_on.png,assets/icon/streetRun.svg,assets/icon/strength.svg,assets/icon/strength_training.svg,assets/icon/sumElapsedDuration.svg,assets/icon/swim.svg,assets/icon/swimToBike.svg,assets/icon/swimToRun.svg,assets/icon/trackBike.svg,assets/icon/trailRun.svg,assets/icon/transition.svg,assets/icon/treadmillRun.svg,assets/icon/variable_athlete.svg,assets/icon/variable_athlete_coach.svg,assets/icon/vkontakte_clr.svg,assets/picture/404-bg-1440.png,assets/picture/default_avatar.png,assets/picture/default_background.jpg,assets/picture/logo_horizontal.png,assets/picture/logolp.svg,assets/picture/lp-bg-01-1440.jpg,assets/picture/lp-bg-02-1440.jpg,assets/picture/lp-bg-03-1440.jpg,assets/picture/lp-bg-04-1440.jpg,assets/picture/lp-bg-06-1440.jpg,assets/picture/lp-bg-07-1440.jpg,assets/picture/lp-bg-08-1440.jpg,assets/picture/lp-bg-09-1440.jpg,assets/picture/lp-bg-10-1440.jpg,assets/picture/lp-bg-11-1440.jpg,assets/picture/lp-club-01.png,assets/picture/lp-coach-01.png,assets/picture/lp-devices-01.png,assets/picture/lp-devices-02.png,assets/picture/lp-devices.png,assets/picture/lp-scheme-01.png,assets/picture/lp-scheme-02.png,assets/picture/lp-scheme-03.png,assets/picture/lp-user-01.png,assets/picture/lp-user-02.png,assets/picture/lp-user-03.png,assets/picture/og-staminity-01.jpg,assets/picture/og-staminity-01.png,assets/picture/pattern0.jpg,assets/picture/pattern1.png,assets/picture/pattern2.jpg,assets/picture/pattern3.png,assets/picture/pattern4.jpg,assets/picture/pattern5.jpg,assets/picture/power-button.svg,assets/picture/racing.svg,assets/picture/welcome01.jpg';
const cacheKey = `static-0.5.2-beta#340`;
const whitelist = ['https://'];
const blacklist = ['/sw.js', 'favicon.ico?'];

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
	return caches.open(cacheKey)
		.then((cache) => cache.addAll(preload.split(',')))
		.then(() => self.skipWaiting());
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
		//.then(dump('sw cached', request), dumpError('sw not cached', request))
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