import { IComponentOptions, IComponentController,ILocationService,IHttpPromiseCallbackArg} from 'angular';
import SessionService from "../core/session.service-ajs";
import {StateService} from '@uirouter/angular';
import {IMessageService} from "../core/message.service";
import {IUserProfile} from "../../../api/user/user.interface";
require('./auth.component.scss');

class AuthCtrl implements IComponentController {

	private enabled: boolean = true;
	private showConfirm: boolean = false;
	private credentials: Object = null;
	private passwordStrength: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

	static $inject = ['AuthService','SessionService','$state', '$stateParams', '$location', 'message', '$auth'];

	constructor(
		private AuthService: any,
		private SessionService: SessionService,
		private $state: StateService,
		private $stateParams: any,
		private $location: ILocationService,
		private message: IMessageService, private $auth: any) {
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
			email: this.$stateParams.hasOwnProperty('email') && this.$stateParams.email || '',
			password: '',
			activatePremiumTrial: this.$stateParams.hasOwnProperty('activatePremiumTrial') && this.$stateParams.activatePremiumTrial || true,
			activateCoachTrial: this.$stateParams.hasOwnProperty('activateCoachTrial') && this.$stateParams.activateCoachTrial || false,
			activateClubTrial: this.$stateParams.hasOwnProperty('activateClubTrial') && this.$stateParams.activateClubTrial || false,
		};
	}

	/**
	 * Вход пользователя
	 * @param credentials
	 */
	signin(credentials) {
		this.enabled = false; // форма ввода недоступна до получения ответа
		this.AuthService.signIn({email: credentials.email, password: credentials.password})
			.then((profile: IUserProfile) => this.redirect('calendar', {uri: profile.public.uri}),
				(error) => this.message.systemError(error))
			.then(() => this.enabled = true);
	}

	/**
	 * Регистрация/создание нового пользователя
	 * @param credentials
	 */
	signup(credentials) {
		this.enabled = false; // форма ввода недоступна до получения ответа
		this.AuthService.signUp(credentials)
			.then((message) => {
				this.showConfirm = true;
				this.message.systemSuccess(message.title);
			}, (error) => {
				this.message.systemWarning(error);
			}).then(() => this.enabled = true);
	}

	/**
	 * Сброс пароля
	 * @param credentials
     */
	reset(credentials) {
		this.enabled = false; // форма ввода недоступна до получения ответа
		this.AuthService.resetPassword(credentials.email)
			.then((message) => this.message.systemSuccess(message.title), error => this.message.systemWarning(error))
			.then(() => this.enabled = true);
	}

	/**
	 * Установка пароля
	 * @param credentials
     */
	setpass(credentials){
		this.enabled = false; // форма ввода недоступна до получения ответа
		this.AuthService.setPassword(credentials.password, this.$location['$$search']['request'])
			.then((message) => this.message.systemSuccess(message.title), error => this.message.systemWarning(error))
			.then(() => this.enabled = true)
			.then(() => this.$state.go('signin'));
	}

	/**
	 *
	 */
	putInvite(credentials) {
		this.enabled = false;
		this.AuthService.putInvite(Object.assign(credentials, {token: this.$location['$$search']['request']}))
			.then((sessionData) => {
				this.AuthService.signedIn(sessionData);
				this.redirect('calendar', {uri: sessionData.userProfile.public.uri});
			}, (error) => {
				this.message.systemWarning(error.errorMessage || error);
			}).then(() => this.enabled = true);
	}

	OAuth(provider:string) {
		this.enabled = false; // форма ввода недоступна до получения ответа
		this.$auth.link(provider, {
            internalData: {
                postAsExternalProvider: false,
                provider: provider,
				activateCoachTrial: this.credentials['activateCoachTrial'],
				activatePremiumTrial: true
            }
		})
			.then((response: IHttpPromiseCallbackArg<{data:{userProfile: IUserProfile, systemFunctions: any}}>) => {
				let sessionData = response.data.data;
				this.AuthService.signedIn(sessionData);
				this.redirect('calendar', {uri: sessionData.userProfile.public.uri});
			}, (error) => {
				if (error.hasOwnProperty('stack') && error.stack.indexOf('The popup window was closed') !== -1) {
					this.message.toastInfo('userCancelOAuth');
				} else {
					throw this.message.systemWarning(error.data.errorMessage || error.errorMessage || error);
				}
			})
			.then(() => this.enabled = true);

	}

	redirect(state: string = 'calendar', params: Object):void {
		let redirectState = this.$stateParams.hasOwnProperty('nextState') && this.$stateParams['nextState'] || state;
		let redirectParams = this.$stateParams.hasOwnProperty('nextParams') && this.$stateParams['nextParams'] || params;

		if(redirectState === 'calendar' && redirectParams.hasOwnProperty('#') && redirectParams['#']) {
			redirectParams['#'] = null;
		}
		//  Устанавливаем таймаут на случай выхода/входа пользователя. Без тайм-аута вход без выхода не успевает
		setTimeout(() => this.$state.go(redirectState,redirectParams), 1000);
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