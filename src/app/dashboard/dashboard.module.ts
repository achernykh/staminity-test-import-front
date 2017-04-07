import {module} from 'angular';
import configure from './dashboard.config';
import DashboardComponent from "./dashboard.component";
import DashboardActivityComponent from "./activity/dashboard-activity.component";
import DashboardDayComponent from "./day/dashboard-day.component";
import DashboardAthleteComponent from "./athlete/dashboard-athlete.component";

const Dashboard = module('staminity.dashboard', [])
    .component('dashboard', DashboardComponent)
    .component('dashboardActivity', DashboardActivityComponent)
    .component('dashboardDay', DashboardDayComponent)
    .component('dashboardAthlete', DashboardAthleteComponent)
    .config(configure)
    .name;


export default Dashboard;