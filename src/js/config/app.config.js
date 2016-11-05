/**
 * Created by akexander on 22/07/16.
 */

import translateApp from './translate/appbox.translate';

function AppConfig($locationProvider, $mdThemingProvider, $translateProvider, $stateProvider,
                   $urlRouterProvider){
    'ngInject';

	//TODO добавить коммент
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

	$urlRouterProvider.otherwise('/');

	// Настройка state (Представлений)
	// TODO переписать на какой-нибуь структурированный массив в Settings
	$stateProvider
		.state('welcome', {
			url: "/",
			access: [],
			resolve: {
				view: function(ViewService) {
					return ViewService.getParams('welcome')
				}
			},
			views: {
				"background": {
					component: "background",
					bindings: {
						view: 'view.background'
					}
				},
				"header": {
					component: 'header',
					bindings: {
						view: 'view.header'
					}
				},
				"application": {
					component: "landingPage",
					bindings: {
						view: 'view.application'
					}
				}
			}
		})
		.state('calendar', {
			url: "/calendar",
			access: [],
			resolve: {
				view: function(ViewService) {
					return ViewService.getParams('calendar')
				}
			},
			views: {
				"background": {
					component: "background",
					bindings: {
						view: 'view.background'
					}
				},
				"header": {
					component: 'header',
					bindings: {
						view: 'view.header'
					}
				},
				"application": {
					component: "calendar",
					bindings: {
						view: 'view.application'
					}
				}
			}
		});

    // Основная цветовая схема 'серо-голубой' с акцентом 'оранжевый'
  	$mdThemingProvider.theme('default')
      	.primaryPalette('blue-grey',{
        	'default': '500',
        	'hue-1': '50',
        	'hue-2': '600',
        	'hue-3': '800'
        })
        .accentPalette( 'orange', {
          'default': 'A700',
  				'hue-1': '50',
  				'hue-2': '600',
  				'hue-3': '800' })
        .warnPalette('red',{
          'default': 'A700' });
    // Дополнительная цветовая схема для контрастных форм и фрагментов,
    // с темным задним фоном
    $mdThemingProvider.theme('dark')
        .primaryPalette('deep-orange')
        .accentPalette('blue-grey')
        .warnPalette('red')
        .backgroundPalette('blue-grey').dark();

    // Текст представлений
		$translateProvider.translations('en', { app: translateApp['en'] });
    $translateProvider.translations('ru', { app: translateApp['ru'] });
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en');
    //$translateProvider.useSanitizeValueStrategy('escape');

}
export default AppConfig;
