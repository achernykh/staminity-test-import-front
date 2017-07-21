export const landingTariffsData = [
    {
        name: 'basic',
        description: 'basic',
        color: '#e91e63',
        functions: [
            'func1', 'func2', 'func3'
        ],
        buttonText: 'connect',
        connectText: 'noCreditCard',
        fee: {
            subscription: {
                ru: {
                    month: 300
                }
            },
            variable: {

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
        connectText: '14day',
        fee: {
            subscription: {
                ru: {
                    month: 300
                }
            },
            variable: {

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
        connectText: '14day',
        fee: {
            subscription: {
                ru: {
                    month: 300
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
        connectText: '14day',
        fee: {
            subscription: {
                ru: {
                    month: 300
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