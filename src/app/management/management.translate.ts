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
                        ClubAthletes: 'Подключить роль "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Спортсмен</a>"? ' +
                        'Сумма ежедневных начислений в счете клуба может быть увеличена в соответствии с условиями <a href="https://help.staminity.com/ru/tariffs/club.html" target="_blank" >тарифного плана "Клуб"</a>',
                        ClubCoaches: 'Подключить роль "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Тренер</a>"? ' +
                        'При отсутствии у выбранных членов клуба тарифного плана "Тренер", он будет подключен за счет клуба с сегодняшнего дня.',
                        ClubManagement: 'Подключить роль "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Администратор</a>"?',
                    },
                    addMany: "Добавить роли {{roles}} выбранным членам клуба? " +
                    'Сумма ежедневных начислений в счете клуба может быть увеличена в соответствии с условиями <a href="https://help.staminity.com/ru/tariffs/club.html" target="_blank" >тарифного плана "Клуб"</a>',
                    removeOne: {
                        ClubAthletes: 'Отключить роль "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Спортсмен</a>"? Будет удалена связь с тренерами клуба и отключен доступ клуба к дневнику тренировок. ' +
                        "Сумма ежедневных начислений за спортсменов клуба будет пересчитана с завтрашнего дня",
                        ClubCoaches: 'Отключить роль "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Тренер</a>"? Будет также отключен тариф "Тренер", подключенный за счет клуба',
                        ClubManagement: 'Отключить роль "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Администратор</a>"?',
                    },
                    removeMany: 'Отключить роли {{roles}} выбранным членам клуба? Сумма ежедневных начислений по тарифному плану "Клуб" будет пересчитана с завтрашнего дня',
                    addAndRemove: 'Изменить <a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >роли в клубе</a>? Подключить роли: {{addRoles}}, отключить роли: {{removeRoles}}.',
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
                    addOne: "Add tariff {{tariffCodes}} by club? The cost will be accrued daily and include in club bill from today.",
                    removeOne: "Remove tariff {{tariffCodes}} previously added by club? Club will stop paying for this tariff from tomorrow",
                    addMany: "Add tariffs {{tariffCodes}} by club? The cost will be accrued daily and include in club bill from today.",
                    removeMany: "Remove tariffs  {{tariffCodes}}, previously added by club? Club will stop paying for these tariffs from tomorrow",
                    addAndRemove: "Add and remove tariffs paid by club? Add tariffs: {{addTariffCodes}}, remove tariffs: {{removeTariffCodes}}",
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
                        ClubAthletes: 'Add role "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Athlete</a>"? ' +
                        'Club bill daily accruals amount could be increased according to <a href="https://help.staminity.com/ru/tariffs/club.html" target="_blank" >Club tariff</a> conditions',
                        ClubCoaches: 'Add role "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Club coach</a>"? ' +
                        'Coach tariff required. If selected club members do not have their own Coach tariff, the tariff will be added by club from today',
                        ClubManagement: 'Add role "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Club admin</a>"?',
                    },
                    addMany: "Add roles {{roles}} to selected club members? " +
                    'Club bill daily accruals amount could be increased according to <a href="https://help.staminity.com/ru/tariffs/club.html" target="_blank" >Club tariff</a> conditions',
                    removeOne: {
                        ClubAthletes: 'Remove role "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Athlete</a>"? The link with club coaches will be lost' +
                        "Club bill daily accruals amount will be recalculated from tomorrow. ",
                        ClubCoaches: 'Remove role "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Club coach</a>"? Coach tariff, added by club, will also be removed.',
                        ClubManagement: 'Remove role "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Club admin</a>"?',
                    },
                    removeMany: 'Remove roles {{roles}} to selected club members? Club bill daily accruals amount will be recalculated from tomorrow.',
                    addAndRemove: 'Change club<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >roles</a>? Add roles: {{addRoles}}, remove roles: {{removeRoles}}.',
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
