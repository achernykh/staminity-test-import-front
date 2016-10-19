import {CalendarSettings} from './calendar.constants.js';
import {_PageAccess} from '../config/app.constants.js';

/**
 * Класс для работы с ui-scroll.
 * Выделен в отдельный обьект для удобства. Для календаря item = одна неделя, item data для календаря calendarItem.
 * Написан наиболее абстрактно, чтобы не привязываться к Календарю, в дальнейшем будет преобразован в отдельный,
 * полностью не зависемый от контекста класс
 */
class ScrollCalendar {
    constructor($timeout, $log){
        'ngInject'
        this._$timeout = $timeout;
        this._$log = $log;
    }
    /**
     *
     * @param index
     * @param count
     * @param success
     */
    get(index, count, success){
        //TODO продумать как лучше связывать через index count или через
        this._$timeout( () => {
            let result = [];
            for (let i = index; i <= index + count - 1; i++) {
                /**
                 * Начальная позиция календарной сетки - это первый день текущей недели. Первый день недели определяется
                 * настройками пользователя, это может быть Понедельник, Воскрсенье... Текущая неделя с точки зрения
                 * бесконечного скролла соответствует index=0, последующие недели - index++, предидущие недели index--
                 * @type {number|Moment|*}
                 */
                // TODO добавить получение настроек пользователя (вынести из данной функции в конструктор или инициализацию)
                let initPosition = moment().weekday(0);
                let item = {
                    // scroll index (sid) для навигации по календарной сетке
                    sid: i,
                    toolbarDate: moment(initPosition).add(i,'w').format('YYYY MMMM'),
                    // Необходимо отнимать 1 от недели, т.к. обычное получение недели отличается на 1 от реального
                    //TODO протестировать с разными локализациями
                    //weekId: moment(startDay).format('YYYYWW')-1,
                    // Получение календарной сетки происходит по одной недели
                    subItem: this.getDays(moment(initPosition).add(i,'w'), moment(initPosition).add(i+1,'w'))
                };
                result.push(item);
            }
            success(result);
        }, 100);
    }
    /**
     * Генерирует массив состоящих из календарных недель, которые в свою очередь содержат соответсвующие дни недели.
     * Для вывода календарной сетки, отдельный день недели должен содержать следующие значения: 1)
     * @param startDay - первый день массива
     * @param endDay - последний день массива
     * @returns {Object}
     */
    getDays(start, end){
        let diff = end.diff(start,'d');
        let subItems = [];

        for (let i = 0; i < diff; i++){
            let day = start.add(1,'d');
            subItems.push({
                selected: false,
                data: {
                    title: day.format('DD'),
                    month: day.format('MMM'),
                    day: day.format('dd'),
                    date: day.format('YYYY-MM-DD'),
                    calendarItems: []
                }
            })
        }
        return subItems;
    }
}

/**
 *
 */
