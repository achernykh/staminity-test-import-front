import moment from 'moment/src/moment';

class CalendarActivityData {

    constructor(data) {
        this.src = data;
        this._intervalW = [];
    }

    get completed() {
        return this.src.activityHeader.intervals.some((interval) => {
            return interval.type == "W"
        })
    }

    get structured() {
        return this.src.activityHeader.intervals.some((interval) => {
            return interval.type == "P"
        })
    }

    get coming() {
        return moment().diff(moment(this.src.dateStart, 'YYYY-MM-DD'), 'd') < 1
    }

    get specified() {
        return this.src.activityHeader.intervals.some((interval) => {
            return interval.type == "pW"
        })
    }

    get bottomPanel() {
        if (this.completed) return 'data'
    }

    get intervalW() {
        if(!!this._intervalW)
            this._intervalW = this.src.activityHeader.intervals.filter((interval) => {
                return interval.type == "W"
            })
        this.intervalW = this._intervalW;
        return this._intervalW
    }
    set intervalW(data){
        this._intervalW = data
    }

    get percent() {
        return this.intervalW[0].hasOwnProperty('completePercent') ?
            this.intervalW.calcMeasures.completePercent.value : null
    }

    get activityType(){
        return this.src.activityHeader.activityType.typeBasic
    }

    /**
     * Перечень статусов тренировки
     * 1) Запланирована, в будущем
     * 2) Запланирована, пропущена
     * 3) Запланирована, выполнена
     * 4) Запланирована, выполнена с допущением
     * 5) Запланирована, выполнена с нарушением
     * 6) Не запланирована, выполнена
     * @returns {string}
     */
    get status() {
        if (this.coming)
            return 'coming'
        else if (!this.specified)
            return 'not-specified'
        else if (!this.completed)
            return 'dismiss'
        else if (this.percent > 75)
            return "complete"
        else if (this.percent > 50)
            return "complete-warn"
        else
            return "complete-error"
    }

    get sportUrl() {
        return `assets/icon/${this.src.activityHeader.activityType.code}.svg`
    }

    get movingDuration(){
        /*try {
            return moment().startOf('day').second(this.intervalW[0].calcMeasures.movingDuration.maxValue).format('H:mm:ss')
        } catch(e) {
            return null
        }*/
        //return this.intervalW[0].calcMeasures.hasOwnProperty('movingDuration') ?
        //    moment().startOf('day').second(this.intervalW[0].calcMeasures.movingDuration.maxValue).format('H:mm:ss') : null
            //this.intervalW[0].calcMeasures.movingDuration.maxValue : null

        let movingDuration = this.intervalW[0].calcMeasures.movingDuration
        return ((movingDuration.hasOwnProperty('maxValue')) && moment().startOf('day').second(movingDuration.maxValue).format('H:mm:ss')) || null

    }

    get distance() {
        /*try {
            return this.intervalW[0].calcMeasures.distance.maxValue.toFixed(0)
        } catch(e) {
            return null
        }*/
        //return this.intervalW[0].calcMeasures.hasOwnProperty('distance') ?
        //    this.intervalW[0].calcMeasures.distance.maxValue.toFixed(0) : null
        let distance = this.intervalW[0].calcMeasures.distance
        return ((distance.hasOwnProperty('maxValue')) && distance.maxValue.toFixed(0)) || null
    }

    // Формируем перечень показателей для панели data (bottomPanel)
    get summaryAvg() {
        let measures = ['speed','heartRate','power']
        let calc = this.intervalW[0].calcMeasures

        return measures
            .map((measure)=>{
                if(calc.hasOwnProperty(measure)){
                    return ((calc[measure].hasOwnProperty('avgValue')) &&
                        { measure : measure, value: Number(calc[measure].avgValue)}) || {[measure]: null}
            }})
            .filter((measure)=>{
                return !!measure && !!measure.value
            })
    }

}

