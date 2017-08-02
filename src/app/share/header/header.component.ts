import * as angular from 'angular';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {Subject} from "rxjs/Rx";
import {INotification, Notification} from "../../../../api/notification/notification.interface";
import {IGroupMembershipRequest} from '../../../../api/group/group.interface';
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
	public requestsList: IGroupMembershipRequest[] = [];
	private notificationsList: Array<Notification> = [];
	private user: IUserProfile;
	private athlete: IUserProfile;
	private profile$: Observable<IUserProfile>;
	private internet$: Observable<boolean>;
	private readonly routeUri: string = '.uri'; //константа для формирования пути в роутере для атлета
	private readonly athleteSelectorStates: Array<string> = ['calendar','settings/user'];
	private openChat: ChatSession;
	private internetStatus: boolean = true;
	private destroy: Subject<any> = new Subject();

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
	}

	$onInit() {
		this.NotificationService.get(100, 0)
		.then((notifications) => { this.notificationsList = notifications; });
		
		this.NotificationService.notification$
		.takeUntil(this.destroy)
		.subscribe((notification) => {
			this.notificationsList = this.NotificationService.process(this.notificationsList, notification);
			this.$scope.$applyAsync();
		});
		
		this.RequestsService.getMembershipRequest(0, 100)
		.then((requests) => { this.requestsList = requests; });

		this.RequestsService.notifications
		.takeUntil(this.destroy)
		.subscribe((request) => {
			this.requestsList = this.RequestsService.requestsReducer(this.requestsList, request);
			this.$scope.$applyAsync();
		});
	}

	$onDestroy() {
		this.destroy.next(); 
		this.destroy.complete();
	}
	
	get notifications() {
		return this.notificationsList.filter((notification) => !notification.isRead).length;
	}
	
	get requests() {
		let userId = this.user.userId;
		return this.requestsList.filter((request) => request.receiver.userId === userId && !request.updated).length;
	}

	onBack(){
		window.history.back();
	}

	historyLength():number {
		return window.history.length;
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