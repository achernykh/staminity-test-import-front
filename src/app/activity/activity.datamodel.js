"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var moment_js_1 = require('moment/src/moment.js');
var angular_1 = require('angular');
var calendar_item_datamodel_1 = require("../calendar-item/calendar-item.datamodel");
var activity_constants_1 = require("./activity.constants");
var Interval = (function () {
    function Interval(type) {
        this.type = type;
        this.type = type;
        this.trainersPrescription = null;
        this.durationMeasure = null; //movingDuration/distance, каким показателем задается длительность планового сегмента
        this.durationValue = null; // длительность интервала в ед.изм. показателя длительности
        this.calcMeasures = {
            heartRate: { code: 'heartRate', value: null, minValue: null, avgValue: null, maxValue: null },
            heartRateDistancePeaks: { code: 'heartRateDistancePeaks', value: null, minValue: null, avgValue: null, maxValue: null },
            speed: { code: 'speed', value: null, minValue: null, avgValue: null, maxValue: null },
            speedDistancePeaks: { code: 'speedDistancePeaks', value: null, minValue: null, avgValue: null, maxValue: null },
            duration: { code: 'duration', value: null, minValue: null, avgValue: null, maxValue: null },
            movingDuration: { code: 'movingDuration', value: null, minValue: null, avgValue: null, maxValue: null },
            distance: { code: 'distance', value: null, minValue: null, avgValue: null, maxValue: null },
            cadence: { code: 'cadence', value: null, minValue: null, avgValue: null, maxValue: null },
            strideLength: { code: 'strideLength', value: null, minValue: null, avgValue: null, maxValue: null },
            swolf: { code: 'swolf', value: null, minValue: null, avgValue: null, maxValue: null },
            calories: { code: 'calories', value: null, minValue: null, avgValue: null, maxValue: null },
            power: { code: 'power', value: null, minValue: null, avgValue: null, maxValue: null },
            powerDistancePeaks: { code: 'powerDistancePeaks', value: null, minValue: null, avgValue: null, maxValue: null },
            adjustedPower: { code: 'adjustedPower', value: null, minValue: null, avgValue: null, maxValue: null },
            altitude: { code: 'altitude', value: null, minValue: null, avgValue: null, maxValue: null },
            elevationGain: { code: 'elevationGain', value: null, minValue: null, avgValue: null, maxValue: null },
            elevationLoss: { code: 'elevationLoss', value: null, minValue: null, avgValue: null, maxValue: null },
            grade: { code: 'grade', value: null, minValue: null, avgValue: null, maxValue: null },
            vam: { code: 'vam', value: null, minValue: null, avgValue: null, maxValue: null },
            vamPowerKg: { code: 'vamPowerKg', value: null, minValue: null, avgValue: null, maxValue: null },
            temperature: { code: 'temperature', value: null, minValue: null, avgValue: null, maxValue: null },
            intensityLevel: { code: 'intensityLevel', value: null, minValue: null, avgValue: null, maxValue: null },
            variabilityIndex: { code: 'variabilityIndex', value: null, minValue: null, avgValue: null, maxValue: null },
            efficiencyFactor: { code: 'efficiencyFactor', value: null, minValue: null, avgValue: null, maxValue: null },
            decouplingPower: { code: 'decouplingPower', value: null, minValue: null, avgValue: null, maxValue: null },
            decouplingPace: { code: 'decouplingPace', value: null, minValue: null, avgValue: null, maxValue: null },
            trainingLoad: { code: 'trainingLoad', value: null, minValue: null, avgValue: null, maxValue: null },
            completePercent: { code: 'completePercent', value: null, minValue: null, avgValue: null, maxValue: null }
        };
    }
    return Interval;
}());
var ActivityHeader = (function () {
    function ActivityHeader(date) {
        if (date === void 0) { date = new Date(); }
        this.intervals = [];
        this.startTimestamp = date;
        this.activityCategory = {
            id: null,
            code: null
        };
        this.activityType = {
            id: null,
            code: null,
            typeBasic: null
        };
        this.intervals.push(new Interval('pW'), new Interval('W'));
    }
    return ActivityHeader;
}());
/**
 *
 */
