import { module } from 'angular';
import { StateProvider } from "angular-ui-router";
import ManagementComponent from './management.component';
import configure from './management.config';
import { managementStates } from "./management.state";
import { roleMembershipFilter, membersFiltersFilter } from "./management.filters";

const Management = module('staminity.management', ['ngMaterial', 'staminity.share'])
    .filter('clubRoleMembership', roleMembershipFilter)
    .filter('clubMembersFilters', membersFiltersFilter)
    .component('management', ManagementComponent)
    .config(['$stateProvider', ($stateProvider: StateProvider) => managementStates.forEach($stateProvider.state)])
    .config(configure)
    .name;

export default Management;