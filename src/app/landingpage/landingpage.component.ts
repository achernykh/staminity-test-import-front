import { IComponentOptions, IComponentController} from 'angular';
import {IAuthService} from "../auth/auth.service";
require('./landingpage.component.scss');

class LandingPageCtrl implements IComponentController {

	static $inject = ['AuthService'];

	constructor(private AuthService: IAuthService) { }

	$onInit() {

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