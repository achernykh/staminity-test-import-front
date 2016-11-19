class CalendarTotalCtrl {
    constructor($log){
        'ngInject'
        this._$log = $log;
        this.checked = false;
        this.totalData = {};
    }
    $onInit(){
        "use strict";
        // Расчет итогов недели

        //console.log('CalendarTotal: onInit week=', this.week.sid, this.week.change, this.week.subItem.length, this.week.subItem[0].data.calendarItems.length);



    }
    $onChanges(changes){
        "use strict";
        if(changes.update){
            //console.log('CalendarTotal: $onChanges => status new value', this.week.sid, this.week.change, this.week.subItem.length, this.week.subItem[0].data.calendarItems.length);
            this.totalData = {};
            let duration = 0;
            let distance = 0;
            for (let day of this.week.subItem){
                for (let item of day.data.calendarItems){
                    if (item.calendarItemType == 'activity') {
                        for (let interval of item.activityHeader.intervals) {
                            if (interval.type == 'W') {
                                //console.log('CalendarTotal: $onChanges => total +', interval.calcMeasures.movingDuration.maxValue, interval.calcMeasures.distance.maxValue);
                                duration = duration + interval.calcMeasures.movingDuration.value;
                                distance = distance + interval.calcMeasures.distance.value;
                            }
                        }
                    }

                }
            }
            //console.log('CalendarTotal: $onChanges => total ++', this.totalData);
            this.totalData.duration = moment().startOf('day').seconds(duration).format('H:mm:ss');
            this.totalData.distance = distance;
        }
    }
}

export let CalendarTotal = {
    bindings: {
        week: '<',
        update: '<',
        selected: '<',
        accent: '<',
        onToggle: '&'
    },
    require: {
        calendar: '^calendar'
    },
    controller: CalendarTotalCtrl,
    templateUrl: 'calendar/total/calendar.total.html'
};