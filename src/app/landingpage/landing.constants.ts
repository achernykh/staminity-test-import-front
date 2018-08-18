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
    // продолжение к секции переводов landing.howItWorks, каждый ключ должен содеражть: title & text
    howItWorks: [{code: string; img: string;}];
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
        // если ключ не !null, то секция выводится
        // полный путь к ключу перевода текста для информации о сервисе из title, img - путь к картинке
        staminityInfo?: {title: ''; img: ''};
        // если ключ true, то секция выводится
        // его стркутура в конфиге howItWorks, заголовок секции в landing.howItWorks.title
        howItWorks?: boolean;
        blocks: LandingContentBlock[];
        externalBlocks?: {
            title?: string; // ключ перевода, можно не заполнять
            blocks: LandingContentBlock[];
        };
        // ключ перевода, если есть дополнительная секция с информацией в конце всех блоков (слайд 50)
        // в переводах путь landing.[scenario.code].externalInfo
        externalInfo?: boolean;
        moreScenario?: {
            title?: string; //  не заполняется, только для перевода landing.[scenario.code].moreScenario.title
            code: string[]; // коды сценариев для показа
        }
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
    howItWorks: [{
        code: 'goal',
        img: null
    }],
    reviews: {
        ru: [{
            avatar: 'https://264710.selcdn.ru/assets/images/website/testimonials/academy-marathon.jpg',
            author: 'Сергей Черепанов',
            about: 'Основатель «Академии марафонского бега»',
            country: '',
            text: 'Раньше мы вели план в электронных таблицах, а ученики получали задание через бота в Телеграм. За фактом приходилось переходить в другие приложения по ссылкам от спортсменов, нельзя было получить историю занятий, найти и проверить аналогичные тренировки у учеников.</br>' +
            'Мы искали приложение для оптимизации работы бегового клуба. Рассматривали зарубежный Training Peaks, а остановились в итоге на Staminity, в поддержку российского разработчика :)'
        },{
            avatar: 'https://264710.selcdn.ru/assets/images/website/testimonials/artem-kuftyrev-2.jpg',
            author: 'Артем Куфтырев',
            about: 'Основатель Школы бега InstaRun',
            country: '',
            text: 'До появления Staminity для работы с учениками мы использовали Google-таблицы, где я заполнял план, а спортсмен – факт. При такой системе сильно страдал анализ фактической работы, многие не уделяли этому достаточно внимания. </br>' +
            'Сейчас все процессы автоматизированы, ученики не тратят лишнее время, а я могу вовремя реагировать на изменения в самочувствии и фактах выполнения работы. Также очень удачны на мой взгляд графические интерпретации тренировок, это позволяет быстро оценить факт и задать необходимые вопросы, причем внутри одного приложения.'
        },{
            avatar: 'https://264710.selcdn.ru/assets/images/website/testimonials/andrey-sergeev-2.jpg',
            author: 'Андрей Сергеев',
            about: 'Тренер по бегу',
            country: '',
            text: 'Работать с учениками в Staminity удобнее, надежнее и быстрее. Всё в одном месте: план, факт, анализ тренировок, общение с учениками. План не теряется, ссылки на треки тренировок не пропадают, не нужно заходить в разные программы. Все загружается автоматически, я узнаю о выполненной тренировке и об отчете ученика сразу, на телефон приходит уведомление.<br>' +
            'Ученики всегда знают, где смотреть план, а я знаю о том, как они его выполняют.'
        }],
        en: [{
            avatar: 'https://264710.selcdn.ru/assets/images/website/testimonials/academy-marathon.jpg',
            author: 'Sergey Cherepanov',
            about: 'Founder, «Academy marathon» running club',
            country: '',
            text: 'Previously, we used google spreadsheets for planning and Telegram bots for students to get a plan. We constantly faced with the problems of monitoring and analysis of training process.<br>' +
            'We were looking for an application to optimize work for our running club. We considered several apps, in particular Training Peaks, but chose Staminity :)'
        },{
            avatar: 'https://264710.selcdn.ru/assets/images/website/testimonials/artem-kuftyrev-2.jpg',
            author: 'Artem Kuftyrev',
            about: 'Founder, InstaRUN running club',
            country: '',
            text: 'Prior to Staminity for working with students, we used Google sheets, where I filled out the plan, and the athlete - a fact. With such a system, the analysis of actual work suffered greatly, many did not pay enough attention to it, which slowed down the further planning. </br>' +
            'Now all these processes are automated, the students do not spend unnecessary time, and I can respond in time to changes in the state of health and the facts of the work. In my opinion, graphical interpretations of workouts are also very successful, it allows you to quickly assess the fact of accomplishing tasks and quickly ask the necessary questions, all within the same application'
        },{
            avatar: 'https://264710.selcdn.ru/assets/images/website/testimonials/andrey-sergeev-2.jpg',
            author: 'Andrey Sergeev',
            about: 'Running coach',
            country: '',
            text: "Working with students in Staminity is more convenient, reliable and faster. All in one place: plan, fact, analysis of training, communication with athletes. The plan is not lost, links to training tracks do not disappear, you do not need to go into different programs. Everything is loaded automatically, I find out about the training done and about the student's report right away, the phone receives a notification. <br> "+
            "Students always know where to look at the plan, and I know how they do it."
        }

        ]
    },
    scenario: [
        {
            code: 'workWithCoach',
            url: '/cases/work-with-coach',
            title: '',
            subtitle: '',
            picture: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-01.png',
            thumb: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-01-thumb.png',
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
                    avatar: 'https://264710.selcdn.ru/assets/images/website/testimonials/oleg-lenkov.jpg',
                    author: 'Олег Ленков',
                    about: 'Триатлет, клуб JustTri',
                    country: '',
                    text: '#Staminity – именно в этом приложении я теперь работаю. Спасибо #justtri. Убеждён, что это самое современное, крутое и удобное приложение, среди аналогов. Нравится все, начиная от функционала, и заканчивая дизайном. Особая гордость - то, что это 🇷🇺 наша разработка.'
                },{
                    avatar: 'https://264710.selcdn.ru/assets/images/website/testimonials/alexei-lukashin.jpg',
                    author: 'Алексей Лукашин',
                    about: 'Спортсмен, клуб InstaRUN',
                    country: '',
                    text: 'Классная программа! Пользуюсь приложением на айфоне. У меня часы suunto, тренировки приходится выгружать через Strava, один раз настроил и все, неудобств не доставляет.'
                }]
            },
            externalInfo: true,
            moreScenario: {
                code: ["trainingPlans","selfTraining","trainAthletes"]
            }

        },
        {
            code: 'trainingPlans',
            url: '/cases/training-plans',
            title: '',
            subtitle: '',
            picture: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-02.png',
            thumb: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-02-thumb.png',
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
            externalInfo: true,
            moreScenario: {
                code: ["workWithCoach","selfTraining","trainAthletes"]
            }

        },
        {
            code: 'selfTraining',
            url: '/cases/self-training',
            title: '',
            subtitle: '',
            picture: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-03.png',
            thumb: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-03-thumb.png',
            button: {
                state: 'signup',
                stateParams: {
                    activatePremiumTrial: true,
                    activateCoachTrial: false,
                    activateClubTrial: false,
                }            },
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
            externalInfo: true,
            moreScenario: {
                code: ["workWithCoach","trainingPlans","trainAthletes"]
            }

        },
        {
            code: 'trainAthletes',
            url: '/cases/train-athletes',
            title: '',
            subtitle: '',
            picture: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-04.png',
            thumb: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-04-thumb.png',
            button: {
                state: 'signup',
                stateParams: {
                    activatePremiumTrial: false,
                    activateCoachTrial: true,
                    activateClubTrial: false,
                }
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
            externalInfo: true,
            moreScenario: {
                code: ["trainGroups","trainingPlanPublication","severalCoaches"]
            }

        },
        {
            code: 'trainGroups',
            url: '/cases/train-groups',
            title: '',
            subtitle: '',
            picture: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-05.png',
            thumb: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-05-thumb.png',
            button: {
                state: 'signup',
                stateParams: {
                    activatePremiumTrial: false,
                    activateCoachTrial: true,
                    activateClubTrial: false,
                }            },
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
                        code: 'externalBlock1',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/plan-universal.svg',
                    },
                    {
                        code: 'externalBlock2',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/plan-fixed.svg',
                    },
                    {
                        code: 'externalBlock3',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/plan-sync.svg',
                    }]
            },
            externalInfo: true,
            moreScenario: {
                code: ["trainAthletes","trainingPlanPublication","severalCoaches"]
            }

        },
        {
            code: 'trainingPlanPublication',
            url: '/cases/training-plan-publication',
            title: '',
            subtitle: '',
            picture: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-06.png',
            thumb: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-06-thumb.png',
            button: {
                state: 'signup',
                stateParams: {
                    activatePremiumTrial: false,
                    activateCoachTrial: true,
                    activateClubTrial: false,
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
                        code: 'externalBlock1',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/plan-store-mobile.svg',
                    },
                    {
                        code: 'externalBlock2',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/plan-store-wallet.svg',
                    },
                    {
                        code: 'externalBlock3',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/plan-store-shop.svg',
                    }]
            },
            externalInfo: true,
            moreScenario: {
                code: ["trainAthletes","trainGroups","severalCoaches"]
            }

        },
        {
            code: 'severalCoaches',
            url: '/cases/several-coaches',
            title: '',
            subtitle: '',
            picture: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-07.png',
            thumb: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-07-thumb.png',
            button: {
                state: 'signup',
                stateParams: {
                    activatePremiumTrial: false,
                    activateCoachTrial: false,
                    activateClubTrial: true,
                }            },
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
            externalInfo: true,
            reviews: {
                ru: [{
                    avatar: 'https://264710.selcdn.ru/assets/images/website/testimonials/academy-marathon.jpg',
                    author: 'Сергей Черепанов',
                    about: 'Основатель «Академии марафонского бега»',
                    country: '',
                    text: 'Раньше мы вели план в электронных таблицах, а ученики получали задание через бота в Телеграм. За фактом приходилось переходить в другие приложения по ссылкам от спортсменов, нельзя было получить историю занятий, найти и проверить аналогичные тренировки у учеников.</br>' +
                    'Мы искали приложение для оптимизации работы бегового клуба. Рассматривали зарубежный Training Peaks, а остановились в итоге на Staminity, в поддержку российского разработчика :)'
                },{
                    avatar: 'https://264710.selcdn.ru/assets/images/website/testimonials/artem-kuftyrev-2.jpg',
                    author: 'Артем Куфтырев',
                    about: 'Основатель Школы бега InstaRun',
                    country: '',
                    text: 'До появления Staminity для работы с учениками мы использовали Google-таблицы, где я заполнял план, а спортсмен – факт. При такой системе сильно страдал анализ фактической работы, многие не уделяли этому достаточно внимания. </br>' +
                    'Сейчас все процессы автоматизированы, ученики не тратят лишнее время, а я могу вовремя реагировать на изменения в самочувствии и фактах выполнения работы. Также очень удачны на мой взгляд графические интерпретации тренировок, это позволяет быстро оценить факт и задать необходимые вопросы, причем внутри одного приложения.'
                }],
                en: [{
                    avatar: 'https://264710.selcdn.ru/assets/images/website/testimonials/academy-marathon.jpg',
                    author: 'Sergey Cherepanov',
                    about: 'Founder, «Academy marathon» running club',
                    country: '',
                    text: 'Previously, we used google spreadsheets for planning and Telegram bots for students to get a plan. We constantly faced with the problems of monitoring and analysis of training process.<br>' +
                    'We were looking for an application to optimize work for our running club. We considered several apps, in particular Training Peaks, but chose Staminity :)'
                },{
                    avatar: 'https://264710.selcdn.ru/assets/images/website/testimonials/artem-kuftyrev-2.jpg',
                    author: 'Artem Kuftyrev',
                    about: 'Founder, InstaRUN running club',
                    country: '',
                    text: 'Prior to Staminity for working with students, we used Google sheets, where I filled out the plan, and the athlete - a fact. With such a system, the analysis of actual work suffered greatly, many did not pay enough attention to it, which slowed down the further planning. </br>' +
                    'Now all these processes are automated, the students do not spend unnecessary time, and I can respond in time to changes in the state of health and the facts of the work. In my opinion, graphical interpretations of workouts are also very successful, it allows you to quickly assess the fact of accomplishing tasks and quickly ask the necessary questions, all within the same application'
                }]
            },
            moreScenario: {
                code: ["trainAthletes","trainGroups","trainingPlanPublication"]
            }

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
        picture: 'https://264710.selcdn.ru/assets/images/website/screens/features-main.png',
        button: {
            state: 'signup',
            stateParams: {
                activatePremiumTrial: true,
                activateCoachTrial: false,
                activateClubTrial: false,
            }
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
                        code: 'externalBlock1',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/sync.svg'
                    },
                    {
                        code: 'externalBlock2',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/mobile.svg'
                    },
                    {
                        code: 'externalBlock3',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/strcutured.svg'
                    },
                    {
                        code: 'externalBlock4',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/season-plan.svg'
                    },
                    {
                        code: 'externalBlock5',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/analytics.svg'
                    },
                    {
                        code: 'externalBlock6',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/dashboard.svg'
                    },
                    {
                        code: 'externalBlock7',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/templates.svg'
                    },
                    {
                        code: 'externalBlock8',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/categories.svg'
                    },
                    {
                        code: 'externalBlock9',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/training-zones.svg'
                    },
                    {
                        code: 'externalBlock10',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/operations.svg'
                    },
                    {
                        code: 'externalBlock11',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/media.svg'
                    },
                    {
                        code: 'externalBlock12',
                        picture: 'https://264710.selcdn.ru/assets/images/website/icons/chat.svg'
                    }]
        }
    }
};