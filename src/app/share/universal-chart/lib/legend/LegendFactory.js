import {ColumnLegend} from './ColumnLegend.js';
import {RowLegend} from './RowLegend.js';


class LegendFactory {
    /**
     * @public
     * @static
     * @param {Object} config={}
     * @param {UChart} uChart
     * @returns {Legend}
     */
    static getInstance(config = {}, uChart) {

        if (uChart.getConfig().get('options.legend.type', 'column') == 'column') {
            return new ColumnLegend(config, uChart);
        } else {
            return new RowLegend(config, uChart);
        }
    }
}


module.exports.LegendFactory = LegendFactory;