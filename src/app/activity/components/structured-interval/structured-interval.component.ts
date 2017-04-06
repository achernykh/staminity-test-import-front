import './structured-interval.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IActivityIntervalP} from "../../../../../api/activity/activity.interface";
import {CalendarItemActivityCtrl} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {FtpState} from "../assignment/assignment.component";
import {Interval} from "../../activity.datamodel";

class StructuredIntervalCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public interval: IActivityIntervalP;
    public sport: string;

    private readonly durationMeasure: Array<string> = ['movingDuration', 'distance'];
    private readonly intensityMeasure: any = {
        swim: ['heartRate','speed'],
        bike: ['heartRate', 'speed','power'],
        run: ['heartRate', 'speed'],
        strength: ['heartRate'],
        transition: ['heartRate', 'speed'],
        ski: ['heartRate', 'speed'],
        other: ['heartRate', 'speed'],
        default: ['heartRate', 'speed'],
    };
    private duration: string = 'movingDuration';
    private intensity: string = 'heartRate';
    private readonly index: any = [{from: 'intensityByFtpFrom', to: 'intensityByFtpTo'},{from: 'intensityLevelFrom', to: 'intensityLevelTo'}];

    public onChange: (response: {interval: IActivityIntervalP}) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }

    changeValue(measure) {
        if(this.durationMeasure.indexOf(measure) === -1) {
            this.completeFtpMeasure();
        }
        if (measure === 'movingDuration') {
            this.interval.movingDurationLength = this.interval.durationValue;
        }
        if (measure === 'distance') {
            this.interval.distanceLength = this.interval.durationValue;
        }
        this.onChange({interval: this.interval});
    }

    completeFtpMeasure(key: string = this.interval.intensityMeasure) {
        this.interval[this.index[FtpState.On]['from']] = this.interval[this.index[FtpState.Off]['from']] / this.getFTP(key);
        this.interval[this.index[FtpState.On]['to']] = this.interval[this.index[FtpState.Off]['to']] / this.getFTP(key);
    }

    getFTP(measure: string = this.interval.intensityMeasure, sport: string = this.sport):number {
        let zones = this.item.currentUser.trainingZones;
        return (zones.hasOwnProperty(measure) && zones[measure].hasOwnProperty(sport) && zones[measure][sport]['FTP']) ||
            (zones.hasOwnProperty(measure) && zones[measure].hasOwnProperty('default') && zones[measure]['default']['FTP']) || null;
    }

}

const StructuredIntervalComponent:IComponentOptions = {
    bindings: {
        interval: '<',
        sport: '<',
        onChange: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: StructuredIntervalCtrl,
    template: require('./structured-interval.component.html') as string
};

export default StructuredIntervalComponent;