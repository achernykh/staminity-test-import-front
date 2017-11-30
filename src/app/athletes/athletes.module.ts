import { module } from "angular";
import { StateProvider } from "angular-ui-router";
import AthleteInvitationComponent from "./athlete-invitation/athlete-invitation.component";
import { AthletesService } from "./athletes.service";
import { translateAthleteInvitation } from "./athlete-invitation/athlete-invitation.translate";
import { translateAthletes } from "./athletes.translate";
import { athletesStates } from "./athletes.state";
import AthletesComponent from "./athletes.component";
import { supportLng } from "../core/display.constants";

const Athletes = module("staminity.athletes", ["ngMaterial", "staminity.share"])
    .service('AthletesService', AthletesService)
    .component("athletes", AthletesComponent)
    .component("athleteInvitation", AthleteInvitationComponent)
    .config(['$stateProvider', ($stateProvider: StateProvider) => {
    	athletesStates.forEach($stateProvider.state);
    }])
    .config(['$translateProvider', ($translate) => {
    	supportLng.forEach((lng) => {
    		$translate.translations(lng, { "athletes": translateAthletes[lng] });
    		$translate.translations(lng, { "athlete-invitation": translateAthleteInvitation[lng] });
    	});
    }])
    .name;

export default Athletes;
