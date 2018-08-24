import moment from 'moment/src/moment.js';
import { element } from 'angular';
import { SessionService } from "../../core/session/session.service";

// Настройка отображения показателей под разные виды спорта. По-умолчанию отображаются в соотвествии с указанным
// unit в обьекте _measurement, но для отдельных пар базовый вид спорта / показатель возможено отображение отличной
// единицы изменения
// Например, вида спорта swim c показателем distance в справочнике нет, это означает, что он будет выводиться в
// той единице измерения, которая задана по-умолчанию - meter
export const _activity_measurement_view = {
    default: {
        distance: {
            unit: 'km',
            fixed: 1
        },
        speed: {
            unit: 'minpkm',
            fixed: 0
        },
        adjustedSpeed: {
            unit: 'minpkm',
            fixed: 0
        },
        hour: {
            unit: 'h',
            fixed: 1
        },
    },
    run: {
        distance: {
            unit: 'km',
            fixed: 1
        },
        speed: {
            unit: 'minpkm',
            fixed: 0
        },
        adjustedSpeed: {
            unit: 'minpkm',
            fixed: 0
        }
    },
    ski: {
        distance: {
            unit: 'km',
            fixed: 1
        },
        speed: {
            unit: 'minpkm',
            fixed: 0
        },
        adjustedSpeed: {
            unit: 'minpkm',
            fixed: 0
        }
    },
    swim: {
        speed: {
            unit: 'minp100m',
            fixed: 0
        },
        adjustedSpeed: {
            unit: 'minp100m',
            fixed: 0
        }
    },
    bike: {
        distance: {
            unit: 'km',
            fixed: 1
        },
        speed: {
            unit: 'kmph',
            fixed: 2
        },
        adjustedSpeed: {
            unit: 'kmph',
            fixed: 0
        }
    },
    strength: {

    },
    rowing: {
        speed: {
            unit: 'minp500m',
            fixed: 0
        },
        adjustedSpeed: {
            unit: 'minp500m',
            fixed: 0
        }
    },
    other: {
        speed: {
            unit: 'kmph',
            fixed: 2
        },
        distance: {
            unit: 'km',
            fixed: 1
        },
        adjustedSpeed: {
            unit: 'kmph',
            fixed: 0
        }
    },
    transition: {
        speed: {
            unit: 'minpkm',
            fixed: 0
        },
        distance: {
            unit: 'km',
            fixed: 1
        },
        adjustedSpeed: {
            unit: 'minpkm',
            fixed: 0
        }
    },
    triathlon: {
        distance: {
            unit: 'km',
            fixed: 1
        },
        speed: {
            unit: 'kmph',
            fixed: 0
        },
        adjustedSpeed: {
            unit: 'kmph',
            fixed: 0
        }
    },
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
    elevation: {
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
    strokes: {
        unit: 'spl',
        fixed: 0
    },
    adjustedSpeed: {
        unit: 'mps',
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
    vam: {
        unit: 'mh',
        fixed: 0
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
    speedDecoupling: {
        unit: 'proportion',
        view: 'percent',
        fixed: 2
    },
    powerDecoupling: {
        unit: 'proportion',
        view: 'percent',
        fixed: 2
    },
    fatigue: {
        unit: 'none',
        fixed: 0
    },
    fitness: {
        unit: 'none',
        fixed: 0
    },
    form: {
        unit: 'none',
        fixed: 0
    },
    hour: {
        unit: 's',
        fixed: 0
    },

    // Измерения
    weight: {
        unit: 'kg',
        fixed: 2
    },
    height: {
        unit: 'sm',
        fixed: 0
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
    },
    strength: {
        speed: {
            min: 1
        }
    },
    transition: {
        speed: {
            min: 1
        }
    },
    ski: {
        speed: {
            min: 1
        }
    },
    rowing: {
        speed: {
            min: 1
        }
    },
    other: {
        speed: {
            min: 1
        }
    }
};

export const getSportLimit = (sport, limit) => sportLimit[sport][limit];

export const measurementUnit = (measure) => _measurement[measure].hasOwnProperty('view') && _measurement[measure].view || _measurement[measure].unit;

export const measurementUnitView = (sport, measure) =>
    _activity_measurement_view[sport][measure].hasOwnProperty('view') && _activity_measurement_view[sport][measure].view ||
    _activity_measurement_view[sport][measure].unit;

export const measurementUnitDisplay = (sport, measure) =>
    ((_activity_measurement_view[sport].hasOwnProperty(measure)) && measurementUnitView(sport,measure)) ||
        measurementUnit(measure);

export const measurementFixed = (measure) => _measurement[measure].fixed;

// Перечень показателей релевантных для пересчета скорости в темп (10км/ч = 6:00 мин/км)
export const _measurement_pace_unit = ['minpkm','minp100m','minp500m'];

export const isDuration = (unit) => ['min'].indexOf(unit) !== -1;
export const isPace = (unit) => ['mps','minpkm','minp100m','minp500m'].indexOf(unit) !== -1;
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

    constructor(public name: string, public sport?: string, value?: number | {}){
        this.unit = (_activity_measurement_view[sport].hasOwnProperty(name) && _activity_measurement_view[sport][name]['unit']) || _measurement[name].unit;
        this.fixed = _measurement[name].fixed;
    }

    //isDuration = isDuration;
    //isPace = isPace;
    // Определение типа показателя 1) duration 2) pace 3) number
    get type(): string {
        return (isDuration(this.unit) && 'duration') || (isPace(this.unit) && 'pace') || 'number';
    }

    isPace():boolean {
        return this.type === 'pace';
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
    minp500m: {
        mps: (x) => !!x ? (60 * 60) / (x * 3.6 * 10 / 5) : 0
    },
    mps: {
        kmph: (x) => !!x ? x * 3.60 : 0,
        minpkm: (x) => !!x ? (60 * 60) / (x * 3.6) : 0,
        minp100m: (x) => !!x ? (60 * 60) / (x * 3.6 * 10) : 0,
        minp500m: (x) => !!x ? (60 * 60) / (x * 3.6 * 10 / 5) : 0
    },
    minpkm: {
        mps: (x) => !!x ? (60 * 60) / (x * 3.6) : 0
    },
    s: {
        h: (x) => !!x ? x / (60 * 60) : 0
    },
    h: {
        s: (x) => !!x ? x * 60 * 60 : 0
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
    mile : {
        unit: 'km',
        multiplier: (x) => x * 1.60934
    },
    meter: {
        unit: 'yard',
        multiplier: (x) => x * 1.09361
    },
    yard : {
        unit: 'meter',
        multiplier: (x) => x * 0.9144
    },
    minpkm: {
        unit: 'minpml',
        multiplier: (x) => x * 1.60934
    },
    kmph : {
        unit: 'mph',
        multiplier: (x) => x * 0.621371
    }
};

const _recalculation = _measurement_calculate;



