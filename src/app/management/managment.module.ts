import { module } from 'angular';
import ManagementComponent from './management.component';
import configure from './management.config';

const roleMembership = ($translate) => (roleMemberships) => {
    roleMemberships = ['ClubManagement', 'ClubCoaches', 'ClubAthletes'].filter((m) => roleMemberships.indexOf(m) !== -1);

    if (!roleMemberships || !roleMemberships.length) {
        return;
    } else if (roleMemberships.length === 1) {
        return $translate.instant('users.clubRoles.' + roleMemberships[0]);
    } else if (roleMemberships.length > 1) {
        return `${$translate.instant('users.clubRoles.' + roleMemberships[0])}, +${roleMemberships.length - 1}`;
    } 
};

roleMembership.$inject = ['$translate'];

const Management = module('staminity.management', ['ngMaterial', 'staminity.share'])
    .component('management', ManagementComponent)
    .filter('clubRoleMembership', roleMembership)
    .config(configure)
    .name;

export default Management;