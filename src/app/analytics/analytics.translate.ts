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
            "мин/км": "мин/км",
            "км/ч": "км/ч",
            "мин/100м": "мин/100м",
            measures: "Измерения",

            // значения параметров
            day: "По дням",
            week: "По неделям",
            month: "По месяцам",
            quarter: "По кварталам",
            false: "Нет",
            true: "Да",

        },
        settings: {
            title: "Настройки графика",
            params: "Параметры выбора данных",
            layout: "Параметры отображения",
            globalParams: "Использовать общие параметры",
            saveContext: "Сохранить настройки",
            restoreContext: "Сбросить настройки",
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
            description: "Нарастающим итогом: {{cumulative | translate | lowercase}}, группировка: {{seriesDateTrunc | translate | lowercase}}",
            shortDescription: "Тренировочные объемы (время)",
        },
        actualDistance: {
            title: "Расстояние тренировок",
            description: "Нарастающим итогом: {{cumulative | translate | lowercase}}, группировка: {{seriesDateTrunc | translate | lowercase}}",
            shortDescription: "Тренировочные объемы (расстояние)",

        },
        activityMeasuresSelected: {
            title: "Показатели тренировок",
            shortDescription: "История изменения показателей тренировок",
            description: "Объемы: {{measureName | translate | lowercase}}, группировка: {{seriesDateTrunc | translate | lowercase}}",
        },
        activityMeasuresTL: {
            title: "Тренировочная нагрузка (TL и IL)",
            shortDescription: "Тренировочная нагрузка и уровень интенсивности",
            description: "Группировка: {{seriesDateTrunc | translate | lowercase}}",
        },
        timeInZonesHR: {
            title: "Время в зонах: Пульс",
            shortDescription: "Время в зонах по пульсу за период",
            description: "Группировка: {{seriesDateTrunc | translate | lowercase}}",
        },
        timeInZonesSpeed: {
            title: "Время в зонах: Темп/Скорость",
            shortDescription: "Время в зонах по темпу/скорости за период",
            description: "Группировка: {{seriesDateTrunc | translate | lowercase}}",
        },
        timeInZonesPower: {
            title: "Время в зонах: Мощность",
            shortDescription: "Время в зонах по мощности за период",
            description: "Группировка: {{seriesDateTrunc | translate | lowercase}}",
        },
        distanceByAthletesByPeriods: {
            title: "Объемы учеников (расстояние)",
            shortDescription: "Тренировочные объемы по ученикам (расстояние)",
            description: "Группировка: {{seriesDateTrunc | translate | lowercase}}",
        },
        durationByAthletesByPeriods: {
            title: "Объемы учеников (время)",
            shortDescription: "Тренировочные объемы по ученикам (время)",
            description: "Группировка: {{seriesDateTrunc | translate | lowercase}}",
        },
        HRTimePeaks: {
            title: "Пики пульса по времени",
            shortDescription: "Максимальные пики по пульсу по времени",
            description: "",
        },
        PaceTimePeaks: {
            title: "Пики темпа по времени",
            shortDescription: "Максимальные пики по темпу по времени",
            description: "",
        },
        SpeedTimePeaks: {
            title: "Пики скорости по времени",
            shortDescription: "Максимальные пики по скорости по времени",
            description: "",
        },
        PowerTimePeaks: {
            title: "Пики мощности по времени",
            shortDescription: "Максимальные пики по мощности по времени",
            description: "",
        },
        DistanceByActivityTypeByPeriods: {
            title: "Объемы по видам спорта",
            shortDescription: "Тренировочные объемы по видам спорта",
            description: "Объемы: {{measureName | translate | lowercase}}, группировка: {{seriesDateTrunc | translate | lowercase}}",
        },
        DistanceByActivityTypes: {
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
            description: "Объемы: {{measureName | translate | lowercase}}, группировка: {{seriesDateTrunc | translate | lowercase}}",
        },
        completePercent: {
            title: "Выполнение плана",
            shortDescription: "Процент выполнения плановых тренировок",
            description: "Объемы: {{measureName | translate | lowercase}}, группировка: {{seriesDateTrunc | translate | lowercase}}",
        },
    },

    en: {

    },
};

export const translateDashboardClub = {
    ru: {
        fullTitle: "Analytics & Reports",
        shortTitle: "Analytics",
    },
    en: {},
};
