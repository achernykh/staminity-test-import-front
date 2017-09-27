export const translateAnalytics = {
    ru: {
        fullTitle: 'Аналитика и отчетность',
        shortTitle: 'Аналитика',
        panel: {
            filter: 'Фильтр',
            charts: 'Отчеты'
        },
        filter: {
            more: ' и еще {{num}}...',
            users: {
                placeholder: "Пользователь"
            },
            activityTypes: {
                placeholder: "Виды спорта"
            },
            activityCategories: {
                empty: "Выберите категорию"
            },
            periods: {
                placeholder: "Период"
            },
        },
        defaultCharts: "Доступные графики",
        params: {
            // названия параметров
            seriesDateTrunc: "Группировать",
            cumulative: "Нарастающим итогом",
            period: "Период",
            thisYear: "С начала года",
            thisMonth: "С начала месяца",
            thisWeek: "С начала недели",
            customPeriod: "Выбрать...",
            protected: "Единый для всех графиков",


            // значения параметров
            day: "По дням",
            week: "По неделям",
            month: "По месяцам",
            quarter: "По кварталам",
            false: "Нет",
            true: "Да"

            },
        // Переводы преднастроенных отчетов
        actualMovingDuration: {
            title: 'Фактическое время тренировок',
            description: 'Тренировочные объемы по периодам'
        },
        actualDistance: {
            title: 'Фактическое расстояние тренировок',
            description: 'Тренировочные объемы по периодам'
        },
        distanceHRPaceTL: {
            title: 'Пульс, темп, TL',
            description: 'Средние показатели тренировок по периодам'
        },
        timeInZonesHR: {
            title: 'Время в зонах: Пульс',
            description: 'Время в зонах по пульсу за период'
        },
        timeInZonesSpeed: {
            title: 'Время в зонах: Темп/Скорость',
            description: 'Время в зонах по темпу/скорости за период'
        },
        timeInZonesPower: {
            title: 'Время в зонах: Мощность',
            description: 'Время в зонах по мощности за период'
        },
        distanceByAthletesByPeriods: {
            title: 'Тренировки учеников (расстояние)',
            description: 'Тренировочные объемы по ученикам (расстояние)'
        },
        durationByAthletesByPeriods: {
            title: 'Тренировки учеников (время)',
            description: 'Тренировочные объемы по ученикам (расстояние)'
        },
        HRTimePeaks: {
            title: 'Пики пульса по времени',
            description: 'Максимальные пиковые значения по пульсу по времени'
        },
        PaceTimePeaks: {
            title: 'Пики темпа по времени',
            description: 'Максимальные пики по темпу по времени'
        },
        SpeedTimePeaks: {
            title: 'Пики скорости по времени',
            description: 'Максимальные пики по скорости по времени'
        },
        PowerTimePeaks: {
            title: 'Пики мощности по времени',
            description: 'Максимальные пики по мощности по времени'
        },
        DistanceByActivityTypeByPeriods: {
            title: 'Объемы по видам спорта (расстояние)',
            description: 'Тренировочные объемы по расстоянию по видам спорта'
        },
        DurationByActivityTypeByPeriods: {
            title: 'Объемы по видам спорта (время)',
            description: 'Тренировочные объемы по времени по видам спорта'
        },
        DistanceByActivityTypes: {
            title: 'Сводные объемы по видам спорта',
            description: 'Объемы тренировок по видам спорта за период'
        },
    },


    en: {

    }
};

export const translateDashboardClub = {
    ru: {
        fullTitle: 'Analytics & Reports',
        shortTitle: 'Analytics'
    },
    en: {}
};