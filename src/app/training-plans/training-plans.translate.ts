export const _translateTrainingPlans = {
    ru: {
        builder: {
            fullTitle: 'Тренировочный план',
            shortTitle: 'План',
        },
        search: {
            fullTitle: 'Поиск тренировочных планов',
            shortTitle: 'Поиск планов',
        },
        filter: 'Фильтр',
        filterResult: 'Найдено планов {{total}}',

        // табс
        tabs: {
            general: 'Основные параметры',
            description: 'Описание',
            commerce: 'Условия продажи'
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
            appoint: 'Применить к...',
            calendar: 'Ввести план',
            assignment: 'Присвоения'
        },
        // поля плана
        isPublic: {
            label: 'План на продажу'
        },
        name: {
            label: 'Название'
        },
        type: {
            label: 'Вид спорта'
        },
        distanceType: {
            label: 'Тип соревнований'
        },
        isFixedCalendarDates: {
            label: 'Привязан к календарным датам',
            hint: 'Включите, чтобы при планировании использовать конкретные даты. Если хотите создать универсальный план, который можно применить в любые даты, оставьте выключенным'
        },
        propagateMods: {
            label: 'Обновляемый план',
            hint: 'В обновляемом плане все изменения транслируются спортсменам даже после применения плана. Если план не обновляемый, у спортсмена в календаре будет версия плана, существовавшая на момент присвоения.'
        },
        startDate: {
            label: 'Начальная дата плана'
        },
        endDate: {
            label: 'Конечная дата плана'
        },
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
            label: 'Ключевые слова'
        },
        assignment: {
            info: "Дата начала плана: {{firstPlanDate | date:'longDate'}}, дата первой записи: {{firstItemDate | date:'longDate'}}. Дата окончания плана:  {{lastPlanDate | date:'longDate'}}, дата последней записи: {{lastItemDate | date:'longDate'}}",
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
                    label: 'Даты плана',
                    P: 'Даты начала/окончания плана',
                    I: 'Даты первой/последней записи',
                    hint: 'Начало/окончание плана могут быть рассчитаны как от начала календарных дней, так и от первой/последней записи'
                },
                applyDateMode: {
                    label: 'Режим присвоения',
                    F: 'Начиная с даты',
                    T: 'К указанной дате',
                    hint: 'План может быть присвоен или с выбранной даты или до определенной даты'
                },
                applyFromDate: {
                    label: 'Дата начала',
                    placeholder: 'Укажите дату начала плана'
                },
                applyToDate: {
                    label: 'Дата окончания',
                    placeholder: 'Укажите дату окончания плана'
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
                info: "Дата подключения {{createdDate | date:'shortDate'}}, версия плана {{planRevision}}"
            },
            enabledSyncDisabled: "Обновления плана не будут переданы спортсменам",
            fixedPlanInOtherDays: "Даты присвоения отличаются от дат плана",
            assignDateIsAfterPlan: "В плане есть тренировки в прошлом. При присвоении они не будут созданы в календаре спортсмена"
        },
        planDontHaveItemsForAssignment: "В плане нет тренировок для присвоения"
    },
    en: {

    }
};