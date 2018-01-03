export const translateAthletes = {
    ru: {
        fullTitle: "Управление спортсменами",
        shortTitle: "Спортсмены",
        filters: {
            all: "Все",
            search: "Поиск: '{{search}}'",
        },
        columns: {
            username: "Cпортсмен",
            club: "Клуб",
            tariff: "Тариф",
            city: "Город",
            ageGroup: "Возрастная группа",
        },
        buttons: {
            tariffs: "Тарифы",
            remove: "Удалить",
        },
        selected: "Выбрано {{count}} спортсменов",
        tariffs: {
            Coach: "Тренер",
            Premium: "Премиум",
            Club: "Клуб"
        },
        byCoach: "Т",
        editTariffs: {
            confirm: {
                title: "Изменить тарифы",
                text: {
                    addOne: "Вы хотите подключить тариф {{tariffCode}} выбранным спортсменам? Начисления по тарифу будут ежедневно включаться в ваш счет",
                    removeOne: "Вы хотите отключить тариф {{tariffCode}}, ранее подключенный выбранным спортсменам за ваш счет?",
                },
                confirm: "Да",
                cancel: "Нет",
            },
        },
        bottomSheet: {
            tariffs: "Тарифы",
            remove: "Удалить",
        }
    },
    en: {
        fullTitle: "Athletes management",
        shortTitle: "Athletes",
        filters: {
            all: "All",
            search: "Search: '{{search}}'",
        },
        columns: {
            username: "Athlete",
            club: "Club",
            tariff: "Tariff",
            city: "City",
            ageGroup: "Age group",
        },
        buttons: {
            tariffs: "Tariffs",
            remove: "Remove",
        },
        selected: "Choose {{count}} athlete(s)",
        tariffs: {
            Coach: "Coach",
            Premium: "Premium",
            Club: "Club"
        },
        byCoach: "Coach",
        editTariffs: {
            confirm: {
                title: "Change tariffs",
                text: {
                    addOne: "Do you want to add {{tariffCode}} tariff to selected athletes? Tariff rate will be added to your bill on daily basis.",
                    removeOne: "You want to switch off {{tariffCode}} tariff from your athletes?",
                },
                confirm: "Confirm",
                cancel: "Cancel",
            },
        },
        bottomSheet: {
            tariffs: "Tariffs",
            remove: "Remove",
        }
    }
};
