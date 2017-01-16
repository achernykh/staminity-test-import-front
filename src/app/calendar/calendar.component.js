import * as moment from "moment";
import { times } from '../share/util';

require('./calendar.component.scss')
/**
 *
 */


class CalendarCtrl {
    constructor($scope, $log, $q, $timeout, $anchorScroll, $location, $rootScope, SystemMessageService, CalendarService, ActionMessageService, UserService) {
        'ngInject';
        this._$log = $log;
        this._$q = $q;
        this._$timeout = $timeout;
        this._$anchorScroll = $anchorScroll;
        this._$location = $location;
        this._$rootScope = $rootScope; // слушаем новые сообщения от api
        this._SystemMessageService = SystemMessageService;
	    this._ActionMessageService = ActionMessageService;
        this._CalendarService = CalendarService;
        this.firstDayOfWeek = UserService.profile.display.firstDayOfWeek || null;
        this._$scope = $scope;

        this.weekdays = []; // название дней недели
	    this.buffer = []; //для операций copy/paste
        //this.view.compact = false; //компактный/полный режим отображения calendarItems
        var self = this;
        
        this.onLoad = () => $scope.$apply()
        this.reset(new Date())
        
        this.dateFormat = 'YYYY-MM-DD'
        
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
        //moment.locale('en');
        if(!!this.firstDayOfWeek)
            moment.locale(moment.locale(), {
                week : {
                    dow : this.firstDayOfWeek
                }
            })

        for (let i=0; i<7; i++) {
            this.weekdays.push(moment().startOf('week').add(i,'d').format('dddd'));
        }
        console.log('CalendarCtrl: omIniti => weedays',this.weekdays);
        // TODO добавить рассчет padding для скролла (зависит от размера экрана)

    }
    
    /**
     * DayItem view model
     * @param date
     * @param calendarItems
     */
    dayItem (date, calendarItems) {
        return {
            key: date.format(this.dateFormat),
            selected: false,
            date: date.format(this.dateFormat),
            data: {
                title: date.format('DD'),
                month: date.format('MMM'),
                day: date.format('dd'),
                date: date.format(this.dateFormat),
                calendarItems: calendarItems
            }
        };
    }
    
    /**
     * WeekItem view model
     * @param index 
     * @param date - дата начала недели
     * @param days : DayItem[]
     */
    weekItem (index, date, days) {
        return {
            sid: index,
            changes: 0,
            toolbarDate: date.format('YYYY MMMM'),
            selected: false,
            subItem: days,
            week: date.format('GGGG-WW')
        };
    }
    
    /**
     * Предоставляет объекты WeekItem
     * @param date - любой Datetime недели
     * @param index - позиция в списке
     */
    getWeek (date, index) {
        let start = moment(date).startOf('week');
        let end = moment(start).add(1, 'w');
        
        return this._CalendarService.getCalendarItem(start.format(this.dateFormat), end.format(this.dateFormat))
            .then((items) => {
                console.log('CalendarCtrl, getweek = ', items)
                let days = times(7).map((i) => {
                    let date = moment(start).add(i, 'd')
                    let calendarItems = items
                        .filter(item => moment(item.dateStart, this.dateFormat).weekday() == i)
                        /*.filter(item => (item.calendarItemType !== 'activity') ||
                                        (item.calendarItemType === 'activity' && item.activityHeader.hasOwnProperty('intervals')))*/
                    
                    return this.dayItem(date, calendarItems)
                })

                console.log('CalendarCtrl, result=', days)
                return this.weekItem(index, start, days)
            })
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
     * @param n
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
            .catch((exc) => { console.log('Calendar loading fail', exc) })
            .then(() => { this.isLoadingUp = false })
            .then(() => this.onLoad())
    }
    
    /**
     * Подгрузка n записей вниз
     * @param n
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
            .catch((exc) => { console.log('Calendar loading fail', exc) })
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

    /**
     * Создание записи календаря
     * @param item<ICalendarItem>
     */
    onPostItem(item) {
        let w = this.getDayIndex(moment(item.dateStart).format('GGGG-WW'))
        let d = moment(item.dateStart).weekday()

        console.log('onPostItem to',w,d)
        this.items[w].subItem[d].data.calendarItems.push(item)

    }

    /**
     * Изменение записи календаря
     * @param item<ICalendarItem>
     */
    onPutItem(item) {

    }

    /**
     * Удаление записи календаря
     * @param item
     */
    onDeleteItem(item) {
        let w = this.getDayIndex(moment(item.dateStart).format('GGGG-WW'))
        let d = moment(item.dateStart).weekday()
        let p = this.items[w].subItem[d].data.calendarItems.findIndex(i => i.calendarItemId == item.calendarItemId)

        console.log('onDeleteItem', w,d,p,item,this.items)
        this.items[w].subItem[d].data.calendarItems.splice(p,1)
    }

    /**
     * Получение индекса недели в массиве календаря
     * @param w - неделя в формате GGGG-WW
     * @returns {number}
     */
    getDayIndex(w) {
        return this.items.findIndex(item => item.week == w)
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
        this._ActionMessageService.simple(`Записи скопированы (${this.buffer.length})`);
    }
    
    /**
     * Удаление записи календаря
     * @param calendarItem
     */
    /*onDeleteItem(calendarItem) {
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
            this._ActionMessageService.screen('Запись удалена');
        }
    }*/
    
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
            this._ActionMessageService.simple('Запись перемещена');
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
                this._ActionMessageService.simple(`Записи вставлены (${this.buffer.length})`);
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

CalendarCtrl.$inject = ['$scope','$log','$q','$timeout','$anchorScroll','$location','$rootScope','SystemMessageService','CalendarService','ActionMessageService','UserService'];


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
    template: require('./calendar.component.html')
};

export default Calendar;