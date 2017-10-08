import {StateDeclaration} from "@uirouter/angular";
import {_translate} from './landingpage.translate';
import {DefaultTemplate, DisplayView} from "../core/display.constants";
//import {ITranslateProvider} from "angular-translate";

function configure($stateProvider: any,
                   $translateProvider:any) {

	$stateProvider
		.state('welcome', <StateDeclaration>{
			url: '/',
			loginRequired: false,
			authRequired: null,
			resolve: {
				view: () => new DisplayView('landingPage')
			},
			views: DefaultTemplate('landingPage')
		})
		.state('tariffs', <StateDeclaration>{
			url: '/tariffs',
			loginRequired: false,
			authRequired: null,
			resolve: {
				view: () => new DisplayView('landingTariffs')
			},
			views: DefaultTemplate('landingTariffs')
		});

	// Текст представлений
	$translateProvider.translations('en', {landing: _translate['en']});
	$translateProvider.translations('ru', {landing: _translate['ru']});


}

configure.$inject = ['$stateProvider', '$translateProvider'];

export default configure;