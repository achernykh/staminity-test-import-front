import './structured-assignment.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IActivityIntervalP, IActivityIntervalG} from "../../../../../api/activity/activity.interface";
import {CalendarItemActivityCtrl} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {times} from '../../../share/util.js';
import {ActivityIntervals} from "../../activity-datamodel/activity.intervals";
import {ActivityIntervalP} from "../../activity-datamodel/activity.interval-p";

// Режим вывода Повтора для группы
export enum LoopMode {
    Group, // свернуто
    Collapse, // развернуто
    Input // режим ввода количества повторов
}

export interface Loop {
    id: number;
    code: string;
    mode: LoopMode;
    start: number;
    length: number;
    repeat: number;
    //input: number;
    pos: Array<number>;
}

class StructuredAssignmentCtrl implements IComponentController {

    public intervals: ActivityIntervals;
    public item: CalendarItemActivityCtrl;

    private mode: 'input' | 'colapse' | 'group' = 'group';
    private loops: Array<Loop>;
    private sequence: Loop;

    public onEvent: (response: Object) => IPromise<void>;
    public onChange: () => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.loops = this.loopsFromGroups;
    }

    change(index: number, interval: IActivityIntervalP) {
        //this.plan[index] = interval;
        this.item.activity.calculateInterval('pW');
        this.item.changeStructuredAssignment ++;
        this.onChange();
    }

    onChangeSelection():void {
        this.checkSequence();
        this.onChange();
    }

    get loopsFromGroups():Array<Loop>{
        return this.intervals.intervalG.map((g,i) => ({
            id: i,
            code: g.code,
            mode: LoopMode.Group,
            start: this.intervals.intervalP.filter(i => i.parentGroup === g.code && i.repeatPos === 0)[0].pos,
            length: this.intervals.intervalP.filter(i => i.parentGroup === g.code && i.repeatPos === 0).length,
            repeat: g.repeatCount,
            pos: this.intervals.intervalP.filter(i => i.parentGroup === g.code).map(i => i.pos)
        }));
    }

    calcPrevLoops(id: number):number {
        let count: number = 0;
        this.loops.forEach(l => {
            if(id > l.id) {
                count += (l.repeat - 1) * l.length;
                count = l.mode === LoopMode.Input ? --count : count; // строка ввода дает +1 позицию в списке
            }
        });

        return count;
    }

    checkSequence():void {
        let sequence:Array<number> = [];

        this.intervals.intervalP.forEach(i => {
            if (i.isSelected && (sequence.length === 0 || sequence.some(p => p === i.pos - 1))) {
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
            pos: sequence
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
        let loop: Loop = (!interval.hasOwnProperty('parentGroup')  && this.sequence) || // для выделения
            this.loops.filter(l => l.code === interval.parentGroup)[0] || null; // для группы

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
        let loopSegment: Array<ActivityIntervalP> = [];


        // Создание группы интервалов
        if(loop && loop.code === null && repeat > 1) {
            loopSegment = this.intervals.intervalP.filter(p => loop.pos.some(i => i === p.pos));
            success = this.intervals.createGroup(loopSegment, repeat);
        }
        // Удаление группы интервалов
        if(loop && loop.code !== null && repeat === 1) {
            success = this.intervals.spliceGroup(loop.code, loop.start, loop.length, loop.repeat);
        }
        // Изменение количества повторений
        if(loop && loop.code !== null && repeat > 1) {
            loopSegment = this.intervals.intervalP.filter(p => p.parentGroup === loop.code && p.repeatPos === 0);
            success = loop.repeat > repeat ? this.intervals.decreaseGroup(loopSegment, repeat) : this.intervals.increaseGroup(loopSegment, repeat);
        }

        if(success) {
            this.loops = this.loopsFromGroups;
            this.onChange();
        }

    }

    changeMode():string {
        debugger;
        return this.mode === 'group' ? 'input' : 'group';
    }
}

const StructuredAssignmentComponent:IComponentOptions = {
    bindings: {
        intervals: '<',
        onEvent: '&',
        onChange: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: StructuredAssignmentCtrl,
    template: require('./structured-assignment.component.html') as string
};

export default StructuredAssignmentComponent;