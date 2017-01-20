import { TransitionService } from 'angular-ui-router';
import SessionService from "./core/session.service";


function run($transitions: TransitionService) {
	console.log('run application');

	$transitions.onBefore(
		{to: '*', from: '*'},
		(state) => {
			console.log('transition before', state.$to());
		}
	);

	$transitions.onSuccess(
		{to:'*',from:'*'},
		(state) => {
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

run.$inject = ['$transitions'];

export default run;