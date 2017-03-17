/**
 * В переводах нотифкаций используется фильтры пересчета показателей -
 * masureCalc, вывода единиц измерения - measureCalc translate для перевода
 * единиц измререния на установленный в сессии пользователя язык интерфейса
 * 
 * Фильтры - это функции форматирования вывода. Они берут значение на вход,
 * пересчитывают и возвращают измененное значение.
 * 
 * Конструкция "вход" | "название_фильтра":["параметр"...]. Фильтры могут
 * идти следом друг за дргуом передавая рассчитанное значение на вход следующему
 * фильтру
 * 
 * */
export const translateNotification = {
    ru: {
/** ----------ПРИМЕР --------
         * Тестовое сообщение
         * data[0] - базовый вид спорта
         * data[1] - фактическое расстояние (distance)
         * data[2] - фактическая скорость (speed)
         * */
        notificationTestMessage: "Новое тестовое сообщение с параметром: расстояние {{data[1] | measureCalc:data[0]:'distance'}} " +
        "{{'distance' | measureUnit:data[0] | translate}} со скоростью {{data[2] | measureCalc:data[0]:'speed'}} {{'speed' | measureUnit:data[0] | translate}}",
  
/** ----------Синхронизация фактических тренировок --------**/
        /** Начальная загрузка завершена. Отправитель - провайдер
        data[0] - количество загруженных тренировок
        data[1] - общее количество тренировок  
        data[2] - дата начальной синхронизации в формате DD.MM.YY**/
        initialProviderSyncCompleted: "Начальная синхронизация завершена.\n" +
        "Загружено {{data[0]}} из {{data[1]}} тренировок c {{data[2]}}",
        

        /**Сообщение спортсмену, что его тренировка загружена. Отправитель - провайдер
        * data[0] - базовый вид спорта
        * data[1] - дата тренировки в формате DD.MM.YY
        * data[2] - calendarItemId. Будет использоваться для перехода к тренировке, когда сделаем адресацию
        * data[3] - фактическая длительность тренировки = calcMeasures.duration.value
        * data[4] - фактическое расстояние тренировки = calcMeasures.distance.value
        * data[5] - фактический % выполнения = calcMeasures.completePercent.value **/
        uploadActivityByProvider: "Загружена тренировка {{data[1]}} \n " +
        "{{data[0]} | translate}, {{data[4] | measureCalc:data[0]:'distance'}} {{'distance' | measureUnit:data[0] | translate}}, {{data[3]}}", 
        
/** ---------- Тренировки --------**/

        /**Тренировка ученика загружена. Получатель - тренер, отправитель - спортсмен.
        * data[0] - базовый вид спорта
        * data[1] - дата тренировки в формате DD.MM.YY
        * data[2] - calendarItemId
        * data[3] - фактическая длительность тренировки = calcMeasures.duration.value
        * data[4] - фактическое расстояние тренировки = calcMeasures.distance.value
        * data[5] - фактический % выполнения = calcMeasures.completePercent.value**/
        activityCompletedByAthlete: "Выполнена тренировка {{data[1]}} \n "+
        "{{data[0]} | translate}, {{data[4] | measureCalc:data[0]:'distance'}} {{'distance' | measureUnit:data[0] | translate}}, {{data[3]}}", 

        /** Плановая тренировка создана тренером. Получатель - спортсмен, отправитель - тренер
        * data[0] - базовый вид спорта
        * data[1] - вид спорта
        * data[2] - плановая дата тренировки в формате DD.MM.YY
        * data[3] - calendarItemId
        * data[4] - название типа тренировки**/
        activityCreatedByCoach: "Создана плановая тренировка: "+
        "{{data[1]} | translate}, {{data[2]}}, {{data[4]} | translate}",
        
         /** Плановая тренировка изменена тренером. Получатель - спортсмен, отправитель - тренер
        * data[0] - базовый вид спорта
        * data[1] - вид спорта
        * data[2] - плановая дата тренировки в формате DD.MM.YY
        * data[3] - calendarItemId
        * data[4] - название типа тренировки**/       
        activityModifiedByCoach: "Изменена плановая тренировка: "+
        "{{data[1]} | translate}, {{data[2]}}, {{data[4]} | translate}",

         /** Факт по тренировке изменен спортсменом. Условия получения такого уведомления: 
            - спортсмен ввел или изменил факт вручную в тренировке,
            - спортсмен откорректировал фактическую длительность сегментов,
            Получатель - тренер, отправитель - спортсмен.
        * data[0] - базовый вид спорта
        * data[1] - вид спорта
        * data[2] - фактическая дата тренировки в формате DD.MM.YY
        * data[3] - calendarItemId
        * data[4] - название типа тренировки**/ 
        activityFactModifiedByAthlete: "Изменен факт в тренировке: " +
        "{{data[1]} | translate}, {{data[2]}}, {{data[4]} | translate}",

        activityCompletedByFriend: "", /** под вопросом. Тренировки друзей достаточно видеть в ленте **/
        activityCompletedByFollowing: "",  /** аналогично, под вопросом **/

        
    /** ---------- Комментарии, лайки, сообщения  --------**/
    newCoachCommentSingle: "",
    newCoachComments: "",
    newUserCommentSingle: "",
    newLikeSingle: "",
    newUserCommentsAndLikes: "",
    newSingleMessage: "",
    newMessages: "",

    /** ---------- Принятие и отклонение запросов пользователей  --------**/
    requestStartCoachingApproved: "",
    requestStartCoachingDeclined: "",
    requestJoinClubApproved: "",
    requestJoinClubDeclined: "",
    requestLeaveClubByCoachApproved: "",
    requestLeaveClubByCoachDeclined: "",
    
    requestJoinClubApprovedByOthers: "",
    requestJoinClubDeclinedByOthers: "",
    requestLeaveClubByCoachApprovedByOthers: "",
    requestLeaveClubByCoachDeclinedByOthers: "",
    
    requestJoinUserGroupApproved: "",
    requestJoinUserGroupDeclined: "",
    requestAddFriendApproved: "",

/** ---------- Оповещения в клубе  --------**/
    clubAthleteConnected: "",
    clubAthleteDisconnected: "",
    clubCoachAssigned: "",
    clubCoachRemoved: "",

    clubRoleAssigned: "",
    clubRoleRemoved: "",
    
    
/** ---------- Отключение от тренеров, выход из клубов, выход из групп  --------**/
    leaveCoachByAthlete: "",
    leaveCoachByCoach: "",
    leaveClubByAthlete: "",
    leaveClubByClub: "",
    leaveUserGroupByUser: "",
    leaveUserGroupByGroup: "",
    

    /** ----------Уведомления по тарифам для всех --------**/
        enabledTariffBehalfRelatedUser: "",
        disabledTariffBehalfRelatedUser: "",
        expiringTrialTermInSomeDays: "",
        expiredTrialTerm: "",
        trialTariffExpiringToday: "",
        trialTariffExpired: "",
        autoRenewalInSomeDays: "",
        autoRenewalCompleted: "",
        autoPaymentWithError: "",

    /** ----------Уведомления по тарифам для тренеров и клубов --------**/
        pastPeriodBillExpiringInSomeDays: "",
        pastPeriodBillExpired: "",
        futurePeriodBillProduced: "",
        futurePeriodBillNotPaidDays: "",
        lockedUserAccess: "",
        lockedUserAccount: "",

    /** ----------Зоны и пороги --------**/
        zonesChangedByCoach: "",
        zonesChangedByAthelete: "",
        zonesChangeRequestByService: ""
        
    /** ----------Зоны и пороги --------**/



    },
    en: {

    }
};