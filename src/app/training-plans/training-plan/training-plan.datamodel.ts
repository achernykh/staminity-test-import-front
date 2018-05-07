import moment from 'moment/min/moment-with-locales.js';
import { Moment } from 'moment';
import {
    ITrainingPlan,
    ITrainingPlanReview, ITrainingPlanAssignment, IMonetaAssistantFormData
} from "../../../../api/trainingPlans/training-plans.interface";
import { TrainingPlanSearchResultItem, TrainingPlanSearchResultAuthor } from "../../../../api/trainingPlans/training-plans.protocol";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { IChart } from "../../../../api/statistics/statistics.interface";
import { IUserProfileShort } from "../../../../api/user/user.interface";
import { IRevisionResponse } from "../../../../api/core/core";
import { fullImageUrl } from "../../share/image/image.functions";
import { TrainingPlanConfig } from "./training-plan.config";

export class TrainingPlan implements ITrainingPlan {

    id: number;
    revision?: number;
    histRevision?: number; // последняя ревизия, сохраненная в истории
    histVersion?: number; // номер последней версии из истории
    storeRevision?: number; // ревизия из истории, опубликованная в магазине
    storeVersion?: number; // номер версии в магазине
    isPublic: boolean; // Тип плана: false - для внутреннего использования, true - для продажи
    status: string; // [D]raft/[P]ublished/[A]pplied
    name: string;
    description: string; // описание
    lang: string;
    keywords: Array<string>;
    tags: Array<string>; // спец-е теги для классификации признаков, выставленных плану.
    distances: [number /*run*/, number /*bike*/, number /*swim*/, number /*other*/]; // итоги по дистанциям в разрезе базовых видов спорта
    durations: [number /*run*/, number /*bike*/, number /*swim*/, number /*other*/]; // итоги по времени тренировок в разрезе базовых видов спорта
    type: string; // [T]riathon, [R]un, [B]ike, [S]wim, [O]ther
    distanceType: string;
    icon: string; // абсолютный путь к аватарке (url)
    background?: string; // абсолютный путь к фоновому изображению (url)
    club: Array<any>; // club profile
    author: Array<any>; // профиль создателя, если club is null
    monetization?: boolean;
    price: number;
    currency: string;
    isFixedCalendarDates: boolean; // тренировки жестко привязаны к датам
    propagateMods: boolean; // правки плана распространяются всем приобретателям
    subCount?: number; // кол-во подписок на realtime досылку изменений
    regularWeek?: string; // типовая неделя
    isStructured?: boolean; // имеются структурированные тренировки default = false
    weekCount: number; // кол-во тренировочных недель
    samples: Array<ICalendarItem>; // примеры тренировок
    effortStat: {
        metricsByDistance: Array<Array<any>>;
        metricsByDuration: Array<Array<any>>;
        metricsPerWeek: Array<Array<any>>;
    };//Array<IChart>; // статистика нагрузки по плану
    reviews: Array<ITrainingPlanReview>; // массив отзывов
    calendarItems?: Array<ICalendarItem>; // массив событий календаря
    assignmentList?: Array<ITrainingPlanAssignment>; // история присвоений плана
    startDate?: string; // дата первой тренировки, если isFixedCalendarDates = true
    event: [string /*code*/, string /*date*/]; // план связан с конкретным спортивным событием
    product?: IMonetaAssistantFormData; // объект доступен покупателю плана. Используется для формирования ссылки к Moneta.Assistant
    customData?: {
        targetAudience: boolean;
        hasOfflineTraining: boolean;
        offlineTrainingDescription: string;
        hasConsultations: boolean;
        consultationsDescription: string;
        statisticData: 'metricsByDuration' | 'metricsByDistance';
    };
    state?: 'P' | 'A'; // статус покупки плана [P] - pending [A] - active
    parentId?: number;

    authorProfile: IUserProfileShort;
    private _startDate: Date;
    private keys: Array<string> = ['keys', 'revision', 'authorProfile', '_startDate'];

    constructor (params?: Object | ITrainingPlan | Array<any>, private config?: TrainingPlanConfig) {

        if ( Array.isArray(params) ) {
            Object.keys(new TrainingPlanSearchResultItem()).map((k: string, i: number) => this[k] = params[i]);
        } else {
            Object.assign(this, params);
        }

        // 1. Предустанавливаем тип плана на приватный (для собственного использования)
        if ( this.isPublic === undefined ) {
            this.isPublic = false;
        }

        this.prepareDefaultData();
        this.prepareObjects();

    }

    applyRevision (revision: IRevisionResponse): TrainingPlan {

        this.id = revision.value.id;
        this.revision = revision.value.revision;

        return this;

    }

    prepareObjects (): TrainingPlan {
        this.prepareAuthorObject();
        return this;
    }

