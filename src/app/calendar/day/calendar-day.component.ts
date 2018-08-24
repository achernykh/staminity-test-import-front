import './calendar-day.component.scss';
import moment from 'moment/src/moment.js';
import * as angular from 'angular';
import { IMessageService } from "../../core/message.service";
import ActivityService from "../../activity/activity.service";
import { CalendarService } from "../calendar.service";
import { IComponentOptions, IComponentController, IFormController, IPromise, IScope, merge, copy } from 'angular';
import { CalendarCtrl } from "../calendar.component";
import { ICalendarDayData } from "../calendar.interface";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { isSpecifiedActivity, isCompletedActivity, clearActualDataActivity } from "../../activity/activity.function";
import { IUserProfile } from "@api/user";
import { getCalendarItem } from "../../calendar-item/calendar-item.function";
import {
    ICalendarItemDialogOptions,
    ICalendarItemDialogResponse
} from "../../calendar-item/calendar-item-dialog.interface";
import { CalendarItemDialogService } from "../../calendar-item/calendar-item-dialog.service";
import { FormMode } from "../../application.interface";
import {Activity} from "@app/activity/activity-datamodel/activity.datamodel";
import {isFutureDay} from "../../share/date/date.filter";
import AuthService from "@app/auth/auth.service";
import {PremiumDialogService} from "@app/premium/premium-dialog/premium-dialog.service";

class CalendarDayCtrl {

    // bind
    today: any;
    data: ICalendarDayData;
    owner: IUserProfile;
    currentUser: IUserProfile;
    selected: boolean;
    dynamicDates: boolean;
    trainingPlanMode: boolean;
    planId: number;
    daySid: number;
    weekSid: number;
    compactView: boolean;
    calendarRangeStart: number;
    calendarRangeEnd: number;
    onUpdate: (response: ICalendarItemDialogResponse) => Promise<any>;
    onDrop: (response: ICalendarItemDialogResponse) => Promise<any>;

    // private
    private itemOptions: ICalendarItemDialogOptions;
    private readonly dateFormat: string = "YYYY-MM-DD";

    static $inject = [ '$mdDialog', '$mdMedia', 'CalendarItemDialogService', 'message', 'ActivityService',
        'CalendarService', '$scope', 'dialogs', 'AuthService', 'PremiumDialogService' ];

    constructor (private $mdDialog: any,
                 private $mdMedia: any,
                 private calendarItemDialog: CalendarItemDialogService,
                 private message: IMessageService,
                 private ActivityService: ActivityService,
                 private calendarService: CalendarService,
                 private $scope: IScope,
                 private dialogs: any,
                 private authService: AuthService,
                 private premiumDialogService: PremiumDialogService) {

    }

    get isMobile (): boolean {
        return this.$mdMedia('xs');
    }

    get viewLayout (): string {
        if (this.isMobile) {
            return 'list';
        } else if (this.compactView) {
            return 'dashboard';
        } else {
            return 'calendar';
        }
    }

    isSpecified (item: ICalendarItem): boolean {
        return isSpecifiedActivity(item);
    }

    isCompleted (item: ICalendarItem): boolean {
        return isCompletedActivity(item);
    }


    $onInit () {
        let diff = moment().diff(moment(this.data.date), 'days', true);
        this.today = diff >= 0 && diff < 1;
    }

    /**
     * Обновление параметров итема
     * @param changes
     */
    $onChanges (changes): void {
        if ((changes.hasOwnProperty('owner') && this.owner) ||
            (changes.hasOwnProperty('currentUser') && this.currentUser) ||
            (changes.hasOwnProperty('owner') && this.owner) ||
            (changes.hasOwnProperty('planId') && this.planId)) {

            this.itemOptions = {
                currentUser: this.currentUser,
                owner: this.owner,
                popupMode: true,
                formMode: this.trainingPlanMode ? FormMode.Put : FormMode.View,
                trainingPlanMode: this.trainingPlanMode,
                trainingPlanOptions: {
                    planId: this.planId,
                    dayNumber: this.weekSid * 7 + this.daySid,
                    weekNumber: this.weekSid,
                    dynamicDates: this.dynamicDates
                }
            };
        }
    }


    onSelect () {
        this.selected = !this.selected;
    }


    /**
     * Создание записи календаря
     * @param e
     * @param type
     * @param data
     */
    post (e: Event, type: 'activity' | 'measurement' | 'record', data: ICalendarDayData): void {

        this.calendarItemDialog[ type ](e, this.getOptions(FormMode.Post, data.date))
            .then((response) => this.onUpdate(response), () => {
            });

    }

    /**
     * Визард создания записи календаря
     * @param e
     * @param data
     */
    wizard (e: Event, data: ICalendarDayData): void {

        if (!(this.authService.isCoach() || this.authService.isPremiumAccount()) && isFutureDay(data.date)) {
            this.premiumDialogService.open(null, 'futurePlaning').then();
            return;
        }

        this.calendarItemDialog.wizard(e,
            this.getOptions(FormMode.Post, moment(data.date).startOf('day').format('YYYY-MM-DDTHH:mm:ss')))
            .then(response => this.onUpdate(response),  error => { });
    }

    /**
     * Диалог просмотра записи календаря
     * @param e
     * @param type
     * @param item
     */
    open (e: Event, type: 'activity' | 'measurement' | 'record', item: ICalendarItem): void {
        this.calendarItemDialog[ type ](e,
            this.getOptions(this.trainingPlanMode || type === 'measurement' ? FormMode.Put : FormMode.View, item.dateStart), item)
            .then((response) => this.onUpdate(response), () => {
            });

    }
    
