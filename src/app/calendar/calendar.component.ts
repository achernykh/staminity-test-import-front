import './calendar.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import { Subject } from 'rxjs/Subject';
import { times } from '../share/util.js';
import { IComponentOptions, IComponentController, IScope, IAnchorScrollService, ILocationService, IDocumentService, copy} from 'angular';
import {IMessageService} from "../core/message.service";
import {CalendarService} from "./calendar.service";
import {SessionService} from "../core";
import {ICalendarItem, IUserProfile, IUserProfileShort} from "../../../api";
import DisplayService from "../core/display.service";
import {TrainingPlan} from "../training-plans/training-plan/training-plan.datamodel";
import { ICalendarWeek, ICalendarDay, ICalendarDayData } from './calendar.interface';
import { prepareItem, getItemById } from './calendar.functions';
import { Calendar } from "./calendar.datamodel";
import { IActivityTemplate } from "@api/reference";
import { profileShort } from "../core/user.function";
import { FormMode } from "../application.interface";
import { CalendarItemDialogService } from "../calendar-item/calendar-item-dialog.service";
import { ICalendarItemDialogOptions } from "../calendar-item/calendar-item-dialog.interface";
import AuthService from "@app/auth/auth.service";
import { updateIntensity, changeUserOwner } from "../activity/activity.function";
import { getUser } from "../core/session/session.service";

export class CalendarCtrl implements IComponentController{

    // bind
    currentUser: IUserProfile;
    owner: IUserProfile;

    // private
    isCompactView: boolean = false;

    // inject
    static $inject = ['$scope', '$mdDialog', '$mdMedia', '$anchorScroll', '$location', '$stateParams', 'message',
        'CalendarService', 'CalendarItemDialogService', 'SessionService', 'dialogs', 'DisplayService', 'AuthService',
        'SessionService'];
    public user: IUserProfile; // calendar owner
    private weekdayNames: Array<number> = [];
    private selectedItems: Array<ICalendarItem> = []; // буфер выделенных записей
    private copiedItems: Array<ICalendarItem> = []; // буфер скопированных записей
    private buffer: Array<ICalendarItem> = [];
    private firstSrcDay: string;
    private dateFormat: string = 'YYYY-MM-DD';
    private date: Date;
    private range: Array<number> = [0, 1];
    //private calendar: Array<ICalendarWeek> = [];
    private calendar: Calendar;
    private currentWeek: ICalendarWeek;
    private lockScroll: boolean;
    private athletes: Array<IUserProfileShort>;
    private destroy: Subject<any> = new Subject();

