import { ICompileProvider, ILocationProvider} from 'angular';
import {StateProvider, StateDeclaration, Transition} from 'angular-ui-router';
import moment from 'moment/min/moment-with-locales.js';
import {translateForm,translateGeneral} from "./app.translate";
import { IUserProfile } from "../../api/user/user.interface";
import AuthService from "./auth/auth.service";
import { SocketService } from "@app/core";

function configure(
	$compileProvider: ICompileProvider,
	$locationProvider: ILocationProvider,
	$urlRouterProvider: any,
	$mdThemingProvider: ng.material.IThemingProvider,
	$stateProvider:StateProvider,
	$translateProvider: any,
	$anchorScrollProvider: any,
	$qProvider: any,
	$mdGestureProvider: any
) {
	console.log('app: config start', window.location.origin);
	$mdGestureProvider.skipClickHijack(); //https://github.com/angular/angular.js/issues/6251
	$qProvider.errorOnUnhandledRejections(false); // https://github.com/angular-ui/ui-router/issues/2889
	$anchorScrollProvider.disableAutoScrolling();
	let isProductionBuild: boolean = __ENV !== "build";

	/**$locationProvider.html5Mode({
		enabled: false,
		requireBase: false
	});**/
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state("initialisation", <StateDeclaration>{
			url: "/",
			loginRequired: false,
			authRequired: null,
			redirectTo: (trans: Transition) => {
				let $mdMedia: any = trans.injector().get('$mdMedia');
				let authService: AuthService = trans.injector().get('AuthService');

				if (authService.isAuthenticated()) {
					if (authService.isCoach() && $mdMedia('gt-sm')) {
						return {state: 'dashboard'};
					} else {
						return {state: 'calendar'};
					}
				} else {
					return {state: 'welcome'};
				}
			}
		})
        .state('socket', {
            abstract: true,
            resolve: {
                init: ['SocketService', (socket: SocketService) => {
                    debugger;
                    return true; //socket.init();
                }]
            }
        });

	$compileProvider.debugInfoEnabled(!isProductionBuild);

	// Основная цветовая схема 'серо-голубой' с акцентом 'оранжевый'
	$mdThemingProvider.theme('default')
		.primaryPalette('blue-grey', {
			'default': '700',
				'hue-1': '50',
				'hue-2': '600',
				'hue-3': '900'
		})
		//.primaryPalette('blue')
		.accentPalette('deep-orange')
		//.accentPalette('amber')
		.warnPalette('red');

	// Основная цветовая схема 'серо-голубой' с акцентом 'оранжевый'
	$mdThemingProvider.theme('grey')
        .primaryPalette('grey')
        .accentPalette('deep-orange')
        .warnPalette('red');

	/**$mdThemingProvider.theme('default')
		.primaryPalette('blue-grey', {
			'default': '700',
			'hue-1': '50',
			'hue-2': '600',
			'hue-3': '900'
		})
		.accentPalette('deep-orange', {
			'default': 'A700',
			'hue-1': '50',
			'hue-2': '600',
			'hue-3': '800'
		})
		.warnPalette('red', {
			'default': 'A700'
		});**/

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

	console.log('config complete');
}

configure.$inject = [
	'$compileProvider', '$locationProvider', '$urlRouterProvider','$mdThemingProvider', 
	'$stateProvider', '$translateProvider', '$anchorScrollProvider','$qProvider', '$mdGestureProvider'
];

export default configure;