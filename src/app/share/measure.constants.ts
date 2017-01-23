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
    speed: {
        unit: "mps",
        fixed: 0
    },
    heartRate: {
        unit: "bpm",
        fixed: 0
    }
};

// Перечень показателей релевантных для пересчета скорости в темп (10км/ч = 6:00 мин/км)
export const _measurement_pace_unit = ['minpkm','minp100m'];

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


