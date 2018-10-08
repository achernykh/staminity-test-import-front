import { IActivityType, IDurationMeasure } from "../../../api/activity/activity.interface";

export const activityTypes: IActivityType[] = [
    {id: 2, code: "run", typeBasic: "run", enabled: true, isBasic: true},
    {id: 3, code: "streetRun", typeBasic: "run", enabled: true, isBasic: false},
    {id: 4, code: "indoorRun", typeBasic: "run", enabled: true, isBasic: false},
    {id: 5, code: "trailRun", typeBasic: "run", enabled: true, isBasic: false},
    {id: 6, code: "treadmillRun", typeBasic: "run", enabled: true, isBasic: false},
    {id: 7, code: "swim", typeBasic: "swim", enabled: true, isBasic: true},
    {id: 8, code: "openWaterSwim", typeBasic: "swim", enabled: true, isBasic: false},
    {id: 9, code: "poolSwim", typeBasic: "swim", enabled: true, isBasic: false},
    {id: 10, code: "bike", typeBasic: "bike", enabled: true, isBasic: true},
    {id: 11, code: "trackBike", typeBasic: "bike", enabled: true, isBasic: false},
    {id: 12, code: "indoorBike", typeBasic: "bike", enabled: true, isBasic: false},
    {id: 13, code: "strength", typeBasic: "strength", enabled: true, isBasic: true},
    {id: 14, code: "transition", typeBasic: "transition", enabled: false, isBasic: false},
    {id: 15, code: "swimToBike", typeBasic: "transition", enabled: false, isBasic: false},
    {id: 16, code: "bikeToRun", typeBasic: "transition", enabled: false, isBasic: false},
    {id: 17, code: "swimToRun", typeBasic: "transition", enabled: false, isBasic: false},
    {id: 18, code: "ski", typeBasic: "ski", enabled: true, isBasic: true},
    {id: 24, code: "rowing", typeBasic: "rowing", enabled: true, isBasic: true},
    {id: 25, code: "rowingIndoor", typeBasic: "rowing", enabled: true, isBasic: false},
    {id: 1, code: "other", typeBasic: "other", enabled: true, isBasic: true},
];

export const getType = (id: number): IActivityType => activityTypes.filter((type) => type.id === id)[0];
export const getSportBasic = (): IActivityType[] => activityTypes.filter((type) => type.isBasic);
export const getActivityTypesId = (): number[] => activityTypes.filter(a => a.enabled).map(t => t.id);
export const getSportsByBasicId = (basic: number): number[] => {
    const basicType: IActivityType = getType(basic);
    return activityTypes.filter((type) => type.typeBasic === basicType.code).map((t) => t.id);
};
export const getBasicSport = (parentCode: string) => activityTypes.filter(t => t.code === parentCode)[0];

export interface ActivityConfigConstants {
    defaultDurationType: {
        [sport: string]: string;
    };
    defaultIntensityType: {
        [sport: string]: string;
    };
    intensityBySport: {
        [sport: string]: string[];
    };
    valuePosition: {
        [measure: string]: string;
    };
    oppositeDurationMeasure: {
        [measure: string]: string;
    };
}

export const activityConfigConstants: ActivityConfigConstants = {
    defaultDurationType: {
        run: 'distance',
        bike: 'duration',
        swim: 'duration',
        ski: 'distance',
        rowing: 'distance',
        default: 'duration',
    },
    defaultIntensityType: {
        run: 'speed',
        bike: 'heartRate',
        swim: 'speed',
        ski: 'heartRate',
        rowing: 'heartRate',
        default: 'speed'
    },
    intensityBySport: {
        swim: ['heartRate','speed'],
        bike: ['heartRate', 'speed','power'],
        run: ['heartRate', 'speed'],
        strength: ['heartRate'],
        transition: ['heartRate', 'speed'],
        ski: ['heartRate', 'speed'],
        rowing: ['heartRate', 'speed'],
        other: ['heartRate', 'speed'],
        default: ['heartRate', 'speed'],
    },
    valuePosition: {
        movingDuration: 'value',
        duration: 'value',
        distance: 'value',
        heartRate: 'avgValue',
        speed: 'avgValue',
        power: 'avgValue'
    },
    oppositeDurationMeasure: {
        distance: 'duration',
        duration: 'movingDuration',
        movingDuration: 'distance',
    }
};

//export const getCategory(id: number):IActivityCategory => this.category.filter(type => type.id === id)[0];
