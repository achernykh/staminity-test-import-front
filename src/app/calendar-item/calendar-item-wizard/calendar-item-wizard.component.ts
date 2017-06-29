import './calendar-item-wizard.component.scss';
import {IComponentOptions, IComponentController, IPromise, element} from 'angular';
import {IActivityType} from "../../../../api/activity/activity.interface";
import {activityTypes} from "../../activity/activity.constants";
import {IUserProfile} from "../../../../api/user/user.interface";

class CalendarItemWizardCtrl implements IComponentController {

    public user: IUserProfile;
    public date: string;
    public event: any;

    public onSelect: (result: {itemType: string, activityType: IActivityType}) => IPromise<void>;
    public onCancel: (response: Object) => IPromise<void>;

    private activityTypes: Array<IActivityType> = activityTypes.filter(t=>t.enabled);

    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

export class CalendarItemWizardSelectCtrl implements IComponentController {

    public user: IUserProfile;
    public date: string;
    public event: any;

    static $inject = ['$scope','$mdDialog'];

    constructor(private $scope, private $mdDialog){
        $scope.hide = () => $mdDialog.hide();
        $scope.cancel = () => $mdDialog.cancel();
    }

    answer(itemType, activityType) {
        this.$mdDialog.hide(itemType);

        this.$mdDialog.show({
            controller: DialogCtrl,
            controllerAs: '$ctrl',
            template:
                `<md-dialog id="post-activity" aria-label="Activity">
                        <calendar-item-activity
                                layout="row" class="calendar-item-activity"
                                date="$ctrl.date"
                                activity-type="$ctrl.activityType"
                                mode="'post'"
                                user="$ctrl.user"
                                popup="true"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
                   </md-dialog>`,
            parent: element(document.body),
            targetEvent: this.event,
            locals: {
                date: new Date(this.date), // дата дня в формате ГГГГ-ММ-ДД
                user: this.user,
                activityType: activityType
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true
        })
            .then(response => {
                debugger;
                if(response.type === 'post') {
                    console.log('save activity', response);
                    //this.dashboard.onPostItem(response.item);
                    //this.message.toastInfo('Создана новая запись');
                }
            }, ()=> {
                console.log('user cancel dialog');
                debugger;
            });


    }
}

const CalendarItemWizardComponent:IComponentOptions = {
    bindings: {
        user: '<',
        date: '<',
        event: '<',
        onCancel: '&',
        onSelect: '&'
    },
    require: {
        //component: '^component'
    },
    controller: CalendarItemWizardCtrl,
    template: require('./calendar-item-wizard.component.html') as string
};

export default CalendarItemWizardComponent;

class DialogCtrl implements IComponentController {

    static $inject = ['$scope','$mdDialog'];

    constructor(private $scope, private $mdDialog){
        $scope.hide = () => $mdDialog.hide();
        $scope.cancel = () => $mdDialog.cancel();
        $scope.answer = (answer) => $mdDialog.hide(answer);
    }
}

