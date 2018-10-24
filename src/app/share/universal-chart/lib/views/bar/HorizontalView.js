import {BarView} from '../BarView.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class HorizontalView extends BarView {
    /**
     * @public
     * @override
     */
    render() {

        super.render();

        this._container = this.getViewsContainer().append('g')
            .attr('class', 'view d3-bar-view');

        this._bars = this._container.selectAll('rect.d3-bar')
            .data(this.getData())
            .enter()
            .append('rect')
            .attr('class', 'd3-bar')
            .style('fill', function(d) {
                return this._getColor(d);
            }.bind(this));

        this._customize(this._bars);

        return this;
    }


    /**
     * @public
     * @override
     */
    resize() {

        var xScale = this.getMeasureScale();
        var yScale = this.getSeriesScale();

        var amount = this._uChart.getBarChartsAmount();

        var gScale = d3.scaleBand()
            .domain(d3.range(0, amount))
            .range([yScale.step(), 0])
            .paddingOuter(1)
            .paddingInner(0.1);

        var bandWidth;
        if (amount == 1) {
            bandWidth = Math.min(100, yScale.bandwidth());
        } else {
            bandWidth = gScale.bandwidth();
        }

        var barXOffset = (bandWidth - gScale.bandwidth()) / 2;
        var translateXOffset = (yScale.step() - yScale.bandwidth()) / 2;

        this._bars
            .attr('transform', function(d, i) {
                return 'translate(0, ' + (yScale(d.x0) - translateXOffset) + ')';
            }).attr('width', function(d) {
                return xScale(d.y);
            }).attr('height', function(d) {
                return bandWidth;
            }).attr('x', 0)
            .attr('y', function(d) {
                return gScale(this._sequenceNumber) - barXOffset;
            }.bind(this));

        var meanX = xScale(d3.mean(this.getY()));

        this._meanLine
            .attr('x1', meanX)
            .attr('y1', 0)
            .attr('x2', meanX)
            .attr('y2', this.getHeight())
    }
}


module.exports.HorizontalView = HorizontalView;