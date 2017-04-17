/*
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
/*  ----------ПРИМЕР --------
         * Тестовое сообщение
         * data[0] - базовый вид спорта
         * data[1] - фактическое расстояние (distance)
         * data[2] - фактическая скорость (speed)
         * */
        notificationTestMessage: "Новое тестовое сообщение с параметром: расстояние {{data[1] | measureCalc:data[0]:'distance'}} " +
        "{{'distance' | measureUnit:data[0] | translate}} со скоростью {{data[2] | measureCalc:data[0]:'speed'}} {{'speed' | measureUnit:data[0] | translate}}",

/*  ----------Синхронизация фактических тренировок --------**/
        /*  Начальная загрузка завершена. Отправитель - провайдер
        data[0] - количество загруженных тренировок
        data[1] - общее количество тренировок
        data[2] - дата начальной синхронизации в формате DD.MM.YY**/
        initialProviderSyncCompleted: "Начальная синхронизация завершена.\n" +
        "Загружено {{data[0]}} из {{data[1]}} тренировок c {{data[2] | date:'short'}}",

        /*  Начальная загрузка завершена. Отправитель - провайдер */
        providerSyncError: "Подключение не удалось. Необходимо повторно настроить синхронизацию",



        /* Сообщение спортсмену, что его тренировка загружена. Отправитель - провайдер
        * data[0] - базовый вид спорта
        * data[1] - дата тренировки в формате DD.MM.YY
        * data[2] - calendarItemId. Будет использоваться для перехода к тренировке, когда сделаем адресацию
        * data[3] - фактическая длительность тренировки = calcMeasures.duration.value
        * data[4] - фактическое расстояние тренировки = calcMeasures.distance.value
        * data[5] - фактический % выполнения = calcMeasures.completePercent.value **/
        uploadActivityByProvider: "Загружена тренировка {{data[1] | date:'short'}} \n " +
        "{{'sport.'+data[0] | translate}}, {{data[4] | measureCalc:data[0]:'distance'}} {{'distance' | measureUnit:data[0] | translate}}, {{data[3] | measureCalc:data[0]:'duration'}}",

