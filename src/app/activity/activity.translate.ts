export const translateActivity = {
  ru: {
      save: 'Сохранить',
      toTemplate: 'В Шаблон',
      edit: 'Изменить',
      reset: 'Отменить',
      delete: 'Удалить',
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
      trainersPrescription: 'Установка тренера',
      assignment: {
          title: 'Задание',
          needSport: 'Для ввода задания укажите вид спорта и тип тренировки',
          categoryLabel: 'Укажите категорию',
          structured: 'План по сегментам'
      },
      segments: {
          total: 'Итоги:',
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
          title: 'Выберите шаблон',
          enable: 'Есть шаблоны',
          empty: 'Шаблонов нет',
          favorite: 'Избранный',
          namePlaceholder: 'Укажите название шаблона'
      },
      error: {
          required: 'Заполните обязательные поля',
          needDuration: 'Укажите время или расстояние',
          singleDuration: 'Можно указать или время, или расстояние',
          singleIntensity: 'Можно задать лишь один параметр интенсивности',
          needPermissionForFeature: 'Для планирования в будущем нужен тариф "Премиум"'
      },
      loading: 'Загрузка данных'
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
    en: {}
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