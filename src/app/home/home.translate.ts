export const homeTranslate = {
    ru: {
        fullTitle: 'Обзор',
        shortTitle: 'Обзор',
        monthAvg: 'среднее {{value | number:1}}{{unit | translate}}/месяц',
        charts: {
            header: 'Аналитика',
            distance: {
                title: 'Дистанция ({{unit | measureUnit:"default" | translate}})',
                subtitle: 'За последние 12 месяцев',
            }
        },
        dashboard: {
            header: 'Дэшборд тренера'
        },
        today: {
            header: 'Мои тренировки'
        }
    },
    en: {
        fullTitle: 'Home',
        shortTitle: 'Home',
        monthAvg: 'avg {{value | number:1}}{{unit | translate}}/month',
        charts: {
            distance: {
                title: 'Distance ({{unit | measureUnit:"default" | translate}})',
                subtitle: 'For the last year',
            }
        },
        dashboard: {
            header: 'Dashboard'
        },
        today: {
            header: 'My activities'
        }
    }
};