/*  ---------- Тренировки --------**/

        /* Тренировка ученика загружена. Получатель - тренер, отправитель - спортсмен.
        * data[0] - базовый вид спорта
        * data[1] - дата тренировки в формате DD.MM.YY
        * data[2] - calendarItemId
        * data[3] - фактическая длительность тренировки = calcMeasures.duration.value
        * data[4] - фактическое расстояние тренировки = calcMeasures.distance.value
        * data[5] - фактический % выполнения = calcMeasures.completePercent.value */
        activityCompletedByAthlete: "Выполнена тренировка {{data[1] | date:'short'}} \n "+
        "{{'sport.'+data[0] | translate}}, {{data[4] | measureCalc:data[0]:'distance'}} {{'distance' | measureUnit:data[0] | translate}}, {{data[3] | measureCalc:data[0]:'duration'}}",

        /*  Плановая тренировка создана тренером. Получатель - спортсмен, отправитель - тренер
        * data[0] - базовый вид спорта
        * data[1] - вид спорта
        * data[2] - плановая дата тренировки в формате DD.MM.YY
        * data[3] - calendarItemId
        * data[4] - название типа тренировки**/
        activityCreatedByCoach: "Создана плановая тренировка: "+
        "{{'sport.'+data[1] | translate}}, {{data[2] | date:'short'}}, {{'category.'+data[4] | translate}}",

         /*  Плановая тренировка изменена тренером. Получатель - спортсмен, отправитель - тренер
        * data[0] - базовый вид спорта
        * data[1] - вид спорта
        * data[2] - плановая дата тренировки в формате DD.MM.YY
        * data[3] - calendarItemId
        * data[4] - название типа тренировки**/
        activityModifiedByCoach: "Изменена плановая тренировка: "+
        "{{'sport.'+data[1] | translate}}, {{data[2] | date:'short'}}, {{'category.'+data[4] | translate}}",

        /*  Плановая тренировка удалена тренером. Получатель - спортсмен, отправитель - тренер
         * data[0] - базовый вид спорта
         * data[1] - вид спорта
         * data[2] - плановая дата тренировки в формате DD.MM.YY
         * data[3] - calendarItemId
         * data[4] - название типа тренировки**/
        activityDeletedByCoach: "Удалена плановая тренировка: "+
        "{{'sport.'+data[1] | translate}}, {{data[2] | date:'short'}}, {{'category.'+data[4] | translate}}",

        /*  Плановая тренировка создана спортсменом. Получатель - тренер, отправитель - спортсмен
         * data[0] - базовый вид спорта
         * data[1] - вид спорта
         * data[2] - плановая дата тренировки в формате DD.MM.YY
         * data[3] - calendarItemId
         * data[4] - название типа тренировки**/
        activityCreatedByAthlete: "Спортсмен создал тренировку: "+
        "{{'sport.'+data[1] | translate}}, {{data[2] | date:'short'}}, {{'category.'+data[4] | translate}}",

        /*  Плановая тренировка удалена спортсменом. Получатель - тренер, отправитель - спортсмен
         * data[0] - базовый вид спорта
         * data[1] - вид спорта
         * data[2] - плановая дата тренировки в формате DD.MM.YY
         * data[3] - calendarItemId
         * data[4] - название типа тренировки**/
        activityDeletedByAthlete: "Удалена тренировка спортсменом: "+
        "{{'sport.'+data[1] | translate}}, {{data[2] | date:'short'}}, {{'category.'+data[4] | translate}}",


         /*  Факт по тренировке изменен спортсменом. Условия получения такого уведомления:
            - спортсмен ввел или изменил факт вручную в тренировке,
            - спортсмен откорректировал фактическую длительность сегментов,
            Получатель - тренер, отправитель - спортсмен.
        * data[0] - базовый вид спорта
        * data[1] - вид спорта
        * data[2] - фактическая дата тренировки в формате DD.MM.YY
        * data[3] - calendarItemId
        * data[4] - название типа тренировки**/
        activityFactModifiedByAthlete: "Изменен факт в тренировке: " +
        "{{'sport.'+data[1] | translate}}, {{data[2] | date:'short'}}, {{'category.'+data[4] | translate}}",

        activityCompletedByFriend: "", /* под вопросом. Тренировки друзей достаточно видеть в ленте */
        activityCompletedByFollowing: "",  /* аналогично, под вопросом */


/* ---------- Комментарии, лайки, сообщения  --------**/
        /*  Комментарий тренера спортсмену в тренировке.
         Получатель - спортсмен, отправитель - тренер
         * data[0] - базовый вид спорта
         * data[1] - вид спорта
         * data[2] - фактическая дата тренировки в формате DD.MM.YY
         * data[3] - calendarItemId
         * data[4] - название типа тренировки **/
        newCoachComment: "Ваш тренер оставил комментарий в тренировке: " +
        "{{'sport.'+data[1] | translate}}, {{data[2] | date:'short'}}, {{'category.'+data[4] | translate}}",

        // Получатель - тренер, отправитель - спортсмен.
        newAthleteComment: "Ваш спортсмен оставил комментарий в тренировке: " +
        "{{'sport.'+data[1] | translate}}, {{data[2] | date:'short'}}, {{'category.'+data[4] | translate}}",

        newUserComment: "",
        newLikeSingle: "",
        newUserCommentsAndLikes: "",
        newSingleMessage: "",
        newMessages: "",

