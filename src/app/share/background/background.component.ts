import { IComponentOptions, IComponentController} from 'angular';
require('./background.template.scss');

class BackgroundCtrl implements IComponentController {

	static $inject = [];

	constructor() {
	}

	/*toggleSlide(component) {
		this._$mdSidenav(component).toggle().then(() => angular.noop);
	}*/
}

const BackgroundComponent: IComponentOptions = {
	bindings: {
		view: '<'
	},
	transclude: false,
	controller: BackgroundCtrl,
	template: require('./background.template.html') as string
};

export default BackgroundComponent;