export interface JsonLdParams {
    lng: string;
    locale: string;
    language: string;
    availableLanguage: string;
    // page
    title: string;
    subtitle: string;
    urlLoc: string;
    urlLocRu: string;
    urlLocEn: string;
    imageUrl: string;
    breadcrumb: string;
    // global
    url: string;
    name: string;
    description: string;
    image: string;
};

export const dbSessionKey: string = 'session';
export const dbDataKey: string = 'version';
export const dbDataVersion: number = 1;

export const getMainJsonLd = (params: JsonLdParams) => ({
        "@context" : "http://schema.org",
        "@type" : "WebPage",
        "url" : `${params.url}`,
        "name" : `${params.name} | Staminity`,
        "description": `${params.description}`,
        "about": `${params.description}`,
        "image": `${params.image}`,
        "inLanguage": `${params.language}`,
        "sameAs": [
            "https://staminity.com",
            "https://www.facebook.com/staminity",
            "https://instagram.com/staminity_app",
            "https://vk.com/staminity"
        ],
        "hasPart": [
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/search?state=coaches&lang=en",
                "name": "Find a coach for running and triathlon in Staminity",
                "description": "Find a coach for running and triathlon, choose a school of running and triathlon. Professional coaches and athletes will help start running, train competently, prepare for the start, improve personal record. Online training Individual training plan, training diary, communication with the coach, analytics and reporting Professional platform for working online Service for the coach with athletes",
                "breadcrumb": "Staminity > Find coach",
                "inLanguage": "English"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/search?state=coaches&lang=ru",
                "name": "Найти тренера по бегу и триатлону в Staminity",
                "description": "Найти тренера по бегу и триатлону, выбрать школу бега и триатлона. Профессиональные тренеры и спортсмены, МСМК, МС, КМС помогут начать бегать, тренироваться грамотно, подготовиться к стартам, улучшить личный рекорд. Занятия онлайн. Индивидуальный тренировочный план, дневник тренировок, общение с тренером, аналитика и отчетность. Профессиональная платформа для работы онлайн. Сервис для работы тренера со спортсменами",
                "breadcrumb": "Staminity > Найти тренера",
                "inLanguage": "Russian"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/training-plans-store/?state=store&lang=en",
                "name": "Training plans for running, triathlon and other cyclic sports",
                "description": "Training plans store. Choose your training plan for running, triathlon and other cyclic sports from professional coaches",
                "breadcrumb": "Staminity > Training plan store",
                "inLanguage": "English"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/training-plans-store/?state=store&lang=ru",
                "name": "Тренировочные планы по бегу, триатлону и другим циклическим видам спорта",
                "description": "Магазин тренировочных планов. Выберите тренировочный план по бегу, триатлону и другим циклическим видам спорта от профессиональных тренеров",
                "breadcrumb": "Staminity > Магазин планов",
                "inLanguage": "Russian"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/tariffs?lang=en",
                "name": "Pricing | Staminity",
                "description": "Staminity pricing",
                "breadcrumb": "Staminity > Tariffs",
                "inLanguage": "English"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/tariffs?lang=ru",
                "name": "Тарифы | Staminity",
                "description": "Тарифы Staminity",
                "breadcrumb": "Staminity > Тарифы",
                "inLanguage": "Russian"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/features?lang=ru",
                "name": "Возможности | Staminity",
                "description": "Онлайн работа с тренером, тренировочные планы, дневник тренировок в циклических видах спорта",
                "breadcrumb": "Staminity > Возможности",
                "inLanguage": "Russian"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/features?lang=en",
                "name": "Features | Staminity",
                "description": "Online training with a coach, training plans and training diary in cyclic sports",
                "breadcrumb": "Staminity > Features",
                "inLanguage": "English"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/work-with-coach?lang=ru",
                "name": "Занятия с тренером онлайн | Staminity",
                "description": "Найдите тренера и занимайтесь онлайн по индивидуальному плану. Достигайте результатов без вреда для здоровья",
                "breadcrumb": "Staminity > Сценарии > Занятия с тренером",
                "inLanguage": "Russian"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/training-plans?lang=ru",
                "name": "Занятия по тренировочному плану | Staminity",
                "description": "Выберите свой тренировочный план и занимайтесь системно для подготовки к выбранной цели в спорте",
                "breadcrumb": "Staminity > Сценарии > Занятия по тренировочному плану",
                "inLanguage": "Russian"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/self-training?lang=ru",
                "name": "Самостоятельные тренировки | Staminity",
                "description": "Тренируйтесь самостоятельно, планируйте сезон и контролируйте свой прогресс в циклических видах спорта",
                "breadcrumb": "Staminity > Сценарии > Самостоятельные тренировки",
                "inLanguage": "Russian"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/train-athletes?lang=ru",
                "name": "Подготовка учеников | Staminity",
                "description": "Найдите учеников и тренируйте их онлайн: планируйте подготовку, анализируйте прогресс, общайтесь",
                "breadcrumb": "Staminity > Сценарии > Подготовка учеников",
                "inLanguage": "Russian"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/train-groups?lang=ru",
                "name": "Работа с группами спортсменов | Staminity",
                "description": "Тренируйте группы и корпоративные команды онлайн, удобно и эффективно, с помощью тренировочных планов",
                "breadcrumb": "Staminity > Сценарии > Работа с группами спортсменов",
                "inLanguage": "Russian"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/training-plan-publication?lang=ru",
                "name": "Публикация и продажа тренировочных планов | Staminity",
                "description": "Создайте и опубликуйте свой тренировочный план, привлекайте новых клиентов и зарабатывайте в Staminity",
                "breadcrumb": "Staminity > Сценарии > Публикация и продажа тренировочных планов",
                "inLanguage": "Russian"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/several-coaches?lang=ru",
                "name": "Работа нескольких тренеров | Staminity",
                "description": "Соберите команду тренеров и эффективно работайте вместе с учениками онлайн",
                "breadcrumb": "Staminity > Сценарии > Работа нескольких тренеров",
                "inLanguage": "Russian"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/work-with-coach?lang=en",
                "name": "Working with a coach | Staminity",
                "description": "Find a coach and work with him online to become a better version of yourself in cyclic sports",
                "breadcrumb": "Staminity > Use cases > Working with a coach",
                "inLanguage": "English"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/training-plans?lang=en",
                "name": "Training plans for athletes | Staminity",
                "description": "Choose your training plan and train systematically to prepare for the chosen distance and achieve your sport goal",
                "breadcrumb": "Staminity > Use cases > Training plans for athletes",
                "inLanguage": "English"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/self-training?lang=en",
                "name": "Self training | Staminity",
                "description": "Be the coach for yourself, create a plan for your season, plan your activites and control your progress in cyclic sports",
                "breadcrumb": "Staminity > Use cases > Self training",
                "inLanguage": "English"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/train-athletes?lang=en",
                "name": "Train athletes | Staminity",
                "description": "Find athletes and work together online: plan their season and activities, analyze progress, stay connected",
                "breadcrumb": "Staminity > Use cases > Train athletes",
                "inLanguage": "English"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/train-groups?lang=en",
                "name": "Train groups of athletes | Staminity",
                "description": "Train groups of athletes and corporate teams online, conveniently and effectively, with training plans",
                "breadcrumb": "Staminity > Use cases > Train groups of athletes",
                "inLanguage": "English"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/training-plan-publication?lang=en",
                "name": "Training plans publication and selling | Staminity",
                "description": "Create and publish your training plan to get new clients and earn with Staminity",
                "breadcrumb": "Staminity > Use cases > Training plans publication and selling",
                "inLanguage": "English"
            },
            {
                "@context" : "http://schema.org",
                "@type" : "WebPage",
                "url": "https://staminity.com/cases/several-coaches?lang=en",
                "name": "Several coaches joint work | Staminity",
                "description": "Gather a team of coaches and work effectively together with the athletes online",
                "breadcrumb": "Staminity > Use cases > Several coaches joint work",
                "inLanguage": "English"
            }

        ],
        "publisher": {
            "@context" : "http://schema.org",
            "@type" : "Organization",
            "url" : `${params.url}`,
            "name" : "Staminity",
            "description": `${params.description}`,
            "logo": "https://264710.selcdn.ru/assets/images/logo/staminity-logo-1024.png",
            "areaServed" : "Worldwide",
            "email" : "support@staminity.com",
            "brand" : [{
                "name" : "Staminity",
                "description": `${params.description}`
            }],
            "contactPoint" : [
                {
                    "@type" : "ContactPoint",
                    "contactType" : "Customer service",
                    "availableLanguage" : ["English","Russian"],
                    "url": "https://support.staminity.com",
                    "email": "support@staminity.com"
                },
                {
                    "@type" : "ContactPoint",
                    "contactType" : "Technical support",
                    "availableLanguage" : ["English","Russian"],
                    "url": "https://support.staminity.com",
                    "email": "support@staminity.com"
                }]
        }
});

