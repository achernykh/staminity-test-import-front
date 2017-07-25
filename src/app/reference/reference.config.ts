import { StateProvider, StateDeclaration, StateService } from 'angular-ui-router';

import { DisplayView, DefaultTemplate } from "../core/display.constants";
import SessionService from "../core/session.service";
import UserService from "../core/user.service";
import GroupService from "../core/group.service";
import AuthService from "../auth/auth.service";
import ReferenceService from "./reference.service";
import * as translate from './reference.translate';


function configure (
	$stateProvider: StateProvider, 
	$translateProvider
) {
	$stateProvider
	.state('club-reference', <StateDeclaration> {
		url: "/reference/club/:uri",
		loginRequired: true,
		authRequired: ['user'],
		resolve: {
			view: () => new DisplayView('reference'),
			isAuthenticated: ['AuthService', (AuthService: AuthService) => AuthService.isAuthenticated()],
			clubUri: ['$stateParams', ($stateParams) => $stateParams.uri],
			club: ['GroupService', 'clubUri', 'isAuthenticated', (GroupService: GroupService, clubUri: string, isAuthenticated: boolean) => GroupService.getProfile(clubUri, 'club', isAuthenticated)],
			userId: ['SessionService', (SessionService: SessionService) => SessionService.getUser().userId],
			user: ['UserService', 'userId', 'isAuthenticated', (UserService: UserService, userId: number, isAuthenticated: boolean) => UserService.getProfile(userId, isAuthenticated)],
			categories: ['ReferenceService', (ReferenceService: ReferenceService) => ReferenceService.getActivityCategories(undefined, false, true)],
			templates: ['ReferenceService', (ReferenceService: ReferenceService) => ReferenceService.getActivityTemplates(undefined, undefined, false, false)],
		},
		views: DefaultTemplate('reference')
	})
	.state('reference', <StateDeclaration> {
		url: "/reference",
		loginRequired: true,
		authRequired: ['user'],
		resolve: {
			view: () => new DisplayView('reference'),
			isAuthenticated: ['AuthService', (AuthService: AuthService) => AuthService.isAuthenticated()],
			userId: ['SessionService', (SessionService: SessionService) => SessionService.getUser().userId],
			user: ['UserService', 'userId', 'isAuthenticated', (UserService: UserService, userId: number, isAuthenticated: boolean) => UserService.getProfile(userId, isAuthenticated)],
			categories: ['ReferenceService', (ReferenceService: ReferenceService) => ReferenceService.getActivityCategories(undefined, false, true)],
			templates: ['ReferenceService', (ReferenceService: ReferenceService) => ReferenceService.getActivityTemplates(undefined, undefined, false, false)]
		},
		views: DefaultTemplate('reference')
	});
	
	$translateProvider.translations('en', translate['en']);
	$translateProvider.translations('ru', translate['ru']);
}

configure.$inject = ['$stateProvider', '$translateProvider'];


export default configure;