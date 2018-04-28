export const translateActivity = {
  ru: {
      title: 'Тренировка',
      action: {
          save: 'Сохранить',
          toTemplate: 'В Шаблон',
          edit: 'Изменить',
          reset: 'Отменить',
          delete: 'Удалить',
          add: 'Добавить',
          open: 'Открыть',
          copy: 'Скопировать',
          select: 'Выделить',
          close: 'Закрыть',
          settings: 'Настройки',
          addAthletes: 'Добавить атлета',
          setSample: 'Сделать примером',
          unsetSample: 'Убрать из примеров',
          hideSmoothOnChart: 'Убрать сглаживание графиков',
          split: 'Открепить фактические данные',
          recalc: 'Пересчитать тренировку'
      },
      details: {
          measures: {
            title: 'Показатели мин/сред/макс',
            general: 'Основные показатели',
            code: 'Показатель(ед.изм)',
            unit: 'Ед.изм',
            min: 'Мин',
            avg: 'Сред',
            max: 'Макс'
          },
          peaks: {
              title: 'Пики'
          },
          map: {
              title: "Маршрут",
          },
          table: {
              laps: "Отрезки",
              segments: "Сегменты",
          },
          chart: {
              title: 'График',
              measures: "График: Показатели",
              segments: "График: Сегменты",

          },
      },
      athleteSelector: {
          title: "Выберите атлета",
          recalculate: "Пересчитать от ПАНО",
      },
      plan: 'План',
      actual: 'Факт',
      measureUnitFull: 'Показатель(ед.изм)',
      measureUnitShort: 'Ед.Изм',
      completeShort: 'Вып',
      percentFTP: '%ПАНО',
      ftpMode: {
          on: 'ВКЛ',
          off: 'ВЫКЛ'
      },
      dynamicDate: 'Неделя {{week}}, день {{day}}',
      trainersPrescription: 'Установка тренера',
      descriptionPlaceholder: '...',
      assignment: {
          title: 'Задание',
          needSport: 'Для ввода задания укажите вид спорта и тип тренировки',
          categoryLabel: 'Укажите категорию',
          structured: 'План по сегментам'
      },
      segments: {
          total: 'Итоги:',
          result: 'Результат %',
          group: 'Группы',
          key: 'Ключевой',
          add: {
              first: '',
              default: '',
              interval: 'Серия интервалов',
              complexinterval: 'Разминка + Интервалы + Заминка',
              complex: 'Разминка + Работа + Заминка',
              warmUp: 'Разминка',
              coolDown: 'Заминка',
              active: 'Рабочий интервал',
              recovery: 'Восстановление',
              rampUp: 'Работа с возрастанием нагрузки',
              rampDown: 'Работа с убыванием нагрузки'
          }
      },
      template: {
          title: 'Шаблон',
          placeholder: 'Выберите шаблон',
          enable: 'Есть шаблоны',
          empty: 'Шаблонов нет',
          favorite: 'Избранный',
          namePlaceholder: 'Укажите название шаблона',
          code: 'Шаблон {{code}}'
      },
      split: {
          all: 'Вся тренировка',
          segment: 'Сегмент',
          segmentGroup: 'Серия сегментов x{{count}}',
          interval: 'Отрезок'

      },
      error: {
          required: 'Заполните обязательные поля',
          needDuration: 'Укажите время или расстояние',
          singleDuration: 'Можно указать или время, или расстояние',
          singleIntensity: 'Можно задать лишь один параметр интенсивности',
          needPermissionForFeature: 'Для планирования в будущем нужен тариф "Премиум"'
      },
      loading: 'Загрузка данных',
      settings: {
          close: 'Закрыть'
      },
      actualDataIsCorrected: 'Фактические данные изменены вручную'
  },
    en: {
        title: 'Activity',
        action: {
            save: 'Save',
            toTemplate: 'Save as template',
            edit: 'Edit',
            delete: 'Delete',
            reset: 'Cancel',
            open: 'Open',
            copy: 'Copy',
            select: 'Select',
            close: 'Close',
            settings: 'Settings',
            addAthletes: 'Add athletes',
            setSample: 'Set as sample',
            unsetSample: 'Unset as sample',
            hideSmoothOnChart: 'Hide chart smooth',
            split: 'Split Plan and Actual data',
            recalc: 'Recalculate activity'

        },
        details: {
            measures: {
                title: 'Measures min/avg/max',
                general: 'General measures',
                code: 'Measure(unit)',
                unit: 'Unit',
                min: 'Min',
                avg: 'Avg',
                max: 'Max'
            },
            peaks: {
                title: 'Peaks'
            },
            map: {
                title: "Map",
            },
            table: {
                laps: "Laps",
                segments: "Segments",
            },
            chart: {
                title: 'Chart',
                measures: "Measures chart",
                segments: "Segments chart",

            },
        },
        athleteSelector: {
            title: "Select athlete",
            recalculate: "Recalculate from FTP",
        },
        plan: 'Planned',
        actual: 'Completed',
        measureUnitFull: 'Unit',
        measureUnitShort: 'Unit',
        completeShort: 'Comp',
        percentFTP: '%FTP',
        ftpMode: {
            on: 'ON',
            off: 'OFF'
        },
        trainersPrescription: 'Coach prescription',
        descriptionPlaceholder: '...',
        assignment: {
            title: 'Workout plan',
            needSport: 'Choose activity type and category',
            categoryLabel: 'Choose activity category',
            structured: 'Structured'
        },
        segments: {
            total: 'Total:',
            result: 'Complete %',
            group: 'Group',
            key: 'Key',
            add: {
                first: '',
                default: '',
                interval: 'Intervals',
                complexinterval: 'Warm up + Intervals + Cool down',
                complex: 'Warm up + Workout + Cool down',
                warmUp: 'Warm up',
                coolDown: 'Cool down',
                active: 'Workout',
                recovery: 'Recovery',
                rampUp: 'Ramp up',
                rampDown: 'Ramp down'
            }
        },
        template: {
            title: 'Template',
            placeholder: 'Choose template',
            enable: 'Templates available',
            empty: 'Templates not available',
            favorite: 'Favorite',
            namePlaceholder: 'Name required'
        },
        split: {
            all: 'Activity',
            segment: 'Segment',
            segmentGroup: 'Segment group x{{count}}',
            interval: 'Interval'

        },
        error: {
            required: 'Required',
            needDuration: 'Need duration or distance',
            singleDuration: 'Please leave duration or distance',
            singleIntensity: 'Only one intensity measure could be set',
            needPermissionForFeature: 'Premium tariff required to create future activities'
        },
        loading: 'Loading',
        settings: {
            close: 'Close'
        },
        actualDataIsCorrected: 'Actual data has been corrected manually'
    }
};

