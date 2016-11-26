import { CalendarSettings } from './calendar.constants.js';
import { _PageAccess } from '../config/app.constants.js';

const times = (n) => Array.from(new Array(n)).map((_, i) => i)

  
/**
 *
 */
class CalendarCtrl {
    constructor($scope, $log, $q, $timeout, $anchorScroll, $location, $rootScope, Auth, AppMessage, Calendar, ActionMessage) {
        'ngInject';
        this._$log = $log;
        this._$q = $q;
        this._$timeout = $timeout;
        this._$anchorScroll = $anchorScroll;
        this._$location = $location;
        this._$rootScope = $rootScope; // слушаем новые сообщения от api
        this._Auth = Auth;
        this._AppMessage = AppMessage;
	    this._ActionMessage = ActionMessage;
        this._Calendar = Calendar;
        this._$scope = $scope;

        this.weekdays = []; // название дней недели
	    this.buffer = []; //для операций copy/paste
        this.view.compact = false; //компактный/полный режим отображения calendarItems
        var self = this;
        
        this.onLoad = () => $scope.$apply()
        this.reset(new Date())
        
        /**
         * Слушаем события, которые могут обновить данные Календаря:
         * 1) newActivity - добавлена новая запись
         * 2) deleteActivity - удалена запись
         * 3) modifyActivity - изменена запись
         * 4) changeAthlete - изменен атлет
         */
        this._$rootScope.$on('addActivity', (event, data) => {
            this.$onPutActivity(data);
        });
        // Смена атлета тренера в основном окне приложения, необходмо перезагрузить все данные
        this._$rootScope.$on('changeAthlete', (event, data) => {
            this.$onInit();
        })

    }

    /**
     * Инициализация компонента
     * Последовательно выполняются задачи 1) формирование календарной сетки от текущей даты 2) получение записей
     * календаря из кэша браузера (если имеются) и вывод на экран 3) запрос актуализации кэша на стороне сервера
     * 4) получение актуальных данных от сервера, обновление представление на экране
     */
    $onInit() {
        // TODO убрать в ApplicationComponent или run()
        moment.locale('ru');

        for (let i=0; i<7; i++) {
            this.weekdays.push(moment().startOf('week').add(i,'d').format('dddd'));
        }
        console.log('CalendarCtrl: omIniti => weedays',this.weekdays);
        // TODO добавить рассчет padding для скролла (зависит от размера экрана)

    }

    /**
     * Стандартная функция, срабатывает после успешного перехода на представление
     * Проверяем полученные параметры в ссылке url
     * @param next
     */
    $routerOnActivate(next) {
        // Если передан параметр 'athlete' в ссылке, то календарь загружаем для данного атлета, а не текущего
        // пользователя
        if (next.params.athlete)
            this._$log.debug('Calendar: $routerOnActivate with athlete number', next.params.athlete);
    }
    
    /**
     * Предоставляет объекты WeekItem
     * @param date - любой Datetime недели
     * @param index - позиция в списке
     */
    getWeek (date, index) {
        let start = moment(date).startOf('week');
        let end = moment(start).add(1, 'w');
        
        return this._Calendar.getItem({ startDate: start.format('YYYY-MM-DD'), endDate: end.format('YYYY-MM-DD') })
        .then((items) => {
            console.log('CalendarCtrl: api request complete success', moment().format('mm:ss'));
            
            let days = times(7).map((i) => {
                let day = moment(start).add(i, 'd');
                let calendarItems = items.filter(item => moment(item.date, 'YYYY-MM-DD').weekday() == i);
                
                return {
                    key: day.format('YYYY-MM-DD'),
                    selected: false,
                    date: day.format('YYYY-MM-DD'),
                    data: {
                        title: day.format('DD'),
                        month: day.format('MMM'),
                        day: day.format('dd'),
                        date: day.format('YYYY-MM-DD'),
                        calendarItems: calendarItems
                    }
                };
            });
            
            return {
                sid: index,
                changes: 0,
                toolbarDate: start.format('YYYY MMMM'),
                selected: false,
                subItem: days
            };    
        });
    }
    
    /**
     * Переход на дату, на пустой календарь
     * @patam date
     */
    reset (date) {
        this.date = date
        this.range = [0, 1]
        this.items = []
        this.isLoadingUp = false
        this.isLoadingDown = false
    }
    
    /**
     * Подгрузка n записей вверх
     * @patam n
     */
    up (n = 10) {
        if (this.isLoadingUp) return
        console.log('up')
        this.isLoadingUp = true
        
        let i0 = this.range[0]
        this.range[0] -= n
        
        let items = times(n)
            .map((i) => i0 - i)
            .map((i) => this.getWeek(moment(this.date).add(i, 'w'), i))
        
        return Promise.all(items)
            .then((items) => { this.items = [...items.reverse(), ...this.items] })
            .then(() => { this.isLoadingUp = false })
            .then(() => this.onLoad())
    }
    