var Activity = (function (_super) {
    __extends(Activity, _super);
    function Activity(item, details) {
        if (details === void 0) { details = null; }
        _super.call(this, item); // в родителе есть часть полей, которые будут использованы в форме, например даты
        this.details = details;
        this.isRouteExist = false;
        this.hasDetails = false;
        this.hasImportedData = false;
        // Если activityHeader не установлен, значит вызван режим создаения записи
        // необходимо создать пустые интервалы и обьявить обьекты
        if (!item.hasOwnProperty('activityHeader')) {
            this.header = new ActivityHeader(); //создаем пустую запись с интервалом pW, W
        }
        else {
            this.header = angular_1.copy(item.activityHeader); // angular deep copy
            // Если итервала pW нет, то создаем его
            // Интервал pW необходим для вывода Задания и сравнения план/факт выполнения по неструктуриорванному заданию
            if (!this.header.intervals.some(function (i) { return i.type === 'pW'; })) {
                this.header.intervals.push(new Interval('pW'));
            }
            // Если интервала W нет, то создаем его
            if (!this.header.intervals.some(function (i) { return i.type === 'W'; })) {
                this.header.intervals.push(new Interval('W'));
            }
        }
        // Ссылки на интервалы для быстрого доступа
        this.intervalPW = this.header.intervals.filter(function (i) { return i.type === "pW"; })[0];
        this.intervalW = this.header.intervals.filter(function (i) { return i.type === "W"; })[0];
        this.intervalL = this.header.intervals.filter(function (i) { return i.type === "L"; });
        this.intervalP = this.header.intervals.filter(function (i) { return i.type === "P"; });
        this.hasImportedData = this.intervalL.hasOwnProperty('length') && this.intervalL.length > 0;
        // Обработка детальных данных по тренировке
        this.hasDetails = !!details && details.metrics.length > 0;
        if (this.hasDetails) {
            this.route = this.getRouteData(details);
            this.isRouteExist = !!this.route;
        }
        // Запоминаем, чтобы парсить только один раз
        this.startMoment = moment_js_1["default"](this.dateStart, 'YYYY-MM-DD');
    }
    // Подготовка данных для модели отображения
    Activity.prototype.prepare = function () {
        _super.prototype.prepare.call(this);
        // Дополниельные данные для отображения плана на панелях
        Object.assign(this.intervalPW, {
            movingDuration: {
                order: 110,
                sourceMeasure: 'movingDuration',
                value: (this.intervalPW.durationMeasure === 'movingDuration' && this.intervalPW.durationValue) || null
            },
            distance: {
                order: 120,
                sourceMeasure: 'distance',
                value: (this.intervalPW.durationMeasure === 'distance' && this.intervalPW.durationValue) || null },
            heartRate: {
                order: 210,
                sourceMeasure: 'heartRate',
                from: (this.intervalPW.intensityMeasure === 'heartRate' && this.intervalPW.intensityLevelFrom) || null,
                to: (this.intervalPW.intensityMeasure === 'heartRate' && this.intervalPW.intensityLevelTo) || null
            },
            speed: {
                order: 220,
                sourceMeasure: 'speed',
                from: (this.intervalPW.intensityMeasure === 'speed' && this.intervalPW.intensityLevelFrom) || null,
                to: (this.intervalPW.intensityMeasure === 'speed' && this.intervalPW.intensityLevelTo) || null
            },
            power: {
                order: 230,
                sourceMeasure: 'power',
                from: (this.intervalPW.intensityMeasure === 'power' && this.intervalPW.intensityLevelFrom) || null,
                to: (this.intervalPW.intensityMeasure === 'power' && this.intervalPW.intensityLevelTo) || null
            }
        });
    };
    // Подготовка данных для передачи в API
    Activity.prototype.build = function () {
        _super.prototype.package.call(this);
        this.dateEnd = this.dateStart;
        this.header.activityType = activity_constants_1.getActivityType(Number(this.header.activityType.id));
        // заглушка для тестирования собственных категорий
        if (this.header.activityCategory) {
            this.header.activityCategory = activity_constants_1.getCategory(Number(this.header.activityCategory.id));
        }
        // заглушка для тестирования собственных категорий
        if (this.header.activityCategory) {
            this.header.activityCategory.id = null;
        }
        this.header.intervals = [];
        (_a = this.header.intervals).push.apply(_a, this.intervalP.concat([this.intervalPW], this.intervalL, [this.intervalW]));
        return {
            index: this.index,
            calendarItemId: this.calendarItemId,
            calendarItemType: this.calendarItemType,
            revision: this.revision,
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
            userProfileOwner: this.userProfileOwner,
            //userProfileCreator: IUserProfileShort,
            activityHeader: this.header
        };
        var _a;
    };
    /**
     * Получаем данные для построения маршрута тренировки
     * @param details
     * @returns {any}
     */
    Activity.prototype.getRouteData = function (details) {
        if (!details.measures.hasOwnProperty('longitude') || !details.measures.hasOwnProperty('latitude')) {
            return null;
        }
        var lng = details.measures['longitude'].idx; // lng index in array
        var lat = details.measures['latitude'].idx; // lat index in array
        return details.metrics
            .filter(function (m) { return m[lng] !== 0 || m[lat] !== 0; })
            .map(function (m) { return ({ lng: m[lng], lat: m[lat] }); });
    };
    Object.defineProperty(Activity.prototype, "sport", {
        /**
         * Вид спорта
         * @returns {String}
         */
        get: function () {
            return this.header.activityType.code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "sportBasic", {
        /**
         * Базовый вид спорта
         * @returns {String}
         */
        get: function () {
            return this.header.activityType.typeBasic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "completed", {
        /**
         * Выполнена ли тренировка?
         * Проверяем наличие интервала с типов W, а также наличие значений в показателях
         * @returns {boolean}
         */
        get: function () {
            var _this = this;
            return (!!this.intervalW &&
                Object.keys(this.intervalW.calcMeasures).filter(function (m) {
                    return _this.intervalW.calcMeasures[m]['value'] || _this.intervalW.calcMeasures[m]['minValue'] ||
                        _this.intervalW.calcMeasures[m]['maxValue'] || _this.intervalW.calcMeasures[m]['avgValue'];
                }).length > 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "structured", {
        get: function () {
            return !!this.intervalP && this.intervalP.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "isToday", {
        get: function () {
            return this.startMoment.toDate().toDateString() === Date.now().toDateString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "coming", {
        get: function () {
            return this.startMoment.isAfter(Date.now(), 'day');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "dismiss", {
        get: function () {
            return this.status === 'dismiss';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "specified", {
        /**
         * Тренировка имеет план?
         * Проверяем наличие интервала с типом pW, а также наличие значения в показателях
         * @returns {boolean}
         */
        get: function () {
            return (!!this.intervalPW && (this.intervalPW.durationValue > 0 || this.intervalPW.intensityLevelFrom > 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "bottomPanel", {
        get: function () {
            return ((this.coming && this.intervalPW.trainersPrescription) && 'prescription') ||
                (this.completed && 'data') || null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Опредлеям нужно ли выводить дополнительную панель с информацией
     * @returns {boolean}
     */
    Activity.prototype.hasBottomData = function () {
        return !!this.bottomPanel &&
            ((this.bottomPanel === 'data' && this.summaryAvg.length > 0) ||
                (this.bottomPanel === 'prescription' && this.intervalPW.trainersPrescription.length > 0));
    };
    Object.defineProperty(Activity.prototype, "percent", {
        get: function () {
            return (this.intervalW.calcMeasures.hasOwnProperty('completePercent')
                && this.intervalW.calcMeasures.completePercent.value) || null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Получение пиков по тренировке
     * @returns {any[]}
     */
    Activity.prototype.getPeaks = function () {
        var _this = this;
        var search = ['heartRateTimePeaks', 'speedTimePeaks', 'speedDistancePeaks', 'powerTimePeaks', 'powerDistancePeaks'];
        var measure = {
            'heartRateTimePeaks': 'heartRate',
            'speedTimePeaks': 'speed',
            'speedDistancePeaks': 'speed',
            'powerTimePeaks': 'power',
            'powerDistancePeaks': 'power'
        };
        return search.filter(function (m) { return _this.intervalW.calcMeasures.hasOwnProperty(m) &&
            _this.intervalW.calcMeasures[m].hasOwnProperty('peaks') &&
            _this.intervalW.calcMeasures[m].peaks[0].value !== 0; })
            .map(function (m) { return ({
            measure: measure[m],
            type: (m.includes('Time') && 'movingDuration') || 'distance',
            value: _this.intervalW.calcMeasures[m].peaks
        }); });
    };
    Activity.prototype.printPercent = function () {
        return ((this.percent && this.completed) && this.percent.toFixed(0) + "%");
    };
    Object.defineProperty(Activity.prototype, "status", {
        /**
         * Перечень статусов тренировки
         * 1) Запланирована, в будущем
         * 2) Запланирована, пропущена
         * 3) Запланирована, выполнена
         * 4) Запланирована, выполнена с допущением
         * 5) Запланирована, выполнена с нарушением
         * 6) Не запланирована, выполнена
         * @returns {string}
         */
        get: function () {
            return !this.isToday ?
                // приоритет статусов, если запись не сегодня
                (this.coming && 'coming')
                    || (!this.specified && 'not-specified')
                    || (!this.completed && 'dismiss')
                    || ((Math.abs(100 - this.percent) <= 25 && this.percent > 0) && 'complete')
                    || (Math.abs(100 - this.percent) <= 50 && 'complete-warn')
                    || (Math.abs(100 - this.percent) > 50 && 'complete-error') :
                //приоритет статусов, если запись сегодня
                ((Math.abs(100 - this.percent) <= 25 && this.percent > 0) && 'complete')
                    || (Math.abs(100 - this.percent) <= 50 && 'complete-warn')
                    || (Math.abs(100 - this.percent) > 50 && 'complete-error')
                    || (!this.specified && 'not-specified')
                    || (this.coming && 'coming');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "sportUrl", {
        get: function () {
            return "assets/icon/" + this.sport + ".svg";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "durationValue", {
        get: function () {
            return (!!this.durationMeasure && this[this.durationMeasure]) || null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "durationMeasure", {
        get: function () {
            return this.intervalPW.durationMeasure
                || (!!this.intervalW.calcMeasures.movingDuration.maxValue && 'movingDuration')
                || (!!this.intervalW.calcMeasures.distance.maxValue && 'distance') || null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "intensityValue", {
        get: function () {
            return ((this.status === 'coming' || this.status === 'dismiss') && {
                from: this.intervalPW.intensityLevelFrom,
                to: this.intervalPW.intensityLevelTo }) || this.intervalW.calcMeasures[this.intensityMeasure].avgValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "intensityMeasure", {
        get: function () {
            return this.intervalPW.intensityMeasure || this.defaultIntensityMeasure;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "defaultIntensityMeasure", {
        get: function () {
            return (!!this.intervalW.calcMeasures.speed.avgValue && 'speed')
                || (!!this.intervalW.calcMeasures.heartRate.avgValue && 'heartRate')
                || (!!this.intervalW.calcMeasures.power.avgValue && 'power') || null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "movingDuration", {
        get: function () {
            return (((this.coming || this.dismiss) && this.intervalPW.durationMeasure === 'movingDuration')
                && this.intervalPW.durationValue) || this.intervalW.calcMeasures.movingDuration.maxValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "distance", {
        get: function () {
            return (((this.coming || this.dismiss) && this.intervalPW.durationMeasure === 'distance')
                && this.intervalPW.durationValue) || this.intervalW.calcMeasures.distance.maxValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "summaryAvg", {
        // Формируем перечень показателей для панели data (bottomPanel)
        get: function () {
            var measures = ['speed', 'heartRate', 'power'];
            var calc = this.intervalW.calcMeasures;
            return measures
                .map(function (measure) {
                if (calc.hasOwnProperty(measure)) {
                    return ((calc[measure].hasOwnProperty('avgValue')) &&
                        { measure: measure, value: Number(calc[measure].avgValue) }) || (_a = {}, _a[measure] = null, _a.value = null, _a);
                }
                var _a;
            })
                .filter(function (measure) { return !!measure && !!measure.value; });
        },
        enumerable: true,
        configurable: true
    });
    Activity.prototype.formSegmentList = function () {
    };
    /**
     * @description Сборка массива координат для мини-граифка
     * Формат массива графика = [ '[start, интенсивность с], [finish, интенсивность по]',... ]
     * @returns {any[]}
     */
    Activity.prototype.formChart = function () {
        var start = 0; //начало отсечки на графике
        var finish = 0; // конец отсечки на графике
        var maxFtp;
        var data = [];
        this.intervalP.map(function (interval) {
            start = finish;
            finish = start + interval.movingDurationLength;
            maxFtp = ((interval.intensityByFtpTo > maxFtp) && interval.intensityByFtpTo) || maxFtp;
            data.push([start, interval.intensityByFtpFrom], [finish, interval.intensityByFtpTo]);
        });
        // Если сегменты есть, то для графика необходимо привести значения к диапазону от 0...1
        return (data.length > 0 && data.map(function (d) { d[0] = d[0] / finish; d[1] = d[1] / 100; return d; })) || null;
    };
    return Activity;
}(calendar_item_datamodel_1.CalendarItem));
exports.Activity = Activity;
exports["default"] = Activity;
