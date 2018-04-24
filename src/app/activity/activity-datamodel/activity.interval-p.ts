import {copy} from "angular";
import {
    IActivityInterval, IActivityIntervalP, IActivityIntervalPW,
    ICalcMeasures, IDurationMeasure, IIntensityMeasure,
} from "../../../../api/activity/activity.interface";
import {ITrainingZones, ITrainingZonesType} from "../../../../api/user/user.interface";
import {getFTP} from "../../core/user.function";
import {FtpState} from "../components/assignment/assignment.component";
import {ActivityInterval} from "./activity.interval";
import {approxZones} from "./activity.interval-p.functions";
import {ActivityIntervalPW} from "./activity.interval-pw";
import {DurationMeasure, IntensityMeasure} from "./activity.models";

export class ActivityIntervalP extends ActivityInterval implements IActivityIntervalP {

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
    duration: IDurationMeasure;
    movingDuration: IDurationMeasure;
    heartRate: IIntensityMeasure;
    power: IIntensityMeasure;
    speed: IIntensityMeasure;
    totalMeasures: ICalcMeasures; //для первых инетрвало в рамках группы

    private readonly limit: { warn: number, error: number} = { warn: 10, error: 20 };
    private readonly opposite: any = {
        intensityLevelFrom: "intensityByFtpFrom",
        intensityLevelTo: "intensityByFtpTo",
        intensityByFtpFrom: "intensityLevelFrom",
        intensityByFtpTo: "intensityLevelTo",
    };
    private readonly ftpMeasures = [
        ["intensityByFtpFrom", "intensityByFtpTo"],
        ["intensityLevelFrom", "intensityLevelTo"],
    ];

    hasRecalculate: boolean = false;
    keys: string[] = ["params", "calcMeasures", "isSelected", "distance", "duration", "movingDuration",
        "heartRate", "power", "speed", "speed", "zones", "limit", "opposite", "index", "ftpMeasures", "keys",
        "hasRecalculate", "totalMeasures"];

    constructor(type: string, params: IActivityInterval) {
        super(type, params);

        this.distance = this.distance || new DurationMeasure();
        this.duration = this.duration || new DurationMeasure();
        this.movingDuration = this.movingDuration || new DurationMeasure();

        this.heartRate = this.heartRate || new IntensityMeasure();
        this.speed = this.speed || new IntensityMeasure();
        this.power = this.power || new IntensityMeasure();

        this.prepareDuration();
        this.prepareIntensity();
    }

    private prepareDuration() {

        ["distance", "duration", "movingDuration"].forEach((m) => !this[m].durationValue && Object.assign(this[m], {
            durationValue: (this.durationMeasure === m && this.durationValue) || null,
        }));
    }

    private prepareIntensity() {

        ["heartRate", "speed", "power"].forEach((m) =>
            (!this[m].intensityLevelFrom && !this[m].intensityByFtpFrom) && Object.assign(this[m], {
            intensityLevelFrom: (this.intensityMeasure === m && this.intensityLevelFrom) || null,
            intensityLevelTo: (this.intensityMeasure === m && this.intensityLevelTo) || null,
            intensityByFtpFrom: (this.intensityMeasure === m && this.intensityByFtpFrom) || null,
            intensityByFtpTo: (this.intensityMeasure === m && this.intensityByFtpTo) || null,
        }));
    }

    /**
     * @description Очитска интервала от вспомагательных полей, перевод к структуре api
     * @param keys
     * @returns {IActivityIntervalP}
     */
    clear(keys: string[] = this.keys): IActivityIntervalP {
        let interval: IActivityIntervalP = Object.assign({}, this);
        if (this.hasRecalculate) {
            ["calcMeasures"].map((key) => this.keys.splice(this.keys.indexOf(key), 1));
        }
        keys.map((p) => interval.hasOwnProperty(p) && delete interval[p]);
        return interval;
    }