    /**
     * Подгрузка n записей вниз
     * @patam n
     */
    down (n = 10) {
        if (this.isLoadingDown) return
        console.log('down')
        this.isLoadingDown = true
        
        let i0 = this.range[1]
        this.range[1] += n
        
        let items = times(n)
            .map((i) => i0 + i)
            .map((i) => this.getWeek(moment(this.date).add(i, 'w'), i))
        
        return Promise.all(items)
            .then((items) => { this.items = [...this.items, ...items] })
            .then(() => { this.isLoadingDown = false })
            .then(() => this.onLoad())
    }
    
    /**
     * Верхний загруженный Week Item
     */
    first () {
        return this.items[0]
    }
    
    /**
     * Нижний загруженный Week Item
     */
    last () {
        return this.items[this.items.length - 1]
    }

    /**-----------------------------------------------------------------------------------------------------------------
     *
     * TOOLBAR ACTIONS
     *
     * 1) onScrollDate()
     * 2) gotoAnchor() - переход по неделям, без обновления
     *
     *----------------------------------------------------------------------------------------------------------------*/
    
	onScrollDate(){
		"use strict";
	}

    /**
     * Переход на неделю по ее индексу
     * Используется для кнопок: "вперед", "назад"
     * @param index
     */
	gotoAnchor(index){
		this._$log.info(`scrollto index= ${index}`);
		let newHash = 'week' + index;

		if (this._$location.hash() !== newHash) {
			// set the $location.hash to `newHash` and
			// $anchorScroll will automatically scroll to it
			this._$location.hash('week' + index);
            //let week =  angular.element(document.getElementById(newHash));
            //this._$document.scrollToElement(week, 0, 500);
		} else {
			// call $anchorScroll() explicitly,
			// since $location.hash hasn't changed
			this._$anchorScroll();
		}
	}

    /**-----------------------------------------------------------------------------------------------------------------
     *
     * WEEK & DAY ACTIONS
     *
     * 1) onToggleWeek()
     * 2) onCopyWeek()
     * 2) onPasteWeek()
     * 3) onDeleteWeek()
     * 4) onToggleDay()
     * 5) onCopyDay()
     * 6) onPasteDay()
     * 7) onDeleteDay()
     * 8) onAddItem()
     *
     *----------------------------------------------------------------------------------------------------------------*/

	/**
	 * Копирование записи календаря
	 * @param item - обьект формата calendarItem
	 */
	onCopyItem(item) {
	    "use strict";
        if (!angular.isArray(item))
            item = [item];

        this.buffer = item;
        this._ActionMessage.simple(`Записи скопированы (${this.buffer.length})`);
    }
    
    /**
     * Удаление записи календаря
     * @param calendarItem
     */
    onDeleteItem(calendarItem) {
        "use strict";
        
        let init = moment()
        let dayPos = moment(calendarItem.date, 'YYYY-MM-DD')
        let weekPos = dayPos.format('WW') - init.format('WW')
        let weekItem = this.datasource.items.find((item) => item.sid == weekPos)
        let dayItem = weekItem && weekItem.subItem[dayPos.weekday()]
        
        if (weekItem && dayItem) {
            console.log('Calendar: delete activity info', weekItem, dayItem, calendarItem);
            weekItem.changes = weekItem.changes + 1;
            let id = calendarItem.calendarItemId;
            let ind = dayItem.data.calendarItems.map((el) => el.calendarItemId).indexOf(id);
            dayItem.data.calendarItems.splice(ind, 1);
            this._ActionMessage.screen('Запись удалена');
        }
    }
    
    /**
     * Drop записи календаря (операция drag&drop)
     * @param targetDate
     * @param index
     * @param calendarItem
     * @returns {*}
     */
    onDropItem(targetDate, index, calendarItem) {
        "use strict";
        
        let init = moment()
        let dayPos = moment(targetDate, 'YYYY-MM-DD');
        let weekPos = dayPos.format('WW') - init.format('WW');
        let weekItem = this.datasource.items.find((item) => item.sid == weekPos)
        let dayItem = weekItem && weekItem.subItem[dayPos.weekday()]
        
        if (weekItem && dayItem) {
            console.log('Calendar: drag&drop', targetDate, index, weekItem, dayItem, calendarItem);
            weekItem.changes = weekItem.changes + 1;
            calendarItem.date = dayPos;
            dayItem.data.calendarItems.splice(index, 0, calendarItem);
            this._ActionMessage.simple('Запись перемещена');
        }
    }
    
    onCopyDay() {
        "use strict";

    }
    
