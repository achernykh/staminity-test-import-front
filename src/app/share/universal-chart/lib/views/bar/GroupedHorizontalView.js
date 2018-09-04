import {GroupedView} from './GroupedView.js';


/**
 * @public
 * @class
 */
class GroupedHorizontalView extends GroupedView {
    /**
     * @public
     * @override
     */
    render() {

        super.render();

        this._groups = this.getViewsContainer()
            .append('g')
            .attr('class', 'view d3-bar-view')
            .selectAll('g.group')
            .data(this.getData())
            .enter()
            .append('g')
            .attr('class', 'group');

        this._bars = this._groups
            .selectAll('rect.d3-bar')
            .data(function(d) {
                return d;
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

      var xScale = this.getMeasureScale();
      var yScale = this.getSeriesScale();
      var gScale = this._getGroupScale();

      var diff = yScale.step() - yScale.bandwidth();

      this._groups
          .attr('transform', function(d, i) {
              return 'translate(0, ' + (yScale(d[0].x0) - diff / 2) + ')';
          });

      this._bars
          .attr('width', function(d) {
              return xScale(d.y);
          }).attr('height', function(d) {
              return gScale.bandwidth();
          }).attr('x', function(d) {
              return gScale(d.x0);
          }).attr('y', function(d) {
              return gScale(d.x1);
          });
    }
}


module.exports.GroupedHorizontalView = GroupedHorizontalView;