    private prepareAuthorObject (): void {

        if ( !this.author ) {return;}

        this.authorProfile = {
            userId: null,
            revision: null,
            public: {}
        };

        Object.keys(new TrainingPlanSearchResultAuthor()).map((k: string, i: number) => {
            if ( ['userId', 'revision'].indexOf(k) !== -1 ) {
                this.authorProfile[k] = this.author[i];
            } else {
                this.authorProfile.public[k] = this.author[i];
            }
        });
    }

    private prepareDefaultData (): void {
        this._startDate = (this.startDate && new Date(this.startDate)) ||
            (this.isFixedCalendarDates && moment().startOf('week').toDate()) || null;
        if ( !this.lang ) { this.lang = 'ru'; }
        if ( !this.tags ) { this.tags = []; }
        if ( !this.keywords ) {this.keywords = [];}
        if ( !this.isFixedCalendarDates ) { this.isFixedCalendarDates = false; }
    }

    get firstDate (): Date {
        return this.isFixedCalendarDates && this._startDate ||
            (this.firstCalendarItem && moment(this.firstCalendarItem.dateStart).toDate()) ||
            moment('3000-01-01').startOf('week').toDate();
    }

    get endDate (): Date {
        return moment(this.lastCalendarItem.dateStart).endOf('week').toDate();
    }

    get firstItemCalendarShift (): number {
        let firstCalendarItemDate: Moment = moment(this.firstCalendarItem.dateStart);
        let startDate = this.isFixedCalendarDates ? moment(this.startDate) : moment(firstCalendarItemDate).startOf('week');
        return firstCalendarItemDate.diff(startDate, 'days');
    }

    get lastItemCalendarShift (): number {
        let lastCalendarItemDate: Moment = moment(this.lastCalendarItem.dateStart);
        return moment(lastCalendarItemDate).endOf('week').diff(lastCalendarItemDate, 'days');
    }

    get firstLastItemCalendarShift (): number {
        return moment(this.lastCalendarItem.dateStart).diff(moment(this.firstCalendarItem.dateStart), 'days');
    }

    get firstCalendarItem (): ICalendarItem {
        return this.calendarItems && this.calendarItems[0] || null;
    }

    get lastCalendarItem (): ICalendarItem {
        return this.calendarItems && this.calendarItems[this.calendarItems.length - 1] || null;
    }

    get hasAssignment (): boolean {
        return this.assignmentList && this.assignmentList.length > 0;
    }

    get hasCalendarItems (): boolean {
        return this.calendarItems && this.calendarItems.length > 0;
    }

    /**
     * Расчет даты первого элемента календаря для набора параметров присвоения
     * @param applyMode
     * @param applyDateMode
     * @param applyFromDate
     * @param applyToDate
     * @returns {any}
     */
    fistItemAssignmentDate (applyMode: 'P' | 'I',
                            applyDateMode: 'F' | 'T',
                            applyFromDate: Date,
                            applyToDate: Date): string {

        let dateForm: Moment = moment(applyFromDate).utc().add(moment().utcOffset(),'minutes');
        let dateTo: Moment = moment(applyToDate).utc().add(moment().utcOffset(),'minutes');
        // Вариант 1. Тип Даты = План & Дата = с начала
        if ( applyMode === 'P' && applyDateMode === 'F' ) {
            return dateForm.add(this.firstItemCalendarShift, 'days').format('YYYY-MM-DD');
        }
        // Вариант 2. Тип Даты = План & Дата = с конца
        else if ( applyMode === 'P' && applyDateMode === 'T' ) {
            return dateTo.subtract(this.lastItemCalendarShift + this.firstLastItemCalendarShift, 'days').format('YYYY-MM-DD');
        }
        // Вариант 3. Тип даты = Итем + Дата = с начала
        else if ( applyMode === 'I' && applyDateMode === 'F' ) {
            return dateForm.format('YYYY-MM-DD');
        }
        // Вариант 4. Тип даты = Итем + Дата = с конца
        else if ( applyMode === 'I' && applyDateMode === 'T' ) {
            return dateTo.subtract(this.firstLastItemCalendarShift, 'days').format('YYYY-MM-DD');
        }
    }

    /**
     * Всопомгательная информация для пользователя по параметрам будущего присвоения
     * @param applyMode
     * @param applyDateMode
     * @param applyFromDate
     * @param applyToDate
     * @returns {{firstPlanDate: string, firstItemDate: string, lastPlanDate: string, lastItemDate: string}}
     */
    assignmentInfo (applyMode: 'P' | 'I', applyDateMode: 'F' | 'T', applyFromDate: Date, applyToDate: Date): Object {
        let firstDate: string = this.fistItemAssignmentDate(applyMode, applyDateMode, applyFromDate, applyToDate);
        let shift: number = moment(firstDate).diff(moment(this.firstCalendarItem.dateStart), 'days');
        return {
            firstPlanDate: moment(this.firstDate).add(shift, 'days').toDate(),
            firstItemDate: new Date(firstDate),
            lastPlanDate: moment(this.endDate).add(shift, 'days').toDate(),
            lastItemDate: moment(this.lastCalendarItem.dateStart).add(shift, 'days').toDate()
        };
    }