/* ---------- Принятие и отклонение запросов пользователей в группы --------**/
    /* Athletes **/
        /* Тренер принял запрос от спортсмена. Получатель - инициатор запроса, отправитель - тренер**/
        requestJoinAthletesApproved: "Ваш запрос на подключение к тренеру одобрен",

        /* Тренер отклонил запрос от спортсмена. Получатель - инициатор запроса, отправитель - тренер**/
        requestJoinAthletesDeclined: "Тренер отклонил ваш запрос на подключение",

        /* Тренер отключил спортсмена. Получатель - спортсмен, отправитель - тренер**/
        leaveAthletesByAdmin: "Тренер исключил вас из списка своих спортсменов",

        /* Спортсмен отключился от тренера. Получатель - тренер, отправитель - спортсмен**/
        leaveAthletesByMember: "Спортсмен отключился от вас",

    /* ClubMembers **/
        /* Клуб одобрил запрос от пользователя. Получатель - инициатор запроса, отправитель - клуб
        data[0] - Фамилия и Имя менеджера, обработавшего запрос
        data[1] - userUri менеджера, обработавшего запрос. Для ссылки на профиль**/
        requestJoinClubMembersApproved: "Ваш запрос на вступление в клуб одобрен",

        /* Клуб отклонил запрос от пользователя. Получатель - инициатор запроса, отправитель - клуб
        data[0] - Фамилия и Имя менеджера, обработавшего запрос
        data[1] - userUri менеджера, обработавшего запрос. Для ссылки на профиль**/
        requestJoinClubMembersDeclined: "Ваш запрос на вступление в клуб отклонен",

        /* Клуб одобрил запрос на выход тренера из клуба
	    data[0] - Фамилия и Имя менеджера, обработавшего запрос
        data[1] - userUri менеджера, обработавшего запрос. Для ссылки на профиль**/
        requestLeaveClubMembersApproved: "Ваш запрос на выход из клуба одобрен. Вы исключены из клуба",

        /* Клуб отклонил запрос на выход тренера из клуба
        data[0] - Фамилия и Имя менеджера, обработавшего запрос
        data[1] - userUri менеджера, обработавшего запрос. Для ссылки на профиль**/
        requestLeaveClubMembersDeclined: "Ваш запрос на выход из клуба отклонен",

        /* Администрация исключила члена клуба. Получатель - член группы, отправитель - клуб
        data[0] - Фамилия и Имя админа, выполнившего запрос
        data[1] - uri админа **/
        leaveClubMembersByAdmin: "Вы исключены из клуба",

        /* Член клуба вышел из клуба. Получатель - администраторы клуба, отправитель - член клуба
         data[0] - Фамилия и Имя пользователя, который вышел из клуба,
         data[1] - uri пользователя **/
        leaveClubMembersByMember: "Вышел из клуба",

        /* Член клуба исключен из клуба администратором. Отправитель - администратор, выполнивший запрос, получатели - другие администраторы клуба
         data[0] - Фамилия и Имя пользователя, который вышел из клуба,
         data[1] - uri пользователя
         data[2] - Название клуба
         data[3[ - uri клуба           **/
        leaveClubMembersByOtherAdmin: "{{data[0]}} исключен из клуба {{data[2]}}",


    /* Friends **/
        /* Запрос на дружбу принят.
         * Отправитель - пользователь, принявший запрос. Получатель - инициатор запроса.*/
        requestJoinFriendsApproved: "Ваш запрос на дружбу принят",

        /* Запрос на дружбу отклонен.
         * Отправитель - пользователь, принявший запрос. Получатель - инициатор запроса.*/
        requestJoinFriendsDeclined: "Ваш запрос на дружбу отклонен",

    /* Прочие пользовательские группы **/
        /* Запрос на вступление в группу одобрен.
        Отправитель - группа. Получатель - инициатор запроса.
        data[0] - Фамилия и Имя администратора группы, обработавшего запрос
        data[1] - userUri администратора группы, обработавшего запрос. Для ссылки на профиль**/
        requestJoinUserGroupApproved: "Ваш запрос на вступление в группу одобрен",

        /* Запрос на вступление в группу отклонен.
        Отправитель - группа. Получатель - инициатор запроса.
        data[0] - Фамилия и Имя администратора группы, обработавшего запрос
        data[1] - userUri администратора группы, обработавшего запрос. Для ссылки на профиль */
        requestJoinUserGroupDeclined: "Ваш запрос на вступление в группу отклонен",

        /* Администрация исключила члена группы. Получатель - член группы, отправитель - группа **/
        leaveUserGroupByAdmin: "Вы исключены из группы",

        /* Член группы вышел из группы. Получатель - администраторы группы, отправитель - член группы**/
        leaveUserGroupByMember: "Вышел из группы",

        /* Член группы исключен из группы администратором. Отправитель - администратор, выполнивший запрос, получатели - другие администраторы группы
         data[0] - Фамилия и Имя пользователя, который вышел из группы,
         data[1] - uri пользователя
         data[2] - Название группы
         data[3[ - uri группы           **/
        leaveUserGroupByOtherAdmin: "{{data[0]}} исключен из группы {{data[2]}}",

