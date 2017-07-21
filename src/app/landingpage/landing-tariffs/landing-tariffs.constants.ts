export const landingTariffsData = [
    {
        name: 'basic',
        description: 'basic',
        color: '#e91e63',
        functions: [
            'func1', 'func2', 'func3'
        ],
        buttonText: 'connect',
        connectText: 'connectFree',
        fee: {
            subscription: {
                ru: {
                    month: 0,
                    year: 0
                }
            }
        }
    },
    {
        name: 'premium',
        description: 'premium',
        color: '#2196f3',
        functions: [
            'func4', 'func5', 'func6'
        ],
        buttonText: 'connect',
        connectText: 'connectTrial',
        fee: {
            subscription: {
                ru: {
                    month: 300,
                    year: 300 * 0.9
                }
            }
        }
    },
    {
        name: 'coach',
        description: 'coach',
        color: '#009688',
        functions: [
            'func7', 'func8', 'func9'
        ],
        buttonText: 'connect',
        connectText: 'connectTrial',
        fee: {
            subscription: {
                ru: {
                    month: 300,
                    year: 300 * 0.9
                }
            },
            variable: {
                ru: {
                    athlete: 210
                }
            }
        }
    },
    {
        name: 'club',
        description: 'club',
        color: '#9c27b0',
        functions: [
            'func10', 'func11', 'func12'
        ],
        buttonText: 'connect',
        connectText: 'connectTrial',
        fee: {
            subscription: {
                ru: {
                    month: 300,
                    year: 300 * 0.9
                }
            },
            variable: {
                ru: {
                    athlete: 210,
                    coach: 300
                }
            }
        }
    }
];