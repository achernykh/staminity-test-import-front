import {Util} from './Util.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class Pointer {
    /**
     * @public
     * @constructor
     * @param {UChart} uChart
     */
    constructor(uChart) {

        this._uChart = uChart;
        this._orinetation = uChart.getOrientation();
        this._config = uChart.getConfig();
        this._line = undefined;
    }


    /**
     * @public
     * @param {String} seriesValue
     * @param {Number} position
     */
    show(seriesValue, position) {

        if (! this._config.get('options.currentPositionLine.enabled')) {
            return;
        }

        this._uChart
            .getOrientation()
            .moveLinePointer(this._getLine(), position);

        var values = [];
        this._uChart._views.forEach(function(view) {
            view.getDataAt(seriesValue).forEach(function(d) {
                if (d.y != null) {
                    values.push({
                        position: view.getMeasureScale()(d.y),
                        config: d
                    })
                }
            }, this);
        }, this);

        this._circles = this._uChart.getCanvas()
            .selectAll('circle.pointer')
            .data(values);

        this._circles.exit()
            .remove();

        this._circles.enter()
            .append('circle')
            .attr('class', 'pointer');

        var config = this._uChart.getOrientation().getPointerConfig(position);
        this._circles.attr('r', 5)
            .attr('cx', config.cx)
            .attr('cy', config.cy)
            .style('fill', function(d) {
                return d.config.color;
            }).style('opacity', 0.8);
    }


    /**
     * @public
     */
    hide() {

        if (this._line) {
            this._line
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 0)
                .attr('y2', 0);

            this._circles
                .remove();
        }
    }


    /**
     * @private
     * @returns {d3.selection}
     */
    _getLine() {

        if (this._line === undefined) {
            const stroke = this._uChart.getConfig().get('options.currentPositionLine.color', 'black');
            const strokeDashArray = Util.getStrokeDashArray(this._uChart.getConfig().get('options.currentPositionLine.style'));

            this._line = this._uChart.getCanvas()
                .append('line')
                .style('stroke', stroke)
                .style('stroke-dasharray', strokeDashArray)
                .style('stroke-width', 1);
        }

        return this._line;
    }
}


module.exports.Pointer = Pointer;