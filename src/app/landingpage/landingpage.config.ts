import {StateProvider, StateDeclaration} from 'angular-ui-router';
import {_translate} from './landingpage.translate';
//import {ITranslateProvider} from "angular-translate";

function configure($stateProvider:StateProvider,
                   $translateProvider:any) {

	$stateProvider
		.state('welcome', <StateDeclaration>{
			url: '/',
			loginRequired: false,
			authRequired: false,
			display: {
				background: null,
				header: null,
				application: null
			},
			onEnter: ()=> {
				console.log('on enter');
			},
			views: {
				"background": {
					component: "staminityBackground",
					bindings: {
						view: 'display.background'
					}
				},
				"header": {
					component: 'staminityHeader',
					bindings: {
						view: 'display.header'
					}
				},
				"application": {
					component: "landingPage",
					bindings: {
						view: 'display.application'
					}
				}
			}
		});

	// Текст представлений
	$translateProvider.translations('en', {landing: _translate['en']});
	$translateProvider.translations('ru', {landing: _translate['ru']});


}

configure.$inject = ['$stateProvider', '$translateProvider'];

export default configure;