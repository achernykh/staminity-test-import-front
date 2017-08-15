import { Observable, Subject } from "rxjs/Rx";
import './calendar-item-activity.component.scss';
import { IComponentOptions, IComponentController, IFormController,IPromise, IScope, merge} from 'angular';
import moment from 'moment/src/moment.js';
import {CalendarService} from "../../calendar/calendar.service";
import UserService from "../../core/user.service";
import ActivityService from "../../activity/activity.service";
import {IMessageService} from "../../core/message.service";
import {
    IActivityHeader, IActivityDetails, IActivityIntervalPW,
    IActivityMeasure, ICalcMeasures, IActivityType, IActivityIntervalW
} from "../../../../api/activity/activity.interface";
import { IActivityCategory, IActivityTemplate } from '../../../../api/reference/reference.interface';
import SessionService from "../../core/session.service";
import {IUserProfileShort, IUserProfile} from "../../../../api/user/user.interface";
import {IGroupProfileShort} from '../../../../api/group/group.interface';
import {nameFromInterval} from "../../reference/reference.datamodel";
import {Activity} from "../../activity/activity.datamodel";
import {CalendarCtrl} from "../../calendar/calendar.component";
import {activityTypes, getType} from "../../activity/activity.constants";
import {IAuthService} from "../../auth/auth.service";
import ReferenceService from "../../reference/reference.service";
import {templateDialog, TemplateDialogMode} from "../../reference/template-dialog/template.dialog";
import {ActivityDetails} from "../../activity/activity-datamodel/activity.details";
import {FtpState} from "../../activity/components/assignment/assignment.component";

const profileShort = (user: IUserProfile):IUserProfileShort => ({userId: user.userId, public: user.public});

