import { module } from 'angular';
import { StateProvider } from "angular-ui-router";
import { ManagementService } from "./management.service";
import ManagementComponent from './management.component';
import { supportLng } from "../core/display.constants";
import { translateManagement } from './management.translate';
import { managementStates } from "./management.state";
import { roleMembershipFilter, membersFiltersFilter } from "./management.filters";

const Management = module('staminity.management', ['ngMaterial', 'staminity.share'])
    .service('ManagementService', ManagementService)
    .filter('clubRoleMembership', roleMembershipFilter)
    .filter('clubMembersFilters', membersFiltersFilter)
    .component('management', ManagementComponent)
    .config(['$stateProvider', ($stateProvider: StateProvider) => {
    	managementStates.forEach($stateProvider.state);
    }])
    .config(['$translateProvider', ($translate) => {
    	supportLng.forEach((lng) => $translate.translations(lng, { users: translateManagement[lng] }));
    }])
    .name;

export default Management;