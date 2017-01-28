import * as angular from 'angular';
import {IRootScopeService,ICompileService,ITimeoutService} from 'angular';

export interface IMessageService {
	info(code: string, provider?: string);
	show(...args);
	success();
	warning();
	error();
	log();
}
/**
 * @ngdoc  service
 * @name MessageService
 * @module staminity.core
 *
 * @description
 * `MessageService` сервис для показа сообщений пользователю. Сообщения могут быть доставлены двумя способами
 * 1) с помощью стандартного инструмента $mdToast - далее toast message 2) с помощью всплавающей сверху панели - далее
 * system message.
 *
 * Toast message используется для оповещения пользователя о рутинных операциях, не привлекая большого внимания, но
 * оповещая, что действие выполнено, что-то призошло. Например, "Запись успешно сохранена", "Профиль пользователя
 * обновлен" и пр.
 * System message используется, когда необходимо привлечеть внимание пользователя к сообщений, например "Пользователь
 * не найден, Вы будете перенаправлены на страницу...", "Обращаем ваше внимание, что в период с ... по ... будут
 * производиться плановые работы на сервере..."
 *
 * ### Мультиязычность
 * Toast message & System message мультиязычны и работают с обьектами перевода. На вход получают код сообщения и
 * контекст для выпода переменных. Обьекты перевода хранятся в файле /core/message.translate.ts
 *
 * @usage
 * <hljs lang="js">
 *     this.message.show();
 * </hljs>
 */
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
	 * @ngdoc method
	 * @name info
	 * @description Вывод информационного сообщения
	 * @param {string} code Код обьекта перевода из файла /core/message.translate.ts
	 * @param {string} provider Тип сообщения, может принимать значания `system` или `toast`
     */
	info(code: string, provider:string = 'toast'){

		this[provider](code);

	}

	show(...args){
		console.debug('MessageService=',args);
		this.blind(args[0],args[1]);
		//console.log(...param);
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