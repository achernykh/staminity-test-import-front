import './dashboard-activity.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {ICalendarItem} from "../../../../api/calendar/calendar.interface";
import {Activity} from "../../activity/activity.datamodel";
import {DashboardCtrl} from "../dashboard.component";
import MessageService from "../../core/message.service";
import {IUserProfile} from "../../../../api/user/user.interface";

class DashboardActivityCtrl implements IComponentController {

    public item: ICalendarItem;
    public selected: boolean;
    private activity: Activity;
    private athlete: IUserProfile;
    private dashboard: DashboardCtrl;

    private isOwner: boolean = false;
    private isCreator: boolean = false;
    private bottomPanelData: any = null;

    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['$mdDialog','message'];

    constructor(private $mdDialog: any, private message: MessageService) {

    }

    $onInit() {
        this.activity = new Activity(this.item);
        //this.activity.prepare();

        this.isOwner = this.activity.userProfileOwner.userId === this.dashboard.coach.userId;
        this.isCreator = this.activity.userProfileCreator.userId === this.dashboard.coach.userId;

        if (this.activity.bottomPanel === 'data') {
            this.bottomPanelData = this.activity.summaryAvg;
        }

    }

    onOpen($event, mode: string) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template:
                `<md-dialog id="activity" aria-label="Activity">
                        <calendar-item-activity
                                layout="row" class="calendar-item-activity"
                                data="$ctrl.data"
                                mode="$ctrl.mode"
                                user="$ctrl.user" popup="true"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: this.activity,
                mode: mode,
                user: this.athlete
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true

        })
            .then(response => {
                console.log('user close dialog with =', response);
                // При изменение записи сначала удаляем старую, потом создаем новую
                /**if(response.type === 'put'){
                    this.dashboard.onDeleteItem(this.activity);
                    this.dashboard.onPostItem(response.item);
                    this.message.toastInfo('Изменения сохранены');
                }

                if(response.type === 'delete') {
                    this.dashboard.onDeleteItem(response.item);
                    this.message.toastInfo('Запись удалена');
                }**/


            }, ()=> {
                console.log('user cancel dialog, data=');
            });
    }

    onDelete() {
        this.dashboard.onDeleteItem(this.item);
    }

}

const DashboardActivityComponent:IComponentOptions = {
    bindings: {
        item: '<',
        athlete: '<',
        selected: '<',
        onEvent: '&'
    },
    require: {
        dashboard: '^dashboard'
    },
    controller: DashboardActivityCtrl,
    template: require('./dashboard-activity.component.html') as string
};

export default DashboardActivityComponent;

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