    isDatesBeforeToday (date: Date, mode: 'F' | 'T'): boolean {
        return moment(date).isBefore(moment(), 'day');
    }

    isAfterPlanDates (date: Date, mode: 'F' | 'T'): boolean {
        return  (mode === 'F' && moment(this.startDate).isAfter(moment(date), 'day')) ||
                (mode === 'T' && moment(this.endDate).isBefore(moment(date), 'day'));
    }

    isSamePlanDates (date: Date, mode: 'F' | 'T'): boolean {
        return  (mode === 'F' && moment(this.startDate).isSame(moment(date), 'day')) ||
                (mode === 'T' && moment(this.endDate).isSame(moment(date), 'day'));
    }

    /**
     * План с фиксированными дантами и с обновлением можно присвоить только в даты плана, когда
     * дата начала присвоения совпадает с началом плана или дата окончания совпадает с датой окончания плана
     * @param date
     * @param mode
     * @returns {boolean|any}
     */
    isEnablePropagateMods (date: Date, mode: 'F' | 'T'): boolean {
        return this.propagateMods && this.isSamePlanDates(date, mode);
    }

    apiObject (): ITrainingPlan {
        let plan: ITrainingPlan = Object.assign({}, this);
        debugger;
        if (this._startDate) { plan.startDate = moment(this._startDate).startOf('week').format('YYYY-MM-DD'); };
        this.keys.map(k => plan.hasOwnProperty(k) && delete plan[k]);
        return plan;
    }

    clear (keys: Array<string> = this.keys): ITrainingPlan {
        keys.map(p => delete this[p]);
        return <ITrainingPlan>this;
    }

    get iconPath(): string {
        return this.icon && fullImageUrl()('/plan/icon/', this.icon) || null;
    }

    get backgroundPath(): string {
        return this.background && fullImageUrl()('/plan/background/', this.background) || null;
    }

    get authorPath(): string {
        return this.authorProfile.public.avatar && fullImageUrl()('/user/avatar/', this.authorProfile.public.avatar) || null;
    }

    get iconStyle(): Object {
        return {
            'background-image': `url(${this.iconPath})`,
            'background-position': 'center',
            'background-size': 'cover',
            'position': 'relative',
            'cursor': 'pointer'
        };
    }

    get authorStyle(): Object {
        return {
            'background-image': `url(${this.authorPath})`,
            'background-position': 'center',
            'background-size': 'cover',
            'position': 'relative',
            'cursor': 'pointer'
        };
    }

    get backgroundStyle(): Object {
        return {
            'background-image': `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) 30%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.7)), url(${this.backgroundPath})`,
            'background-color': 'grey',
            'background-size': 'cover',
            'background-position': 'center',
            'position': 'relative'
        };
    }

    getChart(param: string = 'metricsByDuration'): IChart {
        return this.config && this.effortStat && Object.assign({}, this.config[param + 'Chart'], {metrics: this.effortStat[param]}) || null;
    }
    get needHrBelt(): boolean {
        return this.tags && this.tags.some(t => t === 'hrBelt');
    }

    get needPowerMeter(): boolean {
        return this.tags && this.tags.some(t => t === 'powerMeter');
    }

    get level(): Array<string> {
        return this.tags.filter(t => ['beginner', 'advanced', 'pro'].indexOf(t) !== -1);
    }

    get measures(): Array<string> {
        return this.tags.filter(t => ['powerMeter', 'hrBelt'].indexOf(t) !== -1).map(t => {
                if (t === 'powerMeter') { return 'power';}
                else if (t === 'hrBelt') { return 'heartRate';}
            });
    }

    get otherTags (): Array<string> {
        return this.tags.filter(t => ['beginner', 'advanced', 'pro','powerMeter', 'hrBelt'].indexOf(t) === -1);
    }

    get hasUpdateForStore (): boolean {
        return  (!this.propagateMods && this.revision && this.storeRevision >= 0 && this.revision > this.storeRevision) ||
                (!this.propagateMods && this.revision && !this.storeRevision);
    }

    isExisteffortState (key: string): boolean {
        return this.effortStat && this.effortStat.metricsPerWeek[key] &&
            Object.keys(this.effortStat.metricsPerWeek[key]).length > 0 &&
            Object.keys(this.effortStat.metricsPerWeek[key]).every(k => this.effortStat.metricsPerWeek[key][k] > 0);
    }

    get isPublished (): boolean {
        return this.storeRevision !== null && this.storeVersion >= 0;
    }

}