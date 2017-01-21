import { TransitionService } from 'angular-ui-router';
import SessionService from "./core/session.service";
import LoaderService from "./share/loader/loader.service";


function run($transitions: TransitionService, LoaderService: LoaderService) {
	console.log('run application');

	$transitions.onBefore(
		{to: '*', from: '*'},
		(state) => {
			//LoaderService.show();
			console.log('transition before', state.$to());
		}
	);

	$transitions.onRetain(
		{to:'*',from:'*'},
		(state) => {
			//LoaderService.hide();
			console.log('transition retain', state);
		}
	);

	$transitions.onSuccess(
		{to:'*',from:'*'},
		(state) => {
			//LoaderService.hide();
			console.log('transition finish success', state);
		}
	);
	/*$transitions.onStart({
		to: function (state) {
			return !!(state && state.includes["home"]);
		}
	}, (transition) => {
		let options = transition.options();
		return (options && options.custom && options.custom.ignoreAuthentication) || authService.isAuthenticated();
	});*/
}

run.$inject = ['$transitions','LoaderService'];

export default run;