import moment from 'moment/min/moment-with-locales.js';
import { Moment } from 'moment';
import {
    ITrainingPlan,
    ITrainingPlanReview,
    TrainingPlanSearchResultItem,
    TrainingPlanSearchResultAuthor, ITrainingPlanAssignment
} from "../../../../api/trainingPlans/training-plans.interface";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { IChart } from "../../../../api/statistics/statistics.interface";
import { IUserProfileShort } from "../../../../api/user/user.interface";
import { IRevisionResponse } from "../../../../api/core/core";

export class TrainingPlan implements ITrainingPlan {

    id: number;
    revision?: number;
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
    price: number;
    currency: string;
    isFixedCalendarDates: boolean; // тренировки жестко привязаны к датам
    propagateMods: boolean; // правки плана распространяются всем приобретателям
    subCount?: number; // кол-во подписок на realtime досылку изменений
    regularWeek?: string; // типовая неделя
    isStructured?: boolean; // имеются структурированные тренировки default = false
    weekCount: number; // кол-во тренировочных недель
    samples: Array<ICalendarItem>; // примеры тренировок
    effortStat: Array<IChart>; // статистика нагрузки по плану
    reviews: Array<ITrainingPlanReview>; // массив отзывов
    calendarItems?: Array<ICalendarItem>; // массив событий календаря
    assignmentList?: Array<ITrainingPlanAssignment>; // история присвоений плана
    startDate?: string; // дата первой тренировки, если isFixedCalendarDates = true
    event: [string /*code*/, string /*date*/]; // план связан с конкретным спортивным событием

    private authorProfile: IUserProfileShort;
    private _startDate: Date;
    private keys: Array<string> = ['keys', 'revision', 'authorProfile', '_startDate'];

    constructor (params?: Object | ITrainingPlan | Array<any>) {

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
        if ( this.startDate ) { this._startDate = new Date(this.startDate); }
        if ( !this.lang ) { this.lang = 'ru'; }
        if ( !this.tags ) { this.tags = []; }
        if ( !this.keywords ) {this.keywords = [];}
        if ( !this.isFixedCalendarDates ) { this.isFixedCalendarDates = false; }
    }

    get firstDate (): Date {
        return this._startDate || new Date(moment(this.firstCalendarItem.dateStart).startOf('week'));
    }

    get endDate (): Date {
        return new Date(moment(this.lastCalendarItem.dateStart).endOf('week'));
    }

    get firstItemCalendarShift (): number {
        let firstCalendarItemDate: Moment = moment(this.firstCalendarItem.dateStart);
        return firstCalendarItemDate.diff(moment(this.startDate), 'days');
    }

    get lastItemCalendarShift (): number {
        let lastCalendarItemDate: Moment = moment(this.lastCalendarItem.dateStart);
        return moment(lastCalendarItemDate).endOf('week').diff(lastCalendarItemDate, 'days');
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

    /**
     * Расчет даты первого элемента календаря для набора параметров присвоения
     * @param applyMode
     * @param applyDateMode
     * @param applyFromDate
     * @param applyToDate
     * @returns {any}
     */
    fistItemAssignmentDate (applyMode: 'P' | 'I', applyDateMode: 'F' | 'T', applyFromDate: Date, applyToDate: Date): string {
        // Вариант 1. Тип Даты = План & Дата = с начала
        if ( applyMode === 'P' && applyDateMode === 'F' ) {
            return moment(applyFromDate).add(this.firstItemCalendarShift, 'days').format('YYYY-MM-DD');
        }
        // Вариант 2. Тип Даты = План & Дата = с конца
        else if ( applyMode === 'P' && applyDateMode === 'T' ) {
            return moment(applyToDate).subtract(this.lastItemCalendarShift, 'days').format('YYYY-MM-DD');
        }
        // Вариант 3.
        else if ( applyDateMode === 'F' ) {
            return moment(applyFromDate).format('YYYY-MM-DD');
        }
        // Вариант 4.
        else if ( applyDateMode === 'T' ) {
            return moment(applyToDate).format('YYYY-MM-DD');
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
        }
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

}