export const getPageJsonLd = (params: JsonLdParams) => ({
    "@context" : "http://schema.org",
    "@type" : "WebPage",
    "url": `${params.urlLoc}`,
    "name": `${params.title}`,
    "description": `${params.subtitle}`,
    "breadcrumb": `${params.breadcrumb}`,
    "inLanguage": `${params.language}`,
    "image": `${params.imageUrl}`,
    "isPartOf": {
        "@context" : "http://schema.org",
        "@type" : "WebPage",
        "url" : `${params.url}`,
        "name" : `${params.name} | Staminity`,
        "description": `${params.description}`,
        "about": `${params.description}`,
        "image": `${params.image}`,
        "inLanguage": `${params.language}`
    },
    "publisher": {
        "@context" : "http://schema.org",
        "@type" : "Organization",
        "url" : `${params.url}`,
        "name" : "Staminity",
        "description": `${params.description}`,
        "logo": "https://264710.selcdn.ru/assets/images/logo/staminity-logo-1024.png",
        "areaServed" : "Worldwide",
        "email" : "support@staminity.com",
        "brand" : [{
            "name" : "Staminity",
            "description": `${params.description}`
        }],
        "contactPoint" : [
            {
                "@type" : "ContactPoint",
                "contactType" : "Customer service",
                "availableLanguage" : ["English","Russian"],
                "url": "https://support.staminity.com",
                "email": "support@staminity.com"
            },
            {
                "@type" : "ContactPoint",
                "contactType" : "Technical support",
                "availableLanguage" : ["English","Russian"],
                "url": "https://support.staminity.com",
                "email": "support@staminity.com"
            }]
    }

});