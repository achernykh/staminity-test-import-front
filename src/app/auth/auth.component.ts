import { IComponentOptions, IComponentController,ILocationService} from 'angular';
import SessionService from "../core/session.service";
import {StateService} from 'angular-ui-router';
import {IMessageService} from "../core/message.service";
import {IUserProfile} from "../../../api/user/user.interface";
require('./auth.component.scss');

class AuthCtrl implements IComponentController {

	private enabled: boolean = true;
	private showConfirm: boolean = false;
	private credentials: Object = null;
	private passwordStrength: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

	static $inject = ['AuthService','SessionService','$state','$location', 'message'];

	constructor(
		private AuthService: any,
		private SessionService: SessionService,
		private $state: StateService,
		private $location: ILocationService,
		private message: IMessageService) {
	}

	$onInit() {
		/**
		 * Переход в компонент по ссылке /signout
		 * Сбрасываем данные в localStorage и переходим на экран входа пользователя
         */
		if(this.$state.$current.name === 'signout') {
			this.AuthService.signOut();
			this.$state.go('signin');
		}
		/**
		 * Переход в компонент по ссылке /confirm?request={request}
		 * В AuthService отправляем POST - подтверждение, что пользователь активировал свою учетную запись
		 */
		if(this.$state.$current.name === 'confirm') {
			if(this.$location['$$search'].hasOwnProperty('request')) {
				this.AuthService.confirm({request: this.$location['$$search']['request']})
					.then((message) => {
						this.message.systemSuccess(message.title);
						this.$state.go('signin');
					}, (error) => {
						this.message.systemWarning(error);
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
			display: {
				units: 'metric',
				firstDayOfWeek: 1,
				timezone: 'Europe/Moscow',
				language: 'ru'
			},
			email: '',
			password: '',
			activateCoachTrial: false,
			activatePremiumTrial: true
		};
	}

	/**
	 * Вход пользователя
	 * @param credentials
	 */
	signin(credentials) {
		this.enabled = false; // форма ввода недоступна до получения ответа
		this.AuthService.signIn({email: credentials.email, password: credentials.password})
			.finally(()=>this.enabled = true)
			.then((profile:IUserProfile) => this.$state.go('calendar',{uri: profile.public.uri}),
				error => this.message.systemError(error));
	}

	/**
	 * Регистрация/создание нового пользователя
	 * @param credentials
	 */
	signup(credentials) {
		this.enabled = false; // форма ввода недоступна до получения ответа
		this.AuthService.signUp(credentials)
			.finally(()=>this.enabled = true)
			.then(message => {
				this.showConfirm = true;
				this.message.systemSuccess(message.title);
			}, error => this.message.systemWarning(error));
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