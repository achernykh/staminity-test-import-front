/**
 * @public
 * @class
 */
class XTicks extends Ticks {
    /**
     * @protected
     * @override
     * @returns {Integer}
     */
    _getIndex() {

        return 0;
    }


    /**
     * @protected
     * @override
     * @param {Object} tick1
     * @param {Object} tick2
     * @returns {Boolean}
     */
    _compare(tick1, tick2) {

        return tick1.right > tick2.left;
    }
}
