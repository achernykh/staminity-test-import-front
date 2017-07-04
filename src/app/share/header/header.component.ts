import * as angular from 'angular';
import { IComponentOptions, IComponentController, IPromise} from 'angular';
import UserService from "../../core/user.service";
import {IUserProfile} from "../../../../api/user/user.interface";
import SessionService from "../../core/session.service";
import RequestsService from "../../core/requests.service";
import { Observable } from 'rxjs/Observable';
import './header.component.scss';
import {StateService, LocationServices} from 'angular-ui-router';
import NotificationService from "../notification/notification.service";
import CommentService from "../../core/comment.service";
import {ChatSession} from "../../core/comment.service";
import DisplayService from "../../core/display.service";
import {ISocketService, SocketService} from "../../core/socket.service";

class HeaderCtrl implements IComponentController {
	public requests: number;
	public notifications: number;
	private user: IUserProfile;
	private athlete: IUserProfile;
	private profile$: Observable<IUserProfile>;
	private internet$: Observable<boolean>;
	private readonly routeUri: string = '.uri'; //константа для формирования пути в роутере для атлета
	private readonly athleteSelectorStates: Array<string> = ['calendar','settings/user'];
	private openChat: ChatSession;
	private internetStatus: boolean = true;

	static $inject = ['$scope', '$mdSidenav', 'AuthService', 'SessionService', 'RequestsService', 'NotificationService',
		'CommentService','$mdDialog', '$state','toaster', 'display', 'SocketService'];

	constructor(
		private $scope,
		private $mdSidenav: any,
		private AuthService: any,
		private SessionService: SessionService,
		private RequestsService: RequestsService,
		private	NotificationService: NotificationService,
		private comment: CommentService,
		private $mdDialog: any,
		private $state: StateService,
		private toaster: any,
		private display: DisplayService,
		private socket: SocketService) {


		this.profile$ = SessionService.profile.subscribe(profile => this.user = angular.copy(profile));
		this.socket.connections.subscribe(status => this.internetStatus = !!status);
		this.comment.openChat$.subscribe(chat => this.openChat = chat);

		if (this.RequestsService.requests) {
			this.requests = this.RequestsService.requests.filter((request) => request.receiver.userId === this.user.userId && !request.updated).length;
		}

		this.RequestsService.requestsList
		.map((requests) => requests.filter((request) => request.receiver.userId === this.user.userId && !request.updated))
		.subscribe((requestsInboxNew) => {
			this.requests = requestsInboxNew.length;
			this.$scope.$apply();
		});
	}

	$onInit() {
		if (this.NotificationService.list) {
			this.notifications = this.NotificationService.list.filter(notification => !notification.isRead).length;
		}

		this.NotificationService.list$
			.map(list => {
				return list.filter(notification => !notification.isRead);
			})
			.subscribe(list => {
				this.notifications = list.length;
				this.$scope.$apply();
			});
	}

	onMenu($mdOpenMenu, ev){
		let originatorEv = ev;
		$mdOpenMenu(ev);
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
		console.log('setAthlete', this.$state.current.name, `${this.$state.current.name}${this.routeUri}`);
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