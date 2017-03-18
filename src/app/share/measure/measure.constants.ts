import moment from 'moment/src/moment.js';

// Настройка отображения показателей под разные виды спорта. По-умолчанию отображаются в соотвествии с указанным
// unit в обьекте _measurement, но для отдельных пар базовый вид спорта / показатель возможено отображение отличной
// единицы изменения
// Например, вида спорта swim c показателем distance в справочнике нет, это означает, что он будет выводиться в
// той единице измерения, которая задана по-умолчанию - meter
export const _activity_measurement_view = {
    "activity_code": {
        "measure_code": "unit_code",
    },
    run: {
        distance: {
            unit: 'km',
            fixed: 2
        },
        speed: {
            unit: 'minpkm',
            fixed: 0
        }
    },
    swim: {
        speed: {
            unit: 'minp100m',
            fixed: 0
        }
    },
    bike: {
        distance: {
            unit: 'km',
            fixed: 2
        },
        speed: {
            unit: 'kmph',
            fixed: 2
        }
    },
    strength: {

    },
    other: {

    },
    transition: {

    }
};

// Справочник показателей
export const _measurement = {
    icon: '', // базовый путь для хранения иконок единиц измерения
    "measure_code": "unit_code",
    distance: {
        unit: "meter",
        fixed: 0
    },
    duration: {
        unit: "min",
        fixed: 0
    },
    movingDuration: {
        unit: "min",
        fixed: 0
    },
    elapsedDuration: {
        unit: "min",
        fixed: 0
    },
    timestamp: {
        unit: "number",
        fixed: 0
    },
    sumElapsedDuration: {
        unit: "number",
        fixed: 0
    },
    speed: {
        unit: "mps",
        fixed: 0
    },
    heartRate: {
        unit: "bpm",
        fixed: 0
    },
    power: {
        unit: "watt",
        fixed: 0
    },
    altitude: {
        unit: "meter",
        fixed: 0
    },
    elevationGain: {
        unit: "meter",
        fixed: 0
    },
    elevationLoss: {
        unit: "meter",
        fixed: 0
    },
    cadence: {
        unit: 'rpm',
        fixed: 0
    },
    calories: {
        unit: 'kkal',
        fixed: 0
    },
    adjustedPower: {
        unit: 'watt',
        fixed: 0
    },
    grade: {
        unit: 'proportion',
        view: 'percent',
        fixed: 2
    },
    vamPowerKg: {
        unit: 'vampkg',
        fixed: 2
    },
    intensityLevel: {
        unit: 'proportion',
        view: 'percent',
        fixed: 2
    },
    variabilityIndex: {
        unit: 'none',
        fixed: 2
    },
    efficiencyFactor: {
        unit: 'proportion',
        view: 'percent',
        fixed: 2
    },
    trainingLoad: {
        unit: 'tl',
        fixed: 0
    },
    decouplingPower: {
        unit: 'proportion',
        view: 'percent',
        fixed: 2
    },
    decouplingPace: {
        unit: 'proportion',
        view: 'percent',
        fixed: 2
    }
};

const sportLimit = {
    run: {
        speed: {
            min: 1 // 1 meter/sec
        }
    },
    swim: {
        speed: {
            min: 0.33 // 5min/100m
        }
    }
};

export const getSportLimit = (sport, limit) => sportLimit[sport][limit];

export const measurementUnit = (measure) => _measurement[measure].unit;
export const measurementUnitView = (sport, measure) => _activity_measurement_view[sport][measure].unit;
export const measurementUnitDisplay = (sport, measure) =>
    ((_activity_measurement_view[sport].hasOwnProperty(measure)) && measurementUnitView(sport,measure)) ||
        measurementUnit(measure);

export const measurementFixed = (measure) => _measurement[measure].fixed;

// Перечень показателей релевантных для пересчета скорости в темп (10км/ч = 6:00 мин/км)
export const _measurement_pace_unit = ['minpkm','minp100m'];

export const isDuration = (unit) => ['min'].indexOf(unit) !== -1;
export const isPace = (unit) => ['mps','minpkm','minp100m'].indexOf(unit) !== -1;
export const typeOf = (unit) => (isDuration(unit) && 'duration') || (isPace(unit) && 'pace') || 'number';

