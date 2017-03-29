import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './settings-user.translate';
import { DisplayView } from "../core/display.constants";
import UserService from "../core/user.service";
import MessageService from "../core/message.service";
import {_connection} from "../core/api.constants";

function configure(
    $stateProvider:StateProvider,
    $translateProvider: any,
    $authProvider: any) {

    $authProvider.httpInterceptor = function() { return true; };
    $authProvider.withCredentials = false;
    $authProvider.tokenRoot = null;
    $authProvider.baseUrl =  'http:/' + _connection.server;//null;//_connection.server + '/oauth/';
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

    // Generic OAuth 2.0
    $authProvider.oauth2({
        name: 'strava',
        url: '/oauth',//'http:/' + _connection.server + '/oauth/',
        clientId: 15712,
        //redirectUri: 'http://0.0.0.0:8080',
        redirectUri: window.location.origin,
        authorizationEndpoint: 'https://www.strava.com/oauth/authorize',
        defaultUrlParams: ['client_id','response_type', 'redirect_uri'],
        //requiredUrlParams: ['response_type','client_id'],
        optionalUrlParams: ['approval_prompt','scope','state'],
        approvalPrompt: 'force',
        scope: 'write',
        //token: '',
        //staminityToken: '0adebb13-c151-617a-dfa0-507caac750fd',
        //startDate: '',
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
        .state('settings/user', <StateDeclaration>{
            url: "/settings/user/:uri",
            loginRequired: true,
            authRequired: ['func1'],
            //view: _display_view['settings'],
            resolve: {
                /*view: function (ViewService) {
                    return ViewService.getParams('settings')
                },*/
                view: () => {return new DisplayView('settings');},
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
                    component: "settingsUser",
                    bindings: {
                        view: 'view.application',
                        user: 'user'
                    }
                }
            }
        });

    // Текст представлений
    $translateProvider.translations('en', {"settings": _translate['en']});
    $translateProvider.translations('ru', {"settings": _translate['ru']});

}

configure.$inject = ['$stateProvider','$translateProvider','$authProvider'];

export default configure;