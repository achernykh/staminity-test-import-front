import './dashboard-day.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IDashboardDay, DashboardCtrl} from "../dashboard.component";
import {IUserProfile} from "../../../../api/user/user.interface";

class DashboardDayCtrl implements IComponentController {

    public day: IDashboardDay;
    public athlete: IUserProfile;
    public onEvent: (response: Object) => IPromise<void>;
    private dashboard: DashboardCtrl;

    static $inject = ['$mdDialog','message'];

    constructor(private $mdDialog: any, private message: any) {

    }

    $onInit() {

    }

    postItem($event, date) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template:
                `<md-dialog id="post-activity" aria-label="Activity">
                        <calendar-item-activity
                                layout="row" class="calendar-item-activity"
                                date="$ctrl.date"
                                mode="'post'"
                                user="$ctrl.user" popup="true"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                date: new Date(date), // дата дня в формате ГГГГ-ММ-ДД
                user: this.athlete
            },
            //resolve: {
            //    details: () => this.ActivityService.getDetails(data.activityHeader.activityId)
            //        .then(response => response, error => console.error(error))
            //},
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true
        })
            .then(response => {
                if(response.type === 'post') {
                    console.log('save activity', response);
                    this.dashboard.onPostItem(response.item);
                    this.message.toastInfo('Создана новая запись');
                }
            }, ()=> {
                console.log('user cancel dialog');
            });
    }
}

const DashboardDayComponent:IComponentOptions = {
    bindings: {
        day: '<',
        athlete: '<',
        onEvent: '&'
    },
    require: {
        dashboard: '^dashboard'
    },
    controller: DashboardDayCtrl,
    template: require('./dashboard-day.component.html') as string
};

export default DashboardDayComponent;

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