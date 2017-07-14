import {StackedView} from './StackedView.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class StackedHorizontalView extends StackedView {
    /**
     * @public
     * @override
     */
    render() {

        super.render();

        this._bars = this.getViewsContainer()
            .append('g')
            .attr('class', 'view bar-view')
            .selectAll('g.group')
            .data(this.getData())
            .enter()
            .append('g')
            .attr('class', 'group')
            .selectAll('rect.bar')
            .data(function(d, i) {
                return d.map(function(x) {
                    x.i = i;
                    return x;
                });
            }).enter()
            .append('rect')
            .attr('class', 'bar');

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

      var yOffset = this._getBarOffset();

      this._bars
          .attr('width', function(d) {
              return xScale(d.y1) - xScale(d.y0);
          }).attr('height', function(d) {
              return this.getBarWidth();
          }.bind(this))
          .attr('x', function(d) {
              return xScale(d.y0);
          }).attr('y', function(d) {
              return yScale(d.x0) + yOffset;
          });
    }
}


module.exports.StackedHorizontalView = StackedHorizontalView;