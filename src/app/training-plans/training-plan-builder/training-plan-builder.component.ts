import './training-plan-builder.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise,IScope,IAnchorScrollService, copy} from 'angular';
import { Subject } from 'rxjs/Subject';
import { Calendar } from "../../calendar/calendar.datamodel";
import { CalendarService } from "../../calendar/calendar.service";
import { SessionService } from "../../core";
import { IUserProfile } from "../../../../api/user/user.interface";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { FormMode } from "../../application.interface";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { prepareItem, getItemById } from "../../calendar/calendar.functions";
import AuthService from "../../auth/auth.service";
import MessageService from "../../core/message.service";
import { IActivityTemplate } from "../../../../api/reference/reference.interface";
import { profileShort } from "../../core/user.function";
import { TrainingPlansService } from "../training-plans.service";
import { Moment } from 'moment';

class TrainingPlanBuilderCtrl implements IComponentController {

    plan: TrainingPlan;
    onEvent: (response: Object) => IPromise<void>;
    currentUser: IUserProfile;

    // private
    private owner: IUserProfile;
    private dynamicDates: boolean;
    private futureDate: Moment = moment('3000.01.01');
    private weekdayNames: Array<number> = [];
    private firstSrcDay: string;
    private selectedItems: Array<ICalendarItem> = []; // буфер выделенных записей
    private copiedItems: Array<ICalendarItem> = []; // буфер скопированных записей
    private calendar: Calendar;
    private isCompactView: boolean = false;
    private destroy: Subject<any> = new Subject();
    static $inject = ['$scope', '$mdMedia', '$anchorScroll', 'TrainingPlansService', 'CalendarService', 'SessionService', 'AuthService',
        'message','dialogs'];

    constructor(
        private $scope: IScope,
        private $mdMedia: any,
        private $anchorScroll: IAnchorScrollService,
        private trainingPlansService: TrainingPlansService,
        private calendarService: CalendarService,
        private session: SessionService,
        private auth: AuthService,
        private messageService: MessageService,
        private dialogs: any
    ) {
        this.copyPasteKeyboardListener();
    }

    $onInit() {
        this.weekdayNames = moment.weekdays(true);
        this.currentUser = this.session.getUser();
        this.owner = this.currentUser;
        this.calendar = new Calendar(this.$scope, this.$anchorScroll, this.calendarService, this.currentUser, this.plan.calendarItems);
        this.dynamicDates = !this.plan.isFixedCalendarDates;
        this.calendar.toDate(this.dynamicDates ? new Date('3000.01.01') : this.plan.startDate);
    }

    $onDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    /**
     * Обновление записей календаря по событий пользователя
     * @param formMode
     * @param item
     */
    update (formMode: FormMode, item: ICalendarItem): void {
        debugger;
        switch (formMode) {
            case FormMode.Post: {
                if (this.calendar.include(item.calendarItemId, item.revision)) { console.warn('sync post: item already exist'); return; }
                this.calendar.post(item);
                break;
            }
            case FormMode.Put: {
                this.calendar.delete(item);
                this.calendar.post(item);
                break;
            }
            case FormMode.Delete: {
                this.calendar.delete(item);
                break;
            }
        }
    }

    post (item: ICalendarItem): void {
        this.trainingPlansService.postItem(this.plan.id, item, true)
            .then(response => response && Object.assign(item, {
                index: Number(`${response.value.id}${response.value.revision}`),
                calendarItemId: response.value.id,
                revision: response.value.revision,
                activityHeader: Object.assign(item.activityHeader, {
                    activityId: response.value.activityId
                })}))
            .then((item: ICalendarItem) => this.calendar.post(item));
    }

    onDropTemplate (template: IActivityTemplate, date: string): void {
        let item: ICalendarItem = {
            revision: null,
            calendarItemId: null,
            calendarItemType: 'activity',
            dateStart: date,
            dateEnd: date,
            activityHeader: {
                activityType: template.activityCategory.activityType,
                activityCategory: template.activityCategory,
                intervals: template.content
            },
            userProfileCreator: profileShort(this.currentUser),
            userProfileOwner: profileShort(this.owner)
        };
        this.post(item);
    }

