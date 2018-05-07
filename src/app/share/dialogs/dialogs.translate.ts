export let translateDialogs = {
    ru: {
        yes: "Да",
        no: "Нет",
        ok: "Принять",
        cancel: "Отклонить",
        performActionA: "Принять запрос",
        performActionD: "Отклонить запрос",
        performActionC: "Отменить запрос",
        confirm: "Вы уверены?",

        coaches: "Тренеры",
        athletes: "Спортсмены",
        friends: "Друзья",
        following: "Подписки",
        followers: "Подписчики",
        members: "Участники",
        users: "Пользователи",
        feeObjects: "База начисления",

        bySelf: "За свой счет",
        byClub: "За счет клуба",
        byCoach: "За счет тренера",
        tariffs: "Тарифы",
        Premium: "Премиум",
        Coach: "Тренер",
        Club: "Клуб",
        ClubAthletes: "Спортсмен",
        ClubCoach: "Тренер",
        ClubCoaches: "Тренер",
        ClubManagement: "Администратор",
        turnOffAthletes: "Отключить атлетов?",

        startCoach: "Отправить запрос тренеру?",
        rejectRequest: "Отменить заявку?",
        leaveCoach: "Покинуть тренера?",
        startFriends: "Отправить запрос на добавление в друзья?",
        startFollow: "Подписаться?",
        startClub: "Отправить запрос на вступление в клуб?",
        leaveClub: "Покинуть клуб?",
        excludeClub: "Исключить из клуба?",
        removeAthlete: "Отключить спортсмена?",

        // Операции с тренировками
        deleteSelectedItems: "Удалить выбранные тренировки? Отменить операцию невозможно",
        deleteActualActivity: "Удалить выбранные тренировки? Если удалить выполненные тренировки, они не будут импортированы при последующей загрузке данных. Отменить операцию невозможно.",
        deletePlanActivity: "Удалить выбранные тренировки? Отменить операцию невозможно",
        moveActualActivity: "Перенести выполненную тренировку невозможно. Скопировать план?",
        updateIntensity: "Значения ПАНО у спортсменов могут отличаться. Пересчитать интенсивность тренировок с учетом ПАНО?",

        // Операции с соревнованиями
        deleteActualCompetition: 'Удалить соревнование? Будут удалены все связанные фактические тренировки и они не будут импортированы при последующей загрузке данных. Отменить операцию невозможно.',


        // окно загрузки профиля
        upload: "Загрузить",
        choose: "Выбрать...",
        uploadFile: "Загрузка файлов",
        // план
        deleteTrainingPlan: "Вы хотите удалить тренировочный план? Эту операцию отменить невозможно",
        deleteSelectedAssignment: "Удалить присвоение плана? Все невыполненные тренировки будут удалены из календаря спортсмена",
        unpublishTrainingPlan: "Снять план с публикации? Тренировочный план будет удален из магазина планов и недоступен для приобретения",
        publishTrainingPlan: "Опубликовать план? Тренировочный план будет доступен в магазине",

        // split and merge
        mergeActivity: "Объединить плановую и фактическую тренировки?",
        splitActivity: "Отменить сопоставление плана и факта и разделить тренировку на запланированную и выполненную?",

        omni: {
            title: 'Ваш вопрос',
            userName: 'Имя и Фамилия',
            userEmail: 'E-mail адрес',
            subject: 'Тема',
            contentPlaceholder: 'Ваш вопрос...',
            post: 'Отправить',
            confirm: "Нажимая на кнопку 'Отправить', вы даете согласие на <a href='https://legal.staminity.com/ru/privacy.html'>обработку персональных данных</a> "
        }

    },
    en: {
        yes: "Yes",
        no: "No",
        ok: "Accept",
        cancel: "Decline",
        performActionA: "Accept request",
        performActionD: "Decline request",
        performActionC: "Cancel request",
        confirm: "Are you sure?",

        coaches: "Coaches",
        athletes: "Athletes",
        friends: "Friends",
        following: "You follow",
        followers: "Followers",
        members: "Members",
        users: "Users",
        feeObjects: "Fee base",

        bySelf: "By yourself",
        byClub: "By club",
        byCoach: "By coach",
        tariffs: "Tariffs",
        Premium: "Premium",
        Coach: "Coach",
        Club: "Club",
        ClubAthletes: "Club athlete",
        ClubCoach: "Club coach",
        ClubCoaches: "Club coach",
        ClubManagement: "Club administrator",
        turnOffAthletes: "Drop off athletes?",

        startCoach: "Send request to coach?",
        rejectRequest: "Cancel request?",
        leaveCoach: "Leave coach?",
        startFriends: "Send friend request?",
        startFollow: "Start follow?",
        startClub: "Send request to club?",
        leaveClub: "Leave club?",
        excludeClub: "Drop off from club?",
        removeAthlete: "Remove athlete?",

        // Операции с тренировками
        deleteSelectedItems: "Delete selected activities? Action cannot be undone",
        deleteActualActivity: "Delete selected completed activities? Action can not be undone",
        deletePlanActivity: "Delete selected planned activities? Action can not be undone",
        moveActualActivity: "Transfer completed activity is not possible. Do you want to create new planned activity?",
        updateIntensity: "Athlete's FTP may be different. Recalculate planned intensity (HR, Speed/pace, Power) from athlete's FTP?",

        // Операции с соревнованиями
        deleteActualCompetition: 'Delete competition? Every connected completed activity will be deleted. This action cannot be undone',


        // окно загрузки профиля
        upload: "Upload",
        choose: "Choose...",
        uploadFile: "Upload file",

        // план
        deleteTrainingPlan: "Do you want to delete training plan? This operation cannot be undone",
        deleteSelectedAssignment: "Delete training plan assignment? All incompleted activities will be deleted from athlete's calendar",
        unpublishTrainingPlan: "Remove training plan from store?",
        publishTrainingPlan: "Publish new traning plan version in Store?",

        // split and merge
        mergeActivity: "Merge planned and completed activity?",
        splitActivity: "Split activity into Planned and Completed?",

        omni: {
            title: 'Your question',
            userName: 'Full name',
            userEmail: 'E-mail address',
            subject: 'Subject',
            contentPlaceholder: 'Your question...',
            post: 'Send',
            confirm: "By clicking on the 'Send' button you agree with the <a href='https://legal.staminity.com/en/privacy.html'>Privacy Policy</a>"
        }


    },
};