class CalendarActivityCtrl {
    constructor($mdDialog) {
        this._$dialog = $mdDialog;
        //this.status = 'new';
        /**
         * Нижняя панель тренировки
         * @type {string} - 'prescription' - установка тренера, 'data' - перечень фактических показателей для
         * неструктурированной тренировки, 'segmentList' - перечень сегементов структурированной тренировки
         */
        //this.bottomPanel = null;
        // Для сводный данных по трениовке
        //this.data = {};
        //this.structured = null;
        //this.planned = null;
        //this.completed = null;
        this.segmentList = [];
        this.segmentListSize = null;
        this.segmentChart = [];
        this.collapse = {show: true};
        this.bottomPanelData = null;
    }

    $onInit() {
        this.data = new CalendarActivityData(this.item);
        if (this.data.bottomPanel === 'data')
            this.bottomPanelData = this.data.summaryAvg
        //console.log('CalendarActivityCtrl $onInit, summaryAvg=', this.data.summaryAvg)
        /**
         * Формат отображения тренировке в календаре зависит от нескольких параметров: 1) дата тренировки 2) факт
         * выполнения тренировки 3) наличие тренировочных сегментов (структурированная тренировка).
         * Для опредления формата необходимо анализировать типа сегментов interval.type:
         * [W] - итоговый сводный фактический интервал по тренировке
         * [P] - плановый сегмент
         * [L] - фактическая отсечка круга с устройства
         * [pW] - итоговый плановый сегмент по тренировке
         */

        // Структурированная тренировка имеет хотябы один сегмент с типом P
        //this.structured = this.item.activityHeader.intervals.some((seg) => {
        //    return seg.type == "P"
        //});
        // Задание в прошлом или будущем
        //this.planned = moment().diff(moment(this.item.dateStart, 'YYYY-MM-DD'), 'd') < 1;

        if (this.structured) {
            let comulativeDuration = 0;
            for (let interval of this.item.activityHeader.intervals) {
                // Собираем лист сегментов
                // Если интервал является плановым сегментов или группой, то формируем лист сегментов
                if (interval.type == 'P' || interval.type == 'G') {
                    this.prepareSegmentList((interval.type == 'G'), interval);

                }
                // Собираем график сегментов
                if (interval.type == 'P') {
                    comulativeDuration = this.prepareSegmentChart(interval, comulativeDuration);
                }
                if (interval.type == 'pW') {
                    // TODO Добавить функцию вычисления номера зоны по значению показателя
                    this.intensityMeasure = interval.intensityMeasure;
                    this.intensityFtpMax = (interval.intensityFtpMax / 10).toFixed(0);
                }

            }

            // Если сегменты есть, то для графика необходимо привести значения к диапазону от 0...1
            if (this.segmentChart.length) {
                this.segmentChart.map((item) => {
                    item[0] = item[0] / comulativeDuration;
                    item[1] = item[1] / 100;
                    return item;
                })
            }

            /**
             * Вывод segmentList ограничен
             * Если количество сегментов более 4, то список выводится с ограниченным количеством строк,
             * а далее указывается … Отображаются только четыре сегмента, используются следующие правила отбора:
             * 1) Ключевые сегменты (не входящие в интервалы)
             * 2) Интервалы (включая не ключевые сегменты)
             * 3) В приоритете отбора интервалы с ключевыми сегментами
             * 4) В приоритете интервалы с ключевыми сегментами над просто ключевыми сегментами
             * 5) Если в интервале более двух сегментов, то для вывода берется первый ключевой сегмент и последующий не ключевой сегмент
             */
            // TODO Перенести 4 в переменную
            if (this.segmentList.length > 4) {
                this.segmentListSize = this.calculateSegmentListSize(this.segmentList);

                // Оставляем только ключевые сегменты (правило №1)
                for (let i = this.segmentList.length - 1; i >= 0 && this.segmentListSize > 4; i--) {
                    if (!this.segmentList[i].keyInterval) {
                        this.segmentList[i].show = false;
                        this.segmentListSize--;
                    }
                }

                if (this.segmentListSize > 4) {
                    // Убираем интервалы(группы), где нет ключевых сегментов
                    let hasKey = false;
                    for (let i = 0; i < this.segmentList.length && this.segmentListSize > 4; i++) {
                        if (this.segmentList[i].isGroup) {
                            for (let j = 0; j < this.segmentList[i].subItem; j++) {
                                if (this.segmentList[i].subItem[j].keyInterval) {
                                    hasKey = true;
                                }
                            }
                            if (!hasKey) {
                                this.segmentList[i].show = false;
                                this.segmentListSize--;
                            }
                        }
                    }
                }

                if (this.segmentListSize > 4) {
                    // Убираем не ключевые сегменты в интервалах с ключевыми сегментами
                    for (let i = 0; i < this.segmentList.length && this.segmentListSize > 4; i++) {
                        if (this.segmentList[i].isGroup) {
                            for (let j = this.segmentList[i].subItem - 1; j >= 0 && this.segmentListSize > 4; j--) {
                                if (!this.segmentList[i].subItem[j].keyInterval) {
                                    this.segmentList[i].subItem[j].show = false;
                                    this.segmentListSize--;
                                }
                            }
                        }
                    }
                }
                //console.log('CalendarItem: $onInit',this.segmentList, this.calculateSegmentListSize(this.segmentList));
            }
        }


        // Определеяем статус выполнения задания
        /**if (moment().diff(moment(this.item.dateStart, 'YYYY-MM-DD'), 'd') >= 1) {
            // Задание в прошлом
            let complete = false;
            for (let interval of this.item.activityHeader.intervals) {
                if (interval.type == 'W') {
                    complete = true;
                    this.bottomPanel = 'data';
                    if (interval.calcMeasures.hasOwnProperty('movingDuration'))
                        this.data.duration = moment().startOf('day').second(interval.calcMeasures.movingDuration.maxValue).format('H:mm:ss');
                    if (interval.calcMeasures.hasOwnProperty('distance'))
                        this.data.distance = (interval.calcMeasures.distance.maxValue).toFixed(2);
                    this.data.statusPercent = interval.calcMeasures.completePercent.value;

                    // Набор данных по видам спорта
                    if (interval.calcMeasures.hasOwnProperty('speed'))
                        this.data.speedAvg = interval.calcMeasures.speed.avgValue.toFixed(0);
                    if (interval.calcMeasures.hasOwnProperty('heartRate'))
                        this.data.heartRateAvg = interval.calcMeasures.heartRate.avgValue.toFixed(0);
                    if (interval.calcMeasures.hasOwnProperty('power'))
                        this.data.powerAvg = interval.calcMeasures.power.avgValue.toFixed(0);

                    if (!this.planned)
                    // Заадние выполнено без плана
                        this.status = 'noplan'
                    else if (this.data.statusPercent > 75)
                    // Задание выполнено
                        this.status = 'complete';
                    else if (this.data.statusPercent > 50)
                    // Задание выполнено, но с отклонением
                        this.status = 'complete warn';
                    else
                    // Задание выполнено c существенными отклонениями
                        this.status = 'complete error';

                }
                if (interval.type == 'pW') {
                    // TODO Добавить функцию вычисления номера зоны по значению показателя
                    this.intensityMeasure = interval.intensityMeasure;
                    this.intensityFtpMax = (interval.intensityFtpMax / 10).toFixed(0);
                }
            }
            if (!complete) {
                // задание не выполнено
                this.status = 'dismiss';
            }
        } else {
            // задание в будущем
            this.bottomPanel = 'prescription';
            this.status = 'planned';
            for (let interval of this.item.activityHeader.intervals) {
                if (interval.type == 'pW') {
                    //complete = true;
                    this.data.duration = moment().startOf('day').second(interval.calcMeasures.movingDuration.value).format('H:mm:ss');
                    this.data.distance = (interval.calcMeasures.distance.value).toFixed(2);
                    this.trainersPrescription = interval.trainersPrescription;
                }
            }
        }

         if (this.structured) {
            this.bottomPanel = 'segmentList';
            //console.info('segmentChart', JSON.stringify(this.segmentChart));
        }
         console.log('calendar activity =', this.item, this.data, this.bottomPanel, this.status, this.structured)*/
    }

