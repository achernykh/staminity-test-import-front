export const _translateTrainingPlans = {
    ru: {
        builder: {
            fullTitle: 'Тренировочный план',
            shortTitle: 'План',
        },
        filter: 'Фильтр',
        filterResult: 'Найдено планов {{total}}',

        // табс
        tabs: {
            general: 'Основные параметры',
            description: 'Описание',
            commerce: 'Магазин',
            samples: 'Примеры'
        },
        loading: "Загрузка",
        form: {
            title: 'Тренировочный план'
        },

        // действия
        actions: {
            list: 'Перейти в список планов',
            delete: 'Удалить',
            create: 'Создать',
            edit: 'Изменить',
            save: 'Сохранить',
            view: 'Открыть',
            appoint: 'Присвоить...',
            calendar: 'Запланировать тренировки',
            assignment: 'Присвоения',
            publish: 'Публикация',
            unpublish: 'Снять с публикации',
            setIcon: 'Изменить',
            setBackground: 'Изменить фон',
            cardView: 'Вид карточки',
            listView: 'Вид таблица',
            hidePanel: 'Показать панель',
            showPanel: 'Скрыть панель',
            search: 'Поиск',
            myPlans: 'Мои планы',
            go: 'Перейти в Покупки',
            pay: 'Купить',
            addFree: 'Добавить бесплатно',
            signupAndPay: "Зарегистрироваться и купить",
            signupAndAddFree: "Зарегистрироваться и добавить бесплатно",
            signinAndPay: "Войти и купить",
            signinAndAddFree: "Войти и добавить бесплатно",
            viewStore: "Предпросмотр (версия из Магазина)",
            viewHistory: "Предпросмотр (текущая версия)",

        },
        plan: 'Тренировочный план',
        // поля плана
        isPublic: {
            label: 'Для публикации в магазине'
        },
        name: {
            label: 'Название',
            placeholder: 'Укажите название плана'
        },
        type: {
            label: 'Вид спорта',
            placeholder: 'Выберите вид спорта'
        },
        distanceType: {
            label: 'Тип соревнований',
            placeholder: 'Выберите тип соревнования'
        },
        isFixedCalendarDates: {
            label: 'Фиксированные даты',
            hint: 'Включите, чтобы при планировании использовать конкретные календарные даты'
        },
        propagateMods: {
            label: 'Обновляемый план',
            hint: 'В обновляемом плане все изменения плана могут быть переданы спортсменам даже после присвоения'
        },
        startDate: {
            label: 'Начальная дата плана'
        },
        endDate: {
            label: 'Конечная дата плана'
        },
        level: 'Уровень',
        tags: {
            label: 'Характеристики плана',
            beginner: 'Новичок',
            advanced: 'Продвинутый',
            pro: 'Профессионал',
            powerMeter: 'Интенсивность по мощности',
            hrBelt: 'Интенсивность по пульсу',
            weightLoss: 'Потеря веса',
            fitness: 'Привести в форму',
            health: 'Здоровье',
        },
        description: {
            label: 'Описание'
        },
        keywords: {
            label: 'Ключевые слова',
            placeholder: 'Ключевые слова',
            secondaryPlaceholder: 'ещё...'
        },
        isStructured: {
            label: 'Структурированные тренировки'
        },
        hasConsultations: {
            label: 'Включены консультации'
        },
        hasOfflineTraining: {
            label: 'Включены очные занятия с тренером'
        },
        state: {
            active: 'Приобретен',
            pending: 'Заказан'
        },
        weekCount: {
            label: 'Количество недель',
            all: 'Все'
        },
        options: {
            label: 'Опции',
            isStructured: 'Структурированные тренировки',
            hasConsultations: 'Консультации с автором',
            hasOfflineTraining: 'Очные занятия с тренером'

        },
        assignment: {
            info: "Дата начала плана: {{firstPlanDate | date:'longDate'}}, дата первой записи: {{firstItemDate | date:'longDate'}} </br>" +
            "Дата окончания плана:  {{lastPlanDate | date:'longDate'}}, дата последней записи: {{lastItemDate | date:'longDate'}}",
            action: {
                delete: 'Удалить присвоение',
                post: 'Новое присвоение',
                edit: 'Изменить',
                apply: 'Применить план',
                close: 'Закрыть',
                calendar: 'Открыть календарь'
            },
            form: {
                title: 'Присвоение плана',
                applyMode: {
                    label: 'Режим присвоения',
                    P: 'Даты начала/окончания плана',
                    I: 'Даты первой/последней записи',
                    hint: 'Присвоить в даты плана или в даты записей плана'
                },
                applyDateMode: {
                    label: 'Тип даты',
                    F: 'Дата начала',
                    T: 'Дата окончания',
                    hint: 'Присвоить с Даты начала или к Дате окончания'
                },
                applyFromDate: {
                    label: 'Дата начала',
                    placeholder: 'Укажите дату начала'
                },
                applyToDate: {
                    label: 'Дата окончания',
                    placeholder: 'Укажите дату окончания'
                },
                firstItemDate: {
                    label: '',
                    placeholder: ''
                },
                save: "Присвоить",
                new: "Добавить присвоение",
                athlete: {
                    label: "Спортсмен",
                    hint: ""
                }
            },
            list: {
                title: 'Список присвоений плана',
                empty: 'У плана нет присвоений',
                info: "<span>Дата подключения {{createdDate | date:'shortDate'}}, версия плана {{version}}</span><br><span>{{applyMode | translate}}, {{applyDateMode | translate}} {{applyDate}}</span>",
                applyMode: {
                    P: 'В даты плана',
                    I: 'В даты записей',
                },
                applyDateMode: {
                    F: 'с',
                    T: 'до',
                },
            },
            enabledSync: "Транслировать изменения плана",
            enabledSyncDisabled: "Трансляция изменений плана невозможна",
            fixedPlanInOtherDays: "Даты присвоения отличаются от дат плана",
            assignDatesBeforeToday: "В плане есть тренировки в прошлом. При присвоении они не будут созданы в календаре спортсмена"
        },
        store: {
            fullTitle: 'Магазин тренировочных планов',
            shortTitle: 'Магазин планов',
            tabs: {
                store: 'Все планы',
                purchases: 'Покупки'
            },
            free: 'Добавить бесплатно',
            price: 'Купить {{price}} {{currency}}',
            name: 'Название',
            author: 'Автор',
            title: 'Приобрести тренировочный план',
            info: 'Название',
            rate: 'Рейтинг',
            weeks: 'Недель',
            hours: 'Часов',
        },
        landing: {
            weekCount: 'Недель подготовки {{count}}',
            description: 'Описание плана',
            targetAudience: 'Целевая аудитория',
            calendarDates: 'Даты плана',
            flexCalendarDates: 'План рассчитан на {{weekCount}} недель и не привязан к конкретным датам. ',
            fixCalendarDates: "План рассчитан на {{weekCount}} недель, с {{start | date:'shortDate'}} по {{finish | date:'shortDate'}}. ",
            propagateMods: 'План обновляемый. Тренер может внести изменения в план и все изменения будут отражены в вашем календаре. ',
            assignOpportunities: 'Вы сможете присвоить план в нужные даты для подготовки к выбранному старту',
            regularWeek: 'Типовая неделя',
            weekActivities: 'В неделю в среднем {{avg | stNumberCeil}} тренировок, от {{min | stNumberCeil}} до {{max | stNumberCeil}}',
            weekDuration: "Тренировочных объем в неделю (часов): в среднем - {{avg / 60 / 60 | number:1}}, от {{min / 60 / 60 | number:1}} до {{max / 60 /60 | number:1}}",
            weekDistance: "Тренировочный объем в неделю (км): в среднем {{avg | measureCalc:'default':'distance' | number:0}}, от {{min | measureCalc:'default':'distance' | number:0}} до {{max | measureCalc:'default':'distance' | number:0}}",
            offlineTraining: 'Очные занятия с тренером',
            consultations: 'Консультации с автором',
            structuredActivity: 'Структурированные тренировки',
            structuredActivityOpportunities: 'Структурированные тренировки позволяют разбить план на несколько тренировочных сегментов. Каждый сегмент тренировки содержит план по длительности и интенсивности',
            devices: 'Необходимые устройства',
            needHeartRateBelt: 'Датчик пульса',
            needPowermeter: 'Датчик мощности',
            syncDescription: 'Подробнее о загрузке факта выполнения тренировок в Staminity см. в справке: <a href="https://help.staminity.com/ru/questions/activity-auto-sync.html">"Как загружать выполненные тренировки"</a>',
            chart: 'График нагрузки',
            effortStat: {
                metricsByDuration: 'Тренировочный объем по неделям (часы)',
                metricsByDistance: 'Тренировочный объем по неделям (км)'
            },
            howItWorks: 'Как работать с планом',
            howItWorksDescription: '<ol type="1"><li>Вы выбираете план и присваиваете его в нужные даты</li><li>Подключаете автоматическую загрузку тренировок из Garmin или Strava</li><li>Выполняете тренировки и отслеживаете прогресс. Ваш план всегда под рукой, с компьютера или смартфона</li><li>Приобретенный план остается у вас и его всегда можно применить в другие даты</li></ol>',
            samples: 'Примеры записей плана',
            samplesDescription: '',
            extDescription: 'Дополнительная информация',
            authorPlaceholder: 'Автор плана',
            authorPlans: 'Еще планы автора',
            similarPlans: 'Похожие планы',
            more: 'Показать еще'
        },
        planDontHaveItemsForAssignment: "В плане нет тренировок для присвоения",
        info: {
            disableEditAssignPlan: ""
        },
        order: {
            needAccount: 'Для покупки плана необходимо войти в систему',
            tabs: {
                signin: 'У меня уже есть аккаунт',
                signup: 'Создать аккаунт'
            },
            confirmation: 'Я прочитал и принимаю условия <a href="https://legal.staminity.com/ru/offer-plan-buyer.html">Соглашения с Покупателями тренировочных планов</a> и <a href="https://legal.staminity.com/ru/offer-author-buyer.html">Договора между Автором и Покупателем тренировочного плана</a>',
            confirmationSignup: 'Регистрируясь, я принимаю <a href="https://legal.staminity.com/ru/license.html">Публичную оферту</a> и соглашаюсь с <a href="https://legal.staminity.com/ru/terms.html">Условиями использования</a> сайта',
            priceLabel: "Цена",
            free: "Бесплатно",
            price: "{{price}} {{currency}}"
        },
        publish: {
            check: {
                title: 'Чек-лист публикации тренировочного плана',
                versionSuccess: 'Изменения для публикации: ДА. Текущая версия {{histVersion}}#{{revision}}, версия в магазине {{storeVersion}}#{{storeRevision}}',
                versionFail: 'Изменения для публикации: НЕТ. Текущая версия {{histVersion}}#{{revision}} совпадает с версией в магазине: {{storeVersion}}#{{storeRevision}}',
                profileSuccess: 'Заполнен профиль автора планов: ДА',
                profileFail: 'Заполнен профиль автора планов: НЕТ. Проверьте соответствующий раздел в Настройках',
                iconSuccess: "Изображение плана установлено: ДА",
                iconFail: "Изображение плана установлено: НЕТ. Загрузите его на вкладке 'Магазин' в карточке плана",
                backgroundSuccess: "Основное изображение плана загружено: ДА",
                backgroundFail: "Основное изображение установлено: НЕТ. Загрузите его на вкладке 'Магазин' в карточке плана",
                itemsSuccess: 'Достаточно тренировок для публикации: ДА',
                itemsFail: 'Достаточно тренировок для публикации: НЕТ. Добавьте не менее 10 тренировок',
                isNotDynamicSuccess: 'План не обновляемый: ДА',
                isNotDynamicFail: 'План не обновляемый: НЕТ. Публикация обновляемых планов невозможна'

            },
            title: "Публикация плана",
            commit: 'Опубликовать',
            cancel: 'Снять с публикации'
        },
        monetization: {
            label: 'Платный план'
        },
        commerceConditions: 'Комиссия Staminity - 30% от цены плана. На вашем балансе будет отражена сумма <strong>{{(value * 0.7) | number:0}} {{currency}}</strong> с каждой покупки',
        currency: {
            label: 'Валюта',
            placeholder: 'Выберите валюту'
        },
        price: {
            label: 'Цена',
            placeholder: 'Укажите цену плана'
        },
        planDescriptionInfo: 'Характеристики плана в магазине',
        targetAudience: {
            label: "Целевая аудитория",
            placeholder: 'Опишите, для кого предназначен ваш план'
        },
        regularWeek: {
            label: "Типовая неделя",
            placeholder: 'Укажите характеристики типовой недели занятий в плане'
        },
        statisticData: {
            label: 'График тренировочных объемов в плане',
            hint: 'На странице плана график тренировочных объемов может быть выведен по времени или по расстоянию. Выберите нужный'
        },
        effortStat: {
            metricsByDuration: "По времени (часы)",
            metricsByDistance: 'По расстоянию (км)'
        },
        consultationsDescription: {
            label: 'Описание консультаций',
            placeholder: 'Как часто и каким способом вы консультируете покупателей плана'
        },
        offlineTrainingDescription: {
            label: 'Описание очных занятий',
            placeholder: 'Как часто и где проводятся очные занятия, включенные в стоимость плана'
        },
        hasStructuredActivity: {
            label: 'Тренировочные задания разбиты по сегментам'
        },
        structuredActivityDescription: {
            label: 'Опишите структурированные тренировки',
            placeholder: 'План по каким тренировкам создан с разбивкой по сегментам'
        },
        forUploadNeedSave: 'Для загрузки изображения сохраните план',
        success: {
            title: 'Приобретение успешно',
            authText: 'Поздравляем, вы успешно приобрели тренировочный план! Чтобы применить его, перейдите в раздел "Покупки"',
            guestText: 'Поздравляем, вы успешно приобрели тренировочный план! Дальнейшие шаги: <ol type="1"><li>Войдите в Staminity</li><li>Перейдите в раздел "Тренировочные планы" - "Покупки"</li><li>Примените план в нужные даты</li><li>Тренировки из плана появятся в вашем календаре</li></ol>'

        },
        samplesHowTo: 'Примеры тренировок помогут покупателям оценить Ваш подход. Отметьте нужные тренировки и события как примеры',
        hasUpdateForStore: "Есть неопубликованные изменения",
        pay: {
            title: 'Оплатить'
        },
        published: 'Опубликованы в магазине',
        unpublished: 'Не опубликованы в магазине',
        owner: {
            label: 'Автор'
        },
        notPublished: 'Не опубликованы в магазине',
        lang: {
            label: 'Язык'
        }
    },
    en: {
        builder: {
            fullTitle: 'Training plan',
            shortTitle: 'Plan',
        },
        filter: 'Filter',
        filterResult: 'Found {{total}} plan(s)',

        // табс
        tabs: {
            general: 'General',
            description: 'Description',
            commerce: 'Store info',
            samples: 'Samples'
        },
        loading: "Loading",
        form: {
            title: 'Training plan'
        },

        // действия
        actions: {
            list: 'Training plan list',
            delete: 'Delete',
            create: 'Create',
            edit: 'Edit',
            save: 'Save',
            view: 'View',
            appoint: 'Assignments',
            calendar: 'Create plan items',
            assignment: 'Assignments',
            publish: 'Publication',
            unpublish: 'Unpublish',
            setIcon: 'Edit',
            setBackground: 'Edit background',
            cardView: 'Card view',
            listView: 'List view',
            hidePanel: 'Show panel',
            showPanel: 'Hide panel',
            search: 'Search',
            myPlans: 'My plans',
            go: 'Go to Purchased plans',
            pay: 'Purchase',
            addFree: 'Take for free',
            signupAndPay: "Signup and purchase",
            signupAndAddFree: "Signup and take for free",
            signinAndPay: "Signin and purchase",
            signinAndAddFree: "Signin and take for free",
            viewStore: "Store preview (published version)",
            viewHistory: "Store preview (current version)",
        },

        plan: 'Training plan',
        // поля плана
        isPublic: {
            label: 'Available for publication in Store'
        },
        name: {
            label: 'Name',
            placeholder: 'Set training plan name'
        },
        type: {
            label: 'Sport',
            placeholder: 'Select sport'
        },
        distanceType: {
            label: 'Distance type',
            placeholder: 'Select distance type'
        },
        isFixedCalendarDates: {
            label: 'Fixed dates',
            hint: 'If enabled, you will plan on particular calendar dates. If disabled, you will plan on relative dates'
        },
        propagateMods: {
            label: 'Dynamic plan',
            hint: 'If enabled, all plan changes could be transferred to all assigned athletes'
        },
        startDate: {
            label: 'Start date'
        },
        endDate: {
            label: 'End date'
        },
        level: 'Level',
        tags: {
            label: 'Tags',
            beginner: 'Beginner',
            advanced: 'Advanced',
            pro: 'Pro',
            powerMeter: 'Power meter',
            hrBelt: 'HR belt',
            weightLoss: 'Weight loss',
            fitness: 'Fitness',
            health: 'Health',
        },
        description: {
            label: 'Description'
        },
        keywords: {
            label: 'Keywords',
            placeholder: 'Keywords',
            secondaryPlaceholder: 'more...'
        },
        isStructured: {
            label: 'Structured activities'
        },
        hasConsultations: {
            label: 'Consultations included'
        },
        hasOfflineTraining: {
            label: "Offline activities included"
        },
        state: {
            active: 'Purchased',
            pending: 'Ordered'
        },
        weekCount: {
            label: 'Week count',
            all: 'All'
        },
        options: {
            label: 'Options',
            isStructured: 'Structured activities',
            hasConsultations: 'Consultations with Author',
            hasOfflineTraining: "Offline activities"
        },
        assignment: {
            info: "Plan start date: {{firstPlanDate | date:'longDate'}}, first item date: {{firstItemDate | date:'longDate'}}. </br>Plan end date:  {{lastPlanDate | date:'longDate'}}, last item date: {{lastItemDate | date:'longDate'}}",
            action: {
                delete: 'Remove assignment',
                post: 'New assignment',
                edit: 'Edit',
                apply: 'Assign',
                close: 'Close',
                calendar: 'Open calendar'
            },
            form: {
                title: 'Assignment',
                applyMode: {
                    label: 'Assignment mode',
                    P: 'Plan start / end dates',
                    I: 'First item / last item dates',
                    hint: 'Assignment dates could be calculated from plan dates or from item dates'
                },
                applyDateMode: {
                    label: 'Date',
                    F: 'Start date',
                    T: 'End date',
                    hint: 'Assign from Start date or to End date'
                },
                applyFromDate: {
                    label: 'Start date',
                    placeholder: 'Set a start date of assignment'
                },
                applyToDate: {
                    label: 'End date',
                    placeholder: 'Set an end date of assignment'
                },
                firstItemDate: {
                    label: '',
                    placeholder: ''
                },
                save: "Assign",
                new: "New assignment",
                athlete: {
                    label: "Athlete",
                    hint: ""
                }
            },
            list: {
                title: 'Assignments list',
                empty: 'Training plan has no assignments',
                info: "Assignment created {{createdDate | date:'shortDate'}}, plan version: {{version}}",
                applyMode: {
                    P: 'Plan dates',
                    I: 'Items dates',
                },
                applyDateMode: {
                    F: 'from',
                    T: 'to',
                },
            },
            enabledSync: "Transfer plan changes",
            enabledSyncDisabled: "Plan changes cannot be transferred to athletes",
            fixedPlanInOtherDays: "Attention! Assignment dates differ from plan dates",
            assignDatesBeforeToday: "Plan has several items in the past. They will not be created in athlete's calendar"
        },
        store: {
            fullTitle: 'Training plans store',
            shortTitle: 'Plans store',
            tabs: {
                store: 'All plans',
                purchases: 'Purchases'
            },
            free: 'Take for free',
            price: 'Buy {{price}} {{currency}}',
            name: 'Name',
            author: 'Author',
            title: 'Purchase training plan',
            info: 'Name',
            rate: 'Rating',
            weeks: 'Weeks',
            hours: 'Hours',
        },
        landing: {
            weekCount: 'Week count {{count}}',
            description: 'Overview',
            targetAudience: 'Target audience',
            calendarDates: 'Calendar dates',
            flexCalendarDates: 'The plan is designed for {{weekCount}} weeks of training and could be assigned from/to any necessary date.',
            fixCalendarDates: "The plan is designed for {{weekCount}} weeks of training, from {{start | date:'shortDate'}} to {{finish | date:'shortDate'}}. ",
            propagateMods: 'This plan is dynamic. The Author could change this plan and these changes will be transferred to your calendar. ',
            assignOpportunities: 'You also could assign this plan from/to any other date you need.  ',
            regularWeek: 'Regular week',
            weekActivities: 'There are {{avg | stNumberCeil}} activities in training week on average, min - {{min | stNumberCeil}}, max - {{max | stNumberCeil}}',
            weekDuration: "Duration of activities per week (hours): average - {{avg / 60 / 60 | number:1}}, min - {{min / 60 / 60 | number:1}}, max - {{max / 60 /60 | number:1}}",
            weekDistance: "Distance of activities per week (km): average -  {{avg | measureCalc:'default':'distance' | number:0}}, min - {{min | measureCalc:'default':'distance' | number:0}}, max - {{max | measureCalc:'default':'distance' | number:0}}",
            offlineTraining: "Offline activities with the coach",
            consultations: 'Consultations with author',
            structuredActivity: 'Structured activities',
            structuredActivityOpportunities: 'Structured activities allow to divide activity plan for several segments. Every segment contains planned values for distance/duration and intensity level',
            devices: 'Required devices',
            needHeartRateBelt: 'Heart rate monitor',
            needPowermeter: 'Power meter',
            syncDescription: 'See details about completed activities upload to Staminity in <a href="https://help.staminity.com/en/questions/activity-auto-sync.html">"Staminity Help Center"</a>',
            chart: 'Fitness summary',
            effortStat: {
                metricsByDuration: 'Planned duration (hours) of activities',
                metricsByDistance: 'Planned distance (km) of activities'
            },
            howItWorks: 'How it works',
            howItWorksDescription: '<ol type="1"><li>Choose the training plan and decide when you want to start training</li><li>Set up activity auto upload to Staminity from Garmin or Strava</li><li>Follow the instructions from training plan, complete activities and analyse progress in Staminity. Your plan will be always with you, from desktop or smartphone. </li><li> You could use one plan several times, if necessary</li></ol>',
            samples: 'Samples of activities and events',
            samplesDescription: '',
            extDescription: 'Additional information',
            authorPlaceholder: 'Training plan Author',
            authorPlans: 'More from the Author',
            similarPlans: 'Similar plans',
            more: 'Show more'
        },
        planDontHaveItemsForAssignment: "Plan has no items to assign",
        info: {
            disableEditAssignPlan: ""
        },
        order: {
            needAccount: 'You have to be signed in to purchase the plan',
            tabs: {
                signin: 'I already have an account',
                signup: 'Create new account'
            },
            confirmation: 'I agree with <a href="https://legal.staminity.com/en/offer-plan-buyer.html">Training plans purchase policy (for acquirers) </a> and accept the <a href="https://legal.staminity.com/en/offer-author-buyer.html">Agreement between the training plan Author and the plan Acquirer</a>',
            confirmationSignup: 'By signing up i accept <a href="https://legal.staminity.com/en/license.html">The licence agreement (public offer) </a> and agree with <a href="https://legal.staminity.com/en/terms.html">the Website use policy</a>',
            priceLabel: "Price",
            free: "Free",
            price: "{{price}} {{currency}}"
        },
        publish: {
            check: {
                title: 'Check-list for training plan publication',
                versionSuccess: 'The plan has changes for publication: SUCCESS. Current version: {{histVersion}}#{{revision}}, Store version: {{storeVersion}}#{{storeRevision}}',
                versionFail: 'The plan has changes for publication: FAIL. Current version: {{histVersion}}#{{revision}}, Store version: {{storeVersion}}#{{storeRevision}}',
                profileSuccess: 'Plan Author profile is completed: SUCCESS',
                profileFail: 'Plan Author profile is completed: FAIL. Please check the Training plan Author profile in Settings',
                iconSuccess: "Training plan has an image: SUCCESS",
                iconFail: "Training plan has an image: FAIL. Please check the Store tab of the Plan.",
                backgroundSuccess: "Training plan has the background image: SUCCESS.",
                backgroundFail: "Training plan has the background image: FAIL. Please check the Store tab of the Plan",
                itemsSuccess: 'Training plan has enough items: SUCCESS',
                itemsFail: 'Training plan has enough items: FAIL. Plan should contain more than 10 items',
                isNotDynamicSuccess: 'Training plan is not dynamic: SUCCESS',
                isNotDynamicFail: 'Training plan is not dynamic: FAIL. Publication of dynamic plan is forbidden'

            },
            title: "Training plan publication",
            commit: 'Publish',
            cancel: 'Unpublish'
        },
        monetization: {
            label: 'Paid plan'
        },
        commerceConditions: 'Staminity commission - 30% from training plan price. You will receive <strong>{{(value * 0.7) | number:0}} {{currency}}</strong> from each purchase',
        currency: {
            label: 'Currency',
            placeholder: 'Select currency'
        },
        price: {
            label: 'Price',
            placeholder: 'Set the price'
        },
        planDescriptionInfo: 'Training plan options for Store',
        targetAudience: {
            label: "Target audience",
            placeholder: 'Please describe the target audience'
        },
        regularWeek: {
            label: "Regular week",
            placeholder: 'Regular training week description'
        },
        statisticData: {
            label: 'Chart type',
            hint: 'Choose distance or duration to show on Chart'
        },
        effortStat: {
            metricsByDuration: "Duration (hours)",
            metricsByDistance: 'Distance (km)'
        },
        consultationsDescription: {
            label: 'Consultations description',
            placeholder: 'How often and in what way will you contact plan Acquirers'
        },
        offlineTrainingDescription: {
            label: "Offline activities with the coach",
            placeholder: "How often and when you will organize the offline activities included in the plan's price"
        },
        hasStructuredActivity: {
            label: 'Structured activities included'
        },
        structuredActivityDescription: {
            label: 'Structured activities description',
            placeholder: 'Describe your usage of structured activities in the training plan'
        },
        forUploadNeedSave: 'To upload images please save the plan',
        success: {
            title: 'Purchase success',
            authText: 'Congratulations, you have successfully purchased the Training plan! Go to "Purchases" tab in Store to assign it.',
            guestText: 'Congratulations, you have successfully purchased the Training plan! Next steps: <ol type="1"><li>Sign in to Staminity</li><li>Go to "Purchases" in "Training plan store" view</li><li>Assign the plan from / to necessary date </li><li>Find out the planned activities in your calendar and follow the instructions</li></ol>'
        },
        samplesHowTo: 'Activities and events samples could help users to understand your training approach and your instructions. Mark necessary activities and events as samples',
        hasUpdateForStore: "Has unpublished changes",
        pay: {
            title: 'Payment details'
        },
        owner: {
            label: 'Author'
        },
        published: 'Published in the Store',
        notPublished: 'Not published in the Store',
        lang: {
            label: 'Language'
        }
    }
};