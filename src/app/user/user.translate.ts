export const translateUser = {
    ru: {
        settings: {
            fullTitle: 'Настройки пользователя',
            shortTitle: 'Настройки',
            profile: {
                header: 'Профиль',
            },
            personalInfo: {
                header: 'Персональная информация',
                hint: 'Настройка профиля',
                coachProfileIncomplete: 'Ваш профиль тренера не заполнен и недоступен в поиске. Проверьте выполнение следующих условий:' +
                '<li>Установлена фотография</li>' +
                '<li>Заполнена информация "О себе"</li>' +
                '<li>Указаны условия занятий</li>' +
                '<li>Указана контактная информация</li>' +
                '<li>Настройка приватности: Персональная информация = "Все"</li>',
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
            },
            coachProfile: {
                header: 'Профиль тренера'
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
                header: 'Внешние календари',
                title: 'Интерация с календарем (iCal)',
                hint: 'Ссылка для подписки на ваш календарь тренировок Стаминити в другом календарном приложении, поддерживающем формат iCal: Microsoft Outlook, Google Calendar, Apple iCal',
                empty: 'Не удалось получить ссылку на ваш календарь'
            },
            coach: {
                header: 'Профиль тренера',
                hint: 'Профиль тренера',
                statusIncomplete: 'Профиль тренера не заполнен, вас нельзя найти в поиске',
                isCoach: 'Тренер',
                status: {
                    addCoachTariff: "Профиль тренера отключен. Для активации подключите тариф 'Тренер', самостоятельно или за счет клуба",
                    off: "Вы не тренер.",
                    coachTariffEnabled: "Вы тренер. Отключение невозможно, пока есть активный тариф 'Тренер'",
                    planSellerEnabled: "Вы тренер. Отключение невозможно, активен профиль автора планов",
                    on: "Вы тренер",
                },
            },
            agent: {
                header: "Продажа тренировочных планов",
                currency: {
                    RUB: "Рубли РФ",
                    USD: "Доллары США",
                    EUR: 'Евро'
                },
                cards: {
                    label: "Карты и счета",
                    header: "Карты и счета для вывода средств от продажи планов",
                    has: "Есть привязанные карты/счета",
                    none: "Нет привязанных карт",
                    card: "{{identityString}}, до {{expireDate}}",
                    addCard: "Добавить новую карту",
                    removeCard: "Удалить",
                    isDefault: "По-умолчанию",
                    addCardMessage: "Для привязки карты с нее будет списана сумма в пределах одного рубля. Данная сумма не будет возвращена на карту.",
                    name: '',
                    deleteCardTitle: "Удалить карту",
                    deleteCardMessage: "Удалить данные карты? После удаления карту будет нельзя использовать для вывода средств",
                    defaultCardTitle: 'Установить по-умолчанию',
                    defaultCardMessage: 'Установить признак "по умолчанию" для выбранной карты? Карта по-умолчанию используется для вывода средств'

                },
                sales: {
                    label: "Продажи тренировочных планов",
                    header: "Продажи тренировочных планов",
                    summary: "Всего продано {{count}} планов на {{amounts}}",
                    none: "Покупок тренировочных планов не было",
                    total: "Итого",
                },
                withdrawals: {
                    label: "Вывод средств",
                    header: "Поручения на вывод средств",
                    none: "Вывод средств не производился",
                    last: "Последний запрос на вывод средств: {{date}} на {{amount}} {{currency}}",
                    requestedAmount: "Сумма перевода",
                    execAmount: "Сумма к зачислению",
                    account: "Карта/счет",
                    state: "Статус",
                    created: "Дата создания",
                    executed: "Дата исполнения",
                    states: {
                        "C": "Создан",
                        "A": "Подтверждён",
                        "D": "Отменён",
                        "E": "Выполнен",
                    },
                },
                balance: {
                    label: 'Доступный баланс, {{currency}}',
                    conditions: "Комиссия за вывод до {{noCommissionLimit}} {{currency}} - 1.5%, минимум {{withdrawLimit}} {{currency}}",
                    withdraw: "Вывести",
                    withdrawNoExtAccount: "Не подключено средство для вывода",
                    withdrawZeroAmount: "Ваш баланс пуст",
                    withdrawNotAvaliable: "Минимальная сумма для вывода - {{withdrawLimit}} {{currency}}",
                    withdrawWithCommission: {
                        RUB: "Комиссия за вывод до {{noCommissionLimit}} {{currency}} - 1.5% минимум 60 RUB",
                        USD: "Комиссия за вывод до {{noCommissionLimit}} {{currency}} - 2% + 0.5 USD",
                        EUR: "Комиссия за вывод до {{noCommissionLimit}} {{currency}} - 2% + 0.3 EUR",
                    },
                    withdrawNoCommission: "Вывести без комиссии",
                    withdrawConfirmationHeader: "Вы уверены?",
                    withdrawWithCommissionConfirmation: {
                        RUB: "Вывести с комиссией? Комиссия 1.5% минимум 60 RUB будет удержана при перечислении",
                        USD: "Вывести с комиссией? Комиссия 2% + 0.5 USD будет удержана при перечислении",
                        EUR: "Вывести с комиссией? Комиссия 2% + 0.3 EUR будет удержана при перечислении",
                    },
                    withdrawNoCommissionConfirmation: {
                        RUB: "Вывести без комиссии? Вся сумма будет перечислена на вашу карту/счет, установленные по-умолчанию для RUB",
                        USD: "Вывести без комиссии? Вся сумма будет перечислена на вашу карту/счет, установленные по-умолчанию для USD",
                        EUR: "Вывести без комиссии? Вся сумма будет перечислена на вашу карту/счет, установленные по-умолчанию для EUR",
                    },
                },
                iWant: "Я хочу публиковать тренировочные планы",
                profile: "Профиль автора планов",
                complete: "Публикация тренировочных планов возможна",
                incompleteIndividual: "Публикация планов невозможна, не заполнен профиль",
                incompleteNotIndividual: "Публикация планов невозможна, заполните и отправьте анкету",
                isIndividual: "Физическое лицо",
                individual: "Да",
                notIndividual: "Нет, я ИП или представитель юридического лица",
                agree: 'Я прочитал и принимаю условия <a href="https://legal.staminity.com/ru/offer-author-individual.html">Лицензионного договора с авторами планов-физическими лицами</a> и <a href="https://legal.staminity.com/ru/offer-author-buyer.html">Договора между Автором и Покупателем тренировочных планов</a>',
                email: "E-mail",
                companyName: "Полное наименование компании / ИП",
                inn: "ИНН",
                kpp: "КПП",
                noIndividualRUS: `Чтобы публиковать тренировочные планы от имени юридического лица или ИП необходимо прочитать <a href="https://legal.staminity.com/ru/offer-author-company.html">Договор с авторами планов-юрлицами и ИП</a>, заполнить анкету, приведенную в договоре и направить нам скан-копию подписанной анкеты по адресу <a href="mailto:support@staminity.com">support@staminity.com</a>`,
                noResidentRUS: 'Возможность продажи планов нерезидентами РФ будет реализована позднее. Напишите нам, если заинтересованы в этом: <a href="mailto:support@staminity.com">support@staminity.com</a>',
                innMessage: "ИНН должен состоять из 10 или 12 цифр",
                kppMessage: "КПП должен состоять из 9 цифр",
            },
            privacy: {
                header: 'Приватность',
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
                },
                hint: 'Настройки приватности'
            },
            display: {
                header: 'Представление',
                hint: 'Настройки отображения',
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
                hint: 'Ваша учётная запись',
                email: 'Логин',
                password: 'Пароль',
                newPassword: 'Новый пароль'
            },
            billing: {
                header: 'Счета и тарифы',
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
                terms: {
                    1: 'Ежемесячно',
                    12: 'Ежегодно',
                    14: 'Ежегодно'
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
                    onSyncCheckRequisites: {
                        button: 'Изменить',
                        title: 'Проверка...',
                        text: "Проверка правильности введенных данных"
                    }
                },
                account: {
                    placeholder: 'Логин'
                },
                password: {
                    placeholder: 'Пароль'
                },
                startDate: {
                    hint: 'Дата начала синхронизации'
                },
                actions: {
                    stop: 'Отключить'
                }
            },
            zones: {
                header: 'Тренировочные зоны',
                hint: 'Настройки тренировочных зон и ПАНО',
                addSport: 'Добавить спорт',
                editZones: 'Изменить зоны',
                deleteZones: 'Удалить зоны',
                zoneCaption: 'Название',
                zoneFrom: 'Начало',
                zoneTo: 'Окончание',
                measures: 'Показатели',
                methods: 'Методы расчёта',

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

                },

                error: {
                    required: 'Значения в зонах должны быть указаны',
                    consistencyPositive: 'Значениях в зонах должны быть положительными',
                    consistencyBetweenValues: 'Верхняя граница зоны должна быть больше чем нижняя',
                    consistencyBetweenZones: 'Диапазоны значений в зонах не должны пересекаться'
                }

            },
            notification: {
                header: 'Уведомления',
                hint: 'Настройки уведомлений',

                web: 'Браузер',
                email: 'Почта',
                mobile: 'Телефон',

                //notificationGroup
                user: 'Для всех пользователей',
                coach: 'Для тренера',
                club: 'Для клуба',

                //notificationGroupStructure
                userActivities: 'Тренировки',
                userSocial: 'Друзья, группы и подписчики',
                userClub: 'Занятия в клубе',
                userCoach: 'Занятия с тренером',
                userStaminity: 'Сервисные сообщения',
                userTariffs: 'Тарифы и оплата',
                coachWork: 'Подготовка спортсменов',
                trainingPlansSell: 'Тренировочные планы',
                clubManagement: 'Управление клубом',

                //notificationSettings
                sync: "Загрузка тренировок",
                zones: "Зоны и пороги",
                clubCoach: "Назначение тренеров в клубе",
                clubRequest: "Членство в клубе",
                clubRoleAssignment: "Назначение ролей в клубе",
                coachActivities: "Тренировки от тренера",
                coachComments: "Комментарии тренера",
                coachRequest: "Подключение к тренеру",
                incomingRequestAthlete: "Новые запросы от тренера и клуба",
                comments: "Комментарии других пользователей",
                followActivities: "Тренировки подписчиков",
                friendActivities: "Тренировки друзей",
                friendRequests: "Запросы друзьям",
                groupRequests: "Запросы группам",
                groups: "Действия с вашей группой",
                messages: "Новое сообщение",
                system: "Уведомления от Стаминити",
                billPayment: "Счета: статус оплаты",
                billRecurring: "Счета: автоматическое списание",
                newBills: "Выставление счетов",
                tariffActions: "Операции с тарифами",
                trial: "Завершение пробного периода",
                agentBilling: "Профиль Автора планов",
                athleteActivities: "Тренировки спортсмена",
                athleteComments: "Комментарии спортсмена",
                athleteConnections: "Подключение спортсменов в клубе",
                athleteRequest: "Запросы учеников",
                incomingRequestCoach: "Новые запросы от спортсменов",
                trainingPlans: "Продажи тренировочных планов",
                trainingPlansFree: "Подключения бесплатных тренировочных планов",
                zonesAthlete: "Изменения зон и порогов учеников",
                assignClubCoach: "Назначение тренеров для спортсменов",
                clubTariffs: "Подключение тарифов за счет клуба",
                incomingRequestClub: "Новые запросы клубу",
                membersInOut: "Вход/выход из клуба",
                membersRequest: "Запросы клуба",

            },
            templates: {
                header: 'Шаблоны тренировок'
            },
            favorites: {
                header: 'Избранные тренировки'
            }
        },
        profile: {
            fullTitle: 'Профиль пользователя',
            shortTitle: 'Профиль',
        },
        // все действия с профилем, настройками
        actions: {
            uploadAvatar: '',
            uploadBackground: ''
        },
        // структура данных по разделам
        public : {

        }
    },
    en: {
        settings: {
            fullTitle: 'User settings',
            shortTitle: 'settings',
            profile: {
                header: 'Profile',
            },
            personalInfo: {
                header: 'Personal info',
                hint: '',
                coachProfileIncomplete: 'Your coach profile is incomplete and not available for search. Please check you set the following info:' +
                '<li>Upload profile photo</li>' +
                '<li>About you</li>' +
                '<li>Conditions</li>' +
                '<li>Contacts for new athletes</li>' +
                '<li>Privacy settings: Personal info = "All"</li>',
                main: {
                    header: 'About you',
                    firstName: 'First name',
                    lastName: 'Last name',
                    sex: 'Sex',
                    birthday: 'Birthday',
                    country: 'Country',
                    city: 'City',
                    uri: 'Your profile: staminity.com/user/'
                },
                sex: 'Sex:',
                M: 'Male',
                W: 'Female',
                about: 'About you...',
                price: 'Services and price',
                priceFull: 'Describe your services to client and pricing options',
                contact: 'Contacts',
                contactFull: 'How new athletes may contact you',
                athletes: 'Athletes',
                athletesFull: 'Any information about your athletes: their achievements, records, etc',
                isFree: 'Availability for new athletes:',
                isFreeTrue: 'Yes, I am available',
                isFreeFalse: 'No, I am not available',
                contacts: {
                    header:'Personal contacts (only for you and your coach)',
                    extEmail: 'Personal email',
                    phone: 'Phone'
                },
            },
            coachProfile: {
                header: 'Coach profile'
            },
            sportShape: {
                header: 'Fitness',
                weight: 'Weight (kg)',
                weightErr: 'Weight should be between 10 and 500',
                height: 'Height (sm)',
                heightErr: 'Height should be between 10 and 300',
                level: 'Avg hours/week for training',
                activityTypes: {
                    header: 'Sports:',
                    code: []
                }
            },
            calendar: {
                header: 'External calendars',
                title: 'External calendar integration (iCal)',
                hint: 'Your Staminity activity calendar personal link for Microsoft Outlook, Google Calendar, Apple iCal and other 3rd party calendar applications.',
                empty: 'Your personal link is not available'
            },
            coach: {
                header: 'Coach profile',
                hint: 'Coach profile',
                statusIncomplete: "Coach profile incomplete, you're not available for search",
                isCoach: 'Coach',
                status: {
                    addCoachTariff: "To become a Coach please add trial Coach tariff",
                    off: "You're not a coach",
                    coachTariffEnabled: "You are the coach. Disabling in not possible while 'Coach' tariff is active.",
                    planSellerEnabled: "You are the coach. Disabling in not possible while you want to publish training plans",
                    on: "You are the coach",
                },
            },
            agent: {
                header: "Training plans purchases",
                currency: {
                    RUB: "RUB",
                    USD: "USD",
                    EUR: 'EUR'
                },
                cards: {
                    label: "Cards and bank accounts",
                    header: "Cards and bank accounts to withdraw funds",
                    has: "Cards and accounts exists",
                    none: "No cards or bank accounts",
                    card: "{{identityString}}, till {{expireDate}}",
                    addCard: "Add new card",
                    removeCard: "Delete card",
                    isDefault: "Default",
                    addCardMessage: "To add new card we charge it for small amount of money, less than 1 RUB. This amount will not be returned to your card.",
                    name: '',
                    deleteCardTitle: "Delete card",
                    deleteCardMessage: "Do you want to delete card? Deleted cart cannot be used for withdrawal",
                    defaultCardTitle: 'Set as default',
                    defaultCardMessage: 'Do you want to set this card as default?'
                },
                sales: {
                    label: "Training plans purchases",
                    header: "Training plans purchases",
                    summary: "Total purchases: {{count}} training plans for {{amounts}}",
                    none: "No purchases",
                    total: "Total",
                },
                withdrawals: {
                    label: "Withdraw",
                    header: "Withdraw requests",
                    none: "No withdraws",
                    last: "Last withdraw request: {{date}} for {{amount}} {{currency}}",
                    requestedAmount: "Requested amount",
                    execAmount: "Executed amount",
                    account: "Card/Bank acc",
                    state: "Status",
                    created: "Created",
                    executed: "Executed",
                    states: {
                        "C": "Created",
                        "A": "Approved",
                        "D": "Declined",
                        "E": "Executed",
                    },
                },
                balance: {
                    label: 'Available balance, {{currency}}',
                    conditions: "Withdraw commission if the amount less than {{noCommissionLimit}} {{currency}} - 1.5%, min {{withdrawLimit}} {{currency}}",
                    withdraw: "Withdraw",
                    withdrawNoExtAccount: "No cards / bank accounts to withdraw",
                    withdrawZeroAmount: "Withdraw not available, zero balance",
                    withdrawNotAvaliable: "Min amount to withdraw - {{withdrawLimit}} {{currency}}",
                    withdrawWithCommission: {
                        RUB: "Commission for withdraw less than {{noCommissionLimit}} {{currency}} - 1.5% min 60 RUB",
                        USD: "Commission for withdraw less than {{noCommissionLimit}} {{currency}} - 2% + 0.5 USD",
                        EUR: "Commission for withdraw less than {{noCommissionLimit}} {{currency}} - 2% + 0.3 EUR",
                    },
                    withdrawNoCommission: "Withdraw without commission",
                    withdrawConfirmationHeader: "Withdraw confirmation",
                    withdrawWithCommissionConfirmation: {
                        RUB: "Withdraw with commission? Commission 1.5% min 60 RUB",
                        USD: "Withdraw with commission? Commission 2% + 0.5 USD",
                        EUR: "Withdraw with commission? Commission 2% + 0.3 EUR",
                    },
                    withdrawNoCommissionConfirmation: {
                        RUB: "Withdraw without commission? All requested amount in RUB will be send to your default card / bank account",
                        USD: "Withdraw without commission? All requested amount in USD will be send to your default card / bank account",
                        EUR: "Withdraw without commission? All requested amount in EUR will be send to your default card / bank account",
                    },
                },
                iWant: "I want to publish training plans in Store",
                profile: "Training plan Author profile",
                complete: "You're available to publish training plans in Store",
                incompleteIndividual: "Publication is not available, training plan's Author profile is incomplete",
                incompleteNotIndividual: "Publication is not available, please fill and send Author's request form",
                isIndividual: "Is individual",
                individual: "Yes",
                notIndividual: "No, i am the Company or individual enterpreneur",
                agree: 'I have read and agree with <a href="https://legal.staminity.com/en/offer-author-individual.html">Agreement with Authors - individuals</a> and <a href="https://legal.staminity.com/en/offer-author-buyer.html">Agreement between Author and Aquirer of training plan</a>',
                email: "E-mail",
                companyName: "Full Company name / Full enterpreneur name",
                inn: "INN",
                kpp: "KPP",
                noIndividualRUS: `To be able to publish trainging plans as a Company or Individual Enterpreneur you have to read the <a href="https://legal.staminity.com/ru/offer-author-company.html">Agreement with Authors - companies and enterpeneurs </a>, fill the special Form from the Agreement and send to us the scan copy of signed form to <a href="mailto:support@staminity.com">support@staminity.com</a>`,
                noResidentRUS: 'Training plan publication for non-Russian resindents is not available now. Let us know if you are interested in that option <a href="mailto:support@staminity.com">support@staminity.com</a>',
                innMessage: "INN should be 10 or 12 digits",
                kppMessage: "KPP should be 9 digits",
            },
            privacy: {
                header: 'Privacy',
                groups: {
                    userProfile: {
                        personal: "User profile: personal information",
                        personalHint: "About yourself, sex, birthday, Country, City",
                        summaryStatistics: "Profile: summary statistics",
                        summaryStatisticsHint: "Total distance and time spent for training by periods"
                    },
                    calendarItem: {
                        summary: "Activity: general information",
                        summaryHint: "General actual data about your activities",
                        actualData: "Activity: detailed actual data",
                        actualDataHint: "Detailed actual data for every activity",
                        plannedData: "Activity: plan and actual info",
                        plannedDataHint: "Plan and actual data for every activity"
                    }
                },
                level: {
                    id50: 'Me and my coach',
                    id40: 'Me, my coach and friends',
                    id10: 'Everyone'
                },
                hint: 'Privacy settings'
            },
            display: {
                header: 'Display preferences',
                hint: 'Display preferences',
                language: 'Language',
                timezone: 'Time zone',
                units: 'Measurement units',
                metric: {
                    short: 'KG/KM',
                    full: 'Metric (KG/KM)'
                },
                imperial: {
                    short: 'Pound/Mile',
                    full: 'Imperial (Pound/Mile)'
                },
                firstDayOfWeek: 'First day of week'
            },
            account: {
                header: 'Account',
                hint: 'Your account',
                email: 'E-mail',
                password: 'Password',
                newPassword: 'Change password'
            },
            billing: {
                header: 'Tariffs and invoices',
                tariffsHeader: 'Tariffs',
                enableTariff: 'Subscribe',
                disableTariff: 'Unsubscribe',
                confirmEnable: 'Subscribe',
                confirmPay: 'Pay {{cost}} {{currency}}',
                confirmTrial: 'Try it free',
                confirmDisable: 'Unsubscribe',
                confirmSave: 'Save',
                close: 'Close',
                cancel: 'Cancel',
                open: 'Open',
                monthly: 'Monthly',
                yearly: 'Annually',
                periodically: {
                    1: 'Monthly',
                    12: 'Annually'
                },
                term: {
                    1: 'month',
                    12: 'year'
                },
                terms: {
                    1: 'Monthly',
                    12: 'Annually',
                    14: 'Annually'
                },
                dayly: 'day',
                subscriptionFees: 'Subscription fee',
                fixedFee: 'Subscription fee',
                changeFee: 'Change tariff',
                free: 'Free',
                promo: 'Promo-code',
                activePromo: 'Promo-code «{{promo}}» is activated from {{appliedFrom}} to {{appliedTo}}',
                validPromo: 'Promo-code «{{promo}}» could be activated after save your changes',
                rejectedPromo: "Promo-code is not found",
                removePromo: 'Remove',
                submitPromo: 'Submit',
                payment: 'Payment',
                card: 'Card',
                paypal: 'Paypal',
                saving: '{{saving}}% less',
                autoRenewal: 'Auto renewal',
                autoRenewalShort: 'Auto renewal',
                isOn: 'On',
                isOff: 'Off',
                agreementMessage: "I have read and agree with ",
                agreementLink: "Terms of subscription",
                conditions: "Terms of subscription",
                conditionsText: `
    Calculated tariff's fees for "{{tariff}}" tariff will be added to your existed invoice.

    Next invoice will be issued at [{{validThrough}}]. 

    You could control the calculated amount for every tariff in Invoices`,
                trialConditionsText: `
    Trial subscription is free. 

    Trial subscription is valid until [{{validThrough}}].`,
                tariffDisconnectionUnavailable: `
    You can not disable the tariff. To disable tariff please disconnect: {{counts}}
    `,
                tariffDisconnectNow: `
    Do you want to disable the tariff?

    From tomorrow you will lost your tariff functions and we will stop calculate the tariff fees"
    `,
                tariffDisconnectLater: `
    Do you want to disable the tariff?

    You will lost your tariff functions from [{{validThrough}}], after the end of previously paid period`,
                counts: {
                    "Athletes": '{{count}} athletes',
                    "ClubAthletes": '{{count}} club athletes',
                    "CoachByClub": "{{count}} coaches",
                    "PremiumByCoach": "{{count}} Premium athletes",
                    "PremiumByClub": "{{count}} Premium by club athletes"
                },
                group: {
                    "Athletes": 'Athletes fees',
                    "ClubAthletes": 'Club athletes fees',
                    "CoachByClub": "Club coaches fees",
                    "PremiumByCoach": "Premium by coach fees",
                    "PremiumByClub": "Premium by club fees"
                },
                eachInGroup: {
                    "Athletes": 'For every athlete',
                    "ClubAthletes": 'For every club athlete',
                    "CoachByClub": "For every club coach",
                    "PremiumByCoach": "For every Premium by coach",
                    "PremiumByClub": "For every Premium by club"
                },
                eachInGroupBelow: '{{below}}',
                eachInGroupBetween: 'From {{from}} to {{to}} per person',
                eachInGroupAbove: 'Start from {{above}}',
                tariff: 'Tariff',
                tariffs: {
                    "Coach": "Coach",
                    "Premium": "Premium",
                    "Club": "Club"
                },
                status: "Status",
                tariffStatuses: {
                    enabled: "Enabled till {{until}}",
                    enabledByCoach: "Enabled by coach {{coach}}",
                    enabledByClub: "Enabled by club {{club}}",
                    notEnabled: "Disabled",
                    isPaid: "Paid till {{until}}",
                    trial: "Trial term till {{until}}",
                    isBlocked: "Blocked. Waiting payment"
                },
                tariffStatusesIsEnabled: {
                    enabled: "Enabled",
                    enabledByClub: "Enabled by club",
                    enabledByCoach: "Enabled by coach",
                    notEnabled: "Disabled",
                    isPaid: "Paid",
                    trial: "Trial",
                    isBlocked: "Blocked. You have unpaid invoices"
                },
                tariffStatusesEnablers: {
                    enabled: "By yourself",
                    enabledByCoach: "By coach {{coach}}",
                    enabledByClub: "By club {{club}}",
                    notEnabled: "By yourself",
                    isPaid: "By yourself",
                    trial: "By yourself",
                    isBlocked: "By yourself"
                },
                subscriptionDate: "Subscription date",
                subscriptionEnds: "Valid through",
                subscriptionConditions: "Subscription conditions",
                subscriptionConditionsLink: "https://help.staminity.com/en/tariffs/{{tariffCode}}.html",
                promoDiscount: 'Promo discount',
                volumeDiscount: 'Volume discount',
                connections: 'Connections',
                bill: "Invoice",
                payTheBill: "Pay {{amount}}",
                billIsPaid: "Paid {{date}}",
                billEntry: 'Invoice entry',
                amount: 'Amount',
                date: 'Date',
                count: 'Count',
                billTotal: 'Invoice TOTAL',
                total: 'Total amount',
                billsList: 'All invoices',
                invoices: 'Invoices',
                invoiceAmount: 'Invoice for',
                period: 'Period',
                billId: 'Invoice number',
                approvalCode: 'Approval code',
                paymentProcessing: 'Payment processing',
                billStatuses: {
                    new: 'Forming',
                    ready: 'Issued',
                    complete: 'Paid'
                },
                invoiceStatuses: {
                    new: 'Forming',
                    ready: 'Issued',
                    complete: 'Paid'
                },
                billDatesTitle: 'Terms',
                billDates: {
                    start: 'Start date',
                    end: 'End date',
                    bill: 'Invoice date',
                    payment: 'Payment date'
                },
                billTabs: {
                    overview: 'Overview',
                    fees: 'Fees',
                    payment: 'Payment'
                },
                feeDetails: 'Fee details',
                autoPayment: 'Charge automatically'
            },
            sync: {
                header: 'Synchronisation settings',
                garmin: 'Garmin Connect',
                strava: 'Strava',
                polar: 'Polar Flow',
                status: {
                    offSyncNeverEnabled: {
                        button: 'Enable',
                        title: 'Disabled',
                        text: 'Enable auto sync your activities'},
                    offSyncEnabledEarly: {
                        button: 'Enable',
                        title: 'Disabled',
                        text: "Last acitivity sync date: {{lastSync | date:'short' }}"},
                    onSyncing: {
                        button: 'Change',
                        title: 'Sync...',
                        text: "Initial synchronisation"},
                    onSyncComplete: {
                        button: 'Change',
                        title: 'Synced',
                        text: "Last acitivity sync date: {{lastSync | date:'short' }}"},
                    onSyncCreate: {
                        button: 'Change',
                        title: 'Please wait...',
                        text: "Waiting confirmation"},
                    onSyncPendingRequest: {
                        button: 'Change',
                        title: 'Please wait...',
                        text: "Waiting confirmation"},
                    onSyncCheckRequisites: {
                        button: 'Change',
                        title: 'Check...',
                        text: "Check your credentials"
                    }
                },
                account: {
                    placeholder: 'Login'
                },
                password: {
                    placeholder: 'Password'
                },
                startDate: {
                    hint: 'Sync start date'
                },
                actions: {
                    stop: 'Disable'
                }
            },
            zones: {
                header: 'Training zones',
                hint: 'Training zones',

                addSport: 'Add activity type',
                editZones: 'Change zones',
                deleteZones: 'Delete zones',
                zoneCaption: 'Name',
                zoneFrom: 'From',
                zoneTo: 'To',
                measures: 'Measures',
                methods: 'Calculation methods',

                calculation: {
                    method: 'Method',
                    choose: 'Choose available method',
                    lactateThreshold: 'LT - lactate threshold',
                    restingAndMax: 'Min and max',
                    max: 'Max',
                    powerThreshold: 'LT Power',
                    paceThreshold: 'LT speed/pace',
                    custom: 'Manual',

                    JoeFrielHeartRateRunning7: 'Joe Friel, 7 HR zones for running',
                    JoeFrielHeartRateCycling7: 'Joe Friel, 7 HR zones for cycling',
                    Karvonen5: 'Karvonen, 5 HR zones',
                    Yansen6: 'Peter Janssen, 6 HR zones',
                    AndyCoggan6: 'Andy Coggan, 7 power zones',
                    JoeFrielSpeed7: 'Joe Friel, 7 pace/speed zones',
                    '5': '5 custom zones',
                    '7': '7 custom zones',
                    '9': '9 custom zones'

                },
                error: {
                    required: 'Values in zones should exist',
                    consistencyPositive: 'Values in zones should be positive',
                    consistencyBetweenValues: 'Upper limit in every zone should be greater that lower',
                    consistencyBetweenZones: 'Ranges of values in the training zones should not overlap'
                }

            },
            notification: {
                header: 'Notifications',
                hint: 'Notification settings',

                web: 'Web',
                email: 'Email',
                mobile: 'Mobile',

                //notificationGroup
                user: 'For all users',
                coach: 'For coaches',
                club: 'For clubs',

                //notificationGroupStructure
                userActivities: 'Activities',
                userSocial: 'Friends, groups and followers',
                userClub: 'Work with club',
                userCoach: 'Train with coach',
                userStaminity: 'Staminity notifications',
                userTariffs: 'Tariffs and payments',
                coachWork: 'Work with athletes',
                trainingPlansSell: 'Training plans sell',
                clubManagement: 'Club management',

                //notificationSettings
                sync: "Upload activities",
                zones: "Zones and thresholds",
                clubCoach: "Club coach assignment",
                clubRequest: "Club membership",
                clubRoleAssignment: "Club role assignment",
                coachActivities: "Activity plan by coach",
                coachComments: "Coach comments",
                coachRequest: "Connect with coach status",
                incomingRequestAthlete: "New requests from coach and club",
                comments: "User comments",
                followActivities: "Followed users activities",
                friendActivities: "Friends activities",
                friendRequests: "Friend requests",
                groupRequests: "Group requests",
                groups: "Group actions",
                messages: "New messages",
                system: "System notifications",
                billPayment: "Invoices: payments",
                billRecurring: "Invoices: payment recurring",
                newBills: "New invoices",
                tariffActions: "Tariff actions",
                trial: "End trial",
                agentBilling: "Training plans Author profile",
                athleteActivities: "Athlete's activities",
                athleteComments: "Athlete's comments",
                athleteConnections: "Club athletes assignment",
                athleteRequest: "Athlete's requests",
                incomingRequestCoach: "New requests from athletes",
                trainingPlans: "Paid training plans purshases",
                trainingPlansFree: "Free training plans purchases",
                zonesAthlete: "Athlete's zones changes",
                assignClubCoach: "Club coach assignment",
                clubTariffs: "Paid by club tariffs",
                incomingRequestClub: "New requests to club",
                membersInOut: "Club members in/out",
                membersRequest: "Club members requests",

            },
            templates: {
                header: 'Templates'
            },
            favorites: {
                header: 'Favorites'
            }
        },
        profile: {
            fullTitle: 'User profile',
            shortTitle: 'Profile',
        },
        // все действия с профилем, настройками
        actions: {
            uploadAvatar: '',
            uploadBackground: ''
        },
        // структура данных по разделам
        public : {

        }
    }
};