    /**
     * Обраотка событий Ctrl+C, Ctrl+V
     */
    private copyPasteKeyboardListener (): void {
        let ctrlDown = false, ctrlKey = 17, cmdKey = 91, vKey = 86, cKey = 67;

        window.addEventListener('keydown', (e: any) => {
            if (e.keyCode === ctrlKey || e.keyCode === cmdKey) {
                ctrlDown = true;
            }
            if (ctrlDown && e.keyCode === cKey && this.selectedItems.length > 0) {
                this.copyItems();
            }
            if (ctrlDown && e.keyCode === vKey && this.copiedItems.length > 0 &&
                this.calendar.selectedDaysCount === 1) {
                this.pasteItems(this.calendar.firstDaySelected);
            }
        });

        window.addEventListener('keyup', (e: any) => {
            if (e.keyCode === ctrlKey || e.keyCode === cmdKey) {
                ctrlDown = false;
            }
        });
    }

    selectItems (): void {
        this.selectedItems = [];
        this.calendar.weeks.forEach(w => w.subItem.forEach(d =>
        d.selected && d.data.calendarItems && d.data.calendarItems.length > 0 &&
        this.selectedItems.push(...copy(d.data.calendarItems.filter(i => i.calendarItemType === 'activity')))));
    }

    /**
     * Копирование записей календаря
     * @param items
     */
    copyItems(items: Array<ICalendarItem> = [...copy(this.selectedItems)]){
        this.copiedItems = [];
        this.firstSrcDay = null;
        if(items){
            this.copiedItems.push(...copy(items.filter(i => i.calendarItemType === 'activity')));
            this.firstSrcDay = moment(items[0].dateStart).format('YYYY-MM-DD');
        }
        if(this.copiedItems && this.copiedItems.length > 0) {
            this.calendar.deselect();
            this.messageService.toastInfo('itemsCopied');
        }
    }

    /**
     * Вставить записи календаря в указанную пользователем дату
     * Копирование осущстествляется со сдвижкой = выбранная дата - дата первого скопированного элемента
     * @param firstTrgDay
     */
    pasteItems (firstTrgDay: string){
        if (!firstTrgDay) { return; }
        let shift = moment(firstTrgDay, 'YYYY-MM-DD').diff(moment(this.firstSrcDay,'YYYY-MM-DD'), 'days');
        let task:Array<Promise<any>> = [];

        if (shift && this.copiedItems && this.copiedItems.length > 0) {
            task = this.copiedItems
                .filter(item => item.calendarItemType === 'activity' && item.activityHeader.intervals.some(interval => interval.type === 'pW'))
                .map(item => this.trainingPlansService.postItem(this.plan.id, prepareItem(item, shift), true));

            Promise.all(task)
                .then(response => {
                    response.forEach((r,i) => {
                        if (r.type === 'revision') {
                            // Сохраняем данные, предварительно обновив, полученным номером и ревизией
                            this.calendar.post(Object.assign(this.copiedItems[i], {
                                calendarItemId: r.value.id,
                                revision: r.value.revision
                            }));
                        }
                    });
                    this.messageService.toastInfo('itemsPasted');
                }, (error)=> this.messageService.toastError(error))
                .then(()=> this.clearBuffer());
        }
    }

    /**
     * Удаление записей календаря
     * Если в параметрах передан массив эдементов, то удаляем его,
     * иначе удаляем выделенные позиции
     * @param items
     */
    deleteItems(items: Array<ICalendarItem>): void {
        let isSelection: boolean = !!items;
        if (!isSelection) { items = [...copy(this.selectedItems)];}

        this.dialogs.confirm({ text: 'dialogs.deleteSelectedItems' })
            .then(() => this.calendarService.deleteItem('F', items.map(item => item.calendarItemId)), () => { throw null;})
            .then(() => {
                this.messageService.toastInfo('itemsDeleted');
                items.map(item => this.calendar.delete(item));
                isSelection ? this.calendar.deselect() : this.clearBuffer();
            }, error => error && this.errorHandler(error));
    }

    clearBuffer() {
        this.selectedItems = [];
        this.copiedItems = [];
        this.firstSrcDay = null;
        this.calendar.deselect();
    }

    /**
     * Обработчик ответа с ошибкой
     * Выводим тост и реджектим цепочку прописов
     * @param error
     */
    private errorHandler (error: string): Promise<any> {
        this.messageService.toastError(error);
        throw new Error();
    }

    private openMenu ($mdMenu, ev) {
        $mdMenu.open(ev);
    }

    get isLargeScreen (): boolean {
        return this.$mdMedia('min-width: 1440px');
    }

    get panelAuthCheck (): boolean {
        return this.auth.isCoach() || this.auth.isActivityPlan();
    }

}

const TrainingPlanBuilderComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanBuilderCtrl,
    template: require('./training-plan-builder.component.html') as string
};

export default TrainingPlanBuilderComponent;