    /**
     * Вставка буфера скопированных записей
     * @param date
     */
    onPasteDay(date){
        "use strict";
        /**
         * Так как скопировать можно диапазон дней-недель, то целевые дни-недели могут иметь разные даты. Поэтому
         * необходимо отдавать по одному элементу на вставку, так как функция grid.update универсальна и работает в
         * рамках одного дня/недели
         */
        // Для массового копирования/вставки необходимо отсортировать буфер по дате от самой ранней к последней.
        // Разница дат между записями в буфере должна остаться и в целевом дипазоне вставки, для этого отслеживается
        // дата предидущего элемента, на эту разнцу сдвигается дата вставки

        let task = [];
        let previewItem, targetDay = date, shift;

        for (let calendarItem of this.buffer) {
            // Для второй и последующих записей буфера вычисляем смещение в днях для вставки
            if (!!previewItem) {
                shift = moment(calendarItem.date, 'YYYY-MM-DD').diff(moment(previewItem.date,'YYYY-MM-DD'), 'days');
                targetDay = moment(date, 'YYYY-MM-DD').add(shift,'d').format('YYYY-MM-DD');
            }
            // Сразу не выполняем, сохраняем задание для общего запуска и отслеживания статуса
            // task.push(this.grid.update('pasteCalendarItem', calendarItem, {date: targetDay}));
            //                     item.changes = item.changes + 1;
            //                     dayPos = moment(params.date, 'YYYY-MM-DD');
            //                     weekPos = dayPos.format('WW') - init.format('WW');
            //                     calendarItem.date = dayPos; // меняем дату в записи на целевую
            //                     item.subItem[dayPos.weekday()].data.calendarItems.push(calendarItem);
            previewItem = calendarItem;
        }
        // Запускаем выполнение
        Promise.all(task).then(
            () => {
                this._ActionMessage.simple(`Записи вставлены (${this.buffer.length})`);
                this.buffer = [];
            },
            (error) => {
                console.log('CalendarCtrl: onPasteDay => error=', error);
            }
        );
    }

    /**
     *
     * @param week
     */
    onToggleWeek(week, value) {
        "use strict";
        this._$log.error('Calendar: onToggleWeek', week, value);
        return this.scrollAdapter.applyUpdates((item, scope) => {
            try {
                if (item.sid == week) {
                    item.selected = value;
                    for (let i = 0; i < item.subItem.length; i++) {
                        item.subItem[i].selected = value;
                    }
                }
            } catch (error) {
                this._$log.error('Calendar: add activity error ', error);
            }
            return item;
        });
    }



    /**-----------------------------------------------------------------------------------------------------------------
     *
     * CALENDAR API  Функции обмена данными с сервером
     *
     * 1) getCalendarItem()
     * 2) postCalendarItem()
     * 2) putCalendarItem()
     * 4) deleteCalendarItem()
     *
     *----------------------------------------------------------------------------------------------------------------*/

    /**
     * Получение списка событий календаря за период времени
     * @param request {Object} Параметры запроса элементов календаря, содержащий calendarItemId - идентификатор записи.
     * Наивысший приоритет, userId - Идентификатор владельца событий (для сбора данных под ролью тренера),
     * userGroupId - идентификатор группы владельцев событий. Анализируется, если не указан userId,
     * startDate - дата начала интервала (ГГГГ-ММ-ДД), endDate - дата конца интервала (ГГГГ-ММ-ДД)
     */
    getCalendarItem(request) {

        return new Promise((resolve, reject) => {
            "use strict";
            this._Calendar.getItem(request).then(
                (items) => {
                    console.log('CalendarScroll: api request complete success', moment().format('mm:ss:SS'));
                    this.grid.update('putCalendarItem',items).then(
                        (success) => {
                            //      this._$log.debug('Calendar: grid after showCalendarItem', success);
                            resolve(success);
                        }, (error) => {
                            reject(error);
                        });
                }
            );
        });
    }

    /**
     * Изменение записи календаря
     * @param items {Array|Object} Запись или записи календаря в формате calendarItem с указанием данных в соотв-х
     * объектах заголовков
     */
    postCalendarItem(items) {
        // Если передана только одна запись, то переводим ее в массив из одного элемента
        if (angular.isObject(items))
            items = [items];

        // Для каждой записи отправляем ассинхронное задание на сервер
        for (let item of items) {
            this._Calendar.postItem(item).then(
                (success) => {
                    // Обработка успешно выполненных заданий по изменению активностей, скорее всего тут ничего
                    // дописывать не надо, так как в ответ будет приходить системное сообщение об успешном выполнение
                    // TODO toast message

                }, (error) => {
                    // обработка события в случае ошибки, возможно, что потребуется откатывать изменения
                    // TODO toast message
                }
            )
        }
    }

