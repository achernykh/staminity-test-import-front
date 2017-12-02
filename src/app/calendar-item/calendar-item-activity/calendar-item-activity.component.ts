import { copy, IComponentController, IComponentOptions, IFormController, INgModelController, IPromise, IScope, merge} from "angular";
import moment from "moment/src/moment.js";
import { Observable, Subject } from "rxjs/Rx";
import {
    IActivityCategory,
    IActivityDetails, IActivityHeader,
    IActivityIntervalPW, IActivityIntervalW,
    IActivityMeasure, IActivityTemplate, IActivityType,
    ICalcMeasures, IGroupProfileShort, IUserProfile, IUserProfileShort,
} from "../../../../api";
import {ICalendarItem} from "../../../../api/calendar/calendar.interface";
import {ActivityDetails} from "../../activity/activity-datamodel/activity.details";
import {ActivityIntervalL} from "../../activity/activity-datamodel/activity.interval-l";
import {ActivityIntervalP} from "../../activity/activity-datamodel/activity.interval-p";
import {ActivityIntervalPW} from "../../activity/activity-datamodel/activity.interval-pw";
import {ActivityIntervals} from "../../activity/activity-datamodel/activity.intervals";
import {activityTypes, getType} from "../../activity/activity.constants";
import {Activity} from "../../activity/activity.datamodel";
import ActivityService from "../../activity/activity.service";
import {FtpState} from "../../activity/components/assignment/assignment.component";
import {IAuthService} from "../../auth/auth.service";
import {CalendarCtrl} from "../../calendar/calendar.component";
import {CalendarService} from "../../calendar/calendar.service";
import {SessionService} from "../../core";
import {IMessageService} from "../../core/message.service";
import UserService from "../../core/user.service";
import {nameFromInterval} from "../../reference/reference.datamodel";
import {getOwner, ReferenceFilterParams, templatesFilters} from "../../reference/reference.datamodel";
import ReferenceService from "../../reference/reference.service";
import {templateDialog, TemplateDialogMode} from "../../reference/template-dialog/template.dialog";
import { entries, filter, fold, groupBy, isUndefined, keys, last, log, orderBy, pick, pipe, prop } from "../../share/util.js";
import {filtersToPredicate} from "../../share/utility/filtering";
import "./calendar-item-activity.component.scss";

const profileShort = (user: IUserProfile): IUserProfileShort => ({userId: user.userId, public: user.public});

export enum HeaderTab {
    Overview,
    Details,
    Zones,
    Chat,
};

export enum HeaderStructuredTab {
    Overview,
    Segments,
    Details,
    Zones,
    Chat,
}

export interface ISelectionIndex {
    L: number[];
    P: number[];
    U: number[];
}

export interface ISelectionTimestamp {
    startTimestamp: number;
    endTimestamp: number;
}

export type SelectInitiator = "header" | "details" | "splits";

export class CalendarItemActivityCtrl implements IComponentController {

    public date: Date;
    public data: any;
    public activityType: IActivityType;
    public activityCategory: IActivityCategory;
    public details: IActivityDetails;
    public mode: string;
    public activity: Activity;
    public user: IUserProfile;
    public tab: string;
    public popup: boolean;
    public template: boolean = false; // режим создания, изменения шаблона
    public club: IGroupProfileShort;
    public onAnswer: (response: Object) => IPromise<void>;
    public onCancel: () => IPromise<void>;

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

    private selectedTimestamp: any[] = [];
    private selectedIntervalIndex: ISelectionIndex = { L: null, P: null, U: null}; //todo delete
    private selectionIndex: ISelectionIndex = { L: null, P: null, U: null};
    private selectionTimestamp: ISelectionTimestamp[] = [];
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
    public templates: IActivityTemplate[] = []; // набор шаблоново тренировок пользователя
    private destroy: Subject<void> = new Subject<void>();
    private templatesByOwner: { [owner: string]: IActivityTemplate[] }; // шаблоны тренировки для выдчи пользователю в разрезе свои, тренера, системные и пр..
    public templateByFilter: boolean = false; // false - нет шаблонов в соответствии с фильтром, true - есть шаблоны

