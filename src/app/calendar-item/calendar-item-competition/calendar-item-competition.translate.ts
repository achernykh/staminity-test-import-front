export const translateCompetition = {
    ru: {
        title: 'Соревнование',
        toolbar: {
            title: "Соревнование",
        },
        about: 'Обзор',
        name: {
          label: "Название"
        },
        type: {
          label: "Вид спорта"
        },
        action: {
            post: "Создать соревнование",
            edit: "Изменить соревнование",
            copy: "Скопировать соревнование",
            delete: "Удалить соревнование"
        },
        types: {
            triathlon: "Триатлон",
            run: "Бег",
            bike: "Велоспорт",
            swim: "Плавание",
            ski: "Лыжи"
        },
        distanceType: {
            label: "Тип соревнования",
            run: {
                'marathon': "Марафон",
                'halfMarathon': "Полумарафон",
                '1h': "Бег 1 час",
                '24h': "Бег 24 часа",
                '10km': "10 км",
                '5km': "5 км",
                'custom': "Другая дистанция",
            },
            triathlon: {
                'fullDistance': "Полная дистанция",
                'halfDistance': "1/2 полной дистанции",
                '1/4': "1/4 полной дистанции",
                'olympic': "Олимпийская дистанция",
                'sprint': "Спринт",
                '1/8': "1/8 полной дистанции",
                'indoor': "Indoor",
            },
            swim: {
                '10km': "10 000 метров",
                '5km': "5 000 метров",
                '3km': "3 000 метров",
                '1mile': "Миля (1852 м)",
                '1km': "1000 метров",
                '800m': "800 метров",
                '400m': "400 метров",
                '200m': "200 метров",
                '100m': "100 метров",
                '50m': "50 метров",
                'custom': "Другая дистанция",
                '60min': "60 минут",
                '30min': "30 минут"
            },
            bike: {
                custom: 'Другая дистанция'
            },
            ski: {
                '10km': "10 км",
                '15km': "15 км",
                '30km': "30 км",
                '50km': "50 км",
                '70km': "70 км",
                custom: 'Другая дистанция'
            }

        },
        priority: {
            label: 'Приоритет'
        },
        needDistanceType: "Для ввода плана необходимо указать тип соревнования",
        needDuration: 'Для сохранения соревнования необходимо указать план по этапам',
        priorities: {
            label: "Приоритет",
            A: "А",
            B: "B",
            C: "C"
        },
        startDate: {
            label: "Дата"
        },

        // виды спорта
        run: "Бег",
        triathlon: "Триатлон",
        swim: "Плавание",
        bike: "Велоспорт",
        target: "План и факт",
        stage: "Этап",
        trainersPrescription: "Установка тренера",
        trainersPrescriptionPlaceholder: "Предстартовая подготовка, стратегия на гонку, раскладка сил..."

    },
    en: {
        title: 'Competition',
        toolbar: {
            title: "Competition",
        },
        about: 'Overview',
        name: {
            label: "Name"
        },
        type: {
            label: "Activity type"
        },
        action: {
            post: "Create competition",
            edit: "Edit competition",
            copy: "Copy competition",
            delete: "Delete competition"
        },
        types: {
            triathlon: "Triathlon",
            run: "Running",
            bike: "Cycling",
            swim: "Swimming"
        },
        distanceType: {
            label: "Competition type",
            run: {
                'marathon': "Marathon",
                'halfMarathon': "Half marathon",
                '1h': "Run 1 hour",
                '24h': "Run 24 hours",
                '10km': "10 km",
                '5km': "5 km",
                'custom': "Other",
            },
            triathlon: {
                'fullDistance': "Full distance",
                'halfDistance': "1/2 full distance",
                '1/4': "1/4 full distance",
                'olympic': "Olympic distance",
                'sprint': "Sprint",
                '1/8': "1/8 full distance",
                'indoor': "Indoor",
            },
            swim: {
                '10km': "10 000 m",
                '5km': "5 000 m",
                '3km': "3 000 m",
                '1mile': "1 mile (1852 m)",
                '1km': "1000 m",
                '800m': "800 m",
                '400m': "400 m",
                '200m': "200 m",
                '100m': "100 m",
                '50m': "50 m",
                'custom': "Other",
                '60min': "60 min",
                '30min': "30 min"
            },
            bike: {
                custom: 'Other'
            }

        },
        priority: {
            label: 'Priority'
        },
        needDistanceType: "Competition type required",
        needDuration: 'Duration required',
        priorities: {
            label: "Priority",
            A: "А",
            B: "B",
            C: "C"
        },
        startDate: {
            label: "Date"
        },

        // виды спорта
        run: "Run",
        triathlon: "Triathlon",
        swim: "Swimming",
        bike: "Cycling",
        target: "Planned and actual data",
        stage: "Stage",
        trainersPrescription: "Coach prescription",
        trainersPrescriptionPlaceholder: "How to prepare, race strategy, etc..."

    }
};