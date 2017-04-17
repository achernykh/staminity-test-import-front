import moment from 'moment/src/moment';
import {copy} from 'angular';
import './calendar-total.component.scss';
import {calculateCalendarTotals, calculateCalendarSummary} from './calendar-total.function';

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

const calculateTotals = (items) => {
    let total = {};
    let sport = null;
    let distance = 0, movingDuration = 0;
    let totalTemplate = {
        fact: {
            distance: 0,
            movingDuration: 0
        },
        plan: {
            distance: 0,
            movingDuration: 0
        }
    };
    let primarySport = ['run', 'bike', 'swim'];

    items.forEach(day => day.data.calendarItems.filter(item => item.calendarItemType === 'activity')
        .forEach(item => {
            sport = item.activityHeader.activityType.typeBasic;
            sport = (primarySport.indexOf(sport) !== -1 && sport) || 'other';
            item.activityHeader.intervals.filter(interval => interval.type === 'W' || interval.type === 'pW')
            .forEach(interval => {
                let point = interval.type === 'W' ? 'fact' : 'plan';
                if (!total.hasOwnProperty(sport)) {
                    total[sport] = copy(totalTemplate);
                }
                [distance, movingDuration] = searchMeasure(point,interval);
                total[sport][point].distance = total[sport][point].distance + distance;
                total[sport][point].movingDuration = total[sport][point].movingDuration + movingDuration;
            })
        })
    );

    return total;
}

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

    /*calculateTotals(item) {
        let sport = item.activityHeader.activityType.typeBasic;
        sport = (this.primarySport.indexOf(sport) !== -1 && sport) || 'other';
    }*/

    $onChanges(changes){

        if(changes.update){
            this.total = calculateCalendarTotals(this.week.subItem);/*
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
                            [distance, movingDuration] = searchMeasure(point,interval);
                            this.total[sport][point].distance = this.total[sport][point].distance + distance;
                            this.total[sport][point].movingDuration = this.total[sport][point].movingDuration + movingDuration;
                        })
                })
            );*/

            // Итоги по всем активностям недели
            //this.summary = {fact: {distance: 0,movingDuration: 0},plan: {distance: 0,movingDuration: 0}};

            this.summary = calculateCalendarSummary(this.total); /*

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
            });*/
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