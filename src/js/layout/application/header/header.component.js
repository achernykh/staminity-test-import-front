class HeaderCtrl {
	constructor(AuthService, $log, $mdSidenav) {
		'ngInject';
		this._AuthService = AuthService;
		this._$log = $log;
		this._$mdSidenav = $mdSidenav;
	}
	$onInit() {
		this._$log.debug(`HeaderComponent: $onInit session = ${this.app.session.userId}`);
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
	require: {
		app: '^staminityApplication'
	},
	transclude: false,
	controller: HeaderCtrl,
	templateUrl: 'layout/application/header/header.html'
};