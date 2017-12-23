export let _translate = {
    ru: {
        // Страница auth - только общие поля. Названия окон и отдельных кнопок вынесены в отдельные блоки

        back: "Назад",
        firstName: "Имя",
        lastName: "Фамилия",
        pass: "Пароль",
        email: "E-mail",
        required: "Обязательное поле",
        err30: "{{field}} не должно превышать 30 символов",
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
            button: "Регистрация"
        },
        // Окно входа в сервис
        signin: {
            fullTitle: "Войти",
            shortTitle: "Войти",
            button: "Войти",
            remember: "Запомнить меня",
            reset: "Восстановление пароля"
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
            button: "Восстановить пароль"
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
        err30: "{{field}} max length is 30 symbols",
        errMail: "Please check your e-mail address",
        errPass: "Password should be at least 8 characters and include one digit and one uppercase letter",
        errComparePass: "Passwords did not match",
        confirmation: "I agree with Staminity <a href='https://legal.staminity.com/en/terms.html'>Terms and conditions</a>.<br>",

        socialText: "By social networks:",
        socialOr: "or by email",

        // Окно регистрации / создания нового пользователя
        signup: {
            fullTitle: "New user sign up",
            shortTitle: "Sign up",
            coach: "I am the coach",
            button: "Sign up"
        },
        // Окно входа в сервис
        signin: {
            fullTitle: "Sign in",
            shortTitle: "Sign in",
            button: "Sign in",
            remember: "Remember me",
            reset: "Forgot your password"
        },
        // Окно подтверждения успешной регистрации. Добавил сюда же текст на экране
        confirm: {
            fullTitle: "Sign up confirmation",
            shortTitle: "Confirmation",
            text: "Congratulations, you are signing up! To start using the Staminity please confirm your email. Check your email <b>{{email}}</b> and follow the instructions"
        },
        invite: {
            fullTitle: "Set your password",
            shortTitle: "Set your password"
        },
        reset: {
            fullTitle: "Recover password",
            shortTitle: "Recover password",
            title: "Recover password",
            info: "Enter your e-mail and we will send you the email with instructions",
            button: "Recover password"
        },
        setpass: {
            fullTitle: "Set up your new password",
            shortTitle: "New password",
            button: "Change"
        },
        // Окно "Забыли пароль"
        forgetpass: {
            fullTitle: "Forget your password?",
            shortTitle: "Forget password?",
            text: "Enter your e-mail and we will send you the email with instructions",
            button: "Send"
        },
        // Окно "Изменить пароль"
        changepass: {
            fullTitle: "Change password",
            shortTitle: "Change password",
            text: "Set up you new password",
            newpass: "New password",
            verifypass: "Confirm your new password",
            button: "Change"
        }
    },

};
