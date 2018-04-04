import { module } from "angular";
import { StateProvider } from "angular-ui-router";
import { supportLng } from "../core/display.constants";
import ManagementComponent from "./management.component";
import { membersFiltersFilter, roleMembershipFilter } from "./management.filters";
import { ManagementService } from "./management.service";
import { managementStates } from "./management.state";
import { translateManagement } from "./management.translate";

const Management = module("staminity.management", ["ngMaterial", "staminity.share"])
    .service("ManagementService", ManagementService)
    .filter("clubRoleMembership", roleMembershipFilter)
    .filter("clubMembersFilters", membersFiltersFilter)
    .component("stManagement", ManagementComponent)
    .config(["$stateProvider", ($stateProvider: StateProvider) => {
        managementStates.forEach($stateProvider.state);
    }])
    .config(["$translateProvider", ($translate) => {
        supportLng.forEach((lng) => $translate.translations(lng, { users: translateManagement[lng] }));
    }])
    .name;

export default Management;
