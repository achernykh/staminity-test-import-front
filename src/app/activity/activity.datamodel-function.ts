import {
    IActivityMeasure, ICalcMeasures, IActivityIntervalP, IActivityInterval, IActivityIntervalPW, IActivityIntervalW,
    IActivityIntervalL, IActivityIntervalG, IDurationMeasure, IIntensityMeasure, IActivityIntervals
} from "../../../api/activity/activity.interface";

const genHash = (length: number):string => Math.random().toString(36).substr(2, length);

/**
 * Фабрика создания интеравала тренировки
 * Парметры для создания:
 * 1) тип интервала
 * 2) парамтеры инетрвала
 */
export function ActivityIntervalFactory (type: string, params?: any) {
    switch (type) {
        case 'G': {
            return new ActivityIntervalG(type, params);
        }
        case 'P': {
            return new ActivityIntervalP(type, params);
        }
        case 'pW': {
            return new ActivityIntervalPW(type, params);
        }
        case 'W': {
            return new ActivityIntervalW(type, params);
        }
    }
}

/**
 * Класс управлением интервалами тренировки
 */
export class ActivityIntervals {

    pack: Array<ActivityIntervalP | ActivityIntervalG | ActivityIntervalPW | ActivityIntervalW>;
    intervalL: Array<IActivityIntervalL> = [];
    intervalU: Array<IActivityIntervalL> = [];

    constructor(intervals: Array<IActivityIntervals> = []){
        this.pack = intervals.map(i => ActivityIntervalFactory(i.type, i));
    }

    get intervalP():Array<ActivityIntervalP> {
        return <Array<ActivityIntervalP>>this.pack.filter(i => i.type === 'P');
    }

    get intervalG():Array<ActivityIntervalG> {
        return <Array<ActivityIntervalG>>this.pack.filter(i => i.type === 'G');
    }

    get intervalPW():Array<ActivityIntervalPW> {
        return <Array<ActivityIntervalPW>>this.pack.filter(i => i.type === 'pW');
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

    splice():void {

    }

    /**
     * @description
     * Копирование инетрвала
     * @param interval
     */
    copy(interval: IActivityIntervals):void {

    }

    /**
     * @description
     * Реорганизация позиций по интервалам
     * Задача: при изменение инетрвала с позицией, необходимо привести все интервалы с позицией в сплошную
     * последовательность целых чисел
     * @param operation
     * @param pos
     */
    reorganisation(operation: 'add' | 'delete', pos: number):void {

    }
}

/**
 * Базовый класс для инетрвала, содержит общее параметры
 */
export class ActivityInterval implements IActivityInterval{

    parentGroup: string;
    startTimestamp: number;
    endTimestamp: number;

    constructor(public type: string, private params?: any) {
        Object.assign(this, params);
    }
}

/**
 * Интервал типа Группа
 */
export class ActivityIntervalG extends ActivityInterval implements IActivityIntervalG{

    code: string;
    repeatCount: number;
    calcMeasures: ICalcMeasures;

    constructor(type: string, params: any){
        super(type, params);
        this.code = `${genHash(6)}-${genHash(4)}-${genHash(4)}-${genHash(4)}-${genHash(12)}`;
    }
}

export class ActivityIntervalP extends ActivityInterval implements IActivityIntervalP{

    durationMeasure: string; //movingDuration/distance, каким показателем задается длительность планового сегмента
    durationValue: number; // длительность интервала в ед.изм. показателя длительности
    keyInterval: boolean; // признак того, что плановый сегмент является ключевым
    intensityMeasure: string; //heartRate/speed/power, показатель, по которому задается интенсивность на данном интервале
    intensityLevelFrom: number; // начальное абсолютное значение интенсивности
    intensityByFtpFrom: number; // начальное относительное значение интенсивности
    intensityLevelTo: number; // конечное абсолютное значение интенсивности
    intensityByFtpTo: number; // конечное относительное значение интенсивности
    intensityDistribution: string; // [A] = любое значение по показателю интенсивности в заданном интервале. [I] = рост значенией показателя. [D] = снижение
    intensityFtpMax: number; // максимальная средняя интенсивность среди фактических данных , относящихся к разметке плановых сегментов. Пригодно к использованию только в рамках интервала с type = [P].
    intensityMaxZone: number; // максимальная зона интенсивности
    movingDurationLength: number; // времени
    distanceLength: number; // по дистанции
    actualDurationValue: number; // Указанная вручную пользователем длительность сегмента
    movingDurationApprox: boolean; // признак, что movingDuration определен приблизительно
    distanceApprox: boolean; // признак, что distance рассчитан приблизительно
    calcMeasures: ICalcMeasures; // рассчитанные фактические показатели
    parentGroup: string; // указатель на группу, в которую входит интервал
    repeatPos: number; // номер повтора внутри группы
    pos: number; //позиция интервала в перечне

