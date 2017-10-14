import { IComponentController, IComponentOptions } from 'angular';

import './app.component.scss';
import {IAuthService} from "./auth/auth.service-ajs";

class AppController implements IComponentController {
	static $inject = ['$mdSidenav','AuthService'];
	constructor(private $mdSidenav: any,
				private auth: IAuthService) { }
}

const AppComponent: IComponentOptions = {
	controller: AppController,
	template: require('./app.component.html') as string
};

export default AppComponent;