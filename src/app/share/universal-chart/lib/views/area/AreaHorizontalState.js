import {LineHorizontalState} from '../line/LineHorizontalState.js';
import {Util} from '../../Util.js';
import * as d3 from 'd3';


/**
 * @private
 * @class
 */
class AreaHorizontalState extends LineHorizontalState {
    /**
     * @public
     * @override
     * @returns {d3.area}
     */
    getLineGenerator() {

        var xScale = this._view.getSeriesScale();
        var yScale = this._view.getMeasureScale();
        var curveName = this._view.getConfig().get('smoothSettings', 'curveLinear');

        if (! (curveName in d3) || Util.isEmpty(curveName)) {
            console.warn('Unexpected "smoothSettings" option value "' + curveName + '". Set "curveLinear" as default');
            curveName = 'curveLinear';
        }

        var minValue = d3.min(yScale.domain());
        var floor = minValue;

        if (this._view.getConfig().get('reverse', false)) {
            floor = d3.max(yScale.domain());
        }

        return d3.area()
            .y(function(d) {
                return xScale(d.x0);
            }).x0(function(d) {
                return yScale(0 > minValue ? 0 : floor);
            }).x1(function(d) {
                return yScale(d.y);
            }).curve(d3[curveName]);
    }
}


module.exports.AreaHorizontalState = AreaHorizontalState;