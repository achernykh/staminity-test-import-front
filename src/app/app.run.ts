import { TransitionService, State } from 'angular-ui-router';
import LoaderService from "./share/loader/loader.service";
import {IAuthService} from "./auth/auth.service";
import MessageService from "./core/message.service";

interface IStaminityState extends State {
    loginRequired: boolean;
    authRequired: Array<any>;
}

function run($transitions: TransitionService, LoaderService: LoaderService, AuthService: IAuthService, message: MessageService) {

    //window.navigator['standalone'] = true;

    $transitions.onBefore({to: '*', from: '*'}, (state) => {

        let routeTo:IStaminityState = <IStaminityState>state.$to();

        if(routeTo.loginRequired && !AuthService.isAuthenticated()) {
            message.systemWarning('forbiddenAction');
            return false;
        }

        if(!!routeTo.authRequired && !AuthService.isAuthorized(routeTo.authRequired)) {
            //message.systemWarning('forbiddenAction');
            return true; // TODO после настройки state в предсталвениях поменять на false
        }
        LoaderService.show();
	});
	$transitions.onSuccess({to:'*',from:'*'}, state => LoaderService.hide());

}

run.$inject = ['$transitions','LoaderService','AuthService','message'];

export default run;