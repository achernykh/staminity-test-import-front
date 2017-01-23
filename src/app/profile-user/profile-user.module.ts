import { module } from 'angular';
import ProfileComponent from './profile-user.component.js';
import configure from './profile-user.config';

const Profile = module('staminity.profile', [])
    .component('user', ProfileComponent)
    .config(configure)
    .name;

export default Profile;