import { IComponentOptions, IComponentController} from 'angular';
import SessionService from "../../js/services/session/session.service";
import {StateService, LocationServices} from 'angular-ui-router';
require('./auth.component.scss');

class AuthCtrl implements IComponentController {

	private enabled: boolean = true;
	private showConfirm: boolean = false;
	private credentials: Object = null;

	static $inject = ['AuthService','SessionService','$state','SystemMessageService','$location','ActionMessageService'];

	constructor(
		private AuthService: any,
		private SessionService: SessionService,
		private $state: StateService,
		private SystemMessageService: any,
		private $location: LocationServices,
		private ActionMessageService: any) {
	}

	$onInit() {

		if(this.$state.$current.name === 'signout') {
			this.SessionService.delToken();
			this.$state.go('signin');
		}

		if(this.$state.$current.name === 'confirm') {
			if(this.$location.search.hasOwnProperty('request')) {
				this.AuthService.confirm({request: this.$location.search['request']})
					.then((success) => {
						console.log('confirm success=', success);
						this.SystemMessageService.show(success.title, success.status, success.delay);
						this.$state.go('signin');
					}, (error) => {
						this.SystemMessageService.show(error);
						this.$state.go('signup');
					});
			} else {
				this.$state.go('signup');
			}

		}

		// Типовая структура для создания нового пользователя
		this.credentials = {
			public: {
				firstName: '',
				lastName: '',
				avatar: 'default.jpg',
				background: 'default.jpg'
			},
			email: '',
			password: '',
			personal: {
				role: false
			}
		};
		console.log('AuthCtrl: $onInit()', this);
	}

	/**
	 * Вход пользователя
	 * @param credentials
	 */
	signin(credentials) {
		this.enabled = false; // форма ввода недоступна до получения ответа
		this.AuthService.signIn(credentials)
			.finally(()=>this.enabled = true)
			.then((result) => {
				// goto state calendar
				this.SessionService.setToken(result);
				this.$state.go('calendar');
				console.log('signin success=', result);
			}, (error) => {
				// show system message
				console.log('signin error=', error);
				//this.SystemMessageService.show(error);
				this.ActionMessageService.simple(error);
			});
	}

	/**
	 * Регистрация/создание нового пользователя
	 * @param credentials
	 */
	signup(credentials) {
		this.enabled = false; // форма ввода недоступна до получения ответа
		this.AuthService.signUp(credentials)
			.finally(()=>this.enabled = true)
			.then((success) => {
				console.log('signup success=', success);
				this.showConfirm = true;
				this.SystemMessageService.show(success.title, success.status, success.delay);
			}, (error) => {
				console.log('signup error=', error);
				this.SystemMessageService.show(error);
			});
	}

}

const AuthComponent: IComponentOptions = {
	bindings: {
		view: '<'
	},
	controller: AuthCtrl,
	template: require('./auth.component.html') as string
};

export default AuthComponent;