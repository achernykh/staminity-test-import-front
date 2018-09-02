export const translateAnalytics = {
    ru: {
        fullTitle: "Аналитика и отчетность",
        shortTitle: "Аналитика",
        panel: {
            title: "Общие настройки",
            filter: "Фильтр",
            charts: "Отчеты",
        },
        filter: {
            more: " и еще {{num}}...",
            users: {
                placeholder: "Пользователь",
            },
            activityTypes: {
                placeholder: "Виды спорта",
                all: 'Все'
            },
            activityCategories: {
                empty: "Выберите категорию",
            },
            periods: {
                placeholder: "Период",
                startDate: "Начало периода",
                endDate: "Конец периода",
            },
            go: "Обновить",
        },
        defaultCharts: "Доступные графики",
        params: {
            // названия параметров
            volume: "Тренировочные объемы",
            distance: "Расстояние",
            duration: "Время",
            seriesDateTrunc: "Группировать",
            cumulative: "Нарастающим итогом",
            periods: "Период",
            thisYear: "С начала года",
            thisMonth: "С начала месяца",
            thisWeek: "С начала недели",
            customPeriod: "Выбрать...",
            protected: "Единый для всех графиков",
            heartRate: "Пульс",
            paceSpeed: "Скорость/темп",
            paceSpeedUnit: "Отображение темпа/скорости",
            minpkm: "мин/км",
            kmph: "км/ч",
            minp100m: "мин/100м",
            measures: "Измерения",

            // значения параметров
            day: "По дням",
            week: "По неделям",
            month: "По месяцам",
            quarter: "По кварталам",
            false: "Нет",
            true: "Да",
            loading: "Загрузка...",
            futDays: 'Дней в будущем',
            lastDays: 'Дней в прошлом',
            "180d": "180 дней",
            "90d": "90 дней",
            "60d": "60 дней",
            "30d": "30 дней",
            "7d": "7 дней",
            "0d": "Не выводить"

        },
        settings: {
            title: "Настройки графика",
            params: "Параметры выбора данных",
            layout: "Параметры отображения",
            globalParams: "Использовать общие параметры",
            saveContext: "Сохранить настройки",
            restoreContext: "По-умолчанию",
            authRoles: "Роль",
            aboutRoles: "Набор доступных графиков зависит от вашего тарифного плана",
            aboutStorage: "Сохраните заданные фильтры, набор графиков и настройки каждого графика. В любой момент можно вернуться к исходным настройкам",
            save: "Сохранить",

        },
        localFilter: "фильтр",
        globalParams: "Общие параметры: {{value | translate | lowercase}}",
        // Переводы преднастроенных отчетов
        actualMovingDuration: {
            //  title: "Время тренировок {{'analytics.params.' + measureName | translate}}",
            title: "Время тренировок",
            description: "Нарастающим итогом: {{cumulative | translate | lowercase}}, группировка: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
            shortDescription: "Тренировочные объемы (время)",
        },
        actualDistance: {
            title: "Расстояние тренировок",
            description: "Нарастающим итогом: {{cumulative | translate | lowercase}}, группировка: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
            shortDescription: "Тренировочные объемы (расстояние)",

        },
        activityMeasuresSelected: {
            title: "Показатели тренировок",
            shortDescription: "История изменения показателей тренировок",
            description: "Объемы: {{measureName | translate | lowercase}}, группировка: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        activityMeasuresTL: {
            title: "Тренировочная нагрузка (TL и IL)",
            shortDescription: "Тренировочная нагрузка и уровень интенсивности",
            description: "Группировка: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        timeInZonesHR: {
            title: "Время в зонах: Пульс",
            shortDescription: "Время в зонах по пульсу за период",
            description: "Группировка: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        timeInZonesSpeed: {
            title: "Время в зонах: Темп/Скорость",
            shortDescription: "Время в зонах по темпу/скорости за период",
            description: "Группировка: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        timeInZonesPower: {
            title: "Время в зонах: Мощность",
            shortDescription: "Время в зонах по мощности за период",
            description: "Группировка: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        distanceByAthletesByPeriods: {
            title: "Объемы учеников (расстояние)",
            shortDescription: "Тренировочные объемы по ученикам (расстояние)",
            description: "Группировка: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        durationByAthletesByPeriods: {
            title: "Объемы учеников (время)",
            shortDescription: "Тренировочные объемы по ученикам (время)",
            description: "Группировка: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        hrTimePeaks: {
            title: "Пики пульса по времени",
            shortDescription: "Максимальные пики по пульсу по времени",
            description: "",
        },
        paceTimePeaks: {
            title: "Пики темпа по времени",
            shortDescription: "Максимальные пики по темпу по времени",
            description: "",
        },
        speedTimePeaks: {
            title: "Пики скорости по времени",
            shortDescription: "Максимальные пики по скорости по времени",
            description: "",
        },
        powerTimePeaks: {
            title: "Пики мощности по времени",
            shortDescription: "Максимальные пики по мощности по времени",
            description: "",
        },
        distanceByActivityTypeByPeriods: {
            title: "Объемы по видам спорта",
            shortDescription: "Тренировочные объемы по видам спорта",
            description: "Объемы: {{measureName | translate | lowercase}}, группировка: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        distanceByActivityTypes: {
            title: "Соотношение объемов тренировок",
            shortDescription: "Объемы тренировок по видам спорта за период",
            description: "Объемы: {{measureName | translate | lowercase}}",
        },
        measurementsByPeriods: {
            title: "История измерений",
            shortDescription: "История измерений",
            description: "",
        },
        weightAndTotalVolume: {
            title: "Тренировочные объемы и вес",
            shortDescription: "Тренировочные объемы и вес",
            description: "Объемы: {{measureName | translate | lowercase}}, группировка: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        completePercent: {
            title: "Выполнение плана",
            shortDescription: "Процент выполнения плановых тренировок",
            description: "Объемы: {{measureName | translate | lowercase}}, группировка: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        fitnessFatigueForm: {
            title: 'Фитнес - усталость',
            shortDescription: 'Диаграмма Фитнес - усталость',
            description: 'Предыдущие {{lastDays}} и следующие {{futDays}} days'
        },
        trainingVolumesByAthletes: {
            title: 'Объемы спортсменов',
            shortDescription: 'Тренировочные объемы по спортсменам',
            description: 'Время/расстояние: {{measureName | translate | lowercase}}'
        },
        action: {
            restoreSettings: 'По-умолчанию',
            templates: 'Отчеты'
        },
        loadingTemplate: "Загрузка шаблонов графиков...",
        templateSelector: {
            title: 'Управление отчетами',
            needPermissions: 'Только для тренера'

        },
        groups: {
            athletes: "Отчеты по спортсменам",
            measurement: "Отчеты по измерениям",
            measures: "Показатели тренировок",
            volumes: "Тренировочные объемы",
            zonesAndPeaks: "Тренировочные зоны и пики"
        }
    },

    en: {
        fullTitle: "Analytics and reports",
        shortTitle: "Analytics",
        panel: {
            title: "Settings",
            filter: "Filter",
            charts: "Reports",
        },
        filter: {
            more: " and another {{num}}...",
            users: {
                placeholder: "User",
            },
            activityTypes: {
                placeholder: "Sports",
                all: 'All'
            },
            activityCategories: {
                empty: "Category",
            },
            periods: {
                placeholder: "Period",
                startDate: "Start date",
                endDate: "End date",
            },
            go: "Refresh",
        },
        defaultCharts: "Available charts",
        params: {
            // названия параметров
            volume: "Report type",
            distance: "Distance",
            duration: "Duration",
            seriesDateTrunc: "Group by",
            cumulative: "Cumulative",
            periods: "Period",
            thisYear: "This year",
            thisMonth: "This month",
            thisWeek: "This week",
            customPeriod: "Custom...",
            protected: "General settings",
            heartRate: "HR",
            paceSpeed: "Speed/pace",
            paceSpeedUnit: "Speed/pace unit",
            minpkm: "min/km",
            kmph: "km/h",
            minp100m: "min/100m",
            measures: "Measures",

            // значения параметров
            day: "by days",
            week: "by weeks",
            month: "by months",
            quarter: "by quarters",
            false: "No",
            true: "Yes",

            //
            byDays: 'by {{lastDays}} days',

            //
            loading: "Loading...",
            futDays: 'Next days',
            lastDays: 'Last days',
            "180d": "180 days",
            "90d": "90 days",
            "60d": "60 days",
            "30d": "30 days",
            "7d": "7 days",
            "0d": "Not show"

        },
        settings: {
            title: "Settings",
            params: "Params",
            layout: "Layout",
            globalParams: "Use general params",
            saveContext: "Save settings",
            restoreContext: "Restore",
            authRoles: "Role",
            aboutRoles: "Available charts depend on your tariff",
            aboutStorage: "Save charts, filters and settings",
            save: "Save",

        },
        localFilter: "Filter",
        globalParams: "General params: {{value | translate | lowercase}}",
        // Переводы преднастроенных отчетов
        actualMovingDuration: {
            //  title: "Время тренировок {{'analytics.params.' + measureName | translate}}",
            title: "Completed duration",
            description: "Cumulative: {{cumulative | translate | lowercase}}, group by: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
            shortDescription: "Completed duration",
        },
        actualDistance: {
            title: "Completed distance",
            description: "Cumulative: {{cumulative | translate | lowercase}}, group by: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
            shortDescription: "Completed distance",

        },
        activityMeasuresSelected: {
            title: "Activity indicators",
            shortDescription: "Activity indicators",
            description: "Duration/distance: {{measureName | translate | lowercase}}, group by: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        activityMeasuresTL: {
            title: "Training load (TL) and IL",
            shortDescription: "Training load (TL) and intensity level (TL)",
            description: "Group by: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        timeInZonesHR: {
            title: "Time in zones: Heart rate",
            shortDescription: "Time in heart rate zones",
            description: "Group by: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        timeInZonesSpeed: {
            title: "Time in zones: Speed/pace",
            shortDescription: "Time in speed/pace zones",
            description: "Group by: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        timeInZonesPower: {
            title: "Time in zones: Power",
            shortDescription: "Time in power zones",
            description: "Group by: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        distanceByAthletesByPeriods: {
            title: "Completed distance by athletes",
            shortDescription: "Completed distance by athletes",
            description: "Group by: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        durationByAthletesByPeriods: {
            title: "Completed duration by athletes",
            shortDescription: "Completed duration by athletes",
            description: "Group by: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        hrTimePeaks: {
            title: "Heart rate peaks",
            shortDescription: "HR peaks by time",
            description: "",
        },
        paceTimePeaks: {
            title: "Pace peaks",
            shortDescription: "Pace peaks by time",
            description: "",
        },
        speedTimePeaks: {
            title: "Speed peaks",
            shortDescription: "Speed peaks by time",
            description: "",
        },
        powerTimePeaks: {
            title: "Power peaks",
            shortDescription: "Power peaks by time",
            description: "",
        },
        distanceByActivityTypeByPeriods: {
            title: "Completed distance/duration",
            shortDescription: "Completed distance/duration by sports",
            description: "Measure: {{measureName | translate | lowercase}}, group by: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        distanceByActivityTypes: {
            title: "Completed distance/duration (piechart)",
            shortDescription: "Completed distance/duration by sports",
            description: "Measure: {{measureName | translate | lowercase}}",
        },
        measurementsByPeriods: {
            title: "Measurement history",
            shortDescription: "Measurement history",
            description: "",
        },
        weightAndTotalVolume: {
            title: "Completed distance/duration and weight",
            shortDescription: "Completed distance/duration and weight",
            description: "Measure: {{measureName | translate | lowercase}}, group by: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        completePercent: {
            title: "Percent of completion",
            shortDescription: "Percent of planned activities completion",
            description: "Measure: {{measureName | translate | lowercase}}, group by: {{'analytics.params.' + seriesDateTrunc | translate | lowercase}}",
        },
        fitnessFatigueForm: {
            title: 'Fitness - fatigue',
            shortDescription: 'Fitness - fatigue chart',
            description: 'Last {{lastDays}} and next {{futDays}} days'
        },
        trainingVolumesByAthletes: {
            title: 'Top athletes',
            shortDescription: 'Training volumes by athletes',
            description: 'Duration/distance: {{measureName | translate | lowercase}}'
        },
        action: {
            restoreSettings: 'Restore',
            templates: 'Charts'

        },
        loadingTemplate: "Chart templates loading...",
        templateSelector: {
            title: 'Charts management',
            needPermissions: 'Only for coaches'
        },
        groups: {
            athletes: "Athletes",
            measurement: "Measurements",
            measures: "Indicators",
            volumes: "Training volumes",
            zonesAndPeaks: "Training zones and Peaks"
        }
    },
};

export const translateDashboardClub = {
    ru: {
        fullTitle: "Аналитика и отчетность",
        shortTitle: "Аналитика",
    },
    en: {
        fullTitle: "Analytics & Reports",
        shortTitle: "Analytics",
    },
};
