"use strict";
var angular_1 = require('angular');
var moment_js_1 = require('moment/src/moment.js');
var CalendarItem = (function () {
    function CalendarItem(item) {
        angular_1.merge(this, item); // deep copy
    }
    // Подготовка данных для модели отображения
    CalendarItem.prototype.prepare = function () {
        this._dateStart = new Date(moment_js_1["default"](this.dateStart).format('YYYY-MM-DD'));
        this._dateEnd = new Date(moment_js_1["default"](this.dateEnd).format('YYYY-MM-DD'));
    };
    // Подготовка данных для передачи в API
    CalendarItem.prototype.package = function () {
        this.dateStart = moment_js_1["default"](this._dateStart).format();
        this.dateEnd = moment_js_1["default"](this._dateEnd).format();
        return this;
    };
    // Обновление данных, после сохранения
    CalendarItem.prototype.compile = function (response) {
        console.log('response', response);
        this.revision = response.value.revision;
        this.calendarItemId = response.value.id;
        this.index = Number("" + this.calendarItemId + this.revision);
    };
    return CalendarItem;
}());
exports.CalendarItem = CalendarItem;
