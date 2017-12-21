import { module } from "angular";
import ProfileComponent from "./profile-user.component.js";
import configure from "./profile-user.config";
import SummaryStatisticsComponent from "./summary-statistics.component";

const Profile = module("staminity.profile", [])
    .component("user", ProfileComponent)
    .component("summaryStatistics", SummaryStatisticsComponent)
    .config(configure)
    .name;

export default Profile;
