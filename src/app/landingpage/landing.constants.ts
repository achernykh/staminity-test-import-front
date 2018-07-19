interface LandingContentBlock {
    code?: string; // for translate key, example landing[scenario.code][block.code].[title | subtitle | text]
    title?: string;
    subtitle?: string;
    text?: string;
    button?: {
        text?: string;
        url?: string;
        state?: string;
        stateParams?: Object;
    };
    picture?: string; // url to content server
}

interface LandingReview {
    avatar: string;
    author: string;
    about: string; // role | position ..
    country: string;
    text: string;
    more?: string; // link to more information
}

interface LandingSidenavItem {
    type: 'state' | 'link' | 'group';
    state?: string;
    stateParams?: Object;
    url?: string;
    icon: string;
    title: string;
    items?: LandingSidenavItem[] | 'scenarios'
}

export interface LandingConfig {
    reviews: {
        [language: string]: LandingReview[]
    };
    scenario: [{
        code: string; // example, trainingPlans, coachOnline and e.t.c
        url: string;
        title: string;
        subtitle: string;
        picture: string;
        button?: {
            text?: string;
            url?: string;
            state?: string;
            stateParams?: Object;
        };
        reviews?: {
            [language: string]: LandingReview[]
        };
        blocks: LandingContentBlock[];
        externalBlocks?: {
            title?: string; // ключ перевода, можно не заполнять
            blocks: LandingContentBlock[];
        }
    }],
    features?: {
        code: string;
        url: string;
        title: string;
        subtitle: string;
        picture: string;
        button?: {
            text?: string;
            url?: string;
            state?: string;
            stateParams?: Object;
        };
        reviews?: {
            [language: string]: LandingReview[]
        };
        blocks: LandingContentBlock[];
        externalBlocks?: {
            title?: string; // ключ перевода, можно не заполнять
            blocks: LandingContentBlock[];
        }
    },
    footer: [{
        code: string;
        links: string[];
    }],
    sidenav?: LandingSidenavItem[]
}

export const landingConfig: LandingConfig = {
    reviews: {
        ru: [{
            avatar: 'https://www.trainingpeaks.com/images/testimonial-headshots/nina-arnold.jpg',
            author: 'Nina Arnold',
            about: 'Mountain biker, Marketing Manager',
            country: '',
            text: 'Staminity keeps me on-track, motivated, and ready to take on my next challenge.'
        },{
            avatar: 'https://www.trainingpeaks.com/images/testimonial-headshots/nina-arnold.jpg',
            author: 'Nina Arnold',
            about: 'Mountain biker, Marketing Manager',
            country: '',
            text: 'Staminity keeps me on-track, motivated, and ready to take on my next challenge.'
        },{
            avatar: 'https://www.trainingpeaks.com/images/testimonial-headshots/nina-arnold.jpg',
            author: 'Nina Arnold',
            about: 'Mountain biker, Marketing Manager',
            country: '',
            text: 'Staminity keeps me on-track, motivated, and ready to take on my next challenge.'
        }]
    },
    scenario: [
        {
            code: 'workWithCoach',
            url: '/cases/work-with-coach',
            title: '',
            subtitle: '',
            picture: '/assets/landing/staminity_main_coaching.png',
            button: {
                state: 'search',
                stateParams: {
                    state: 'coaches'
                }
            },
            blocks: [{
                code: 'block1',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://monday.com/img/templates/production-tracking/board.png',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://monday.com/img/templates/production-tracking/omniscience.png',
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
            reviews: {
                ru: [{
                    avatar: 'https://www.trainingpeaks.com/images/testimonial-headshots/nina-arnold.jpg',
                    author: 'Vasya Petrov',
                    about: 'Спортсмен-любитель',
                    country: '',
                    text: 'Отзыв в сценарии "Работа с тренером" №1'
                },{
                    avatar: 'https://www.trainingpeaks.com/images/testimonial-headshots/nina-arnold.jpg',
                    author: 'Миша Petrov',
                    about: 'Спортсмен-любитель',
                    country: '',
                    text: 'Отзыв в сценарии "Работа с тренером" №2'
                }]
            }

        },
        {
            code: 'trainingPlans',
            url: '/cases/training-plans',
            title: '',
            subtitle: '',
            picture: '',
            button: {
                state: 'training-plans-store',
                stateParams: {
                    state: 'store'
                }
            },
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
            url: '/cases/individual-training',
            title: '',
            subtitle: '',
            picture: '',
            button: {
                state: 'signup',
                stateParams: null
            },
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
            url: '/cases/train-athletes',
            title: '',
            subtitle: '',
            picture: '',
            button: {
                state: 'signup',
                stateParams: null
            },
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
            url: '/cases/train-groups',
            title: '',
            subtitle: '',
            picture: '',
            button: {
                state: 'signup',
                stateParams: null
            },
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
            url: '/cases/training-plan-publication',
            title: '',
            subtitle: '',
            picture: '',
            button: {
                state: 'training-plans-store',
                stateParams: {
                    state: 'store'
                }
            },
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
            url: '/cases/several-coaches',
            title: '',
            subtitle: '',
            picture: '',
            button: {
                state: 'signup',
                stateParams: null
            },
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
    ],
    footer: [
        {
            code: 'product',
            links: ['link1', 'link2', 'link3', 'link4']
        },
        {
            code: 'scenarios',
            links: ['link1', 'link2', 'link3', 'link4', 'link5', 'link6', 'link7']
        },
        {
            code: 'support',
            links: ['link1', 'link2', 'link3', 'link4']
        },
        {
            code: 'company',
            links: ['link1', 'link2', 'link3', 'link4', 'link5']
        }
    ],
    sidenav: [
        {
            type: 'state',
            icon: 'methodology',
            title: 'landing.featuresNew.shortTitle',
            state: 'featuresNew',
            stateParams: null
        },
        {
            type: 'state',
            icon: 'methodology',
            title: 'landing.tariffs.shortTitle',
            state: 'tariffs',
            stateParams: null
        },
        {
            type: 'state',
            icon: 'search',
            title: 'search.tabs.coaches',
            state: 'search',
            stateParams: null
        },
        {
            type: 'state',
            icon: 'search',
            title: 'trainingPlans.store.shortTitle',
            state: 'training-plans-store',
            stateParams: null
        },
    ],
    features: {
        code: 'featuresNew',
        url: '/features',
        title: '',
        subtitle: '',
        picture: '/assets/landing/staminity_main_coaching.png',
        button: {
            state: 'signup',
            stateParams: null
        },
        blocks: [
            {
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
        externalBlocks: {
                blocks:  [
                    {
                        code: 'externalBlock1'
                    },
                    {
                        code: 'externalBlock2'
                    },
                    {
                        code: 'externalBlock3'
                    },
                    {
                        code: 'externalBlock4'
                    },
                    {
                        code: 'externalBlock5'
                    },
                    {
                        code: 'externalBlock6'
                    },
                    {
                        code: 'externalBlock7'
                    },
                    {
                        code: 'externalBlock8'
                    },
                    {
                        code: 'externalBlock9'
                    },
                    {
                        code: 'externalBlock10'
                    },
                    {
                        code: 'externalBlock11'
                    },
                    {
                        code: 'externalBlock12'
                    }]
        }
    }
};