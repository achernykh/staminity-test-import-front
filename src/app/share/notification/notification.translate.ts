/**
 * В переводах нотифкаций используется фильтры пересчета показателей -
 * masureCalc, вывода единиц измерения - measureCalc translate для перевода
 * единиц измререния на установленный в сессии пользователя язык интерфейса
 * 
 * Фильтры - это функции форматирования вывода. Они берут занчение на вход,
 * пересчитывают и возвращают измененное значение.
 * 
 * Конструкция "вход" | "название_фильтра":["параметр"...]. Фильтры могут
 * идти следом друг за дргуом передавая рассчитанное значение на вход следующему
 * фильтру
 * 
 * */
export const translateNotification = {
    ru: {
        /**
         * Тестовое сообщение
         * data[0] - базовый вид спорта
         * data[1] - фактическое расстояние (distance)
         * data[2] - фактическая скорость (speed)
         * */
        notificationTestMessage: "Новое тестовое сообщение с параметром: расстояние {{data[1] | measureCalc:data[0]:'distance'}} " +
        "{{'distance' | measureUnit:data[0] | translate}} со скоростью {{data[2] | measureCalc:data[0]:'speed'}} {{'speed' | measureUnit:data[0] | translate}}",
        
        /**
        * Сообщение спортсмену, что его тренировка загружена. Отправитель - провайдер
        * data[0] - базовый вид спорта
        * data[1] - дата тренировки в формате DD.MM.YY
        * data[2] - calendarItemId. Будет использоваться для перехода к тренировке, когда сделаем адресацию
        * data[3] - фактическая длительность тренировки = calcMeasures.duration.value
        * data[4] - фактическое расстояние тренировки = calcMeasures.distance.value
        * data[5] - фактический % выполнения = calcMeasures.completePercent.value
        * 
        * */
        uploadActivityByProvider: "Загружена тренировка {{data[1]}} \n " +
        "{{data[0]} | translate}, {{data[4] | measureCalc:data[0]:'distance'}} {{'distance' | measureUnit:data[0] | translate}}, {{data[3]}}", 
        

        /**
        * Сообщение тренеру, что тренировка его ученика загружена. Отправитель - спортсмен.
        * data[0] - базовый вид спорта
        * data[1] - дата тренировки в формате DD.MM.YY
        * data[2] - calendarItemId
        * data[3] - фактическая длительность тренировки = calcMeasures.duration.value
        * data[4] - фактическое расстояние тренировки = calcMeasures.distance.value
        * data[5] - фактический % выполнения = calcMeasures.completePercent.value
        * */
        activityCompletedByAthlete: "Выполнена тренировка {{data[1]}} \n "+
        "{{data[0]} | translate}, {{data[4] | measureCalc:data[0]:'distance'}} {{'distance' | measureUnit:data[0] | translate}}, {{data[3]}}" 

    },
    en: {

    }
};