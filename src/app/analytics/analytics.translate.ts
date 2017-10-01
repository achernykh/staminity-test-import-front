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
                placeholder: "Период",
                startDate: "Начало периода",
                endDate: "Конец периода"
            },
        },
        defaultCharts: "Доступные графики",
        params: {
            // названия параметров
            distance: 'Расстояние',
            duration: 'Время',
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
            paceSpeedUnit: "Отображение темпа/скорости"



            // значения параметров
            day: "По дням",
            week: "По неделям",
            month: "По месяцам",
            quarter: "По кварталам",
            false: "Нет",
            true: "Да"

        },
        settings: {
            title: 'Настройки графика',
            params: 'Параметры выбора данных',
            layout: 'Параметры отображения'
        },
        // Переводы преднастроенных отчетов
        actualMovingDuration: {
            title: "Время тренировок {{'analytics.params.' + measureName | translate}}",
            description: 'Тренировочные объемы по периодам'
        },
        actualDistance: {
            title: 'Расстояние тренировок',
            description: 'Тренировочные объемы по периодам'
        },
        activityMeasuresSelected: {
            title: 'Показатели тренировок',
            description: 'История изменения показателей тренировок'
        },
        activityMeasuresTL: {
            title: 'Тренировочная нагрузка (TL)',
            description: 'Тренировочная нагрузка и уровень интенсивности'
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
            title: 'Объемы учеников (расстояние)',
            description: 'Тренировочные объемы по ученикам (расстояние)'
        },
        durationByAthletesByPeriods: {
            title: 'Объемы учеников (время)',
            description: 'Тренировочные объемы по ученикам (время)'
        },
        HRTimePeaks: {
            title: 'Пики пульса по времени',
            description: 'Максимальные пики по пульсу по времени'
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
            title: 'Объемы по видам спорта',
            description: 'Тренировочные объемы по видам спорта'
        },
        DistanceByActivityTypes: {
            title: 'Соотношение объемов тренировок',
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