    onDropActivity (
        srcItem: ICalendarItem,
        operation: string,
        srcIndex: number,
        trgDate: string,
        trgIndex: number,
        trgItem: Activity) {

        let item: ICalendarItem = copy(srcItem);
        let srcItemSpecified: boolean = isSpecifiedActivity(item);
        let trgItemSpecified: boolean = trgItem && isSpecifiedActivity(trgItem);
        let srcItemCompleted: boolean = isCompletedActivity(item);
        let trgItemCompleted: boolean = trgItem && isCompletedActivity(trgItem);
        let diffDays: number = item && (trgItem || trgDate) &&
            moment(item.dateStart).diff(moment(trgItem && trgItem.dateStart || trgDate), 'days');

        item.dateStart = moment(trgDate).utc().add(moment().utcOffset(), 'minutes').format();//new Date(date);
        item.dateEnd = moment(trgDate).utc().add(moment().utcOffset(), 'minutes').format();//new Date(date);

        switch ( operation ) {
            case 'merge': {
                // Обьединение двух фактических тренировок не возможно
                if (srcItemCompleted && trgItemCompleted) {
                    this.message.toastError('needOnlyOneCompletedActivity');
                    break;
                }
                if (srcItemSpecified && trgItemSpecified) {
                    this.message.toastError('needOnlyOneSpecifiedActivity');
                    break;
                }
                // Обьединение тренеировок с разными датами не возможно
                if (srcItemCompleted && diffDays !== 0) {
                    this.message.toastError('mergeActivitiesWithDistinctDays');
                    break;
                }
                this.dialogs.confirm({ text: 'dialogs.mergeActivity' })
                    .then(_ => this.calendarService.merge(item.calendarItemId, trgItem.calendarItemId))
                    .then(_ => this.message.toastInfo('activityMerged'), e => e && this.message.toastError(e));
                break;
            }
            case 'move': {
                // перенос в другой день фактической тренировки
                if (srcItemCompleted) {
                    this.message.toastError('moveSpecifiedItem');
                    break;
                }
                if (isCompletedActivity(item)) {
                    this.dialogs.confirm({ text: 'dialogs.moveActualActivity' })
                        .then(() => this.calendarService.postItem(clearActualDataActivity(item)))
                        .then(() => this.message.toastInfo('activityCopied'), error => error && this.message.toastError(error));
                } else {
                    this.onDrop({formMode: FormMode.Put, item: item});
                }
                break;
            }
            case 'copy': {
                this.onDrop({formMode: FormMode.Post, item: item});
                break;
            }
        }
        return true;
    }

    onDropEvent (srcItem: ICalendarItem, operation: string, srcIndex: number, trgDate: string, trgIndex: number): boolean {
        let item: ICalendarItem = copy(srcItem);
        item.dateStart = moment(trgDate).utc().add(moment().utcOffset(), 'minutes').format();//new Date(date);
        item.dateEnd = moment(trgDate).utc().add(moment().utcOffset(), 'minutes').format();//new Date(date);

        switch ( operation ) {
            case 'move': {
                this.calendarService.putItem(item)
                    .then(() => this.message.toastInfo('eventMoved'))
                    .catch(error => this.message.toastError(error));
                break;
            }
            case 'copy': {
                this.calendarService.postItem(item)
                    .then(() => this.message.toastInfo('eventCopied'))
                    .catch(error => this.message.toastError(error));
                break;
            }
        }

        return true;
    }

    onDrag (event) {
        console.info('dnd drag event', event);
    }

    onCopied (item) {
        //debugger;
        //this.message.toastInfo('activityCopied');
        console.info('dnd copied event', item);

    }

    onMoved (item) {
        //debugger;
        console.info('dnd moved event', item);

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
            trainingPlanMode: this.trainingPlanMode,
            trainingPlanOptions: {
                planId: this.planId,
                dayNumber: this.weekSid * 7 + this.daySid,
                weekNumber: this.weekSid,
                dynamicDates: this.dynamicDates
            },
            calendarRange: {
                dateStart: moment().add(--this.calendarRangeStart, 'w').startOf('week').format(this.dateFormat),
                dateEnd: moment().add(++this.calendarRangeEnd, 'w').endOf('week').format(this.dateFormat)
            }
        };
    }


}

const CalendarDayComponent: IComponentOptions = {
    bindings: {
        data: '<', // ICalendarItem
        selected: '<',
        accent: '<',
        dynamicDates: '<', // Используется для динамических планов
        owner: '<', // Опции отдельной записи: автор, владелец и пр..
        currentUser: '<',
        trainingPlanMode: '<',
        planId: '<',
        daySid: '<',
        weekSid: '<',
        copiedItemsLength: '<', // обьем буфера скопированных тренировок
        compactView: '<',
        update: '<',
        calendarRangeStart: '<',
        calendarRangeEnd: '<',

        onCopy: '&', // пользователь скопировал дни/недели (без параметров)
        onPaste: '&', // пользователь выбрал даты у нажал вставить, параметр - дата начала
        onPostPlan: '&', // создание тренировочного плана на основе выдленных элементов
        onDelete: '&', // удалить
        onUpdate: '&', // Изменение / Создание / Удаление записи
        onDrop: '&', // Завершение операции drag & drop
        onSelect: '&'
    },
    controller: CalendarDayCtrl,
    template: require('./calendar-day.component.html') as string
};

export default CalendarDayComponent;

function DialogController ($scope, $mdDialog) {
    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        console.log('cancel');
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
}
DialogController.$inject = [ '$scope', '$mdDialog' ];