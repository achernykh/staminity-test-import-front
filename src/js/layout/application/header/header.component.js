import { _connection } from '../../../services/api/api.constants'

class HeaderCtrl {
	constructor(AuthService, $log, $mdSidenav, UserService, AthleteSelectorService) {
		'ngInject';
		this._AuthService = AuthService;
		this._$log = $log;
		this._$mdSidenav = $mdSidenav;
		this.user = UserService.profile;
		this._AthleteSelectorService = AthleteSelectorService;
		console.log('headerctrl',this)
	}

	avatarUrl(){
		return _connection.content + (this.user? '/content/user/avatar/' + this.user.public.avatar : '/assets/avatar/default.png')
	}

	toggleSlide(component) {
		this._$mdSidenav(component).toggle().then(() => angular.noop);
	}

	showAthleteSelector($event){
		this._AthleteSelectorService.show($event)
	}
}

export const Header = {
	bindings: {
		leftPanel: '<',
		rightPanel: '<',
		view: '<'
	},
	transclude: false,
	controller: HeaderCtrl,
	templateUrl: 'layout/application/header/header.html'
};