export const homeTranslate = {
    ru: {
        fullTitle: 'Обзор',
        shortTitle: 'Обзор',
        monthAvg: 'Cр. {{value | number:1}}{{unit | translate}}/мес',
        charts: {
            header: 'Аналитика',
            distance: {
                title: 'Дистанция ({{unit | measureUnit:"default" | translate}})',
                subtitle: 'За последние 12 месяцев',
            },
            dataEmpty: 'Нет данных. Включите загрузку тренировок в настройках',
        },
        dashboard: {
            header: 'Дэшборд тренера',
            athlete:'Атлет'
        },
        today: {
            header: 'Мои тренировки'
        }
    },
    en: {
        fullTitle: 'Home',
        shortTitle: 'Home',
        monthAvg: 'Avg {{value | number:1}}{{unit | translate}}/month',
        charts: {
            header: 'Charts',
            distance: {
                title: 'Distance ({{unit | measureUnit:"default" | translate}})',
                subtitle: 'For the last 12 months',
            },
            dataEmpty: 'No data to display. Check activity synchronisation settings',
        },
        dashboard: {
            header: 'Dashboard',
            athlete: 'Athlete'
        },
        today: {
            header: 'My activities'
        }
    }
};