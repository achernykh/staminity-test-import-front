import { module } from 'angular';
import SettingsClubComponent from './settings-club.component.js';
import configure from './settings-club.config';

const SettingsClub = module('staminity.settings-club', [])
    .component('settingsClub', SettingsClubComponent)
    .config(configure)
    .name;

export default SettingsClub;