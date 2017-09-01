import {ActivityIntervalP} from "./activity.interval-p";
import {ActivityIntervalG} from "./activity.interval-g";
import {ActivityIntervalPW} from "./activity.interval-pw";
import {ActivityIntervalW} from "./activity.interval-w";
import {ActivityIntervalU} from "./activity.interval-u";

import {
    IActivityIntervals, IActivityIntervalP, IActivityIntervalPW,
    IActivityIntervalW, IActivityIntervalG
} from "../../../../api/activity/activity.interface";
import {ActivityIntervalFactory} from "./activity.functions";
import {times} from '../../share/util.js';
import {ActivityIntervalL} from "./activity.interval-l";
import {isArray} from "rxjs/util/isArray";

const posOrder = (a:ActivityIntervalP,b:ActivityIntervalP) => a.pos < b.pos ? -1: 1;

/**
 * Класс управлением интервалами тренировки
 */
export class ActivityIntervals {

    stack: Array<ActivityIntervalP | ActivityIntervalL | ActivityIntervalG | ActivityIntervalPW | ActivityIntervalW | ActivityIntervalU>;

    constructor(intervals: Array<IActivityIntervals> = []){
        this.stack = intervals.map(i => ActivityIntervalFactory(i.type, i));
        // Если интервалов нет, то создаем два итоговых инетрвала по плану и факту
        if(!this.PW) {
            this.add([ActivityIntervalFactory('pW')]);
        }
        if(!this.W) {
            this.add([ActivityIntervalFactory('W')]);
        }
    }

    get P():Array<ActivityIntervalP> {
        return <Array<ActivityIntervalP>>this.stack.filter(i => i.type === 'P').sort(posOrder);
    }

    get L():Array<ActivityIntervalL> {
        return <Array<ActivityIntervalL>>this.stack.filter(i => i.type === 'L');
    }

    get G():Array<ActivityIntervalG> {
        return <Array<ActivityIntervalG>>this.stack.filter(i => i.type === 'G');
    }

    get U():Array<ActivityIntervalU> {
        return <Array<ActivityIntervalU>>this.stack.filter(i => i.type === 'U');
    }

    get PW():ActivityIntervalPW {
        return <ActivityIntervalPW>this.stack.filter(i => i.type === 'pW')[0];
    }

    get W():ActivityIntervalW {
        return <ActivityIntervalW>this.stack.filter(i => i.type === 'W')[0];
    }

    add(intervals: Array<IActivityIntervals | ActivityIntervalP | ActivityIntervalG | ActivityIntervalPW | ActivityIntervalW> = []):void {
        intervals.forEach(i => {
            if (typeof i === 'ActivityIntervalP' || 'ActivityIntervalG') {
                this.stack.push(<ActivityIntervalP | ActivityIntervalG | ActivityIntervalPW | ActivityIntervalW>i);
            } else {
                this.stack.push(ActivityIntervalFactory(i['type'], i));
            }
        });
    }

    build(){
        return [...this.P.map(i => this.clear(i)), ...this.G.map(i => this.clear(i)), this.clear(this.W), this.clear(this.PW)];
    }

