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
        thumb: string;
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
        };
        // ключ перевода, если есть дополнительная секция с информацией в конце всех блоков (слайд 50)
        // в переводах путь landing.[scenario.code].externalInfo
        externalInfo?: string;
    }];
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
    };
    footer: [{
        code: string;
        links: string[];
    }];
    sidenav?: LandingSidenavItem[];
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
            picture: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-01.png',
            thumb: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-01-thumb.png',
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
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/search-01.png',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/planned-activity.png',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/calendar-fact.png',
            },{
                code: 'block4',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/activity-analysis-03.png',
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
            picture: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-02.png',
            thumb: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-02-thumb.png',
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
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/training-plan-store.png',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/plan-assignment-athlete.png',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/calendar-01.png',
            },{
                code: 'block4',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/activity-analysis-01.png',
            }
            ],
        },
        {
            code: 'selfTraining',
            url: '/cases/self-training',
            title: '',
            subtitle: '',
            picture: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-03.png',
            thumb: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-03-thumb.png',
            button: {
                state: 'signup',
                stateParams: null
            },
            blocks: [{
                code: 'block1',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/season-plan.png',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/calendar-plan.png',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/calendar-02.png',
            },{
                code: 'block4',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/activity-analysis-02.png',
            },{
                code: 'block5',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/analytics.png',
            }],
        },
        {
            code: 'trainAthletes',
            url: '/cases/train-athletes',
            title: '',
            subtitle: '',
            picture: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-04.png',
            thumb: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-04-thumb.png',
            button: {
                state: 'signup',
                stateParams: null
            },
            blocks: [{
                code: 'block1',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/calendar-plan.png',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/dashboard.png',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/activity-analysis-02.png',
            },{
                code: 'block4',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/activity-chat-completed.png',
            },{
                code: 'block5',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/search-02.png',
            }],
        },
        {
            code: 'trainGroups',
            url: '/cases/train-groups',
            title: '',
            subtitle: '',
            picture: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-05.png',
            thumb: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-05-thumb.png',
            button: {
                state: 'signup',
                stateParams: null
            },
            blocks: [{
                code: 'block1',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/training-plan-builder.png',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/plan-assignment.png',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/several-plans.png',
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
                    }]
            }
        },
        {
            code: 'trainingPlanPublication',
            url: '/cases/training-plan-publication',
            title: '',
            subtitle: '',
            picture: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-06.png',
            thumb: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-06-thumb.png',
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
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/training-plan-card.png',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/training-plan-page.png',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/training-plan-store.png',
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
                    }]
            }
        },
        {
            code: 'severalCoaches',
            url: '/cases/several-coaches',
            title: '',
            subtitle: '',
            picture: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-07.png',
            thumb: 'http://264710.selcdn.ru/assets/images/website/screens/scenario-07-thumb.png',
            button: {
                state: 'signup',
                stateParams: null
            },
            blocks: [{
                code: 'block1',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/club-profile-01.png',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/club-management.png',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/club-dashboard.png',
            },{
                code: 'block4',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/templates.png',
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
        picture: 'http://264710.selcdn.ru/assets/images/website/screens/features-main.png',
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
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/calendar-fact.png',
            },{
                code: 'block2',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/activity-analysis-03.png',
            },{
                code: 'block3',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/search-01.png',
            },{
                code: 'block4',
                title: '',
                subtitle: '',
                text: '',
                picture: 'https://264710.selcdn.ru/assets/images/website/screens/training-plan-store.png',
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