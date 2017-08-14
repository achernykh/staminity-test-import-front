import {IActivityIntervalPW, ICalcMeasures} from "../../../../api/activity/activity.interface";
import {ActivityIntervalP} from "./activity.interval-p";
import {ActivityIntervalCalcMeasure} from "./activity.models";

export class ActivityIntervalPW extends ActivityIntervalP implements IActivityIntervalPW {

    trainersPrescription: string;
    calcMeasures: ICalcMeasures = new ActivityIntervalCalcMeasure();
    movingDurationApprox: boolean; // временя рассчитано приблизительно
    distanceApprox: boolean; // дистанция рассчитана приблизительно

    constructor(type: string, params: any) {
        super(type, params);
        this.durationValue = this.durationValue || 0;
        this.movingDurationLength = this.movingDurationLength || 0;
        this.distanceLength = this.distanceLength || 0;
    }

    /**
     * Пересчет значений инетрвала на основе массива отдельных интервалов
     * @param intervals = массив интревалов с типом P
     */
    calculate(intervals: Array<ActivityIntervalP>) {
        let update:ActivityIntervalPW = new ActivityIntervalPW('pW',{});

        intervals.forEach(i => {

            update.durationMeasure = i.durationMeasure;
            update.intensityMeasure = i.intensityMeasure;
            update.durationValue += i.durationValue;
            update.movingDurationLength += i.movingDurationLength;
            update.distanceLength += i.distanceLength;
            update.intensityLevelFrom = Math.min(update.intensityLevelFrom || i.intensityLevelFrom, i.intensityLevelFrom); //(update.intensityLevelFrom >= i.intensityLevelFrom || update.intensityLevelFrom === null) ? i.intensityLevelFrom: update.intensityLevelFrom;
            update.intensityLevelTo = Math.max(update.intensityLevelTo || i.intensityLevelTo, i.intensityLevelTo); //(update.intensityLevelTo <= i.intensityLevelTo || update.intensityLevelTo === null) ? i.intensityLevelTo: update.intensityLevelTo;
            update.intensityByFtpFrom = Math.min(update.intensityByFtpFrom || i.intensityByFtpFrom, i.intensityByFtpFrom);//(update.intensityByFtpFrom >= i.intensityByFtpFrom || update.intensityByFtpFrom === null) ? i.intensityByFtpFrom: update.intensityByFtpFrom;
            update.intensityByFtpTo = Math.max(update.intensityByFtpTo || i.intensityByFtpTo, i.intensityByFtpTo); //(update.intensityByFtpTo <= i.intensityByFtpTo || update.intensityByFtpTo === null) ? i.intensityByFtpTo: update.intensityByFtpTo;

        });

        update.movingDurationApprox = intervals.some(i => i.movingDurationApprox);
        update.distanceApprox = intervals.some(i => i.distanceApprox);

        // Округляем дистанцию в м до 100м/1км, по времени до 1/5 минут
        if(update.movingDurationApprox){
            let step: number = update.movingDurationLength > 60 * 60 ? 5 : 1;
            update.movingDurationLength = Math.ceil(update.movingDurationLength / (60 * step)) * 60 * step;
        }
        if(update.distanceApprox){
            let step: number = update.distanceLength > 100 * 100 ? 10 : 1;
            update.distanceLength = Math.ceil(update.distanceLength / (100 * step)) * 100 * step;
        }

        Object.assign(this, update);
    }
}