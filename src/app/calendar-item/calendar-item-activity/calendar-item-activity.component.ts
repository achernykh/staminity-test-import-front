import { Observable, Subject } from "rxjs/Rx";
import './calendar-item-activity.component.scss';
import { IComponentOptions, IComponentController, IFormController, INgModelController, IPromise, IScope, merge, copy} from 'angular';
import moment from 'moment/src/moment.js';
import {CalendarService} from "../../calendar/calendar.service";
import UserService from "../../core/user.service";
import ActivityService from "../../activity/activity.service";
import {IMessageService} from "../../core/message.service";
import {
    IGroupProfileShort,
    IUserProfileShort, IUserProfile,
    IActivityCategory, IActivityTemplate,
    IActivityHeader, IActivityDetails, IActivityIntervalPW,
    IActivityMeasure, ICalcMeasures, IActivityType, IActivityIntervalW
} from "../../../../api";
import {SessionService} from "../../core";
import {nameFromInterval} from "../../reference/reference.datamodel";
import { Activity } from "../../activity/activity-datamodel/activity.datamodel";
import {CalendarCtrl} from "../../calendar/calendar.component";
import {activityTypes, getType} from "../../activity/activity.constants";
import {IAuthService} from "../../auth/auth.service";
import ReferenceService from "../../reference/reference.service";
import {
    templateDialog, TemplateDialogMode,
    templateToActivity
} from "../../reference/template-dialog/template.dialog";
import {ActivityDetails} from "../../activity/activity-datamodel/activity.details";
import {FtpState} from "../../activity/components/assignment/assignment.component";
import { pipe, prop, pick, last, filter, fold, orderBy, groupBy, keys, entries, isUndefined, log } from '../../share/util.js';
import {templatesFilters, ReferenceFilterParams, getOwner} from "../../reference/reference.datamodel";
import {filtersToPredicate} from "../../share/utility/filtering";
import {ActivityIntervals} from "../../activity/activity-datamodel/activity.intervals";
import {ICalendarItem} from "../../../../api/calendar/calendar.interface";
import {ActivityIntervalPW} from "../../activity/activity-datamodel/activity.interval-pw";
import {ActivityIntervalL} from "../../activity/activity-datamodel/activity.interval-l";
import {ActivityIntervalP} from "../../activity/activity-datamodel/activity.interval-p";
import { ICalendarItemDialogOptions } from "../calendar-item-dialog.interface";
import { TrainingPlansService } from "@app/training-plans/training-plans.service";
import { FormMode } from "../../application.interface";
import { CalendarItemDialogService } from "@app/calendar-item/calendar-item-dialog.service";

const profileShort = (user: IUserProfile):IUserProfileShort => ({userId: user.userId, public: user.public});

export enum HeaderTab {
    Overview,
    Details,
    Zones,
    Chat
};

export enum HeaderStructuredTab {
    Overview,
    Segments,
    Details,
    Zones,
    Chat
}

export interface ISelectionIndex {
    L: Array<number>;
    P: Array<number>;
    U: Array<number>;
}

export interface ISelectionTimestamp {
    startTimestamp: number;
    endTimestamp: number;
}

export type SelectInitiator = 'header' | 'details' | 'splits';

export class CalendarItemActivityCtrl implements IComponentController{

    date: Date;
    data: any;
    options: ICalendarItemDialogOptions;
    activityType: IActivityType;
    activityCategory: IActivityCategory;
    details: IActivityDetails;
    mode: string;
    activity: Activity;
    user: IUserProfile;
    tab: string;
    popup: boolean;
    template: boolean = false; // режим создания, изменения шаблона
    club: IGroupProfileShort;
    view: string; // для компоенета calendar-compact, отвечает за верстку элемента: calendar, dashboard...
    onAnswer: (response: ICalendarItemDialogOptions | any) => Promise<void>;
    onCancel: () => IPromise<void>;

    public assignmentForm: INgModelController; // форма ввода задания структурированного / не структурированного
    public inAction: boolean = false; // true - форма на стороне бэкенд (кнопки формы блокируются), false - на стороне frontend

    public showIntervalOverview: boolean = false;
    public intervalOverview: ActivityIntervalL | ActivityIntervalP;
    public showSelectAthletes: boolean = false;
    public showSelectTemplate: boolean = false;
    private forAthletes: Array<{profile: IUserProfile, active: boolean}> = [];
    private recalculateMode: boolean = false;