    constructor(
        private $scope: IScope,
        private $mdDialog: any,
        private $mdMedia: any,
        private $anchorScroll: IAnchorScrollService,
        private $location: ILocationService,
        private $stateParams: any,
        private message: IMessageService,
        private calendarService: CalendarService,
        private calendarDialog: CalendarItemDialogService,
        private session: SessionService,
        private dialogs: any,
        private display: DisplayService,
        private auth: AuthService,
        private sessionService: SessionService
    ) {

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

    /**
     * Подготовка перечня ателтов для тренера
     */
    private prepareAthletesList(): void {
        if (this.currentUser.public.isCoach && this.currentUser.connections.hasOwnProperty('allAthletes')) {
            this.athletes = this.currentUser.connections.allAthletes.groupMembers;
        }
    }

    openMenu ($mdMenu, ev) {
        $mdMenu.open(ev);
    }

    /**
     * Установка данных для календарной сетки
     * Передается один параметр - начальная - текущая дата
     * @param date
     */
    setData (date: Date = new Date()): void {
        this.calendar = new Calendar(this.$scope, this.$anchorScroll, this.calendarService, this.owner);
        this.calendar.toDate(date);
    }

    /**
     * Установка владельца
     * После смены владельца выполняется переустановка данных календаря
     * @param userId
     */
    setOwner (userId: number): void {
        this.owner = this.currentUser.userId === userId ?
            this.currentUser :
            this.athletes.filter(a => a.userId === userId)[0];
        this.$location.search('userId', this.owner.userId);
        this.setData();
    }

    $onInit() {
        this.prepareAthletesList();
        if (this.$stateParams.userId && this.athletes &&
            this.athletes.some(a => a.userId === Number(this.$stateParams.userId))) {
            this.setOwner(Number(this.$stateParams.userId));
        }
        this.setData();
        this.copyPasteKeyboardListener();

        this.sessionService.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe(profile => {
                this.currentUser = copy(profile);
                this.prepareAthletesList();
            });

        this.calendarService.item$
            .filter(message =>
                message.value.hasOwnProperty('userProfileOwner') &&
                message.value.userProfileOwner.userId === this.owner.userId)// &&
                //(message.value.calendarItemType !== 'activity' || message.value.calendarItemType === 'activity' && !message.value.parentId))
            /**.map(message => {
                message.value['index'] = Number(`${message.value.calendarItemId}${message.value.revision}`);
                return message;})**/
            // ассинхронное сообщение зачастую обрабатывается быстрее, чем получение синхронного ответа через bind
            // в случае с соревнования это критично, так как в ассинхронном ответе не полностью передается структура
            // обьекта
            .delay(1)
            .subscribe((message) => {
                console.info('async update', message.value.calendarItemType, message.value.calendarItemId, message.value.revision);
                switch (message.action) {
                    case 'I': {
                        this.calendar.post(<ICalendarItem>message.value, message.value.parentId);
                        this.$scope.$applyAsync();
                        break;
                    }
                    case 'D': {
                        this.calendar.delete(<ICalendarItem>message.value, message.value.parentId);
                        this.$scope.$applyAsync();
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
                        /**this.calendar.delete(this.calendar.searchItem(message.value.calendarItemId), message.value.parentId);
                        this.calendar.post(<ICalendarItem>message.value, message.value.parentId);
                        this.$scope.$applyAsync();
                        break;**/
                    }
                }
            });

        this.weekdayNames = moment.weekdays(true);
    }

    $onDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    get isLargeScreen (): boolean {
        return this.$mdMedia('min-width: 1440px');
    }

    get panelAuthCheck (): boolean {
        return this.auth.isCoach() || this.auth.isActivityPlan();
    }

    /**
     * Вызов диалога создания записи календаря
     * @param e
     * @param type
     */
    itemDialog (e: Event, type: 'activity' | 'measurement' | 'record' | 'competition'): void {
        this.calendarDialog[ type ](e, this.getOptions())
            .then(response => this.calendar.post(response.item));
    }

    /**
     * Набор опций для диалога Записи календаря (тренировки, события, соревнования...)
     * @param mode
     * @param date
     * @returns {{dateStart: string, currentUser: IUserProfile, owner: (IUserProfile|IUserProfileShort), popupMode: boolean, formMode: FormMode, trainingPlanMode: boolean, planId: null}}
     */
    private getOptions(mode: FormMode = FormMode.Post, date: string = new Date().toISOString()): ICalendarItemDialogOptions {
        return {
            dateStart: date,
            currentUser: this.currentUser,
            owner: this.owner,
            popupMode: true,
            formMode: mode,
            trainingPlanMode: false,
            calendarRange: {
                dateStart: moment().add(--this.calendar.range[0], 'w').startOf('week').format(this.dateFormat),
                dateEnd: moment().add(++this.calendar.range[1], 'w').endOf('week').format(this.dateFormat)
            }
        };
    }

    /**
     * Создание записи календаря
     * @param item<ICalendarItem>
     */
    onPostItem(item: ICalendarItem): void {
        if (this.calendar.include(item.calendarItemId, item.revision)) { console.warn('async post: item already exist'); return; };
        let w = this.getDayIndex(moment(item.dateStart).format('GGGG-ww'));
        let d = moment(item.dateStart).weekday();

        if (w !== -1 && d >= 0 && this.calendar.weeks[w]) {
            this.calendar.weeks[w].subItem[d].data.calendarItems.push(item);
            this.calendar.weeks[w].changes++;
        }
    }

    /**
     * Удаление записи календаря
     * @param item
     */
    onDeleteItem(item): void {
        if (!this.calendar.include(item.calendarItemId, item.revision)) { console.warn('item not found'); return; }

        let w = this.getDayIndex(moment(item.dateStart).format('GGGG-ww'));
        let d = moment(item.dateStart).weekday();

        if (!this.calendar.weeks[w]) {
            return;
        }
        
        let p = this.calendar.weeks[w].subItem[d].data.calendarItems.findIndex(i => i.calendarItemId === item.calendarItemId);

        if (w !== -1 && d >= 0 && p !== -1) {
            this.calendar.weeks[w].subItem[d].data.calendarItems.splice(p,1);
            this.calendar.weeks[w].changes++;
        }
    }

    onFileUpload(){
        this.dialogs.uploadFile()
            .then(file => this.calendarService.postFile(file,null))
            .then(response => this.message.toastInfo(response), error => this.message.toastInfo(error));
    }

    /**
     * Получение индекса недели в массиве календаря
     * @param w - неделя в формате GGGG-WW
     * @returns {number}
     */
    getDayIndex(w) {
        return this.calendar.weeks.findIndex(item => item.week === w);
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
            this.message.toastInfo('itemsCopied');
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
        let update: boolean = this.copiedItems.some(i => i.userProfileOwner.userId !== this.owner);
        let items: Array<ICalendarItem> = [];
        if (shift && this.copiedItems && this.copiedItems.length > 0) {

            items = [...this.copiedItems.filter(item => item.calendarItemType === 'activity' &&
                item.activityHeader.intervals.some(interval => interval.type === 'pW'))];

            /**task = this.copiedItems
                .filter(item => item.calendarItemType === 'activity' && item.activityHeader.intervals.some(interval => interval.type === 'pW'))
                .map(item => this.calendarService.postItem(prepareItem(item, shift)));**/
            debugger;
            Promise.resolve(() => {})
                .then(() => this.copiedItems.some(i => i.userProfileOwner.userId !== this.owner.userId) && this.dialogs.confirm({ text: 'dialogs.updateIntensity' }))
                .then(() => {
                    items.map(i => updateIntensity(i, this.owner.trainingZones));
                    items.map(i => changeUserOwner(i, this.owner));})
                .then(() => items.map(i => this.calendarService.postItem(prepareItem(i, shift))))
                .then(task =>  Promise.all(task))
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
                    this.message.toastInfo('itemsPasted');
                }, (error)=> this.message.toastError(error))
                .then(()=> this.clearBuffer());

            /**Promise.all(task)
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
                    this.message.toastInfo('itemsPasted');
                }, (error)=> this.message.toastError(error))
                .then(()=> this.clearBuffer());**/
        }
    }

    onPostPlan(env: Event){
        this.$mdDialog.show({
            controller: ['$scope','$mdDialog', ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (chart,update) => $mdDialog.hide({chart: chart,update: update});
            }],
            controllerAs: '$ctrl',
            template:
                `<md-dialog id="training-plan-form" aria-label="Training Plan Form">
                        <training-plan-form
                                layout="column" layout-fill class="training-plan-form"
                                mode="post"
                                plan="$ctrl.plan"
                                on-cancel="cancel()" on-save="answer(chart, update)">
                        </training-plan-form>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                plan: new TrainingPlan({
                    isPublic: false,
                    calendarItems: this.buffer
                })
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true

        }).then((response) => {}, () => {});
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
                this.message.toastInfo('itemsDeleted');
                items.map(item => this.calendar.delete(item));
                isSelection ? this.calendar.deselect() : this.clearBuffer();
            }, error => error && this.errorHandler(error));
    }

    /**
     * Обработчик ответа с ошибкой
     * Выводим тост и реджектим цепочку прописов
     * @param error
     */
    private errorHandler (error: string): Promise<any> {
        this.message.toastError(error);
        throw new Error();
    }

    post (item: ICalendarItem): void {
        this.calendarService.postItem(item)
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
        this.calendarService.putItem(item)
            .then(response => response && Object.assign(item, {
                index: Number(`${response.value.id}${response.value.revision}`),
                calendarItemId: response.value.id,
                revision: response.value.revision,
                activityHeader: Object.assign(item.activityHeader, {
                    activityId: response.value.activityId
                })}))
            .then((item: ICalendarItem) => {
                this.calendar.delete(this.calendar.searchItem(item.calendarItemId));
                this.calendar.post(item);
            });
    }

    /**
     * Обновление данных календаря по синхронным ответам от бэка
     * Вызов приходит из calendar-day
     * @param mode
     * @param item
     */
    update (mode: FormMode, item: ICalendarItem): void {
        console.info('sync update', item.calendarItemType, item.calendarItemId, item.revision, item);
        if (item.calendarItemType === 'record' && item.recordHeader && item.recordHeader.repeat) {console.info('sync update: skip parent record'); return;}
        switch (mode) {
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
        this.update(mode, item);
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
        this.post(updateIntensity(item, this.owner.trainingZones));
    }

    clearBuffer() {
        this.buffer = [];
        this.selectedItems = [];
        this.copiedItems = [];
        this.firstSrcDay = null;
        this.calendar.deselect();
    }

    /**
     * Диапазон дат от начала загруженного календаря до окончания
     * @returns {any[]}
     */
    get calendarRange(): Array<string> {
        return [
            this.calendar.weeks[0].date.format(this.dateFormat),
            this.calendar.weeks[this.calendar.weeks.length - 1].date.add('days', 6).format(this.dateFormat)
        ];
    }

}

const CalendarComponent: IComponentOptions = {
    bindings: {
        currentUser: '<',
        owner: '<',
        view: '<',
        user: '<'
    },
    transclude: false,
    controller: CalendarCtrl,
    template: require('./calendar.component.html') as string
};
export default CalendarComponent;

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