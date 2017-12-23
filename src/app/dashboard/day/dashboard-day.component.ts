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
import { ICalendarItemDialogOptions } from "@app/calendar-item/calendar-item-dialog.interface";
import { FormMode } from '../../application.interface';
import { CalendarItemDialogService } from "../../calendar-item/calendar-item-dialog.service";

class DashboardDayCtrl implements IComponentController {

    // bind
    day: IDashboardDay;
    currentUser: IUserProfile;
    owner: IUserProfile;
    selected: boolean;
    onUpdate: (response: ICalendarItemDialogOptions) => Promise<any>;

    //private
    private dashboard: DashboardCtrl;
    private itemOptions: ICalendarItemDialogOptions;

    static $inject = ['$mdDialog','message','dialogs','CalendarService', 'CalendarItemDialogService'];

    constructor(private $mdDialog: any,
                private message: any,
                private dialogs: any,
                private CalendarService: CalendarService,
                private calendarItemDialog: CalendarItemDialogService) {

    }

    $onInit() {
        this.itemOptions = {
            currentUser: this.currentUser,
            owner: this.owner,
            popupMode: true,
            formMode: FormMode.Put,
            trainingPlanMode: false,
            planId: null
        };
    }

    onDrop(srcItem: ICalendarItem,
           operation: string,
           srcIndex:number,
           trgDate:string,
           trgIndex: number,
           srcAthlete: IUserProfile) {


        let item:ICalendarItem = copy(srcItem);
        item.dateStart = moment(trgDate).utc().add(moment().utcOffset(), 'minutes').format();//new Date(date);
        item.dateEnd = moment(trgDate).utc().add(moment().utcOffset(), 'minutes').format();//new Date(date);
        if (srcAthlete.userId !== this.owner.userId) {
            item.userProfileOwner = profileShort(srcAthlete);
            //operation = 'copy';
            this.dialogs.confirm({ text: 'dialogs.updateIntensity' })
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
                    this.dialogs.confirm({ text: 'dialogs.moveActualActivity' })
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
                user: this.owner,
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

    /**
     * Визард создания записи календаря
     * @param e
     * @param data
     */
    wizard (e: Event, data: IDashboardDay): void {
        this.calendarItemDialog.wizard(e, this.getOptions(FormMode.Post, data.date))
            .then(response => this.onUpdate(response),  error => { debugger; });
    }

    /**
     * Набор опций для запуска диалога CalendarItem*
     * @param mode
     * @param date
     * @returns {ICalendarItemDialogOptions}
     */
    private getOptions (mode: FormMode, date?: string): ICalendarItemDialogOptions {
        return {
            dateStart: date,
            currentUser: this.currentUser,
            owner: this.owner,
            popupMode: true,
            formMode: mode,
            trainingPlanMode: false,
            planId: null
        };
    }

}

const DashboardDayComponent:IComponentOptions = {
    bindings: {
        day: '<',
        currentUser: '<',
        owner: '<',

        selected: '<',
        onSelect: '&',
        onUpdate: '&', // Изменение / Создание / Удаление записи
    },
    require: {
        dashboard: '^dashboard'
    },
    controller: DashboardDayCtrl,
    template: require('./dashboard-day.component.html') as string
};

export default DashboardDayComponent;
