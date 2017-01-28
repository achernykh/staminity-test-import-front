import { TransitionService } from 'angular-ui-router';
import SessionService from "./core/session.service";
import LoaderService from "./share/loader/loader.service";


function run($transitions: TransitionService, LoaderService: LoaderService) {
	console.log('run application');

	$transitions.onBefore({to: '*', from: '*'}, state => LoaderService.show());
	$transitions.onSuccess({to:'*',from:'*'}, state => LoaderService.hide());

}

run.$inject = ['$transitions','LoaderService'];

export default run;