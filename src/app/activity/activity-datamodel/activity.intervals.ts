import {ActivityIntervalP} from "./activity.interval-p";
import {ActivityIntervalG} from "./activity.interval-g";
import {ActivityIntervalPW} from "./activity.interval-pw";
import {ActivityIntervalW} from "./activity.interval-w";
import {IActivityIntervals} from "../../../../api/activity/activity.interface";
import {ActivityIntervalFactory} from "./activity.functions";
import {times} from '../../share/util.js';
import {isDate} from "@reactivex/rxjs/dist/cjs/util/isDate";

const posOrder = (a:ActivityIntervalP,b:ActivityIntervalP) => a.pos < b.pos ? -1: 1;

/**
 * Класс управлением интервалами тренировки
 */
export class ActivityIntervals {

    pack: Array<ActivityIntervalP | ActivityIntervalG | ActivityIntervalPW | ActivityIntervalW>;
    //intervalL: Array<IActivityIntervalL> = [];
    //intervalU: Array<IActivityIntervalL> = [];

    constructor(intervals: Array<IActivityIntervals> = []){
        this.pack = intervals.map(i => ActivityIntervalFactory(i.type, i));
    }

    get intervalP():Array<ActivityIntervalP> {
        return <Array<ActivityIntervalP>>this.pack.filter(i => i.type === 'P').sort(posOrder);
    }

    get intervalG():Array<ActivityIntervalG> {
        return <Array<ActivityIntervalG>>this.pack.filter(i => i.type === 'G');
    }

    get intervalPW():ActivityIntervalPW {
        return <ActivityIntervalPW>this.pack.filter(i => i.type === 'pW')[0];
    }

    get intervalW():Array<ActivityIntervalW> {
        return <Array<ActivityIntervalW>>this.pack.filter(i => i.type === 'W');
    }

    add(intervals: Array<IActivityIntervals | ActivityIntervalP | ActivityIntervalG | ActivityIntervalPW | ActivityIntervalW> = []):void {
        intervals.forEach(i => {
            if (typeof i === 'ActivityIntervalP' || 'ActivityIntervalG') {
                this.pack.push(<ActivityIntervalP | ActivityIntervalG | ActivityIntervalPW | ActivityIntervalW>i);
            } else {
                this.pack.push(ActivityIntervalFactory(i['type'], i));
            }
        });
    }

    /**
     * @description Поиск интревала
     * @param type - P - плановые сегменты, G - группы
     * @param id - pos - для плановых сегментов, code - для группы
     * @returns {number}
     */
    find(type: string, id: string | number):number {
        switch (type) {
            case 'P': {
                return this.pack.findIndex(i => i.type === type && i['pos'] === id);
            }
            case 'G': {
                return this.pack.findIndex(i => i.type === type && i['code'] === <string>id);
            }
        }
    }

    /**
     * @description Удаление инетрвала
     * @param type
     * @param id
     */
    splice(type: string, id: string | number):void {
        let i: number = this.find(type, id);
        if(id !== -1) {
            this.pack.splice(i,1);
        }
    }

    /**
     * @description Установка/добавление свойст в интервал
     * @param type - P - плановые сегменты, G - группы
     * @param id - pos - для плановых сегментов, code - для группы
     * @param params - обновленный набор свойств интервала
     */
    setParams(type: string, id: string | number, params: Object): void {
        let i: number = this.find(type,id);
        if(id !== -1) {
            Object.assign(this.pack[i], params);
        }
    }

    /**
     * Удаляем группу интервалов (первый сегмент остается)
     * @param code
     * @param start
     * @param length
     * @returns {boolean}
     */
    spliceGroup(code: string, start: number, length: number, repeat: number):boolean{
        // 1. Удаляем группу
        this.splice('G', code);

        // 2. Удаляем интервалы с repeatCount > 0
        this.intervalP.filter(i => i.parentGroup === code && i.repeatPos > 0).map(i => this.splice(i.type, i.pos));

        // 3. Удаляем ссылку на группу и идентификатор повторов в первом сегменте группы
        this.intervalP.filter(i => i.parentGroup === code && i.repeatPos > 0)
            .map(i => this.setParams(i.type, i.pos, {parentGroup: null, repeatPos: null}));

        // 4. Выстраиваем последовательность pos
        this.reorganisation(start + length * repeat, length * (1 - repeat));

        // 5. Обновляем интревал pW
        this.intervalPW.calculate(this.intervalP);

        return true;
    }

