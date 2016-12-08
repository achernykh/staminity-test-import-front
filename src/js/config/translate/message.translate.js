export const _MESSAGE = {
    ru: {
        null: {
            title: 'Неопозднаная ошибка',
            text: 'Что-то пошло не так, мы уже знаем об этом. Ваша ошибка была отправлена на адрес support@staminity.com'
        },
        signupSuccess: { // в ответ на успешный /signup
            title: 'Поздравляем!',
            text: 'Ваша учетная запись создана'
        },
        confirmSuccess: { // в ответ на /confirm
            title: 'E-mail подтвержден',
            text: 'Ваша учетная запись активирована, e-mail подтвержден'
        },
        // это событие мы не реализовывали... Предлагаю и не делать, иначе придется делать логику "Отправить письмо-подтверждение повторно".
        confirmExpiredValidation: { // ошибка в момент перехода по устаревшей ссылке из письма по подтверждению email
            title: 'Ошибка!',
            text: 'Ваша учетная запись не активирована, истек период действия ссылки'
        },
        confirmInvalidValidation: { // ошибка в момент перехода по невалидной ссылке из письма по подтверждению email
            title: 'Ошибка!',
            text: 'Некорректная ссылка на подтверждение e-mail'
        },
        userIsAlreadyValidated: {
            title: 'Ошибка!',
            text: 'Почтовый адрес пользователя уже подтвержден. Используйте диалог восстановления пароля в случае утраты'
        },
        revalidationAccountSuccess: {
            title: 'Внимание!',
            text: 'Ссылка для подтверждения email выслана повторно'
        },
        signinBadUsernameOrPassword: {
            title: 'Ошибка!',
            text: 'Пользователь с таким e-mail и пароль не найден'
        },
        signinNotValidatedAccount: {
            title: 'Внимание!',
            text: 'E-mail не подтвержден. Для подтверждения перейдите по ссылке, направленной Вам в письме'
        },
        signinUserHaveActiveSession: {
            title: 'Внимание!',
            text: 'Вы уже вошли в сервис. Для входа с другими учетными данными необходимо выйти'
        },
        signupUserAlreadyExists: {
            title: 'Ошибка!',
            text: 'Пользователь с таким email уже существует'
        },
        badToken: { // токен для индентиифкации сессии не подтвержден сервером
            title: 'Ошибка!',
            text: 'Ваша пользовательская сессия устарела. Необходимо выйти и повторно войти в сервис'
        },
        userNotFound: { // заправшиваемый пользователь не найден
            title: 'Ошибка!',
            text: 'Пользователь не найден'
        },
        sendMailError: { // ошибка при отправке email
            title: 'Ошибка!',
            text: 'Ошибка отправки email-сообщения'
        },
        signoutSuccess: { // сообщение об успешной завершении пользовательской сессии
            title: 'Внимание!',
            text: 'Вы успешно вышли из системы'
        },
        unknownRequestType: { // оповещение о некорректном типе запроса через websocket-сессию
            title: 'Ошибка!',
            text: 'Некорректный тип запроса'
        },
        badProviderCode: { // передан некорректный код провайдера для синхронизации аккаунта
            title: 'Ошибка!',
            text: 'Некорректный код провайдера данных для синхронизации аккаунта'
        },
        badGroupMembershipRequest: { // передан некорректный идентификатор запроса на членство в группе
            title: 'Ошибка!',
            text: 'Некорректный идентификатор запроса по добавлению в группу'
        },
        userIsAlreadyGroupMember: { //
            title: 'Внимание!',
            text: 'Пользователь уже является членом данной группы пользователей'
        },
        pubInitialSynсRequestSuccess: {
            title: "Внимание!",
            text: "Запрос на начальную синхронизацию успешно размещен. Ожидайте оповещения о загрузке данных."
        },
        pubSynсRequestSuccess: {
            title: "Внимание!",
            text: "Запрос на синхронизацию данных успешно размещен. Ожидайте оповещения о загрузке данных."
        },
        expiredObject: {
            title: "Внимание!",
            text: "С момента начала редактирования объект был модифицирован" // возникает в случае сохранения изменений по объекту, основываясь не на последней его версии.
        },
        subscriptionCoachRequired: {
            title: "Внимание!",
            text: "Для выполнения текущего действия необходима подписка 'Тренер'"
        },
        forbiddenAction: {
            title: "Ошибка",
            text: "Недостаточно прав для выполнения операции"
        },
        // тарификация и биллинг
        successUnsubscribeTariff: {
            title: "Внимание!",
            text: "Запрос на отключение тарифа успешно обработан."
        },
        groupMyAthletesNotEmpty: {
            title: "Ошибка",
            text: "Необходимо очистить группу \"Мои атлеты\" перед отключением тренерского тарифа"
        },
        groupClubAthletesNotEmpty: {
            title: "Ошибка",
            text: "Необходимо очистить группу \"Атлеты клуба\" перед отключением клубного тарифа"
        }
    },
    en: {
        signupSuccess: { // в ответ на успешный /signup
            title: 'Congratulations!',
            text: 'Your account has been created'
        },
        confirmSuccess: { // в ответ на /confirm
            title: 'E-mail confirmed',
            text: 'Your account has been activated'
        },
        // это событие мы не реализовывали... Предлагаю и не делать, иначе придется делать логику "Отправить письмо-подтверждение повторно".
        confirmExpiredValidation: { // ошибка в момент перехода по устаревшей ссылке из письма по подтверждению email
            title: 'Error!',
            text: 'Your account is not activated, confirmation link is expired'
        },
        confirmInvalidValidation: { // ошибка в момент перехода по невалидной ссылке из письма по подтверждению email
            title: 'Error!',
            text: 'Incorrect e-mail confirmation link'
        },
        signinBadUsernameOrPassword: {
            title: 'Error!',
            text: 'The e-mail or password you entered is incorrect.'
        },
        signinNotValidatedAccount: {
            title: 'Warning!',
            text: 'Your account in not activated. Please check your e-mail and confirm your e-mail address'
        },
        signinUserHaveActiveSession: {
            title: 'Error!',
            text: 'You have already signed in. To Sign in with another credentials please Sign out'
        },
        signupUserAlreadyExists: {
            title: 'Error!',
            text: 'This email address is already taken'
        },
        badToken: { // токен для индентиифкации сессии не подтвержден сервером
            title: 'Error!',
            text: 'Your user session is expired. Please Sign out and Sign in'
        },
        userNotFound: { // заправшиваемый пользователь не найден
            title: 'Error!',
            text: 'User is not found'
        },
        sendMailError: { // ошибка при отправке email
            title: 'Error!',
            text: 'E-mail sending error'
        },
        signoutSuccess: { // сообщение об успешной завершении пользовательской сессии
            title: 'Sign out',
            text: 'You successfully signed out'
        },
        unknownRequestType: { // оповещение о некорректном типе запроса через websocket-сессию
            title: 'Error!',
            text: 'Incorrect request type'
        },
        badProviderCode: { // передан некорректный код провайдера для синхронизации аккаунта
            title: 'Error!',
            text: 'Incorrect data provider code to syncronize account'
        }
    }
}