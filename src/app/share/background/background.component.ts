import { IComponentOptions, IComponentController} from 'angular';
import {SocketService} from "../../core/socket.service";
require('./background.template.scss');

class BackgroundCtrl implements IComponentController {

	private internetStatus: boolean = true;
	static $inject = ['SocketService'];

	constructor(private socket: SocketService) {
		this.socket.connections.subscribe(status => this.internetStatus = !!status);
	}

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