    public structuredMode: boolean = false;
    public ftpMode: FtpState = FtpState.Off;

    private selectedTimestamp: Array<any> = [];
    private selectedIntervalIndex: ISelectionIndex = { L: null, P: null, U: null}; //todo delete
    private selectionIndex: ISelectionIndex = { L: null, P: null, U: null};
    private selectionTimestamp: Array<ISelectionTimestamp> = [];
    public multiSelection: boolean = false;
    public multiSelectionInterval: IActivityIntervalW;

    private selectedIntervalType: string;
    private changeSelectInterval: number = 0;
    public changeStructuredAssignment: number = 0;
    public resetStructuredAssignment: number = 0;

    private headerSelectChangeCount: number = 0; // счетчик изменений выбора интервала в панели Заголовок
    private detailsSelectChangeCount: number = 0; // счетчик изменений выбора интервала в панели Детали
    private splitsSelectChangeCount: number = 0;
    private templateChangeCount: number = 0; // счетчик изменения выбора шаблона тренировки, обновляем задание
    private isLoadingRange: boolean = false; // индиактор загрузки результатов calculateActivityRange

    public filterParams: ReferenceFilterParams; // набор фильтрации (вид спорта, категория, клуб) для фильтрации шаблонов пользователя
    public templates: Array<IActivityTemplate> = []; // набор шаблоново тренировок пользователя
    private destroy: Subject<void> = new Subject<void>();
    private templatesByOwner: { [owner: string]: Array<IActivityTemplate> }; // шаблоны тренировки для выдчи пользователю в разрезе свои, тренера, системные и пр..
    public templateByFilter: boolean = false; // false - нет шаблонов в соответствии с фильтром, true - есть шаблоны

    public selectedTab: number = 0; // Индекс панели закладок панели заголовка тренировки

    public currentUser: IUserProfile = null;
    //public isOwner: boolean; // true - если пользователь владелец тренировки, false - если нет
    //public isCreator: boolean;
    //public isPro: boolean;
    //public isMyCoach: boolean;

    public isLoadingDetails: boolean = false;

    private activityForm: IFormController;
    private calendar: CalendarCtrl;
    private types: Array<IActivityType> = [];
    private segmentChart: Array<any> = [];
    private bottomPanelData: any = null;

    static $inject = ['$scope', '$translate', 'CalendarService','UserService','SessionService','ActivityService','AuthService',
        'message','$mdMedia','$mdDialog','dialogs', 'ReferenceService', 'TrainingPlansService', 'CalendarItemDialogService'];

    constructor(
        public $scope: IScope,
        private $translate,
        private CalendarService: CalendarService,
        private UserService: UserService,
        private SessionService: SessionService,
        private ActivityService: ActivityService,
        private AuthService: IAuthService,
        public message: IMessageService,
        private $mdMedia: any,
        private $mdDialog: any,
        private dialogs: any,
        private ReferenceService: ReferenceService,
        private trainingPlansService: TrainingPlansService,
        private calendarDialog: CalendarItemDialogService) {

    }

    $onChanges(changes) {
        if(changes.mode && !changes.mode.isFirstChange()) {
            this.changeMode(changes.mode);
        }
        //this.$onInit(); // test, like on calendar-activity.component in ionic
        //this.prepareActivity();
    }


    $onInit() {
        this.prepareActivity();
        this.prepareDetails();
        this.prepareAuth();
        this.prepareAthletesList();
        this.prepareCategories();
        this.prepareTemplates();
        this.prepareTabPosition();
    }

    prepareActivity (): void {
        if ( this.options ) {
            ///this.mode = this.options.formMode;
            this.popup = this.options.popupMode;
            this.currentUser = this.options.currentUser;
            this.user = this.options.owner;
        }
        this.activity = new Activity(this.data, this.options);
        this.segmentChart = this.activity.formChart();

        if (this.activity.bottomPanel === 'data') {
            this.bottomPanelData = this.activity.summaryAvg;
        }

        this.types = activityTypes; // Список видов спорта
        this.structuredMode = this.activity.isStructured;
        this.ftpMode = (this.activity.view.isTemplate || this.activity.view.isTrainingPlan) ? FtpState.On : FtpState.Off;

    }

