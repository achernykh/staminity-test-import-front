class HeaderCtrl {
	constructor(AuthService, $log, $mdSidenav, UserService) {
		'ngInject';
		this._AuthService = AuthService;
		this._$log = $log;
		this._$mdSidenav = $mdSidenav;
		this.user = UserService.getCurrentUser();
	}
	$onInit() {
		console.log(`HeaderComponent: $onInit session = ${this.user}`);
	}

	$onChanges(changes){
		this._$log.debug('HeaderComponent: $onChanges', changes);
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