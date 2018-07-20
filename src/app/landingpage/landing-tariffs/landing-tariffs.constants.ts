interface TariffCurrencyByCountry {
    RUB: string[];
    USD: string[];
    EUR: string[];
    defaultCurrency: string; // если код страны не содержится ни в одном справочнике выше
}

export interface LandingTariffsSettings {
    currency: TariffCurrencyByCountry;
}

export const landingTariffsConfig: LandingTariffsSettings = {
    currency: {
        RUB: [],
        USD: [],
        EUR: [],
        defaultCurrency: 'RUB'
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
                ru: {
                    month: 0,
                    year: 0,
                },
                en: {
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
                ru: {
                    month: 300,
                    year: 250,
                },
                en: {
                    month: 6,
                    year: 5,
                },
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
                ru: {
                    month: 300,
                    year: 250,
                },
                en: {
                    month: 6,
                    year: 5,
                },
            },
            variable: {
                ru: {
                    rules: ["coachAthletes"],
                    coachAthletes: {
                        minAthletes: 1,
                        maxAthletes: 10,
                        athlete: 210,
                        premium: 210,
                    },
                },
                en: {
                    rules: ["coachAthletes"],
                    coachAthletes: {
                        minAthletes: 1,
                        maxAthletes: 10,
                        athlete: 4,
                        premium: 4,
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
                ru: {
                    month: 300,
                    year: 250,
                },
                en: {
                    month: 6,
                    year: 5,
                },
            },
            variable: {
                ru: {
                    rules: ["clubAthletes", "clubCoaches"],
                    clubAthletes: {
                        minAthletes: 1,
                        maxAthletes: 10,
                        athlete: 210,
                        premium: 210,
                    },
                    clubCoaches: {
                        minCoaches: 1,
                        coach: 300,
                    },
                },
                en: {
                    rules: ["clubAthletes", "clubCoaches"],
                    clubAthletes: {
                        minAthletes: 1,
                        maxAthletes: 10,
                        athlete: 4,
                        premium: 4,
                    },
                    clubCoaches: {
                        minCoaches: 1,
                        coach: 6,
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