    prepareDetails(){
        if (!this.activity.view.isTemplate && !this.view) {
            //Получаем детали по тренировке загруженной из внешнего источника
            if (!this.activity.view.isPost && this.activity.hasActualData) {
                let intervalsType: Array<string> = this.activity.isStructured ? ['L','P','G'] : ['L'];
                this.ActivityService.getIntervals(this.activity.activityHeader.activityId, intervalsType)
                    .then(response => this.activity.intervals.add(response, 'update'),
                        error => this.message.toastError('errorCompleteIntervals'))
                    //.then(() => this.activity.updateIntervals())
                    .then(() => this.changeStructuredAssignment++)
                    .then(() => this.prepareTabPosition());

                this.ActivityService.getDetails(this.data.activityHeader.activityId)
                    .then((response:IActivityDetails) =>
                            this.activity.details = new ActivityDetails(response),
                        error => this.message.toastError('errorCompleteDetails'))
                    .then(() => this.isLoadingDetails = false);
            }
        }
    }

    prepareTabPosition(){
        this.selectedTab = (this.tab === 'chat' && this.activity.hasActualData && 2) ||
            (this.tab === 'chat' && !this.activity.hasActualData && 1) || 0;
    }

    changeTab(tab: string):void {
        this.selectedTab = this.structuredMode ? HeaderStructuredTab[tab] : HeaderTab[tab];
    }

    /**
     * Подготовка перечня категорий.
     * Актуальный список содержится в сервисе ReferenceService
     */
    prepareCategories(){
        this.activity.setCategoriesList(this.ReferenceService.categories, this.user);
        this.ReferenceService.categoriesChanges
            .takeUntil(this.destroy)
            .subscribe((categories) => {
                this.activity.setCategoriesList(categories, this.user);
                this.$scope.$apply();
            });

        /**if (this.mode === 'put' || this.mode === 'post' || this.mode === 'view') {
            if (this.template) {
                this.activity.setCategoriesList(this.ReferenceService.categories, this.user);
                this.ReferenceService.categoriesChanges
                    .takeUntil(this.destroy)
                    .subscribe((categories) => {
                        this.activity.setCategoriesList(categories, this.user);
                        this.$scope.$apply();
                    });
            } else {
                this.ActivityService.getCategory()
                    .then(list => this.activity.setCategoriesList(list, this.user),
                        error => this.message.toastError(error));
            }
        }**/
    }

    prepareTemplates(): void {
        this.templates = this.ReferenceService.templates;
        this.activity.header.template = this.templates &&
            this.templates.filter(t => t.id === this.activity.header.templateId)[0] || null;
        this.ReferenceService.templatesChanges
            .takeUntil(this.destroy)
            .subscribe((templates) => {
                this.templates = templates;
                this.updateFilterParams();
                this.$scope.$apply();
            });

        this.updateFilterParams();
    }

    /**
     * Диалог открытия тренировки
     * @param e
     */
    open (e: Event): void {
        this.calendarDialog.activity(e, Object.assign({}, this.options,
            {formMode: this.options.trainingPlanMode ? FormMode.Put : FormMode.View}), this.activity)
            .then(response => this.onAnswer(response));
    }

    /**
     * Диалог изменения тренировки
     * @param e
     */
    edit (e: Event): void {
        this.calendarDialog.activity(e, Object.assign({}, this.options, {formMode: FormMode.Put}), this.activity)
            .then(response => this.onAnswer(response));
    }


    /**
     * Выбран шаблон тренировки
     * @param template
     */
    onSelectTemplate(template: IActivityTemplate){
        this.showSelectTemplate = false;
        this.activity.header.template = template;
        this.activity.intervals = new ActivityIntervals(template.content);
        this.activity.intervals.PW.completeAbsoluteValue(this.user.trainingZones, this.activity.header.sportBasic);
        this.activity.intervals.P.map(i => i.completeAbsoluteValue(this.user.trainingZones, this.activity.header.sportBasic));
        //this.activity.updateIntervals();
        this.structuredMode = this.activity.isStructured;
        this.templateChangeCount ++;
    }

