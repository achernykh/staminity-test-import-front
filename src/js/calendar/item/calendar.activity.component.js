class CalendarActivityCtrl {
    constructor($log, $mdDialog){
        "use strict";
        'ngInject'
        this._$log = $log;
	    this._$dialog = $mdDialog;
	    this.status = 'new';
	    /**
	     * Нижняя панель тренировки
	     * @type {string} - 'prescription' - установка тренера, 'data' - перечень фактических показателей для
	     * неструктурированной тренировки, 'segments' - перечень сегементов структурированной тренировки
	     */
	    this.bottomPanel = null;
	    // Для сводный данных по трениовке
	    this.data = {};
    }
    $onInit(){

        /**
         * Формат отображения тренировке в календаре зависит от нескольких параметров: 1) дата тренировки 2) факт
         * выполнения тренировки 3) наличие тренировочных сегментов.
         * Для опредления формата необходимо анализировать типа сегментов interval.type:
         * [W] - итоговый сводный фактический интервал по тренировке
         * [P] - плановый сегмент
         * [L] - фактическая отсечка круга с устройства
         * [pW] - итоговый плановый сегмент по тренировке
         */

	    let type = this.item.activityHeader.activityType.code;

        // Определеяем статус выполнения задания
        if (moment().diff(moment(this.item.date, 'YYYY-MM-DD'),'d') >= 1){
            // Задание в прошлом
            let complete = false;
            for (let interval of this.item.activityHeader.intervals) {
                if (interval.type == 'W') {
                    complete = true;
	                this.bottomPanel = 'data';
                    this.data.duration = moment().second(interval.calcMeasures.movingDuration.maxValue).format('H:mm:ss');
                    this.data.distance = (interval.calcMeasures.distance.maxValue / 1000).toFixed(2);
	                this.data.statusPercent = interval.calcMeasures.completePercent.value;

	                // Набор данных по видам спорта
	                this.data.speedAvg = interval.calcMeasures.speed.maxValue;
	                this.data.heartRateAvg = interval.calcMeasures.heartRate.maxValue;
	                this.data.powerAvg = interval.calcMeasures.power.maxValue;

	                if (this.data.statusPercent > 75){
		                // Задание выполнено
		                this.status = 'complete';
	                } else if (this.data.statusPercent > 50) {
		                // Задание выполнено, но с отклонением
		                this.status = 'complete warn';
	                } else
	                // Задание выполнено c существенными отклонениями
		                this.status = 'complete error';

                }
                if (interval.type == 'pW') {
	                //complete = true;
                    //this.statusPercent = interval.calcMeasures.completePercent.value;
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
		            this.trainersPrescription = interval.trainersPrescription;
	            }
            }
        }

    }
    $onChange(changes){
        "use strict";
        if (changes.selected) {
            this._$log.debug('CalendarActivityCtrl: onChange, selected=', changes.selected);
        }

    }
	show($event){
		this._$dialog.show(
			this._$dialog.alert()
				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true)
				.title('This is an alert title')
				.textContent(this.item)
				.ariaLabel('Alert Dialog Demo')
				.ok('Got it!')
				.targetEvent($event)
		);
	}
    onDelete(){
        "use strict";
        this.calendar.onDeleteCalendarItem(this.item);
    }
}

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
    templateUrl: 'calendar/item/calendar.activity.html'
};