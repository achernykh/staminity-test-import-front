interface LandingContentBlock {
    code: string; // for translate key, example landing[scenario.code][block.code].[title | subtitle | text]
    title: string;
    subtitle?: string;
    text: string;
    button?: string; // text or null
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
            code: 'trainingPlans',
            url: 'cases/training-plans',
            blocks: [

            ],
            externalBlocks: [

            ]
        }
    ]
};