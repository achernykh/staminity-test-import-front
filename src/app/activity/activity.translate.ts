export const translateActivity = {
  ru: {
      title: 'Тренировка',
      toolbar: {
          title: 'Тренировка',
      },
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
      segmentsCount: '{{num}} сег',
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
          needSport: 'Для ввода задания укажите вид спорта и категорию',
          categoryLabel: 'Категория',
          structured: 'План по сегментам',
          structuredInput: 'Переключиться на план по сегментам',
          noneStructuredInput: 'Переключиться на обычную тренировку',
          postActualData: 'Добавить факт',
          editActualData: 'Изменить факт',
          activityType: {
              label: 'Вид спорта'
          },
          category: {
              label: 'Категория',
              hint: 'Выберите категорию или <a target="_blank" href="https://staminity.com/methodology?state=categories">добавьте свою</a>'

          },
          dateStart: {
              label: 'Дата',
              hint: 'Дата начала'
          },
          timeStart: {
              label: 'Время',
              hint: 'Время начала, HH:MM'

          },
          durationMeasure: {
              label: 'Тип'
          },
          intensityMeasure: {
              label: 'Интенсивность'
          },
          duration: {
              label: 'Значение, {{"duration" | measureUnit:sport | translate}}',
              min: {
                  hint: 'В минутах или HH:MM:SS'
              }
          },
          movingDuration: {
              label: 'Значение, {{"movingDuration" | measureUnit:sport | translate}}',
              min: {
                  hint: 'В минутах или HH:MM:SS'
              }
          },
          distance: {
              label: 'Значение, {{"distance" | measureUnit:sport | translate}}',
              km: {
                  hint: "Например 10.5"
              },
              meter: {
                  hint: "Например 3500"
              },
              mile: {
                  hint: "Например 13.1"
              },
              yard: {
                  hint: "Например 2400"
              }
          },
          speed: {
              label: "Значение, {{'speed' | measureUnit:sport | translate}}",
              minpkm: {
                  hint: "Например 05:30 или 05:30-05:40"
              },
              minp100m: {
                  hint: "Например 01:40 или 1:45-1:48"
              },
              minp500m: {
                  hint: "Например 03:30 или 03:30-03:40"
              },
              kmph: {
                  hint: "Например 30.5 или 30-32"
              },
              minpml: {
                  hint: "Например 08:30 или 08:30-09:00"
              }
          },
          heartRate: {
              label: 'Значение, {{"heartRate" | measureUnit:sport | translate}}',
              bpm: {
                  hint: "Например 140 или 145-150"
              }
          },
          power: {
              label: 'Значение, {{"power" | measureUnit:sport | translate}}',
              watt: {
                  hint: "Например 195 или 195-200"
              }
          },
          description: {
              placeholder: 'Установка тренера...'
          },
          ftp: {
              label: "Значение, %ПАНО",
              hint: "Например 80 или 80-85"
          },
          durationFact: {
              label: 'Значение, {{"duration" | measureUnit:sport | translate}}',
              min: {
                  hint: 'В минутах или HH:MM:SS'
              }
          },
          movingDurationFact: {
              label: 'Значение, {{"movingDuration" | measureUnit:sport | translate}}',
              min: {
                  hint: 'В минутах или HH:MM:SS'
              }
          },
          distanceFact: {
              label: 'Значение, {{"distance" | measureUnit:sport | translate}}',
              km: {
                  hint: "Например 10.5"
              },
              meter: {
                  hint: "Например 3500"
              },
              mile: {
                  hint: "Например 13.1"
              },
              yard: {
                  hint: "Например 2400"
              }
          },
          speedFact: {
              label: 'Среднее значение, {{"speed" | measureUnit:sport | translate}}',
              minpkm: {
                  hint: "Например 05:30"
              },
              minp100m: {
                  hint: "Например 01:40"
              },
              minp500m: {
                  hint: "Например 03:30"
              },
              kmph: {
                  hint: "Например 30.5"
              },
              minpml: {
                  hint: "Например 08:30"
              }
          },
          heartRateFact: {
              label: 'Среднее значение, {{"heartRate" | measureUnit:sport | translate}}',
              bpm: {
                  hint: "Например 140"
              }
          },
          powerFact: {
              label: 'Среднее значение, {{"power" | measureUnit:sport | translate}}',
              watt: {
                  hint: "Например 195"
              }
          },
      },
      manualFact: {
          title: 'Фактические данные'
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
          namePlaceholder: 'Укажите название шаблона',
          code: 'Шаблон {{code}}',
          nameHint: '',
          favorite: {
              label: "Избранный",
              hint: ""
          }

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
      actualDataIsCorrected: 'Факт изменен вручную'
  },
    en: {
        title: 'Activity',
        toolbar: {
            title: 'Activity',
        },
        action: {
            save: 'Save',
            toTemplate: 'Save as template',
            edit: 'Edit',
            delete: 'Delete',
            reset: 'Cancel',
            add: 'Add',
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
                title: 'Indicators min/avg/max',
                general: 'General indicators',
                code: 'Indicator (unit)',
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
                measures: "Indicators chart",
                segments: "Segments chart",

            },
        },
        athleteSelector: {
            title: "Select athlete",
            recalculate: "Recalculate based on LT",
        },
        plan: 'Planned',
        actual: 'Completed',
        measureUnitFull: 'Unit',
        measureUnitShort: 'Unit',
        segmentsCount: '{{num}} seg',
        completeShort: 'Comp',
        percentFTP: '%LT',
        ftpMode: {
            on: 'ON',
            off: 'OFF'
        },
        dynamicDate: 'Week {{week}}, Day {{day}}',
        trainersPrescription: 'Coach prescription',
        descriptionPlaceholder: '...',
        assignment: {
            title: 'Activity',
            needSport: 'Set sport and category',
            categoryLabel: 'Category',
            structured: 'Structured',
            structuredInput: 'Switch to structured activity',
            noneStructuredInput: 'Switch to simple activity',
            postActualData: 'Add actual data',
            editActualData: 'Edit actual data',
            activityType: {
                label: 'Sport'
            },
            category: {
                label: 'Category',
                hint: 'Select category or <a target="_blank" href="https://staminity.com/methodology?state=categories">add new</a>'

            },
            dateStart: {
                label: 'Date',
                hint: 'Start date'
            },
            timeStart: {
                label: 'Time',
                hint: 'Start time, HH:MM'
            },
            durationMeasure: {
                label: 'Type'
            },
            intensityMeasure: {
                label: 'Intensity'
            },
            duration: {
                label: 'Value, {{"duration" | measureUnit:sport | translate}}',
                min: {
                    hint: 'In minutes or HH:MM:SS'
                }
            },
            movingDuration: {
                label: 'Value, {{"movingDuration" | measureUnit:sport | translate}}',
                min: {
                    hint: 'In minutes or HH:MM:SS'
                }
            },
            distance: {
                label: 'Value, {{"distance" | measureUnit:sport | translate}}',
                km: {
                    hint: "E.g. 10.5"
                },
                meter: {
                    hint: "E.g. 3500"
                },
                mile: {
                    hint: "E.g. 13.1"
                },
                yard: {
                    hint: "E.g. 2400"
                }
            },
            speed: {
                label: 'Value, {{"speed" | measureUnit:sport | translate}}',
                minpkm: {
                    hint: "E.g. 05:30 or 05:30-05:40"
                },
                minp100m: {
                    hint: "E.g. 01:40 or 1:45-1:48"
                },
                minp500m: {
                    hint: "E.g. 03:30 or 03:30-03:40"
                },
                kmph: {
                    hint: "E.g. 30.5 or 30-32"
                },
                minpml: {
                    hint: "E.g. 08:30 or 08:30-09:00"
                }

            },
            heartRate: {
                label: 'Value, {{"heartRate" | measureUnit:sport | translate}}',
                bpm: {
                    hint: "E.g. 140 or 145-150"
                }
            },
            power: {
                label: 'Value, {{"power" | measureUnit:sport | translate}}',
                watt: {
                    hint: "E.g. 195 or 195-200"
                }
            },
            description: {
                placeholder: 'Description...'
            },
            ftp: {
                label: "Value, %LT",
                hint: "E.g. 80 or 80-85"
            },
            durationFact: {
                label: 'Value, {{"duration" | measureUnit:sport | translate}}',
                min: {
                    hint: 'In minutes or HH:MM:SS'
                }
            },
            movingDurationFact: {
                label: 'Value, {{"movingDuration" | measureUnit:sport | translate}}',
                min: {
                    hint: 'In minutes or HH:MM:SS'
                }
            },
            distanceFact: {
                label: 'Value, {{"distance" | measureUnit:sport | translate}}',
                km: {
                    hint: "E.g. 10.5"
                },
                meter: {
                    hint: "E.g. 3500"
                },
                mile: {
                    hint: "E.g. 13.1"
                },
                yard: {
                    hint: "E.g. 2400"
                }
            },
            speedFact: {
                label: 'Average value, {{"speed" | measureUnit:sport | translate}}',
                minpkm: {
                    hint: "E.g. 05:30"
                },
                minp100m: {
                    hint: "E.g. 01:40"
                },
                minp500m: {
                    hint: "E.g. 03:30"
                },
                kmph: {
                    hint: "E.g. 30.5"
                },
                minpml: {
                    hint: "E.g. 08:30"
                }

            },
            heartRateFact: {
                label: 'Average value, {{"heartRate" | measureUnit:sport | translate}}',
                bpm: {
                    hint: "E.g. 140"
                }
            },
            powerFact: {
                label: 'Average value, {{"power" | measureUnit:sport | translate}}',
                watt: {
                    hint: "E.g. 195"
                }
            },
        },
        manualFact: {
            title: 'Actual data'
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
            empty: 'No templates available',
            namePlaceholder: 'Name required',
            code: 'Template {{code}}',
            nameHint: '',
            favorite: {
                label: "Favorite",
                hint: ""
            }
        },
        split: {
            all: 'Activity',
            segment: 'Segment',
            segmentGroup: 'Segment group x{{count}}',
            interval: 'Interval'

        },
        error: {
            required: 'Required',
            needDuration: 'Set duration or distance',
            singleDuration: 'Please set duration or distance',
            singleIntensity: 'Only one intensity indicator can be set',
            needPermissionForFeature: 'Premium tariff required to create future activities'
        },
        loading: 'Loading',
        settings: {
            close: 'Close'
        },
        actualDataIsCorrected: 'Actual data has been changed'
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
        strength: 'Силовая тренировка',
        ski: 'Лыжи',
        rowing: 'Гребля',
        rowingIndoor: 'Гребля тренажер',
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
        bike: 'Cycling',
        trackBike: 'Track cycling',
        indoorBike: 'Indoor cycling',
        strength: 'Strength training',
        ski: 'Skiing',
        other: 'Other',
        rowing: 'Rowing',
        rowingIndoor: 'Rowing indoor',
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