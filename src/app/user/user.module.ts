import satellizer from "satellizer"; 
import { module } from "angular";
import { supportLng } from "../core/display.constants";
import { StateProvider } from "@uirouter/angularjs";
import { UserSettingsComponent } from "./settings/user-settings.component";
import { userState } from "./user.states";
import { translateUser } from "./user.translate";
import { userAvatarUrl } from "./filters/user-avatar-url.filter";
import { agentEnvironmentSalesTotal } from "./filters/agent-environment-sales-total.filter";
import { UserSettingsMenuComponent } from "./settings/user-settings-menu/user-settings-menu.component"; 
import { UserSettingsHeaderComponent } from "./settings/user-settings-header/user-settings-header.component"; 
import { UserSettingsIsCoachComponent } from "./settings/user-settings-is-coach/user-settings-is-coach.component"; 
import { UserSettingsIsAgentComponent } from "./settings/user-settings-is-agent/user-settings-is-agent.component"; 
import { UserSettingsTariffsComponent } from "./settings/user-settings-tariffs/user-settings-tariffs.component"; 
import { UserSettingsBillsComponent } from "./settings/user-settings-bills/user-settings-bills.component"; 
import { UserSettingsDisplayComponent } from "./settings/user-settings-display/user-settings-display.component"; 
import { UserSettingsSyncComponent } from "./settings/user-settings-sync/user-settings-sync.component"; 
import { UserSettingsCalendarsComponent } from "./settings/user-settings-calendars/user-settings-calendars.component"; 
import { UserSettingsMainComponent} from "./settings/user-settings-main/user-settings-main.component"; 
import { UserSettingsProfileComponent } from "./settings/user-settings-profile/user-settings-profile.component"; 
import { UserSettingsCoachComponent } from "./settings/user-settings-coach/user-settings-coach.component"; 
import { UserSettingsAgentComponent } from "./settings/user-settings-agent/user-settings-agent.component"; 
import { UserSettingsCardsComponent } from "./settings/user-settings-cards/user-settings-cards.component"; 
import { UserSettingsSalesComponent } from "./settings/user-settings-sales/user-settings-sales.component"; 
import { UserSettingsBalanceComponent } from "./settings/user-settings-balance/user-settings-balance.component"; 
import { UserSettingsWithdrawalComponent } from "./settings/user-settings-withdrawal/user-settings-withdrawal.component"; 
import { UserSettingsPrivacyComponent } from "./settings/user-settings-privacy/user-settings-privacy.component"; 
import { UserSettingsFitComponent } from "./settings/user-settings-fit/user-settings-fit.component"; 
import { UserSettingsZonesComponent } from "./settings/user-settings-zones/user-settings-zones.component"; 
import { UserSettingsEditZoneComponent } from "./settings/user-settings-edit-zone/user-settings-edit-zone.component"; 
import { UserSettingsNotificationsComponent } from "./settings/user-settings-notifications/user-settings-notifications.component"; 
import { UserSettingsService } from "./settings/user-settings.service"; 
import { AgentService } from "./settings/agent.service"; 
import { userSettingsProfileFilter } from "./settings/user-settings-profile/user-settings-profile.filter"; 
import SyncAdaptorService from "./sync-adaptor.service"; 
import userSettingsConfig from "./settings/user-settings.config";
import { userName, userAvatar, userBackground, userAgeGroup, userIsPremium } from "./user.functions";
import { UserInfoComponent, UserPicComponent, AvatarPicComponent } from "./pic/userpic.component";

export const User = module('staminity.user', [satellizer])
    .service("SyncAdaptorService", SyncAdaptorService)
    .service("UserSettingsService", UserSettingsService)
    .service("AgentService", AgentService)
    .component('stUserSettings', UserSettingsComponent)
    .component('stUserSettingsMenu', UserSettingsMenuComponent)
    .component('stUserSettingsHeader', UserSettingsHeaderComponent)
    .component('stUserSettingsIsCoach', UserSettingsIsCoachComponent)
    .component('stUserSettingsIsAgent', UserSettingsIsAgentComponent)
    .component('stUserSettingsTariffs', UserSettingsTariffsComponent)
    .component('stUserSettingsBills', UserSettingsBillsComponent)
    .component('stUserSettingsDisplay', UserSettingsDisplayComponent)
    .component('stUserSettingsSync', UserSettingsSyncComponent)
    .component('stUserSettingsCalendars', UserSettingsCalendarsComponent)
    .component('stUserSettingsMain', UserSettingsMainComponent)
    .component('stUserSettingsProfile', UserSettingsProfileComponent)
    .component('stUserSettingsCoach', UserSettingsCoachComponent)   
    .component('stUserSettingsAgent', UserSettingsAgentComponent)
    .component('stUserSettingsCards', UserSettingsCardsComponent)
    .component('stUserSettingsSales', UserSettingsSalesComponent)
    .component('stUserSettingsWithdrawal', UserSettingsWithdrawalComponent)
    .component('stUserSettingsBalance', UserSettingsBalanceComponent)
    .component('stUserSettingsPrivacy', UserSettingsPrivacyComponent)
    .component('stUserSettingsFit', UserSettingsFitComponent)
    .component('stUserSettingsZones', UserSettingsZonesComponent)
    .component('stUserSettingsEditZone', UserSettingsEditZoneComponent)
    .component('stUserSettingsNotifications', UserSettingsNotificationsComponent)
    .component('userInfo', UserInfoComponent)
    .component('userpic', UserPicComponent)
    .component('avatarPic', AvatarPicComponent)
    .filter('userSettingsProfileFilter', userSettingsProfileFilter)
    .filter('agentEnvironmentSalesTotal', agentEnvironmentSalesTotal)
    .filter("username", userName)
    .filter("userName", userName)
    .filter("avatar", userAvatar)
    .filter("userBackground", userBackground)
    .filter("ageGroup", userAgeGroup)
    .filter("isPremium", userIsPremium)
    .config(['$stateProvider', ($stateProvider: StateProvider) => {
        userState.map(s => $stateProvider.state(s));
    }])
    .config(['$translateProvider', ($translate) => {
        supportLng.map(lng => $translate.translations(lng, {user: translateUser[lng]}));
    }])
    .config(userSettingsConfig)
    .filter('stUserAvatarUrl', userAvatarUrl)
    .name;