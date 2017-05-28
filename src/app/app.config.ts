import { ICompileProvider, ILocationProvider} from 'angular';
import {StateProvider, StateDeclaration} from 'angular-ui-router';
import moment from 'moment/min/moment-with-locales.js';
import {translateForm,translateGeneral} from "./app.translate";

function configure(
	$compileProvider: ICompileProvider,
	$locationProvider: ILocationProvider,
	$urlRouterProvider: any,
	$mdThemingProvider: ng.material.IThemingProvider,
	$stateProvider:StateProvider,
	$translateProvider: any,
	pickerProvider: any,
	tmhDynamicLocaleProvider: any,
	$mdDateLocaleProvider: any,
    $anchorScrollProvider: any) {

    $anchorScrollProvider.disableAutoScrolling();
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
	// Основная цветовая схема 'серо-голубой' с акцентом 'оранжевый'
	$mdThemingProvider.theme('coming')
		.primaryPalette('grey', {
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

	// Текст переводов, которые относятся ко всем представлениям
	$translateProvider.translations('en', {form: translateForm['en']});
	$translateProvider.translations('ru', {form: translateForm['ru']});
	$translateProvider.translations('en', translateGeneral['en']);
	$translateProvider.translations('ru', translateGeneral['ru']);

	$translateProvider.preferredLanguage('ru');
	$translateProvider.fallbackLanguage('ru');
	//TODO необходимо перенести все фильры translate в директивы translate
	//$translateProvider.useSanitizeValueStrategy('sanitize');

	pickerProvider.setOkLabel('Save');
	pickerProvider.setCancelLabel('Close');
	//  Over ride day names by changing here
	pickerProvider.setDayHeader('single');  //Options 'single','shortName', 'fullName'

	moment.locale('ru');

	tmhDynamicLocaleProvider.localeLocationPattern('/assets/locale/angular-locale_{{locale}}.js');
	tmhDynamicLocaleProvider.defaultLocale('ru');
	$mdDateLocaleProvider.formatDate = (date) => moment(date).isValid() ? moment(date).format('L') : '';
	$mdDateLocaleProvider.firstDayOfWeek = 1; // monday

	console.log('config complete');
}

configure.$inject = ['$compileProvider', '$locationProvider', '$urlRouterProvider','$mdThemingProvider',
	'$stateProvider','$translateProvider', 'pickerProvider','tmhDynamicLocaleProvider', '$mdDateLocaleProvider','$anchorScrollProvider'];

export default configure;