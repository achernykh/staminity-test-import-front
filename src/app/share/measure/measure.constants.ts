import moment from 'moment/src/moment.js';

// Справочник видов спорта
export const _activity_type = {
    icon: '/assets/icon/',
    "activity_code": {
        id: 12,
        url: '/track_cycling.svg',
        base: 'bike'
    }
};

// Справочник видов спорта, которые доступны для создания новой тренировки
export const _activity_create = ["activity_code"];

// Справочник показателей доступных для планирования. Ведется по базовому виду спорта
export const _activity_plan = {
    "activity_code": {
        duration: [
            "measure_code",
            "measure_code_2"
        ],
        intensity: [
            "measure_code",
            "measure_code_2"
        ]
    }
};

// Справочник показателей доступных для отображения на графике фактических значений
export const _activity_actual_chart = {
    "activity_code": {
        duration: [
            "measure_code",
            "measure_code_2"
        ],
        intensity: [
            "measure_code",
            "measure_code_2"
        ]
    }
};

// Справочник показателей для отображения в таблице мин/сред/макс
export const _activity_minmax_panel = {
    "activity_code": ["measure_code"]
};

// Настройка отображения показателей под разные виды спорта. По-умолчанию отображаются в соотвествии с указанным
// unit в обьекте _measurement, но для отдельных пар базовый вид спорта / показатель возможено отображение отличной
// единицы изменения
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
        }
    },
    strength: {

    },
    other: {

    }
    // например, вида спорта swim c показателем distance в справочнике нет, это означает, что он будет выводиться в
    // той единице измерения, которая задана по-умолчанию - meter
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
    sumElapsedDuration: {
        unit: "min",
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
    }
};

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
        this.unit = _measurement[name].unit;
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
    meter : {
        km: (x) => x * 0.001
    },
    km : {
        meter: (x) => x * 1000
    },
    mps: {
        kmph: (x) => x * 3.6,
        minpkm: (x) => (60 * 60) / (x * 3.6),
        minp100m: (x) => (60 * 60) / (x * 3.6 * 10)
    },
    minpkm: {
        mps: (x) => (60 * 60) / (x * 3.6)
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


