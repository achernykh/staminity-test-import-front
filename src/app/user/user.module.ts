import { module } from "angular";
import { supportLng } from "../core/display.constants";
import { StateProvider } from "@uirouter/angularjs";
import { UserSettingsComponent } from "./settings/user-settings.component";
import { userState } from "./user.states";
import { translateUser } from "./user.translate";
import { UserSettingsMenuComponent } from "./settings-menu/user-settings-menu.component";
import { userAvatarUrl } from "./filters/user-avatar-url.filter";

export const User = module('staminity.user', [])
    .component('stUserSettings', UserSettingsComponent)
    .component('stUserSettingsMenu', UserSettingsMenuComponent)
    .filter('stUserAvatarUrl', userAvatarUrl)
    .config(['$stateProvider', ($stateProvider: StateProvider) => userState.map(s => $stateProvider.state(s))])
    .config(['$translateProvider', ($translate) =>
        supportLng.map(lng => $translate.translations(lng, {user: translateUser[lng]}))])
    .name;