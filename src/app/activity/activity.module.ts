import { module } from 'angular';
import ActivityService from './activity.service';
//import configure from './auth.config';

const Auth = module('staminity.activity', [])
    .service('ActivityService', ActivityService)
    //.config(configure)
    .name;

export default Auth;