/* -- Уведомления администраторам, которые имеют копию обработанного запроса -- **/

        /* Запрос на вступление в клуб одобрен другими администраторами.
         * Отправитель - менеджер, который одобрил запрос
         * Получатели - члены группы clubManagement, за исключением того, кто обработал запрос
        data[0] - Фамилия и Имя инициатора исходного запроса (спортсмена, который направил запрос клубу)
        data[1] - userUri инициатора запроса
        data[2] - Название клуба
        data[3] - clubUri  Для ссылки на профиль**/
        requestJoinClubMembersApprovedByOthers: "{{data[0]}} принят в клуб {{data[2]}}",

        /* Запрос на вступление в клуб отклонен другими администраторами.
         * Отправитель - менеджер, который отклонил запрос
         * Получатели - члены группы clubManagement, за исключением того, кто обработал запрос
        data[0] - Фамилия и Имя инициатора исходного запроса (спортсмена, который направил запрос клубу)
        data[1] - userUri инициатора запроса
        data[2] - Название клуба
        data[3] - clubUri  Для ссылки на профиль **/
        requestJoinClubMembersDeclinedByOthers: "{{data[0]}} не принят в клуб {{data[2]}}. Запрос отклонен",

/* ---------- Оповещения в клубе  --------**/
       /* Уведомление тренеру клуба, что к нему подключен спортсмен
         * Отправитель - клуб. Получатель - тренер.
        data[0] - Фамилия и Имя спортсмена
        data[1] - userUri спортсмена. Для ссылки на профиль **/
        clubAthleteConnected: "У вас новый спортсмен в клубе: {{data[0]}}",

       /* Уведомление тренеру клуба, что от него отключен спортсмен
         * Отправитель - клуб. Получатель - тренер.
        data[0] - Фамилия и Имя спортсмена
        data[1] - userUri спортсмена. Для ссылки на профиль **/
        clubAthleteDisconnected: "От вас отключен спортсмен: {{data[0]}}",

        /* Уведомление спортсмену клуба, что для него назначен тренер
         * Отправитель - клуб. Получатель - спортсмен.
        data[0] - Фамилия и Имя тренера
        data[1] - userUri тренера. Для ссылки на профиль **/
        clubCoachAssigned: "У вас новый тренер в клубе: {{data[0]}}",

        /* Уведомление спортсмену клуба, что от него отключен тренер
         * Отправитель - клуб. Получатель - спортсмен.
        data[0] - Фамилия и Имя тренера
        data[1] - userUri тренера. Для ссылки на профиль **/
        clubCoachRemoved: "От вас отключен тренер в клубе: {{data[0]}}",

        /* Уведомление члену клуба о назначении роли.
         * Отправитель - клуб. Получатель - член клуба.
        data[0] - Фамилия и Имя менеджера, обработавшего запрос
        data[1] - userUri менеджера, обработавшего запрос. Для ссылки на профиль
        data[2] - название роли: Спортсмен, Тренер, Администратор**/
        clubRoleAssigned: "Вам в клубе присвоена роль {{data[2] | translate}}",

        /* Уведомление члену клуба об отключении роли.
         * Отправитель - клуб. Получатель - член клуба.
        data[0] - Фамилия и Имя менеджера, обработавшего запрос
        data[1] - userUri менеджера, обработавшего запрос. Для ссылки на профиль
        data[2] - название роли: Спортсмен, Тренер, Администратор**/
        clubRoleRemoved: "В клубе вам отключена роль {{data[2] | translate}}",

    /*----- Уведомления администраторов клуба о действиях других администраторов------*/
        /* Оповещение пользователей, которые имеют права на изменение состава членов редактируемой группы
        Отправитель - админ группы, выполняющий добавление/удаление члена группы
        Получатель - все остальные админы группы, кроме инициатора, имеющие право W на userGroup.membership
        Суффиксы:
            ByAdmin - админ назначает роль кому-то
            ByMember - админ назначает роль себе
        шаблон перевода:
        <join/leave><GroupCode>ByAdmin
            data[0] - Название клуба
            data[1] - uri клуба
            data[2] - Name члена клуба
            data[3] - Uri члена клуба **/
        joinClubManagementByAdmin: "{{data[2]}} назначен администратором клуба {{data[0]}}",
        joinClubCoachesByAdmin: "{{data[2]}} назначен тренером клуба {{data[0]}}",
        joinClubChiefCoachesByAdmin: "{{data[2]}} назначен главным тренером клуба {{data[0]}}",
        joinClubConsultingByAdmin: "{{data[2]}} назначен консультантом клуба {{data[0]}}",
        joinClubAthletesByAdmin: "{{data[2]}} включен в число спортсменов клуба {{data[0]}}",


        joinClubCoachesByMember: "Назначил себя тренером клуба {{data[0]}}",
        joinClubChiefCoachesByMember: "Назначил себя главным тренером клуба {{data[0]}}",
        joinClubConsultingByMember: "Назначил себя консультантом клуба {{data[0]}}",
        joinClubAthleteByMember: "Включил себя в число спортсменов клуба {{data[0]}}",


        // выход из групп
        leaveClubManagementByAdmin: "{{data[2]}} отключена роль 'Администратор' клуба {{data[0]}}",
        leaveClubCoachesByAdmin: "{{data[2]}} отключена роль 'Тренер' клуба {{data[0]}}",
        leaveClubChiefCoachesByAdmin: "{{data[2]}} отключена роль 'Главный тренер' клуба {{data[0]}}",
        leaveClubConsultingByAdmin: "{{data[2]}} отключена роль 'Консультант' клуба {{data[0]}}",
        leaveClubAthletesByAdmin: "{{data[2]}} отключена роль 'Спортсмен' клуба {{data[0]}}",


        leaveClubCoachesByMember: "Отключил себе роль 'Тренер' в клубе {{data[0]}}",
        leaveClubChiefCoachesByMember: "Отключил себе роль 'Главный тренер' в клубе {{data[0]}}",
        leaveClubConsultingByMember: "Отключил себе роль 'Консультант' в клубе {{data[0]}}",
        leaveClubAthletesByMember: "Отключил себе роль 'Спортсмен' в клубе {{data[0]}}",


        /* Оповещение админов группы Club_<>_<>_Athletes при изменении членства
        Отправитель - админ группы, выполняющий добавление/удаление члена группы
        Получатель - все остальные админы группы, кроме инициатора, имеющие право W на userGroup.membership

            data[0] - Название клуба
            data[1] - uri клуба
            data[2] - Name спортсмена
            data[3] - Uri спортсмена
            data[4] - Name тренера
            data[5] - Uri тренера **/
        joinCoachAthleteByAdmin: "Назначен тренер для спортсмена в клубе {{data[0]}}:\n"+
        "Тренер: {{data[4]}}, спортсмен: {{data[2]}}",
        leaveCoachAthleteByAdmin: "Отключен тренер от спортсмена в клубе {{data[0]}}:\n"+
        "Тренер: {{data[4]}}, спортсмен: {{data[2]}}",

    /*  ----------Уведомления по членству в тарифных группах --------
        Отправитель в зависимости от группы:
            PremiumByClub - клуб
            CoachByClub - клуб
            PremiumByCoach - тренер

        Получатели:
            <join/leave><groupCode> - пользователь, получающий тарифные функции
            <join/leave><groupCode>ByMember - админы группы, кроме себя самого
            <join/leave><groupCode>ByAdmin - админы группы, кроме себя самого


        Контекст data[]:
            data[0] - Название клуба
            data[1] - uri клуба
            data[2] - Name члена клуба
            data[3] - Uri члена клуба
    **/

        joinPremiumByClub: "Вам подключен тариф 'Премиум' за счет клуба",
        joinPremiumByClubByAdmin: "{{data[2]}} подключен тариф 'Премиум' за счет клуба {{data[0]}}",
        joinPremiumByClubByMember: "Подключил себе тариф 'Премиум' за счет клуба {{data[0]}}",

        leavePremiumByClub: "Вам отключен тариф 'Премиум', ранее подключенный за счет клуба",
        leavePremiumByClubByAdmin: "{{data[2]}} отключен тариф 'Премиум' за счет клуба {{data[0]}}",
        leavePremiumByClubByMember: "Отключил себе тариф 'Премиум' за счет клуба {{data[0]}}",

        joinCoachByClub: "Вам подключен тариф 'Тренер' за счет клуба",
        joinCoachByClubByAdmin: "{{data[2]}} подключен тариф 'Тренер' за счет клуба {{data[0]}}",
        joinCoachByClubByMember: "Подключил себе тариф 'Тренер' за счет клуба {{data[0]}}",

        leaveCoachByClub: "Вам отключен тариф 'Тренер', ранее подключенный за счет клуба",
        leaveCoachByClubByAdmin: "{{data[2]}} отключен тариф 'Тренер' за счет клуба {{data[0]}}",
        leaveCoachByClubByMember: "Отключил себе тариф 'Тренер' за счет клуба {{data[0]}}",

        joinPremiumByCoach: "Вам подключен тариф 'Премиум' за счет тренера",
        leavePremiumByCoach: "Вам отключен тариф 'Премиум', ранее подключенный за счет тренера",
        //другие типы для PremiumByCoach не релевантны


    /* ----------Уведомления по тарифам для всех --------**/
        enabledTariffBehalfRelatedUser: "",
        disabledTariffBehalfRelatedUser: "",
        expiringTrialTermInSomeDays: "",
        expiredTrialTerm: "",
        trialTariffExpiringToday: "",
        trialTariffExpired: "",
        autoRenewalInSomeDays: "",
        autoRenewalCompleted: "",
        autoPaymentWithError: "",

    /* ----------Уведомления по тарифам для тренеров и клубов --------**/
        pastPeriodBillExpiringInSomeDays: "",
        pastPeriodBillExpired: "",
        futurePeriodBillProduced: "",
        futurePeriodBillNotPaidDays: "",
        lockedUserAccess: "",
        lockedUserAccount: "",

