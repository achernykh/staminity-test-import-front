import {IActivityIntervalP} from "../../../../api/activity/activity.interface";
import {DurationMeasure, IntensityMeasure} from "../activity-datamodel/activity.models";
import {ActivityIntervalP} from "../activity-datamodel/activity.interval-p";
import {genHash} from "../../share/utils-function";

// Предустановки добавления нового сегмента по видам спорта
export const segmentTemplate = (pos: number, sport: string, type: string = 'default'):IActivityIntervalP => {

    return Object.assign(getSegmentTemplates()[sport][type], {pos: pos},);
};

export const getSegmentTemplates = (group:string = genHash(6)) => ({
    run: {
        first: [
            {
                type: 'P',
                durationMeasure: 'distance',
                intensityMeasure: 'heartRate',
                distance: new DurationMeasure(1*1000), //m
                heartRate: new IntensityMeasure(0.75,0.80)
            },
            {
                type: 'G',
                code: group,
                repeatCount: 2,
                grpLength: 2,
                fPos: null //определяется на следующем шаге, обязательно чтобы далее следовал интервал группы
            },
            {
                type: 'P',
                parentGroupCode: group,
                repeatPos: 0,
                durationMeasure: 'movingDuration',
                intensityMeasure: 'speed',
                movingDuration: new DurationMeasure(50*60), //sec
                speed: new IntensityMeasure(0.85,0.85)
            },
            {
                type: 'P',
                parentGroupCode: group,
                repeatPos: 0,
                durationMeasure: 'distance',
                intensityMeasure: 'heartRate',
                distance: new DurationMeasure(1*1000), //m
                heartRate: new IntensityMeasure(0.75,0.80)
            },
            {
                type: 'P',
                parentGroupCode: group,
                repeatPos: 1,
                durationMeasure: 'movingDuration',
                intensityMeasure: 'speed',
                movingDuration: new DurationMeasure(50*60), //sec
                speed: new IntensityMeasure(0.85,0.85)
            },
            {
                type: 'P',
                parentGroupCode: group,
                repeatPos: 1,
                durationMeasure: 'distance',
                intensityMeasure: 'heartRate',
                distance: new DurationMeasure(1*1000), //m
                heartRate: new IntensityMeasure(0.75,0.80)
            },
            {
                type: 'P',
                durationMeasure: 'distance',
                intensityMeasure: 'heartRate',
                distance: new DurationMeasure(1*1000), //m
                heartRate: new IntensityMeasure(0.75,0.80)
            }
        ],
        default: [
            {
                type: 'P',
                durationMeasure: 'distance',
                intensityMeasure: 'heartRate',
                distance: new DurationMeasure(10*100), //m
                heartRate: new IntensityMeasure(0.74,0.80)
            }
        ]
    },
    bike: {
        first: [{
                durationMeasure: 'movingDuration',
                intensityMeasure: 'heartRate',
                movingDuration: new DurationMeasure(60*60), //sec
                heartRate: new IntensityMeasure(0.80,0.80)
            }
        ],
        default: [{
            durationMeasure: 'movingDuration',
            intensityMeasure: 'heartRate',
            distance: new DurationMeasure(60*10), //sec
            heartRate: new IntensityMeasure(0.75,0.75)
        }]
    },
    swim: {
        first: [{
                durationMeasure: 'distance',
                intensityMeasure: 'speed',
                movingDuration: new DurationMeasure(10*100), //m
                speed: new IntensityMeasure(0.90,0.90)
            }
        ],
        default: [{
            durationMeasure: 'distance',
            intensityMeasure: 'speed',
            distance: new DurationMeasure(3*100), //m
            speed: new IntensityMeasure(0.75,0.75)
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