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
        // периодизация
        periodization: {
            title: 'Схемы периодизации',
            edit: "Изменить описание схемы",
            delete: "Удалить схему",
            emptySchemeList: "Добавьте мезоциклы",
            postScheme: "Создать новую схему",
            systemSchemes: "Системные схемы",
            userSchemes: "Мои схемы",
            mesocycle: {
                title: "Мезоцикл",
                code: {
                    label: "Название мезоцикла"
                },
                color: {
                    label: "Выберите цвет",
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
                delete: "Удалить схему",
                edit: "Изменить схему"

            },
            schemes: {
                title: 'Схемы периодизации',
                JoeFriel: {
                    code: 'joeFrielPeriodization',
                    description: 'Схема периодизации из "Библии триатлета" Джо Фрила',
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
    }
};