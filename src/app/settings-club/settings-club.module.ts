import { module } from "angular";
import SettingsClubComponent from "./settings-club.component.js";
import configure from "./settings-club.config";

const SettingsClub = module("staminity.settings-club", [])
    .component("settingsClub", SettingsClubComponent)
    .config(configure)
    .run(["$templateCache", ($templateCache) => {
        $templateCache.put("clubSettings.public.html", require("./articles/clubSettings.public.html") as string);
    }])
    .name;

export default SettingsClub;