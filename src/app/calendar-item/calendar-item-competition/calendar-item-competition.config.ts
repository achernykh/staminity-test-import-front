export interface ICompetitionStageConfig {
    activityTypeId: number;
    durationMeasure: 'distance' | 'duration' | 'movingDuration';
    durationValue?: number;
    distanceLength?: number;
    movingDurationLength?: number;
    intensityMeasure?: 'speed' | 'heartRate' | 'power';
}

export interface ICompetitionConfig {
    priorities: Array<string>;
    types: any;
    distanceTypes: any;
    getTypes: () => Array<string>;
    getDistance: () => Array<any>;

}

export class CompetitionConfig implements CompetitionConfig {
    priorities: Array<string> = ['A','B','C'];
    types: any = ['run', 'triathlon', 'swim', 'bike', 'ski'];
    distanceTypes: any = [
        {
            type: 'run',
            code: 'marathon',
            stages: [{
                    activityTypeId: 2,
                    durationMeasure: 'duration',
                    distanceLength: 42.195*1000
                }
            ]
        },
        {
            type: 'run',
            code: 'halfMarathon',
            stages: [{
                    activityTypeId: 2,
                    durationMeasure: 'duration',
                    distanceLength: 21.097*1000
                }
            ]
        },
        {
            type: 'run',
            code: '10km',
            stages: [{
                    activityTypeId: 2,
                    durationMeasure: 'duration',
                    distanceLength: 10*1000
                }
            ]
        },
        {
            type: 'run',
            code: '5km',
            stages: [{
                    activityTypeId: 2,
                    durationMeasure: 'duration',
                    distanceLength: 5*1000
                }
            ]
        },
        /*
        {
            type: 'run',
            code: 'custom',
            stages: [{
                    activityTypeId: 2,
                    durationMeasure: 'duration',
                    distanceLength: null
                }
            ]
        }, */
        {
            type: 'run',
            code: 'customDuration',
            stages: [{
                activityTypeId: 2,
                durationMeasure: 'duration',
                distanceLength: null
            }
            ]
        },
        {
            type: 'run',
            code: 'customDistance',
            stages: [{
                activityTypeId: 2,
                durationMeasure: 'distance',
                movingDurationLength: null
            }
            ]
        },
        /* пока скрываем бег по времени
        {
            type: 'run',
            code: '24h',
            stages: [{
                    activityTypeId: 2,
                    durationMeasure: 'distance',
                    movingDurationLength: 24*60*60-1
                }
            ]
        },
        {
            type: 'run',
            code: '1h',
            stages: [{
                    activityTypeId: 2,
                    durationMeasure: 'distance',
                    movingDurationLength: 60*60
                }
            ]
        }, */
        // triathlon competitions
        {
            type: 'triathlon',
            code: 'fullDistance',
            stages: [{
                    activityTypeId: 7,
                    durationMeasure: 'duration',
                    distanceLength: 3.8*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'duration',
                    distanceLength: null
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'duration',
                    distanceLength: 180*1000
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'duration',
                    distanceLength: null
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'duration',
                    distanceLength: 42.195*1000
                }
            ]
        },
        {
            type: 'triathlon',
            code: 'halfDistance',
            stages: [{
                    activityTypeId: 7,
                    durationMeasure: 'duration',
                    distanceLength: 1.9*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'duration',
                    distanceLength: null
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'duration',
                    distanceLength: 90*1000
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'duration',
                    distanceLength: null
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'duration',
                    distanceLength: 21.097*1000
                }
            ]
        },
        {
            type: 'triathlon',
            code: '1/4',
            stages: [{
                    activityTypeId: 7,
                    durationMeasure: 'duration',
                    distanceLength: 1*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'duration',
                    distanceLength: null
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'duration',
                    distanceLength: 45*1000
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'duration',
                    distanceLength: null
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'duration',
                    distanceLength: 10*1000
                }]
        },
        {
            type: 'triathlon',
            code: 'olympic',
            stages: [{
                    activityTypeId: 7,
                    durationMeasure: 'duration',
                    distanceLength: 1.5*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'duration',
                    distanceLength: null
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'duration',
                    distanceLength: 40*1000
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'duration',
                    distanceLength: null
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'duration',
                    distanceLength: 10*1000
                }
            ]
        },
        {
            type: 'triathlon',
            code: 'sprint',
            stages: [{
                    activityTypeId: 7,
                    durationMeasure: 'duration',
                    distanceLength: 0.75*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'duration',
                    distanceLength: null
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'duration',
                    distanceLength: 20*1000
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'duration',
                    distanceLength: null
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'duration',
                    distanceLength: 5*1000
                }
            ]
        },
        {
            type: 'triathlon',
            code: '1/8',
            stages: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'duration',
                    distanceLength: 0.5*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'duration',
                    distanceLength: null
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'duration',
                    distanceLength: 22*1000
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'duration',
                    distanceLength: null
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'duration',
                    distanceLength: 5*1000
                }
            ]
        },
        {
            type: 'triathlon',
            code: 'indoor',
            stages: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'distance',
                    movingDurationLength: 10*60
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'distance',
                    movingDurationLength: 0,
                    distanceLength: 0
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'distance',
                    movingDurationLength: 30*60
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'distance',
                    movingDurationLength: 0,
                    distanceLength: 0
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'distance',
                    movingDurationLength: 20*60
                }
            ]
        },
        // swim
        {
            type: 'swim',
            code: '10km',
            stages: [{
                activityTypeId: 7,
                durationMeasure: 'duration',
                distanceLength: 10*1000
            }]
        },
        {
            type: 'swim',
            code: '7km',
            stages: [{
                activityTypeId: 7,
                durationMeasure: 'duration',
                distanceLength: 7*1000
            }]
        },
        {
            type: 'swim',
            code: '5km',
            stages: [{
                activityTypeId: 7,
                durationMeasure: 'duration',
                distanceLength: 5*1000
            }]
        },
        {
            type: 'swim',
            code: '4km',
            stages: [{
                activityTypeId: 7,
                durationMeasure: 'duration',
                distanceLength: 4*1000
            }]
        },
        {
            type: 'swim',
            code: '3km',
            stages: [{
                activityTypeId: 7,
                durationMeasure: 'duration',
                distanceLength: 3*1000
            }]
        },
        {
            type: 'swim',
            code: '1km',
            stages: [{
                activityTypeId: 7,
                durationMeasure: 'duration',
                distanceLength: 1*1000
            }]
        },
        {
            type: 'swim',
            code: '1mile',
            stages: [{
                activityTypeId: 7,
                durationMeasure: 'duration',
                distanceLength: 1.852*1000
            }]
        },
        {
            type: 'swim',
            code: '60min',
            stages: [{
                activityTypeId: 7,
                durationMeasure: 'distance',
                movingDurationLength: 60*60
            }]
        },
        {
            type: 'swim',
            code: '30min',
            stages: [{
                activityTypeId: 7,
                durationMeasure: 'distance',
                movingDurationLength: 30*60
            }]
        },
        /*
        {
            type: 'swim',
            code: 'custom',
            stages: [{
                activityTypeId: 7,
                durationMeasure: 'duration',
                distanceLength: null
            }]
        }, */
        {
            type: 'swim',
            code: 'customDuration',
            stages: [{
                activityTypeId: 7,
                durationMeasure: 'duration',
                distanceLength: null
            }]
        },
        {
            type: 'swim',
            code: 'customDistance',
            stages: [{
                activityTypeId: 7,
                durationMeasure: 'distance',
                movingDurationLength: null
            }]
        },
        // bike
        {
            type: 'bike',
            code: 'customDuration',
            stages: [{
                activityTypeId: 10,
                durationMeasure: 'duration',
                distanceLength: null
            }]
        },
        {
            type: 'bike',
            code: 'customDistance',
            stages: [{
                activityTypeId: 10,
                durationMeasure: 'distance',
                movingDurationLength: null
            }]
        },
        // ski
        {
            type: 'ski',
            code: '10km',
            stages: [{
                activityTypeId: 18,
                durationMeasure: 'duration',
                distanceLength: 10*1000
            }]
        },
        {
            type: 'ski',
            code: '15km',
            stages: [{
                activityTypeId: 18,
                durationMeasure: 'duration',
                distanceLength: 15*1000
            }]
        },
        {
            type: 'ski',
            code: '30km',
            stages: [{
                activityTypeId: 18,
                durationMeasure: 'duration',
                distanceLength: 30*1000
            }]
        },
        {
            type: 'ski',
            code: '50km',
            stages: [{
                activityTypeId: 18,
                durationMeasure: 'duration',
                distanceLength: 50*1000
            }]
        },
        {
            type: 'ski',
            code: '70km',
            stages: [{
                activityTypeId: 18,
                durationMeasure: 'duration',
                distanceLength: 70*1000
            }]
        },
        {
            type: 'ski',
            code: 'customDuration',
            stages: [{
                activityTypeId: 18,
                durationMeasure: 'duration',
                distanceLength: null
            }]
        },
        {
            type: 'ski',
            code: 'customDistance',
            stages: [{
                activityTypeId: 18,
                durationMeasure: 'distance',
                movingDurationLength: null
            }]
        },
    ];
    /**types: {
        [type: string]: {
            [distance: string]: Array<ICompetitionStageConfig>;
        };
    } =
    {
        run: {
            runMarathon: [
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 42.195*1000
                }
            ],
            runHalfMarathon: [
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 21.097*1000
                }
            ],
            runTenKm: [
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 10*1000
                }
            ],
            runFiveKm: [
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 5*1000
                }
            ],
            runRandom: [
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                }
            ],
            runFullDay: [
                {
                    activityTypeId: 2,
                    durationMeasure: 'distance',
                    movingDurationLength: 24*60*60
                }
            ],
            runOneHour: [
                {
                    activityTypeId: 2,
                    durationMeasure: 'distance',
                    movingDurationLength: 24*60
                }
            ]

        },
        triathlon: {
            ironmanFull: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 3.8*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'movingDuration',
                    distanceLength: 180*1000,
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 42.195*1000
                }
            ],
            ironmanHalf: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 1.9*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'movingDuration',
                    distanceLength: 90*1000,
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 21.097*1000
                }
            ],
            ironmanOneFourth: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 1*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'movingDuration',
                    distanceLength: 45*1000,
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 10*1000
                }
            ],
            olympic: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 1.5*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'movingDuration',
                    distanceLength: 40*1000,
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 10*1000
                }
            ],
            sprint: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 0.75*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'movingDuration',
                    distanceLength: 20*1000,
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 5*1000
                }
            ],
            ironmanOneEight: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 0.5*1000
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'movingDuration',
                    distanceLength: 22*1000,
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'movingDuration',
                    distanceLength: 5*1000
                }
            ],
            indoor: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'distance',
                    movingDurationLength: 10*60
                },
                {
                    activityTypeId: 15,
                    durationMeasure: 'distance',
                    movingDurationLength: 0,
                    distanceLength: 0                },
                {
                    activityTypeId: 10,
                    durationMeasure: 'distance',
                    movingDurationLength: 30*60
                },
                {
                    activityTypeId: 16,
                    durationMeasure: 'distance',
                    movingDurationLength: 0,
                    distanceLength: 0
                },
                {
                    activityTypeId: 2,
                    durationMeasure: 'distance',
                    movingDurationLength: 20*60
                }
            ]
        },
        swim: {
            swimTen: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 10*1000
                }
            ],
            swimFive: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 5*1000
                }
            ],
            swimThree: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 3*1000
                }
            ],
            swimMile: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 1.852*1000
                }
            ],
            swimOne: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 1*1000
                }
            ],
            swimEightHundred: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 8*100
                }
            ],
            swimFourHundred: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 4*100
                }
            ],
            swimTwoHundred: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 2*100
                }
            ],
            swimOneHundred: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 1*100
                }
            ],
            swimFifty: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: 50
                }
            ],
            swimRandom: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'movingDuration',
                    distanceLength: null
                }
            ],
            swimSixtyMin: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'distance',
                    movingDurationLength: 60*60
                }
            ],
            swimThirtyMin: [
                {
                    activityTypeId: 7,
                    durationMeasure: 'distance',
                    movingDurationLength: 30*60
                }
            ],
        },
        bike: {
            bikeDistanceRandom: [
                {
                    activityTypeId: 10,
                    durationMeasure: 'movingDuration',
                    distanceLength: null,
                }
            ]
        }
    };**/

    getTypes (): Array<string> {
        return Object.keys(this.types);
    }

    getDistance (): Array<any> {
        return Object.keys(this.types).map(t => ({
            type: t,
            distanceType: Object.keys(this.types[t])
        })); // type ? Object.keys(this.types[type]) : [];
    }
};