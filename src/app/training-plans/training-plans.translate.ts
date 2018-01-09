export const _translateTrainingPlans = {
    ru: {
        builder: {
            fullTitle: 'Тренировочный план',
            shortTitle: 'План',
        },
        search: {
            fullTitle: 'Поиск тренировочных планов',
            shortTitle: 'Поиск планов',
        },
        filter: 'Фильтр',
        filterResult: 'Найдено планов {{total}}',

        // табс
        tabs: {
            general: 'Основные параметры',
            description: 'Описание',
            commerce: 'Условия продажи'
        },

        form: {
          title: 'Тренировочный план'
        },

        // действия
        actions: {
            delete: 'Удалить',
            create: 'Создать',
            edit: 'Изменить',
            save: 'Сохранить',
            appoint: 'Применить к...',
            calendar: 'Ввести план'
        },

        // поля плана
        isPublic: {
            label: 'План на продажу'
        },
        name: {
            label: 'Название'
        },
        type: {
            label: 'Вид спорта'
        },
        distanceType: {
            label: 'Тип соревнований'
        },
        isFixedCalendarDates: {
            label: 'Привязан к календарным датам',
            hint: 'В плане, привязанном к календарным датам....'
        },
        propagateMods: {
            label: 'Транслировать изменения плана',
            hint: 'Пояснения к свойству Трансляции, на что это повлияет'
        },
        startDate: {
            label: 'Начальная дата плана'
        },
        endDate: {
            label: 'Начальная дата плана'
        },
        tags: {
            label: 'Характеристики плана',
            beginner: 'Новичок',
            advanced: 'Продвинутый',
            pro: 'Профессионал',
            powerMeter: 'Интенсивность по мощности',
            hrBelt: 'Интенсивность по пульсу',
            weightLoss: 'Потеря веса',
            fitness: 'Привести в форму',
            health: 'Здоровье',
        },
        description: {
            label: 'Описание'
        },
        keywords: {
            label: 'Ключевые слова'
        },
        assignment: {
            action: {
                delete: 'Удалить присвоение',
                post: 'Новое присвоение',
                edit: 'Изменить',
                apply: 'Применить план'
            },
            form: {
                title: 'Присвоение плана',
                applyMode: {
                    label: 'Даты плана',
                    P: 'Даты начала/окончания плана',
                    I: 'Даты первой/последней записи',
                    hint: 'Начало/окончание плана могут быть рассчитаны как от начала календарных дней, так и от первой/последней записи'
                },
                applyDateMode: {
                    label: 'Режим присвоения',
                    F: 'Начиная с даты',
                    T: 'К указанной дате',
                    hint: 'План может быть присовен или к определенной дате, или от выбранной даты'
                },
                applyFromDate: {
                    label: 'Дата начала',
                    placeholder: 'Укажите дату начала плана'
                },
                applyToDate: {
                    label: 'Дата окончания',
                    placeholder: 'Укажите дату окончания плана'
                },
                firstItemDate: {
                    label: '',
                    placeholder: ''
                }
            },
            list: {
                title: 'Список присвоений плана',
                empty: 'У плана нет пирсвоений',
                info: "Дата подключения {{createdDate | date:'short'}}, версия плана {{planRevision}}"
            }
        }
    },
    en: {

    }
};