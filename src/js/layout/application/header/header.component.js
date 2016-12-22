import { _connection } from '../../../services/api/api.constants'

class HeaderCtrl {
	constructor(AuthService, $log, $mdSidenav, UserService) {
		'ngInject';
		this._AuthService = AuthService;
		this._$log = $log;
		this._$mdSidenav = $mdSidenav;
		this.user = UserService.profile;
		console.log('HeaderComponent: $onInit session = ', this.user);

	}

	avatarUrl(){
		return _connection.content + '/content/user/avatar/' + this.user.public.avatar;
	}

	toggleSlide(component) {
		this._$mdSidenav(component).toggle().then(() => angular.noop);
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