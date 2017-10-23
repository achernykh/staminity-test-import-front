import { detect } from 'detect-browser';

const addScript = (url) => {
	var script = document.createElement('script');
	script.src = url;
	script.setAttribute('type', 'text/javascript');
	// script.setAttribute('defer', '');
	document.body.appendChild(script);
};

const addStylesheet = (url) => {
	var stylesheet = document.createElement('link');
	stylesheet.href = url;
	stylesheet.setAttribute('type', 'text/css');
	stylesheet.setAttribute('rel', 'stylesheet');
	document.head.appendChild(stylesheet);
};

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

	window['STAMINITY_SCRIPTS'].forEach(addScript);
	window['STAMINITY_STYLESHEETS'].forEach(addStylesheet);
}
