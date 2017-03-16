import * as angular from 'angular';
import { IComponentOptions, IComponentController, IPromise} from 'angular';
import UserService from "../../core/user.service";
import {IUserProfile} from "../../../../api/user/user.interface";
import SessionService from "../../core/session.service";
import RequestsService from "../../core/requests.service";
import { Observable } from 'rxjs/Observable';
import './header.component.scss';
import {StateService, LocationServices} from 'angular-ui-router';

class HeaderCtrl implements IComponentController {
	public requests: number;
	private user: IUserProfile;
	private athlete: IUserProfile;
	private profile$: Observable<IUserProfile>;
	private readonly routeUri: string = '.uri'; //константа для формирования пути в роутере для атлета
	private readonly athleteSelectorStates: Array<string> = ['calendar'];

	static $inject = ['$scope', '$mdSidenav', 'AuthService', 'SessionService', 'RequestsService', '$mdDialog', '$state',
	'toaster'];

	constructor(
		private $scope,
		private $mdSidenav: any,
		private AuthService: any,
		private SessionService: SessionService,
		private RequestsService: RequestsService,
		private $mdDialog: any,
		private $state: StateService,
		private toaster: any
	) {
		this.profile$ = SessionService.profile.subscribe(profile=> this.user = angular.copy(profile));

		this.RequestsService.requestsList
		.map((requests) => requests.filter((request) => request.receiver.userId === this.user.userId && !request.updated))
		.subscribe((requestsInboxNew) => {
			console.log('requestsInboxNew', requestsInboxNew);
			this.requests = requestsInboxNew.length;
			this.$scope.$apply();
		});
	}

	showToast(){
		this.toaster.pop({
			timeout: 300000,
			body: JSON.stringify({template: 'notification/notification.html', data: {
				fullName: 'Евгений Хабаров',
				time: new Date(),
				message: 'notificationTestMessage',
				context: {
					data: [5,'Евгений','Хабаров','Сейчас смотрю твой бег! Лучше восприятие будет если график будет занимать меньше места а карта больше']
				}
			}}),
			bodyOutputType: 'templateWithData'
		});
	}

	toggleSlide(component) {
		this.$mdSidenav(component).toggle().then(() => angular.noop);
	}

	showAthleteSelector($event){
		this.$mdDialog.show({
			controller: DialogController,
			controllerAs: '$ctrl',
			template:
				`<md-dialog id="athlete-selector" aria-label="AthleteSelector">
                        <athlete-selector layout="column"
                     						on-cancel="cancel()" on-answer="answer(response)"></athlete-selector>
                   </md-dialog>`,
			parent: angular.element(document.body),
			targetEvent: $event,
			locals: {
				//date: new Date(data.date) // дата дня в формате ГГГГ-ММ-ДД
			},
			//resolve: {
			//    details: () => this.ActivityService.getDetails(data.activityHeader.activityId)
			//        .then(response => response, error => console.error(error))
			//},
			bindToController: true,
			clickOutsideToClose: true,
			escapeToClose: true,
			fullscreen: true
		})
			.then(response => this.setAthlete(response),
				console.log('cancel athlete selector'));
	}

	setAthlete(response: {user: IUserProfile}) {
		//this.athlete = response.user;
		//console.log('setAthlete', this.$state.current.name, `${this.$state.current.name}${this.routeUri}`);
		this.$state.go(this.$state.current.name , {uri: response.user.public.uri});
	}

	isEnableAthleteSelector() {
		return (this.athleteSelectorStates.indexOf(this.$state.current.name) !== -1) && this.AuthService.isCoach();
	}
}

const HeaderComponent: IComponentOptions = {
	bindings: {
		leftPanel: '<',
		rightPanel: '<',
		view: '<',
		athlete: '<'
	},
	transclude: false,
	controller: HeaderCtrl,
	template: require('./header.component.html') as string
};
export default HeaderComponent;

function DialogController($scope, $mdDialog) {
	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		console.log(answer);
		$mdDialog.hide(answer);
	};
}
DialogController.$inject = ['$scope','$mdDialog'];