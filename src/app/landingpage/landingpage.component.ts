import { IComponentOptions, IComponentController} from 'angular';
require('./landingpage.scss');

class LandingPageCtrl implements IComponentController {

	static $inject = [];

	constructor() { }

	$onInit() {
		console.log(`LandingPageCtrl: $onInit()`);
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