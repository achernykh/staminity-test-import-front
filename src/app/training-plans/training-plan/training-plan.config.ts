export interface TrainingPlanConfig {
    types: Array<string>;
    distanceTypes: {
        [type: string]: Array<string>;
    };
    tags: Array<string>;
    defaultSettings: {
       type: string,
        distanceType: string,
        tags: Array<string>
    };
}

export const trainingPlanConfig: TrainingPlanConfig = {
    types: ['triathlon', 'run', 'bike', 'swim', 'other'],
    distanceTypes: {
        triathlon: ['olympic', 'fullDistance', 'halfDistance', 'sprint', 'superSprint', 'other'],
        run: ['marathon', 'halfMarathon', '10km', '5km', 'other'],
        bike: ['multiDays'],
        swim: ['10km','other']
    },
    tags: ['beginner', 'advanced', 'pro', 'powerMeter', 'hrBelt', 'weightLoss', 'fitness', 'health'],
    defaultSettings: {
        type: 'triathlon',
        distanceType: null,
        tags: []
    }
};