/* ----------Зоны и пороги --------**/
        /* Зоны изменены тренером. Отправитель - тренер, получатель - спортсмен. Или наоборот  */
        zonesChangedByCoach: "Изменены настройки ваших тренировочных зон и пороговых значений",
        zonesChangedByAthlete: "Ваш спортсмен изменил настройки тренировочных зон и пороговых значений",

        /* Предлагается изменение порогов по итогам анализа тренировки. Отправитель - Стаминити, получатель - спортсмен.
         data [0] - базовый вид спорта
         data [1] - пороговое значение
         data [2] - дата обновления */
        newPaceFTPBySystem: "Предлагаем обновить значение ПАНО по темпу по виду спорта: {{'sport.'+data[0] | translate}}. "+
        "Новое значение: {{data[1] | measureCalc: data[0]: 'speed'}} {{'speed' | measureUnit:data[0] | translate}} ",
        newHeartRateFTPBySystem: "Предлагаем обновить значение ПАНО по пульсу по виду спорта: {{'sport.'+data[0] | translate}}. "+
        "Новое значение: {{data[1] | measureCalc: data[0]: 'heartRate'}} {{'heartRate' | measureUnit:data[0] | translate}}",
        newPowerFTPBySystem: "Предлагаем обновить значение ПАНО по мощности по виду спорта: {{'sport.'+data[0] | translate}}. "+
        "Новое значение: {{data[1] | measureCalc: data[0]: 'power'}} {{'power' | measureUnit:data[0] | translate}}",

        /* Предлагается изменение порогов по итогам анализа тренировки. Отправитель - спортсмен, получатель - тренер.
         data [0] - базовый вид спорта
         data [1] - пороговое значение
         data [2] - дата обновления */
        newAthletePaceFTPBySystem: "Предлагаем обновить ПАНО по темпу для вашего спортсмена по итогам его тренировки. "+
        "Новое значение: {{data[1] | measureCalc: data[0]: 'speed'}} {{'speed' | measureUnit:data[0] | translate}} ",
        newAthleteHeartRateFTPBySystem: "Предлагаем обновить ПАНО по пульсу для вашего спортсмена по итогам его тренировки. "+
        "Новое значение: {{data[1] | measureCalc: data[0]: 'heartRate'}} {{'heartRate' | measureUnit:data[0] | translate}}",
        newAthletePowerFTPBySystem: "Предлагаем обновить ПАНО по мощности для вашего спортсмена по итогам его тренировки. "+
        "Новое значение: {{data[1] | measureCalc: data[0]: 'power'}} {{'power' | measureUnit:data[0] | translate}}",


/* ---------- Уведомления от сервиса --------**/
    /* Уведомление для пользователей сервиса. Отправитель - Стаминити.
        * data[0] - текст сообщения RUS*
        * data[1] - текст сообщения ENG **/
        staminityNotification: "{{data[0]}}"
    },
    en: {

    }
};