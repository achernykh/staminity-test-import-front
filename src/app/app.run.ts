import { TransitionService, StateDeclaration, StateService } from 'angular-ui-router';
import LoaderService from "./share/loader/loader.service";
import {IAuthService} from "./auth/auth.service";
import MessageService from "./core/message.service";

interface IStaminityState extends StateDeclaration {
    loginRequired: boolean;
    authRequired: Array<any>;
}

function run(
    $transitions: TransitionService,
    $state: StateService,
    $trace: any,
    LoaderService: LoaderService,
    AuthService: IAuthService,
    message: MessageService) {

    //window.navigator['standalone'] = true;

    $trace.enable('TRANSITION'); //https://github.com/angular-ui/ui-router/issues/2977

    $transitions.onBefore({to: '*', from: '*'}, (state) => {

        let routeTo:IStaminityState = Object.assign(state.$to());

        if(routeTo.loginRequired && !AuthService.isAuthenticated()) {
            debugger;
            message.systemWarning('forbidden_InsufficientAction');
            return $state.target('signin', {nextState: routeTo.name, nextParams: state.params()});
            //return false;
        }

        if(!!routeTo.authRequired && !AuthService.isAuthorized(routeTo.authRequired)) {
            //message.systemWarning('forbiddenAction');
            return true; // TODO после настройки state в предсталвениях поменять на false
        }
        LoaderService.show();
	});
	$transitions.onSuccess({to:'*',from:'*'}, state => LoaderService.hide());

}

run.$inject = ['$transitions','$state', '$trace', 'LoaderService','AuthService','message'];

export default run;