    $onChange(changes) {
        "use strict";
        if (changes.selected) {
            console.log('CalendarActivityCtrl: onChange, selected=', changes.selected);
        }

    }

    /**
     *
     * @param group - true если интервал является группой, false если интервал является сегментом
     * @param interval - описание интервала
     */
    prepareSegmentList(group, interval) {
        "use strict";
        // В верстке будет использоваться данный признак для разного отображения
        interval.group = group;
        interval.show = true;
        // Если интервал одиночный
        if (!group) {
            // Если в интервале есть ссылка на вышестоящую группу, то добавлем сегмент в группу
            if (interval.hasOwnProperty('parentGroupCode')) {
                // Если значение не null
                if (!!interval.parentGroupCode) {
                    if (interval.repeatOrderIdx != 0)
                        return;
                    // Ищем запись группы
                    let code = this.segmentList.map((int) => int.code || null).indexOf(interval.parentGroupCode);
                    // Если группа найдена
                    if (code != -1)
                        this.segmentList[code].subItem.push(interval);
                } else
                // Если значение null, то одиночный интервал без группы
                    this.segmentList.push(interval);
            } else
            // если одиночный интервал, без группы
                this.segmentList.push(interval)
        }
        // Если интервал является группой
        else {
            // Добавляем массив для запися членов группы
            interval.subItem = [];
            this.segmentList.push(interval);
        }
    }

