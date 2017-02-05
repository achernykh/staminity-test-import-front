import { module } from 'angular';
import ProfileComponent from './profile-user.component.js';
import SummaryStatisticsComponent from './summary-statistics.component';
import configure from './profile-user.config';

const Profile = module('staminity.profile', [])
    .component('user', ProfileComponent)
    .component('summaryStatistics', SummaryStatisticsComponent)
    .config(configure)
    .name;

export default Profile;