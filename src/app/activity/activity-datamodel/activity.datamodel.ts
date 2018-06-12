import moment from 'moment/src/moment.js';
import { CalendarItem } from "../../calendar-item/calendar-item.datamodel";
import { ICalendarItem } from "@api/calendar";
import { IActivityHeader } from '@api/activity';
import { ActivityHeader } from "./activity.header";
import { ActivityIntervals } from "./activity.intervals";
import { ActivityDetails } from "./activity.details";
import { IUserProfileShort, IUserProfile } from "../../../../api/user/user.interface";
import { getType } from "../activity.constants";
import { IGroupProfileShort } from "../../../../api/group/group.interface";
import { IActivityCategory } from "../../../../api/reference/reference.interface";
import { Owner, getOwner, ReferenceFilterParams, categoriesFilters } from "../../reference/reference.datamodel";
import { pipe, orderBy, prop, groupBy } from "../../share/util.js";
import { ActivityAuth } from "./activity.auth";
import { ICalendarItemDialogOptions } from "../../calendar-item/calendar-item-dialog.interface";
import { ActivityAthletes } from "./activity.athletes";
import { ActivityView } from "./activity.view";

export let toDay = (date):Date => {
    let result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
};

export class Activity extends CalendarItem {

    // public extends CalendarItem
    activityHeader: IActivityHeader;

    // public for UI
    header: ActivityHeader; // класс для работы с заголовком тренировки
    intervals: ActivityIntervals; // класс для работы с интрвалами тренировки
    details: ActivityDetails; // класс для работы с деталями тренировки (маршрут, показатели..)
    //athletes: ActivityAthletes; // класс для работы с переченем пользователей для планирования
    //auth: ActivityAuth; // класс для работы с полномочиями

    categoriesList: Array<IActivityCategory>;
    categoriesByOwner: { [owner in Owner]: Array<IActivityCategory> };

    // private
    private readonly statusLimit: { warn: number, error: number} = { warn: 10, error: 20 };

    // TODO refactoring to ActivityTemplate class extends Activity
    // Дополнительные поля для использования в шаблонах тренировки
    //public isTemplate: boolean;
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
    constructor (private item: ICalendarItem, private options?: ICalendarItemDialogOptions, private service?: any) {
        super(item, options);
        this.prepareData();
    }

    // Загружены детали по интервалам L
    get hasIntervalDetails (): boolean { return this.intervals.L && this.intervals.L.length > 0; }

    // Фактические данные импортированы, не введены руками
    get hasActualData (): boolean { return this.intervals.W.actualDataIsImported || false; }

    // Имеет панель с дополнительной информацией в тренировке для календаря
    get hasBottomData () { return !!this.bottomPanel;}

    // Тренировка выполнена
    get isCompleted (): boolean { return this.intervals.W && this.intervals.W.isCompleted; }

    // Тренирвками имеет структурированное задание
    get isStructured (): boolean { return this.intervals.P && this.intervals.P.length > 0; }

    // Тренировка сегодя
    get isToday (): boolean { return toDay(this._dateStart).getTime() === toDay(new Date()).getTime(); }

    // Тренировка в будущем
    get isComing (): boolean { return (this.options && this.options.hasOwnProperty('trainingPlanMode') && this.options.trainingPlanMode) ||
        (this.options && this.options.hasOwnProperty('templateMode') && this.options.templateMode) ||
        this._dateStart.getTime() >= toDay(new Date()).getTime(); }

    // Тренировка пропущена
    get isDismissed (): boolean { return this.status === 'dismiss'; }

    // Тренировка имеет плановое задание
    get isSpecified (): boolean { return this.intervals.PW && this.intervals.PW.specified(); }

    get isDarkColor (): boolean {
        return (this.isComing && !this.isCompleted) || (this.isCompleted && !this.isSpecified);
    }

