export let _translate = {
    ru: {
        // Страница auth - только общие поля. Названия окон и отдельных кнопок вынесены в отдельные блоки

        back: "Назад",
        firstName: "Имя",
        lastName: "Фамилия",
        pass: "Пароль",
        email: "E-mail",
        required: "Обязательное поле",
        err30: "{{field}} максимум 30 символов",
        errMail: "Проверьте правильность указания e-mail",
        errPass: "Пароль должен быть не менее 8 символов и содержать хотя бы одну цифру и заглавную букву",
        errComparePass: "Пароли не совпадают",
        confirmation: "Я принимаю <a href='https://legal.staminity.com/ru/license.html'>Публичную оферту</a> и соглашаюсь с <a href='https://legal.staminity.com/ru/terms.html'>Условиями использования</a> сайта.<br>",

        socialText: "Через социальные сети:",
        socialOr: "или свой email адрес",

        // Окно регистрации / создания нового пользователя
        signup: {
            fullTitle: "Регистрация нового пользователя",
            shortTitle: "Регистрация",
            coach: "Я тренер",
            button: "Регистрация",
            social: 'Регистрация через ',
            signinLink: "<a href='https://staminity.com/signin'>Уже есть аккаунт</a>"
        },
        // Окно входа в сервис
        signin: {
            fullTitle: "Войти",
            shortTitle: "Войти",
            button: "Войти",
            remember: "Запомнить меня",
            reset: "Восстановление пароля",
            social: 'Войти через ',
            signupLink: "<a href='https://staminity.com/signup'>Создать аккаунт</a>"

        },
        signout: {
            shortTitle: "Выйти",
        },
        // Окно подтверждения успешной регистрации. Добавил сюда же текст на экране
        confirm: {
            fullTitle: "Подтверждение регистрации",
            shortTitle: "Подтверждение",
            text: "Поздравляем, Вы зарегистрировались! Для начала использования сервиса подтвердите Ваш e-mail," +
            " перейдя по ссылке из письма, отправленного на <b>{{email}}</b>"
        },
        invite: {
            fullTitle: "Установка пароля",
            shortTitle: "Установка пароля"
        },
        reset: {
            fullTitle: "Восстановление пароля",
            shortTitle: "Восстановление пароля",
            title: "Восстановление пароля",
            info: "Укажите e-mail, с которым вы регистрировались, и мы пришлем ссылку для изменения пароля",
            button: "Сбросить пароль"
        },
        setpass: {
            fullTitle: "Придумайте новый пароль",
            shortTitle: "Новый пароль",
            button: "Изменить"
        },
        // Окно "Забыли пароль"
        forgetpass: {
            fullTitle: "Забыли ваш пароль?",
            shortTitle: "Забыли пароль?",
            text: "Введите ваш e-mail и мы отправим ссылку для изменения пароля",
            button: "Отправить"
        },
        // Окно "Изменить пароль"
        changepass: {
            fullTitle: "Изменить пароль",
            shortTitle: "Изменить пароль",
            text: "Придумайте новый пароль для Вашей учетной записи",
            newpass: "Новый пароль",
            verifypass: "Подтвердите пароль",
            button: "Изменить"
        },
        start: {
            title: "Добро пожаловать!",
            subtitle: "Зарегистрируйтесь или войдите в Staminity",
        }
    },
    en: {
        // Страница auth - только общие поля. Названия окон и отдельных кнопок вынесены в отдельные блоки

        back: "Back",
        firstName: "First name",
        lastName: "Last name",
        pass: "Password",
        email: "E-mail",
        required: "Required",
        err30: "{{field}} 30 characters maximum",
        errMail: "Please check your e-mail address",
        errPass: "The password should contain at least 8 characters and include one digit and one uppercase letter",
        errComparePass: "Passwords did not match",
        confirmation: "I accept <a href='https://legal.staminity.com/en/license.html'>the Public offer</a> and agree with <a href='https://legal.staminity.com/en/terms.html'>the Website use policy</a>",

        socialText: "Through social networks: ",
        socialOr: "or by email",

        // Окно регистрации / создания нового пользователя
        signup: {
            fullTitle: "New user sign up",
            shortTitle: "Sign up",
            coach: "I am a coach",
            button: "Sign up",
            social: 'Sign up with ',
            signinLink: "<a href='https://staminity.com/signin'>Sign in</a>"
        },
        // Окно входа в сервис
        signin: {
            fullTitle: "Sign in",
            shortTitle: "Sign in",
            button: "Sign in",
            remember: "Remember me",
            reset: "Forgot my password",
            social: 'Sign in with ',
            signupLink: "<a href='https://staminity.com/signup'>Create new account</a>"
        },
        signout: {
            shortTitle: "Sign out",
        },
        // Окно подтверждения успешной регистрации. Добавил сюда же текст на экране
        confirm: {
            fullTitle: "Sign up confirmation",
            shortTitle: "Confirmation",
            text: "Congratulations, you have successfully signed up! To start using Staminity please verify your email <b>{{email}}</b>."
        },
        invite: {
            fullTitle: "Set your password",
            shortTitle: "Set your password"
        },
        reset: {
            fullTitle: "Reset password",
            shortTitle: "Reset password",
            title: "Reset password",
            info: "Enter the email address you have used to sign up and we will send you an email with instructions.",
            button: "Reset password"
        },
        setpass: {
            fullTitle: "Set up your new password",
            shortTitle: "New password",
            button: "Change"
        },
        // Окно "Забыли пароль"
        forgetpass: {
            fullTitle: "Reset password",
            shortTitle: "Reset password",
            text: "Enter your email address and we will send you an email with instructions",
            button: "Reset password"
        },
        // Окно "Изменить пароль"
        changepass: {
            fullTitle: "Change password",
            shortTitle: "Change password",
            text: "Set up your new password",
            newpass: "New password",
            verifypass: "Confirm your new password",
            button: "Change"
        },
        start: {
            title: "You're welcome!",
            subtitle: "Please Sign up or login to Staminity",
        }
    },

};
