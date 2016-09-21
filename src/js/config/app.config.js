/**
 * Created by akexander on 22/07/16.
 */

import translateApp from './translate/appbox.translate';

function AppConfig($locationProvider, $mdThemingProvider, $translateProvider, $httpProvider){
    'ngInject';
    $locationProvider.html5Mode(true);
    //$httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common["X-Requested-With"];
    //$httpProvider.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    //$httpProvider.defaults.headers.common["Accept"] = "application/json";
    //$httpProvider.defaults.headers.common["Content-Type"] = "application/json";

    //$httpProvider.defaults.headers.common = {};
    //$httpProvider.defaults.headers.post = {};


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
        .primaryPalette('orange')
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
