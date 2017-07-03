import './dashboard-event.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {ICalendarItem} from "../../../../api/calendar/calendar.interface";
import MessageService from "../../core/message.service";
import {DashboardCtrl} from "../dashboard.component";
import {IUserProfile} from "../../../../api/user/user.interface";

class DashboardEventCtrl implements IComponentController {

    public event:ICalendarItem;
    public athlete:IUserProfile;

    private dashboard: DashboardCtrl;
    public onEvent:(response:Object) => IPromise<void>;
    static $inject = ['$mdDialog', 'message'];

    constructor(private $mdDialog:any, private message:MessageService) {

    }

    $onInit() {

    }

    onOpen($event, mode:string) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template: `<md-dialog id="events" aria-label="Events">
                        <calendar-item-events 
                                flex layout="column" class="calendar-item-events"
                                data="$ctrl.data"
                                mode="put"
                                user="$ctrl.user"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-events>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: this.event,
                user: this.athlete
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true

        }).then(() => {}, ()=> {});
    }
}

const DashboardEventComponent:IComponentOptions = {
    bindings: {
        event: '<',
        athlete: '<',
        selected: '<',
        onEvent: '&'
    },
    require: {
        dashboard: '^dashboard'
    },
    controller: DashboardEventCtrl,
    template: require('./dashboard-event.component.html') as string
};

export default DashboardEventComponent;

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        console.log('cancel');
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}
DialogController.$inject = ['$scope','$mdDialog'];