    clear(interval: ActivityIntervalP | ActivityIntervalG | ActivityIntervalPW | ActivityIntervalW):IActivityIntervals{
        return interval.clear();
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
                return this.stack.findIndex(i => i.type === type && i['pos'] === id);
            }
            case 'G': {
                return this.stack.findIndex(i => i.type === type && i['code'] === <string>id);
            }
            case 'pW': {
                return this.stack.findIndex(i => i.type === type);
            }
            case 'W': {
                return this.stack.findIndex(i => i.type === type);
            }
        }
    }

    lastPos():number{
        let max:number = Math.max(...this.P.map(i => i.pos),0);
        return max;
    }

    /**
     * @description Удаление интервала
     * @param type
     * @param id
     */
    splice(type: string, id: string | number): void {
        let i: number = this.find(type, id);
        if(i !== -1){
            let interval: ActivityIntervalP = <ActivityIntervalP>this.stack[i];
            // Если интревал является повторяющимся
            if (interval.hasOwnProperty('parentGroupCode') && interval.parentGroupCode) {
                let group:ActivityIntervalG = this.G.filter(i => i.code === interval.parentGroupCode)[0];
                this.P.filter(i => i.type === type && i.parentGroupCode === group.code && (i.pos - interval.pos) % group.grpLength === 0)
                    .map(interval => {
                        i = this.find(interval.type, interval.pos);
                        // 1. удаляем интревал
                        this.stack.splice(i,1);
                        // 2. реорганизуем инетрвалы, сдвигаем на -1 позицию вверх
                        this.reorganisation(interval.pos, -1);
                    });
            } else { // одиночный интервал
                this.stack.splice(i,1);
                this.reorganisation(interval.pos, -1);
            }
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
        if(i !== -1) {
            Object.assign(this.stack[i], params);
        }
    }

    /**
     * @description Установка значений по плану на интервал, группу
     * @param type
     * @param id
     * @param params
     */
    setValue(type: string = 'P', id: string | number, params: Object):void {

        let i: number = this.find(type,id);
        if (i !== -1) {
            let interval: ActivityIntervalP = <ActivityIntervalP>this.stack[i];
            // Если интревал является повторяющимся
            if (interval.hasOwnProperty('parentGroupCode') && interval.parentGroupCode) {
                let group:ActivityIntervalG = this.G.filter(i => i.code === interval.parentGroupCode)[0];
                this.P.filter(i => i.type === type && i.parentGroupCode === group.code && (i.pos - interval.pos) % group.grpLength === 0)
                    .map(i => this.setParams(i.type, i.pos, params));
            } else { // одиночный интервал
                Object.assign(this.stack[i], params);
            }
        }
    }

    /**
     * @description Установка выделения интервала
     * @param type
     * @param id
     * @param params
     */
    select(type: string = 'P', id: string | number, params: Object = {isSelected: true}):void {
        // Если интрал задан
        if (id !== undefined){
            let i: number = this.find(type,id);
            if (i !== -1) {
                let interval: ActivityIntervalP = <ActivityIntervalP>this.stack[i];
                // Если интревал является повторяющимся
                if (interval.hasOwnProperty('parentGroupCode') && interval.parentGroupCode) {
                    let group:ActivityIntervalG = this.G.filter(i => i.code === interval.parentGroupCode)[0];
                    this.P.filter(i => i.type === type && i.parentGroupCode === group.code && (i.pos - interval.pos) % group.grpLength === 0)
                        .map(i => this.setParams(i.type, i.pos, params));
                } else { // одиночный интервал
                    Object.assign(this.stack[i], params);
                }
            }
        } else { // Интервал не задан, для всех
            this.stack.filter(i => i.type === type).map(i => this.setParams(type, i.pos, params));
        }
    }

    /**
     * @description Снятие выделения с интервала
     * @param type
     * @param id
     */
    deselect(type: string = 'P', id?: string | number, params = {isSelected: false}): void {
        // Если интрал задан
        if (id !== undefined){
            let i: number = this.find(type,id);
            if (i !== -1) {
                let interval: ActivityIntervalP = <ActivityIntervalP>this.stack[i];
                // Если интревал является повторяющимся
                if (interval.hasOwnProperty('parentGroupCode') && interval.parentGroupCode) {
                    let group:ActivityIntervalG = this.G.filter(i => i.code === interval.parentGroupCode)[0];
                    this.P.filter(i => i.type === type && i.parentGroupCode === group.code && (i.pos - interval.pos) % group.grpLength === 0)
                        .map(i => this.setParams(i.type, i.pos, params));
                } else { // одиночный интервал
                    Object.assign(this.stack[i], params);
                }
            }
        } else { // Интервал не задан, для всех
            this.stack.filter(i => i.type === type).map(i => this.setParams(type, i.pos, params));
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
        this.P.filter(i => i.parentGroupCode === code && i.repeatPos > 0).map(i => this.splice(i.type, i.pos));

        // 3. Удаляем ссылку на группу и идентификатор повторов в первом сегменте группы
        this.P.filter(i => i.parentGroupCode === code && i.repeatPos === 0)
            .map(i => this.setParams(i.type, i.pos, {parentGroupCode: null, repeatPos: null}));

        // 4. Выстраиваем последовательность pos
        this.reorganisation(start + length * repeat, length * (1 - repeat));

        // 5. Обновляем интревал pW
        this.PW.calculate(this.P);

        return true;
    }

    /**
     * @description Добавляем новую группу интервалов
     * @param segment - набор интервалов для повторения
     * @param repeat - количество повторений в группе
     * @param start - pos первого интервала
     * @returns {boolean}
     */
    createGroup(segment: Array<ActivityIntervalP>, repeat: number, start: number):boolean {
        // 1. создаем группу
        let group: ActivityIntervalG = <ActivityIntervalG>ActivityIntervalFactory('G', {
            repeatCount: repeat,
            grpLength: segment.length,
            fPos: start
        });

        this.stack.push(group);

        // 2. устанавливаем в имеющийся сегмент указатель на номер группы и порядковый номер
        segment.forEach(i => this.setParams(i.type, i.pos, {parentGroupCode: group.code, repeatPos: 0}));

        // 3. двигаем сегменты на интервал позиций = кол-во повторов * длина сегмента
        let len: number = segment.length;
        this.reorganisation(segment[0].pos + len, len * (repeat - 1));

        // 4. копируем сегмент с указателем номера группы и количества
        segment.forEach(i =>
            times(repeat - 1).map(r => {
                let params = {pos: i.pos + len * (r + 1),parentGroupCode: group.code, repeatPos: r + 1};
                this.stack.push(ActivityIntervalFactory('P', Object.assign({}, i, params)));
            }));

        // 5. Обновляем интревал pW
        this.PW.calculate(this.P);

        return true;
    }

    /**
     * @description Увелечение количества повторений в группе
     * @param segment
     * @param trgRepeat
     * @returns {boolean}
     */
    increaseGroup(segment: Array<ActivityIntervalP>, trgRepeat: number):boolean {
        //1. Номер группы
        let group: ActivityIntervalG = <ActivityIntervalG>this.stack
            .filter(i => i.type === 'G' && i['code'] === segment[0].parentGroupCode)[0];

        let srcRepeat: number = group.repeatCount;
        let len: number = segment.length;

        //2. Меняем количество повторений в группе
        this.setParams(group.type, group.code, {repeatCount: trgRepeat});

        //3. Выстраиваем последовательность pos
        this.reorganisation(segment[0].pos + (srcRepeat * len), (trgRepeat - srcRepeat) * len);

        //4. Добавляем инетрвалы
        segment.forEach(i =>
            times(trgRepeat - srcRepeat).map(r => {
                let params = {pos: i.pos + len * (srcRepeat + r),parentGroupCode: group.code, repeatPos: srcRepeat + r + 1};
                this.stack.push(ActivityIntervalFactory('P', Object.assign({}, i, params)));
            }));

        // 5. Обновляем интревал pW
        this.PW.calculate(this.P);

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
        let group: ActivityIntervalG = <ActivityIntervalG>this.stack
            .filter(i => i.type === 'G' && i['code'] === segment[0].parentGroupCode)[0];

        let srcRepeat: number = group.repeatCount;
        let len: number = segment.length;

        //2. Меняем количество повторений в группе
        this.setParams(group.type, group.code, {repeatCount: trgRepeat});

        //3. Удаляем интервалы
        this.P.filter(i => i.parentGroupCode === group.code && i.repeatPos >= trgRepeat)
            .map(i => this.splice(i.type, i.pos));

        //4. Выстраиваем последовательность pos
        this.reorganisation(segment[0].pos + (srcRepeat * len), (trgRepeat - srcRepeat) * len);

        // 5. Обновляем интревал pW
        this.PW.calculate(this.P);

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
        this.P.filter(i => i.pos >= start).forEach(i => this.setParams(i.type, i.pos, { pos: i.pos + shift}));
    }

    /**
     * @description Сборка массива координат для мини-граифка
     * Формат массива графика = [ '[start, интенсивность с], [finish, интенсивность по]',... ]
     * @returns {any[]}
     */
    chart():Array<Array<number>> {
        let start: number = 0; //начало отсечки на графике
        let finish: number = 0; // конец отсечки на графике
        let maxFtp: number = 0;
        let minFtp: number = 100;
        let data: Array<any> = [];

        this.P.map( interval => {
            start = finish;
            finish = start + interval.movingDurationLength;
            maxFtp = Math.max(interval.intensityByFtpTo, maxFtp); //((interval.intensityByFtpTo > maxFtp) && interval.intensityByFtpTo) || maxFtp;
            minFtp = Math.min(interval.intensityByFtpFrom, minFtp);
            data.push([start, (interval.intensityByFtpFrom + interval.intensityByFtpTo) / 2],
                [finish, (interval.intensityByFtpFrom + interval.intensityByFtpTo) / 2]);
        });

        minFtp = minFtp * 0.90;
        data = data.map(d => [d[0]/finish, (d[1] - minFtp) / (maxFtp - minFtp)]);
        //debugger;

        // Если сегменты есть, то для графика необходимо привести значения к диапазону от 0...1
        return (data.length > 0 && data) || null;
    }
}
