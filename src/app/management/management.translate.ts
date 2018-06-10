export const translateManagement = {
    ru: {
        fullTitle: "Управление клубом",
        shortTitle: "Клуб",
        byClub: "К",
        Premium: "Премиум",
        Coach: "Тренер",
        Club: "Клуб",
        role: "Роль",
        roles: "Роли",
        selected: "Выбрано {{count}} членов клуба",
        myAthletes: 'Мои атлеты',
        clubRoles: {
            ClubCoaches: "Тренеры",
            ClubAthletes: "Спортсмены",
            ClubManagement: "Менеджмент",
        },
        toolbar: {
            athletes: "Спортсмены",
            coaches: "Тренеры",
            tariffs: "Тарифы",
            roles: "Роли",
            remove: "Удалить",
        },
        filters: {
            all: "Все",
            search: "Поиск",
            coach: "Тренер",
            noCoach: "Без тренера",
            role: "Роль",
            noRole: 'Без роли'
        },
        cols: {
            username: "Член клуба",
            roles: "Роль",
            coaches: "Тренер",
            tariff: "Тариф",
            athletes: "Спортсмены",
            city: "Город",
            ageGroup: "Возрастная группа",
        },
        editTariffs: {
            confirm: {
                title: "Изменить тарифы",
                text: {
                    addOne: "Подключить тариф {{tariffCodes}} за счет клуба? Начисления по тарифу будут включены в счет клуба начиная с сегодняшнего дня",
                    removeOne: "Отключить тариф {{tariffCodes}}, ранее подключенный за счет клуба? Изменения вступят в силу с завтрашнего дня.",
                    addMany: "Подключить тарифы {{tariffCodes}} за счет клуба? Начисления по тарифам будут включены в счет клуба начиная с сегодняшнего дня.",
                    removeMany: "Отключить тарифы {{tariffCodes}}, ранее подключенные за счёт клуба? Изменения вступят в силу с завтрашнего дня.",
                    addAndRemove: "Внести изменения в тарифы? Подключить за счёт клуба тарифы: {{addTariffCodes}}, отключить подключенные за счёт клуба тарифы: {{removeTariffCodes}}",
                },
                confirm: "Да",
                cancel: "Нет",
            },
        },
        editRoles: {
            confirm: {
                title: "Изменить роли",
                text: {
                    addOne: {
                        ClubAthletes: 'Подключить роль "Спортсмен" члену клуба?' +
                        'Количество спортсменов клуба влияет на размер начислений по тарифному плану "Клуб"',
                        ClubCoaches: 'Подключить роль "Тренер" члену клуба?' +
                        'При отсутствии у выбранных членов клуба тарифного плана "Тренер", тариф будет подключен за счет клуба с сегодняшнего дня.',
                        ClubManagement: 'Подключить роль "Администратор"? Роль может быть подключена только тренерам клуба',
                    },
                    addMany: "Добавить роли {{roles}} выбранным членам клуба? " +
                    'Количество спортсменов и тренеров клуба влияет на размер начислений по тарифному плану "Клуб"',
                    removeOne: {
                        ClubAthletes: 'Отключить роль "Спортсмен"? Будет удалена связь с тренерами клуба и отключен доступ клуба к дневнику тренировок. ' +
                        "Сумма ежедневных начислений за спортсменов клуба будет пересчитана с завтрашнего дня",
                        ClubCoaches: 'Отключить роль "Тренер"? Будет также отключен тариф "Тренер", подключенный за счет клуба',
                        ClubManagement: 'Отключить роль "Администратор"?',
                    },
                    removeMany: 'Отключить роли {{roles}} выбранным членам клуба? Сумма ежедневных начислений по тарифному плану "Клуб" будет пересчитана с завтрашнего дня',
                    addAndRemove: 'Изменить роли в клубе? Подключить роли: {{addRoles}}, отключить роли: {{removeRoles}}.',
                },
                confirm: "Да",
                cancel: "Нет",
            },
        },
        bottomSheet: {
            athletes: "Спортсмены",
            coaches: "Тренеры",
            tariffs: "Тарифы",
            roles: "Роли",
            remove: "Удалить",
        }
    },
    en: {
        fullTitle: "Club management",
        shortTitle: "Club",
        byClub: "Cl",
        Premium: "Premium",
        Coach: "Coach",
        Club: "Club",
        role: "Role",
        roles: "Roles",
        selected: "You've selected {{count}} club members",
        myAthletes: 'My athletes',
        clubRoles: {
            ClubCoaches: "Coaches",
            ClubAthletes: "Athletes",
            ClubManagement: "Admins",
        },
        toolbar: {
            athletes: "Athletes",
            coaches: "Coaches",
            tariffs: "Tariffs",
            roles: "Roles",
            remove: "Remove",
        },
        filters: {
            all: "All",
            search: "Search",
            coach: "Coach",
            noCoach: "Without coach",
            role: "Role",
            noRole: 'Without role'
        },
        cols: {
            username: "Club member",
            roles: "Role",
            coaches: "Coach",
            tariff: "Tariff",
            athletes: "Athletes",
            city: "City",
            ageGroup: "Age group",
        },
        editTariffs: {
            confirm: {
                title: "Change tariffs",
                text: {
                    addOne: "Enable tariff {{tariffCodes}} paid by club? The cost will be accrued daily and include in club invoice from today.",
                    removeOne: "Disable tariff {{tariffCodes}} previously enables by club? Club will stop paying for this tariff from tomorrow",
                    addMany: "Enable tariffs {{tariffCodes}} paid by club? The cost will be accrued daily and include in club invoice from today.",
                    removeMany: "Disable tariffs  {{tariffCodes}}, previously added by club? Club will stop paying for these tariffs from tomorrow",
                    addAndRemove: "Change tariffs paid by club? Enable tariffs: {{addTariffCodes}}, disable tariffs: {{removeTariffCodes}}",
                },
                confirm: "Confirm",
                cancel: "Cancel",
            },
        },
        editRoles: {
            confirm: {
                title: "Change roles",
                text: {
                    addOne: {
                        ClubAthletes: 'Add role "Club athlete"? ' +
                        'Club invoice daily accruals amount may be increased according to Club tariff terms of subscription',
                        ClubCoaches: 'Add role "Club coach"? ' +
                        'Coach tariff required. If selected club members do not have their own Coach tariff, the tariff will be enabled by club from today',
                        ClubManagement: 'Add role "Club administrator"? The role could be added only for club coaches',
                    },
                    addMany: "Add roles {{roles}} to selected club members? " +
                    'Club invoice daily accruals amount could be increased according to Club tariff terms of subscription',
                    removeOne: {
                        ClubAthletes: 'Remove role "Club Athlete"? The connections to the club coaches will be removed' +
                        "Club invoice daily accruals amount will be recalculated from tomorrow. ",
                        ClubCoaches: 'Remove role "Club coach"? Coach tariff, enabled by club, will also be removed.',
                        ClubManagement: 'Remove role "Club administrator"?',
                    },
                    removeMany: 'Remove roles {{roles}} to selected club members? Club invoice daily accruals amount will be recalculated from tomorrow.',
                    addAndRemove: 'Change club roles for selected club members? Add roles: {{addRoles}}, remove roles: {{removeRoles}}.',
                },
                confirm: "Confirm",
                cancel: "Cancel",
            },
        },
        bottomSheet: {
            athletes: "Athletes",
            coaches: "Coaches",
            tariffs: "Tariffs",
            roles: "Roles",
            remove: "Remove"
        }
    },
};
