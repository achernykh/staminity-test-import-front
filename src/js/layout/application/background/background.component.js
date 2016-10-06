class BackgroundCtrl {
	constructor() {
		'ngInject';
	}

	toggleSlide(component) {
		this._$mdSidenav(component).toggle().then(() => angular.noop);
	}
}

export const Background = {
	bindings: {
		view: '<'
	},
	transclude: false,
	controller: BackgroundCtrl,
	templateUrl: 'layout/application/background/background.html'
};