    public selectedTab: number = 0; // Индекс панели закладок панели заголовка тренировки

    public currentUser: IUserProfile = null;
    public isOwner: boolean; // true - если пользователь владелец тренировки, false - если нет
    public isCreator: boolean;
    public isPro: boolean;
    public isMyCoach: boolean;

    public isLoadingDetails: boolean = false;

    private activityForm: IFormController;
    private calendar: CalendarCtrl;
    private types: IActivityType[] = [];

    public static $inject = ["$scope", "$translate", "CalendarService", "UserService", "SessionService", "ActivityService", "AuthService",
        "message", "$mdMedia", "$mdDialog", "dialogs", "ReferenceService"];

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

    public $onChanges(changes) {
        if (changes.mode && !changes.mode.isFirstChange()) {
            this.changeMode(changes.mode);
        }
    }

    public $onInit() {
        this.currentUser = this.SessionService.getUser();

        if (this.mode === "post" && !this.template) {
            this.data = {
                isTemplate: this.template,
                calendarItemType: "activity",
                activityHeader: {
                    activityType: this.activityType || {id: null, code: null, typeBasic: null},
                    activityCategory: this.activityCategory || null,
                },
                dateStart: this.date,
                dateEnd: this.date,
                userProfileOwner: profileShort(this.user),
                userProfileCreator: profileShort(this.currentUser),
                groupProfile: this.club,
            };
        }

        this.activity = new Activity(this.data);

        this.types = activityTypes; // Список видов спорта
        this.structuredMode = this.activity.structured;
        this.ftpMode = this.template ? FtpState.On : FtpState.Off;

        this.prepareDetails();
        this.prepareAuth();
        this.prepareAthletesList();
        this.prepareCategories();
        this.prepareTemplates();
        this.prepareTabPosition();
    }

    public prepareDetails() {
        if (!this.template) {
            //Получаем детали по тренировке загруженной из внешнего источника
            if (this.mode !== "post" && this.activity.intervalW.actualDataIsImported) {
                const intervalsType: string[] = this.activity.structured ? ["L", "P", "G"] : ["L"];
                this.ActivityService.getIntervals(this.activity.activityHeader.activityId, intervalsType)
                    .then((response) => this.activity.intervals.add(response, "update"),
                        (error) => this.message.toastError("errorCompleteIntervals"))
                    .then(() => this.activity.updateIntervals())
                    .then(() => this.changeStructuredAssignment++)
                    .then(() => this.prepareTabPosition());

                this.ActivityService.getDetails(this.data.activityHeader.activityId)
                    .then((response: IActivityDetails) =>
                            this.activity.details = new ActivityDetails(response),
                        (error) => this.message.toastError("errorCompleteDetails"))
                    .then(() => this.isLoadingDetails = false);
            }
        }
    }

    public prepareTabPosition() {
        this.selectedTab = (this.tab === "chat" && this.activity.intervalW.actualDataIsImported && 3) ||
            (this.tab === "chat" && !this.activity.intervalW.actualDataIsImported && 2) || 0;
    }

    public changeTab(tab: string): void {
        this.selectedTab = this.structuredMode ? HeaderStructuredTab[tab] : HeaderTab[tab];
    }

