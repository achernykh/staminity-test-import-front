import './calendar-item-wizard.component.scss';
import {IComponentOptions, IComponentController, IPromise, element} from 'angular';
import {IActivityType} from "../../../../api/activity/activity.interface";
import {activityTypes} from "../../activity/activity.constants";
import {IUserProfile} from "../../../../api/user/user.interface";
import { CalendarItemDialogService } from "@app/calendar-item/calendar-item-dialog.service";
import { ICalendarItem } from "@api/calendar";
import { ICalendarItemDialogOptions } from "@app/calendar-item/calendar-item-dialog.interface";
import { FormMode } from "../../application.interface";
import { ICalendarItemRecordConfig } from "../calendar-item-record/calendar-item-record.config";
import { CompetitionConfig } from "../calendar-item-competition/calendar-item-competition.config";

class CalendarItemWizardCtrl implements IComponentController {

    // bind
    data: ICalendarItem;
    options: ICalendarItemDialogOptions;

    onAnswer: (result: {formMode: FormMode, item: ICalendarItem}) => Promise<void>;
    onCancel: (response: Object) => Promise<void>;

    // private
    private activityTypes: Array<IActivityType> = activityTypes.filter(t=>t.enabled && t.isBasic);
    private competitionConfig: CompetitionConfig = new CompetitionConfig();

    static $inject = ['calendarItemRecordConfig'];

    constructor (private recordConfig: ICalendarItemRecordConfig) {

    }

    $onInit () {

    }

    activity (param: any): void {
        this.onAnswer({
            formMode: FormMode.Post, item: Object.assign(this.data, {
                calendarItemType: 'activity',
                activityHeader: {
                    activityType: param
                }
            })
        });
    }

    record (param: any): void {
        this.onAnswer({
            formMode: FormMode.Post, item: Object.assign(this.data, {
                calendarItemType: 'record',
                recordHeader: {
                    dateStart: this.options.dateStart,
                    type: param
                }
            })
        });
    }

    competition (param: any): void {
        this.onAnswer({
            formMode: FormMode.Post, item: Object.assign(this.data, {
                calendarItemType: 'competition',
                competitionHeader: {
                    type: param
                }
            })
        });
    }

    measurement (): void {
        this.onAnswer({
            formMode: FormMode.Post, item: Object.assign(this.data, {
                calendarItemType: 'measurement'
            })
        });
    }
}

export class CalendarItemWizardSelectCtrl implements IComponentController {

    // bind
    data: ICalendarItem;
    options: ICalendarItemDialogOptions;

    static $inject = ['$scope','$mdDialog','CalendarItemDialogService'];

    constructor(
        private $scope,
        private $mdDialog,
        private calendarItemDialog: CalendarItemDialogService) {
        $scope.hide = () => $mdDialog.hide();
        $scope.answer = (item) => $mdDialog.answer(item);
    }
    /**
    answer(itemType, activityType) {
        this.$mdDialog.hide(itemType);

        switch (itemType) {
            case 'activity': {
                this.postActivity(activityType);
                break;
            }
            case 'measurement': {
                this.postMeasurement();
                break;
            }
            case 'event': {
                this.postEvent();
                break;
            }
        }
    }

    postActivity(activityType: IActivityType){
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
                date: this.date, // дата дня в формате ГГГГ-ММ-ДД
                user: this.user,
                activityType: activityType
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true
        })
            .then(response => {
                if(response.type === 'post') {
                    console.log('save activity', response);
                    //this.dashboard.onPostItem(response.item);
                    //this.message.toastInfo('Создана новая запись');
                }
            }, ()=> {
                console.log('user cancel dialog');
            });
    }

    postMeasurement(){
        this.$mdDialog.show({
            controller: DialogCtrl,
            controllerAs: '$ctrl',
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
                    date: this.date // дата дня в формате ГГГГ-ММ-ДД,
                },
                user: this.user
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true
        }).then(() => {}, ()=> {});
    }

    postEvent(){
        this.$mdDialog.show({
            controller: DialogCtrl,
            controllerAs: '$ctrl',
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
                    date: this.date // дата дня в формате ГГГГ-ММ-ДД,
                },
                user: this.user
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true

        }).then(() => {}, () => {});
    } **/

}

const CalendarItemWizardComponent:IComponentOptions = {
    bindings: {
        data: '<',
        options: '<',
        onCancel: '&',
        onAnswer: '&'
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

