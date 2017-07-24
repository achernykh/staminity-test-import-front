import {LineVerticalState} from './LineVerticalState.js';
import {LineHorizontalState} from './LineHorizontalState.js';
import {AreaVerticalState} from '../area/AreaVerticalState.js';
import {AreaHorizontalState} from '../area/AreaHorizontalState.js';


class LineStateFactory {
    /**
     * @public
     * @static
     * @param {LineView} view
     * @param {String} [type]
     * @returns {LineState}
     */
    static getInstance(view, type) {

        if (view.constructor.name == 'LineView' || type == 'line') {
            if (view._orientation.isVertical()) {
                return new LineVerticalState(view);
            } else {
                return new LineHorizontalState(view);
            }
        } else if (view.constructor.name == 'AreaView' || type == 'area') {
            if (view._orientation.isVertical()) {
                return new AreaVerticalState(view);
            } else {
                return new AreaHorizontalState(view);
            }
        } else if (view.constructor.name == 'DotView' || type == 'dot') {
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