    /**
     * Создание записи календаря
     * @param items {Array|Object} Запись или записи календаря в формате calendarItem с указанием данных в соотв-х
     * объектах заголовков
     */
    putCalendarItem(items) {
        // Если передана только одна запись, то переводим ее в массив из одного элемента
        if (angular.isObject(items))
            items = [items];

        // Для каждой записи отправляем ассинхронное задание на сервер
        for (let item of items) {
            //TODO добавить userProfileOwner внутрь CalendarItem = currentAthlete.public || currentUser.public
            this._Calendar.putItem(item).then(
                (success) => {
                    // Обработка успешно выполненных заданий по созданию активностей
                    // Сервер вернет такой же обьект CalendarItem, только будет заполнен id и revision
                    // TODO toast message

                }, (error) => {
                    // обработка события в случае ошибки, возможно, что потребуется откатывать изменения
                    // TODO toast message
                }
            )
        }
    }

    /**
     * Удаление активности
     * @param items {Object} Параметр запроса, где mode: [P] - удаление плановой информации из activityHeader,
     * [D] -удаление детальных даннных из activityDetails, [F] - полное удаление записи и детальных данных;
     * calendarItems: массив с числовыми идентификаторами тренировок
     */
    deleteCalendarItem(mode = 'F', items = []) {
        // Если передана только одна запись, то переводим ее в массив из одного элемента
        if (angular.isObject(items))
            items = [items];

        let request = {
            mode: mode,
            // Перебираем массив items и оставляем только id
            calendarItems: items.map((item) => {
                return item.calendarItemId
            })
        };

        this._Calendar.deleteItem(request).then(
            (success) => {
                this._$log.debug('Delete item success', success);
                // Обработка успешно выполненных заданий по удалению активностей
                // TODO toast message

            }, (error) => {

                this._$log.debug('Delete item error', error);
                // обработка события в случае ошибки, возможно, что потребуется откатывать изменения
                // TODO toast message
            }
        )
    }

    /**
     * Обработка событий со стороны пользователя -----------------------------------------------------------------------
     */
    /**
     * Копирование активности
     */
    onCopyActivity() {

    }

    onDeleteActivity() {

    }

    onCopyDay() {

    }

    onDeleteDay() {

    }

    /**
     * Функции обновления данных по новым событиям со стороны сервера --------------------------------------------------
     */
    $onPutActivity(activity) {
        this._$log.debug('Calendar: $onPutActivity', activity);
    }

    $onDeleteActivity() {

    }

    $onModifyActivity() {

    }

}


/**
 * Компонент Calendar
 * @type {{bindings: {$router: string}, require: {}, transclude: boolean, controller,
 * templateUrl: string, $canActivate: Function}}
 */
let Calendar = {
    bindings: {
        view: '<'
    },
    require: {
        app: '^staminityApplication'
    },
    transclude: false,
    controller: CalendarCtrl,
    templateUrl: 'calendar/calendar.html',
    /*$routeConfig: [
        {path: '/',    name: 'Calendar',   component: 'calendar', useAsDefault: true},
        {path: '/:id', name: 'Calendar', component: 'calendar'}
    ],*/
    $canActivate: function($log, $timeout, $nextInstruction, $prevInstruction, Auth, AppMessage, $rootRouter) {
        'ngInject';
        /**
         * Выполняем проверку полномочий с задержкой на 100мс на случай, если пользотватель не перешел на данную
         * страницу, а запустил ее сразу. При таком варианте инициализация сессии пользователя еще не завершиться и
         * проверка полномочий вернет ошибку
         */
        return new Promise((resolve, reject) => {
            $timeout(()=>angular.noop,500).then(
                () => {
                    $log.debug('Calendar: check auth=', $rootRouter, _PageAccess[$nextInstruction.componentType]);
                    let authorizedRoles = _PageAccess[$nextInstruction.componentType];
                    if (!Auth.isAuthorized(authorizedRoles)) {
                        $log.debug('Calendar: check auth false');
                        if (Auth.isAuthenticated())
                            AppMessage.show({
                                status: 'warning',
                                title: 'Ошибка авторизации',
                                text: 'К сожалению у вас не достаточно прав для просмотра запрашиваемой страницы.' +
                                ' Необхоимы полномочия '+ authorizedRoles
                            });
                        else {
                            AppMessage.show({
                                status: 'warning',
                                title: 'Ошибка аутентификации',
                                text: 'Для просмотра данной страницы необходимо пройти аутентификацию'
                            });
                        }
                        if ($prevInstruction == undefined) $rootRouter.navigate(['SignIn']);
                        return reject(false);
                    } else {
                        $log.debug('Calendar: check auth success');
                        return resolve(true);
                    }
                    //return reject;
                }
            )
        })
    }
};

export default Calendar;