import { IPeriodizationScheme } from "../../../../api/seasonPlanning/seasonPlanning.interface";

export const schemeCodeFilter = ['$translate', ($translate) => (scheme: IPeriodizationScheme) => {
    if (!scheme) { return null; }
    return scheme.isSystem ?
        $translate.instant('methodology.periodization.schemes.' + scheme.code + '.code') :
        scheme.code;
}];