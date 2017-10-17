import {Orientation} from './Orientation.js';
import {VerticalOrientation} from './VerticalOrientation.js';
import {HorizontalOrientation} from './HorizontalOrientation.js';


class OrientationFactory {
    /**
     * @public
     * @static
     * @param {Object} config
     * @param {UChart} uChart
     * @returns {Orientation}
     */
    static getInstance(config, uChart) {

        if (Orientation.isVertical([uChart.getConfig().getOptions()])) {
            return new VerticalOrientation(config, uChart);
        } else {
            return new HorizontalOrientation(config, uChart);
        }
    }
}


module.exports.OrientationFactory = OrientationFactory;