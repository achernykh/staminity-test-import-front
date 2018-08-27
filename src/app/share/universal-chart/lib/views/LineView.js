import {View2D} from './View2D.js';
import {LineStateFactory} from './line/LineStateFactory.js';
import {View} from '../View.js';


/**
 * @public
 * @class
 */
class LineView extends View2D {
    /**
     * @public
     * @param {Object} object - measure config
     * @param {UChart} uChart
     * @param {Scope} scope
     */
    constructor(config, uChart, scope) {

        super(config, uChart, scope);
        this._state = LineStateFactory.getInstance(this);
    }


    getData() {

        var data = super.getData()
            .filter(d => d.y != null);

        var size = _(data)
            .map(d => d.measureIndex)
            .uniq()
            .size();

        var chartData = [];
        for (var i = 0; i < size; i ++) {
            chartData.push(data);
        }

        return chartData;
    }


    _getMeasureMap() {

        var measureIndexMap = { 0 : 0 };
        super.getData().forEach(function(d, i) {
            if (! (d.measureIndex in measureIndexMap)) {
                measureIndexMap[d.measureIndex] = i;
            }
        });

        return measureIndexMap;
    }


    /**
     * @public
     * @override
     */
    render() {

        super.render();

        this._container = this.getViewsContainer().append('g')
            .attr('class', 'view line-view ' + this._config.measureName + '-line-view');

        var data = this.getData();

        this._extent = this._scope.getExtent();

        this._clipPaths = this.getDefs()
            .selectAll('fake-selector')
            .data(this._extent)
            .enter()
            .append('clipPath')
            .attr('id', function(d, i) {
                return this._id + i;
            }.bind(this))
            .append('rect');

        var measureIndexMap = this._getMeasureMap();

        this._line = this._container
            .selectAll('path.line')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'line')
            .style('fill', 'none')
            .style('stroke', function(d, i) {
                return View.getStrokeColor(this.getScope().getMeasureConfig(this, i));
            }.bind(this))
            .style('stroke-dasharray', function(d, i) {
                return View.getStrokeDashArray(this.getScope().getMeasureConfig(this, i));
            }.bind(this))
            .style('stroke-width', function(d, i) {
                return View.getStrokeWidth(this.getScope().getMeasureConfig(this, i));
            }.bind(this))
            .attr('clip-path', function(d, i) {
                return 'url(#' + this._id + i + ')'
            }.bind(this));

        return this;
    }


    /**
     * @public
     * @override
     */
    resize() {

        if (!this._line) { return; }

        this._line
            .attr('transform', 'translate(' + this._state.getTransform() + ')')
            .attr('d', this._state.getLineGenerator());

        var meanLineData = this._state.getMeanLineData();

        this._meanLine
            .attr('x1', meanLineData.x1)
            .attr('y1', meanLineData.y1)
            .attr('x2', meanLineData.x2)
            .attr('y2', meanLineData.y2);

        var clipPath = this._state.getClipPathData()

        this._clipPaths
            .attr('x', clipPath.x)
            .attr('y', clipPath.y)
            .attr('width', clipPath.width)
            .attr('height', clipPath.height);
    }


    /**
     * Get groups list.
     * @public
     * @returns {String[]}
     */
    getGroups() {

        return [];
    }
}


module.exports.LineView = LineView;