export const validators = (sport,measure) => {
    let unit = measurementUnitDisplay(sport,measure);
    if(isDuration(unit) || isPace(unit)) {
        return {
            step: 1
        };
    } else {
        return {
            step: 0.1
        };
    }
};

/**
 * Класс для работы с показателями тренировки
 */
export class Measure {

    unit: string; // единица изменения
    fixed: number; // число знаков после запятой для view показателя, релевантно для типа number
    value: number; // значение показателя

    constructor(public name: string, public sport?: string, value?: number){
        this.unit = (_activity_measurement_view[sport].hasOwnProperty(name) && _activity_measurement_view[sport][name]['unit']) || _measurement[name].unit;
        this.fixed = _measurement[name].fixed;
    }

    isDuration = isDuration;
    isPace = isPace;
    // Определение типа показателя 1) duration 2) pace 3) number
    get type(): string {
        return (this.isDuration(this.unit) && 'duration') || (this.isPace(this.unit) && 'pace') || 'number';
    }

	/**
     * Пересчет единиц измерения
     * @param unit - целевая единица измерения
     * @param value - значение показателя
     * @returns {any|null}
     */
    recalculation(unit: string, value: number):number {
        return _recalculation[this.unit][unit](value) || null;
    }
}

// Справочник пересчета показателей
export const _measurement_calculate = {
    "measure_code": {
        "measure_code": "multiplier"
    },
    proportion: {
        percent: (x) => x * 100
    },
    meter : {
        km: (x) => x * 0.001
    },
    km : {
        meter: (x) => x * 1000
    },
    kmph: {
        mps: (x) => !!x ? x / 3.60 : 0
    },
    minp100m: {
        mps: (x) => !!x ? (60 * 60) / (x * 3.6 * 10) : 0
    },
    mps: {
        kmph: (x) => !!x ? x * 3.60 : 0,
        minpkm: (x) => !!x ? (60 * 60) / (x * 3.6) : 0,
        minp100m: (x) => !!x ? (60 * 60) / (x * 3.6 * 10) : 0
    },
    minpkm: {
        mps: (x) => !!x ? (60 * 60) / (x * 3.6) : 0
    }
};

// Справочник пересчет единиц измерения из метрической системы в имперскую
// Если единца измерения присутсвует в справочнике, то это означает что она релевантна для пересчета в другую систему
// мер
export const _measurement_system_calculate = {
    "unit": {
        "unit": "unit_code",
        multiplier: 1
    },
    km : {
        unit: 'mile',
        multiplier: (x) => x * 0.621371
    },
    meter: {
        unit: 'yard',
        multiplier: (x) => x * 1.09361
    },
    kmph : {
        unit: 'mph',
        multiplier: (x) => x * 0.621371
    }
};

const _recalculation = _measurement_calculate;

export const measureValue = (input: number, sport: string, measure: string, chart:boolean = false, units:string = 'metric') => {
    if (!!input) {
        let unit = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].unit) ||
            (_measurement[measure].hasOwnProperty('view') && _measurement[measure]['view']) || _measurement[measure].unit;
        let fixed = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].fixed) || _measurement[measure].fixed;

        // Необходимо пересчет единиц измерения
        if (unit !== _measurement[measure].unit){
            input = _measurement_calculate[_measurement[measure].unit][unit](input);
        }

        // Необходим пересчет системы мер
        if (units && units !== 'metric'){
            input = input * _measurement_system_calculate[unit].multiplier;
        }

        // Показатель релевантен для пересчета скорости в темп
        if (!chart && (isDuration(unit) || isPace(unit))){
            let format = input >= 60*60 ? 'hh:mm:ss' : 'mm:ss';
            return moment().startOf('day').seconds(input).format(format);
        }
        else {
            return Number(input).toFixed(fixed);
        }
    }
};

export const measureUnit = (measure, sport, units = 'metric') => {
    let unit = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].unit) ||
        (_measurement[measure].hasOwnProperty('view') && _measurement[measure]['view']) || _measurement[measure].unit;
    return (units && units !== 'metric') ? _measurement_system_calculate[unit].unit : unit;
};