    // Статус выполнения тренировки
    get status() {
        return this.options.hasOwnProperty('templateMode') && this.options.templateMode ? 'template' : (
            !this.isToday ?
                // приоритет статусов, если запись не сегодня
            (this.isComing && 'coming') ||
            (!this.isSpecified && 'not-specified') ||
            (!this.isCompleted && 'dismiss') ||
            ((Math.abs(100-this.percent) <= this.statusLimit.warn && this.percent > 0) && 'complete') ||
            ((Math.abs(100-this.percent) <= this.statusLimit.error && this.percent > 0) && 'complete-warn') ||
            ((Math.abs(100-this.percent) > this.statusLimit.error && this.percent > 0)  && 'complete-error') :
                //приоритет статусов, если запись сегодня
            ((Math.abs(100-this.percent) <= this.statusLimit.warn && this.percent > 0) && 'complete') ||
            ((Math.abs(100-this.percent) <= this.statusLimit.error && this.percent > 0)  && 'complete-warn') ||
            ((Math.abs(100-this.percent) > this.statusLimit.error && this.percent > 0)  && 'complete-error') ||
            (!this.isSpecified && 'not-specified') ||
            (this.isComing && 'coming')
        );
    }

    // Тип информации для дополнительной панели тренировки в календаре
    get bottomPanel() {
        return (this.status === 'coming' &&
            ((this.intervals.PW.trainersPrescription && this.intervals.PW.trainersPrescription.length > 0 ) ||
            (!this.isStructured && this.intervals.PW.intensityMeasure)) && 'plan') ||
            //(this.status === 'coming' && this.structured && 'segmentList') ||
            ((this.isCompleted && this.summaryAvg.length > 0) && 'data') || null;
    }

    // информация
    printPercent() { return ((this.percent && this.isCompleted) && `${this.percent.toFixed(0)}%`);}

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
        return this.duration;
    }

    get movingDurationApprox():boolean {
        return !!!this.intervals.W.movingDuration() && this.intervals.PW.movingDurationApprox;
    }

    get duration() {
        return this.intervals.W.movingDuration() ||
            (this.isStructured && this.intervals.PW.movingDurationLength) ||
            (this.intervals.PW.durationMeasure === 'duration' && this.intervals.PW.durationValue) ||
            (this.intervals.PW.durationMeasure === 'movingDuration' && this.intervals.PW.durationValue) || null;
    }

    get distance() {
        return this.intervals.W.distance() ||
            (this.intervals.PW.distanceLength > 0 && this.intervals.PW.distanceLength) ||
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
    formChart(dataType: 'P' | 'L' = 'P', measure: string = null): Array<Array<number>>{
        return  dataType === 'P' && this.intervals.P && this.intervals.chart() ||
                dataType === 'L' && this.intervals.L && this.intervals.chart(dataType, measure) || null;
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

        return Object.assign({
            calendarItemId: this.calendarItemId,
            calendarItemType: this.calendarItemType, //activity/competition/event/measurement/...,
            revision: this.revision,
            parentId: this.parentId,
            dateStart: this.dateStart, // timestamp даты и времени начала
            dateEnd: this.dateEnd, // timestamp даты и времени окончания
            userProfileOwner: userProfile || this.userProfileOwner,
            userProfileCreator: this.userProfileCreator,
            //activityHeader: Object.assign(this.header.build(), {intervals: this.intervals.build()}),
            activityHeader: Object.assign({},
                this.header.build(),
                {intervals: this.intervals.build()},
                {activityId: this.header.activityId || this.activityHeader.activityId})
        }, this.view.isTrainingPlan ? { // для тренировочных планов добавляем признак isSample
            isSample: this.isSample
        } : {});
    }




    // подготовка данных класса
    private prepareData (): void {
        super.prepare();
        this.header = new ActivityHeader(this.item.activityHeader);
        this.intervals = new ActivityIntervals(this.header.intervals.length > 0 && this.header.intervals || undefined);
        this.details = new ActivityDetails();
        //this.athletes = new ActivityAthletes(this.options.owner, this.options.currentUser);
        //this.auth = new ActivityAuth(this.userProfileOwner, this.userProfileCreator, this.options);
    }

}