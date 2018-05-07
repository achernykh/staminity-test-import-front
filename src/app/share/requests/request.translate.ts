export let translateRequestPanel = {
    ru: {
        title: "Запросы",
        inbox: "Входящие",
        outbox: "Исходящие",
        waiteApprove: "Ожидают подтверждения",
        noRequest: "Нет запросов",
        accept: "Принять",
        reject: "Отклонить",
        history: "История",
        more: "Загрузить еще",
        "JoinClubByUser": {
            action: "Вступить в клуб",
            A: {
                title: "Принять запрос",
                text: "Принять запрос от пользователя на вступление в клуб?",
                confirm: "Принять",
                cancel: "Отмена",
            },
            D: {
                title: "Отклонить запрос",
                text: "Отклонить запрос от пользователя на вступление в клуб?",
                confirm: "Отклонить",
                cancel: "Отмена",
            },
            C: {
                title: "Отменить запрос",
                text: "Отменить запрос на вступление в клуб?",
                confirm: "Да",
                cancel: "Нет",
            },
        },
        "JoinClubByClub": {
            action: "Вступить в клуб",
            A: {
                title: "Принять запрос",
                text: "Принять запрос от клуба на вступление в клуб?",
                confirm: "Принять",
                cancel: "Отмена",
            },
            D: {
                title: "Отклонить запрос",
                text: "Отклонить запрос от клуба на вступление в клуб?",
                confirm: "Отклонить",
                cancel: "Отмена",
            },
            C: {
                title: "Отменить приглашение",
                text: "Отменить приглашение пользователю на вступление в клуб?",
                confirm: "Да",
                cancel: "Нет",
            },
        },
        "StartCoachingByAthlete": {
            action: "Подключиться к тренеру",
            A: {
                title: "Принять запрос",
                text: 'Принять запрос от спортсмена? От количества ваших учеников рассчитывается сумма ежедневных начислений по <a href="https://help.staminity.com/ru/tariffs/coach.html" target="_blank" >тарифному плану "Тренер"</a>.',
                confirm: "Принять",
                cancel: "Отмена",
            },
            D: {
                title: "Отклонить запрос",
                text: "Отклонить запрос от спортсмена?",
                confirm: "Отклонить",
                cancel: "Отмена",
            },
            C: {
                title: "Отменить запрос",
                text: "Отменить запрос тренеру?",
                confirm: "Да",
                cancel: "Нет",
            },
        },
        "StartCoachingByCoach": {
            action: "Подключиться к тренеру",
            A: {
                title: "Принять запрос",
                text: "Принять запрос от тренера? Тренер получит доступ к вашему календарю и сможет планировать тренировки",
                confirm: "Принять",
                cancel: "Отмена",
            },
            D: {
                title: "Отклонить запрос",
                text: "Отклонить запрос от тренера? Тренер не сможет видеть ваш календарь и планировать тненировки для вас",
                confirm: "Отклонить",
                cancel: "Отмена",
            },
            C: {
                title: "Отменить запрос",
                text: "Отменить запрос спортсмену?",
                confirm: "Да",
                cancel: "Нет",
            },
        },
        "JoinFriends": {
            action: "Принять запрос",
            A: {
                title: "Принять запрос",
                text: "Принять запрос на добавление в друзья?",
                confirm: "Принять",
                cancel: "Отмена",
            },
            D: {
                title: "Отклонить запрос",
                text: "Отклонить запрос на добавление в друзья?",
                confirm: "Отклонить",
                cancel: "Отмена",
            },
            C: {
                title: "Отменить запрос",
                text: "Отменить запрос на добавление в друзья?",
                confirm: "Да",
                cancel: "Нет",
            },
        },
        "leaveClubCoach": {
            action: "Выйти из клуба",
            A: {
                title: "Принять запрос",
                text: "Принять запрос от тренера на выход из клуба? Если у тренера есть ученики в клубе, отключите их до того, как принять запрос",
                confirm: "Принять",
                cancel: "Отмена",
            },
            D: {
                title: "Отклонить запрос",
                text: "Отклонить запрос от тренера на выход из клуба?",
                confirm: "Отклонить",
                cancel: "Отмена",
            },
            C: {
                title: "Отменить запрос",
                text: "Отменить запрос на выход из клуба?",
                confirm: "Да",
                cancel: "Нет",
            },
        }
    },
    en: {
        title: "Requests",
        inbox: "Incoming",
        outbox: "Outcoming",
        waiteApprove: "Need approval",
        noRequest: "No requests",
        accept: "Accept",
        reject: "Decline",
        history: "History",
        more: "More",
        "JoinClubByUser": {
            action: "Join club",
            A: {
                title: "Accept request",
                text: "Accept join club request?",
                confirm: "Accept",
                cancel: "Cancel"
            },
            D: {
                title: "Decline request",
                text: "Decline join club request?",
                confirm: "Decline",
                cancel: "Cancel"
            },
            C: {
                title: "Cancel request",
                text: "Cancel join club request?",
                confirm: "Yes",
                cancel: "No"
            },
        },
        "JoinClubByClub": {
            action: "Join club",
            A: {
                title: "Accept invitation",
                text: "Accept club invitation to join club?",
                confirm: "Accept",
                cancel: "Cancel",
            },
            D: {
                title: "Decline invitation",
                text: "Decline club invitation to join club?",
                confirm: "Decline",
                cancel: "Cancel",
            },
            C: {
                title: "Cancel invitation",
                text: "Cancel join club invitation?",
                confirm: "Yes",
                cancel: "No",
            },
        },
        "StartCoachingByAthlete": {
            action: "Connect with coach",
            A: {
                title: "Accept request",
                text: 'Accept start coaching request from athlete? Your daily accruals in your bill is based on connected athletes amount',
                confirm: "Accept",
                cancel: "Cancel",
            },
            D: {
                title: "Decline request",
                text: "Decline request from new athlete?",
                confirm: "Decline",
                cancel: "Cancel",
            },
            C: {
                title: "Cancel request",
                text: "Cancel start coaching request?",
                confirm: "Yes",
                cancel: "No",
            },
        },
        "StartCoachingByCoach": {
            action: "Connect with coach",
            A: {
                title: "Accept coach invitation",
                text: "Accept invitation from coach? The coach will be able to edit your workout calendar and create a new planned activities for you",
                confirm: "Accept",
                cancel: "Cancel",
            },
            D: {
                title: "Decline coach invitation",
                text: "Decline invitation from coach? The coach will not be able to view your calendar and create new plan for you.",
                confirm: "Decline",
                cancel: "Cancel",
            },
            C: {
                title: "Cancel invitation",
                text: "Cancel your invitation to athlete?",
                confirm: "Yes",
                cancel: "No",
            },
        },
        "JoinFriends": {
            action: "Accept request",
            A: {
                title: "Accept request",
                text: "Accept friend requests?",
                confirm: "Accept",
                cancel: "Cancel",
            },
            D: {
                title: "Decline request",
                text: "Decline friend request?",
                confirm: "Decline",
                cancel: "Cancel",
            },
            C: {
                title: "Cancel request",
                text: "Cancel friend request?",
                confirm: "Yes",
                cancel: "No",
            },
        },
        "leaveClubCoach": {
            action: "Leave club",
            A: {
                title: "Accept request",
                text: "Accept leave club request from club coach? Disconnect club athletes from coach before acceptance",
                confirm: "Accept",
                cancel: "Cancel",
            },
            D: {
                title: "Decline request",
                text: "Decline leave club request from club coach?",
                confirm: "Decline",
                cancel: "Cancel",
            },
            C: {
                title: "Cancel request",
                text: "Cancel your leave club request?",
                confirm: "Yes",
                cancel: "No",
            }
        }
    }
};
