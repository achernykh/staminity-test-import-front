import { StateProvider, StateDeclaration, StateService } from 'angular-ui-router';

import { DisplayView, DefaultTemplate } from "../core/display.constants";
import UserService from "../core/user.service";
import AuthService from "../auth/auth.service";
import ReferenceService from "../core/reference.service";
import * as translate from './reference.translate';


function configure (
	$stateProvider:StateProvider, 
	$translateProvider: any
) {
	$stateProvider
	.state('reference', <StateDeclaration> {
		url: "/reference",
		loginRequired: true,
		authRequired: ['user'],
		resolve: {
			view: () => new DisplayView('reference'),
			auth: ['AuthService', (AuthService: AuthService) => AuthService.isAuthenticated()],
			userId: ['SessionService', (SessionService) => SessionService.getUser().userId],
			user: ['UserService', 'userId', 'auth', (UserService, userId, auth: boolean) => UserService.getProfile(userId, auth)],
			cathegories: ['ReferenceService', (ReferenceService) => ReferenceService.getActivityCategories(undefined, false, true)],
			templates: ['ReferenceService', (ReferenceService) => ReferenceService.getActivityTemplates(undefined, undefined, false, false)],
		},
		views: DefaultTemplate('reference')
	});

	console.log(translate['en'], translate['ru']);

	// Текст представлений
	$translateProvider.translations('en', translate['en']);
	$translateProvider.translations('ru', translate['ru']);
}

configure.$inject = ['$stateProvider','$translateProvider'];


export default configure;