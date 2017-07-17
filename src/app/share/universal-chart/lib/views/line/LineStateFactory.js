import {LineView} from '../LineView.js';
import {LineState} from './LineState.js';
import {LineVerticalState} from './LineVerticalState.js';
import {LineHorizontalState} from './LineHorizontalState.js';
import {AreaView} from '../AreaView.js';
import {AreaVerticalState} from '../area/AreaVerticalState.js';
import {AreaHorizontalState} from '../area/AreaHorizontalState.js';
import {DotView} from '../DotView.js';
import * as d3 from 'd3';


class LineStateFactory {
    /**
     * @public
     * @static
     * @param {LineView} view
     * @returns {LineState}
     */
    static getInstance(view) {

        if (view.constructor.name == 'LineView') {
            if (view._orientation.isVertical()) {
                return new LineVerticalState(view);
            } else {
                return new LineHorizontalState(view);
            }
        } else if (view.constructor.name == 'AreaView') {
            if (view._orientation.isVertical()) {
                return new AreaVerticalState(view);
            } else {
                return new AreaHorizontalState(view);
            }
        } else if (view.constructor.name == 'DotView') {
            if (view._orientation.isVertical()) {
                return new LineVerticalState(view);
            } else {
                return new LineHorizontalState(view);
            }
        } else {
            throw new Error('Unexpected view class [' + view.constructor.name + ']');
        }
    }
}


module.exports.LineStateFactory = LineStateFactory;