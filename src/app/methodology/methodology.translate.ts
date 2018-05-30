export const translateMethodology = {
    ru: {
        title: 'Методология',
        fullTitle: 'Методология тренировочного процесса',
        shortTitle: 'Методология',

        trainingPlans: {
            title: 'Тренировочные планы'
        },
        categories: {
            title: 'Категории'
        },
        templates: {
            title: 'Шаблоны'
        },
        accessLock: {
            trainingPlans: "Создание тренировочных планов доступно тренерам с заполненным профилем. Для заполнения необходимых полей перейдите в раздел Настройки. Узнать подробнее <a href='https://help.staminity.com/ru/coaches/coach-profile.html'>в справочной системе</a>",
            periodization: 'Управление схемами периодизации и планирование тренировочного сезона доступно на тарифных планах "Премиум" или "Тренер"',
            categories: 'Управление категориями тренировок доступно на тарифных планах "Премиум" и "Тренер"',
            templates: 'Управление шаблонами тренировок доступно на тарифных планах "Премиум" и "Тренер"'
        },
        // периодизация
        periodization: {
            title: 'Схемы периодизации',
            edit: "Изменить",
            delete: "Удалить",
            emptySchemeList: "Добавьте мезоциклы",
            postScheme: "Создать новую схему",
            systemSchemes: "Системные схемы",
            userSchemes: "Мои схемы",
            mesocycle: {
                title: "Мезоцикл",
                code: {
                    label: "Название мезоцикла",
                    placeholder: 'Укажите название',
                },
                color: {
                    placeholder: 'Укажите цвет мезоцикла',
                    label: "Цвет",
                    red: "Красный",
                    pink: "Розовый",
                    purple: "Фиолетовый",
                    "deep-purple": "Темно-фиолетовый",
                    indigo: "Темно-синий",
                    blue: "Синий",
                    cyan: "Сине-зеленый",
                    teal: "Темный цвет морской волны",
                    green: "Зеленый",
                    "deep-orange": "Темно-оранжевый",
                    brown: "Коричневый",
                    grey: "Серый"

                },
                description: "Описание",
                descriptionPlaceholder: "Основные цели мезоцикла, объем и интенсивность тренировок и т.п.",
                save: "Сохранить",
                delete: "Удалить мезоцикл",
                edit: "Изменить мезоцикл"
            },
            //создание схемы периодизации
            scheme: {
                title: "Схема периодизации",
                code: {
                    label: "Название схемы"
                },
                description: "Описание схемы",
                descriptionPlaceholder: "Опишите схему...",
                save: "Сохранить",
                delete: "Удалить",
                edit: "Изменить"

            },
            schemes: {
                title: 'Схемы периодизации',
                joeFrielPeriodization: {
                    code: 'Схема Джо Фрила',
                    description: 'Схема периодизации из "Библии триатлета" Джо Фрила. Включает Подготовительный период, Базовый период, Период строительства, Пиковый период, Гоночный период, Переходный период.',
                    mesocycles: {
                        transition: {
                            code: "Переходный",
                            description: "Мезоцикл, в течение которого значительно снижается нагрузка, " +
                            "что позволяет атлету достичь физического и психологического восстановления после тренировок и гонок."
                        },
                        preparation: {
                            code: "Подготовительный",
                            description: "Мезоцикл, в течение которого спортсмен начинает тренировочную подготовку к будущему сезону. " +
                            "Обычно в ходе этого периода проводятся смешанные тренировки и тренировки с низкой нагрузкой."
                        },
                        base: {
                            code: "Базовый",
                            description: "Период, в течение которого создаются предпосылки для выполнения последующей специальной подготовки. " +
                            "Особое внимание уделяется работе с выносливостью, скоростными навыками и силой, созданию новой мышечной ткани. " +
                            "Как правило, в Базовый период выполняется большой объем низкоинтенсивной, но длительной работы."
                        },
                        build: {
                            code: "Строительство",
                            description: "Мезоцикл, в течение которого особое внимание уделяется тренировкам с высокой интенсивностью " +
                            "по выработке мышечной, анаэробной выносливости и мощности, а также происходит поддержка существующего уровня выносливости, " +
                            "силы и скоростных навыков"
                        },
                        peak: {
                            code: "Пиковый",
                            description: "Период тренировочного процесса, в течение которого объем тренировок снижается, а интенсивность пропорционально нарастает," +
                            " что позволяет достичь более высокого уровня физической формы."
                        },
                        race: {
                            code: "Гоночный",
                            description: "Соревновательный период характеризуется снижением нагрузки, что позволяет принять участие в наиболее важных гонках."
                        }
                    }
                },
            }
        }
    },
    en: {
        title: 'Methodology',
        fullTitle: 'Training process methodology',
        shortTitle: 'Methodology',

        trainingPlans: {
            title: 'Training plans'
        },
        categories: {
            title: 'Activity categories'
        },
        templates: {
            title: 'Activity templates'
        },
        accessLock: {
            trainingPlans: "Please fill up your coach profile to create training plans. You could add necessary data in Settings. Find out more in <a href='https://help.staminity.com/ru/coaches/coach-profile.html'>Staminity Help Center</a>",
            periodization: 'Periodization schemes management and Training season plan creation is available only for users with Premium or Coach tariffs enabled. You can enable tariff in Settings',
            categories: 'Activity category management is available only for users with Premium or Coach tariffs enabled. You can enable tariff in Settings',
            templates: 'Activity templates management is available only for users with Premium or Coach tariffs enabled. You can enable tariff in Settings'
        },
        // периодизация
        periodization: {
            title: 'Periodisation schemes',
            edit: "Edit",
            delete: "Delete",
            emptySchemeList: "Add mesocycles in this scheme",
            postScheme: "Create new scheme",
            systemSchemes: "Default schemes",
            userSchemes: "My schemes",
            mesocycle: {
                title: "Mesocycle",
                code: {
                    label: "Mesocycle name",
                    placeholder: 'Set mesocycle name',
                },
                color: {
                    placeholder: 'Set mesocycle color',
                    label: "Color",
                    red: "Red",
                    pink: "Pink",
                    purple: "Purple",
                    "deep-purple": "Deep-purple",
                    indigo: "Indigo",
                    blue: "Blue",
                    cyan: "Cyan",
                    teal: "Teal",
                    green: "Green",
                    "deep-orange": "Deep-orange",
                    brown: "Brown",
                    grey: "Grey"

                },
                description: "Description",
                descriptionPlaceholder: "Mesocycle goals, activity volume and intensity, etc...",
                save: "Save",
                delete: "Delete mesocycle",
                edit: "Edit mesocycle"
            },
            //создание схемы периодизации
            scheme: {
                title: "Periodisation scheme",
                code: {
                    label: "Scheme name"
                },
                description: "Scheme description",
                descriptionPlaceholder: "Describe your scheme...",
                save: "Save",
                delete: "Delete",
                edit: "Change"

            },
            schemes: {
                title: 'Periodisation schemes',
                joeFrielPeriodization: {
                    code: 'Joe Friel scheme',
                    description: "Periodisation scheme from Joe Friel's 'Triathlete's training bible'",
                    mesocycles: {
                        transition: {
                            code: "Transition",
                            description: "Recover both physically and mentally"
                        },
                        preparation: {
                            code: "Preparation",
                            description: "Prepare to train"
                        },
                        base: {
                            code: "Base",
                            description: "Establish basic abilities"
                        },
                        build: {
                            code: "Build",
                            description: "Build race-specific fitness"
                        },
                        peak: {
                            code: "Peak",
                            description: "Increase rest and race specificity"
                        },
                        race: {
                            code: "Race",
                            description: "Rest and prepare to race"
                        }
                    }
                },
            }
        }
    }
};