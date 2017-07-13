/**
 * @public
 * @class
 */
class Util {
    /**
     * @public
     * @static
     * @param {Mixed} value
     * @returns {Boolean}
     */
    static isNumeric(value) {

        return ! isNaN(parseFloat(value)) && isFinite(value);
    }


    /**
     * @public
     * @static
     * @param {Mixed} value
     * @returns {String}
     */
    static toString(value) {

        if (Util.isEmpty(value)) {
            return '';
        } else {
            return String(value);
        }
    }


    /**
     * @public
     * @static
     * @param {Mixed} value
     * @returns {Boolean}
     */
    static isEmpty(value) {

        return value == null || value.length === 0;
    }


    /**
     * @public
     * @static
     * @param {String} style
     * @returns {String|null}
     */
    static getStrokeDashArray(style) {

        if (style == 'dashed') {
            return '3 3';
        } else if (style == 'dotted') {
            return '1 1';
        } else {
            return null;
        }
    }


    /**
     * @public
     * @static
     * @param {Number} dataSet
     * @param {String} name
     * @returns {Number}
     */
    static calculateTotals(dataSet, name) {

        var result;

        switch (name) {
            case 'min': result = d3.min(dataSet); break;
            case 'max': result = d3.max(dataSet); break;
            case 'sum': result = d3.sum(dataSet); break;
            case 'avg': result = d3.mean(dataSet); break;
            default: throw new Error('Unexpected calculateTotals value "' + name + '"');
        }

        return Util.round(result, 2);
    }


    /**
     * Round number.
     * @public
     * @static
     * @param {Number} number
     * @param {Integer} decimalsNumber
     * @returns {Number}
     */
    static round(number, decimalsNumber = 0) {

        var q = 10 * decimalsNumber;
        return Math.round(number * q) / q;
    }


    /**
     * Generate unique string.
     * @public
     * @static
     * @returns {String}
     */
    static getUniqueId() {

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }


    /**
     * Get translate value.
     * @param {String} transform
     * @returns {Number[]}
     */
    static getTranslate(transform) {

        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttributeNS(null, "transform", transform);

        var matrix = g.transform.baseVal.consolidate().matrix;

        return [matrix.e, matrix.f];
    }


    /**
     * Get measure config.
     * @param {Mixed[]} d
     * @param {Object} measure
     * @param {UChart} uChart
     * @returns {Object}
     */
    static getMeasure(configIndex, measure, uChart) {

        var index = configIndex;
        if (Array.isArray(configIndex)) {
            index = configIndex[configIndex.length - 1];
        }

        return index, uChart._originalConfig[index].measures.find(function(m) {
            return m.id == measure.id;
        });
    }
}

module.exports.Util = Util;