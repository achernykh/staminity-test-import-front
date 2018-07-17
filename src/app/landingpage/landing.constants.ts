interface LandingContentBlock {
    code: string; // for translate key, example landing[scenario.code][block.code].[title | subtitle | text]
    title: string;
    subtitle?: string;
    text: string;
    button?: {
        text: string;
        url: string;
    };
    picture: string; // url to content server
}

interface LandingReview {
    avatar: string;
    author: string;
    country: string;
    text: string;
}

export interface LandingConfig {
    reviews: {
        [conutry: string]: LandingReview[]
    };
    scenario: [{
        code: string; // example, trainingPlans, coachOnline and e.t.c
        url: string;
        title: string;
        subtitle: string;
        picture: string;
        button?: {
            text: string;
            url: string;
        };
        blocks: LandingContentBlock[];
        externalBlocks?: LandingContentBlock[];
    }]
}

export const landingConfig: LandingConfig = {
    reviews: {
        ru: [{
            avatar: '',
            author: '',
            country: '',
            text: ''
        }]
    },
    scenario: [
        {
            code: 'workWithCoach',
            url: 'cases/work-with-coach',
            title: '',
            subtitle: '',
            picture: '',
            blocks: [{
                code: 'block1',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block4',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            }],
        },
        {
            code: 'trainingPlans',
            url: 'cases/training-plans',
            title: '',
            subtitle: '',
            picture: '',
            blocks: [{
                code: 'block1',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block4',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            }
            ],
        },
        {
            code: 'individualTraining',
            url: 'cases/individual-training',
            title: '',
            subtitle: '',
            picture: '',
            blocks: [{
                code: 'block1',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block4',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block5',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            }],
        },
        {
            code: 'trainAthletes',
            url: 'cases/train-athletes',
            title: '',
            subtitle: '',
            picture: '',
            blocks: [{
                code: 'block1',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block4',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block5',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            }],
        },
        {
            code: 'trainGroups',
            url: 'cases/train-groups',
            title: '',
            subtitle: '',
            picture: '',
            blocks: [{
                code: 'block1',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            }],
        },
        {
            code: 'trainingPlanPublication',
            url: 'cases/training-plan-publication',
            title: '',
            subtitle: '',
            picture: '',
            blocks: [{
                code: 'block1',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block4',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            }],
        },
        {
            code: 'severalCoaches',
            url: 'cases/several-coaches',
            title: '',
            subtitle: '',
            picture: '',
            blocks: [{
                code: 'block1',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            },{
                code: 'block4',
                title: '',
                subtitle: '',
                text: '',
                picture: '',
            }],
        },
    ]
};