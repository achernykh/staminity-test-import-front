import {module} from 'angular';
import configure from './dashboard.config';
import DashboardComponent from "./dashboard.component";

const Dashboard = module('staminity.dashboard', [])
    .component('dashboard', DashboardComponent)
    .config(configure)
    .name;


export default Dashboard;