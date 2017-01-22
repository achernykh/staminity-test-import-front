import { ICompileProvider, ILocationProvider} from 'angular';
import {StateProvider, StateDeclaration} from 'angular-ui-router';

function configure(
	$compileProvider: ICompileProvider,
	$locationProvider: ILocationProvider,
	$urlRouterProvider: any,
	$mdThemingProvider: ng.material.IThemingProvider,
	$stateProvider:StateProvider,
	$translateProvider: any) {

	let isProductionBuild: boolean = __ENV !== "build";

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

	$urlRouterProvider.otherwise('/');

	$compileProvider.debugInfoEnabled(!isProductionBuild);

	// Основная цветовая схема 'серо-голубой' с акцентом 'оранжевый'
	$mdThemingProvider.theme('default')
		.primaryPalette('blue-grey', {
			'default': '500',
			'hue-1': '50',
			'hue-2': '600',
			'hue-3': '800'
		})
		.accentPalette('deep-orange', {
			'default': 'A700',
			'hue-1': '50',
			'hue-2': '600',
			'hue-3': '800'
		})
		.warnPalette('red', {
			'default': 'A700'
		});
	// Дополнительная цветовая схема для контрастных форм и фрагментов,
	// с темным задним фоном
	$mdThemingProvider.theme('dark')
		.primaryPalette('deep-orange')
		.accentPalette('blue-grey', {
			'default': '800',
			'hue-1': '50',
			'hue-2': '600',
			'hue-3': '800'
		})
		.warnPalette('red')
		.backgroundPalette('blue-grey', {
			'default': '800',
			'hue-1': '50',
			'hue-2': '600',
			'hue-3': '800'
		})
		.dark();

	// Дополнительная цветовая схема для контрастных форм и фрагментов,
	// с темным задним фоном
	$mdThemingProvider.theme('nav')
		.primaryPalette('blue-grey')
		.accentPalette('deep-orange', {
			'default': '800',
			'hue-1': '50',
			'hue-2': '600',
			'hue-3': '800'
		})
		.warnPalette('red')
		.backgroundPalette('blue-grey', {
			'default': '800',
			'hue-1': '50',
			'hue-2': '600',
			'hue-3': '800'
		})
		.dark();

	$translateProvider.preferredLanguage('ru');
	$translateProvider.fallbackLanguage('ru');

	console.log('config complete');
}

configure.$inject = ['$compileProvider', '$locationProvider', '$urlRouterProvider','$mdThemingProvider','$stateProvider','$translateProvider'];

export default configure;