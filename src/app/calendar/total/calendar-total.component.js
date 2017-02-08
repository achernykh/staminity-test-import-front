import moment from 'moment/src/moment';
import './calendar-total.component.scss';

class CalendarTotalCtrl {
    constructor(){

        this.checked = false;
        this.total = {};
        this.totalTemplate = {
            completed: {
                distance: 0,
                movingDuration: 0
            },
            planned: {
                distance: 0,
                movingDuration: 0
            }
        }
        this.primarySport = ['run', 'bike', 'swim'];
    }
    $onInit(){
        this.weekTitle = moment(this.week.week,'YYYY-WW').week();
    }
    $onChanges(changes){

        if(changes.update){
            console.log('CalendarTotal: $onChanges => status new value', this.week.sid, this.week);
            this.total = {};
            let sport = null;
            for (let day of this.week.subItem){
                for (let item of day.data.calendarItems){
                    if (item.calendarItemType == 'activity') {
                        sport = item.activityHeader.activityType.typeBasic
                        //template = {completed: {distance: 0,movingDuration: 0},planned: {distance: 0,movingDuration: 0}}
                        if (item.activityHeader.hasOwnProperty('intervals'))
                            for (let interval of item.activityHeader.intervals) {
                                if (interval.type == 'W') {
                                    if(this.primarySport.indexOf(sport) == -1) sport = 'other'

                                    if(!this.total.hasOwnProperty(sport))
                                        Object.assign(this.total, {[sport]: {completed: {distance: 0,movingDuration: 0},planned: {distance: 0,movingDuration: 0}}})

                                    this.total[sport].completed.distance = this.total[sport].completed.distance +
                                        (interval.calcMeasures.distance.hasOwnProperty('maxValue') && interval.calcMeasures.distance.maxValue) || 0

                                    this.total[sport].completed.movingDuration = this.total[sport].completed.movingDuration +
                                        (interval.calcMeasures.movingDuration.hasOwnProperty('maxValue') && interval.calcMeasures.movingDuration.maxValue) || 0

                                    //console.log('week total temp=',sport, this.total[sport].completed.distance)
                                }
                            }
                    }

                }
            }
            console.log('week total 1', this.total);
            // Итоги по всем активностям недели
            this.summary = {completed: {distance: 0,movingDuration: 0},planned: {distance: 0,movingDuration: 0}};
            Object.keys(this.total).forEach((sport) => {
                this.summary.completed.distance += this.total[sport].completed.distance;
                this.summary.completed.movingDuration += this.total[sport].completed.movingDuration;
                this.summary.planned.distance += this.total[sport].planned.distance;
                this.summary.planned.movingDuration += this.total[sport].planned.movingDuration;

            });
            console.log('week total 2', this.total);
        }
    }

    secondToDuration(second) {
        return moment().startOf('day').seconds(second).format('H:mm:ss')
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
    template: require('./calendar-total.component.html')
};

export default CalendarTotal;