import * as angular from 'angular';
import {IRootScopeService,ICompileService,ITimeoutService} from 'angular';

export interface IMessageService {
	info(code: string, provider?: string);
	success();
	warning();
	error();
	log();
}

export default class MessageService implements IMessageService{

	id: number = 1;

	toastTemplate =
		`<md-toast>
			<md-icon class="material-icons" style="color: darkred"></md-icon>
			<span class="md-toast-text" flex>{{'message.' + $ctrl.code + '.text' | translate:$ctrl.context}}</span>
			<!--<md-button class="md-highlight" ng-click="openMoreInfo($event)">More info</md-button>-->
			<md-button ng-click="hide()">Close</md-button>
		</md-toast>`;

	static $inject = ['$rootScope','$compile','$timeout','$mdToast'];

	constructor(
		private $rootScope: IRootScopeService,
		private $compile: ICompileService,
		private $timeout: ITimeoutService,
		private $mdToast:any) {
	}

	/**
	 *
	 * @param text
	 */
	/*simple(text) {
		this.$mdToast.show(
			this.$mdToast.simple()
				.textContent(text)
				.position("bottom center")
				.hideDelay(3000)
		);
	}*/

	info(code: string, provider:string = 'toast'){

		this[provider](code);

	}

	success(){}
	warning(){}
	error(){}
	log(){}

	private blind(code: string, status: string = 'error', delay: number = 10) {
		let id = "appmes#" + ++this.id;
		//let delay = message.delay || 10;
		//let status = message.status || 'error';
		//console.info('sys',status, code);

		angular
			.element(document.getElementsByTagName('staminity-application'))
			//.append(this.$compile(`<system-message id="${id}" show="${false}" status="${status}" code="${code}"
			// delay="${delay}"/>`)(this.$rootScope))
			.append(this.$compile(
				'<system-message id='+id+' show="true" status="\'' + status +
				'\'" code="\'' + code +
				'\'" delay="\'' + delay +
				'\'"/>'
			)(this.$rootScope));

		if(!this.$rootScope.$$phase){
			this.$rootScope.$apply();
		}

		this.$timeout(() => angular.element(document.getElementById(id)).remove(), ++delay * 1000);

	}

	private toast(code: string) {
		this.$mdToast.show({
			hideDelay: 3000,
			position: 'bottom center',
			bindToController: true,
			controllerAs: '$ctrl',
			controller: ToastCtrl,
			locals: {
				code: code,
				context: {username: 'Alexander'}
			},
			template: this.toastTemplate
		});
	}

}

function ToastCtrl($scope, $mdToast) {

	$scope.hide = function() {
		$mdToast.hide();
	};
}

ToastCtrl.$inject = ['$scope','$mdToast'];