    prepareAuth(){
        //this.isOwner = this.activity.userProfileOwner.userId === this.currentUser.userId;
        //this.isCreator = this.activity.userProfileCreator.userId === this.currentUser.userId;
        //this.isPro = this.AuthService.isActivityPro();
        //this.isMyCoach = this.activity.userProfileCreator.userId !== this.currentUser.userId;
    }

    updateFilterParams(): void {
        this.filterParams = {
            club: null,
            activityType: this.activity.header.activityType,
            category: this.activity.header.activityCategory
        };

        let filters = pick(['club', 'activityType', 'category']) (templatesFilters);

        this.templatesByOwner = pipe(
            filter(filtersToPredicate(filters, this.filterParams)),
            orderBy(prop('sortOrder')),
            groupBy(getOwner(this.user)),
        ) (this.templates);

        this.templateByFilter = Object.keys(this.templatesByOwner)
            .some(owner => this.templatesByOwner[owner] && this.templatesByOwner[owner].length > 0);
    }

    /**
     * @description Подготовка перечня атлетов достунпых для планирования
     */
    prepareAthletesList() {
        if(this.currentUser.connections.hasOwnProperty('allAthletes') && this.currentUser.connections.allAthletes){
            this.forAthletes = this.currentUser.connections.allAthletes.groupMembers
                .filter(user => user.hasOwnProperty('trainingZones'))
                .map(user => ({profile: user, active: user.userId === this.user.userId}));

        }

        if(this.forAthletes.length === 0 || !this.forAthletes.some(athlete => athlete.active)) {
            this.forAthletes.push({profile: this.user, active: true});
        }

        if (this.template && this.data && this.data.userProfileCreator) {
            this.forAthletes = [{ profile: this.data.userProfileCreator, active: true }];
        }
    }

    $onDestroy () {
        this.destroy.next();
        this.destroy.complete();
    }

    changeMode(mode:string) {
        this.mode = mode;
        if (mode === 'put' && !this.activity.categoriesList.length) {
            this.ActivityService.getCategory()
                .then(list => this.activity.categoriesList = list,
                    error => this.message.toastError(error));
        }
    }

    /**
     * Функция получает выделенных атлетов для планирования трениовки
     * @param response
     * @param mode
     */
    onSelectAthletes(list, mode: boolean){
        this.showSelectAthletes = false;
        this.recalculateMode = mode;
        this.forAthletes = list;
    }

    /**
     * Возвращает н-ого атлета для планирования тренировки, необходимо для вывода автарки в заголовки тренировки
     * @param pos
     * @returns {IUserProfileShort}
     */
    firstAthlete(pos: number){
        return this.forAthletes && this.forAthletes.filter(athlete => athlete.active)[pos].profile;
    }

    /**
     * Указывает, что тренировка планируется для более чем одного атлета
     * @returns {boolean}
     */
    multiAthlete(){
        return this.forAthletes && this.forAthletes.filter(athlete => athlete.active).length > 1;
    }

    calculateActivityRange(nonContiguousMode: boolean):void {
        this.ActivityService.calculateRange(
            this.activity.header.id, null, null,
            [   this.activity.intervals.PW.prepareForCalculateRange(),
                ...this.activity.intervals.P.map(i=> i.prepareForCalculateRange()),
                ...this.activity.intervals.G.map(i => i.prepareForCalculateRange())], nonContiguousMode)
            //.then(response => {debugger;}, error => {debugger;})
            .then(response => this.activity.intervals.add(response.intervals, 'update'),
                error => this.message.toastError('errorCompleteIntervals'))
            //.then(() => this.activity.updateIntervals())
            .then(() => this.changeStructuredAssignment++);
    }

