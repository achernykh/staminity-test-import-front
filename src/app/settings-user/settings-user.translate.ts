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
        billing: {
            tariffsHeader: 'Тарифные планы',
            enableTariff: 'Подключить тариф',
            disableTariff: 'Отключить тариф',
            confirmEnable: 'Подключить',
            confirmPay: 'Оплатить {{cost}} {{currency}}',
            confirmTrial: 'Подключить бесплатно',
            confirmDisable: 'Отключить',
            confirmSave: 'Сохранить',
            close: 'Закрыть',
            cancel: 'Отмена',
            open: 'Открыть',
            monthly: 'Ежемесячно',
            yearly: 'Ежегодно',
            periodically: {
                1: 'Ежемесячно',
                12: 'Ежегодно'
            },
            term: {
                1: 'месяц',
                12: 'год'
            },
            dayly: 'день',
            subscriptionFees: 'Абонентская плата',
            fixedFee: 'Абонентская плата',
            changeFee: 'Изменить условия действующего тарифа',
            free: 'Бесплатно',
            promo: 'Промо-код',
            activePromo: 'Промо-код «{{promo}}» активирован',
            submitPromo: 'Принять',
            payment: 'Оплата',
            card: 'Карта',
            paypal: 'Paypal',
            saving: 'На {{saving}}% выгоднее',
            autoRenewal: 'Повторять платёж',
            conditions: 'Условия подключения',
            conditionsText: `
Начисления по тарифу "{{tariff}}" будут объединены с начислениями по ранее подключенному тарифу.

Ближайший счёт на оплату будет вам выставлен [{{validThrough}}]. 

В разделе "Счета" вы можете контролировать общую сумму начислений по счетам.`,
            trialConditionsText: `
Подключение бесплатно. Во время пробного периода начисления по тарифу не производятся. 

Период пробного использования до [{{validThrough}}].
`,
            tariffDisconnectionUnavailable: `
Отключить тариф невозможно, к вам подключены {{counts}}.

Отключите их, а затем отключите тариф.
`,
            tariffDisconnectNow: `
Вы хотите отключить тариф?

Доступ к фунции тарифного плана будет для вас прекращён.

Нажимая кнопку "Отключить", вы соглашаетесь с тем, что:

...`,
            tariffDisconnectLater: `
Вы хотите отключить тариф?

Доступ к фунции тарифного плана будет прекращён для вас с [{{validThrough}}].

Нажимая кнопку "Отключить", вы соглашаетесь с тем, что:

...`,
            counts: {
                "Athletes": '{{count}} спортсменов',
                "ClubAthletes": '{{count}} спортсменов',
                "CoachByClub": "{{count}} тренеров",
                "PremiumByCoach": "{{count}} спортсменов с Премиум-доступом",
                "PremiumByClub": "{{count}} спортсменов с Премиум-доступом"
            },
            group: {
                "Athletes": 'Оплата за спортсменов',
                "ClubAthletes": 'Оплата за спортсменов',
                "CoachByClub": "Оплата за тренеров",
                "PremiumByCoach": "Подключение спортсменам тарифа «Премиум»",
                "PremiumByClub": "Подключение спортсменам тарифа «Премиум»"
            },
            eachInGroup: {
                "Athletes": 'За каждого спортсмена',
                "ClubAthletes": 'За каждого спортсмена',
                "CoachByClub": "За каждого тренера",
                "PremiumByCoach": "За каждого спортсмена",
                "PremiumByClub": "За каждого спортсмена"
            },
            eachInGroupBelow: '{{below}}',
            eachInGroupBetween: 'От {{from}} до {{to}}, за каждого',
            eachInGroupAbove: 'Начиная с {{above}}',
            tariffs: {
                "Coach": "Тренер",
                "Premium": "Премиум",
                "Club": "Клуб"
            },
            tariff: 'Тарифный план',
            state: "Статус",
            status: {
                enabled: "Подключен до {{until}}",
                enabledByUser: "Подключен за счет тренера {{coach}}",
                enabledByClub: "Подключен за счет клуба {{club}}",
                paid: "Оплачен до {{until}}",
                trial: "Пробный период до {{until}}",
                disabled: "Не подключен"
            },
            paymentStatus: "Оплата",
            subscriptionDate: "Дата подключения",
            subscriptionEnds: "Срок действия",
            subscriptionConditions: "Условия действия тарифа",
            tariffStatuses: {
                enabled: 'Подключен',
                notEnabled: 'Не подключен',
                trial: 'Пробный период'
            },
            paymentStatuses: {
                enabledBySelf: "За свой счёт",
                enabledByUser: "За счет тренера {{coach}}",
                enabledByClub: "За счет клуба {{club}}"
            },
            promoDiscount: 'Скидка по промо-коду',
            volumeDiscount: 'Объёмная скидка',
            connections: 'Подключено',
            billFor: "Счёт за период {{from}} - {{to}}",
            payTheBill: "Оплатить {{amount}}",
            billIsPaid: "Оплачен {{date}}",
            billEntry: 'Позиция счёта',
            amount: 'Сумма',
            date: 'Дата',
            count: 'База начисления',
            billTotal: 'Итого по счёту',
            total: 'Итого',
            billsList: 'Реестр счетов',
            invoices: 'Счета на оплату',
            invoiceAmount: 'Счет на сумму',
            period: 'Период',
            invoiceStatuses: {
                new: 'Формируется',
                ready: 'Оплатить',
                complete: 'Подробно'
            }
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
                    text: "Ожидается подтверждение"},
                оnSyncCheckRequisites: {
                    button: 'Изменить',
                    title: 'Проверка...',
                    text: "Проверка правильности введенных данных"
                }
            }
        },
        zones: {
            header: 'Тренировочные зоны',
            hint: 'Подсказка, пояснение по блоку информации...',

            addSport: 'Добавить спорт',
            editZones: 'Изменить зоны',
            deleteZones: 'Удалить зоны',
            zoneCaption: 'Название',
            zoneFrom: 'Начало',
            zoneTo: 'Окончание',

            calculation: {
                method: 'Метод расчета',
                choose: 'Выберите доступный метод расчета',
                lactateThreshold: 'ПАНО пульс',
                restingAndMax: 'Мин и макс значение',
                max: 'Максимальное значение',
                powerThreshold: 'ПАНО мощность',
                paceThreshold: 'ПАНО скорость',

                JoeFrielHeartRateRunning7: 'Joe Friel, 7 зон по пульсу для бега',
                JoeFrielHeartRateCycling7: 'Joe Friel, 7 зон по пульсу для велосипеда',
                Karvonen5: 'Karvonen, 5 зон по пульсу',
                Yansen6: 'Peter Janssen, 6 зон по пульсу',
                AndyCoggan6: 'Andy Coggan, 7 зон по мощности',
                JoeFrielSpeed7: 'Joe Friel, 7 зон по темпу/скорости'

            }

        },
        notification: {
            header: 'Уведомления'
        },
        templates: {
            header: 'Шаблоны тренировок'
        },
        favorites: {
            header: 'Избранные тренировки'
        }

    },
    en: {

    }
};
