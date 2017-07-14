import {Orientation} from './Orientation.js';
import * as d3 from 'd3';


/**
 *
 */
class VerticalOrientation extends Orientation {
    /**
     * @public
     * @returns {Boolean}
     */
    isVertical() {

        return true;
    }


    /**
     * @public
     * @returns {Integer[][]}
     */
    getGradientDirection() {

        return [[0, 1], [0, 0]];
    }


    /**
     * @public
     * @returns {Number}
     */
    getWidth() {

        return this._uChart.getInnerWidth();
    }


    /**
     * @public
     * @returns {Number}
     */
    getHeight() {

        return this._uChart.getInnerHeight();
    }


    /**
     * @public
     * @param {d3.selection} line
     * @param {Number} position
     */
    moveLinePointer(line, position) {

        line
            .attr('x1', position)
            .attr('y1', 0)
            .attr('x2', position)
            .attr('y2', this._uChart.getInnerHeight());
    }


    /**
     * @public
     * @override
     * @param {Number} position
     * @returns {Object}
     */
    getPointerConfig(position) {

        return {
            cx: position,
            cy: function(d) {
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

        var mouseX = d3.mouse(this._uChart._svg.node())[0];
        var width = this._uChart.getOuterWidth();

        var svgBox = svg.getBoundingClientRect();
        var tipBox = tip.getBoundingClientRect();

        if (mouseX < width / 2) {
            position[0] += svgBox.left + offset[0];
        } else {
            position[0] += svgBox.left - tipBox.width - offset[0];
        }

        position[1] += this._uChart.getMargin().top + svgBox.top - tipBox.height / 2;

        return position;
    }


    /**
     * @public
     * @param {Mixed[]} domain
     * @returns {Mixed[]}
     */
    reverseSeriesDomain(domain) {

        return domain;
    }


    /**
     * @public
     * @param {Number[]} domain
     * @returns {Number[]}
     */
    reversePosition(poistion) {

        return [poistion[1], poistion[0]];
    }


    /**
     * @public
     * @override
     * @param {Object} margin
     * @returns {Number}
     */
    getPositionLineOffset(margin) {

        return margin.left;
    }
}


module.exports.VerticalOrientation = VerticalOrientation;