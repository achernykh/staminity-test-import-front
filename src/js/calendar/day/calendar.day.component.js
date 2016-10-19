class CalendarDayCtrl {
    constructor($log){
        "use strict";
        'ngInject'
        this._$log = $log;
    }
    $onInit(){
        "use strict";
        this._$log.debug('CalendarDay: onInit week=', this.data);
	    let diff = moment().diff(moment(this.data.date),'days',true);
        this.today = diff >= 0 && diff < 1;
    }
    onDelete(){
        "use strict";
        let items = this.data.calendarItems;
        console.log('CalendarDay: onDelete items=', items, this.data);
        //for (let item of items) {
            //this._$log.debug('CalendarDay: onDelete item=', item);
            this.calendar.onDeleteCalendarItem(this.data.calendarItems);
        //}

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