    /**
     * Подготовка перечня категорий.
     * Актуальный список содержится в сервисе ReferenceService
     */
    public prepareCategories() {
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

    public prepareTemplates(): void {
        this.templates = this.ReferenceService.templates;
        this.activity.header.template = this.templates.filter((t) => t.id === this.activity.header.templateId)[0] || null;
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
     * Выбран шаблон тренировки
     * @param template
     */
    public onSelectTemplate(template: IActivityTemplate) {
        this.showSelectTemplate = false;
        this.activity.header.template = template;
        this.activity.intervals = new ActivityIntervals(template.content);
        this.activity.intervals.PW.completeAbsoluteValue(this.user.trainingZones, this.activity.sportBasic);
        this.activity.intervals.P.map((i) => i.completeAbsoluteValue(this.user.trainingZones, this.activity.sportBasic));
        this.activity.updateIntervals();
        this.structuredMode = this.activity.structured;
        this.templateChangeCount ++;
    }

    public prepareAuth() {
        this.isOwner = this.activity.userProfileOwner.userId === this.currentUser.userId;
        this.isCreator = this.activity.userProfileCreator.userId === this.currentUser.userId;
        this.isPro = this.AuthService.isActivityPro();
        this.isMyCoach = this.activity.userProfileCreator.userId !== this.currentUser.userId;
    }

    public updateFilterParams(): void {
        this.filterParams = {
            club: null,
            activityType: this.activity.header.activityType,
            category: this.activity.header.activityCategory,
        };

        const filters = pick(["club", "activityType", "category"]) (templatesFilters);

        this.templatesByOwner = pipe(
            filter(filtersToPredicate(filters, this.filterParams)),
            orderBy(prop("sortOrder")),
            groupBy(getOwner(this.user)),
        ) (this.templates);

        this.templateByFilter = Object.keys(this.templatesByOwner)
            .some((owner) => this.templatesByOwner[owner] && this.templatesByOwner[owner].length > 0);
    }

    /**
     * @description Подготовка перечня атлетов достунпых для планирования
     */
    public prepareAthletesList() {
        if (this.currentUser.connections.hasOwnProperty("allAthletes") && this.currentUser.connections.allAthletes) {
            this.forAthletes = this.currentUser.connections.allAthletes.groupMembers
                .filter((user) => user.hasOwnProperty("trainingZones"))
                .map((user) => ({profile: user, active: user.userId === this.user.userId}));

        }

        if (this.forAthletes.length === 0 || !this.forAthletes.some((athlete) => athlete.active)) {
            this.forAthletes.push({profile: this.user, active: true});
        }

        if (this.template && this.data && this.data.userProfileCreator) {
            this.forAthletes = [{ profile: this.data.userProfileCreator, active: true }];
        }
    }

    public $onDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    public changeMode(mode: string) {
        this.mode = mode;
        if (mode === "put" && !this.activity.categoriesList.length) {
            this.ActivityService.getCategory()
                .then((list) => this.activity.categoriesList = list,
                    (error) => this.message.toastError(error));
        }
    }

    /**
     * Функция получает выделенных атлетов для планирования трениовки
     * @param response
     * @param mode
     */
    public selectAthletes(response, mode: boolean) {
        this.showSelectAthletes = false;
        this.recalculateMode = mode;
        this.forAthletes = response;
    }

    /**
     * Возвращает н-ого атлета для планирования тренировки, необходимо для вывода автарки в заголовки тренировки
     * @param pos
     * @returns {IUserProfileShort}
     */
    public firstAthlete(pos: number) {
        return this.forAthletes && this.forAthletes.filter((athlete) => athlete.active)[pos].profile;
    }

    /**
     * Указывает, что тренировка планируется для более чем одного атлета
     * @returns {boolean}
     */
    public multiAthlete() {
        return this.forAthletes && this.forAthletes.filter((athlete) => athlete.active).length > 1;
    }

    public calculateActivityRange(nonContiguousMode: boolean): void {
        this.ActivityService.calculateRange(
            this.activity.id, null, null,
            [   this.activity.intervals.PW.prepareForCalculateRange(),
                ...this.activity.intervals.P.map((i) => i.prepareForCalculateRange()),
                ...this.activity.intervals.G.map((i) => i.prepareForCalculateRange())], nonContiguousMode)
            //.then(response => {debugger;}, error => {debugger;})
            .then((response) => this.activity.intervals.add(response.intervals, "update"),
                (error) => this.message.toastError("errorCompleteIntervals"))
            .then(() => this.activity.updateIntervals())
            .then(() => this.changeStructuredAssignment++);
    }

    /**
     * Установка выделения переданных индексов интервалов
     * @param initiator - 'header' | 'details'
     * @param selection - перечень индексов интервалов для выделения
     */
    public selectIntervalIndex(initiator: SelectInitiator, selection: ISelectionIndex) {
        console.log("changeSelectedInterval", initiator, selection);
        this.selectionIndex = selection; // устанавливаем выделение
        this.selectionTimestamp = this.calculateTimestampSelection(this.selectionIndex); //создаем выделение по времени

        if (((this.selectionIndex.P && this.selectionIndex.P.length) +
            (this.selectionIndex.U && this.selectionIndex.U.length) +
            (this.selectionIndex.L && this.selectionIndex.L.length)) > 1 ) {

            this.setDetailsTab(initiator, true);

            const intervals: Array<{type: string, startTimestamp: number, endTimestamp: number}> = [];
            Object.keys(this.selectionIndex).forEach((type) => {
                if (this.selectionIndex[type]) {
                    const data = this.activity.intervals.stack.filter((i) => i.type === type);
                    this.selectionIndex[type].forEach((i) => intervals.push({
                        type,
                        startTimestamp: data[i].startTimestamp,
                        endTimestamp: data[i].endTimestamp,
                    }));
                }
            });

            this.ActivityService.calculateRange(this.activity.id, null, null, intervals)
                .then((response) => {
                    this.multiSelection = true;
                    this.multiSelectionInterval = response.intervals.filter((i) => i.type === "W")[0];
                    //this.activity.completeInterval(response.intervals.filter(i => i.type === 'U')[0]);
                    //this.selectIntervalIndex(initiator,{ L: null, P: null, U: [(this.activity.intervalU && this.activity.intervalU.length-1) || 0]});
                }, (error) => {
                    this.message.toastInfo(error);
                });
        } else {
            this.multiSelection = false;
        }
        // по любому выделению инетрвала пользователя переходим на вкладку Детали
        this.setDetailsTab(initiator, false);
    }

    public calculateTimestampSelection(selection: ISelectionIndex) {
        const selectionTimestamp: ISelectionTimestamp[] = [];
        const types = Object.keys(selection);
        types.forEach((type) => {
            if (selection[type]) {
                const intervals = this.activity.intervals.stack.filter((i) => i.type === type);
                selection[type].forEach((i) => selectionTimestamp.push({
                    startTimestamp: intervals[i].startTimestamp,
                    endTimestamp: intervals[i].endTimestamp,
                }));
            }
        });
        return selectionTimestamp;
    }

    public addUserInterval(range: {startTimestamp: number, endTimestamp: number}) {
        const initiator: SelectInitiator = "details";

        if (!range) {
            this.selectIntervalIndex(initiator, { L: null, P: null, U: null});
            return;
        }

        this.setDetailsTab(initiator, true);
        this.ActivityService.calculateRange(this.activity.id, range.startTimestamp, range.endTimestamp, [{
                type: "U",
                startTimestamp: range.startTimestamp,
                endTimestamp: range.endTimestamp,
            }])
            .then((response) => {
                //this.activity.completeInterval(response.intervals.filter(i => i.type === 'U')[0]);
                this.activity.intervals.add(response.intervals.filter((i) => i.type === "U"));
                this.activity.updateIntervals();
                this.selectIntervalIndex(initiator, {
                    L: null,
                    P: null,
                    U: [(this.activity.intervalU && this.activity.intervalU.length - 1) || 0]});
            }, (error) => {
                this.message.toastInfo(error);
                this.setDetailsTab(initiator, false);
            });
    }

    public clearUserInterval(): void {
        const initiator: SelectInitiator = "details";
        this.selectIntervalIndex(initiator, { L: null, P: null, U: null});
    }

    public setDetailsTab(initiator: SelectInitiator, loading: boolean): void {
        this.isLoadingRange = loading;
        this[initiator + "SelectChangeCount"]++; // обвновляем компоненты

        if (this.activity.structured && this.selectedTab !== HeaderStructuredTab.Details && this.isPro) {
            this.selectedTab = HeaderStructuredTab.Details;
        }
        if (!this.activity.structured && this.selectedTab !== HeaderTab.Details && this.isPro) {
            this.selectedTab = HeaderTab.Details;
        }

        if (initiator === "details" || initiator === "splits") {
            this.$scope.$evalAsync();
        }
    }

    public onReset(mode: string) {
        if (this.template) {
            this.onCancel();
        }

        this.mode = mode;
        if (mode === "post") {
            this.onCancel();
        } else {
            if (this.activity.structured && this.activity.activityHeader.intervals.some((i) => i.type === "P")) {
                this.onCancel();
                //let hasRecalculated: boolean = this.activity.intervals.PW.hasRecalculate;
                //this.activity.intervals.P.map(i => i.reset());
                //this.activity.intervals.PW.reset();
                /**if(hasRecalculated) {
                    this.calculateActivityRange(false);
                } else {
                    this.activity.updateIntervals();
                    this.resetStructuredAssignment ++;
                }**/

                //this.activity.updateIntervals();
                //this.resetStructuredAssignment ++;

            } else {
                const tempDetails: ActivityDetails = this.activity.details || null;
                const tempIntervalDetails: ActivityIntervalL[] = this.activity.intervalL || null;
                this.activity.prepare();

                if (tempDetails) {
                    this.activity.details = tempDetails;
                }

                if (tempIntervalDetails) {
                    this.activity.intervals.add(tempIntervalDetails);
                }

                this.activity.updateIntervals();

                this.structuredMode = this.activity.structured;
            }
        }
    }

    // Функции можно было бы перенсти в компонент Календаря, но допускаем, что компоненты Активность, Измерения и пр.
    // могут вызваны из любого другого представления
    public onSave() {
        this.inAction = true;
        if (this.mode === "post") {
            const athletes: Array<{profile: IUserProfile, active: boolean}> = [];
            athletes.push(...this.forAthletes.filter((athlete) => athlete.active));
            athletes.forEach((athlete) => {
                const activity = copy(this.activity);
                if (this.recalculateMode) {
                    activity.intervals.PW.completeAbsoluteValue(athlete.profile.trainingZones, this.activity.sportBasic);
                    //TODO intervalP
                }
                //console.log('post', athlete.profile, athlete.active)
                this.CalendarService.postItem(activity.build(profileShort(athlete.profile))) //TODO переделать в Promise.all
                    .then((response) => {
                        this.activity.compile(response); // сохраняем id, revision в обьекте
                        this.message.toastInfo("activityCreated");
                        this.onAnswer({response: {type: "post", item: this.activity}});
                    }, (error) => this.message.toastError(error))
                    .then(() => this.inAction = false);
            });
        }
        if (this.mode === "put") {
            this.CalendarService.putItem(this.activity.build())
                .then((response) => {
                    this.activity.compile(response); // сохраняем id, revision в обьекте
                    this.message.toastInfo("activityUpdated");
                    this.onAnswer({response: {type: "put", item: this.activity}});
                }, (error) => this.message.toastError(error))
                .then(() => this.inAction = false);
        }
    }

    public onDelete() {
        this.dialogs.confirm({ text: this.activity.hasImportedData ? "dialogs.deleteActualActivity" : "dialogs.deletePlanActivity" })
        .then(() => this.CalendarService.deleteItem("F", [this.activity.calendarItemId]))
        .then((response) => {
            this.onAnswer({response: {type: "delete", item: this.activity.build()}});
            this.message.toastInfo("activityDeleted");
        }, (error) => {
            if (error) {
                this.message.toastError(error);
            }
        });
    }

    public onSaveTemplate() {
        if (!this.template) {
            this.onCancel();
        }

        this.activity.build();

        const name = this.name;
        const description = this.activity.intervalPW.trainersPrescription;
        const { templateId, code, favourite, visible, header, groupProfile } = this.activity;
        const groupId = groupProfile && groupProfile.groupId;
        const { activityCategory, intervals } = header;
        /**[
            //this.activity.structured ? this.activity.intervalPW.clear() : this.activity.intervalPW.toTemplate(),
            this.activity.intervalPW.toTemplate(),
            ...this.activity.intervalP.map(i => i.toTemplate()),
            //...this.activity.intervalP.map(i => i).map(interval => ({...interval, calcMeasures: undefined})),
            ...this.activity.intervalG.map(i => i).map(interval => ({...interval, totalMeasures: undefined}))];
        /**let content = [
            ...intervals.filter(i => i.type === 'pW'),
            ...intervals.filter(i => i.type === 'P')
        ]
        .map((interval) => ({ ...interval, calcMeasures: undefined,  }));**/

        if (this.mode === "post") {
            this.ReferenceService.postActivityTemplate(
                null,
                activityCategory.id,
                groupId,
                name,
                description,
                favourite,
                this.activity.intervals.buildTemplate())
                .then((response) => {
                    this.activity.compile(response); // сохраняем id, revision в обьекте
                    this.message.toastInfo("activityTemplateCreated");
                    this.onAnswer({response: {type: "post", item: this.activity}});
                }, (error) => this.message.toastError(error));
        }

        if (this.mode === "put" || this.mode === "view") {
            this.ReferenceService.putActivityTemplate(
                templateId,
                activityCategory.id,
                groupId,
                null,
                name,
                description,
                favourite,
                visible,
                this.activity.intervals.buildTemplate())
                .then((response) => {
                    this.activity.compile(response); // сохраняем id, revision в обьекте
                    this.message.toastInfo("activityTemplateCreated");
                    this.onAnswer({response: {type: "post", item: this.activity}});
                }, (error) => this.message.toastError(error));
        }
    }

    /**
     * Обновление данных из формы ввода/редактирования activity-assignment
     */
    public updateAssignment(plan: IActivityIntervalPW, actual: ICalcMeasures) {

        this.activity.intervalPW.update(plan);
        this.activity.intervalW.update({calcMeasures: actual});
        this.activity.updateIntervals();
    }

    get name() {
        if (this.template) {
            const { code, intervalPW, activityHeader } = this.activity;
            const sport = activityHeader.activityType.typeBasic;
            return code || nameFromInterval(this.$translate) (intervalPW, sport);
        } else {
            return this.activity.code;
        }
    }

    set name(value) {
        if (value !== this.name) {
            this.activity.code = value;
        }
    }

    public toTemplate() {
        const { code, intervalPW, activityHeader } = this.activity;
        const sport = activityHeader.activityType.typeBasic;
        const activityCode = code || nameFromInterval(this.$translate) (intervalPW, sport);
        const description = intervalPW.trainersPrescription;
        const { activityCategory, activityType, intervals } = activityHeader;

        const template = {
            code: activityCode,
            description,
            favourite: false,
            visible: true,
            activityCategory,
            userProfileCreator: this.user,
            content: [this.activity.intervals.PW, ...this.activity.intervals.P, ...this.activity.intervals.G],
            //content: [this.activity.structured ? this.activity.intervalPW.clear() : this.activity.intervalPW.toTemplate(),
            //    ...this.activity.intervalP.map(i => i.toTemplate()), ...this.activity.intervalG]
        } as any;

        return this.$mdDialog.show(templateDialog("post", template, this.user));
    }
}

const CalendarItemActivityComponent: IComponentOptions = {
    bindings: {
        date: "<", // в режиме создания передает дату календаря
        activityType: "<", // если создание идет через wizard, то передаем тип тренировки
        activityCategory: "<",
        club: "<",
        data: "<", // в режиме просмотр/изменение передает данные по тренировке из календаря
        mode: "<", // режим: созадние, просмотр, изменение
        user: "<", // пользователь - владелец календаря
        tab: "<", // вкладка по-умолчанию
        popup: "=", //true - режим popup dialog, false - отдельное окно
        template: "=",
        onCancel: "&",
        onAnswer: "&",
    },
    require: {
        //calendar: '^calendar'
    },
    transclude: true,
    controller: CalendarItemActivityCtrl,
    template: require("./calendar-item-activity.component.html") as string,
};

export default CalendarItemActivityComponent;
