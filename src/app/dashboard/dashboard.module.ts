import {module} from "angular";
import DashboardActivityComponent from "./activity/dashboard-activity.component";
import DashboardAthleteComponent from "./athlete/dashboard-athlete.component";
import DashboardComponent from "./dashboard.component";
import configure from "./dashboard.config";
import DashboardDayComponent from "./day/dashboard-day.component";
import DashboardEventComponent from "./event/dashboard-event.component";
import DashboardTotalComponent from "./total/dashboard-total.component";

const Dashboard = module("staminity.dashboard", [])
    .component("dashboard", DashboardComponent)
    .component("dashboardActivity", DashboardActivityComponent)
    .component("dashboardEvent", DashboardEventComponent)
    .component("dashboardDay", DashboardDayComponent)
    .component("dashboardAthlete", DashboardAthleteComponent)
    .component("dashboardTotal", DashboardTotalComponent)
    .config(configure)
    .name;

export default Dashboard;
