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
}

class StructuredAssignmentCtrl implements IComponentController {

    public intervals: ActivityIntervals;
    public plan: Array<IActivityIntervalP>;
    public group: Array<IActivityIntervalG>;
    public item: CalendarItemActivityCtrl;

    private mode: 'input' | 'colapse' | 'group' = 'group';
    private groupCount: number = 1;
    private loops: Array<Loop>;

    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.loops = this.loopsFromGroups;
    }

    change(index: number, interval: IActivityIntervalP) {
        this.plan[index] = interval;
        this.item.activity.calculateInterval('pW');
        this.item.changeStructuredAssignment ++;
    }

    get sequence():Array<number> {
        let intervals = this.item.activity.intervalP;
        let sequence:Array<number> = [];
        intervals.forEach(i => {
            if (i.isSelected && (sequence.length === 0 || sequence.some(p => p === i.pos - 1))) {
                sequence.push(i.pos);
            } else if (sequence.length === 1 ) {
                sequence = [];
            }
        });
        return sequence.length > 0 ? sequence : [];
    }

    get loopsFromGroups():Array<Loop>{
        return this.group.map((g,i) => ({
            id: i,
            code: g.code,
            mode: LoopMode.Group,
            start: this.plan.filter(i => i.parentGroup === g.code && i.repeatPos === 0)[0].pos,
            length: this.plan.filter(i => i.parentGroup === g.code && i.repeatPos === 0).length,
            repeat: g.repeatCount
        }));
    }

    calcPrevLoops(id: number):number {
        let count: number = 0;
        this.loops.forEach(l => {
            if(id > l.id) {
                count += (l.repeat - 1) * l.length;
            }
        });

        return count;
    }

    isSequenceSelected():boolean {
        return this.sequence.length > 1;
    }

    haveLoops():boolean {
        return this.loops.length > 0 || this.sequence.length > 1;
    }

    // Повтор в котором участвует интервал
    myLoop(code: string):Loop {
        return this.loops.filter(l => l.code === code)[0] || null;
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
        plan: '<',
        group: '<',
        onEvent: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: StructuredAssignmentCtrl,
    template: require('./structured-assignment.component.html') as string
};

export default StructuredAssignmentComponent;