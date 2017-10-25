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
            header: 'Уведомления',

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
            clubManagement: 'Управление клубом',

            //notificationSettings
            sync: 'Загрузка тренировок',
            zones: 'Зоны и пороги',
            clubCoach: 'Назначение тренеров в клубе',
            clubRequest: 'Членство в клубе',
            clubRoleAssignment: 'Назначение ролей в клубе',
            coachActivities: 'Тренировки от тренера',
            coachComments: 'Комментарии тренера',
            coachRequest: 'Подключение к тренеру',
            incomingRequestAthlete: 'Новые запросы от тренера и клуба',
            comments: 'Комментарии других пользователей',
            followActivities: 'Тренировки подписчиков',
            friendActivities: 'Тренировки друзей',
            friendRequests: 'Запросы друзьям',
            groupRequests: 'Запросы группам',
            groups: 'Действия с вашей группой',
            messages: 'Новое сообщение',
            system: 'Уведомления от Стаминити',
            billPayment: 'Счета: статус оплаты',
            billRecurring: 'Счета: автоматическое списание',
            newBills: 'Выставление счетов',
            tariffActions: 'Операции с тарифами',
            trial: 'Завершение пробного периода',
            athleteActivities: 'Тренировки спортсмена',
            athleteComments: 'Комментарии спортсмена',
            athleteConnections: 'Подключение спортсменов в клубе',
            athleteRequest: 'Запросы учеников',
            incomingRequestCoach: 'Новые запросы от спортсменов',
            zonesAthlete: 'Изменения зон и порогов учеников',
            assignClubCoach: 'Назначение тренеров для спортсменов',
            clubRoleAssignment: 'Назначение ролей в клубе',
            clubTariffs: 'Подключение тарифов за счет клуба',
            incomingRequestClub: 'Новые запросы клубу',
            membersInOut: 'Вход/выход из клуба',
            membersRequest: 'Запросы клуба'

        },
        templates: {
            header: 'Шаблоны тренировок'
        },
        favorites: {
            header: 'Избранные тренировки'
        }

    },
    en: {
        fullTitle: 'User settings',
        shortTitle: 'settings',
        personalInfo: {
            header: 'Personal info',
            hint: '',
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
            athletes: 'Students',
            athletesFull: 'Any information about your students: their achievements, records, etc',
            isFree: 'Availability for new students:',
            isFreeTrue: 'Yes, i am available',
            isFreeFalse: 'No, i am not available',
            contacts: {
                header:'Personal contacts (only for you and your coach)',
                extEmail: 'Personal email',
                phone: 'Phone'
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
            }
        },
        privacy: {
            header: 'Privacy',
            hint: 'Your image, First and Last name are available for all. Your personal info (e-mail, phone, weight, height) are not available to anyone except you and your coach.',
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
            }
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
            hint: 'Account',
            email: 'E-mail',
            password: 'Password'
        },
        billing: {
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
            yearly: 'Yearly',
            periodically: {
                1: 'Monthly',
                12: 'Yearly'
            },
            term: {
                1: 'month',
                12: 'year'
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
            agreementLink: "tariff conditions",
            conditions: 'Tariff conditions',
            conditionsText: `
Calculated tariff's fees for "{{tariff}}" tariff will be added to your existed bill.

Next bill will be issued at [{{validThrough}}]. 

You could control the calculated amount for every tariff in Bills`,
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
                "PremiumByCoach": "{{count}} premium athlethes",
                "PremiumByClub": "{{count}} premium by club athletes"
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
                "PremiumByCoach": "For every premium by coach",
                "PremiumByClub": "For every premium by club"
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
                isBlocked: "Blocked. You have unpaid bills"
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
            bill: "Bill",
            payTheBill: "Pay {{amount}}",
            billIsPaid: "Paid {{date}}",
            billEntry: 'Bill entry',
            amount: 'Amount',
            date: 'Date',
            count: 'Count',
            billTotal: 'Bill TOTAL',
            total: 'Total amount',
            billsList: 'All bills',
            invoices: 'Bills',
            invoiceAmount: 'Bill for',
            period: 'Period',
            billId: 'Bill number',
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
                bill: 'Bill date',
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
            header: 'Syncronisation settings',
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
                    text: "Initial syncronisation"},
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
                оnSyncCheckRequisites: {
                    button: 'Change',
                    title: 'Check...',
                    text: "Check your credentials"
                }
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

            calculation: {
                method: 'Method',
                choose: 'Choose available method',
                lactateThreshold: 'FTP',
                restingAndMax: 'Min and max',
                max: 'Max',
                powerThreshold: 'power FTP',
                paceThreshold: 'speed/pace FTP',
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

            }

        },
        notification: {
            header: 'Notifications',

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
            clubManagement: 'Club management',

            //notificationSettings
            sync: 'Upload activities',
            zones: 'Zones and thresholds',
            clubCoach: 'Club coach assignment',
            clubRequest: 'Club membership',
            clubRoleAssignment: 'Club role assignment',
            coachActivities: 'Activity plan by coach',
            coachComments: 'Coach comments',
            coachRequest: 'Connect with coach status',
            incomingRequestAthlete: 'New requests from coach and club',
            comments: 'User comments',
            followActivities: 'Followed users activities',
            friendActivities: 'Friends activities',
            friendRequests: 'Friend requests',
            groupRequests: 'Group requests',
            groups: 'Group actions',
            messages: 'New messages',
            system: 'System notifications',
            billPayment: 'Bills payments',
            billRecurring: 'Bills recurring',
            newBills: 'New bills',
            tariffActions: 'Tariff actions',
            trial: 'End trial',
            athleteActivities: "Athlete's activities",
            athleteComments: 'Athlete comments',
            athleteConnections: 'Club athletes assignment',
            athleteRequest: 'Athlete request',
            incomingRequestCoach: 'New requests from athletes',
            zonesAthlete: "Athlete's zones changes",
            assignClubCoach: 'Club coach assignment',
            clubRoleAssignment: 'Club role assignment',
            clubTariffs: 'Paid by club tariffs',
            incomingRequestClub: 'New requests to club',
            membersInOut: 'Club members in/out',
            membersRequest: 'Club members requests',

        },
        templates: {
            header: 'Templates'
        },
        favorites: {
            header: 'Favorites'
        }

    }
};
