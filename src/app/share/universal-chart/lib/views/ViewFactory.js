import {BarViewFactory} from './bar/BarViewFactory.js';
import {LineView} from './LineView.js';
import {AreaView} from './AreaView.js';
import {DotView} from './DotView.js';
import {PieView} from './PieView.js';
import {DonutView} from './DonutView.js';
import {TableView} from './TableView.js';


class ViewFactory {
    /**
     * @public
     * @static
     * @param {Object} object - measure config
     * @param {UChart} uChart
     * @param {Scope} scope
     * @returns {View}
     */
    static getInstance(config, uChart, scope) {

        switch (config.chartType) {
            case 'bar': return BarViewFactory.getInstance(config, uChart, scope);
            case 'line': return new LineView(config, uChart, scope);
            case 'area': return new AreaView(config, uChart, scope);
            case 'dot': return new DotView(config, uChart, scope);
            case 'pie': return new PieView(config, uChart, scope);
            case 'donut': return new DonutView(config, uChart, scope);
            case 'table': return new TableView(config, uChart, scope);
            default: throw new Error('Unexpected chart type [' + config.chartType + ']');
        }
    }
}


module.exports.ViewFactory = ViewFactory;