    /**
     * Установка выделения переданных индексов интервалов
     * @param initiator - 'header' | 'details'
     * @param selection - перечень индексов интервалов для выделения
     */
    selectIntervalIndex(initiator: SelectInitiator, selection: ISelectionIndex){
        console.log('changeSelectedInterval',initiator, selection);
        this.selectionIndex = selection; // устанавливаем выделение
        this.selectionTimestamp = this.calculateTimestampSelection(this.selectionIndex); //создаем выделение по времени

        if(((this.selectionIndex['P'] && this.selectionIndex['P'].length) +
            (this.selectionIndex['U'] && this.selectionIndex['U'].length) +
            (this.selectionIndex['L'] && this.selectionIndex['L'].length)) > 1 ){

            this.setDetailsTab(initiator, true);

            let intervals: Array<{type:string, startTimestamp: number, endTimestamp: number}> = [];
            Object.keys(this.selectionIndex).forEach(type => {
                if (this.selectionIndex[type]) {
                    let data = this.activity.intervals.stack.filter(i => i.type === type);
                    this.selectionIndex[type].forEach(i => intervals.push({
                        type: type,
                        startTimestamp: data[i].startTimestamp,
                        endTimestamp: data[i].endTimestamp
                    }));
                }
            });

            this.ActivityService.calculateRange(this.activity.header.id, null, null, intervals)
                .then(response => {
                    this.multiSelection = true;
                    this.multiSelectionInterval = response.intervals.filter(i => i.type === 'W')[0];
                }, error => {
                    this.message.toastInfo(error);
                });
        } else {
            this.multiSelection = false;
        }
        // по любому выделению инетрвала пользователя переходим на вкладку Детали
        this.setDetailsTab(initiator, false);
    }

    calculateTimestampSelection(selection: ISelectionIndex){
        let selectionTimestamp: Array<ISelectionTimestamp> = [];
        let types = Object.keys(selection);
        types.forEach(type => {
            if(selection[type]){
                let intervals = this.activity.intervals.stack.filter(i => i.type === type);
                selection[type].forEach(i => selectionTimestamp.push({
                    startTimestamp: intervals[i].startTimestamp,
                    endTimestamp: intervals[i].endTimestamp
                }));
            }
        });
        return selectionTimestamp;
    }

    addUserInterval(range: {startTimestamp: number, endTimestamp: number}){
        let initiator: SelectInitiator = 'details';

        if(!range) {
            this.selectIntervalIndex(initiator,{ L: null, P: null, U: null});
            return;
        }

        this.setDetailsTab(initiator, true);
        this.ActivityService.calculateRange(this.activity.header.id, range.startTimestamp, range.endTimestamp, [{
                type: 'U',
                startTimestamp: range.startTimestamp,
                endTimestamp: range.endTimestamp
            }])
            .then(response => {
                //this.activity.completeInterval(response.intervals.filter(i => i.type === 'U')[0]);
                this.activity.intervals.add(response.intervals.filter(i => i.type === 'U'));
                //this.activity.updateIntervals();
                this.selectIntervalIndex(initiator,{
                    L: null,
                    P: null,
                    U: [(this.activity.intervals.U && this.activity.intervals.U.length - 1) || 0]});
            }, error => {
                this.message.toastInfo(error);
                this.setDetailsTab(initiator, false);
            });
    }

    clearUserInterval():void{
        let initiator: SelectInitiator = 'details';
        this.selectIntervalIndex(initiator,{ L: null, P: null, U: null});
    }

    setDetailsTab(initiator: SelectInitiator, loading: boolean):void {
        this.isLoadingRange = loading;
        this[initiator + 'SelectChangeCount']++; // обвновляем компоненты

        if(this.activity.isStructured && this.selectedTab !== HeaderStructuredTab.Details && this.activity.auth.isPro) {
            this.selectedTab = HeaderStructuredTab.Details;
        }
        if(!this.activity.isStructured && this.selectedTab !== HeaderTab.Details && this.activity.auth.isPro) {
            this.selectedTab = HeaderTab.Details;
        }

        if(initiator === 'details' || initiator === 'splits') {
            this.$scope.$evalAsync();
        }
    }

    onReset(mode: string) {
        if (this.template) {
            this.onCancel();
        }

        this.mode = mode;
        if(mode === 'post') {
            this.onCancel();
        } else {
            if(this.activity.isStructured && this.activity.activityHeader.intervals.some(i => i.type === 'P')) {
                this.onCancel();
            } else {
                let tempDetails: ActivityDetails = this.activity.details || null;
                let tempIntervalDetails: Array<ActivityIntervalL> = this.activity.intervals.L || null;
                this.activity.prepare();

                if(tempDetails) {
                    this.activity.details = tempDetails;
                }

                if(tempIntervalDetails) {
                    this.activity.intervals.add(tempIntervalDetails);
                }

                this.structuredMode = this.activity.isStructured;
            }
        }
    }