    /**
     * @description Добавляем новую группу интервалов
     * @param segment - набор интервалов для повторения
     * @param repeat - количество повторений в группе
     * @returns {boolean}
     */
    createGroup(segment: Array<ActivityIntervalP>, repeat: number):boolean {
        // 1. создаем группу
        let group: ActivityIntervalG = <ActivityIntervalG>ActivityIntervalFactory('G',{repeatCount: repeat});
        this.pack.push(group);

        // 2. устанавливаем в имеющийся сегмент указатель на номер группы и порядковый номер
        segment.forEach(i => this.setParams(i.type, i.pos, {parentGroup: group.code, repeatPos: 0}));

        // 3. двигаем сегменты на интервал позиций = кол-во повторов * длина сегмента
        let len: number = segment.length;
        this.reorganisation(segment[0].pos + len, len * (repeat - 1));

        // 4. копируем сегмент с указателем номера группы и количества
        segment.forEach(i =>
            times(repeat - 1).map(r => {
                let params = {pos: i.pos + len * (r + 1),parentGroup: group.code, repeatPos: r + 1};
                this.pack.push(ActivityIntervalFactory('P', Object.assign({}, i, params)));
            }));

        // 5. Обновляем интревал pW
        this.intervalPW.calculate(this.intervalP);

        return true;
    }

    /**
     * @description Увелечение количества повторений в группе
     * @param segment
     * @param repeat
     * @returns {boolean}
     */
    increaseGroup(segment: Array<ActivityIntervalP>, trgRepeat: number):boolean {
        //1. Номер группы
        let group: ActivityIntervalG = <ActivityIntervalG>this.pack
            .filter(i => i.type === 'G' && i['code'] === segment[0].parentGroup)[0];

        let srcRepeat: number = group.repeatCount;
        let len: number = segment.length;

        //2. Меняем количество повторений в группе
        this.setParams(group.type, group.code, {repeatCount: trgRepeat});

        //3. Выстраиваем последовательность pos
        this.reorganisation(segment[0].pos + (srcRepeat * len), (trgRepeat - srcRepeat) * len);

        //4. Добавляем инетрвалы
        segment.forEach(i =>
            times(trgRepeat - srcRepeat - 1).map(r => {
                let params = {pos: i.pos + len * (srcRepeat + r + 1),parentGroup: group.code, repeatPos: srcRepeat + r + 1};
                this.pack.push(ActivityIntervalFactory('P', Object.assign({}, i, params)));
            }));

        // 5. Обновляем интревал pW
        this.intervalPW.calculate(this.intervalP);

        return true;
    }

    /**
     * @description Уменьшение количества повторений в группе
     * @param segment
     * @param trgRepeat
     * @returns {boolean}
     */
    decreaseGroup(segment: Array<ActivityIntervalP>, trgRepeat: number):boolean {
        //1. Номер группы и начальное количество повторов
        let group: ActivityIntervalG = <ActivityIntervalG>this.pack
            .filter(i => i.type === 'G' && i['code'] === segment[0].parentGroup)[0];

        let srcRepeat: number = group.repeatCount;
        let len: number = segment.length;

        //2. Меняем количество повторений в группе
        this.setParams(group.type, group.code, {repeatCount: trgRepeat});

        //3. Удаляем интервалы
        this.intervalP.filter(i => i.parentGroup === group.code && i.repeatPos >= trgRepeat)
            .map(i => this.splice(i.type, i.pos));

        //4. Выстраиваем последовательность pos
        this.reorganisation(segment[0].pos + (srcRepeat * len), (trgRepeat - srcRepeat) * len);

        // 5. Обновляем интревал pW
        this.intervalPW.calculate(this.intervalP);

        return true;
    }

    /**
     * @description Копирование инетрвала
     * @param interval
     */
    copy(interval: IActivityIntervals):void {

    }

    /**
     * @description Реорганизация позиций по интервалам
     * Задача: при изменение инетрвала с позицией, необходимо привести все интервалы с позицией в сплошную
     * последовательность целых чисел
     * @param start
     * @param shift
     */
    reorganisation(start: number, shift: number):void {
        debugger;
        this.intervalP.filter(i => i.pos >= start).forEach(i => this.setParams(i.type, i.pos, { pos: i.pos + shift}));
    }
}
