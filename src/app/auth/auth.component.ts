import { IComponentOptions, IComponentController,ILocationService,IHttpPromiseCallbackArg} from 'angular';
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
		console.log('signin', this.$state, this.$stateParams);
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
			.finally(()=>this.enabled = true)
			.then((profile:IUserProfile) => {
				debugger;
				this.redirect('calendar', {uri: profile.public.uri});
			}, error => this.message.systemError(error));
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

	/**
	 *
	 */
	putInvite() {
		this.enabled = false;
		this.AuthService.putInvite(Object.assign(this.credentials, {token: this.$location['$$search']['request']}))
            .finally(()=>this.enabled = true)
			.then(response => {
				debugger;
				this.AuthService.storeUser({data: response});
				this.redirect('calendar', {uri: response.userProfile.public.uri});
			}, error => this.message.systemWarning(error.errorMessage || error));
	}

	OAuth(provider:string) {
		this.enabled = false; // форма ввода недоступна до получения ответа
		debugger;
		this.$auth.link(provider, {
            internalData: {
                postAsExternalProvider: false,
                provider: provider,
				activateCoachTrial: this.credentials['activateCoachTrial'],
				activatePremiumTrial: true
            }
		})
			.finally(()=>this.enabled = true)
			.then((response: IHttpPromiseCallbackArg<{data:{userProfile: IUserProfile, systemFunctions: any}}>) => {
        		this.AuthService.storeUser(response.data);
        		this.redirect('calendar', {uri: response.data.data.userProfile.public.uri});
				debugger;
		}, error => {
			if (error.hasOwnProperty('stack') && error.stack.indexOf('The popup window was closed') !== -1) {
				this.message.toastInfo('userCancelOAuth');
			} else {
				this.message.systemWarning(error.data.errorMessage || error.errorMessage || error);
			}
		}).catch(response => {
			this.message.systemError(response);
			debugger;
		});
	}

	redirect(state: string = 'calendar', params: Object):void {
		let redirectState = this.$stateParams.hasOwnProperty('nextState') && this.$stateParams['nextState'] || state;
		let redirectParams = this.$stateParams.hasOwnProperty('nextParams') && this.$stateParams['nextParams'] || params;

		if(redirectState === 'calendar' && redirectParams.hasOwnProperty('#') && redirectParams['#']) {
			redirectParams['#'] = null;
		}
		debugger;
		this.$state.go(redirectState,redirectParams);
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