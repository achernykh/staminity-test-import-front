import * as angular from 'angular';
import { IComponentOptions, IComponentController} from 'angular';
import UserService from "../../../js/services/user/user.service";
import {IUserProfile} from "../../../../api/user/user.interface";
import SessionService from "../../core/session.service";
import GroupService from "../../core/group.service";
import { Observable } from 'rxjs/Observable';
import './header.component.scss';

class HeaderCtrl implements IComponentController {
	public requests: number;

	private user: IUserProfile;
	private profile$: Observable<IUserProfile>;

	static $inject = ['$scope', '$mdSidenav', 'AuthService', 'SessionService', 'GroupService'];

	constructor(
		private $scope,
		private $mdSidenav: any,
		private AuthService: any,
		private SessionService: SessionService,
		private GroupService: GroupService
	) {
		this.profile$ = SessionService.profile.subscribe(profile=> this.user = angular.copy(profile));

		this.GroupService.requestsUpdates
		.map((requests) => requests.filter((request) => request.receiver.userId === this.user.userId && !request.updated))
		.subscribe((requestsInboxNew) => {
			this.requests = requestsInboxNew.length;
			this.$scope.$apply();
		});
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