import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './dashboard.translate';
import { DisplayView } from "../core/display.constants";
import UserService from "../core/user.service";
import MessageService from "../core/message.service";

function configure(
    $stateProvider:StateProvider,
    $translateProvider: any,
    $authProvider: any) {

    $authProvider.httpInterceptor = function() { return true; };
    $authProvider.withCredentials = false;
    $authProvider.tokenRoot = null;
    $authProvider.baseUrl = '/oauth/callback/';
    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.unlinkUrl = '/unlink/';
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = 'staminty';
    $authProvider.tokenHeader = 'Authorization';
    $authProvider.tokenType = 'Bearer';
    $authProvider.storageType = 'localStorage';

    // Facebook
    $authProvider.facebook({
        clientId: '660665060767427'
    });


     //Generic OAuth 2.0
    $authProvider.oauth2({
        name: 'strava',
        url: 'auth/strava',
        clientId: 15712,
        redirectUri: 'http://localhost:8080/',
        authorizationEndpoint: 'https://www.strava.com/oauth/authorize',
        defaultUrlParams: ['client_id','response_type', 'redirect_uri'],
        //requiredUrlParams: ['response_type','client_id'],
        optionalUrlParams: ['approval_prompt','scope','state','token'],
        approvalPrompt: 'force',
        scope: 'write',
        token: '',
        //scopePrefix: null,
        //scopeDelimiter: null,
        state: 'mystate',
        oauthType: '2.0',
        /*popupOptions: null,*/
        responseType: 'code',
        responseParams: {
            code: 'code',
            clientId: 'clientId',
            redirectUri: 'redirectUri'
        }
    });
    /*$authProvider.facebook({
     name: 'facebook',
     url: '/auth/facebook',
     authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
     redirectUri: window.location.origin + '/',
     requiredUrlParams: ['display', 'scope'],
     appId: '660665060767427',
     scope: ['email'],
     scopeDelimiter: ',',
     display: 'popup',
     oauthType: '2.0',
     popupOptions: { width: 580, height: 400 }
     });*/

    $stateProvider
        .state('dashboard', <StateDeclaration>{
            url: "/dashboard",
            //loginRequired: true,
            //authRequired: ['func1'],
            //view: _display_view['settings'],
            resolve: {
                /*view: function (ViewService) {
                 return ViewService.getParams('settings')
                 },*/
                view: () => {return new DisplayView('dashboard');},
                user: ['UserService', 'SystemMessageService', '$stateParams',
                    function (UserService:UserService, SystemServiceMessage, $stateParams) {
                        return UserService.getProfile($stateParams.uri)
                            .catch((error)=> {
                                SystemServiceMessage.show(error,'warning');
                                // TODO перейти на страницу 404
                                throw error;
                            });
                    }]
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
                    component: "dashboard",
                    bindings: {
                        view: 'view.application',
                        user: 'user'
                    }
                }
            }
        });

    // Текст представлений
    $translateProvider.translations('en', {"dashboard": _translate['en']});
    $translateProvider.translations('ru', {"dashboard": _translate['ru']});

}

configure.$inject = ['$stateProvider','$translateProvider','$authProvider'];

export default configure;