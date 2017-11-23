export const _translate = {
    ru: {
        fullTitle: 'Управление клубом',
        shortTitle: 'Клуб',
        byClub: 'К',
        Premium: 'Премиум',
        Coach: 'Тренер',
        Club: 'Клуб',
        role: 'Роль',
        roles: 'Роли',
        clubRoles: {
            ClubCoaches: 'Тренеры',
            ClubAthletes: 'Спортсмены',
            ClubManagement: 'Менеджмент',
        },
        toolbar: {
            athletes: 'Спортсмены',
            coaches: 'Тренеры',
            tariffs: 'Тарифы',
            roles: 'Роли',
            remove: 'Удалить',
        },
        filters: {
            all: 'Все',
            search: 'Поиск',
            coach: 'Тренер',
            noCoach: 'Без тренера',
            role: 'Роль',
        },
        cols: {
            username: 'Член клуба',
            roles: 'Роль',
            coaches: 'Тренер',
            tariff: 'Тариф',
            athletes: 'Спортсмены',
            city: 'Город',
            ageGroup: 'Возрастная группа',
        },
        editTariffs: {
            confirm: {
                title: 'Изменить тарифы',
                text: {
                    addOne: 'Подключить тариф {{tariffCodes}} за счет клуба? Начисления по тарифу будут включены в счет клуба начиная с сегодняшнего дня',
                    removeOne: 'Отключить тариф {{tariffCodes}}, ранее подключенный за счет клуба? Изменения вступят в силу с завтрашнего дня.',
                    addMany: 'Подключить тарифы {{tariffCodes}} за счет клуба? Начисления по тарифам будут включены в счет клуба начиная с сегодняшнего дня.',
                    removeMany: 'Отключить тарифы {{tariffCodes}}, ранее подключенные за счёт клуба? Изменения вступят в силу с завтрашнего дня.',
                    addAndRemove: 'Внести изменения в тарифы? Подключить за счёт клуба тарифы: {{addTariffCodes}}, отключить подключенные за счёт клуба тарифы: {{removeTariffCodes}}'
                },
                confirm: 'Да',
                cancel: 'Нет'
            }
        },
        editRoles: {
            confirm: {
                title: 'Изменить роли',
                text: {
                    addOne: {
                        ClubAthletes: 'Подключить роль "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Спортсмен</a>"? ' +
                        'Сумма ежедневных начислений в счете клуба может быть увеличена в соответствии с условиями <a href="https://help.staminity.com/ru/tariffs/club.html" target="_blank" >тарифного плана "Клуб"</a>',
                        ClubCoaches: 'Подключить роль "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Тренер</a>"? ' +
                        'При отсутствии у выбранных членов клуба тарифного плана "Тренер", он будет подключен за счет клуба с сегодняшнего дня.',
                        ClubManagement: 'Подключить роль "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Администратор</a>"?'
                    },
                    addMany: 'Добавить роли {{roles}} выбранным членам клуба? ' +
                    'Сумма ежедневных начислений в счете клуба может быть увеличена в соответствии с условиями <a href="https://help.staminity.com/ru/tariffs/club.html" target="_blank" >тарифного плана "Клуб"</a>',
                    removeOne: {
                        ClubAthletes: 'Отключить роль "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Спортсмен</a>"? Будет удалена связь с тренерами клуба и отключен доступ клуба к дневнику тренировок. ' +
                        'Сумма ежедневных начислений за спортсменов клуба будет пересчитана с завтрашнего дня',
                        ClubCoaches: 'Отключить роль "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Тренер</a>"? Будет также отключен тариф "Тренер", подключенный за счет клуба',
                        ClubManagement: 'Отключить роль "<a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >Администратор</a>"?'
                    },
                    removeMany: 'Отключить роли {{roles}} выбранным членам клуба? Сумма ежедневных начислений по тарифному плану "Клуб" будет пересчитана с завтрашнего дня',
                    addAndRemove: 'Изменить <a href="https://help.staminity.com/ru/clubs/club-roles.html#clubroles" target="_blank" >роли в клубе</a>? Подключить роли: {{addRoles}}, отключить роли: {{removeRoles}}.'
                },
                confirm: 'Да',
                cancel: 'Нет'
            }
        }
    },
    en: {
    }
};