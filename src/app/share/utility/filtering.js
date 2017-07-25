"use strict";
exports.filterToPredicate = function (filter) { return function (params) { return function (x) { return Object.keys(filter).every(function (key) { return filter[key](params)(x); }); }; }; };
