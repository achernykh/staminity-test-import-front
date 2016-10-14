class CalendarDayCtrl {
    constructor($log){
        "use strict";
        'ngInject'
        this._$log = $log;
    }
    $onInit(){
        "use strict";
        //this._$log.debug('CalendarDay: onInit id=', this.data);
    }
    onDelete(){
        "use strict";
        let items = this.data.calendarItems;
        this._$log.debug('CalendarDay: onDelete items=', items, this.data);
        for (let item of items) {
            this._$log.debug('CalendarDay: onDelete item=', item);
            this.calendar.onDeleteCalendarItem(item);
        }

    }
}

export let CalendarDay = {
    bindings: {
        data: '<',
        selected: '<',
        accent: '<',
        onSelect: '&'
    },
    require: {
        calendar: '^calendar'
    },
    controller: CalendarDayCtrl,
    templateUrl: 'calendar/day/calendar.day.html'
};