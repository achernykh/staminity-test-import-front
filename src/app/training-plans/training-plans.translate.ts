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
            appoint: 'Присвоить...',
            calendar: 'Запланировать тренировки',
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
                info: "Дата подключения {{createdDate | date:'shortDate'}}, версия плана {{version}}"
            },
            enabledSync: "Транслировать изменения плана",
            enabledSyncDisabled: "Трансляция изменений плана невозможна",
            fixedPlanInOtherDays: "Даты присвоения отличаются от дат плана",
            assignDatesBeforeToday: "В плане есть тренировки в прошлом. При присвоении они не будут созданы в календаре спортсмена"
        },
        planDontHaveItemsForAssignment: "В плане нет тренировок для присвоения",
        info: {
            disableEditAssignPlan: ""
        }
    },
    en: {
        builder: {
            fullTitle: 'Training plan',
            shortTitle: 'Plan',
        },
        search: {
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
            label: 'For sale'
        },
        name: {
            label: 'Name'
        },
        type: {
            label: 'Activity type'
        },
        distanceType: {
            label: 'Distance type'
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