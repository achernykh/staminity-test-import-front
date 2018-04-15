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
		// CORE
		internetConnectionLost: {
			title: 'Ошибка',
			text: 'Связь с сервером потеряна. Проверьте доступность сети интернет'
		},
		timeoutExceeded: {
			title: 'Ошибка',
			text: 'Превышено время ожидания ответа на запрос. Попробуйте обновить окно браузера'
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
		mailSendingError: { // Ошибка отправки письма
			title: 'Ошибка!',
			text: 'Невозможно отправить письмо. Обратитесь в поддержку'
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
			text: 'Вход невозможен, e-mail не подтвержден. Подтвердите e-mail или выберите другой способ входа в сервис'
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
		resetPasswordSuccess: {
			title: '',
			text: 'На ваш адрес e-mail отправлена ссылка для восстановления пароля'
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

		// -------- Event --------
		eventCreated: {
			title: "",
			text: "Создано новое событие"
		},
		eventUpdated: {
			title: "",
			text: "Событие изменено"
		},
		eventDeleted: {
			title: "",
			text: "Событие удалено"
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
		errorResponseTrainingZones: {
			title: '',
			text: 'Ошибка получения тренировочных зон ученика. Обновите окно браузера и попробуйте еще раз'
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
		forbiddenAction_postCalendarItem: { //
			title: "",
			text: "Невозможно создать запись в календаре, недостаточно прав"
		},

		// -------- Категории и шаблоны ---------

		activityTemplateCreated: {
			title: "",
			text: "Шаблон сохранен"
		},
        forbidden_ExistsRelatedActivity: {
            title: "Операция невозможна",
            text: "Есть связанные тренировки, удаление невозможно"
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
		inviteSuccess: { // тренер отправил запрос на подключение для новых пользователей сервиса
			title: "",
			text: "Приглашения новым пользователям успешно отправлены"
		},
		forbidden_cannotConnectToCoach_coachTariffRequired: {
			title: "Ошибка",
			text: "Невозможно подключиться к тренеру. У тренера не подключен тариф 'Тренер'"
		},
		forbidden_cannotConnectToAthlete_coachTariffRequired: {
			title: "Ошибка",
			text: "Невозможно принять запрос от спортсмена. Не подключен тариф 'Тренер'"
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
		forbidden_CoachHasAthletesInThisClub: { // ошибка, если отключается роль "Тренер" у тренера, у которого в клубе есть спортсмены, либо если тренер с учениками исключается из клуба
			title: "Ошибка!",
			text: "Операция невозможна, у тренера есть ученики в клубе. Отключите учеников и повторите попытку"
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
		},

		// ----- Периодизация

        periodizationMesocycleEdited: {
            title: '',
            text: 'Мезоцикл изменен'
        },
        periodizationMesocyclePosted: {
            title: '',
            text: 'Мезоцикл добавлен'
        },
        mesocycleDeleted: {
            title: '',
            text: 'Мезоцикл удален'
        },
        periodizationSchemePosted: {
            title: '',
            text: 'Добавлена новая схема периодизации'
        },
        periodizationSchemeEdited: {
            title: '',
            text: 'Схема периодизации изменена'
        },
        periodizationSchemeDeleted: {
            title: '',
            text: 'Схема периодизации удалена'
        },

        // ----- Планы на сезон
        trainingSeasonDeleted: {
            title: '',
            text: 'План на сезон удален'
        },
        trainingSeasonCreated: {
            title: '',
            text: 'Создан новый план на сезон'
        },
        trainingSeasonEdited: {
            title: '',
            text: 'План на сезон изменен'
        },
        // ----- Планы на сезон
        competitionCreated: {
            title: '',
            text: 'Соревнование создано'
        },
        competitionModified: {
            title: '',
            text: 'Соревнование изменено'
        },
        competitionDeleted: {
            title: '',
            text: 'Соревнование удалено'
        },
        // ----- Records
        recordCreated: {
            title: '',
            text: 'Создано новое событие'
        },
        recordUpdated: {
            title: '',
            text: 'Событие изменено'
        },
        recordDeleted: {
            title: '',
            text: 'Событие удалено'
        },
        trainingPlanDeleted: {
            title: '',
            text: 'Тренировочный план удален'
        },
        forbidden_PlanHasAssignmentsOrPurchases: {
            title: '',
            text: 'Тренировочный план удалить нельзя, есть присвоения или покупки плана'
        },
        assignmentDeleted: {
            title: '',
            text: 'Присвоение удалено'
        },
        mergeActivitiesWithDistinctDays: {
            title: '',
            text: 'Объединение тренировок за разные даты невозможно'
        },
        moveSpecifiedItem: {
            title: '',
            text: 'Перенести выполненную тренировку невозможно'
        },
        needOnlyOneSpecifiedActivity: {
            title: '',
            text: 'Объединение двух тренировок c планом невозможно'
        },
        needOnlyOneCompletedActivity: {
            title: '',
            text: 'Объединение двух выполненных тренировок невозможно'
        },
        dbGetDataError: {
            title: '',
            text: 'Операция невозможна: dbGetDataError'
        },
        activityMerged: {
            title: '',
            text: 'Тренировки объединены'
        },
        activitySplited: {
            title: '',
            text: 'Тренировки разделены'
        },
        badActivityIdFirstIdentifier: {
            title: '',
            text: 'Объединение невозможно: некорректный идентификатор 1 тренировки'
        },
        badActivityIdSecondIdentifier: {
            title: '',
            text: 'Объединение невозможно: некорректный идентификатор 2 тренировки'
        },
        bothItemsHavePlanData: {
            title: '',
            text: 'Объединение невозможно: в обеих тренировках есть план'
        },
        bothItemsHaveActualData: {
            title: '',
            text: 'Объединение невозможно: в обеих тренировках есть факт'
        },
        differentBasicActivityTypes: {
            title: '',
            text: 'Объединение невозможно: различные виды спорта в тренировках'
        },
        errorCompleteIntervals: {
            title: '',
            text: 'Ошибка получения детальных данных: errorCompleteIntervals. Попробуйте обновить окно браузера'
        },
        differentUsersForbidden: {
            title: '',
            text: 'Объединение невозможно: различные пользователи'
        },
        actualDataNotFound: {
            title: '',
            text: 'Объединение невозможно: не найдены фактические данные'
        },
        plannedDataNotFound: {
            title: '',
            text: 'Объединение невозможно: не найдены плановые данные'
        },
        trainingPlanPublishSuccess: {
            title: '',
            text: 'Тренировочный план опубликован в магазине'
        },
        trainingPlanUnpublishSuccess: {
            title: '',
            text: 'Публикация плана отменена'
        }

    },
	en: {
		null: {
			title: 'Unknown error',
			text: 'Something went wrong. Please try again'
		},
		// CORE
		internetConnectionLost: {
			title: 'Error',
			text: 'Internet connection lost. Please check connection settings'
		},
		timeoutExceeded: {
			title: 'Error',
			text: 'Timeout exceeded. Try to refresh browser window'
		},
		// SETTINGS-USER ------------------------------------------------------
		settingsSaveComplete: { // после успешного сохранения настроек
			title: '',
			text: 'Settings have been updated'
		},
		updateAvatar: { // после успешной загрузки аватара пользователя
			title: '',
			text: 'New image has been uploaded'
		},
		updateBackgroundImage: { // после успешной загрузки фонового изображения
			title: '',
			text: 'New background image has been uploaded'
		},
		setPasswordSuccess: { // после успешного изменения пароля
			title: '',
			text: 'Password has been successfully changed'
		},
		setPasswordError: { // после ошибки в изменении пароля
			title: '',
			text: 'Password has not changed'
		},
		duplicateUserProfileURI: { // ошибка от бэка при сохранении изменений настроек
			title: 'Error',
			text: 'Please choose another shortname (uri) for your profile. Settings have not been saved'
		},
		badPasswordString: { // ошибка от бэка при изменении пароля
			title: 'Error',
			text: 'Password strings does not match. Please check and try again'
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
			title: 'Error',
			text: 'Incorrect provided code. Please contact support'
		},
		badProviderUsernameOrPassword: { //  указаны неправильное имя или пароль для провайдера
			title: '',
			text: 'Wrong username or password. Please check and try again'
		},
		forbidden_DuplicateExternalAccountBinding: { // Попытка подключения аккаунта, который уже подключен к другому пользователю
			title: 'Error',
			text: 'Account you try to connect is already connected to another Staminity user'
		},
		mailSendingError: { // Ошибка отправки письма
			title: 'Error',
			text: 'Cannot send an email. Please contact support'
		},

		// SETTINGS-CLUB ------------------------------------------------------
		settingsClubSaveComplete: { // после успешного сохранения изменений в профиле клуба
			title: '',
			text: 'Club profile has been changed'
		},
		updateClubAvatar: { // после успешной загрузки аватара клуба
			title: '',
			text: 'New image has beed uploaded'
		},
		updateclubBackgroundImage: { // после успешной загрузки фонового изображения
			title: '',
			text: 'New background image has beed uploaded'
		},
		duplicateUserGroupUri: { // указан uri, который уже используется
			title: 'Attention',
			text: 'Profile has not been changed. Please use another URI (shortname) for your profile'
		},
		forbiddenUriFormat: { // указан uri в неправильном формате
			title: 'Attention',
			text: 'Profile has not been changed. Wrong URI (shortname). Please use english letters and digits'
		},
		duplicateGroupProfileURI: { // указан uri, который уже используется
			title: 'Attention',
			text: 'Profile has not been changed. Please use another URI (shortname) for your profile'
		},

		//-------- SIGNUP -----------------------------------------------------
		signupSuccess: { // в ответ на успешный /signup
			title: 'Contratulations',
			text: 'Your account has been created. Please check your email to continue'
		},
		confirmSuccess: { // в ответ на /confirm
			title: 'E-mail confirmation',
			text: 'Your account has been activated'
		},
		// это событие мы не реализовывали... Предлагаю и не делать, иначе придется делать логику "Отправить письмо-подтверждение повторно".
		confirmExpiredValidation: { // ошибка в момент перехода по устаревшей ссылке из письма по подтверждению email
			title: 'Attention',
			text: 'Confirmation link has been expired'
		},
		confirmInvalidValidation: { // ошибка в момент перехода по невалидной ссылке из письма по подтверждению email
			title: 'Error',
			text: 'Incorrect confirmation link. Please contact support'
		},
		userIsAlreadyValidated: { // пользователь пытается валидировать аккаунт, который уже подтвержден
			title: 'Attention',
			text: 'E-mail has been already confirmed'
		},
		revalidationAccountSuccess: {
			title: '',
			text: 'New confirmation e-mail has been sent'
		},
		unconfirmedEmailAddress: {
			title: 'Error!',
			text: 'Your email address has not confirmed '
		},
		userCancelOAuth: {
			title: '',
			text: 'Login via external service has been cancelled'
		},
		unavailableEmailAddress: {
			title: 'Error',
			text: 'We cannot get your e-mail address. Please allow us to use your e-mail address information or choose another method to login'
		},
		//------ SIGN IN --------------------
		signinBadUsernameOrPassword: { //  ошибка от бэка после входа с неверными именем/паролем
			title: 'Error',
			text: 'Invalid username or password'
		},
		signinNotValidatedAccount: { // ошибка от бэка, вход неподтвержденного пользователя
			title: 'Attention',
			text: 'E-mail address has not been confrimed. Please check your e-mail and follow the instructions in account activation letter'
		},
		/*
		 signinUserHaveActiveSession: {
		 title: 'Внимание!',
		 text: 'Вы уже вошли в сервис. Для входа с другими учетными данными необходимо выйти'
		 }, */
		signupUserAlreadyExists: { // ошибка при попытке регистрации пользователя от бэка
			title: 'Error',
			text: 'User with this email already exists'
		},
		badToken: { // токен для индентиифкации сессии не подтвержден сервером
			title: 'Error',
			text: 'Your session is expired. Please log in'
		},
		userNotFound: { // в ответ на getValidationToken. заправшиваемый пользователь не найден
			title: 'Error',
			text: 'User is not found'
		},
		sendMailError: { // ошибка при отправке email
			title: 'Error',
			text: 'Email sending error'
		},
/*		forbidden_ProcessIncomplete_ResetPassword: {
			title: 'Attention',
			text: 'По вашей учетной записи запущена процедура восстановления пароля. Вход с использование старого логина и пароля не возможен.'
		},*/
		resetPasswordSuccess: {
			title: '',
			text: 'Please check your email for recovery password letter'
		},

		// --------------- SIGN OUT ---------------
		signoutSuccess: { // сообщение об успешной завершении пользовательской сессии
			title: '',
			text: 'You have successfully signed out'
		},


		// ------------- CORE SYSTEM --------

		unknownRequestType: { // оповещение о некорректном типе запроса через websocket-сессию
			title: 'Error',
			text: 'Unknown request type'
		},
		expiredObject: {
			title: "Attention",
			text: "The object you edited was changed by someone. Please refresh the page" // возникает в случае сохранения изменений по объекту, основываясь не на последней его версии.
		},
		/*
		 subscriptionCoachRequired: {
		 title: "Внимание!",
		 text: "Недостаточно прав для выполнения операции. Необходим тариф 'Тренер'"
		 },*/
		forbidden_InsufficientAction: {
			title: "Error",
			text: "You dont't have enough rights (insufficient action)"
		},
		forbidden_InsufficientRights: {
			title: "Error",
			text: "You dont't have enough rights (insufficient rights)"
		},
		unAuthorized: {
			title: "Error",
			text: "Authorization error. Please sign in"
		},

		// -------- Measurement --------
		measurementCreated: {
			title: "",
			text: "New measurement has been created"
		},
		measurementUpdated: {
			title: "",
			text: "The measurement has been updated"
		},
		measurementDeleted: {
			title: "",
			text: "The measurement has been deleted"
		},

		// -------- Event --------
		eventCreated: {
			title: "",
			text: "New event has been created"
		},
		eventUpdated: {
			title: "",
			text: "The event has been updated"
		},
		eventDeleted: {
			title: "",
			text: "The event has been deleted"
		},
		// -------- Activity --------
		activityCreated: {
			title: "",
			text: "New activity has been created"
		},
		activityCopied: {
			title: "",
			text: "The activity has been copied"
		},
		activityMoved: {
			title: "",
			text: "The activity has been moved"
		},
		activityUpdated: {
			title: "",
			text: "The activity has been updated"
		},
		activityDeleted: {
			title: "",
			text: "The measurement has been deleted"
		},
		activityFactDeleted: { // когда прошло удаление детального факта в тренировке, параметр mode: 'D'
			title: "",
			text: "Activity actual data has been deleted"
		},
		itemsDeleted:{
			title: "",
			text: "Calendar items have been deleted"
		},
		itemsCopied:{
			title: "",
			text: "Calendar items have been copied"
		},
		itemsPasted:{
			title: "",
			text: "Calendar items have been pasted"
		},
		nonexistentActivity: { // неверный идентификатор в удаляемой тренировке
			title: "",
			text: "The activity cannot be deleted, insufficient id"
		},
		unknownActivity: { // неправильный код тренировки
			title: "",
			text: "Unknown activity code"
		},
		activityNotFound: { // тренировка не найдена
			title: "",
			text: "The activity cannot be founded"
		},
		badInputTimestampRange: { // неверно передан диапазон timeStamp
			title: "",
			text: "Wrong timestamps for calculated segment"
		},
		activityDetailedDataNotFound: { // не найдены детальные данные по тренировке
			title: "",
			text: "Activity detailed data not found"
		},
		itemCreatedByOtherUser: { // не найдены детальные данные по тренировке
			title: "",
			text: "Item has been created by another user"
		},

		// -------- CalendarItem actiions: copy, paste, cut, drag&drop --------
		calendarItemCopy: { //
			title: "",
			text: "Calendar items have been copied"
		},
		calendarItemPaste: { //
			title: "",
			text: "Calendar items have been added"
		},
		calendarItemDragAndDrop: { //
			title: "",
			text: "Calendar items have been moved"
		},
		calendarItemCut: { //
			title: "",
			text: "Calendar items have been cut and ready to move"
		},
		forbiddenAction_postCalendarItem: { //
			title: "",
			text: "Calendar items cannot be added. Future planning is a premium option"
		},

		// -------- Категории и шаблоны ---------

		activityTemplateCreated: {
			title: "",
			text: "New template have been created"
		},
        forbidden_ExistsRelatedActivity: {
            title: "Action forbidden",
            text: "Item has related activities"
        },


    // -------- Запросы и групповые операции ---------
		requestSent: { // отправить запрос из профиля пользователя, из профиля клуба
			title: "",
			text: "Operation was successful" // сделал такую нейтральную формулировку, т.к. есть запросы, требующие согласования, а есть например выход из клуба, который не требует согласования
		},
		requestComplete: {
			title: "",
			text: "You have sent the request"
		},
		requestCancelled: { // пользователь отменил свой запрос из профиля или в реестре исходящих запросов
			title: "",
			text: "Your request has been cancelled"
		},
		requestAccepted: { // в реестре запросов пользователь принял входящий запрос
			title: "",
			text: "You have accepted the request"
		},
		requestDeclined: { // в реестре запросов пользователь отклонил входящий запрос
			title: "",
			text: "You have declined the request"
		},
		badGroupMembershipRequest: { // передан некорректный идентификатор запроса на членство в группе
			title: 'Error',
			text: 'Incorrect group membership request id '
		},
		unknownGroupIdentifier: { // в ответ на запрос включения в группу
			title: "",
			text: "Incorrect group id"
		},
		userIsAlreadyGroupMember: { // в ответ на запрос включения в группу
			title: "",
			text: "User is already a group member"
		},
		forbidden_YouAreNotGroupManager: { // в ответ на запрос включения в группу
			title: "",
			text: "Operation forbidden, you are not a group manager"
		},
		forbidden_joinOnlyByGroupManager: { // в ответ на запрос включения в группу
			title: "",
			text: "Operation forbidden, you are not a group manager"
		},
		duplicateGroupMembership: { // в ответ на запрос включения в группу
			title: "",
			text: "User is already a group member (duplicate group membership)"
		},

		// -------- Управление спортсменами тренера (/athletes) ---------
		athletesDisconnected: { // тренер отключил спортсмена
			title: "",
			text: "Your athletes have been disconnected from you"
		},
		coachTariffsChanged: { // изменено подключение тарифов за счет тренера
			title: "",
			text: "You have successfully changed the tariffs of your athletes"
		},
		inviteSuccess: { // тренер отправил запрос на подключение для новых пользователей сервиса
			title: "",
			text: "You have successfully sent an ivites to athletes"
		},
		forbidden_cannotConnectToCoach_coachTariffRequired: {
			title: "Error",
			text: "Cannot connect to coach. Please ask coach to check his tariffs"
		},
		forbidden_cannotConnectToAthlete_coachTariffRequired: {
			title: "Error",
			text: "You don't have an active tariff 'Coach'. Please switch on 'Coach' tariff and try again"
		},

		// -------- Управление членами клуба (/management/clubUri) ---------
		clubMembersDisconnected: { // член клуба исключен из клуба
			title: "",
			text: "Club members have been successfully excluded from club"
		},
		clubRolesChanged: { // роли изменены
			title: "",
			text: "Club members roles have been changed"
		},
		clubTariffsChanged: { // изменены тарифы
			title: "",
			text: "Club members tariffs have been changed"
		},
		clubCoachesChanged: { // Изменено назначение тренеров
			title: "",
			text: "Coach assignment to club athletes have been changed"
		},
		forbidden_YouMustHaveMembershipInManagementGroup: { // Открытие /management
			title: "",
			text: "Operation forbidden. You have to be the group manager"
		},
		forbidden_OnlyClubManagerCanManageThisGroup: { // в ответ на запрос включения в группу
			title: "",
			text: "Operation forbidden. You have to be the group manager or admin"
		},
		duplicateCoachAthleteRelation: { // в ответ на запрос включения в группу
			title: "Attention",
			text: "Operation forbidden. Coach and athlete are already connected to each other"
		},
		forbidden_CoachingYourself: { // назначить себя тренером для себя
			title: "Attention",
			text: "Operation forbidden. You cannot be the coach for yourself"
		},
		forbidden_ManagerCannotLeaveClub: { // менеджер исключает себя из клуба
			title: "Attention",
			text: "Club manager cannot leave the club"
		},
		forbidden_LeaveClubManagementGroupFirst: { // ошибка, если администратору клуба отключается роль Тренер, а Админ остается
			title: "Attention",
			text: "Operation forbidden. Club manager have to be the coach in the club"
		},
		forbidden_CoachHasAthletesInThisClub: { // ошибка, если отключается роль "Тренер" у тренера, у которого в клубе есть спортсмены, либо если тренер с учениками исключается из клуба
			title: "Error",
			text: "Operation forbidden. Coach has athletes in the club. Please disconnect athletes and try again"
		},

		// -------- Тарификация и биллинг ----------
		badPromoCodeString: {
			title: "",
			text: "Wrong promo-code"
		},
		rateNotFound: {
			title: "",
			text: "Tariff rate is invalid"
		},
		billNotFound: {
			title: "",
			text: "Bill not found"
		},
		unknownPaymentIdentifier: {
			title: "",
			text: "Unknown payment identifier"
		},
		unknownTariffIdentifier: {
			title: "",
			text: "Unknown tariff identifier"
		},
		TariffNotFound: {
			title: "",
			text: "Tariff not found"
		},
		successUnsubscribeTariff: {
			title: "",
			text: "Unsubscribe tariff successful"
		},
		groupMyAthletesNotEmpty: {
			title: "Error",
			text: "You have athletes. To switch tariff 'Coach' off please disconnect them before"
		},
		groupClubAthletesNotEmpty: {
			title: "Error",
			text: "Operation forbidden, you have athletes in the club. Please remove them before switch 'Club' tariff off"
		},
		// Поиск
		searchResult: {
			title: 'Information',
			text: 'Found {{count}} items'
		},
        // ----- Периодизация

        periodizationMesocycleEdited: {
            title: '',
            text: 'Mesocycle edited'
        },
        periodizationMesocyclePosted: {
            title: '',
            text: 'Mesocycle added'
        },
        mesocycleDeleted: {
            title: '',
            text: 'Mesocycle deleted'
        },
        periodizationSchemePosted: {
            title: '',
            text: 'New periodisation scheme created'
        },
        periodizationSchemeEdited: {
            title: '',
            text: 'Periodisation scheme edited'
        },
        periodizationSchemeDeleted: {
            title: '',
            text: 'Periodisation scheme deleted'
        },

        // ----- Планы на сезон
        trainingSeasonDeleted: {
            title: '',
            text: 'Season plan deleted'
        },
        trainingSeasonCreated: {
            title: '',
            text: 'Season plan created'
        },
        trainingSeasonEdited: {
            title: '',
            text: 'Season plan edited'
        },
        // ----- Планы на сезон
        competitionCreated: {
            title: '',
            text: 'Competition created'
        },
        competitionModified: {
            title: '',
            text: 'Competition edited'
        },
        competitionDeleted: {
            title: '',
            text: 'Competition deleted'
        },
        // ----- Records
        recordCreated: {
            title: '',
            text: 'Event created'
        },
        recordUpdated: {
            title: '',
            text: 'Event updated'
        },
        recordDeleted: {
            title: '',
            text: 'Event deleted'
        },
        trainingPlanDeleted: {
            title: '',
            text: 'Training plan deleted'
        },
        forbidden_PlanHasAssignmentsOrPurchases: {
            title: '',
            text: 'Training plan cannot be deleted. It has assignments or purchases'
        },
        assignmentDeleted: {
            title: '',
            text: 'Assignment deleted'
        },
        mergeActivitiesWithDistinctDays: {
            title: '',
            text: 'Dates in merged activities should be the same'
        },
        moveSpecifiedItem: {
            title: '',
            text: 'Change date and time in Completed activity is forbidden'
        },
        needOnlyOneSpecifiedActivity: {
            title: '',
            text: 'Cannot merge two activities with plan data'
        },
        needOnlyOneCompletedActivity: {
            title: '',
            text: 'Cannot merge two activities with actual data'
        },
        dbGetDataError: {
            title: '',
            text: 'Action cancelled: dbGetDataError'
        },
        activityMerged: {
            title: '',
            text: 'Activity has been merged'
        },
        activitySplited: {
            title: '',
            text: 'Activity has been splitted'
        },
        badActivityIdFirstIdentifier: {
            title: '',
            text: 'Merge cannot be done: bad 1st item identifier'
        },
        badActivityIdSecondIdentifier: {
            title: '',
            text: 'Merge cannot be done: bad 2nd item identifier'
        },
        bothItemsHavePlanData: {
            title: '',
            text: 'Merge cannot be done: both items have plan data'
        },
        bothItemsHaveActualData: {
            title: '',
            text: 'Merge cannot be done: both items have actual data'
        },
        differentBasicActivityTypes: {
            title: '',
            text: 'Merge cannot be done: different activity types'
        },
        errorCompleteIntervals: {
            title: '',
            text: 'Cannot get activity details: errorCompleteIntervals. Try to refresh browser window'
        },
        differentUsersForbidden: {
            title: '',
            text: 'Merge cannot be done: different users'
        },
        actualDataNotFound: {
            title: '',
            text: 'Merge cannot be done: actual data not found'
        },
        plannedDataNotFound: {
            title: '',
            text: 'Merge cannot be done: plan not found'
        },
}
};