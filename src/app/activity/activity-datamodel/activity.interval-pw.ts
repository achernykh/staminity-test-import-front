import {
    IActivityIntervalPW, ICalcMeasures, IDurationMeasure,
    IIntensityMeasure,
} from "../../../../api/activity/activity.interface";
import {ActivityIntervalP} from "./activity.interval-p";
import {ActivityIntervalCalcMeasure, DurationMeasure, IntensityMeasure} from "./activity.models";

export class ActivityIntervalPW extends ActivityIntervalP implements IActivityIntervalPW {

    trainersPrescription: string;
    calcMeasures: ICalcMeasures;
    movingDurationApprox: boolean; // временя рассчитано приблизительно
    distanceApprox: boolean; // дистанция рассчитана приблизительно

    // Дополнительные поля для ввода неструктурированной тренировке
    distance: IDurationMeasure;
    movingDuration: IDurationMeasure;
    heartRate: IIntensityMeasure;
    power: IIntensityMeasure;
    speed: IIntensityMeasure;

    constructor(type: string, params: any) {
        super(type, params);

        this.distance = this.distance || new DurationMeasure();
        this.movingDuration = this.movingDuration || new DurationMeasure();

        this.heartRate = this.heartRate || new IntensityMeasure();
        this.speed = this.speed || new IntensityMeasure();
        this.power = this.power || new IntensityMeasure();

        this.prepareData();
    }

    /**
     * @description Подготовка данных модели
     */
    prepareData(): void {
        this.calcMeasures = this.calcMeasures || new ActivityIntervalCalcMeasure();
        this.durationValue = this.durationValue || 0;
        this.movingDurationLength = this.movingDurationLength || 0;
        this.distanceLength = this.distanceLength || 0;

        if (this.durationMeasure === "movingDuration" || this.durationMeasure === "duration") {
            this.movingDuration.durationValue = this.durationValue;
        }

        if (this.durationMeasure === "distance") {
            this.distance.durationValue = this.durationValue;
        }

        if (this.intensityMeasure === "heartRate") {
            Object.assign(this.heartRate, {
                intensityLevelFrom: this.intensityLevelFrom,
                intensityLevelTo: this.intensityLevelTo,
                intensityByFtpFrom: this.intensityByFtpFrom,
                intensityByFtpTo: this.intensityByFtpTo,
            });
        }

        if (this.intensityMeasure === "speed") {
            Object.assign(this.speed, {
                intensityLevelFrom: this.intensityLevelFrom,
                intensityLevelTo: this.intensityLevelTo,
                intensityByFtpFrom: this.intensityByFtpFrom,
                intensityByFtpTo: this.intensityByFtpTo,
            });
        }

        if (this.intensityMeasure === "power") {
            Object.assign(this.power, {
                intensityLevelFrom: this.intensityLevelFrom,
                intensityLevelTo: this.intensityLevelTo,
                intensityByFtpFrom: this.intensityByFtpFrom,
                intensityByFtpTo: this.intensityByFtpTo,
            });
        }
    }

    update(params: Object) {
        Object.assign(this, params);
    }

    /**
     * @description Подготовка данных для передачи в backend
     * @param keys
     * @returns {IActivityIntervalPW}
     */
    clear(keys: string[] = ["params", "distance", "movingDuration", "heartRate", "power", "speed"]): IActivityIntervalPW {
        let interval: IActivityIntervalPW = Object.assign({}, this);
        keys.map((p) => interval.hasOwnProperty(p) && delete interval[p]);
        return interval;
    }

    /**
     * @description Тренировка имеет плановые данные?
     * @returns {boolean}
     */
    specified(): boolean {
        return this.durationValue > 0;
    }

    /**
     * Пересчет значений инетрвала на основе массива отдельных интервалов
     * @param intervals = массив интревалов с типом P
     */
    calculate(intervals: ActivityIntervalP[]) {
        const update: {
            durationMeasure: string,
            intensityMeasure: string,
            durationValue: number,
            movingDurationLength: number,
            distanceLength: number,
            intensityLevelFrom: number,
            intensityLevelTo: number,
            intensityByFtpFrom: number,
            intensityByFtpTo: number,
            movingDurationApprox: boolean,
            distanceApprox: boolean,
        } = {
            durationMeasure: null,
            intensityMeasure: null,
            durationValue: null,
            movingDurationLength: null,
            distanceLength: null,
            intensityLevelFrom: null,
            intensityLevelTo: null,
            intensityByFtpFrom: null,
            intensityByFtpTo: null,
            movingDurationApprox: null,
            distanceApprox: null,
        };

        intervals.forEach((i) => {

            update.durationMeasure = i.durationMeasure;
            update.intensityMeasure = i.intensityMeasure;
            //update.durationValue += i.durationValue || 0;
            update.movingDurationLength += i.movingDurationLength || 0;
            update.distanceLength += i.distanceLength || 0;
            update.intensityLevelFrom = Math.min(update.intensityLevelFrom || i.intensityLevelFrom, i.intensityLevelFrom); //(update.intensityLevelFrom >= i.intensityLevelFrom || update.intensityLevelFrom === null) ? i.intensityLevelFrom: update.intensityLevelFrom;
            update.intensityLevelTo = Math.max(update.intensityLevelTo || i.intensityLevelTo, i.intensityLevelTo); //(update.intensityLevelTo <= i.intensityLevelTo || update.intensityLevelTo === null) ? i.intensityLevelTo: update.intensityLevelTo;
            update.intensityByFtpFrom = Math.min(update.intensityByFtpFrom || i.intensityByFtpFrom, i.intensityByFtpFrom); //(update.intensityByFtpFrom >= i.intensityByFtpFrom || update.intensityByFtpFrom === null) ? i.intensityByFtpFrom: update.intensityByFtpFrom;
            update.intensityByFtpTo = Math.max(update.intensityByFtpTo || i.intensityByFtpTo, i.intensityByFtpTo); //(update.intensityByFtpTo <= i.intensityByFtpTo || update.intensityByFtpTo === null) ? i.intensityByFtpTo: update.intensityByFtpTo;

        });

        update.movingDurationApprox = intervals.some((i) => i.movingDurationApprox);
        update.distanceApprox = intervals.some((i) => i.distanceApprox);

        update.durationMeasure = (!update.movingDurationApprox
            || (update.movingDurationApprox && update.distanceApprox)) && "duration" || "distance";

        update.durationValue = update.durationMeasure === "duration" &&
            update.movingDurationLength || update.distanceLength;

        // Округляем дистанцию в м до 100м/1км, по времени до 1/5 минут
        if (update.movingDurationApprox) {
            const step: number = update.movingDurationLength > 60 * 60 ? 5 : 1;
            update.movingDurationLength = Math.ceil(update.movingDurationLength / (60 * step)) * 60 * step;
        }
        if (update.distanceApprox) {
            const step: number = update.distanceLength > 100 * 100 ? 10 : 1;
            update.distanceLength = Math.ceil(update.distanceLength / (50 * step)) * 50 * step;
        }

        Object.assign(this, update);
    }
}
