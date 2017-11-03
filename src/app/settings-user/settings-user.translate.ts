export const _translate = {
    ru: {
        fullTitle: 'Настройки пользователя',
        shortTitle: 'Настройки',
        personalInfo: {
            header: 'Персональная информация',
            hint: 'Подсказка, пояснение по блоку информации...',
            coachProfileIncomplete: 'Ваш профиль тренера не заполнен и недоступен в поиске. Проверьте выполнение следующих условий:' +
            '<li>Установлена фотография</li>' +
            '<li>Указаны страна и город</li>' +
            '<li>Заполнена информация "О себе"</li>' +
            '<li>Указаны условия занятий</li>' +
            '<li>Указана контактная информация</li>',
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
            price: 'Условия занятий',
            priceFull: 'Укажите стоимость услуг при дистанционных занятиях, стоимость личных тренировок, групповых занятий и т.п.',
            contact: 'Контактная информация',
            contactFull: 'Как с вами связаться новым ученикам',
            athletes: 'Ученики',
            athletesFull: 'Расскажите о ваших учениках: сколько занимаются у вас сейчас, скольких вы подготовили, какие их успехи вы можете отметить и т.п.',
            isFree: 'Доступность для новых учеников',
            isFreeTrue: 'Принимаю учеников',
            isFreeFalse: 'Набор завершен',
            contacts: {
                header:'Контакты (доступно только вам и тренеру)',
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
            },
            calendar: {
                title: 'Интерация с календарем (iCal)',
                hint: 'Ссылка для подписки на ваш календарь тренировок Стаминити в другом календарном приложении, поддерживающем формат iCal: Microsoft Outlook, Google Calendar, Apple iCal',
                empty: 'Не удалось получить ссылку на ваш календарь</a>'
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
            activePromo: 'Промо-код «{{promo}}» активирован с {{appliedFrom}} по {{appliedTo}}',
            validPromo: 'Промо-код «{{promo}}» может быть активирован после сохранения',
            rejectedPromo: "Промо-код не найден",
            removePromo: 'Удалить',
            submitPromo: 'Принять',
            payment: 'Оплата',
            card: 'Карта',
            paypal: 'Paypal',
            saving: 'На {{saving}}% выгоднее',
            autoRenewal: 'Автоматическое продление',
            autoRenewalShort: 'Автопродление',
            isOn: 'включено',
            isOff: 'выключено',
            agreementMessage: "Я прочитал и согласен с ",
            agreementLink: "условиями подключения тарифа",
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

После отключения тарифа с завтрашнего дня будет отключен доступ к фунциям по тарифному плану и остановлены начисления. `,
            tariffDisconnectLater: `
Вы хотите отключить тариф?

Доступ к фунции тарифного плана будет прекращён для вас с [{{validThrough}}].`,
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
            tariff: 'Тарифный план',
            tariffs: {
                "Coach": "Тренер",
                "Premium": "Премиум",
                "Club": "Клуб"
            },
            status: "Статус",
            tariffStatuses: {
                enabled: "Подключен до {{until}}",
                enabledByCoach: "Подключен за счет тренера {{coach}}",
                enabledByClub: "Подключен за счет клуба {{club}}",
                notEnabled: "Отключен",
                isPaid: "Оплачен до {{until}}",
                trial: "Пробный период до {{until}}",
                isBlocked: "Функции заблокированы, необходима оплата счета"
            },
            tariffStatusesIsEnabled: {
                enabled: "Подключен",
                enabledByClub: "Подключен",
                enabledByCoach: "Подключен",
                notEnabled: "Отключен",
                isPaid: "Оплачен",
                trial: "Пробный период",
                isBlocked: "Тариф заблокирован, необходима оплата счета"
            },
            tariffStatusesEnablers: {
                enabled: "За свой счёт",
                enabledByCoach: "За счет тренера {{coach}}",
                enabledByClub: "За счет клуба {{club}}",
                notEnabled: "За свой счёт",
                isPaid: "За свой счёт",
                trial: "За свой счёт",
                isBlocked: "За свой счёт"
            },
            subscriptionDate: "Дата подключения",
            subscriptionEnds: "Срок действия",
            subscriptionConditions: "Условия действия тарифа",
            subscriptionConditionsLink: "https://help.staminity.com/ru/tariffs/{{tariffCode}}.html",
            promoDiscount: 'Скидка по промо-коду',
            volumeDiscount: 'Объёмная скидка',
            connections: 'Подключено',
            bill: "Счёт",
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
            billId: 'Номер счёта',
            approvalCode: 'Код авторизации',
            paymentProcessing: 'Способ платежа',
            billStatuses: {
                new: 'Формируется',
                ready: 'Ожидает оплаты',
                complete: 'Оплачен'
            },
            invoiceStatuses: {
                new: 'Формируется',
                ready: 'Оплатить',
                complete: 'Оплачен'
            },
            billDatesTitle: 'Сроки',
            billDates: {
                start: 'Начало периода',
                end: 'Окончание периода',
                bill: 'Дата счёта',
                payment: 'Дата оплаты'
            },
            billTabs: {
                overview: 'Обзор',
                fees: 'Начисления',
                payment: 'Оплата'
            },
            feeDetails: 'Детали начисления',
            autoPayment: 'Оплачивать автоматически'
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
                custom: 'Вручную',

                JoeFrielHeartRateRunning7: 'Joe Friel, 7 зон по пульсу для бега',
                JoeFrielHeartRateCycling7: 'Joe Friel, 7 зон по пульсу для велосипеда',
                Karvonen5: 'Karvonen, 5 зон по пульсу',
                Yansen6: 'Peter Janssen, 6 зон по пульсу',
                AndyCoggan6: 'Andy Coggan, 7 зон по мощности',
                JoeFrielSpeed7: 'Joe Friel, 7 зон по темпу/скорости',
                '5': '5 пользовательских зон',
                '7': '7 пользовательских зон',
                '9': '9 пользовательских зон'

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
