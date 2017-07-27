import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './auth.translate';
import {_display_view, DisplayView} from "../core/display.constants";
import SessionService from "../core/session.service";

function configure(
	$stateProvider:StateProvider,
	$translateProvider: any) {

	$stateProvider
		.state('signin', <StateDeclaration>{
			url: "/signin",
			loginRequired: false,
			resolve: {
				view: () => new DisplayView('signin'),
			},
			params: {
				nextState: null,
				nextParams: null
			},
			views: {
				"background": {
					component: "staminityBackground",
					bindings: {
						view: 'view.background'
					}
				},
				"header": {
					component: 'staminityHeader',
					bindings: {
						view: 'view.header'
					}
				},
				"application": {
					component: "auth",
					bindings: "view.application"
				},
				"form@signin": {
					template: require('./view/signin.html')
				}
			}
		})
		// Представление Auth: SignUp
		.state('signup', <StateDeclaration>{
			url: "/signup",
			loginRequired: false,
			params: {
				activatePremiumTrial: null,
				activateCoachTrial: null,
				activateClubTrial: null
			},
			resolve: {
				view: () => new DisplayView('signup'),
			},
			views: {
				"background": {
					component: "staminityBackground",
					bindings: {
						view: 'view.background'
					}
				},
				"header": {
					component: 'staminityHeader',
					bindings: {
						view: 'view.header'
					}
				},
				"application": {
					component: "auth",
					bindings: "view.application"
				},
				"form@signup": {
					template: require('./view/signup.html')
				}
			}
		})
		// Представление Auth: SignOut
		.state('signout', <StateDeclaration>{
			url: "/signout",
			loginRequired: true,
			//authRequired: ['func1'],
			/* waite for https://github.com/angular-ui/ui-router/issues/3260
			onEnter: ['$state','SessionService', ($state:StateService, SessionService: SessionService) => {
				SessionService.delToken();
				$state.go('signin');
			}]*/
			views: {
				"application": {
					component: "auth",
					bindings: "view.application"
				}
			}

		})
		// Представление Auth: Confirm
		.state('confirm', <StateDeclaration>{
			url: "/confirm",
			loginRequired: false,
			//authRequired: ['func1']
			/* waite for https://github.com/angular-ui/ui-router/issues/3260
			onEnter: ($state:StateService, $location:Location, SessionService, AuthService, SystemMessageService) => {
				console.log('confirm=', $location.search, $location.search.hasOwnProperty('request'))
				// Если пользователь проше по ссылке в письме
				if ($location.search.hasOwnProperty('request')) {
					AuthService.confirm({request: $location.search['request']})
						.then((success) => {
							console.log('confirm success=', success)
							SystemMessageService.show(success.title, success.status, success.delay)
							$state.go('signin')
						}, (error) => {
							SystemMessageService.show(error)
							$state.go('signup')
						})
				} else {
					//TODO Добавить sysmessage
					$state.go('signup')
				}
			}*/
			views: {
				"application": {
					component: "auth",
					bindings: "view.application"
				},
				"form@signin": {
					template: require('./view/signin.html')
				}
			}

		})
		// Представление Auth: Confirm
        .state('invite', <StateDeclaration>{
			url: "/invite",
			loginRequired: false,
			views: {
				"application": {
					component: "auth",
					bindings: "view.application"
				},
				"form@invite": {
					template: require('./view/invite.html')
				}
			}

		});

	// Текст представлений
	$translateProvider.translations('en', {auth: _translate['en']});
	$translateProvider.translations('ru', {auth: _translate['ru']});

}

configure.$inject = ['$stateProvider','$translateProvider'];

export default configure;