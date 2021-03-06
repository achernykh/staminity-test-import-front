import './structured-interval.component.scss';
import {IComponentOptions, IComponentController, IPromise, INgModelController} from 'angular';
import {IActivityIntervalP} from "../../../../../api/activity/activity.interface";
import {CalendarItemActivityCtrl} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {FtpState} from "../assignment/assignment.component";
import {Loop, LoopMode} from "../structured-assignment/structured-assignment.component";
import {ActivityIntervalP} from "../../activity-datamodel/activity.interval-p";
import {ActivityIntervalG} from "../../activity-datamodel/activity.interval-g";
import {getFtpBySport} from "../../../core/user.function";
import {DurationMeasure, IntensityMeasure} from "../../activity-datamodel/activity.models";

/**const approxZones = {
    heartRate: [
        {from: 0.01, to: 0.85},{from: 0.86, to: 0.89},{from: 0.90, to: 0.94},{from: 0.95, to: 1.00},
        {from: 1.01, to: 1.03},{from: 1.04, to: 1.06},{from: 1.07, to: 3.00}
    ],
    speed: [
        {from: 0.01, to: 0.77},{from: 0.78, to: 0.87},{from: 0.88, to: 0.94},{from: 0.95, to: 1.00},
        {from: 1.01, to: 1.03},{from: 1.04, to: 1.11},{from: 1.12, to: 3.00}
    ],
    power: [
        {from: 0.01, to: 0.54},{from: 0.55, to: 0.74},{from: 0.75, to: 0.89},{from: 0.90, to: 1.04},
        {from: 1.05, to: 1.20},{from: 1.21, to: 1.50},{from: 1.51, to: 4.00}
    ]
};**/

class StructuredIntervalCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public interval: ActivityIntervalP;
    public sport: string;
    public group: ActivityIntervalG;
    public loop: Loop;
    public ftpMode: FtpState;
    public viewPlan: boolean;
    public viewActual: boolean;
    public viewGroup: boolean;

    public onSelect: () => IPromise<void>;
    public onChange: (response: {interval: IActivityIntervalP}) => IPromise<void>;
    public onDelete: (response: {id: number}) => IPromise<void>;

    private readonly durationMeasure: Array<string> = ['duration', 'movingDuration', 'distance'];
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
    private duration: string = 'duration';
    private intensity: string = 'heartRate';
    private readonly index: any = [{from: 'intensityByFtpFrom', to: 'intensityByFtpTo'},{from: 'intensityLevelFrom', to: 'intensityLevelTo'}];

    private ftp: {[measure: string] : number};
    private segmentForm: INgModelController;

    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.ftp = getFtpBySport(this.item.options.owner.trainingZones, this.sport);
        this.prepareInterval();
    }

    $onChanges(changes: any): void {
        this.prepareInterval();
    }

    splice() {
        this.onDelete({id: 0});
    }

    isInputMode():boolean {
        return this.loop &&
            this.loop.mode === LoopMode.Input &&
            this.interval.pos === (this.loop.start + this.loop.length - 1);
    }

    select(){
        if(this.item.activity.view.isView) {
            //this.item.showIntervalOverview = true;
            //this.item.intervalOverview = this.interval;
        } else {
            this.onSelect();
        }
    }

    isFTP():boolean {
        return this.ftpMode === FtpState.On;
    }


    prepareInterval(){
        //this.interval = copy(this.interval); // срабатывает обновление модели (мешает работе с вводом скорости)
        Object.assign(this.interval, this.interval);

        /**if(this.group && this.group.hasOwnProperty('totalMeasures') && this.viewGroup) {
            let ind: number = (this.interval.pos - this.group.fPos) % this.group.grpLength;
            Object.assign(this.interval.calcMeasures, this.group.totalMeasures[ind]);
        }**/
/**
        this.interval.movingDuration['durationValue'] = ((this.interval.durationMeasure === 'movingDuration' || (this.interval.durationMeasure === 'duration')) && this.interval.durationValue) || null;
        this.interval.distance['durationValue'] = (this.interval.durationMeasure === 'distance' && this.interval.durationValue) || null;
        this.interval.heartRate = Object.assign(this.interval.heartRate, {
            intensityLevelFrom: (this.interval.intensityMeasure === 'heartRate' && this.interval.intensityLevelFrom) || null,
            intensityLevelTo: (this.interval.intensityMeasure === 'heartRate' && this.interval.intensityLevelTo) || null,
            intensityByFtpFrom: (this.interval.intensityMeasure === 'heartRate' && this.interval.intensityByFtpFrom) || null,
            intensityByFtpTo: (this.interval.intensityMeasure === 'heartRate' && this.interval.intensityByFtpTo) || null
        });
        this.interval.speed = Object.assign(this.interval.speed, {
            intensityLevelFrom: (this.interval.intensityMeasure === 'speed' && this.interval.intensityLevelFrom) || null,
            intensityLevelTo: (this.interval.intensityMeasure === 'speed' && this.interval.intensityLevelTo) || null,
            intensityByFtpFrom: (this.interval.intensityMeasure === 'speed' && this.interval.intensityByFtpFrom) || null,
            intensityByFtpTo: (this.interval.intensityMeasure === 'speed' && this.interval.intensityByFtpTo) || null
        });
        this.interval.power = Object.assign(this.interval.power, {
             intensityLevelFrom: (this.interval.intensityMeasure === 'power' && this.interval.intensityLevelFrom) || null,
             intensityLevelTo: (this.interval.intensityMeasure === 'power' && this.interval.intensityLevelTo) || null,
             intensityByFtpFrom: (this.interval.intensityMeasure === 'power' && this.interval.intensityByFtpFrom) || null,
             intensityByFtpTo: (this.interval.intensityMeasure === 'power' && this.interval.intensityByFtpTo) || null
        });**/
    }

    /**
     * Передаем статус валидности формы ввода сегмента на уровнеь гавной формы ввода задания по тренировке
     */
    broadcastFormValidation(): void {
        setTimeout(() => this.item.assignmentForm.$setValidity('segmentInput', this.segmentForm.$valid), 100);
    }

    /**
     * Смена параметра длительности
     * @param type
     */
    changeDurationType(type: string): void {
        this.interval.durationMeasure = type;
        this.broadcastFormValidation();
    }

    /**
     * Смена парметра интенсивности
     * @param type
     */
    changeIntensityMeasure(type: string): void {
        this.interval.intensityMeasure = type;
        this.broadcastFormValidation();
    }

    /**
     * Смена значения параметра интенсивности
     * @param measure
     */
    changeValue(measure: string) {
        this.completeInterval(measure);
        if (measure === 'duration' || measure === 'movingDuration') {
            this.interval.movingDurationLength = this.interval.durationValue;
        }
        if (measure === 'distance') {
            this.interval.distanceLength = this.interval.durationValue;
        }
        this.broadcastFormValidation();
        this.onChange({interval: this.interval});
    }

    /**
     * Расчет производных показателей интервала по введенмоу значению
     * @param measure
     */
    completeInterval(measure: string) {
        let value:DurationMeasure | IntensityMeasure = this.interval[measure];
        this.interval.complete(this.ftp, this.ftpMode, [{ measure: measure, value: value}]);
        /**measure = this.durationMeasure.indexOf(measure) === -1 ? this.interval.intensityMeasure : measure;

        if (this.durationMeasure.indexOf(measure) !== -1) {
            this.interval.durationValue = this.interval[measure].durationValue;
        } else {
            this.interval.intensityLevelFrom = this.interval[measure].intensityLevelFrom;
            this.interval.intensityLevelTo = this.interval[measure].intensityLevelTo;
            // 1. добавляем %FTP или относительные значения для интенсивности
            [this.interval.intensityByFtpFrom, this.interval.intensityByFtpTo] = this.completeFtpMeasure(measure);
            // 2. опредлеяем максимальную зону интенсивности
            [this.interval.intensityFtpMax, this.interval.intensityMaxZone] = this.maxZone();
        }

        // 3. Рассчитать время и расстояние по сегменту, а также признаки приблизительного расчета:
        // movingDurationLength, distanceLength, movingDurationApprox, distanceLengthApprox
        [this.interval.movingDurationLength,
            this.interval.distanceLength,
            this.interval.movingDurationApprox,
            this.interval.distanceApprox] = this.approxCalc(this.interval.intensityMeasure);**/

    }

    /**completeFtpMeasure(key: string = this.interval.intensityMeasure):Array<number> {
        return [
            this.interval[key][this.index[FtpState.On]['from']] = this.interval[key][this.index[FtpState.Off]['from']] / this.getFTP(key),
            this.interval[key][this.index[FtpState.On]['to']] = this.interval[key][this.index[FtpState.Off]['to']] / this.getFTP(key)
        ];

    }

    getFTP(measure: string = this.interval.intensityMeasure, sport: string = this.sport):number {
        let zones = this.item.user.trainingZones;
        return (zones.hasOwnProperty(measure) && zones[measure].hasOwnProperty(sport) && zones[measure][sport]['FTP']) ||
            (zones.hasOwnProperty(measure) && zones[measure].hasOwnProperty('default') && zones[measure]['default']['FTP']) || null;
    }

    maxZone():Array<number> {
        return [0,0];
    }

    approxCalc(measure):Array<any> {

        if (this.interval.durationMeasure === 'movingDuration' &&
            this.interval.intensityMeasure === 'speed') {
            return [this.interval.durationValue,
                this.interval.durationValue * (this.interval.intensityLevelFrom + this.interval.intensityLevelTo)/2,
                false, false];

        } else if (this.interval.durationMeasure === 'distance' &&
            this.interval.intensityMeasure === 'speed') {
            return [this.interval.durationValue / ((this.interval.intensityLevelFrom + this.interval.intensityLevelTo)/2),
                this.interval.durationValue,
                false, false];

        } else if (this.interval.durationMeasure === 'movingDuration' &&
            (this.interval.intensityMeasure === 'heartRate' || this.interval.intensityMeasure === 'power')) {
            let speed: number = this.approxSpeed(measure);
            return [this.interval.durationValue,
                this.interval.durationValue * speed,
                false, true];

        } else if (this.interval.durationMeasure === 'distance' &&
            (this.interval.intensityMeasure === 'heartRate' || this.interval.intensityMeasure === 'power')) {
            let speed: number = this.approxSpeed(measure);
            return [this.interval.durationValue / speed,
                this.interval.durationValue,
                true, false];

        } else {
            return [null, null, false, false];
        }
    }

    approxSpeed(measure):number {
        let FTP: number = (this.interval.intensityByFtpFrom + this.interval.intensityByFtpTo) / 2;

        if (!FTP) {
            return null;
        }

        let zoneId: number = approxZones[measure].findIndex(z => FTP.toFixed(2) >= z.from && FTP.toFixed(2) <= z.to);
        let delta: number, approxFTP: number;

        if (zoneId === 0) { // для первой зоны
            delta = FTP/approxZones[measure][zoneId]['to'];
            approxFTP = approxZones['speed'][zoneId]['to'] * delta;
        }
        else if (zoneId === approxZones[measure].length - 1) {  // для последней зоны
            delta = FTP/approxZones[measure][zoneId]['from'];
            approxFTP = approxZones['speed'][zoneId]['from'] * delta;
        }
        else { // для всех остальных зон
            delta = (FTP - approxZones[measure][zoneId]['from'])/ (approxZones[measure][zoneId]['to'] - approxZones[measure][zoneId]['from']);
            approxFTP = approxZones['speed'][zoneId]['from'] + delta * (approxZones['speed'][zoneId]['to'] - approxZones['speed'][zoneId]['from']);
        }

        console.log('approx', measure, FTP, zoneId, delta, approxFTP, this.getFTP('speed'));
        return approxFTP * this.getFTP('speed');
    }**/

}

const StructuredIntervalComponent:IComponentOptions = {
    bindings: {
        interval: '<',
        viewPlan: '<',
        viewActual: '<',
        viewGroup: '<',
        sport: '<',
        group: '<',
        groupCount: '<',
        count: '<',
        loop: '<',
        ftpMode: '<',
        change: '<',
        onChange: '&',
        onDelete: '&',
        onSelect: '&',
        onSetRepeat: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: StructuredIntervalCtrl,
    template: require('./structured-interval.component.html') as string
};

export default StructuredIntervalComponent;