import {Orientation} from './Orientation.js';
import * as d3 from 'd3';


/**
 *
 */
class HorizontalOrientation extends Orientation {
    /**
     * @public
     * @returns {Boolean}
     */
    isVertical() {

        return false;
    }


    /**
     * @public
     * @returns {Integer[][]}
     */
    getGradientDirection() {

        return [[0, 0], [1, 0]];
    }


    /**
     * @public
     * @returns {String}
     */
    getXAxisLabel() {

        return this._config.label;
    }

    /**
     * @public
     * @returns {String}
     */
    getYAxisLabel() {

        return this._uChart.getSeries(0).label;
    }


    /**
     * @public
     * @returns {Number}
     */
    getWidth() {

        return this._uChart.getInnerHeight();
    }


    /**
     * @public
     * @returns {Number}
     */
    getHeight() {

        return this._uChart.getInnerWidth();
    }


    /**
     * @public
     * @param {d3.selection} line
     * @param {Number} position
     */
    moveLinePointer(line, position) {

        line
            .attr('x1', 0)
            .attr('y1', position)
            .attr('x2', this._uChart.getInnerWidth())
            .attr('y2', position);
    }


    /**
     * @public
     * @override
     * @param {Number} position
     * @returns {Object}
     */
    getPointerConfig(position) {

        return {
            cy: position,
            cx: function(d) {
                return d.position;
            }
        }
    }


    /**
     * @public
     * @param {Number} position
     * @param {Number[]} offset
     * @param {Element} container
     * @returns {Number}
     */
    adjustTooltipPosition(position, offset, tip) {

        var svg = this._uChart._svg.node();

        var mouseY = d3.mouse(this._uChart._svg.node())[1];
        var height = this._uChart.getOuterHeight();

        var svgBox = svg.getBoundingClientRect();
        var tipBox = tip.getBoundingClientRect();

        position[0] = position[0] - this._uChart.getMargin().left + svgBox.left;

        if (mouseY > height / 2) {
            position[1] += svgBox.top - tipBox.height - offset[1];
        } else {
            position[1] += svgBox.top + offset[1];
        }

        return position;
    }


    /**
     * @public
     * @param {Mixed[]} domain
     * @returns {Mixed[]}
     */
    reverseSeriesDomain(domain) {

        return domain.slice(0).reverse();
    }


    /**
     * @public
     * @param {Number[]} domain
     * @returns {Number[]}
     */
    reversePosition(poistion) {

        return poistion;
    }


    /**
     * @public
     * @override
     * @param {Object} margin
     * @returns {Number}
     */
    getPositionLineOffset(margin) {

        return margin.top;
    }
}


module.exports.HorizontalOrientation = HorizontalOrientation;