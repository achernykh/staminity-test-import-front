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
import {IActivityCategory} from '../../../../api/reference/reference.interface';
import SessionService from "../../core/session.service";
import {IUserProfileShort, IUserProfile} from "../../../../api/user/user.interface";
import {Activity} from "../../activity/activity.datamodel";
import {CalendarCtrl} from "../../calendar/calendar.component";
import {activityTypes, getType} from "../../activity/activity.constants";
import {IAuthService} from "../../auth/auth.service";

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
    details: IActivityDetails;
    mode: string;
    activity: Activity;
    user: IUserProfile;
    tab: string;
    popup: boolean;
    onAnswer: (response: Object) => IPromise<void>;
    onCancel: () => IPromise<void>;

    private showSelectAthletes: boolean = false;
    private forAthletes: Array<{profile: IUserProfileShort, active: boolean}> = [];

    public structuredMode: boolean = false;
    public ftpMode: boolean = false;

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
    private activityForm: IFormController;
    private calendar: CalendarCtrl;
    private types: Array<IActivityType> = [];

    static $inject = ['$scope','CalendarService','UserService','SessionService','ActivityService','AuthService',
        'message','$mdMedia','dialogs'];

    constructor(
        private $scope: IScope,
        private CalendarService: CalendarService,
        private UserService: UserService,
        private SessionService: SessionService,
        private ActivityService: ActivityService,
        private AuthService: IAuthService,
        private message: IMessageService,
        private $mdMedia: any,
        private dialogs: any) {

    }

    $onChanges(changes) {
        if(changes.mode && !changes.mode.isFirstChange()) {
            this.changeMode(changes.mode);
        }
    }

    $onInit() {
        this.currentUser = this.SessionService.getUser();
        if (this.mode === 'post') {
            this.data = {
                calendarItemType: 'activity',
                activityHeader: {
                    activityType: this.activityType || {id: null, code: null, typeBasic: null},
                },
                dateStart: this.date,
                dateEnd: this.date,
                userProfileOwner: profileShort(this.user),
                userProfileCreator: profileShort(this.currentUser)
            };
        }

        this.activity = new Activity(this.data, this.mode);
        //this.activity.prepare();

        //Получаем детали по тренировке загруженной из внешнего источника
        if (this.mode !== 'post' && this.activity.intervalW.actualDataIsImported) {
            this.ActivityService.getIntervals(this.activity.activityHeader.activityId)
                .then(response => {
                    this.activity.completeIntervals(response);
                    this.selectedTab = (this.tab === 'chat' && this.activity.intervalW.actualDataIsImported && 3) ||
                        (this.tab === 'chat' && !this.activity.intervalW.actualDataIsImported && 2) || 0;
                }, error => this.message.toastError('errorCompleteIntervals'));

            this.ActivityService.getDetails2(this.data.activityHeader.activityId)
                .then(response => {
                    this.activity.completeDetails(this.details = response);
                    this.isLoadingDetails = false;
                }, error => this.message.toastError('errorCompleteDetails'));
        }


        this.types = activityTypes; // Список видов спорта
        this.isOwner = this.activity.userProfileOwner.userId === this.currentUser.userId;
        this.isCreator = this.activity.userProfileCreator.userId === this.currentUser.userId;
        this.isPro = this.AuthService.isActivityPro();
        this.isMyCoach = this.activity.userProfileCreator.userId !== this.currentUser.userId;
        this.structuredMode = this.activity.structured;
        this.selectedTab = (this.tab === 'chat' && this.activity.intervalW.actualDataIsImported && 3) ||
            (this.tab === 'chat' && !this.activity.intervalW.actualDataIsImported && 2) || 0;

        // Список категорий тренировки
        if (this.mode === 'put' || this.mode === 'post') {
            this.ActivityService.getCategory()
                .then(list => this.activity.categoriesList = list,
                    error => this.message.toastError(error));
        }

        // Перечень атлетов тренера доступных для планирования
        if(this.currentUser.connections.hasOwnProperty('allAthletes')){
            this.forAthletes = this.currentUser.connections.allAthletes.groupMembers
                .map(user => ({profile: user, active: user.userId === this.user.userId}));

        }
        if(this.forAthletes.length === 0 || !this.forAthletes.some(athlete => athlete.active)) {
            this.forAthletes.push({profile: profileShort(this.user), active: true});
        }
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
        debugger;
        this.showSelectAthletes = false;
        this.forAthletes = response;
    }

    /**
     * Возвращает н-ого атлета для планирования тренировки, необходимо для вывода автарки в заголовки тренировки
     * @param pos
     * @returns {IUserProfileShort}
     */
    firstAthlete(pos: number){
        return this.forAthletes.filter(athlete => athlete.active)[pos].profile;
    }

    /**
     * Указывает, что тренировка планируется для более чем одного атлета
     * @returns {boolean}
     */
    multiAthlete(){
        return this.forAthletes.filter(athlete => athlete.active).length > 1;
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
        //debugger;
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
        this.mode = mode;
        if(mode === 'post') {
            this.onCancel();
        } else {
            this.activity.prepare(this.mode);
        }
    }

    // Функции можно было бы перенсти в компонент Календаря, но допускаем, что компоненты Активность, Измерения и пр.
    // могут вызваны из любого другого представления
    onSave() {

        if (this.mode === 'post') {
            let athletes: Array<{profile: IUserProfileShort, active: boolean}> = [];
            athletes.push(...this.forAthletes.filter(athlete => athlete.active));
            athletes.forEach(athlete =>
                //console.log('post', athlete.profile, athlete.active)
                this.CalendarService.postItem(this.activity.build(athlete.profile))
                    .then((response)=> {
                        this.activity.compile(response);// сохраняем id, revision в обьекте
                        this.message.toastInfo('activityCreated');
                        this.onAnswer({response: {type:'post', item:this.activity.build()}});
                    }, error => this.message.toastError(error))
            );
        }
        if (this.mode === 'put') {
            this.CalendarService.putItem(this.activity.build())
                .then((response)=> {
                    this.activity.compile(response); // сохраняем id, revision в обьекте
                    this.message.toastInfo('activityUpdated');
                    this.onAnswer({response: {type:'put',item:this.activity.build()}});
                }, error => this.message.toastError(error));
        }
    }

    onDelete() {
        this.dialogs.confirm(this.activity.hasImportedData ? 'deleteActualActivity' :'deletePlanActivity')
            .then(() => this.CalendarService.deleteItem('F', [this.activity.calendarItemId])
                .then((response)=> {
                    this.onAnswer({response: {type:'delete',item:this.activity.build()}});
                    this.message.toastInfo('activityDeleted');
                }, error => this.message.toastError(error)));
    }

	/**
     * Обновление данных из формы ввода/редактирования activity-assignment
     */
    updateAssignment(plan:IActivityIntervalPW, actual:ICalcMeasures) {

        debugger;
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
}

const CalendarItemActivityComponent: IComponentOptions = {
    bindings: {
        date: '<', // в режиме создания передает дату календаря
        activityType: '<', // если создание идет через wizard, то передаем тип тренировки
        data: '<', // в режиме просмотр/изменение передает данные по тренировке из календаря
        mode: '<', // режим: созадние, просмотр, изменение
        user: '<', // пользователь - владелец календаря
        tab: '<', // вкладка по-умолчанию
        popup: '=',
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