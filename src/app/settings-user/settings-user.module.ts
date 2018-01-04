import { module } from "angular";
import satellizer from "satellizer";
import SettingsNotificationComponent from "./settings-notification/settings-notification.component";
import SettingsUserComponent from "./settings-user.component.js";
import configure from "./settings-user.config";
import SettingsZonesEditComponent from "./settings-zones-edit/settings-zones-edit.component";
import SettingsZonesComponent from "./settings-zones/settings-zones.component";

const SettingsUser = module("staminity.settings-user", [satellizer])
    .component("settingsUserPersonal", {template: require("./articles/settings.personal.html") as string})
    .component("settingsUser", SettingsUserComponent)
    .component("settingsZones", SettingsZonesComponent)
    .component("settingsZonesEdit", SettingsZonesEditComponent)
    .component("settingsNotification", SettingsNotificationComponent)
    .config(configure)
    .name;

export default SettingsUser;
