class CalendarActivityCtrl {
    constructor($log){
        "use strict";
        'ngInject'
        this._$log = $log;
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
                }
                if (interval.type == 'pW') {
                    this.item.statusPercent = interval.completePercent;
                }
            }
            if (complete) {
                // задание выполнено
                this.item.status = 'complete';
            } else {
                // задание пропущено
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