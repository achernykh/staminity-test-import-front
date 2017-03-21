export const _translate = {
    ru: {
        fullTitle: 'Настройки пользователя',
        shortTitle: 'Настройки',
        personalInfo: {
            header: 'Персональная информация',
            hint: 'Подсказка, пояснение по блоку информации...',
            main: {
                header: 'О себе',
                firstName: 'Имя',
                lastName: 'Фамилия',
                sex: 'Пол',
                birthday: 'День рождения',
                country: 'Страна',
                city: 'Город',
                uri: 'Ваш профиль: staminity.com/user/'
            },
            sex: 'Пол:',
            M: 'Мужской',
            W: 'Женский',
            about: 'О себе...',
            contacts: {
                header:'Контакты',
                extEmail: 'Дополнительный email',
                phone: 'Телефон'
            },
            sportShape: {
                header: 'Спортивная форма',
                weight: 'Вес (кг)',
                weightErr: 'Вес должен быть в интервале от 10 до 500',
                height: 'Рост (см)',
                heightErr: 'Рост должен быть в интервале от 10 до 500',
                level: 'Режим занятий(час/неделю)',
                activityTypes: {
                    header: 'Виды спорта:',
                    code: []
                }
            }
        },
        privacy: {
            header: 'Приватность',
            hint: 'Ваши фамилия и имя доступны для просмотра всем пользователям. Ваши личные данные (e-mail,' +
            ' телефон, а также вес, рост и уровень тренированности) не доступны никому, кроме Вашего тренера',
            groups: {
                userProfile: {
                    personal: "Профиль: персональная информация",
                    personalHint: "Информация о себе, пол, дата рождения, страна и город проживания",
                    summaryStatistics: "Профиль: сводная статистика по тренировкам",
                    summaryStatisticsHint: "Общее количество, продолжительность и расстояние выполненных тренировок"
                },
                calendarItem: {
                    summary: "Тренировка: сводная информация",
                    summaryHint: "По каждой выполненной тренировке: просмотр сводной информации, без деталей",
                    actualData: "Тренировка: детальная фактическая информация",
                    actualDataHint: "По каждой выполненной тренировке: полная фактическая информация",
                    plannedData: "Тренировка: план и сравнение план/факт",
                    plannedDataHint: "По каждой тренировке: план на тренировку, полная фактическая информация, сравнение план/факт"
                }
            },
            level: {
                id50: 'Я и тренер',
                id40: 'Я, тренер и друзья',
                id10: 'Все'
            }
        },
        display: {
            header: 'Представление',
            hint: 'Пояснение, подсказка....',
            language: 'Язык интерфейса',
            timezone: 'Часовой пояс',
            units: 'Система мер',
            metric: {
                short: 'КГ/КМ',
                full: 'Метрическая (КГ/КМ)'
            },
            imperial: {
                short: 'Фунт/Миля',
                full: 'Имперская (Фунт/Миля)'
            },
            firstDayOfWeek: 'Первый день недели'
        },
        account: {
            header: 'Учетная запись',
            hint: 'Пояснение, подсказка....',
            email: 'Логин',
            password: 'Пароль'
        },
        subscriptions: {
            header: 'Подписки'
        },
        sync: {
            header: 'Настройка интеграции',
            garmin: 'Garmin Connect',
            strava: 'Strava',
            polar: 'Polar Flow',
            status: {
                offSyncNeverEnabled: {
                    button: 'Подключить',
                    title: 'Отключено',
                    text: 'Включите синхронизацию для автоматической загрузки новых тренировок'},
                offSyncEnabledEarly: {
                    button: 'Подключить',
                    title: 'Отключено',
                    text: "Последняя тренировка загружена {{lastSync | date:'short' }}"},
                onSyncing: {
                    button: 'Изменить',
                    title: 'Синхронизация...',
                    text: "Выполняется начальная синхронизация"},                   
                onSyncComplete: {
                    button: 'Изменить',
                    title: 'Синхронизировано',
                    text: "Последняя тренировка загружена {{lastSync | date:'short' }}"}, 
                onSyncCreate: {
                    button: 'Изменить',
                    title: 'Ожидание...',
                    text: "Ожидается подтверждение"}, 
                onSyncPendingRequest: {
                    button: 'Изменить',
                    title: 'Ожидание...',
                    text: "Ожидается подтверждение"}
            }
        },
        zones: {
            header: 'Тренировочные зоны',
            hint: 'Подсказка, пояснение по блоку информации...',
        },
        notification: {
            header: 'Уведомления'
        },
        templates: {
            header: 'Шаблоны тренировок'
        },
        favorites: {
            header: 'Избранные тренровки'
        }

    },
    en: {

    }
};