enum HeaderTab {
    Overview,
    Details,
    Zones,
    Chat
};

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
    onAnswer: (response: Object) => IPromise<void>;
    onCancel: () => IPromise<void>;

    private showSelectAthletes: boolean = false;
    private forAthletes: Array<{profile: IUserProfileShort, active: boolean}> = [];

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

    private headerSelectChangeCount: number = 0; // счетчик изменений выбора интервала в панели Заголовок
    private detailsSelectChangeCount: number = 0; // счетчик изменений выбора интервала в панели Детали
    private splitsSelectChangeCount: number = 0;
    private isLoadingRange: boolean = false; // индиактор загрузки результатов calculateActivityRange

    private selectedTab: number = 0; // Индекс панели закладок панели заголовка тренировки
    public currentUser: IUserProfile = null;
    public isOwner: boolean; // true - если пользователь владелец тренировки, false - если нет
    public isCreator: boolean;
    public isPro: boolean;
    public isMyCoach: boolean;

    public isLoadingDetails: boolean = false;
    private inAction: boolean = false; // true - форма на стороне бэкенд, false - на стороне frontend

    private activityForm: IFormController;
    private calendar: CalendarCtrl;
    private types: Array<IActivityType> = [];
    private destroy = new Subject();

    static $inject = ['$scope', '$translate', 'CalendarService','UserService','SessionService','ActivityService','AuthService',
        'message','$mdMedia','$mdDialog','dialogs', 'ReferenceService'];

    constructor(
        private $scope: IScope,
        private $translate,
        private CalendarService: CalendarService,
        private UserService: UserService,
        private SessionService: SessionService,
        private ActivityService: ActivityService,
        private AuthService: IAuthService,
        private message: IMessageService,
        private $mdMedia: any,
        private $mdDialog: any,
        private dialogs: any,
        private ReferenceService: ReferenceService) {

    }

    $onChanges(changes) {
        if(changes.mode && !changes.mode.isFirstChange()) {
            this.changeMode(changes.mode);
        }
    }

    $onInit() {
        this.currentUser = this.SessionService.getUser();

        if (this.mode === 'post' && !this.template) {
            this.data = {
                isTemplate: this.template,
                calendarItemType: 'activity',
                activityHeader: {
                    activityType: this.activityType || {id: null, code: null, typeBasic: null},
                    activityCategory: this.activityCategory || null
                },
                dateStart: this.date,
                dateEnd: this.date,
                userProfileOwner: profileShort(this.user),
                userProfileCreator: profileShort(this.currentUser),
                groupProfile: this.club
            };
        }

        this.activity = new Activity(this.data);

        this.types = activityTypes; // Список видов спорта
        this.structuredMode = this.activity.structured;

        this.prepareDetails();
        this.prepareAuth();
        this.prepareAthletesList();
        this.prepareCategories();
        this.prepareTabPosition();
    }

    prepareDetails(){
        if (!this.template) {
            //Получаем детали по тренировке загруженной из внешнего источника
            if (this.mode !== 'post' && this.activity.intervalW.actualDataIsImported) {
                this.ActivityService.getIntervals(this.activity.activityHeader.activityId)
                    .then(response => this.activity.intervals.add(response),
                        error => this.message.toastError('errorCompleteIntervals'))
                    .then(() => this.activity.updateIntervals())
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
        this.selectedTab = (this.tab === 'chat' && this.activity.intervalW.actualDataIsImported && 3) ||
            (this.tab === 'chat' && !this.activity.intervalW.actualDataIsImported && 2) || 0;
    }

    prepareCategories(){
        if (this.mode === 'put' || this.mode === 'post' || this.mode === 'view') {
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
        }
    }

    prepareAuth(){
        this.isOwner = this.activity.userProfileOwner.userId === this.currentUser.userId;
        this.isCreator = this.activity.userProfileCreator.userId === this.currentUser.userId;
        this.isPro = this.AuthService.isActivityPro();
        this.isMyCoach = this.activity.userProfileCreator.userId !== this.currentUser.userId;
    }

    /**
     * @description Подготовка перечня атлетов достунпых для планирования
     */
    prepareAthletesList() {
        if(this.currentUser.connections.hasOwnProperty('allAthletes') && this.currentUser.connections.allAthletes){
            this.forAthletes = this.currentUser.connections.allAthletes.groupMembers
                .map(user => ({profile: user, active: user.userId === this.user.userId}));

        }

        if(this.forAthletes.length === 0 || !this.forAthletes.some(athlete => athlete.active)) {
            this.forAthletes.push({profile: profileShort(this.user), active: true});
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
     */
    selectAthletes(response){
        this.showSelectAthletes = false;
        this.forAthletes = response;
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
                    let data = this.activity.header.intervals.filter(i => i.type === type);
                    this.selectionIndex[type].forEach(i => intervals.push({
                        type: type,
                        startTimestamp: data[i].startTimestamp,
                        endTimestamp: data[i].endTimestamp
                    }));
                }
            });

            this.ActivityService.calculateRange(this.activity.id, null, null, intervals)
                .then(response => {
                    this.multiSelection = true;
                    this.multiSelectionInterval = response.intervals.filter(i => i.type === 'W')[0];
                    //this.activity.completeInterval(response.intervals.filter(i => i.type === 'U')[0]);
                    //this.selectIntervalIndex(initiator,{ L: null, P: null, U: [(this.activity.intervalU && this.activity.intervalU.length-1) || 0]});
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
                let intervals = this.activity.header.intervals.filter(i => i.type === type);
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
        this.ActivityService.calculateRange(this.activity.id, range.startTimestamp, range.endTimestamp, [{
                type: 'U',
                startTimestamp: range.startTimestamp,
                endTimestamp: range.endTimestamp
            }])
            .then(response => {
                this.activity.completeInterval(response.intervals.filter(i => i.type === 'U')[0]);
                this.selectIntervalIndex(initiator,{ L: null, P: null, U: [(this.activity.intervalU && this.activity.intervalU.length-1) || 0]});
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
        if (this.selectedTab !== HeaderTab.Details && this.isPro) {
            this.selectedTab = HeaderTab.Details;
        }
        if(initiator === 'details' || initiator === 'splits') {
            this.$scope.$evalAsync();
            /**if(!this.$scope.$$phase){
                this.$scope.$apply();
            }**/
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
            this.activity.prepare();
        }
    }

    // Функции можно было бы перенсти в компонент Календаря, но допускаем, что компоненты Активность, Измерения и пр.
    // могут вызваны из любого другого представления
    onSave() {
        this.inAction = true;
        if (this.mode === 'post') {
            let athletes: Array<{profile: IUserProfileShort, active: boolean}> = [];
            athletes.push(...this.forAthletes.filter(athlete => athlete.active));
            athletes.forEach(athlete =>
                //console.log('post', athlete.profile, athlete.active)
                this.CalendarService.postItem(this.activity.build(athlete.profile)) //TODO переделать в Promise.all
                    .then((response)=> {
                        this.activity.compile(response);// сохраняем id, revision в обьекте
                        this.message.toastInfo('activityCreated');
                        this.onAnswer({response: {type:'post', item:this.activity.build()}});
                    }, error => this.message.toastError(error))
                    .then(() => this.inAction = false)
            );
        }
        if (this.mode === 'put') {
            this.CalendarService.putItem(this.activity.build())
                .then((response)=> {
                    this.activity.compile(response); // сохраняем id, revision в обьекте
                    this.message.toastInfo('activityUpdated');
                    this.onAnswer({response: {type:'put',item:this.activity.build()}});
                }, error => this.message.toastError(error))
                .then(() => this.inAction = false);
        }
    }

    onDelete() {
        this.dialogs.confirm(this.activity.hasImportedData ? 'dialogs.deleteActualActivity' :'dialogs.deletePlanActivity')
            .then(() => this.CalendarService.deleteItem('F', [this.activity.calendarItemId])
                .then((response)=> {
                    this.onAnswer({response: {type:'delete',item:this.activity.build()}});
                    this.message.toastInfo('activityDeleted');
                }, error => this.message.toastError(error)));
    }

    onSaveTemplate() {
        if (!this.template) {
            this.onCancel();
        }

        this.activity.build();

        let name = this.name;
        let description = this.activity.intervalPW.trainersPrescription;
        let { templateId, code, favourite, visible, header, groupProfile } = this.activity;
        let groupId = groupProfile && groupProfile.groupId;
        let { activityCategory, intervals } = header;
        let content = [
            ...intervals.filter(i => i.type === 'pW'), 
            ...intervals.filter(i => i.type === 'P')
        ]
        .map((interval) => ({ ...interval, calcMeasures: undefined }));

        if (this.mode === 'post') {
            this.ReferenceService.postActivityTemplate(null, activityCategory.id, groupId, name, description, favourite, content)
                .then(response => {
                    this.activity.compile(response);// сохраняем id, revision в обьекте
                    this.message.toastInfo('activityTemplateCreated');
                    this.onAnswer({response: {type:'post', item:this.activity.build()}});
                }, error => this.message.toastError(error));
        }

        if (this.mode === 'put' || this.mode === 'view') {
            this.ReferenceService.putActivityTemplate(templateId, activityCategory.id, groupId, null, name, description, favourite, visible, content)
                .then(response => {
                    this.activity.compile(response);// сохраняем id, revision в обьекте
                    this.message.toastInfo('activityTemplateCreated');
                    this.onAnswer({response: {type:'post', item:this.activity.build()}});
                }, error => this.message.toastError(error));
        }
    }

	/**
     * Обновление данных из формы ввода/редактирования activity-assignment
     */
    updateAssignment(plan:IActivityIntervalPW, actual:ICalcMeasures) {

        Object.assign(this.activity.intervalPW, plan);
        //this.activity.intervalPW = plan;

        /*this.activity.intervalPW.durationMeasure = (!!plan.distance['durationValue'] && 'distance') ||
            (!!plan.movingDuration['durationValue'] && 'movingDuration') || null;

        this.activity.intervalPW.durationValue =
            (plan[this.activity.intervalPW.durationMeasure] && plan[this.activity.intervalPW.durationMeasure]['durationValue']) || null;

        this.activity.intervalPW.intensityMeasure = (!!plan.heartRate['intensityLevelFrom'] && 'heartRate') ||
            (!!plan.speed['intensityLevelFrom'] && 'speed') || (!!plan.power['intensityLevelFrom'] && 'power') || null;

        this.activity.intervalPW.intensityLevelFrom =
            (plan[this.activity.intervalPW.intensityMeasure] && plan[this.activity.intervalPW.intensityMeasure]['intensityLevelFrom']) || null;
        this.activity.intervalPW.intensityLevelTo =
            (plan[this.activity.intervalPW.intensityMeasure] && plan[this.activity.intervalPW.intensityMeasure]['intensityLevelTo']) || null;

        this.activity.intervalPW.intensityByFtpFrom =
            (plan[this.activity.intervalPW.intensityMeasure] && plan[this.activity.intervalPW.intensityMeasure]['intensityByFtpFrom']) || null;
        this.activity.intervalPW.intensityByFtpTo =
            (plan[this.activity.intervalPW.intensityMeasure] && plan[this.activity.intervalPW.intensityMeasure]['intensityByFtpTo']) || null;*/

        this.activity.intervalW.calcMeasures = actual;
    }

    get name () {
        if (this.template) {
            let { code, intervalPW, activityHeader } = this.activity;
            let sport = activityHeader.activityType.typeBasic;
            return code || nameFromInterval(this.$translate) (intervalPW, sport);
        } else {
            return this.activity.code;
        }
    }

    set name (value) {
        if (value !== this.name) {
            this.activity.code = value;
        }
    }

    toTemplate () {
        let { code, intervalPW, activityHeader } = this.activity;
        let sport = activityHeader.activityType.typeBasic;
        let activityCode = code || nameFromInterval(this.$translate) (intervalPW, sport);
        let description = intervalPW.trainersPrescription;
        let { activityCategory, activityType, intervals } = activityHeader;

        let template = <any> {
            code: activityCode,
            description: description,
            favourite: false,
            visible: true,
            activityCategory: activityCategory,
            userProfileCreator: this.user,
            content: intervals
        };
        
        return this.$mdDialog.show(templateDialog('post', template, this.user));
    }
}

const CalendarItemActivityComponent: IComponentOptions = {
    bindings: {
        date: '<', // в режиме создания передает дату календаря
        activityType: '<', // если создание идет через wizard, то передаем тип тренировки
        activityCategory: '<',
        club: '<',
        data: '<', // в режиме просмотр/изменение передает данные по тренировке из календаря
        mode: '<', // режим: созадние, просмотр, изменение
        user: '<', // пользователь - владелец календаря
        tab: '<', // вкладка по-умолчанию
        popup: '=',
        template: '=',
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