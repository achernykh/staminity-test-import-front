export interface ICompetitionStageConfig {
    activityTypeId: number;
    durationMeasure: 'distance' | 'movingDuration';
    durationValue?: number;
    distanceLength?: number;
    movingDurationLength?: number;
    intensityMeasure?: 'speed' | 'heartRate' | 'power';
}

export interface ICompetitionConfig {
    priorities: Array<string>;
    types: {
        [type: string]: {
            [distance: string]: Array<ICompetitionStageConfig>;
        };
    };
    getTypes: () => Array<string>;
    getDistance: (type: string) => Array<string>;

}

export class CompetitionConfig implements CompetitionConfig {
    priorities: Array<string> = ['A','B','C'];
    types: {
        [type: string]: {
            [distance: string]: Array<ICompetitionStageConfig>;
        };
    } =
    {
        run: {
            marathon: [
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 42.125*1000,
                }
            ],
            halfMarathon: [
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 21.075*1000
                }
            ]
        },
        triathlon: {
            olympic: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 1.5*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'distance',
                    movingDurationLength: 5*60
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'movingDuration',
                    distanceLength: 40*1000,
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'distance',
                    movingDurationLength: 5*60
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 10*1000
                }
            ]
        }
    };

    getTypes (): Array<string> {
        return Object.keys(this.types);
    }

    getDistance (type: string): Array<string> {
        return type ? Object.keys(this.types[type]) : [];
    }
};