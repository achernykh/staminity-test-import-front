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
    compactView: boolean;
    onUpdate: (response: ICalendarItemDialogResponse) => Promise<any>;

    // private
    private itemOptions: ICalendarItemDialogOptions;

    static $inject = [ '$mdDialog', '$mdMedia', 'CalendarItemDialogService', 'message', 'ActivityService', 'CalendarService', '$scope', 'dialogs' ];

    constructor (private $mdDialog: any,
                 private $mdMedia: any,
                 private calendarItemDialog: CalendarItemDialogService,
                 private message: IMessageService,
                 private ActivityService: ActivityService,
                 private CalendarService: CalendarService,
                 private $scope: IScope,
                 private dialogs: any) {

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


    $onInit () {
        let diff = moment().diff(moment(this.data.date), 'days', true);
        this.today = diff >= 0 && diff < 1;
        this.itemOptions = {
            currentUser: this.currentUser,
            owner: this.owner,
            popupMode: true,
            formMode: this.trainingPlanMode ? FormMode.Put : FormMode.View,
            trainingPlanMode: this.trainingPlanMode,
            planId: this.planId
        };
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
        this.calendarItemDialog.wizard(e, this.getOptions(FormMode.Post, data.date))
            .then(response => this.onUpdate(response),  error => { debugger; });
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
    
    onDropActivity (srcItem: ICalendarItem, operation: string, srcIndex: number, trgDate: string, trgIndex: number) {

        let item: ICalendarItem = copy(srcItem);
        item.dateStart = moment(trgDate).utc().add(moment().utcOffset(), 'minutes').format();//new Date(date);
        item.dateEnd = moment(trgDate).utc().add(moment().utcOffset(), 'minutes').format();//new Date(date);

        switch ( operation ) {
            case 'move': {
                if (isCompletedActivity(item)) {
                    this.dialogs.confirm({ text: 'dialogs.moveActualActivity' })
                        .then(() => this.CalendarService.postItem(clearActualDataActivity(item)))
                        .then(() => this.message.toastInfo('activityCopied'), error => error && this.message.toastError(error));
                } else {
                    this.CalendarService.putItem(item)
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
        return true;
    }

    onDropEvent (srcItem: ICalendarItem, operation: string, srcIndex: number, trgDate: string, trgIndex: number): boolean {
        let item: ICalendarItem = copy(srcItem);
        item.dateStart = moment(trgDate).utc().add(moment().utcOffset(), 'minutes').format();//new Date(date);
        item.dateEnd = moment(trgDate).utc().add(moment().utcOffset(), 'minutes').format();//new Date(date);

        switch ( operation ) {
            case 'move': {
                this.CalendarService.putItem(item)
                    .then(() => this.message.toastInfo('eventMoved'))
                    .catch(error => this.message.toastError(error));
                break;
            }
            case 'copy': {
                this.CalendarService.postItem(item)
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
            planId: this.planId
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
        copiedItemsLength: '<', // обьем буфера скопированных тренировок
        compactView: '<',
        update: '<',

        onCopy: '&', // пользователь скопировал дни/недели (без параметров)
        onPaste: '&', // пользователь выбрал даты у нажал вставить, параметр - дата начала
        onPostPlan: '&', // создание тренировочного плана на основе выдленных элементов
        onDelete: '&', // удалить
        onUpdate: '&', // Изменение / Создание / Удаление записи
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