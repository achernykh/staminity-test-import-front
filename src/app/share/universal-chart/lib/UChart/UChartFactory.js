import {UChart} from '../UChart.js';
import {UHtmlChart} from './UHtmlChart.js';
import {U1DChart} from './U1DChart.js';
import {Orientation} from '../orientations/Orientation.js';
import {U2DVerticalChart} from './U2DVerticalChart.js';
import {U2DHorizontalChart} from './U2DHorizontalChart.js';


class UChartFactory {
    /**
     * @public
     * @static
     * @param {Object} options
     * @returns {UChart}
     */
    static getInstance(options) {

        if (options == undefined) {
            return new UChart([]);
        } else if (! Array.isArray(options)) {
            options = [options];
        }

        if (options[0].measures[0].chartType == 'table') {
            return new UHtmlChart(options);
        } else if (['pie', 'donut'].indexOf(options[0].measures[0].chartType) >= 0) {
            return new U1DChart(options);
        } else if (Orientation.isVertical(options)) {
            return new U2DVerticalChart(options);
        } else {
            return new U2DHorizontalChart(options);
        }
    }
}


module.exports.UChartFactory = UChartFactory;