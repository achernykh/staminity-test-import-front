import {UChart} from '../../UChart.js';
import {Scope} from '../../Scope.js';
import {BarView} from '../BarView.js';
import {Orientation} from '../../orientations/Orientation.js';
import {StackedVerticalView} from './StackedVerticalView.js';
import {StackedHorizontalView} from './StackedHorizontalView.js';
import {GroupedVerticalView} from './GroupedVerticalView.js';
import {GroupedHorizontalView} from './GroupedHorizontalView.js';
import {VerticalView} from './VerticalView.js';
import {HorizontalView} from './HorizontalView.js';
import * as d3 from 'd3';


class BarViewFactory {
    /**
     * @public
     * @static
     * @param {Object} object - measure config
     * @param {UChart} uChart
     * @param {Scope} scope
     * @returns {BarView}
     */
    static getInstance(config, uChart, scope) {

        var isVertical = Orientation.isVertical([uChart.getConfig().getOptions()]);

        if (config.stacked) {
            if (isVertical) {
                return new StackedVerticalView(config, uChart, scope);
            } else {
                return new StackedHorizontalView(config, uChart, scope);
            }
        } else if (BarView._isGrouped(uChart)) {
            if (isVertical) {
                return new GroupedVerticalView(config, uChart, scope);
            } else {
                return new GroupedHorizontalView(config, uChart, scope);
            }
        } else {
          if (isVertical) {
              return new VerticalView(config, uChart, scope);
          } else {
              return new HorizontalView(config, uChart, scope);
          }
        }
    }
}


module.exports.BarViewFactory = BarViewFactory;