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
            code: 'trainingPlans',
            url: 'cases/training-plans',
            title: '',
            subtitle: '',
            picture: '',
            blocks: [{
                code: '',
                title: '',
                subtitle: '',
                text: '',
                picture: ''
            }],
        }
    ]
};