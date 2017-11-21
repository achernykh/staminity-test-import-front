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
                    activityTypeId: 10,
                    durationMeasure: 'distance',
                    durationValue: 42.125*1000,
                    intensityMeasure: 'speed',
                }
            ],
            halfMarathon: [
                {
                    activityTypeId: 10,
                    durationMeasure: 'distance',
                    durationValue: 21.075*1000,
                    intensityMeasure: 'speed',
                }
            ]
        }/*,
        triathlon: {
            olympic: [
                {
                    activityTypeId: 7,
                    distance: 1500,
                    movingDuration: null
                },
                {
                    activityTypeId: 15,
                    distance: null,
                    movingDuration: null
                },
                {
                    activityTypeId: 10,
                    distance: 40*1000,
                    movingDuration: null
                },
                {
                    activityTypeId: 16,
                    distance: null,
                    movingDuration: null
                },
                {
                    activityTypeId: 2,
                    distance: 10*1000,
                    movingDuration: null
                }
            ]
        }*/
    };

    getTypes (): Array<string> {
        return Object.keys(this.types);
    }

    getDistance (type: string): Array<string> {
        return type ? Object.keys(this.types[type]) : [];
    }
};