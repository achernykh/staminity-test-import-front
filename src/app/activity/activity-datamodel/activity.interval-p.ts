import {IActivityIntervalP, IActivityInterval, ICalcMeasures,
    IDurationMeasure, IIntensityMeasure} from "../../../../api/activity/activity.interface";
import {ActivityInterval} from "./activity.interval";
import {DurationMeasure, IntensityMeasure} from "./activity.models";
import {ITrainingZonesType, ITrainingZones} from "../../../../api/user/user.interface";
import {getFTP} from "../../core/user.function";
import {FtpState} from "../components/assignment/assignment.component";

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
    parentGroupCode: string; // указатель на группу, в которую входит интервал
    repeatPos: number; // номер повтора внутри группы

    // Дополнительные поля для отрисовки в бэке
    isSelected: boolean; // сегмент выделен
    distance: IDurationMeasure;
    movingDuration: IDurationMeasure;
    heartRate: IIntensityMeasure;
    power: IIntensityMeasure;
    speed: IIntensityMeasure;

    private readonly limit: { warn: number, error: number} = { warn: 10, error: 20 };
    private readonly opposite: any = {
        intensityLevelFrom: 'intensityByFtpFrom',
        intensityLevelTo: 'intensityByFtpTo',
        intensityByFtpFrom: 'intensityLevelFrom',
        intensityByFtpTo: 'intensityLevelTo'
    };
    private readonly ftpMeasures = [
        ['intensityByFtpFrom','intensityByFtpTo'],
        ['intensityLevelFrom','intensityLevelTo']
    ];

    constructor(type: string, params: IActivityInterval) {
        super(type, params);

        this.distance = this.distance || new DurationMeasure();
        this.movingDuration = this.movingDuration || new DurationMeasure();

        this.heartRate = this.heartRate || new IntensityMeasure();
        this.speed = this.speed || new IntensityMeasure();
        this.power = this.power || new IntensityMeasure();

        this.prepareDuration();
        this.prepareIntensity();
    }

    private prepareDuration(){

        ['distance','movingDuration'].forEach(m => !this[m] && Object.assign(this[m], {
            durationValue: (this.durationMeasure === m && this.durationValue) || null
        }));
    }

    private prepareIntensity(){

        ['heartRate','speed','power'].forEach(m => !this[m] && Object.assign(this[m], {
            intensityLevelFrom: (this.intensityMeasure === m && this.intensityLevelFrom) || null,
            intensityLevelTo: (this.intensityMeasure === m && this.intensityLevelTo) || null,
            intensityByFtpFrom: (this.intensityMeasure === m && this.intensityByFtpFrom) || null,
            intensityByFtpTo: (this.intensityMeasure === m && this.intensityByFtpTo) || null
        }));
    }

    /**
     * @description Очитска интервала от вспомагательных полей, перевод к структуре api
     * @param keys
     * @returns {IActivityIntervalP}
     */
    clear(keys: Array<string> = ['params', 'calcMeasures', 'isSelected','distance','movingDuration',
        'heartRate','power','speed', 'speed', 'zones', 'limit', 'index', 'ftpMeasures']):IActivityIntervalP{
        keys.map(p => delete this[p]);
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
     * @description Дополняем интревал не заполненными значениями
     * Метод работает как для заполнения интревала в целом, так и после изменения парамтреа длительности или
     * интенсивности
     */
    complete(
        ftp: number,
        ftpState: FtpState = FtpState.On,
        changes: Array<{
            measure: string;
            value: DurationMeasure | IntensityMeasure}> = []): ActivityIntervalP{

        debugger;

        changes.forEach(change => {
            // Изменилась длительность
            if (change.value instanceof  DurationMeasure) {
                // 1. Устанавливаем параметр длительности
                this.durationMeasure = change.measure;
                // 2. Устанавливаем значение длительности
                this.durationValue = change.value.durationValue;
            }

            // Изменилась интенсивность
            if (change.value instanceof IntensityMeasure) {
                // Устанавливаем параметр интенсивности
                this.intensityMeasure = change.measure;
                // Устанавливаем значение длительности
                this.ftpMeasures[ftpState].map(key => this[key] = change.value[key]);
                // Добавляем относительные значния интенсивности
                this.ftpMeasures[ftpState].map(key =>
                    this[this.opposite[key]] = this.calculateFtpValue(ftp, ftpState, this.opposite[key]));
            }
        });

        //
        return this;
    }

    /**
     * @description Перерасчет относительного значения интенсивности в асболютное и наоборот
     * @param ftp - значение ftp
     * @param ftpState - режим ввода значения
     * @param key - параметр, который необходимо рассчитать
     * @param measure - показатель интенсиновсти, по которому идет расчет
     * @returns {number} - рассчитанное знаение аболютное | относительное
     */
    calculateFtpValue(
        ftp: number,
        ftpState: FtpState,
        key: string,
        measure: string = this.intensityMeasure):number {

        return ftpState === FtpState.On ?
            this[measure][key] = this[measure][this.opposite[key]] * ftp :
            this[measure][key] = this[measure][this.opposite[key]] / ftp;
    }

    clearAbsoluteValue() {
        this.intensityLevelFrom = null;
        this.intensityLevelTo = null;
    }

    clearRelativeValue() {
        this.intensityByFtpFrom = null;
        this.intensityByFtpTo = null;

    }

    completeAbsoluteValue(zones: ITrainingZones, sport: string) {

        if(this.intensityMeasure) {
            this.intensityLevelFrom = this[this.intensityMeasure].intensityLevelFrom =
                getFTP(zones, this.intensityMeasure, sport) * this.intensityByFtpFrom;

            this.intensityLevelTo = this[this.intensityMeasure].intensityLevelTo =
                getFTP(zones, this.intensityMeasure, sport) * this.intensityByFtpTo;
        }
    }

    /**
     * @description Процент выполнения тренировки
     * @returns {number}
     */
    percent():number{
        return this.hasOwnProperty('calcMeasures') && this.calcMeasures.hasOwnProperty('completePercent') &&
            this.calcMeasures.completePercent.hasOwnProperty('value') && this.calcMeasures.completePercent.value * 100 ||
            null;
    }

    /**
     * @description Статус выполнения интервала
     * @returns {string}
     */
    get status():string {
        return  (this.percent() === null && 'coming') ||
                (Math.abs(100 - this.percent()) <= this.limit.warn) && 'complete' ||
                (Math.abs(100 - this.percent()) <= this.limit.error) && 'complete-warn' ||
                (Math.abs(100 - this.percent()) > this.limit.error) && 'complete-error';

    }

    /**
     * @description Подготавливаем инетрвал для перерасчета на стороне бэка
     * @returns {IActivityIntervalP}
     */
    prepareForCalculateRange():IActivityIntervalP {
        this.startTimestamp = null;
        this.endTimestamp = null;
        return this.clear();
    }

}