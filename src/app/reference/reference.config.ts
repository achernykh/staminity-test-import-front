import { merge } from 'angular';
import { StateDeclaration, StateService } from "@uirouter/angular";

import { IUserProfile } from "../../../api/user/user.interface";
import { IGroupProfile } from "../../../api/group/group.interface";

import { DisplayView, DefaultTemplate } from "../core/display.constants";
import { isMember } from "../club/club.datamodel";
import SessionService from "../core/session.service-ajs";
import UserService from "../core/user.service-ajs";
import GroupService from "../core/group.service";
import AuthService from "../auth/auth.service-ajs";
import ReferenceService from "./reference.service";
import * as translate from './reference.translate';


function configure (
	$stateProvider: any,
	$translateProvider
) {
	$stateProvider
	.state('club-reference', <StateDeclaration> {
		url: "/reference/club/:uri",
		loginRequired: true,
		authRequired: ['user'],
		resolve: {
			view: () => merge(new DisplayView('reference'), {
				header: {
					fullTitle: 'reference.club.fullTitle',
					shortTitle: 'reference.club.shortTitle'
				}
			}),
			clubUri: ['$stateParams', ($stateParams) => $stateParams.uri],
			club: ['GroupService', 'clubUri', (GroupService: GroupService, clubUri: string) => GroupService.getProfile(clubUri, 'club', true)],
			userId: ['SessionService', (SessionService: SessionService) => SessionService.getUser().userId],
			user: ['UserService', 'userId', (UserService: UserService, userId: number) => UserService.getProfile(userId, true)],
			access: ['club', 'user', (club: IGroupProfile, user: IUserProfile) => {
				if (!isMember(user, club)) {
					throw 'noMembership';
				}
			}],
		},
		views: DefaultTemplate('reference')
	})
	.state('reference', <StateDeclaration> {
		url: "/reference",
		loginRequired: true,
		authRequired: ['user'],
		resolve: {
			view: () => new DisplayView('reference'),
			userId: ['SessionService', (SessionService: SessionService) => SessionService.getUser().userId],
			user: ['UserService', 'userId', (UserService: UserService, userId: number) => UserService.getProfile(userId, true)]
		},
		views: DefaultTemplate('reference')
	});
	
	$translateProvider.translations('en', translate['en']);
	$translateProvider.translations('ru', translate['ru']);
}

configure.$inject = ['$stateProvider', '$translateProvider'];


export default configure;