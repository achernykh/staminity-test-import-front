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
            view: 'Посмотреть',
            appoint: 'Присвоить...',
            calendar: 'Запланировать тренировки',
            assignment: 'Присвоения',
            publish: 'Опубликовать',
            unpublish: 'Отменить',
            setIcon: 'Изменить',
            setBackground: 'Установить фон',
            cardView: 'Вид карточки',
            listView: 'Вид таблица',
            hidePanel: 'Показать панель',
            showPanel: 'Скрыть панель',
            search: 'Поиск',
            myPlans: 'Мои планы'
        },
        plan: 'Тренировочный план',
        // поля плана
        isPublic: {
            label: 'План для публикации в магазине'
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
            placeholder: 'Введите ключевые слова, разделяйте их по нажатию Enter'
        },
        isStructured: {
            label: 'Сегменты'
        },
        hasConsultations: {
            label: 'Включены консультации'
        },
        hasOfflineTraining: {
            label: 'Включены очные занятия'
        },
        state: {
            active: 'Приобретен',
            pending: 'Заказан'
        },
        weekCount: {
            label: 'Количество недель'
        },
        options: {
            label: 'Опции',
            isStructured: 'Структурированные тренировки',
            hasConsultations: 'Консультация с автором',
            hasOfflineTraining: 'Очные занятия'

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
                    hint: 'Даты присвоения могут быть рассчитаны от дат плана или от дат записей плана'
                },
                applyDateMode: {
                    label: 'Тип даты',
                    F: 'Дата начала',
                    T: 'Дата окончания',
                    hint: 'План может быть присвоен или с выбранной даты или к указанной дате'
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
            fullTitle: 'Тренировочные планы',
            shortTitle: 'Планы',
            tabs: {
                store: 'Магазин',
                purchases: 'Покупки'
            },
            free: 'Бесплатно',
            price: 'Купить {{price}} {{currency}}',
            name: 'Название',
            author: 'Автор',
            title: 'Приобрести тренировочный план'
        },
        landing: {
            weekCount: 'Недель подготовки {{count}}',
            description: 'Описание плана',
            targetAudience: 'Целевая аудитория',
            calendarDates: 'Даты плана',
            flexCalendarDates: 'План не привязан к датам',
            assignOpportunities: 'Вы сможете присвоить план с любой или по любую дату для подготовки в вашему старту',
            regularWeek: 'Типовая неделя',
            offlineTraining: 'Очные тренировки',
            consultations: 'Консультации с автором',
            structuredActivity: 'Структурированные тренировки',
            structuredActivityOpportunities: 'Структурированные тренировки позволяют составить посегментное задание с указанием необходимой интенсивности для конкретного спортсмена. Автор использует относительные значения в % от ПАНО, а спортсмен видит их у себя в абсолютных значениях в соответствии с настройками тренировочных зон. Структурированное задание в аналитике дает четкое понимание выполнения каждого сегмента тренировки.',
            devices: 'Необходимые девайсы',
            needHeartRateBelt: 'Для выполнения тренировочной программы необходимо иметь датчик пульса и девайс имеющий интеграцию с Garmin Connect или Strava (Polar, Suunto)',
            needPowermeter: 'Для выполнения тренировочной программы необходимо иметь датчик мощности и девайс имеющий интеграцию с Garmin Connect или Strava (Polar, Suunto)',
            syncDescription: 'Подробнее о синхронизации вы можете прочитать по ссылке <a href="#">импорт данных в Стаминити</a>',
            chart: 'График нагрузки',
            effortStat: {
                metricsByDuration: 'Тренировочный обьем по неделям (часы)',
                metricsByDistance: 'Тренировочный обьем по неделям (км)'
            },
            howItWorks: 'Как это работает?',
            howItWorksDescription: '<ol type="1"><li>Вы приобритаете план</li><li>В пунтке меню Тренировочные планы -> Покупки выбиарате купленный план и присваиваете в необходмиые даты своего календаря</li><li>Если вы используете средства записи тренировке, то выполняете настройку в меню Настройки -> Интеграция</li><li>Настраиваете тренировочные зоны</li><li>Скачиваете мобильное приложение и ваш план всегда под рукой</li><li>Отслеживаете свой прогресс выполнения с помощью аналитики</li></ol>',
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
            signin: 'У меня уже есть аккаунт',
            signup: 'Создать аккаунт'
        },
        monetization: {
            label: 'Указать стоимость плана'
        },
        commerceConditions: 'Комиссия Staminity - 30% от цены плана. На баланс автора будет зачислено 70% от стоимости плана с каждой покупки',
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

    },
    en: {
        builder: {
            fullTitle: 'Training plan',
            shortTitle: 'Plan',
        },
        store: {
            fullTitle: 'Training plan search',
            shortTitle: 'Plan search',
        },
        filter: 'Filter',
        filterResult: 'Found {{total}} plan(s)',

        // табс
        tabs: {
            general: 'General',
            description: 'Description',
            commerce: 'Selling conditions'
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
            appoint: 'Assignments',
            calendar: 'Create plan items',
            assignment: 'Assignments'
        },
        // поля плана
        isPublic: {
            label: 'For publish in Store'
        },
        name: {
            label: 'Name',
            placeholder: 'Set training plan name'
        },
        type: {
            label: 'Activity type',
            placeholder: 'Select activity type'
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
            label: 'Keywords'
        },
        assignment: {
            info: "Plan start date: {{firstPlanDate | date:'longDate'}}, first item date: {{firstItemDate | date:'longDate'}}. </br>" +
            "Plan end date:  {{lastPlanDate | date:'longDate'}}, last item date: {{lastItemDate | date:'longDate'}}",
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
                    hint: 'Training plan '
                },
                applyFromDate: {
                    label: 'Start date',
                    placeholder: 'Select assignment start date'
                },
                applyToDate: {
                    label: 'End date',
                    placeholder: 'Select assignment end date'
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
                title: 'Assignment list',
                empty: 'Training plan has no assignments',
                info: "Assignment created {{createdDate | date:'shortDate'}}, plan version: {{version}}"
            },
            enabledSync: "Transmit changes",
            enabledSyncDisabled: "Plan changes cannot be transmitted to athletes",
            fixedPlanInOtherDays: "Attention! Assignment dates differ from plan dates",
            assignDatesBeforeToday: "Plan has several items in the past. They will not be created in athlete's calendar"
        },
        planDontHaveItemsForAssignment: "Plan has no items and cannot be assigned"
    }
};