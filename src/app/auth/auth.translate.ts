export let _translate = {
	ru: {
		// Страница auth - только общие поля. Названия окон и отдельных кнопок вынесены в отдельные блоки

		back: 'Назад',
		firstName: 'Имя',
		lastName: 'Фамилия',
		pass: 'Пароль',
		email: 'E-mail',
		required: 'Обязательное поле',
		err30: '{{field}} не должно превышать 30 символов',
		errMail: 'Проверьте правильность указания e-mail',
		errPass: 'Пароль должен быть не менее 8 символов и содержать хотя бы одну цифру и заглавную букву',
		errComparePass: 'Пароли не совпадают',
		confirmation: "Я принимаю <a href='https://legal.staminity.com/ru/license.html'>Публичную оферту</a> и соглашаюсь с <a href='https://legal.staminity.com/ru/terms.html'>Условиями использования</a> сайта.<br>",

		socialText: 'Через социальные сети:',
		socialOr: 'или свой email адрес',

		// Окно регистрации / создания нового пользователя
		signup: {
			fullTitle: 'Регистрация нового пользователя',
			shortTitle: 'Регистрация',
			coach: 'Я тренер',
			button: 'Регистрация'
		},
		// Окно входа в сервис
		signin: {
			fullTitle: 'Войти',
			shortTitle: 'Войти',
			button: 'Войти',
			remember: 'Запомнить меня',
			reset: 'Восстановление пароля'
		},
		// Окно подтверждения успешной регистрации. Добавил сюда же текст на экране
		confirm: {
			fullTitle: 'Подтверждение регистрации',
			shortTitle: 'Подтверждение',
			text: 'Поздравляем, Вы зарегистрировались! Для начала использования сервиса подтвердите Ваш e-mail,' +
			' перейдя по ссылке из письма, отправленного на <b>{{email}}</b>'
		},
		invite: {
			fullTitle: 'Установка пароля',
			shortTitle: 'Установка пароля',
		},
		reset: {
			fullTitle: 'Восстановление пароля',
			shortTitle: 'Восстановление пароля',
			info: "Enter your email address below and we'll send you a link with instructions.",
		},
		setpass: {
			fullTitle: 'Установка пароля',
			shortTitle: 'Установка пароля',
			button: 'Изменить'
		},
		// Окно "Забыли пароль"
		forgetpass: {
			fullTitle: 'Забыли ваш пароль?',
			shortTitle: 'Забыли пароль?',
			text: 'Введите ваш e-mail и мы отправим ссылку для изменения пароля',
			button: 'Отправить'
		},
		// Окно "Изменить пароль"
		changepass: {
			fullTitle: 'Изменить пароль',
			shortTitle: 'Изменить пароль',
			text: 'Придумайте новый пароль для Вашей учетной записи',
			newpass: 'Новый пароль',
			verifypass: 'Подтвердите пароль',
			button: 'Изменить'
		}
	},
	en: {}

};