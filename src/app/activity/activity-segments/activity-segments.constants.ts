import {IActivityIntervalP} from "../../../../api/activity/activity.interface";
import {DurationMeasure, IntensityMeasure} from "../activity-datamodel/activity.models";
import {ActivityIntervalP} from "../activity-datamodel/activity.interval-p";

// Предустановки добавления нового сегмента по видам спорта
export const segmentTemplate = (pos: number, sport: string, type: string = 'default'):IActivityIntervalP => {

    return Object.assign(getSegmentTemplates()[sport][type], {pos: pos},);
};

export const getSegmentTemplates = () => ({
    run: {
        first: [
            {
                durationMeasure: 'distance',
                intensityMeasure: 'heartRate',
                distance: new DurationMeasure(1*1000), //m
                heartRate: new IntensityMeasure(0.70,0.74)
            },
            {
                durationMeasure: 'movingDuration',
                intensityMeasure: 'heartRate',
                movingDuration: new DurationMeasure(50*60), //m
                heartRate: new IntensityMeasure(0.75,0.78)
            },
            {
                durationMeasure: 'distance',
                intensityMeasure: 'heartRate',
                distance: new DurationMeasure(1*1000), //m
                heartRate: new IntensityMeasure(0.70,0.74)
            }
        ],
        default: [
            {
                durationMeasure: 'distance',
                intensityMeasure: 'heartRate',
                distance: new DurationMeasure(10*100), //m
                heartRate: new IntensityMeasure(0.70,0.74)
            }
        ]
    },
    bike: {
        default: [{
            durationMeasure: 'movingDuration',
            intensityMeasure: 'heartRate',
            distance: new DurationMeasure(60*10), //sec
            heartRate: new IntensityMeasure(0.70,0.74)
        }]
    },
    swim: {
        default: [{
            durationMeasure: 'distance',
            intensityMeasure: 'speed',
            distance: new DurationMeasure(5*100), //m
            heartRate: new IntensityMeasure(0.70,0.74)
        }]
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