import {PieView} from './PieView.js';
import * as d3 from 'd3';


/**
 * @private
 * @class
 */
class DonutView extends PieView {
    /**
     * @protected
     * @override
     * @returns {d3.arc}
     */
    _getArcGenerator() {

        return super._getArcGenerator()
            .innerRadius(this._getRadius() * 0.6);
    }
}


module.exports.DonutView = DonutView;