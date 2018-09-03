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
        errPass: "Не менее 8 символов, включая цифру и заглавную букву",
        errComparePass: "Пароли не совпадают",
        confirmation: "Я принимаю <a href='https://legal.staminity.com/ru/license.html'>Публичную оферту</a> и соглашаюсь с <a href='https://legal.staminity.com/ru/terms.html'>Условиями использования</a> сайта.<br>",

        socialText: "Через социальные сети:",
        socialOr: "или по адресу email",

        // Окно регистрации / создания нового пользователя
        signup: {
            fullTitle: "Создать аккаунт",
            shortTitle: "Создать аккаунт",
            coach: "Я тренер",
            button: "Создать аккаунт",
            social: 'Регистрация через ',
            signinLink: "<a href='https://staminity.com/signin'>Уже есть аккаунт</a>",
            email: "Регистрация по e-mail"
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
            shortTitle: "Установка пароля",
            pass: "Пароль",
            repeatPass: "Повторите пароль"
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
        },
        alreadyHaveAccount: "Уже есть аккаунт? <strong>Войти</strong>",
        role: {
            label: 'Роль',
            athlete: "Спортсмен",
            athleteInfo: {
                name: "Спортсмен",
                hint: "Работа с тренером или самостоятельные тренировки",
                info: 'Включает 2 недели бесплатно по тарифу "Премиум"'
            },
            coach: "Индивидуальный тренер",
            coachInfo: {
                name: "Индивидуальный тренер",
                hint: "Онлайн подготовка личных учеников, без клуба",
                info: 'Включает 2 недели бесплатно по тарифу "Тренер"'
            },
            clubCoach: "Тренер в клубе",
            clubCoachInfo: {
                name: "Тренер в клубе",
                hint: "Онлайн подготовка учеников, назначенных клубом",
                info: 'Личный тариф "Тренер" не нужен. Подключитесь к клубу'
            },
            clubManager: "Руководитель клуба",
            clubManagerInfo: {
                name: "Руководитель клуба",
                hint: "Организация работы нескольких тренеров с учениками",
                info: 'Включает 2 недели бесплатно по тарифу "Клуб"'
            }
        },
        social: "Через социальные сети"
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
        errPass: "At least 8 characters includes one digit and one capital letter",
        errComparePass: "Passwords did not match",
        confirmation: "I accept <a href='https://legal.staminity.com/en/license.html'>the Public offer</a> and agree with <a href='https://legal.staminity.com/en/terms.html'>the Website use policy</a>",

        socialText: "Through social networks: ",
        socialOr: "or via email",

        // Окно регистрации / создания нового пользователя
        signup: {
            fullTitle: "Create account",
            shortTitle: "Create account",
            coach: "I am a coach",
            button: "Create account",
            social: 'Sign up with ',
            signinLink: "<a href='https://staminity.com/signin'>Sign in</a>",
            email: "Sign up with e-mail"
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
            shortTitle: "Set your password",
            pass: "Password",
            repeatPass: "Repeat your password"
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
        },
        alreadyHaveAccount: "Already have an account? <strong>Sign in</strong>",
        role: {
            label: 'Role',
            athlete: {
                name: "Athlete",
                hint: "Online training with a coach or self-training",
                info: 'Includes a 14-day "Premium" trial'
            },
            coach: {
                name: "Personal coach",
                hint: "Online work with personal athletes, without club",
                info: 'Includes a 14-day "Coach" trial'
            },
            clubCoach: {
                name: "Club coach",
                hint: "Online work with athletes, assigned by the club",
                info: '"Coach" trial not included. Join your club to become a club coach'
            },
            clubManager: {
                name: "Club manager",
                hint: "Organize a joint work of several coaches in a club",
                info: 'Includes a 14-day "Club" trial'
            }
        },
        social: "Via social networks"
    }
};
