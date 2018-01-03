import {USvgChart} from './USvgChart.js';
import {Pointer} from '../Pointer.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class U2DChart extends USvgChart {
    /**
     * @public
     * @constructor
     * @param {Object} options
     * @param {Object} originalOptions
     */
    constructor(options, originalOptions) {

        super(options, originalOptions);
        this._pointer = new Pointer(this);
    }


    /**
     * @public
     * @override
     * @param {container} d3.selection
     */
    renderTo(container) {

        super.renderTo(container);

        this._svg.on('mousemove', function() {
                this._mouseMoveEventHandler();
            }.bind(this))
            .on('mouseleave', function() {
                this._mouseLeaveEventHandler();
            }.bind(this));

        this._legend.render();
        this._mManager.set(this._legend);

        return this;
    }


    _isAligned() {

        return this.getConfig().get('options.axes.series.alignByZero', false);
    }


    _getMeasureScale() {

        var scales = this.getMeasureScales();
        var keys = Object.keys(scales);

        return scales[keys[0]];
    }


    /**
     * @public
     * @override
     */
    resize() {

        super.resize();
        this._legend.resize();
    }


    /**
     * @protected
     * @returns {d3.scale}
     */
    getBarChartsAmount() {

        return this.getViews().filter(function(view) {
            return view.getConfig().is('chartType', 'bar');
        }).length;
    }


    getScaleByMeasure(measure) {

        return this.getMeasureScales()[measure];
    }


    _getViewsByMeasureName(measureName) {

        return this.getViews().filter(function(view) {
            return view.getConfig().get('measureName') == measureName;
        })
    }


    /**
     * @public
     * @returns {d3.scale}
     */
    getMeasureScale(view) {

        return this.getMeasureScales()[view.getConfig().get('measureName')];
    }


    /**
     * Get measure axes data.
     * @public
     * @param {Boolean} excludeInvisible
     * @returns {Object[]}
     */
    getMeasureAxesData(excludeInvisible = false) {

        return _(this.getViews())
            .map(v => v.getConfig().getOptions())
            .filter(function(d) {
                if (excludeInvisible) {
                    return d['scaleVisible'] !== false;
                } else {
                    return true;
                }
            }).groupBy(d => d['measureName'])
            .values()
            .map(d => d[0])
            .value();
    }

    /**
     * Get measure domain.
     * Domain is two dimensional array with min and max values.
     * @private
     * @param {String} measureName
     * @returns {Number[]}
     */
    _getMeasureDomain(measureName) {

        return _.uniq(this._getViewsByMeasureName(measureName).reduce(function(domain, view) {
            if ('_getMeasureDomain' in view) {
                return domain.concat(view._getMeasureDomain());
            } else {
                return domain.concat(view.getY());
            }
        }, []));
    }

    _mouseLeaveEventHandler() {

        this._tooltip.hide();
        this._pointer.hide();
    }


    _mouseMoveEventHandler() {

        var position;

        if (this._config.get('options.currentPositionLine.enabled', false) || this._tooltip.isCombined()) {

            var offset = this._orientation.getPositionLineOffset(this._margin);
            var length = this._orientation.getWidth() + offset;

            var x = this._orientation.reversePosition(d3.mouse(this._canvas.node()))[1];
            x = Math.min(length, Math.max(0, x));

            var scale = this.getSeriesScale();

            var domain = this._orientation.reverseSeriesDomain(scale.domain());
            var reversedDomain = this._orientation.reverseSeriesDomain(scale.domain());

            var bandWidth = scale.bandwidth();
            var diff = scale.step() - bandWidth;

            var xValue = domain.filter(function(d, i) {

                var point1 = i === 0 ? 0 : scale(reversedDomain[i]) - diff / 2 + offset;
                var point2 = i === domain.length - 1 ? length + offset : scale(reversedDomain[i]) + scale.step() - diff / 2 + offset;

                return x >= point1 && x <= point2;
            }, this)[0];

            position = scale(xValue) + bandWidth / 2 + offset;
            this._pointer.show(xValue, position);
        }

        /*
         *
         */
        if (this._tooltip.isCombined()) {

            var content = this._tooltip.getContent(xValue);

            if (content === false) {
                this._tooltip.hide();
            } else if (content === null) {

            } else {
                var x = this._orientation.getHeight() / 2;
                var y = position;

                var xy = this._orientation.reversePosition([x, y]);

                this._tooltip
                    .setOffset(this._orientation.reversePosition([0, 5]))
                    .setContent(content)
                    .setXY(xy, true)
                    .show();
            }
        }
    }
}


module.exports.U2DChart = U2DChart;