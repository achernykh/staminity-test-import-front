// Преводы для текстов представлений
// Русский
const translateApp = {
  ru: {
      // Стартовая страница
      landing: {
          nav: {
              link1: 'Возможности',
              link2: 'Блог',
              link3: 'Цены',
              link4: 'Поддержка',
              signIn: 'Войти',
              signOut: 'Выйти'
          },
          welcome: {
              title1: 'ПЛАН ТВОИХ ПОБЕД',
              title2: 'ПЛАНИРУЙ, ТРЕНИРУЙСЯ, ДОСТИГАЙ РЕЗУЛЬТАТОВ',
              button: 'Старт',
              buttonSignUp: 'НАЧАТЬ'
          }
      },
      // Страница auth - только общие поля. Названия окон и отдельных кнопок вынесены в отдельные блоки
      auth: {
          back: 'Назад',
          firstName: 'Имя',
          lastName: 'Фамилия',
          pass: 'Пароль',
          email: 'E-mail',
          requires: 'Обязательное поле',
          err30: '{{field}} не должно превышать 30 символов',
          errMail: 'Проверьте правильность указания e-mail',
          errPass: 'Пароль должен быть не менее 8 символов и содержать хотя бы одну цифру и заглавную букву',
          confirmation: "Регистрируясь, вы принимаете <a href='#'>Условия</a> использования сервиса. Ознакомиться с <a href='#'>Политикой конфиденциальности</a>"
      },
      // Окно регистрации / создания нового пользователя
      signup: {
          fullTitle: 'Создать новую учетную запись',
          shortTitle: 'Создать',
          coach: 'Я тренер',
          button: 'Создать'
      },
      // Окно входа в сервис
      signin: {
          fullTitle: 'Войти',
          shortTitle: 'Войти',
          button: 'Войти',
          remember: 'Запомнить меня'
      },
      // Окно подтверждения успешной регистрации. Добавил сюда же текст на экране
      confirm: {
          fullTitle: 'Подтверждение регистрации',
          shortTitle: 'Подтверждение',
          text: 'Поздравляем, Вы зарегистрировались! Для начала использования сервиса подтвердите Ваш e-mail, перейдя по ссылке из письма, отправленного на {e-mail}'
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
      },
      // Страница Календаря
      calendar: {
          fullTitle: 'Календарь',
          shortTitle: 'Календарь',
          weekdays: {
              weekDays_1: 'Понедельник',
              weekDays_2: 'Вторник',
              weekDays_3: 'Среда',
              weekDays_4: 'Четверг',
              weekDays_5: 'Пятница',
              weekDays_6: 'Суббота',
              weekDays_7: 'Воскресенье',
              totalDays: 'Итоги'
          },
          today: 'Сегодня'
      },
      // Страницы Ленты
      feeds: {
          fullTitle: 'Лента',
          shortTitle: 'Лента'
      },
      // Страница Аналитики и отчетов
      reports: {
          fullTitle: 'Аналитика и отчеты',
          shortTitle: 'Аналитика'
      },
      // Страница работы с тренировочными планами
      plan: {
          fullTitle: 'Тренировочные планы',
          shortTitle: 'Тренировочные планы'
      },
      // Страница работы с планами на сезон
      season: {
          fullTitle: 'Планы на сезон',
          shortTitle: 'Планы на сезон'
      },
      // Страница для работы с Группами
      groups: {
          fullTitle: 'Группы',
          shortTitle: 'Группы'
      },
      // Страница для работы с атлетами
      athletes: {
          fullTitle: 'Спортсмены',
          shortTitle: 'Спортсмены'
      },
      // Страница Администратора
      admin: {
          fullTitle: 'Панель администратора',
          shortTitle: 'Админ'
      },
      settings: {
          fullTitle: 'Настройки пользователя',
          shortTitle: 'Настройки',
          personalInfo: {
              header: 'Персональная информация',
              hint: 'Подсказка, пояснение по блоку информации...',
              main: {
                  header: 'О себе',
                  firstName: 'Имя',
                  lastName: 'Фамилия',
                  sex: 'Пол',
                  birthday: 'День рождения',
                  country: 'Страна',
                  city: 'Город'
              },
              contacts: {
                  header:'Контакты',
                  extEmail: 'Дополнтиельный email',
                  phone: 'Телефон'
              },
              sportShape: {
                  header: 'Спортивная форма',
                  weight: 'Вес',
                  height: 'Рост',
                  sportLevel: 'Уровень спортсмена',
                  activityTypes: {
                      header: 'Виды спорта',
                      code: []
                  }
              }
          },
          privacy: {
              header: 'Приватность',
              hint: 'Ваши фамилия и имя доступны для просмотра всем пользователям. Ваши личные данные (e-mail,' +
              ' телефон, а также вес, рост и уровень тренированности) не доступны никому, кроме Вашего тренера',
              groups: {
                  personalInfo: 'Профиль: персональная информация',
                  personalInfoHint: 'Ваше фото, информация о себе, пол, дата рождения, страна и город проживания,' +
                  ' виды спорта.',
                  personalSummary: 'Профиль: сводная статистика по тренировкам',
                  personalSummaryHint: 'Общее количество, продолжительность и расстояние выполненных тренировок',
                  activitySummary: 'Тренировка: сводная информация',
                  activitySummaryHint: 'По каждой выполненной тренировке: просмотр сводной информации, без деталей',
                  activityActualDetails: 'Тренировка: детальная фактическая информация',
                  activityActualDetailsHint: 'По каждой выполненной тренировке: полная фактическая информация',
                  activityPlanDetails: 'Тренировка: план и сравнение план/факт',
                  activityPlanDetailsHint: 'По каждой тренировке: план на тренировку, полная фактическая информация, сравнение план/факт'
              }
          },
          display: {
              header: 'Представление',
              hint: 'Пояснение, подсказка....'
          },
          account: {
              header: 'Учетная запись',
              hint: 'Пояснение, подсказка....',
              email: 'Логин',
              password: 'Пароль'
          },
          subscriptions: {
              header: 'Подписки'
          },
          sync: {
              header: 'Синхронизация'
          },
          zones: {
              header: 'Тренировочные зоны',
              hint: 'Подсказка, пояснение по блоку информации...',
          },
          notification: {
              header: 'Уведомления'
          },
          templates: {
              header: 'Шаблоны тренировок'
          },
          favorites: {
              header: 'Избранные тренровки'
          }
      }
  },
  // Английский
  en: {
      // Стартовая страница
      landing: {
          nav: {
              link1: 'Features',
              link2: 'Blog',
              link3: 'Price',
              link4: 'Support',
              signIn: 'Sign In',
              signOut: 'Sign Out'
          },
          welcome: {
              title1: 'Plan your victories',
              title2: 'Planned, Train, Achieves Results',
              button: 'Start'
          }
      },
      // Страница auth - только общие поля. Названия окон и отдельных кнопок вынесены в отдельные блоки
      auth: {
          back: 'Back',
          firstName: 'First name',
          lastName: 'Last name',
          pass: 'Password',
          email: 'E-mail',
          requires: 'Required field',
          err30: '{{field}} has to be less than 30 characters long',
          errMail: 'Check your e-mail address',
          errPass: 'Should be at least 8 characters long and contain at least one digit and one uppercase symbol',
          confirmation: "By signing up for Staminity, you agree to the <a href='#'>Terms</a> of Service. View our <a href='#'>Privacy Policy</a>"
      },
      // Окно регистрации / создания нового пользователя
      signup: {
          fullTitle: 'Create new account',
          shortTitle: 'Create',
          button: 'Create',
          coach: "I'm a coach"
      },
      // Окно входа в сервис
      signin: {
          fullTitle: 'Sign in',
          shortTitle: 'Sign in',
          button: 'Sign in',
          remember: 'Remember me'
      },
      // Окно подтверждения успешной регистрации. Добавил сюда же текст на экране
      confirm: {
          fullTitle: 'Sign up confirmation',
          shortTitle: 'Confirmation',
          text: 'Congratulations! You account has been created. To finish your sign up process please confirm your e-mail by clicking the link sent to {e-mail}'
      },
      // Окно "Забыли пароль"
      forgetpass: {
          fullTitle: 'Forgot your password?',
          shortTitle: 'Password recovery',
          text: "Enter you e-mail below and we''ll send you a link with instructions",
          button: 'Send'
      },
      // Окно "Изменить пароль"
      changepass: {
          fullTitle: 'Change your password',
          shortTitle: 'Change password',
          text: 'Create and confirm a new password for your account',
          newpass: 'New password',
          verifypass: 'Verify password',
          button: 'Change'
      },
      // Страница Календаря
      calendar: {
          fullTitle: 'Calendar',
          shortTitle: 'Calendar',
          weekdays: {
              weekDays_1: 'Monday',
              weekDays_2: 'Tuesday',
              weekDays_3: 'Wednesday',
              weekDays_4: 'Thursday',
              weekDays_5: 'Friday',
              weekDays_6: 'Saturday',
              weekDays_7: 'Sunday',
              totalDays: 'Total'
          },
          today: 'Today'
      },
      // Страницы Ленты
      feeds: {
          fullTitle: 'Activity feed',
          shortTitle: 'Feed'
      },
      // Страница Аналитики и отчетов
      reports: {
          fullTitle: 'Analytics and reports',
          shortTitle: 'Reports'
      },
      // Страница работы с тренировочными планами
      plan: {
          fullTitle: 'Training plans',
          shortTitle: 'Training plans'
      },
      // Страница работы с планами на сезон
      season: {
          fullTitle: 'Season plans',
          shortTitle: 'Season plans'
      },
      // Страница для работы с Группами
      groups: {
          fullTitle: 'Groups',
          shortTitle: 'Groups'
      },
      // Страница для работы с атлетами
      athletes: {
          fullTitle: 'Athletes',
          shortTitle: 'Athletes'
      },
      // Страница Администратора
      admin: {
          fullTitle: 'Admin panel',
          shortTitle: 'Admin'
      }
  }
};
export default translateApp;
