import './training-plan-builder.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController,IScope,IAnchorScrollService, copy, ILocationService} from 'angular';
import { StateService } from 'angular-ui-router';
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
import { ITrainingPlanSearchRequest, ITrainingPlan } from "../../../../api/trainingPlans/training-plans.interface";
import { TrainingPlansList } from "../training-plans-list/training-plans-list.datamodel";
import { TrainingPlanDialogService } from "../training-plan-dialog.service";

class TrainingPlanBuilderCtrl implements IComponentController {

    currentUser: IUserProfile;
    onEvent: (response: Object) => Promise<void>;

    // private
    private currentPlan: TrainingPlan;
    private owner: IUserProfile;
    private trainingPlans: TrainingPlansList;
    private dynamicDates: boolean;
    private futureDate: Moment = moment('3000.01.01');
    private weekdayNames: Array<number> = [];
    private firstSrcDay: string;
    private selectedItems: Array<ICalendarItem> = []; // буфер выделенных записей
    private copiedItems: Array<ICalendarItem> = []; // буфер скопированных записей
    private calendar: Calendar;
    private isCompactView: boolean = false;
    private destroy: Subject<any> = new Subject();
    static $inject = ['$scope', '$mdMedia', '$state', '$stateParams', '$location', '$anchorScroll', 'TrainingPlansService',
        'TrainingPlanDialogService', 'CalendarService', 'SessionService', 'AuthService', 'message','dialogs'];

    constructor(
        private $scope: IScope,
        private $mdMedia: any,
        private $state: StateService,
        private $stateParams: any,
        private $location: ILocationService,
        private $anchorScroll: IAnchorScrollService,
        private trainingPlansService: TrainingPlansService,
        private trainingPlanDialogService: TrainingPlanDialogService,
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
        if (this.$stateParams.planId) {
            this.setTrainingPlan(this.$stateParams.planId);
        }
        this.prepareTrainingPlansSelector();
        this.subscribeAsyncMessages();
    }

    $onDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    view (e: Event, plan: TrainingPlan) {
        this.trainingPlanDialogService.open(e, FormMode.Put, plan)
            .then(
                (response) => {
                    if (response.mode === FormMode.Put) {
                        this.currentPlan = new TrainingPlan(response.plan);
                    }
                    if (response.mode === FormMode.Put &&
                        moment(response.plan['_startDate']).startOf('week').format('YYYY-MM-DD') !== plan.startDate ) {
                        this.setTrainingPlan(plan.id);
                    }
                }, () => {});
    }

    private subscribeAsyncMessages(): void {
        this.trainingPlansService.message
            .filter(message => message.value.hasOwnProperty('trainingPlanId') &&
                    message.value.trainingPlanId === this.currentPlan.id)
            /**.map(message => {
                message.value['index'] = Number(`${message.value.calendarItemId}${message.value.revision}`);
                return message;})**/
            // ассинхронное сообщение зачастую обрабатывается быстрее, чем получение синхронного ответа через bind
            // в случае с соревнования это критично, так как в ассинхронном ответе не полностью передается структура
            // обьекта
            .delay(1)
            .subscribe((message) => {
                console.info('training plan builder: async update', message.value.calendarItemType, message.value.calendarItemId, message.value.revision);
                switch (message.action) {
                    case 'I': {
                        this.calendar.post(message.value as ICalendarItem, message.value.parentId);
                        break;
                    }
                    case 'D': {
                        this.calendar.delete(this.calendar.searchItem(message.value.calendarItemId), message.value.parentId);
                        break;
                    }
                    case 'U': {
                        if (!this.calendar.include(message.value.calendarItemId, message.value.revision)) {
                            if (!message.value.parentId || message.value.calendarItemType === 'record') {
                                this.calendar.delete(this.calendar.searchItem(message.value.calendarItemId), message.value.parentId);
                            }
                            this.calendar.post(message.value as ICalendarItem, message.value.parentId);
                        } else {
                            console.info('training plan builder: item already exist');
                        }
                        break;
                    }
                }
            });
    }

