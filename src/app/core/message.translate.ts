export const _translateMessage = {
	/*
	 * Переводы сообщений используются как для системных сообщений в виде шторки, так и для пользовательских сообщений в
	 * в виде toast. Одно и тоже сообщение может использоваться
     */

	ru: {
		null: {
			title: 'Неопознанная ошибка',
			text: 'Что-то пошло не так. Попробуйте повторить действие'
		},

		// SETTINGS-USER ------------------------------------------------------
		settingsSaveComplete: { // после успешного сохранения настроек
			title: '',
			text: 'Изменения настроек сохранены'
		},
		updateAvatar: { // после успешной загрузки аватара пользователя
			title: '',
			text: 'Новое изображение в профиле загружено'
		},
		updateBackgroundImage: { // после успешной загрузки фонового изображения
			title: '',
			text: 'Новое фоновое изображение загружено'
		},
		setPasswordSuccess: { // после успешного изменения пароля
			title: '',
			text: 'Пароль успешно изменен'
		},
		setPasswordError: { // после ошибки в изменении пароля
			title: '',
			text: 'Изменить пароль не удалось'
		},
		duplicateUserProfileURI: { // ошибка от бэка при сохранении изменений настроек
			title: '',
			text: 'Изменения не сохранены. Выбранный псевдоним для профиля (uri) уже используется'
		},
		badPasswordString: { // ошибка от бэка при изменении пароля
			title: '',
			text: 'Изменить пароль не удалось, неверно указан пароль'
		},
		/* отключил блок сообщений, сейчас достаточно "Изменения настроек сохранены"
		pubInitialSyncRequestSuccess: { //после успешного подключения начальной синхронизации
			title: "Внимание!",
			text: "Отправлен запрос на начальную синхронизацию тренировок. Ожидайте оповещения о завершении загрузки"
		},
		pubSyncRequestSuccess: { // после успешного повторного включения синхронизации
			title: "Внимание!",
			text: "Отправлен запрос на синхронизацию тренировок. Ожидайте оповещения о завершении загрузки"
		},
		pubSyncRequestSuccess: { // после успешного повторного включения синхронизации
			title: "Внимание!",
			text: "Отправлен запрос на синхронизацию тренировок. Ожидайте оповещения о завершении загрузки"
		}, */

		badProviderCode: { // ошибка от бэка. Передан некорректный код провайдера для синхронизации аккаунта
			title: 'Ошибка!',
			text: 'Некорректный код провайдера для подключения синхронизации. Обратитесь в поддержку'
		},
		badProviderUsernameOrPassword: { //  указаны неправильное имя или пароль для провайдера
			title: '',
			text: 'Невозможно подключить синхронизацию: неправильное имя или пароль'
		},
		forbidden_DuplicateExternalAccountBinding: { // Попытка подключения аккаунта, который уже подключен к другому пользователю
			title: 'Ошибка!',
			text: 'Этот аккаунт уже подключен к другому пользователю. Подключите другой'
		},

		// SETTINGS-CLUB ------------------------------------------------------
		settingsClubSaveComplete: { // после успешного сохранения изменений в профиле клуба
			title: '',
			text: 'Изменения профиля клуба сохранены'
		},
		updateClubAvatar: { // после успешной загрузки аватара клуба
			title: '',
			text: 'Новое изображение в профиле клуба загружено'
		},
		updateclubBackgroundImage: { // после успешной загрузки фонового изображения
			title: '',
			text: 'Новое фоновое изображение профиля клуба загружено'
		},
		duplicateUserGroupUri: { // указан uri, который уже используется
			title: 'Внимание!',
			text: 'Изменения не сохранены. Указано имя профиля (uri), которое уже используется'
		},
		forbiddenUriFormat: { // указан uri в неправильном формате
			title: 'Внимание!',
			text: 'Изменения не сохранены. Неверный формат краткого имени (uri)'
		},
		duplicateGroupProfileURI: { // указан uri, который уже используется
			title: 'Внимание!',
			text: 'Изменения не сохранены. Указано имя профиля (uri), которое уже используется'
		},

		//-------- SIGNUP -----------------------------------------------------
		signupSuccess: { // в ответ на успешный /signup
			title: 'Поздравляем',
			text: 'Ваша учетная запись создана, необходимо подтвердить ее'
		},
		confirmSuccess: { // в ответ на /confirm
			title: 'Электронная почта подтверждена',
			text: 'Ваша учетная запись активирована, адрес электронной почты подтвержден'
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
		userIsAlreadyValidated: { // пользователь пытается валидировать аккаунт, который уже подтвержден
			title: 'Ошибка!',
			text: 'Почтовый адрес пользователя уже подтвержден'
		},
		revalidationAccountSuccess: {
			title: 'Внимание!',
			text: 'Ссылка для подтверждения email выслана повторно'
		},
		unconfirmedEmailAddress: {
			title: 'Ошибка!',
			text: 'Информация об email пользователя конфиденциальна во внешнем сервисе. Сделайте информацию доступной или выберите другой способ входа в наш сервис'
		},
		userCancelOAuth: {
			title: '',
			text: 'Вы прервали регистрацию во внешнем сервисе'
		},
		unavailableEmailAddress: {
			title: 'Ошибка!',
			text: 'Информация об email пользователя конфиденциальна во внешнем сервисе. Сделайте информацию доступной или выберите другой способ входа в наш сервис'
		},
		//------ SIGN IN --------------------
		signinBadUsernameOrPassword: { //  ошибка от бэка после входа с неверными именем/паролем
			title: 'Ошибка!',
			text: 'Пользователь с таким e-mail и пароль не найден'
		},
		signinNotValidatedAccount: { // ошибка от бэка, вход неподтвержденного пользователя
			title: 'Внимание!',
			text: 'E-mail не подтвержден. Для подтверждения перейдите по ссылке, направленной Вам в письме'
		},
		/*
		signinUserHaveActiveSession: {
			title: 'Внимание!',
			text: 'Вы уже вошли в сервис. Для входа с другими учетными данными необходимо выйти'
		}, */
		signupUserAlreadyExists: { // ошибка при попытке регистрации пользователя от бэка
			title: 'Ошибка!',
			text: 'Пользователь с таким email уже существует'
		},
		badToken: { // токен для индентиифкации сессии не подтвержден сервером
			title: 'Ошибка!',
			text: 'Ваша пользовательская сессия устарела. Необходимо выйти и повторно войти в сервис'
		},
		userNotFound: { // в ответ на getValidationToken. заправшиваемый пользователь не найден
			title: 'Ошибка!',
			text: 'Пользователь не найден'
		},
		sendMailError: { // ошибка при отправке email
			title: 'Ошибка!',
			text: 'Ошибка отправки email-сообщения'
		},

		// --------------- SIGN OUT ---------------
		signoutSuccess: { // сообщение об успешной завершении пользовательской сессии
			title: '',
			text: 'Вы успешно вышли из системы'
		},


		// ------------- CORE SYSTEM --------

		unknownRequestType: { // оповещение о некорректном типе запроса через websocket-сессию
			title: 'Ошибка!',
			text: 'Некорректный тип запроса'
		},
		expiredObject: {
			title: "Внимание!",
			text: "Кто-то внес изменения до того, как вы нажали на 'Сохранить'. Обновите страницу" // возникает в случае сохранения изменений по объекту, основываясь не на последней его версии.
		},
		/*
		subscriptionCoachRequired: {
			title: "Внимание!",
			text: "Недостаточно прав для выполнения операции. Необходим тариф 'Тренер'"
		},*/
		forbidden_InsufficientAction: {
			title: "Ошибка",
			text: "Недостаточно прав для выполнения операции"
		},
		forbidden_InsufficientRights: {
			title: "Ошибка",
			text: "Невозможно выполнить операцию, недостаточно прав"
		},
		unAuthorized: {
			title: "Ошибка",
			text: "Невозможно получить детальные данные по тренировке, ошибка авторизации"
		},

		// -------- Measurement --------
		measurementCreated: {
			title: "",
			text: "Создано новое измерение"
		},
		measurementUpdated: {
			title: "",
			text: "Измерение изменено"
		},
		measurementDeleted: {
			title: "",
			text: "Измерение удалено"
		},

		// -------- Activity --------
		activityCreated: {
			title: "",
			text: "Создана новая тренировка"
		},
		activityCopied: {
			title: "",
			text: "Тренировка скопирована"
		},
		activityMoved: {
			title: "",
			text: "Тренировка перемещена"
		},
		activityUpdated: {
			title: "",
			text: "Тренировка изменена"
		},
		activityDeleted: {
			title: "",
			text: "Тренировка удалена"
		},
		activityFactDeleted: { // когда прошло удаление детального факта в тренировке, параметр mode: 'D'
			title: "",
			text: "Фактические данные в тренировке удалены"
		},
		itemsDeleted:{
			title: "",
			text: "Записи удалены"
		},
		itemsCopied:{
			title: "",
			text: "Записи скопированы"
		},
		itemsPasted:{
			title: "",
			text: "Скопированные записи вставлены"
		},
		nonexistentActivity: { // неверный идентификатор в удаляемой тренировке
			title: "",
			text: "Невозможно удалить тренировку, неизвестный идентификатор"
		},
		unknownActivity: { // неправильный код тренировки
			title: "",
			text: "Операцию выполнить невозможно, неверный код тренировки"
		},
		activityNotFound: { // тренировка не найдена
			title: "",
			text: "Код тренировки не найден"
		},
		badInputTimestampRange: { // неверно передан диапазон timeStamp
			title: "",
			text: "Неверно определен диапазон временных отметок для расчета отрезка тренировки"
		},
		activityDetailedDataNotFound: { // не найдены детальные данные по тренировке
			title: "",
			text: "Не найдены детальные фактические данные по тренировке"
		},
		itemCreatedByOtherUser: { // не найдены детальные данные по тренировке
			title: "",
			text: "Операция невозможна, запись создана другим пользователем"
		},

		// -------- CalendarItem actiions: copy, paste, cut, drag&drop --------
		calendarItemCopy: { //
			title: "",
			text: "Записи скопированы"
		},
		calendarItemPaste: { //
			title: "",
			text: "Записи добавлены"
		},
		calendarItemDragAndDrop: { //
			title: "",
			text: "Записи перемещены"
		},
		calendarItemCut: { //
			title: "",
			text: "Записи вырезаны и скопированы в буфер обмена"
		},


		// -------- Запросы и групповые операции ---------
		requestSent: { // отправить запрос из профиля пользователя, из профиля клуба
			title: "",
			text: "Операция выполнена" // сделал такую нейтральную формулировку, т.к. есть запросы, требующие согласования, а есть например выход из клуба, который не требует согласования
		},
		requestComplete: {
			title: "",
			text: "Операция выполнена"
		},
		requestCancelled: { // пользователь отменил свой запрос из профиля или в реестре исходящих запросов
			title: "",
			text: "Ваш запрос отменен"
		},
		requestAccepted: { // в реестре запросов пользователь принял входящий запрос
			title: "",
			text: "Запрос принят"
		},
		requestDeclined: { // в реестре запросов пользователь отклонил входящий запрос
			title: "",
			text: "Запрос отклонен"
		},
		badGroupMembershipRequest: { // передан некорректный идентификатор запроса на членство в группе
			title: 'Ошибка!',
			text: 'Некорректный идентификатор запроса по добавлению в группу'
		},
		unknownGroupIdentifier: { // в ответ на запрос включения в группу
			title: "",
			text: "Неизвестный идентификатор группы"
		},
		userIsAlreadyGroupMember: { // в ответ на запрос включения в группу
			title: "",
			text: "Пользователь уже является членом данной группы"
		},
		forbidden_YouAreNotGroupManager: { // в ответ на запрос включения в группу
			title: "",
			text: "Операция невозможна, вы не администратор группы"
		},
		forbidden_joinOnlyByGroupManager: { // в ответ на запрос включения в группу
			title: "",
			text: "Операция невозможна, добавить новых членов в группу может только администратор группы"
		},
		duplicateGroupMembership: { // в ответ на запрос включения в группу
			title: "",
			text: "Пользователь уже является членом данной группы"
		},

		// -------- Управление спортсменами тренера (/athletes) ---------
		athletesDisconnected: { // тренер отключил спортсмена
			title: "",
			text: "Спортсмен(ы) отключен(ы) от вас"
		},
		coachTariffsChanged: { // изменено подключение тарифов за счет тренера
			title: "",
			text: "Изменены тарифные планы для ваших спортсменов"
		},


		// -------- Управление членами клуба (/management/clubUri) ---------
		clubMembersDisconnected: { // член клуба исключен из клуба
			title: "",
			text: "Член(ы) клуба исключен(ы) из клуба"
		},
		clubRolesChanged: { // роли изменены
			title: "",
			text: "Изменены роли выбранных членов клуба"
		},
		clubTariffsChanged: { // изменены тарифы
			title: "",
			text: "Изменены тарифные планы для выбранных членов клуба"
		},
		clubCoachesChanged: { // Изменено назначение тренеров
			title: "",
			text: "Изменено назначение тренеров для членов клуба"
		},
		forbidden_YouMustHaveMembershipInManagementGroup: { // Открытие /management
			title: "",
			text: "Операция невозможна. Вы должны быть менеджером или администратором клуба"
		},
		forbidden_OnlyClubManagerCanManageThisGroup: { // в ответ на запрос включения в группу
			title: "",
			text: "Операция невозможна. Вы должны быть менеджером или администратором клуба"
		},
		duplicateCoachAthleteRelation: { // в ответ на запрос включения в группу
			title: "Внимание!",
			text: "Операция невозможна. Тренер и спортсмен уже связаны между собой"
		},
		forbidden_CoachingYourself: { // назначить себя тренером для себя
			title: "Внимание!",
			text: "Операция невозможна. Вы не можете быть тренером для себя"
		},
		forbidden_ManagerCannotLeaveClub: { // менеджер исключает себя из клуба
			title: "Внимание!",
			text: "Менеджер клуба не может выйти из клуба"
		},
		forbidden_LeaveClubManagementGroupFirst: { // ошибка, если администратору клуба отключается роль Тренер, а Админ остается
			title: "Внимание!",
			text: "Операция невозможна. Нельзя отключить роль 'Тренер' у администратора клуба"
		},

		// -------- Тарификация и биллинг ----------
		badPromoCodeString: {
			title: "",
			text: "Промо-код неверный"
		},
		rateNotFound: {
			title: "",
			text: "Ставка по тарифу не найдена"
		},
		billNotFound: {
			title: "",
			text: "Счет не найден"
		},
		unknownPaymentIdentifier: {
			title: "",
			text: "Неизвестный идентификатор платежа"
		},
		unknownTariffIdentifier: {
			title: "",
			text: "Неизвестный идентификатор тарифа"
		},
		TariffNotFound: {
			title: "",
			text: "Тариф не найден"
		},
		successUnsubscribeTariff: {
			title: "Внимание!",
			text: "Запрос на отключение тарифа успешно обработан."
		},
		groupMyAthletesNotEmpty: {
			title: "Ошибка",
			text: "Отключите спортсменов от себя до отключения тарифа 'Тренер'"
		},
		groupClubAthletesNotEmpty: {
			title: "Ошибка",
			text: "Необходимо очистить группу 'Атлеты клуба' перед отключением клубного тарифа"
		},
		// Поиск
		searchResult: {
			title: 'Информация',
			text: 'Найдено {{count}} записей'
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
};