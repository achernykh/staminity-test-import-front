import {premiumConfig} from "./premium.constants";

export const getPremiumPageByFunction = (func: string): number => {
    return premiumConfig.pages.findIndex(p => p.functions.indexOf(func) !== -1);
};