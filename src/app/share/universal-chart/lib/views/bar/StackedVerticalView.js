import {StackedView} from './StackedView.js';


/**
 * @public
 * @class
 */
class StackedVerticalView extends StackedView {
    /**
     * @public
     * @override
     */
    render() {

        super.render();

        var xOffset = this._getBarOffset();

        this._bars = this.getViewsContainer()
            .append('g')
            .attr('class', 'view d3-bar-view')
            .selectAll('g.group')
            .data(this.getData())
            .enter()
            .append('g')
            .attr('class', 'group')
            .selectAll('rect.d3-bar')
            .data(function(d, i) {
                return d.map(function(x) {
                    x.i = i;
                    return x;
                });
            }).enter()
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

        var xOffset = this._getBarOffset();

        this._bars
            .attr('width', function(d) {
                return this.getBarWidth();
            }.bind(this))
            .attr('height', function(d) {
                return yScale(d.y0) - yScale(d.y1);
            }).attr('x', function(d) {
                return xScale(d.x0) + xOffset;
            }).attr('y', function(d) {
                return yScale(d.y1);
            });
    }
}


module.exports.StackedVerticalView = StackedVerticalView;