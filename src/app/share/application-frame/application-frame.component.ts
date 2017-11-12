import './application-frame.component.scss';
import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import { SessionService, getUser, SocketService } from "../../core";
import { Subject } from "rxjs/Rx";
import { IUserProfile, IGroupMembershipRequest, Notification } from "../../../../api";
import NotificationService from "../notification/notification.service";
import RequestsService from "../../core/requests.service";
import AuthService from "../../auth/auth.service";

class ApplicationFrameCtrl implements IComponentController {

    // bind
    data: any;
    onEvent: (response: Object) => IPromise<void>;

    // public
    user: IUserProfile;
    connectionStatus: boolean = true;

    //private
    private notificationsList: Array<Notification> = [];
    private requestsList: IGroupMembershipRequest[] = [];


    private destroy: Subject<any> = new Subject();

    static $inject = ['$scope', '$mdSidenav', 'SessionService','SocketService','NotificationService','RequestsService',
        'AuthService'];

    constructor(
        private $scope: IScope,
        private $mdSidenav: any,
        private session: SessionService,
        private socket: SocketService,
        private NotificationService: NotificationService,
        private RequestsService: RequestsService,
        private auth: AuthService) {

        session.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe((userProfile) => this.user = angular.copy(userProfile));

        socket.connections
            .takeUntil(this.destroy)
            .subscribe(status => this.connectionStatus = !!status);

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
        let userId = this.user.userId;
        return this.requestsList.filter((request) => request.receiver.userId === userId && !request.updated).length;
    }

    /**
     * Показать/скрыть панель
     * @param component
     */
    sideNav (component: string): void {
        this.$mdSidenav(component).toggle().then(() => {});
    }
}

const ApplicationFrameComponent:IComponentOptions = {
    transclude: {
        title: '?stApplicationFrameTitle',
        toolbar: '?stApplicationFrameToolbar',
        navbar: '?stApplicationFrameNavbar',
        content: 'stApplicationFrameContent',
        leftBar: '?stApplicationFrameLeftBar',
        rightBar: '?stApplicationFrameRightBar'
    },
    bindings: {
        navBar: '=', // наличие навигационной панели md-nav-bar
        leftBarShow: '<',
        /**
         * Тип скрытия панели - обязательный аттрибут
         * collapsed - сворачиваемая/разворазиваемая панель
         * hidden - скрываемая / показываемая панель
         */
        leftBarHideType: '=',
        rightBarShow: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ApplicationFrameCtrl,
    template: require('./application-frame.component.html') as string
};

export default ApplicationFrameComponent;