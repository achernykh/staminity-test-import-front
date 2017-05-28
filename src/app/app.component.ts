import { IComponentController, IComponentOptions } from 'angular';

import './app.component.scss';

class AppController implements IComponentController {
	static $inject = ['$mdSidenav'];
	constructor(private $mdSidenav: any) { }
}

const AppComponent: IComponentOptions = {
	controller: AppController,
	template: require('./app.component.html') as string
};

export default AppComponent;