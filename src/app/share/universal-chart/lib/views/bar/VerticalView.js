import {BarView} from '../BarView.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class VerticalView extends BarView {
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
            .attr('class', 'd3-bar');

        this._customize(this._bars);

        return this;
    }


    /**
     * @public
     * @override
     */
    resize() {

        var xScale = this.getSeriesScale();
        var yScale = this.getMeasureScale();

        var height = this._uChart.getInnerHeight();
        var amount = this._uChart.getBarChartsAmount();

        var gScale = d3.scaleBand()
            .domain(d3.range(0, amount))
            .range([0, xScale.step()])
            .paddingOuter(1)
            .paddingInner(0.1)

        var bandWidth;
        if (amount == 1) {
            bandWidth = Math.min(100, xScale.bandwidth());
        } else {
            bandWidth = gScale.bandwidth();
        }

        var barXOffset = (bandWidth - gScale.bandwidth()) / 2;
        var translateXOffset = (xScale.step() - xScale.bandwidth()) / 2;

        this._bars.attr('transform', function(d, i) {
                return 'translate(' + (xScale(d.x0) - translateXOffset) + ', 0)';
            }).attr('width', bandWidth)
            .attr('height', function(d) {
                return height - yScale(d.y);
            }).attr('x', function(d) {
                return gScale(this._sequenceNumber) - barXOffset;
            }.bind(this))
            .attr('y', function(d) {
                return yScale(d.y);
            });

        var meanX = yScale(d3.mean(this.getY()));

        this._meanLine
            .attr('x1', 0)
            .attr('y1', meanX)
            .attr('x2', this.getWidth())
            .attr('y2', meanX)
    }
}


module.exports.VerticalView = VerticalView;