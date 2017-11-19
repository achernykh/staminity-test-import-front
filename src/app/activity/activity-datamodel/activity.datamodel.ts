import moment from 'moment/src/moment.js';
import { CalendarItem } from "../../calendar-item/calendar-item.datamodel";
import { ICalendarItem } from "@api/calendar";
import { IActivityHeader } from '@api/activity';
import { ActivityHeader } from "./activity.header";
import { ActivityIntervals } from "./activity.intervals";
import { ActivityDetails } from "./activity.details";
import { IUserProfileShort, IUserProfile } from "../../../../api/user/user.interface";
import { getType } from "../activity.constants";
import { toDay } from "../activity.datamodel";
import { IGroupProfileShort } from "../../../../api/group/group.interface";
import { IActivityCategory } from "../../../../api/reference/reference.interface";
import { Owner, getOwner, ReferenceFilterParams, categoriesFilters } from "../../reference/reference.datamodel";
import { pipe, orderBy, prop, groupBy } from "../../share/util.js";

export class Activity extends CalendarItem {

    // public extends CalendarItem
    activityHeader: IActivityHeader;

    // public for UI
    header: ActivityHeader; // класс для работы с заголовком тренировки
    intervals: ActivityIntervals; // класс для работы с интрвалами тренировки
    details: ActivityDetails; // класс для работы с деталями тренировки (маршрут, показатели..)
    // new ActivityAuth
    categoriesList: Array<IActivityCategory> = [];
    categoriesByOwner: { [owner in Owner]: Array<IActivityCategory> };

    // private
    private readonly statusLimit: { warn: number, error: number} = { warn: 10, error: 20 };
    private _startDate: Date;

    // TODO refactoring to ActivityTemplate class extends Activity
    // Дополнительные поля для использования в шаблонах тренировки
    public isTemplate: boolean;
    public templateId: number;
    public code: string;
    public description: string;
    public favourite: boolean;
    public visible: boolean;
    public groupProfile: IGroupProfileShort;

    /**
     * Конструктор Тренировки
     * @param item - данные по тренировке
     * @param options - опции
     * @param service - сервис работы с данными
     */
    constructor (private item: ICalendarItem, options?: any, service?: any) {
        super(item);
        // Запоминаем, чтобы парсить только один раз
        this._startDate = toDay(moment(this.dateStart, 'YYYY-MM-DD').toDate());

        this.header = new ActivityHeader(item.activityHeader);
        this.intervals = new ActivityIntervals(this.header.intervals.length > 0 && this.header.intervals || undefined);
        this.details = new ActivityDetails();
    }

    // Загружены детали по интервалам L
    hasIntervalDetails (): boolean { return this.intervals.L && this.intervals.L.length > 0; }

    // Фактические данные импортированы, не введены руками
    hasActualData (): boolean { return this.intervals.W.actualDataIsImported || false; }

    // Имеет панель с дополнительной информацией в тренировке для календаря
    hasBottomData() { return !!this.bottomPanel;}

    // Тренировка выполнена
    isCompleted (): boolean { return this.intervals.W && this.intervals.W.completed(); }

    // Тренирвками имеет структурированное задание
    isStructured (): boolean { return this.intervals.P && this.intervals.P.length > 0; }

    // Тренировка сегодя
    isToday (): boolean { return this._startDate.getTime() === toDay(new Date()).getTime(); }

    // Трениовка в будущем
    isComing (): boolean { return this._startDate.getTime() >= toDay(new Date()).getTime(); }

    // Тренировка пропущена
    isDismissed (): boolean { return this.status === 'dismiss'; }

    // Тренировка имеет плановое задание
    isSpecified (): boolean { return this.intervals.PW && this.intervals.PW.specified(); }

    // Статус выполнения тренировки
    get status() {
        return this.isTemplate? 'template' : (
            !this.isToday() ?
                // приоритет статусов, если запись не сегодня
            (this.isComing() && 'coming')
            || (!this.isSpecified() && 'not-specified')
            || (!this.isCompleted() && 'dismiss')
            || ((Math.abs(100-this.percent) <= this.statusLimit.warn && this.percent > 0) && 'complete')
            || ((Math.abs(100-this.percent) <= this.statusLimit.error && this.percent > 0) && 'complete-warn')
            || ((Math.abs(100-this.percent) > this.statusLimit.error && this.percent > 0)  && 'complete-error') :
                //приоритет статусов, если запись сегодня
            ((Math.abs(100-this.percent) <= this.statusLimit.warn && this.percent > 0) && 'complete')
            || ((Math.abs(100-this.percent) <= this.statusLimit.error && this.percent > 0)  && 'complete-warn')
            || ((Math.abs(100-this.percent) > this.statusLimit.error && this.percent > 0)  && 'complete-error')
            || (!this.isSpecified() && 'not-specified')
            || (this.isComing() && 'coming')
        );
    }

    // Тип информации для дополнительной панели тренировки в календаре
    get bottomPanel() {
        return (this.status === 'coming' &&
            ((this.intervals.PW.trainersPrescription && this.intervals.PW.trainersPrescription.length > 0 ) ||
            (!this.isStructured() && this.intervals.PW.intensityMeasure)) && 'plan') ||
            //(this.status === 'coming' && this.structured && 'segmentList') ||
            ((this.isCompleted() && this.summaryAvg.length > 0) && 'data') || null;
    }

    // информация
    printPercent() { return ((this.percent && this.isCompleted()) && `${this.percent.toFixed(0)}%`);}

    get percent () { return this.intervals.PW && this.intervals.PW.percent(); }

