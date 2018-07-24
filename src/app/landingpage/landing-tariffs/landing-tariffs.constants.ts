interface TariffCurrencyByCountry {
    RUB: string[];
    USD: string[];
    EUR: string[];
}

export interface LandingTariffsSettings {
    currency: TariffCurrencyByCountry;
    defaultCurrency: string; // если код страны не содержится ни в одном справочнике выше
    currencyNumber: any;
}

export const landingTariffsConfig: LandingTariffsSettings = {
    currency: {
        RUB: ["BY",  //Белоруссия
            "KG",  //Киргизия
            "KZ",  //Казахстан
            "RU",  //Россия
            "TJ"  //Таджикистан
            ],
        USD: [],
        EUR: [
            "AD",  //Андорра
            "AT",  //Австрия
            "BA",  //Босния и Герцеговина
            "BE",  //Бельгия
            "BG",  //Болгария
            "CV",  //Кабо-Верде
            "CY",  //Кипр
            "CZ",  //Чехия
            "DE",  //Германия
            "DK",  //Дания
            "EE",  //Эстония
            "ES",  //Испания
            "FI",  //Финляндия
            "FR",  //Франция
            "GR",  //Греция
            "HR",  //Хорватия
            "HU",  //Венгрия
            "IE",  //Ирландия
            "IT",  //Италия
            "LT",  //Литва
            "LU",  //Люксембург
            "LV",  //Латвия
            "MA",  //Марокко
            "MC",  //Монако
            "ME",  //Черногория
            "MT",  //Мальта
            "NL",  //Нидерланды
            "PL",  //Польша
            "PM",  //Сен-Пьер и Микелон
            "PT",  //Португалия
            "RO",  //Румыния
            "SE",  //Швеция
            "SI",  //Словения
            "SK",  //Словакия
            "SM",  //Сан-Марино
            "VA",  //Ватикан
            "YT",  //Майотта
        ],
    },
    defaultCurrency: 'USD',
    currencyNumber: {
        RUB: 2,
        EUR: 2,
        USD: 2,
    }
};

export const landingTariffsData = [
    {
        name: "basic",
        description: "basic",
        color: "#e91e63",
        functions: [
            "func1", "func2", "func3", "func4", "func5",
        ],
        buttonText: "connect",
        connectText: "connectFree",
        fee: {
            subscription: {
                RUB: {
                    month: 0,
                    year: 0,
                },
                USD: {
                    month: 0,
                    year: 0,
                },
                EUR: {
                    month: 0,
                    year: 0,
                },

            },
            variable: null,
        },
        signup: {
            activatePremiumTrial: false,
            activateCoachTrial: false,
            activateClubTrial: false,
        },
    },
    {
        name: "premium",
        description: "premium",
        color: "#2196f3",
        functions: [
            "func6", "func7", "func8", "func9", "func10",
        ],
        buttonText: "connectTrialBtn",
        connectText: "connectTrial",
        fee: {
            subscription: {
                RUB: {
                    month: 300,
                    year: 250,
                },
                USD: {
                    month: 6,
                    year: 5,
                },
                EUR: {
                    month: 5,
                    year: 4.2,
                }
            },
            variable: null,
        },
        signup: {
            activatePremiumTrial: true,
            activateCoachTrial: false,
            activateClubTrial: false,
        },
    },
    {
        name: "coach",
        description: "coach",
        color: "#009688",
        functions: [
            "func11", "func12", "func13", "func14", "func15", "func16", "func17",
        ],
        buttonText: "connectTrialBtn",
        connectText: "connectTrial",
        fee: {
            subscription: {
                RUB: {
                    month: 300,
                    year: 250,
                },
                USD: {
                    month: 6,
                    year: 5,
                },
                EUR: {
                    month: 5,
                    year: 4.2,
                }
            },
            variable: {
                RUB: {
                    rules: ["coachAthletes"],
                    coachAthletes: {
                        minAthletes: 1,
                        maxAthletes: 10,
                        athlete: 210,
                        premium: 210,
                        currency: 'RUB',
                        number: 0,
                    },
                },
                USD: {
                    rules: ["coachAthletes"],
                    coachAthletes: {
                        minAthletes: 1,
                        maxAthletes: 10,
                        athlete: 3.9,
                        premium: 3.9,
                        currency: 'USD',
                        number: 2,
                    },
                },
                EUR: {
                    rules: ["coachAthletes"],
                    coachAthletes: {
                        minAthletes: 1,
                        maxAthletes: 10,
                        athlete: 3.45,
                        premium: 3.45,
                        currency: 'EUR',
                        number: 2,
                    },
                },
            },
        },
        signup: {
            activatePremiumTrial: false,
            activateCoachTrial: true,
            activateClubTrial: false,
        },
    },
    {
        name: "club",
        description: "club",
        color: "#9c27b0",
        functions: [
            "func18", "func19", "func20", "func21", "func22", "func23", "func24",
        ],
        buttonText: "connectTrialBtn",
        connectText: "connectTrial",
        fee: {
            subscription: {
                RUB: {
                    month: 300,
                    year: 250,
                },
                USD: {
                    month: 6,
                    year: 5,
                },
                EUR: {
                    month: 5,
                    year: 4.2,
                },
            },
            variable: {
                RUB: {
                    rules: ["clubAthletes", "clubCoaches"],
                    clubAthletes: {
                        minAthletes: 1,
                        maxAthletes: 10,
                        athlete: 210,
                        premium: 210,
                        currency: 'RUB',
                        number: 0,
                    },
                    clubCoaches: {
                        minCoaches: 1,
                        coach: 300,
                        currency: 'RUB',
                        number: 0,
                    },
                },
                USD: {
                    rules: ["clubAthletes", "clubCoaches"],
                    clubAthletes: {
                        minAthletes: 1,
                        maxAthletes: 10,
                        athlete: 3.9,
                        premium: 3.9,
                        currency: 'USD',
                        number: 2,
                    },
                    clubCoaches: {
                        minCoaches: 1,
                        coach: 6,
                        currency: 'USD',
                        number: 2,
                    },
                },
                EUR: {
                    rules: ["clubAthletes", "clubCoaches"],
                    clubAthletes: {
                        minAthletes: 1,
                        maxAthletes: 10,
                        athlete: 3.9,
                        premium: 3.9,
                        currency: 'EUR',
                        number: 2,
                    },
                    clubCoaches: {
                        minCoaches: 1,
                        coach: 5,
                        currency: 'EUR',
                        number: 2,
                    },
                },
            },
        },
        signup: {
            activatePremiumTrial: false,
            activateCoachTrial: false,
            activateClubTrial: true,
        },
    },
];
