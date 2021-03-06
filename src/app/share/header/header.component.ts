import * as angular from "angular";
import {IComponentController, IComponentOptions, IPromise} from "angular";
import {LocationServices, StateService} from "@uirouter/angularjs";
import { Observable } from "rxjs/Observable";
import {Subject} from "rxjs/Rx";
import {IGroupMembershipRequest, INotification, IUserProfile, Notification} from "../../../../api";
import { getUser, SessionService, SocketService } from "../../core";
import CommentService from "../../core/comment.service";
import {ChatSession} from "../../core/comment.service";
import DisplayService from "../../core/display.service";
import RequestsService from "../../core/requests.service";
import UserService from "../../core/user.service";
import NotificationService from "../notification/notification.service";
import "./header.component.scss";

class HeaderCtrl implements IComponentController {
    requestsList: IGroupMembershipRequest[] = [];
    private notificationsList: Notification[] = [];
    private user: IUserProfile;
    private athlete: IUserProfile;
    private profile$: Observable<IUserProfile>;
    private internet$: Observable<boolean>;
    private readonly routeUri: string = ".uri"; //константа для формирования пути в роутере для атлета
    private readonly athleteSelectorStates: string[] = ["calendar", "calendar-my", "settings/user"];
    private openChat: ChatSession;
    private internetStatus: boolean = true;
    private destroy: Subject<any> = new Subject();

    static $inject = ["$scope", "$mdSidenav", "AuthService", "SessionService", "RequestsService", "NotificationService",
        "CommentService", "$mdDialog", '$mdMedia', "$state", "toaster", "DisplayService", "SocketService"];

    constructor(
        private $scope,
        private $mdSidenav: any,
        private AuthService: any,
        private SessionService: SessionService,
        private RequestsService: RequestsService,
        private NotificationService: NotificationService,
        private comment: CommentService,
        private $mdDialog: any,
        private $mdMedia: any,
        private $state: StateService,
        private toaster: any,
        private display: DisplayService,
        private socket: SocketService,
    ) {
        SessionService.getObservable()
        .takeUntil(this.destroy)
        .map(getUser)
        .subscribe((userProfile) => this.user = angular.copy(userProfile));

        this.socket.connections
        .takeUntil(this.destroy)
        .subscribe((status) => this.internetStatus = !!status);

        this.comment.openChat$
        .takeUntil(this.destroy)
        .subscribe((chat) => this.openChat = chat);
    }

    $onInit() {
        this.notificationsList = this.NotificationService.notifications;

        this.NotificationService.notificationsChanges
        .takeUntil(this.destroy)
        .subscribe((notifications) => {
            this.notificationsList = notifications;
            this.$scope.$applyAsync();
        });

        this.requestsList = this.RequestsService.requests;

        this.RequestsService.requestsChanges
        .takeUntil(this.destroy)
        .subscribe((requests) => {
            this.requestsList = requests;
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
        const userId = this.user.userId;
        return this.requestsList.filter((request) => request.receiver.userId === userId && !request.updated).length;
    }

    onBack() {
        window.history.back();
    }

    historyLength(): number {
        return window.history.length;
    }

    onMenu($mdOpenMenu, ev) {
        const originatorEv = ev;
        $mdOpenMenu(ev);
    }

    toggleSlide(component) {
        this.$mdSidenav(component).toggle().then(() => angular.noop);
    }

    showAthleteSelector($event) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: "$ctrl",
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
            fullscreen: true,
        })
            .then((response) => this.setAthlete(response),
                console.log("cancel athlete selector"));
    }

    setAthlete(response: {user: IUserProfile}) {
        //this.athlete = response.user;
        console.log("setAthlete", this.$state.current.name, `${this.$state.current.name}${this.routeUri}`);
        // костыли ((
        this.$state.go(this.$state.current.name === "calendar-my" ? "calendar" : this.$state.current.name , {uri: response.user.public.uri});
    }

    isEnableAthleteSelector() {
        return (this.athleteSelectorStates.indexOf(this.$state.current.name) !== -1) && this.AuthService.isCoach();
    }
}

const HeaderComponent: IComponentOptions = {
    bindings: {
        leftPanel: "<",
        rightPanel: "<",
        view: "<",
        athlete: "<",
    },
    transclude: false,
    controller: HeaderCtrl,
    template: require("./header.component.html") as string,
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
DialogController.$inject = ["$scope", "$mdDialog"];
