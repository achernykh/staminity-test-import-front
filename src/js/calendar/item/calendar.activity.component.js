class CalendarActivityCtrl {
    constructor($log, $mdDialog){
        "use strict";
        'ngInject'
        this._$log = $log;
	    this._$dialog = $mdDialog;
    }
    $onInit(){
        "use strict";
        this.item.status = 'new';
        // Определеяем статус выполнения задания
        if (moment().diff(moment(this.item.date, 'YYYY-MM-DD'),'d') >= 1){
            // Задание в прошлом
            let complete = false;
            for (let interval of this.item.activityHeader.intervals) {
                if (interval.type == 'W') {
                    complete = true;
                    this.item.duration = moment().second(interval.calcMeasures.movingDuration.maxValue).format('H:mm:ss');
                    this.item.distance = (interval.calcMeasures.distance.maxValue / 1000).toFixed(2);
	                this.statusPercent = interval.calcMeasures.completePercent.value;
                }
                if (interval.type == 'pW') {
	                complete = true;
                    this.statusPercent = interval.calcMeasures.completePercent.value;
                }
            }
            if (complete) {
                // задание выполнено (не структурированное)
                this.item.status = 'complete';
	            if (this.statusPercent > 90){
		            // Задание выполнено
		            this.item.status = 'complete';
	            } else if (this.statusPercent > 75) {
		            // Задание выполнено, но с отклонением
		            this.item.status = 'complete warn';
	            } else
	            // Задание выполнено c существенными отклонениями
		            this.item.status = 'complete error';
            } else {
	            // задание не выполнено
	            this.item.status = 'dismiss';
            }
        } else {
            // задание в будущем
            this.item.status = 'planned';
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