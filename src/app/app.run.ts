import { TransitionService, StateDeclaration, StateService } from '@uirouter/angular';
import { UrlService} from '@uirouter/core';

import { LoaderService } from "./share/loader/loader.service";
import { IAuthService } from "./auth/auth.service";
import MessageService from "./core/message.service";
import { path } from '../app4/share/utilities';

interface IStaminityState extends StateDeclaration {
	loginRequired: boolean;
	authRequired: Array<any>;
}

function run(
	$transitions: TransitionService,
	$state: StateService,
	$translate,
	$mdToast,
	LoaderService: LoaderService,
	AuthService: IAuthService,
	message: MessageService,
	DisplayService: any, // not used, just force DisplayService being initialized
	$urlService: UrlService
) {
	//window.navigator['standalone'] = true;

	// Using AngularJS config block, call `deferIntercept()`.
	// This tells UI-Router to delay the initial URL sync (until all bootstrapping is complete)
	$urlService.deferIntercept();

	let workerController = path(['serviceWorker', 'controller']) (navigator);

	if (workerController) {
		let checkWorkerState = () => {
			console.log('checkWorkerState', workerController);
			if (workerController.state === 'redundant') {
				let toast = $mdToast.simple({ hideDelay: 0 })
					.textContent($translate.instant('updateToast.message'))
					.action($translate.instant('updateToast.action'))
					.highlightAction(true)
					.highlightClass('md-accent');

				$mdToast.show(toast)
					.then((response) => {
						if (response === 'ok') {
							window.location.reload();
						}
					});
			}
		};

		checkWorkerState();
		workerController.onstatechange = checkWorkerState;
	}
	
	$transitions.onBefore({to: '*', from: '*'}, (state) => {
		let routeTo:IStaminityState = Object.assign(state.$to());
		
		if(routeTo.loginRequired && !AuthService.isAuthenticated()) {
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

run.$inject = ['$transitions','$state','$translate','$mdToast','LoaderService','AuthService','message','DisplayService',
 '$urlService'];

export default run;