export let _translate = {
	ru: {
		// Стартовая страница

		fullTitle: 'Стаминити',
		shortTitle: 'Стаминити',
		description: 'Приложение для удаленной работы тренеров и клубов с учениками в циклических видах спорта',
		keywords: 'Стаминити, Staminity, для спортсменов, для тренеров, для клубов, удаленная работа с тренером',
		nav: {
			link1: 'Возможности',
			link2: 'Блог',
			link3: 'Тарифы',
			link4: 'Поддержка',
			signIn: 'Войти',
			signOut: 'Выйти'
		},
		welcome: {
			promo: 'β-версия',
			description: 'Удаленная работа с тренером и социальная сеть для спортсменов',
			title1: 'ПЛАН ТВОИХ ПОБЕД',
			title2: 'ПЛАНИРУЙ, ТРЕНИРУЙСЯ, ДОСТИГАЙ РЕЗУЛЬТАТОВ',
			button: 'Старт',
			buttonSignUp: 'НАЧАТЬ'
		},
		subscribe: {
			title: 'Рассылка Стаминити',
			name: 'Имя',
			email: 'Email',
			required: 'Обязательное поле',
			errMail: 'Проверьте правильность указания e-mail',
			action: 'Подписаться',
			note: 'Рассказываем о создании сервиса, делимся новостями',
			question: 'Есть вопросы? Напишите нам: '
		},
		start: {
			action: 'Старт',
			note: 'Зарегистрируйтесь, чтобы войти'
		},
		devices: {
			title: 'Выбирайте удобный способ подключения',
			subtitle: '',
			desktop: {
				title: 'С компьютера',
				description: 'Все возможности Стаминити доступны через браузер на компьютере. Подключайтесь с помощью Google Chrome, Opera, Firefox или Safari.<br>' +
				'Пока не поддерживаем Internet explorer и Edge'
			},
			mobile: {
				title: 'Со смартфона',
				description: 'Если компьютер далеко, заходите к нам через браузер смартфона и планшета, работайте в <a flex href="https://help.staminity.com/ru/basics/staminity-for-mobile.html">специальной версии сайта для мобильных устройств</a><br>' +
				'Мобильные приложения для IOS и Android в разработке, об их выпуске мы сообщим отдельно'
			}
		},
		scheme: {
			title: 'Как это работает',
			subtitle: '',
			step1 : {
				title: 'Запланировать',
				description: 'Получайте задание от тренера на каждую тренировку или планируйте самостоятельно. <br/>' +
				'Ваш календарь тренировок покажет не только выполненные задания, но и созданный план'
			},
			step2 : {
				title: 'Выполнить',
				description: 'Тренируйтесь в спортивных часах или со смартфоном, а мы загрузим ваши тренировки и сопоставим их с планом. <br/>' +
				'Уже работает автоматическая загрузка из Garmin Connect и Strava, скоро появится прямая загрузка из Polar и Suunto'
			},
			step3 : {
				title: 'Проанализировать',
				description: 'Анализируйте вместе с тренером как прошла тренировка в целом или отдельные рабочие отрезки. <br/>' +
				'Уже доступен детальный анализ одной тренировки, скоро появится анализ показателей в динамике по выбранным занятиям'
			}
		},
		features: {
			athletes: {
				title: 'Для спортсменов',
				subtitle: 'Помогаем заниматься с тренером и достигать спортивных целей',
				title1: 'Планируйте',
				text1: 'Получайте плановые задания от тренера или создавайте их сами. Вы узнаете о новом задании, а тренер – о выполненной тренировке',
				title2: 'Тренируйтесь',
				text2: 'Выполняйте задания и анализируйте их. Записанные треки тренировок попадут в ваш тренировочный дневник и будут сопоставлены с планом',
				title3: 'Общайтесь',
				text3: 'Общайтесь с тренером, обсуждайте детали задания, отчитывайтесь о выполнении. А скоро появятся комментарии друзей и подписчиков',
				carousel1: {
					title: 'Тренировочный календарь',
					description: 'Тренировочный календарь покажет расписание тренировок на неделю. <br/>' +
					'Он поможет оценить план и итоги недели, а также статус выполнения каждой тренировки'
				},
				carousel2: {
					title: 'План и факт по тренировке',
					description: 'Обзор тренировки поможет оценить корректность выполнения плана с учетом установки тренера и сравнения плановых показателей с фактом. <br/>' +
					'В чате с тренером, доступным в каждой тренировке, наставник увидит ваш отчет и ответит на вопросы по заданию'
				},
				carousel3: {
					title: 'Aнализ выполненной тренировки',
					description: 'Проанализировать выполненную тренировку помогут интерактивный график, карта и панель кругов, расчетные показатели и пики, время в зонах. <br/>' +
					'Если нужны детали, поможет подробный график в масштабе и рассчитанные показатели и пики по любому произвольному отрезку тренировки'
				}
			},
			coaches: {
				title: 'Для тренеров',
				subtitle: 'Cокращаем рутину в тренировочном процессе',
				title1: 'Планируйте подготовку',
				text1: 'Создавайте плановые задания для учеников. Планируйте каждый сегмент или тренировку в целом, задавайте интенсивность в абсолютных значениях или в процентах от ПАНО. Ваши спортсмены узнают обо всех изменениях плана',
				title2: 'Контролируйте выполнение',
				text2: 'Будьте в курсе, как ваши подопечные выполняют план на неделю, меняйте его при необходимости. Недельный обзор покажет статус выполнения недельного микроцикла по всем ученикам',
				title3: 'Анализируйте тренировки',
				text3: 'Узнавайте о выполнении спортсменами заданий, получайте подробную информацию по ним. Мы рассчитаем процент выполнения и основные показатели по отдельным сегментам и в целом по тренировке',
				carousel1: {
					title: 'Дэшборд тренера – недельный обзор по ученикам',
					description: 'Для тренера доступен не только календарь спортсмена, но и сводный дэшборд. <br/>' +
					'Он покажет тренировочную неделю по всем ученикам, поможет запланировать тренировки и проанализировать их выполнение. ' +
					'Из дэшборда можно перейти в календарь спортсмена, в настройки его тренировочных зон и порогов.'
				}
				/*
				carousel1: {
					title: 'План на тренировку в двух режимах',
					description: 'Два типа тренировочных заданий: в целом на тренировку и по отдельным тренировочным сегментам. <br/>'+
					'Если план задать по сегментам, то приложение оценит корректность выполнения по каждому из них<br/>' +
					'Выбирайте вариант планирования, удобный для вас.'
				},
				carousel2: {
					title: 'Дэшборд тренера – недельный обзор по ученикам',
					description: 'Дэшборд тренера покажет тренировочную неделю по всем ученикам.<br/>Планировать тренировки и анализировать их выполнение  можно не только в календаре спортсмена, но и с помощью дэшборда.'
				},
				carousel3: {
					title: 'Детальный анализ любого отрезка тренировки',
					description: 'Как спортсмен пробежал важный рабочий отрезок? Можно узнать в деталях.<br/>' +
					'В этом помогут подробный график в масштабе, показатели и пики по выделенному отрезку'
				} */
			},
			clubs: {
				title: 'Для клубов',
				subtitle: 'Помогаем управлять клубом',
				title1: 'Собирайте команду',
				text1: 'Создайте клуб, подключайте тренеров и спортсменов. Управляйте запросами на вступление в клуб от других пользователей сервиса',
				title2: 'Управляйте клубом',
				text2: 'Назначайте тренеров и администраторов, назначайте тренеров для спортсменов клуба',
				title3: 'Контролируйте подготовку',
				text3: 'Недельный обзор по спортсменам клуба покажет наличие плана и сводный статус его выполнения по всем ученикам',

				carousel1: {
					title: 'Управление клубом',
					description: 'Руководитель клуба может управлять составом клуба, назначать тренеров и распределять спортсменов между ними. <br/>' +
					'В больших клубах можно назначить администраторов и делегировать им принятие новых членов в клуб и управление их ролями'
				}
				/*
				carousel1: {
					title: 'Профиль клуба',
					description: 'Профиль клуба покажет основную информацию по клубу, а также его спортсменов и тренеров<br/>'+
					'Запрос на вступление в клуб также отправляется из профиля клуба'
				},
				carousel2: {
					title: 'Запросы клубу',
					description: 'В реестре запросов руководители клуба управляют запросами от членов клуба.<br/>'+
					'Подтверждения требуют все запросы на вступление в клуб, а также запрос на выход тренера из клуба'
				},
				carousel3: {
					title: 'Управление клубом',
					description: 'В управлении членами клуба руководители клубов могут управлять составом клуба, назначать тренеров для спортсменов, управлять ролями членов клуба'
				} */
			},
		},
		footer: {
			block1 : {
				title: 'Приложение',
				link1: '<a flex href="#howitworks" class="md-body md-light">Как это работает</a>',
				link2: '<a flex href="#athletes" class="md-body md-light">Для спортсменов</a>',
				link3: '<a flex href="#coaches" class="md-body md-light">Для тренеров</a>',
				link4: '<a flex href="#clubs" class="md-body md-light">Для клубов</a>',
				link5: '<a flex href="#" class="md-body md-light disable">Тарифы</a>',
			},
			block2 : {
				title: 'Помощь и поддержка',
				link1: '<a flex href="https://help.staminity.com/ru/" target="_blank" class="md-body md-light">Справочная система</a>',
				link2: '<a flex href="http://support.staminity.com/" target="_blank" class="md-body md-light">Поддержка</a>',
				link3: '<a flex href="https://legal.staminity.com/ru/terms.html" target="_blank" class="md-body md-light">Правила использования</a>',
				link4: '<a flex href="https://legal.staminity.com/ru/license.html" target="_blank" class="md-body md-light">Оферта</a>',
				link5: '<a flex href="https://legal.staminity.com/ru/privacy.html" target="_blank" class="md-body md-light">Конфиденциальность</a>',
			},
			block3 : {
				title: 'Новости',
				link1: '<a flex href="http://eepurl.com/cmOSiH" target="_blank" class="md-body md-light">Подписаться на рассылку</a>',
				link2: '<a flex href="https://www.facebook.com/staminity/" target="_blank" class="md-body md-light">Мы в Facebook</a>',
				link3: '<a flex href="https://vk.com/staminity" target="_blank" class="md-body md-light">Мы Вконтакте</a>',
				link4: '<a flex href="http://blog.staminity.com/" target="_blank" class="md-body md-light">Блог</a>',
			},
			 block4 : {
			 title: 'О нас',
			 link1: '<a flex href="#" class="md-body md-light disable">Наша команда</a>',
			 link2: '<a flex href="mailto:mail@staminity.com" target="_blank" class="md-body md-light">Написать письмо</a>',
			 }
		}

	},
	en: {
		// Landing page

		fullTitle: 'Staminity',
		shortTitle: 'Staminity',
		description: 'Application for remote interaction between coaches and athletes in cyclic kinds of sport',
		keywords: 'Стаминити, Staminity, для спортсменов, для тренеров, для клубов, удаленная работа с тренером',
		nav: {
			link1: 'Features',
			link2: 'Blog (rus)',
			link3: 'Tariffs',
			link4: 'Support',
			signIn: 'Login',
			signOut: 'Logout'
		},
		welcome: {
			promo: 'β-version',
			description: 'Train smart with coach, achieve your goals and interact with other athletes',
			title1: 'ПЛАН ТВОИХ ПОБЕД',
			title2: 'ПЛАНИРУЙ, ТРЕНИРУЙСЯ, ДОСТИГАЙ РЕЗУЛЬТАТОВ',
			button: 'Start',
			buttonSignUp: 'Sign up'
		},
		subscribe: {
			title: 'Рассылка Стаминити',
			name: 'Имя',
			email: 'Email',
			required: 'Обязательное поле',
			errMail: 'Проверьте правильность указания e-mail',
			action: 'Подписаться',
			note: 'Рассказываем о создании сервиса, делимся новостями',
			question: 'Есть вопросы? Напишите нам: '
		},
		start: {
			action: 'Start',
			note: 'Signup to continue'
		},
		devices: {
			title: 'Choose your way to work',
			subtitle: '',
			desktop: {
				title: 'From your desktop',
				description: 'Staminity is available from your browser. Connect with Google Chrome, Opera, Firefox или Safari. <br>' +
				'Internet explorer and Edge are not supported'
			},
			mobile: {
				title: 'From smartphone',
				description: 'Use your smartphone or tablet browser to get Staminity for mobile special edition. <br>' +
				'IOS and Android mobile applications is coming soon...'
			}
		},
		scheme: {
			title: 'How it works',
			subtitle: '',
			step1 : {
				title: 'Plan',
				description: 'Get plan for every workout from your coach or create it by yourself. <br/>' +
				'Planned and completed workouts will be shown in your calendar'
			},
			step2 : {
				title: 'Train',
				description: 'You log workouts with your favorite sport watch or with smartphone application, we upload them and match with plan.<br/>' +
				'Auto sync from Garmin Connect and Strava is available now, to upload activities from other watches and services, just connect them to Strava.  ' +
				'Direct sync from Polar и Suunto coming soon'
			},
			step3 : {
				title: 'Analyze',
				description: 'Analyze your workouts with your coach. Review the metrics for whole activity or single segment, go deep by select any section to gain understanding of your performance. <br/>' +
				'Deep analysis of single workout is available now, other reports and analytics coming soon'
			}
		},
		features: {
			athletes: {
				title: 'For athletes',
				subtitle: 'Help to train with coach and achieve your goals',
				title1: 'Plan',
				text1: 'Get plan from coach or create by yourself. You will be notified about new planned workout and your coach – about your performance',
				title2: 'Train',
				text2: 'Complete workouts and analyze them. Tracks of your activities will be automatically uploaded to Staminity and matched with plan',
				title3: 'Communicate',
				text3: 'Communicate with coach, discuss workouts details, create a report. Comments from your friends and subsrcibers coming soon',
				carousel1: {
					title: 'Workout calendar',
					description: 'Workout calendar shows training plan and completed workouts, events, measures and races. <br/>' +
					'It helps to understand the status for every workout, calculate week totals and week status'
				},
				carousel2: {
					title: 'Workout plan and fact',
					description: 'Workout summary ' +
					'Обзор тренировки поможет оценить корректность выполнения плана с учетом установки тренера и сравнения плановых показателей с фактом. <br/>' +
					'В чате с тренером, доступным в каждой тренировке, наставник увидит ваш отчет и ответит на вопросы по заданию'
				},
				carousel3: {
					title: 'Aнализ выполненной тренировки',
					description: 'Проанализировать выполненную тренировку помогут интерактивный график, карта и панель кругов, расчетные показатели и пики, время в зонах. <br/>' +
					'Если нужны детали, поможет подробный график в масштабе и рассчитанные показатели и пики по любому произвольному отрезку тренировки'
				}
			},
			coaches: {
				title: 'Для тренеров',
				subtitle: 'Cокращаем рутину в тренировочном процессе',
				title1: 'Планируйте подготовку',
				text1: 'Создавайте плановые задания для учеников. Планируйте каждый сегмент или тренировку в целом, задавайте интенсивность в абсолютных значениях или в процентах от ПАНО. Ваши спортсмены узнают обо всех изменениях плана',
				title2: 'Контролируйте выполнение',
				text2: 'Будьте в курсе, как ваши подопечные выполняют план на неделю, меняйте его при необходимости. Недельный обзор покажет статус выполнения недельного микроцикла по всем ученикам',
				title3: 'Анализируйте тренировки',
				text3: 'Узнавайте о выполнении спортсменами заданий, получайте подробную информацию по ним. Мы рассчитаем процент выполнения и основные показатели по отдельным сегментам и в целом по тренировке',
				carousel1: {
					title: 'Дэшборд тренера – недельный обзор по ученикам',
					description: 'Для тренера доступен не только календарь спортсмена, но и сводный дэшборд. <br/>' +
					'Он покажет тренировочную неделю по всем ученикам, поможет запланировать тренировки и проанализировать их выполнение. ' +
					'Из дэшборда можно перейти в календарь спортсмена, в настройки его тренировочных зон и порогов.'
				}
				/*
				 carousel1: {
				 title: 'План на тренировку в двух режимах',
				 description: 'Два типа тренировочных заданий: в целом на тренировку и по отдельным тренировочным сегментам. <br/>'+
				 'Если план задать по сегментам, то приложение оценит корректность выполнения по каждому из них<br/>' +
				 'Выбирайте вариант планирования, удобный для вас.'
				 },
				 carousel2: {
				 title: 'Дэшборд тренера – недельный обзор по ученикам',
				 description: 'Дэшборд тренера покажет тренировочную неделю по всем ученикам.<br/>Планировать тренировки и анализировать их выполнение  можно не только в календаре спортсмена, но и с помощью дэшборда.'
				 },
				 carousel3: {
				 title: 'Детальный анализ любого отрезка тренировки',
				 description: 'Как спортсмен пробежал важный рабочий отрезок? Можно узнать в деталях.<br/>' +
				 'В этом помогут подробный график в масштабе, показатели и пики по выделенному отрезку'
				 } */
			},
			clubs: {
				title: 'Для клубов',
				subtitle: 'Помогаем управлять клубом',
				title1: 'Собирайте команду',
				text1: 'Создайте клуб, подключайте тренеров и спортсменов. Управляйте запросами на вступление в клуб от других пользователей сервиса',
				title2: 'Управляйте клубом',
				text2: 'Назначайте тренеров и администраторов, назначайте тренеров для спортсменов клуба',
				title3: 'Контролируйте подготовку',
				text3: 'Недельный обзор по спортсменам клуба покажет наличие плана и сводный статус его выполнения по всем ученикам',

				carousel1: {
					title: 'Управление клубом',
					description: 'Руководитель клуба может управлять составом клуба, назначать тренеров и распределять спортсменов между ними. <br/>' +
					'В больших клубах можно назначить администраторов и делегировать им принятие новых членов в клуб и управление их ролями'
				}
				/*
				 carousel1: {
				 title: 'Профиль клуба',
				 description: 'Профиль клуба покажет основную информацию по клубу, а также его спортсменов и тренеров<br/>'+
				 'Запрос на вступление в клуб также отправляется из профиля клуба'
				 },
				 carousel2: {
				 title: 'Запросы клубу',
				 description: 'В реестре запросов руководители клуба управляют запросами от членов клуба.<br/>'+
				 'Подтверждения требуют все запросы на вступление в клуб, а также запрос на выход тренера из клуба'
				 },
				 carousel3: {
				 title: 'Управление клубом',
				 description: 'В управлении членами клуба руководители клубов могут управлять составом клуба, назначать тренеров для спортсменов, управлять ролями членов клуба'
				 } */
			},
		},
		footer: {
			block1 : {
				title: 'Приложение',
				link1: '<a flex href="#howitworks" class="md-body md-light">Как это работает</a>',
				link2: '<a flex href="#athletes" class="md-body md-light">Для спортсменов</a>',
				link3: '<a flex href="#coaches" class="md-body md-light">Для тренеров</a>',
				link4: '<a flex href="#clubs" class="md-body md-light">Для клубов</a>',
				link5: '<a flex href="#" class="md-body md-light disable">Тарифы</a>',
			},
			block2 : {
				title: 'Помощь и поддержка',
				link1: '<a flex href="https://help.staminity.com/ru/" target="_blank" class="md-body md-light">Справочная система</a>',
				link2: '<a flex href="http://support.staminity.com/" target="_blank" class="md-body md-light">Поддержка</a>',
				link3: '<a flex href="https://legal.staminity.com/ru/terms.html" target="_blank" class="md-body md-light">Правила использования</a>',
				link4: '<a flex href="https://legal.staminity.com/ru/license.html" target="_blank" class="md-body md-light">Оферта</a>',
				link5: '<a flex href="https://legal.staminity.com/ru/privacy.html" target="_blank" class="md-body md-light">Конфиденциальность</a>',
			},
			block3 : {
				title: 'Новости',
				link1: '<a flex href="http://eepurl.com/cmOSiH" target="_blank" class="md-body md-light">Подписаться на рассылку</a>',
				link2: '<a flex href="https://www.facebook.com/staminity/" target="_blank" class="md-body md-light">Мы в Facebook</a>',
				link3: '<a flex href="https://vk.com/staminity" target="_blank" class="md-body md-light">Мы Вконтакте</a>',
				link4: '<a flex href="http://blog.staminity.com/" target="_blank" class="md-body md-light">Блог</a>',
			},
			block4 : {
				title: 'О нас',
				link1: '<a flex href="#" class="md-body md-light disable">Наша команда</a>',
				link2: '<a flex href="mailto:mail@staminity.com" target="_blank" class="md-body md-light">Написать письмо</a>',
			}
		}

	}
};