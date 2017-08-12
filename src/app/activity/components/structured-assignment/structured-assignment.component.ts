import './structured-assignment.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IActivityIntervalP, IActivityIntervalG} from "../../../../../api/activity/activity.interface";
import {CalendarItemActivityCtrl} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {
    ActivityIntervalG, ActivityIntervalP, ActivityIntervalFactory,
    ActivityIntervals
} from "../../activity.datamodel-function";
import {times} from '../../../share/util.js';

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
        return this.loops.length > 0 || this.sequence.length > 1;
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

    setRepeat(loop: Loop, repeat: number):void {
        debugger;
        loop.mode = LoopMode.Group;
        loop.repeat = repeat;

        /**let loopSegment: Array<ActivityIntervalP> =
            this.plan.filter(p => p.parentGroupCode === loop.code && p.repeatPos === 0);

        times(repeat - loop.repeat).forEach(i => {

        });
        let interval = <ActivityIntervalP>ActivityIntervalFactory('P', {});
        this.item.activity.completeInterval(interval)

        debugger;**/

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