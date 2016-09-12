function mockBackend($log, $httpBackend){
    var authorized = false;
    var message = {};
    var requestData = {};
    var response = {
        requestId: null,
        data: []
    };

    function initResponse() {
        response = {
            requestId: null,
            data: []
        };
    }

    $httpBackend.whenPOST('/signup').respond(function(method, url, data) {
        authorized = false;
        $log.debug('HTTP BACKEND => signup: method - ', method, ' url - ', url, ' data -', JSON.parse(data));
        requestData = JSON.parse(data);
        message = {
            type: "systemMessage",
            value: {
                status: "success",
                title: "Поздравляем, "+ requestData.requestData.firstName + '!',
                text: "Ваши данные успешно приняты",
                delay: 5
            }
        };
        initResponse();
        response.data.push(message);
        return [200, response];
    });
    $httpBackend.whenPOST('/confirm').respond(function(method, url, data) {
        authorized = false;
        $log.debug('HTTP BACKEND => confirm: method - ', method, ' url - ', url, ' data -', JSON.parse(data));
        // JSON.parse(data));
        requestData = JSON.parse(data)
        message = {
            type: "systemMessage",
            value: {
                status: "success",
                title: "Поздравляем, "+ requestData.requestData.firstName + '!',
                text: "Ваша учетная запись активиована, для начала работы укажите свой лоин и пароль",
                delay: 5
            }
        };
        initResponse();
        response.data.push(message);
        return [200, response];
    });
    $httpBackend.whenPOST('/signin').respond(function(method, url, data) {
        authorized = true;
        $log.debug('HTTP BACKEND => signin: method - ', method, ' url - ', url, ' data -', JSON.parse(data));

        message = {
            type: "authToken",
            value: {
                userId: 4,
                token: 'jhsdlfjkahsldjkfhasldkjfhasljkdfh'
            }
        };

        response.data.push(message);

        message = {
            type: "userProfile",
            value: {
                userId: 4,
                revision: 1,
                public: {
                    firstName: 'Evgeniy',
                    lastName: 'Khabarov'
                },
                personal: {
                    sex: 'M',
                    birthday: new Date(),
                    country: 'Russia',
                    city: 'Moscow',
                    about: 'Занимаюсь триатлоном с 2014 года ...',
                    activity: ['run', 'swim', 'bike', 'triathlon'],
                    email: 'chernykh@me.com',
                },
                private: {
                    weight: 74,
                    height: 183,
                    level: 10,
                    extEmail: 'chernykh.home@gmail.com',
                    phone: '+79251154116'
                },
                display: {
                    language: "ru",
                    timezone: -12.0,
                    calendar: 'gregorian',
                    firstDayOfWeek: 7
                },
                trainingZones: [
                    {
                        type: "heartRate",
                        activity: [
                            {
                                name: "default",
                                unit: "bpm",
                                zones: [
                                    {
                                        code: "recovery",
                                        valueTo: 140,
                                        validFrom: 0,
                                        valueFrom: 0
                                    },
                                    {
                                        code: "endurance",
                                        valueTo: 160,
                                        validFrom: 0,
                                        valueFrom: 141
                                    },
                                    {
                                        code: "tempo",
                                        valueTo: 171,
                                        validFrom: 0,
                                        valueFrom: 161
                                    },
                                    {
                                        code: "maximum",
                                        valueTo: 1000,
                                        validFrom: 0,
                                        valueFrom: 172
                                    }
                                ],
                                thresholds: [
                                    {
                                        code: "HRmin",
                                        value: 56,
                                        validFrom: 0
                                    },
                                    {
                                        code: "FTHR",
                                        value: 192,
                                        validFrom: 0
                                    },
                                    {
                                        code: "HRmax",
                                        value: 210,
                                        validFrom: 0
                                    }
                                ]
                            },
                            {
                                name: "running",
                                unit: "bpm",
                                zones: [
                                    {
                                        code: "recovery",
                                        valueTo: 138,
                                        validFrom: 0,
                                        valueFrom: 0
                                    },
                                    {
                                        code: "endurance",
                                        valueTo: 152,
                                        validFrom: 0,
                                        valueFrom: 138
                                    },
                                    {
                                        code: "tempo",
                                        valueTo: 173,
                                        validFrom: 0,
                                        valueFrom: 153
                                    },
                                    {
                                        code: "maximum",
                                        valueTo: 1000,
                                        validFrom: 0,
                                        valueFrom: 173
                                    }
                                ],
                                thresholds: [
                                    {
                                        code: "АЭП",
                                        value: 150,
                                        validFrom: 0
                                    },
                                    {
                                        code: "АНПg",
                                        value: 179,
                                        validFrom: 0
                                    }
                                ]
                            }

                        ]
                    },
                    {
                        type: "paceSpeed",
                        activity: [
                            {
                                name: "default",
                                unit: "min/km",
                                zones: [
                                    {
                                        code: "recovery",
                                        valueTo: 6,
                                        validFrom: 0,
                                        valueFrom: 10
                                    },
                                    {
                                        code: "endurance",
                                        valueTo: 5,
                                        validFrom: 0,
                                        valueFrom: 5.590000152587891
                                    },
                                    {
                                        code: "tempo",
                                        valueTo: 4,
                                        validFrom: 0,
                                        valueFrom: 4.590000152587891
                                    },
                                    {
                                        code: "maximum",
                                        valueTo: 0,
                                        validFrom: 0,
                                        valueFrom: 3.5899999141693115
                                    }
                                ]
                            },
                            {
                                name: "running",
                                unit: "min/km",
                                zones: [
                                    {
                                        code: "recovery",
                                        valueTo: 4.300000190734863,
                                        validFrom: 0,
                                        valueFrom: 10
                                    },
                                    {
                                        code: "endurance",
                                        valueTo: 4,
                                        validFrom: 0,
                                        valueFrom: 4.289999961853027
                                    },
                                    {
                                        code: "tempo",
                                        valueTo: 3.200000047683716,
                                        validFrom: 0,
                                        valueFrom: 3.5899999141693115
                                    },
                                    {
                                        code: "maximum",
                                        valueTo: 0,
                                        validFrom: 0,
                                        valueFrom: 3.200000047683716
                                    }
                                ]
                            }

                        ]
                    },
                    {
                        type: "power",
                        activity: [
                            {
                                name: "default",
                                unit: "watt",
                                zones: [
                                    {
                                        code: "recovery",
                                        valueTo: 140,
                                        validFrom: 0,
                                        valueFrom: 0
                                    },
                                    {
                                        code: "endurance",
                                        valueTo: 160,
                                        validFrom: 0,
                                        valueFrom: 141
                                    },
                                    {
                                        code: "tempo",
                                        valueTo: 171,
                                        validFrom: 0,
                                        valueFrom: 161
                                    },
                                    {
                                        code: "maximum",
                                        valueTo: 1000,
                                        validFrom: 0,
                                        valueFrom: 172
                                    }
                                ],
                                thresholds: [
                                    {
                                        code: "FTPpower",
                                        value: 235,
                                        validFrom: 0
                                    }
                                ]
                            }
                        ]
                    }
                ],
                externalService: [],
                privacy: [
                    // Профиль: персональная информация
                    {
                        name: "personalInfo",
                        setup: 10		// все = 10, подписчики = 20, группы = 30, тренер = 40, я = 100
                    },
                    // Профиль: сводная статистика по тренировкам
                    {
                        name: "personalSummary",
                        setup: 20
                    },
                    // Тренировка: сводная информация
                    {
                        name: "activitySummary",
                        setup: 30
                    },
                    // Тренировка: детальная фактическая информация
                    {
                        name: "activityActualDetails",
                        setup: 40
                    },
                    // Тренировка: план и сравнение план/факт
                    {
                        name: "activityPlanDetails",
                        setup: 50
                    }
                ],
                subscriptions: [
                    {
                        code: 'user'
                    },
                    {
                        code: 'proUser'
                    }
                ],
                notifications: [
                    {
                        group: 'Группа 1',
                        events: [
                            {
                                name: 'completedInitialProviderSync',
                                delivery: ['W','P']
                            },
                            {
                                name: 'Событие 1',
                                delivery: ['P','E']
                            },
                            {
                                name: 'Событие 2',
                                delivery: ['E']
                            }
                        ]
                    },
                    {
                        group: 'Группа 2',
                        events: [
                            {
                                name: 'Событие 3',
                                delivery: ['W','P','E']
                            },
                            {
                                name: 'Событие 4',
                                delivery: ['W','P','E']
                            }
                        ]
                    }
                ]
            }
        };
        response.data.push(message);

        message = {
            type: "userGroup",
            value: {
                1 : {
                    userGroupId: 1,
                    revision: 1,
                    code: "Triathletes",
                    members: [
                        {
                            userId: 1,
                            revision: 1,
                            public: {
                                firstName: "Denis",
                                lastName: "Ivanov"
                            },
                            personal: {
                                country: "Russia",
                                city: "Moscow",
                                about: ""
                            }
                        },
                        {
                            userId: 2,
                            revision: 1,
                            public: {
                                firstName: "Alexander",
                                lastName: "Chernykh"
                            },
                            personal: {
                                country: "Russia",
                                city: "Moscow",
                                about: ""
                            }
                        }
                    ]

                },
                2 : {
                    userGroupId: 2,
                    revision: 1,
                    code: "Runners",
                    members: [
                        {
                            userId: 3,
                            revision: 1,
                            public: {
                                firstName: "Evgeniy",
                                lastName: "Zhakharinskiy"
                            },
                            personal: {
                                country: "Russia",
                                city: "Moscow",
                                about: ""
                            }
                        }
                    ]
                }
            }
        }
        response.data.push(message);


        return [200, response];
    });
    $httpBackend.whenPOST('/signout').respond(function(method, url, data) {
        authorized = false;
        //console.log('HTTP BACKEND => /signout: method - ', method, ' url - ', url, ' data -', JSON.parse(data));
        initResponse();
        //response.data.push(signupSuccess);
        return [200, response];
    });
    $httpBackend.whenPOST('/welcome').respond(function(method, url, data) {
        //console.log('http backend /welcome: ', authorized);
        return [200,'I have received and processed your data [' + data + '].'];
    });
    $httpBackend.whenPOST('/admin').respond(function(method, url, data) {
        //console.log('http backend /admin: ', authorized);
        return authorized ? [200,'This is confidential [' + data + '].'] : [401];
    });
    $httpBackend.whenGET('/admin').respond(function(method, url, data) {
        //console.log('http backend /admin: ', authorized);
        return authorized ? [200,'This is confidential [' + data + '].'] : [401];
    });
    // для всего остального
    $httpBackend.whenGET(/^\/assets\//).passThrough();
    $httpBackend.whenGET(/.*/).passThrough();
}

function MockRun($log, $httpBackend){
    'ngInject';
    $log.debug('StaminityMock: MockRun');
    mockBackend($log, $httpBackend);
}

let mockModule = angular.module('staminity.mock',['ngMockE2E']);
    mockModule.run(MockRun);

export default mockModule