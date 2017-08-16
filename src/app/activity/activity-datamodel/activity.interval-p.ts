import {IActivityIntervalP, IActivityInterval, ICalcMeasures,
    IDurationMeasure, IIntensityMeasure} from "../../../../api/activity/activity.interface";
import {ActivityInterval} from "./activity.interval";
import {DurationMeasure, IntensityMeasure} from "./activity.models";

export class ActivityIntervalP extends ActivityInterval implements IActivityIntervalP{

    durationMeasure: string; //movingDuration/distance, каким показателем задается длительность планового сегмента
    durationValue: number; // длительность интервала в ед.изм. показателя длительности
    keyInterval: boolean; // признак того, что плановый сегмент является ключевым
    intensityMeasure: string; //heartRate/speed/power, показатель, по которому задается интенсивность на данном интервале
    intensityLevelFrom: number; // начальное абсолютное значение интенсивности
    intensityByFtpFrom: number; // начальное относительное значение интенсивности
    intensityLevelTo: number; // конечное абсолютное значение интенсивности
    intensityByFtpTo: number; // конечное относительное значение интенсивности
    intensityDistribution: string; // [A] = любое значение по показателю интенсивности в заданном интервале. [I] = рост значенией показателя. [D] = снижение
    intensityFtpMax: number; // максимальная средняя интенсивность среди фактических данных , относящихся к разметке плановых сегментов. Пригодно к использованию только в рамках интервала с type = [P].
    intensityMaxZone: number; // максимальная зона интенсивности
    movingDurationLength: number; // времени
    distanceLength: number; // по дистанции
    actualDurationValue: number; // Указанная вручную пользователем длительность сегмента
    movingDurationApprox: boolean; // признак, что movingDuration определен приблизительно
    distanceApprox: boolean; // признак, что distance рассчитан приблизительно
    calcMeasures: ICalcMeasures; // рассчитанные фактические показатели
    parentGroup: string; // указатель на группу, в которую входит интервал
    repeatPos: number; // номер повтора внутри группы

    // Дополнительные поля для отрисовки в бэке
    isSelected: boolean; // сегмент выделен
    distance: IDurationMeasure = new DurationMeasure();
    movingDuration: IDurationMeasure = new DurationMeasure();
    heartRate: IIntensityMeasure = new IntensityMeasure();
    power: IIntensityMeasure = new IntensityMeasure();
    speed: IIntensityMeasure = new IntensityMeasure();

    constructor(type: string, params: IActivityInterval) {
        super(type, params);
        this.prepareDuration();
        this.prepareIntensity();
    }

    clear():IActivityIntervalP{
        let params: Array<string> = ['params', 'calcMeasures', 'isSelected','distance','movingDuration','heartRate','power','speed'];
        params.map(p => delete this[p]);
        return <IActivityIntervalP>this;
    }

    /**
     * @description Запрос данных по заданию
     * @returns {{keyInterval: boolean, durationMeasure: string, durationValue: number, movingDurationLength: number,
     * movingDurationApprox: boolean, distanceLength: number, distanceApprox: boolean, intensityMeasure: string,
      * intensityLevelFrom: number, intensityByFtpFrom: number, intensityLevelTo: number, intensityByFtpTo: number,
      * intensityDistribution: string, intensityFtpMax: number, intensityMaxZone: number}}
     */
    assignment():Object{
        return {
            keyInterval: this.keyInterval,

            durationMeasure: this.durationMeasure,
            durationValue: this.durationValue,
            movingDurationLength: this.movingDurationLength,
            movingDurationApprox: this.movingDurationApprox,
            distanceLength: this.distanceLength,
            distanceApprox: this.distanceApprox,

            intensityMeasure: this.intensityMeasure,
            intensityLevelFrom: this.intensityLevelFrom,
            intensityByFtpFrom: this.intensityByFtpFrom,
            intensityLevelTo: this.intensityLevelTo,
            intensityByFtpTo: this.intensityByFtpTo,
            intensityDistribution: this.intensityDistribution,
            intensityFtpMax: this.intensityFtpMax,
            intensityMaxZone: this.intensityMaxZone,

        };
    }

    /**
     * @description Заполняем расчет занчений по заданию
     * 1)
     */
    complete(measure: string, value: DurationMeasure | IntensityMeasure){

        // Изменилась длительность
        if (value instanceof  DurationMeasure) {
            debugger;
        }

        // Изменилась интенсивность
        if (value instanceof IntensityMeasure) {
            debugger;
        }

        //

    }


    prepareDuration(){
        ['distance','movingDuration'].forEach(m => Object.assign(this[m], {
            durationValue: (this.durationMeasure === m && this.durationValue) || null
        }));
    }

    prepareIntensity(){
        ['heartRate','speed','power'].forEach(m => Object.assign(this[m], {
            intensityLevelFrom: (this.intensityMeasure === m && this.intensityLevelFrom) || null,
            intensityLevelTo: (this.intensityMeasure === m && this.intensityLevelTo) || null,
            intensityByFtpFrom: (this.intensityMeasure === m && this.intensityByFtpFrom) || null,
            intensityByFtpTo: (this.intensityMeasure === m && this.intensityByFtpTo) || null
        }));
    }

}