    /**
     * Восстановление первоначального интервала
     * @param initial
     */
    reset(): ActivityIntervalP | ActivityIntervalPW {
        return Object.assign(this, this.params);
    }

    /**
     * @description Запрос данных по заданию
     * @returns {{keyInterval: boolean, durationMeasure: string, durationValue: number, movingDurationLength: number,
     * movingDurationApprox: boolean, distanceLength: number, distanceApprox: boolean, intensityMeasure: string,
      * intensityLevelFrom: number, intensityByFtpFrom: number, intensityLevelTo: number, intensityByFtpTo: number,
      * intensityDistribution: string, intensityFtpMax: number, intensityMaxZone: number}}
     */
    assignment(): Object {
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

            isSelected: this.isSelected,

            distance: this.distance,
            duration: this.duration,
            movingDuration: this.movingDuration,
            heartRate: this.heartRate,
            speed: this.speed,
            power: this.power,

        };
    }

    /**
     * @description Дополняем интревал не заполненными значениями
     * Метод работает как для заполнения интревала в целом, так и после изменения парамтреа длительности или
     * интенсивности
     */
    complete(
        ftp: {[measure: string]: number},
        ftpState: FtpState = FtpState.On,
        changes: Array<{
            measure: string;
            value: DurationMeasure | IntensityMeasure}> = []): ActivityIntervalP {

        changes.forEach((change) => {
            // Изменилась длительность
            if (change.value instanceof  DurationMeasure) {
                // 1. Устанавливаем параметр длительности
                this.durationMeasure = change.measure;
                // 2. Устанавливаем значение длительности
                this.durationValue = change.value.durationValue;
            }

            // Изменилась интенсивность
            if (change.value instanceof IntensityMeasure) {
                // 3. Устанавливаем параметр интенсивности
                this.intensityMeasure = change.measure;
                // 4. Устанавливаем значение длительности
                this.ftpMeasures[ftpState].map((key) => this[key] = change.value[key]);
                // 5. Добавляем относительные значения интенсивности в параметре и в интервале
                this.ftpMeasures[ftpState].map((key) =>
                    this[this.opposite[key]] = this[this.intensityMeasure][this.opposite[key]] =
                        this.calculateFtpValue(ftp[this.intensityMeasure], ftpState, key));
                // 6. Опредлеяем максимальную зону интенсивности
                [this.intensityFtpMax, this.intensityMaxZone] = this.maxZone();
            }

            // 6. Рассчитываем время и расстояние по сегменту, а также признаки приблизительного расчета:
            // movingDurationLength, distanceLength, movingDurationApprox, distanceLengthApprox
            [this.movingDurationLength, this.distanceLength, this.movingDurationApprox, this.distanceApprox] =
                this.approxCalc(this.intensityMeasure, ftp);
        });

        //
        return this;
    }

    /**
     * @description Перерасчет относительного значения интенсивности в асболютное и наоборот
     * @param ftp - значение ftp
     * @param ftpState - режим ввода значения
     * @param key - параметр, на основание которого необходимо рассчитать
     * @param measure - показатель интенсиновсти, по которому идет расчет
     * @returns {number} - рассчитанное знаение аболютное | относительное
     */
    calculateFtpValue(
        ftp: number,
        ftpState: FtpState,
        key: string,
        measure: string = this.intensityMeasure): number {

        return ftpState === FtpState.On ? this[measure][key] * ftp : Math.ceil(this[measure][key] * 100 / ftp) / 100;
    }

    approxCalc(measure, ftp: {[measure: string]: number}): any[] {

        if ((this.durationMeasure === "duration" || this.durationMeasure === "movingDuration") &&
            this.intensityMeasure === "speed") {
            return [this.durationValue,
                this.durationValue * (this.intensityLevelFrom + this.intensityLevelTo) / 2,
                false, false];

        } else if (this.durationMeasure === "distance" &&
            this.intensityMeasure === "speed") {
            return [this.durationValue / ((this.intensityLevelFrom + this.intensityLevelTo) / 2),
                this.durationValue,
                false, false];

        } else if ((this.durationMeasure === "duration" || this.durationMeasure === "movingDuration") &&
            (this.intensityMeasure === "heartRate" || this.intensityMeasure === "power")) {
            const speed: number = this.approxSpeed(measure, ftp);
            return [this.durationValue, this.durationValue * speed, false, true];

        } else if (this.durationMeasure === "distance" &&
            (this.intensityMeasure === "heartRate" || this.intensityMeasure === "power")) {
            const speed: number = this.approxSpeed(measure, ftp);
            return [this.durationValue / speed, this.durationValue, true, false];

        } else {
            return [null, null, false, false];
        }
    }

    approxSpeed(measure, ftp: {[measure: string]: number}): number {
        const FTP: number = (this.intensityByFtpFrom + this.intensityByFtpTo) / 2;

        if (!FTP) {
            return null;
        }

        const zoneId: number = approxZones[measure].findIndex((z) => FTP.toFixed(2) >= z.from && FTP.toFixed(2) <= z.to);
        let delta: number, approxFTP: number;

        if (zoneId === 0) { // для первой зоны
            delta = FTP / approxZones[measure][zoneId].to;
            approxFTP = approxZones.speed[zoneId].to * delta;
        } else if (zoneId === approxZones[measure].length - 1) {  // для последней зоны
            delta = FTP / approxZones[measure][zoneId].from;
            approxFTP = approxZones.speed[zoneId].from * delta;
        } else { // для всех остальных зон
            delta = (FTP - approxZones[measure][zoneId].from) / (approxZones[measure][zoneId].to - approxZones[measure][zoneId].from);
            approxFTP = approxZones.speed[zoneId].from + delta * (approxZones.speed[zoneId].to - approxZones.speed[zoneId].from);
        }

        //console.log('approx', measure, FTP, zoneId, delta, approxFTP, this.getFTP('speed'));
        return approxFTP * ftp["speed"];
    }

    maxZone(): number[] {
        return [0, 0];
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

        if (this.intensityMeasure) {
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
    percent(): number {
        return this.hasOwnProperty("calcMeasures") && this.calcMeasures.hasOwnProperty("completePercent") &&
            this.calcMeasures.completePercent.hasOwnProperty("value") && this.calcMeasures.completePercent.value * 100 ||
            null;
    }

    /**
     * @description Статус выполнения интервала
     * @returns {string}
     */
    get status(): string {
        return  (this.percent() === null && "coming") ||
                (Math.abs(100 - this.percent()) <= this.limit.warn) && "complete" ||
                (Math.abs(100 - this.percent()) <= this.limit.error) && "complete-warn" ||
                (Math.abs(100 - this.percent()) > this.limit.error) && "complete-error";

    }

    /**
     * @description Подготавливаем инетрвал для перерасчета на стороне бэка
     * @returns {IActivityIntervalP}
     */
    prepareForCalculateRange(): IActivityIntervalP {
        const interval: IActivityIntervalP = copy(this);
        this.keys.map((p) => delete interval[p]);
        this.hasRecalculate = true;

        interval.startTimestamp = null;
        interval.endTimestamp = null;
        return interval;
    }

    /**
     * @description подготовка интревала к сохранению в шаблоне
     * @returns {IActivityIntervalPW}
     */
    toTemplate(): IActivityIntervalP | IActivityIntervalPW {

        let interval: IActivityIntervalPW = Object.assign({}, this);
        interval.intensityLevelFrom = null;
        interval.intensityLevelTo = null;
        interval.intensityByFtpFrom = Math.ceil(this.intensityByFtpFrom * 100) / 100;
        interval.intensityByFtpTo = Math.ceil(this.intensityByFtpTo * 100) / 100;

        this.keys.map(k => interval.hasOwnProperty(k) && delete interval[k]);

        return interval;
    }

}
