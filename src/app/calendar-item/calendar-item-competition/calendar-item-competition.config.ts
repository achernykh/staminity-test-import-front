export interface ICompetitionStageConfig {
    activityTypeId: number;
    durationMeasure: 'distance' | 'movingDuration';
    durationValue: number;
    intensityMeasure: 'speed' | 'heartRate' | 'power';
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
                    durationMeasure: 'distance',
                    durationValue: 42.125*1000,
                    intensityMeasure: 'speed',
                }
            ],
            halfMarathon: [
                {
                    activityTypeId: 2,
                    durationMeasure: 'distance',
                    durationValue: 21.075*1000,
                    intensityMeasure: 'speed',
                }
            ]
        },
        triathlon: {
            olympic: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'distance',
                    durationValue: 1.5*1000,
                    intensityMeasure: 'speed',
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'movingDuration',
                    durationValue: 5*60,
                    intensityMeasure: 'speed',
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'distance',
                    durationValue: 40*1000,
                    intensityMeasure: 'speed',
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'movingDuration',
                    durationValue: 5*60,
                    intensityMeasure: 'speed',
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'distance',
                    durationValue: 10*1000,
                    intensityMeasure: 'speed',
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