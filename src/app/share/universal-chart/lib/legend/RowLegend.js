/**
 * @public
 * @class
 */
class RowLegend extends Legend {
    /**
     * @private
     * @constructor
     * @param {Object} config
     * @param {UChart} uChart
     */
    constructor(config, uChart) {

        super(config, uChart);

        this._rowsNumber = 1;
    }


    /**
     * @public
     * @returns {Object}
     */
    getMargin() {

        if (this.getConfig().get('vertical-align', 'top') == 'top') {
            return {
                left: 0,
                top: this._rowsNumber * this._size + this._rowsNumber * this._margin,
                right: 0,
                bottom: 0
            };
        } else {
            return {
                left: 0,
                top: 0,
                right: 0,
                bottom: this._rowsNumber * this._size + (this._rowsNumber - 1) * this._margin
            };
        }
    }


    /**
     * @public
     * @override
     */
    resize() {

        var labelMaxLength = this._labels.nodes().reduce(function(maxLength, node) {
            var length = node.getBoundingClientRect().width;
            return maxLength > length ? maxLength : length;
        }, 0);

        var columnLength = labelMaxLength + this._size * 1.5 + this._gap;
        var columnsPerRow = Math.floor(this._uChart.getOuterWidth() / columnLength);
        this._rowsNumber = Math.ceil(this.getData().length / columnsPerRow);

        this._items
            .attr('transform', function(d, i) {
                return 'translate(' + (i % columnsPerRow * columnLength) + ', ' + (Math.floor(i / columnsPerRow) * 20) + ')';
            }.bind(this));

        super.resize();
    }


    /**
     * @private
     * @returns {Number[]}
     */
    _getTranslate() {

        const margin = this._uChart.getMargin();
        var translate = [this._margin, this._margin];

        const verticalAlign = this._config['vertical-align'];
        const horizontalAlign = this._config['horizontal-align'];

        if (verticalAlign == 'bottom') {
            translate[1] = this._uChart.getOuterHeight() - this.getHeight()// + margin.top + this._gap;
        }

        if (horizontalAlign == 'right') {
            translate[0] = this._uChart.getOuterWidth() - this.getWidth() - this._margin;
        }

        return translate;
    }
}
