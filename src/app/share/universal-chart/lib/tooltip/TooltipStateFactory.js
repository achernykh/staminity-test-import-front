import {TooltipCombinedState} from './TooltipCombinedState.js';
import {TooltipSingleState} from './TooltipSingleState.js';
import * as d3 from 'd3';


class TooltipStateFactory {


    static getInstance(tooltip) {

        if (tooltip._uChart._config.get('options.tooltip.combined', false)) {
            return new TooltipCombinedState(tooltip);
        } else {
            return new TooltipSingleState(tooltip);
        }
    }
}


module.exports.TooltipStateFactory = TooltipStateFactory;