import moment from 'moment/src/moment.js';
import { IComponentOptions, IComponentController, IFormController,IPromise, IScope, copy} from 'angular';
import './calendar-total.component.scss';
import {
    calculateCalendarTotals, calculateCalendarSummary,
    ICalendarWeekSummary, ICalendarWeekTotal
} from './calendar-total.function';
import {ICalendarWeek} from "../calendar.interface";
import {CalendarWeekData} from "./calendar-week-total.datamodel";
import { TrainingSeasonDialogSerivce } from "../../training-season/training-season-dialog.service";
import { TrainingSeasonService } from "../../training-season/training-season.service";
import { IUserProfile } from "../../../../api/user/user.interface";
import {
    IWeekPeriodizationDataResponse,
    IWeekPeriodizationData
} from "../../../../api/seasonPlanning/seasonPlanning.interface";

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

    // bind
    owner: IUserProfile;
    week: ICalendarWeek;
    selected: boolean;
    dynamicDates: boolean;
    compactView: boolean;
    onSelect: () => Promise<any>;


    private data: CalendarWeekData;
    private title: string;
    private items: Array<any> = [];
    private checked: boolean = false;
    private total: ICalendarWeekTotal;
    //private totalTemplate: ICalendarTotals;
    private summary: ICalendarWeekSummary;

    // private
    private periodizationData: IWeekPeriodizationData;

    private shoMenu: boolean = false;

    private readonly primarySport: [string] = ['run', 'bike', 'swim'];

    static $inject = ['$mdDialog', 'TrainingSeasonService'];

    constructor(
        private $mdDialog: any,
        private trainingSeasonService: TrainingSeasonService){
    }

    $onInit(): void {
        this.title = moment(this.week.week,'YYYY-WW').week();
        this.trainingSeasonService.getUserWeekData(this.owner.userId, moment(this.week.week,'YYYY-WW').format('YYYY.WW'))
            .then(result => this.periodizationData = result.arrayResult[0]);
    }

    onToggle() {
        this.selected = !this.selected;
        this.week.subItem.forEach(day => day.selected = !day.selected);
        this.onSelect();
    }

    $onChanges(changes){

        if(changes.update){
            this.data = new CalendarWeekData(this.week);
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
        accent: '<',//,
        dynamicDates: '<',
        owner: '<',
        compactView: '<',
        copiedItemsLength: '<', // обьем буфера скопированных тренировок

        onCopy: '&', // пользователь скопировал дни/недели (без параметров)
        onPaste: '&', // пользователь выбрал даты у нажал вставить, параметр - дата начала
        onDelete: '&', // удалить
        onSelect: '&'
        //onToggle: '&'
    },
    require: {
        //calendar: '^calendar'
    },
    controller: CalendarTotalCtrl,
    template: require('./calendar-total.component.html') as string
};

export default CalendarTotalComponent;