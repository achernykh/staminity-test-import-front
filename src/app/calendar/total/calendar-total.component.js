import moment from 'moment/src/moment';
import {copy} from 'angular';
import './calendar-total.component.scss';

const searchMeasure = (point, interval) => {
    if (point === 'plan') {
        if (interval.durationMeasure === 'movingDuration'){
            return [0,interval.durationValue];
        } else {
            return [interval.durationValue,0];
        }
    } else {
        return [
            (interval.calcMeasures.distance.hasOwnProperty('value') && interval.calcMeasures.distance.value) || 0,
            (interval.calcMeasures.movingDuration.hasOwnProperty('value') && interval.calcMeasures.movingDuration.value) ||
            (interval.calcMeasures.duration.hasOwnProperty('value') && interval.calcMeasures.duration.value) || 0]
    }
};

class CalendarTotalCtrl {
    constructor(){

        this.checked = false;
        this.total = {};
        this.totalTemplate = {
            fact: {
                distance: 0,
                movingDuration: 0
            },
            plan: {
                distance: 0,
                movingDuration: 0
            }
        };
        this.primarySport = ['run', 'bike', 'swim'];
    }
    $onInit(){
        this.weekTitle = moment(this.week.week,'YYYY-WW').week();
    }

    calculateTotals(item) {
        let sport = item.activityHeader.activityType.typeBasic;
        sport = (this.primarySport.indexOf(sport) !== -1 && sport) || 'other';

    }

    $onChanges(changes){

        if(changes.update){
            this.total = {};
            let sport = null;
            let distance = 0, movingDuration = 0;

            this.week.subItem.forEach(day => day.data.calendarItems
                .filter(item => item.calendarItemType === 'activity')
                .forEach(item => {
                    sport = item.activityHeader.activityType.typeBasic;
                    sport = (this.primarySport.indexOf(sport) !== -1 && sport) || 'other';
                    item.activityHeader.intervals
                        .filter(interval => interval.type === 'W' || interval.type === 'pW')
                        .forEach(interval => {

                            let point = interval.type === 'W' ? 'fact' : 'plan';

                            if (!this.total.hasOwnProperty(sport)) {
                                this.total[sport] = copy(this.totalTemplate);
                            }

                            //debugger;

                            [distance, movingDuration] = searchMeasure(point,interval);

                            this.total[sport][point].distance = this.total[sport][point].distance + distance;
                            this.total[sport][point].movingDuration = this.total[sport][point].movingDuration + movingDuration;

                            /*this.total[sport][point].distance = this.total[sport][point].distance +
                                (interval.calcMeasures.distance.hasOwnProperty('maxValue') &&
                                interval.calcMeasures.distance.maxValue) || 0;

                            this.total[sport][point].movingDuration = this.total[sport][point].movingDuration +
                                (interval.calcMeasures.movingDuration.hasOwnProperty('maxValue') &&
                                interval.calcMeasures.movingDuration.maxValue) || 0;*/
                        })


                })
            );

            /*for (let day of this.week.subItem){
                for (let item of day.data.calendarItems){
                    if (item.calendarItemType == 'activity') {
                        sport = item.activityHeader.activityType.typeBasic;
                        sport = (this.primarySport.indexOf(sport) !== -1 && sport) || 'other';
                        //template = {completed: {distance: 0,movingDuration: 0},planned: {distance: 0,movingDuration: 0}}
                        if (item.activityHeader.hasOwnProperty('intervals')){
                            for (let interval of item.activityHeader.intervals) {
                                if (interval.type === 'W') {

                                    if(!this.total.hasOwnProperty(sport)) {
                                        Object.assign(this.total, {
                                            [sport]: {
                                                completed: {
                                                    distance: 0,
                                                    movingDuration: 0
                                                },
                                                planned: {
                                                    distance: 0,
                                                    movingDuration: 0}
                                            }
                                        })
                                    }

                                    this.total[sport].completed.distance = this.total[sport].completed.distance +
                                        (interval.calcMeasures.distance.hasOwnProperty('maxValue') &&
                                        interval.calcMeasures.distance.maxValue) || 0;

                                    this.total[sport].completed.movingDuration = this.total[sport].completed.movingDuration +
                                        (interval.calcMeasures.movingDuration.hasOwnProperty('maxValue') &&
                                        interval.calcMeasures.movingDuration.maxValue) || 0;

                                    //console.log('week total temp=',sport, this.total[sport].completed.distance)
                                }
                            }
                        }
                    }

                }
            }*/
            // Итоги по всем активностям недели
            this.summary = {fact: {distance: 0,movingDuration: 0},plan: {distance: 0,movingDuration: 0}};
            Object.keys(this.total).forEach((sport) => {
                if (this.total[sport].hasOwnProperty('fact')){
                    this.summary.fact.distance +=
                        (this.total[sport].fact.hasOwnProperty('distance') &&
                        this.total[sport].fact.distance) || 0;
                    this.summary.fact.movingDuration +=
                        (this.total[sport].fact.hasOwnProperty('movingDuration') &&
                        this.total[sport].fact.movingDuration) || 0;
                }
                if (this.total[sport].hasOwnProperty('plan')){
                    this.summary.plan.distance +=
                        (this.total[sport].plan.hasOwnProperty('distance') &&
                        this.total[sport].plan.distance) || 0;
                    this.summary.plan.movingDuration +=
                        (this.total[sport].plan.hasOwnProperty('movingDuration') &&
                        this.total[sport].plan.movingDuration) || 0;
                }
            });
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
    template: require('./calendar-total.component.html')
};

export default CalendarTotal;