    get durationValue(){
        return (!!this.durationMeasure && this[this.durationMeasure]) || null;
    }

    get durationMeasure() {
        return (this.intervals.PW && this.intervals.PW.durationMeasure)
            || (!!this.intervals.W.calcMeasures.duration.maxValue && 'duration')
            || (!!this.intervals.W.calcMeasures.distance.maxValue && 'distance') || null;
    }

    get intensityValue() {
        return ((this.status === 'coming' || this.status === 'dismiss') && {from: this.intervals.PW.intensityLevelFrom, to: this.intervals.PW.intensityLevelTo}) ||
            (this.intensityMeasure &&  this.intervals.W.calcMeasures.hasOwnProperty(this.intensityMeasure) && this.intervals.W.calcMeasures[this.intensityMeasure].avgValue) || null;
    }

    get intensityMeasure() {
        return this.intervals.PW.intensityMeasure || this.defaultIntensityMeasure;
    }

    get defaultIntensityMeasure() {
        return (this.intervals.W.calcMeasures.hasOwnProperty('speed') &&  this.intervals.W.calcMeasures.speed.hasOwnProperty('avgValue')  && this.intervals.W.calcMeasures.speed.avgValue && 'speed')
            || (this.intervals.W.calcMeasures.hasOwnProperty('heartRate') &&  this.intervals.W.calcMeasures.heartRate.hasOwnProperty('avgValue') && this.intervals.W.calcMeasures.heartRate.avgValue && 'heartRate')
            || (this.intervals.W.calcMeasures.hasOwnProperty('power') &&  this.intervals.W.calcMeasures.power.hasOwnProperty('avgValue') && this.intervals.W.calcMeasures.power.avgValue && 'power') || null;
    }

    get movingDuration():number {
        return this.intervals.W.movingDuration() ||
            (this.isStructured && this.intervals.PW.movingDurationLength) ||
            (this.intervals.PW.durationMeasure === 'movingDuration' && this.intervals.PW.durationValue) || null;
    }

    get movingDurationApprox():boolean {
        return !!!this.intervals.W.movingDuration() && this.intervals.PW.movingDurationApprox;
    }

    get duration() {
        return this.intervals.W.movingDuration() ||
            (this.isStructured && this.intervals.PW.movingDurationLength) ||
            (this.intervals.PW.durationMeasure === 'movingDuration' && this.intervals.PW.durationValue) || null;
    }

    get distance() {
        return this.intervals.W.distance() ||
            (this.isStructured && this.intervals.PW.distanceLength) ||
            (this.intervals.PW.durationMeasure === 'distance' && this.intervals.PW.durationValue) || null;
    }

    get distanceApprox():boolean {
        return !!!this.intervals.W.distance() && this.intervals.PW.distanceApprox;
    }

    // TODO Перенести в функции
    // Формируем перечень показателей для панели data (bottomPanel)
    get summaryAvg() {
        let measures = ['speed','heartRate','power'];
        let calc = this.intervals.W.calcMeasures;

        return measures
            .map((measure)=>{
                if(calc.hasOwnProperty(measure)){
                    return ((calc[measure].hasOwnProperty('avgValue')) &&
                        { measure : measure, value: Number(calc[measure].avgValue)}) || {[measure]: null, value: null};
                }})
            .filter(measure => !!measure && !!measure.value);
    }

    // TODO Перенести в функции
    prepareSegmentList(){

        let segmentList: Array<any> = [];
        let segment: any = {};

        if(this.isStructured && this.intervals.P.length > 0) {
            this.intervals.P.forEach(interval => {
                segment = interval;
                segment['show'] = true;
                segment['group'] = interval.type === 'G';
                if (segment['group']) { //если группа
                    segment.subItem = []; // для записи членов группы
                    segmentList.push(segment);
                } else { // отдельный интервал
                    if (segment.hasOwnProperty('parentGroupCode') && segment['parentGroupCode']) { // входит в группу
                        let gId = segmentList.findIndex(s => s['code'] === segment['parentGroupCode']);
                        if (gId !== -1) {
                            segmentList[gId].subItem.push(segment);
                        }
                    } else { // одиночный интервал, без группы
                        segmentList.push(segment);
                    }
                }
            });
        }

        return segmentList;
    }

    // TODO Перенести в функции
    formChart():Array<Array<number>>{
        return this.intervals.P && this.intervals.chart() || null;
    }

    setCategoriesList (categoriesList: Array<IActivityCategory>, userProfile: IUserProfile) {
        this.categoriesList = categoriesList;
        this.categoriesByOwner = pipe(
            orderBy(prop('sortOrder')),
            groupBy(getOwner(userProfile))
        ) (categoriesList);
    }

    // Подготовка данных для передачи в бэкенд
    build ( userProfile?: IUserProfileShort ): ICalendarItem {
        super.package();
        this.dateEnd = this.dateStart;
        this.header.activityType = getType(Number(this.header.activityType.id));

        return {
            calendarItemId: this.calendarItemId,
            calendarItemType: this.calendarItemType, //activity/competition/event/measurement/...,
            revision: this.revision,
            dateStart: this.dateStart, // timestamp даты и времени начала
            dateEnd: this.dateEnd, // timestamp даты и времени окончания
            userProfileOwner: userProfile || this.userProfileOwner,
            userProfileCreator: this.userProfileCreator,
            activityHeader: Object.assign(this.header.build(), {intervals: this.intervals.build()})
        };
    }




    // подготовка данных класса
    private prepareData (): void {

    }

}