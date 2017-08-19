import moment from 'moment/src/moment.js';
import { IComponentOptions, IComponentController, IFormController,IPromise, IScope, copy} from 'angular';
import './calendar-total.component.scss';
import {
    calculateCalendarTotals, calculateCalendarSummary,
    ICalendarWeekSummary, ICalendarWeekTotal
} from './calendar-total.function';
import {ICalendarWeek} from "../calendar.component";

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
            (interval.calcMeasures.duration.hasOwnProperty('value') && interval.calcMeasures.duration.value) || 0];
    }
};

class CalendarTotalCtrl implements IComponentController {

    public week: ICalendarWeek;
    public selected: boolean;

    private title: string;
    private items: Array<any> = [];
    private checked: boolean = false;
    private total: ICalendarWeekTotal;
    //private totalTemplate: ICalendarTotals;
    private summary: ICalendarWeekSummary;

    private readonly primarySport: [string] = ['run', 'bike', 'swim'];

    static $inject = ['$mdDialog'];

    constructor(private $mdDialog: any){
    }

    $onInit(){
        this.title = moment(this.week.week,'YYYY-WW').week();
    }

    onToggle() {
        debugger;
        this.selected = !this.selected;
        this.week.subItem.forEach(day => day.selected = !day.selected);
    }

    $onChanges(changes){

        if(changes.update){
            this.items = [];
            if(this.week.hasOwnProperty('subItem') && this.week.subItem && this.week.subItem.length > 0) {
                this.week.subItem.forEach(day => day.data.calendarItems && day.data.calendarItems.length > 0 && this.items.push(...day.data.calendarItems));
            }
            this.total = calculateCalendarTotals(this.week.subItem);

            // Итоги по всем активностям недели
            this.summary = calculateCalendarSummary(this.total);
        }
    }
}


const CalendarTotalComponent: IComponentOptions =  {
    bindings: {
        week: '<',
        update: '<',
        selected: '<',
        accent: '<'//,
        //onToggle: '&'
    },
    require: {
        calendar: '^calendar'
    },
    controller: CalendarTotalCtrl,
    template: require('./calendar-total.component.html') as string
};

export default CalendarTotalComponent;