export const translateSport = {
    ru: {
        default: 'По-умолчанию',
        run: 'Бег',
        streetRun: 'Бег по улице',
        indoorRun: 'Бег в помещении',
        trailRun: 'Бег по пересеченной местности',
        treadmillRun: 'Беговая дорожка',
        swim: 'Плавание',
        openWaterSwim: 'Плавание на открытой воде',
        poolSwim: 'Плавание в бассейне',
        bike: 'Велосипед',
        trackBike: 'Велотрек',
        indoorBike: 'Велостанок',
        strength: 'Тренажерный зал',
        ski: 'Лыжи',
        other: 'Прочее',
        transition: 'Транзитка',
        swimToBike: 'Транзитка: плавание-вел',
        bikeToRun: 'Транизитка: вел-бег',
        swimToRun: 'Транзитка: плавание-бег',
        fuctionalTest: 'Функциональный тест',
        triathlon: 'Триатлон'
    },
    en: {
        default: 'Default',
        run: 'Running',
        streetRun: 'Street running',
        indoorRun: 'Indoor running',
        trailRun: 'Trail running',
        treadmillRun: 'Treadmill running',
        swim: 'Swimming',
        openWaterSwim: 'Openwater swimming',
        poolSwim: 'Pool swimming',
        bike: 'Bike',
        trackBike: 'Track bike',
        indoorBike: 'Indoor bike',
        strength: 'Strength',
        ski: 'Ski',
        other: 'Other',
        transition: 'Transition',
        swimToBike: 'Transition: Swim to bike',
        bikeToRun: 'Transition: Bike to run',
        swimToRun: 'Transition: Swim to run',
        fuctionalTest: 'Functional test',
        triathlon: 'Triathlon'
    }
};

export const translateCategories = {
    ru: {
        recovery: 'Восстановление',
        aerobicEndurance: 'Аэробная выносливость',
        muscularForce: 'Развитие силы',
        muscularEndurance: 'Мышечная выносливость',
        speedSkills: 'Развитие скорости',
        anaerobicEndurance: 'Анаэробная выносливость',
        sprintPower: 'Мощность',
        functionalTest: 'Функциональный тест',
        racePreparation: 'Подготовка к старту',
        race: 'Старт',
    },
    en: {
        recovery: 'Recovery',
        aerobicEndurance: 'Aerobic endurance',
        muscularForce: 'Muscular force',
        muscularEndurance: 'Muscular endurance',
        speedSkills: 'Speed skills',
        anaerobicEndurance: 'Anaerobic endurance',
        sprintPower: 'Sprint power',
        functionalTest: 'Functional test',
        racePreparation: 'Race preparation',
        race: 'Race',
    }
};