    // Функции можно было бы перенсти в компонент Календаря, но допускаем, что компоненты Активность, Измерения и пр.
    // могут вызваны из любого другого представления
    onSave() {
        this.inAction = true;
        if (this.activity.view.isPost) {
            let athletes: Array<{profile: IUserProfile, active: boolean}> = [];
            athletes.push(...this.forAthletes.filter(athlete => athlete.active));
            athletes.forEach(athlete => {
                let activity = copy(this.activity);
                if(this.recalculateMode) {
                    activity.intervals.PW.completeAbsoluteValue(athlete.profile.trainingZones, this.activity.header.sportBasic);
                    //TODO intervalP
                }
                //console.log('post', athlete.profile, athlete.active)
                this.CalendarService.postItem(activity.build(profileShort(athlete.profile))) //TODO переделать в Promise.all
                    .then((response)=> {
                        this.activity.compile(response);// сохраняем id, revision в обьекте
                        this.message.toastInfo('activityCreated');
                        this.onAnswer({formMode: FormMode.Post, item: this.activity.build()});
                    }, error => this.message.toastError(error))
                    .then(() => this.inAction = false);
            });
        }
        if (this.activity.view.isPut) {
            this.CalendarService.putItem(this.activity.build())
                .then((response)=> {
                    this.activity.compile(response); // сохраняем id, revision в обьекте
                    this.message.toastInfo('activityUpdated');
                    this.onAnswer({formMode: FormMode.Put, item: this.activity.build()});
                }, error => this.message.toastError(error))
                .then(() => this.inAction = false);
        }
    }

    onDelete() {
        this.dialogs.confirm({ text: this.activity.hasIntervalDetails ? 'dialogs.deleteActualActivity' :'dialogs.deletePlanActivity' })
        .then(() => this.CalendarService.deleteItem('F', [this.activity.calendarItemId]))
        .then((response)=> {
            this.onAnswer({formMode: FormMode.Delete, item: this.activity.build()});
            this.message.toastInfo('activityDeleted');
        }, (error) => {
            if (error) {
                this.message.toastError(error);
            }
        });
    }

    /**
     * Запрос удаление шаблона тренировки
     */
    deleteTemplate (): void {
        debugger;
        if (!this.activity.view.isTemplate || !this.options.templateOptions.templateId) { return; }
        this.ReferenceService.deleteActivityTemplate(this.options.templateOptions.templateId)
            .then(() => this.message.toastInfo('templateDeleted'))
            .then(() => this.onAnswer({formMode: FormMode.Delete, item: this.activity.build()}),
                (error) => {
                    this.message.toastError(error);
                    this.onCancel();
                });
    }

    onSaveTrainingPlanActivity(): void {
        this.inAction = true;

        if (this.activity.view.isPost) {
            this.trainingPlansService.postItem(this.options.trainingPlanOptions.planId, this.activity.build(), true)
                .then((response)=> {
                    this.activity.compile(response);// сохраняем id, revision в обьекте
                    this.message.toastInfo('activityCreated');
                    this.onAnswer({formMode: FormMode.Post, item: this.activity.build()});
                }, error => this.message.toastError(error))
                .then(() => this.inAction = false);
        } else if (this.activity.view.isPut) {
            this.trainingPlansService.putItem(this.options.trainingPlanOptions.planId, this.activity.build(), true)
                .then((response)=> {
                    this.activity.compile(response);// сохраняем id, revision в обьекте
                    this.message.toastInfo('activityUpdated');
                    this.onAnswer({formMode: FormMode.Put, item: this.activity.build()});
                }, error => this.message.toastError(error))
                .then(() => this.inAction = false);
        }
    }

    delete (): void {
        if (this.activity.view.isTemplate) {
            this.deleteTemplate();
        } else if (this.activity.view.isTrainingPlan) {
            this.deleteTrainingPlanActivity();
        } else {
            this.onDelete();
        }
    }

    deleteTrainingPlanActivity (): void {
        this.trainingPlansService.deleteItem(this.options.trainingPlanOptions.planId, this.activity.build())
            .then((response)=> {
                this.onAnswer({formMode: FormMode.Delete, item: this.activity.build()});
                this.message.toastInfo('activityDeleted');
            }, (error) => {
                if (error) {
                    this.message.toastError(error);
                }
            });
    }

