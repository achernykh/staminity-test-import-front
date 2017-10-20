import { detect } from 'detect-browser';


const browser = detect();

if (
	browser && (browser.name === 'safari' && parseInt(browser.version) < 9)
) {
	document.querySelector('staminity-application').setAttribute('style', 'display:none');
	document.querySelector('#browser-not-supported').removeAttribute('style');
} else {
	let serviceWorker = navigator['serviceWorker'];

	if (serviceWorker && serviceWorker.register) {
		serviceWorker.register('/sw.js')
		.then((reg) => console.info('SW registered!', reg))
		.catch((err) => console.error('Boo!', err));
	}

	require.ensure(['./app.module.ts', 'angular'], () => {
		const app = <Function>require('./app.module.ts')['default'];
		app();
	});
}
