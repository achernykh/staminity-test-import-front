import { IComponentOptions, IComponentController} from 'angular';
import {IAuthService} from "../auth/auth.service";
import {StateService} from 'angular-ui-router';
import SessionService from "../core/session.service";
import {IUserProfile} from "../../../api/user/user.interface";
import { Observable } from 'rxjs/Observable';
require('./landingpage.component.scss');

class LandingPageCtrl implements IComponentController {

	private profile$: Observable<IUserProfile>;
	private user: IUserProfile;
	private readonly slides: any = {
		athlete: ['lp-user-01.png','lp-user-02.png','lp-user-03.png'],
		coach: ['lp-coach-01.png'],
		club: ['lp-club-01.png']
	};

	static $inject = ['AuthService','$state','SessionService'];

	constructor(private AuthService: IAuthService,
				private $state: StateService,
				private SessionService: SessionService) {

	}

	$onInit() {
		this.profile$ = this.SessionService.profile.subscribe(profile=> this.user = angular.copy(profile));
	}

	go() {
		if(this.AuthService.isAuthenticated()) {
			this.$state.go('calendar', {uri: this.user.public.uri});
		} else {
			this.$state.go('signup');
		}
	}

}

const LandingPageComponent: IComponentOptions = {
	bindings: {
		view: '<'
	},
	controller: LandingPageCtrl,
	template: require('./landingpage.component.html') as string
};

export default LandingPageComponent;