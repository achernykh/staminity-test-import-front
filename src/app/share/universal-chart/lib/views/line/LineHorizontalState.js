/**
 * @private
 * @class
 */
class LineHorizontalState extends LineState {
    /**
     * @public
     * @override
     * @returns {d3.line}
     */
    getLineGenerator() {

        var xScale = this._view.getMeasureScale();
        var yScale = this._view.getSeriesScale();
        var curveName = this._view.getConfig().get('smoothSettings', 'curveLinear');

        if (! (curveName in d3) || Util.isEmpty(curveName)) {
            console.warn('Unexpected "smoothSettings" option value "' + curveName + '". Set "curveLinear" as default');
            curveName = 'curveLinear';
        }

        return d3.line()
            .x(function(d) {
                return xScale(d.y);
            }).y(function(d) {
                return yScale(d.x0);
            }).curve(d3[curveName]);
    }


    /**
     * @public
     * @override
     * @returns {Number[]}
     */
    getTransform() {

        return [0, this._view.getSeriesScale().bandwidth() / 2];
    }


    /**
     * @public
     * @override
     * @returns {Object}
     */
    getMeanLineData() {

        var scale = this._view.getMeasureScale();
        var mean = scale(d3.mean(this._view.getY()));

        return {
            x1: mean,
            y1: 0,
            x2: mean,
            y2: this._view.getHeight()
        }
    }


    /**
     * @public
     * @override
     * @returns {Object}
     */
    getClipPathData() {

        var seriesScale = this._view.getSeriesScale();
        var extra = seriesScale.bandwidth();

        return {
            x: 0,
            y: function(d) {
                return seriesScale(d[1]) - extra / 2;
            },
            width: this._view.getWidth(),
            height: function(d) {
                return seriesScale(d[0]) + extra;
            }
        }
    }


    /**
     * @public
     * @override
     * @returns {d3.scale}
     */
    getXScale() {

        return this._view.getMeasureScale();
    }


    getX(d) {

        return d.y;
    }


    /**
     * @public
     * @override
     * @param {Object} point
     * @returns {d3.scale}
     */
    getYScale() {

        return this._view.getSeriesScale();
    }


    getY(d) {

        return d.x0;
    }
}
