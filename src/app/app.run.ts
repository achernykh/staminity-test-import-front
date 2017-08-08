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
	LoaderService: LoaderService,
	AuthService: IAuthService,
	message: MessageService
) {
	//window.navigator['standalone'] = true;
	
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
	
	$transitions.onSuccess({ to:'*',from:'*' }, state => LoaderService.hide());
	
	$state.defaultErrorHandler((error) => {
		console.error(error);
		//message.systemWarning(error.detail);
	});
}

run.$inject = ['$transitions','$state','LoaderService','AuthService','message'];

export default run;