import './dashboard-day.component.scss';
import {IComponentOptions, IComponentController, IPromise, element, copy} from 'angular';
import moment from 'moment/src/moment.js';
import {IDashboardDay, DashboardCtrl} from "../dashboard.component";
import {IUserProfile, IUserProfileShort} from "../../../../api/user/user.interface";
import {ICalendarItem} from "../../../../api/calendar/calendar.interface";
import {CalendarItemWizardSelectCtrl} from "../../calendar-item/calendar-item-wizard/calendar-item-wizard.component";
import {
    isSpecifiedActivity, isCompletedActivity, clearActualDataActivity,
    updateIntensity
} from "../../activity/activity.function";
import {CalendarService} from "../../calendar/calendar.service";
import {profileShort} from "../../core/user.function";


class DashboardDayCtrl implements IComponentController {

    public day: IDashboardDay;
    public athlete: IUserProfile;
    public selected: boolean;
    public onEvent: (response: Object) => IPromise<void>;
    private dashboard: DashboardCtrl;

    static $inject = ['$mdDialog','message','dialogs','CalendarService'];

    constructor(private $mdDialog: any,
                private message: any,
                private dialogs: any,
                private CalendarService: CalendarService) {

    }

    $onInit() {

    }

    onDrop(srcItem: ICalendarItem,
           operation: string,
           srcIndex:number,
           trgDate:string,
           trgIndex: number,
           srcAthlete: IUserProfile) {

        debugger;

        let item:ICalendarItem = copy(srcItem);
        item.dateStart = moment(trgDate).utc().add(moment().utcOffset(), 'minutes').format();//new Date(date);
        item.dateEnd = moment(trgDate).utc().add(moment().utcOffset(), 'minutes').format();//new Date(date);
        if (srcAthlete.userId !== this.athlete.userId) {
            item.userProfileOwner = profileShort(srcAthlete);
            //operation = 'copy';
            this.dialogs.confirm({ text: 'updateIntensity' })
                .then(() => {item = updateIntensity(item, srcAthlete.trainingZones);})
                .then(() => this.onProcess(item, operation, true))
                .then(() => operation === 'move' && this.CalendarService.deleteItem('F',[item.calendarItemId]));
        } else {
            this.onProcess(item, operation);
        }
        return true;
    }

    onProcess(item: ICalendarItem, operation: string, post: boolean = false) {
        switch (operation) {
            case 'move': {
                if (!post && isCompletedActivity(item)) {
                    this.dialogs.confirm({ text: 'moveActualActivity' })
                        .then(() =>this.CalendarService.postItem(clearActualDataActivity(item)))
                        .then(() => this.message.toastInfo('activityCopied'), error => error && this.message.toastError(error));
                } else if(!post) {
                    this.CalendarService.putItem(item)
                        .then(() => this.message.toastInfo('activityMoved'))
                        .catch(error => this.message.toastError(error));
                } else {
                    this.CalendarService.postItem(item)
                        .then(() => this.message.toastInfo('activityMoved'))
                        .catch(error => this.message.toastError(error));
                }
                break;
            }
            case 'copy': {
                this.CalendarService.postItem(isCompletedActivity(item) ? clearActualDataActivity(item) : item)
                    .then(() => this.message.toastInfo('activityCopied'))
                    .catch(error => this.message.toastError(error));
                break;
            }
        }
    }

    onSelect() {
        this.selected = !this.selected;
    }

    isSpecified(item: ICalendarItem):boolean {
        return isSpecifiedActivity(item);
    }

    postItem($event, date){
        this.$mdDialog.show({
            controller: CalendarItemWizardSelectCtrl,
            controllerAs: '$ctrl',
            template:
                `<md-dialog id="wizard" aria-label="Activity">
                        <calendar-item-wizard
                                layout="column" class="calendar-item-wizard"
                                date="$ctrl.date"                     
                                user="$ctrl.user"
                                event="$ctrl.event"
                                on-cancel="cancel()" on-select="$ctrl.answer(itemType, activityType)">
                        </calendar-item-wizard>
                   </md-dialog>`,
            parent: element(document.body),
            targetEvent: $event,
            locals: {
                date: new Date(date), // дата дня в формате ГГГГ-ММ-ДД
                user: this.athlete,
                event: $event
            },
            //resolve: {
            //    details: () => this.ActivityService.getDetails(data.activityHeader.activityId)
            //        .then(response => response, error => console.error(error))
            //},
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true
        }).then(() => {}, ()=> {});
    }
}

const DashboardDayComponent:IComponentOptions = {
    bindings: {
        day: '<',
        athlete: '<',
        selected: '<',
        onSelect: '&'
    },
    require: {
        dashboard: '^dashboard'
    },
    controller: DashboardDayCtrl,
    template: require('./dashboard-day.component.html') as string
};

export default DashboardDayComponent;
