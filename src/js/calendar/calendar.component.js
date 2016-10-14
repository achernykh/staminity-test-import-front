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
    constructor($log, $q, $timeout,$anchorScroll, $location, $rootScope, Auth, AppMessage, Calendar) {
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
        var self = this;
        //this.grid = new ScrollCalendar(this._$timeout, this._$log);

        this.scrollAdapter = {};

        this.grid = {
            cache: {
                initialize: function() {
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
                        return self.getPure(index, count, function(result) {
                            self.saveWeeks(index, count, result);
                            return successCallback(result);
                        });
                    }
                    return self.getPure(index, count, successCallback);
                },
                toggle: function() {
                    this.isEnabled = !this.isEnabled;
                    return this.weeks = {};
                },

                saveWeeks: function(index, count, resultWeeks) {
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

                getWeeks: function(index, count, successCallback) {
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

                "use strict";
                /**
                 * Формируем календарную сетку. Без тайм-аута библиотека не работает
                 */

                this._$timeout( () => {
                    //this.scrollAdapter.disabled = true;
                    let result = [];
                    for (let i = index; i <= index + count - 1; i++) {
                        /**
                         * Начальная позиция календарной сетки - это первый день текущей недели. Первый день недели определяется
                         * настройками пользователя, это может быть Понедельник, Воскрсенье... Текущая неделя с точки зрения
                         * бесконечного скролла соответствует index=0, последующие недели - index++, предидущие недели index--
                         * @type {number|Moment|*}
                         */
                        // TODO добавить получение настроек пользователя (вынести из данной функции в конструктор или инициализацию)
                        let initPosition = moment().startOf('week');
                        let item = {
                            // scroll index (sid) для навигации по календарной сетке
                            sid: i,
                            toolbarDate: moment(initPosition).add(i,'w').format('YYYY MMMM'),
                            subItem: this.getDays(moment(initPosition).add(i,'w'), moment(initPosition).add(i+1,'w'))
                        };
                        result.push(item);
                    }

                    this._$log.debug(`CalendarCtrl: get index=${index} count=${count} first=${moment().weekday(0).format('YYYY-MM-DD')}`);

                    /**
                     * Заправшиваем данные на сервере (calendarItem). Функция getCalendarItem ...
                     */
                    //this._$timeout( () => {
                        let start = moment().weekday(0), end;
                        start = moment(start).add(index,'w');
                        end = moment(start).add(count,'w').add(-1,'d');
                        this._$log.debug(`CalendarCtrl: get api start=${start.format('YYYY-MM-DD')} end=${end.format('YYYY-MM-DD')}`);
                        this.getCalendarItem({startDate: start.format('YYYY-MM-DD'), endDate: end.format('YYYY-MM-DD')}).then(
                            (success) => {}, (error) => {}
                        );
                    //},100);
                    //this.scrollAdapter.disabled = false;
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
    /**
     * Генерирует массив состоящих из календарных недель, которые в свою очередь содержат соответсвующие дни недели.
     * Для вывода календарной сетки, отдельный день недели должен содержать следующие значения: 1)
     * @param startDay - первый день массива
     * @param endDay - последний день массива
     * @returns {Object}
     */
    getDays(day, end){
        let diff = end.diff(day,'d');
        let subItems = [];

        //this._$log.debug(`CalendarCtrl: getDays day=${day.format('YYYY-MM-DD')} end=${end.format('YYYY-MM-DD')} diff=${diff}`);

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

            day.add(1,'d');
            diff = end.diff(day,'d');

        }
        return subItems;
    }
    onSelectDay(day){
        "use strict";
        this._$log.debug('Calendar: onSelectDay day=');
    }
    /**
     * Инициализация компонента
     * Последовательно выполняются задачи 1) формирование календарной сетки от текущей даты 2) получение записей
     * календаря из кэша браузера (если имеются) и вывод на экран 3) запрос актуализации кэша на стороне сервера
     * 4) получение актуальных данных от сервера, обновление представление на экране
     */
    $onInit() {
        moment.locale('ru');
        this._$log.debug(`CalendarCtrl: omIniti firstDayWeek = ${moment.localeData().firstDayOfWeek()}`)

        //this._$timeout(()=>angular.noop, 0).then(
        //    () => {
                this._$log.debug('Calendar: $onInit for user=',
                    this.app.currentUser, this.app.currentAthlete);
        //    });
        // User ­ getTimeZone(userId=currentUser.userId)

    }

    /**
     * Стандартная функция, срабатывает после успешного перехода на представление
     * Проверяем полученные параметры в ссылке url
     * @param next
     */
    $routerOnActivate(next){
        // Если передан параметр 'athlete' в ссылке, то календарь загружаем для данного атлета, а не текущего
        // пользователя
        if(next.params.athlete)
            this._$log.debug('Calendar: $routerOnActivate with athlete number', next.params.athlete);
    }
    /**
     * Функции обмена данными с сервером -------------------------------------------------------------------------------
     */
    /**
     * Получение списка событий календаря за период времени
     * @param request {Object} Параметры запроса элементов календаря, содержащий calendarItemId - идентификатор записи.
     * Наивысший приоритет, userId - Идентификатор владельца событий (для сбора данных под ролью тренера),
     * userGroupId - идентификатор группы владельцев событий. Анализируется, если не указан userId,
     * startDate - дата начала интервала (ГГГГ-ММ-ДД), endDate - дата конца интервала (ГГГГ-ММ-ДД)
     */
    getCalendarItem(request){

        return new Promise( (resolve,reject) => {
            "use strict";
            this._Calendar.getItem(request).then(
                (items) => {
                    this.showCalendarItem(items).then(
                        (success) => {
                            //      this._$log.debug('Calendar: grid after showCalendarItem', success);
                            resolve(success);
                        }, (error) => {
                            reject(error);
                        });
                }
            );
        });
        /*
        this._Calendar.getItem(request).then(
            (items) => {
                //this._$log.debug('Calendar: getCalendarItem response', items);
                //this.items = items;
                this.showCalendarItem(items).then(
                  (success) => {
                //      this._$log.debug('Calendar: grid after showCalendarItem', success);
                  })

                // В этом месте можно сделать присвоение для переменной компонента, например
                // this.items = this.items.concat(items),
                // где this.items (может у вас что-то другое) тот обьект который связан с разметкой и выводом элементов
                // Если вам нужно будет, то можно и в return записать результаты, но тогда потеряется ассинхронность
                // Как доберетесь до готовности подключить api - выходите на связь, решим как сделать
            }
        );*/
    }
    /**
     * Изменение записи календаря
     * @param items {Array|Object} Запись или записи календаря в формате calendarItem с указанием данных в соотв-х
     * объектах заголовков
     */
    postCalendarItem(items){
        // Если передана только одна запись, то переводим ее в массив из одного элемента
        if (angular.isObject(items))
            items = [items];

        // Для каждой записи отправляем ассинхронное задание на сервер
        for (let item of items){
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
    putCalendarItem(items){
        // Если передана только одна запись, то переводим ее в массив из одного элемента
        if (angular.isObject(items))
            items = [items];

        // Для каждой записи отправляем ассинхронное задание на сервер
        for (let item of items){
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
    deleteCalendarItem(mode = 'F', items = []){
        // Если передана только одна запись, то переводим ее в массив из одного элемента
        if (angular.isObject(items))
            items = [items];

        let request = {
            mode: mode,
            // Перебираем массив items и оставляем только id
            calendarItems: items.map( (item) => {return item.calendarItemId})
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
    onCopyActivity(){

    }
    onDeleteActivity(){

    }
    onCopyDay(){

    }
    onDeleteDay(){

    }
    /**
     * Функции обновления данных по новым событиям со стороны сервера --------------------------------------------------
     */
    $onPutActivity(activity){
        this._$log.debug('Calendar: $onPutActivity', activity);
    }
    $onDeleteActivity(){

    }
    $onModifyActivity(){

    }

    //TODO под удаление
    mockGetActivityList(){

        this.showCalendarItem(this.items).then(
            (success) => {
                this._$log.debug('Calendar: grid after showCalendarItem', this.grid);
            }
        )
    }

    //TODO под удаление
    mockClearActivityList(){

        this.items.forEach( activity => {
            // let iW = moment(items.date, 'YYYY-MM-DD').format('YYYYWW'),
            //     iD = moment(items.date, 'YYYY-MM-DD').format('YYYYMMDD');
            let date = this.getDate(items.date);

            // this.destroyCalendarItem({iw: date.iw, id: date.id, value: []});
        });
    }


    showCalendarItem(data){

        /*return new Promise( (resolve,reject) => {
            "use strict";
            let init = moment();
            for (let calendarItem of data) {
                let dayPos = moment(calendarItem.date,'YYYY-MM-DD');
                let weekPos = dayPos.format('WW') - init.format('WW');

                this.scrollAdapter.applyUpdates( (item, scope) => {

                    // weekId должны совпадать, и в добавок в week должна находится перемення
                    // совпадающая с day
                    // this._$log.debug('Calendar week', week);
                    try{
                        if (item.sid == weekPos) {
                            item.subItem[dayPos].data.calendarItems.push(calendarItem);
                            //this._$log.debug('Calendar: add activity success ', item);
                        }
                    } catch (error){
                        this._$log.error('Calendar: add activity error ', error);
                    }
                    return item;
                });
            }
            resolve();
        });*/

        let result = this._$q.defer();
        data.forEach( item => {
            let init = moment();
            let day = moment(item.date,'YYYY-MM-DD');
            //let week = day.diff(init,'w');
            let week = day.format('WW') - init.format('WW');
            //let date = this.getDate(items.date);
            //items = this.determineStatus(items);
            this._$log.debug(`CalendarCtrl: showCalendarItem itemDay=${item.date} itemId=${item.calendarItemId} day=${day.format('YYYY-MM-DD')} week=${week} week#=${day.format('WW')} week#=${init.format('WW')}`);
            this.addCalendarItem(week, day.weekday(), item);
        });
        result.resolve(true);
        return result.promise;
    }
    /**
     * Получаем все дни недели что входят в промежуток от startDay до endDay
     * @param startDay - начало недели
     * @param endDay - конец недели
     * @returns {Object}
     */
    getCalendarWeek(startDay, endDay){
        let start = startDay, end = endDay;
        let diff = end.diff(start,'d'),
          day = {
              title: null,
              items: []
          },
          week = {};
        while (diff != 0) {

            day.title = start.format('DD');
            day.month = start.format('MMM');
            day.day = start.format('dd');
            angular.extend(week, {[start.format('YYYYMMDD')]: day});

            //Проверяем все дни на соответствие текущему, если соответствует - добавляем свойство today: true в
            //объект day. Далее с помощь ng-class добавляем класс today
            if (( start.format('DD MMM YYYY') ==  moment().format('DD MMM YYYY'))) {
                day.today = true;
            }
            day = {
                title: null,
                month: null,
                day: null,
                items: []
            };

            start.add(1,'d');
            diff = end.diff(start,'d');
        }
        return week;
    }

    /**
     * Переход к Елементу по id
     * @param index - на который необходимо перейти
     */
    gotoAnchor(index){
        this._$log.debug(`scrollto index= ${index}`);
        this._$log.debug('Calendar: hash', this._$location.hash());
        let newHash = 'week' + index;
        if (this._$location.hash() !== newHash) {
            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            this._$location.hash('week' + index);

        } else {
            // call $anchorScroll() explicitly,
            // since $location.hash hasn't changed
            this._$anchorScroll();
        }
    }

    // TODO добавить проверку на содержание в кэше, необходимой недели/дня.
    /**
     * Переходим по неделям.
     * @param index - значени для перехода
     */
    gotoIndex(index) {
        this._$log.info(`Calendar goto index= ${index}`);
        index = parseInt(index, 10);
        index = isNaN(index) ? 1 : index;
        this.scrollAdapter.reload(index);
    }

    /**
     * Добавляем задания для каждого дня.
     * @param data.iw - неделя на которой находится день
     * @params data.id - день в который необходимо добавить
     * @params data.value - значения для добавления
     * @returns {*}
     */
    addCalendarItem(weekPos, dayPos, calendarItem) {

        // this._$log.info(`Calendar activity to weekId= ${weekId} day= ${day}`);
        return this.scrollAdapter.applyUpdates( (item, scope) => {

            // weekId должны совпадать, и в добавок в week должна находится перемення
            // совпадающая с day
            // this._$log.debug('Calendar week', week);
            try{
                if (item.sid == weekPos) {
                    item.subItem[dayPos].data.calendarItems.push(calendarItem);
                    //this._$log.debug('Calendar: add activity success ', item);
                }
            } catch (error){
                this._$log.error('Calendar: add activity error ', error);
            }
            return item;
        });
    }
    //TODO необходим рефакторинг и найти путь объединения с addCalendarItem

    onDropCalendarItem(targetDate, index, calendarItem) {
        "use strict";
        let init = moment();
        let date = moment(targetDate,'YYYY-MM-DD');
        let dayPos = date.weekday();
        let weekPos = date.format('WW') - init.format('WW');

        this.scrollAdapter.applyUpdates( (item, scope) => {

            try{
                if (item.sid == weekPos) {
                    calendarItem.date = targetDate;
                    this._$log.info('Calendar: drop activity info', item, targetDate, index);
                    item.subItem[dayPos].data.calendarItems.splice(index,0, calendarItem);
                }
            } catch (error){
                this._$log.error('Calendar: drop activity error ', error);
            }
            return item;
        });

        return calendarItem;

    }

    onDeleteCalendarItem(calendarItem) {
        "use strict";
        let init = moment();
        let date = moment(calendarItem.date,'YYYY-MM-DD');
        let dayPos = date.weekday();
        let weekPos = date.format('WW') - init.format('WW');
        let id = calendarItem.calendarItemId;

        return this.scrollAdapter.applyUpdates( (item, scope) => {

            try{
                if (item.sid == weekPos) {
                    let ind = item.subItem[dayPos].data.calendarItems.map((el) => el.calendarItemId).indexOf(id);
                    this._$log.error('Calendar: delete activity info', item, weekPos, dayPos, id, ind);
                    item.subItem[dayPos].data.calendarItems.splice(ind,1);
                }
            } catch (error){
                this._$log.error('Calendar: delete activity error ', error);
            }
            return item;
        });
    }

    /**
     * Удаляем любой Item. только один елемент.
     * @param data - object содержащий {date} и {calendarItemId} и {mode} подробнее
     *               документация deleteCalendarItem
     * @returns {Object}
     */
    destroyCalendarItem(data, mode = 'F') {

        let date = this.getDate(data.date);

        return this.scrollAdapter.applyUpdates( (week, scope) => {
            try{
                if (week.weekId == date.iw) {

                    week.week[date.id].items.forEach((item, index) => {
                        //Если такая запись есть, тогда удаляем её из массива и отправляем на сервер запрос на удаление.
                       if(item.calendarItemId == data.calendarItemId) {
                           week.week[date.id].items.splice(index, 1);
                           this.deleteCalendarItem(mode,item);
                       }
                    });
                }
            } catch (error){
                this._$log.error('Calendar error ', error);
            }
            return week;
        });
    }
    /**
     * Переводим полученные значения от ui-scroll в количество запрашиваемых недель.
     * @param index - переданый index срабатывания события пролистывания
     */
    adapterGetCalendarItem(index) {
        let currDay = moment().weekday(0);
        let startWeek, endWeek;
        if(index==0){
            startWeek = moment(currDay).add(index-CalendarSettings.weekRange,'w');
            endWeek = moment(currDay).add(index+CalendarSettings.weekRange,'w');
            this._$log.debug('Calendar start and end =', moment(currDay).add(index-CalendarSettings.weekRange,'w').format('YYYYWW'), moment(currDay).add(index+CalendarSettings.weekRange,'w').format('YYYYWW'));
        } else if(index<0){
            startWeek = moment(currDay).add(index-CalendarSettings.weekRange,'w');
            endWeek = moment(currDay).add(index.weekRange,'w');
            this._$log.debug('Calendar start and end -', moment(currDay).add(index-CalendarSettings.weekRange,'w').format('YYYYWW'), moment(currDay).add(index,'w').format('YYYYWW'));
        } else {
            startWeek = moment(currDay).add(index,'w');
            endWeek = moment(currDay).add(index+CalendarSettings.weekRange,'w');
            this._$log.debug('Calendar start and end +',moment(currDay).add(index,'w').format('YYYYWW'), moment(currDay).add(index+CalendarSettings.weekRange,'w').format('YYYYWW'));
        }

        this.getCalendarItem({startDate:startWeek.format('YYYY-MM-DD'), endDate:endWeek.format('YYYY-MM-DD')});
    }
    /**
     * Выполняем проверку статуса задания.
     * @param items - переданый items
     * @returns {Object}
     */
    determineStatus(items){
        // TODO Документация 46-48
        // Если не активити тогда, сразу без расчетов выводим цвет.
        if(items.calendarItemType != 'activity'){
            // this._$log.debug('TEST items.calendarItemType', items.calendarItemType);
        } else {
            // Выполнено, если в {{$.activityHeader.intervals}} присутствует интервал с типом W;
            if(items.activityHeader.intervals){

            }

            // this._$log.debug('TEST items.calendarItemType', items);
        }
        return items;
    }

    /**
     * Возращаем дату в необходимом формате.
     * @param date - дата типа '2016-12-25'
     * @returns {Object}
     */
    getDate(date){
        let iW = moment(date, 'YYYY-MM-DD').format('YYYYWW'),
            iD = moment(date, 'YYYY-MM-DD').format('YYYYMMDD');
        return {iw: iW, id: iD};
    }


    //TODO под удаление
    /**
     * Запрашивает на сервере сводные данные по тренировкам с период в ремени (с, по)
     * @param start - начальная дата запроса
     * @param end - конечная дата запроса
     * @returns {*}
     */
    getActivityList(start, end){
        let result = this._$q.defer();
        let list = [];
        this._$log.debug('Calendar: getActivityList, new request from', start.format('DD MMM'), 'to', end.format('DD MMM'));
        // Генерируем случайные тестовые данные по всему диапазону запроса
        let diff = end.diff(start,'d');
        let activity = {};
        let mock = {
            type: ['бег','велосипед','плавание'],
            subType: ['Короткие интервалы', 'Длинные интервалы', 'Восстановление', 'Развитие мощности', 'Длинный' +
            ' темп', 'Работа на уровне МПК','Интервалы ПАНО'],
            timeDay: ['утро','день','вечер', null],
            result: {
                status: ['success','success','success','success','success','success','success','success','success',
                    'warning','warning','warning',
                    'error','error',
                    'noplan','noplan'],
            }
        };
        while (diff != 0){

            for (var i= 0; i <= Math.floor(Math.random() * 3)-1; i++) {
                activity = {};
                activity = {
                    activityId: i,
                    startTimestamp: start.format('X'),
                    activityCategory: {
                        code: mock.subType[Math.floor(Math.random() * mock.subType.length)]
                    },
                    activityType: {
                        code: mock.type[Math.floor(Math.random() * mock.type.length)]
                    },
                    social: {
                        userLikesCount: Math.floor(Math.random()*3),
                        userCommentsCount: Math.floor(Math.random()*2)
                    },
                    intervals: [
                        {
                            type: 'W',
                            assessment: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
                            duration: Math.floor(Math.random() * (180 - 40 + 1)) + 40,
                            distance: Math.floor(Math.random() * (50 - 3 + 1)) + 3,
                            TSS: Math.floor(Math.random() * (300 - 50 + 1)) + 50,
                            bpmAvr: Math.floor(Math.random() * (180 - 120 + 1)) + 120,
                            status: mock.result.status[Math.floor(Math.random() * mock.result.status.length)]
                        }
                    ]
                };
                list.push({type: 'activity', value: activity});
                //this._$log.debug('Calendar: getActivityList, mock activity=', activity);
            }

            start.add(1,'d');
            diff = end.diff(start,'d');
        }
        //this._$log.debug('Calendar: getActivityList, mock list=', list);
        result.resolve(list);
        return result.promise;
    }

}
/**
 * Компонент Calendar
 * @type {{bindings: {$router: string}, require: {}, transclude: boolean, controller,
 * templateUrl: string, $canActivate: Function}}
 */
let Calendar = {
    bindings: {
        $router: '<'
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