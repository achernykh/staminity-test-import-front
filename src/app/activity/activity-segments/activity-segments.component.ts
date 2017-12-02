import {IComponentController, IComponentOptions, IPromise} from "angular";
import {IActivityInterval} from "../../../../api/activity/activity.interface";
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {getFTP, getFtpBySport} from "../../core/user.function";
import {ActivityIntervalFactory} from "../activity-datamodel/activity.functions";
import {ActivityIntervalG} from "../activity-datamodel/activity.interval-g";
import {ActivityIntervalP} from "../activity-datamodel/activity.interval-p";
import {ActivityIntervals} from "../activity-datamodel/activity.intervals";
import {Interval} from "../activity.datamodel";
import {FtpState} from "../components/assignment/assignment.component";
import "./activity-segments.component.scss";
import {getChanges, getSegmentTemplates} from "./activity-segments.constants";

export enum SegmentChangeReason {
    addInterval,
    deleteInterval,
    changeValue,
    selectInterval,
    keyInterval,
    changeGroupCount,
}

class ActivitySegmentsCtrl implements IComponentController {

    public item: CalendarItemActivityCtrl;
    public onEvent: (response: Object) => IPromise<void>;

    public viewPlan: boolean = true;
    public viewActual: boolean = false;
    public viewGroup: boolean = true;

    private durationMeasure: string = "movingDuration";
    private intensityMeasure: string = "heartRate";
    private intervals: ActivityIntervals;
    private select: number[] = [];
    private scenario: any = getSegmentTemplates();

    public ftpMode: number;

    public static $inject = [];

    constructor() {

    }

    /**
     *
     */
    private firstSelectPosition(): number {
        return this.intervals.P.some((i) => i.isSelected) && this.intervals.P.filter((i) => i.isSelected)[0].pos || null;
    }

    public $onInit() {
        this.valid();
        this.prepareIntervals();
        //this.addInterval();
    }

    public $onChanges(): void {
        this.prepareIntervals();
    }

    public prepareIntervals(): void {
        this.intervals = this.item.activity.intervals;
    }

    public valid(): void {
        this.item.assignmentForm.$setValidity("needInterval", this.intervals.P.length > 0);
        this.item.assignmentForm.$setValidity("needDuration", this.intervals.P.length > 0);
    }
    /**
     * @description Обновление модели данных
     */
    public update(reason: SegmentChangeReason): void {
        this.intervals = this.item.activity.intervals;
        this.valid();
        this.item.assignmentForm.$setDirty();

        switch (reason) {
            case SegmentChangeReason.addInterval:
            case SegmentChangeReason.deleteInterval:
            case SegmentChangeReason.changeGroupCount:
            case SegmentChangeReason.keyInterval: {
                if (this.item.activity.completed) {
                    this.item.calculateActivityRange(false);
                }
                this.intervals.PW.calculate(this.intervals.P);
            }
            default: { // selectInterval
                this.item.changeStructuredAssignment ++;
            }
        }
    }

    public onChartSelection(id: number) {
        if (this.intervals[id]) {
            //this.intervals[id].isSelected = true;
        }
    }

    /**
     *
     */
    public addInterval(scenarioType: string = "default") {
        const sport: string = this.item.activity.sportBasic;
        const ftp: {[measure: string]: number} = getFtpBySport(this.item.user.trainingZones, sport);
        let interval: ActivityIntervalP;
        let pos: number = null;
        const scenario: any = getSegmentTemplates();

        if (this.selectedInterval().length > 0) {
            pos = this.firstSelectPosition() + 1;
            this.intervals.reorganisation(pos, 1);
        } else {
            pos = this.intervals.lastPos() + 1;
        }

        scenario[sport][scenarioType].forEach((template) => {
            switch (template.type) {
                case "P": {
                    interval = new ActivityIntervalP("P", Object.assign(template, {pos: pos++}));
                    this.intervals.add([interval.complete(ftp, FtpState.On, getChanges(interval))]);
                    break;
                }
                case "G": {
                    this.intervals.add([new ActivityIntervalG("G", Object.assign(template, {fPos: pos}))]);
                    break;
                }
            }
        });

        this.update(SegmentChangeReason.addInterval);
    }

    public delete() {
        this.intervals.P.filter((interval) =>
            interval.isSelected &&
            (!interval.hasOwnProperty("repeatPos") || interval.repeatPos === null || interval.repeatPos === 0))
            .map((interval) => this.intervals.splice(interval.type, interval.pos));

        this.update(SegmentChangeReason.deleteInterval);
    }

    public isKey(): boolean {
        return this.selectedInterval().length === this.selectedKeyInterval().length;
    }

    public isIndeterminate(): boolean {
        console.log(this.selectedInterval().length, this.selectedKeyInterval().length);
        //return false;
        return this.selectedKeyInterval().length !== 0 && this.selectedInterval().length !== this.selectedKeyInterval().length;
    }

    public toggleKey() {
        if (this.selectedInterval().length === this.selectedKeyInterval().length) {
            this.intervals.P.filter((interval) => interval.isSelected).forEach((interval) => interval.keyInterval = false);
        } else if (this.selectedKeyInterval().length === 0 || this.selectedKeyInterval().length > 0) {
            this.intervals.P.filter((interval) => interval.isSelected).forEach((interval) => interval.keyInterval = true);
        }
        this.update(SegmentChangeReason.keyInterval);
    }

    public selectedInterval(): any[] {
        return this.intervals.P.filter((interval) => interval.isSelected) || [];
    }

    public selectedKeyInterval(): any[] {
        return this.intervals.P.filter((interval) => interval.isSelected && interval.keyInterval);
    }

    public ftpModeChange(mode: FtpState) {
        this.ftpMode = mode;
        this.item.ftpMode = mode;
    }

}

const ActivitySegmentsComponent: IComponentOptions = {
    bindings: {
        data: "<",
        hasImport: "<",
        change: "<",
        onEvent: "&",
    },
    require: {
        item: "^calendarItemActivity",
    },
    controller: ActivitySegmentsCtrl,
    template: require("./activity-segments.component.html") as string,
};

export default ActivitySegmentsComponent;
