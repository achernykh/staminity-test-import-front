/**
 * Класс для работы с ui-scroll.
 * Выделен в отдельный обьект для удобства. Для календаря item = одна неделя, item data для календаря calendarItem.
 * Написан наиболее абстрактно, чтобы не привязываться к Календарю, в дальнейшем будет преобразован в отдельный,
 * полностью не зависемый от контекста класс
 *
 * 1) getScrollSubItems - добавляем пустые дни недели
 * 1) scrollItemUpdate()
 * 2) deleteScrollItem
 */
export class CalendarScroll {
    constructor($timeout, CalendarCtrl){
        'ngInject'
        this.adapter = {};
        this._$timeout = $timeout;
        this.calendar = CalendarCtrl;
    }
    // TODO добавить кэширование
    /*
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
     }
     */

    /**
     *
     * @param index
     * @param count
     * @param success
     */
    get(index, count, success){
        /**
         * Формируем календарную сетку. Без тайм-аута библиотека не работает
         */
        console.log('CalendarScroll: get ', index, count, moment().format('mm:ss'));
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
                    subItem: this.getSubItems(start, end)
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

            console.log('CalendarScroll: api request ', index, count, moment().format('mm:ss'));
            this.calendar.getCalendarItem({startDate: start, endDate: end}).then(
                () => {
                    "use strict";
                    console.log('CalendarScroll: html update success', index, count, moment().format('mm:ss'));
                }, () => {
                }
            );

            success(result);

        }, 1);
    }

    /**
     * Генерирует массив состоящих из календарных недель, которые в свою очередь содержат соответсвующие дни недели.
     * Для вывода календарной сетки, отдельный день недели должен содержать следующие значения: 1)
     * @param startDay - первый день массива
     * @param endDay - последний день массива
     * @returns {Object}
     */
    getSubItems(day, end) {
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
     * Обновление записей скролла.
     * Используется метод applyUpdates(item, scroll)
     * @param action - действие, которое необходимо выполнить с item (неделя) или subItem (день)
     * @param calendarItems - массив элементов типа CalendarItem
     * @param params - дополнительные параметры для операции обнволения
     * @returns {Promise}
     */
    update(action, calendarItems, params) {
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
                this.adapter.applyUpdates((item, scope) => {
                    if (item.sid == weekPos) {

                        console.log('Calendar: updateScrollItem search true', action, item.sid);
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
                            case 'dropCalendarItem': {
                                item.changes = item.changes + 1;
                                dayPos = moment(params.date, 'YYYY-MM-DD');
                                weekPos = dayPos.format('WW') - init.format('WW');
                                calendarItem.date = dayPos; // меняем дату в записи на целевую
                                item.subItem[dayPos.weekday()].data.calendarItems.splice(params.index, 0, calendarItem);

                                break;
                            }
                            case 'pasteCalendarItem': {
                                item.changes = item.changes + 1;
                                dayPos = moment(params.date, 'YYYY-MM-DD');
                                weekPos = dayPos.format('WW') - init.format('WW');
                                calendarItem.date = dayPos; // меняем дату в записи на целевую
                                item.subItem[dayPos.weekday()].data.calendarItems.push(calendarItem);
                            }
                        }

                    }
                    return item;
                });
            }
            resolve();
        });
    }
}