    prepareSegmentChart(interval, duration) {
        "use strict";
        /**
         * Для каждого интервала создается две точки на графике: начало и окончание.
         * Начало рассчитывается как время окончания предидущих интервалов и значение intensityByFtpFrom
         * Окончание рассчитывается как сумма предидущих интервалов +movingDurationLength и значение intensityByFtpTo
         */
        let comulativeDuration = duration + interval.movingDurationLength;
        this.segmentChart.push(
            [
                duration,
                interval.intensityByFtpFrom
            ],
            [
                comulativeDuration,
                interval.intensityByFtpTo
            ]);

        return comulativeDuration;
    }

    /**
     * Расчет количества сегментов с учетом вложенных элементов
     * @param list
     * @returns {number}
     */
    calculateSegmentListSize(list) {
        "use strict";
        let size = 0;
        for (let item of list) {

            if (item.group) {
                size += item.subItem.length;
            } else {
                size++;
            }
        }
        return size;
    }

    getBullet(first, middle, last) {
        let icon;
        if (first) icon = `assets/icon/bullet_first.svg`;
        if (middle) icon = `assets/icon/bullet_middle.svg`;
        if (last) icon = `assets/icon/bullet_last.svg`;

        return icon;
    }

    /**
     *
     * @param $event
     */
    show($event) {
/*
        this._$dialog.show(
            this._$dialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title(`structured: ${this.structured}, planned: ${this.planned}, status: ${this.status}, listSize: ${this.calculateSegmentListSize(this.segmentList)}`)
                .textContent(this.item)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent($event)
        );*/
    }

    /**
     * Копировать запись календаря
     */
    onCopy() {
        "use strict";
        this.calendar.onCopyItem([this.item]);
    }

    /**
     * Удалить запись
     */
    onDelete() {
        "use strict";
        console.log('CalendarActivity: onDelete ', this.item);
        this.calendar.onDeleteItem(this.item);
    }

    /**
     *
     * @param value
     */
    onToggleCollapse(value) {
        "use strict";
        !!value ? this.collapse = '' : this.collapse = false;
    }
}
CalendarActivityCtrl.$inject = ['$mdDialog'];

export let CalendarActivity = {
    bindings: {
        item: '<',
        selected: '<',
        accent: '<',
        onSelect: '&'
    },
    require: {
        calendar: '^calendar'
    },
    controller: CalendarActivityCtrl,
    template: require('./calendar-activity.component.html')
};

export default CalendarActivity;