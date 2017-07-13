import {module} from 'angular';
import configure from './analytics.config';
import AnalyticsComponent from "./analytics.component";

const Analytics = module('staminity.dashboard', [])
    .component('analytics', AnalyticsComponent)
    .config(configure)
    .name;


export default Analytics;