    private setTrainingPlan (planId: number): void {
        this.currentPlan = null;
        this.trainingPlansService.get(planId)
            .then(response => this.currentPlan = new TrainingPlan(response))
            .then(_ => this.setData());
    }

    private setData (): void {
        this.calendar = new Calendar(this.$scope, this.$anchorScroll, null, this.currentUser, this.currentPlan.calendarItems);
        this.dynamicDates = !this.currentPlan.isFixedCalendarDates;
        //let date = new Date(3000, 0, 1);
        //alert(date);
        this.calendar.toDate(this.dynamicDates ? new Date(3000, 0, 1) : this.currentPlan.startDate);
        this.$location.search('planId', this.currentPlan.id);
    }

    private prepareTrainingPlansSelector(): void {
        let request: ITrainingPlanSearchRequest = { ownerId: this.owner.userId };
        this.trainingPlansService.search(request)
            .then(result => this.trainingPlans = new TrainingPlansList(result.items));
    }

    /**
     * Обновление записей календаря по событий пользователя
     * @param formMode
     * @param item
     */
    update (formMode: FormMode, item: ICalendarItem): void {
        console.info('training plan builder sync update: ', item.calendarItemType, item.calendarItemId, item.revision);
        if (item.calendarItemType === 'record' && item.recordHeader && item.recordHeader.repeat) {console.info('sync update: skip parent record'); return;}
        switch (formMode) {
            case FormMode.Post: {
                if (this.calendar.include(item.calendarItemId, item.revision)) { console.warn('sync post: item already exist'); return; }
                this.calendar.post(item);
                break;
            }
            case FormMode.Put: {
                this.calendar.delete(this.calendar.searchItem(item.calendarItemId));
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
        this.trainingPlansService.postItem(this.currentPlan.id, item, false)
            .then(response => response && Object.assign(item, {
                index: Number(`${response.value.id}${response.value.revision}`),
                calendarItemId: response.value.id,
                revision: response.value.revision,
                activityHeader: Object.assign(item.activityHeader, {
                    activityId: response.value.activityId
                })}))
            .then((item: ICalendarItem) => this.calendar.post(item));
    }

    put (item: ICalendarItem): void {
        this.trainingPlansService.putItem(this.currentPlan.id, item, false)
            .then(response => response && Object.assign(item, {
                index: Number(`${response.value.id}${response.value.revision}`),
                calendarItemId: response.value.id,
                revision: response.value.revision,
                activityHeader: Object.assign(item.activityHeader, {
                    activityId: response.value.activityId
                })}))
            .then((item: ICalendarItem) => {
                debugger;
                this.calendar.delete(this.calendar.searchItem(item.calendarItemId));
                this.calendar.post(item);
            });
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

    dropItems (mode: FormMode, item: ICalendarItem): void {
        switch (mode) {
            case FormMode.Post: {
                this.post(item);
                break;
            }
            case FormMode.Put: {
                this.put(item);
                break;
            }
        }
        //this.update(mode, item);
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
                .map(item => this.trainingPlansService.postItem(this.currentPlan.id, prepareItem(item, shift), false));

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

    private assignment (env: Event, plan: TrainingPlan): void {
        this.trainingPlanDialogService.assignment(env, plan, false)
            .then(response => {debugger;}, error => {debugger;});
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

        Promise.all(items.map(item => this.trainingPlansService.deleteItem(this.currentPlan.id, item)))
            .then(response => items.map(item => this.calendar.delete(item)))
            .then(() => {
                this.messageService.toastInfo('itemsDeleted');
                isSelection ? this.calendar.deselect() : this.clearBuffer();
            }, error => error => this.errorHandler(error));
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
        currentUser: '<',
        onEvent: '&'
    },
    controller: TrainingPlanBuilderCtrl,
    template: require('./training-plan-builder.component.html') as string
};

export default TrainingPlanBuilderComponent;