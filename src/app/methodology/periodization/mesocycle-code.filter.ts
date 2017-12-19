import { IPeriodizationScheme, IMesocycle } from "../../../../api/seasonPlanning/seasonPlanning.interface";

export const mesocycleCodeFilter = ['$translate', ($translate) => (mesocycle: IMesocycle, scheme: IPeriodizationScheme) => {
    if (!scheme) { return null; }
    return scheme.isSystem ?
        $translate.instant('methodology.periodization.schemes.' + scheme.code + '.mesocycles.' + mesocycle.code + '.code') :
        mesocycle.code;
}];