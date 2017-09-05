import {IActivityIntervalP} from "../../../../api/activity/activity.interface";
import {DurationMeasure, IntensityMeasure} from "../activity-datamodel/activity.models";
import {ActivityIntervalP} from "../activity-datamodel/activity.interval-p";

// Предустановки добавления нового сегмента по видам спорта
export const segmentTemplate = (pos: number, sport: string, type: string = 'default'):IActivityIntervalP => {

    return Object.assign(getTemplates()[sport][type], {pos: pos},);
};

const getTemplates = () => ({
    run: {
        default: {
            durationMeasure: 'distance',
            intensityMeasure: 'heartRate',
            distance: new DurationMeasure(1000),
            heartRate: new IntensityMeasure(0.70,0.74)
        }
    },
    bike: {
        durationMeasure: 'movingDuration',
        intensityMeasure: 'heartRate',
        duration: 600,
        intensityByFtpFrom: 0.70,
        intensityByFtpTo: 0.74

    }
});

/**
 * Указываем какие данные необходимо взять за основу для расчета всех параметров интервала
 * @param interval
 */
export const getChanges = (interval: ActivityIntervalP):Array<any> => [
    {
        measure: interval.durationMeasure,
        value: interval[interval.durationMeasure]
    },
    {
        measure: interval.intensityMeasure,
        value: interval[interval.intensityMeasure]
    }
];