    onSaveTemplate() {
        if (!this.activity.view.isTemplate) {
            this.onCancel();
        }
        this.activity.build();
        if (this.activity.view.isPost) {
            this.ReferenceService.postActivityTemplate(
                null,
                this.activity.header.category.id,
                this.options.templateOptions.groupProfile && this.options.templateOptions.groupProfile.groupId,
                this.code,
                this.activity.intervals.PW.trainersPrescription,
                this.options.templateOptions.favourite,
                this.activity.intervals.buildTemplate())
                .then(response => {
                    this.activity.compile(response);// сохраняем id, revision в обьекте
                    this.message.toastInfo('activityTemplateCreated');
                    this.onAnswer({response: {type:'post', item:this.activity}});
                }, error => this.message.toastError(error));
        }

        if (this.activity.view.isPut) {
            this.ReferenceService.putActivityTemplate(
                this.options.templateOptions.templateId,
                this.activity.header.category.id,
                this.options.templateOptions.groupProfile && this.options.templateOptions.groupProfile.groupId,
                null,
                this.code,
                this.activity.intervals.PW.trainersPrescription,
                this.options.templateOptions.favourite,
                this.options.templateOptions.visible,
                this.activity.intervals.buildTemplate())
                .then(response => {
                    this.activity.compile(response);// сохраняем id, revision в обьекте
                    this.message.toastInfo('activityTemplateCreated');
                    this.onAnswer({response: {type:'post', item:this.activity}});
                }, error => this.message.toastError(error));
        }
    }

	/**
     * Обновление данных из формы ввода/редактирования activity-assignment
     */
    updateAssignment(plan:IActivityIntervalPW, actual:ICalcMeasures) {

        this.activity.intervals.PW.update(plan);
        this.activity.intervals.W.update({calcMeasures: actual});
        //this.activity.updateIntervals();
    }

    get code () {
        if (this.activity.view.isTemplate) {
            let sport = this.activity.header.sportBasic;
            return this.options.templateOptions.code ||
                nameFromInterval(this.$translate) (this.activity.intervals.PW, sport);
        } else {
            return this.options.templateOptions.code;
        }
    }

    set code (value) {
        if (value !== this.code) {
            this.options.templateOptions.code = value;
        }
    }

    toTemplate (e: Event) {
        let { code, activityHeader } = this.activity;
        let sport = activityHeader.activityType.typeBasic;
        let activityCode = code || nameFromInterval(this.$translate) (this.activity.intervals.PW, sport);
        let description = this.activity.intervals.PW.trainersPrescription;
        let { activityCategory, activityType, intervals } = activityHeader;

        let template = <any> {
            code: activityCode,
            description: description,
            favourite: false,
            visible: true,
            activityCategory: activityCategory,
            userProfileCreator: this.options.currentUser,
            content: [this.activity.intervals.PW, ...this.activity.intervals.P, ...this.activity.intervals.G]
        };

        let templateDialogOptions: ICalendarItemDialogOptions = Object.assign({}, this.options, {
            formMode: FormMode.Post,
            templateMode: true,
            templateOptions: {
                templateId: null,
                code: null,
                visible: true,
                favourite: false,
                groupProfile: null
            }
        });

        //return this.$mdDialog.show(templateDialog('post', template, this.options.owner));
        this.calendarDialog.activity(e, templateDialogOptions, templateToActivity(template))
            .then(() => { debugger; });
    }

    get isIonic (): boolean {
        return window.hasOwnProperty('ionic');
    }

}

export const CalendarItemActivityComponent: IComponentOptions = {
    bindings: {
        date: '<', // в режиме создания передает дату календаря
        activityType: '<', // если создание идет через wizard, то передаем тип тренировки
        activityCategory: '<',
        club: '<',
        data: '<', // в режиме просмотр/изменение передает данные по тренировке из календаря
        options: '<',
        mode: '<', // режим: созадние, просмотр, изменение
        user: '<', // пользователь - владелец календаря
        tab: '<', // вкладка по-умолчанию
        template: '=?',
        onCancel: '&',
        onAnswer: '&'
    },
    require: {
        //calendar: '^calendar'
    },
    transclude: true,
    controller: CalendarItemActivityCtrl,
    template: require('./calendar-item-activity.component.html') as string
};

export default CalendarItemActivityComponent;