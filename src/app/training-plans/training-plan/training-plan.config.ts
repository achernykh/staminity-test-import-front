export interface TrainingPlanConfig {
    types: string[];
    distanceTypes: {
        [type: string]: string[];
    };
    tags: string[];
    defaultSettings: {
       type: string,
        distanceType: string,
        tags: string[],
    };
}

export const trainingPlanConfig: TrainingPlanConfig = {
    types: ["triathlon", "run", "bike", "swim", "other"],
    distanceTypes: {
        triathlon: ["olympic", "fullDistance", "halfDistance", "sprint", "superSprint", "other"],
        run: ["marathon", "halfMarathon", "10km", "5km", "other"],
        bike: ["multiDays"],
        swim: ["10km", "other"],
    },
    tags: ["beginner", "advanced", "pro", "powerMeter", "hrBelt", "weightLoss", "fitness"],
    defaultSettings: {
        type: "triathlon",
        distanceType: null,
        tags: [],
    },
};
