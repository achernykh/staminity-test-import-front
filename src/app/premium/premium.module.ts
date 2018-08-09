import { module } from "angular";
import { supportLng } from "../core/display.constants";
import { PremiumWrapperComponent } from "./premium-wrapper/premium-wrapper.component";
import { PremiumDialogComponent } from "./premium-dialog/premium-dialog.component";
import { premiumTranslate } from "./premium.translate";

export const Premium = module("staminity.premium", [])
    .component('stPremiumWrapper', PremiumWrapperComponent)
    .component('stPremiumDialog', PremiumDialogComponent)
    .config(['$translateProvider', ($translate) =>
        supportLng.map(lng => $translate.translations(lng, {premium: premiumTranslate[lng]}))])
    .name;