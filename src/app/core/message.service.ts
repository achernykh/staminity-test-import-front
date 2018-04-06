import * as angular from 'angular';
import {IRootScopeService,ICompileService,ITimeoutService} from 'angular';

import {_translateMessage} from './message.translate';


export interface IMessageService {

	system(code: string, status: string, context?: {}, delay?: number): void;
	systemError(code: string, context?: {}, delay?: number): void;
	systemWarning(code: string, context?: {}, delay?: number): void;
	systemSuccess(code: string, context?: {}, delay?: number): void;

	toast(code: string, status: string, context?: {}, delay?: number): void;
	toastInfo(code: string, context?: {}, delay?: number): void;
	toastError(code: string, context?: {}, delay?: number): void;
	toastWarning(code: string, context?: {}, delay?: number): void;
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
 *     this.message.system('userUndefined',{name: 'Илья Муромец'});
 * </hljs>
 */
export default class MessageService implements IMessageService{

	id: number = 1;
	toastTemplate =
		`<md-toast>
			<md-icon class="material-icons" style="color: darkred"></md-icon>
			<span class="md-toast-text" flex>{{$ctrl.code + '.text' | translate:$ctrl.context}}</span>
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
	 * @name system
	 * @description Вывод System message
	 * @param {string} code Код обьекта перевода из файла /core/message.translate.ts
	 * @param {Object} context Набор переменных для вывода шаблона сообщения
	 * @param {string} status Статус сообщения, может принимать значения `error`,`success`,`warning`
	 * @delay {number} delay Задержка в с показа сообщения на экране
	 */
	system(code: string, status: string = 'error', context: {} = null, delay: number = 10) {
		let id = "system-message#" + ++this.id;

		angular
			.element(document.getElementsByTagName('staminity-application'))
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

	systemError(code: string, context?: {}, delay?: number) {
		this.system(code,'error',context,delay);
	}

	systemWarning(code: string, context?: {}, delay?: number) {
		this.system(code,'warning',context,delay);
	}

	systemSuccess(code: string, context?: {}, delay?: number) {
		this.system(code,'success',context,delay);
	}

	/**
	 * @ngdoc method
	 * @name toast
	 * @description Вывод System message
	 * @param {string} code Код обьекта перевода из файла /core/message.translate.ts
	 * @param {Object} context Набор переменных для вывода шаблона сообщения
	 * @param {string} status Статус сообщения, может принимать значения `error`,`success`,`warning`
	 * @delay {number} delay Задержка в с показа сообщения на экране
	 */
	toast(code: string, status: string = 'error', context: {} = null, delay: number = 10) {
		this.$mdToast.show({
			hideDelay: delay * 1000,
			position: 'bottom left',
			bindToController: true,
			controllerAs: '$ctrl',
			controller: ToastCtrl,
			locals: {
				code: code,
				context: context
			},
			toastClass: status,
			template: this.toastTemplate
		});
	}

	toastError(code: string, context?: {}, delay?: number) {
		this.toast(code,'md-warn',context,delay);
	}

	toastWarning(code: string, context?: {}, delay?: number) {
		this.toast(code,'md-accent',context,delay);
	}

	toastInfo(code: string, context?: {}, delay?: number) {
		this.toast(code,'md-primary',context,delay);
	}

}

function ToastCtrl($scope, $mdToast) {

	$scope.hide = function() {
		$mdToast.hide();
	};
}

ToastCtrl.$inject = ['$scope','$mdToast'];


export function configure ($translateProvider) {
	$translateProvider.translations('ru', _translateMessage['ru']);
	$translateProvider.translations('en', _translateMessage['en']);
}

configure.$inject = ['$translateProvider'];