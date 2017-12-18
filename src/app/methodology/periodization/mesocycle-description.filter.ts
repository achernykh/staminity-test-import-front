import { IPeriodizationScheme, IMesocycle } from "../../../../api/seasonPlanning/seasonPlanning.interface";

export const mesocycleDescriptionFilter = ['$translate', ($translate) => (mesocycle: IMesocycle, scheme: IPeriodizationScheme) => {
    if (!scheme) { return null; }
    return scheme.isSystem ?
        $translate.instant('methodology.periodization.schemes.' + scheme.description + '.mesocycles.' + mesocycle.code + '.description') :
        mesocycle.description;
}];