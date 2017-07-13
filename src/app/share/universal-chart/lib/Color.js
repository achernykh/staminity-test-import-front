/**
 * @public
 * @class
 */
class Color {
    /**
     * @public
     * @static
     * @param {Integer} i
     * @param {Integer} size
     * @param {Object} config
     * @param {Scope} scope
     * @returns {d3.color|null}
     */
    static getColor(i, size, config, scope) {

        if (config.fillType == 'none') {
            return 'transparent';
        }

        if (config.colorPalette) {
            return scope.getConfig().get('options.palette')[i];
        }

        var color = config.fillColor;

        if (Util.isEmpty(color)) {
            color = config.markerColor;
        }

        if (! color) {
            return null;
        }

        color = d3.color(color);
        if (size == 1) {
            return color;
        }

        color.opacity = Color.getOpacity(i, size, 1);
        return color;
    }


    /**
     * @public
     * @static
     * @param {Integer} i
     * @param {Integer} size
     * @param {Number} maxOpacity
     * @returns {Number} - number between maximum and minimum opacity value
     */
    static getOpacity(i, size, maxOpacity) {

        var scale = d3.scaleLinear()
            .domain([0, 1])
            .range([maxOpacity, 0]);

        return scale(1 / size * i);
    }
}
