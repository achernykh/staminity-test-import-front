import {copy, IComponentController, IComponentOptions, IPromise} from "angular";
import {IActivityIntervalG, IActivityIntervalP} from "../../../../../api/activity/activity.interface";
import {CalendarItemActivityCtrl} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {times} from "../../../share/util.js";
import {ActivityIntervalG} from "../../activity-datamodel/activity.interval-g";
import {ActivityIntervalP} from "../../activity-datamodel/activity.interval-p";
import {ActivityIntervals} from "../../activity-datamodel/activity.intervals";
import {SegmentChangeReason} from "../../activity-segments/activity-segments.component";
import "./structured-assignment.component.scss";

// Режим вывода Повтора для группы
export enum LoopMode {
    Group, // свернуто
    Collapse, // развернуто
    Input, // режим ввода количества повторов
}

export interface Loop {
    id: number;
    code: string;
    mode: LoopMode;
    start: number;
    length: number;
    repeat: number;
    //input: number;
    pos: number[];
}

class StructuredAssignmentCtrl implements IComponentController {

    public intervals: ActivityIntervals;
    public segments: ActivityIntervalP[];
    public item: CalendarItemActivityCtrl;
    public viewPlan: boolean;
    public viewActual: boolean;
    public viewGroup: boolean;

    private mode: "input" | "colapse" | "group" = "group";
    private loops: Loop[];
    private sequence: Loop;

    public onEvent: (response: Object) => IPromise<void>;
    public onChange: (response: {reason: SegmentChangeReason}) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.loops = this.loopsFromGroups;
    }

    $onChanges(changes: any):void{
        this.loops = this.loopsFromGroups;
    }

    onChangeValue(interval: ActivityIntervalP) {
        this.intervals.setValue(interval.type, interval.pos, interval.assignment());
        this.intervals.PW.calculate(this.intervals.P);
        if(this.item.activity.completed){
            this.item.calculateActivityRange(false);
        }
        this.onChange({reason: SegmentChangeReason.changeValue});
    }

    onChangeSelection(interval: ActivityIntervalP):void {
        interval.isSelected ? this.intervals.deselect(interval.type, interval.pos) : this.intervals.select(interval.type, interval.pos);
        this.checkSequence();
        this.onChange({reason: SegmentChangeReason.selectInterval});
    }

    get loopsFromGroups():Loop[]{
        return this.intervals.G.map((g,i) => ({
            id: i,
            code: g.code,
            mode: LoopMode.Group,
            start: g.fPos, //this.intervals.P.filter(i => i.parentGroupCode === g.code && i.repeatPos === 0)[0].pos,
            length: g.grpLength, //this.intervals.P.filter(i => i.parentGroupCode === g.code && i.repeatPos === 0).length,
            repeat: g.repeatCount,
            pos: this.intervals.P.filter((i) => i.parentGroupCode === g.code).map((i) => i.pos),
        }));
    }

    calcPrevLoops(currLoop: Loop):number {
        let count: number = 0;
        this.loops.forEach((l) => {
            if(currLoop.start > l.start) {
                count += (l.repeat - 1) * l.length;
                count = l.mode === LoopMode.Input ? --count : count; // строка ввода дает +1 позицию в списке
            }
        });

        return count;
    }

    checkSequence():void {
        let sequence:number[] = [];

        this.intervals.P.forEach((i) => {
            if (i.isSelected && (sequence.length === 0 || sequence.some((p) => p === i.pos - 1)) && !i.parentGroupCode) {
                sequence.push(i.pos);
            } else if (sequence.length === 1 ) {
                sequence = [];
            }
        });

        this.sequence = sequence.length > 1 ? {
            id: null,
            code: null,
            mode: LoopMode.Group,
            start: sequence[0],
            length: sequence.length,
            repeat: 1,
            pos: sequence,
        } : null;
    }

    haveLoops():boolean {
        return this.loops.length > 0 || !!this.sequence;
    }

    /**
     * @description
     * Повтор или выделение для которого интервал, является интервалов ввода количества повторений
     * Количество повторений вводится в последнем интервале первого повтора группы
     * @param interval
     */
    myLoop(interval: ActivityIntervalP):Loop {
        // Повтор в котором участвует интервал
        let loop: Loop = ((!interval.hasOwnProperty("parentGroupCode") || interval.parentGroupCode === null)  && this.sequence) || // для выделения
            this.loops.filter((l) => l.code === interval.parentGroupCode)[0] || null; // для группы

        //console.log('my-loop', interval.pos, !!loop, loop['pos'], loop['length']);
        return (loop && loop.pos[loop.length - 1] === interval.pos && loop) || null;
    }

    /**
     * Смена количества повторений в группе
     * @param loop
     * @param repeat
     */
    setRepeat(loop: Loop, repeat: number):void {
        let success: boolean = false;
        let loopSegment: ActivityIntervalP[] = [];


        // Создание группы интервалов
        if(loop && loop.code === null && repeat > 1) {
            loopSegment = this.intervals.P.filter((p) => loop.pos.some((i) => i === p.pos));
            success = this.intervals.createGroup(loopSegment, repeat, loop.start);
        }
        // Удаление группы интервалов
        if(loop && loop.code !== null && repeat === 1) {
            success = this.intervals.spliceGroup(loop.code, loop.start, loop.length, loop.repeat);
        }
        // Изменение количества повторений
        if(loop && loop.code !== null && repeat > 1) {
            loopSegment = this.intervals.P.filter((p) => p.parentGroupCode === loop.code && p.repeatPos === 0);
            success = loop.repeat > repeat ? this.intervals.decreaseGroup(loopSegment, repeat) : this.intervals.increaseGroup(loopSegment, repeat);
        }

        if(success) {
            this.loops = this.loopsFromGroups;
            this.intervals.deselect();
            this.checkSequence();
            this.onChange({reason: SegmentChangeReason.changeGroupCount});
        }

    }

    changeMode():string {
        return this.mode === "group" ? "input" : "group";
    }

    group(interval: ActivityIntervalP):ActivityIntervalG {
        return ((this.viewGroup && interval.hasOwnProperty("parentGroupCode") && interval.parentGroupCode) &&
            this.intervals.G.filter((i) => i.code === interval.parentGroupCode)[0]) || null;
    }
}

const StructuredAssignmentComponent:IComponentOptions = {
    bindings: {
        intervals: "<",
        viewPlan: "<",
        viewActual: "<",
        viewGroup: "<",
        change: "<",
        onEvent: "&",
        onChange: "&",
    },
    require: {
        item: "^calendarItemActivity",
    },
    controller: StructuredAssignmentCtrl,
    template: require("./structured-assignment.component.html") as string,
};

export default StructuredAssignmentComponent;