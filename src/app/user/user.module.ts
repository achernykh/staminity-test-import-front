import satellizer from "satellizer"; 
import { module } from "angular";
import { supportLng } from "../core/display.constants";
import { StateProvider } from "angular-ui-router";
import { UserSettingsComponent } from "./settings/user-settings.component";
import { userState } from "./user.states";
import { translateUser } from "./user.translate";
import { UserSettingsMenuComponent } from "./settings-menu/user-settings-menu.component";
import { userAvatarUrl } from "./filters/user-avatar-url.filter";

export const User = module('staminity.user', [satellizer])
    .service("SyncAdaptorService", SyncAdaptorService)
    .service("UserSettingsService", UserSettingsService)
    .component('stUserSettings', UserSettingsComponent)
    .component('stUserSettingsMenu', UserSettingsMenuComponent)
    .component('stUserSettingsHeader', UserSettingsHeaderComponent)
    .component('stUserSettingsTariffs', UserSettingsTariffsComponent)
    .component('stUserSettingsBills', UserSettingsBillsComponent)
    .component('stUserSettingsDisplay', UserSettingsDisplayComponent)
    .component('stUserSettingsSync', UserSettingsSyncComponent)
    .component('stUserSettingsCalendars', UserSettingsCalendarsComponent)
    .component('stUserSettingsMain', UserSettingsMainComponent)
    .component('stUserSettingsProfile', UserSettingsProfileComponent)
    .component('stUserSettingsCoach', UserSettingsCoachComponent)
    .component('stUserSettingsPrivacy', UserSettingsPrivacyComponent)
    .component('stUserSettingsFit', UserSettingsFitComponent)
    .component('stUserSettingsZones', UserSettingsZonesComponent)
    .component('stUserSettingsEditZone', UserSettingsEditZoneComponent)
    .component('stUserSettingsNotifications', UserSettingsNotificationsComponent)
    .filter('userSettingsProfileFilter', userSettingsProfileFilter)
    .config(['$stateProvider', ($stateProvider: StateProvider) => {
        userState.map(s => $stateProvider.state(s));
    }])
    .config(['$translateProvider', ($translate) => {
        supportLng.map(lng => $translate.translations(lng, {user: translateUser[lng]}));
    }])
    .config(userSettingsConfig)
    .filter('stUserAvatarUrl', userAvatarUrl)
    .name;