    // Дополнительные поля для отрисовки в бэке
    isSelected: boolean; // сегмент выделен
    distance: IDurationMeasure = new DurationMeasure();
    movingDuration: IDurationMeasure = new DurationMeasure();
    heartRate: IIntensityMeasure = new IntensityMeasure();
    power: IIntensityMeasure = new IntensityMeasure();
    speed: IIntensityMeasure = new IntensityMeasure();

    constructor(type: string, params: IActivityInterval) {
        super(type, params);
        this.prepareDuration();
        this.prepareIntensity();
    }

    prepareDuration(){
        ['distance','movingDuration'].forEach(m => Object.assign(this[m], {
            durationValue: (this.durationMeasure === m && this.durationValue) || null
        }));
    }

    prepareIntensity(){
        ['heartRate','speed','power'].forEach(m => Object.assign(this[m], {
            intensityLevelFrom: (this.intensityMeasure === m && this.intensityLevelFrom) || null,
            intensityLevelTo: (this.intensityMeasure === m && this.intensityLevelTo) || null,
            intensityByFtpFrom: (this.intensityMeasure === m && this.intensityByFtpFrom) || null,
            intensityByFtpTo: (this.intensityMeasure === m && this.intensityByFtpTo) || null
        }));
    }

}

export class ActivityIntervalPW extends ActivityIntervalP implements IActivityIntervalPW {

    trainersPrescription: string;
    calcMeasures: ICalcMeasures = new ActivityIntervalCalcMeasure();
    movingDurationApprox: boolean; // временя рассчитано приблизительно
    distanceApprox: boolean; // дистанция рассчитана приблизительно

    constructor(type: string, params: any) {
        super(type, params);
    }
}

export class ActivityIntervalW extends ActivityInterval implements IActivityIntervalW {

    actualDataIsImported: boolean; // признак загрузки фактических данных с устройства
    calcMeasures: ICalcMeasures = new ActivityIntervalCalcMeasure(); // рассчитанные фактические показатели

    constructor(type: string, params: any) {
        super(type, params);
    }
}


/**
 * Генерируем пустую структуру IActivityMeasure
 * @param code
 */
export class ActivityMeasure implements IActivityMeasure{

    value: number =null;
    minValue: number = null;
    maxValue: number = null;
    avgValue: number = null;

    constructor(public code: string) {

    }
}

export class ActivityIntervalCalcMeasure implements ICalcMeasures{

    params: Array<string> = [
        'heartRate', 'heartRateDistancePeaks', 'speed', 'speedDistancePeaks', 'duration', 'movingDuration',
        'distance', 'cadence', 'strideLength', 'swolf', 'calories', 'power', 'powerDistancePeaks', 'adjustedPower',
        'altitude', 'elevationGain', 'elevationLoss', 'grade', 'vam', 'vamPowerKg', 'temperature', 'intensityLevel',
        'variabilityIndex', 'efficiencyFactor', 'decouplingPower', 'decouplingPace', 'trainingLoad', 'completePercent'];

    constructor() {
        Object.assign(this,...this.params.map(p => new ActivityMeasure(p)));
    }
}

class DurationMeasure implements IDurationMeasure{
    durationValue: number = null;
}

class IntensityMeasure implements IIntensityMeasure{
    intensityLevelFrom: number = null;
    intensityLevelTo: number = null;
    intensityByFtpFrom: number = null;
    intensityByFtpTo: number = null;
}