class CalendarCtrl {
    constructor($log, $q, $timeout, $anchorScroll, $location, $rootScope, Auth, AppMessage, Calendar) {
        'ngInject';
        this._$log = $log;
        this._$q = $q;
        this._$timeout = $timeout;
        this._$anchorScroll = $anchorScroll;
        this._$location = $location;
        this._$rootScope = $rootScope;
        this._Auth = Auth;
        this._AppMessage = AppMessage;
        this._Calendar = Calendar;

        this.view.compact = false;

        var self = this;
        //this.grid = new ScrollCalendar(this._$timeout, this._$log);

        this.scrollAdapter = {};

        this.grid = {
            cache: {
                initialize: function () {
                    this.isEnabled = true;
                    this.weeks = {};
                    this.getPure = self.grid.get;
                    return self.grid.get = this.getCached;
                },
                getCached: (index, count, successCallback) => {
                    var self;
                    self = this.grid.cache;
                    if (self.isEnabled) {
                        if (self.getWeeks(index, count, successCallback)) {
                            return;
                        }
                        return self.getPure(index, count, function (result) {
                            self.saveWeeks(index, count, result);
                            return successCallback(result);
                        });
                    }
                    return self.getPure(index, count, successCallback);
                },
                toggle: function () {
                    this.isEnabled = !this.isEnabled;
                    return this.weeks = {};
                },

                saveWeeks: function (index, count, resultWeeks) {
                    var i, item, j, len, results;
                    results = [];
                    for (i = j = 0, len = resultWeeks.length; j < len; i = ++j) {
                        item = resultWeeks[i];
                        if (!this.weeks.hasOwnProperty(index + i)) {
                            results.push(this.weeks[index + i] = item);
                        } else {
                            results.push(void 0);
                        }
                    }
                    return results;
                },

                getWeeks: function (index, count, successCallback) {
                    var i, isCached, j, ref, ref1, result;
                    result = [];
                    isCached = true;
                    for (i = j = ref = index, ref1 = index + count - 1; j <= ref1; i = j += 1) {
                        if (!this.weeks.hasOwnProperty(i)) {
                            isCached = false;
                            return;
                        }
                        result.push(this.weeks[i]);
                    }
                    successCallback(result);
                    return true;
                }
            },
            get: (index, count, success) => {
                /**
                 * Формируем календарную сетку. Без тайм-аута библиотека не работает
                 */
                console.log('CalendarCtrl: get ', index, count, moment().format('mm:ss'));
                this._$timeout(() => {
                    //this.scrollAdapter.disabled = true;
                    let result = [];
                    let init, start, end;
                    for (let i = index; i <= index + count - 1; i++) {
                        /**
                         * Начальная позиция календарной сетки - это первый день текущей недели. Первый день недели
                         * определяется настройками пользователя, это может быть Понедельник, Воскрсенье...
                         * Текущая неделя с точки зрения бесконечного скролла соответствует index=0,
                         * последующие недели - index++, предидущие недели index--
                         * @type {number|Moment|*}
                         */
                            // TODO добавить получение настроек пользователя (вынести из данной функции в конструктор или инициализацию)
                        init = moment().startOf('week');
                        start = moment(init).add(i, 'w');
                        end = moment(init).add(i + 1, 'w');
                        let item = {
                            // scroll index (sid) для навигации по календарной сетке
                            sid: i,
                            // номер изменений недели, используем для отслеживания и пересчета итогов недели
                            changes: 0,
                            // для отображения даты в туллбаре по свойству topVisible
                            toolbarDate: moment(init).add(i, 'w').format('YYYY MMMM'),
                            selected: false,
                            // массив дней для недели
                            subItem: this.getScrollSubItems(start, end)
                        };
                        result.push(item);
                    }
                    /**
                     * Заправшиваем данные на сервере (calendarItem). Функция getCalendarItem ...
                     * Начальная дата = первый день недели от текщуей недели (index)
                     * Дата окончания = последний день недели, которая больше текущей недели (index) на count
                     */
                    start = moment().startOf('week').add(index, 'w').format('YYYY-MM-DD');
                    end = moment(start).add(count, 'w').add(-1, 'd').format('YYYY-MM-DD');

                    console.log('CalendarCtrl: api request ', index, count, moment().format('mm:ss'));
                    this.getCalendarItem({startDate: start, endDate: end}).then(
                        () => {
                            "use strict";
                            console.log('CalendarCtrl: html update success', index, count, moment().format('mm:ss'));
                        }, () => {
                        }
                    );

                    success(result);

                }, 1);

            }
        };
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

    /**-----------------------------------------------------------------------------------------------------------------
     *
     * TOOLBAR ACTIONS
     *
     * 1) onNextWeek()
     * 2) onPrevWeek()
     * 3) onScrollDate()
     *
     *----------------------------------------------------------------------------------------------------------------*/


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

    /**
     * Инициализация компонента
     * Последовательно выполняются задачи 1) формирование календарной сетки от текущей даты 2) получение записей
     * календаря из кэша браузера (если имеются) и вывод на экран 3) запрос актуализации кэша на стороне сервера
     * 4) получение актуальных данных от сервера, обновление представление на экране
     */
    $onInit() {
        // TODO убрать в ApplicationComponent или run()
        moment.locale('ru');
        console.log(`CalendarCtrl: omIniti firstDayWeek = ${moment.localeData().firstDayOfWeek()}`);

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
                    console.log('CalendarCtrl: api request complete success', moment().format('mm:ss'));
                    this.updateScrollItem('putCalendarItem',items).then(
                    //this.showCalendarItem(items).then(
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

    /**-----------------------------------------------------------------------------------------------------------------
     *
     * SCROLL ITEM FUNCTIONS - Методы управления items в ui-scroll
     *
     * Изменение осуществляется через метод applyUpdates (item,scope)
     * 1) getScrollSubItems - добавляем пустые дни недели
     * 1) scrollItemUpdate()
     * 2) deleteScrollItem
     *
     *----------------------------------------------------------------------------------------------------------------*/

    /**
     * Генерирует массив состоящих из календарных недель, которые в свою очередь содержат соответсвующие дни недели.
     * Для вывода календарной сетки, отдельный день недели должен содержать следующие значения: 1)
     * @param startDay - первый день массива
     * @param endDay - последний день массива
     * @returns {Object}
     */
    getScrollSubItems(day, end) {
        let diff = end.diff(day, 'd');
        let subItems = [];

        while (diff != 0) {

            subItems.push({
                selected: false,
                date: day.format('YYYY-MM-DD'),
                data: {
                    title: day.format('DD'),
                    month: day.format('MMM'),
                    day: day.format('dd'),
                    date: day.format('YYYY-MM-DD'),
                    calendarItems: []
                }
            });

            day.add(1, 'd');
            diff = end.diff(day, 'd');

        }
        return subItems;
    }

    /**
     *
     * @param action - действие, которое необходимо выполнить с item (неделя) или subItem (день)
     * 1) putCalendarItem
     * @param calendarItems - массив элементов типа CalendarItem
     * @returns {Promise}
     */
    updateScrollItem(action, calendarItems) {
        "use strict";
        console.log('Calendar: updateScrollItem ', action, calendarItems);
        if (!angular.isArray(calendarItems))
            calendarItems = [calendarItems];

        let init = moment();

        return new Promise((resolve, reject) => {

            for (let calendarItem of calendarItems) {
            //for(let i=0; i<calendarItems.length; i++) {

                let dayPos = moment(calendarItem.date, 'YYYY-MM-DD');
                let weekPos = dayPos.format('WW') - init.format('WW');

                //console.log('Calendar: updateScrollItem search ', dayPos.weekday(), weekPos, calendarItems.length);

                // Перебираем все scrollItem
                this.scrollAdapter.applyUpdates((item, scope) => {
                    if (item.sid == weekPos) {

                        //console.log('Calendar: updateScrollItem search true', action, item.sid);
                        switch (action) {
                            // Добавляем запись календаря в неделю (scrollItem) -> день (subItem.data.calendarItems)
                            case 'putCalendarItem': {
                                item.changes = item.changes + 1;
                                item.subItem[dayPos.weekday()].data.calendarItems.push(calendarItem);
                                break;
                            }
                            case 'deleteCalendarItem': {
                                item.changes = item.changes + 1;
                                let id = calendarItem.calendarItemId;
                                let ind = item.subItem[dayPos.weekday()].data.calendarItems.map((el) => el.calendarItemId).indexOf(id);
                                console.log('Calendar: delete activity info', item, weekPos, dayPos, id, ind, calendarItems.length);
                                item.subItem[dayPos.weekday()].data.calendarItems.splice(ind, 1);
                                break;
                            }
                            case 'deleteCalendarItem': {

                                break;
                            }
                        }

                    }
                    return item;
                });
            }
            resolve();
        });

    }

    /**
     *
     * @param calendarItem
     */
    onDeleteCalendarItem(calendarItem){
        "use strict";
        this.updateScrollItem('deleteCalendarItem',calendarItem).then(
            (success) => {
                // TODO добавить api
                // TODO добавить toast
                console.log('Calendar: onDeleteCalendarItem', success);
                //resolve(success);
            }, (error) => {
                //reject(error);
            });
    }
    /*onDeleteCalendarItem(calendarItem) {
        "use strict";
        let init = moment();
        let date = moment(calendarItem.date, 'YYYY-MM-DD');
        let dayPos = date.weekday();
        let weekPos = date.format('WW') - init.format('WW');
        let id = calendarItem.calendarItemId;

        return this.scrollAdapter.applyUpdates((item, scope) => {

            try {
                if (item.sid == weekPos) {
                    let ind = item.subItem[dayPos].data.calendarItems.map((el) => el.calendarItemId).indexOf(id);
                    this._$log.error('Calendar: delete activity info', item, weekPos, dayPos, id, ind);
                    item.subItem[dayPos].data.calendarItems.splice(ind, 1);
                }
            } catch (error) {
                this._$log.error('Calendar: delete activity error ', error);
            }
            return item;
        });
    }*/

    onDropCalendarItem(targetDate, index, calendarItem) {
        "use strict";
        let init = moment();
        let date = moment(targetDate, 'YYYY-MM-DD');
        let dayPos = date.weekday();
        let weekPos = date.format('WW') - init.format('WW');

        this.scrollAdapter.applyUpdates((item, scope) => {

            try {
                if (item.sid == weekPos) {
                    calendarItem.date = targetDate;
                    this._$log.info('Calendar: drop activity info', item, targetDate, index);
                    item.subItem[dayPos].data.calendarItems.splice(index, 0, calendarItem);
                }
            } catch (error) {
                this._$log.error('Calendar: drop activity error ', error);
            }
            return item;
        });

        return calendarItem;

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