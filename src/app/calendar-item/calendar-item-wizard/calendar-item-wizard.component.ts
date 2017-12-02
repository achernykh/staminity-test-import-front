import {element, IComponentController, IComponentOptions, IPromise} from "angular";
import {IActivityType} from "../../../../api/activity/activity.interface";
import {IUserProfile} from "../../../../api/user/user.interface";
import {activityTypes} from "../../activity/activity.constants";
import "./calendar-item-wizard.component.scss";

class CalendarItemWizardCtrl implements IComponentController {

    public user: IUserProfile;
    public data: any;
    public event: any;

    public onSelect: (result: {itemType: string, activityType: IActivityType}) => IPromise<void>;
    public onCancel: (response: Object) => IPromise<void>;

    private activityTypes: IActivityType[] = activityTypes.filter((t) => t.enabled && t.isBasic);

    public static $inject = [];

    constructor() {

    }

    public $onInit() {

    }
}

export class CalendarItemWizardSelectCtrl implements IComponentController {

    public user: IUserProfile;
    public date: Date;
    public event: any;

    public static $inject = ["$scope", "$mdDialog"];

    constructor(private $scope, private $mdDialog) {
        $scope.hide = () => $mdDialog.hide();
        $scope.cancel = () => $mdDialog.cancel();
    }

    public answer(itemType, activityType) {
        this.$mdDialog.hide(itemType);

        switch (itemType) {
            case "activity": {
                this.postActivity(activityType);
                break;
            }
            case "measurement": {
                this.postMeasurement();
                break;
            }
            case "event": {
                this.postEvent();
                break;
            }
        }
    }

    public postActivity(activityType: IActivityType) {
        this.$mdDialog.show({
            controller: DialogCtrl,
            controllerAs: "$ctrl",
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
                date: this.date, // дата дня в формате ГГГГ-ММ-ДД
                user: this.user,
                activityType,
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true,
        })
            .then((response) => {
                if (response.type === "post") {
                    console.log("save activity", response);
                    //this.dashboard.onPostItem(response.item);
                    //this.message.toastInfo('Создана новая запись');
                }
            }, () => {
                console.log("user cancel dialog");
            });
    }

    public postMeasurement() {
        this.$mdDialog.show({
            controller: DialogCtrl,
            controllerAs: "$ctrl",
            template: `<calendar-item-measurement
                            class="calendar-item-measurement"
                            data="$ctrl.data"
                            mode="post"
                            user="$ctrl.user"
                            on-cancel="cancel()" on-answer="answer(response)">
                      </calendar-item-measurement>`,
            parent: angular.element(document.body),
            targetEvent: this.event,
            locals: {
                data: {
                    date: this.date, // дата дня в формате ГГГГ-ММ-ДД,
                },
                user: this.user,
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true,
        }).then(() => {}, () => {});
    }

    public postEvent() {
        this.$mdDialog.show({
            controller: DialogCtrl,
            controllerAs: "$ctrl",
            template: `<md-dialog id="events" aria-label="Events">
                        <calendar-item-events
                                flex layout="column" class="calendar-item-events"
                                data="$ctrl.data"
                                mode="post"
                                user="$ctrl.user"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-events>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: this.event,
            locals: {
                data: {
                    date: this.date, // дата дня в формате ГГГГ-ММ-ДД,
                },
                user: this.user,
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true,

        }).then(() => {}, () => {});
    }

}

const CalendarItemWizardComponent: IComponentOptions = {
    bindings: {
        user: "<",
        date: "<",
        event: "<",
        onCancel: "&",
        onSelect: "&",
    },
    require: {
        //component: '^component'
    },
    controller: CalendarItemWizardCtrl,
    template: require("./calendar-item-wizard.component.html") as string,
};

export default CalendarItemWizardComponent;

class DialogCtrl implements IComponentController {

    public static $inject = ["$scope", "$mdDialog"];

    constructor(private $scope, private $mdDialog) {
        $scope.hide = () => $mdDialog.hide();
        $scope.cancel = () => $mdDialog.cancel();
        $scope.answer = (answer) => $mdDialog.hide(answer);
    }
}
