import {TooltipCombinedState} from './TooltipCombinedState.js';
import {TooltipSingleState} from './TooltipSingleState.js';


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