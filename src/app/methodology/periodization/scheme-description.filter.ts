import { IPeriodizationScheme } from "../../../../api/seasonPlanning/seasonPlanning.interface";

export const schemeDescriptionFilter = ['$translate', ($translate) => (scheme: IPeriodizationScheme) => {
    if (!scheme) { return null; }
    return scheme.isSystem ?
        $translate.instant('methodology.periodization.schemes.' + scheme.description + '.description') :
        scheme.description;
}];