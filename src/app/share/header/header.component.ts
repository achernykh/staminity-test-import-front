import * as angular from 'angular';
import { IComponentOptions, IComponentController} from 'angular';
import UserService from "../../../js/services/user/user.service";
import {IUserProfile} from "../../../../api/user/user.interface";
import SessionService from "../../core/session.service";
import { Observable} from 'rxjs/Observable';

require('./header.component.scss');
//import { _connection } from '../../../services/api/api.constants'

class HeaderCtrl implements IComponentController {

	private user: IUserProfile;
	private profile$: Observable<IUserProfile>;

	static $inject = ['$mdSidenav', 'AuthService', 'SessionService'];

	constructor(
		private $mdSidenav: any,
		private AuthService: any,
		private SessionService: SessionService) {

		this.profile$ = SessionService.profile.subscribe(profile=> this.user = angular.copy(profile));

	}


	avatarUrl(){
	//	return _connection.content + (this.user? '/content/user/avatar/' + this.user.public.avatar : '/assets/avatar/default.png')
	}

	toggleSlide(component) {
		this.$mdSidenav(component).toggle().then(() => angular.noop);
	}

	showAthleteSelector($event){
		//this.AthleteSelectorService.show($event);
	}
}

const HeaderComponent: IComponentOptions = {
	bindings: {
		leftPanel: '<',
		rightPanel: '<',
		view: '<'
	},
	transclude: false,
	controller: HeaderCtrl,
	template: require('./header.component.html') as string
};
export default HeaderComponent;